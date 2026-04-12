import { createBrowserRouter } from 'react-router';
import { createElement } from 'react';
import { PortfolioRoot } from './components/PortfolioRoot';
import { AdminDashboard } from './components/cms/AdminDashboard';
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
