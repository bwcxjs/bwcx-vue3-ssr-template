<template>
  <Head>
    <title>Demo Detail</title>
  </Head>
  <h2>This is the Detail Page.</h2>

  <p>SSR/CSR asyncData props fetched by ApiClient:</p>
  <pre>{{ JSON.stringify({ list }) }}</pre>

  <p>Page param/query:</p>
  <pre>{{ JSON.stringify({ id }) }}</pre>

  <p>mounted only randomNumber: {{ shortenRandomNumber }}</p>

  <SomeCommon :some-prop="1" />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import type { AsyncDataOptions } from '@client/typings';
import SomeCommon from '@client/components/some-common.vue';
import { DemoItem } from '@common/modules/demo/demo.dto';

@Options({
  components: {
    SomeCommon,
  },
})
export default class DemoDetail extends Vue {
  @Prop() list: DemoItem[];

  // as data
  randomNumber = 0;

  // as computed
  get shortenRandomNumber() {
    return this.randomNumber.toFixed(5);
  }

  get id() {
    return Number(this.$route.params.id);
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
