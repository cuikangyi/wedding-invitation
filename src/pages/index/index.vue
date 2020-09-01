<template>
    <div class="index">
        <div class="bg-wrap">
          <div class="bg-info">
            <div class="content">
              <h6>{{ info.title }}</h6>
              <p>{{ info.date1 }}</p>
              <p>{{ info.hotel }}</p>
              <p>{{ info.address }}</p>
              <!-- <image src="../../static/images/we.png" class="img_footer"/> -->
            </div>
          </div>
        </div>
        <div class="bg-swiper">
            <index-swiper :list="list" :info="info"></index-swiper>
        </div>
        <div class="bg_music" v-if="isPlay" @tap="audioPlay">
            <image src="../../static/images/music_icon.png" class="musicImg music_icon"/>
            <image src="../../static/images/music_play.png" class="music_play pauseImg"/>
        </div>
        <div class="bg_music" v-else @tap="audioPlay">
            <image src="../../static/images/music_icon.png" class="musicImg"/>
            <image src="../../static/images/music_play.png" class="music_play playImg"/>
        </div>
    </div>
</template>

<script>
import IndexSwiper from 'components/indexSwiper'
import tools from 'common/js/h_tools'
export default {
  name: 'Index',
  components: {
    IndexSwiper
  },
  data () {
    return {
      isPlay: false,
      list: [],
      info: {},
      audioCtx: ''
    }
  },
  onLoad () {
    this.globalData.innerAudioContext.onEnded(this.onEnded)
    this.globalData.innerAudioContext.onPlay(this.onPlay)
    this.globalData.innerAudioContext.onPause(this.onPause)
    this.globalData.innerAudioContext.onError(function (error) {
      console.log('播放错误', error)
    })
    this.getList()
    const db = wx.cloud.database()
    const common = db.collection('common')
    common.get().then(res => {
      this.info = res.data[0]
    })
  },
  onShow () {
    this.audioCtx = this.globalData.innerAudioContext
    this.isPlay = !this.audioCtx.paused
  },
  methods: {
    onPlay () {
      this.isPlay = true
    },
    onPause () {
      this.isPlay = false
    },
    onEnded () {
      if (this.globalData.index >= this.globalData.musics.length) {
        this.globalData.index = 0
      }
      this.globalData.innerAudioContext.src = encodeURI(this.globalData.musics[this.globalData.index].url)
      this.globalData.index += 1
    },
    audioPlay () {
      if (this.audioCtx.paused) {
        this.audioCtx.play()
        tools.showToast('背景音乐已开启~')
      } else {
        this.audioCtx.pause()
        tools.showToast('您已暂停音乐播放~')
      }
    },
    getList () {
      const that = this
      const db = wx.cloud.database()
      const banner = db.collection('photo')
      banner.get().then(res => {
        let list = []
        let animations = [
          'fadeInLeft',
          'slideInDown',
          'rotateInDownRight',
          'rollIn',
          'jackInTheBox',
          'flip'
        ]
        for (let i = 0; i < res.data[0].index.length; i++) {
          if (i < animations.length) {
            let show = i === 0
            list.push({
              url: res.data[0].index[i],
              show: show,
              class: animations[i]
            })
          }
        }
        that.list = list
      })
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: `邀请您于${this.info.date1}参加${this.info.title}。`,
      path: '/pages/index/main'
    }
  }
}
</script>

<style scoped lang="stylus">
@-webkit-keyframes musicRotate
  from
    -webkit-transformb rotate(0deg)
  to
    -webkit-transform rotate(360deg)
@-webkit-keyframes musicStop
  from
    -webkit-transform rotate(20deg)
  to
    -webkit-transform rotate(0deg)
@-webkit-keyframes musicStart
  from
    -webkit-transform rotate(0deg)
  to
    -webkit-transform rotate(20deg)
@-webkit-keyframes infoAnimation
  0%
    -webkit-transform scale(1) translate(0, 0)
  50%
    -webkit-transform scale(.9) translate(5px, 5px)
  100%
    -webkit-transform scale(1) translate(0, 0)
.index
  height 100%
  position relative
  .img
    width 100%
    height 100%
  .bg-swiper
    width 100%
    height 100%
  .inv
    position absolute
    top 20rpx
    left 89rpx
    width 572rpx
    height 69rpx
    z-index 9
  .bg_music
    position fixed
    right 10rpx
    top 100rpx
    width 100rpx
    z-index 99
    display flex
    justify-content flex-start
    align-items flex-start
    .musicImg
      width 60rpx
      height 60rpx
    .music_icon
      animation musicRotate 3s linear infinite
    .music_play
      width 28rpx
      height 60rpx
      margin-left -10rpx
      transform-origin top
      -webkit-transform rotate(20deg)
    .playImg
      animation musicStop 1s linear forwards
    .pauseImg
      animation musicStart 1s linear forwards
  #myAudio
    display none
  .bg-info
    width 630rpx
    position absolute
    bottom 50rpx
    left 50rpx
    padding 10rpx
    .content
      width 626rpx
      display flex
      flex-direction column
      justify-content flex-start
      align-items center
      position relative
      color #fff
      h6
        height 80rpx
        line-height 80rpx
      p
        font-size 26rpx
        height 50rpx
        line-height 50rpx
</style>
