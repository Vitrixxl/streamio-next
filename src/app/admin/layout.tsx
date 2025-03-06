import { SudoRoute } from '~/components/protected-route';

export default function AdminLayout(
  { children }: { children: React.ReactNode },
) {
  return <SudoRoute>{children}</SudoRoute>;
}
