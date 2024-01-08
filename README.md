# bwcx-vue3-ssr-template

一个基于 bwcx 的全栈 SSR 项目模板（created at 2021）。

包含技术栈：
- Vue 3 (Class Component First)
- TypeScript
- Vite

## 准备

1. 安装并使用 Node.js 16（推荐使用 fnm 自动切换版本）
2. 安装并使用 pnpm v8
3. 运行 `pnpm run init` 安装依赖

## 开发

1. 运行 `npm run dev`
2. 在浏览器中打开 <http://127.0.0.1:3000/>

## 构建

1. 运行 `npm run build`

## 部署

模板使用 PM2 作为生产环境部署工具，运行 `npm run deploy` 或 `npm run deploy:foreground`。

## 开发指南

### 目录结构

本项目模板采用了基于运行时 -> 模块的目录分层结构：

```
src/
  client/
  common/
  server/
```

为了规避混合运行时带来的潜在错误风险，前端和后端代码应放置在对应目录下，而涉及在前后端共享的模块（如错误码枚举、公共接口、公共服务、DTO、RPO）推荐放置在 `common`。

### 后端开发

服务端使用 bwcx，提供简洁的 OOP 开发体验，参考 [bwcx 文档](https://bwcxjs.github.io/bwcx/)。

### 前端/前后端一体化开发

前端使用 Vue 3。本模板的前端组件（位于 `src/client/modules/`）均采用类组件的方式向你展示如何开发，但你仍可以使用选项式 API 或 setup 语法糖进行开发（不推荐）。

#### 数据预取

要使用兼容 SSR/CSR 的数据预取，请在类组件中使用 `asyncData` 钩子获取数据。其返回值可以直接提供给页面组件的 props 使用：

```typescript
export default class SomeComponent extends Vue {
  // 从 asyncData 返回对象中获取 SSR 或页面导航时所需的初始数据
  @Prop() public msg: string;

  async asyncData({ to }: AsyncDataOptions) {
    return {
      msg: `hello ${to.name}`,
    };
  }
}
```

`asyncData` 中不可访问组件 `this`，这是由于 Vue Class Component 的限制，我们不得不将 `asyncData` 作为组件实例方法提供，但实际上你应该将它视为静态方法。

#### 请求后端接口

后端开发的接口可以借助 `@Api.Summary` 和 `@Contract` 装饰器声明为 API。这样你可以在前端通过下列方式一键调用接口，且带有完备的类型提示。

开发后端接口：

```typescript
@Controller('/api')
export default class SomeController {
  @Api.Summary('接口描述')
  @Get()
  @Contract(SomeApiReqDTO, SomeApiRespDTO)
  public async someApi(@Data() data: SomeApiReqDTO): Promise<SomeApiRespDTO> {
    return ...
  }
}
```

在前端直接调用接口：

```typescript
// 直接通过组件内 asyncData 或 $api 调用
export default class SomeView extends Vue {
  async asyncData({ apiClient }) {
    const res = await apiClient.someApi({ ... });
    return res;
  }

  async mounted() {
    const res = await this.$api.someApi({ ... });
  }
}

// setup 或组合式 API 函数
const apiClient = useApiClient();
const res = await apiClient.someApi({ ... });
```


#### 前端路由和导航

使用 `@View` 和 `@RenderMethod` 为页面视图组件声明路由，这样可以无需定义前端路由配置并自动在后端装配该路由。

要导航到其他页面，请通过组件实例上的 `$$router` 进行导航。在本模板中，根据习惯约定页面路由组件以 `.view.vue` 结尾，以和其他组件进行区分。

示例：
```typescript
@View('/demo', DemoHomeRPO)
@RenderMethod(RenderMethodKind.SSR)
export default class Demo extends mixinRouteProps(DemoHomeRPO) {
  public goToDetail(id: string) {
    return this.$$router.to('DemoDetail').push({
      id,
    });
  }
}
```
