import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProjects } from '@/lib/api/user';
import { DASH_DOMAIN } from '@/lib/constants';
import InboxPopover from '@/components/layout/inbox-popover';
import NavbarMobile from '@/components/layout/nav-bar-mobile';
import Sidebar from '@/components/layout/sidebar';
import TitleProvider from '@/components/layout/title-provider';
import {
  CalendarIcon,
  FeedbackIcon,
  SettingsIcon,
  TagLabelIcon,
} from '@/components/shared/icons/icons-animated';
import UserDropdown from '@/components/shared/user-dropdown';

const tabs = [
  {
    name: 'Changelog',
    icon: TagLabelIcon,
    slug: 'changelog',
  },
  {
    name: 'Feedback',
    icon: FeedbackIcon,
    slug: 'feedback',
  },
  {
    name: 'Roadmap (Soon)',
    icon: CalendarIcon,
    slug: 'roadmap',
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    slug: 'settings',
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Headers
  const headerList = headers();
  const projectSlug = headerList.get('x-project');
  const pathname = headerList.get('x-pathname');

  // Fetch user
  const { data: user } = await getCurrentUser('server');

  if (!user) {
    return redirect(`${DASH_DOMAIN}/login`);
  }

  // Fetch the user's projects
  const { data: projects } = await getUserProjects('server');

  // Check if the user has any projects
  if (!projects || projects.length === 0) {
    return redirect(`${DASH_DOMAIN}`);
  }

  // Get the project with the current slug
  const currentProject = projects.find((project) => project.slug === projectSlug);

  // If currentProject is undefined, redirect to the first project
  if (!currentProject) {
    return redirect(`/${projects[0].slug}`);
  }

  // Retrieve the currently active tab
  const activeTabIndex = tabs.findIndex((tab) => pathname?.includes(tab.slug));

  return (
    <main className='bg-root flex min-h-screen w-full min-w-full overflow-hidden'>
      {/* Sidebar - Fixed on the left */}
      <Sidebar
        tabs={tabs}
        projects={projects}
        activeTabIndex={activeTabIndex}
        currentProject={currentProject}
      />

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col ml-[240px]'>
        {/* Header - Fixed at top right */}
        <header className='bg-root fixed top-0 right-0 z-50 flex h-16 w-[calc(100%-240px)] flex-row items-center justify-end px-5'>
          <div className='flex flex-row items-center gap-2'>
            <InboxPopover user={user} />
            <UserDropdown user={user} />
          </div>
        </header>

        {/* Page Content */}
        <div className='flex-1 pt-16 p-5 overflow-y-auto'>
          <TitleProvider
            tabs={tabs}
            initialTitle={activeTabIndex === -1 ? '' : tabs[activeTabIndex].name}
            className='text-3xl font-semibold mb-6'
          />
          {children}
        </div>
      </div>

      {/* Navbar (mobile) */}
      <NavbarMobile tabs={tabs} activeTabIndex={activeTabIndex} currentProject={currentProject} />
    </main>
  );
}
