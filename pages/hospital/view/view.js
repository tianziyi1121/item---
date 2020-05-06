// pages/hospital/view/view.js
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
    ],
    currentList: [
      {
        name: '呼吸内科',
        id: 1
      },
      {
        name: '耳鼻喉科',
        id: 2
      },
      {
        name: '针灸推拿科',
        id: 3
      },
      {
        name: '呼吸内科',
        id: 4
      },
      {
        name: '耳鼻喉科',
        id: 5
      },
      {
        name: '针灸推拿科',
        id: 6
      },
      {
        name: '呼吸内科',
        id: 7
      },
      {
        name: '耳鼻喉科',
        id: 8
      },
      {
        name: '针灸推拿科',
        id: 9
      }
    ],
    index: ''
  },
  onLoad: function (options) {
    this.setData({
      index: options.id - 1
    })
  },
  current: function(e) {
    var id = e.currentTarget.dataset.id
    wx.switchTab({
      url: '../../lookCare/lookCare'
    })
  },
  // 分享
  onShareAppMessage() {
    return {
      title: app.share.name,
      path: 'pages/hospital/view/view',
      success: res => {
        app.shareTip()
      }
    }
  },
})