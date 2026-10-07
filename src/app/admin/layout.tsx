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
    // `dark` pins the dashboard to the dark token set regardless of the site theme;
    // `admin-root` scopes the page background & scrollbar styles in index.css.
    <div dir="ltr" className="dark admin-root min-h-screen text-left portfolio-mode text-text-primary">
      <DashboardBackground />
      <CustomCursor />
      {children}
    </div>
  );
}
