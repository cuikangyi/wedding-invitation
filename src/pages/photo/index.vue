<template>
    <div class="photo">
      <div class="bg-wrap"></div>
      <h-swiper :list="list" :isGif="isGif"></h-swiper>
    </div>
</template>

<script>
import HSwiper from 'components/swiper'
// import imgData from 'common/json/imgData.json'
export default {
  name: 'Photo',
  components: {
    HSwiper
  },
  onLoad () {
    this.getList()
  },
  onShow () {
    // const that = this
    // that.isGif = !that.isGif
    // that.getList()
  },
  data () {
    return {
      list: [],
      isGif: false
    }
  },
  methods: {
    getList () {
      const that = this
      const db = wx.cloud.database()
      const banner = db.collection('photo')
      banner.get().then(res => {
        let list = []
        for (let i = 0; i < res.data[0].photo.length; i++) {
          let show = i === 0
          list.push({
            url: res.data[0].photo[i],
            show: show
          })
        }
        that.list = list
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.photo
    height 100%
</style>
