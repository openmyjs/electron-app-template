import { dialog, OpenDialogOptions } from 'electron'
import fsExtra from 'fs-extra'
import path from 'path'
export default async function (args: any) {
  return fun[args.type](args.data)
}
const fun = {
  /**
   * 选择文件
   * url: https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogwindow-options
   * @param options 选项
   * @return 文件路径
   * @example
   *
   * */
  chooseFile: (options: OpenDialogOptions) => {
    try {
      return dialog.showOpenDialogSync(options)
    } catch (error) {
      console.error('Error in chooseFile:', error)
      throw error
    }
  },
  /** 读取文件
   * @param path 文件路径
   * @return 文件内容
   * @example
   *
   * */
  readFile: (path: string) => {
    try {
      return fsExtra.readFileSync(path, 'utf-8')
    } catch (error) {
      console.error('Error in chooseFile:', error)
      throw error
    }
  },
  /** 新增文件
   * @param args.savePath 文件路径
   * @param args.fileName 文件名
   * @param args.content 文件内容
   * @param args.ensureDir 是否创建目录 确保路径存在
   * @example
   * */
  createFile: (args: { savePath: string; fileName: string; content: string; ensureDir?: boolean }) => {
    const { savePath, fileName, content, ensureDir = false } = args
    if (ensureDir) {
      fsExtra.ensureDirSync(savePath)
    }
    const filePath = path.join(savePath, fileName)
    try {
      fsExtra.writeFileSync(filePath, content, 'utf-8')
      return {
        code: 0,
        msg: '创建成功'
      }
    } catch (error) {
      console.error('Error in chooseFile:', error)
      throw error
    }
  },
  /**
   * 读取路径下所有目录和文件
   * @param path 路径
   * */
  readDir: (path: string) => {
    console.log('readDir--------`')
    try {
      return fsExtra.readdirSync(path)
    } catch (error) {
      console.error('Error in chooseFile:', error)
      throw error
    }
  },
  /**
   * 路径是否存在
   * @param path 路径
   * @return boolean
   * */
  exists: (path: string) => {
    try {
      return fsExtra.existsSync(path)
    } catch (error) {
      console.error('Error in chooseFile:', error)
      throw error
    }
  }
}

// /**
//  * 验证路径
//  * */
// function validatePath(pathStr: string): string {
//   if (!pathStr || !path.isAbsolute(pathStr)) {
//     throw new Error('Invalid path');
//   }
//   return path.normalize(pathStr);
// }
