<template>
  <div class="f-wh100 f-scroll-y f-scroll-set">
    <a-table :columns="columns" :data-source="data" bordered rowKey="key">
      <template #title>
        <a-flex :gap="10">
          <a-button type="primary">新增服务器</a-button>
        </a-flex>
      </template>
      <template #footer>Footer</template>
    </a-table>
  </div>
</template>
<script setup lang="tsx">
// import { h, Fragment } from 'vue'
import { Button } from 'ant-design-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const columns = [
  {
    title: '服务器名字',
    dataIndex: 'serverName',
    width: '20%',
    customRender: ({ value, record }) => {
      return (
        <>
          <Button
            type="link"
            onClick={() => {
              router.push({
                path: '/pm/serviceMaintenance/deploy',
                query: {
                  host: record.host,
                  port: record.port, // SSH端口，默认是22
                  username: record.username,
                  password: record.password
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
  {
    title: '服务商',
    dataIndex: 'facilitator'
  },
  {
    title: '操作系统',
    dataIndex: 'os'
  },
  {
    title: '登录模式',
    dataIndex: 'loginMode'
  },
  {
    title: '账号',
    dataIndex: 'account'
  },
  {
    title: '操作',
    // dataIndex: 'address',
    customRender: () => {
      return (
        <>
          <Button type="primary" style=" marginRight: 10px" size="small" onClick={() => {}}>
            详情
          </Button>
        </>
      )
    }
  }
]

const data = [
  {
    key: '1',
    serverName: 'openmyjs',
    facilitator: '阿里云',
    os: 'Linux centos 7.9 UEFI版',
    host: '47.113.184.182',
    loginMode: '密码',
    port: 22,
    username: 'root',
    password: 'AAxiaoyu001'
  }
]
</script>
<style scoped>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>
