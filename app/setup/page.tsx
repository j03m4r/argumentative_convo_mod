"use client"
import { useState } from "react"
import ProfilePhase from "./components/ProfilePhase";
import RatingPhase from "./components/RatingPhase";
import { submitInitialRatings } from "@/lib/firebase/firestore";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

enum PHASE {
    PROFILE_PHASE = 0,
    RATING_PHASE = 1
}

const header_text = [
    {
        header: "Your profile!",
        subheader: "We're assigning you this anonymous profile"
    },
    {
        header: "Your preferences!",
        subheader: "Help us personalize your feed by rating these opinions"
    }
]

export default function SetupPage() {
    const [phase, setPhase] = useState<PHASE>(PHASE.PROFILE_PHASE);
    const [ratings, setRatings] = useState<number[]>([-1,-1,-1,-1,-1]);
    const user = useUser();
    const router = useRouter();
    
    const handlePrevClick = () => {
        if (phase === PHASE.RATING_PHASE) {
            setPhase(PHASE.PROFILE_PHASE);
        }
    }
    
    const handleNextClick = async () => {
        if (phase === PHASE.PROFILE_PHASE) {
            setPhase(PHASE.RATING_PHASE);
        } else {
            if (user.userId) {
                await submitInitialRatings(user.userId, [...ratings]);
                router.push("/")
            } else {
                // fail somehow
            }
        }
    }
    
    const handleRatingsUpdate = (_ratings: number[]) => {
        setRatings(_ratings);
    }
    
    return (
        <main className="flex flex-col w-full h-screen">
            <div className="flex flex-col gap-y-4 pt-8 px-16">
                <h1 className="text-4xl font-bold text-blood-orange">
                    Let&apos;s get you setup • {header_text[phase].header}
                </h1>
                <h2 className="text-xl">
                    {header_text[phase].subheader}
                </h2>
            </div> 
            {
                phase == PHASE.PROFILE_PHASE ? (
                    <ProfilePhase />
                ) : (
                    <RatingPhase handleRatingsUpdate={handleRatingsUpdate} ratings={ratings} />
                )
            }
            <div className="w-full flex">
                <button 
                    onClick={handlePrevClick} 
                    disabled={phase === PHASE.PROFILE_PHASE} 
                    className="bg-cream disabled:cursor-not-allowed disabled:hover:border-black disabled:hover:bg-cream disabled:hover:text-black disabled:opacity-25 text-lg cursor-pointer w-full py-16 border-t border-r border-black hover:bg-blood-orange hover:border-blood-orange hover:text-cream transition-all ease-in-out duration-200"
                >
                    Prev
                </button>
                <button 
                    onClick={handleNextClick} 
                    disabled={phase === PHASE.RATING_PHASE && ratings.indexOf(-1) !== -1} 
                    className="bg-cream disabled:cursor-not-allowed disabled:hover:border-black disabled:hover:bg-cream disabled:hover:text-black disabled:opacity-25 text-lg cursor-pointer w-full py-16 border-t border-r border-black hover:bg-blood-orange hover:border-blood-orange hover:text-cream transition-all ease-in-out duration-200"
                >
                    {phase === PHASE.RATING_PHASE ? "Finish" : "Next"}
                </button>
            </div>
        </main>
    );
}
