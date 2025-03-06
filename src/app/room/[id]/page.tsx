import { Room } from '~/app/room/[id]/_components/room';

export default async function Page(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return <Room id={id} />;
}
