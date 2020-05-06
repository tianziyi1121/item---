const app = getApp()
const api = require("../../../utils/api.js")
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    money: '',
    id: '',
    title: '',
    moneyFlag: true,
    balance: '0.00'
  },
  onLoad: function (options) {
   
  },
  onShow(){
    let flag = wx.getStorageSync('withdraw_flag')
    if (flag){
      this.skip()
      wx.removeStorageSync('withdraw_flag')
    }
  },
  withdrawInput: function(e) {
    var money = 0
    if (/^(\d?)+(\.\d{0,0})?$/.test(e.detail.value)) {
      money = e.detail.value;
      this.data.moneyFlag = true
    } else {
      toolTip.photoTip('请输入整数', '../../../static/fail.png')
      this.data.moneyFlag = false
    }
    this.setData({
      money: money
    })
  },
  // 确认
  deposit: function() {
    if (!this.data.money || !this.data.moneyFlag){
      toolTip.photoTip('正确填写金额', '../../../static/fail.png')
      return false
    }
    this.rechange()
  },
  // 充值
  rechange: function() {
    this.getRechange().then((res) => {
      let data = res.data
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success(res) {
          wx.setStorageSync('withdraw_flag', true)
          toolTip.photoTip('支付成功')
          this.skip()
        },
        fail(res) {
          toolTip.noPhotoTip('支付失败,请重新充值')
        }
      })
    })
  },
  // 充值/提现生成订单
  getRechange() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          let code = res.code
          api.requestServerData('/api/orders/sub_order', 'post', {
            uid: app.globalData.uid,
            token: app.globalData.token,
            money: this.data.money,
            orderType: 2,
            orderSrc: "wechat",
            type: 1,
            trade_type: 'JSAPI',
            code: code,
            orderRemarks: ''
          }, true).then((res) => {
            let data = res.data
            if(res.data.status == 1){
              resolve(data)
            }else{
              toolTip.noPhotoTip(res.data.msg)
            }
          })
        }
      })
    }) 
  },
  // 提现
  withdraw: function() {
    this.skip()
  },
  // 跳转
  skip: function() {
    wx.navigateTo({
      url: 'view/view?id=1&money='+ this.data.money
    })
  }
})