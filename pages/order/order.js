const app = getApp()
const api = require("../../utils/api.js")
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    currentList: [],
    // 总价
    total: '',
    totalId: [],
    typeFlag: null,
    id: '',
    dataType: '',
    orderRemarks: '',
    is_rent: 0,
    date: '',
    startTime: '',// begin time
    service_begin_time: '',
    endTime: '',// end time
    service_end_time: '',
    time: '',// current time
    type: false,
    serviceName: '',// Service point name
    serviceAddress: '',// Service point address
    service_id: null,//  Service point id
    pro_sku_id: '',
    rentalTotal: 0,// total rental
    moneyFlag: null,
    totalData: '',
    dataNumber: 1,
    listType: ''
  },
  onLoad: function(options) {
    if (options.type == 1){
      this.data.typeFlag = false
      this.data.id = options.ids
    }else{
      this.data.typeFlag = true
    }
    options.type == 1 && options.is_rent == 1 ? this.data.moneyFlag = 1 : (options.type == 1 && options.is_rent == 0 ? this.data.moneyFlag = 2 : (options.type == 2 && options.is_rent == 0 ? this.data.moneyFlag = 3 : this.data.moneyFlag = null))

    options.pro_sku_id == undefined ? this.data.pro_sku_id = '' : this.data.pro_sku_id = options.pro_sku_id
    this.data.dataType = options.type
    let myDate = new Date();
    let day = myDate.getDate()
    if (day < 10){
      day = "0" + day
    }
    options.is_rent == 1 ? this.data.time = new Date(myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + day) / 1000 : this.data.time = 0
    this.setData({
      // listType: options.dataType,
      is_rent: options.is_rent,
      typeFlag: this.data.typeFlag,
      startTime: myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + day,
      service_begin_time: this.data.time,
    })
    this.getData(options.num, options.ids, options.type)
  },
  onShow() {
    if (this.data.type){
      this.setData({
        serviceName: app.globalData.serviceName,
        serviceAddress: app.globalData.serviceAddress
      })
      this.data.service_id = app.globalData.serviceId,
      this.data.type = false
    }
  },
  // 获取数据
  getData(num,ids,type) {
    api.requestServerData('/api/orders/order_confirm', "get", {
      num: num,
      ids: ids,
      type: type,
      uid: app.globalData.uid,
      token: app.globalData.token,
      pro_sku_id: this.data.pro_sku_id
    }, true).then((res) => {
      if(res.data.status == 1) {
        if(res.data.data.length > 0){
          this.setData({
            currentList: res.data.data
          })
          this.totalMoney()
        }else{
          toolTip.noPhotoTip('亲、暂无数据')
        }
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // minus
  orderMin(e) {
    let j = e.currentTarget.dataset.index
    if (this.data.currentList[j].pro_num == 1){
      toolTip.noPhotoTip('亲、至少购买一件哟')
      return false;
   }else{
      this.setData({
        ['currentList[' + j + '].pro_num']: Number(this.data.currentList[j].pro_num) - 1
      })
      this.totalMoney()
   }
  },
  // add
  orderAdd(e) {
    let j = e.currentTarget.dataset.index
    this.setData({
      ['currentList[' + j + '].pro_num']: Number(this.data.currentList[j].pro_num) + 1
    })
    this.totalMoney()
  },
  // 总价
  totalMoney: function(e) {
    var money = 0
    var arr = []
    this.data.currentList.map(item => {
      this.data.moneyFlag === 1 ? money = item.pro_rent_price * item.pro_num : (this.data.moneyFlag === 2 ? money = item.pro_price * item.pro_num : (this.data.moneyFlag === 3 ? money += item.carts_num * item.carts_product_price : ''))
      arr.push(item.id)
    })
    money = money.toFixed(2)
    this.setData({
      total: money,
      currentList: this.data.currentList,
      totalId: arr
    })
  },
  // 地址
  orderBind(e) {
    this.data.orderRemarks = e.detail.value
  },
  // lease time
  bindDateChange(e){
    let name = e.currentTarget.dataset.name
    if (name === 'endTime') {
      this.data.service_end_time = new Date(e.detail.value).getTime() / 1000
      if (this.data.service_end_time - this.data.time < 43200 ) {
        this.setData({
          service_end_time: ""
        })
        toolTip.noPhotoTip('亲，结束时间须大于开始时间')
        return false
      }
    } else {
      this.data.service_begin_time = new Date(e.detail.value).getTime() / 1000
      if (this.data.time > this.data.service_begin_time) {
        toolTip.noPhotoTip('亲，开始时间须大于当前时间')
        this.setData({
          service_begin_time: ""
        })
        return false
      }
    }
    this.data.service_end_time === '' ? this.data.rentalTotal = 0 : this.data.rentalTotal = Math.floor((this.data.service_end_time - this.data.service_begin_time) / 86400) * Number(this.data.currentList[0].pro_total_price)
    this.setData({
      [name]: e.detail.value,
      rentalTotal: this.data.rentalTotal.toFixed(2),
      total: (Number(this.data.total) + this.data.rentalTotal).toFixed(2)
    })
  },
  // service point
  bindChoose() {
    this.data.type = true
    wx:wx.navigateTo({
      url: '../product/view/view/view/view?type=1',
    })
  },
  // 提交订单
  bindOrder() {
    let ids = ''
    let num = ''
    let id = ''
    if (!this.data.typeFlag){
      id = this.data.id,
      num = this.data.currentList[0].pro_num
      ids = ''
    }else{
      this.data.currentList.map(item => {
        ids += item.carts_id + ","
        num += item.carts_num + ","
      })
      id = ''
      ids = ids.substring(0, ids.length - 1)
      num = num.substring(0, num.length - 1)
    }
    if (!this.data.orderRemarks){
      toolTip.noPhotoTip('备注不能为空')
      return false
    }
    if (this.data.is_rent == 1 && (!this.data.service_end_time || !this.data.service_begin_time)){
      toolTip.noPhotoTip('时间不能为空')
      return false
    }
    if (this.data.service_id == null || this.data.service_id == '') {
      toolTip.noPhotoTip('请您选择服务点')
      return false
    }
    let list = {
      type: this.data.dataType,
      uid: app.globalData.uid,
      token: app.globalData.token,
      num: num,
      orderType: 1,
      orderSrc: "wechat",
      ids: ids,
      id: id,
      orderRemarks: this.data.orderRemarks,
      is_rent: this.data.is_rent,
      service_end_time: this.data.service_end_time,
      service_begin_time: this.data.service_begin_time,
      service_id: this.data.service_id,
      pro_sku_id: this.data.pro_sku_id
    }
    if (this.data.dataNumber == 2) {
      toolTip.noPhotoTip('订单已提交，请稍等')
      return false
    }
    this.data.dataNumber = 2
    api.requestServerData('/api/orders/sub_order', 'get', list,false).then((res) => {
      if(res.data.status == 1){
        wx.navigateTo({
          url: '../subscribe/view/view?total=' + this.data.total + '&id=' + res.data.data.order_id + '&timer=' + res.data.data.createTime 
        })
      }else{
        this.data.dataNumber = 1
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  }
})