// (function() {
//     const originalSetItem = sessionStorage.setItem
//     const originalRemoveItem = sessionStorage.removeItem

//     // 重写 setItem 方法
//     sessionStorage.setItem = function (key, value) {
//       console.log(`sessionStorage 设置： ${key} = ${value}`)
//       const event = new CustomEvent('sessionStorageChange', {
//         detail: { key, value, type: 'set' }
//       })
//       console.log(event)
//       window.dispatchEvent(event) // 触发自定义事件
//       originalSetItem.call(sessionStorage, key, value) // 调用原始的 setItem
//     }

//     // 重写 removeItem 方法
//     sessionStorage.removeItem = function (key) {
//       console.log(`sessionStorage 移除： ${key}`)
//       const event = new CustomEvent('sessionStorageChange', {
//         detail: { key, type: 'remove' }
//       })
//       window.dispatchEvent(event) // 触发自定义事件
//       originalRemoveItem.call(sessionStorage, key) // 调用原始的 removeItem
//     }
//   })();
  