import { createBrowserRouter } from 'react-router';
import { createElement } from 'react';
import { PortfolioRoot } from './pages/Home';
import { AdminDashboard } from './pages/Admin';
import { CmsProvider } from './contexts/CmsContext';

const AdminRoute = () => createElement(CmsProvider, null, createElement(AdminDashboard));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PortfolioRoot,
  },
  {
    path: '/admin',
    Component: AdminRoute,
  },
]);
