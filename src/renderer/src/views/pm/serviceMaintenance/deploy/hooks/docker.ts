import { ref, type Ref, onMounted, onUnmounted } from 'vue'

export default function () {
  const dockerLog: Ref<string> = ref('')
  /** docker输出的信息*/
  // const dockerLog: ComputedRef<any[]> = computed(() => {
  //   return log.value.substring(0, log.value.length - 2).split('\n')
  // })
  /** 查询docker/安装state*/
  const dockerState = () => {
    window.api.send('/ssh/docker', {
      type: 'state',
      data: {}
    })
  }
  const dockerUninstall = () => {
    window.api.send('/ssh/docker', {
      type: 'uninstall',
      data: {}
    })
  }

  onMounted(() => {
    window.api.on('/ssh/docker', async (args: any) => {
      // console.log('/ssh/docker', args.log)
      if (args.log.length !== 0) {
        dockerLog.value += args.log
      }
    })
  })
  onUnmounted(() => {
    window.api.off('/ssh/docker')
  })
  return {
    dockerLog,
    dockerState,
    dockerUninstall
  }
}
