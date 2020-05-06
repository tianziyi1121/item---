const app = getApp()
const api = require('../../../../utils/api.js')
const toolTip = require('../../../../utils/toolTip.js')
Page({
  data: {
    type: '',
    phone: '',
    number: '',
    btnFlag: true,
    contentFlag: false,
    timer: 60,
    // 验证码
    authCode: '',
    codeTimer: '',
    // 参数
    form: {
      
    }
  },
  onLoad(options) {
    let title = ''
    if(options.type == 1){
      title = '设置密码'
    }else{
      title = '重置密码'
    }
    this.data.type = options.type
    wx.setNavigationBarTitle({
      title: title
    })
    let phone = wx.getStorageSync('phoneNumber')
    this.setData({
      phone: phone
    })
  },
  // 内容
  bindData(e) {
    this.data.number = e.detail.value
    let flag = true
    if (e.detail.cursor == 6){
      flag = false
    }
    this.setData({
      btnFlag: flag
    })
  },
  // 获取验证码
  bindGain() {
    if (!this.data.contentFlag && this.data.timer == 60){
      this.data.contentFlag = true
      this.data.codeTimer = setInterval(() => {
        this.getTimer()
      }, 1000)
      this.getData()
    }else{
      toolTip.noPhotoTip('验证码已发送，请稍等')
    }
    this.setData({
      contentFlag: this.data.contentFlag
    })
  },
  // 获取验证码
  getData(){
    api.requestServerData('/api/Login/sendsms', 'post', {
      mobile: this.data.phone
    }, true).then((res) => {
      this.data.authCode = res.data.data
      toolTip.noPhotoTip(res.data.msg)
    })
  },
  // 倒计时
  getTimer() {
    if (this.data.timer > 0) {
      this.data.timer = this.data.timer -1
    }else{
      this.data.timer = 60
      this.data.contentFlag = false
      clearInterval(this.data.codeTimer)
    }
    this.setData({
      timer: this.data.timer,
      contentFlag: this.data.contentFlag
    })
  },
  // 确认
  bindAffirm() {
    if (this.data.authCode == this.data.number){
      wx.navigateTo({
        url: 'view/view?type=' + this.data.type + '&code=' + this.data.authCode
      })
    }else{
      toolTip.photoTip('验证码不正确', '../../../../static/fail.png')
    }
  }
})