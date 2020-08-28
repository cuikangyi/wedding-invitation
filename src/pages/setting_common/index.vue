<template>
  <div class="container">
    <div class="row">
      <div class="label">宝宝姓名：</div>
      <input type="text" class="input" v-model="bady"/>
    </div>
    <div class="row">
      <div class="label">姓名1：</div>
      <input type="text" class="input" v-model="name1"/>
    </div>
    <div class="row">
      <div class="label">姓名2：</div>
      <input type="text" class="input" v-model="name2"/>
    </div>
    <div class="row">
      <div class="label">电话1：</div>
      <input type="text" class="input" v-model="phone1"/>
    </div>
    <div class="row">
      <div class="label">电话2：</div>
      <input type="text" class="input" v-model="phone2"/>
    </div>
    <div class="row">
      <div class="label">喜宴标题：</div>
      <input type="text" class="input" v-model="title"/>
    </div>
    <div class="row">
      <div class="label">喜宴日期1：</div>
      <input type="text" class="input" v-model="date1"/>
    </div>
    <div class="row">
      <div class="label">喜宴日期2：</div>
      <input type="text" class="input" v-model="date2"/>
    </div>
    <div class="row">
      <div class="label">酒店名称：</div>
      <input type="text" class="input" v-model="hotel"/>
    </div>
    <div class="row">
      <div class="label">酒店地址：</div>
      <input type="text" class="input" v-model="address"/>
    </div>
    <div class="row">
      <div class="label">纬度：</div>
      <input type="text" class="input" v-model="latitude"/>
    </div>
    <div class="row">
      <div class="label">经度：</div>
      <input type="text" class="input" v-model="longitude"/>
    </div>
    <div class="row">
      <button class="submit" @tap="submit">修改信息</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingCommon',
  data () {
    return {
      _id: '',
      title: '',
      bady: '',
      name1: '',
      name2: '',
      phone1: '',
      phone2: '',
      date1: '',
      date2: '',
      hotel: '',
      address: '',
      latitude: '',
      longitude: ''
    }
  },
  onLoad () {
    const db = wx.cloud.database()
    const common = db.collection('common')
    common.get().then(res => {
      const info = res.data[0]
      this._id = info._id
      this.title = info.title
      this.bady = info.bady
      this.name1 = info.name1
      this.name2 = info.name2
      this.phone1 = info.phone1
      this.phone2 = info.phone2
      this.date1 = info.date1
      this.date2 = info.date2
      this.hotel = info.hotel
      this.address = info.address
      this.latitude = info.latitude
      this.longitude = info.longitude
    })
  },
  methods: {
    submit () {
      const db = wx.cloud.database()
      db.collection('common').doc(this._id).update({
        data: {
          title: this.title,
          bady: this.bady,
          name1: this.name1,
          name2: this.name2,
          phone1: this.phone1,
          phone2: this.phone2,
          date1: this.date1,
          date2: this.date2,
          hotel: this.hotel,
          address: this.address
        }
      }).then((res) => {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
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
.label{
  width: 200rpx;
  text-align: right;
  display: inline-block;
  vertical-align: middle;
}
.input{
  box-sizing: border-box;
  padding: 10rpx 20rpx;
  border: 1px solid #333;
  vertical-align: middle;
  border-radius: 60rpx;
  font-size: 28rpx;
  height: auto;
  width: 400rpx;
  display: inline-block;
}
.submit{
  width: 500rpx;
  line-height: 80rpx;
  border-radius: 80rpx;
  text-align: center;
  margin: 20rpx auto;
}
button::after{
  border: none;
}
</style>
