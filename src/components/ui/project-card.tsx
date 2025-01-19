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
        className="p-2 rounded-md bg-stone-800 hover:bg-stone-600 cursor-pointer transition-colors"
      >
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 relative">
            <Image
              src={icon}
              alt="Project icon"
              fill
              className="object-contain"
              unoptimized={true}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="w-full p-3 rounded-md bg-neutral-800 hover:bg-neutral-600 cursor-pointer transition-colors"
    >
      <div className="flex flex-row gap-2">
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 relative">
            <Image
              src={icon}
              alt="Project icon"
              fill
              className="object-contain"
              unoptimized={true}
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