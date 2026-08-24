export interface Profile {
  id: string;
  username: string;
  fullName: string;
  headline?: string;
  bio?: string;
  avatarUrl: string;
  bannerUrl?: string;
  location?: string;
  website?: string;
  availableForWork?: boolean;
  skills?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    dribbble?: string;
    behance?: string;
    github?: string;
  };
  customButton?: {
    label: string;
    url: string;
  };
  featuredProjectIds?: string[];
  followersCount?: number;
  followingCount?: number;
  totalAppreciations?: number;
  totalViews?: number;
  isFollowing?: boolean;
  createdAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  projectCount?: number;
  subCategories?: SubCategory[];
}

export interface ProjectImage {
  id?: string;
  url: string;
  caption?: string;
  sortOrder?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  categoryId?: string;
  coverImage: string;
  accentColor: string;
  year: string;
  tools: string[];
  tags: string[];
  images: string[];
  projectImages?: ProjectImage[];
  creator: Profile;
  userId: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  isPinnedToProfile?: boolean;
  viewsCount: number;
  appreciationsCount: number;
  isAppreciated?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  projectId: string;
  userId?: string;
  user: Profile;
  content: string;
  createdAt: string;
}

export interface Appreciation {
  id?: string;
  userId: string;
  projectId: string;
  createdAt?: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt?: string;
}

export interface Collection {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPrivate?: boolean;
  projectIds: string[];
  projects?: Project[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  creatorId: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  budgetRange: string;
  projectTimeline: string;
  projectBrief: string;
  status: 'unread' | 'read' | 'contacted' | 'archived';
  createdAt: string;
}

export type NotificationType =
  | 'appreciation'
  | 'comment'
  | 'follow'
  | 'inquiry'
  | 'curated';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  actorName: string;
  actorAvatar: string;
  title: string;
  description: string;
  targetUrl: string;
  isRead: boolean;
  createdAt: string;
}

export type FeedType = 'for-you' | 'following';

export type SortOption = 'featured' | 'appreciations' | 'views' | 'newest';

export interface ProjectFilters {
  category?: string;
  subCategory?: string;
  tool?: string;
  searchQuery?: string;
  sortBy?: SortOption;
  color?: string;
  feedType?: FeedType;
  timeframe?: string;
}
