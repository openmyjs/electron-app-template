export default {
  // 安装docker
  linux:{
    centos:{
      docker:{
        install:'sudo yum install -y yum-utils device-mapper-persistent-data lvm2',
        'yum-config-manager':'yum-config-manager --add-repo '
      }
    }
  }
}