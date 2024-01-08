<template>
  <div>
    <h2>This is the Home Page.</h2>
    <p>SSR/CSR asyncData fetched by ApiClient:</p>
    <pre>{{ JSON.stringify({ homeState }) }}</pre>
    <client-only>
      <h4>&lt;client-only&gt;This area will only be rendered in the browser&lt;/client-only&gt;</h4>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Vue, setup } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { useHead } from '@vueuse/head';
import { useContext } from 'vite-ssr/vue';
import { View, RenderMethod, RenderMethodKind } from 'bwcx-client-vue3';
import type { DemoGetRespDTO } from '@common/modules/demo/demo.dto';
import type { AsyncDataOptions } from '@client/typings';

@View('/')
@RenderMethod(RenderMethodKind.SSR)
export default class Home extends Vue {
  // passed from asyncData
  @Prop() homeState: DemoGetRespDTO;

  initialState = setup(() => {
    const { isClient, url, initialState } = useContext();
    isClient && console.log('Homepage setup', { url, initialState });

    useHead({
      title: 'Home',
      meta: [
        { name: 'description', content: 'This should be moved to head' },
      ],
    });
    return initialState;
  });

  // as computed
  get list() {
    return this.homeState.list;
  }

  async asyncData({ apiClient }: AsyncDataOptions) {
    const res = await apiClient.demoGet({
      id: 42,
      page: 9,
    });
    return {
      homeState: res,
    };
  }
}
</script>

<style lang="less" scoped>
.test {
  color: #333;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
