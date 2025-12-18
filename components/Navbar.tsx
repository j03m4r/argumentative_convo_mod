// components/Navbar.tsx
"use client";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/firebase/firestore";
import { UserData } from "@/types/user";

export default function Navbar() {
    const pathname = usePathname();
    const { userId } = useUser();
    const [hasUserData, setHasUserData] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            if (!userId) {
                setHasUserData(false);
                return;
            }

            try {
                const userData = await getUserData(userId) as UserData | null;

                if (!userData || !userData.initialRatings) {
                    setHasUserData(false);
                    return;
                }

                setHasUserData(true);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setHasUserData(false);
            }
        }

        fetchUserData();
    }, [userId, pathname]);
    
    return (
        <nav className="fixed top-0 left-0 w-20 h-screen border-r border-black flex flex-col items-center pt-4 bg-cream">
            <Image 
                src='/images/minimal_y_logo.png' 
                width={100} 
                height={100} 
                alt="Y Logo"
                className="w-full h-auto"
            />
            {hasUserData&&(
                <div className="flex flex-col h-full mt-4 border-t border-black w-full items-center">
                    <NavItem active={pathname === "/"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640" className="fill-current">
                            <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
                        </svg>
                    </NavItem>
                    
                    <NavItem active={pathname === "/notifications"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640" className="fill-current">
                            <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z"/>
                        </svg>
                    </NavItem>
                    
                    <NavItem active={pathname === "/community"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640" className="fill-current">
                            <path d="M320 80C377.4 80 424 126.6 424 184C424 241.4 377.4 288 320 288C262.6 288 216 241.4 216 184C216 126.6 262.6 80 320 80zM96 152C135.8 152 168 184.2 168 224C168 263.8 135.8 296 96 296C56.2 296 24 263.8 24 224C24 184.2 56.2 152 96 152zM0 480C0 409.3 57.3 352 128 352C140.8 352 153.2 353.9 164.9 357.4C132 394.2 112 442.8 112 496L112 512C112 523.4 114.4 534.2 118.7 544L32 544C14.3 544 0 529.7 0 512L0 480zM521.3 544C525.6 534.2 528 523.4 528 512L528 496C528 442.8 508 394.2 475.1 357.4C486.8 353.9 499.2 352 512 352C582.7 352 640 409.3 640 480L640 512C640 529.7 625.7 544 608 544L521.3 544zM472 224C472 184.2 504.2 152 544 152C583.8 152 616 184.2 616 224C616 263.8 583.8 296 544 296C504.2 296 472 263.8 472 224zM160 496C160 407.6 231.6 336 320 336C408.4 336 480 407.6 480 496L480 512C480 529.7 465.7 544 448 544L192 544C174.3 544 160 529.7 160 512L160 496z"/>
                        </svg>
                    </NavItem>
                    
                    <NavItem active={pathname === "/profile"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640" className="fill-current">
                            <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
                        </svg>
                    </NavItem>

                    <div className="mt-auto w-full flex p-4 justify-center items-center border-t border-black cursor-not-allowed transition-colors duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z"/></svg>
                    </div>
                </div>
            )}
        </nav>
    )
}

// NavItem component with hover effect
function NavItem({ 
    active, 
    children 
}: { 
    active: boolean; 
    children: React.ReactNode;
}) {
    return (
        <div
            className={`w-full flex p-4 justify-center items-center border-b border-black cursor-not-allowed transition-colors duration-200 ease-in-out
                ${active ? 'text-blood-orange' : 'text-black'}`}
        >
            {children}
        </div>
    );
}
