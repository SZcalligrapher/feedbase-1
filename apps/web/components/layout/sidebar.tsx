import { headers } from 'next/headers';
import Link from 'next/link';
import { Clipboard } from 'lucide-react';
import { NavbarTabProps, ProjectProps } from '@/lib/types';
import NavTabs from '@/components/layout/nav-tabs';
import ProjectDropdown from '@/components/layout/project-dropdown';
import { Button } from 'ui/components/ui/button';
import { cn } from '@ui/lib/utils';

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
  const headerList = headers();
  const pathname = headerList.get('x-pathname') || '';
  const isFeedbackPage = pathname.includes('/feedback');

  return (
    <div className='fixed left-0 top-0 z-50 hidden h-screen w-[240px] flex-col items-center justify-between md:flex'>
      <div className='flex w-full flex-col gap-y-10 p-5'>
        {/* Projects */}
        <ProjectDropdown projects={projects} activeProject={currentProject} />

        {/* Main Tabs */}
        <NavTabs tabs={tabs} initialTabIndex={activeTabIndex} projectSlug={currentProject.slug} />
      </div>
      
      {/* Footer Buttons */}
      <div className='flex w-full flex-col gap-2 p-5'>
        <Link href={`/${currentProject.slug}/feedback`}>
          <Button
            variant='secondary'
            className={cn(
              'text-foreground/[85%] hover:text-foreground w-full items-center justify-start gap-1 border border-transparent p-1 font-light',
              isFeedbackPage && 'bg-secondary text-foreground hover:bg-secondary'
            )}>
            {/* Icon */}
            <div className='flex transform-none flex-row items-center justify-center p-1'>
              <Clipboard className='h-5 w-5' />
            </div>

            {/* Title */}
            My Board
          </Button>
        </Link>
      </div>
    </div>
  );
}
