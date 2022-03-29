import AudioManager from "../core/Manager/AudioManager";
import ViewManager from "../core/Manager/ViewManager";
import FightManger from "./fight/FightManger";
import EveryDayReward from "./view/EveryDayReward";
import gift from "./view/gift";
import GoldPig from "./view/GoldPig";
import hongBaoCunQianGuan from "./view/hongBaoCunQianGuan";
import LevelUpReward from "./view/LevelUpReward";
import zhuanpan from "./view/zhuanpan";


export class GameJSB{
    public static ViewFight; //游戏界面
    static getAndroidData(url:string,param:string,type:string){    //传入url 获取服务端数据
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "httpRequest";  
            let methodSignature = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,url,param,type);
        }
    }

    static getAndroidShowToast(str:string){    //调用安卓toast
        FightManger.getInstance().ViewFight.showText = str; 
        ViewManager.getInstance().ShowView("TextPopUp");
    }

    static getAndroidWithdrawPage(){    //调用提现页面
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "withdrawPage";  
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature);
        }
    }

    static getAndroidShowUserInfo(){    //调用个人信息页面
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "showUserInfo";  
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature);
        }
    }

    static getAndroidDismissAd(){    //通知Android关闭展示的广告
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "dismissAd";  
            let methodSignature = "()V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature);
        }
    }

    static getAndroidShowAd(type:string){    //通知Android展示的弹窗广告
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "showAd";  
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,type);
        }
    }

    static getAndroidShowRv(type:string){    //通知Android展示的全屏广告
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "showRv";  
            let methodSignature = "(Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(className,methodName,methodSignature,type);
        }
    }

    static getAndroidIsBGMEnable(){    //进入游戏获取音乐声音状态
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "isBGMEnable";  
            let methodSignature = "()I";
            return  jsb.reflection.callStaticMethod(className,methodName,methodSignature);
        }
    }

    static getAndroidIsSoundEffectEnable(){    //进入游戏获取音效声音状态
        if(FightManger.getInstance().GameModel == "android"){
            let className = "org/cocos2dx/javascript/JSB";
            let methodName = "isSoundEffectEnable";  
            let methodSignature = "()I";
            return  jsb.reflection.callStaticMethod(className,methodName,methodSignature);
        }
    }


    static initGameMusci(){ //根据上次声音设置初始化声音设置
        if(GameJSB.getAndroidIsBGMEnable() == 0){
            window['killStar'].setyinxiao(0);
        }else if(GameJSB.getAndroidIsBGMEnable() == 1){
            window['killStar'].setyinxiao(1);
        }else if(GameJSB.getAndroidIsSoundEffectEnable() == 0){
            window['killStar'].setyinliang(0);
        }else if(GameJSB.getAndroidIsSoundEffectEnable() == 1){
            window['killStar'].setyinliang(1);
        }
    }





    static loadAsset(url,type){  //加载网络资源
        return new Promise((resolve,reject)=>{
            cc.assetManager.loadRemote(url,{ ext: '.' + type },(err, asset) =>{
                if(err) reject(err)
                else if(asset){
                    if(type == 'png' || asset instanceof cc.Texture2D){
                        let sprite = new cc.SpriteFrame(asset as cc.Texture2D);
                        resolve(sprite);
                    }else if(asset instanceof cc.AudioClip){
                        resolve(asset);
                    }else{
                        console.warn("no asset")
                    };
                }
            });
        });
    }

    static initWindowApi(){ //全局注册方法
            GameJSB.ViewFight = FightManger.getInstance().ViewFight;
            window['killStar'] = {};
            window['killStar'].setyinliang = function(num:number){//调节音乐音量
                AudioManager.getInstance().setMusicVolume(num);
            }

            window['killStar'].setyinxiao = function(num:number){//调节音效音量
                AudioManager.getInstance().setSoundVolume(num);
            }
    
            window['killStar'].pauseAll = function(){
                AudioManager.getInstance().pauseAll();  //暂停所有声音
            }
    
            window['killStar'].resumeAll = function(){
                AudioManager.getInstance().resumeAll(); //恢复所有暂停的声音
            }
    
            window['killStar'].wangZhuanIconDisPlay = function(socrk:boolean){  //设置是否网赚元素展示
                GameJSB.ViewFight.isWangZhuan = socrk;
                GameJSB.ViewFight.wangZhuanIconDisPlay();
            }
    
            window['killStar'].zhuanpanNum = function(num:number){  
                GameJSB.ViewFight.zhuanpanNum = num; //设置抽奖次数
            }

            window['killStar'].obtainHttpData = function(str:string){   //设置接收服务端的数据
                GameJSB.obtainHttpData(str);
            }

            window['killStar'].obtainRvCallback = function(type:string,isPlay:string){   //设置接收服务端的全屏广告回调
                GameJSB.obtainRvCallback(type,isPlay);
            }

            window['killStar'].obtainAdCallback = function(type:string){   //设置接收服务端的弹窗广告回调
                GameJSB.obtainAdCallback(type);
            }

            window["killStar"].obtainTime = function(num:number){   //设置倒计时红包的倒计时
                cc.find("ViewTop/dongtaiIcon/gift",GameJSB.ViewFight.node).getComponent(gift).obtainTime(num);
            }  
            
            window['killStar'].GoldPigAniLabel = function(num:number){  //金猪存钱罐显示加了多少
                cc.find("dongtaiIcon/pig",GameJSB.ViewFight.ViewTop).getComponent("GoldPig").aniAction(num);
            }
    }

    static obtainAdCallback(type:string){   //安卓调用弹窗广告出来后的回调
        let obj = JSON.parse(type);
        if(cc.find("Canvas/ViewRoot/PopUpNode/HongBaoPopup/redBag")){
            let redBag = cc.find("Canvas/ViewRoot/PopUpNode/HongBaoPopup/redBag");
            redBag.y = -obj.screenHeight / 2 + obj.adHeight + redBag.height / 2 + 100;
        } 
    }


    static obtainRvCallback(type,isPlay){   //安卓调用视频广告出来后的回调
        console.log("全屏广告回调",isPlay,type)
        GameJSB.getAndroidData("/register/getUserInfo","","UserInfo")//刷新用户信息
        if(parseInt(isPlay)){
            let param;
            switch(type){
                case "倒计时红包":
                    param = {
                        type:14
                    }
                    GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards")
                    ViewManager.getInstance().CloseView("signRedWin");
                    break
                case "幸运红包":
                    param = {
                        type:5
                    }
                    GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards")
                    ViewManager.getInstance().CloseView("signRedWin");
                    break;

                case "过关红包":
                    param = {
                        type:2,
                        param:FightManger.getInstance().roundLevelNum,
                    }
                    GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards")

                    ViewManager.getInstance().CloseView("signRedWin");
                    break; 


                    
                case "幸运转盘抽奖":
                    cc.find("Canvas/ViewRoot/PopUpNode/zhuanpan").getComponent(zhuanpan).clickEvents();
                    GameJSB.getAndroidData("/config/configs","","configs")
                    break;  
                
                case "每日奖励":
                    GameJSB.getAndroidData("/userdata/dayprizevideo","","dayprizevideo");
                    break;

                case "使用道具":
                    FightManger.getInstance().onRandomProp();
                    ViewManager.getInstance().CloseView('proppop');
            }
        }else{
            switch(type){
                case "倒计时红包":
                    ViewManager.getInstance().CloseView("signRedWin");
                    break
                case "幸运红包":
                    ViewManager.getInstance().CloseView("signRedWin");
                    break;

                case "过关红包":
                    FightManger.getInstance().nextLevel();
                    ViewManager.getInstance().CloseView("signRedWin");
                    break; 

                
                case "每日奖励":
                    // GameJSB.getAndroidData("/userdata/dayprizevideo","","dayprizevideo");
                    // GameJSB.getAndroidData("/userdata/dayprizedata","","dayprizedata");
                    break;

                case "使用道具":
                    // FightManger.getInstance().onRandomProp();
                    // ViewManager.getInstance().CloseView('proppop');
            }
        }
    }


    static  useWindowFunction(num:number){    //直接调用全局方法
        window['killStar'].obtainTime(num);  //设置倒计时红包的倒计时为30秒
    }

    static obtainHttpData(str:string){  //将获取到的数据保存在全局 每次获取都刷新一次数据
        console.log("安卓回调数据str=====>",str)
        if(str){
            let obj = JSON.parse(str);
            if(obj.code == 0){
                window["killStar"][obj.cctype] = obj.data;   //将数据存入全局
                console.log("安卓回调数据data",JSON.stringify(obj.data))
                // GameJSB[obj.cctype](obj.data);
                switch(obj.cctype){
                    case "UserInfo":        GameJSB.userInfo(obj.data);              break;          //获取用户信息
                    case "rewards":         GameJSB.rewards(obj.data);               break;          //积分奖励接口
                    case "upgamelvl":       GameJSB.upgamelvl(obj.data);             break;          //关卡过关保存记录
                    case "adRecord":        GameJSB.adRecord(obj.data);              break;          //广告曝光点击上报地址
                    case "getAdType":       GameJSB.getAdType(obj.data);             break;          //返回广告类型
                    case "adidconfig":      GameJSB.adidconfig(obj.data);            break;          //广告位相关配置配置
                    case "getvideodata":    GameJSB.getvideodata(obj.data);          break;          //游戏上方定时红包
                    case "configs":         GameJSB.configs(obj.data);               break;          //一些配置
                    case "dayprizedata":    GameJSB.dayprizedata(obj.data);          break;          //获取每日奖励用户数据
                    case "dayprizevideo":   GameJSB.dayprizevideo(obj.data);         break;          //每日奖励用户看完视频调用
                    case "dayprizecash":    GameJSB.dayprizecash(obj.data);          break;          //每日奖励用户提现
                    case "gamelvlprizedata":GameJSB.gamelvlprizedata(obj.data);      break;          //用户等级奖励数据
                    case "autoUpdate":      GameJSB.autoUpdate(obj.data);            break;          //首页提示更新接口
                }
            }else{
                console.log(obj.message + "================");
            }
        }
    }

    public static userInfo(obj){    //获取用户信息
        cc.find("usertouxiang/LVboard/Label",this.ViewFight.ViewTop).getComponent(cc.Label).string = "Lv" + obj.gamelvl + " " + obj.lvlname;    //等级和称号
        cc.find("usertouxiang/exProess/progress",this.ViewFight.ViewTop).getComponent(cc.ProgressBar).progress = (parseFloat(obj.lvlrate)) / 100;   //升级经验进度条进度
        cc.find("usertouxiang/exProess/progress/progressLabel",this.ViewFight.ViewTop).getComponent(cc.Label).string = Math.round(parseFloat(obj.lvlrate)) + " " + "%"    //升级经验文本展示
        FightManger.getInstance().ViewFight.todayText = obj.todaysave;//今日存钱罐积分
        GameJSB.loadAsset(obj.headimgurl,"png").then((asset)=>{       //获取微信头像
            let uesrHeadHeight = cc.find("usertouxiang/headMask/touxiangkuang",this.ViewFight.ViewTop).height;
            let uesrHeadWidth = cc.find("usertouxiang/headMask/touxiangkuang",this.ViewFight.ViewTop).width;
            cc.find("usertouxiang/headMask/touxiangkuang",this.ViewFight.ViewTop).getComponent(cc.Sprite).spriteFrame = asset as cc.SpriteFrame;

            cc.find("usertouxiang/headMask/touxiangkuang",this.ViewFight.ViewTop).height = uesrHeadHeight;
            cc.find("usertouxiang/headMask/touxiangkuang",this.ViewFight.ViewTop).width = uesrHeadWidth;
        })
        cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.integral + ""   //显示用户当前积分
        cc.find("iconBottom/shengjijiangli/popLabel",this.ViewFight.ViewBottom).active = obj.lvlprizestatus == 0 ? false : true;//显示升级奖励
    }

    public static rewards(obj){     //积分奖励接口
        if(!obj.todaysave)  obj.todaysave = 0;
        this.ViewFight = FightManger.getInstance().ViewFight;
        switch(parseInt(obj.type)){
            case 14 :   //游戏区顶部倒计时红包
                FightManger.getInstance().ViewFight.luckRewardLabel = obj.plusintegral //记录下本次加了多少红包
                FightManger.getInstance().ViewFight.rewardname = obj.rewardname //本次红包文案
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额

                ViewManager.getInstance().ShowView("HongBaoPopup");

                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },3000)
                break;

            case 7 :    //新手过关红包
                FightManger.getInstance().ViewFight.luckRewardLabel = obj.plusintegral //记录下本次加了多少红包
                FightManger.getInstance().ViewFight.rewardname = obj.rewardname //本次红包文案
                ViewManager.getInstance().ShowView("HongBaoPopup");
                break;

            case 2 :    //过关红包
                FightManger.getInstance().ViewFight.luckRewardLabel = obj.plusintegral //记录下本次加了多少红包
                FightManger.getInstance().ViewFight.rewardname = obj.rewardname //本次红包文案
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额

                ViewManager.getInstance().ShowView("HongBaoPopup");
                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },1500)
                break;
            
            case 1 : //领取昨日存钱罐
                if(obj.userinteger)
                cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                GameJSB.getAndroidData("/register/getUserInfo","","UserInfo");
                break;

            case 5 : //游戏区内倒计时红包
                FightManger.getInstance().ViewFight.luckRewardLabel = obj.plusintegral //记录下本次加了多少红包
                FightManger.getInstance().ViewFight.rewardname = obj.rewardname //本次红包文案
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额

                ViewManager.getInstance().ShowView("HongBaoPopup");

                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },3000)
                break;

            case 4 : //消除红包 传入消除数量
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额
                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },1500)
                break;

            case 9 : //自动消除道具红包 传入消除数量
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额
                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },1500)
                break;

            case 3 ://幸运转盘
                this.ViewFight.zhuanpanNum = obj.lasetablenum;  //转盘剩余次数
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额
                if(obj.prizetype == 1){
                    this.ViewFight.luckRewardType = obj.prizetype;

                    FightManger.getInstance().ViewFight.luckRewardLabel = obj.plusintegral //记录下本次加了多少红包
                    FightManger.getInstance().ViewFight.rewardname = obj.rewardname //本次红包文案

                    let pKey = obj.plusintegral;
                    pKey = pKey >= 800?
                        800
                        :pKey >= 400?
                            500
                            :300;

                    switch(pKey){
                        case 300: 
                            this.ViewFight.angleStr = "少量红包";  
                        break;

                        case 500: 
                            this.ViewFight.angleStr = "中量红包";  
                            break;

                        case 800: 
                            this.ViewFight.angleStr = "大量红包";  
                            break;
                    }
                    let zp = cc.find("Canvas/ViewRoot/PopUpNode/zhuanpan").getComponent(zhuanpan);//获取转盘节点脚本
                    let roulettle = zp.node.getChildByName("roulette");
                    let time = 2;

                    zp.initAngle(zp.buildAngle(this.ViewFight.angleStr) || Math.random() * 360);//设置要转到的角度

                    zp.angleStr = this.ViewFight.angleStr;//抽到的东西是什么
                    zp.luckRewardType = obj.prizetype;//抽奖完事之后的类型判断

                    zp.doing1(roulettle,time,360);  //启动转盘
                }
                else if(obj.prizetype == 2){
                    this.ViewFight.luckRewardType = obj.prizetype;
                    switch(obj.prizenum){
                        case "0.30": 
                            this.ViewFight.angleStr = "0.3元提现";  
                            this.ViewFight.showText = "0.3元奖励已入账"
                            break;
                        case "1.00": 
                            this.ViewFight.angleStr = "1元提现";   
                            this.ViewFight.showText = "1元奖励已入账" 
                            break;
                        case "3.00": 
                            this.ViewFight.angleStr = "3元提现";   
                            this.ViewFight.showText = "3元奖励已入账" 
                            break;
                    }

                    let zp = cc.find("Canvas/ViewRoot/PopUpNode/zhuanpan").getComponent(zhuanpan);//获取转盘节点脚本
                    let roulettle = zp.node.getChildByName("roulette");
                    let time = 2;

                    zp.initAngle(zp.buildAngle(this.ViewFight.angleStr) || Math.random() * 360);//设置要转到的角度

                    zp.angleStr = this.ViewFight.angleStr;//抽到的东西是什么
                    zp.luckRewardType = obj.prizetype;//抽奖完事之后的类型判断

                    zp.doing1(roulettle,time,360);  //启动转盘

                }
                break;

            case 17 :   //快速红包
                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额
                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },1500)
                break;
            
            case 6 ://账号等级奖励
                FightManger.getInstance().ViewFight.luckRewardLabel = obj.plusintegral //记录下本次加了多少红包
                FightManger.getInstance().ViewFight.rewardname = obj.rewardname //本次红包文案

                FightManger.getInstance().ViewFight.todayText = obj.todaysave //当天存钱罐所有金额
                FightManger.getInstance().ViewFight.hongbaocunqianguan = obj.saveintegral//红包存钱罐本次金额
                setTimeout(()=>{
                    cc.find("hongbaoHome/label",this.ViewFight.ViewTop).getComponent(cc.Label).string = obj.userinteger + "" ;  //显示领完此次红包后红包总数
                    cc.find("dongtaiIcon/pig",this.ViewFight.ViewTop).getComponent(GoldPig).aniAction(obj.saveintegral); //显示本次存钱罐金额数 toast
                },1500)

                FightManger.getInstance().ViewFight.hongbaoType = "升级奖励";
                ViewManager.getInstance().ShowView("HongBaoPopup");
                break;
        }
    }

    public static upgamelvl(obj){   //关卡过关保存记录
        if(obj.lvlup == 1) this.ViewFight.lelUpLightAni();   //播放升级动画
        cc.find("usertouxiang/LVboard/Label",this.ViewFight.ViewTop).getComponent(cc.Label).string = "Lv" + obj.gamelvl + " " + obj.lvlname;    //等级和称号
        cc.find("usertouxiang/exProess/progress",this.ViewFight.ViewTop).getComponent(cc.ProgressBar).progress = (parseFloat(obj.lvlrate)) / 100;   //升级经验进度条进度
        cc.find("usertouxiang/exProess/progress/progressLabel",this.ViewFight.ViewTop).getComponent(cc.Label).string = Math.round(parseFloat(obj.lvlrate)) + " " + "%"    //升级经验文本展示

    }

    public static adRecord(obj){    //广告曝光点击上报地址
        
    }

    public static getAdType(obj){   //返回广告类型
        
    }

    public static adidconfig(obj){  //广告位相关配置配置
        
    }

    public static getvideodata(obj){ //游戏上方定时红包
        switch(obj.videostatus){
            case 2:
                cc.find("dongtaiIcon/gift",FightManger.getInstance().ViewFight.ViewTop).getComponent(gift).obtainTime(obj.videoticktime);
                cc.find("dongtaiIcon/gift/timeLabel",FightManger.getInstance().ViewFight.ViewTop).active = true;
                cc.find("dongtaiIcon/gift/giftOpen",FightManger.getInstance().ViewFight.ViewTop).active = false;
                cc.find("dongtaiIcon/gift/giftClose",FightManger.getInstance().ViewFight.ViewTop).active = true;
                break;

            case 3:
                cc.find("dongtaiIcon/gift/timeLabel",FightManger.getInstance().ViewFight.ViewTop).active = false;
                cc.find("dongtaiIcon/gift/giftOpen",FightManger.getInstance().ViewFight.ViewTop).active = true;
                cc.find("dongtaiIcon/gift/giftClose",FightManger.getInstance().ViewFight.ViewTop).active = false;
                break;
        }
    }

    public static configs(obj){     //一些配置
        FightManger.getInstance().ViewFight.iconTime = obj.playdevide;  //获取游戏区内的倒计时红包的倒计时
        // if(obj.first == 1 && obj.userfirst != 1){  //如果是当日首次登陆并且不是新用户 弹出转盘
        //     ViewManager.getInstance().ShowView("zhuanpan");
        // }
        cc.find("zhuanpan/popLabel/label",FightManger.getInstance().ViewFight.ViewBottom.getChildByName("iconBottom")).getComponent(cc.Label).string = `剩余${obj.lasetablenum}次`
        FightManger.getInstance().ViewFight.zhuanpanNum = obj.lasetablenum;

        FightManger.getInstance().ViewFight.ViewBottom.getChildByName("iconBottom").getChildByName("kuaisuhongbao").getComponent("KuaiSuHongBao").coolingTime = obj.quickredicetime;//传cd
        FightManger.getInstance().ViewFight.ViewBottom.getChildByName("iconBottom").getChildByName("kuaisuhongbao").getComponent("KuaiSuHongBao").coolingNumMax = parseInt(obj.quickrednum.split(",")[0]);//传区间最大值
        FightManger.getInstance().ViewFight.ViewBottom.getChildByName("iconBottom").getChildByName("kuaisuhongbao").getComponent("KuaiSuHongBao").coolingNumMin = parseInt(obj.quickrednum.split(",")[1]);//传区间最小值
    }

    public static dayprizedata(obj){//获取每日奖励用户数据
        cc.find("Canvas/ViewRoot/PopUpNode/EveryDayReward").getComponent(EveryDayReward).initEveryDayRewards(obj);
    }

    public static dayprizevideo(obj){//每日奖励用户看完视频调用
        GameJSB.getAndroidData("/userdata/dayprizedata","","dayprizedata");
    }

    public static dayprizecash(obj){//每日奖励用户提现
    }

    public static gamelvlprizedata(obj){//用户等级奖励数据
        cc.find("Canvas/ViewRoot/PopUpNode/LevelUpReward").getComponent(LevelUpReward).initLevelUpRewardPopUp(obj);
    }

    public static autoUpdate(obj){//首页提示更新接口
        
    }
}