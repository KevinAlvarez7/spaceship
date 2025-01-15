'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChatStore } from '@/lib/store/chat-store';

export default function PrototypePage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  const [isLoading, setIsLoading] = useState(true);
  const chatStore = useChatStore();

  useEffect(() => {
    const initializeChat = async () => {
      if (prompt) {
        await chatStore.sendMessage({
          content: prompt,
          role: 'user'
        });
        
        await chatStore.sendMessage({
          content: "I'll help you create a prototype based on your requirements...",
          role: 'assistant'
        });
      }
      setIsLoading(false);
    };

    initializeChat();
  }, [prompt, chatStore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Prototype View</h1>
        <div className="bg-neutral-800 rounded-lg p-4">
          <pre className="text-neutral-300">
            {prompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
