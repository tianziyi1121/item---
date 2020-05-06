const app = getApp()
const api = require('../../../../utils/api.js')
const toolTip = require('../../../../utils/toolTip.js')
Page({
  data: {
    // 收藏
    collection: 0,
    collectionFlag: null,
    // 数据列表
    currentList: [],
    // 上拉加载数据
    num: null,
    loadingFlag: true,
    // 五星
    state: [0, 1, 2, 3, 4],
    starUrl: '../../../../static/collect_block.png',
    halfUrl: '../../../../static/icon_star_on_half@2x.png',
    greyUrl: '../../../../static/collect.png',
    // 钱
    money: '0.00',
    // 参数
    list: {
      uid: null,
      token: null,
      type: 'good',
      nurid: null,
      p: 1
    },
    is_self: null,
    // 预约
    status: 0,
    // 好品数量
    goodsCount: 0,
    middleCount: 0,
    negativeCount: 0,
    // 判断加载
    flag: true
  },
  onLoad: function (options) {
    this.data.list.nurid = options.id
    this.data.list.uid = app.globalData.uid
    this.data.list.token = app.globalData.token
    this.setData({
      status: options.status,
      money: options.money,
      collection: options.collection
    })
    this.getData()
    // 暂无数据组件
    this.noData = this.selectComponent("#noData")
  },
  // 获取数据
  getData() {
    api.requestServerData('/api/nursing_workers/comments_list','get',this.data.list,this.data.flag).then((res) => {
      let data = res.data.data
      let list = []
      let pn = this.data.list.p - 1
      this.data.currentList[pn] = []
      if (res.data.status == 1){
        this.data.num = data.list.length
        list[pn] = []
        list[pn] = data.list
        this.setData({
          currentList: list,
          loadingFlag: this.data.loadingFlag,
          is_self: data.is_self
        })
        this.noData.noDataTrue()
      }else{
        if (this.data.list.p == 1){
          this.setData({
            currentList: []
          })
          this.noData.noData()
        }else{
          this.noData.noDataTrue()
          this.data.loadingFlag = true
          this.load.change();
        }
      }
      this.setData({
        goodsCount: data.goods_count,
        middleCount: data.middle_count,
        negativeCount: data.negative_count,
      })
    })
  },
  // 预约
  subscribe(e) {
    if (this.data.is_self != 1){
      if (this.data.status == 1) {
        app.globalData.id = this.data.list.nurid
        wx.navigateTo({
          url: '../../details/details'
        })
      } else {
        toolTip.photoTip('暂时无法预约哟', '../../../../static/fail.png')
      }
    }else{
      toolTip.photoTip('护工不能约自己', '../../../../static/fail.png')
    }
  },
  // 收藏
  bindCollect(e) {
    let img = ''
    let title = ''
    if (this.data.collection == 1) {
      title = '取消收藏'
      img = '../../../../static/fail.png'
      this.data.collection = 0
    } else {
      title = '收藏成功'
      this.data.collection = 1
    }
    api.requestServerData('/api/member/collection', 'get', {
      id: this.data.list.nurid,
      type: 1,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, false).then((res) => {
      if (res.data.status == 1) {
        this.setData({
          collection: this.data.collection
        })
        toolTip.photoTip(title, img)
        wx.setStorageSync('lookCare_list_flag', true)
        wx.setStorageSync('lookCare_collect', this.data.collection)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 点击title
  bindReview(e) {
    this.noData.noDataTrue()
    this.setData({
      ['list.type']: e.currentTarget.dataset.review,
      loadingFlag: true
    })
    this.data.flag = true
    this.data.list.p = 1
    this.data.currentList = []
    this.getData()
  },
  // 下拉刷新
  onPullDownRefresh(){
    wx.showNavigationBarLoading();
    this.data.list.p = 1
    this.data.currentList = []
    this.getData();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },500)
  },
  // 上拉加载
  onReady() {
    this.load = this.selectComponent("#load")
  },
  onReachBottom() {
    let flag = true
    if (this.data.num < 10) {
      this.load.change();
      flag = false
    }
    setTimeout(() => {
      this.setData({
        loadingFlag: false
      })
    }, 50)
    if (flag) {
      this.data.flag = false
      this.data.list.p += 1
      this.getData()
    }
  }
})