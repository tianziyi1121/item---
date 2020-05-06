var app = getApp();
Page({
  data: {
    title: '',
    money: '0.00',
    timer: '2019-5-9 16:47:10'
  },
  onLoad: function (options) {
    var title = ''
    if(options.id == 1) {
      title = "充值"
    } else {
      title = "提现"
    }
    this.setData({
      title: title,
      money: options.money
    })
    wx.setNavigationBarTitle({
      title: this.data.title + "详情"
    })
  },
  // 完成
  complete: function() {
    wx.navigateBack({
      delta: 2
    })
  }
})