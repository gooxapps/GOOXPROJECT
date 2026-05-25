import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, LogOut, Star, Monitor, Smartphone, Tablet, Key, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminProjectForm from '@/components/features/AdminProjectForm';
import { fetchProjects, createProject, editProject, removeProject } from '@/lib/projectsApi';
import { verifyPin, setAdminLoggedIn, isAdminLoggedIn, setAdminPin } from '@/lib/storage';
import { Project } from '@/types/project';
import { toast } from 'sonner';

const deviceIcons = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin');
      return;
    }
    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    setLoading(true);
    fetchProjects()
      .then(setProjects)
      .catch(e => toast.error('Failed to load projects: ' + e.message))
      .finally(() => setLoading(false));
  };

  const handleSave = async (data: Omit<Project, 'id' | 'createdAt'>) => {
    setSaving(true);
    if (editingProject) {
      editProject(editingProject.id, data)
        .then(() => {
          toast.success('Project updated successfully');
          setShowForm(false);
          setEditingProject(undefined);
          loadProjects();
        })
        .catch(e => toast.error('Failed to update: ' + e.message))
        .finally(() => setSaving(false));
    } else {
      createProject(data)
        .then(() => {
          toast.success('Project added successfully');
          setShowForm(false);
          loadProjects();
        })
        .catch(e => toast.error('Failed to add project: ' + e.message))
        .finally(() => setSaving(false));
    }
  };

  const handleDelete = (id: string) => {
    removeProject(id)
      .then(() => {
        toast.success('Project deleted');
        setDeleteConfirm(null);
        loadProjects();
      })
      .catch(e => toast.error('Failed to delete: ' + e.message));
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url).then(() => toast.success('Share link copied to clipboard!'));
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate('/admin');
  };

  const handlePinChange = () => {
    if (newPin.length < 4) { toast.error('PIN must be at least 4 characters'); return; }
    setAdminPin(newPin);
    setNewPin('');
    setShowPinChange(false);
    toast.success('PIN updated successfully');
  };

  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your portfolio projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPinChange(true)} className="border-border/70 gap-1.5">
              <Key className="w-4 h-4" />
              Change PIN
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-border/70 gap-1.5 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Projects', value: projects.length, color: 'text-primary' },
            { label: 'Featured', value: featuredCount, color: 'text-yellow-400' },
            { label: 'Web Apps', value: projects.filter(p => p.deviceType === 'desktop').length, color: 'text-blue-400' },
            { label: 'Mobile Apps', value: projects.filter(p => p.deviceType === 'mobile').length, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add button */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <Button
            onClick={() => { setEditingProject(undefined); setShowForm(true); }}
            className="gradient-bg text-white border-0 hover:opacity-90 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>

        {/* Projects table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-muted-foreground">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="glass rounded-2xl border border-border/50 p-16 text-center">
            <Plus className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No projects yet. Add your first one!</p>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Project</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Featured</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {projects.map(project => {
                    const DeviceIcon = deviceIcons[project.deviceType];
                    return (
                      <tr key={project.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-sm text-foreground">{project.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{project.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <DeviceIcon className="w-3.5 h-3.5" />
                            <span className="capitalize">{project.deviceType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-xs px-2 py-1 bg-secondary/80 text-muted-foreground rounded-md border border-border/50">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          {project.featured ? (
                            <div className="flex items-center gap-1 text-yellow-400 text-xs">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              Featured
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-green-400"
                              title="Copy share link"
                              onClick={() => handleCopyLink(project.id)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-primary"
                              onClick={() => navigate(`/preview/${project.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-foreground"
                              onClick={() => { setEditingProject(project); setShowForm(true); }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteConfirm(project.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={open => { if (!open) { setShowForm(false); setEditingProject(undefined); } }}>
        <DialogContent className="bg-card border-border/60 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="gradient-text">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>
          <AdminProjectForm
            project={editingProject}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingProject(undefined); }}
            saving={saving}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={open => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="bg-card border-border/60 max-w-sm">
          <DialogHeader><DialogTitle>Delete Project?</DialogTitle></DialogHeader>
          <p className="text-muted-foreground text-sm">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="border-border/70">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change PIN */}
      <Dialog open={showPinChange} onOpenChange={open => { if (!open) { setShowPinChange(false); setNewPin(''); } }}>
        <DialogContent className="bg-card border-border/60 max-w-sm">
          <DialogHeader><DialogTitle>Change Admin PIN</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">New PIN (min 4 characters)</Label>
              <Input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} placeholder="Enter new PIN" className="bg-secondary/60 border-border/70" maxLength={20} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowPinChange(false); setNewPin(''); }} className="border-border/70">Cancel</Button>
              <Button onClick={handlePinChange} className="gradient-bg text-white border-0">Update PIN</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
