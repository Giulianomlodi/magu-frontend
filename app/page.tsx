'use client'
import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import Test3DSpline from "@/components/3D/Test3DSpline";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Magu, your AI companion. I'll help you mint a unique NFT based on our conversation. Tell me about yourself!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (remove this when implementing real AI)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "That's interesting! Let me analyze your response to create a unique NFT that reflects your personality.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <section className="hero flex flex-col md:flex-row gap-2 md:gap-40 items-center justify-center px-5 md:px-[195px] pt-20 md:pt-40">
      <div className="md:w-1/2 flex items-center justify-center">
        <Card className="bg-blue bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 w-full max-w-2xl">
          <CardContent className="p-6 space-y-4">
            <ScrollArea className="h-[60vh] pr-4" ref={scrollAreaRef}>
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      {message.sender === 'ai' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/ai-avatar.png" />
                          <AvatarFallback className="bg-white">YG</AvatarFallback>
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
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-white bg-opacity-20 text-white placeholder:text-white placeholder:opacity-50"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={`md:w-1/2 ${isMobile ? 'h-[50vh] w-full overflow-hidden' : 'h-screen'} mt-8 md:mt-0 flex items-center justify-center`}>
        <div className={isMobile ? 'scale-[0.7] origin-center' : ''}>
          <Test3DSpline splineUrl={isMobile ? "https://prod.spline.design/MpvqM89Zj0fs2g57/scene.splinecode" : "https://prod.spline.design/MpvqM89Zj0fs2g57/scene.splinecode"} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;