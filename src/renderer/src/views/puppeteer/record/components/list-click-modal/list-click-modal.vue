<template>
  <a-modal v-model:open="modelOpen" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" width="90%" :maskClosable="false">
    <div class="x">
      <Menu :selectedKeys="modeValue" @change="MenuChange"/>
      <div style="width: calc(100% - 200px)">
        <newPageGotoMode :ref="(el)=>refsList.newPageGoto = el" v-if="modeValue==='newPageGoto'" />
        <clickMode :ref="(el)=>refsList.click = el" v-if="modeValue==='click'" />
<!--        <mouseClickMode :ref="(el)=>refsList.mouseClick = el" v-if="modeValue==='mouseClick'"  />-->
<!--        <waitMouseClickMode :ref="(el)=>refsList.waitMouseClick = el" v-if="modeValue==='waitMouseClick'"  />-->
        <inputMode :ref="(el)=>refsList.input = el" v-if="modeValue==='input'" />
        <upLoadFileMode :ref="(el)=>refsList.upLoadFile = el" v-if="modeValue==='upLoadFile'"   />
        <selectMode :ref="(el)=>refsList.select = el" v-if="modeValue==='select'"   />
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="tsx">
import Menu from './cpmponents/menu.vue'
import newPageGotoMode from './cpmponents/newPageGotoMode.vue'
import clickMode from './cpmponents/clickMode.vue'
// import mouseClickMode from './cpmponents/mouseCilckMode.vue'
// import waitMouseClickMode from './cpmponents/waitMouseClickMode.vue'
import inputMode from './cpmponents/inputMode.vue'

import upLoadFileMode from './cpmponents/upLoadFileMode.vue'
import selectMode from './cpmponents/selectMode.vue'
const emit  = defineEmits(['change'])
const refsList:any = ref({
  newPageGoto:null,
  click: null,
  // mouseClick: null,
  // waitMouseClick:null,
  input:null,
  upLoadFile:null,
  select:null,
})
const refsListToRadio =computed(() => {
  return Object.keys(refsList.value)
})
const modelOpen = ref(false)
const confirmLoading = ref(false)
const modeValue: any = ref('click')
const title =ref('')

const elementData = ref({})


const openType: any= ref('')
const variateOptions:any = ref([])
/*element 元素数据 variate后端变量数据*/
const open = (type:string,element:any,variateOption:any,index?:number) => {
  console.log('open.data',element)
  // console.log('open.variate',variate)
  openType.value ={
    type,
    index
  }
  // variateData.value = variate
  let newData:any
  switch (type){
    case 'add':
      title.value = '新增'
      newData = {
        remark: element.data.tagName +':'+element.data.textContent,
        x:element.data.clientX,
        y:element.data.clientY,
        selector: element.data.selector,
        value:element?.value || '',
      }
      elementData.value = newData
      break
    case 'edit':
      title.value = '编辑'
      // modeValue.value = 'input'
      // console.log('elementData-------------------1',typeof element,element)
      newData = {
        remark: element.data.remark,
        x:element.data.x || 0,
        y:element.data.y || 0,
        selector: element.data.selector,
        value:element.data.value || null,
        valueType:element.data.valueType  || null,
        timeOut: element.data.timeOut,
        wait:element.data.wait,
        goOn: element.data.goOn ||false,
        index: element.data.index || 0,
      }
      elementData.value = newData
      break
  }
  setTimeout(() => {
    variateOptions.value = Object.keys(variateOption).map((item)=>{
      return{
        value: item,
        label: item,
      }
    })
    MenuChange(element.type)
  }, 100)
  modelOpen.value = true
}

const close = () => {
  modelOpen.value = false
}

const handleOk = () => {
  refsList.value[modeValue.value].verifyForm(async (res) => {
    const newData = {
      type:modeValue.value,
      data:res
    }
    // console.log('验证表单',res);
    emit('change',{
      ...openType.value,
      data:newData
    })
    close()
  })
}


const MenuChange = (e)=>{
  modeValue.value = e
  setTimeout(() => {
    refsList.value[e].update(elementData.value, variateOptions.value)
  }, 100)
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
