import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  className?: string;
  isInitialChat?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export interface ChatInputRef {
  handleYesNoResponse: (question: string, response: 'Yes' | 'No') => void;
}

const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  onSubmit,
  disabled = false,
  className = '',
  isInitialChat = false,
  value,
  onChange
}, ref) => {
  const [message, setMessage] = useState(value || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholders = [
    "I need to create a secure document submission portal...",
    "Help me design an accessible citizen feedback system...",
    "How do I implement multi-factor authentication for government staff...",
    "Create a public service announcement notification system...",
    "Build a permit application tracking system...",
    // ... other placeholders
  ];

  const useTypewriter = (texts: string[], typingSpeed = 50, deletingSpeed = 30, pauseTime = 3000) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
      let timeout: NodeJS.Timeout;

      if (isTyping) {
        if (displayText === texts[currentIndex]) {
          setIsTyping(false);
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, pauseTime);
        } else {
          timeout = setTimeout(() => {
            setDisplayText(texts[currentIndex].slice(0, displayText.length + 1));
          }, typingSpeed);
        }
      } else {
        if (displayText === '') {
          setCurrentIndex((current) => (current + 1) % texts.length);
          setIsTyping(true);
        } else {
          timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, deletingSpeed);
        }
      }

      return () => clearTimeout(timeout);
    }, [displayText, isTyping, currentIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

    return displayText;
  };

  const animatedPlaceholder = useTypewriter(placeholders);
  const staticPlaceholder = "Type your instructions to refine or modify the prototype...";

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSubmit(message.trim())
      setMessage('')
    }
  }

  useImperativeHandle(ref, () => ({
    handleYesNoResponse: (question: string, response: 'Yes' | 'No') => {
      const newMessage = `${question} ${response}`;
      setMessage(newMessage);
      onChange?.(newMessage);
    }
  }));

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={`flex flex-col bg-neutral-800 border border-neutral-700 rounded-2xl p-4 ${className}`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onChange?.(e.target.value);
          }}
          placeholder={isInitialChat ? animatedPlaceholder : staticPlaceholder}
          className="
            w-full min-h-[120px] text-white text-base font-base leading-normal
            placeholder:text-neutral-500 
            placeholder:text-base 
            placeholder:font-base 
            placeholder:leading-normal
            bg-neutral-800 resize-none focus:outline-none
          "
          disabled={disabled}
        />
        <div className="w-full justify-end flex gap-2">
          <div className="flex gap-2">
            {isInitialChat && (
              <Button
                type="button"
                variant="ghost-secondary"
                disabled={disabled || !message.trim()}
              >
                Improve prompt
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              iconPosition="trailing"
              disabled={disabled || !message.trim()}
            >
              <Send className="h-4 w-4" />
              {isInitialChat ? 'Build it' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </motion.form>
  )
})

ChatInput.displayName = 'ChatInput';

export { ChatInput };