const app = getApp();
const api = require('../../../../../../utils/api.js')
const toolTip = require('../../../../../../utils/toolTip.js')
Page({
  data: {
    // evaluation
    collect: '../../../../../../static/collect.png',
    collectBlack: '../../../../../../static/collect_block.png',
    collectHalf: '../../../../../../static/icon_star_on_half@2x.png',
    status: [0, 1, 2, 3, 4],
    collectData: 3.5,
    evaluateContent: '<p>尺寸合适，做工精细，价格实惠，接受腔舒适，灵活耐用，因为是机械的，有点沉重。</p>',
    title: '是否联系该服务点？',
    p: 1,// data paging
    currentData: {},// current data
    currentList: [],// current data list
    type: null,
    flag: true,
    loadingFlag: true,
    num: null,// data bulk
  },
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.data.id = options.id
    this.data.lng = options.lng
    this.data.lat = options.lat
    this.noData = this.selectComponent("#noData")
    this.getData()
  },
  onReady() {
    this.show = this.selectComponent("#show")
    this.load = this.selectComponent("#load")
  },
  // get data
  getData(){
    api.requestServerData('/api/service/service_info', 'get', {
      zuobiao_lng1: this.data.lng,
      zuobiao_lat1: this.data.lat,
      service_id: this.data.id,
      p: this.data.p
    }, this.data.flag).then((res) => {
      if(res.data.status == 1){
        let pn = this.data.p - 1
        this.data.currentList[pn] = []
        if (this.data.p == 1){
          res.data.data.logo = "https://www.rqxjzjxq.com" + res.data.data.logo
          this.setData({
            currentData: res.data.data
          })
        }
        this.data.num = res.data.data.comment.length
        this.setData({
          ['currentList[' + pn + ']']: res.data.data.comment
        })
      }else{
        if (this.data.p != 1) {
          this.load.change();
        } else {
          this.setData({
            currentlist: [],
            loadingFlag: true
          })
        }
        toolTip.noPhotoTip(res.data.msg)
      }
      this.data.p == 1 && this.data.currentList[0].length == 0 ? this.noData.noData() : this.noData.noDataTrue()
    })
  },
  // affirm
  bindBat(){
    app.globalData.serviceName = this.data.currentData.name
    app.globalData.serviceAddress = this.data.currentData.address
    app.globalData.serviceId = this.data.currentData.id
    wx.navigateBack({
      delta: 2
    })
  },
  // 弹窗取消
  bindCancel() {
    toolTip.noPhotoTip('操作已取消')
  },
  // 弹窗确认
  bindAffirm() {
    wx.makePhoneCall({
      phoneNumber: this.data.currentData.tel
    })
  },
  // pull on loading
  onReachBottom() {
    let flag = true
    if (this.data.num < 10) {
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
  bindPhone() {
    this.show.relation()
  },
  preventTouchMove() { },
})