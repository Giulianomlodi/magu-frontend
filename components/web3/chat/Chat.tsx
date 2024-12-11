// components/web3/chat/Chat.tsx
'use client'
import React, { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { useChat } from './useChat';
import { getContractAddress } from '@/utils/env';

export const Chat = () => {
    const [inputMessage, setInputMessage] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const contractAddress = getContractAddress();

    const {
        messages,
        addMessage,
        isEntrancePaid,
        isMinting
    } = useChat(contractAddress);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !isEntrancePaid || isMinting) return;

        addMessage(inputMessage.trim(), 'user');
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI response (replace with actual AI integration)
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    return (
        <Card className="bg-blue bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 w-full max-w-2xl">
            <CardContent className="p-6 space-y-4">
                <ScrollArea className="h-[60vh] pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4 py-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="flex gap-3 max-w-[80%]">
                                    {message.sender === 'ai' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/ai-avatar.png" />
                                            <AvatarFallback className="bg-white">AI</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`rounded-lg p-3 ${message.sender === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-white bg-opacity-10 text-white'
                                            }`}
                                    >
                                        {message.content}
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex gap-3 max-w-[80%]">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/ai-avatar.png" />
                                        <AvatarFallback className="bg-primary">AI</AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg p-3 bg-white bg-opacity-10 text-white">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="flex gap-2 pt-2">
                    <Input
                        placeholder={isMinting ? "Minting your NFT..." : "Type your message..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="bg-white bg-opacity-20 text-white placeholder:text-white placeholder:opacity-50"
                        disabled={isMinting}
                    />
                    <Button
                        onClick={handleSendMessage}
                        className="bg-primary hover:bg-primary/90"
                        disabled={isMinting}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};