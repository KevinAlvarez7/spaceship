'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChatInput } from './chat-input';
import { useChatStore } from '@/lib/store/chat-store';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MoveUpRight } from 'lucide-react';

const InitialChatInterface = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const chatStore = useChatStore()
  const { toast } = useToast()

  const handleSubmit = async (message: string) => {
    setIsLoading(true)
    try {
      // 1. Save the initial prompt to chat store
      await chatStore.sendMessage({
        content: message,
        role: 'user'
      })

      // 2. Mock API call - replace this with your actual API integration
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({ prompt: message }),
      // })
      
      // 3. Store the AI response
      await chatStore.sendMessage({
        content: "I'll help you create a prototype based on your requirements...",
        role: 'assistant'
      })

      // 4. Navigate to the chat interface
      router.push('/chat')

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to process your request. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full rounded-3xl bg-neutral-900 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-800 mb-4 border border-neutral-700"
          >
            <Image 
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" 
              alt="Rocket" 
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </motion.div>
          <h1 className="font-primary text-display-1 text-white mb-2">
            What can I help you ship?
          </h1>
          <p className="font-base text-body-lg text-stone-500">
            Don&apos;t worry, it&apos;s not rocket science.
          </p>
        </div>

        {/* Chat Input */}
        <ChatInput 
            onSubmit={handleSubmit}
            disabled={isLoading}
        />

        {/* Examples */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-neutral-600"
        >
          <p className="mb-2 text-center">Try these examples:</p>
          <div className="flex flex-wrap gap-2 justify-center ">
            {[
              "Create a dashboard to monitor citizen complaints",
              "Build a booking system for government facilities",
              "Design a survey form for public feedback"
            ].map((example, i) => (
              <Button
                key={i}
                onClick={() => handleSubmit(example)}
                variant="secondary"
                size="sm"
                iconPosition="trailing"
                className="text-neutral-500 hover:text-neutral-400"
              >
                <MoveUpRight className="w-4 h-4" />
                {example}
              </Button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InitialChatInterface;