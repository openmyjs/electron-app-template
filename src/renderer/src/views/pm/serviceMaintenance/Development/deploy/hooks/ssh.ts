import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
export default function () {
  const router = useRouter()

  /** server 连接状态 /服务器连接状态*/
  const serverState: Ref<boolean> = ref(false)

  /** server登录日志*/
  const serverLog: Ref<string> = ref('')

  /** exec命令执行状态*/
  const execState: Ref<boolean> = ref(false)

  /** exec命令执行成功状态*/
  const execSuccess: Ref<boolean> = ref(false)

  /** execLog输出的日子*/
  const execLog: Ref<string> = ref('')

  /** 清除日志*/
  const removeExecLog = () => {
    execLog.value = ''
  }
  /** 启动服务器*/
  const serverStart = () => {
    const query = router.currentRoute.value.query
    window.api.send('/ssh', {
      type: 'create',
      data: query
    })
  }

  /** 关闭服务器*/
  const serverClose = () => {
    window.api.send('/ssh', {
      type: 'close'
    })
  }
  /** 终止在执行exec服务*/
  const execEnd = () => {
    window.api.send('/ssh', {
      type: 'end'
    })
  }

  /** exec 执行命令*/
  const exec = (param: { type: string; data: any }) => {
    execState.value = false
    if (param.type === 'exec') {
      window.api.send('/ssh', {
        type: 'exec',
        data: param.data
      })
    }
  }

  /** 监听/ssh 发来的消息*/
  const onSsh = () => {
    window.api.on('/ssh', async (args: any) => {
      // console.log('/ssh', args)
      const { log, goState, type, success } = args

      switch (type) {
        case 'startServer':
        case 'errorServer':
        case 'closeServer':
          if (log.length !== 0) {
            serverLog.value += log
          }
          serverState.value = goState
          break

        case 'exec':
          if (log.length !== 0) {
            execLog.value += log
          }
          execState.value = goState
          execSuccess.value = success
          break
      }
    })
  }

  onMounted(() => {
    onSsh()
    serverStart()
  })

  onUnmounted(() => {
    window.api.off('/ssh')
    window.api.send('/ssh', {
      type: 'close'
    })
  })

  return {
    serverLog,
    serverStart,
    serverClose,
    serverState,
    execLog,
    exec,
    execState,
    execSuccess,
    execEnd,
    removeExecLog
  }
}
