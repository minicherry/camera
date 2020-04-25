<template>
  <div id="app">
    <a-button type="primary"
              @click="openCamera">打开摄像头</a-button>
    <canvas ref="canvas"
            width="640"
            height="480"></canvas>
    <video ref="video"
           width="640"
           height="480"
           autoplay></video>
    <a-button type="primary"
              @click="photograph">拍照</a-button>
    <a-button type="primary"
              @click="closeCamera">关闭摄像头</a-button>

  </div>
</template>
<script>
// api

export default {
  name: 'Camera',
  components: {},
  data () {
    return {}
  },
  created () {
  },
  methods: {
    // 打开系统摄像头
    openCamera () {
      navigator.mediaDevices.getUserMedia({ video: true }).then(success => {
        // 摄像头开启成功
        this.$refs['video'].srcObject = success
        // 实时拍照效果
        this.$refs['video'].play()
      }).catch(error => {
        console.error('摄像头开启失败，请检查摄像头是否可用！', error)
      })

    },
    // 拍照
    photograph () {
      let ctx = this.$refs['canvas'].getContext('2d')
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(this.$refs['video'], 0, 0, 640,
        480)
      // 转base64格式、图片格式转换、图片质量压缩
      let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)

      // 由字节转换为KB判断大小
      let str = imgBase64.replace('data:image/jpeg;base64,', '')
      let strLength = str.length
      let fileLength = parseInt(strLength - (strLength / 8) *
        2)
      // 图片尺寸 用于判断
      let size = (fileLength / 1024).toFixed(2)
      console.log(size)
      // 上传拍照信息 调用接口上传图片 .........
      let file = this.imgSrc; // 把整个base64给file
      // let type = "image/jpeg";
      // 定义图片类型（canvas转的图片一般都是png，也可以指定其他类型）
      let time = (new Date()).valueOf();//生成时间戳
      let name = time + ".jpg";
      // 定义文件名字（例如：abc.png ， cover.png）
      let conversions = this.dataURLtoFile(file, name); // 调用base64转图片方法
      let parms = new FormData();
      parms.append('file', conversions);

      // 保存到本地
      let ADOM = document.createElement('a')
      ADOM.href = imgBase64
      ADOM.download = new Date().getTime() + '.jpeg'
      ADOM.click()
    },

    // 上传图片
    upLoadImage () { },
    // 关闭摄像头
    closeCamera () {
      if (!this.$refs['video'].srcObject) return
      let stream = this.$refs['video'].srcObject
      let tracks = stream.getTracks()
      tracks.forEach(track => { track.stop() })
      this.$refs['video'].srcObject = null
    },

  }
}
</script>

<style></style>
