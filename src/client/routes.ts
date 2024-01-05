export default [
  {
    name: 'About',
    path: '/about',
    component: () => import('./modules/about/about.view.vue'),
  },
  {
    name: 'DemoDetail',
    path: '/detail/:id',
    component: () => import('./modules/detail/detail.view.vue'),
  },
  {
    name: 'Home',
    path: '/',
    component: () => import('./modules/home/home.view.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('./modules/fallback/not-found.view.vue'),
  },
];
