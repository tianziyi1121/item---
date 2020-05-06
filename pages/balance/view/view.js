const app = getApp();
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    currentList: [],
    // 分页
    p: 1,
    num: 0,
    // 下拉刷新
    loadflag: false,
    // 上拉加载
    loadingFlag: true,
    flag: true
  },
  onLoad: function (options) {
    // 暂无数据组件
    this.noData = this.selectComponent("#noData")
    this.getData()
  },
  getData() {
    api.requestServerData('/api/member/log_money', 'get', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      p: this.data.p
    }, this.data.flag).then((res) => {
      if(res.data.status == 1){
        let pn = this.data.p - 1
        this.data.currentList[pn] = []
        this.data.num = res.data.data.length
        this.setData({
          ['currentList[' + pn +']']: res.data.data,
        })
      }else{
        if (this.data.currentList.length < 1){
          this.noData.noData()
          this.setData({
            loadingFlag: true
          })
        }else{
          this.data.num = 0
          this.noData.noDataTrue()
        }
        toolTip.noPhotoTip(res.data.msg)
      }
      if (this.data.loadflag) {
        this.data.loadflag = !this.data.loadflag
        app.postpone()
      }
      if (this.data.num >= 8){
        this.setData({
          loadingFlag: false
        })
        this.load.onChange()
      }else{
        this.load.change();
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.data.loadflag = true
    this.data.p = 1
    this.setData({
      currentList: [],
      loadingFlag: true
    })
    this.load.onChange()
    this.getData()
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
    }, 100)
    if (flag) {
      this.data.flag = false
      this.data.p += 1
      this.getData()
    }
  }
})