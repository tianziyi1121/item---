const app = getApp()
const api = require("../../../../utils/api.js")
const common = require('../../../../utils/common.js')
const toolTip = require('../../../../utils/toolTip.js')
Page({
  data: {
    // 轮播
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    // data
    id: '',// data id
    p: 1,
    currentData: {},// current data
    currentReview: [],// The current review
    collect: '../../../../static/collect.png',// collect image
    collectBlock: '../../../../static/collect_block.png',// collect image
    contact: false,// contact us
    title: "是否联系客服",// contact or tips
    // collect
    collect: '../../../../static/collect.png',
    collectBlack: '../../../../static/collect_block.png',
    collectHalf: '../../../../static/icon_star_on_half@2x.png',
    status: [0, 1, 2, 3, 4],
    collectData: 3.5,
    loadingFlag: true,
    // is_rent
    is_rent: '',
    animationData: {},
    // pop-up
    imageFlag: false,
    height: 0,
    imageList: [],
    heightFlag: true,
    type: null,
    flag: true,// Whether to display the load icon
    num: null,// data bulk
    specificationFlag: false,
    upWard: null,
    shoppinFlag: false,
    productAttributes: [],
    proAttrSku: [],
    total: null,
    number: 1, // shopping number
    pro_sku_id: '',
    proAttrSkuList: [],
    array: [],
    typeFlag: true,
    arr: [],
    currentArray: [],
    statusBtnFlag: false,// Button click status
    totalData: '',
    listType:  '',
    loginFlag: false,
    phoneFlag: 1,
    imageData: '',
    currentTime: '',
    timerType: null,
    timerData: 1
  },
  onLoad: function (options) {
    this.data.articleId = options.id
    if (options.flag == 2){
      this.getData(options.id, options.flag)
    }else{
      this.processingData(app.globalData.productDetails).then(res => {
        if (res == 1) {
          this.data.timerType = 1
          this.data.imageData1 = setTimeout(() => {
            this.data.timerData = 2
            this.setData({
              imageFlag: true
            })
          }, 500)
          this.data.currentTime1 = setTimeout(() => {
            this.data.timerType = 3
            this.setData({
              heightFlag: false
            })
          }, 5000)
        } else {
          this.setData({
            heightFlag: false
          })
        }
      })
    }
    this.setData({
      is_rent: options.is_rent,
      height: common.windowHeight()
    })
    this.data.type = options.type
    this.data.id = options.id
  },
  onReady() {
    this.show = this.selectComponent("#show")
    this.load = this.selectComponent("#load")
  },
  animation(){
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(0.2).translate(840, -1200).step()
    this.setData({
      animationData: animation.export()
    })
  },
  // get data
  getData(id,flag) {
    api.requestServerData('/api/product/product_cont', 'get', {
      product_id: id,
      p: this.data.p
    }, this.data.flag).then((res) => {
      this.processingData(res).then((res) => {
        if(flag == 2){
          this.data.timerType = 2
          this.data.imageData2 = setTimeout(() => {
            this.data.timerData = 2
            this.setData({
              imageFlag: true
            })
          }, 500)
          this.data.currentTime2 = setTimeout(() => {
            this.data.timerType = 3
            this.setData({
              heightFlag: false
            })
          }, 5000)
        }
      })
    })
  },
  // processing data
  processingData(res){
    return new Promise((resolve,reject) => {
      if (res.data.status == 1) {
        let pn = this.data.p - 1
        this.data.currentReview[pn] = []
        let data = res.data.data
        if (this.data.p == 1) {
          let array = []
          data.pro_attr_sku.map(item => {
            item.num = 0
          })
          wx.setStorageSync('setDataList', data)
          this.getDataPage()
          data.product_info.pro_content = common.imageStyle(data.product_info.pro_content)
          this.setData({
            proAttrSku: data.pro_attr_sku,
            currentData: data.product_info,
            total: data.product_info.pro_price,
            imageList: data.product_info.pro_allpic_other,
            ['currentReview[' + pn + ']']: data.comments_list
          })
          if (data.comments_list.length == 0 && this.data.p == 1){
            this.setData({
              loadingFlag: false
            })
            this.load = this.selectComponent("#load")
            this.load.change()
          }
          wx.setStorageSync('proAttrSkuList', data.pro_attr_sku)
          let flag = 1
          data.product_info.pro_allpic_other.length > 0 && this.data.p == 1 ? resolve(1) : resolve(2)
        }else{
          this.setData({
            ['currentReview[' + pn + ']']: data.comments_list
          })
        }
        this.data.num = res.data.data.comments_list.length
      } else {
        if (this.data.p != 1) {
          this.load.change(); 
        } else {
          this.setData({
            currentlist: [],
            currentReview: [],
            loadingFlag: true
          })
        }
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  getDataPage() {
    let data = wx.getStorageSync('setDataList').pro_attr_sku
    let list = wx.getStorageSync('setDataList').product_attributes
    data.map(itemData => {
      list.map(item => {
        item.values.map(items => {
          let array = []
          if (itemData.attr_sku.indexOf(items.id) != -1) {
            items.assembly = true
          } else {
            items.assembly ? items.assembly = true : items.assembly = false
          }
          items.checked = false
          items.num = 0
        })
      })
    })
    this.setData({
      productAttributes: list
    })
    if (this.data.typeFlag){
      wx.setStorageSync('productAttributesList', list)
      this.data.typeFlag = false
    }
  },
  // collect
  bindCollect(e){
    if (!app.globalData.uid || this.data.phoneFlag != 123){
      this.login()
      return false
    }
    let collect   = this.data.currentData.is_collection
    let title = "产品已收藏"
    if(collect == 0){
      collect = 1
    }else{
      collect = 0
      title = '已取消收藏'
    }
    api.requestServerData('/api/member/collection', 'post', {
      uid: app.globalData.uid,
      id: this.data.id,
      type: this.data.type,
      token: app.globalData.token
    }, false).then((res) => {
      if(res.data.status == 1){
        this.setData({
          ['currentData.is_collection']: collect
        })
        toolTip.noPhotoTip(title)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // user login
  login() {
    this.setData({
      loginFlag: true
    })
    this.loginView = this.selectComponent("#loginView")
    this.loginView.login()
  },
  onShow() {
    this.data.phoneFlag = wx.getStorageSync('phonecCode')
  },
  // login
  onBindLogin(e) {
    if (e.detail.type == 2 && app.globalData.uid == '') {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else if (e.detail.type == 2 && this.data.phoneFlag != 123){
      wx.setStorageSync('verify',1)
      wx.navigateTo({
        url: '/pages/index/code/code',
      })
    }
    app.globalData.accredit = 1
    this.setData({
      loginFlag: false,
    })
  },
  // add to shopping cart
  bindShopping() {
    if (this.data.productAttributes.length > 0){
      this.setData({
        specificationFlag: true,
        upWard: true
      })
      this.data.shoppinFlag = false
    }else{
      this.addShopping()
    }
  },
  // shopping cart
  bindShoppingCart(){
    wx.navigateTo({
      url: '../../../shopping/shopping',
    })
  },
  // contact us
  bindContact() {
    wx.navigateTo({
      url: 'news/news',
    })
    return false
    this.show.relation()
  },
  // confirm conctact us
  bindAffirm() {
    wx.makePhoneCall({
      phoneNumber: this.data.currentData.pro_tel
    })
  },
  // cancel contact us
  bindCancel() {
    toolTip.noPhotoTip('操作已取消')
  },
  // 点击缩小的图
  bindImage(e) {
    let name = e.currentTarget.dataset.name
    let height = e.detail.height
    let width = e.detail.width
    this.setData({
      [name]: (300 * height) / width
    })
  },
  bindBox() {
    this.setData({
      heightFlag: true,
      imageFlag: false
    })
    setTimeout(() => {
      this.setData({
        imageFlag: true
      })
    }, 200)
    setTimeout(() => {
      this.setData({
        heightFlag: false
      })
    }, 5000)
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
      this.getData(this.data.id)
    }
  },
  // 立即购买
  bindOnce(e) {
    this.data.listType = e.currentTarget.dataset.type
    if (this.data.productAttributes.length > 0){
      this.setData({
        specificationFlag: true,
        upWard: true
      })
      this.data.shoppinFlag = true
    }else{
      if (!app.globalData.uid || this.data.phoneFlag != 123) {
        this.login()
        return false
      }
      wx.navigateTo({
        url: "../../../order/order?ids=" + this.data.id + "&type=1&num=" + this.data.number + "&is_rent=" + this.data.is_rent + "&pro_sku_id=" + this.data.pro_sku_id + "&total" + this.data.total + "&dataType=" + e.currentTarget.dataset.type
      })
    }
  },
  // Click on the category
  bindCategory(e){
    let data = e.currentTarget.dataset
    let setData = this.data
    let i = data.index
    let j = data.indexs
    let checked = data.checked
    let id = data.id
    let array = []
    let typeFlag = true
    let a = null
    let b = null
    let lfProductAttributes = wx.getStorageSync('productAttributesList')
    if (data.assembly){
      if(setData.array.indexOf(id) != -1){
        setData.array[i] = ''
        typeFlag = false
        id = ''
      }else{
        setData.array[i] = id
        typeFlag = true
      }
      // id !== '' ? currentArray.push(id)
      let num = 0
      setData.array.map(item => {
        item !== '' ? array.push(item) : ''
      })
      num = array.length
      if (num > 0){
        setData.proAttrSkuList = wx.getStorageSync('proAttrSkuList')
        array.forEach(item => {
          setData.proAttrSkuList.forEach((items, index) => {
            items.attr_sku.indexOf(item) != -1 ? setData.arr.push(items) : ''
            if(index + 1 === setData.proAttrSkuList.length){
              setData.proAttrSkuList = setData.arr
              setData.arr = []
            }
          })
        })
        if(num === setData.productAttributes.length){
          setData.pro_sku_id = setData.proAttrSkuList[0].id
          // let money = Number(setData.proAttrSkuList[0].sku_price) + Number(this.data.currentData.pro_price)
          this.setData({
            total: setData.proAttrSkuList[0].sku_price
          })
          setData.totalData = setData.proAttrSkuList[0].sku_price
          this.bindAdd(1)
          setData.statusBtnFlag = true
        }else{
          setData.statusBtnFlag = false
        }
        if(id != ''){
          setData.productAttributes[i].values.map((item, index) => {
            index === j ? item.checked = true : item.checked = false
          })
        } else {
          if(num === 1){
            wx.getStorageSync('productAttributesList').map((item, index) => {
              item.values.map((items, indexs) => {
                if (array[0] === items.id) {
                  a = index
                  b = indexs
                }
              })
            })
            let data = wx.getStorageSync('productAttributesList')[a]
            data.values[b].checked = true
            setData.productAttributes = data
          }else{

          }
        }
        let productAttributesList = setData.productAttributes[i]
        lfProductAttributes.map((item, index) => {
          item.values.map(items => {
            setData.proAttrSkuList.map(data => {
              if (data.attr_sku.indexOf(items.id) != -1) {
                items.assembly = true
                items.num = id
              } else {
                items.num === id ? items.assembly = true : items.assembly = false
              }
            })
          })
        })
        array.map(item => {
          lfProductAttributes.map(items => {
            items.values.forEach(data => {
              if (item === data.id){
                data.checked = true
                data.number = id
              }else{
                data.number === id && data.checked ? data.checked = true : data.checked = false
              }
            })
          })
        })
        id != '' ? lfProductAttributes[i] = productAttributesList : lfProductAttributes[a] = setData.productAttributes
        this.setData({
          productAttributes: lfProductAttributes,
          statusBtnFlag: setData.statusBtnFlag
        })
      }else{
        this.setData({
          statusBtnFlag: false
        })
        this.getDataPage()
      }
    }
  },
  preventTouchMove(){},

  // close Windows
  bindPopUp(){
    this.setData({
      specificationFlag: false,
      upWard: false
    })
  },
  // Reducing the number of
  bindmin(){
    if (this.data.number > 1) {
      this.data.number -= 1
    }else{
      toolTip.noPhotoTip('亲、最少购买一件哟')
      return false;
    }
    this.data.productAttributes.length > 0 ? this.data.total = Number(this.data.totalData) * this.data.number : this.data.total = Number(this.data.currentData.pro_price) * this.data.number
    // this.data.total = Number(this.data.currentData.pro_price)*this.data.number
    this.setData({
      number: this.data.number,
      total: this.data.total.toFixed(2)
    })
  },
  // Add the number
  bindAdd(index) {
    index !== 1 ? this.data.number += 1 : ''
    // this.data.number += 1
    this.data.productAttributes.length > 0 ? this.data.total = Number(this.data.totalData) * this.data.number : this.data.total = Number(this.data.currentData.pro_price) * this.data.number
    this.setData({
      number: this.data.number,
      total: this.data.total.toFixed(2)
    })
  },
  catchBtn() {
    if (!this.data.statusBtnFlag && this.data.productAttributes.length !== 0){
      toolTip.noPhotoTip('请选择物品属性')
      return false;
    } 
    this.setData({
      specificationFlag: false,
      upWard: false
    })
    if (!app.globalData.uid || this.data.phoneFlag != 123) {
      this.login()
      return false
    }
    if (this.data.shoppinFlag){
      wx.navigateTo({
        url: "../../../order/order?ids=" + this.data.id + "&type=1&num=" + this.data.number + "&is_rent=" + this.data.is_rent + "&pro_sku_id=" + this.data.pro_sku_id + "&dataType=" + this.data.listType
      })
    }else{
      this.addShopping()
    }
  },
  // add shopping cat
  addShopping() {
    if (!app.globalData.uid || this.data.phoneFlag != 123) {
      this.login()
      return false
    }
    this.data.productAttributes.length > 0 ? this.data.total = this.data.totalData : ''
    api.requestServerData('/api/carts/add_carts', 'get', {
      uid: app.globalData.uid,
      id: this.data.id,
      type: 1,
      token: app.globalData.token,
      num: this.data.number,
      product_price: this.data.total,
      pro_sku_id: this.data.pro_sku_id,
    }, false).then((res) => {
      if (res.data.status == 1) {
        toolTip.noPhotoTip('产品已加入购物车')
      } else {
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  imageListData(e) {
    let data = e.currentTarget.dataset;
    if (this.data.currentData.pro_allpic.length == 0) return;
    wx.previewImage({
      current: this.data.currentData.pro_allpic[data.index], 
      urls: this.data.currentData.pro_allpic 
    });
  },
  // clear TimeOut
  onUnload() {
  },
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/product/view/view/view?is_rent=' + this.data.is_rent + '&type=' + this.data.type + '&id=' + this.data.id+'&flag=2',
      success: res => {
        app.shareTip()
      }
    }
  },
  handleContact() {
    api.requestServerData('/api/Chat/getWechatConfig', 'get', '', '').then((res) => {
      let data = res.data.data
      if (res.data.status == 1) {
        this.getUser(data.id, data.key)
      }
    })
  },
  getUser(id, key) {
    api.requestServerData('/v1/weixin/tenants/76909/xcx/accesstoken', 'get', {
      grant_type: 'client_credential',
      appid: id,
      secret: key
    }, '', 1).then((res) => {
      
    })
  }
})