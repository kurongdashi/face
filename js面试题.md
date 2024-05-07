# 手动实现 unshift

- 核心 API [].splice(0,0,a) 从 0 开始 0 删除，替换为 a

# 首屏加载白屏时间太长

- DNS 优化

  - DNS 缓存
  - DNS 预加载

- html 文件精简
- css 优化
- js 优化体检及加载位置调整，defer 属性，等页面渲染完成后才执行 js
- 首屏 css 内联

# Promise 值穿透

- then 中的参数如果不是一个函数，则其返回的值无效，任然使用上一步的值

```javascript
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
```

# script 标签实现异步，defer async

- defer 脚本异步加载，并在文档解析完成后执行，所有带有 defer 属性的脚步，会按照在文档中加载顺序先后执行
- async 异步加载，但加载完会立即执行
- 监听 onload 事件然后动态引入 script 标签实现异步
