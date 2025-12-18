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
    const [randomPosts, setRandomPosts] = useState<P[]>([]);
    const [disagreePost, setDisagreePost] = useState<P | null>(null);
    const [disagreePostIdx, setDisagreePostIdx] = useState(-1);
    const [aiPost, setAIPost] = useState<P | null>(null);
    const [vaccinePost, setVaccinePost] = useState<P | null>(null);
    const [aiPostIdx, setAIPostIdx] = useState(-1);
    const [vaccinePostIdx, setVaccinePostIdx] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const { userId } = useUser();

    function shuffleArray(array: P[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
                    setIsLoading(false);
                    return;
                }

                // Set auxiliary posts
                const _disagreePost = posts[userData.disagreePostIdx]
                const _aiPost = artificial_intelligence_posts[userData.auxPostIdx1];
                const _vaccinePost = vaccine_posts[userData.auxPostIdx2];

                setAIPost(_aiPost);
                setAIPostIdx(userData.auxPostIdx1);
                setVaccinePost(_vaccinePost);
                setVaccinePostIdx(userData.auxPostIdx2);
                setDisagreePost(_disagreePost);
                setDisagreePostIdx(userData.disagreePostIdx);

                let _posts = [_aiPost, _vaccinePost, _disagreePost];
                _posts = shuffleArray(_posts);
                setRandomPosts(_posts);

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
        <main className="flex w-full h-screen">
            <div className="flex h-full w-full gap-x-4">
                <div className="flex flex-col w-full bg-cream justify-between items-center h-fit max-w-[900px]">
                    <div className="bg-cream sticky top-0 flex items-center gap-y-1 justify-start w-full py-2 border-b border-black">
                        <h2 className="py-2 px-4 font-bold cursor-not-allowed">For you</h2>
                        <h2 className="py-2 px-4 font-light cursor-not-allowed">Following</h2>
                    </div>
                    <div className="flex flex-col h-full w-full gap-y-2">
                        {randomPosts.map((_post, idx) => {
                            if (!disagreePost || !aiPost || !vaccinePost) return null;
                            if (_post.title === disagreePost.title) {
                                return (
                                    <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                        <Tooltip id="replyPost" isOpen style={{ backgroundColor: "#ff3f34", color: "#faf9f6", fontWeight: "700", zIndex: 50 }} />
                                        <Post randIdx={idx} postType="p" post={disagreePost} postIdx={disagreePostIdx} />
                                        {idx!==2&&<div className="border-b border-black w-full" />}
                                    </div>
                                )
                            } else if (_post.title === aiPost.title) {
                                return (
                                    <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                        <Post randIdx={idx} postType="ai" post={aiPost} postIdx={aiPostIdx} />
                                        {idx!==2&&<div className="border-b border-black w-full" />}
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                        <Post randIdx={idx} postType="vaccine" post={vaccinePost} postIdx={vaccinePostIdx} />
                                        {idx!==2&&<div className="border-b border-black w-full" />}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
                <div className="gap-y-2 items-center justify-start flex-1 sticky top-0 self-start">
                    <div className="bg-cream px-4 py-2 border-black cursor-not-allowed flex flex-row w-full items-center gap-x-2 border rounded-xl h-fit my-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} className="fill-current" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>
                        <p>
                            Search for content
                        </p>
                    </div>
                    <div className="-z-10 bg-cream w-full flex flex-col rounded-xl border border-black">
                        <h2 className="font-bold text-xl px-4 py-2">Popular Topics</h2>
                        <div className="w-full px-4 py-2 flex items-center cursor-not-allowed">
                            <div className="flex flex-col">
                                <p className="font-light text-sm">Trending</p>
                                <p className="font-semibold">Generative AI</p>
                            </div>
                            <div className="ml-4 flex-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#2e6f40" width={24} viewBox="0 0 640 640"><path d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"/></svg>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640"><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>
                        </div>
                        <div className="w-full px-4 py-2 flex items-center cursor-not-allowed">
                            <div className="flex flex-col">
                                <p className="font-light text-sm">Trending</p>
                                <p className="font-semibold">Genetic Engineering</p>
                            </div>
                            <div className="ml-4 flex-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#2e6f40" width={24} viewBox="0 0 640 640"><path d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"/></svg>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640"><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>
                        </div>
                        <div className="w-full px-4 py-2 flex items-center cursor-not-allowed">
                            <div className="flex flex-col">
                                <p className="font-light text-sm">Trending</p>
                                <p className="font-semibold">Video Games</p>
                            </div>
                            <div className="ml-4 flex-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#2e6f40" width={24} viewBox="0 0 640 640"><path d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"/></svg>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640"><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
