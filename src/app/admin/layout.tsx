import { redirect } from 'next/navigation';
import { verifyAuthAction } from '@/app/actions/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await verifyAuthAction();
  
  if (!isAuth) {
    redirect('/login');
  }

  return (
    <div dir="ltr" className="min-h-screen text-left">
      {children}
    </div>
  );
}
