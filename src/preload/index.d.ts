import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: electron
    api: any,
    msg:any
  }
  interface electron {
    ipcRenderer:import('electron').IpcRenderer
  }
}


// // 使用命名空间封装接口，避免全局污染
// declare global {
//   namespace MyApp {
//     interface WindowExtensions {
//       electron: ElectronAPI;
//       api: unknown; // 建议明确定义具体类型
//       msg: unknown; // 建议明确定义具体类型
//     }
//   }
// }

// 扩展全局 Window 对象
// interface electron extends Window.electron {}
