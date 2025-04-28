<template>
  <div class="lucky-wheel-container">
    <LuckyWheel
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
    />
    <choose-staff-modal :ref="(el) => (refs.chooseStaff = el)" @change="chooseStaffChange" />
  </div>
</template>

<script setup lang="tsx">
import chooseStaffModal from './components/chooseStaff-modal.vue';
import { LuckyWheel } from '@lucky-canvas/vue';
import {message ,Modal} from 'ant-design-vue'
const myLucky:any = ref(null);
const refs:any = ref({
  chooseStaff: null
});
// 转盘配置
const prizes  = ref<any[]>([
  // { fonts: [{ text: '奖品1', top: '10%' }], background: '#e9e8fe' },
  // { fonts: [{ text: '奖品2', top: '10%' }], background: '#b8c5f2' },
  // { fonts: [{ text: '奖品3', top: '10%' }], background: '#e9e8fe' },
  // { fonts: [{ text: '奖品4', top: '10%' }], background: '#b8c5f2' },
  // { fonts: [{ text: '奖品5', top: '10%' }], background: '#e9e8fe' },
  // { fonts: [{ text: '奖品6', top: '10%' }], background: '#b8c5f2' },
]);

const blocks = ref([{ padding: '13px', background: '#617df2' }]);
const buttons = ref([
  {
    radius: '35%',
    background: '#8a9bf3',
    pointer: true,
    fonts: [{ text: '开始', top: '-10px' }],
  },
]);

const clientList = ref<any[]>([])
const orderList = ref<any[]>([])
const loadDataOrder = async () => {
  prizes.value = [];
  const order = await electron.readFile('dbFile/order');
  orderList.value = JSON.parse(order);
  const client = await electron.readFile('dbFile/client');
  clientList.value = JSON.parse(client);
  orderList.value.forEach((item: any) => {
    const filter =  clientList.value.filter((item2: any) => {
      return item.phone === item2.phone
    });
    item.clientName = filter[0].clientName;
    item.clientPhone = filter[0].phone;
    item.clientAddress = filter[0].address;
  });
  const orderDataList = orderList.value.filter((item: any) => item.orderStatus === 0);
  for (let i = 0; i < orderDataList.length; i++) {
    //判断i 奇数或是偶数
    if (i % 2 === 0) {
      // 偶数
      prizes.value.push({
        fonts: [{ text: orderDataList[i].clientName, top: '10%' },],
        background: '#e9e8fe',
        key:orderDataList[i]
      });
    } else {
      prizes.value.push({
        fonts: [{ text: orderDataList[i].clientName, top: '10%' },],
        background: '#b8c5f2',
        key:orderDataList[i]
      });
    }
  }
};

// 回调函数
const startCallback = () => {
  if (!prizes.value.length){
    message.error('没有订单了')
    return
  }
  refs.value.chooseStaff.open();
};
const  start = ()=>{
  myLucky.value.play();
  setTimeout(() => {
    const index = Math.floor(Math.random() * prizes.value.length); // 随机生成中奖索引

    myLucky.value.stop(index);
  }, 3000);
}
const endCallback = async (prize) => {
  console.log('中奖信息：', prize);
  Modal.success({
    title: `你好啊! ${signTrucksInfo.value.trucksName} / ${signTrucksInfo.value.trucksCode} / ${signTrucksInfo.value.phone}`,
    content: (
      <>
        <p>你的配送信息</p>
      <p>客户名字：{prize.key.clientName} </p>
      <p>客户手机：{prize.key.clientPhone}</p>
      <p>配送地址：{prize.key.clientAddress}</p>
      <p>备注信息：{prize.key.remark}</p>
      </>
    ),
  });
  const filter = orderList.value.filter((item:any)=>item.id===prize.key.id)
  console.log('filter',filter)
  filter[0].trucksCode = signTrucksInfo.value.trucksCode
  filter[0].orderStatus = 1
  await electron.createFile({
    savePath: 'dbFile',
    fileName: 'order',
    content: JSON.stringify(orderList.value),
  })

  const trucks = await electron.readFile('dbFile/trucks');
  const trucksList = JSON.parse(trucks);
  const filter2 = trucksList.filter((item:any)=>item.trucksCode===signTrucksInfo.value.trucksCode)
  filter2[0].status = 1
  await electron.createFile({
    savePath: 'dbFile',
    fileName: 'trucks',
    content: JSON.stringify(trucksList),
  })
  await loadDataOrder()
};
const signTrucksInfo:any = ref({})
const chooseStaffChange = (e:any)=>{
  console.log('chooseStaffChange',e)
  signTrucksInfo.value = e
  start()
}
onMounted( () => {
  electron.setSize({
    width: 1000,
    height: 800,
  })
  loadDataOrder()
})
</script>

<style scoped>
.lucky-wheel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>