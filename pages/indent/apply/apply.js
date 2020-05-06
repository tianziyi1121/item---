const app = getApp();
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    list: [
      {
        name: '零件不匹配',
        checked: true,
        val: 0
      },
      {
        name: '产品损坏',
        checked: false,
        val: 1
      },
      {
        name: '产品发错',
        checked: false,
        val: 2
      },
      {
        name: '其他',
        checked: false,
        val: 3
      }
    ],
    id: null,
    check: '护工有事',
    textArea: ''
  },
  onLoad: function (options) {
    this.data.id = options.id
  },
  // 提交
  bindRefund() {
    let content = this.data.check + '-' + this.data.textArea
    if (!this.data.textArea){
      toolTip.noPhotoTip("描述不能为空")
      return false
    }
    api.requestServerData('/api/Refund/index', 'get', {
      refund_reason: content,
      orderId: this.data.id,
      uid: app.globalData.uid,
      token: app.globalData.token
    }, true).then((res) => {
      if(res.data.status == 1){
        toolTip.noPhotoTip('申请成功，请耐心等待审核')
        setTimeout(() => {
          wx.switchTab({
            url: '../indent'
          })
        },1000)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 单选
  checkboxChange(e) {
    let len = e.detail.value
    let data = this.data.list
    data.map((item,index) => {
      if (len == index){
        data[index].checked = true
        this.data.check = data[index].name
      }else{
        data[index].checked = false
      }
    })
    this.setData({
      list: data
    })
  },
  // textarea
  bindtext(e) {
    this.data.textArea = e.detail.value
  }
})