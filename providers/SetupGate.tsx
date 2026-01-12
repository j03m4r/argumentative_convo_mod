'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/providers/UserProvider';
import { checkUserHasRatings } from '@/lib/firebase/firestore';
import { OrbitProgress } from 'react-loading-indicators';

export default function SetupGate({ children }: { children: React.ReactNode }) {
    const { userId, isLoading: isAuthLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        async function checkSetup() {
            if (isAuthLoading || !userId) return;

            // Don't redirect if already on the cold-start page
            if (pathname === '/setup') {
                setIsChecking(false);
                return;
            }

            const hasRatings = await checkUserHasRatings(userId);

            if (!hasRatings) {
                router.push('/setup');
            }

            setIsChecking(false);
        }

        checkSetup();
    }, [userId, isAuthLoading, pathname, router]);

    // Show loading state while checking
    if (isAuthLoading || isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <OrbitProgress color="#ff3f34" size="medium" text="" textColor="" />
            </div>
        );
    }

    return <>{children}</>;
}
