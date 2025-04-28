<template>
  <div class="deployTab1 f-scroll-x">
    <a-table :columns="columns" :data-source="data" style="height: 500px">
      <template #title>
        <a-button type="primary" size="small" @click="addRefs.open(data)">添加基础镜像</a-button>
        <!--        <a-button type="primary" size="small" @click="tap" style="margin-left: 10px">制作镜像</a-button>-->
        <a-button type="primary" size="small" @click="tap" style="margin-left: 10px">基础镜像源</a-button>
        <a-button type="primary" size="small" @click="emptyNoImages" style="margin-left: 10px">清理悬空镜像包</a-button>
        <a-button type="primary" size="small" @click="createImages" style="margin-left: 10px">制作镜像</a-button>
      </template>
    </a-table>
    <addImage ref="addRefs" :execTo="execTo" @change="loadData" />
    <addYumModal ref="addYumRefs" :execTo="execTo" />
    <createImage ref="createRefs" :execTo="execTo" :serverConfig="serverConfig" @refresh="loadData" />
    <addContainer ref="addContainerRefs" :execTo="execTo" />
  </div>
</template>
<script lang="tsx" setup>
import { defineProps, ref, watch } from 'vue'
import addImage from './components/addImage-modal.vue'
import addYumModal from './components/addYum-modal.vue'
import createImage from './components/createImage-modal/createImage-modal.vue'
import addContainer from './components/addContainer-modal/addContainer-modal.vue'
import { Button, Modal } from 'ant-design-vue'

const props = defineProps({
  exec: {
    type: Function,
    required: true
  },
  keys: {
    type: Number,
    default: 1
  },
  activeKey: {
    type: Number,
    default: 0
  },
  serverConfig: Object
})
watch(
  () => props.activeKey,
  () => {
    if (props.activeKey === props.keys) {
      loadData()
    }
  }
)

const addRefs: any = ref(null)
const addYumRefs: any = ref(null)
const createRefs: any = ref(null)
const addContainerRefs: any = ref(null)
const columns: any = ref([
  {
    title: '镜像包名称',
    dataIndex: 'Repository',
    customRender: ({ value, record }) => {
      return (
        <>
          <Button type="link" onClick={() => addContainerRefs.value.open({ imageName: value, tag: record.Tag })}>
            {value}
          </Button>
        </>
      )
    }
  },
  { title: '版本号', dataIndex: 'Tag' },
  { title: '镜像ID', dataIndex: 'ID' },
  { title: '版本更新时间', dataIndex: 'CreatedSince' },
  { title: '大小', dataIndex: 'Size' },
  {
    title: '操作',
    dataIndex: 'Repository',
    fixed: 'right',
    width: 100,
    customRender: ({ record }) => {
      return (
        <>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                title: '确认删除？',
                content: '删除后无法恢复',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  // console.log('Names', `docker rmi ${record.Repository}:${record.Tag}`)
                  const get = await execTo(`docker rmi ${record.Repository}:${record.Tag}`)
                  if (get.code === 0) {
                    await loadData()
                  } else {
                    Modal.error({
                      title: '删除失败',
                      content: get.log
                    })
                  }
                }
              })
            }}
          >
            删除
          </Button>
        </>
      )
    }
  }
])

const data: any = ref([])
const tap = async () => {
  addYumRefs.value.open()
}
const emptyNoImages = () => {
  Modal.confirm({
    title: '确认清理悬空镜像包？',
    content: '删除后无法恢复',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      await execTo(`docker rmi $(docker images -f "dangling=true" -q)`)
      await loadData()
    }
  })
}
const createImages = async () => {
  createRefs.value.open()
}
const execTo = async (commend: string) => {
  const res = await props.exec(commend)
  if (res.data.linkStatus === 0) {
    return res.data.exec
  }
}
const loadData = async () => {
  const get = await execTo('docker images --format "{{json .}},"')
  console.log('get', parseTable(get.log))
  data.value = parseTable(get.log).map((item: any) => {
    return {
      ...item,
      CreatedSince: translateTimeToChinese(item.CreatedSince)
      // STATUS: translateTimeToChinese(item.STATUS)
    }
  })
  // console.log('data', data.value)
}
// const toZhName = (text: any) => {
//   let nameList = {
//     'CONTAINER ID': '容器ID',
//     IMAGE: '镜像名',
//     COMMAND: '命令',
//     CREATED: '创建时间',
//     STATUS: '运行时长',
//     PORTS: '映射接口',
//     NAMES: '容器名字'
//   }
//   return nameList[text] || text
// }

/** linux字符串表格转成json表格*/
function parseTable(tableString: string) {
  const str = tableString.substring(0, tableString.length - 2)

  const TOJSOINSTR = `[${str}]`
  return JSON.parse(TOJSOINSTR)
}

function translateTimeToChinese(timeStr: string) {
  const timeUnits = {
    second: '秒',
    minute: '分钟',
    hour: '小时',
    day: '天',
    month: '个月', // 注意中文中月份通常需要“个”作为量词
    year: '年',
    week: '周'
  }

  // 边界条件检查
  if (!timeStr) {
    return '无法识别的时间格式'
  }

  // 合并正则表达式
  const pattern = /^(up\s+)?(\d+)\s*(second|minute|hour|day|month|year|week)s?\s*(ago)?$/i
  const match = timeStr.match(pattern)

  if (match) {
    const [, up, number, unit, ago] = match
    const normalizedUnit = timeUnits[unit.toLowerCase()]
    const num = parseInt(number, 10)

    if (isNaN(num) || !normalizedUnit) {
      return '无法识别的时间格式'
    }

    if (up) {
      // "Up" 表示正面的时间增量，简单处理为“已过去X小时”
      return `${num}${normalizedUnit}`
    } else if (ago) {
      return `${num}${normalizedUnit}前`
    } else {
      // 默认情况下返回原始字符串
      return timeStr
    }
  }

  // 如果都不匹配，返回原始字符串或提示错误
  return '无法识别的时间格式'
}
</script>
<style lang="scss" scoped>
.deployTab1 {
  //background-color: #3178c6;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
