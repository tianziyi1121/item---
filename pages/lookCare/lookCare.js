const app = getApp()
const api = require("../../utils/api.js")
const common = require('../../utils/common.js')
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    currentList: [],// current data list 
    p: 1,// data page
    catId: '',// Category id
    num: 0,// data bulk 
    // loading
    flag: true,// load the judgment
    topFlag: false,// cancel the loading 
    loadingFlag: true,// loading animation
    type: null,
    // pop-up
    popUpSearch: false,
    popUpShadow: false,
    popUpContent: false,
    // title
    activeTitle: '',
    activeIndex: false,
    titleList: [],
    // 筛选
    price_id: '',// 价格id
    scat_id: '',// 三级分类id
    brand_id: '',// 品牌id
    selectList: [],
    selectMoney: [],
    pricelist: [],// 价格
    artificial: [],// 假肢
    selectIndex: 1,
    id: '',
    // image
    imageActive: '',
    // 判断
    proFlag: true
  },
  onLoad: function (options) {
    this.setData({
      height: common.windowHeight()
    })
    this.noData = this.selectComponent("#noData")
    this.data.type = options.type
    this.data.catId = options.type
    this.getCurrentList()
  },
  onReady() {
    this.load = this.selectComponent("#load")
  },
  // current data list && 
  getCurrentList() {
    api.requestServerData('/api/Product/product_list_rent', 'get', {
      p: this.data.p,
      scat_id: this.data.scat_id,
      is_rent: 1,
      price_id: this.data.price_id
    }, this.data.falg).then((res) => {
      let data = res.data.data
      if (res.data.status == 1) {
        let pn = this.data.p - 1
        let flag = true
        this.data.num = data.product_list.length
        // this.data.p != 1 && this.data.num < 10 ? this.load.change() : (this.data.p == 1 && this.data.num < 10 ? flag = true : '')
        if (this.data.topFlag) {
          this.setData({
            currentlist: [],
            ['currentlist[' + pn + ']']: data.product_list,
            loadingFlag: flag
          })
        } else {
          this.setData({
            ['currentlist[' + pn + ']']: data.product_list,
            loadingFlag: flag
          })
        }
        this.noData.noDataTrue()
      } else {
        this.data.num = 0
        if (this.data.p != 1) {
          this.load.change();
          this.noData.noDataTrue()
        } else {
          this.setData({
            currentlist: [],
            loadingFlag: true
          })
          this.noData.noData()
        }
      }
      this.data.bindscrolltoupperFlag = false
      if (this.data.p == 1 && this.data.proFlag) {
        this.data.pricelist = this.arrayJson(data.pricelist)
        data.cate_list.map(item => {
          item.cate_second = this.arrayJson(item.cate_second)
        })
        this.setData({
          titleList: data.cate_list,
          pricelist: this.data.pricelist
        })
        this.data.proFlag = false
      }
      if (this.data.topFlag) {
        app.postpone()
        this.data.topFlag = false
      }
      var query = wx.createSelectorQuery();
      query.select('.titleBox').boundingClientRect(rect => {
        this.setData({
          topHeight: rect.height * 2
        })
      }).exec();
    })
  },
  // bindTitle
  bindTitle(e) {
    let data = e.currentTarget.dataset
    // data = this.arrayJson(data)
    if (this.data.activeIndex == data.id && this.data.popUpSearch) {
      this.bindVanish()
    } else if (this.data.popUpSearch) {
      this.bindVanish1()
      if (data.id == 'a1') {
        this.weightData(1, data.id)
        return false
      }
      setTimeout(() => {
        this.setData({
          selectIndex: 1,
          selectList: this.data.titleList[data.index].cate_second
        })
        this.appear(data.id)
      }, 300)
    } else if (this.data.activeIndex == data.id && !this.data.popUpSearch) {
      this.appear(data.id)
    } else {
      if (data.id == 'a1') {
        this.weightData(2, data.id)
        return false
      }
      this.setData({
        selectIndex: 1,
        selectList: this.data.titleList[data.index].cate_second
      })
      this.appear(data.id)
    }
  },
  
  // Weight and price
  weightData(num, id) {
    let arrayData = []
    arrayData = this.data.pricelist
    if (num == 1) {
      setTimeout(() => {
        this.setData({
          selectIndex: 2,
          id: id,
          selectMoney: arrayData
        })
        this.appear(id)
      }, 300)
    } else {
      this.setData({
        selectIndex: 2,
        id: id,
        selectMoney: arrayData
      })
      this.appear(id)
    }
  },
  // appear
  appear(id) {
    this.setData({
      activeTitle: id,
      popUpSearch: true,
      popUpShadow: true,
      popUpContent: true,
      activeIndex: id,
    })
  },
  // vanish
  bindVanish() {
    this.setData({
      popUpShadow: false,
      popUpContent: false,
      activeTitle: false
    })
    setTimeout(() => {
      this.setData({
        popUpSearch: false,
      })
    }, 400)
  },
  bindVanish1(id) {
    this.setData({
      popUpContent: false,
      activeTitle: false
    })
  },
  //  bind select
  bindSelect(e) {
    let data = e.currentTarget.dataset
    if (data.indexs != 'a1'){
      this.data.titleList.map(item => {
        item.cate_second = this.arrayJson(item.cate_second)
      })
      this.data.selectList = this.getSearch(data.index, this.data.selectList)
      // this.data.artificial = this.getSearch(data.index, this.data.selectList)
      this.setData({
        selectList: this.data.selectList
      })
      this.data.scat_id = data.id
    } else {
      this.data.selectMoney = this.getSearch(data.index, this.data.pricelist)
      this.data.pricelist = this.getSearch(data.index, this.data.pricelist)
      this.setData({
        selectMoney: this.data.selectMoney
      })
      this.data.price_id = data.id
    }
    this.bindVanish()
    this.data.p = 1
    this.getCurrentList()
  },
  // data 
  getSearch(index,data){
    data = this.arrayJson(data)
    data[index].checked = true
    return data
  },
  // array json
  arrayJson(data) {
    data.map(item => { 
      item.checked = false
    })
    return data;
  },
  // input
  bindInput(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  // click on the data list
  bindList(e) {
    let id = e.currentTarget.dataset.id
    api.requestServerData('/api/product/product_cont', 'get', {
      uid: app.globalData.uid,
      product_id: id,
      token: app.globalData.token,
      p: 1
    }, false).then((res) => {
      app.globalData.productDetails = res
      wx.navigateTo({
        url: '../product/view/view/view?id=' + id + '&is_rent=1&type=1',
      })
    })
  },
  // pull to refresh
  onPullDownRefresh() {
    this.bindscrolltoupper()
  },
  // pull on loading
  bindBottom() {
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
      this.getCurrentList()
    }
  },
  bindscrolltoupper() {
    if (this.data.bindscrolltoupperFlag) {
      return false;
    }
    this.data.bindscrolltoupperFlag = true
    this.bindVanish()
    wx.startPullDownRefresh()
    wx.showNavigationBarLoading();
    this.data.topFlag = true
    this.data.p = 1
    this.data.flag = true
    this.data.price_id = ''
    this.data.scat_id = ''
    this.setData({
      loadingFlag: true,
      activeIndex: ''
    })
    this.data.titleList.map(item => {
      item.cate_second = this.arrayJson(item.cate_second)
    })
    this.data.pricelist = this.arrayJson(this.data.pricelist)
    this.getCurrentList();
  }
})