interface ProjectCardProps {
  title?: string;
  description?: string;
  emoji?: string;
  onClick?: () => void;
  variant?: 'default' | 'minimal';
}

export function ProjectCard({ 
  title, 
  description, 
  emoji, 
  onClick, 
  variant = 'default' 
}: ProjectCardProps) {
  if (variant === 'minimal') {
    return (
      <div 
        onClick={onClick}
        className="p-2 rounded-md bg-stone-900 hover:bg-stone-800 cursor-pointer transition-colors"
      >
        <div className="flex items-center justify-center">
          {emoji && <span className="text-sm h-4 w-4 flex items-center justify-center">
            {emoji}
            </span>}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="w-full p-3 rounded-md bg-stone-900 hover:bg-stone-800 cursor-pointer transition-colors"
    >
      <div className="flex flex-row gap-2">
        {emoji && <span className="text-lg flex-shrink-0">{emoji}</span>}
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-medium text-sm text-stone-500 truncate">{title}</h3>
          <p className="text-xs text-stone-600 truncate">{description}</p>
        </div>
      </div>
    </div>
  );
} 