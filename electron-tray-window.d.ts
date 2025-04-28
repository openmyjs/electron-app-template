declare module 'electron-tray-window' {
  import { BrowserWindow } from 'electron';

  interface TrayWindowOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    showEffect?: string;
    hideEffect?: string;
    url?: string;
  }

  class TrayWindow {
    constructor(options: TrayWindowOptions);
    // 添加其他方法和属性的声明
  }

  export = TrayWindow;
}