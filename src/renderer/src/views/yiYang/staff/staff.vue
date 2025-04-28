<template>
  <div class="trucks">
    <div class="trucks-place">
      <a-button type="link" @click="()=>{
        refs.addRefs.open()
      }">新增</a-button>
    </div>
    <a-table
      style="margin-top: 5px"
      :dataSource="dataSource"
      :columns="columns"
      size="middle"
    />
    <addModal :ref="(el)=>refs.addRefs = el" @change="addModalChange" />
    <removeModal :ref="(el)=>refs.remove = el" :initPassword="initPassword" @change="removerModalChange" />
  </div>
</template>
<script lang="tsx" setup>
import addModal from './components/add-modal.vue'
import removeModal from './components/remove-modal.vue'
import { Button } from 'ant-design-vue'
const initPassword = ref('')
const refs:any = ref({
  addRefs: null,
  remove: null
})

const dataSource = ref([])

const columns = ref([
  {
    title: '联系人',
    dataIndex: 'trucksName',
    key: 'name',
  },
  {
    title: '车牌号',
    dataIndex: 'trucksCode',
    key: 'trucksCode',
  },
  {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '操作',
    key: 'action',
    width: '100px',
    customRender: ({value,index}) => {
      return <>
        <Button type="link" style="margin-right: 5px" onClick={()=>{
          refs.value.addRefs.open(value)
        }}>编辑</Button>
        <Button type="link" onClick={
          () => {
            refs.value.remove.open(index)
          }
        }>删除</Button>
      </>
    },
  }
])

const loadData =async ()=>{
  const res = await electron.readFile('dbFile/trucks')
  dataSource.value = JSON.parse(res)
}

const saveData = async ()=>{
  await electron.createFile({
    savePath: 'dbFile',
    fileName: 'trucks',
    content: JSON.stringify(dataSource.value)
  })
}

const addModalChange = ()=>{
  loadData()
}

const removerModalChange = (e)=>{
  dataSource.value.splice(e,1)
  saveData()
}
onMounted(()=>{
  initPassword.value = sessionStorage.getItem('initPassword')
  loadData()
})
</script>

<style lang="scss" scoped>
.trucks{
  width: 100%;
  height: 100%;
  background-color: var(--bg-color-content);
  border-radius: var(--border-radius-lg);
  padding: 5px;
  &-place {
    height: 50px;
    padding: 10px;
    //background-color: var(--bg-color-content);
    //border-radius: var(--border-radius-lg);
  }
}
</style>