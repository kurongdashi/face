export function add(...r) {
    console.log('我喜欢：');
    return r.reduce((r, e) => r + e);
}

export function print(str) {
    console.log('我爱吃：' + str);
    return '我爱吃：' + str;
}
// 副作用代码，
myEffect();
function myEffect() {
    window.hello = function () {
        console.log('我喜欢：写hello world--');
    };
    console.log('我喜欢：写代码--');
}
