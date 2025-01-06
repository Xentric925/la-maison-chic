export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'localhost:3000/';
type UrlDictionary = {
  [key: string]: {
    title: string;
    parentTitle: string;
    parentUrl: string;
  };
};

export const urlDictionary: UrlDictionary = {
  '/products': {
    title: 'Products',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/admin': {
    title: 'Admin',
    parentTitle: 'Admin Dashboard',
    parentUrl: '/',
  },
  '/': {
    title: 'General',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/calendar': {
    title: 'Calendar',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/reports': {
    title: 'Reports',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/performance': {
    title: 'Performance Review',
    parentTitle: 'Resources',
    parentUrl: '/performance',
  },
  '/drive': {
    title: 'Drive',
    parentTitle: 'Resources',
    parentUrl: '/performance',
  },
  '/talent': {
    title: 'Talent Growth',
    parentTitle: 'Resources',
    parentUrl: '/performance',
  },
  '/intro': {
    title: 'Introduction',
    parentTitle: 'Documentation',
    parentUrl: '/docs',
  },
  '/get-started': {
    title: 'Get Started',
    parentTitle: 'Documentation',
    parentUrl: '/docs',
  },
  '/tutorial': {
    title: 'Tutorials',
    parentTitle: 'Documentation',
    parentUrl: '/docs',
  },
  '/users': {
    title: 'Users',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/users/id': {
    title: 'User Profile',
    parentTitle: 'Users',
    parentUrl: '/users',
  },
  '#': {
    title: 'Changelog',
    parentTitle: 'Documentation',
    parentUrl: '/docs',
  },
  '/settings': {
    title: 'General',
    parentTitle: 'Settings',
    parentUrl: '/settings',
  },
  '/team/settings': {
    title: 'Team',
    parentTitle: 'Settings',
    parentUrl: '/settings',
  },
  '/departments': {
    title: 'Departments',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/departments/id': {
    title: 'Department Profile',
    parentTitle: 'Departments',
    parentUrl: '/departments',
  },
  '/locations': {
    title: 'Locations',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/locations/id': {
    title: 'Location Profile',
    parentTitle: 'Locations',
    parentUrl: '/locations',
  },
  '/teams': {
    title: 'Teams',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/teams/id': {
    title: 'Team Profile',
    parentTitle: 'Teams',
    parentUrl: '/teams',
  },
  '/groups': {
    title: 'Groups',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/groups/id': {
    title: 'Group Profile',
    parentTitle: 'Groups',
    parentUrl: '/groups',
  },
  '/events': {
    title: 'Events',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/payroll': {
    title: 'Payroll',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/transactions': {
    title: 'Transactions',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
  '/company/settings': {
    title: 'Company Settings',
    parentTitle: 'Settings',
    parentUrl: '/settings',
  },
  '/tree': {
    title: 'Hierarchy',
    parentTitle: 'Dashboard',
    parentUrl: '/',
  },
};
