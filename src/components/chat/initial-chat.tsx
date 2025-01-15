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
import rocketAnimation from '@/assets/rocket_animated.png';
import CustomCursorFollow from '@/components/ui/custom-cursor-follow';

const InitialChatInterface = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const chatStore = useChatStore()
  const { toast } = useToast()
  const [animationComplete, setAnimationComplete] = useState(false);

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
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ease: "circOut",
          duration: 0.7
        }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <motion.div
            initial={{ scale: 0, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              delay: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 50,
              mass: 2
            }}
            onAnimationComplete={() => setAnimationComplete(true)}
            className={`flex items-center justify-center w-40 h-20 rounded-full mb-4 relative ${
              !animationComplete ? 'pointer-events-none' : ''
            }`}
          >
            <CustomCursorFollow 
              cursorImageSrc="/assets/crossed_fingers_animated_medium.png"
              className={`cursor-none flex items-center justify-center w-full h-full ${
                !animationComplete ? 'pointer-events-none' : ''
              }`}
            >
              <motion.div
                className="flex items-center justify-center w-full h-full"
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 50,
                  mass: 2,
                  delay: 0.2
                }}
                whileHover={{ 
                  rotate: -45,
                  scale: 1.5,
                  transition: {
                    scale: {
                      type: "spring",
                      stiffness: 100,
                      damping: 50,
                      mass: 2
                    },
                    rotate: {
                      type: "spring",
                      stiffness: 150,
                      damping: 50,
                      mass: 2
                    },
                    delay: 0.15
                  }
                }}
              >
                <Image 
                  src={rocketAnimation}
                  alt="Rocket" 
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  draggable={false}
                  priority
                />
              </motion.div>
            </CustomCursorFollow>
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
          transition={{ delay: 0.4 }}
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