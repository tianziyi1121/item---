Component({
  properties: {},
  data: {
    title: '请登录后再进行操作',
    cancel: '暂不登录',
    affirm: '立即登录' 
  },
  attached() {},
  methods: {
    bindLogin (e){
      let type = e.currentTarget.dataset.type
      this.triggerEvent('bindLogin', {
        type: type
      });
    },
    login(){
      let btnFlag = wx.getStorageSync('phonecCode')
      let uid = wx.getStorageSync('uid')
      if (uid !== '' && uid != undefined && btnFlag != 123) {
        this.setData({
          title: '手机号码验证之后可进行此操作',
          cancel: '取消',
          affirm: '确认'
        })
      }
    }
  }
})