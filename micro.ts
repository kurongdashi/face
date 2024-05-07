// 实践微任务执行

type task = () => void;
export type Scheduler = {
  tick: Promise<void>;
  enqueue: (task: task) => void;
  flush: () => void;
  onBeforeFlush: (callback: () => void) => task;
  onFlush: (callback: task) => task;
};
/***
 * queueMicrotask(()=>{...}) 是微任务执行器,入参是一个要执行的函数
 */
export function createSchedule(): Scheduler {
  // 创建一个微任务队列
  const queue = new Set<task>();
  //   微任务兜底执行工具promise
  const microTask = Promise.resolve();
  //   任务执行前回调队列 集合
  const beforeCallbacks = new Set<task>();
  const afterCallbacks = new Set<task>();
  //   微任务执行工具获取
  const queueTask =
    typeof queueMicrotask !== "undefined" ? queueMicrotask : microTask.then;
  // 微任务排队方法
  const enqueue = (task: task) => {
    // 将需要执行的任务加入微任务队列
    queue.add(task);
    taskFlush();
  };
  //   任务是否在执行中
  let flushing = false;
  const taskFlush = () => {
    // 可以执行的情况下开始执行微任务
    if (!flushing) {
      flushing = true;
      queueTask(flush);
    }
  };
  //   执行任务方法
  const flush = () => {
    // 执行任务前，执行所有的回调
    runAll(beforeCallbacks);
    // 从队列中取出，执行，删除
    for (const task of queue) {
      task();
      queue.delete(task);
    }
    flushing = false;
    // 执行任务之后，执行所有的回调
    runAll(afterCallbacks);
  };
  return {
    tick: microTask,
    enqueue,
    flush,
    onBeforeFlush: hook(beforeCallbacks),
    onFlush: hook(afterCallbacks),
  };
}
function hook(callbacks: Set<task>) {
  return (callback: task) => {
    // 将回调加入队列，
    callbacks.add(callback);
    // 并返回删除任务的方法
    return () => callbacks.delete(callback);
  };
}
// 运行所以得hooks
function runAll(callbacks: Set<task>) {
  for (const callback of callbacks) callback();
}

async function func1() {
  const scheduler = createSchedule();
  let a = 0;
  scheduler.enqueue(() => {
    a = 1;
  });
  scheduler.enqueue(() => {
    a = 2;
  });
  scheduler.enqueue(() => {
    a = 3;
  });
  scheduler.enqueue(() => {
    a = 4;
  });
  console.log("a=", a);
  scheduler.flush();
  console.log("a=", a);
  await scheduler.tick;
  console.log("a=", a);
}
func1();
