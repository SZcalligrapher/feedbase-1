import Link from 'next/link';
import { Icons } from '@/components/shared/icons/icons-static';

const products = [
  {
    name: 'featVote',
    desc: '一站式收集反馈、管理 Roadmap、发布更新。',
    pill: 'Live',
    href: '/featVote',
    metric: '独立开发者首选',
  },
  {
    name: '更多产品 · Coming soon',
    desc: '持续孵化独立开发工具，欢迎关注。',
    pill: 'Soon',
    href: '#',
    metric: '敬请期待',
  },
];

export default function InhauLanding() {
  return (
    <main className='bg-[#f5f5f5]'>
      <div className='mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-5 py-14 lg:flex-row lg:gap-12'>
        {/* Left column */}
        <div className='flex w-full max-w-md flex-col items-start gap-6 rounded-2xl bg-white px-6 py-7 shadow-sm lg:sticky lg:top-10'>
          <div className='flex items-center gap-3'>
            <Icons.LogoText className='h-8 w-28 text-foreground' />
          </div>
          <div className='space-y-3'>
            <p className='text-foreground text-2xl font-semibold'>萤皓 · inhau</p>
            <p className='text-foreground/70 leading-7 text-base'>
              萤皓取「萤火之光可与皓月争辉」之意，希望能把各位独立开发者聚集起来，让独立开发变得前所未有的简单。
            </p>
          </div>
          <div className='flex items-center gap-3 text-sm text-foreground/60'>
            <span className='inline-flex h-2 w-2 rounded-full bg-emerald-500' />
            <span>正在孵化独立开发者工具矩阵</span>
          </div>
        </div>

        {/* Right column - cards */}
        <div className='flex w-full flex-col gap-4'>
          {products.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='group block rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700'>
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-lg font-semibold text-foreground'>{item.name}</p>
                    <p className='text-sm text-foreground/70'>{item.desc}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'>
                    {item.pill}
                  </span>
                  <span className='text-sm text-foreground/60'>{item.metric}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

