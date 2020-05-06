const app = getApp()
const api = require('../../utils/api.js')
const common = require('../../utils/common.js')
Component({
  properties: {
    typeTotal: {
      type: String 
    }
  },
  data: {
    isFocus: false,//控制input 聚焦
    actual_fee: '',//待支付
    wallets_password_flag: false//密码输入遮罩
  },
  attached() {
    this.setData({
      actual_fee: this.properties.typeTotal
    })
  },
  methods: {
    // 赋值
    getotal(total){
      this.setData({
        actual_fee: total
      });
    },
    set_wallets_password(e) {//获取钱包密码
      this.setData({
        wallets_password: e.detail.value
      });
      if (this.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
        this.triggerEvent('showTab',{
          paypwd: this.data.wallets_password
        });
      }
    },
    set_Focus() {//聚焦input
      this.setData({
        isFocus: true
      })
    },
    set_notFocus() {//失去焦点
      this.setData({
        isFocus: false
      })
    },
    close_wallets_password() {//关闭钱包输入密码遮罩
      this.setData({
        isFocus: false,//失去焦点
        wallets_password_flag: false,
      })
    },
    pay() {//去支付
      let apikey = this.data.apikey;
      let id = this.data.id;
      let payment_mode = this.data.payment_mode
      this.setData({
        wallets_password_flag: true,
        isFocus: true
      })
    },
    wallet_pay() {
      this.setData({
        wallets_password_flag: false
      })
    },
    // 忘记密码
    modify_password() {
      this.setData({
        wallets_password_flag: false,
        isFocus: false
      })
      this.triggerEvent('modifyPassword');
    },
    // 关闭弹窗
    closePup() {
      this.setData({
        wallets_password_flag: false,
        isFocus: false
      })
    }
  }
})