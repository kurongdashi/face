# vue3

## complier 编译器

- AST 词法、语法分析-> 语言转义->生成 js

## 使用组合式 API

- 可以将重复逻辑抽离，包括在生命周期中执行的逻辑也可以抽离
- 面向函数式编程，不依赖 this
- 使用 es 模块化导出，有利于 tree shaking

## hypescript 简称 h 函数，可手动渲染一个 vNode (vue 组件)

- vue 支持 jsx 因为由 babel-plugin-jsx 提供转义支持
- h 函数

```javascript
h('div',props?,children)

const vNode = h('div', { id: 'hello' }, ['world', h('span')])

```

## vue2 diff 算法

- 同层比较

```
1. 首次渲染不执行diff
2. 节点类型是否相同，不相同直接删除，或新增（patch 过程）
3. 比较节点属性 props,style, event 是否相同，不相同直接删除
4. 比较文本 <span>123</span> =><span>123</span>
5. 比较children,如果children中不存在，直接删除，或者新增子节点（updateChildren）

```

## 子节点 updateChildren

- 采用双端指针向中间移动（前后两端同时进行比较，直到指针相遇停止），每次循环 进行 **头头，尾尾，头尾，尾头** 比较，进行交换位置
- 比较多余元素删除新增元素
- 缺点全量比较，费时

```
0  1  2  3
旧：A, B, C, D

新：A, B, C, D
比较 每次循环比较 AA DD AD DA

```

## vue3 Diff（快速 Diff）

- 前置后置预处理（处理掉不需要改变的节点，记录需要改变的节点位置）

```
从前往后依次比较如果节点相同则path()比较节点内部,如果不同则记录当前位置startIndex，以相同逻辑开始处理后部分元素，如果不同也记录endIndex
那么如下 startIndex=1,endIndex=2

旧：A, B, C, D

新：A, C, B, D
```

- 处理新增节点的情况,仅卸载节点的情况

```
从前往后依次比较如果节点相同则path()比较节点内部,如果不同则记录当前位置startIndex，以相同逻辑开始处理后部分元素，如果不同也记录endIndex
那么如下 startIndex=2 时后面的节点全部新增

旧：A, B, C

新：A, B, C, D,E

endIndex=2,后面没了，那么就需要删除旧节点中多余节点
旧：A, B, C, D, E

新：A, B, C,
```

- 处理移动 旧列表中的元素在新列表中也存在，但是位置有差异，找到最长的递增子序列
- 最长的递增子序列 ：旧元素相对于新元素整体来说如果在列表中的顺序递增的那么就不动，只移动哪些非顺序递增的元素，

```
例如：[1,3,5,2,7,10] 中 1,3,5,7,10 就是最长递增子序列，如果元素位置在子序列中就不动，只移动不在子序列中的元素
例如 A , C, D,  在旧列表和新列表中位置都是递增，所以最长序列为 0 2 3
旧：A, B, C, D, E, F

新：A, C, F, E, B, D

```

## vue 核心逻过程

- ast 词法语法分析，将模板转义称节点树

```javascript
// template
<div>
  hello
  <span>world</span>
</div>
// 转义为如下
[
  {type:'符号'value:'<'},
  {type:'文本'value:'div',
  children:[
    {type:'文本'value:'hello'}
    ...
  ]
  }
  {type:'符号'value:'>'}
]

```

- 根据 ast 创建虚拟 dom

## 响应式原理

### reactive 原理

- proxy 用于劫持对象,Reflect 用于保证对象的默认行为，Reflect 是 Object 对象的高级版本
- track 方法使用 weakMap 收集依赖 target , key 关系
- proxyMap 使用 weakMap 收集已经被代理的对象

```
weakMap 因为其特性是只能使用对象做 key，刚好能收集要追踪的对象 target 和追踪 key 的关系，
weakMap （弱引用）他的key所在对象一旦没有其他引用就会被垃圾回收，有助于减少内存泄漏
```

```javascript
const obj1 = {
  name: "张三",
  age: 20,
  address: "深圳",
  get show() {
    return `姓名：${this.name} 年龄：${this.age}`;
  },
};
const obj2 = {
  name: "李四",
  age: 30,
};
const TrackTpye = {
  GET: "get",
  HAS: "has",
};
const TriggerType = {
  SET: "set",
  ADD: "add",
  DEL: "del",
  CLEAR: "clear",
};
const proxy = new Proxy(obj1, {
  get(target, name, receiver) {
    // 拦截某些行为
    // if (name == "age") {
    //   return "没有年龄";
    // }
    // 收集响应
    track(target, TrackTpye.GET, name);
    // 否则完成默认行为
    return Reflect.get(target, name, receiver);
  },
  set(target, name, value, receiver) {
    // if (name == "name") {
    //   // 拦截某些行为
    //   value = 30;
    // }
    const hasKey = target.has(name);
    if (!haskey) {
      trigger(target, TriggerType.ADD, name, value);
    } else {
      trigger(target, TriggerType.SET, name, value);
    }
    return Reflect.set(target, name, value, receiver);
  },
});
// Reflect.get(obj,key,receiver) , 如果obj里有不是get,set 方法则 receiver对象会代理this
Reflect.get(obj1, "show"); // 姓名：张三 年龄：20
Reflect.get(obj1, "show", obj2); // 姓名：李四 年龄：30
```

### ref 原理 底层走的是 reactive()

### 首屏加载优化

- 原因：网络原因、文件过大，请求远程资源过多，JS 执行占用线程

- 解决方案：CDN 储存,（文件拆分，路由懒加载，资源压缩），（浏览器缓存，按需加载），（JS 加载后执行，SSR 服务端渲染）

### pinia 替代 vuex

- pinia 支持 vue3 的组合式 API 同时兼容 Vue2 的 Options API
- pinia 对 ts 的支持
- 支持服务端渲染

### 前端性能优化指标

- 首次加载速度
- 首次加载后可交互时间，比如 input 渲染后，由于大 js 继续执行导致，用户点击输入框无反应等
- 布局稳定性，内容在动态加载时从上一个位置被顶到其他位置，导致页面布局变化太大
