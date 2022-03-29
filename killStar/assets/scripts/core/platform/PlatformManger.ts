import Const from "../../game/Const";
import WXUtils from "./WXUtils";
import GameDataManager from "../Manager/GameDataManager";
import FunUtils from "../Util/FunUtils";
import ShareAdvType from "./ShareAdvType";
import AdaptarManager from "../Manager/AdaptarManager";
import QQPlaform from "./QQPlaform";


const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformManger {

    private static instance: PlatformManger = null;

    public static getInstance(): PlatformManger {
        if (PlatformManger.instance == null) {
            PlatformManger.instance = new PlatformManger();
        }
        return PlatformManger.instance;
    }
    platform:number= 0
    initPlatform(){
        if(cc.sys.isBrowser){
            this.platform = Const.Platform.browser;
            return;
        }
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            this.platform = Const.Platform.android;
        }
        if(cc.sys.os == cc.sys.OS_IOS) {
            this.platform = Const.Platform.ios
        }
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.platform = Const.Platform.wx
            if(window.qq){
                this.platform =  Const.Platform.qq
            }
        }
        console.log("===this.platform==",this.platform)
        this.init()
    }
    init(){
        if (this.platform == Const.Platform.qq) {
            QQPlaform.getInstance().init();
        } else if((this.platform == Const.Platform.wx)) {
            WXUtils.getInstance().init()
        }else{

        }
    }
    //分享
    showShare(type: number, param: any) {
        if (this.platform == Const.Platform.wx) {
            if (!GameDataManager.getInstance().kaiGuan.isOpenShare) {
                if (param && param.success) {
                    param.success(2);
                }
                return ;
            }
            WXUtils.getInstance().wxShare(type, param);
        }else {
           FunUtils.showTip("测试模式直接发奖 + " + type);
            if (param && param.success) {
                param.success(2);
            }
        }
    }
    //视频
    // showVideo(type: number,param: any) {
    //     if (this.platform == Const.Platform.wx) {
    //         WXUtils.getInstance().wxShowVideo(type, param);
    //     }else {
    //        FunUtils.showTip("测试模式视频直接发奖 + " + type);
    //         if (param && param.success) {
    //             param.success(2);
    //         }
    //     }
    // }
    

    /**
     * ts 调用 Java
     * jsb.reflection.callStaticMethod(className, methodName, methodSignature, parameters...)
     * 例子
     * public doVibrate(isShort: boolean = true) {
     *       jsb.reflection.callStaticMethod("com/xxxx/Admopub/AdmopubHelper", "doVibrate", "(Z)V", isShort)
     * }
     * className，是java中的类名，要带上路径，是相对路径，栗子中的是"com/xxxx/Admopub/AdmopubHelper"
     * methodName，是java类中的静态方法，"doVibrate"
     * methodSignature，是方法签名，看下面的表，栗子中是"(Z)V"
     * parameters，是你需要传入的参数，需要和前面的methodSignature配合使用，栗子中传入的是isShort
     * 
     * 如果有一个方法是public static int func()，那调用如下，其他就不用解释了
     * jsb.reflection.callStaticMethod("com/xxxx/Admopub/AdmopubHelper", "func", "()I");
     * 类型	        签名
     * int	        I
     * float	    F
     * boolean	    Z
     * String	Ljava/lang/String;
     * 
     * 方法签名：
     * (I)V表示参数为一个int，没有返回值的方法
     * (I)I表示参数为一个int，返回值为int的方法
     * (IF)Z表示参数为一个int和一个float，返回值为boolean的方法
     * 
     */
    sendLog(str:string){
        if (this.platform == Const.Platform.android) {
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "PrintLog";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,str)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "PrintLog:";
            jsb.reflection.callStaticMethod(className,methodName,str)
        }
    }
    //过关成功
    gamePassEvent(level:number){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                pass:level,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "gamePassEvent";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            
        }
    }
    /**
     * 显示bander
     * @param isShow 是否显示bander true 显示 false 隐藏
     */
    showBanner(isShow: boolean) {
        if(isShow){
            // this.showBottomBanner()
        }else{
            // this.hideBottomBanner()
        }
    }
    //显示Banner
    showBottomBanner(){
        if (this.platform == Const.Platform.android) {
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "showBottomBanner";
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "showBottomBanner";
            jsb.reflection.callStaticMethod(className,methodName,null)
        }else if(this.platform == Const.Platform.browser){
        }else if(this.platform == Const.Platform.qq){
            QQPlaform.getInstance().qqShowBanner(true)
        }
    }
    //隐藏Banner
    hideBottomBanner(){
        if (this.platform == Const.Platform.android) {
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "hideBottomBanner";
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "hideBottomBanner";
            jsb.reflection.callStaticMethod(className,methodName,null)
        }else if(this.platform == Const.Platform.browser){
        }else if(this.platform == Const.Platform.qq){
            QQPlaform.getInstance().qqShowBanner(false)
        }
    }
    /**
     * 事件统计
     * @param eventID 
     * @param eventName 
     */
    addOnEvent(eventID:string,eventName:string){
        this.sendLog(eventName)
        if (this.platform == Const.Platform.android) {
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "onEvent";
            let methodSignature = "(Ljava/lang/String;Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,eventID,eventName)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "onEvent:eventName:";
            jsb.reflection.callStaticMethod(className,methodName,eventID,eventName)
        }else if(this.platform == Const.Platform.browser){

        }
    }
//--------------视频----------------
    callBackVideo:any = null;
    palyVideoError(funName){
        console.log("===funNameError==",funName)
        if (this.callBackVideo && this.callBackVideo.success) {
            this.callBackVideo.fail();
        }
    }
    palyVideoOk(funName){
        console.log("===funNameok==",funName)
        if (this.callBackVideo && this.callBackVideo.success) {
            this.callBackVideo.success();
            // this.callBackVideo = null;
        }
    }
    showVideo(type: number,param: any){
        if (this.platform == Const.Platform.android) {
            this.callBackVideo = param;
            let jsonStr = {
                adType:2,
                adPosition:ShareAdvType.androidName[type],
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "showAd";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            this.callBackVideo = param;
            let jsonStr = {
                adType:2,
                adPosition:ShareAdvType.androidName[type],
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "AppClient";
            let methodName = "showAd:";
            jsb.reflection.callStaticMethod(className,methodName,strJson)
        }else if(this.platform == Const.Platform.browser){
            this.callBackVideo = param;
            FunUtils.showTip("测试模式视频直接发奖 + " + type);
            if (param && param.success) {
                param.success(2);
            }
        }else if(this.platform == Const.Platform.qq){
            QQPlaform.getInstance().qqShowVideo(type,param)
        }
    }
    //播放可关闭的视频
    playAdVideo(type: number,param: any){
        this.callBackVideo = param;
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                adType:3,
                adPosition:ShareAdvType.androidName[type],
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "playAdVideo";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            let jsonStr = {
                adType:3,
                adPosition:ShareAdvType.androidName[type],
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "AppClient";
            let methodName = "playAdVideo:";
            jsb.reflection.callStaticMethod(className,methodName,strJson)
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("测试模式视频直接发奖 + " + type);
            if (param && param.success) {
                param.success(2);
            }
        }

    }
    onSetCallBack(data){
        let date = JSON.parse(data);
        GameDataManager.getInstance().userLocalData.setMusicOn(date.isMusicOn)
    }
    // 
    openSettingPage(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,      
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openSettingPage";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("显示设置界面")
        }  
    }
    openTaskPage(posType){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                invitationNum:GameDataManager.getInstance().userData.invitationNum,
                money:GameDataManager.getInstance().userData.money,
                posType:posType,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openTaskPage";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            // FunUtils.showTip("显示每日福利界面")
            FunUtils.showTip("显示每日福利界面"+posType)
            let data = {
                posType:posType,
                money:GameDataManager.getInstance().userData.money
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        } 
    }
    openCashPage(posType){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                invitationNum:GameDataManager.getInstance().userData.invitationNum,
                money:GameDataManager.getInstance().userData.money,
                posType:posType,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openCashPage";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("显示提现界面"+posType,)
            let data = {
                posType:posType,
                money:GameDataManager.getInstance().userData.money
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }

    /**
     * 打开每日分红星
     */
    openRewardStar(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                invitationNum:GameDataManager.getInstance().userData.invitationNum,
                money:GameDataManager.getInstance().userData.money,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openRewardStar";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("抽分红星")
            let data = {
                money:GameDataManager.getInstance().userData.money
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    /**
     * 抽奖(抽分红星)
     */
    openTurntable(viewName){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                invitationNum:GameDataManager.getInstance().userData.invitationNum,
                money:GameDataManager.getInstance().userData.money,
                viewName:viewName,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "turntable";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("抽分红星"+viewName)
            let data = {
                type : "shareOutStar",
                shareOutStarType:1,//0 没有任何奖励 1 奖励 限时红包 2 刷新道具 
                addMoney:2,//限时红包钱数
                time:30,//限时时间
                propRefrshNum:2//添加的刷新道具数,(服务器已经加上了)
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    /**
     * 打开分红星倒计时结束弹窗
     */
    openRedStarFinished(viewName,money_t,money_b){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                invitationNum:GameDataManager.getInstance().userData.invitationNum,
                money:GameDataManager.getInstance().userData.money,
                viewName:viewName,
                money_t:money_t, 
                money_b:money_b,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "redStarFinished";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("获取红包界面"+viewName)
            let data = {
                money:GameDataManager.getInstance().userData.money
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
     //新手红包
     openNewUserRedPackPage(newUserRedPacket){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare,
                newMoney:newUserRedPacket,//钱数
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "newUserRedPack";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("新手红包="+newUserRedPacket)
        }
    }
    // public static void redStarFinished(String json)
        //显示大图
        /**
         * 
         * @param adHeight 高度
         * @param adWidth 宽度
     */
    showBigVideo(adHeight,adWidth){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                adType:1,
                adPosition:"datu",
                adHeight:adHeight,//广告底最高高度int
                adWidth:adWidth,//弹窗宽度int
                fullHeight:AdaptarManager.getInstance().fullHeight,
                fullWidth:AdaptarManager.getInstance().fullWidth,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "showAd";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            let jsonStr = {
                adType:1,
                adPosition:"datu",
                adHeight:400,//广告弹窗区域高度int
                bottomMargin:360,//弹窗距离底部位置int
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "AppClient";
            let methodName = "showAd:";
            jsb.reflection.callStaticMethod(className,methodName,strJson)
        }else if(this.platform == Const.Platform.browser){

        }
    }
    //隐藏大图
    hideBigVideo(){
        if (this.platform == Const.Platform.android) {
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "hideDialogDatu";
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "hideDialogDatu";
            jsb.reflection.callStaticMethod(className,methodName,null)
        }else if(this.platform == Const.Platform.browser){

        }
    }
  
     //定时红包
    openRedPackTimerPage(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare, //是否显示每日福利
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "redPackTimer";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("定时红包")
            let data = {
                type :"redPackTimer",
                timingRedPacketType:0,//定时红包状态
                timingRedPacketTime:100,//定时红包时间
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
     //定时红包
     redPackTimerResultShow(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare, //是否显示每日福利
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "redPackTimerResultShow";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("定时红包")
            let data = {
                timingRedPacketType:0,//定时红包状态
                timingRedPacketTime:100,//定时红包时间
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }
    }
    //我的水果
    openMyFrutis(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare, //是否显示每日福利
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openMyFrutis";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("我的苹果")
        }
    }
    //打开赢手机界面
    openWinPhone(posType){
        if (this.platform == Const.Platform.android) {
            //打开赢手机界面
            let jsonStr = {
                posType:posType
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "winMobilePhone";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("显示赢手机界面")
            let data = {
                posType:posType,
            }
            let str = JSON.stringify(data)
            this.allPageCallBack(str)
        }  
    }
    //打开签到界面
    openSignIn(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openSignIn";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("显示签到界面")
        }  
    }
    //所有界面的回调
    allPageCallBack(jsonData){
        
        
    }
    showGetFruitsDialog(fruits){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                isShowWelfare:GameDataManager.getInstance().tempData.isShowWelfare, //是否显示每日福利
                fruits:fruits,//奖励的水果数量
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "showGetFruitsDialog";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
            
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("我的苹果")
        }
    }
    openBrowser(url :string){
        if (this.platform == Const.Platform.android) {
            console.log("===android==url=",url)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "openBrowser";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,url)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "openBrowser:";
            jsb.reflection.callStaticMethod(className,methodName,url)
        }else if(this.platform == Const.Platform.browser){
            cc.sys.openURL(url);
        }
    }
    //复制
    copy(copyStr :string){
        if (this.platform == Const.Platform.android) {
            // console.log("===android==url=",copyStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "copy";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,copyStr)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "copy:";
            jsb.reflection.callStaticMethod(className,methodName,copyStr)
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("复制成功"+copyStr )
        }
    }
    shareText(msg:string){
        if (this.platform == Const.Platform.android) {
            // console.log("===android==url=",msg)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "shareText";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,msg)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "shareText:";
            jsb.reflection.callStaticMethod(className,methodName,msg)
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("分享"+msg )
        }

    }
    //微信绑定
    callBackBinding:any = null;

    wxBindingError(funName){
        console.log("===wxBindingError==",funName)
        if (this.callBackBinding && this.callBackBinding.success) {
            this.callBackBinding.fail();
        }
    }
    wxBindingOk(data){
        console.log("===wxBindingOk==",data)
        if (this.callBackBinding && this.callBackBinding.success) {
            let date = JSON.parse(data);
            this.callBackBinding.success(date);
        }
    }

    wxBinding(param: any){
        this.callBackBinding = param;
        if (this.platform == Const.Platform.android) {
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "getWXInfo";
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature)
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "getWXInfo";
            jsb.reflection.callStaticMethod(className,methodName,null)
        }else if(this.platform == Const.Platform.browser){
            // FunUtils.showTip("微信绑定成功");
            if (param && param.success) {
                let data = {
                    openid:GameDataManager.getInstance().userLocalData.openid,
                    nickname:"测试—东",
                    sex:1,
                    language:"zh_CN",
                    city:"",
                    province:"",
                    country:"AD",
                    headimgurl:"http://thirdwx.qlogo.cn/mmopen/vi_32/73UFconjvSyIGGEATicC3SDROdOhd2w5BdbDLrhZl2cb92duCfXJAObpSB3WCKnVSnL9wR2tfHicUHO54R9uoqvQ/132",
                    privilege:[],
                    unionid:GameDataManager.getInstance().userLocalData.openid
                }
                param.success(data);
            }
        }        
    }
    //获取信息配置
    getAppInfo(){
        if (this.platform == Const.Platform.android) {
            /**
             * "imei": ""，
             * "packageName": "包名",
             * "versionName": "客户端版本号",
             * "channelName": "渠道名称"
             * "city": 区分
             */
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "getAppInfo";
            let methodSignature = "()Ljava/lang/String;";
            let data = jsb.reflection.callStaticMethod(className,methodName,methodSignature)
            console.log("====获取Java App配置 ==",data)
            let date = JSON.parse(data);
            return date;
        }else if(this.platform == Const.Platform.ios){
            let className = "AppClient";
            let methodName = "getAppInfo";
            let data = jsb.reflection.callStaticMethod(className,methodName,null)
            console.log("====获取IOS App配置 ==",data)
            let date = JSON.parse(data);
            return date;
        }else if(this.platform == Const.Platform.browser){
            let date = {
                // imei: "lddTest100",
                imei: GameDataManager.getInstance().userLocalData.openid,
                packageName: "com.jiayou.xiaoxixao",
                versionName: "1.3.1",
                channelName: "lddTest10",
                city: "北京",
                isFirstOpen:false,
            }
            // "versionName":"1.3.1","channelName":"zc1","packageName":"com.htkj.findios","city":"","imei":"0A40E167-8FD9-4D04-8390-DAA6B19C3BB9"
            return date
        }
    }
    //发送数据
    sendInfo(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
                token:GameDataManager.getInstance().userData.loginToken,
                isMusicOn:GameDataManager.getInstance().userLocalData.isMusicOn,
                // isShowWelfare:GameDataManager.getInstance().kaiGuan.isOpenDailyWelfare,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "sendInfo";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
           
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("=发送信息=")
        }
    }
    hideCoverImg(){
        if (this.platform == Const.Platform.android) {
            let jsonStr = {
                uid:GameDataManager.getInstance().userData.uid,
            }
            let strJson = JSON.stringify(jsonStr)
            let className = "org/cocos2dx/javascript/AppClient";
            let methodName = "hideCoverImg";
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,strJson)
        }else if(this.platform == Const.Platform.ios){
        }else if(this.platform == Const.Platform.browser){
            FunUtils.showTip("隐藏黑屏")
        }

    }
}
