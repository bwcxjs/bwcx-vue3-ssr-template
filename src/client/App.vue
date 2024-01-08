<template>
  <h1>Welcome to bwcx Demo</h1>
  <div>
    <img class="logo" src="./assets/logo.png" alt="不忘初心" />
  </div>
  <p class="slogan">Light, Progressive, Object Oriented</p>
  <p class="secondary-prompt">It's a template from <a href="https://github.com/bwcxjs/bwcx-vue3-ssr-template" target="_blank">bwcx-vue3-ssr-template</a></p>
  <nav>
    <router-link to="/">Go to Home</router-link>
    <router-link :to="{ name: 'About' }">Go to About</router-link>
    <router-link :to="demoDetailUrl">Go to Detail</router-link>
  </nav>
  <h3>Below is the currently rendered route view:</h3>

  <router-view v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
    </Suspense>
  </router-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
})
export default class App extends Vue {
  get demoDetailUrl() {
    return this.$$router.to('DemoDetail').formatUrl({
      id: 42,
      preview: false,
      arr: [1, 2],
    });
  }
}
</script>

<style lang="less" scoped>
nav {
  width: 600px;
  display: flex;
  padding: 20px;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  background: #efefef;
  border: 1px solid #ccc;
  margin-top: 16px;
  border-radius: 4px;
}
.slogan {
  background-color: #21b6fd;
  background-image: linear-gradient(108deg, #21b6fd 36%, #b721ff 100%);
  -webkit-background-clip: text;
  color: transparent;
  font-size: 20px;
  font-weight: 500;
}

.logo {
  width: 108px;
  height: 108px;
}

.secondary-prompt {
  color: #737373;
  font-size: 14px;
  margin-bottom: 0;
}
</style>
