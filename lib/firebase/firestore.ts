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
    }

    const auxPostIdx1 = Math.floor(Math.random() * 4); 
    const auxPostIdx2 = Math.floor(Math.random() * 4); 
    let _posts = ["ai", "vaccine", "disagree"];
    _posts = shuffleArray(_posts);

    const argumentation_types = ["control", "persuasion", "negotiation", "deliberation", "inquiry", "information_seeking", "eristic", "discovery"];
    const randArgumentationIdx = Math.floor(Math.random() * argumentation_types.length);
    const argumentationType = argumentation_types[randArgumentationIdx];

    await setDoc(docRef, {
        hasCompletedInitialRatings: true,
        initialRatings: ratings,
        disagreePostIdx: disagreePostIdx,
        auxPostIdx1: auxPostIdx1,
        auxPostIdx2: auxPostIdx2,
        randomPostOrder: _posts,
        initialResponse: '',
        revisedResponse: '',
        comment: '',
        conversation: [],
        finishedModeration: false,
        hasUpvoted: null,
        argumentationType: argumentationType,
        createdAt: Timestamp.now(),
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

export async function updateUpVoteStatus(userId: string, hasUpvoted: boolean|null) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        hasUpvoted: hasUpvoted,
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
