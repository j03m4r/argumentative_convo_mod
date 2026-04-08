'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged, User, UserCredential } from 'firebase/auth';
import { app } from '@/lib/firebase/firebase';
import { setUserArgumentationType } from '@/lib/firebase/firestore';
import { useSearchParams } from 'next/navigation';

interface UserContextType {
    user: User | null;
    userId: string | null;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    userId: null,
    isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const auth = getAuth(app);
        let creds: UserCredential | null = null;

        // Sign in anonymously if no user and wait 5 seconds if there is a user
        const initAuth = async () => {
            if (!auth.currentUser) {
                creds = await signInAnonymously(auth);
                if (creds) {
                    const id = creds.user.uid;
                    const urlArgumentationType = searchParams.get('cond');
                    if (urlArgumentationType) {
                        await setUserArgumentationType(id, urlArgumentationType);
                    } else {
                        await setUserArgumentationType(id, 'control');
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, userId: user?.uid || null, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
