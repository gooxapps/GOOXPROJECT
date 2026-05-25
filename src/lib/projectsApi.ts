import { supabase } from '@/lib/supabase';
import { Project } from '@/types/project';

// Map DB row → Project
function fromRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    url: row.url as string,
    deviceType: row.device_type as Project['deviceType'],
    category: row.category as string,
    tags: (row.tags as string[]) || [],
    featured: row.featured as boolean,
    createdAt: (row.created_at as string)?.split('T')[0] ?? '',
  };
}

// Map Project → DB row
function toRow(p: Omit<Project, 'id' | 'createdAt'>) {
  return {
    title: p.title,
    description: p.description,
    url: p.url,
    device_type: p.deviceType,
    category: p.category,
    tags: p.tags,
    featured: p.featured,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(fromRow);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? fromRow(data) : null;
}

export async function createProject(p: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(toRow(p))
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromRow(data);
}

export async function editProject(id: string, p: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.description !== undefined) row.description = p.description;
  if (p.url !== undefined) row.url = p.url;
  if (p.deviceType !== undefined) row.device_type = p.deviceType;
  if (p.category !== undefined) row.category = p.category;
  if (p.tags !== undefined) row.tags = p.tags;
  if (p.featured !== undefined) row.featured = p.featured;

  const { error } = await supabase.from('projects').update(row).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removeProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
