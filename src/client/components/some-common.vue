<template>
  <div class="some-common-container">
    <div>Common Component</div>
    <pre>someProp: {{ someProp }}</pre>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class SomeCommon extends Vue {
  @Prop({ type: Number, required: true })
  someProp!: number;
}
</script>

<style lang="less" scoped>
.some-common-container {
  border: 1px solid #ccc;
  margin: 20px;
  padding: 8px;
}
</style>
