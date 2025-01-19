import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, RotateCcw, Bug } from 'lucide-react';
import { TypewriterText } from '@/components/ui/typewriter-text';

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
    className="w-full py-4"
  >
    {children}
  </motion.div>
);

// User Message
export const UserMessage = ({ content }: { content: string }) => (
  <MessageContainer>
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-cyan-900 text-cyan-100 rounded-2xl rounded-tr-sm px-4 py-2">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  </MessageContainer>
);

// Version Update Message
export const VersionMessage = ({ version, features }: { version: string, features: string[] }) => (
  <MessageContainer>
    <div className="flex flex-col gap-2 max-w-[80%] bg-stone-800 rounded-2xl rounded-tl-sm p-4">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <h5 className="text-stone-100">Version {version} created</h5>
      </div>
      <p className="text-sm text-stone-400">Features included:</p>
      <ul className="text-sm text-stone-300 list-disc pl-4 space-y-1">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <Button 
        variant="ghost-secondary" 
        size="sm"
        iconPosition="leading"
        className="self-start mt-2"
      >
        <RotateCcw className="w-4 h-4" />
        Restore to this version
      </Button>
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
    <div className="flex flex-col gap-2 max-w-[80%] bg-red-950 rounded-2xl rounded-tl-sm p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h5 className="text-red-200">Error occurred</h5>
      </div>
      <p className="text-sm text-red-300">{content}</p>
      <div className="flex gap-2 mt-2">
        <Button 
          variant="ghost-secondary" 
          size="sm" 
          onClick={onFix}
          iconPosition="leading"
        >
          <Check className="w-4 h-4" />
          Fix error
        </Button>
        <Button 
          variant="ghost-secondary" 
          size="sm" 
          onClick={onRestore}
          iconPosition="leading"
        >
          <RotateCcw className="w-4 h-4" />
          Restore version
        </Button>
        <Button 
          variant="ghost-secondary" 
          size="sm" 
          onClick={onReport}
          iconPosition="leading"
        >
          <Bug className="w-4 h-4" />
          Report issue
        </Button>
      </div>
    </div>
  </MessageContainer>
);

// Clarification Message
export const ClarificationMessage = ({ 
    question,
    onYes,
    onNo 
  }: { 
    question: string;
    onYes: (question: string) => void;
    onNo: (question: string) => void;
  }) => (
    <MessageContainer>
      <div className="flex flex-col gap-3 max-w-[80%] bg-stone-800 rounded-2xl rounded-tl-sm p-4">
        <TypewriterText text={question} speed={30} />
        <div className="flex gap-2">
          <Button 
            variant="ghost-secondary" 
            size="sm" 
            onClick={() => onYes(question)}
          >
            Yes
          </Button>
          <Button 
            variant="ghost-secondary" 
            size="sm" 
            onClick={() => onNo(question)}
          >
            No
          </Button>
        </div>
      </div>
    </MessageContainer>
  );

// Thinking Message
export const ThinkingMessage = () => (
  <MessageContainer>
    <div className="flex items-center gap-2 max-w-[80%] bg-stone-800 rounded-2xl rounded-tl-sm p-4">
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
      <span className="text-sm text-stone-400">Space is thinking</span>
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

export const MessageList = ({ messages, onYes, onNo }: { 
  messages: (IBaseMessage | SystemMessage | IClarificationMessage)[],
  onYes: (question: string) => void,
  onNo: (question: string) => void
}) => {
  return (
    <div className="flex flex-col gap-4">
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
                />
              );
            } else {
              return (
                <ErrorMessage
                  key={message.id}
                  content={message.content}
                  onFix={() => console.log('Fix error')}
                  onRestore={() => console.log('Restore version')}
                  onReport={() => console.log('Report issue')}
                />
              );
            }
          case 'assistant':
            if (isClarificationMessage(message)) {
              return (
                <ClarificationMessage
                  key={message.id}
                  question={message.question}
                  onYes={() => onYes(message.question)}
                  onNo={() => onNo(message.question)}
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