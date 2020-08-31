<template>
  <div class="container">
    <div>
      <div class="photo-wrap flex-multi-row">
        <div v-for="(item, i) in index" class="photo-item border shadow" :key="i" @tap="tapImg('index', item)">
          <image class="photo" :src="item" mode="aspectFill"></image>
        </div>
      </div>
      <div class="btn border shadow upload" @tap="upload('index')">上传首页照片</div>
    </div>
    <div>
      <div class="photo-wrap flex-multi-row">
        <div v-for="(item, i) in photo" class="photo-item border shadow" :key="i" @tap="tapImg('photo', item)">
          <image class="photo" :src="item" mode="aspectFill"></image>
        </div>
      </div>
      <div class="btn border shadow upload" @tap="upload('photo')">上传列表照片</div>
      <div class="tips">每次上传图片张数越少越好 以免上传失败</div>
      <div class="tips">点击单张图片可以进行移动或删除</div>
      <div class="tips">首页仅显示前6张图片</div>
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
    tapImg (key, item) {
      const that = this
      const action = ['前移', '后移', '删除']
      wx.showActionSheet({
        itemList: action,
        success (res) {
          const a = action[res.tapIndex]
          console.log(res.tapIndex, a)
          if (a === '删除') {
            that.del(key, item)
          } else if (a === '前移') {
            that.move(key, item, 1)
          } else if (a === '后移') {
            that.move(key, item, 2)
          }
        },
        fail (res) {
          console.log(res.errMsg)
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
