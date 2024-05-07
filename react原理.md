# 源码解析

## AST 过程

- 插件
- @babel/plugin-transform-react-jsx

```javascript
//   @babel/plugin-transform-react-jsx 将jsx 转换成React.createElement({})
const element = () => <div></div>;
```

## schedule 调节任务执行

- 帧的概念：浏览器每秒钟 60 帧（页面绘制），是标准流程，一帧大约 16.6ms,（浏览器空闲时一帧是 50ms）当一帧执行完后，如果 js 还占用线程，则页面渲染会卡顿
- frame start--> input event--> requestAnimationFrame-->渲染任务--> requestIdleCallback（渲染完成，会通知浏览器空闲啦，可以执行其他任务了）

- 使用 schedule 进行调节任务，schedule 模拟实现了 浏览器`requestIdleCallback` API 去实现

```javascript
// 1、requestAnimationFrame 浏览器在下次绘制之前，回调callback,
function callback(drawTime: Performance) {
  // drawTime 表示开始执行动画的时间，会从开始执行时累计，正常每次 16.6 ms 累加
  // 执行任务...
  // 结束前,继续回调，则可继续执行
  requestAnimationFrame(callback);
}
requestAnimationFrame(callback);
///2、requestIdleCallback 可以在浏览器空闲时执行callback idle-空闲
function callback2(drawTime: Performance) {
  // drawTime 表示开始执行动画的时间，会从开始执行时累计，正常每次 16.6 ms 累加
  // 执行任务...
  // 结束前,继续回调，则可继续执行
  requestAnimationFrame(callback);
}
requestIdleCallback(callback);

// 3、MessageChannel(); 返回带有两个端口的channel对象，两个对象相互通信
const channel = new MessageChannel();
channel.port1.postMessaage("hello");
channel.port2.postMessaage("world");
// port1 接受port2 发送的消息，
channel.port1.onmessage = function (msg) {
  //  ....
  console.log(msg);
};
// port2 接受port1 发送的消息，
channel.port2.onmessage = function (msg) {
  //  ....
  console.log(msg);
};
```

- reconciler 调和阶段，diff 算法阶段，将需要做变更的操作记录到一个地方,这个阶段可以终止和恢复
- commit 执行上面所有需要执行的操作，必须同步执行，不能中断

## react fiber 数据结构（任务单元）

- 每个 fiber 对应每一个渲染任务单元，通过 fiber 可以控制任务优先级，和中断任务恢复任务
- 深度遍历优先：结构最深的那个节点最先执行，然后是其兄弟节点都执行了，再返回执行其父和其父的兄弟，最后执行根节点

- 出现原因：React15 递归遍历，js 对主线程占用时间太长，导致 GUI 渲染线程不能工作，导致卡
- 需要能够中断渲染任务执行,执行优先级更高的任务，然后重新恢复执行
- 区分任务优先级
- fiber 通过链表记录 组件中的子节点、父节点、兄弟节点所有可以中断后执行

```js
// react 15 递归渲染
function rendre(element) {
  element.forEach();
}
// react fiber
{
    stateNode:null,// 当前节点
    props:{
        children:[],//子节点
    }
    sibling:null,//兄弟节点
}
```

## 深度优先，广度优先

- 深度优先，即从树的根节点开始，找到一条分支，找子节点，直到最后一个子节点，然后返回上一个节点，找其兄弟分支，重复上述步骤找到兄弟分支最后一个节点...
- 广度优先，从根节点开始从最近的一层开始找，找完第一层，找第二层，...

## react Diff

- 同层比较，类型不同直接 新增、删除节点
- 子节点移动， 新增、删除节点
- 子节点移动 仅右移动 ，如果遇到需要左移的不动

## state

- 同时变化的 state,合并声明，减少变量

## react 事件(合成事件，自己包装)机制

- 对不同浏览器的底层事件兼容性进行了处理
- 使用了事件池，避免频繁创建和消耗事件

## useState 使用数组解构赋值，

- 可以让用户随意命名，如果是对象的话需要对应 key

## 为啥使用 hooks

- 主要是在 effect 里可以在一个地方处理事件的监听和移除监听，如果使用 class 需要再不同的声明周期函数中处理代码逻辑分散

## 为啥 render 里只能有一个根元素，因为树节点只能有一个根节点

## React Protal 组件 类似 vue teleport to='xx' 组件,将组件渲染到指定位置

- 无论渲染到哪里不影响 Context 的使用

```javascript
// child 子组件，渲染到 document.getElementById('div')
React.createProtal(child, container);
```

## HOC

- 什么时候使用 hoc：1-不能修改原组件的情况下，批量给组件提供公共能力公共属性，2-继承原组件返回新组件

- 抽离重复逻辑
- 渲染拦截，根据条件返回对应组件 自定义 Route
- 拦截生命周期

```javascript
// 注入props
function (component){
    const other={name:'张三',age:32};
    return (props)=> <component {...props} {...other}/>
}

function (component){
    return class extends React.Component{
        render(
            const other={name:'张三',age:32};
            return (props)=> <component {...props} {...other}/>
        )
    }
}
// 函数组件也可操作state
function (component){
    return class extends React.Component{
        const other={name:'张三',update:this.setState({name:})};
        render(
            return (props)=><component  {...other}/>
        )
    }
}
// 反向继承，通过匿名类就是继承传入的组件，然后可以拦截其生命周期

function (component){
    const didMount=component.prototype.componentDidMount
    return class extends component{
        componentDidMount(){
            if(didMount){
                didMount.apply(this)
            }
            // 拦截代码
        }
        render(
            return super.render()
        )
    }
}
```
