import { create } from 'zustand'

interface Message {
  content: string
  role: 'user' | 'assistant'
}

interface ChatStore {
  messages: Message[]
  sendMessage: (message: Message) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  sendMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  clearMessages: () => set({ messages: [] })
}))
