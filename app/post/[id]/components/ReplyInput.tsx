"use client"
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { FC } from 'react';
import { Post as P } from "@/lib/experiment_materials/posts";
import { useDebounce } from '@/lib/hooks/useDebounce';

interface ReplyInputProps {
    post: P;
    userPfp: string;
    handleReply: (reply: string) => void;
    initialReply: string;
    updateReply: (reply: string) => void;
}

const ReplyInput: FC<ReplyInputProps> = ({ post, userPfp, handleReply, initialReply, updateReply }) => {
    const [replyText, setReplyText] = useState(initialReply || "");
    const [isFocused, setIsFocused] = useState(initialReply && initialReply.trim().length > 0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const debouncedReplyText = useDebounce(replyText, 500);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [replyText]);

    useEffect(() => {
        setReplyText(initialReply);
    }, [initialReply])

    useEffect(() => {
        if (debouncedReplyText !== initialReply || debouncedReplyText === "") {
            updateReply(debouncedReplyText);
        }
    }, [debouncedReplyText]);

    const _handleReply = () => {
        if (replyText.trim()) {
            handleReply(replyText);
            // setReplyText('');
        }
    };

    return (
        <div className='flex w-full border-b border-black pt-4 px-4 gap-x-3'>
            {/* Profile Picture */}
            <div className='shrink-0'>
                <Image
                    src={userPfp}
                    width={40}
                    height={40}
                    alt="Your profile picture"
                    className="w-10 h-10 rounded-full"
                />
            </div>

            {/* Input Area */}
            <div className='flex-1 flex flex-col'>
                {/* Replying to indicator */}
                <p className='text-sm text-gray-500'>
                    Replying to <span className='text-blood-orange hover:underline cursor-not-allowed'>@{post.user.name}</span>
                </p>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder='Post your reply'
                    className='w-full resize-none outline-none text-lg min-h-[60px] max-h-[400px] overflow-y-auto placeholder:text-gray-400'
                    rows={1}
                />

                {/* Action buttons - only show when focused or has text */}
                {(isFocused || replyText.length > 0) && (
                    <div className='flex items-center justify-end pt-2'>
                        {/* Reply button */}
                        <button
                            onClick={_handleReply}
                            disabled={!replyText.trim()}
                            className='flex gap-x-1 px-4 py-2 border-x border-t border-black cursor-pointer 
                                     disabled:opacity-50 disabled:cursor-not-allowed 
                                     transition-all duration-200 hover:text-blood-orange disabled:hover:text-black'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} className='fill-current' viewBox="0 0 640 640"><path d="M268.2 82.4C280.2 87.4 288 99 288 112L288 192L400 192C497.2 192 576 270.8 576 368C576 481.3 494.5 531.9 475.8 542.1C473.3 543.5 470.5 544 467.7 544C456.8 544 448 535.1 448 524.3C448 516.8 452.3 509.9 457.8 504.8C467.2 496 480 478.4 480 448.1C480 395.1 437 352.1 384 352.1L288 352.1L288 432.1C288 445 280.2 456.7 268.2 461.7C256.2 466.7 242.5 463.9 233.3 454.8L73.3 294.8C60.8 282.3 60.8 262 73.3 249.5L233.3 89.5C242.5 80.3 256.2 77.6 268.2 82.6z"/></svg>
                            Reply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReplyInput;
