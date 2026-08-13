import { redirect } from 'next/navigation';
import { verifyAuthAction } from '@/app/actions/auth';
import { AdminCursorFix } from './AdminCursorFix';

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
    <>
      <AdminCursorFix />
      {children}
    </>
  );
}
