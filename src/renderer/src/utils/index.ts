

/**
 * 生成uuid 随机字符串
 * @param num 生成的长度 取值范围为（2-36)
 * @param binary 二进制 16/2/8取值
 * @example
 *  uuid(16,16)
 * */
export function uuid(num?: number, binary?: number): string{
  const len = num || 36;
  binary = binary || 16;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * binary | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(binary);
  }).substring(0, len)
}


export function getValueByPath(obj, path) {
  // 将路径字符串按 '.' 分割成数组
  const pathParts = path.split('.');

  // 初始化当前对象为传入的对象
  let currentValue = obj;

  // 遍历路径数组
  for (let part of pathParts) {
    // 使用可选链安全地访问当前对象的属性
    currentValue = currentValue?.[part];

    // 如果当前值为 undefined（说明路径中的某个部分不存在），则退出循环
    if (currentValue === undefined) {
      break;
    }
  }

  // 返回最终的值（可能是 undefined 如果路径中的某个部分不存在）
  return currentValue;
}

let interval: any = {}
/**
 * 倒计时
 * @example示例 countDown(time:number,callback:function)
 * @ck 回调 callback({state:boolean,time:number})
 * @explain注释 countDown(倒计时总时间,每次触发的回调函数)
 * @net https://www.openmyapp.com
 * */
export const countDown = (
  time: number,
  callback: (params: {state: boolean;time: null | number}) => void
): void => {
  if (typeof callback !== 'function') return
  let name: string = uuid(10, 16)
  interval[name] = {}
  if (typeof interval[name].state !== 'boolean') {
    interval[name].state = false
    interval[name].time = time
    interval[name].sign = name
  }
  if (interval[name].state) return
  interval[name].sign = setInterval(function () {
    interval[name].time -= 1
    callback({
      state: false,
      time: interval[name].time
    })
    if (interval[name].time <= 0) {
      clearInterval(interval[name].sign)
      // interval[name].state = false
      callback({
        state: true,
        time: null
      })
    }
  }, 1000)
}
interface extractFileInfoReturns{
  filePath: string; // 文件路径
  fileNameWithExtension: string; // 文件名（包含扩展名）
  fileName: string; // 文件名（不包含扩展名）
  fileType: string; // 文件类型（扩展名）
}
/**
 * 提取文件路径字符串信息
 * @param fileInfo 文件路径字符串
 * @return {extractFileInfoReturns}
 * @example
 * extractFileInfo('C:\\Users\\Administrator\\Desktop\\test.txt')
 * */
export const extractFileInfo = (fileInfo: string):extractFileInfoReturns=> {
  // 获取最后一个反斜杠的位置
  const lastSlashIndex = fileInfo.lastIndexOf("\\");
  // 获取文件路径
  const filePath = fileInfo.substring(0, lastSlashIndex + 1);
  // 获取文件名（包含扩展名）
  const fileNameWithExtension = fileInfo.substring(lastSlashIndex + 1);
  // 获取文件名（不包含扩展名）
  const fileName = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf("."));
  // 获取文件类型（扩展名）
  const fileType = fileNameWithExtension.substring(fileNameWithExtension.lastIndexOf(".") + 1);

  return {
    filePath,
    fileNameWithExtension,
    fileName,
    fileType
  };
}

/**
 * 获取url参数
 * @param url url地址
 * @example
 * getUrlParams('https://www.baidu.com?name=zhangsan&age=18')
 * @return {host:string,href:string,query:object}
 * */
export function getUrlParams(url:string =  window.location.href):{host:string,href:string,query:any} {
  // 创建一个 URL 对象
  const urlObj = new URL(url);

  // 提取 host
  const host = urlObj.host;

  // 提取查询字符串部分
  const queryString = urlObj.search;

  // 使用 URLSearchParams 解析查询字符串
  const urlParams = new URLSearchParams(queryString);

  // 将查询参数转换为对象
  const query = {};
  urlParams.forEach((value, key) => {
    query[key] = value;
  });

  // 返回结果
  return {
    host: host,
    href: url,
    query: query
  };
}