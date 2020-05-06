// lookCareHome.js
const app = getApp()

Page({
  data: {
    lookCareNav: [
      {
        nav: '年龄',
        id: 0
      },
      {
        nav: '性别',
        id: 1
      },
      {
        nav: '工作经验',
        id: 2
      },
      {
        nav: '地区',
        id: 4
      }
    ],
    // 弹窗
    dialogShow: false,
    // 点击导航
    screenIndex: 8,
    // 选择储存
    age: ["20岁~25岁", "25岁~30岁", "30岁~35岁", "35岁~40岁", "45岁~50岁", "50岁~55岁", "55岁~60岁", "60岁~65岁"],
    ageIndex: 0,
    sex: ["男护工", "女护工"],
    sexIndex: 1,
    workExperience: ["1年~3年", "4年~7年", "8年~11年", "12年~15年", "16年~19年", "20年~23年", "24年~27年", "28年~31年", "32年~35年", "36年~39年", "40年~42年"],
    workExperienceIndex: 0,
    // 列表
    lookCareList: []
  },
  // 加载
  onLoad: function() {
    
  },
  // 导航
  screen: function(e) {
    this.setData({
      dialogShow: true,
      screenIndex: e.currentTarget.dataset.index
    })  
  },
  // 年龄
  choiceEag: function(e) {
    this.setData({
      dialogShow: false,
      ageIndex: e.currentTarget.dataset.index
    }) 
  },
  // 性别
  choiceSex: function (e) {
    this.setData({
      dialogShow: false,
      sexIndex: e.currentTarget.dataset.index
    }) 
  },
  // 地区
  choiceExperience: function (e) {
    this.setData({
      dialogShow: false,
      workExperienceIndex: e.currentTarget.dataset.index
    }) 
  },
  // 点击列表
  onLookCareList: function() {}
})