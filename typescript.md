## keyof 索引

```typescript
//  keyof 将接口，或对象类型变成联合类型,类似object.keys()

interface Obj {
  type: string;
  flag: boolean;
  account: number;
}
// some 变成了一个 字面量联合的类型
type some = keyof Obj; // some = 'type'|'flag'|'account'
// k 必须是 obj中已存在的key
function getValue<T, k extends keyof T>(obj: T, key: k): T[k] {
  return obj[k];
}

// in 类似 for in  可以遍历所有的属性
type Readonly<T> = {
  readonly [p in keyof T]: T[p];
};
// 对接口类型中的所有属性进行约束
type newObj = Readonly<obj>;
```

## any never unkown null undefined

- any:动态类型，所有类型的父级
- never:表示无返回值的具名函数变量
- unkown:未知类型，层级仅次于 any,可以接受任意值
- null & undefined 是所有类型的子类型，层级最低
- void: 无返回值的函数

```typescript
let post: never;
post = () => {
  console.log("无返回");
};
```

## keyof+typeof

- keyof 可以将索引类型变成联合类型
- typeof 可以或变量或对象的 类型

```typescript
let obj = { x: "1", y: 2 };
// 定义的新类型为从原始对象中获取的 类型的联合类型
type allType = keyof typeof obj; // 'x'|'y'
```

## TS 模块加载过程

1. 从 module 中找
2. 从.d.ts 文件中找
3. 报错

## tsconfig 有哪些配置

```json
{
  "files": [], // 指定单个要编译的文件路径
  "include": [], // 指定要编译的一类文件
  "exclude": [], // 排除要编译
  "compileOnSave": false, //
  "extends": "", // 继承其他tsconfig 文件路径
  "compilerOption": {} // 核心编译配置项
}
```

## declare ,declare global , type

- declare 声明全局变量类型，全局模块导入 module 等
- declare global 给 window 增加属性

```typescript
// declare 主要用于全局，让编译器知道某些变量类型、或模块
declare var hello: string;
// 声明一个模块
declare module jQuery {
  export const myFunction: () => void;
}
// 使用
import { myFunction } from "jQuery";
// 给window增加一个新属性
declare global {
  interface window {
    newProp: string;
  }
}
// 使用
window.newProp;
// type 主要是 定义单个类型或联合类型的复杂类型的别名，主要对当前文件
```

## 工具类型 Exclude,Omit,Merge,Intersection,Overwrite

- Exculde<T,U> 是条件类型，指 从 T 中排除 U
- Omit<T,U> 从对象 T 中排除 U 属性
- Merge，Intersection 等于 & 运算符

```typescript
type a = Exclude<"a" | "b", "a">; // 'b'
interface Person {
  name: string;
  age: number;
  study: () => void;
}

type b = Omit<Person, "age">; // {name:string; study:()=>void}
```
