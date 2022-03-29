import wxApiJs = require("./wxApiJs");
import FunUtils from "../Util/FunUtils";
import GameDataManager from "../Manager/GameDataManager";
import ShareAdvType from "./ShareAdvType";


const {ccclass, property} = cc._decorator;

@ccclass
export default class WXUtils {
    private static instance: WXUtils = null;
    public static getInstance(): WXUtils {
        if (WXUtils.instance == null) {
        WXUtils.instance = new WXUtils();
        }
        return WXUtils.instance;
    }
    wx = null;
    appId = "wx0963d563bf9fb2aa";
  //---------------------分享start---------------------
    //邀请
    static InviteChannel = {
        null: 0,
        self: 1, //自己
    };
    shareCallBack:any = null;//分享的回调函数
    shareStartTime:number = 0;//分享开始时间
    shareUrls: string[] = [
        "https://h5game.99aly.com/5agamewx/alywx/htkj/wx/zhaocha/shareImg/img_1/01.png",
        "https://h5game.99aly.com/5agamewx/alywx/htkj/wx/zhaocha/shareImg/img_1/02.png",
        "https://h5game.99aly.com/5agamewx/alywx/htkj/wx/zhaocha/shareImg/img_1/03.png",
        "https://h5game.99aly.com/5agamewx/alywx/htkj/wx/zhaocha/shareImg/img_1/04.png",
        "https://h5game.99aly.com/5agamewx/alywx/htkj/wx/zhaocha/shareImg/img_1/05.png",
    ];
    shareTitles: string[] = [
        "你能找出3处不同吗？",
        "你能找出二张图片的不同吗？",
        "你能找出3处不同吗？",
        "你能找出3处不同吗？",
        "你能找出二张图片的不同吗？",
    ];
    //邀请信息
    invite_channel: number = 0;
    invite_uid: number = 0;
    invite_type: number = 0;
//---------------------分享end---------------------
//---------------------视频start---------------------
    isVideoLoading :boolean = false;//是否是在加载视频中
    isShowVideo:boolean = true; //是否能显示视频
    isVideoCached:boolean = false;//视频是否有缓存
    videoCallBack:any = null;//视频的回调函数
    videoAdv:any = null;//视频的对象
    videoIds = {
        ad1:"adunit-015ebafaf9fb2b69",
    }
//---------------------视频end---------------------
    FeedbackButton:any = null;
    bannerAds: string = 'adunit-12054c7da2ea8db3';
    init(){
        this.wx = wxApiJs.getWx()
        this.registerEvent();
        //获取微信登录信息
        this.onGameLaunch()
        //缓存视频
        this.cacheVideo();
        this.loadVideo(false);
        
    }
    onGameLaunch() {
        let lanData = this.wx.getLaunchOptionsSync();
        console.log(lanData);
        if (lanData) {
          let query = lanData.query;
          //处理邀请的情况
          this.initInvite(query);
        }
    }
    initInvite(query) {
        if (query && query.channel && query.uid && query.act) {
          let channel = parseInt(query.channel);
          let uid = parseInt(query.uid);
          let act = parseInt(query.act);
          if (channel == WXUtils.InviteChannel.self && uid && act) {
            this.invite_channel = channel;
            this.invite_uid = uid;
            this.invite_type = act;
            console.log("BIReport.getInstance().sharedIn = uid : " + uid + " | act : " + act);
            // BIReport.getInstance().sharedIn(act);
            let picIndex = parseInt(query.picIndex);
            if (picIndex) {
                // Aldsdk.getInstance().aldSendEvent("分享点击-" + picIndex, null);
                console.log("ald sharedIn = uid : " + uid + " | picIndex : " + picIndex);
            }
          }
        }
      }
    /**
   * 注册小游戏前后台切换的事件
   */
    registerEvent(){
        //回到前台处理
        wxApiJs.onShow((res)=>{
            this.onShareResume(res) //分享处理
        })
        //切换到后台处理
        wxApiJs.onShow(()=>{
        })
    }
    /**
     * 打开微信排行榜
     * @param _type 类型
     */
    postMessage(_type) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        try {
            wxApiJs.postMessage(_type);
        } catch (error) {
            cc.log(error.stack); // print stack trace
        }
    }
    /**
     * 排行榜上传分数
     * @param name key
     * @param score 分数
     */
    updataScore(name,score) {
        if (cc.sys.platform !== cc.sys.WECHAT_GAME) {
            return;
        }
        try {
            wxApiJs.updataScore(name,score);
        } catch (error) {
            cc.log(error.stack); // print stack trace
        }
    }
    //----------------------------------分享 start--------------------------------------
    
    wxShare(type:number,shareCallBack?:Function){
        this.shareCallBack = shareCallBack;
        if (this.shareCallBack) {
            this.shareCallBack.type = type;
        }
        this.shareStartTime = Date.now() //相当于 new Date().getTime();

        var titleIndex = Math.floor(Math.random() * this.shareTitles.length);//Math.floor() === 向下取整
        if (titleIndex > this.shareTitles.length - 1) {
            titleIndex = this.shareTitles.length - 1
        }
        var title = this.shareTitles[titleIndex];
        var imageIndex = Math.floor(Math.random() * this.shareUrls.length);
        if (imageIndex > this.shareUrls.length - 1) {
            imageIndex = this.shareUrls.length - 1
        }
        var image = this.shareUrls[imageIndex];
        let query = this.getShareInfo(type,imageIndex);
        //吊起微信
        // wxApiJs.shareAppMessage(title,image,query);
        let adName = ShareAdvType.shareAdvName[type];
        if (!adName) {
            adName = "???"
        }
        // Aldsdk.getInstance().aldShareAppMessage(image, title, adName, query);
    }
    getShareInfo(type: number, picIndex: number) {
        return FunUtils.format("channel={1}&uid={2}&act={3}&picIndex={4}",WXUtils.InviteChannel.self,GameDataManager.getInstance().userLocalData.openid, type, picIndex + 10);
    }
    onShareResume(res){
        if(this.shareCallBack){
            let type = this.shareCallBack.type;
            let nowTime = Date.now()
            let usedTime = nowTime - this.shareStartTime;
            if (usedTime >= GameDataManager.getInstance().kaiGuan.shareDelay) {
                if (this.shareCallBack && this.shareCallBack.success) {
                    this.shareCallBack.success(1)
                }
                this.shareCallBack = null;
            }else{
                // if (this.shareCallBack && this.shareCallBack.fail) {
                //     this.shareCallBack.fail();
                // }
                // FunUtils.showTip("注意！分享到不同的群");
                this.wxShowDialog("提示","分享失败,请尝试不同群", false, () => {
                    this.wxShare(this.shareCallBack.type,this.shareCallBack)
                }, () => {
                    if (this.shareCallBack && this.shareCallBack.fail) {
                        this.shareCallBack.fail();
                    }
                    this.shareCallBack = null;
                });
            }

        }
    }
    wxShowDialog(title: string, message: string, showCancel: boolean = false, success: Function = null, fail: Function = null) {
        if (!this.wx) {
          return;
        }
        this.wx.showModal({
          title: title,
          content: message,
        //   showCancel: showCancel,
          cancelText:"取消",
          confirmText:'去分享',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              if (success) {
                success();
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
              if (fail) {
                fail();
              }
            }
          }
        })
      }
    //---------------------------分享 end--------------------------------------------------------
    
    //--------------------------视频 start ----------------------
    wxShowVideo(type:number,videoCallBack?:any){
        if(!this.isShowVideo){
            return;
        }
        this.videoCallBack = videoCallBack;
        console.log("=====this.videoCallBack=======",this.videoCallBack)
        this.isShowVideo = false;
        if(this.isVideoLoading){
            return;
        }
        this.isVideoLoading = false;
        this.cacheVideo();
        if(this.isVideoCached){
            this.showVideo()
        }else{
            this.loadVideo(true);
        }

        let adName = ShareAdvType.shareAdvName[type];
        if (!adName) {
            adName = "???"
        }
        // Aldsdk.getInstance().aldSendEvent("观看广告-开始-" + adName, null);
        // Aldsdk.getInstance().aldSendEvent("观看广告-开始", null);
    }
    createVideo(videoId){
       this.videoAdv = wxApiJs.createVideo(videoId)
       this.videoAdv.bind_this = this;
       this.videoAdv.onError((res)=>{
           this.videoError(res)
       });
       this.videoAdv.onClose((res)=>{
        this.videoSuccess(res)
        });
    }
    videoError(res){
        console.log("=======videoError======",res)
        this.isShowVideo = true;
        this.isVideoLoading = false;
        this.isVideoCached = false;
        let videoCallBack = this.videoCallBack;
        if (!videoCallBack) {
            return;
        }
        FunUtils.showTip("今日广告次数已看完！请明日再试。");
        if (videoCallBack.noVideo) {
            videoCallBack.noVideo(res);
        }
        // Aldsdk.getInstance().aldSendEvent("观看广告-失败-", null);
    }
    videoSuccess(res){
        console.log("=======videoSuccess======",res)
        this.isShowVideo = true;
        this.isVideoLoading = false;
        this.isVideoCached = false;
        let videoCallBack = this.videoCallBack;
        console.log("=======videoCallBack======",videoCallBack)
        if (!videoCallBack) {
            return;
        }
        // 小于 2.1.0 的基础库版本，res 是一个 undefined
        if (res && res.isEnded || res == undefined) {
            // 正常播放结束，可以下发游戏奖励
            if (videoCallBack.success) {
                videoCallBack.success(2);
            }
            let adName = ShareAdvType.shareAdvName[videoCallBack.type];
            if (!adName) {
                adName = "???"
            }
            // Aldsdk.getInstance().aldSendEvent("观看广告-完成-" + adName, null);
            // Aldsdk.getInstance().aldSendEvent("观看广告-完成", null);
            //广告看完之后再加载新的广告
            this.loadVideo(false);
        }else {
            // 播放中途退出，不下发游戏奖励
            if (videoCallBack.fail) {
                videoCallBack.fail(res);
            }
            FunUtils.showTip("观看完整视频才能获得奖励哦！");
            // Aldsdk.getInstance().aldSendEvent("观看广告-中间退出-", null);
            this.loadVideo(false);
        }
    }
    /**
     * 缓存视频
     */
    cacheVideo(){
        if (!this.videoAdv) {
            this.createVideo(this.videoIds.ad1);
            return true;
        }
        return false;
    }
    /**
     * 显示视频广告
     */
    showVideo(){
        this.videoAdv.show().catch(err => {
            console.warn(err)
            this.isShowVideo = true;
            this.isVideoCached = false;
            FunUtils.showTip("视频播放失败！请重试");
        });
    }
    /**
     * 加载视频广告
     * @param isShow 是否显示广告
     */
    loadVideo(isShow:boolean){
        this.videoAdv.load().then(() => {
            this.isVideoLoading = false;
            this.isVideoCached = true;
            if (isShow) {
              this.videoAdv.show();
            }
          }).catch(err => {
            console.warn(err);
            this.isShowVideo = true;
            this.isVideoLoading = false;
          });
    }
    //--------------------------视频 end ----------------------
    /**
     * 显示banner
     * @param isShow 是否显示
     */
    wxShowBanner(isShow:boolean){
        if (isShow) {
            if (wxApiJs.bannerAd && (Date.now() - wxApiJs.showBannerTime) > GameDataManager.getInstance().kaiGuan.bannerRefreshTime) {//5分钟刷新一下
                console.log("destory banner")
                wxApiJs.bannerAd.destroy();
                wxApiJs.bannerAd = null;
            }
        }
        wxApiJs.wxShowBanner(isShow,this.bannerAds)   
    }
    //导出
    navigateToMiniProgram(_appid, name,_path,_type){
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        this.wx.navigateToMiniProgram({
            appId: _appid,
            path: _path,
            success: (data) => {
                // Aldsdk.getInstance().aldSendEvent("跳转导出成功-" + name, null)
                // Aldsdk.getInstance().aldSendEvent("跳转导出成功", null)
                // Aldsdk.getInstance().aldSendEvent("跳转导出位置"+Aldsdk.ExportName[_type], null)
            },
            fail:(data) =>{
                // Aldsdk.getInstance().aldSendEvent("跳转导出失败-" + name, null)
                // Aldsdk.getInstance().aldSendEvent("跳转导出失败", null)
                // Aldsdk.getInstance().aldSendEvent("跳转导出失败位置"+Aldsdk.ExportName[_type], null)
                // if(Aldsdk.ExportType.find == _type ){
                //     if(FindManger.getInstance().ViewFind){
                //         FindManger.getInstance().ViewFind.addExport()
                //     }
                // }
                // if(Aldsdk.ExportType.main == _type ){
                //     if(FindManger.getInstance().ViewMain){
                //         FindManger.getInstance().ViewMain.addExport()
                //     }
                // }
            }
        })
    }
    //=====
    //login
    wxlogin(param) {
        var self = this;
        this.wx.login({
        success: function (res) {
            param.onLogin(res);
        },
        fail: function (res) {
            param.onLoginFail(res);
        }
        })
    }
    //客服
    wxShowConversation() {
        if (!this.wx) {
          return;
        }
        this.wx.openCustomerServiceConversation({
          sessionFrom: "setting",
          success: function () {
    
          },
          fail: function () {
    
          }
        });
    }
    //显示意见反馈按钮
    showFeedbackButton(node:cc.Node){
        if(!this.wx){
            return;
        }
        if(this.FeedbackButton){
            this.FeedbackButton.show()
        }else{
            let winSize = cc.director.getWinSize();
            let frameSize = cc.view.getFrameSize();
            let worldPoint =  node.convertToWorldSpaceAR(cc.v2(0, 0)); //转化为世界坐标
            let top = winSize.height - worldPoint.y - node.height*0.5
            let left = worldPoint.x - node.width*0.5
            let nodeTop = top/winSize.height * frameSize.height
            let nodeLeft = left/winSize.width * frameSize.width
            let nodeWidth = node.width/winSize.width*frameSize.width;
            let nodeHeight = node.height/winSize.height*frameSize.height;
            this.FeedbackButton = this.wx.createFeedbackButton({
                type: 'image',
                image: '',
                style: {
                left: nodeLeft,
                top: nodeTop,
                width: nodeWidth,
                height: nodeHeight,
                }
            })
        }
    
    }
    hideFeedbackButton(){
        if(this.FeedbackButton){
            this.FeedbackButton.hide()
        }
    }
    showDialog() {
        if (!this.wx) {
          return;
        }
        this.wx.showModal({
          title: "提示",
          content: "累计金额达到100元可提现",
        //   showCancel: showCancel,
          cancelText:"取消",
          confirmText:'确定',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
}
