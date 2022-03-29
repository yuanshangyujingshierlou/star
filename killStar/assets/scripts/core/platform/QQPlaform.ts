import FunUtils from "../Util/FunUtils";
import ShareAdvType from "./ShareAdvType";
import GameDataManager from "../Manager/GameDataManager";
import PlatformManger from "./PlatformManger";
import Const from "../../game/Const";


declare global {
    interface Window {
        qq: any;
    }
}
export default class QQPlaform {

    private static instance: QQPlaform = null;
    public static getInstance(): QQPlaform {
        if (QQPlaform.instance == null) {
            QQPlaform.instance = new QQPlaform();
        }
        return QQPlaform.instance;
    }

    // 积木 62eb69ffcf4f00ff690e7196be6254e8
    qq:any = null;
    static appId: string = "1110661213";

    //视频-------
    isVideoLoading :boolean = false;//是否是在加载视频中
    isShowVideo:boolean = true; //是否能显示视频
    isVideoCached:boolean = false;//视频是否有缓存
    videoCallBack:any = null;//视频的回调函数
    videoAdv:any = null;//视频的对象
    videoIds = {
        ad1:"83250bb25c44c0d0736f46faed08809c",
    }

  // banner 65c7d9e20341ad154905a6a8e24fc9d4 
  // 激励视频 83250bb25c44c0d0736f46faed08809c 
  // 盒子 aacb791e4db37a6f6bc31ee0d924f4e1 
  // 积木 62eb69ffcf4f00ff690e7196be6254e8
    //banner
    bannerAds: string = '65c7d9e20341ad154905a6a8e24fc9d4';

    bannerAd :any =  null; // banner 对象
    showBannerTime :number =  0;//banner显示时间

    //盒子----------
    created : boolean = false;
    loaded : boolean = false;
    showed : boolean = false;
    appbox:any = null;
    qqAppboxId:string = "aacb791e4db37a6f6bc31ee0d924f4e1"
    
    //--------积木------
    blockAd = null;
    blockAdIds = "62eb69ffcf4f00ff690e7196be6254e8"

    init(){
        this.qq = window.qq;
        //缓存视频
    }
    login(callback){
      this.qq.login({
        success: function (res) {
            // param.onLogin(res);
            console.log(res);
            if (res.code) {
              callback(res.code)
            }
        }.bind(this),
        fail: function (res) {
            FunUtils.showTip("登录失败")
        }.bind(this)
        })
    }

    qqShowVideo(type:number,videoCallBack?:any){
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
          this.showVideo();
      }else{
          this.loadVideo(true);
      }
      let adName = ShareAdvType.shareAdvName[type];
      if (!adName) {
          adName = "???";
      }
      // Aldsdk.getInstance().aldSendEvent("观看广告-开始-" + adName, null);
      // Aldsdk.getInstance().aldSendEvent("观看广告-开始", null);
    }

    createVideo(videoId){
      this.videoAdv = this.qq.createRewardedVideoAd({adUnitId: videoId});
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
//视频 end 
//=========banner start============
    /**
     * 显示banner
     * @param isShow 是否显示
     */
  qqShowBanner(isShow:boolean){
      if (isShow) {
          if (this.bannerAd && (Date.now() - this.showBannerTime) > GameDataManager.getInstance().kaiGuan.bannerRefreshTime) {//5分钟刷新一下
              console.log("destory banner")
              this.bannerAd.destroy();
              this.bannerAd = null;
          }
      }
      this.createBanner(isShow,this.bannerAds);
  }
 /**
   * 显示banner
   * @param isShow 是否显示
   * @param _adUnitId id
   */
  createBanner(isShow,_adUnitId){
    console.log("===_adUnitId===",_adUnitId)
    if (!this.bannerAd) {
        var screenWidth = this.qq.getSystemInfoSync().screenWidth
        var screenHeight = this.qq.getSystemInfoSync().screenHeight
        this.showBannerTime = Date.now();
        const bannerAd = this.qq.createBannerAd({
          adUnitId: _adUnitId,
          style: {
            left:(screenWidth - 300)/2 ,
            top:screenHeight - 100,
            width: 300,
            height:100,
          }
        })
        bannerAd.onError(err => {
          console.log(err)
        })
        bannerAd.onResize(res => {
          console.log(res.width, res.height)
          console.log(bannerAd.style.realWidth, bannerAd.style.realHeight)
          var screenHeight = this.qq.getSystemInfoSync().screenHeight
          bannerAd.style.top = screenHeight - bannerAd.style.realHeight
          bannerAd.style.left = (screenWidth - bannerAd.style.realWidth)/2
        })
        this.bannerAd = bannerAd;
        console.log("create banner")
    }
    if (isShow) {
        this.bannerAd.show()
    } else {
        this.bannerAd.hide()
    }
  }
  
    //手q盒子
    showAppBox(isShow : boolean, fend = null) {
        if(PlatformManger.getInstance().platform != Const.Platform.qq){
            return;
        }
        let AppBoxFunc = this.qq.createAppBox;
        if (!AppBoxFunc) {
          console.error("没有互导盒子组件!");
          return ;
        }
  
        if (!this.created) {
          this.createappbox();
        }
        this.loadappbox(isShow, fend);
    }
  addLog(msg,data=null) {
      console.log(msg);
  }
  
  //方法调用时的状态判断应该客户端实现时候也是要考虑的
  createappbox() {
    this.appbox = this.qq.createAppBox({
      adUnitId: this.qqAppboxId
    })
    let appbox = this.appbox
    let self = this
    this.addLog('创建appbox')
  
    if (self.created) {
      console.log('off')
      // appbox.offLoad(this.onLoad.bind(this))
      // appbox.offError(this.onError.bind(this))
      appbox.offClose(this.onClose.bind(this))
    }
    console.log('on')
    self.created = true
    // appbox.onError(this.onError)
    // appbox.onLoad(this.onLoad)
    appbox.onClose(this.onClose)
  }
  
  onLoad(res) {
    console.log("appbox onload");
    console.log(res);
  }
  
  onError(res) {
    console.log("appbox onerror");
    console.log(res);
  }
  
  onClose(res) {
    console.log("appbox onclose");
    console.log(res);
  }
  
  loadappbox(isShow : boolean, fend) {
    let self = this
    this.addLog('click loadappbox')
    if (this.appbox) {
      this.appbox.load().then(() => {
        this.loaded = true
        this.addLog('appbox load success')
        if (fend) {
          fend(true); 
        }
  
        if (isShow) {
          this.showappbox();
        }
      }).catch((res) => {
        this.addLog('appbox load error', res)
      })
    } else {
      this.addLog('请先创建appbox')
    }
  }
  
  showappbox() {
    let self = this
    this.addLog('click showappbox')
    if (this.appbox) {
      this.appbox.show().then(() => {
        this.showed = true
        this.addLog('appbox show success')
      }).catch((res) => {
        this.addLog('appbox show error', res)
      })
    } else {
      this.addLog('请先创建appbox')
    }
  }
  
  destroyappbox() {
    let self = this
    this.addLog('click destroyappbox')
    if (this.appbox) {
      this.appbox.destroy().then(() => {
        this.showed = false
        this.loaded = false
        this.created = false
        this.addLog('appbox destroy success')
      }).catch((res) => {
        this.addLog('appbox destroy error', res)
      })
    } else {
      this.addLog('请先创建appbox')
    }
  }



  //显示积木广告
  setBlockPos(width, height) {
    if (this.blockAd) {
      // let frameSize = new Laya.Vector2(Laya.Browser.width / 2, Laya.Browser.height / 2);
      // let winSize = new Laya.Vector2(Laya.stage.width, Laya.stage.height);
      // let pos = this.pos;
      // let anch = this.anch;
      // // console.log("winSize: ",winSize);
      // console.log("frameSize: ",frameSize.x,frameSize.y);

      // let nodeWidth = width*winSize.x/frameSize.x;
      // let nodeHeight = height*winSize.x/frameSize.x;

      //适配不同机型来创建微信授权按钮
      // let left = (winSize.x*0.5+pos.x-nodeWidth*anch.x)/winSize.x*frameSize.x;
      // let top = (winSize.y*0.5-(pos.y+nodeHeight*(1-anch.y)))/winSize.y*frameSize.y;
      var screenWidth = this.qq.getSystemInfoSync().screenWidth
      var screenHeight = this.qq.getSystemInfoSync().screenHeight

      
      let left = screenWidth / 2 - width / 2;//(winSize.x*0.5+pos.x-nodeWidth*anch.x)/winSize.x*frameSize.x;
      let top = screenHeight*0.08; //60; //this.deviceHeight - height - 120;//(winSize.y*0.5-(pos.y+nodeHeight*(1-anch.y)))/winSize.y*frameSize.y;
      // if (this.anch) {
      //   left = this.deviceWidth / 2 - width * this.anch.x;
      // }
      this.blockAd.style.left = left;
      this.blockAd.style.top = top;
    }

  }

  blockAdErr(res) {
    console.log(res);
  }

  blockResize(res) {
    console.log("blockAd resize")
    console.log(res);
    let width = this.blockAd.style.realWidth;
    let height = this.blockAd.style.realHeight;
    this.setBlockPos(width, height);
  }
  qqShowJimuAd(isShow: boolean, needRefresh: boolean = true) {
    if(!this.qq){
      return;
    }
    if (!this.qq.createBlockAd) {
      return
    }

    if (this.blockAd && needRefresh) {
      this.blockAd.offError(this.blockAdErr);
      this.blockAd.offResize(this.blockResize);
      this.blockAd.destroy();
      this.blockAd = null;
    }

    if (!this.blockAd) {
      var screenHeight = this.qq.getSystemInfoSync().screenHeight
      let top = screenHeight*0.08;
      let blockAd = this.qq.createBlockAd({
        adUnitId: this.blockAdIds,
        size: 5,
        orientation: 'landscape',
        style: { left: 40, top: top }
      });
      this.blockAd = blockAd;
      blockAd.onError(this.blockAdErr.bind(this));
      blockAd.onResize(this.blockResize.bind(this));
      console.log("create blockAd")
    }

    if (isShow) {
      this.blockAd.show();
    } else {
      this.blockAd.hide();
    }
  }

}
