import { redirect } from 'next/navigation';

export default async function Hub({ params }: { params: { project: string } }) {
  // Redirect to feedback page with project slug
  redirect(`/${params.project}/feedback`);
}
