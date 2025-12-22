import { getAllProjectFeedback } from '@/lib/api/feedback';
import RoadmapKanban from '@/components/dashboard/roadmap/roadmap-kanban';

export default async function Roadmap({
  params,
}: {
  params: { slug: string };
}) {
  const { data: feedback, error } = await getAllProjectFeedback(params.slug, 'server');
  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <RoadmapKanban feedback={feedback} projectSlug={params.slug} />
    </div>
  );
}

