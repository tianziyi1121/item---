const app = getApp()
const api = require('../../../utils/api.js')
const toolTip = require('../../../utils/toolTip.js')
const common = require('../../../utils/common.js')
Page({
  data: {
    inputFlag: true,// input转换
    title: '',// 营业执照
    url: '../../../static/mimapassword.png',
    contentFlag: true,// 个人
    time: false,// 验证码倒计时
    timeData: 60,// 验证码倒计时时间
    timer: '',// 定时器
    code: '',// 验证码
    codeData: '',// 获取验证码
    password: '',// 密码
    newPassword: '',// 确认密码
    form: {
      member_role_id: 3,// 用户角色1.用户2医院3辅具中心4厂家
      member_list_username: '',// 手机号/邮箱
      name: '',// 公司名称
      member_list_tel: '',// 手机号
      member_list_pwd: '',// 密码
      certificate: '',// 营业执照
      insurance: '',// 社保证明
      code: '',// 验证码
      member_list_from: 'wechat',// 来源
      work_tel: '',// 单位电话
      contacts_name: '',// 单位联系人姓名
      contacts_tel: '',// 单位联系人电话
    }
  },
  onLoad(options) {
    
  },
  // 获取验证码
  bindCode() {
    let phone = /^1[3456789]\d{9}$/
    if (this.data.time) {
      toolTip.noPhotoTip('验证码已获取，请稍等...')
    } else if (phone.test(this.data.form.member_list_tel)) {
      this.timer()
      this.setData({
        time: true
      })
      common.getCode(this.data.form.member_list_tel).then((res) => {
        this.data.codeData = res
      })
    }else{
      toolTip.noPhotoTip('手机号码不正确')
    }
  },
  timer() {
    this.data.timer = setInterval(() => {
      let data = this.data.timeData
      this.data.time = true
      if (data > 0) {
        data -= 1
      } else {
        clearInterval(this.data.timer)
        this.data.time = false
        data = 60
      }
      this.setData({
        timeData: data,
        time: this.data.time
      })
    }, 1000)
  },
  // 选择
  radioChange(e) {
    let val = e.detail.value
    this.data.contentFlag = true
    let title = ''
    if (val == 2) {
      title = '医院'
    } else if (val == 4) {
      title = '厂家'
    } else if (val == 1) {
      this.data.contentFlag = false
    }
    this.setData({
      contentFlag: this.data.contentFlag,
      title: title
    })
    this.data.form.member_role_id = val
  },
  // 去登录
  bindBtn() {
    wx.setStorageSync('logoCode', 456)
    wx.navigateBack({
      delta: 1
    })
  },
  // 清除定时器
  onHide() {
    this.onUnload()
  },
  onUnload() {
    clearInterval(this.data.timer)
    this.setData({
      time: false,
      timeData: 60,
    })
  },
  // 查看密码
  bindImage() {
    this.setData({
      inputFlag: !this.data.inputFlag
    })
  },
  // input value
  bindInput(e){
    let name = e.currentTarget.dataset.name
    let type = e.currentTarget.dataset.type
    if (type == 1){
      this.setData({
        ['form.'+name]: e.detail.value
      })
    } else if (type == 2){
      this.setData({
        [name]: e.detail.value
      })
    }else{
      wx.setStorageSync('logoCode', 456)
      this.upload(name)
    }
  },
  // 上传
  upload(name) {
    let self = this
    wx.chooseImage({
      sizeType: ['compressed'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://www.rqxjzjxq.com/index.php/api/Login/uploadFile',
          filePath: tempFilePaths[0],
          name: name,
          success(resp) {
            let data = JSON.parse(resp.data)
            if (data.status == 1) {
              self.setData({
                ['form.' + name]: data.data.url
              })
              toolTip.noPhotoTip('上传成功')
            }
          },
          fail(resp) {
            toolTip.noPhotoTip(resp.data.msg)
          }
        })
      }
    })
  },
  // 注册
  registerBtn() {
    let form = this.data.form
    let phone = /^1[3456789]\d{9}$/
    let telephone = /^0\d{2,3}-?\d{7,8}$/
    if (!this.data.password || !this.data.newPassword) {
      toolTip.noPhotoTip("密码不能为空")
      return false
    } else if (this.data.password != this.data.newPassword) {
      toolTip.noPhotoTip("两次密码不一致")
      return false
    } else {
      form.member_list_pwd = this.data.password
    }
    if (!form.member_list_tel){
      toolTip.noPhotoTip("手机号码不能为空")
    }else{
      if (!phone.test(form.member_list_tel)) {
        toolTip.noPhotoTip("手机号码不正确")
        return false
      }
    }
    if (!this.data.code){
      toolTip.noPhotoTip("验证码不能为空")
      return false
    }else{
      if (this.data.code != this.data.codeData) {
        toolTip.noPhotoTip("验证码不正确")
        return false
      } else {
        form.code = this.data.code
      }
    }
    if (form.member_role_id != 1){
      for (var key in form) {
        if (!form[key]) {
          toolTip.noPhotoTip('请将数据填写完整')
          return false
        }
      }
      if (!telephone.test(form.work_tel)) {
        toolTip.noPhotoTip("单位电话不正确")
        return false
      } 
      if (!phone.test(form.contacts_tel)) {
        toolTip.noPhotoTip("领导人联系方式不正确")
        return false
      }
    }else{
      if (!form.member_list_username){
        toolTip.noPhotoTip("用户名不能为空")
        return false
      }
    }
    api.requestServerData('/api/Login/register', "post",form, true).then((res) => {
      if(res.data.status == 1){
        wx.setStorageSync('logoCode', 456)
        toolTip.noPhotoTip("注册成功，请等待审核")
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        },1000)
      }else{
        toolTip.noPhotoTip(res.data.msg)
      }
    })
  }
})