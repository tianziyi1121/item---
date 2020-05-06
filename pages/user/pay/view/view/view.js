const app = getApp()
const api = require('../../../../../utils/api.js')
const toolTip = require('../../../../../utils/toolTip.js')
Page({
  data: {
    type: null,
    title: '',
    height: null,
    btnFlag: true,
    bindPossword1: '',
    bindPossword2: '',
    code: ''
  },
  onLoad: function (options) {
    let title = ''
    if (options.type == 1) {
      title = '设置密码'
    } else {
      title = '重置密码'
    }
    this.data.code = options.code
    this.data.type = options.type
    this.data.title = options.title
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // input输入
  bindPossword(e) {
    let name = e.currentTarget.dataset.number
    this.setData({
      [name]: e.detail.value
    })
    if (this.data.bindPossword1.length == 6 && this.data.bindPossword2.length == 6){
      this.setData({
        btnFlag: false
      })
    }
  },
  // 确认
  bindAffirm() {
    let code = ''
    if (this.data.bindPossword1 == this.data.bindPossword2) {
      this.data.type == 1 ? '' : code = this.data.code
      api.requestServerData('/api/Member/update_paypwd', 'get', {
        uid: app.globalData.uid,
        token: app.globalData.token,
        code: code,
        password: this.data.bindPossword1,
        confirm_password: this.data.bindPossword2
      }, true).then((res) => {
        if (res.data.status == 1){
          toolTip.noPhotoTip(res.data.msg)
          setTimeout(() => {
            wx.switchTab({
              url: '../../../user'
            })
          },2000)
          wx.setStorageSync('lsh_typels',true)
        }else{
          toolTip.noPhotoTip(res.data.msg)
        }
      })
    }else{
      toolTip.photoTip('两次密码不一致', '../../../../../static/fail.png')
    }
  },
})