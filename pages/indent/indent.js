const app = getApp();
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
const common = require('../../utils/common.js')
Page({
  data: {
    url: '../../static/10.jpg',
    currentList: [],
    // 弹窗数据
    id: null,
    state: null,  //1、删除 2、确认收货
    index: null,
    number: null,
    title: null,
    // 下拉刷新
    topFlag: false,
    // 上拉加载
    loadingFlag: true,
    // 分页
    p: 1,
    // 请求一次接口得到的数量
    num: null,
    // 一页的数量
    pn: 10,
    delected: 1,
    flag: true,
    role_id: null,
    showFlag: true,
    service_id: null,
    member_list_id: null,
    uid: null,
    // pop-up
    receiptPopUp: false,
    receiptPopUpFlag: null
  },
  onLoad() {
    this.data.showFlag = false
    this.setData({
      role_id: app.globalData.uid
    })
    this.noData = this.selectComponent("#noData")
    this.getData()
  },
  onShow(){
    let type = wx.getStorageSync('authorization')
    if (this.data.showFlag || type == 1){
      this.data.flag = false
      this.getData()
      wx.removeStorageSync('authorization')
    }
    this.data.p = 1
    this.data.currentList = []
  },
  // 列表
  getData() {
    api.requestServerData('/api/member/my_orders','get',{
      uid: app.globalData.uid,
      token: app.globalData.token,
      p: this.data.p,
    },this.data.flag).then((res) => {
      let tostFlag = false
      let data = res.data.data
      if(res.data.status == 1) {
        this.data.num = data.list.length
        let pn = this.data.p - 1
        if (this.data.topFlag){
          this.setData({
            currentList: [],
            ['currentList[' + pn + ']']: data.list
          })
        }else{
          this.setData({
            ['currentList[' + pn + ']']: data.list
          })
        }
        if (this.data.num !== 0){
          this.noData.noDataTrue()
        } else if (this.data.num == 0 && this.data.p == 1){
          this.noData.noData()
        }
      }else{
        if(this.data.p == 1){
          this.setData({
            currentList: [],
            loadingFlag: true
          })
          this.noData.noData()
        }else{
          this.load.change();
          this.noData.noDataTrue()
        }
        this.data.num=0
      }
      if (this.data.topFlag) {
        app.postpone()
        this.data.topFlag = false
      }
      if (this.data.num > 3) {
        this.setData({
          loadingFlag: false,
        })
      }
      this.data.showFlag = true
    })
  },
  // 申请退款 
  bindApply: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'apply/apply?id='+ id
    })
  },
  // 评价
  bindEvaluate(e) {
    let data = e.currentTarget.dataset
    let pro_id = ''
    data.type == 1 ? pro_id = this.data.currentList[data.index][data.indexs].product[0].pro_id : (data.type == 2 ? pro_id = data.pro_id : '')
    data.type == 2 ? data.serviceid = '' : ''
    wx.navigateTo({
      url: 'view/view?id=' + data.id + "&type=" + data.type + "&pro_id=" + pro_id + "&service_id=" + data.serviceid
    })
  },
  // 
  bindList(e) {
    let data = e.currentTarget.dataset
    common.productInformation(data.id, app.globalData.uid, app.globalData.token).then(res => {
      app.globalData.productDetails = res
      wx.navigateTo({
        url: '../product/view/view/view?id=' + data.id + '&is_rent=' + data.isrent + '&type=2'
      }) 
    })
  },
  // 删除
  bindDelete(e) {
    let data = e.currentTarget.dataset
    this.data.id = data.id
    this.data.index = data.index
    this.data.number = data.number
    this.data.state = data.state
    let title=null
    this.data.state == 1 ? title = "确认删除" : (this.data.state == 2 ? title = "确认收货" : title = "确认租赁")
    this.setData({
      title: title
    })
    this.show.relation()
  },
  // 弹窗确认
  bindAffirm() {
    if(this.data.state == 1){
      this.deleteData()
    }else{
      this.confirmReceipt()
    }
  },
  // 弹窗取消
  bindCancel() {
    toolTip.noPhotoTip('操作已取消')
  },
  // 删除
  deleteData(){
    api.requestServerData('/api/member/order_del', 'get', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      id: this.data.id
    },false).then((res) => {
      if(res.data.status == 1) {
        toolTip.photoTip('订单已删除')
       this.data.currentList[this.data.index].splice(this.data.number,1)
        if (this.data.currentList.length == 1 && this.data.currentList[0].length == 0){
          this.noData.noData()
          this.data.loadingFlag = true
        }
        this.setData({
          currentList: this.data.currentList,
          loadingFlag: this.data.loadingFlag
        })
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 确认收货
  confirmReceipt(e) {
    // let id = e.currentTarget.dataset.id
    api.requestServerData('/api/member/receving_goods', 'get', {
      uid: app.globalData.uid,
      token: app.globalData.token,
      id: this.data.id
    }).then((res) => {
      if(res.data.status == 1){
        toolTip.noPhotoTip('订单已'+ this.data.title)
        this.getData()
        // this.setData({
        //   ["currentList[" + this.data.index + "][" + this.data.number + "].orderStatus"]: 4
        // })
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 待付款
  bindmoney(e) {
    let data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../subscribe/view/view?id=" + data.id + "&total=" + data.money + '&timer=' + data.timer
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
    this.data.currentList = []
    this.data.flag = true
    this.getData();
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
    this.data.flag = false
    if (flag) {
      this.data.p += 1
      this.getData()
    }
  },
  // receipt
  bindReceipt(e) {
    // this.getAffirm()
    // return false
 
    let data = e.currentTarget.dataset
    let url = ''
    if(data.type == 1){
      url = 'receipt/receipt'
    }else{
      url = 'logistics/logistics'
    }
    wx.navigateTo({
      url: url + '?id=' + data.id
    })
  },
  // 物品详情
  indentList(e) {
    let data = e.currentTarget.dataset
    // let type = data.type//1、护工；2、物品
    // let num = data.num
    wx.navigateTo({
      url: '../product/view/view/view?id=' + data.id
    })
  },
  preventTouchMove() {},
  // 确认
  bindAffirmData(){
    this.setData({
      receiptPopUpFlag: 2
    })
    setTimeout(() => {
      this.setData({
        receiptPopUpFlag: null,
        receiptPopUp: false
      })
    })
  },
  getAffirm() {
    this.setData({
      receiptPopUpFlag: 1,
      receiptPopUp: true
    })
  }
})
