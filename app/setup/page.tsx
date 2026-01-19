"use client"
import { useState } from "react"
import ProfilePhase from "./components/ProfilePhase";
import RatingPhase from "./components/RatingPhase";
import { submitInitialRatings } from "@/lib/firebase/firestore";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

enum PHASE {
    INTRO_PHASE = 0,
    PROFILE_PHASE = 1,
    RATING_PHASE = 2
}

const header_text = [
    {
        header: "Welcome!",
        subheader: "We're excited for you to try out our AI-powered discussion platform. Part of our goal for these user tests is for you to interact with and experience novel social media features involving discussions to help us get a sense of their usability. In your interactions with our interface, you will (1) specify your content preferences, (2) respond to a post on your home feed, (3) engage with an AI-powered chatbot. Note that many features will be unavailable as this is just a beta testing of the platform."
    },
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
    const [phase, setPhase] = useState<PHASE>(PHASE.INTRO_PHASE);
    const [ratings, setRatings] = useState<number[]>([-1, -1, -1, -1, -1]);
    const user = useUser();
    const router = useRouter();

    const handlePrevClick = () => {
        if (phase !== PHASE.INTRO_PHASE) {
            setPhase((prev) => prev === PHASE.RATING_PHASE ? PHASE.PROFILE_PHASE : PHASE.INTRO_PHASE);
        }
    }

    const handleNextClick = async () => {
        if (phase !== PHASE.RATING_PHASE) {
            setPhase((prev) => prev === PHASE.INTRO_PHASE ? PHASE.PROFILE_PHASE : PHASE.RATING_PHASE);
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
                <h2 className="text-2xl">
                    {phase === PHASE.INTRO_PHASE ? (
                        <div>
                            We're excited for you to try out our AI-powered discussion platform. Part of our goal for these user tests is for you to interact with and experience novel social media features involving discussions to help us get a sense of their usability. 
                            In your interactions with our interface, you will:
                            <ol className="p-4">
                                <li>1. Specify your content preferences</li>
                                <li>2. Respond to a post on your home feed</li>
                                <li>3. Engage with an AI-powered chatbot</li>
                            </ol> 
                            <b>Note that many features will be unavailable/unclickable during this test</b>
                        </div>
                    ) : (header_text[phase].subheader)}
                </h2>
            </div>
            {
                phase === PHASE.INTRO_PHASE ? (
                    <div className="flex flex-col gap-y-4 w-full h-full justify-center items-center">
                        <Image
                            src='/images/minimal_y_logo.png'
                            width={200}
                            height={200}
                            alt="Y Logo"
                            className=""
                        />
                    </div>
                ) : phase === PHASE.PROFILE_PHASE ? (
                    <ProfilePhase />
                ) : (
                    <RatingPhase handleRatingsUpdate={handleRatingsUpdate} ratings={ratings} />
                )
            }
            <div className="w-full flex">
                <button
                    onClick={handlePrevClick}
                    disabled={phase === PHASE.INTRO_PHASE}
                    className="bg-cream disabled:cursor-not-allowed font-semibold disabled:hover:border-black disabled:hover:bg-cream disabled:hover:text-black disabled:opacity-25 text-lg cursor-pointer w-full py-16 border-t border-black hover:bg-blood-orange hover:border-blood-orange hover:text-cream transition-all ease-in-out duration-200 border-x"
                >
                    Prev
                </button>
                <button
                    onClick={handleNextClick}
                    disabled={phase === PHASE.RATING_PHASE && ratings.indexOf(-1) !== -1}
                    className="bg-cream disabled:cursor-not-allowed font-semibold disabled:hover:border-black disabled:hover:bg-cream disabled:hover:text-black disabled:opacity-25 text-lg cursor-pointer w-full py-16 border-t border-r border-black hover:bg-blood-orange hover:border-blood-orange hover:text-cream transition-all ease-in-out duration-200"
                >
                    {phase === PHASE.RATING_PHASE ? "Finish" : "Next"}
                </button>
            </div>
        </main>
    );
}
