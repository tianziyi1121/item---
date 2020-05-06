// pages/recovery/view/view.js
const app = getApp()

Page({
  data: {
    title: '',
    id: '',
    dataList: {}
  },
  onLoad: function (options) {
    var title = ''
    if (options.id == 1) {
      title = "术后康复"
    } else if (options.id == 2){
      title = "康复知识"
    } else {
      title = "热门问答"
    }
    wx.setNavigationBarTitle({
      title: title
    })
    let result = app.globalData.dataList.news_content.replace(/[ \t]*font-family[ \t]*=[ \t]*("[^"]+")|('[^']+')/ig, "");
    const regex = new RegExp('<img', 'gi');
    result = result.replace(regex, `<img style="margin: 10px 0;border-radius: 5px;"`);
    this.content = result;
    app.globalData.dataList.news_content = result
    this.setData({
      dataList: app.globalData.dataList
    })
  }
})