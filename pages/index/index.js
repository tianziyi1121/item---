const app = getApp()
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
const common = require('../../utils/common.js')
Page({
  data: {
    time: false,
    timeData: 60,
    timer: '',
    form: {
      member_list_username: '',
      member_list_pwd: ''
    },
  },
  // inpue取数据
  bindKeyInput(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      ['form.' + name]: e.detail.value
    })
  },
  // 注册 忘记
  bindRegister(e){
    wx.setStorageSync('logoCode', 456)
    wx.navigateTo({
      url: e.currentTarget.dataset.url+'?type=1'
    })
  },
  // 登录
  bindLogin() {
    let form = this.data.form
    for(var key in form){
      if(!form[key]){
        toolTip.noPhotoTip('请将数据填写完整')
        return false
      }
    }
    api.requestServerData('/api/Login/login', 'post', form, true).then((res) => {
      console.log(res)
      if(res.data.status == 1){
        let data = res.data.data
        app.globalData.uid = data.uid
        app.globalData.token = data.token
        app.globalData.mobile = data.mobile
        wx.setStorageSync('uid', data.uid)
        wx.setStorageSync('token', data.token)
        wx.setStorageSync('mobile', data.mobile)
        app.globalData.codeData = 123
        wx.navigateTo({
          url: 'code/code',
        })
        wx.setStorageSync('logoCode', 456)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
})