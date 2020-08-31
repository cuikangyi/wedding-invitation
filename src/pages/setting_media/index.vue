<template>
  <div class="container">
    <div class="row">
      <div class="btn" @tap="chooseBackground">选择背景图</div>
      <div class="bg-img">
        <image :src="background" mode="heightFix"></image>
      </div>
    </div>
    <div class="row">
      <div class="btn" @tap="chooseMusic">选择音乐</div>
      <text user-select>{{ musicUrl }}</text>
    </div>
    <div class="row">
      <div class="btn" @tap="chooseVideo">是否显示视频</div>
      <text user-select>{{ videoUrl }}</text>
    </div>
  </div>
</template>

<script>
import upload from '../../utils/upload'

export default {
  name: 'SettingMedia',
  data () {
    return {
      _id: '',
      background: '',
      musicUrl: '',
      videoUrl: ''
    }
  },
  onLoad () {
    const db = wx.cloud.database()
    const media = db.collection('media')
    media.get().then(res => {
      const data = res.data[0]
      this._id = data._id
      this.background = data.background
      this.musicUrl = data.musicUrl
      this.videoUrl = data.videoUrl
    })
  },
  methods: {
    saveData (data) {
      wx.showLoading({
        title: `数据保存中...`,
        mask: true
      })
      const db = wx.cloud.database()
      db.collection('media').doc(this._id).update({
        data
      }).then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
        console.log(data, res)
        Object.keys(data).map(k => {
          this[k] = data[k]
        })
      })
    },
    chooseBackground () {
      const that = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success (res) {
          const tempFilePath = res.tempFilePaths[0]
          upload.uploadBackground(tempFilePath).then(res => {
            that.saveData({
              background: res
            })
          })
        }
      })
    },
    chooseMusic () {
      wx.chooseMessageFile({
        count: 1,
        success: ({ tempFiles }) => {
          upload.uploadMusic(tempFiles[0].name, tempFiles[0].path).then(res => {
            this.saveData({
              musicUrl: res
            })
          })
        }
      })
    },

    chooseVideo () {
      const videoUrl = this.videoUrl ? '' : 'cloud://midou-1i5z7.6d69-midou-1i5z7-1302919217/common/video.m4v'
      this.saveData({
        videoUrl
      })
    }
  }
}
</script>

<style scoped>
.container{
  min-width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
}
.row{
  padding: 10rpx;
}
.btn{
  width: 500rpx;
  line-height: 80rpx;
  border-radius: 80rpx;
  text-align: center;
  margin: 20rpx auto;
  background: #eee;
}
.bg-img{
  display: flex;
  justify-content: center;
}
</style>
