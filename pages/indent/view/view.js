// pages/indent/view/view.js
const app = getApp();
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    starUrl: '../../../static/collect_block.png',
    halfUrl: '../../../static/icon_star_on_half@2x.png',
    greyUrl: '../../../static/collect.png',
    state: [0,1,2,3,4],
    // 当前数据  
    currentList: [],// product label
    currentData: [],// sevice label
    header: '',
    service_logo: '',
    // 提交参数
    form :{
      uid: null,
      token: null,
      orderId: null,
      pro_id: null,
      service_id: null,
      c_tags_id_product: '',// product label 
      c_content_product: '',// Product review content
      c_star_rank_product: '',// The star product
      c_tags_id_service: '',// service label
      c_content_service: '',// service review content
      c_star_rank_service: '',// The star service
      c_is_showname: 1,// 匿名
    }, 
    // 参数
    url: null,
    type: null,// 2、product；3、service;1、merge
  },
  onLoad: function (options) {
    console.log(options)
    let data = this.data.form
    data.orderId = options.id
    data.uid = app.globalData.uid
    data.token = app.globalData.token
    options.pro_id == 'undefined' ? options.pro_id = '' : ''
    data.pro_id = options.pro_id
    options.service_id == 'undefined' ? options.service_id = '' : ''
    data.service_id = options.service_id
    this.setData({
      type: options.type
    })
    this.getData(data.uid, data.token, data.orderId, options.pro_id)
  },
  // 获取数据
  getData(uid, token, id, pro_id) {
    api.requestServerData('/api/member/order_comments','get',{
      uid: uid,
      token: token,
      orderId: id,
      pro_id: pro_id
    }).then((res) => {
      if(res.data.status == 1){
        this.setData({
          currentList: res.data.data.tags_list,
          header: res.data.data.pro_pic,
          service_logo: res.data.data.service_logo,
          currentData: res.data.data.tags_list_service
        })
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 点击right
  bindRight(e) {
    let key = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    this.setData({
      ['form.' + name]: key
    })
  },
  // 匿名
  checkboxChange(e) {
    let id
    if (e.detail.value.length < 1) {
      id = 0
    }else{
      id = 1
    }
    this.setData({
      ['form.c_is_showname']: id
    })
  },
  // 态度
  bindstate(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    if(type == 1){
      let data = this.data.currentData[index].tags_sort
      this.labelData(data, type, index)
    }else{
      let list = this.data.currentList[index].tags_sort
      this.labelData(list, type, index)
    }
  },
  // label data
  labelData(num, type, index){
    if (num == 0) {
      num = 1
    } else {
      num = 0
    }
    if(type == 1){
      this.setData({
        ['currentData[' + index + '].tags_sort']: num
      })
    }else{
      this.setData({
        ['currentList[' + index + '].tags_sort']: num
      })
    }
  },
  // textarea
  bindTextarea(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      ['form.'+name]: e.detail.value
    })
  },
  // 提交
  bindsubmint() {
    let data = this.data.form
    data.c_tags_id_service = ''
    data.c_tags_id_product = ''
    
    this.data.currentList.map(item => {
      if (item.tags_sort == 1){
        data.c_tags_id_product = item.tags_id + ',' + data.c_tags_id_product
      }
    })
    this.data.currentData.map(item => {
      if (item.tags_sort == 1) {
        data.c_tags_id_service = item.tags_id + ',' + data.c_tags_id_service
      }
    })
    data.c_tags_id_product = data.c_tags_id_product.substring(0, data.c_tags_id_product.length - 1)
    data.c_tags_id_service = data.c_tags_id_service.substring(0, data.c_tags_id_service.length - 1)
    if(this.data.type == 2){
      if (!data.c_tags_id_product || !data.c_content_product || !data.c_star_rank_product ){
        toolTip.noPhotoTip('数据不能为空')
        return false
      }
    } else if (this.data.type == 3){
      if (!data.c_tags_id_service || !data.c_content_service || !data.c_star_rank_service) {
        toolTip.noPhotoTip('数据不能为空')
        return false
      }
    } else {
      for (var key in data) {
        if(!data[key]){
          toolTip.noPhotoTip('数据不能为空')
          return false
        }
      }
    }
    api.requestServerData('/api/member/add_comments', 'get', this.data.form).then((res) => {
      if (res.data.status == 1) {
        toolTip.noPhotoTip(res.data.msg)
        setTimeout(() => {
          wx.switchTab({
            url: '../indent'
          })
        },1000)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  }
})