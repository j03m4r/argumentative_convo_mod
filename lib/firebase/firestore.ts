// Firestore structure:
// users/{userId}
//   - hasCompletedInitialRatings: boolean
//   - initialRatings: number[]
//   - initialResponse: string
//   - revisedResponse: string
//   - conversation: string[]
//   - createdAt: timestamp
//   - updatedAt: timestamp

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

export async function addConversationMessages(userId: string, messages: string[]) {
    const docRef = doc(db, 'users', userId);

    await updateDoc(docRef, {
        conversation: messages,
        updatedAt: Timestamp.now(),
    });
}

export async function getUserData(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
}
