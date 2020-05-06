const common = require('../../../../../utils/common.js')
Page({
  data: {
    height: 0,
    bottom: 0
  },
  onLoad: function (options) {
    this.setData({
      height: common.windowHeight() - 100
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  // foucus
  foucus(e) {
    if (e.detail.height == 0) return
    this.setData({
      bottom: e.detail.height * 2 - 24
    })
  },
  // blur
  blur() {
    this.setData({
      bottom: 0
    })
  }
})