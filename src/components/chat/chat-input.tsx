import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  className?: string
}

export const ChatInput = ({ 
  onSubmit, 
  disabled = false,
  className = ''
}: ChatInputProps) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      transition={{ delay: 0.4 }}
      className={`bg-neutral-800 border border-neutral-700 rounded-xl p-4 ${className}`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full min-h-[120px] text-white placeholder-neutral-700 bg-transparent rounded-lg resize-none focus:outline-none"
          disabled={disabled}
        />
        <div className="absolute bottom-0 right-0 flex gap-2">
          <Button
            type="button"
            variant="ghost-secondary"
            disabled={disabled}
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