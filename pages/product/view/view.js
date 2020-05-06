const app = getApp()
const api = require("../../../utils/api.js")
const common = require('../../../utils/common.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    currentList:[],// current data list
    p: 1,// data page
    cat_id: '',// Category id
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
    weight_id: '',// 重量id
    tcat_id: '',// 三级分类id
    brand_id: '',// 品牌
    pro_is_recommend: '',// 推荐
    selectList: [],
    selectMoney: [],
    selectIndex: 1,
    id: '',
    // image
    imageActive: '',
    // 判断
    selecDataName: '',
    selectDataIndex: 0,
    selectDataCatId: '',
    proFlag: true
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      height: common.windowHeight(),
      type: options.type
    })
    this.noData = this.selectComponent("#noData")
    this.data.type = options.type
    this.data.cat_id = options.type
    this.data.catId = options.type
    this.getCurrentList()
  }, 
  onReady(){
    this.load = this.selectComponent("#load")
  },
  // current data list && 
  getCurrentList() {
    api.requestServerData('/api/Product/product_list_new', 'get', {
      p: this.data.p,
      cat_id: this.data.cat_id,
      is_rent: 0,
      weight_id: this.data.weight_id,
      price_id: this.data.price_id,
      tcat_id: this.data.tcat_id,
      brand_id: this.data.brand_id,
      pro_is_recommend: this.data.pro_is_recommend
    }, this.data.falg).then((res) => {
      let data = res.data.data
      if(res.data.status == 1) {
        let pn = this.data.p - 1
        let flag = false
        this.data.num = data.product_list.length
        this.data.p != 1 && this.data.num < 10 ? this.load.change() : (this.data.p == 1 && this.data.num < 10 ? flag = true : '')
        if (this.data.topFlag){
          this.setData({
            currentlist: [],
            ['currentlist[' + pn + ']']: data.product_list,
            loadingFlag: flag
          })
        }else{
          this.setData({
            ['currentlist[' + pn + ']']: data.product_list,
            loadingFlag: flag
          })
        }
        this.noData.noDataTrue() 
      }else{ 
        this.data.num = 0
        if(this.data.p != 1) {
          this.load.change();
          this.noData.noDataTrue()
        }else{
          this.setData({
            currentlist: [],
            loadingFlag: true
          })
          this.noData.noData()
        }
      }
      this.data.bindscrolltoupperFlag = false
      if (this.data.p == 1 && this.data.proFlag){
        data.weightlist = this.arrayJson(data.weightlist)
        data.pricelist = this.arrayJson(data.pricelist)
        this.setData({
          titleList: data.scatelist,
          weightlist: data.weightlist,
          pricelist: data.pricelist,
          brandList: this.data.type == 3 ? data.brand_list : []
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
  // Recommend
  bindRecommend(e) {
    if (this.data.popUpSearch){
      this.bindVanish()
    }
    this.setData({
      activeIndex: 'a3'
    })
    this.data.pro_is_recommend = 1
    this.getCurrentList()
  },
 // bindTitle
  bindTitle(e) {
    let id = e.currentTarget.dataset.id
    if (this.data.activeIndex == id && this.data.popUpSearch) {
      this.bindVanish()
    } else if (this.data.popUpSearch) {
      this.bindVanish1()
      if (id == 'a1' || id == 'a2' || id == 'a3') {
        this.weightData(1,id)
        return false
      }
      this.getData(id).then(res => {
        setTimeout(() => {
          this.setData({
            selectIndex: 1,
            selectList: res
          })
          this.appear(id)
        }, 300)
      })
    } else if (this.data.activeIndex == id && !this.data.popUpSearch) {
      this.appear(id)
    }else{
      if(id == 'a1' || id == 'a2' || id == 'a3'){
        this.weightData(2,id)
        return false
      }
      this.getData(id).then(res => {
        this.setData({
          selectIndex: 1,
          selectList: res
        })
        this.appear(id)
      })
    }
  },
  // Weight and price
  weightData(num,id) {
    let arrayData = []
    let flag = 2
    if (id == 'a1'){
      arrayData = this.data.weightlist
    } else if (id == 'a2'){
      arrayData = this.data.pricelist
    }else{
      flag = 3
      arrayData = this.data.brandList
    }
    if(num == 1) {
      setTimeout(() => {
        this.setData({
          id: id,
          selectIndex: flag,
          selectMoney: arrayData
        })
        this.appear(id)
      }, 300)
    }else{
      this.setData({
        id: id,
        selectIndex: flag,
        selectMoney: arrayData
      })
      this.appear(id)
    }
  },
  // appear
  appear(id){
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
  bindVanish1(id){
    this.setData({
      popUpContent: false,
      activeTitle: false
    })
  },
  //  bind select
  bindSelect(e) {
    let data = e.currentTarget.dataset
    if (this.data.selectIndex == 1){
      this.data.selectList = this.arrayJson(this.data.selectList)
      this.data.selectList[data.index].checked = true
      this.setData({
        selectList: this.data.selectList
      })
      this.data.tcat_id = data.id
      this.data.selecDataName = data.name
      this.data.selectDataIndex = data.index
      this.data.selectDataCatId = data.id
    }else{
      if (data.indexs == 'a1') {
        this.data.weightlist = this.arrayJson(this.data.weightlist)
        this.data.weightlist[data.index].checked = true
        this.data.selectMoney = this.data.weightlist
        this.data.weight_id = data.id
      } else if (data.indexs == 'a2'){
        this.data.pricelist = this.arrayJson(this.data.pricelist)
        this.data.pricelist[data.index].checked = true
        this.data.selectMoney = this.data.pricelist
        this.data.price_id = data.id
      }else{
        this.data.brandList = this.arrayJson(this.data.brandList)
        this.data.brandList[data.index].checked = true
        this.data.selectMoney = this.data.brandList
        this.data.brand_id = data.id
      }
      this.setData({
        selectMoney: this.data.selectMoney
      })
    }
    this.bindVanish()
    this.data.p = 1
    this.data.topFlag = true
    this.getCurrentList()
  },
  // array json
  arrayJson(data) {
    data.map(item => {
      item.checked = false
    })
    return data;
  },
  // 筛选条件
  getData(id){
    return new Promise((resolve,reject) => {
      api.requestServerData('/api/Product/get_tcatelist', 'get', {
        scat_id: id,
        is_rent: 0
      }, false).then((res) => {
        let data = res.data.data
        if (res.data.status == 1){
          data = this.arrayJson(data)
          data.length > this.data.selectDataIndex ? (this.data.selecDataName != ''  && data[this.data.selectDataIndex].cat_name == this.data.selecDataName && data[this.data.selectDataIndex].cat_id == this.data.selectDataCatId ? data[this.data.selectDataIndex].checked = true : '') : ''
          resolve(data)
        } else {
          toolTip.noPhotoTip(res.data.msg)
        }
      })
    })
  },
  // input
  bindInput(e){
    let name = e.currentTarget.dataset.name
    this.setData({
      [name]: e.detail.value
    })
  },
  // click on the data list
  bindList(e) { 
    let id = e.currentTarget.dataset.id
    api.requestServerData('/api/product/product_cont', 'get', {
      // uid: app.globalData.uid,
      product_id: id,
      // token: app.globalData.token,
      p: 1
    }, false).then((res) => {
      app.globalData.productDetails = res
      wx.navigateTo({
        url: 'view/view?id=' + id + '&is_rent=0&type=2',
      })
    })
  },
  // pull to refresh
  onPullDownRefresh() {
    this.scrolltoupper()
  },
  scrolltoupper: function(e){
    if (this.data.bindscrolltoupperFlag) {
      return false;
    }
    let flag = true
    this.data.bindscrolltoupperFlag = true
    this.bindVanish()
    wx.startPullDownRefresh()
    wx.showNavigationBarLoading();
    this.data.p = 1
    this.data.flag = true
    this.data.tcat_id = ''
    this.data.price_id = ''
    this.data.brand_id = ''
    this.data.weight_id = ''
    this.data.topFlag = true
    this.data.selecDataName = ''
    this.data.selectDataIndex = ''
    this.data.selectDataCatId = ''
    this.data.pro_is_recommend = ''
    this.data.cat_id = this.data.type
    this.data.loadingFlag.length 
    this.setData({
      loadingFlag: true,
      activeIndex: ''
    })
    this.data.pricelist = this.arrayJson(this.data.pricelist)
    this.getCurrentList();
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
  }
})