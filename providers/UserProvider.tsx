'use client';
import { createContext, useContext, useEffect, useState, Suspense } from 'react';
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

function AuthInitializer({ setIsLoading }: { setIsLoading: (v: boolean) => void }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const auth = getAuth(app);

        const initAuth = async () => {
            if (!auth.currentUser) {
                const creds: UserCredential = await signInAnonymously(auth);
                const id = creds.user.uid;
                const urlArgumentationType = searchParams.get('cond');
                await setUserArgumentationType(id, urlArgumentationType ?? 'control');
            }
            setIsLoading(false);
        };

        initAuth();
    }, [searchParams, setIsLoading]);

    return null;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, userId: user?.uid || null, isLoading }}>
            <Suspense fallback={null}>
                <AuthInitializer setIsLoading={setIsLoading} />
            </Suspense>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);