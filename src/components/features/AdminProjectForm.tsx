import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, DeviceType } from '@/types/project';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Must be a valid URL (include https://)'),
  deviceType: z.enum(['desktop', 'mobile', 'tablet']),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface AdminProjectFormProps {
  project?: Project;
  onSave: (data: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  saving?: boolean;
}

const AdminProjectForm = ({ project, onSave, onCancel, saving }: AdminProjectFormProps) => {
  const [tags, setTags] = useState<string[]>(project?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      url: project?.url || '',
      deviceType: project?.deviceType || 'desktop',
      category: project?.category || '',
      featured: project?.featured || false,
    },
  });

  const deviceType = watch('deviceType');
  const featured = watch('featured');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const onSubmit = (data: FormData) => {
    onSave({ ...data, tags, thumbnail: project?.thumbnail });
  };

  const fieldClass = "bg-secondary/60 border-border/70 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/60";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground/90">Project Title</Label>
        <Input {...register('title')} placeholder="My Awesome App" className={fieldClass} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground/90">Description</Label>
        <Textarea {...register('description')} placeholder="Brief project description..." rows={3} className={cn(fieldClass, 'resize-none')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* URL */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground/90">Project URL</Label>
        <Input {...register('url')} placeholder="https://your-project-url.com" className={fieldClass} />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
        <p className="text-xs text-muted-foreground">This URL will be embedded — clients won't see it in the browser bar.</p>
      </div>

      {/* Device Type + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground/90">Device Type</Label>
          <Select value={deviceType} onValueChange={(v) => setValue('deviceType', v as DeviceType)}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="desktop">Desktop / Web</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground/90">Category</Label>
          <Input {...register('category')} placeholder="E-Commerce, SaaS..." className={fieldClass} />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground/90">Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="React, TypeScript..."
            className={cn(fieldClass, 'flex-1')}
          />
          <Button type="button" variant="outline" size="icon" onClick={addTag} className="border-border/70 hover:bg-secondary/60">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 bg-primary/15 text-primary rounded-md border border-primary/30">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3 hover:text-destructive" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue('featured', !featured)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${featured ? 'bg-primary' : 'bg-secondary'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${featured ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
        <Label className="text-sm text-muted-foreground cursor-pointer" onClick={() => setValue('featured', !featured)}>
          Mark as featured project
        </Label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-border/70 hover:bg-secondary/60">
          Cancel
        </Button>
        <Button type="submit" disabled={saving} className="gradient-bg text-white hover:opacity-90 border-0 gap-1.5">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? 'Saving...' : project ? 'Save Changes' : 'Add Project'}
        </Button>
      </div>
    </form>
  );
};

export default AdminProjectForm;
