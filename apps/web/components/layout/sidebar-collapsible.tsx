'use client';

import { useState, useEffect } from 'react';
import { NavbarTabProps, ProjectProps } from '@/lib/types';
import NavTabs from '@/components/layout/nav-tabs';
import ProjectDropdown from '@/components/layout/project-dropdown';
import { Button } from 'ui/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@ui/lib/utils';

export default function SidebarCollapsible({
  tabs,
  projects,
  activeTabIndex,
  currentProject,
}: {
  tabs: NavbarTabProps[];
  projects: ProjectProps['Row'][];
  activeTabIndex: number;
  currentProject: ProjectProps['Row'];
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage and update main content margin
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    
    // Update main content margin
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    if (mainContent && header) {
      if (newState) {
        mainContent.style.marginLeft = '64px';
        if (header instanceof HTMLElement) {
          header.style.left = '64px';
        }
      } else {
        mainContent.style.marginLeft = '240px';
        if (header instanceof HTMLElement) {
          header.style.left = '240px';
        }
      }
    }
  };

  // Update main content margin on mount and when collapsed state changes
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    const header = document.getElementById('main-header');
    if (mainContent && header) {
      if (isCollapsed) {
        mainContent.style.marginLeft = '64px';
        header.style.left = '64px';
      } else {
        mainContent.style.marginLeft = '240px';
        header.style.left = '240px';
      }
    }
  }, [isCollapsed]);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-200 ease-in-out flex flex-col',
        isCollapsed ? 'w-16' : 'w-60'
      )}>
      {/* Sidebar Content */}
      <div className='flex flex-1 flex-col gap-y-6 p-4 overflow-y-auto'>
        {/* Projects */}
        <div className={cn('transition-opacity duration-200', isCollapsed && 'opacity-0 pointer-events-none')}>
          <ProjectDropdown projects={projects} activeProject={currentProject} />
        </div>

        {/* Main Tabs */}
        <NavTabs 
          tabs={tabs} 
          initialTabIndex={activeTabIndex} 
          projectSlug={currentProject.slug}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Collapse Toggle Button */}
      <div className='p-4 border-t border-gray-200'>
        <Button
          variant='ghost'
          size='icon'
          onClick={toggleCollapse}
          className='w-full h-10 hover:bg-gray-100 text-gray-600 hover:text-gray-900'>
          {isCollapsed ? (
            <ChevronRight className='h-5 w-5' />
          ) : (
            <ChevronLeft className='h-5 w-5' />
          )}
        </Button>
      </div>
    </aside>
  );
}

