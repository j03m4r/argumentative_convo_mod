"use client";
import type { FC } from 'react';
import ChatInterface from "./ChatInterface";
import { Post } from "@/lib/experiment_materials/posts";
import { deliberation_prompt, discovery_prompt, eristic_prompt, information_seeking_prompt, inquiry_prompt, negotiation_prompt, persuasion_prompt } from "@/lib/experiment_materials/prompts";
import { updateInitialResponse, getUserData, updateFinishedModerationStatus, updateRevisedResponse, updateUpVoteStatus, addConversationMessages, updateComment } from "@/lib/firebase/firestore";
import { useState, useEffect } from "react";
import { useUser } from "@/providers/UserProvider";
import { OrbitProgress } from "react-loading-indicators";
import Image from 'next/image';
import ReplyInput from "./ReplyInput";
import { useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip'
import { useCallback } from 'react';

interface PageContentProps {
    post: Post;
}

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

const PageContent: FC<PageContentProps> = ({ post }) => {
    const [isLoadingModeration, setIsLoadingModeration] = useState(false);
    const [isModeration, setIsModeration] = useState(false);
    const [prompt, setPrompt] = useState<string|null>(null);
    const [initialReply, setInitialReply] = useState<string>("");
    const [revisedReply, setRevisedReply] = useState<string>("");
    const { userId } = useUser();
    const router = useRouter();
    const [savedMessages, setSavedMessages] = useState<Message[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);

    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);
    const [finishedModeration, setFinishedModeration] = useState(false);

    const [comment, setComment] = useState<string>("");

    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async () => {
        if (!userId) return;
        try {
            await navigator.clipboard.writeText(userId);
            setIsCopied(true);
            // Reset the "copied" state after a short delay
            setTimeout(() => setIsCopied(false), 10000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, [userId]);

    // Load saved conversation on mount
    useEffect(() => {
        const loadSavedConversation = async () => {
            if (!userId) {
                setIsLoadingMessages(false);
                return;
            }

            try {
                const userData = await getUserData(userId);
                if (userData) {
                    let _prompt = null;
                    if (userData.argumentationType) {
                        switch (userData.argumentationType) {
                            case "persuasion":
                                setPrompt(persuasion_prompt);
                                _prompt = persuasion_prompt;
                                break;
                            case "deliberation":
                                setPrompt(deliberation_prompt);
                                _prompt = deliberation_prompt;
                                break;
                            case "negotiation":
                                setPrompt(negotiation_prompt);
                                _prompt = negotiation_prompt;
                                break;
                            case "inquiry":
                                setPrompt(inquiry_prompt);
                                _prompt = inquiry_prompt;
                                break;
                            case "information_seeking":
                                setPrompt(information_seeking_prompt);
                                _prompt = information_seeking_prompt;
                                break;
                            case "eristic":
                                setPrompt(eristic_prompt);
                                _prompt = eristic_prompt;
                                break;
                            case "discovery":
                                setPrompt(discovery_prompt);
                                _prompt = discovery_prompt;
                                break;
                            default:
                                setPrompt("control");
                                _prompt = "control";
                                break;
                        }
                    }

                    if (!_prompt) return;

                    if (userData.finishedModeration) {
                        setFinishedModeration(true);
                    } else if (userData.conversation && userData.conversation.length > 0) {
                        // Convert Firebase timestamps back to Date objects
                        const formattedMessages: Message[] = userData.conversation.map((msg: any, index: number) => ({
                            id: `saved-${index}`,
                            role: msg.role,
                            content: msg.content,
                            timestamp: msg.timestamp?.toDate() || new Date()
                        }));

                        // Add system message if not present
                        if (formattedMessages[0]?.role !== 'system') {
                            const systemMessage: Message = {
                                id: 'system',
                                role: 'system',
                                content: _prompt.replaceAll("{{post_title}}", post.title)
                                    .replaceAll("{{post_content}}", post.content)
                                    .replaceAll("{{responders_message}}", userData.initialResponse || ""),
                                timestamp: new Date()
                            };
                            formattedMessages.unshift(systemMessage);
                        }

                        setSavedMessages(formattedMessages);
                        setIsModeration(true);
                    }
                    setInitialReply(userData.initialResponse || "");
                    setRevisedReply(userData.comment.length > 0 ? "" : (userData.revisedResponse || ""));
                    if (userData.hasUpvoted) {
                        setUpvoteCount(1);
                    } else if (userData.hasUpvoted === false) {
                        setDownvoteCount(1);
                    }
                    if (userData.comment.length) {
                        setComment(userData.comment);
                    }
                }
            } catch (error) {
                console.error('Error loading saved conversation:', error);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        loadSavedConversation();
    }, [userId, post, prompt]);

    const upVote = () => {
        if (upvoteCount === 1) {
            setUpvoteCount(0);
            if (userId) {
                updateUpVoteStatus(userId, null);
            }
        } else {
            setUpvoteCount(1);
            setDownvoteCount(0);
            if (userId) {
                updateUpVoteStatus(userId, true);
            }
        }
    }

    const downVote = () => {
        if (downvoteCount === 1) {
            setDownvoteCount(0);
            if (userId) {
                updateUpVoteStatus(userId, null);
            }
        } else {
            setDownvoteCount(1);
            setUpvoteCount(0);
            if (userId) {
                updateUpVoteStatus(userId, false);
            }
        }
    }

    const handleReply = (reply: string) => {
        if (userId) {
            if (finishedModeration) {
                setComment(reply);
                updateComment(userId, reply);
                setRevisedReply("")
            } else {
                updateInitialResponse(userId, reply)
                setInitialReply(reply)
                setIsLoadingModeration(true);
                if (prompt === "control") {
                    setTimeout(function() {
                        setIsLoadingModeration(false);
                        setFinishedModeration(true);
                    }, 20000);
                } else {
                    setTimeout(function() {
                        setIsModeration(true);
                        setIsLoadingModeration(false);
                    }, 2000);
                }
            }
        }
    }

    const handleFinishModeration = (messages: Message[]) => {
        setIsModeration(false);
        setFinishedModeration(true);
        if (userId) {
            updateFinishedModerationStatus(userId, true);
            addConversationMessages(userId, messages);
        }
        setModalIsOpen(true);
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const goBack = () => {
        if (userId && initialReply) {
            updateInitialResponse(userId, initialReply)
        }
        router.back();
    }

    const updateReply = (reply: string) => {
        if (!userId || comment.length) return;
        if (finishedModeration) {
            setRevisedReply(reply);
            updateRevisedResponse(userId, reply);
        } else {
            setInitialReply(reply);
            updateInitialResponse(userId, reply);
        }
    }

    if (isLoadingMessages) {
        return (
            <div className="flex h-screen w-full justify-center items-center">
                <OrbitProgress color="#ff3f34" size="medium" text="" textColor="" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full relative">
            {modalIsOpen&&(
                <>
                    <div className='fixed z-20 bg-cover bg-cream opacity-75 blur-xl w-screen h-screen left-0 top-0 transition-colors duration-200 ease-in-out' onClick={() => setModalIsOpen(false)}>
                    </div>
                    <div className='z-50 absolute blur-none opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream p-16 rounded-xl shadow-xl border text-xl'>
                        <svg onClick={() => setModalIsOpen(false)} xmlns="http://www.w3.org/2000/svg" width={24} className='fill-black hover:fill-blood-orange cursor-pointer absolute right-4 top-4 transition-colors duration-200 ease-in-out' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                        Now that you have finished conversing with our AI chatbot, you are free to close this textbox and <b className='text-blood-orange'>finish responding to the post.</b>
                    </div>
                </>
            )}
            <div className="flex justify-between items-center w-full py-2 shrink-0">
                <button onClick={goBack} className="px-4 py-2 hover:text-blood-orange flex justify-center items-center cursor-pointer transition-colors duration-200 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" /></svg>
                </button>
                <div className="px-4 py-2 flex justify-center items-center cursor-not-allowed opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} className="fill-current" viewBox="0 0 640 640"><path d="M160 96C160 78.3 145.7 64 128 64C110.3 64 96 78.3 96 96L96 544C96 561.7 110.3 576 128 576C145.7 576 160 561.7 160 544L160 422.4L222.7 403.6C264.6 391 309.8 394.9 348.9 414.5C391.6 435.9 441.4 438.5 486.1 421.7L523.2 407.8C535.7 403.1 544 391.2 544 377.8L544 130.1C544 107.1 519.8 92.1 499.2 102.4L487.4 108.3C442.5 130.8 389.6 130.8 344.6 108.3C308.2 90.1 266.3 86.5 227.4 98.2L160 118.4L160 96z" /></svg>
                </div>
            </div>

            <div className='gap-y-4 w-full flex flex-col justify-center items-center border-b border-black shrink-0'>
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
                                <h2 className="cursor-not-allowed text-blood-orange">{post.user.name}</h2>
                                <h2 className="ml-1 font-light">@{post.user.name}</h2>
                                <p className='font-light'>•</p>
                                <p className='font-light'>{post.timestamp}</p>
                            </div>
                            <h2 className='text-lg font-semibold'>{post.title}</h2>
                        </div>
                        <p className='text-lg'>{post.content}</p>
                    </div>
                </div>

                <div className='w-full flex justify-center items-center border-t border-black'>
                    <div className='flex items-center justify-center w-full'>
                        <button onClick={upVote} className={`w-full flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out ${upvoteCount !== 0 && "text-blood-orange"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            {upvoteCount}
                        </button>
                        <button onClick={downVote} className={`w-full flex items-center justify-center gap-x-1 border-r border-black px-4 py-2 hover:text-blood-orange cursor-pointer transition-colors duration-200 ease-in-out ${downvoteCount !== 0 && "text-blood-orange"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                            {downvoteCount > 0 ? `-${downvoteCount}`: downvoteCount}
                        </button>
                    </div>
                    <div className="h-full text-sm flex items-center justify-center gap-x-1 border-r border-black px-4 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z" /></svg>
                        {comment.length ? 1 : 0}
                    </div>
                    <div className="flex items-center justify-center gap-x-1 px-4 py-2 cursor-not-allowed transition-colors duration-200 ease-in-out opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z" /></svg>
                        Share
                    </div>
                </div>
            </div>

            {/* Flexible content area */}
            <div className="flex-1 min-h-0 flex flex-col">
                {isModeration ? (
                    <ChatInterface
                        userPfp="/images/avatar_mosaic.png"
                        initialSystemPrompt={prompt}
                        post={post}
                        initialReply={initialReply}
                        handleFinishModeration={handleFinishModeration}
                        userId={userId}
                        savedMessages={savedMessages}
                    />
                ) : (
                    <>
                        <div className='relative flex w-full items-center'>
                            <button onClick={() => updateReply(initialReply)} className={`${(!finishedModeration || revisedReply || comment.length) && 'hidden'} gap-x-2 absolute right-4 top-4 rounded-md bg-blood-orange text-cream px-2 py-1 hover:bg-blood-orange/80 cursor-pointer transition-colors duration-200 ease-in-out flex justify-center items-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-cream' viewBox="0 0 640 640"><path d="M96 128C60.7 128 32 156.7 32 192L32 448C32 483.3 60.7 512 96 512L544 512C579.3 512 608 483.3 608 448L608 192C608 156.7 579.3 128 544 128L96 128zM112 192L144 192C152.8 192 160 199.2 160 208L160 240C160 248.8 152.8 256 144 256L112 256C103.2 256 96 248.8 96 240L96 208C96 199.2 103.2 192 112 192zM96 304C96 295.2 103.2 288 112 288L144 288C152.8 288 160 295.2 160 304L160 336C160 344.8 152.8 352 144 352L112 352C103.2 352 96 344.8 96 336L96 304zM208 192L240 192C248.8 192 256 199.2 256 208L256 240C256 248.8 248.8 256 240 256L208 256C199.2 256 192 248.8 192 240L192 208C192 199.2 199.2 192 208 192zM192 304C192 295.2 199.2 288 208 288L240 288C248.8 288 256 295.2 256 304L256 336C256 344.8 248.8 352 240 352L208 352C199.2 352 192 344.8 192 336L192 304zM208 384L432 384C440.8 384 448 391.2 448 400L448 432C448 440.8 440.8 448 432 448L208 448C199.2 448 192 440.8 192 432L192 400C192 391.2 199.2 384 208 384zM288 208C288 199.2 295.2 192 304 192L336 192C344.8 192 352 199.2 352 208L352 240C352 248.8 344.8 256 336 256L304 256C295.2 256 288 248.8 288 240L288 208zM304 288L336 288C344.8 288 352 295.2 352 304L352 336C352 344.8 344.8 352 336 352L304 352C295.2 352 288 344.8 288 336L288 304C288 295.2 295.2 288 304 288zM384 208C384 199.2 391.2 192 400 192L432 192C440.8 192 448 199.2 448 208L448 240C448 248.8 440.8 256 432 256L400 256C391.2 256 384 248.8 384 240L384 208zM400 288L432 288C440.8 288 448 295.2 448 304L448 336C448 344.8 440.8 352 432 352L400 352C391.2 352 384 344.8 384 336L384 304C384 295.2 391.2 288 400 288zM480 208C480 199.2 487.2 192 496 192L528 192C536.8 192 544 199.2 544 208L544 240C544 248.8 536.8 256 528 256L496 256C487.2 256 480 248.8 480 240L480 208zM496 288L528 288C536.8 288 544 295.2 544 304L544 336C544 344.8 536.8 352 528 352L496 352C487.2 352 480 344.8 480 336L480 304C480 295.2 487.2 288 496 288z" /></svg>
                                <p className='font-semibold text-sm'>Click to fill with initial reply</p>
                            </button>
                            <ReplyInput
                                post={post}
                                comment={comment}
                                handleReply={handleReply}
                                initialReply={finishedModeration ? revisedReply : initialReply}
                                updateReply={updateReply}
                                userPfp="/images/avatar_mosaic.png" 
                            />
                        </div>
                        <div className="flex-1 flex justify-center items-center">
                            {isLoadingModeration ? (
                                <OrbitProgress color="#ff3f34" size="medium" text="" textColor="" />
                            ) : comment.length ? (
                                <div className='flex flex-col h-full w-full items-center py-4 justify-between'>
                                    <div className='flex w-full gap-x-1'>
                                        <div className='flex justify-center'>
                                            <Image
                                                src="/images/avatar_mosaic.png"
                                                width={50}
                                                height={50}
                                                alt="Wave profile picture"
                                                className="w-3/4 h-fit rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-col w-full gap-y-1">
                                            <div className="flex w-full flex-col">
                                                <div className="flex w-full gap-x-1 items-center">
                                                    <h2 className="cursor-not-allowed text-blood-orange text-sm">5121329495</h2>
                                                    <h2 className="text-sm ml-1 font-light">@5121329495</h2>
                                                    <p className='font-light'>•</p>
                                                    <p className='text-sm font-light'>Now</p>
                                                </div>
                                            </div>
                                            <p className='font-normal text-md'>{comment}</p>
                                            <div className='w-full flex justify-between items-center'>
                                                <div className="flex items-center justify-center gap-x-8 py-2">
                                                    <div className="cursor-not-allowed text-sm flex items-center justify-center gap-x-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                                                        0
                                                    </div>
                                                    <div className={`cursor-not-allowed text-sm flex items-center justify-center gap-x-1`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} className='rotate-180 fill-current' viewBox="0 0 640 640"><path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z" /></svg>
                                                        0
                                                    </div>
                                                    <div className={`cursor-not-allowed text-sm flex items-center justify-center gap-x-1`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} className='fill-current' viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z" /></svg>
                                                        0
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={copyToClipboard} className='flex w-full gap-x-2 py-16 text-blood-orange border rounded-md justify-center items-center cursor-pointer transition-colors duration-200 ease-in-out font-semibold text-xl' data-tooltip-id="codeCopy" data-tooltip-content={isCopied ? "Copied! You can now return to the survey" : "Click below to copy"} data-tooltip-place="top">
                                        <Tooltip id="codeCopy" isOpen style={{ backgroundColor: "#ff3f34", color: "#faf9f6", fontWeight: "700", zIndex: 50 }} />
                                        <p>
                                            {userId}
                                        </p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-blood-orange' viewBox="0 0 640 640"><path d="M288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448L480 448C515.3 448 544 419.3 544 384L544 183.4C544 166 536.9 149.3 524.3 137.2L466.6 81.8C454.7 70.4 438.8 64 422.3 64L288 64zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L352 496L352 512L160 512L160 256L176 256L176 192L160 192z" /></svg>
                                    </button>
                                </div>
                            ) : (
                                <p className='text-sm font-light'>Start the conversation...</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
export default PageContent;
