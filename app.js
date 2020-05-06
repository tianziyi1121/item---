//app.js
const api = require('utils/api.js')
App({
  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    let codeData = ''
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        codeData = res.code
      }
    })
    this.globalData.uid = wx.getStorageSync('uid')
    this.globalData.token =  wx.getStorageSync('token')
    this.globalData.mobile = wx.getStorageSync('mobile')
    // let phoneCode = wx.getStorageSync('phonecCode')
    // if (phoneCode == 123){
    //   this.globalData.codeData = phoneCode
    // }
    // if (!this.globalData.uid){
    //   if (this.globalData.codeData != 123){
    //     wx.reLaunch({
    //       url: 'pages/index/index'
    //     })
    //   }
    // }
  },
  // 下拉刷新延迟
  postpone() {
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 500)
  },
  // 数据缓存
  globalData: {
    // number
    number: 1,
    // title bar height
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    // 个人信息
    userInfo: null,
    // 唯一标识
    uid: null,
    token: null,
    codeData: '',
    mobile: '',// 电话
    code: null,
    openid: null,
    // 详情
    dataList: null,
    // 头像
    image: null,
    // 注册
    userForm: {},
    // 订单
    shoppingList: [],
    // 护工id
    id: null,
    // 注册信息
    currentList: '',
    // 小程序
    openid: null,
    // 地区
    area: null,
    // 科室
    office: null,
    // 头像
    headpic: '',
    // 昵称
    nickname: '',
    // Service point name
    serviceName: '',
    // Service point address
    serviceAddress: '',
    // Service point id
    serviceId: '',
    // 产品详情
    productDetails: null,
    // user data
    userData: {},
    loginFlag: 1
  },
  shareTip(){
    wx.showToast({
      title: '分享成功',
      icon: 'success',
      duration: 2000
    })
  },
  // 分享
  share: {
    name: '瑞祺祥假肢矫形器辅具'
  }
})