import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
export default function () {
  const router = useRouter()
  const { electron } = window
  const config = router.currentRoute.value.query
  // electron.ipcRenderer.once('ssh', (_event, args) => {
  //   switch (args.type) {
  //     case 'server':
  //       // console.log('server', args.data)
  //       linkStatus.value = args.data.linkStatus
  //       break
  //     case 'exec':
  //       // console.log('exec', args.data)
  //       if (args.data.exec.cmdCode === 'docker') {
  //         dockerStatus.value = args.data.exec.code
  //       }
  //       break
  //     case 'close':
  //       // console.log('close', args.data)
  //       break
  //   }
  //   console.log(args)
  // })

  const exec = async (commend: string) => {
    // console.log('exec', commend)
    return getAsyncMessages({
      type: 'exec',
      data: {
        host: router.currentRoute.value.query.host,
        commend
      }
    })
  }
  const closeServer = async () => {
    await getAsyncMessages({
      type: 'close',
      data: {
        host: router.currentRoute.value.query.host
      }
    })
  }
  const startServer = async () => {
    return getAsyncMessages({
      type: 'server',
      data: {
        config
      }
    })
  }
  const getAsyncMessages = (data) => {
    return new Promise((resolve, _reject) => {
      electron.ipcRenderer.once('ssh', (_event, args) => {
        // console.log('ssh', args)
        resolve(args)
      })
      electron.ipcRenderer.send('ssh', data)
    })
  }

  onMounted(() => {
    // startServer()
  })
  onUnmounted(async () => {
    await closeServer()
  })
  return {
    exec,
    closeServer,
    startServer,
    serverConfig: config
  }
}
