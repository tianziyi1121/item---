//product.js
const app = getApp()
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    // 轮播图
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    bannerList: [],
    navigationBar: [],// navigation bar
    newConsulting: [],// News consulting
    topFlag: false
  },
  onLoad: function() {
    this.getData()
  },
  onShow(){},
  // get data
  getData(){
    api.requestServerData('/api/product/index', 'post', '', true).then((res) => {
      let data = res.data.data
      if(res.data.status == 1){
        this.setData({
          bannerList: data.index_imgs,
          navigationBar: data.cate_list,
          newConsulting: data.article_list
        })
      }else{
        toolTip.photoTip('数据获取失败','../../static/fail.png')
      }
      if (this.data.topFlag) {
        app.postpone()
        this.data.topFlag = false
      }
    })
  },
  // 点击列表
  bindList(e) {
    let type = e.currentTarget.dataset.type
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: 'view/view?type=' + type + "&name=" + name
    })
  },
  // new 
  bindListData(e) {
    let index = e.currentTarget.dataset.index
    app.globalData.dataList = this.data.newConsulting[index]
    wx.navigateTo({
      url: '../recovery/view/view',
    })
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.data.topFlag = true
    this.data.p = 1
    this.setData({
      loadingFlag: true
    })
    this.getData();
  },
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/product/product',
      success: res => {
        app.shareTip()
      }
    }
  }
})

