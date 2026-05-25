import { useState, useMemo, useEffect } from 'react';
import { Search, Layers, Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProjectCard from '@/components/features/ProjectCard';
import { fetchProjects } from '@/lib/projectsApi';
import type { Project } from '@/types/project';
import kennyImg from '@/assets/kenny.jpg';

const filterOptions = [
  { label: 'All', value: 'all', icon: Layers },
  { label: 'Web Apps', value: 'desktop', icon: Monitor },
  { label: 'Mobile', value: 'mobile', icon: Smartphone },
  { label: 'Tablet', value: 'tablet', icon: Tablet },
];

const Index = () => {
  const [search, setSearch] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesDevice = deviceFilter === 'all' || p.deviceType === deviceFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      return matchesDevice && matchesSearch;
    });
  }, [projects, search, deviceFilter]);

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${kennyImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-accent/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-medium text-primary border border-primary/30 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            Interactive Project Previews
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/40 shadow-2xl">
              <img src={kennyImg} alt="Kenny" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            GOOX <span className="gradient-text">Project Showcase</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore and interact with the projects we've built. Each preview is fully functional — try it yourself.
          </p>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 h-12 glass-strong border-border/60 focus:border-primary/60 bg-transparent text-base"
              />
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {filterOptions.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDeviceFilter(opt.value)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                      deviceFilter === opt.value
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'glass border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">No projects found matching your search.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-5">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {featured.map(p => <ProjectCard key={p.id} project={p} featured />)}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-5">All Projects</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
