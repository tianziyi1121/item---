const app = getApp()
const api = require('../../utils/api.js')
const common = require('../../utils/common.js')
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    user: {
      url: "",
      name: "",
      approve: 1
    },
    urlApp: "../../static/icon_renzheng_me@2x.png",
    srcApp: "../../static/icon_renzheng_me@2.png",
    certified: "已认证",
    unverified: "未认证",
    hideModal: true,
    phone: '',
    // 是否设置支付密码
    currentList: '',
    member_list_paypwd: '',
    lsh_type: 1,
    loginDataFlag: 1,
    loginFlag: false
  },
  onLoad: function() {
    this.data.lsh_type = wx.getStorageSync('lsh_role_id')
    if (!this.data.lsh_type) {
      this.data.lsh_type = 2
    }
    this.setData({
      lsh_type: this.data.lsh_type
    })
  },
  onShow() {
    if(app.globalData.uid != ''){
      this.getData()
    }else{
      this.setData({
        loginDataFlag: 2
      })
    }
  },
  getData() {
    common.userData(app.globalData.uid, app.globalData.token).then((res) => {
      let data = res.data
      if(res.status == 1){
        wx.setStorageSync('phoneNumber', data.member_list_tel)
        data.member_list_tel = data.member_list_tel.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2');
        this.setData({
          currentList: data,
          loginDataFlag: 1
        })
        app.globalData.userData = data
      }else{
        toolTip.noPhotoTip(res.msg)
      }
    })
  },
  commonality(e) {
    let data = e.currentTarget.dataset
    if(data.type == 2 && !app.globalData.uid){
      this.login()
      return false
    }
    if (data.id == 1){
      wx.navigateTo({
        url: data.url
      })
    }else{
      wx.switchTab({
        url: data.url
      })
    }
  },
  // 联系我们
  relation() {
    if(!app.globalData.uid){
      this.login()
      return false
    }
    this.setData({
      title: '是否联系客服？'
    })
    this.show.relation()
  },
  // 上拉加载
  onReady() {
    this.show = this.selectComponent("#show")
  },
  // 弹窗取消
  bindCancel() {
    toolTip.photoTip('操作已取消', '')
  },
  // 弹窗确认
  bindAffirm() {
    wx.makePhoneCall({
      phoneNumber: this.data.currentList.call_me
    })
  },
  // user login
  login() {
    this.setData({
      loginFlag: true
    })
  },
  // login
  onBindLogin(e) {
    if (e.detail.type == 2) {
      wx.navigateTo({
        url: '../index/index',
      })
    }
    app.globalData.accredit = 1
    this.setData({
      loginFlag: false,
    })
  },
  // bind user
  bindUser(e) {
    if (!app.globalData.uid && e.currentTarget.dataset.type == 1){
      this.login()
      return false
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  comm() {
    wx.downloadFile({
      url: 'https://www.rqxjzjxq.com/data/upload/2019-09-02/5d6c879c53436.jpg', 
      success(res) {
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      }
    })
  },
  preventTouchMove() {},
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/user/user',
      success: res => {
        app.shareTip()
      }
    }
  },
}) 