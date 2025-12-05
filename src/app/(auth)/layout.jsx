import { GuestRoute } from '@/components/features/auth';

export default function AuthLayout({ children }) {
  return <GuestRoute>{children}</GuestRoute>;
}
