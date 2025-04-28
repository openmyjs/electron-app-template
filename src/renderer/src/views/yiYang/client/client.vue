<template>
  <div class="client">
    <div class="client-place">
      <a-button type="link" @click="()=>{
        refs.addRefs.open()
      }">新增</a-button>
      <a-button type="link" @click="()=>{
        refs.updatePassword.open()
      }">修改密码</a-button>
    </div>
    <a-table
      style="margin-top: 5px"
      :dataSource="dataSource"
      :columns="columns"
      size="middle"
    />
    <addModal :ref="(el)=>refs.addRefs = el" :initPassword="initPassword" @change="addModalChange" />
    <removeModal :ref="(el)=>refs.remove = el" :initPassword="initPassword" @change="removerModalChange" />
    <updateModal :ref="(el)=>refs.updatePassword = el" :initPassword="initPassword" @change="updateModalChange" />
  </div>
</template>
<script lang="tsx" setup>
import addModal from './components/add-modal.vue'
import removeModal from './components/remove-modal.vue'
import updateModal from './components/update-modal.vue'
import { Button } from 'ant-design-vue'
const initPassword:any = ref('123')
const refs:any = ref({
  addRefs: null,
  remove: null,
  updatePassword: null
})

const dataSource = ref([
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
])

const columns = ref([
  {
    title: '联系人',
    dataIndex: 'clientName',
    key: 'name',
  },
  {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '公司名称',
    dataIndex: 'company',
    key: 'company',
  },

  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
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
  const res = await electron.readFile('dbFile/client')
  dataSource.value = JSON.parse(res)
}

const saveData = async ()=>{
  await electron.createFile({
    savePath: 'dbFile',
    fileName: 'client',
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

const updateModalChange = ()=>{
  initPassword.value = sessionStorage.getItem('initPassword')
}

onMounted(()=>{
  initPassword.value = sessionStorage.getItem('initPassword')
  loadData()
})

</script>

<style lang="scss" scoped>
.client{
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