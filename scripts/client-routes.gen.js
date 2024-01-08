const path = require('path');
const NbClientVueRouteGenerator = require('bwcx-client-vue/generators/route').default;

const gen = new NbClientVueRouteGenerator({
  vueMajorVersion: '3',
  clientDir: path.join(__dirname, '../src/client'),
  commonDir: path.join(__dirname, '../src/common'),
  outClientRouterPath: path.join(__dirname, '../src/client/router/routes.ts'),
  outClientRouterTypesPath: path.join(__dirname, '../src/client/router/types.d.ts'),
  outCommonRouterPath: path.join(__dirname, '../src/common/router/client-routes.ts'),
  scanGlobs: ['modules/**/*.view.vue', 'modules/**/*.view.tsx'],
  codegenMode: 'reference',
});
gen.fullGenerate();
gen.watch();
