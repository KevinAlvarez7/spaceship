import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, RotateCcw, Bug, GitBranchPlus } from 'lucide-react';
import { TypewriterText, TypewriterRef } from '@/components/ui/typewriter-text';
import { clarificationQuestions } from '@/app/main/chat/questions';

// Message type definitions
export type MessageRole = 'user' | 'assistant' | 'system';
export type SystemMessageType = 'version' | 'error';

export interface IBaseMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface IUserMessage extends IBaseMessage {
  role: 'user';
}

export interface IVersionSystemMessage extends IBaseMessage {
  role: 'system';
  type: 'version';
  version: string;
  features: string[];
}

export interface IErrorSystemMessage extends IBaseMessage {
  role: 'system';
  type: 'error';
}

export type SystemMessage = IVersionSystemMessage | IErrorSystemMessage;

export interface IClarificationMessage extends IBaseMessage {
  role: 'assistant';
  question: string;
  onYes: () => void;
  onNo: () => void;
}

// Message Container
const MessageContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

// User Message
export const UserMessage = ({ content }: { content: string }) => (
  <MessageContainer>
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-neutral-800 text-neutral-300 p-4 rounded-xl">
        <div className="text-body font-base">{content}</div>
      </div>
    </div>
  </MessageContainer>
);

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000); // diff in seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours} hr ${minutes} min ago`;
};

// Version Update Message
export const VersionMessage = ({ version, features, timestamp }: { 
  version: string, 
  features: string[], 
  timestamp: Date 
}) => (
  <MessageContainer>
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-stone-800 bg-stone-950">
        <div className="flex flex-row gap-4">
            <div className="p-2 rounded-lg border border-stone-800 w-fit h-fit bg-stone-900">
                <GitBranchPlus className="w-4 h-4 text-stone-300" />
            </div>
        <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
            <div className="text-body-sm font-base text-stone-400">Version {version} created</div>
            </div>
            <div className="text-body-sm font-base text-stone-400">•</div>
            <div className="text-body-sm font-base text-stone-400">{formatTimestamp(timestamp)}</div>
        </div>
        <div className="text-body-sm font-base text-stone-300">
            Implemented {features.join(', ')}
        </div>
        </div>
        </div>
        <div className="flex justify-end">
        <Button 
            variant="secondary" 
            size="sm"
            iconPosition="leading"
            className=""
        >
            <RotateCcw className="w-4 h-4" />
            Restore
        </Button>
        </div>

    </div>
  </MessageContainer>
);

// Error Message
export const ErrorMessage = ({ 
  content,
  onFix,
  onRestore,
  onReport 
}: { 
  content: string,
  onFix: () => void,
  onRestore: () => void,
  onReport: () => void
}) => (
  <MessageContainer>
    <div className="flex flex-col gap-2 border border-red-800 bg-neutral-950/30 p-4 rounded-xl">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <div className="text-body-sm text-red-500 font-base">Error occurred</div>
      </div>
      <div className="text-body-sm font-base text-red-300">{content}</div>
      <div className="flex gap-2 mt-2 justify-end">

        <Button variant="ghost-secondary" size="sm" onClick={onRestore} iconPosition="leading">
          <RotateCcw className="w-4 h-4" />
          Restore previous version
        </Button>
        <Button variant="ghost-secondary" size="sm" onClick={onReport} iconPosition="leading">
          <Bug className="w-4 h-4" />
          Report issue
        </Button>
        <Button variant="secondary" size="sm" onClick={onFix} iconPosition="leading">
          <Check className="w-4 h-4" />
          Fix error
        </Button>
      </div>
    </div>
  </MessageContainer>
);

// Clarification Message
export const ClarificationMessage = ({ 
  question,
  onYes,
  onNo,
  onQuestionsChange,
  version = '1'
}: { 
  question: string;
  onYes: (question: string) => void;
  onNo: (question: string) => void;
  onQuestionsChange?: (count: number) => void;
  version?: string;
}) => {
  const [visibleQuestions, setVisibleQuestions] = useState<string[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [showOutro, setShowOutro] = useState(false);
  const [outroCompleted, setOutroCompleted] = useState(false);
  const typewriterRef = useRef<TypewriterRef>(null);
  
  const selectedIntro = useMemo(() => {
    const introMessages = [
      `For version ${version}, I'll ask a few clarifying questions to better understand your requirements and provide tailored recommendations to enhance the application.`,
      `To make your carbon calculator more effective in version ${version}, I need to understand your preferences. I'll ask some questions to help customize the features.`,
      `Let's improve version ${version} together. I'll ask some questions to better understand your needs and suggest relevant enhancements.`,
      `To optimize version ${version}, I'd like to explore some potential features with you through a few questions.`,
      `I have some ideas for version ${version}. Let me ask you a few questions to ensure we're aligned on the improvements.`,
      `Before proceeding with version ${version}, I'd like to understand your preferences better through some quick questions.`,
      `For the next iteration (version ${version}), I'll need your input on a few key features.`,
      `To make version ${version} even better, let's go through some quick questions about potential improvements.`,
      `I've prepared some questions to help shape version ${version} according to your needs.`
    ];
    return introMessages[Math.floor(Math.random() * introMessages.length)];
  }, [version]);

  const selectedOutro = useMemo(() => {
    const outroMessages = [
      "Please take your time. Your choices will help shape the features that best suit your needs. Feel free to make any changes or request additional modifications.",
      "Your decisions will guide the development of the calculator. Don't hesitate to suggest any other features or changes you'd like to see.",
      "Your input is valuable in creating the right solution for you. Let me know if you'd like to explore other possibilities.",
      "I'll incorporate your preferences into the next iteration. Feel free to suggest any additional features or modifications you'd like to see.",
      "Your feedback helps create a more tailored solution. Don't hesitate to request further adjustments or explore new features.",
      "These choices will help refine the application. Remember, you can always request changes or suggest new features as we progress.",
      "I'll adapt the solution based on your responses. Feel free to share any other ideas or modifications you have in mind.",
      "Your input shapes the development process. Let me know if you want to explore additional features or make any adjustments.",
      "We can continue to refine the solution based on your needs. Don't hesitate to suggest more features or request changes."
    ];
    return outroMessages[Math.floor(Math.random() * outroMessages.length)];
  }, []);

  const questions = useMemo(() => {
    const randomCount = Math.floor(Math.random() * 3) + 2; // Random number between 1-3
    return [question, ...clarificationQuestions
      .filter(q => q !== question)
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCount - 1)]; // Subtract 1 because we already include the initial question
  }, [question]);

  // Track all content changes
  useEffect(() => {
    const totalElements = [
      showIntro ? 1 : 0,
      ...visibleQuestions,
      showOutro ? 1 : 0
    ].filter(Boolean).length;

    // Notify parent of content changes
    onQuestionsChange?.(totalElements);
  }, [showIntro, visibleQuestions, showOutro, onQuestionsChange]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setVisibleQuestions([questions[0]]);
      onQuestionsChange?.(1); // Force scroll after intro
    }, 100);
  };

  const handleTypingComplete = (completedQuestion: string) => {
    setCompletedQuestions(prev => [...prev, completedQuestion]);
    const nextIndex = visibleQuestions.length;
    
    if (nextIndex < questions.length) {
      setTimeout(() => {
        setVisibleQuestions(prev => [...prev, questions[nextIndex]]);
        onQuestionsChange?.(nextIndex + 2); // +2 for intro and new question
      }, 500);
    } else if (nextIndex === questions.length) {
      setShowOutro(true);
      onQuestionsChange?.(nextIndex + 2); // +2 for intro and outro
    }
  };

  const handleOutroComplete = () => {
    setOutroCompleted(true);
    onQuestionsChange?.(visibleQuestions.length + 2); // Final scroll
  };

  const handleButtonClick = (response: 'Yes' | 'No', q: string) => {
    // Force complete current typewriter
    typewriterRef.current?.complete();
    
    if (response === 'Yes') {
      onYes(q);
    } else {
      onNo(q);
    }
    setCompletedQuestions(prev => [...prev, q]);
  };

  return (
    <MessageContainer>
      <div className="flex flex-col gap-4">
        {showIntro ? (
          <TypewriterText 
            text={selectedIntro}
            speed={10}
            className="text-body font-base text-stone-300"
            onComplete={handleIntroComplete}
          />
        ) : (
          <div className="text-body font-base text-stone-300">{selectedIntro}</div>
        )}
        
        {!showIntro && visibleQuestions.map((q, index) => (
          <div key={index} className="w-fit flex gap-4 p-4">
            <div className="text-body font-base text-stone-300">
              {index + 1}.
            </div>
            <div className="flex flex-col gap-3">
              {completedQuestions.includes(q) ? (
                <div className="text-body font-base text-stone-300" id={`question-${index}`}>
                  {q}
                </div>
              ) : (
                <TypewriterText 
                  ref={typewriterRef}
                  text={q}
                  speed={30} 
                  className="text-body font-base text-stone-300"
                  onComplete={() => handleTypingComplete(q)}
                />
              )}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleButtonClick('Yes', q)}>
                  Yes
                </Button>
                <Button variant="secondary" onClick={() => handleButtonClick('No', q)}>
                  No
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2 border border-stone-800">
        </div>

        {showOutro && (
          outroCompleted ? (
            <div className="text-body font-base text-stone-300">{selectedOutro}</div>
          ) : (
            <TypewriterText 
              text={selectedOutro}
              speed={10}
              className="text-body font-base text-stone-300"
              onComplete={handleOutroComplete}
            />
          )
        )}
      </div>
    </MessageContainer>
  );
};

// Thinking Message
export const ThinkingMessage = () => (
  <MessageContainer>
    <div className="flex items-center gap-2 mt-10 mb-10">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-2 h-2 bg-stone-400 rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
        className="w-2 h-2 bg-stone-400 rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4
        }}
        className="w-2 h-2 bg-stone-400 rounded-full"
      />
      <span className="text-body-sm font-base text-stone-400">Space is thinking</span>
    </div>
  </MessageContainer>
);

// Type guard functions
const isSystemMessage = (message: IBaseMessage | SystemMessage | IClarificationMessage): message is SystemMessage => {
  return message.role === 'system';
};

const isClarificationMessage = (message: IBaseMessage | SystemMessage | IClarificationMessage): message is IClarificationMessage => {
  return message.role === 'assistant' && 'question' in message;
};

export const MessageList = ({ 
  messages, 
  onYes, 
  onNo, 
  onFix,
  onRestore,
  onReport,
  onQuestionsChange
}: { 
  messages: (IBaseMessage | SystemMessage | IClarificationMessage)[];
  onYes: (question: string) => void;
  onNo: (question: string) => void;
  onFix: () => void;
  onRestore: () => void;
  onReport: () => void;
  onQuestionsChange?: (count: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-10 ">
      {messages.map((message) => {
        switch (message.role) {
          case 'user':
            return <UserMessage key={message.id} content={message.content} />;
          case 'system':
            if (isSystemMessage(message) && message.type === 'version') {
              return (
                <VersionMessage 
                  key={message.id}
                  version={message.version || '1'}
                  features={message.features || []}
                  timestamp={message.timestamp}
                />
              );
            } else {
              return (
                <ErrorMessage
                  key={message.id}
                  content={message.content}
                  onFix={onFix}
                  onRestore={onRestore}
                  onReport={onReport}
                />
              );
            }
          case 'assistant':
            if (isClarificationMessage(message)) {
              return (
                <ClarificationMessage
                  key={message.id}
                  question={message.question}
                  onYes={onYes}
                  onNo={onNo}
                  onQuestionsChange={onQuestionsChange}
                  version={message.content.split(' ')[1]}
                />
              );
            }
            return null;
          default:
            return null;
        }
      })}
    </div>
  );
};