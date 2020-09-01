<template>
  <div class="container">
    <div class="row">
      <div class="music-list" v-for="(item, index) in musics" :key="index" @tap="tapMusic(item)">{{ item.name }}</div>
      <div class="btn" @tap="chooseMusic">选择音乐</div>
      <div class="tips">点击删除相应的行</div>
    </div>
    <div class="row">
      <text user-select>{{ videoUrl || '已隐藏' }}</text>
      <div class="btn" @tap="chooseVideo">是否显示视频</div>
    </div>
    <div class="row">
      <textarea class="msg-template" v-model="message"></textarea>
      <div class="btn" @tap="saveMessage">保存评论模板</div>
      <div class="tips">按行分割</div>
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
      musics: [],
      videoUrl: '',
      message: ''
    }
  },
  onLoad () {
    const db = wx.cloud.database()
    const media = db.collection('media')
    media.get().then(res => {
      const data = res.data[0]
      this._id = data._id
      this.musics = data.musics
      this.videoUrl = data.videoUrl
      this.message = data.message
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
      })
    },
    chooseMusic () {
      const that = this
      wx.chooseMessageFile({
        count: 1,
        success: ({ tempFiles }) => {
          upload.uploadMusic(tempFiles[0].name, tempFiles[0].path).then(res => {
            that.musics.push(res)
            that.saveData({
              musics: that.musics
            })
          })
        }
      })
    },
    delMusic (item) {
      const that = this
      wx.showModal({
        title: '提示',
        content: '删除确认',
        success (res) {
          if (res.confirm) {
            that.musics.splice(that.musics.indexOf(item), 1)
            that.saveData({
              musics: that.musics
            })
            if (!that.musics.find(v => v.id === item.id)) {
              wx.cloud.deleteFile({
                fileList: [item.id]
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    move (key, item, type) {
      const currnetIndex = this.$data[key].indexOf(item)
      const currentLength = this.$data[key].length
      if ((currnetIndex === 0 && type === 1) || (currnetIndex === currentLength - 1 && type === 2)) {
        console.log('无操作')
        return 0
      }
      if (type === 1) {
        this.$data[key].splice(currnetIndex, 1)
        this.$data[key].splice(currnetIndex - 1, 0, item)
      } else if (type === 2) {
        this.$data[key].splice(currnetIndex, 1)
        this.$data[key].splice(currnetIndex + 1, 0, item)
      }
      this.saveData({
        [key]: this.$data[key]
      })
    },
    tapMusic (item) {
      const that = this
      const action = ['前移', '后移', '删除']
      wx.showActionSheet({
        itemList: action,
        success (res) {
          const a = action[res.tapIndex]
          console.log(res.tapIndex, a)
          if (a === '删除') {
            that.delMusic(item)
          } else if (a === '前移') {
            that.move('musics', item, 1)
          } else if (a === '后移') {
            that.move('musics', item, 2)
          }
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    },

    chooseVideo () {
      this.videoUrl = this.videoUrl ? '' : 'cloud://midou-1i5z7.6d69-midou-1i5z7-1302919217/common/video.m4v'
      this.saveData({
        videoUrl: this.videoUrl
      })
    },

    saveMessage () {
      this.saveData({
        message: this.message
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
  margin: 20rpx;
  border: 1px solid;
}
.btn{
  width: 500rpx;
  line-height: 80rpx;
  border-radius: 80rpx;
  text-align: center;
  margin: 20rpx auto;
  background: #eee;
}
.tips{
  text-align: center;
  font-size: 20rpx;
}
.music-list{
  background: #ddd;
  margin-bottom: 10rpx;
}
.bg-img{
  display: flex;
  justify-content: center;
}
.msg-template{
  background: #eee;
  width: 100%;
}
</style>
