import Link from 'next/link';
import { Button } from '@ui/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Background } from 'ui/components/ui/background/background';
import { formatRootUrl } from '@/lib/utils';
import ChangelogSection from '@/components/home/changelog-section';
import DashboardSection from '@/components/home/dashboard-section';
import FeedbackSection from '@/components/home/feedback-section';
import HomeFooter from '@/components/home/footer';

export default function Landing() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center px-5 lg:px-10'>
      <Background />

      {/* Title */}
      <div className='flex h-screen w-full flex-col items-center justify-center xl:gap-2'>
        <h1 className='text-foreground flex w-fit max-w-full shrink-0 flex-col items-center justify-center gap-2 text-center text-3xl font-bold sm:text-5xl md:text-5xl lg:text-6xl'>
          <span>在一个平台</span>
          <span className='block sm:hidden'>收集反馈并分享更新</span>
          <span className='hidden sm:block'>集中收集反馈与发布产品更新</span>
        </h1>

        <p className='text-foreground/60 mt-5 max-w-xs text-center text-sm font-light sm:block sm:max-w-lg sm:text-lg md:max-w-xl'>
          featVote 帮你简化收集反馈、功能优先级排序与更新发布，让你专注产品迭代。
        </p>

        <div className='mt-5 flex w-full flex-row items-center justify-center gap-5'>
          <Link href={formatRootUrl('dash', '/signup')}>
            <Button className='inline-flex rounded-full bg-black px-6 py-2 text-white hover:bg-black/90'>
              开始使用
            </Button>
          </Link>

          <Link href='/github'>
            <button
              className='text-white inline-flex h-9 items-center justify-center rounded-full bg-black px-4 py-1 text-sm font-normal transition-colors hover:bg-black/85'
              type='button'>
              在 GitHub 点 Star
            </button>
          </Link>
        </div>

        <Link
          href={formatRootUrl('hub')}
          className='text-foreground/60 hover:text-foreground/90 group relative mt-4 flex w-fit flex-row items-center justify-center p-1 text-center text-sm font-light'>
          <p className='mr-1 '>查看在线演示</p>
          <ArrowRight className='relative mb-[1px] inline h-4 w-0 transition-all group-hover:w-4' />
          <ChevronRight className='relative mb-[1px] inline h-4 w-4 transition-all group-hover:w-0' />
        </Link>
      </div>

      {/* Feedback Features */}
      <FeedbackSection />

      {/* Changelog */}
      <ChangelogSection />

      {/* Dashboard */}
      <DashboardSection />

      {/* Sign up 2 */}
      <div className='my-10 flex h-[60vh] w-full flex-col items-center justify-center'>
        <div className='absolute -z-10 h-2/3 w-full'>
          <div className='absolute h-full w-full bg-[radial-gradient(#2e2e2f_0.5px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_40%_40%_at_50%_50%,#000_70%,transparent_100%)]' />
        </div>
        <h1 className='text-foreground gap-2 text-center text-3xl font-medium leading-tight sm:text-5xl'>
          立即创建你的反馈社区
        </h1>
        <p className='text-foreground/60 mt-5 w-full text-center text-sm font-light sm:text-lg'>
          在一个地方收集反馈、发布更新，并与用户持续互动。
        </p>

        <div className='mt-10 flex w-full flex-row items-center justify-center gap-5'>
          <Link href={formatRootUrl('dash', '/signup')}>
            <Button className='inline-flex rounded-full bg-black px-6 py-2 text-white hover:bg-black/90'>
              开始使用
            </Button>
          </Link>

          <Link
            href={formatRootUrl('hub')}
            className='group relative grid h-9 items-center overflow-hidden rounded-full border px-4 py-1 transition-colors duration-200 hover:bg-foreground/5'>
            <span className='z-10 py-0.5 text-sm text-foreground'>查看 Demo</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
