const app = getApp()
const api = require("../../../utils/api.js")
const common = require("../../../utils/common.js")
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    houser: '',
    minutes: '',
    seconds: '',
    id: 0,
    setTime: '',
    total: '',
    // 点单id
    id: null,
    imageSrc1: '../../../static/icon_paychoose_paypage_normal@2x.png',
    imageSrc2: '../../../static/icon_paychoose_paypage_on@2x.png',
    // 支付
    balance: 1,
    wechat: 2,
    tranType: 'JSAPI', // JSAPI 微信付款 BALANCE 余额支付
    // 二维码
    codeImg: '',
    timer: '',
    // 定时器
    getPayTime: '',
    // 支付
    paymentFlag: false,
    // 余额
    lsh_money: '',
    leftTimerFlag: false,
  },
  onLoad(options) {
    this.bindOrder(options.id).then((resData) => {
      let money = '0.00'
      if (resData.dataFlag == 1) {
        money = resData.totalMoney
      }else{
        toolTip.photoTip('订单已失效', '../../../static/fail.png')
      }
      this.setData({
        total: money
      })
    })
    this.timer(options.timer)
    this.data.id = options.id
  },
  onShow() {
    common.userData(app.globalData.uid, app.globalData.token).then(res => {
      if (res.status == 1){
        this.setData({
          lsh_money: res.data.coin
        })
      }else{
        toolTip.noPhotoTip(res.msg)
      }
    })
  },
  // 获取订单是否失效
  bindOrder(id) {
    return new Promise((resolve, reject) => {
      api.requestServerData("/api/orders/isorder", "post", {
        orderID: id,
        uid: app.globalData.uid,
        token: app.globalData.token
      }, false).then((res) => {
        if (res.data.status == 1) {
          resolve(res.data.data)
        }else{
          reject(res)
        }
      })
    })
  },
  // 倒计时
  timer(time) {
    let timer = Number(time) +7176
    this.leftTimer(timer)
    this.data.leftTimerFlag = true
    this.data.setTime = setInterval(() => {
      this.leftTimer(timer)
      this.data.leftTimerFlag = false
    }, 1000)
  },
  leftTimer(time) {
    var timesNow = Date.parse(new Date())
    var leftTime = time - (timesNow/1000);
    var hour = ''
    var minute = ''
    var second = ''
    if (leftTime >= 0) {
      hour = Math.floor(leftTime / 3600)
      minute = Math.floor((leftTime - hour * 60 * 60) / 60)
      second = Math.floor(leftTime - hour * 3600 - minute * 60);
    }else{
      hour = 0
      minute = 0
      second = 0
      clearInterval(this.data.setTime)
    }
    this.setData({
      houser: this.checkTime(hour),
      minutes: this.checkTime(minute),
      seconds: this.checkTime(second)
    })
    if (this.data.houser == 0 && this.data.minutes == 0 && this.data.seconds == 0 && this.data.leftTimerFlag == true){
      toolTip.noPhotoTip('订单已失效')
      setTimeout(() => {
        wx.reLaunch({
          url: '../../indent/indent'
        })
      },1000)
    }
  },
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  // 付款方式
  bindSelect(e) {
    let index = e.currentTarget.dataset.index
    if (index == 1){
      if (this.data.wechat == 1){
        this.data.tranType = 'JSAPI'
        this.setData({
          balance: 1,
          wechat: 2
        })
      }
    }else{
      if (this.data.balance == 1) {
        this.data.tranType = 'BALANCE'
        this.setData({
          balance: 2,
          wechat: 1
        })
      }
    }
  },
  // 找人代付
  bindAnother() {
    return {
      title: app.share.name,
      path: 'pages/subscribe/view/view?id=' + this.data.id
    }
  },
  // 确认支付
  bindpPayment() {
      this.ls_wxchat()
  },
  // 余额支付
  ls_balance(e){
    api.requestServerData('/api/Pay/index', "post", {
      uid: app.globalData.uid,
      token: app.globalData.token,
      trade_type: this.data.tranType,
      orderId: this.data.id,
      paypwd: e.detail.paypwd
    }, true).then((res) => {
      if (res.data.status == 1){
        this.router('支付成功')
        this.payment.closePup()
        setTimeout(() => {
          wx.switchTab({
            url: '../../indent/indent',
          })
        })
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  ls_wxchat(){
    let self = this
    wx.login({
      success: res => {
        let code = res.code
        api.requestServerData('/api/Pay/index', "post", {
          uid: app.globalData.uid,
          token: app.globalData.token,
          trade_type: self.data.tranType,
          orderId: self.data.id,
          code: code
        }, true).then((res) => {
          let data = res.data
          if (data.status == 1) {
            wx.requestPayment({
              timeStamp: data.data.timeStamp,
              nonceStr: data.data.nonceStr,
              package: data.data.package,
              signType: 'MD5',
              paySign: data.data.paySign,
              success(res) {
                self.router('支付成功')
              },
              fail(res) {
                toolTip.photoTip('支付失败', '../../../static/fail.png')
              }
            })
          } else {
            toolTip.noPhotoTip(data.msg)
          }
        })
      }
    })
  },
  // 支付跳转
  router(text) {
    toolTip.photoTip(text, '')
    wx.switchTab({
      url: '../../indent/indent'
    })
  },
  // 退出
  onUnload() {
    clearInterval(this.data.setTime)
    clearInterval(this.data.getPayTime)
    wx.navigateBack({
      delta: 1
    })
  },
  // 忘记密码
  modify_password(){
    wx.navigateTo({
      url: '../../user/pay/view/view',
    })
  }
})