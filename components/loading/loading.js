Component({
  properties: {},
  data: {
    title: '拼命加载中~~~',
    flag: true
  },
  methods: {
    change() {
      this.setData({
        title: '暂无数据',
        flag: false
      })
    },
    onChange(){
      this.setData({
        title: '拼命加载中~~~',
        flag: true
      })
    }
  }
})