var wxApiJs = {
  
  bannerAd : null, // banner 对象
  showBannerTime : 0,//banner显示时间
  //获取微信
  getWx(){
    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
      return null;
    }
    return wx;
  },
  /**
   * 发送信息打开微信排行榜
   * @param {类型} _type 
   */
  postMessage:function(_type){
    console.log("==pai=hb2")
    const openDataContext = wx.getOpenDataContext()
    openDataContext.postMessage({
      type: _type,
    })
  },
  /**
   * 上传分数
   * @param {Key} name 
   * @param {分数} score 
   */
  updataScore:function(name,score){
    wx.setUserCloudStorage({
        KVDataList: [{key: name, value: "" + score}],
        success: function (res) {
            console.log('setUserCloudStorage', 'success', res)
        },
        fail: function (res) {
            // self.submitScore(name,score)
            console.log('setUserCloudStorage', 'fail')
        },
        complete: function (res) {
            console.log('setUserCloudStorage', 'ok')
        }
    });
  },

  /**
   * 吊起微信分享
   * @param {显示的内容} _title 
   * @param {分享的图片} _image 
   * @param {数据} _queryData 
   */
  shareAppMessage:function(_title,_image,_queryData){
    wx.shareAppMessage({
      title: _title,
      imageUrl: _image,
      query: _queryData,
      success(res) {},
      fail() {}
    })
  },
  /**
   * 小游戏回到前台
   * @param {回调函数} callBack 
   */
  onShow:function(callBack){
    wx.onShow((res) => {
      console.log('小游戏回到前台');
      callBack(res)
    })
  },
  /**
   * 小游戏回到后台
   * @param {回调函数} callBack 
   */
  onHide:function(callBack){
    wx.onHide((res) => {
      console.log('小游戏回到后台');
      callBack(res)
    });
  },
  /**
   * 创建视频
   * @param {视频的id} videoId 
   */
  createVideo:function(videoId){
    let videoAdv = wx.createRewardedVideoAd({adUnitId: videoId});
    return videoAdv;
  },
  /**
   * 创建视频
   * @param {bannerId} _adUnitId 
   * @param {*} _left 
   * @param {*} _top 
   * @param {*} _width 
   * @param {*} _height 
   */
  createBannerAd:function(_adUnitId,_left,_top,_width,_height){
    let bannerAd = wx.createBannerAd({
      adUnitId: _adUnitId,
      style: {
        left: _left,
        top: _top,
        width: _width,
        height: _height,
      }
    })
    return bannerAd;
  },
  /**
   * 显示banner
   * @param isShow 是否显示
   * @param _adUnitId id
   */
  wxShowBanner(isShow,_adUnitId){
    // if (isShow) {
    //   if (this.bannerAd && (Date.now() - this.showBannerTime) > GameDataManager.getInstance().kaiGuan.bannerRefreshTime) {//5分钟刷新一下
    //       console.log("destory banner")
    //       this.bannerAd.destroy();
    //       this.bannerAd = null;
    //   }
    // }
    if (!this.bannerAd) {
        var screenWidth = wx.getSystemInfoSync().screenWidth
        this.showBannerTime = Date.now();
        let bannerAd = wx.createBannerAd({
          adUnitId: _adUnitId,
          style: {
            left: 0,
            top: 0,
            width: screenWidth,
            height: 200,
          }
        })
        bannerAd.onError(err => {
          console.log(err)
        })
        bannerAd.onResize(res => {
          console.log(res.width, res.height)
          console.log(bannerAd.style.realWidth, bannerAd.style.realHeight)
          var screenHeight = wx.getSystemInfoSync().screenHeight
          bannerAd.style.top = screenHeight - bannerAd.style.realHeight
        })
        this.bannerAd = bannerAd;
        console.log("create banner")
    }
    if (isShow) {
        this.bannerAd.show()
    } else {
        this.bannerAd.hide()
    }
  },
  
  navigateToMiniProgram:function(_appid, name, _path,_type){
    
  },

}
module.exports = wxApiJs;