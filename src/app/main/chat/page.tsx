'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GitBranch, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInput, ChatInputRef } from '@/components/chat/chat-input';
import { 
  MessageList, 
  ThinkingMessage, 
  SystemMessage, 
  IBaseMessage, 
  IUserMessage, 
  IVersionSystemMessage, 
  IClarificationMessage, 
  IErrorSystemMessage 
} from '@/components/chat/message-components';
import { v4 as uuidv4 } from 'uuid';
import CarbonCalculator from '@/components/preview/carbon-calculator-preview';
import { clarificationQuestions } from './questions';

const ChatPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [clarificationCount, setClarificationCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // Initial state type
  const [messages, setMessages] = useState<(IBaseMessage | SystemMessage | IClarificationMessage | IErrorSystemMessage)[]>([
    // Initial message
    {
      id: '1',
      role: 'user',
      content: 'Create a carbon calculator app',
      timestamp: new Date()
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(1);

  const chatInputRef = useRef<ChatInputRef>(null);

  const handleYes = (question: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.handleYesNoResponse(question, 'Yes', true);
    }
  };

  const handleNo = (question: string) => {
    if (chatInputRef.current) {
      chatInputRef.current.handleYesNoResponse(question, 'No', true);
    }
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
      // Increment version
      const newVersion = currentVersion + 1;
      setCurrentVersion(newVersion);

      // Version message
      const versionMessage: IVersionSystemMessage = {
        id: uuidv4(),
        role: 'system',
        type: 'version',
        content: `Version ${newVersion} created`,
        version: newVersion.toString(),
        features: [
          'Basic form layout',
          'Input validation',
          'Submission handling'
        ],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, versionMessage]);

      // Check if we've reached the clarification limit
      if (clarificationCount >= 2) { // Change to 2 since we're counting from 0
        // Show error message
        simulateThinking(() => {
          const errorMessage: IErrorSystemMessage = {
            id: uuidv4(),
            role: 'system',
            type: 'error',
            content: 'The application has encountered an error while processing your request. Restore to a previous version or ask Spaceship to fix the issue. You can also report the issue to the support team.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        });
      } else {
        // Add clarification question
        simulateThinking(() => {
          const nextQuestionIndex = (currentQuestionIndex + 1) % clarificationQuestions.length;
          setCurrentQuestionIndex(nextQuestionIndex);
          setClarificationCount(prev => prev + 1);

          const clarificationMessage: IClarificationMessage = {
            id: uuidv4(),
            role: 'assistant' as const,
            content: `Version ${newVersion} deployed`,
            question: clarificationQuestions[nextQuestionIndex],
            onYes: () => {},
            onNo: () => {},
            timestamp: new Date()
          };
          setMessages(prev => [...prev, clarificationMessage]);
        });
      }
    });
  };

  const handleFixError = () => {
    setIsLoading(true); // Start fixing animation
    
    setTimeout(() => {
      // Add version message with fix
      const versionMessage: IVersionSystemMessage = {
        id: uuidv4(),
        role: 'system',
        type: 'version',
        content: `Version ${currentVersion + 1} created with fixes`,
        version: (currentVersion + 1).toString(),
        features: [
          'Error fixes applied',
          'System stability improvements',
          'Performance optimizations'
        ],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, versionMessage]);
      
      // Start thinking animation
      simulateThinking(() => {
        // Reset states
        setCurrentVersion(prev => prev + 1);
        setClarificationCount(0);
        setCurrentQuestionIndex(0);

        // Add new clarification question
        const clarificationMessage: IClarificationMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: `Version ${currentVersion + 1} created`,
          question: clarificationQuestions[0],
          onYes: () => {},
          onNo: () => {},
          timestamp: new Date()
        };
        setMessages(prev => [...prev, clarificationMessage]);
      });
    }, 2000); // Fixing animation duration
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end" 
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading, questionCount]); // Add questionCount to dependencies

  return (
    <div className="flex w-full h-full bg-neutral-900 rounded-3xl overflow-hidden">
      {/* Chat Panel */}
      <div className="w-2/5 h-full relative">
        <div className="flex flex-col h-full bg-transparent">
          {/* Chat Header */}
          <div className="flex-none min-h-[68px] border-b border-r border-neutral-800 bg-neutral-900">
            <div className="flex items-center p-4">
              <h2 className="font-primary text-h2 font-medium text-stone-100">
                Carbon Calculator
              </h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 h-full overflow-y-auto p-4 scroll-smooth scrollbar-custom bg-transparent">
            <div className="flex flex-col">
              <MessageList 
                messages={messages}
                onYes={handleYes}
                onNo={handleNo}
                onFix={handleFixError}
                onRestore={() => console.log('Restore version')}
                onReport={() => console.log('Report issue')}
                onQuestionsChange={setQuestionCount}
              />
              {isLoading && <ThinkingMessage />}
              <div ref={messagesEndRef} className="h-[1px]" />
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4">
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
          <div className="flex-1 bg-stone-800">
            <div className="h-full">
                <CarbonCalculator isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;