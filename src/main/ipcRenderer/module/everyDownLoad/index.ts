import { DownloaderHelper } from 'node-downloader-helper'
// import path from 'path'
import fsExtra from 'fs-extra'

export default async function(param: { fileUrl: string, savePath: string, fileName: string, override?: boolean}){
 const { fileUrl, savePath, fileName, override=false} = param
  if (!fsExtra.existsSync(savePath)) {
    fsExtra.mkdirSync(savePath, { recursive: true });
  }
  // const filePath = path.join(savePath, fileName);
  return new Promise<any>((resolve, _reject) =>{
    // 创建下载器实例
    const dl = new DownloaderHelper(fileUrl, savePath,{
      fileName: fileName, // 自定义文件名
      retry: { maxRetries: 3, delay: 2000 }, // 最多重试3次，每次间隔2秒
      override: override
    });

// 监听下载完成事件
    dl.on('end', (downloadInfo) => {
      // console.log('下载完成:', downloadInfo);
      // console.log(`文件保存路径: ${downloadInfo.filePath}`);
      resolve(downloadInfo)
    });

// 监听错误事件
    dl.on('error', (err) => {
      console.error('下载失败:', err.message);
      resolve(err)
    });

// 开始下载
    dl.start();
  })


}



