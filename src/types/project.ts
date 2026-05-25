export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  deviceType: DeviceType;
  category: string;
  tags: string[];
  thumbnail?: string;
  featured: boolean;
  createdAt: string;
}
