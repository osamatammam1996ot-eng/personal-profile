import { redirect } from 'next/navigation';
import { verifyAuthAction } from '@/app/actions/auth';
import { CustomCursor } from '@/components/shared/CustomCursor';
import { DashboardBackground } from '@/components/cms/shared/DashboardBackground';

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
    <div dir="ltr" className="min-h-screen text-left portfolio-mode text-text-primary">
      <DashboardBackground />
      <CustomCursor portfolioHoverVisible={false} portfolioX={0} portfolioY={0} />
      {children}
    </div>
  );
}
