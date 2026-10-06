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

// Feed 1 (agreePage): complement of the target post + a randomly chosen side of every other topic.
// Feed 2 (respondPage): the target post (placed in the top 3) + the opposite side of every other topic.
// Each feed also gets one AI aux post (idx 0 or 2) and one vaccine aux post (idx 4 or 6).
export function buildFeeds(ratings: number[], disagreePostIdx: number) {
    const disagreeTopic = Math.floor(disagreePostIdx / 2);
    let agreePage = [{ "type": "opinion", "idx": disagreePostIdx ^ 1 }];
    let respondPage: { type: string; idx: number }[] = [];

    for (let t = 0; t < ratings.length; t++) {
        if (t === disagreeTopic) continue;
        const page1Idx = t*2 + (Math.random() < 0.5 ? 0 : 1);
        agreePage.push({ "type": "opinion", "idx": page1Idx });
        respondPage.push({ "type": "opinion", "idx": page1Idx ^ 1 });
    }

    const aiAuxIdxs = shuffleArray([0, 2]);
    const vaccineAuxIdxs = shuffleArray([4, 6]);
    agreePage.push({ "type": "aux", "idx": aiAuxIdxs[0] }, { "type": "aux", "idx": vaccineAuxIdxs[0] });
    respondPage.push({ "type": "aux", "idx": aiAuxIdxs[1] }, { "type": "aux", "idx": vaccineAuxIdxs[1] });

    agreePage = shuffleArray(agreePage);
    respondPage = shuffleArray(respondPage);
    // Keep the target post within the top 3 so participants can find it without scrolling
    respondPage.splice(Math.floor(Math.random() * 3), 0, { "type": "opinion", "idx": disagreePostIdx });

    return { agreePage, respondPage };
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

    // const auxPostIdx1 = Math.floor(Math.random() * 4);
    // const auxPostIdx2 = Math.floor(Math.random() * 4);
    // let _posts = ["ai", "vaccine", "disagree"];
    // _posts = shuffleArray(_posts);

    // const argumentation_types = ["control", "persuasion", "negotiation", "deliberation", "inquiry", "information_seeking", "eristic", "discovery"];
    // const randArgumentationIdx = Math.floor(Math.random() * argumentation_types.length);
    // const argumentationType = argumentation_types[randArgumentationIdx];

    const { agreePage, respondPage } = buildFeeds(ratings, disagreePostIdx);

    const postVotes = new Array(ratings.length*2 + 8).fill(0);
    const postComments: any = {}
    for (let i = 0; i < (ratings.length * 2 + 8); i++) {
        postComments[`${i}`] = []
    }

    await updateDoc(docRef, {
        hasCompletedInitialRatings: true,
        initialRatings: ratings,
        disagreePostIdx: disagreePostIdx,
        agreePage: agreePage,
        respondPage: respondPage,
        postVotes: postVotes,
        postComments: postComments,
        initialResponse: '',
        revisedResponse: '',
        comment: '',
        conversation: [],
        finishedModeration: false,
        clickedEditInitialReply: false,
        hasUpvoted: null,
        msToPage2: 30000,
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

export async function updateClickedEditInitialReply(userId: string, clicked: boolean) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        clickedEditInitialReply: clicked,
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
