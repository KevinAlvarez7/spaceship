import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface ProjectCardProps {
  title?: string;
  description?: string;
  icon?: string | StaticImageData;
  onClick?: () => void;
  variant?: 'default' | 'minimal';
}

export function ProjectCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  variant = 'default' 
}: ProjectCardProps) {
  if (variant === 'minimal') {
    return (
      <div 
        onClick={onClick}
        className="p-2 rounded-md opacity-75 bg-stone-900 hover:opacity-100 cursor-pointer transition-colors"
      >
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 relative">
            <Image
              src={icon}
              alt="Project icon"
              fill
              className="object-contain"
              unoptimized={typeof icon === 'string'}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="w-full p-3 rounded-md opacity-75 hover:opacity-100 bg-stone-900 hover:bg-stone-800 cursor-pointer transition-colors"
    >
      <div className="flex flex-row gap-2">
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 relative">
            <Image
              src={icon}
              alt="Project icon"
              fill
              className="object-contain"
              unoptimized={typeof icon === 'string'}
            />
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-medium text-sm text-stone-200 truncate">{title}</h3>
          <p className="text-xs text-stone-400 truncate">{description}</p>
        </div>
      </div>
    </div>
  );
} 