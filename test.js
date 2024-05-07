/**
 * let arr=[1,2,3] 实现 从前添加元素的方法
 * arr.myUnshift(3,4,5) // 3,4,5,1,2,3
 */
let arr1 = [1, 2, 3];
Array.prototype.myUnshift = function () {
  let i = 0,
    len = arguments.length;
  while (i < len) {
    // 添加元素,从最后一个开始添加
    this.splice(0, 0, arguments[len - (i + 1)]);
    i++;
  }
  return this.length;
};
console.log(arr1.myUnshift(4, 5, 6), arr1);
