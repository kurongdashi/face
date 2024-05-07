## vite

- 在开发环境下
- 没有编译过程，而是利用浏览器的 esmodule 解析所以快
- 启动一个 koa server 服务来响应浏览器的请求资源
- es-module-import 解析 AST,将依赖路径转为浏览器可识别的路径
