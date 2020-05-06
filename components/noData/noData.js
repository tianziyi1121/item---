const app = getApp()
Component({
  properties: {
    dataType: {
      type: Number
    }
  },
  data: {
    flag: false,
    type: 1
  },
  attached() {
  },
  methods: {
    noData() {
      this.properties.dataType != 2 && app.globalData.uid == '' ? this.data.type = 2 : this.data.type = 1
      this.setData({
        flag: true,
        type: this.data.type
      })
    },
    noDataTrue() {
      this.properties.dataType != 2 && app.globalData.uid == '' ? this.data.type = 2 : this.data.type = 1
      this.setData({
        flag: false,
        type: this.data.type
      })
    },
    bindLogin() {
      wx.setStorageSync('authorization', 1)
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  }
})