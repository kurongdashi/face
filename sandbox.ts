// sandbox 实现原理
/**
 * qiankunjs 实现原理
 *
 *生命周期->路由加载->sandbox隔离->shadow dom隔离
 *
 * shadow dom隔离 动态从子应用中取出template.innerHTML 赋值给一个新<div>.innerHTML,然后将这个div挂载到主document上
 *
 */
const fakeWind = { name: '张三' };
const proxy = new Proxy(fakeWind, {
    get(target, key, val) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key);
        } else {
            // 从真实window取
            return Reflect.get(window, key);
        }
    },
    set(target, key, val) {
        Reflect.set(target, key, val);
        return true;
    }
});
// 使用立即执行函数将
// var fakeWindow = ${JSON.stringify(fakeWind)};
const code = `(function(window){
    console.log('sandbox--');console.log(name);
})(proxy)`;

eval(code);

// 凡是实现了iterator 接口的都可以使用for...of 遍历，同时也可以是...扩展语法展开
// 所以 array，Object,map,set,string arguments,typeArray
// WeakMap 键只能是对象或者symbol weakSet 值只能是对象或symbol
const set = new Set([1, 2, 3, 4, 5, 5]);
for (let item of set) {
    console.log('item=', item);
}
//
// for (let item of 'hello world') {
//     console.log('item=', item);
// }
/***
 * promise 缺点
 * 1、不能中途取消 2、如果没有回调函数将无法知道内部错误 3、pending状态无法知道进度
 *
 */
// 直接转成Promise对象
const p0 = Promise.resolve('1');
console.log('p0:', p0);
// promise创建后执行
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve('world');
    }, 1000);
}).then(res => p0);
const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve('hello');
    }, 2000);
})
    .then(res => 'world')
    .then(res => console.log(res));

const p3 = new Promise(function (resolve, reject) {
    setTimeout(() => {
        reject('发生错误~');
    }, 1000);
});
//Promise.all（必须都成功）所有的promise都resolve完成，才会回调then，只要有一个返回reject 则回调catch,整个结果都是reject
// 作为参数的Promise不要catch,否则 all无法catch了
Promise.all([p1, p2, p3])
    .then(res => {
        console.log('all-then', res);
    })
    .catch(e => {
        console.log('all-catch-', e);
    });
// promise.race() 入参里promise只要有一个执行完了，就直接回调then,或catch代表整个race的结果
Promise.race([p1, p2, p3])
    .then(res => {
        console.log('race-then', res);
    })
    .catch(e => {
        console.log('race-catch-', e);
    });
//es2020 Promise.allSettled所有的 p都完成，不管结果是resolve,reject 都回调then，不会有catch
Promise.allSettled([p1, p2, p3])
    .then(res => {
        console.log('allSettled-then', res);
    })
    .catch(e => {
        console.log('allSettled-catch-', e);
    });
//es2021 promise.any() （成功只需要一个，失败需要所有都失败才失败） 只要有一个resolve就then，或者所有都reject，才catch
// Promise.any([p1, p2, p3])
//     .then(res => {
//         console.log('any-then', res);
//     })
//     .catch(e => {
//         console.log('any-catch-', e);
//     });
// 提案 promise.try 模拟try/catch 用于处理函数（同步函数同步执行，异步函数then执行）
// Promise.try(() => console.log(111))
//     .then(res => {
//         console.log('any-then', res);
//     })
//     .catch(e => {
//         console.log('any-catch-', e);
//     });
// 十进制小数点无法用二进制小数点表示所以丢失精度
(0.1 + 0.3).toFixed(2);
// BigInt 第八种数据类型表示大整型
console.log('toFixed', (0.1 + 0.3).toFixed(2));
console.log('bigint：', 1234n + 2n);
