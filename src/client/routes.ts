import clientRoutes from './router/routes';

export default [
  ...clientRoutes,
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('./modules/fallback/not-found.view.vue'),
  },
];
