var app = getApp();
var api = require('../../utils/api.js')
var common = require('../../utils/common.js')
Page({
  data: {
    balance: '0.00',
    bankType: '',
    uid: '',
    token: '',
    dataFlag: true
  },
  onLoad: function() {
    this.data.dataFlag = false
    this.data.uid = app.globalData.uid,
    this.data.token = app.globalData.token
    this.getData()
    this.bindBank()
  },
  onShow() {
    if (this.data.dataFlag){
      this.getData()
      this.bindBank()
    }else{
      this.data.dataFlag = true
    }
  },
  getData() {
    api.requestServerData('/api/member/index', 'get', {
      uid: this.data.uid,
      token: this.data.token
    }, true).then((res) => {
      if (res.data.status == 1) {
        let data = res.data.data
        this.setData({
          balance: data.coin
        })
      }
    })
  },
  // 功能
  withdraw(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 银行卡
  bindBank() {
    common.bankData(this.data.uid,this.data.token).then((res) => {
      this.setData({
        bankType: res
      })
    })
  },
  // 明细
  bindDetail() {
    wx.navigateTo({
      url: 'view/view',
    })
  }
})