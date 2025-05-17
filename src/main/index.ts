import { app, BrowserWindow } from 'electron'
import {onWindowDrag} from '@openmyjs/electron/drag-window/main'
import { createWindow } from './window'
import onLaunch from './onLaunch'
app.whenReady().then(async () => {

  const createMain = new createWindow()
  await createMain.main()
  await onLaunch()


  app.on('browser-window-created', (_, _window) => {
    console.log('browser-window-created')
  })
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils

  // 初始化窗口拖动功能
  onWindowDrag()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      // createMain.main()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
