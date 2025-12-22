import { redirect } from 'next/navigation';

export default async function Hub({ params }: { params: { project: string } }) {
  // Redirect to feedback
  // This page doesn't really get called as this is catched in layout.tsx but still needed to cause 404
  redirect(`/${params.project}/feedback`);
}
