<template>
  <div class="deployTab1 f-scroll-x">
    <a-table :columns="columns" :data-source="data" align>
      <template #title>
        <a-button type="primary" size="small" @click="addRefs.open()">添加容器</a-button>
      </template>
    </a-table>
    <AddContainerModal ref="addRefs" :execTo="execTo" @change="loadData" />
  </div>
</template>
<script lang="tsx" setup>
import { ref, defineProps, watch } from 'vue'
import AddContainerModal from './components/addContainer-modal/addContainer-modal.vue'
import { Button } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
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
  }
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

const columns: any = ref([
  {
    title: '容器名字',
    dataIndex: 'Names',
    customRender: ({ value, record }) => {
      return (
        <>
          <Button
            type="link"
            onClick={() => {
              console.log('Names', record)
              router.push({
                path: '/pm/serviceMaintenance/deploy/getDetails',
                query: {
                  Image: record.Image,
                  Names: record.Names
                }
              })
            }}
          >
            {value}
          </Button>
        </>
      )
    }
  },
  { title: '镜像名', dataIndex: 'Image' },
  {
    title: '映射接口',
    dataIndex: 'Ports',
    ellipsis: true
  },
  { title: '容器ID', dataIndex: 'ID' },
  // { title: '命令', dataIndex: 'Command' },
  { title: '创建时间', dataIndex: 'RunningFor' },
  { title: '运行时长', dataIndex: 'Status' },
  { title: '状态', dataIndex: 'State' },
  {
    title: '操作',
    dataIndex: 'Names',
    fixed: 'right',
    width: 100,
    customRender: ({ value }) => {
      return (
        <>
          <Button type="link" onClick={() => {}}>
            设置
          </Button>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                title: '确认删除？',
                content: '删除后无法恢复',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await execTo(`docker kill  ${value}`)
                  await execTo(`docker rm ${value}`)
                  await loadData()
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
const tap = async () => {}
const execTo = async (commend: string) => {
  const res = await props.exec(commend)
  if (res.data.linkStatus === 0) {
    return res.data.exec
  }
}

const loadData = async () => {
  const get = await execTo('docker ps -a --format "{{json .}},"')
  console.log('get', get)
  data.value = parseTable(get.log).map((item: any) => {
    return {
      ...item,
      RunningFor: translateTimeToChinese(item.RunningFor)
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

function translateTimeToChinese(timeStr) {
  const timeUnits = {
    second: '秒',
    minute: '分钟',
    hour: '小时',
    day: '天',
    month: '个月', // 注意中文中月份通常需要“个”作为量词
    year: '年',
    // 注意：周在中文里通常不直接跟在数字后面说“1周”，而是说“1个星期”
    // 但为了简单起见，这里我们还是用“周”
    week: '周'
  }

  const numberPattern = /(\d+)/
  const unitPattern = /(second|minute|hour|day|month|year|week)s?/i
  const upPattern = /^up\s+/i
  const agoPattern = /ago$/i

  let matchNumber, matchUnit

  // 检查是否是 "Up X units" 格式
  if (
    (matchNumber = timeStr.match(numberPattern)) &&
    (matchUnit = timeStr.match(unitPattern)) &&
    timeStr.match(upPattern)
  ) {
    // "Up" 通常表示从现在开始向上的时间，但在中文里我们不说“上5小时”，而是说“5小时前”的相反意思，即“5小时后”
    // 但为了保持一致性，这里我们直接翻译为“已过去X小时”，虽然这种表述不常见
    // 更常见的可能是“5小时后”（但这需要额外的逻辑来判断）
    // 这里我们简单处理为“Up”表示一个正面的时间增量，不直接翻译为中文的“上”
    return `${parseInt(matchNumber[0], 10)}${timeUnits[matchUnit[0].toLowerCase().replace(/s$/, '')]}`
    // 注意：上面的翻译可能不是最准确的，通常我们需要更多上下文来决定如何翻译“Up X hours”
    // 比如，在社交媒体上它可能意味着“X小时前发布的更新”，而在其他上下文中可能意味着不同的东西
  }

  // 检查是否是 "X units ago" 格式
  if (
    (matchNumber = timeStr.match(numberPattern)) &&
    (matchUnit = timeStr.match(unitPattern)) &&
    timeStr.match(agoPattern)
  ) {
    return `${parseInt(matchNumber[0], 10)}${timeUnits[matchUnit[0].toLowerCase().replace(/s$/, '')]}前`
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
