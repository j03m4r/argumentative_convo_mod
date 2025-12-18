"use client"
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { FC } from 'react';
import { Post } from '@/lib/experiment_materials/posts';
import { addConversationMessage } from '@/lib/firebase/firestore';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    userPfp: string;
    initialSystemPrompt?: string;
    post: Post | null;
    initialReply: string;
    handleFinishModeration: (messages: Message[]) => void;
    userId: string | null;
    savedMessages?: Message[];
}

const ChatInterface: FC<ChatInterfaceProps> = ({ 
    userPfp, 
    initialSystemPrompt, 
    post, 
    initialReply, 
    handleFinishModeration,
    userId,
    savedMessages = []
}) => {
    const [messages, setMessages] = useState<Message[]>(savedMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false); // Add this ref to track initialization

    useEffect(() => {
        // Only initialize if we haven't already and there are no saved messages
        if (initialSystemPrompt && messages.length === 0 && !hasInitialized.current) {
            hasInitialized.current = true; // Mark as initialized immediately
            initializeChat();
            console.log('Initializing chat');
        }
    }, [initialSystemPrompt, messages.length]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const callOpenRouter = async (messages: Message[]): Promise<string> => {
        const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

        if (!apiKey) {
            throw new Error('OpenRouter API key not found');
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Y Discussion'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-sonnet-4',
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response received';
    };

    const initializeChat = async () => {
        if (!initialSystemPrompt || !post) return;

        console.log('initializeChat called');
        setIsLoading(true);
        try {
            const systemMessage: Message = {
                id: 'system',
                role: 'system',
                content: initialSystemPrompt.replaceAll("{{post_title}}", post.title).replaceAll("{{post_content}}", post.content).replaceAll("{{responders_message}}", initialReply),
                timestamp: new Date()
            };

            const response = await callOpenRouter([systemMessage]);

            const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages([systemMessage, assistantMessage]);

            // Save assistant message to Firebase
            if (userId) {
                await addConversationMessage(userId, {
                    role: assistantMessage.role,
                    content: assistantMessage.content,
                    timestamp: assistantMessage.timestamp
                });
            }
        } catch (error) {
            console.error('Error initializing chat:', error);
            hasInitialized.current = false; // Reset on error so it can retry
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        // Save user message to Firebase
        if (userId) {
            try {
                await addConversationMessage(userId, {
                    role: userMessage.role,
                    content: userMessage.content,
                    timestamp: userMessage.timestamp
                });
            } catch (error) {
                console.error('Error saving user message:', error);
            }
        }

        try {
            const response = await callOpenRouter(updatedMessages);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages([...updatedMessages, assistantMessage]);

            // Save assistant message to Firebase
            if (userId) {
                await addConversationMessage(userId, {
                    role: assistantMessage.role,
                    content: assistantMessage.content,
                    timestamp: assistantMessage.timestamp
                });
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            setMessages([...updatedMessages, errorMessage]);

            // Save error message to Firebase
            if (userId) {
                await addConversationMessage(userId, {
                    role: errorMessage.role,
                    content: errorMessage.content,
                    timestamp: errorMessage.timestamp
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className='flex w-full border-b border-black'>
                <div className='p-4 flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width={48} className='fill-blood-orange' viewBox="0 0 640 640"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z" /></svg>
                </div>
                <div className="flex flex-col py-4 flex-1">
                    <h1 className="text-xl font-bold text-blood-orange">
                        Hold on...
                    </h1>
                    <h2 className="text-lg">
                        Before you post your response to this discussion forum, we would like to have a conversation with you.
                    </h2>
                </div>
                {messages.length >= 8 && (
                    <button 
                        onClick={() => handleFinishModeration(messages)} 
                        className='flex border-x px-8 py-2 font-bold cursor-pointer justify-center items-center border-black transition-all duration-200 ease-in-out bg-blood-orange text-cream hover:bg-cream hover:text-blood-orange'
                    >
                        Finish Chatting
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-scroll px-4 py-4 space-y-4">
                {messages.map((message) => (
                    message.role !== 'system' && (
                        <div key={message.id} className={`flex gap-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {message.role === 'assistant' && (
                                <div className='shrink-0'>
                                    <div className="w-10 h-10 rounded-full bg-blood-orange flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-cream' viewBox="0 0 640 640"><path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z"/></svg>
                                    </div>
                                </div>
                            )}

                            <div className={`flex flex-col max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-lg ${message.role === 'user'
                                    ? 'bg-blood-orange text-cream'
                                    : 'bg-gray-100 text-black border border-gray-200'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {message.role === 'user' && (
                                <div className='shrink-0'>
                                    <Image
                                        src={userPfp}
                                        width={40}
                                        height={40}
                                        alt="Your profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                    )
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-x-3 justify-start">
                        <div className='shrink-0'>
                            <div className="w-10 h-10 rounded-full bg-blood-orange flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-cream' viewBox="0 0 640 640"><path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z"/></svg>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg flex justify-center items-center px-4 border border-gray-200">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className='flex w-full border-t border-black pt-4 px-4 gap-x-3'>
                <div className='shrink-0'>
                    <Image
                        src={userPfp}
                        width={40}
                        height={40}
                        alt="Your profile picture"
                        className="w-10 h-10 rounded-full"
                    />
                </div>

                <div className='flex-1 flex flex-col'>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder='Type your message'
                        disabled={isLoading}
                        className='w-full resize-none outline-none text-lg min-h-[60px] max-h-[200px] overflow-y-auto placeholder:text-gray-400 disabled:opacity-50'
                        rows={1}
                    />

                    {(isFocused || input.length > 0) && (
                        <div className='flex items-center justify-between pt-2'>
                            <span className='text-xs text-gray-400'>Press Enter to send, Shift+Enter for new line</span>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className='flex gap-x-1 px-4 py-2 border-x border-t border-black cursor-pointer 
                             disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-all duration-200 hover:text-blood-orange disabled:hover:text-black'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} className='fill-current' viewBox="0 0 512 512">
                                    <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                                </svg>
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;
