import { useNavigate } from 'react-router-dom';
import { Monitor, Smartphone, Tablet, ArrowRight, Star } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const deviceLabels = {
  desktop: 'Web App',
  mobile: 'Mobile App',
  tablet: 'Tablet App',
};

const ProjectCard = ({ project, featured }: ProjectCardProps) => {
  const navigate = useNavigate();
  const DeviceIcon = deviceIcons[project.deviceType];

  return (
    <div
      onClick={() => navigate(`/preview/${project.id}`)}
      className={`group relative glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:glow border border-border/50 hover:border-primary/40 ${
        featured ? 'ring-1 ring-primary/30' : ''
      }`}
    >
      {featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/30">
          <Star className="w-3 h-3 fill-current" />
          Featured
        </div>
      )}

      {/* Preview thumbnail area */}
      <div className="relative bg-gradient-to-br from-secondary to-muted aspect-video flex items-center justify-center overflow-hidden">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Device mockup mini */}
        <div
          className={`relative z-10 flex flex-col items-center ${
            project.deviceType === 'mobile'
              ? 'w-20 h-36'
              : project.deviceType === 'tablet'
              ? 'w-28 h-36'
              : 'w-48 h-28'
          } phone-frame rounded-${project.deviceType === 'desktop' ? 'lg' : '2xl'} overflow-hidden group-hover:scale-105 transition-transform duration-300`}
        >
          {project.deviceType !== 'desktop' && (
            <div className="w-full flex justify-center py-1.5">
              <div className="w-8 h-1 bg-white/20 rounded-full" />
            </div>
          )}
          {project.deviceType === 'desktop' && (
            <div className="w-full flex items-center gap-1 px-2 py-1.5 border-b border-white/10">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
              </div>
            </div>
          )}
          <div className="flex-1 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <DeviceIcon className="w-6 h-6 text-primary/60" />
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
          <div className="flex-shrink-0 flex items-center gap-1 text-muted-foreground text-xs border border-border/60 rounded-md px-2 py-0.5">
            <DeviceIcon className="w-3 h-3" />
            {deviceLabels[project.deviceType]}
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-secondary/80 text-muted-foreground rounded-md border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Preview
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
