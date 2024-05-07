// Vue 的响应式核心逻辑，观察者设计模式
interface Observe {
    update: (str: string) => void;
}

export default class Person {
    _name: string;
    observers: Observe[] = [];
    constructor(name?: string) {
        this._name = name || '';
    }
    // get set 关键词修饰方法名称，外部通过 类.方法名读取或修改对应属性
    get name() {
        return this._name;
    }
    set name(str: string) {
        this._name = `姓名：${str}`;
        this.update(str);
    }
    attach(obs: Observe) {
        this.observers.push(obs);
    }
    update(str: string) {
        this.observers.forEach(item => {
            item.update(str);
        });
    }
}

export class MyObserve implements Observe {
    update(str: string) {
        console.log('观察到了name改变了，当前name:', str);
    }
}
