const app = getApp()
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    title: {},
    list: {},
    starUrl: '../../static/collect_block.png',
    halfUrl: '../../static/icon_star_on_half@2x.png',
    greyUrl: '../../static/collect.png',
    state: [0,1,2,3,4],
    end: '',
    start: '',
    sky: 0,
    // 左侧
    leftScrollTop: 0,
    // 商品栏
    toView: 'a0',
    scrollTop: 0,
    activeIndex: 0,
    listData: [],
    height: '',
    // 商品总价
    totalGoods: '',
    // 总价
    total: 0.00,
    // 购物车数据
    selectedList: [],
    // 购物车数量显示
    num: 0,
    // 弹窗动画
    domeMode: true,
    // 参数
    endstate: '',
    stateend: '',
    // 付款判断
    endData: null,
    totalData_ls: null
  },
  onLoad: function (options) {
    let self = this
    this.bindHeight()
    let id = app.globalData.id
    this.getData(id).then((res) => {
      let data = res.data.data
      if (res.data.status == 1){
        data.nursing_info.nursing_star_percent = (data.nursing_info.nursing_star_percent * 5).toFixed(1)
        this.setData({
          listData: data.cate_info,
          title: data.member_info,
          list: data.nursing_info
        })
        this.getList()
      }else{
        toolTip.photoTip('数据获取失败', '../../static/fail.png')
      }
    })
  },
  onShow(){
    let value = null
    let status = wx.getStorageSync('ls_optionsStatus')
    if (status == 1) {
      value = wx.getStorageSync('timer')
      this.setData({
        start: value[0].data.split('-')[1] + '月' + value[0].data.split('-')[2] + '日',
        stateend: value[0].getTime,
        startTime: value[0].data,
        end: value[1].data.split('-')[1] + '月' + value[1].data.split('-')[2] + '日',
        endTime: value[1].data,
        endstate: value[1].getTime,
        sky: value[1].chaDay,
        totalData_ls: (value[1].chaDay * this.data.list.nursing_workers_money).toFixed(2)
      })
      wx.removeStorageSync('ls_optionsStatus')
      this.totalMoney()
    }else{
      this.data.endData = this.getNowFormatDate()
      this.setData({
        end: this.getNowFormatDate(),
        start: this.getNowFormatDate(),
        sky: 0
      })
    }
    
  },

  // 获取数据
  getData(id) {
    return new Promise((resolve,reject) => {
      api.requestServerData('/api/member/confirm_yuyue', 'get', {
        id: id,
        uid: app.globalData.uid,
        token: app.globalData.token
      }, true).then((res) => {
        resolve(res)
      })
    })
  },
  // 时间
  bindTime() {
    wx.navigateTo({
      url: '../timer/timer'
    })
  },
  // 获取当前时间
  getNowFormatDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }
    this.setData({
      endTime: month + '/' + strDate,
      startTime: month + '/' + strDate
    })
    var currentdate = month + '月' + strDate + '日';
    return currentdate;
  },
  // 点击scroll-view 监听滚动 完成右到左的联动
  scroll(e) {
    let index = 0
    var dis = e.detail.scrollTop
    for (let i = 0; i < this.data.scrollArr.length; i++) {
      if (i < this.data.scrollArr.length - 1) {
        if (dis == 0){
          this.setData({
            activeIndex: 0,
          })
          break
        }else if (dis > this.data.scrollArr[i] && dis < this.data.scrollArr[i + 1]) {
          let flag = true
          for (var j = i; j < this.data.listData.length; j++){
            if (flag && this.data.listData[j].product.length > 0){
              flag = false
              i = j
            }
          }
          if (wx.getStorageSync('ll_activeIndex')) {
            index = wx.getStorageSync('ll_activeIndex')
            wx.removeStorageSync('ll_activeIndex')
          } else {
            index = i
          }
          this.setData({
            activeIndex: index,
          })
          break;
        }
      } else {
        this.setData({
          activeIndex: this.data.scrollArr.length - 1,
        })
      }
    }
    this.data.activeIndex > 0 ? this.data.leftScrollTop = 48 * this.data.activeIndex : this.data.leftScrollTop = 0
    this.setData({
      leftScrollTop: this.data.leftScrollTop
    })
  },
  // 列表数据
  getList() {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    wx.showLoading()
    let offsetS = 80
    //兼容iphoe5滚动
    if (sysinfo < 550) {
      offsetS = -40
    }
    //兼容iphoe Plus滚动
    if (sysinfo > 650 && sysinfo < 700) {
      offsetS = 240
    }
    let scrollArr = [0]
    let indexFlag = true
    for (let i = 0; i < this.data.listData.length; i++) {
      scrollArr.push(scrollArr[i] + 92 * this.data.listData[i].product.length + 22)
      if (indexFlag && this.data.listData[i].product.length > 0){
        indexFlag = false
        this.data.activeIndex = i
      }
    }
    that.setData({
      scrollArr: scrollArr,
      listData: this.data.listData,
      loading: true,
      scrollH: sysinfo * 2 - offsetS,
      activeIndex: this.data.activeIndex
    })
    wx.hideLoading();
  },
  // 获取当前手机的高度
  bindHeight(){
    var that = this; 
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth))
        that.setData({
          height: windowHeight - 684
        })
      }
    })
  },
  // 点击侧边栏
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
    })
    wx.setStorageSync('ll_activeIndex', index)
  },
  // 去付款
  bindPay(id, timer) {
    if (this.data.sky == 0){
      toolTip.photoTip('请选择预约时间', '../../static/fail.png')
      return false;
    }
    wx.removeStorageSync('timer')
    wx.navigateTo({
      url: 'view/view?id=' + id +'&timer='+ timer
    })

  },
  // 列表添加商品 加号
  catchAdd(e){
    let i = e.currentTarget.dataset.index
    let j = e.currentTarget.dataset.number
    let id = this.data.listData[i].product[j].pro_id
    let items = this.data.listData[i].product[j]
    this.data.listData[i].product[j].num += 1
    this.setData({
      ['listData[' + i + '].product[' + j + '].num']: this.data.listData[i].product[j].num
    })
    this.totalMoney()
  },
  // 列表添加商品 减号
  catchMin(e) {
    let i = e.currentTarget.dataset.index
    let j = e.currentTarget.dataset.number
    let id = this.data.listData[i].product[j].id
    let items = this.data.listData[i].product[j]
    this.data.listData[i].product[j].num -= 1
    this.setData({
      ['listData[' + i + '].product[' + j + '].num']: this.data.listData[i].product[j].num
    })
    this.totalMoney()
  },
  // 总价
  totalMoney(){
    this.data.selectedList = []
    if (this.data.listData[0].product != []){
      for (var a = 0; a < this.data.listData.length; a++) {
        for (var b = 0; b < this.data.listData[a].product.length; b++) {
          if (this.data.listData[a].product[b].num > 0) {
            this.data.selectedList.push(this.data.listData[a].product[b])
          }
        }
      }
    }
    let money = 0
    this.data.selectedList.map(item => {
      money = money + item.num * item.pro_price
    })
    this.setData({
      total: (money + (this.data.list.nursing_workers_money * this.data.sky)).toFixed(2),
      totalGoods: money.toFixed(2),
      num: this.data.selectedList == [] ? 0 : this.data.selectedList.length,
      selectedList: this.data.selectedList
    })
  },
  // 弹窗动画
  bindShopping() {
    this.setData({
      domeMode: false
    })
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.animation = animation
    setTimeout( () => {
      this.fadeIn()
    },100)
  },
  // 出现动画
  fadeIn() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 消失动画
  hideModal() {
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    this.fadeDown()
    setTimeout(() => {
      this.setData({
        domeMode: true
      })
    },200)
  },
  fadeDown() {
    this.animation.translateY(800).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 去支付
  bindPayment(e) {
    let ids = ''
    let num = ''
    if(e.currentTarget.dataset.id == 1){
      this.hideModal()
    }
    if (this.data.selectedList.length != 0){
      this.data.selectedList.map(item => {
        ids += item.pro_id +','
        num += item.num + ','
      })
    }else{
      ids += ''
      num += ''
    }
    if (this.data.endData == this.data.end){
      toolTip.photoTip('请选择正确时间', '../../static/fail.png')
      return false
    }
    api.requestServerData('/api/orders/sub_order', 'get', {
      ids: ids,
      num: num,
      nursing_workers_id: this.data.list.nursing_workers_id,
      service_begin_time: this.data.stateend/1000,
      service_end_time: this.data.endstate/1000,
      uid: app.globalData.uid,
      token: app.globalData.token,
      orderType: 1,
      type: 1,
      orderRemarks: '',
      orderSrc: 'wechat',
      trade_type: 'JSAPI'
    }, true).then((res) => {
      if(res.data.status == 1){
        let data = res.data.data
        this.bindPay(data.order_id, data.createTime)
      }else{
        toolTip.photoTip('订单提交失败', '../../static/fail.png')
      }
    })
  },
  // 注销
  onHide() {
    wx.removeStorageSync('ls_activeIndex')
  }
})