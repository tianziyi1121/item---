const app = getApp()
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
Page({ 
  data: {
    currentIdx: 0,
    // headidx: 0,
    scrollLeft: 0,
    //可视区高度
    height: 0,
    id: '',
    // 当前数据
    currentList: [],
    titleList: [],
    // 数据结构
    currentData: [],
    currentListData: [],
    // 参数
    p: 1,
    c_id: 5,
    // 上拉加载
    loadingFlag: true,
    loadingType: true,
    ids: '',
    num: 0,
    // 滑动
    swiperFlag: false,
    windowHeight: 0,
    status: 1,
    flag: true,
    keyword: '',
    dataNum: 1
  },
  onLoad: function (options) {
    this.noData = this.selectComponent("#noData")
    options.value != undefined ? this.data.keyword = options.value : this.data.keyword = ''
    this.data.ids = options.id
    var title
    if (options.id == 1) {
      title = "术后康复"
      this.data.c_id = 2
    } else {
      title = "康复知识"
      this.data.c_id = 5
    }
    this.setData({
      title: title,
      id: options.id
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.titleData().then((res) => {
      this.data.titleList = res.data.data
      if (res.data.status == 1){
        this.setData({
          titleList: res.data.data
        })
        this.getData()
      }else{
        toolTip.photoTip('数据获取失败', '../../static/fail.png')
      }
    })
  },
  onReady(){
    this.load = this.selectComponent('#loadd')
  },
  // 获取数据
  getData() {
    api.requestServerData('/api/listn/lists', 'get',{
      c_id: this.data.titleList[this.data.currentIdx].id,
      p: this.data.p,
      keyword: this.data.keyword
    }, this.data.flag).then((res) => {
      if (res.data.status == 1){
        let i = this.data.currentIdx
        let data = data = res.data.data
        this.data.num = data.length
        this.data.currentData = data
      }else{
        toolTip.noPhotoTip(res.data.msg)
        this.data.num = 0
        this.data.currentData = []
      }
      this.data.p == 1 && res.data.status == 2 ? (this.data.dataNum == 1 ? this.noData.noData() : this.noData1.noData()) : ""
      this.data.dataNum += 1 
      this.bindHeight()
      if (this.data.num > 8) {
        this.setData({
          loadingFlag: false,
        })
      }
    })
  },
  titleData(){
    return new Promise((resolve,reject) => {
      api.requestServerData('/api/listn/menu', 'get', { p_id: this.data.c_id}, true).then((res) => {
        resolve(res)
      })
    })
  },
  // 点击头部
  bindTop(e) { 
    let i = e.currentTarget.dataset.index
    let scrollLeft = 0
    i > 1 ? scrollLeft = i * 93.75 : scrollLeft = 0
    this.data.flag = true
    this.setData({
      loadingFlag: true,
      currentIdx: i,
      scrollLeft: scrollLeft,
      scrollTop: 0,
      p: 1,
      height: this.data.windowHeight
    })
    this.noData1 = this.selectComponent("#noData"+ i)
    this.noData1.noDataTrue()
    this.noData.noDataTrue()
  },
  upper(e){ 
  },
  // swiper
  changeCurrent(e){
    let i = e.detail.current
    let scrollLeft = 0
    i > 1 ? scrollLeft = (i - 1) * 93.75 : scrollLeft = 0
    this.setData({
      loadingFlag: true,
      currentIdx: i,
      scrollLeft: scrollLeft,
      p: 1,
      height: this.data.windowHeight
    })
    this.data.flag = true
    this.noData1 = this.selectComponent("#noData" + i)
    this.noData1.noDataTrue()
    this.noData.noDataTrue()
    this.getData()
  },
  // 获取当前手机的高度
  bindHeight() {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.data.flag ? self.data.currentListData = [] : ''
        self.data.currentListData[self.data.p - 1] = self.data.currentData
        let windowHeight = res.windowHeight * (750 / res.windowWidth) - 88
        self.data.windowHeight = windowHeight-88
        let len = 0
        if (self.data.p > 1){
          for (var i = 0; i < self.data.p; i++){
            len += self.data.currentListData[i].length
          }
        }else{
          len = self.data.currentListData[0].length
        }
        len <= 3 ? self.data.height = self.data.windowHeight : self.data.height = 196 * len + 20
        self.data.titleList.map( (item,index) => {
          item.currentList = []
          if (index == self.data.currentIdx){
            item.currentList = self.data.currentListData
          }
        })
        if (self.data.height > windowHeight && self.data.num < 10) {
          self.data.loadingFlag = false
          self.load.change()
        } else {
          self.data.loadingFlag = true
        }
        self.setData({
          height: self.data.height,
          titleList: self.data.titleList,
          loadingFlag: self.data.loadingFlag
        })
      }
    })
  },
  // 点击列表
  articleDetails(e) {
    app.globalData.dataList = e.currentTarget.dataset.item
    wx.navigateTo({
      url: 'view/view?id='+ this.data.ids
    })
  },
  // 上拉加载
  onReachBottom() {
    if (this.data.num < 10) {
      this.load.change()
    }else{
      this.data.loadingType = false
      this.data.flag = false
      this.data.p += 1 
      this.getData()
    }
    setTimeout(() => {
      this.setData({
        loadingFlag: false
      })
    }, 100)
  },
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/recovery/recovery?id='+this.data.ids,
      success: res => {
        app.shareTip()
      }
    }
  },
  // 宽度
  createSelect(id) {
    let self = this
    wx.createSelectorQuery().select('#a'+ id).fields({
      size: true,
      scrollOffset: true,
      properties: ['scrollX', 'scrollY'],
    }, function (res) {
      self.setData({
        widthLine: res.width
      })
    }).exec()
  }
})