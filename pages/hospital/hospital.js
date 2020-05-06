// pages/hospital/hospital.js
var app = getApp();

Page({
  data: {
    list: [
      {
        name: '北京市第一人民医院',
        id: 1
      },
      {
        name: '北京市协和医院',
        id: 2
      },
      {
        name: '北京大学第三医院',
        id: 3
      },
      {
        name: '朝阳医院和天坛医院',
        id: 4
      },
      {
        name: '北京中医药大学联科肾病医院',
        id: 5
      },
      {
        name: '朝阳医院和天坛医院',
        id: 6
      },
      {
        name: '北京中医药大学联科肾病医院',
        id: 7
      }
    ]
  },
  onLoad: function (options) {

  },
  // 列表点击
  hospitalList: function(e) {
    wx.navigateTo({
      url: 'view/view?id='+e.currentTarget.dataset.index
    })
  },
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/hospital/hospital',
      success: res => {
        app.shareTip()
      }
    }
  },
})