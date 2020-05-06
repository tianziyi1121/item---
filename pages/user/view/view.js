const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
const common = require('../../../utils/common.js')
Page({
  data: {
    lastTiles: '是否删除该收藏?',
    // 弹窗
    oshowFlag: true,
    // 当前数据
    currentList: [],
    index: null,
    // 请求参数列表
    list: {
      type: 2,  // 分类
      p: 1, // 页数
      token: null,
      uid: null
    },
    uid: null,
    token: null,
    // 加载
    loadingFlag: true,
    topFlag: false,
    // 删除参数列表
    deletList: {
      collection_id: null,
      uid: null,
      token: null
    },
    num: 0,
    pn: 10,
    // 显示loading
    flag: true
  },
  onLoad: function (options) {
    this.noData = this.selectComponent("#noData");
    this.getData()
  },
  onShow() {
    let type = wx.getStorageSync('authorization')
    if (type == 1) {
      this.getData()
      wx.removeStorageSync('authorization')
    }
  },
  onReady: function () {
    this.oShow = this.selectComponent("#oshow");
    this.load = this.selectComponent("#load");
  },
  // bindtitle
  bindTile(e) {
    this.setData({
      ['list.type']: e.currentTarget.dataset.type
    })
    if(this.data.p > 1){
      this.setData({
        loadingFlag: true
      })
    }else{
      this.setData({
        loadingFlag: true
      })
    }
    this.data.currentList = []
    this.data.list.p = 1
    this.data.flag = true
    this.getData()
  },
  // 数据列表
  getData() {
    this.data.list.uid = app.globalData.uid
    this.data.list.token = app.globalData.token
    api.requestServerData('/api/member/collection_list','get',this.data.list,this.data.flag).then((res) => {
      let data = res.data.data
      if(res.data.status == 1){
        this.data.num = data.list.length
        if(this.data.list.p == 1){
          this.setData({
            currentList: [],
            currentList: this.data.currentList.concat(data.list)
          })
        }else{
          this.setData({
            currentList: this.data.currentList.concat(data.list)
          })
        }
        this.noData.noDataTrue()
      }else{
        if (res.data.status == 2 && this.data.currentList.length > 0){
          this.data.num = 0
          this.load.change();
        }else{
          this.setData({
            currentList: []
          })
          this.noData.noData()
        }
      }
    })
  },
  // 删除
  catchDelet(e) {
    this.setData({
      oshowFlag: false
    })
    this.oShow.relation()
    this.data.index = e.currentTarget.dataset.index
    this.data.deletList.collection_id = e.currentTarget.dataset.id
    this.data.deletList.uid = app.globalData.uid
    this.data.deletList.token = app.globalData.token
  },
  // 确认
  onbindShow() {
    api.requestServerData('/api/member/collection_del', 'get', this.data.deletList).then((res) => {
      let image = null
      let title = null
      if (res.data.status == 1){
        title = res.data.msg
        this.data.currentList.splice(this.data.index, 1)
        this.setData({
          currentList: this.data.currentList
        })
        if (this.data.currentList.length == 0) {
          this.noData.noData()
        }
      }else{
        image = '../../../static/fail.png'
        title = '删除失败'
      }
      toolTip.photoTip(res.data.msg, image)
    })
  },
  // 取消
  onbindClose() {
    toolTip.photoTip('已取消', '../../../static/fail.png')
  },
  // 物品点击
  onProductList(e) {
    let id = e.currentTarget.dataset.id
    let rent = 1
    let type = 1
    if(this.data.list.type == 1){
      rent = 1
      type = 1
    }else{
      rent = 0
      type = 2
    }
    common.productInformation(id, app.globalData.uid, app.globalData.token).then(res => {
      app.globalData.productDetails = res
      wx.navigateTo({
        url: '../../product/view/view/view?id=' + id + "&is_rent=" + rent + "&type=" + type
      })
    })
  },
  // 上拉加载
  onReachBottom() {
    let flag = true
    if (this.data.num < this.data.pn) {
      this.load.change();
      flag = false
    }
    setTimeout(() => {
      this.setData({
        loadingFlag: false
      })
    }, 100)
    if (flag) {
      this.data.list.p += 1
      this.data.flag = false
      this.getData()
    }
  }
})