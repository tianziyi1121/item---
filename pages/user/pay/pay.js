const common = require('../../../utils/common.js')
Page({
  data: {
    flag: false
  },
  onLoad(options) {
    if (options.member_list_paypwd == 'null'){
      this.data.flag = true
    }
    this.setData({
      flag: this.data.flag
    })
  },
  bindList(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})