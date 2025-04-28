<template>
  <div class="deployTab1 f-scroll-x">
    <a-table :columns="columns" :data-source="data" style="height: 500px">
      <template #title>
        <a-button type="primary" size="small" @click="addRefs.open()">添加镜像</a-button>
        <!--        <a-button type="primary" size="small" @click="tap" style="margin-left: 10px">制作镜像</a-button>-->
        <a-button type="primary" size="small" @click="tap" style="margin-left: 10px">镜像源</a-button>
      </template>
    </a-table>
    <addModal ref="addRefs" />
  </div>
</template>
<script lang="tsx" setup>
import { onMounted, ref, Fragment } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import addModal from './components/add-modal.vue'

// 使用插件
dayjs.extend(duration)
dayjs.extend(relativeTime)
const router = useRouter()
const addRefs: any = ref(null)
const columns: any = ref([
  {
    title: '容器名字',
    dataIndex: 'NAMES',
    width: '20%',
    customRender: ({ value }) => {
      return (
        <>
          <Button type="link" onClick={() => tap()}>
            {value}
          </Button>
        </>
      )
    }
  },
  { title: '镜像名', dataIndex: 'IMAGE' },
  { title: '映射接口', dataIndex: 'PORTS' },
  { title: '容器ID', dataIndex: 'CONTAINER ID' },
  { title: '命令', dataIndex: 'COMMAND' },
  { title: '创建时间', dataIndex: 'CREATED' },
  { title: '运行时长', dataIndex: 'STATUS' }
])

const data: any = ref([])
const tap = async () => {}
const loadData = async () => {
  const query = router.currentRoute.value.query
  const get = await window.api.invoke('/docker', {
    type: 'getExec',
    data: {
      config: query,
      cmdCode: 'docker images'
    }
  })
  // console.log('get', get)

  // get.data.headers.forEach((item: any) => {
  //
  //   columns.value.push({ key: item, title: toZhName(item) + '\n' + item, dataIndex: item })
  // })
  // get.data.content.forEach((item: any) => {
  //   data.value.push(item)
  // })
  data.value = parseTable(get.data).content.map((item: any) => {
    return {
      ...item,
      CREATED: translateTimeToChinese(item.CREATED),
      STATUS: translateTimeToChinese(item.STATUS)
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
  // 去掉字符串末尾的换行符
  let str = tableString
  if (str[str.length - 1] === '\n') {
    str = str.substring(0, str.length - 1)
  }
  // 使用换行符分割字符串，得到每一行
  const lines = str.split('\n').map((line: any) => line.trim())

  // 第一行是标题行
  const headers = lines[0].split(/\s{2,}/).map((header: any) => header.trim())

  // 从第二行开始是内容行
  const content = lines.slice(1).map((line: any) => {
    const values = line.split(/\s{2,}/).map((value: any) => value.trim())
    const rowObject = {}
    headers.forEach((header: any, index: any) => {
      rowObject[header] = values[index]
    })
    return rowObject
  })

  return { headers, content }
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

  let matchNumber, matchUnit, isUp, isAgo

  // 检查是否是 "Up X units" 格式
  if (
    (matchNumber = timeStr.match(numberPattern)) &&
    (matchUnit = timeStr.match(unitPattern)) &&
    (isUp = timeStr.match(upPattern))
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
    (isAgo = timeStr.match(agoPattern))
  ) {
    return `${parseInt(matchNumber[0], 10)}${timeUnits[matchUnit[0].toLowerCase().replace(/s$/, '')]}前`
  }

  // 如果都不匹配，返回原始字符串或提示错误
  return '无法识别的时间格式'
}

// function translateRelativeTimeToChinese(relativeTimeStr) {
//   const timeUnits = {
//     second: '秒',
//     minute: '分钟',
//     hour: '小时',
//     day: '天',
//     month: '月',
//     year: '年',
//     week: '周'
//   }
//
//   const numberPattern = /(\d+)/
//   const unitPattern = /(second|minute|hour|day|month|year|week)s?/i
//   const agoPattern = /ago/i
//   const inPattern = /in/i
//
//   const numberMatch = relativeTimeStr.match(numberPattern)
//   const unitMatch = relativeTimeStr.match(unitPattern)
//   const agoInMatch = relativeTimeStr.match(agoPattern) || relativeTimeStr.match(inPattern)
//
//   if (!numberMatch || !unitMatch || !agoInMatch) {
//     return '无法识别的相对时间格式'
//   }
//
//   const number = parseInt(numberMatch[0], 10)
//   const unit = timeUnits[unitMatch[0].toLowerCase().replace(/s$/, '')]
//   const isAgo = agoInMatch[0].toLowerCase() === 'ago'
//
//   let prefix = isAgo ? '' : '在'
//   let suffix = isAgo ? '前' : '后'
//
//   return `${prefix}${number}${unit}${suffix}`
// }

onMounted(() => {
  loadData()
})
</script>
<style lang="scss" scoped>
.deployTab1 {
  //background-color: #3178c6;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
