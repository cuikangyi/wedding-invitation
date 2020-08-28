<template>
  <div class="container">
    <div>
      <div class="photo-wrap flex-multi-row">
        <div v-for="(item, i) in index" class="photo-item border shadow" :key="i" @tap="del('index', item)">
          <image class="photo" :src="item" mode="aspectFill"></image>
        </div>
      </div>
      <div class="btn border shadow upload" @tap="upload('index')">上传首页照片</div>
    </div>
    <div>
      <div class="photo-wrap flex-multi-row">
        <div v-for="(item, i) in photo" class="photo-item border shadow" :key="i" @tap="del('photo', item)">
          <image class="photo" :src="item" mode="aspectFill"></image>
        </div>
      </div>
      <div class="btn border shadow upload" @tap="upload('photo')">上传列表照片</div>
      <div class="tips">每次上传图片张数越少越好 以免上传失败</div>
      <div class="tips mar-b40">点击单张图片可以进行删除</div>
    </div>
  </div>
</template>

<script>
import upload from '../../utils/upload'

export default {
  name: 'SettingPhoto',
  data () {
    return {
      _id: '',
      index: [],
      photo: []
    }
  },
  onLoad () {
    const db = wx.cloud.database()
    const photo = db.collection('photo')
    photo.get().then(res => {
      const data = res.data[0]
      this._id = data._id
      this.index = data.index
      this.photo = data.photo
    })
  },
  methods: {
    saveData (data) {
      wx.showLoading({
        title: `数据保存中...`,
        mask: true
      })
      const db = wx.cloud.database()
      db.collection('photo').doc(this._id).update({
        data
      }).then(res => {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      })
    },
    upload (key) {
      const that = this
      console.log(that.$data[key])
      wx.chooseImage({
        count: 9,
        success (res) {
          upload.uploadImg(res.tempFilePaths).then(res => {
            that.$data[key].push(...res)
            that.saveData({
              [key]: that.$data[key]
            })
          })
        }
      })
    },
    del (key, item) {
      const that = this
      wx.showModal({
        title: '提示',
        content: '删除确认',
        success (res) {
          if (res.confirm) {
            that.$data[key].splice(that.$data[key].indexOf(item), 1)
            that.saveData({
              [key]: that.$data[key]
            })
            if (item.indexOf('cloud://') >= 0) {
              wx.cloud.deleteFile({
                fileList: [item]
              })
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.flex-multi-row{
  display: flex;
  flex-wrap: wrap;
}
.container{
  min-width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
}
.upload{
  width: 500rpx;
  line-height: 80rpx;
  border-radius: 80rpx;
  text-align: center;
  margin: 50rpx auto;
  background: #eee;
}
.photo-item{
  width: 100rpx;
  height: 100rpx;
  margin: 20rpx;
  position: relative;
}
.photo{
  width: 100%;
  height: 100%;
  display: block;
}
.photo-wrap{
  padding-top: 40rpx;
}
.tips{
  text-align: center;
  font-size: 20rpx;
}
</style>
