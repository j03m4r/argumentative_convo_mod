"use client";
import { artificial_intelligence_posts, Post as P, vaccine_posts, posts } from "@/lib/experiment_materials/posts";
import { getUserData } from "@/lib/firebase/firestore";
import { useUser } from "@/providers/UserProvider";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import Post from "./components/Post";
import { Tooltip } from 'react-tooltip'

export default function HomePage() {
    const [disagreePost, setDisagreePost] = useState<P | null>(null);
    const [disagreePostIdx, setDisagreePostIdx] = useState(-1);
    const [aiPost, setAIPost] = useState<P | null>(null);
    const [vaccinePost, setVaccinePost] = useState<P | null>(null);
    const [aiPostIdx, setAIPostIdx] = useState(-1);
    const [vaccinePostIdx, setVaccinePostIdx] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useUser();

    useEffect(() => {
        async function fetchPosts() {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await getUserData(userId) as UserData | null;

                if (!userData || !userData.initialRatings) {
                    setIsLoading(false);
                    return;
                }

                // Set auxiliary posts
                setAIPost(artificial_intelligence_posts[userData.auxPostIdx1]);
                setAIPostIdx(userData.auxPostIdx1);
                setVaccinePost(vaccine_posts[userData.auxPostIdx2]);
                setVaccinePostIdx(userData.auxPostIdx2);
                setDisagreePost(posts[userData.disagreePostIdx]);
                setDisagreePostIdx(userData.disagreePostIdx);

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
                        <h2 className="py-2 px-4 font-light hover:underline cursor-not-allowed border-r border-black">Following</h2>
                    </div>
                    <div className="px-4 py-2 border-l border-black cursor-not-allowed hover:text-blood-orange transition-all duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>
                    </div>
                </div>
                <div className="flex flex-col h-full w-full overflow-y-scroll gap-y-2">
                    {aiPost && (
                        <Post postType="ai" post={aiPost} postIdx={aiPostIdx} />
                    )}
                    <div className="border-b border-black w-full" />
                    {vaccinePost && (
                        <Post postType="vaccine" post={vaccinePost} postIdx={vaccinePostIdx} />
                    )}
                    <div className="border-b border-black w-full" />
                    {disagreePost && (
                        <>
                            <Tooltip id="replyPost" isOpen style={{ backgroundColor: "#ff3f34", color: "#faf9f6", fontWeight: "700" }} />
                            <Post postType="p" post={disagreePost} postIdx={disagreePostIdx} />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
