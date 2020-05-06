const app = getApp()
const api = require("../../utils/api.js")
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    checked: false,
    currentList: []
  },
  onLoad: function (options) {
    this.getData()
  },
  // 获取数据
  getData() {
    api.requestServerData('/api/nursing_workers/zhucexieyi', 'get',{
      uid: app.globalData.uid,
      token: app.globalData.token
    }).then((res) => {
      if (res.data.status == 1) {
        this.setData({
          currentList: res.data.data
        })
      }
    })
  },
  // 同意
  consent: function() {
    this.data.checked = !this.data.checked
    this.setData({
      checked: this.data.checked
    }) 
  },
  // 注册
  register: function() {
    if(this.data.checked){
      wx.navigateTo({
        url: "user/user"
      })
    } else {
      toolTip.photoTip('请同意协议', '../../static/fail.png')
    }
  }
})