<template>
  <div class="container">
    <h3>This is the Detail Child View.</h3>

    <p>Child route props:</p>
    <pre>childId: {{ childId }}</pre>

    <p>SSR/CSR asyncData props:</p>
    <pre>ts: {{ ts }}</pre>
  </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { View, ChildOf, mixinRouteProps, RenderMethod, RenderMethodKind } from 'bwcx-client-vue3';
import { DemoDetailChildRPO } from '@common/modules/demo/demo.rpo';
import type { AsyncDataOptions } from '@client/typings';

@View('child/:childId', DemoDetailChildRPO)
@ChildOf('DemoDetail')
@RenderMethod(RenderMethodKind.SSR)
export default class DemoDetailChild extends mixinRouteProps(DemoDetailChildRPO) {
  @Prop() ts: number;

  async asyncData({ apiClient, to }: AsyncDataOptions) {
    return {
      ts: Date.now(),
    };
  }
}
</script>

<style lang="less" scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.container {
  width: 320px;
  border: 1px solid #65bcff;
  margin: 20px auto;
  padding: 8px;
}
</style>
