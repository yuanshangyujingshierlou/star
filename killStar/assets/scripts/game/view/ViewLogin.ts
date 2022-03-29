// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PlatformManger from "../../core/platform/PlatformManger";
import Const from "../Const";
import FunUtils from "../../core/Util/FunUtils";
import HttpCallBack from "../../core/Net/HttpCallBack";
import { ConfigManager } from "../../core/Manager/ConfigManager";
import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightPoolManger from "../fight/FightPoolManger";
import GameDataManager from "../../core/Manager/GameDataManager";
import AudioManager from "../../core/Manager/AudioManager";
import DebugHT from "../DebugHT";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import FightManger from "../fight/FightManger";
// import redCenter from "../../../alySDKW/scripts/RedCenter";
// import { RedUtil } from "../../../alySDKW/scripts/RedUtil";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewLogin extends BaseView {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;//
    @property(cc.Label)
    label_pro: cc.Label = null;//
    @property(cc.Label)
    labelLoading: cc.Label = null;//
    @property(cc.Node)
    btnLogin: cc.Node = null;//
    @property(cc.Node)
    btnWxLogin: cc.Node = null;//
    @property(cc.Node)
    btnYszc: cc.Node = null;//
    @property(cc.Node)
    btnYhxy: cc.Node = null;//
    @property(cc.Toggle)
    toggle: cc.Toggle = null;
    newPro : number = 0;
    maxPro : number = 0;
    lastMaxPro : number = 0;
    updateTime :number = 0;
    appInfoData = null;
    startLogin:boolean = false;
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        if(PlatformManger.getInstance().platform == Const.Platform.ios){
            this.label_pro.node.active = false;
        }
        // this.btnLogin.on('click', this.onLogin, this);
        // this.btnWxLogin.on('click', this.onWxLogin, this);
        // this.btnYszc.on('click', this.onYSZC, this);
        // this.btnYhxy.on('click', this.onHYXY, this);
        // PlatformManger.getInstance().hideCoverImg();
        // this.toggle.isChecked = true;
        // this.showLogin()

        this.startLogin = true;
        
        // if(PlatformManger.getInstance().platform == Const.Platform.qq){
            // redCenter.getInstance().init(true,720,1280,Const.Url.QQTaskUrl + "?dt=" + new Date().getTime());
            // FightManger.getInstance().getMoney()
            // RedUtil.extportData(1000,0);
        // }
        PlatformManger.getInstance().showBanner(true)
        this.httpQQConfig()
    }
    // showLogin () {
    //     // GameDataManager.getInstance().userData.loginToken = "403e54c345cd42b0a96bcd085bf4737eac7df0d25444b1c982ddaab2ce02"
    //     // GameDataManager.getInstance().userData.uid = 162
    //     if(GameDataManager.getInstance().userData.loginToken){
    //         this.setBoolShow(false);
    //         this.getInfo()
    //         // this.setBoolShow(true);
    //     }else{
    //         PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.loginpageview.eventID,Const.AndroidEvent.loginpageview.eventName)
    //         this.setBoolShow(true);
    //     }
    // }

    // setBoolShow(isbool){
    //     this.btnLogin.active = isbool;
    //     this.btnWxLogin.active = isbool;
    //     this.progressBar.node.active = !isbool;
    //     this.label_pro.node.active = !isbool;
    //     this.labelLoading.node.active = !isbool;
    //     this.startLogin = !isbool;
    //     this.toggle.node.active = isbool;
    //     this.toggle.node.setPosition(this.toggle.node.x,-AdaptarManager.getInstance().fullHeight/2 + 50)
    // }
    // //隐私政策
    // onYSZC(){
    //     AudioManager.getInstance().playSound("button");
    //     let url = Const.Url.HttpYSZC;
    //     if(DebugHT.isDebug){
    //         url = Const.Url.HttpYSZC;
    //     }
    //     PlatformManger.getInstance().openBrowser(url);
    // }
    // //用户协议
    // onHYXY(){
    //     AudioManager.getInstance().playSound("button");
    //     let url = Const.Url.HttpYHXY;
    //     if(DebugHT.isDebug){
    //         url = Const.Url.HttpTestYHXY;
    //     }
    //     PlatformManger.getInstance().openBrowser(url);
    // }
    // onLogin(){
    //     AudioManager.getInstance().playSound("button")
    //     if(this.toggle.isChecked){
    //         PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.login_guest.eventID,Const.AndroidEvent.login_guest.eventName)
    //         this.setBoolShow(false);
    //         this.getToken(null,null,null,null)
    //     }else{
    //         FunUtils.showTip("请勾选用户协议")
    //     }
        
    // }
    // onWxLogin(){
    //     AudioManager.getInstance().playSound("button")
    //     if(this.toggle.isChecked){
    //         PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.login_weixin.eventID,Const.AndroidEvent.login_weixin.eventName)
    //         this.wxLogin()
    //     }else{
    //         FunUtils.showTip("请勾选用户协议")
    //     }
       
    // }
    // wxLogin(){
    //     PlatformManger.getInstance().wxBinding({
    //         success: function (data) {
    //             this.setBoolShow(false);
    //             this.wxLoginSuccess(data)
    //         }.bind(this),
    //         fail: function () {
    //             FunUtils.showTip("微信绑定失败!")
    //         }.bind(this)
    //     });
    // }
    // wxLoginSuccess(wxdata){
    //     let openid = wxdata.openid;
    //     let nickname = wxdata.nickname;
    //     let headimgurl = wxdata.headimgurl;
    //     let unionid = wxdata.unionid;
    //     this.getToken(openid,nickname,headimgurl,unionid)
    // }

    // //获取token
    // getToken(openid,nickname,headimgurl,unionid){
    //     this.refreshLoadInfo(0.1, "获取APP信息...");
    //     let data = PlatformManger.getInstance().getAppInfo()
    //     this.appInfoData = data;
    //     let equipment = data.imei;
    //     let packageName = data.packageName;
    //     let channel = data.channelName;
    //     let version = data.versionName;
    //     let city = data.city;
    //     DebugHT.VERSION = version;
    //     let str = FunUtils.format("equipment:{1},packageName:{2},channel:{3},version:{4}",equipment,packageName,channel,version)
    //     PlatformManger.getInstance().sendLog(str)
    //     this.refreshLoadInfo(0.2, "正在加载配置信息...");
    //     // PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.token.eventID,Const.AndroidEvent.token.eventName)
    //     let callback = function(responseText){
    //         if(responseText.code == 200){
    //             this.loadItemBlockPool()
    //         }else{

    //             this.setBoolShow(true)
    //         }
    //         // PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.token_ok.eventID,Const.AndroidEvent.token_ok.eventName)
            
    //     }.bind(this)
    //     HttpCallBack.getInstance().getToken(equipment,packageName,channel,version,openid,nickname,headimgurl,unionid,city,callback)
    // }
    // //获取个人信息
    // getInfo(){
    //     this.refreshLoadInfo(0.1, "获取APP信息...");
    //     let data = PlatformManger.getInstance().getAppInfo()
    //     this.appInfoData = data;
    //     let city = data.city;
    //     let channel = data.channelName;
    //     let version = data.versionName;
    //     DebugHT.VERSION = version;
    //     this.refreshLoadInfo(0.2, "获取配置信息...");
    //     // MainSceneManager.getInstance().MainScene.showLoading()
    //     // PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.userinfo.eventID,Const.AndroidEvent.userinfo.eventName)
    //     let callback = function(){
    //         // PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.userinfo_ok.eventID,Const.AndroidEvent.userinfo_ok.eventName)
    //         this.loadItemBlockPool()
    //     }.bind(this)
    //     HttpCallBack.getInstance().getInfo(city,channel,version,callback)
    // }
    httpQQConfig(){
        // HttpCallBack.getInstance().getGameQQConfig(()=>{
            this.loadItemBlockPool()
        // })
    }
    loadItemBlockPool(){
        this.refreshLoadInfo(0.5, "加载预制体...");
        
        let callback = function(){
            this.loadJson()
        }.bind(this)
        FightPoolManger.getInstance().loadResPrefabArr(callback)
    }
    loadJson(){
        //加载所有的json
        this.refreshLoadInfo(0.8, "加载Json...");
        ConfigManager.getInstance().loadAllConfig(()=>{
            this.getoViewFight()        
        })
    }
    getoViewFight(){
        this.refreshLoadInfo(1,"进入游戏中...");
        ViewManager.getInstance().ShowView("ViewFight");  
    }

    //刷新进图条的值
    updateProgressValue(){
        let add = 0.06;
        if (this.newPro > this.maxPro) {
            add = 0.01;
        }
        if (this.newPro < this.lastMaxPro) {
            add = 0.2;
        }
        let value = this.newPro + add;
        if (value > 1) {
            value = 1;
        }
        this.refreshProgress(value);
    }
    refreshProgress(value:number){
        this.progressBar.progress = value;
        let num = (value* 100).toFixed(0) 
        this.label_pro.string =FunUtils.format("{1}%",num)
        this.newPro = value;
    }
    refreshLoadInfo(maxPro:number,tip:string){
        this.labelLoading.string = tip
        this.lastMaxPro = this.maxPro;
        this.maxPro = maxPro;
        PlatformManger.getInstance().sendLog(tip)
    }
    update (dt) {
        if(!this.startLogin){
            return;
        }
        if(this.updateTime < 10){
            this.updateTime ++;
        }else{
            this.updateTime = 0
            this.updateProgressValue()
        }
    }
}
