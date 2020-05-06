const app = getApp()
Page({
  data: {
    currentList: {}
  },
  onLoad(options) {
    let data = app.globalData.currentList
    data.nursing_workers_idcard = data.nursing_workers_idcard.replace(/^(.{4})(?:\w+)(.{2})$/, "$1************$2");
    this.setData({
      currentList: data
    })
  },
  bindmessage() {
    wx.navigateTo({
      url: '../../../register/user/view/view?status=' + this.data.currentList.nursing_workers_status +'&states=1'  // 0、正在审核，1、审核完成
    })
  }
})