import { Clipboard } from 'lucide-react';
import { NavbarTabProps, ProjectProps } from '@/lib/types';
import NavTabs from '@/components/layout/nav-tabs';
import ProjectDropdown from '@/components/layout/project-dropdown';
import { Button } from 'ui/components/ui/button';
import { formatRootUrl } from '@/lib/utils';

export default async function Sidebar({
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
  const feedbackUrl = formatRootUrl(currentProject.slug, '/feedback');

  return (
    <div className='fixed left-0 top-0 z-50 hidden h-screen w-[240px] flex-col items-center justify-between md:flex'>
      <div className='flex w-full flex-col gap-y-10 p-5'>
        {/* Projects */}
        <ProjectDropdown projects={projects} activeProject={currentProject} />

        {/* Main Tabs with My Board */}
        <div className='flex flex-col gap-2'>
        <NavTabs tabs={tabs} initialTabIndex={activeTabIndex} projectSlug={currentProject.slug} />
          
          {/* My Board Button */}
          <a href={feedbackUrl} target='_blank' rel='noopener noreferrer'>
          <Button
            variant='secondary'
              className='text-foreground/[85%] hover:text-foreground w-full items-center justify-start gap-1 border border-transparent p-1 font-light'>
              {/* Icon */}
              <div className='flex transform-none flex-row items-center justify-center p-1'>
                <Clipboard className='h-5 w-5' />
            </div>

              {/* Title */}
              My Board
          </Button>
          </a>
        </div>
            </div>
    </div>
  );
}
