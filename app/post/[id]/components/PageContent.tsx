"use client";
import type { FC } from 'react';
import ChatInterface from "./ChatInterface";
import { Post } from "@/lib/experiment_materials/posts";
import { persuasion_prompt } from "@/lib/experiment_materials/prompts";
import { addConversationMessages, updateInitialResponse } from "@/lib/firebase/firestore";
import {  useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { OrbitProgress } from "react-loading-indicators";
import Image from 'next/image';
import ReplyInput from "./ReplyInput";
import { useRouter } from 'next/navigation';

interface PageContentProps {
    post: Post;
}

const PageContent: FC<PageContentProps> = ({ post }) => {
    const [isLoadingModeration, setIsLoadingModeration] = useState(false);
    const [isModeration, setIsModeration] = useState(false);
    const prompt = persuasion_prompt;
    const [initialReply, setInitialReply] = useState<string>("");
    const { userId } = useUser();
    const router = useRouter();

    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);

    const upVote = () => {
        if (upvoteCount===1) {
            setUpvoteCount(0);
        } else {
            setUpvoteCount(1);
            setDownvoteCount(0);
        }
    }

    const downVote = () => {
        if (downvoteCount===1) {
            setDownvoteCount(0);
        } else {
            setDownvoteCount(1);
            setUpvoteCount(0);
        }
    }

    const handleReply = (reply: string) => {
        if (initialReply === "" && userId) {
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

    return (
        <div className="flex flex-col items-center h-screen w-full">
            {isModeration ? (
                <ChatInterface
                    userPfp="/images/avatar_mosaic.png"
                    initialSystemPrompt={prompt}
                    post={post}
                    initialReply={initialReply}
                    handleFinishModeration={handleFinishModeration}
                />
            ) : <>
                <div className="flex justify-between items-center w-full py-2">
                    <button onClick={() => router.back()} className="px-4 py-2 hover:text-blood-orange flex justify-center items-center cursor-pointer transition-colors duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" /></svg>
                    </button>
                    <div className="px-4 py-2 hover:text-blood-orange flex justify-center items-center cursor-not-allowed transition-colors duration-200 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M160 96C160 78.3 145.7 64 128 64C110.3 64 96 78.3 96 96L96 544C96 561.7 110.3 576 128 576C145.7 576 160 561.7 160 544L160 422.4L222.7 403.6C264.6 391 309.8 394.9 348.9 414.5C391.6 435.9 441.4 438.5 486.1 421.7L523.2 407.8C535.7 403.1 544 391.2 544 377.8L544 130.1C544 107.1 519.8 92.1 499.2 102.4L487.4 108.3C442.5 130.8 389.6 130.8 344.6 108.3C308.2 90.1 266.3 86.5 227.4 98.2L160 118.4L160 96z" /></svg>
                    </div>
                </div>
                <div className='w-full flex flex-col justify-center items-center'>
                    <div className="flex w-full gap-x-1 p-2">
                        <div className="flex justify-center">
                            <Image
                                src={post.user.pfp_src}
                                width={50}
                                height={50}
                                alt="Wave profile picture"
                                className="w-3/4 h-fit rounded-full"
                            />
                        </div>
                        <div className="flex flex-col w-full gap-y-1">
                            <div className="flex w-full flex-col">
                                <div className="flex w-full gap-x-1 items-center">
                                    <h2 className="hover:underline cursor-not-allowed text-blood-orange text-sm">{post.user.name}</h2>
                                    <h2 className="text-sm ml-1 font-light">@{post.user.name}</h2>
                                    <p className='font-light'>•</p>
                                    <p className='text-sm font-light'>{post.timestamp}</p>
                                </div>
                                <h2 className='font-semibold'>{post.title}</h2>
                            </div>
                            <p>{post.content}</p>
                        </div>
                    </div>

                    <div className='w-full flex justify-center items-center border border-black my-2'>
                        <div className='flex items-center justify-center w-full'>
                            <button onClick={upVote} className={`w-full flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out ${upvoteCount!==0&&"text-blood-orange"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                                {upvoteCount}
                            </button>
                            <button onClick={downVote} className={`w-full flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out ${downvoteCount!==0&&"text-blood-orange"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                                {downvoteCount}
                            </button>
                        </div>
                        <div className="h-full text-sm flex items-center justify-center gap-x-1 border-r border-black px-4 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z" /></svg>
                            0
                        </div>
                        <div className="flex items-center justify-center gap-x-1 px-4 py-2 hover:text-blood-orange cursor-not-allowed transition-colors duration-200 ease-in-out">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z" /></svg>
                            Share
                        </div>
                    </div>

                    <ReplyInput
                        post={post}
                        handleReply={handleReply}
                        initialReply={initialReply}
                        userPfp="/images/avatar_mosaic.png"
                    />
                </div>

                <div className="w-full h-full flex justify-center items-center text-sm font-light">
                    {isLoadingModeration ? (
                        <OrbitProgress color="#ff3f34" size="medium" text="" textColor="" />
                    ) : (
                        <p>Start the conversation...</p>
                    )}
                </div>
            </>
            }
        </div>
    )
}
export default PageContent;
