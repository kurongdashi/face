## npmV5 开始安装机制

- 所有模块依赖全部扁平化**能扁平则扁平**

```
默认所有依赖都安装在顶层 node_modules 下，不使用树型结构安装，因为如果 A 依赖 B,B 依赖 C...，则导致安装包结构复杂，
当后续 D 依赖 Bv2.0 出现时由于已经在顶层安装了 Bv1.0 相同的依赖但版本不一致时，才会将 Bv2.0 安装在 D 的目录下,
|-node_modules
    |- Av1.0
    |- Bv1.0
    |- Cv1.0
    |- Dv1.0
       |-Bv2.0


```

- package-lock.json npm 将下载的包缓存到目录，`npm config get cache` 可获取 npm 下载的缓存，然后解压到 node_modules 下
- 能使用缓存则使用缓存，只要 package-lock.json 的包版本和 package.json 一样，的话会直接使用缓存
- 不一致时，会安装 package.json 安装然后更新 package-lock.json， npm ci 在流水线上执行时，如果不一致则报错，所以流水线上应该保证一致
- 如果是开发 lib 库那么，库的依赖应该是 peerdependencies 意思为如果安装我这个库，那么请一起安装 peerdependencies 配置扁平化安装库文件的依赖到 node_modules

```json
"peerDependencies": {
    "lodash": "^4.17.21"
  }


|- content-V2 保存缓存包
|- index-v5 缓存依赖包对应的 hash 地址,可找到 content-v2 中对应包

```

## npm link

- 在库文件中执行`npm link`将库文件建立一个全局安装包的软链接，方便项目直接调试
- 在项目中执行`npm link xxx` xxx package.json 中的表示包名，就可直接访问本地开发的库文件
- `npm list -g` 查看全局安装包，可以找到软链接

```
webpack-lib-lping@1.0.2 -> .\D:\code\webpack-lib-lp
```

## npm ci 在 CI 环境一次安装所有依赖，不能单独安装
