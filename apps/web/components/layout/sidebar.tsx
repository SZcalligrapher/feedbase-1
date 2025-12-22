import { NavbarTabProps, ProjectProps } from '@/lib/types';
import NavTabs from '@/components/layout/nav-tabs';
import ProjectDropdown from '@/components/layout/project-dropdown';

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
  return (
    <aside className='fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-white border-r border-gray-200 md:flex'>
      <div className='flex h-full flex-col overflow-y-auto'>
        {/* Top Section - Project Selector */}
        <div className='p-4 border-b border-gray-200'>
          <ProjectDropdown projects={projects} activeProject={currentProject} />
        </div>

        {/* Main Navigation */}
        <div className='flex-1 p-4'>
          <NavTabs tabs={tabs} initialTabIndex={activeTabIndex} projectSlug={currentProject.slug} />
        </div>

        {/* Footer Section - Can add user info or help links here later */}
        {/* <div className='p-4 border-t border-gray-200'>
          Footer content
        </div> */}
      </div>
    </aside>
  );
}
