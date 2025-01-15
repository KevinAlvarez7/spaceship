'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store/chat-store';

export default function ChatPage() {
  const router = useRouter();
  const messages = useChatStore((state) => state.messages);

  useEffect(() => {
    if (messages.length === 0) {
      router.push('/');
    }
  }, [messages, router]);

  return (
    <div className="flex flex-col h-screen bg-neutral-900">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
