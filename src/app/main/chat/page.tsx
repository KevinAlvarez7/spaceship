'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/chat/chat-input';
import { 
  MessageList, 
  ThinkingMessage, 
  SystemMessage, 
  IBaseMessage, 
  IUserMessage, 
  IVersionSystemMessage, 
  IClarificationMessage 
} from '@/components/chat/message-components';
import { v4 as uuidv4 } from 'uuid';
import CarbonCalculator from '@/components/preview/carbon-calculator-preview';

const ChatPage = () => {
// Initial state type
const [messages, setMessages] = useState<(IBaseMessage | SystemMessage | IClarificationMessage)[]>([
  // Initial message
  {
    id: '1',
    role: 'user',
    content: 'Create a carbon calculator app',
    timestamp: new Date()
  }
]);

  const [isLoading, setIsLoading] = useState(false);

  const chatInputRef = useRef<{ handleYesNoResponse: (question: string, response: 'Yes' | 'No') => void }>(null);

  const handleYes = (question: string) => {
    chatInputRef.current?.handleYesNoResponse(question, 'Yes');
  };

  const handleNo = (question: string) => {
    chatInputRef.current?.handleYesNoResponse(question, 'No');
  };

  const simulateThinking = (callback: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 2000);
  };

  // Initial simulation when component mounts
  useEffect(() => {
    simulateThinking(() => {
      // Add version update
      const versionMessage: IVersionSystemMessage = {
        id: uuidv4(),
        role: 'system',
        type: 'version',
        content: 'Created version 1 with basic carbon calculator functionality',
        version: '1',
        features: [
          'Basic calculator layout',
          'Carbon footprint metrics',
          'Input validation'
        ],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, versionMessage]);

      // Add clarification question
      simulateThinking(() => {
        const clarificationMessage: IClarificationMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Checking requirements',
          question: 'Would you like to include transportation emissions in the calculator?',
          onYes: () => {},
          onNo: () => {},
          timestamp: new Date()
        };
        setMessages(prev => [...prev, clarificationMessage]);
      });
    });
  }, []); // Empty dependency array means this runs once when component mounts

  const handleSubmit = async (message: string) => {
      // User message
      const userMessage: IUserMessage = {
        id: uuidv4(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI thinking and response
    simulateThinking(() => {
      // Add version update
      // Version message
      const versionMessage: IVersionSystemMessage = {
        id: uuidv4(),
        role: 'system',
        type: 'version',
        content: 'Created version 1 with basic form functionality',  // Add this line
        version: '1',
        features: [
          'Basic form layout',
          'Input validation',
          'Submission handling'
        ],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, versionMessage]);

      // Add clarification question
      simulateThinking(() => {
        const clarificationMessage: IClarificationMessage = {
          id: uuidv4(),
          role: 'assistant' as const,
          content: 'Content here',  // Add this line
          question: 'Should I add email notification for form submissions?',
          onYes: () => {},
          onNo: () => {},
          timestamp: new Date()
        };
        setMessages(prev => [...prev, clarificationMessage]);
      });
    });
  };

  return (
    <div className="flex w-full h-full bg-neutral-900 rounded-3xl overflow-hidden">
      {/* Chat Panel */}
      <div className="w-2/5 h-full border-r border-neutral-800">
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex-none min-h-[68px] border-b border-neutral-800">
            <div className="flex items-center p-4">
              <h2 className="font-primary text-h2 font-medium text-stone-100">
                Carbon Calculator
              </h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 h-full overflow-y-auto p-4">
            <div className="flex flex-col">
              <MessageList 
                messages={messages}
                onYes={handleYes}
                onNo={handleNo}
              />
              {isLoading && <ThinkingMessage />}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex-none p-4 border-t border-neutral-800">
              <ChatInput 
                ref={chatInputRef}
                onSubmit={handleSubmit}
                disabled={isLoading}
                isInitialChat={false}
              />
            </div>
          </div>
        </div>

      {/* Preview Panel */}
      <div className="w-3/5 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-none min-h-[68px] border-b border-neutral-800">
            <div className="flex items-center justify-between p-4">
              <h2 className="font-primary text-h2 font-medium text-stone-100">Preview</h2>
              <div className="flex items-center gap-2">
                <Button variant="secondary" iconPosition="leading">
                  <GitBranch className="w-4 h-4" />
                  Latest Version
                </Button>
                <Button variant="secondary" iconPosition="leading">
                  <MousePointerClick className="w-4 h-4" />
                  Edit Elements
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-stone-800 p-4">
            <div className="flex-1 overflow-auto rounded-3xl">
                <CarbonCalculator isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;