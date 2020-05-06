const toolTip = require('../../../utils/toolTip.js')
const common = require('../../../utils/common.js')
const api = require('../../../utils/api.js')
const app = getApp()
Page({
  data: {
    time: false,
    timeData: 60,
    timer: '',
    typeFlag: false,
    member_list_tel: null,
    codeData: '',// get code
    code: '',// Fill in verification code
  },
  onLoad: function (options) {
    let flag = ''
    if (options.type == 1){ 
      flag = false
    }else{
      flag = true
    }
    let phone = wx.getStorageSync('mobile')
    this.setData({
      typeFlag: flag,
      member_list_tel: phone
    })
  },
  // input value
  bindKeyInput(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  // 获取验证码
  bindCode() {
    let text = /^[1][3,4,5,7,8][0-9]{9}$/
    let data = this.data.member_list_tel
    if (data != null && text.test(data) ){
      if (this.data.time) {
        toolTip.noPhotoTip('验证码已获取，请稍等...')
      } else {
        common.getCode(this.data.member_list_tel).then((res) => {
          this.data.codeData = res
        })
        this.timer()
        this.setData({
          time: true
        })
      }
    }else{
      toolTip.noPhotoTip('请输入正确的电话号码')
    }
  },
  timer() {
    this.data.timer = setInterval(() => {
      let data = this.data.timeData
      this.data.time = true
      if (data > 0) {
        data -= 1
      } else {
        clearInterval(this.data.timer)
        this.data.time = false
        data = 60
      }
      this.setData({
        timeData: data,
        time: this.data.time
      })
    }, 1000)
  },
  // 下一步
  bindNext() {
    let verify = wx.getStorageSync('verify')
    // if (this.data.code == this.data.codeData){
    //   api.requestServerData('/api/Login/login_verify', "post", {
    //     member_list_tel: this.data.member_list_tel,
    //     code: this.data.code
    //   }, true).then((res) => {
    //     if (res.data.status == 1) {
    //       toolTip.noPhotoTip("验证成功")
    //       setTimeout(() => {
    //         if (!this.data.typeFlag) {
    //           wx.navigateTo({
    //             url: 'view/view?phone=' + this.data.member_list_tel + '&code=' + this.data.code,
    //           })
    //           app.globalData.codeData = 123
    //         } else {
              let num = 2
              // if (verify == 1){
              //   num = 1
              //   wx.removeStorageSync('verify')
              // }
              wx.setStorageSync('phonecCode', 123)
              wx.navigateBack({
                delta: num
              })
    //         }
    //       }, 1000)
    //     } else {
    //       toolTip.noPhotoTip(res.data.msg)
    //     }
    //   })
    // }else{
    //   toolTip.noPhotoTip('验证码不正确')
    // }
  },
  // 清除定时器
  onUnload() {
    clearInterval(this.data.timer)
    this.setData({
      time: false,
      timeData: 60,
    })
  },
  onHide() {
    this.onUnload()
  }
})