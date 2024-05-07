# babel 基础层

- @babel/core 核心包
- @babel/preset-env 配置浏览器兼容性
- @babel/plugin-transform-runtime 高级 es 语法转换，公共逻辑抽取减少代码提交
- @babel/runtime 避免全局污染，搭配 `@babel/plugin-transform-runtime` 一起使用
- @babel/plugin-proposal 编译在提议阶段的 es

## babel-loader 应用层搭配 webpack

## preset 代表一组插件

```json
// .babelrc
{
  "presets": [
    "@babel/preset-react", //编译react
    "@babel/preset-env",
    "@babel/preset-typescript" //编译ts
  ],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```
