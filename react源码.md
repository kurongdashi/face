# react 源码

## createElement
```js
createElement(type,config,children){
// 1、 分离config中的 props属性和特殊属性(key,self)，最普通属性赋值给props[key]
// 2、将children 子元素挂在到props.children
// 3、处理type.defaultProps 将其赋值到props对象

// 4、对key,ref属性进行Object.definedProperty(),开发环境就会警告，在内部通过props.key去获取key
Object.definedProperty(props,'key',{
    get:function(__DEV__){
        console.error('不能再组件内部，直接通过props获取key，ref等内部属性')
    }
})
// 5、判断元素是否是react dom， $$typeof=== symbol| 0x00123（十六进制）
return {
    $$typeof:ReactNode,
    key,
    props,
    type,
    ref,
    _owner,
}

}

```

## fiberRoot > rootFiber