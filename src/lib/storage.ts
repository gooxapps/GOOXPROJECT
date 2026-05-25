import { Project } from '@/types/project';
import { SAMPLE_PROJECTS } from '@/constants/sampleProjects';

const PROJECTS_KEY = 'devshowcase_projects';
const ADMIN_PIN_KEY = 'devshowcase_pin';
const DEFAULT_PIN = '1234';

export function getProjects(): Project[] {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (!stored) {
    const initial = JSON.stringify(SAMPLE_PROJECTS);
    localStorage.setItem(PROJECTS_KEY, initial);
    return SAMPLE_PROJECTS;
  }
  try {
    const parsed = JSON.parse(stored);
    // Ensure it's a valid array
    if (Array.isArray(parsed)) return parsed;
    // Corrupted data — reset
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(SAMPLE_PROJECTS));
    return SAMPLE_PROJECTS;
  } catch {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(SAMPLE_PROJECTS));
    return SAMPLE_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  projects.unshift(newProject);
  saveProjects(projects);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): void {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    saveProjects(projects);
  }
}

export function deleteProject(id: string): void {
  const projects = getProjects();
  saveProjects(projects.filter(p => p.id !== id));
}

export function getAdminPin(): string {
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
}

export function setAdminPin(pin: string): void {
  localStorage.setItem(ADMIN_PIN_KEY, pin);
}

export function verifyPin(pin: string): boolean {
  return pin === getAdminPin();
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem('devshowcase_admin') === 'true';
}

export function setAdminLoggedIn(value: boolean): void {
  if (value) {
    sessionStorage.setItem('devshowcase_admin', 'true');
  } else {
    sessionStorage.removeItem('devshowcase_admin');
  }
}
