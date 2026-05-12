// lib/firebase/firestore.ts
'use client';

import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function setUserArgumentationType(userId: string, argumentationType: string) {
    const docRef = doc(db, 'users', userId);
    const existing = await getDoc(docRef);

    if (existing.exists()) return;

    await setDoc(docRef, {
        argumentationType: argumentationType,
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
    });
}

export async function checkUserHasRatings(userId: string): Promise<boolean> {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() && userDoc.data()?.hasCompletedInitialRatings === true;
    } catch (error) {
        console.error('Error checking user ratings:', error);
        return false;
    }
}

export async function submitInitialRatings(userId: string, ratings: number[]) {
    const docRef = doc(db, 'users', userId);
    const polarizedPosts: number[] = [];
    let disagreePostIdx = -1;
    const usedAux = new Set();
    const usedOpinionIdxs = new Set();

    for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i];
        if (rating === 1 || rating === 4) {
            polarizedPosts.push(i);
        }
    }

    if (polarizedPosts.length > 0) {
        disagreePostIdx = polarizedPosts[Math.floor(Math.random() * polarizedPosts.length)];
        if (ratings[disagreePostIdx] === 1) {
            disagreePostIdx *= 2
        } else {
            disagreePostIdx = (disagreePostIdx*2) + 1
        }
    } else {
        disagreePostIdx = Math.floor(Math.random() * ratings.length);
        disagreePostIdx = disagreePostIdx*2 + (ratings[disagreePostIdx] <= 2 ? 0 : 1);
    }

    usedOpinionIdxs.add(disagreePostIdx);

    // const auxPostIdx1 = Math.floor(Math.random() * 4);
    // const auxPostIdx2 = Math.floor(Math.random() * 4);
    // let _posts = ["ai", "vaccine", "disagree"];
    // _posts = shuffleArray(_posts);

    // const argumentation_types = ["control", "persuasion", "negotiation", "deliberation", "inquiry", "information_seeking", "eristic", "discovery"];
    // const randArgumentationIdx = Math.floor(Math.random() * argumentation_types.length);
    // const argumentationType = argumentation_types[randArgumentationIdx];

    let disagreePage = [];
    let randAuxPostIdx = Math.floor(Math.random() * 4)*2;
    usedAux.add(randAuxPostIdx);
    disagreePage.push({ "type": "aux", "idx": randAuxPostIdx });

    let agreePage = [];
    let respondPage = [];
    
    let randOpinionIdx = null;
    while (disagreePage.length < 3) {
        randOpinionIdx = Math.floor(Math.random() * ratings.length);
        if (ratings[randOpinionIdx] <= 2) {
            randOpinionIdx *= 2;
        } else {
            randOpinionIdx = (randOpinionIdx*2) + 1;
        }

        if (!usedOpinionIdxs.has(randOpinionIdx)) {
            disagreePage.push({ "type": "opinion", "idx": randOpinionIdx });
            usedOpinionIdxs.add(randOpinionIdx);
        }
    }

    randAuxPostIdx = Math.floor(Math.random() * 4)*2;
    while (usedAux.has(randAuxPostIdx)) {
        randAuxPostIdx = Math.floor(Math.random() * 4)*2;
    }
    usedAux.add(randAuxPostIdx);
    agreePage.push({ "type": "aux", "idx": randAuxPostIdx });
    
    while (agreePage.length < 3) {
        randOpinionIdx = Math.floor(Math.random() * ratings.length);
        if (ratings[randOpinionIdx] <= 2) {
            randOpinionIdx = (randOpinionIdx*2) + 1;
        } else {
            randOpinionIdx *= 2;
        }

        if (!usedOpinionIdxs.has(randOpinionIdx)) {
            agreePage.push({ "type": "opinion", "idx": randOpinionIdx });
            usedOpinionIdxs.add(randOpinionIdx);
        }
    }

    randAuxPostIdx = Math.floor(Math.random() * 4)*2;
    while (usedAux.has(randAuxPostIdx)) {
        randAuxPostIdx = Math.floor(Math.random() * 4)*2;
    }
    usedAux.add(randAuxPostIdx);
    respondPage.push({ "type": "aux", "idx": randAuxPostIdx });
    
    while (respondPage.length < 2) {
        randOpinionIdx = Math.floor(Math.random() * ratings.length);
        randOpinionIdx = (randOpinionIdx*2) + Math.floor(Math.random() * 2);

        if (!usedOpinionIdxs.has(randOpinionIdx)) {
            respondPage.push({ "type": "opinion", "idx": randOpinionIdx });
            usedOpinionIdxs.add(randOpinionIdx);
        }
    }

    respondPage.push({ "type": "opinion", "idx": disagreePostIdx });

    disagreePage = shuffleArray(disagreePage);
    agreePage = shuffleArray(agreePage);
    respondPage = shuffleArray(respondPage);

    const postVotes = new Array(ratings.length*2 + 8).fill(0);
    const postComments: any = {}
    for (let i = 0; i < (ratings.length * 2 + 8); i++) {
        postComments[`${i}`] = []
    }

    await updateDoc(docRef, {
        hasCompletedInitialRatings: true,
        initialRatings: ratings,
        disagreePostIdx: disagreePostIdx,
        disagreePage: disagreePage,
        agreePage: agreePage,
        respondPage: respondPage,
        postVotes: postVotes,
        postComments: postComments,
        initialResponse: '',
        revisedResponse: '',
        comment: '',
        conversation: [],
        finishedModeration: false,
        hasUpvoted: null,
        msToPage2: 30000,
        msToPage3: 30000,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function updatePostVotes(userId: string, postIdx: number, newVoteVal: number) {
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
        console.error('User document does not exist');
        return;
    }

    const userData = userDoc.data();
    const postVotes = userData.postVotes || [];
    const currentVoteVal = postVotes[postIdx] || 0;

    // If the user is trying to cast the same vote again, we interpret it as a vote removal
    const updatedVoteVal = currentVoteVal === newVoteVal ? 0 : newVoteVal;
    postVotes[postIdx] = updatedVoteVal;

    await updateDoc(docRef, {
        postVotes: postVotes,
        updatedAt: Timestamp.now(),
    });
}

export async function updatePostComments(userId: string, postIdx: number, newComment: string) {
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);

    if (!userDoc.exists()) {
        console.error('User document does not exist');
        return;
    }

    const userData = userDoc.data();
    const postComments = userData.postComments || [];
    const currentCommentVal = postComments[`${postIdx}`] || [];

    const updatedCommentVal = [...currentCommentVal, newComment];
    postComments[`${postIdx}`] = updatedCommentVal;

    await updateDoc(docRef, {
        postComments: postComments,
        updatedAt: Timestamp.now(),
    }); 
}

export async function updateInitialResponse(userId: string, response: string) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        initialResponse: response,
        updatedAt: Timestamp.now(),
    });
}

export async function updateRevisedResponse(userId: string, response: string) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        revisedResponse: response,
        updatedAt: Timestamp.now(),
    });
}

export async function updateComment(userId: string, comment: string) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        comment: comment,
        updatedAt: Timestamp.now(),
    });
}

export async function updateFinishedModerationStatus(userId: string, finishedModeration: boolean) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        finishedModeration: finishedModeration,
        updatedAt: Timestamp.now(),
    });
}

export async function addConversationMessage(userId: string, message: { role: string; content: string; timestamp: Date }) {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
        conversation: arrayUnion({
            role: message.role,
            content: message.content,
            timestamp: Timestamp.fromDate(message.timestamp)
        }),
        updatedAt: Timestamp.now(),
    });
}

export async function addConversationMessages(userId: string, messages: { role: string; content: string; timestamp: Date }[]) {
    const docRef = doc(db, 'users', userId);
    const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: Timestamp.fromDate(msg.timestamp)
    }));
    
    await updateDoc(docRef, {
        conversation: formattedMessages,
        updatedAt: Timestamp.now(),
    });
}

export async function getUserData(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
}

export async function setPage2StartedAt(userId: string) {
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);
    if (userDoc.data()?.page2StartedAt) return; // only set once, ever
    await updateDoc(docRef, {
        page2StartedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}

export async function setPage3StartedAt(userId: string) {
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);
    if (userDoc.data()?.page3StartedAt) return;
    await updateDoc(docRef, {
        page3StartedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });
}