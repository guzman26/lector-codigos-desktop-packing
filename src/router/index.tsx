import { lazy } from 'react';

const MainTerminal = lazy(() => import('../views/MainTerminal/MainTerminal'));
const CreatePallet = lazy(() => import('../views/CreatePallet/CreatePallet'))

export const routes = [
  {
    path: '/',
    element: <MainTerminal />,
  },
  {
    path: '/create-pallet',
    element: <CreatePallet />,
  },
];