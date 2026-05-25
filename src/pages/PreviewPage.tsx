import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Monitor, Smartphone, Tablet, Share2, Check, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeviceMockup from '@/components/features/DeviceMockup';
import { fetchProjects, fetchProjectById } from '@/lib/projectsApi';
import { Project } from '@/types/project';

const deviceIcons = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const PreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchProjectById(id), fetchProjects()])
      .then(([proj, all]) => {
        setProject(proj);
        setOtherProjects(all.filter(p => p.id !== id).slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Project not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const DeviceIcon = deviceIcons[project.deviceType];

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col">
      {/* Top bar */}
      <div className="glass-strong border-b border-border/50 px-4 py-3 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border/60" />
            <div className="flex items-center gap-2">
              <DeviceIcon className="w-4 h-4 text-primary" />
              <div>
                <h1 className="font-semibold text-sm text-foreground leading-none">{project.title}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{project.category}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="hidden sm:inline text-xs px-2 py-1 bg-secondary/70 text-muted-foreground rounded-md border border-border/50">
                {tag}
              </span>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className={`gap-1.5 border text-xs font-medium transition-all ${copied ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-border/60 text-muted-foreground hover:text-foreground'}`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Share Link'}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview area — fixed height, never scrolls */}
      <div
        className="relative bg-gradient-to-b from-background to-muted/20"
        style={{ height: 'calc(100vh - 112px)', overflow: 'hidden' }}
      >
        {/* Ambient glows (desktop only) */}
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Mockup fills remaining space */}
        <div className="relative z-10 w-full h-full flex items-center justify-center md:px-4 md:py-4">
          <DeviceMockup project={project} />
        </div>
      </div>

      {/* More projects section */}
      {otherProjects.length > 0 && (
        <div className="border-t border-border/50 bg-card/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">More Projects to Explore</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary hover:text-primary/80 gap-1 text-xs"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {otherProjects.map(p => {
                const Icon = deviceIcons[p.deviceType];
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/preview/${p.id}`)}
                    className="group glass rounded-xl p-3 border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2.5 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {p.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{p.deviceType}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
