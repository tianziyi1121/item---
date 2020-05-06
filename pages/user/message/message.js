const app = getApp()
const api = require('../../../utils/api.js')
Page({
  data: {
    currentList: [],
    num: 0,
    p: 1,
    loadingFlag: true,
    topFlag: false,
    pn: 10,
    flag: true
  },
  onLoad() {
    this.getData()
    this.noData = this.selectComponent("#noData")
  },
  getData(url) {
    api.requestServerData("/api/nursing_workers/nursing_workers_register_info", "get", {
      uid: app.globalData.uid,
      token: app.globalData.token,
      p: this.data.p
    }, this.data.flag).then((res) => {
      if (res.data.status == 1) {
        if (res.data.data != '') {
          this.data.num = res.data.data.length
          this.data.currentList = this.data.currentList.concat(res.data.data)
          this.setData({
            currentList: this.data.currentList
          })
        }
        this.noData.noDataTrue()
      }else{
        if (this.data.p = 1){
          this.setData({
            currentList: []
          })
          this.noData.noData()
        }else{
          this.load.change();
        }
        this.data.num = 0
      }
      if (this.data.topFlag) {
        app.postpone()
        this.data.topFlag = false
      }
      if (this.data.num > 8){
        this.setData({
          loadingFlag: false
        })
        this.load.onChange()
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.data.topFlag = true
    this.data.p = 1
    this.data.flag = true
    this.setData({
      currentList: [],
      loadingFlag: true
    })
    this.getData(); 
  },
  // 上拉加载
  onReady() {
    this.load = this.selectComponent("#load")
  },
  onReachBottom() {
    let flag = true
    if (this.data.num < this.data.pn) {
      this.load.change();
      flag = false
    }
    this.data.flag = false
    setTimeout(() => {
      this.setData({
        loadingFlag: false
      })
    }, 100)
    if (flag) {
      this.data.p += 1
      this.getData()
    }
  },
  bindmessage(e) {
    app.globalData.currentList = this.data.currentList[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: 'view/view'
    })
  }
})