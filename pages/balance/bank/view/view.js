const app = getApp();
const api = require('../../../../utils/api.js')
const toolTip = require('../../../../utils/toolTip.js')
Page({
  data: {
    form: {
      bank_username: '',
      bank_name: '',
      bank_no: '',
      bank_area: '',
      uid: '',
      token: ''
    }
  },
  onLoad: function (options) {
    this.data.form.uid = app.globalData.uid
    this.data.form.token = app.globalData.token
    let data = wx.getStorageSync('lsh_bankData')
    if (data){
      this.setData({
        ['form.bank_username']: data.bank_username,
        ['form.bank_name']: data.bank_name,
        ['form.bank_no']: data.bank_no,
        ['form.bank_area']: data.bank_area
      })
    }
  },
  // input
  bindBank(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      ['form.' + name]: e.detail.value
    })
  },
  // 保存
  bindData() {
    let data = this.data.form
    for(var key in data){
      if(!data[key]){
        toolTip.photoTip('数据不能为空', '../../../../static/fail.png')
        return false
      }
    }
    api.requestServerData("/api/Member/update_bank", "post", this.data.form, true).then((res) => { 
      if (res.data.status == 1){
        toolTip.photoTip('数据已保存', '')
        wx.setStorageSync('bankFlage_lf',1)
          wx.navigateBack({
            delta: 2
          })
      }else{
        toolTip.photoTip('数据保存失败', '../../../../static/fail.png')
      }
    })
  }
})