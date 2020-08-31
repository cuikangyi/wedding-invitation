<template>
  <div class="container">
    <div class="setting-btn" @tap="goSettingCommon">信息设置</div>
    <div class="setting-btn" @tap="goSettingPhoto">照片设置</div>
    <div class="setting-btn" @tap="goSettingMedia">媒体设置</div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  methods: {
    goSettingCommon () {
      wx.navigateTo({
        url: '/pages/setting_common/main'
      })
    },

    goSettingPhoto () {
      wx.navigateTo({
        url: '/pages/setting_photo/main'
      })
    },

    goSettingMedia () {
      wx.navigateTo({
        url: '/pages/setting_media/main'
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
.setting-btn{
  height: 100rpx;
  border-radius: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 40rpx;
  margin: 50rpx 60rpx;
  background: #eee;
}
</style>
