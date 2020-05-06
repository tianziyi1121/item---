// pages/register/user/view/view.js
const app = getApp()
Page({
  data: {
    state: null,
    status: null
  },
  onLoad: function (options) {
    let title = null
    if (options.states == 1){
      title = "审核状态"
    }else{
      title = "护工注册"
    }
    wx.setNavigationBarTitle({
      title: title
    })
    this.setData({
      state: options.states,
      status: options.status
    })
  }, 
  home(e) {
    let url
    if(e.currentTarget.dataset.index == 1){
      if (this.data.state == 1){
        url = '../../../home/home'
      }else{
        wx.navigateTo({
          url: '../../../user/message/message'
        })
        return false
      }
    } else {
      url = '../../../user/user'
    }
    wx.switchTab({
      url: url
    })
  }
})