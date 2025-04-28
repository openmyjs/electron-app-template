<template>
  <div class="order">
    <div class="order-place">
      <a-button
        type="link"
        @click="
          () => {
            refs.addRefs.open()
          }
        "
        >新增</a-button
      >
    </div>
    <a-table style="margin-top: 5px" :dataSource="dataSource" :columns="columns" size="middle" />
    <addModal :ref="(el) => (refs.addRefs = el)" :initPassword="initPassword" @change="addModalChange" />
    <removeModal :ref="(el) => (refs.remove = el)" :initPassword="initPassword" @change="removerModalChange" />
  </div>
</template>
<script lang="tsx" setup>
import { Tooltip, Button } from 'ant-design-vue'
import addModal from './components/add-modal.vue'
import removeModal from './components/remove-modal.vue'
import dayjs from 'dayjs'

const initPassword:any = ref('')

const refs: any = ref({
  addRefs: null,
  remove: null
})

const dataSource = ref([])

const columns = ref([
  {
    title: '状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    customRender: ({ value }) => {
      switch (value) {
        case 0:
          return '待接单'
        case 1:
          return '已接单'
        case 2:
          return '已完成'
        default:
          return '-'
      }
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '客户名称',
    dataIndex: 'clientName',
    key: 'clientName'
  },
  {
    title: '客户手机',
    dataIndex: 'clientPhone',
    key: 'clientName'
  },
  {
    title: '客户地址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '接单信息',
    dataIndex: 'trucksInfo',
    key: 'trucksInfo',
    customRender: ({ record }) => {
      const trucks = getTrucksInfo(record)
      const list = `${trucks.trucksName} / ${trucks.trucksCode} / ${trucks.phone}`
      return (
        <>
          <Button
            type="link"
          >
            <Tooltip
              title={list}
            >
              {trucks.trucksName}
            </Tooltip>
          </Button>
        </>
      )
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
    customRender: ({ record }) => {
      const status = record.orderStatus !== 1
      return (
        <>
          <Button
            type="link"
            disabled={status}
            onClick={() => {
              refs.value.remove.open(record)
            }}
          >
            修改状态
          </Button>
        </>
      )
    }
  }
])

const getTrucksInfo = (record) => {
  // console.log('getTrucksInfo', record)
  const filter = trucksList.value.filter((item:any) => item.trucksCode === record.trucksCode)
  if (filter.length === 0) {
    return {
      trucksName: '',
      trucksCode: '',
      phone: ''
    }
  }
  return filter[0]
}


const trucksList = ref([])
const loadData = async () => {
  const trucks = await electron.readFile('dbFile/trucks')
  trucksList.value = JSON.parse(trucks)
  const order = await electron.readFile('dbFile/order')

  const orderList = JSON.parse(order)

  const client = await electron.readFile('dbFile/client')

  const clientList = JSON.parse(client)

  orderList.forEach((item: any) => {
    const filter = clientList.filter((item2: any) => {
      return item.phone === item2.phone
    })

    item.updateTime = dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')

    item.clientName = filter[0].clientName

    item.clientPhone = filter[0].phone

    item.clientAddress = filter[0].address
  })

  dataSource.value = orderList
}

const saveData = async () => {
  await electron.createFile({
    savePath: 'dbFile',
    fileName: 'order',
    content: JSON.stringify(dataSource.value)
  })
}

const addModalChange = () => {
  loadData()
}

const removerModalChange =async (e) => {
  console.log('removerModalChange', e)

  const filter:any = dataSource.value.filter((item:any) => item.id === e.id)
  filter[0].orderStatus = 2

  await saveData()

  const filter2:any = trucksList.value.filter((item:any) => item.trucksCode === filter[0].trucksCode)
  filter2[0].status = 0
  await electron.createFile({
    savePath: 'dbFile',
    fileName: 'trucks',
    content: JSON.stringify(trucksList.value)
  })
}
onMounted(() => {
  initPassword.value = sessionStorage.getItem('initPassword')
  loadData()
})
</script>

<style lang="scss" scoped>
.order {
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