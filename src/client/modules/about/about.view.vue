<template>
  <Head>
    <title>About</title>
  </Head>
  <h2>This is the About Page.</h2>
  <p>It's CSR only (defined in server ViewController)</p>
  <pre>env: {{ env }}</pre>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { View } from 'bwcx-client-vue3';

@View('/about')
export default class About extends Vue {
  public env = process.env.NODE_ENV;
}
</script>
