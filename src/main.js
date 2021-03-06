import './animate.wxss'
// import './index.css'
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: '你的云开发环境ID'
})

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData
let innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
wx.setInnerAudioOption({
  autoplay: true,
  obeyMuteSwitch: false
})
app.globalData.innerAudioContext = innerAudioContext
app.globalData.musics = []
app.globalData.index = 1
app.globalData.animations = [
  `bounce`,
  `flash`,
  `pulse`,
  `rubberBand`,
  `shake`,
  `headShake`,
  `swing`,
  `tada`,
  `wobble`,
  `jello`,
  `bounceIn`,
  `bounceInDown`,
  `bounceInLeft`,
  `bounceInRight`,
  `bounceInUp`,
  `fadeIn`,
  `fadeInDown`,
  `fadeInDownBig`,
  `fadeInLeft`,
  `fadeInLeftBig`,
  `fadeInRight`,
  `fadeInRightBig`,
  `fadeInUp`,
  `fadeInUpBig`,
  `flipInX`,
  `flipInY`,
  `lightSpeedIn`,
  `rotateIn`,
  `rotateInDownLeft`,
  `rotateInDownRight`,
  `rotateInUpLeft`,
  `rotateInUpRight`,
  `jackInTheBox`,
  `rollIn`,
  `zoomIn`,
  `zoomInDown`,
  `zoomInLeft`,
  `zoomInRight`,
  `zoomInUp`,
  `slideInDown`,
  `slideInLeft`,
  `slideInRight`,
  `slideInUp`,
  `heartBeat`
]
const db = wx.cloud.database()
const media = db.collection('media')
media.get().then(res => {
  app.globalData.musics = res.data[0].musics
  innerAudioContext.src = encodeURI(app.globalData.musics[0].url)
})
