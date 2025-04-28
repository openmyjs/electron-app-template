/**
 * 前端选择文件
 * @returns {string}
 * @example 
 *  chooseFile()
 * 
 */
export const chooseFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.JPEG,.png,.jpg,' // 限制只能选择Excel文件
  // 监听input的change事件
  input.addEventListener('change', (event: any) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      // console.log('selectedFile',selectedFile);
      // 可以在这里执行进一步的操作，比如读取文件内容

      // const reader = new FileReader();
      //     reader.onload = (e) => {
      //       console.log('File content:', e.target.result);
      //     };
      //     reader.readAsArrayBuffer(selectedFile); // 读取文件内容为ArrayBuffer

      // 如果你想将Blob转换为URL，可以使用URL.createObjectURL
      const fileURL = URL.createObjectURL(selectedFile)
      console.log('File URL:', fileURL)
    }
  })

  // 触发input的click事件来打开文件选择对话框
  input.click()
}

/**
 * 随机生成UUID
 * @param {number} len  长度 2-16 取值
 * @param {number} binary 二进制 16/2/8取值
 * @returns {string}
 * @example 
 *  uuid(16,16)
 * */
export const uuid = (len:number, binary:number) => {
	len = !len ? 36 : len;
	binary = !binary ? 16 : binary;
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * binary | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(binary);
	}).substring(0, len)
}