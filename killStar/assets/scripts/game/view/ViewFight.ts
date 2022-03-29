// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../core/View/BaseView";
import FightManger from "../fight/FightManger";
import EventManager from "../../core/Manager/EventManager";
import AudioManager from "../../core/Manager/AudioManager";
import ViewManager from "../../core/Manager/ViewManager";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import FunUtils from "../../core/Util/FunUtils";
import GameDataManager from "../../core/Manager/GameDataManager";
import FightConst from "../fight/FightConst";
import ShareAdvType from "../../core/platform/ShareAdvType";
import FightPoolManger from "../fight/FightPoolManger";
import Guide, { GuideIds } from "../Guide";
import PlatformManger from "../../core/platform/PlatformManger";
import Const from "../Const";
import QQPlaform from "../../core/platform/QQPlaform";
import  {GameJSB}  from "../GameJSB";
// import redCenter from "../../../alySDKW/scripts/RedCenter";
// import { RedUtil } from "../../../alySDKW/scripts/RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewFight extends BaseView {

    @property(cc.Node)
    MapNode: cc.Node = null;//
    @property(cc.Node)
    ViewTop: cc.Node = null;//
    @property(cc.Node)
    ViewBottom: cc.Node = null;//
    @property(cc.Node)
    ViewCenter: cc.Node = null;//
    @property(cc.Node)
    nodeMove: cc.Node = null;//
    @property(cc.ProgressBar)
    TargetPro: cc.ProgressBar = null;//
    @property(cc.Node)
    LevelTarget: cc.Node = null;//
    @property(cc.Node)
    propBombTip: cc.Node = null;//
    @property(cc.Prefab)
    hongbaoAni:cc.Prefab = null;//

    @property(cc.Prefab)
    hongbaoIcon:cc.Prefab = null;//

    zhuanpanNum:number = null//抽奖次数
    hongbaoType:string = "" //记录红包类型
    isWangZhuan:boolean = true; //是否可以带有网赚元素
    isTouchBtn:boolean = false;
    nowScore:number = 0;    //现在的分数
    timeCallback:any = null;
    timingRedPacketCallback:any = null;
    isIconDisPlay:boolean = true;//游戏区是否有红包icon
    iconTime:number = 8;    //游戏区红包时间
    angleStr:string = "";   //抽奖转盘抽到什么
    luckRewardType:number = null; //奖励类型
    luckRewardLabel:number = null; //本次加的积分数量
    rewardname:string = "" //红包类型文案

    showText:string = "";   //展示的文本弹窗信息

    todayText:number = null;//红包存钱罐当天的金额

    banbenhaoclicknum:number = null;//点击版本号次数

    hongbaocunqianguan:number = null;//红包存钱罐每次加的数值

    onLoad () {
        this.banbenhaoclicknum = 0;
        this.MapNode.zIndex = 1;
        ViewManager.getInstance().CloseView("ViewLogin")
        AdaptarManager.getInstance().adapterFightUIBottom(this.ViewBottom)
        // AdaptarManager.getInstance().adapterFightUIMoveNode(this.nodeMove)
        AdaptarManager.getInstance().adapterFightUITop(this.ViewTop)
        FightManger.getInstance().initData(this)
        this.setLevleTarget(false)
        this.adapterFightBg()
        this.initAllBtn()
        this.initLabel()
        this.setTargetPro(0)
        this.refreshRefrshLabel()
        this.refreshHammerLabel()
        this.refreshIncolorLabel()
        this.refreshRandomLabel()
        this.refreshBombLabel()
        this.setNowTargetLabel();
        this.propBombTip.active = false;
        AudioManager.getInstance().playMusic("bg")
        this.showQQView()
        this.isFirstLoading();

//----------------------------------------------------------------------------
        // this.luckRewardLabel = 5000; //本次加的积分数量
        // this.rewardname = "倒计时红包" //红包类型文案

        this.activeState(cc.find("ViewTop/dongtaiIcon/liuxing/liuxing",this.node))
        GameJSB.initWindowApi();
        this.initJSB();
    }

    start () {
    }
    
    initJSB(){

        let getvideodata = {
            code:0,
            cctype:"getvideodata",
            data:{
                videostatus:2,
                videoticktime:10000,
            },
            message:"成功！",
        }

        let configs = {
            code:0,
            cctype:"configs",
            data:{
                playdevide:2,
                gettablenum:10000,
                lasetablenum:30,
                first:1,
                quickrednum:"2,4",
                quickredicetime:10,
            },
            message:"成功！",
        }

        let dayprizedata = {
            code:0,
            cctype:"dayprizedata",
            data:{
                uservideolast:20,
                dayvideonum:20,
                dayprizedata:[
                    {money:100,progress:15.55,cashstate:0},
                    {money:200,progress:25.55,cashstate:0},
                    {money:300,progress:35.55,cashstate:1},
                    {money:400,progress:45.55,cashstate:1},
                    {money:500,progress:55.55,cashstate:1},
                    {money:800,progress:65.55,cashstate:1}
                ]
            },
            message:"成功！",
        }
        // GameJSB.obtainHttpData(JSON.stringify(dayprizedata));
        // GameJSB.obtainHttpData(JSON.stringify(configs));
        // GameJSB.obtainHttpData(JSON.stringify(getvideodata));
//-------------------------------------------------------------------------------------------
        GameJSB.getAndroidData("/register/getUserInfo","","UserInfo");  //获取用户数据存在全局
        GameJSB.getAndroidData("/config/configs","","configs"); //获取一些配置数据存在全局

        GameJSB.getAndroidData("/userReward/getvideodata","","getvideodata")//获取游戏上方倒计时红包数据
    }


    isFirstLoading(){   //首次进入 判断机型
        let str = cc.sys.os.toLocaleLowerCase();
        if(str === "ios"){
            FightManger.getInstance().GameModel = 'iphone';
        }else if(str === "android"){
            FightManger.getInstance().GameModel = 'android';
        }else if(str === "windows"){
            FightManger.getInstance().GameModel = 'web';
        }
    }

    wangZhuanIconDisPlay(){ //是否展现网赚元素
        if(this.isWangZhuan){
            this.ViewTop.getChildByName("hongbaoHome").active = true;
            this.ViewTop.getChildByName("dongtaiIcon").getChildByName("gift").active = true;
            this.ViewTop.getChildByName("dongtaiIcon").getChildByName("pig").active = true;
            this.ViewBottom.getChildByName("iconBottom").active = true;
        }else{
            this.ViewTop.getChildByName("hongbaoHome").active = false;
            this.ViewTop.getChildByName("dongtaiIcon").getChildByName("gift").active = false;
            this.ViewTop.getChildByName("dongtaiIcon").getChildByName("pig").active = false;
            this.ViewBottom.getChildByName("iconBottom").active = false;
        }
    }

    clickbanbenhao(e){//点击版本号
        if(this.banbenhaoclicknum >= 10) e.target.opacity = 255;
        this.banbenhaoclicknum++;
    }

    activeState(node:cc.Node){  //动态icon
        if(node.name == "liuxing"){
            let doing = cc.tween()
            .by(1,{y:-10}).by(1,{y:20}).by(1,{y:-10})
            .to(1,{scale: 1}).to(1,{scale: 0.8}).to(1,{scale: 1}).to(1,{scale: 0.8})
            cc.tween(node).repeatForever(doing).start();
        }
        else if(node.name == "giftOpen"){
            let doing =cc.tween()
            .to(0.5,{angle:10})
            .to(0.5,{angle:-10})
            .to(0.5,{angle:10})
            .to(0.5,{angle:-10})
            cc.tween(node).repeatForever(doing).start();
        }else if(node.name == "giftClose"){
            let doing =cc.tween()
            .to(0.5,{angle:10})
            .to(0.5,{angle:-10})
            .to(0.5,{angle:10})
            .to(0.5,{angle:-10})
            cc.tween(node).repeatForever(doing).start();
        }
    }

    clickGoldPig(){ //点击红包存钱罐
        FightManger.getInstance().Status = 2;
        ViewManager.getInstance().ShowView("hongBaoCunQianGuan");
    }

    clickWithdrawPage(){    //点击提现 
        GameJSB.getAndroidWithdrawPage();//调用安卓提现页面
    }

    clickUserHeadPortrait(){    //点击头像
        GameJSB.getAndroidShowUserInfo();   //调用安卓个人信息页
    }

    clickRotation(){    //点击抽奖转盘
        if(FightManger.getInstance().Status == 1){
            ViewManager.getInstance().ShowView("zhuanpan")
        }
    }

    clickPropBomb(){    //点击流星道具
        if(FightManger.getInstance().Status == 1){
            ViewManager.getInstance().ShowView("proppop");
        }
    }

    clickEveryDayReward(){   //点击每日奖励
        ViewManager.getInstance().ShowView("EveryDayReward");
        FightManger.getInstance().Status = 2;
    }

    clickLevelReward(){  //点击升级奖励
        if(FightManger.getInstance().Status == 1){
            FightManger.getInstance().Status = 2;
        }
        ViewManager.getInstance().ShowView("LevelUpReward");
    }

    showQQView(){
        // redCenter.getInstance().showRedStarBtn({//抽分红行
        //     parentNode:this.ViewTop,
        //     x:220,
        //     y:-120,
        //     callBack:{
        //         onOpened:()=>{
        //             console.log("showEveryRedBtn======onOpened====");
        //         },
        //         onClosed:()=>{
        //             console.log("showEveryRedBtn=======onClosed===");
        //         },
        //         nextOpened:()=>{
        //             console.log("showEveryRedBtn=======nextOpened===123");
        //             PlatformManger.getInstance().showBanner(false)
        //         },
        //         nextClose:()=>{
        //             console.log("showEveryRedBtn=======nextClose===");
        //             PlatformManger.getInstance().showBanner(true)
        //         },
        //         luckyComplete:(data)=>{
        //             console.log("luckyComplete=======luckyComplete===",data);
        //             if(data == 1){
        //                 redCenter.getInstance().openAwardTip({
        //                     Icon:"res/prop_1",
        //                     Text:"刷新道具X1"
        //                 });
        //                 let propRefrshNum = GameDataManager.getInstance().userData.propRefrsh + 1;
        //                 GameDataManager.getInstance().userData.setPropRefrsh(propRefrshNum)
        //                 this.refreshRefrshLabel()
        //             }
        //         }
        //     },
        //     propTitle:"res/prop_1_title",
        //     propIcon:"res/prop_1"
        // });
    }
    

    lelUpLightAni(){    //升级动画
        let light = cc.find("usertouxiang/LVboard/light",this.ViewTop);
        light.active = true;
        cc.tween(light)
        .repeatForever(
            cc.tween()
            .to(3.6, {angle: 360})
            .call(()=>light.angle = 0)
        )
        .start()

        this.scheduleOnce(()=>{
            light.active = false;
        },5)
    }



    //适配背景
    adapterFightBg(){
        let bg = this.node.getChildByName("bg")
        bg.width = AdaptarManager.getInstance().fullWidth;
        bg.height = AdaptarManager.getInstance().fullHeight;
    }
    setLevleTarget(isBool){
        this.LevelTarget.active = isBool;
    }
    initLabel(){
        let score_scale_label = this.ViewBottom.getChildByName("score_scale_label").getComponent(cc.Label)
        score_scale_label.node.active = false;
        let level_1 = this.ViewCenter.getChildByName("level_label").getComponent(cc.Label)
        let target_2 = this.ViewCenter.getChildByName("target_label").getComponent(cc.Label)
        level_1.node.setPosition(cc.v2(650,30))
        target_2.node.setPosition(cc.v2(-650,-30))
    }
    setTopLevelTargetLabel(){
        let level = this.ViewTop.getChildByName("level_label").getComponent(cc.Label)
        let target = this.ViewTop.getChildByName("target_label").getComponent(cc.Label)
        level.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.level)
        target.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.getTargetScore())
    }
    setNowTargetLabel(){ //是否是新局
        if(this.nowScore == 0){
            this.nowScore = GameDataManager.getInstance().userData.nowScore;
        }
        if( GameDataManager.getInstance().userData.nowScore == 0){
            this.nowScore = GameDataManager.getInstance().userData.nowScore;
        }
        let target = this.nodeMove.getChildByName("nowtarget_label").getComponent(cc.Label)
        target.string = FunUtils.format("{1}/{2}",this.nowScore,GameDataManager.getInstance().userData.getTargetScore())
        // console.log(target.string,");
        // let progress = this.nowScore / GameDataManager.getInstance().userData.getTargetScore()
        let lastScore = GameDataManager.getInstance().userData.lastScore
        let progress = (this.nowScore - lastScore) / (GameDataManager.getInstance().userData.getTargetScore() - lastScore);
        // console.log("==progress==",progress)
        if(progress >= 1){
            progress = 1
        }
        this.setTargetPro(progress)
    }
    setTargetFinish(){
        let progress = GameDataManager.getInstance().userData.nowScore / GameDataManager.getInstance().userData.getTargetScore()
        if(progress >= 1){
            if(!this.LevelTarget.active){
                // setTimeout(() => {
                //     this.setLevleTarget(true);
                // }, 500)
                this.scheduleOnce(() => {
                    this.setLevleTarget(true);
                },0.5);
                FightManger.getInstance().addTargetCompleteEffectt()
                return true;
            }
        }
        return false;
    }
    setTargetPro(progress){
        this.TargetPro.progress = progress;
    }
    getNowTargetScorePos(){
        let target = this.nodeMove.getChildByName("nowtarget_label")
        let pos = target.parent.convertToWorldSpaceAR(target.position)
        let pos2 = this.MapNode.convertToNodeSpaceAR(pos)
        return  pos2
    }
    getPropRandomPos(){
        let target = this.ViewBottom.getChildByName("btn_random")
        let pos = target.parent.convertToWorldSpaceAR(target.position)
        let pos2 = this.MapNode.convertToNodeSpaceAR(pos)
        return  pos2
    }
    setScoreScale(num,score){
        let label = this.ViewBottom.getChildByName("score_scale_label").getComponent(cc.Label)
        label.node.active = true;
        label.node.stopAllActions()
        label.node.scale = 0.1
        label.string = FunUtils.format("{1}连消{2}",num,score)
        // let scale = cc.scaleTo(0.5,1).easing(cc.easeOut(3))
        // let seq = cc.sequence(scale,cc.delayTime(0.5),cc.callFunc(()=>{
        //     label.node.active = false;
        // },this))
        // label.node.runAction(seq)
        cc.tween(label.node)
            .to(0.5,{scale:1.1},{easing: 'quadOut'})
            .delay(0.5)
            .call(() =>{
                label.node.active = false;
            })
            .start()
    }
    
    
    //设置关卡 和目标分数
    setLevelTargetLabel(){
        let level = this.ViewCenter.getChildByName("level_label").getComponent(cc.Label)
        let target = this.ViewCenter.getChildByName("target_label").getComponent(cc.Label)
        level.string = FunUtils.format("关卡:{1}",GameDataManager.getInstance().userData.level)
        target.string = FunUtils.format("目标分数:{1}",GameDataManager.getInstance().userData.getTargetScore())
    }

    gameStartAni(){
        // GameDataManager.getInstance().userData.setNowScore(0)
        // GameDataManager.getInstance().saveUserData();
        this.setLevelTargetLabel();
        this.setTopLevelTargetLabel();
        this.setNowTargetLabel();
        FightManger.getInstance().addParticleParticleFireworks()
        // let center = this.ViewCenter;
        let level = this.ViewCenter.getChildByName("level_label").getComponent(cc.Label)
        let target = this.ViewCenter.getChildByName("target_label").getComponent(cc.Label)
        level.node.setPosition(cc.v2(650,30))
        target.node.setPosition(cc.v2(-650,-30))
        this.ViewCenter.active = true;
        // let moveLevel_1 = cc.moveTo(1,cc.v2(0,30)).easing(cc.easeIn(5))
        // let moveLevel_2 = cc.moveTo(1,cc.v2(-650,30)).easing(cc.easeIn(3))
        // let moveTarger_1 = cc.moveTo(1,cc.v2(0,-30)).easing(cc.easeIn(5))
        // let moveTarger_2 = cc.moveTo(1,cc.v2(650 ,-30)).easing(cc.easeIn(3))
        // let levelSeq = cc.sequence(moveLevel_1,cc.delayTime(0.5),moveLevel_2,cc.callFunc(() =>{
        //     // center.active = false;
        //     level.node.setPosition(cc.v2(650,30))
        //     target.node.setPosition(cc.v2(-650,-30))
        //     FightManger.getInstance().gameStart(true)
        // },this))
        // let targetlSeq = cc.sequence(moveTarger_1,cc.delayTime(0.5),moveTarger_2)
        // target.node.runAction(targetlSeq)
        // level.node.runAction(levelSeq)
        cc.tween(target.node)
            .to(1,{position:cc.v3(0,-30)}, {easing: 'sineOut'})
            .delay(0.5)
            .to(1,{position:cc.v3(-650,-30)}, {easing: 'quadIn'})
            .call(() =>{
                level.node.setPosition(cc.v2(650,30))
                target.node.setPosition(cc.v2(-650,-30))
                FightManger.getInstance().gameStart(true)
            })
            .start()
        cc.tween(level.node)
            .to(1,{position:cc.v3(0,30)}, {easing: 'sineOut'})
            .delay(0.5)
            .to(1,{position:cc.v3(650,30)}, {easing: 'quadIn'})
            .start()

    }
    //     propRefrsh:number = 0;//刷新
    // propHammer:number = 0;//锤子
    // propIncolor:number = 0;//换色
    // propRandom:number = 0;//随机消除
    refreshRefrshLabel(){
        let label = this.ViewBottom.getChildByName("btn_refrsh").getChildByName("label").getComponent(cc.Label)
        label.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.propRefrsh)
    }
    refreshHammerLabel(){
        let label = this.ViewBottom.getChildByName("btn_hammer").getChildByName("label").getComponent(cc.Label)
        label.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.propHammer)
    }
    refreshIncolorLabel(){
        let label = this.ViewBottom.getChildByName("btn_incolor").getChildByName("label").getComponent(cc.Label)
        label.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.propIncolor)
    }
    refreshRandomLabel(){
        let label = this.ViewBottom.getChildByName("btn_random").getChildByName("label").getComponent(cc.Label)
        label.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.propRandom)
    }
    refreshBombLabel(){
        let label = this.ViewBottom.getChildByName("btn_bomb").getChildByName("label").getComponent(cc.Label)
        label.string = FunUtils.format("{1}",GameDataManager.getInstance().userData.propBomb)
    }
    btnAllCallBanck(event:cc.Event,name:string){
        if(this.isTouchBtn){
            return
        }
        Guide.getInstance().closwGuid(GuideIds.gamePrompt)
        Guide.getInstance().closwGuid(GuideIds.hongBaoPrompt)
        this.isTouchBtn = true;
        AudioManager.getInstance().playSound("button")
        if(name == "btn_refrsh"){//刷新
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shuaxin.eventID,Const.AndroidEvent.shuaxin.eventName)
            if(GameDataManager.getInstance().userData.propRefrsh == 0){
                let advType = ShareAdvType.ShareAdvType.addPropRefrsh
                ViewManager.getInstance().ShowView("ViewGetProp",{AdvType:advType})
            }else{
                FightManger.getInstance().onRefreshProp(false)
            }
            this.isTouchBtn = false;
        }else if(name == "btn_hammer"){ //锤子
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.chuizi.eventID,Const.AndroidEvent.chuizi.eventName)
            if(FightManger.getInstance().Status == FightConst.GameStatus.HammerStatus){
                FightManger.getInstance().Status = FightConst.GameStatus.StartGame;
                FightPoolManger.getInstance().putHammerAni(FightManger.getInstance().HammerAniNode)
                this.isTouchBtn = false;
                return;       
            }
            if(FightManger.getInstance().Status != FightConst.GameStatus.StartGame){
                this.isTouchBtn = false;
                return;       
            }
            if(GameDataManager.getInstance().userData.propHammer == 0){
                let advType = ShareAdvType.ShareAdvType.addPropHammer;
                ViewManager.getInstance().ShowView("ViewGetProp",{AdvType:advType})
            }else{
                FightManger.getInstance().onHammerProp()
            }
            this.isTouchBtn = false;
            
        }else if(name == "btn_incolor"){//换色
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.huanse.eventID,Const.AndroidEvent.huanse.eventName)
            if(FightManger.getInstance().Status == FightConst.GameStatus.IncolorStatus){
                FightManger.getInstance().Status = FightConst.GameStatus.StartGame;
                FightManger.getInstance().closeInColorProp(false)
                this.isTouchBtn = false;
                return;       
            }
            if(GameDataManager.getInstance().userData.propIncolor == 0){
                let advType = ShareAdvType.ShareAdvType.addPropIncolor
                ViewManager.getInstance().ShowView("ViewGetProp",{AdvType:advType})
            }else{
                FightManger.getInstance().onInColorProp()
            }
            this.isTouchBtn = false;
        }else if(name == "btn_random"){//随机消除
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.xiaochu.eventID,Const.AndroidEvent.xiaochu.eventName)
            if(GameDataManager.getInstance().userData.propRandom == 0){
                let advType = ShareAdvType.ShareAdvType.addPropRandom
                ViewManager.getInstance().ShowView("ViewGetProp",{AdvType:advType})
            }else{
                FightManger.getInstance().onRandomProp()
            }
            this.isTouchBtn = false;
        }else if(name == "btn_bomb"){//随机消除
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.zhadan.eventID,Const.AndroidEvent.zhadan.eventName)
            if(FightManger.getInstance().Status == FightConst.GameStatus.BombStatus){
                FightManger.getInstance().Status = FightConst.GameStatus.StartGame;
                this.propBombTip.active = false;
                this.isTouchBtn = false;
                return;       
            }
            if(GameDataManager.getInstance().userData.propBomb == 0){
                let advType = ShareAdvType.ShareAdvType.addPropBomb
                ViewManager.getInstance().ShowView("ViewGetProp",{AdvType:advType})
            }else{
                FightManger.getInstance().onPropBomb()
            }
            this.isTouchBtn = false;
        }else if(name == "btn_gdyx"){//随机消除
            QQPlaform.getInstance().showAppBox(true)
            this.isTouchBtn = false;
        }else{
            
        }
    }
    initAllBtn(){
        let self = this;
        let btnHander = function(btnNode:cc.Node,name:string){
            EventManager.getInstance().addBtnEvent(btnNode,self.node,"ViewFight","btnAllCallBanck",name)
        }
        btnHander(this.ViewBottom.getChildByName("btn_refrsh"),"btn_refrsh") //刷新
        btnHander(this.ViewBottom.getChildByName("btn_hammer"),"btn_hammer") //锤子
        btnHander(this.ViewBottom.getChildByName("btn_incolor"),"btn_incolor") //换色
        btnHander(this.ViewBottom.getChildByName("btn_random"),"btn_random") //随机消除
        btnHander(this.ViewBottom.getChildByName("btn_bomb"),"btn_bomb") //炸弹
        btnHander(this.ViewBottom.getChildByName("btn_gdyx"),"btn_gdyx") //炸弹

        
    }
    playRefrshAction() { //
        let node = this.ViewBottom.getChildByName("btn_refrsh")
        let level = GameDataManager.getInstance().userData.level;
        node.stopAllActions()
        if(GameDataManager.getInstance().userData.isUseRefresh || level < 6 ){
            // console.log("====playRefrshAction==")
            return;
        }
        let tween = cc.tween()
            .delay(0)
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:0.9})
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:1})
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:0.9})
            .to(FightConst.FightNum.hintAnimationSpeed,{scale:1})
        tween.clone(node).repeatForever().start()
    }
    update (dt) {
        if(FightManger.getInstance().Status == 1 && this.isIconDisPlay && this.isWangZhuan){
            this.isIconDisPlay = false;
            let listenIcon = setTimeout(()=>{
                let node = cc.instantiate(this.hongbaoIcon);
                node.setParent(this.node.getChildByName("ViewBottom"))

                let num = FightConst.FightNum.rowNum;
                let sortTablePos:cc.Vec2[] = [];
                for (let row = 0; row < num; row++) { //行
                    for (let vertical = 0; vertical < num; vertical++) { //列
                        if(FightManger.getInstance().Map[row][vertical]){
                            sortTablePos.push(FightManger.getInstance().Map[row][vertical].Data.Pos)
                        }
                    }
                }

                // for(let i = 0 ; i < sortTablePos.length; i++){
                //     if(sortTablePos[i].y < this.MapNode.y + (this.MapNode.height / 2) && sortTablePos[i].y > this.MapNode.y - (this.MapNode.height / 2)){
                //         pos.push(sortTablePos[i])
                //     }
                // }
                let iconPosNum = Math.round(Math.random() * (sortTablePos.length-1));
                // console.log(pos[iconPosNum])
                if(sortTablePos[iconPosNum]){
                    node.setPosition(sortTablePos[iconPosNum].x , sortTablePos[iconPosNum].y + 350)
                }                
            },this.iconTime * 1000)
        }

    }

   
}
