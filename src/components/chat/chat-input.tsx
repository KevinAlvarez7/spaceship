import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  className?: string
}

const useTypewriter = (texts: string[], typingSpeed = 50, deletingSpeed = 30, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText === texts[currentIndex]) {
        // Finished typing current text, wait before starting to delete
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseTime);
      } else {
        // Type next character
        timeout = setTimeout(() => {
          setDisplayText(texts[currentIndex].slice(0, displayText.length + 1));
        }, typingSpeed);
      }
    } else {
      if (displayText === '') {
        // Finished deleting, move to next text
        setCurrentIndex((current) => (current + 1) % texts.length);
        setIsTyping(true);
      } else {
        // Delete next character
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
};

export const ChatInput = ({ 
  onSubmit, 
  disabled = false,
  className = ''
}: ChatInputProps) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const placeholders = [
    "I need to create a secure document submission portal...",
    "Help me design an accessible citizen feedback system...",
    "How do I implement multi-factor authentication for government staff...",
    "Create a public service announcement notification system...",
    "Build a permit application tracking system...",
    "Design a secure internal communication platform...",
    "Develop a citizen service request management system...",
    "Create a public records search interface...",
    "Implement a secure document verification system...",
    "Build an emergency alert notification system..."
  ];

  const placeholder = useTypewriter(
    placeholders,
    50,    // typing speed (ms)
    30,    // deleting speed (ms)
    2000   // pause time between texts (ms)
  );

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

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={`bg-neutral-800 border border-neutral-700 rounded-xl p-4 ${className}`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[120px] text-white placeholder-neutral-700 bg-transparent rounded-lg resize-none focus:outline-none"
          disabled={disabled}
        />
        <div className="absolute bottom-0 right-0 flex gap-2">
          <Button
            type="button"
            variant="ghost-secondary"
            disabled={disabled || !message.trim()}
          >
            Improve prompt
          </Button>
          <Button
            type="submit"
            variant="primary"
            iconPosition="trailing"
            disabled={disabled || !message.trim()}
          >
            <Send className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>
    </motion.form>
  )
}

export default ChatInput