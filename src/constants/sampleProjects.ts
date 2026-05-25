import { Project } from '@/types/project';

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with product catalog, cart, and checkout flow.',
    url: 'https://example.com',
    deviceType: 'desktop',
    category: 'E-Commerce',
    tags: ['React', 'Shopping', 'Web App'],
    featured: true,
    createdAt: '2026-05-01',
  },
  {
    id: '2',
    title: 'Fitness Tracker App',
    description: 'Mobile app for tracking workouts, calories, and daily fitness goals.',
    url: 'https://example.com',
    deviceType: 'mobile',
    category: 'Health & Fitness',
    tags: ['Mobile', 'Fitness', 'Dashboard'],
    featured: true,
    createdAt: '2026-04-20',
  },
  {
    id: '3',
    title: 'Restaurant Booking System',
    description: 'Table reservation and menu browsing platform for a fine dining restaurant.',
    url: 'https://example.com',
    deviceType: 'desktop',
    category: 'Hospitality',
    tags: ['Booking', 'Restaurant', 'Web'],
    featured: false,
    createdAt: '2026-04-10',
  },
];
