import fsExtra  from 'fs-extra'
export default async function(){
  // 判断 file 是否存在
  const client =  fsExtra.existsSync('dbFile/client')
  if(!client){
    fsExtra.ensureDirSync('dbFile')
    fsExtra.writeFileSync('dbFile/client',JSON.stringify([]),{encoding:'utf-8'})
  }
  const order =  fsExtra.existsSync('dbFile/order')
  if(!order){
    fsExtra.writeFileSync('dbFile/order',JSON.stringify([]),{encoding:'utf-8'})
  }
  const trucks =  fsExtra.existsSync('dbFile/trucks')
  if(!trucks){
    fsExtra.writeFileSync('dbFile/trucks',JSON.stringify([]),{encoding:'utf-8'})
  }

}