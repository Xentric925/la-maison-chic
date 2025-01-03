import React, { ReactNode } from 'react';
import SidebarNavigation from './NavBar'; // Import the new sidebar navigation component

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarNavigation>
      {/* Main content area */}
      {children}
    </SidebarNavigation>
  );
};

export default Layout;
