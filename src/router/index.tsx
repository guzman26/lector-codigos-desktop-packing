import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);