import axios from 'axios'

export default async function(args:any){
  const { url,method,data} = args
  const { params, body} = data
  const methods = method || 'get'

  return new Promise(async(resolve,_reject)=>{
    switch (methods){
      case 'get':
        axios.get(url,{params}).then((res)=>{
          resolve({
            status: true,
            msg: '请求执行成功',
            data: res.data
          })
        }).catch((err)=>{
          console.log('main/request', err)
          resolve({
            status: false,
            msg: '请求执行失败',
            info:{
              code: err.code,
              errno: err.errno,
              hostname: err.hostname,
              url: err.config.url,
            }
          })
        })

        break
      case 'post':
        axios.post(url,body,{params}).then((res)=>{
          resolve({
            status: true,
            msg: '请求执行成功',
            data: res.data
          })
        }).catch((err)=>{
          resolve({
            status: false,
            msg: '请求执行失败',
            info:{
              code: err.code,
              errno: err.errno,
              hostname: err.hostname
            }
          })
        })
        break
      default:
        console.log('main/request', 'method 类型错误')
        return
    }
  })
}





