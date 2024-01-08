<template>
  <Head>
    <title>Demo Detail</title>
  </Head>
  <h2>This is the Detail Page.</h2>

  <p>SSR/CSR asyncData props fetched by ApiClient:</p>
  <pre>{{ JSON.stringify({ list }) }}</pre>

  <p>Page param/query:</p>
  <pre>{{ JSON.stringify({ id, page, preview, arr }) }}</pre>

  <p>mounted only randomNumber: {{ shortenRandomNumber }}</p>

  <div class="pagination">
    Try awesome router: <a href="javascript:;" @click="goToRandomPage">Go to a random page!</a>
  </div>

  <SomeCommon :some-prop="1" />
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { View, mixinRouteProps, RenderMethod, RenderMethodKind } from 'bwcx-client-vue3';
import { DemoDetailRPO } from '@common/modules/demo/demo.rpo';
import type { AsyncDataOptions } from '@client/typings';
import SomeCommon from '@client/components/some-common.vue';
import { DemoItem } from '@common/modules/demo/demo.dto';

@View('/demo/detail/:id', DemoDetailRPO)
@RenderMethod(RenderMethodKind.SSR)
@Options({
  components: {
    SomeCommon,
  },
})
export default class DemoDetail extends mixinRouteProps(DemoDetailRPO) {
  @Prop() list: DemoItem[];

  // as data
  randomNumber = 0;

  // as computed
  get shortenRandomNumber() {
    return this.randomNumber.toFixed(5);
  }

  async asyncData({ apiClient, to }: AsyncDataOptions) {
    const res = await apiClient.demoGet({
      id: Number(to.params.id),
      page: 1,
    });
    return {
      list: res.list,
    };
  }

  // as lifecycle hook
  mounted() {
    this.randomNumber = Math.random();
  }

  public goToRandomPage() {
    const page = Math.floor(Math.random() * 1000) + 1;
    this.$$router.to('DemoDetail').push({
      id: this.id,
      preview: this.preview,
      arr: this.arr,
      page,
    });
  }
}
</script>

<style lang="less" scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.pagination {
  a {
    margin: 0 8px;
  }
}
</style>
