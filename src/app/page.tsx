// src/app/page.tsx
'use client';

import InitialChatInterface from '@/components/chat/initial-chat'
import React from 'react';
import { PanelsTopLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card";

const OpenSidebar = ({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) => (
  <div className="p-4">
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-primary text-2xl text-stone-500">Projects</h2>
      <Button
        variant="ghost-secondary"
        size="icon"
        onClick={() => setSidebarOpen(false)}
        className="right-2"
      >
        <PanelsTopLeft className="h-5 w-5" />
      </Button>
    </div>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <ProjectCard
        emoji="📝"
        title="Create a Form"
        description="Build a simple feedback form"
      />
      <ProjectCard
        emoji="📊"
        title="Dashboard"
        description="Design a metrics dashboard"
      />
      <ProjectCard
        emoji="🔌"
        title="API Integration"
        description="Connect to a REST API"
      />
    </motion.div>
  </div>
);

const ClosedSidebar = ({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) => (
  <div className="p-4 flex flex-col items-center gap-4">
    <div className="flex flex-col items-center">
      <Button
        variant="ghost-secondary"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className=""
      >
        <PanelsTopLeft className="h-5 w-5" />
      </Button>
    </div>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <ProjectCard
        emoji="📝"
        variant="minimal"
      />
      <ProjectCard
        emoji="📊"
        variant="minimal"
      />
      <ProjectCard
        emoji="🔌"
        variant="minimal"
      />
    </motion.div>
  </div>
);

const LandingLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-row gap-5 p-5 h-screen bg-neutral-950">
      <motion.div 
        initial={false}
        animate={{
          width: isSidebarOpen ? '16rem' : '3rem'
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 18
        }}
        className="relative bg-neutral-950 overflow-hidden"
      >
        {isSidebarOpen ? 
          <OpenSidebar setSidebarOpen={setSidebarOpen} /> : 
          <ClosedSidebar setSidebarOpen={setSidebarOpen} />
        }
      </motion.div>

      {/* Main Content */}
      <InitialChatInterface />
    </div>
  );
};

export default LandingLayout;