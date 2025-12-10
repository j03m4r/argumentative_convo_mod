"use client";
import { palestine_posts, Post as P, posts, vaccine_posts } from "@/lib/experiment_materials/posts";
import { addConversationMessages, getUserData, updateInitialResponse } from "@/lib/firebase/firestore";
import { useUser } from "@/providers/UserProvider";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import Post from "./components/Post";
import ChatInterface from "./components/ChatInterface";
import { persuasion_prompt } from "@/lib/experiment_materials/prompts";

export default function HomePage() {
    const [disagreePost, setDisagreePost] = useState<P | null>(null);
    const [palestinePost, setPalestinePost] = useState<P | null>(null);
    const [vaccinePost, setVaccinePost] = useState<P | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingModeration, setIsLoadingModeration] = useState(false);
    const { userId } = useUser();

    const [isModeration, setIsModeration] = useState(false);
    const [initialReply, setInitialReply] = useState<string>("");
    const prompt = persuasion_prompt;

    const handleReply = (reply: string) => {
        if (initialReply===""&&userId) {
            updateInitialResponse(userId, reply)
            setInitialReply(reply)
            setIsLoadingModeration(true);
            setTimeout(function() {
                setIsModeration(true);
                setIsLoadingModeration(false);
            }, 2000);
        }
    }

    const handleFinishModeration = (messages: string[]) => {
        setIsModeration(false);
        if (userId) {
            addConversationMessages(userId, messages.splice(1, messages.length));
        }
    }

    useEffect(() => {
        async function fetchPosts() {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await getUserData(userId) as UserData | null;

                if (!userData || !userData.initialRatings) {
                    console.error("User data not found or incomplete");
                    setIsLoading(false);
                    return;
                }

                setDisagreePost(posts[userData.disagreePostIdx]);

                // Set auxiliary posts
                setPalestinePost(palestine_posts[userData.auxPostIdx1]);
                setVaccinePost(vaccine_posts[userData.auxPostIdx2]);

                // setTimeout(function() {
                //     setIsLoading(false);
                // }, 5000);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, [userId]);

    if (isLoading) {
        return (
            <main className="flex w-full h-screen items-center justify-center">
                <OrbitProgress color="#ff3f34" size="medium" text="" textColor="" />
            </main>
        );
    }

    return (
        <main className="flex w-full h-screen max-h-screen">
            <div className="flex flex-col h-full w-full">
                <div className="flex w-full justify-between items-center h-fit border-b border-black">
                    <div className="flex items-center gap-y-1 ">
                        <h2 className="py-2 px-4 font-bold hover:underline cursor-pointer border-r border-black">For you</h2>
                        <h2 className="py-2 px-4 font-light hover:underline cursor-pointer border-r border-black">Following</h2>
                    </div>
                    <div className="px-4 py-2 border-l border-black cursor-pointer hover:text-blood-orange transition-all duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>
                    </div>
                </div>
                <div className="flex flex-col h-full w-full overflow-y-scroll">
                    {palestinePost && (
                        <Post post={palestinePost} />
                    )}
                    {vaccinePost && (
                        <Post post={vaccinePost} />
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center h-screen w-full border-x border-black shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.1)]">
                {isModeration ? (
                    <ChatInterface 
                        userPfp="/images/avatar_mosaic.png" 
                        initialSystemPrompt={prompt}
                        post={disagreePost}
                        initialReply={initialReply}
                        handleFinishModeration={handleFinishModeration}
                    />
                ) :
                    disagreePost && (
                        <>
                            <div className="flex justify-between items-center w-full mb-2">
                                <div className="border-r border-black px-4 py-2 border-b hover:text-blood-orange flex justify-center items-center cursor-pointer transition-colors duration-200 ease-in-out">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"/></svg>
                                </div>
                                <div className="border-l border-black px-4 py-2 border-b hover:text-blood-orange flex justify-center items-center cursor-pointer transition-colors duration-200 ease-in-out">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M160 96C160 78.3 145.7 64 128 64C110.3 64 96 78.3 96 96L96 544C96 561.7 110.3 576 128 576C145.7 576 160 561.7 160 544L160 422.4L222.7 403.6C264.6 391 309.8 394.9 348.9 414.5C391.6 435.9 441.4 438.5 486.1 421.7L523.2 407.8C535.7 403.1 544 391.2 544 377.8L544 130.1C544 107.1 519.8 92.1 499.2 102.4L487.4 108.3C442.5 130.8 389.6 130.8 344.6 108.3C308.2 90.1 266.3 86.5 227.4 98.2L160 118.4L160 96z"/></svg>
                                </div>
                            </div>
                            <Post initialReply={initialReply} post={disagreePost} isDisagreePost={true} handleInitialReply={handleReply} />
                            <div className="w-full h-full flex justify-center items-center text-sm font-light">
                                {isLoadingModeration ? (
                                    <OrbitProgress color="#ff3f34" size="medium" text="" textColor="" />
                                ) : (
                                    <p>Start the conversation...</p>
                                )}
                            </div>
                        </>
                    )
                }
            </div>
        </main>
    );
}
