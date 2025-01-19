'use client';

import { useState } from 'react';
import { PanelsTopLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ui/project-card';
import memoIcon from '@/assets/memo_3d.png';
import chartIcon from '@/assets/chart_increasing_3d.png';
import plugIcon from '@/assets/electric_plug_3d.png';

const OpenSidebar = ({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) => (
  <div className="p-4">
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-primary text-2xl text-stone-100">Projects</h2>
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
        icon={memoIcon}
        title="Create a Form"
        description="Build a simple feedback form"
      />
      <ProjectCard
        icon={chartIcon}
        title="Dashboard"
        description="Design a metrics dashboard"
      />
      <ProjectCard
        icon={plugIcon}
        title="API Integration"
        description="Connect to a REST API"
      />
    </motion.div>
  </div>
);

const ClosedSidebar = ({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) => (
  <div className="p-4 flex flex-col items-center gap-4">
    <Button
      variant="ghost-secondary"
      size="icon"
      onClick={() => setSidebarOpen(true)}
    >
      <PanelsTopLeft className="h-5 w-5" />
    </Button>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
      <ProjectCard
        icon={memoIcon}
        variant="minimal"
      />
      <ProjectCard
        icon={chartIcon}
        variant="minimal"
      />
      <ProjectCard
        icon={plugIcon}
        variant="minimal"
      />
    </motion.div>
  </div>
);

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
      {children}
    </div>
  );
}
