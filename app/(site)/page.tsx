"use client";
import { artificial_intelligence_posts, Post as P, vaccine_posts, posts } from "@/lib/experiment_materials/posts";
import { getUserData, updatePostVotes, setPage2StartedAt, setPage3StartedAt } from "@/lib/firebase/firestore";
import { useUser } from "@/providers/UserProvider";
import { UserData, PostKey } from "@/types/user";
import { useEffect, useState, useRef } from "react";
import { OrbitProgress } from "react-loading-indicators";
import Post from "./components/Post";
import { Tooltip } from 'react-tooltip'
import { useSearchParams, useRouter } from 'next/navigation';
import { schedulePageTransition } from "@/lib/PageTimer";
import SkeletonPost from "./components/SkeletonPost";
import PieChart from "./components/PieChart";

const pagePostUpvoteCounts = {
    "1": [21, 23, 41],
    "2": [34, 21, 10],
    "3": [18, 26, 14]
}

const pagePostDownvoteCounts = {
    "1": [14, 19, 12],
    "2": [13, 11, 19],
    "3": [17, 15, 18]
}

const pagePostCommentCounts = {
    "1": [3, 6, 7],
    "2": [7, 4, 2],
    "3": [4, 5, 7]
}

export default function HomePage() {
    const [disagreePage, setDisagreePage] = useState<{ idx: number; type: string; post: P }[]>([]);
    const [agreePage, setAgreePage] = useState<{ idx: number; type: string; post: P }[]>([]);
    const [respondPage, setRespondPage] = useState<{ idx: number; type: string; post: P }[]>([]);
    const [postVotes, setPostVotes] = useState<number[]>(Array(18).fill(0));
    const [comments, setComments] = useState<string[][]>(Array(18).fill([]))
    const [disagreePostIdx, setDisagreePostIdx] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [canNavigateNext, setCanNavigateNext] = useState(false);
    const { userId } = useUser();
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const page = searchParams.get("page");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

                const retPost = (postKey: PostKey) => {
                    let _post = null;
                    if (postKey.type === "aux") {
                        if (postKey.idx >=4) {
                            _post = vaccine_posts[postKey.idx - 4];
                         } else {
                            _post = artificial_intelligence_posts[postKey.idx];
                         }
                    } else {
                        _post = posts[postKey.idx];
                    }
                    return _post;
                }

                if (!page) {
                    replace("/?page=1");
                    return;
                }

                const disagreePagePostKeys = userData.disagreePage;
                const agreePagePostKeys = userData.agreePage;
                const respondPagePostKeys = userData.respondPage;

                if (disagreePage.length === 0) {
                    const disagreePage = disagreePagePostKeys.map((postKey) => {
                        return { "idx": postKey.idx, "type": postKey.type, "post": retPost(postKey) }
                    })
                    setDisagreePage(disagreePage);
                }
                if (agreePage.length === 0) {
                    const agreePage = agreePagePostKeys.map((postKey) => {
                        return { "idx": postKey.idx, "type": postKey.type, "post": retPost(postKey) }
                    })
                    setAgreePage(agreePage);
                }
                if (respondPage.length === 0) {
                    const respondPage = respondPagePostKeys.map((postKey) => {
                        return { "idx": postKey.idx, "type": postKey.type, "post": retPost(postKey) }
                    })
                    setRespondPage(respondPage);
                }

                setDisagreePostIdx(userData.disagreePostIdx);

                setPostVotes(userData.postVotes);
                setComments(Object.keys(userData.postComments).map((key: string) => userData.postComments[key]))

                setIsLoading(false);
                if (page === "1") {
                    await setPage2StartedAt(userId);
                    const startedAt = userData.page2StartedAt?.toMillis() ?? Date.now();
                    const remaining = Math.max(0, 30000 - (Date.now() - startedAt));

                    if (remaining === 0) {
                        setCanNavigateNext(true);
                        return;
                    } else {
                        setCanNavigateNext(false);
                    }

                    schedulePageTransition(remaining, () => setCanNavigateNext(true));
                }

                if (page === "2") {
                    await setPage3StartedAt(userId);
                    const startedAt = userData.page3StartedAt?.toMillis() ?? Date.now();
                    const remaining = Math.max(0, 30000 - (Date.now() - startedAt));

                    if (remaining === 0) {
                        setCanNavigateNext(true);
                        return;
                    } else {
                        setCanNavigateNext(false);
                    }

                    schedulePageTransition(remaining, () => setCanNavigateNext(true));
                }
                if (page === "3") {
                    setCanNavigateNext(false);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setIsLoading(false);
            }
        }

        fetchPosts();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            timeoutRef.current = null;  // reset so re-entry guard works correctly
            intervalRef.current = null;
        };
    }, [userId, page]);

    const handleSetPostVoteVal = async (postIdx: number, newVal: number) => {
        if (!userId) {
            return;
        }

        try {
            await updatePostVotes(userId, postIdx, newVal);
        } catch (error) {
            console.error("Error updating post votes:", error);
        } finally {
            setPostVotes((prevVotes) => {
                const newVotes = [...prevVotes];
                newVotes[postIdx] = newVal;
                return newVotes;
            });
        }
    }
        

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
                <div className="flex flex-col w-full bg-cream justify-between items-center h-fit xl:max-w-[900px]">
                    <div className="bg-cream top-0 flex items-center gap-y-1 justify-start w-full py-2 border-b border-black">
                        <h2 className="py-2 px-4 font-bold cursor-not-allowed opacity-50">For you</h2>
                        <h2 className="py-2 px-4 font-light cursor-not-allowed opacity-50">Following</h2>
                    </div>
                    <div className="flex bg-cream px-4 w-full border-2 mt-1 sticky top-2 gap-x-4 border-blood-orange shadow-lg z-50">
                        {page !== "3"&&(
                            <div className="p-2 flex justify-center items-center min-h-full">
                                <PieChart numerator={Number(Number.isInteger(Number(page)) ? page : 0)} denominator={3} />
                            </div>
                        )}
                        <div className="flex flex-col py-4 flex-1 gap-y-1 bg-cream">
                            <h1 className="text-xl font-bold text-blood-orange">
                                {page === "1" ? "Personalizing Your Feed..." : page === "2" ? "Personalized Feed #1" : "Personalized Feed #2"}
                            </h1>
                            <h2 className="text-lg">
                                {
                                    page === "1" ? "While we configure your feed, please interact with content. Commenting and voting will help us understand your preferences better."
                                    : page === "2" ? "Here are some posts you might like based on your preferences. Feel free to interact with them!"
                                    : "This is your final feed. We've outlined one post for you to respond to"
                                }
                            </h2>
                        </div>
                        {canNavigateNext && (
                            <div className="flex justify-center items-center min-h-full">
                                <button
                                    onClick={() => {replace(`/?page=${Number(Number.isInteger(Number(page)) ? page : 2)+1}`), setCanNavigateNext(false)}}
                                    className="bg-blood-orange text-cream font-semibold rounded-lg cursor-pointer px-4 py-2 border border-blood-orange hover:bg-cream hover:border-blood-orange hover:text-blood-orange transition-all ease-in-out duration-200 border-x"
                                >
                                    Next Feed
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col h-full w-full gap-y-2 py-2">
                        {page === "2" ? agreePage.map((_post, idx) => (
                                <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                    <Post setPostVoteVal={handleSetPostVoteVal} comments={comments[_post.type === "aux" ? _post.idx+9 : _post.idx]} disagreePostIdx={disagreePostIdx} randIdx={idx} postType={_post.type} post={_post.post} postIdx={_post.idx} upVoteVal={pagePostUpvoteCounts[page][idx]} downVoteVal={pagePostDownvoteCounts[page][idx]} commentVal={pagePostCommentCounts[page][idx]} voteVal={postVotes[_post.type==="aux" ? _post.idx + 9 : _post.idx]} />
                                    {idx!==2&&<div className="border-b border-black w-full" />}
                                </div>
                            )
                        ) : page === "3" ? respondPage.map((_post, idx) => {
                            if (_post.idx === disagreePostIdx && _post.type === "opinion") {
                                return (
                                    <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                        <Tooltip id="replyPost" isOpen style={{ backgroundColor: "#ff3f34", color: "#faf9f6", fontWeight: "700", zIndex: 50 }} />
                                        <Post setPostVoteVal={handleSetPostVoteVal} comments={comments[_post.idx]} disagreePostIdx={disagreePostIdx} randIdx={idx} postType={_post.type} post={_post.post} postIdx={_post.idx} upVoteVal={pagePostUpvoteCounts[page][idx]} downVoteVal={pagePostDownvoteCounts[page][idx]} commentVal={pagePostCommentCounts[page][idx]} voteVal={postVotes[_post.idx]} />
                                        {idx!==2&&<div className="border-b border-black w-full" />}
                                    </div>
                                )}
                            else {
                                return (
                                    <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                        <Post setPostVoteVal={handleSetPostVoteVal} comments={comments[_post.type === "aux" ? _post.idx+9 : _post.idx]} disagreePostIdx={disagreePostIdx} randIdx={idx} postType={_post.type} post={_post.post} postIdx={_post.idx} upVoteVal={pagePostUpvoteCounts[page][idx]} downVoteVal={pagePostDownvoteCounts[page][idx]} commentVal={pagePostCommentCounts[page][idx]} voteVal={postVotes[_post.type==="aux" ? _post.idx + 9 : _post.idx]} />
                                        {idx!==2&&<div className="border-b border-black w-full" />}
                                    </div>
                                )
                            }
                        }) : disagreePage.map((_post, idx) => (
                                <div key={`randPost_${idx}`} className="flex flex-col w-full gap-y-2">
                                    <Post setPostVoteVal={handleSetPostVoteVal} comments={comments[_post.type === "aux" ? _post.idx+9 : _post.idx]} disagreePostIdx={disagreePostIdx} randIdx={idx} postType={_post.type} post={_post.post} postIdx={_post.idx} upVoteVal={pagePostUpvoteCounts["1"][idx]} downVoteVal={pagePostDownvoteCounts["1"][idx]} commentVal={pagePostCommentCounts["1"][idx]} voteVal={postVotes[_post.type==="aux" ? _post.idx + 9 : _post.idx]} />
                                    {idx!==2&&<div className="border-b border-black w-full" />}
                                </div>
                            ))
                        }
                        <>
                            <div className="border-b border-gray-200 w-full" />
                            {
                                Array.from({ length: 7 }).map((_, i) => (
                                    <div key={`skeleton_${i}`} className="flex flex-col w-full gap-y-2">
                                        <SkeletonPost />
                                        {i !== 2 && <div className="border-b border-gray-200 w-full" />}
                                    </div>
                                ))
                            }
                        </>
                    </div>
                </div>
                <div className="gap-y-2 items-center justify-start flex-1 sticky top-0 self-start">
                    <div className="bg-cream px-4 py-2 border-black cursor-not-allowed flex flex-row w-full items-center gap-x-2 border rounded-xl h-fit my-2 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} className="fill-current" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>
                        <p>
                            Search for content
                        </p>
                    </div>
                    <div className="-z-10 bg-cream w-full flex flex-col rounded-xl border border-black opacity-50">
                        <h2 className="font-bold text-xl px-4 py-2">Popular Topics</h2>
                        <div className="w-full px-4 py-2 flex items-center justify-between cursor-not-allowed gap-x-2 xl:gap-x-0">
                            <div className="flex flex-col">
                                <p className="font-light text-sm">Trending</p>
                                <p className="font-semibold whitespace-nowrap">Generative AI</p>
                            </div>
                            <div className="hidden xl:block ml-4 flex-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#2e6f40" width={24} viewBox="0 0 640 640"><path d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"/></svg>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640"><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>
                        </div>
                        <div className="w-full px-4 py-2 flex items-center justify-between cursor-not-allowed gap-x-2 xl:gap-x-0">
                            <div className="flex flex-col">
                                <p className="font-light text-sm">Trending</p>
                                <p className="font-semibold whitespace-nowrap">Genetic Engineering</p>
                            </div>
                            <div className="hidden xl:block ml-4 flex-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#2e6f40" width={24} viewBox="0 0 640 640"><path d="M416 224C398.3 224 384 209.7 384 192C384 174.3 398.3 160 416 160L576 160C593.7 160 608 174.3 608 192L608 352C608 369.7 593.7 384 576 384C558.3 384 544 369.7 544 352L544 269.3L374.6 438.7C362.1 451.2 341.8 451.2 329.3 438.7L224 333.3L86.6 470.6C74.1 483.1 53.8 483.1 41.3 470.6C28.8 458.1 28.8 437.8 41.3 425.3L201.3 265.3C213.8 252.8 234.1 252.8 246.6 265.3L352 370.7L498.7 224L416 224z"/></svg>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 640 640"><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>
                        </div>
                        <div className="w-full px-4 py-2 flex items-center justify-between cursor-not-allowed gap-x-2 xl:gap-x-0">
                            <div className="flex flex-col">
                                <p className="font-light text-sm">Trending</p>
                                <p className="font-semibold whitespace-nowrap">Video Games</p>
                            </div>
                            <div className="hidden xl:block ml-4 flex-1 items-center">
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
