# qiankun 主要工作原理

## 使用方法

### 主应用配置子应用入口

- 主应用配置，并启动

```js
// 主应用-注册乾坤子应用
registerMicroApps([
  {
    name: "react-1", //子应用名
    entry: "//localhost:8002/", //入口地址
    container: "#container", //用来存放子应用的容器id
    activeRule: "/app-react", // 子应用路由
    loader: (loading) => {
      console.log("加载子应用");
    },
    props: {
      user: "王五",
      age: 30,
    },
  },
]);
start();
```

### 子应用配置

- 子应用需要暴露入口函数和修改渲染逻辑
- 提供全局变量用于判断是否被主应用加载

```js
export async function bootstrap() {}
export async function mount(props: any) {
  render(props);
}
export async function unmount(props: any) {}
// 修改渲染逻辑，当被主应用加载时需要用主应用的容器去加载子应用
const render = (props?: any) => {
  debugger;
  const root = createRoot(
    props.container
      ? props.container.querySelector("#root")
      : document.getElementById("root")
  );
  root.render(<App />);
};

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}
```

- 子应用修改打包逻辑，打包成一个库函数

```js
module.exports = {
  entry: "./src/entry.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name][hash:6].js",
    // 本地BrowserRouter 配置将请求路径转发的 index.html
    // qiankun子应用配置
    library: `${name}-[name]`,
    libraryTarget: "umd",
    chunkLoadingGlobal: `webpackJsonp_${name}`,
  },
};
```

## 工作原理

### 1-路由监听，判断当前是否需要加载子应用

- popState 监听
- pushState 监听
- replaceState 监听

```js
window.history.addEventListener("popstate", () => {
  handleRoute();
});
// 重写 监听
const newPushState = window.history.pushState;
window.history.pushState = (...arg) => {
  newPushState.apply(window.history, arg);
  handleRoute();
};
const newReplaceState = window.history.replaceState;
window.history.replaceState = (...arg) => {
  newReplaceState.apply(window.history, arg);
  handleRoute();
};
```

### 2-加载子应用

### 3-渲染子应用

### 4-切换卸载子应用
