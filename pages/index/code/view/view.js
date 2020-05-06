const toolTip = require('../../../../utils/toolTip.js')
const api = require('../../../../utils/api.js')
Page({
  data: {
    form: {
      password: '',
      confirm_password: '',
      code: '',
      mobile: ''
    }
  },
  onLoad: function (options) {
    this.data.form.mobile = options.phone
    this.data.form.code = options.code
  },
  // 拿到input的数据
  bindInput(e) {
    let name = e.currentTarget.dataset.name
    this.setData({
      ['form.'+ name]: e.detail.value
    })
  },
  // 确认 
  bindBtn() {
    let data = this.data.form
    if (!data.password || !data.confirm_password){
      toolTip.noPhotoTip('密码不能为空')
      return false
    } else if (data.password != data.confirm_password) {
      toolTip.noPhotoTip('填写密码不一致')
      return false
    }
    api.requestServerData('/api/index/update_password', "get", data, true).then((res) => {
      if(res.data.status == 1){
        toolTip.noPhotoTip('修改成功')
        setTimeout(() => {
          wx.navigateBack({
            delta: 2
          })
        },1000)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
})