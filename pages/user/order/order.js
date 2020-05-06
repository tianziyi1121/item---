const app = getApp()
const api = require('../../../utils/api.js')
const common = require('../../../utils/common.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    currentList: [],
    height: '',
    flag: true,
    // 分页
    p: 1,
    num: 0,
    loadingFlag: true,
    flag: true,
    loadflag: false,
    optionsData: ""
  },
  onLoad: function (options) {
    this.setData({
      height: common.windowHeight()
    })
    // 暂无数据组件
    this.noData = this.selectComponent("#noData")
  },
  onShow(){
    this.getData()
  },
  getData() {
    api.requestServerData('/api/member/yuyue_order', 'get', {
      p: this.data.p,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, this.data.flag).then((res) => {
      if (res.data.status == 1) {
        let pn = this.data.p - 1
        let data = res.data.data
        this.data.num = data.length
        this.data.currentList[pn] = []
        this.setData({
          ['currentList['+pn+']']: res.data.data
        })
      }else{
        if (this.data.p == 1) {
          this.noData.noData()
          this.setData({
            loadingFlag: true
          })
        } else {
          this.load.change();
          this.noData.noDataTrue()
        }
        this.data.num = 0
        toolTip.noPhotoTip(res.data.msg)
      }
      if (this.data.loadflag) {
        this.data.loadflag = !this.data.loadflag
        app.postpone()
      }
      if (this.data.num > 3) {
        this.setData({
          loadingFlag: false,
        })
        this.load.onChange()
      } 
    })
  },
  // 签到
  bindSign(e) {
    this.data.optionsData = e.currentTarget.dataset
    this.setData({
      title: ''
    })
    this.show.relation()
  },
  // 弹窗取消
  bindCancel() {
    toolTip.photoTip('签到已取消')
  },
  // 弹窗确认
  bindAffirm() {
    let data = this.data.optionsData
    let i = data.index
    let j = data.number
    api.requestServerData('/api/member/nursing_sign_in', 'get', {
      id: data.id,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, this.data.flag).then((res) => {
      if (res.data.status == 1) {
        this.setData({
          ['currentList[' + j + '][' + j + '].orderStatus']: 2
        })
        toolTip.noPhotoTip('已签到')
      } else {
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 确认
  bindSave(e){
    wx.navigateTo({
      url: 'view/view?id='+ e.currentTarget.dataset.id,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.data.p = 1
    this.data.flag = true
    this.data.loadflag = true
    this.getData()
    this.setData({
      currentList: [],
      loadingFlag: true
    })
    this.noData.noDataTrue()
  },
  // 上拉加载
  onReady() {
    this.load = this.selectComponent("#load")
    this.show = this.selectComponent("#show")
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
  }, 
})