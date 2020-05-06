Component({
  properties: {
    title: {
      type: String
    }
  },
  data: {
    hideModal: true,
    showTost: null,
    title: null,
    viewFlag: false
  },
  attached() { 
    this.data.title = this.properties.title
  },
  methods: {
    // 动画开始
    relation() {
      this.setData({
        hideModal: false,
        viewFlag: true
      })
    },
    // 点击阴影层
    bindclose() {
      setTimeout(() => {
        this.setData({
          hideModal: true,
          viewFlag: false
        })
      }, 200)
    },
    // 确认
    bindAffirm() {
      this.bindclose()
      this.triggerEvent('showTost')
    },
    // 取消
    bindCancel(){
      this.bindclose()
      this.triggerEvent('closeTost')
    }
  }

})