// lib/firebase/firestore.ts
'use client';

import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';

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

    // TODO :: fix this issue with polarized/disagree post
    if (polarizedPosts.length > 0) {
        disagreePostIdx = polarizedPosts[Math.floor(Math.random() * polarizedPosts.length)];
    }

    await setDoc(docRef, {
        hasCompletedInitialRatings: true,
        initialRatings: ratings,
        disagreePostIdx: disagreePostIdx,
        auxPostIdx1: Math.floor(Math.random() * 4),
        auxPostIdx2: Math.floor(Math.random() * 4),
        initialResponse: '',
        revisedResponse: '',
        conversation: [],
        finishedModeration: false,
        hasUpvoted: null,
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
