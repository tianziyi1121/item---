const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    // 数据列表
    currentList: {},
    // 评价列表
    evaluateLIstanbul: {},
    // 收藏
    collection: 0,
    is_self: null,
    collectionFlag: null,
    // 好评
    starUrl: '../../../static/collect_block.png',
    halfUrl: '../../../static/icon_star_on_half@2x.png',
    greyUrl: '../../../static/collect.png',
    state:[0,1,2,3,4],
    id: null,
    // 是否可预约
    status: null
  },
  onLoad: function (options) {
    this.data.id = options.id
    this.getData(options.id)
  }, 
  onShow(){
    let flag = wx.getStorageSync('lookCare_list_flag')
    if (flag) {
      let data = wx.getStorageSync('lookCare_collect')
      this.setData({
        collection: data
      })
    }
  },
  // 获取数据
  getData(id) {
    api.requestServerData('/api/nursing_workers/nursing_workers_info','get',{
      nursing_workers_id: id,
      uid: app.globalData.uid,
      token: app.globalData.token
    },true).then((res) => {
      let data = res.data.data
      data.info.praise_rate = data.info.praise_rate.toFixed(2)
      this.setData({
        currentList: data.info,
        evaluateLIstanbul: data.comment,
        collection: data.is_collection,
        status: data.is_can_order,
        is_self: data.is_self
      })
      if (data.is_collection == 1) {
        this.data.collectionFlag = true 
      }else{
        this.data.collectionFlag = false
      }
    })
  },
  // 预约
  subscribe(e) {
    if (this.data.is_self != 1) {
      if (e.currentTarget.dataset.flag == 1) {
        app.globalData.id = this.data.currentList.nursing_workers_id
        wx.navigateTo({
          url: '../details/details'
        })
      } else {
        toolTip.photoTip('暂时无法预约哟', '../../../static/fail.png')
      }
    }else{
      toolTip.photoTip('护工不能约自己', '../../../static/fail.png')
    }
    
  },
  // 查看更多
  bindExamine(e) {
    wx.navigateTo({
      url: 'details/details?id=' + this.data.currentList.nursing_workers_id + '&money=' + this.data.currentList.nursing_workers_money + "&collection=" + this.data.collection + '&status=' + e.currentTarget.dataset.flag
    })
  },
  // 收藏
  bindCollect(){
    let img = ''
    let title = ''
    let idx = 0
    if (this.data.collectionFlag) {
      title = '取消收藏'
      img = '../../../static/fail.png'
      idx = 0
      this.data.collectionFlag = false
    } else {
      title = '收藏成功'
      idx = 1
      this.data.collectionFlag = true
    }
    api.requestServerData('/api/member/collection','get',{
      id: this.data.id,
      type: 1,
      uid: app.globalData.uid,
      token: app.globalData.token
    },false).then((res) => {
      if(res.data.status == 1){
        this.setData({
          collection: idx
        })
        wx.setStorageSync('lookCare_collect', idx)
        wx.setStorageSync('lookCare_list_flag', true)
        toolTip.photoTip(title, img)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  }
})