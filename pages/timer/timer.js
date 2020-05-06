const app = getApp()
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    starTime: null,
    endTime: null,
    day: null
  },
  onLoad() {
    this.yunxin()
  },
  yunxin: function () {
    var that = this;
    var starTime = ''
    var day = ''
    var endTime = ''
    that.viewTimer = that.selectComponent("#viewTimer")
    that.viewTimer.xianShi({
      data: function (res) {
        wx.setStorageSync('timer', res)
        if (res != null) {
          if (res.length == 1) {
            starTime = res[0].data
          }else if (res.length == 2) {
            starTime = res[0].data
            endTime = res[1].data
            day = res[1].chaDay
          }
        }
        else {
          starTime = ''
          day = ''
          endTime = ''
        }
        that.setData({
          starTime: starTime,
          endTime: endTime,
          day: day,
        })
      }
    })
  },
  // 清除
  onReady() {
    this.viewTimer = this.selectComponent("#viewTimer")
  },
  bindClear() {
    this.viewTimer.clearChoose();
    wx.removeStorageSync('timer')
  },
  // 确认
  bindAffirm() {
    if (this.data.starTime && !this.data.endTime){
      toolTip.noPhotoTip('选择时间至少为一天')
      return false
    } 
    wx.setStorageSync('ls_optionsStatus', 1)
    wx.navigateBack({
      delta: 1
    })
  }
})