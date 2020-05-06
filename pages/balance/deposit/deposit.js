const app = getApp();
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js') 
Page({
  data: {
    bankCard: '',
    timer: 60,
    codeFlag: false,
    codeTimer: '',// 定时器
    payFlag: false,
    form: {
      uid: '',
      token: '',
      money: '',
      code: '',//验证码
    },
    bank_userName: '',//持卡人姓名
    bank_no: '',//银行卡号
    mobile: '',//手机号
    codeMoney: '',// 余额
    authCode: '',// 验证码
    type: null,
    // 判断是否绑卡
    bankFlag: false,
    datalsFlag: true,
    moneyFlag: true
  },
  onLoad: function (options) {
    this.data.form.uid = app.globalData.uid
    this.data.form.token = app.globalData.token
    this.getData(options.money)
  },
  // 获取数据
  getData(money) {
    api.requestServerData('/api/Member/withdrawal_edit', 'post', {
      token: this.data.form.token,
      uid: this.data.form.uid
    }, false).then((res) => {
      let data = res.data.data
      if (res.data.status == 1){
        this.setData({
          codeMoney: money,
          mobile: data.mobile,
          bank_no: data.bank_no,
          bank_username: data.bank_username,
          bankFlag: true
        })
      }else{
        this.setData({
          bankFlag: false
        })
        toolTip.photoTip('先添加银行卡', '../../../static/fail.png')
      }
    })
  },
  // 获取验证码
  bindCode() {
    if (!this.data.codeFlag){
      this.data.codeFlag = true
      this.getCode()
      this.data.codeTimer = setInterval(() => {
        this.countDown()
      }, 1000)
    }else{
      toolTip.noPhotoTip('验证码已发送，请稍等')
    }
    this.setData({
      codeFlag: this.data.codeFlag
    })
  },
  // 获取验证码
  getCode(){
    api.requestServerData('/api/Login/sendsms', 'post', {
      mobile: this.data.mobile
    }, false).then((res) => {
      if (res.data.status == 1) {
        this.data.authCode = res.data.data
        toolTip.noPhotoTip(res.data.msg)
      } else { 
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  },
  // 倒计时
  countDown() {
    if (this.data.timer > 0){
      this.data.timer -= 1
    }else{
      this.data.timer = 60
      this.data.codeFlag = false
      clearInterval(this.data.codeTimer)
    }
    this.setData({
      codeFlag: this.data.codeFlag,
      timer: this.data.timer
    })
  },
  // input
  bindDeposit(e) {
    let name = e.currentTarget.dataset.name
    console.log()
    if (Number(e.detail.value) > Number(this.data.codeMoney)){
      toolTip.noPhotoTip('提现金额不能大于当前余额')
    }else{
      this.setData({
        ['form.' + name]: e.detail.value
      })
    }
  },
  // 提交
  bindSave() {
    let data = this.data.form
    for(var key in data) {
      if(!data[key]){
        toolTip.photoTip('信息不能为空', '../../../static/fail.png')
        return false
      }
    }
    if (this.data.form.money > this.data.codeMoney) {
      toolTip.noPhotoTip('提现金额不能大于当前余额')
      return false
    }
    if (this.data.authCode != this.data.form.code) {
      toolTip.photoTip('验证码不正确', '../../../static/fail.png')
      return false
    }
    this.apiCode()
  },
  // 提现接口
  apiCode(){
    api.requestServerData('/api/Member/withdrawal', 'post',this.data.form, false).then((res) => {
      if(res.data.status == 1){
        toolTip.photoTip('提现申请成功', '')
        setTimeout(() => {
          wx.navigateTo({
            url: '../withdraw/view/view?id=2&money='+ this.data.form.money,
          })
        },1000)
      }else{
        toolTip.noPhotoTip(res.data.msg, '')
      }
    })
  },
  // 绑定银行卡
  bindBack() {
    wx.navigateTo({
      url: '../bank/view/view'
    })
  }
})