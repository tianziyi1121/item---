const app = getApp()
const api = require("../../utils/api.js")
const toolTip = require('../../utils/toolTip.js')
const common = require('../../utils/common.js')
Page({
  data: { 
    currentList: [],
    // 总价
    total: '',
    totalId: [],
    totalNum: [],
    // 编辑
    compile: 1,
    orderChecked: false,
    // 最少购买一件
    reduceFlag: false,
    // 上拉刷新
    loadflag: false,
    // 上拉加载
    loadingFlag: true,
    // 分页
    p: 1,
    // 请求一次接口得到的数量
    num: null,
    // 一页的数量
    pn: 10,
    // 删除
    arr: [],
    title: null,
    flag: true,
  },
  onLoad: function() {
    this.noData = this.selectComponent("#noData")
    this.load = this.selectComponent("#load")
    this.getData()
  },
  onShow() {
    let type = wx.getStorageSync('authorization')
    if (type == 1){
      this.getData()
      wx.removeStorageSync('authorization')
    }
  },
  // 获取数据列表
  getData() {
    api.requestServerData('/api/carts/index',"get",{
      uid: app.globalData.uid,
      token: app.globalData.token,
      page: this.data.p
    },this.data.flag).then((res) => {
      this.data.totalId = []
      let data = res.data.data
      if(res.data.status == 1){
        if (data.length > 0) {
          data.map(item => {
            item.checked = false
          })
          data[0].checked = true
          this.data.num = data.length
          this.data.totalId.push(data[0].carts_id)
          let pn = this.data.p - 1 
          this.data.currentList[pn] = []
          if (this.data.loadflag) {
            this.setData({
              currentList: [],
              total: (data[0].carts_product_price * data[0].carts_num).toFixed(2),
              ["currentList[" + pn + "]"]: data
            })
          }else{
            this.setData({
              total: (data[0].carts_product_price * data[0].carts_num).toFixed(2),
              ["currentList[" + pn + "]"]: data
            })
          }
          this.bindStatus()
        }
        this.noData.noDataTrue()
      } else {
        if (this.data.p == 1){
          this.setData({
            currentList: [],
            total: "0.00",
            loadingFlag: true
          })
          this.noData.noData()
        }else{
          this.noData.noDataTrue()
        }
      }
      if (this.data.loadflag){
        this.data.topFlag = false
        app.postpone()
      }
      if (this.data.num > 6){
        this.setData({
          loadingFlag: false
        })
        this.load.onChange()
      }
    })
  },
  // 编辑
  bindCompile(e) {
    let num = null
    if(e.currentTarget.dataset.id == 1){
      num = 0
    }else{
       num = 1
    }
    this.setData({
      compile: num
    })
  },
  // 点击列表 
  bindList(e) {
    let id = e.currentTarget.dataset.id
    common.productInformation(id, app.globalData.uid, app.globalData.token).then(res => {
      app.globalData.productDetails = res
      wx.navigateTo({
        url: '../product/view/view/view?id=' + id + '&is_rent=0&type=2'
      })
    })
  },
  // 点击选择
  shoppingList: function(e) {
    var i = e.currentTarget.dataset.indexs  // 外层索引
    var j = e.currentTarget.dataset.number  // 内层索引
    this.data.currentList[i][j].checked = !this.data.currentList[i][j].checked
    this.bindStatus()
    this.totalMoney()
  },
  // 点击减号
  shoppMin: function(e) {
    let i = e.currentTarget.dataset.indexs  // 外层索引
    let j = e.currentTarget.dataset.number  // 内层索引
    let dataList = this.data.currentList[i][j]
    var dataNum = dataList.carts_num
    if (dataList.carts_num > 1){
      dataNum = dataNum - 1
    } else if (dataList.carts_num == 1) {
      this.data.reduceFlag = true
      toolTip.noPhotoTip('亲、最少购买1件哦')
      return false
    }
    dataList.checked = true
    dataList.carts_num = dataNum
    this.getDatabase(dataList.carts_id, 'reduce').then(() => {
      this.setData({
        ["currentList[" + i + "][" + j + "]"]: dataList
      })
      this.bindStatus()
      this.totalMoney()
    })
  },
  // 点击加号
  shoppAdd: function(e) {
    let i = e.currentTarget.dataset.indexs  // 外层索引
    let j = e.currentTarget.dataset.number  // 内层索引
    let dataList = this.data.currentList[i][j]
    dataList.checked = true
    dataList.carts_num += 1
    this.getDatabase(dataList.carts_id, 'add').then(() => {
      this.setData({
        ["currentList[" + i + "][" + j + "]"]: dataList
      })
      this.bindStatus()
      this.totalMoney()
    })
  },
  // 改变数量，调数据库
  getDatabase(id, type,data) {
    return new Promise((resolve,reject) => {
      api.requestServerData('/api/carts/change_carts_num', "post", {
        uid: app.globalData.uid,
        token: app.globalData.token,
        id: id,
        type: type
      }, false).then((res) => {
        if (res.data.status == 1 || (res.data.status == 3 && this.data.reduceFlag)){
          resolve()
        }
      })
    })
  },
  // 总价
  totalMoney: function() {
    var money = 0
    var arr = []
    let number = []
    this.data.currentList.map(item => {
      item.map( items => {
        if (items.checked == true) {
          money = money + items.carts_num * items.carts_product_price
          arr.push(items.carts_id)
          number.push(items.carts_num)
        }
      })
    })
    this.data.totalId = arr
    this.data.totalNum = number
    this.setData({
      total: money.toFixed(2),
    })
  },
  // 全选
  checkboxChange(e) {
    this.data.currentList.map(item => {
      item.map(items => {
        if (e.detail.value == 1) {
          items.checked = true
        }else{
          items.checked = false
        }
      })
    })
    this.setData({
      currentList: this.data.currentList
    })
    this.totalMoney()
  },
  // 去结算
  closeAccount: function() {
    var data = []
    app.globalData.shoppingList = []
    this.data.currentList.map(item => {
      if (item.checked == true) {
        app.globalData.shoppingList.push(item)
        data.push({
          id: item.id,
          num: item.num
        })
      }
    })
    if (this.data.totalId.length < 1){
      toolTip.photoTip('请选择商品', '../../static/fail.png')
      return false
    }
    if (this.data.compile == 1) {
      wx.navigateTo({
        url: '../order/order?ids=' + this.data.totalId.join(',') + '&num=' + this.data.totalNum +'&type=2&is_rent=0'
      })
    } else {
      this.deleteData()
    }
  },
  // 弹窗取消
  bindCancel() {
    toolTip.photoTip('操作已取消', '')
  },
  // 弹窗确认
  bindAffirm() {
    let dataIndex = this.data.currentList
    let totalIndex = this.data.totalId
    api.requestServerData('/api/carts/carts_del', "post", {
      id: totalIndex,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, false).then((res) => {
      if (res.data.status == 1) {
        toolTip.photoTip('删除成功', '')
        for (let i = 0; i < totalIndex.length; i++) {
          for (let j = 0; j < dataIndex.length; j++) {
            dataIndex[j].map((item, index) => {
              if (totalIndex[i] == item.carts_id) {
                dataIndex[j].splice(index, 1)
              }
            })
          }
        }
        this.totalMoney()
        if (dataIndex[0].length == 0) {
          this.noData.noData()
          this.data.orderChecked = false
          this.data.compile = 1
          this.data.loadingFlag = true
        }
        this.setData({
          noData: this.data.noData,
          loadingFlag: this.data.loadingFlag,
          orderChecked: this.data.orderChecked,
          compile: this.data.compile,
          currentList: dataIndex
        })
      }
    })
  },
  // 删除
  deleteData() {
    this.setData({
      title: '是否删除该物品？'
    })
    this.show.relation()
  },
  // 全选状态判断
  bindStatus() {
    let arr = []
    this.data.currentList.map(item => {
      item.map( items => {
        arr.push(items.checked)
      })
    })
    arr = Array.from(new Set(arr))
    if (arr.length > 1 || arr[0] == false || arr.length == 0) {
      this.data.orderChecked = false
    } else if (arr[0] == true) {
      this.data.orderChecked = true
    }
    this.setData({
      orderChecked: this.data.orderChecked
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.data.p = 1
    this.setData({
      loadingFlag: true
    })
    this.data.flag = true
    this.data.loadflag = true
    this.getData()
  },
  // 上拉加载
  onReady() {
    this.show = this.selectComponent("#show")
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
  preventTouchMove(){}
})