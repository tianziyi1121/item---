//logs.js
const app = getApp();
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
const util = require('../../utils/util.js')
const common = require('../../utils/common.js')
Page({
  data: {
    // 轮播图
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    bannerList: [],
    // 上拉加载
    loadingFlag: true,
    // 列表
    currentList: [],
    // 问答
    hotList: [],
    // 阴影层
    shadowFlag: false,
    city: '',
    statusBarHeight: '',// title bar height
    type: 1,
    loginFlag: true,
    titleFlag: false,
    heightBox: 0,
    titledataFlag: false,
    title: [{ title: '护工', value: 1 }, { title: '产品', value: 2 }, { title: '康复知识', value: 3 }],
    tityeVlue: 1,
    searchType: false,
    titleVlue: '护工'
  }, 
  onLoad(options) {
    let height = wx.getSystemInfoSync()['statusBarHeight'] * 2
    let h = common.windowHeight()
    this.setData({
      height: height,
      height1: height + 90,
      heightBox: h - (height + 90) / 2
    })
    let city = wx.getStorageSync('lf_lon')
    if(city != ''){
      this.setData({
        city: city
      })
    }
    this.show = this.selectComponent("#show")
    this.getData()
    this.getPosition()
  },
  onShow() {
    if (app.globalData.uid !== '' || app.globalData.accredit == 1 || app.globalData.loginFlag == 2) {
      this.data.loginFlag = false
    } else {
      this.data.loginFlag = true
    }
    this.setData({
      loginFlag: this.data.loginFlag
    })
    // this.data.loginFlag ? app.globalData.loginFlag = 2 : app.globalData.loginFlag == 1
    let city = wx.getStorageSync('lf_lon')
    if (city != '' && this.data.type == 2) {
      this.setData({
        city: wx.getStorageSync('lf_lon')
      })
      this.data.type = 1
    }
  },
  // get location
  getPosition(){
    var self = this
    common.getUserLocation().then(res => {
      if (res == 1) {
        common.getLocation().then(resp => {
          resp.latitude = resp.latitude + 0.001276
          resp.longitude = resp.longitude + 0.006256
          common.getLocal(resp).then(resData => {
            let flag = null
            let name = wx.getStorageSync('lf_lon')
            if (name == resData.result.address_component.city){
              this.setData({
                city: name
              })
              flag = false
            }else{
              this.setData({
                title: resData.result.address_component.city
              })
              let type = wx.getStorageSync('lf_positioningPrompt')
              if (type == 1){
                this.show.relation()
              }
            }
          })
        })
      }
    })
  },
  // 弹窗取消
  bindCancel() {
    toolTip.photoTip('操作已取消', '')
    wx.setStorageSync('lf_positioningPrompt', 2)
    wx.setStorageSync('lf_positioningType', 2)
  },
  // 弹窗确认
  bindAffirm() {
   this.setData({
     city: this.data.title
   })
    wx.setStorageSync('lf_lon', this.data.title)
    wx.setStorageSync('lf_positioningPrompt', 2)
    wx.setStorageSync('lf_positioningType', 1)
    wx.removeStorageSync('lf_provinceId')
  },
  onReady() {
    this.load = this.selectComponent("#load")
  },
  // 功能区域
  homeFunction: function(e) {
    var id = e.currentTarget.dataset.index
    if (id == "../lookCare/lookCare"){
      wx.reLaunch({
        url: id
      })
    }else{
      wx.navigateTo({
        url: id
      })
    }
  },
  // 数据
  getData: function () {
    api.requestServerData("/api/index", "get", '', false).then((res) => {
      let data = res.data.data
      if (res.data.status == 1){
        this.setData({
          bannerList: data.ads_list,
          currentList: data.article_list,
          hotList: data.index_img
        })
      }else{
        toolTip.photoTip('数据获取失败', '../../static/fail.png')
      }
      if (this.data.loadflag) {
        this.data.loadflag = !this.data.loadflag
        this.com.refreshend()
      }
    });
  },
  // 点击热门问答及列表
  articleDetails(e) {
    let index = e.currentTarget.dataset.index
    app.globalData.dataList = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../recovery/view/view?id=3'
    })
  },
  userINFO(){
    wx.authorize({ scope: "scope.userInfo" })
  },
  // 定位
  bindPosition() {
    this.data.type = 2
    wx.navigateTo({
      url: "view/view"
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
      loginFlag: false
    })
  },
  // scroll(e) {
  //   this.data.scrollTop = e.detail.scrollTop
  //   if (e.detail.scrollTop > 20){
  //     this.setData({
  //       titledataFlag: false
  //     })
  //   }
  // },
  // scroll view
  upper(e) {
    let that = this
    if (this.data.scrollTop > 24){
      return false
    }
    this.setData({
      titledataFlag: true
    })
    this.com = that.selectComponent('#tfresh')
    this.com.refreshstart()
    this.data.loadflag = true
    this.getData()
  },
  // input
  bindInput(e) {
    this.data.inputValue = e.detail.value
  },
  // search
  search() {
    if (!this.data.inputValue) {
      toolTip.noPhotoTip('请输入搜索内容')
      return false
    }
    wx.navigateTo({
      url: '/pages/recovery/recovery?id=&value=' + this.data.inputValue,
    })
  },
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/home/home',
      success: res => {
        app.shareTip()
      }
    }
  }
})
