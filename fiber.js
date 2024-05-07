/** 模拟fiber运行***/

const channel = new MessageChannel();
/**
 * requestAnimationFrame：
 * 系统绘制频率 1秒钟 60次，回调函数只会在这个绘制间隔中执行，不影响绘制(见缝插针)
 * 非常适合：超大数据渲染，时时监听执行
 * 参考 https://blog.csdn.net/hyupeng1006/article/details/128861813
 *
 *  */
// 一帧执行时间标准情况下
const frameTime = 1000 / 60;
let gCallback = null,
  // 一帧的结束时间
  endTime;
// 剩余空闲时间的计算，每次的结束时间- 执行任务前的当前时间
const timeRemaining = () => endTime - performance.now();
// 接受到消息
channel.port2.onmessage = function (e) {
  // console.log(e.data);
  // 执行任务前的当前时间 performance.now
  let currentTime = performance.now();
  console.log("currentTime:", currentTime);
  console.log("endTime:", endTime);
  // 由于执行其他任务，导致当前时间大于结束时间时，也要执行任务
  let timeOut = endTime <= currentTime;
  if (timeOut || timeRemaining() > 0) {
    // 执行任务
    gCallback && gCallback({ timeOut, timeRemaining });
  }
};

window.requestIdleCallback = function (callback, options) {
  window.requestAnimationFrame((time) => {
    console.log("开始时间:", time);
    // 帧结束时间 = 一帧需要时间+动画开始时间
    endTime = frameTime + time;
    gCallback = callback;
    // 发送消息
    channel.port1.postMessage("port1");
  });
};
