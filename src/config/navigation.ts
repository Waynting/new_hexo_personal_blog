// Navigation menu configuration
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  description?: string;
  children?: NavItem[];
  external?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Main navigation menu
export const mainNavigation: NavItem[] = [
  {
    name: 'Projects',
    href: '/projects',
    icon: '💼',
    description: 'Portfolio & Projects'
  },
  {
    name: 'All Articles',
    href: '/posts',
    icon: '📝',
    description: 'All articles & posts'
  },
  {
    name: 'Photos',
    href: '/photos',
    icon: '📷',
    description: 'Photo Gallery'
  },
  {
    name: 'Camera Float',
    href: '/camera-float-ntu',
    icon: '📸',
    description: 'Camera Float Project - NTU'
  },
];

// Quick actions
export const quickActions: NavItem[] = [
  {
    name: 'Search',
    href: '/search',
    icon: '🔍'
  },
];

// Export default configuration
export const navigationConfig = {
  main: mainNavigation,
  quick: quickActions,
  pages: {
    home: '/',
    notFound: '/404',
    search: '/search',
  },
};

