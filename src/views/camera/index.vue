<template>
  <div id="app">
    <a-button type="primary"
              @click="getCompetence">打开摄像头</a-button>
    <video id="videoCamera"
           :width="videoWidth"
           :height="videoHeight"
           autoplay></video>
    <canvas style="display:none;"
            id="canvasCamera"
            :width="videoWidth"
            :height="videoHeight"></canvas>
    <canvas ref="videoCameraData"
            id='canvas'
            width="640"
            height="480"></canvas>
    <video ref="video"
           id='video'
           width="640"
           height="480"
           autoplay></video>
    <a-button type="primary"
              @click="photograph">拍照</a-button>
    <a-button type="primary"
              @click="startVideo">开始录像</a-button>
    <a-button type="primary"
              @click="stopVideo">结束录像</a-button>

    <a-button type="primary"
              @click="closeCamera">关闭摄像头</a-button>

  </div>
</template>
<script>
// api
import { upLoadImg } from '../../api/user/user'

export default {
  name: 'Camera',
  components: {},
  data() {
    return {
      videoWidth: 3000,
      videoHeight: 300,
      imgSrc: '',
      thisCancas: null,
      thisContext: null,
      thisVideo: null
    }
  },
  created() {},
  methods: {
    // 打开系统摄像头
    getCompetence() {
      var _this = this
      this.thisCancas = document.getElementById('canvasCamera')
      this.thisContext = this.thisCancas.getContext('2d')
      this.thisVideo = document.getElementById('videoCamera')
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            )
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: 'scaleX(-1)'
        }
      }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function(e) {
            console.log(e)
            _this.thisVideo.play()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    startRecording(stream) {
      // console.log(stream,"stream");
      // this.logger();
      this.mediaRecorderData = new MediaRecorder(stream)

      this.mediaRecorderData.start()

      this.mediaRecorderData.addEventListener('dataavailable', e => {
        console.log(e)
        if (e.data.size > 0) {
          this.videoCecorded.push(e.data) //视频录制视频流数据
        }
      })

      this.mediaRecorderData.addEventListener('stop', () => {
        // console.log("暂停 自动下载");
        if (this.videoStatus != 1) {
          this.updataVideo() //上传实时录制的视频
        }
      })

      this.mediaRecorderData.addEventListener('start', e => {
        console.log(e)
        // console.log("开始 录制");
      })
    },
    openCamera() {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        })
        .catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！', error)
        })
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },

    // 拍照
    photograph() {
      let ctx = this.$refs['canvas'].getContext('2d')
      // 把当前视频帧内容渲染到canvas上
      ctx.drawImage(this.$refs['video'], 0, 0, 640, 480)
      // 转base64格式、图片格式转换、图片质量压缩
      let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)

      // 由字节转换为KB判断大小
      let str = imgBase64.replace('data:image/jpeg;base64,', '')
      let strLength = str.length
      let fileLength = parseInt(strLength - (strLength / 8) * 2)
      // 图片尺寸 用于判断
      let size = (fileLength / 1024).toFixed(2)
      console.log(size)
      // 上传拍照信息 调用接口上传图片 .........
      // let file = this.imgSrc; // 把整个base64给file
      // let type = "image/jpeg";
      // 定义图片类型（canvas转的图片一般都是png，也可以指定其他类型）
      let time = new Date().valueOf() //生成时间戳
      let name = time + '.jpg'
      // 定义文件名字（例如：abc.png ， cover.png）
      let conversions = this.dataURLtoFile(imgBase64, name) // 调用base64转图片方法
      console.log(conversions)

      let parms = new FormData()

      parms.append('file', conversions)
      console.log(parms)
      // 上传图片保存到数据库
      upLoadImg(parms)
      // 保存到本地
      let ADOM = document.createElement('a')
      ADOM.href = imgBase64
      ADOM.download = new Date().getTime() + '.jpeg'
      ADOM.click()
    },

    // 开始录像
    startVideo(stream) {
      var mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()
      setTimeout(function() {
        // 结束
        this.stopRecord(function() {
          alert('录制成功!')
        })
      }, 5000)
    },
    //结束录像

    // 上传图片
    upLoadImage() {},
    // 关闭摄像头
    closeCamera() {
      if (!this.$refs['video'].srcObject) return
      let stream = this.$refs['video'].srcObject
      let tracks = stream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      this.$refs['video'].srcObject = null
    }
  }
}
</script>

<style></style>
