
import { coreInit } from "../../core/coreInit";
import DebugHT from "../DebugHT";
import ViewManager from "../../core/Manager/ViewManager";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import MainSceneManager from "./MainSceneManager";
import { ConfigManager } from "../../core/Manager/ConfigManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    ViewLoading: cc.Node = null; //加载圈
    @property(cc.Node)
    loadingBg: cc.Node = null; //背景
    @property(cc.Animation)
    loadingAni: cc.Animation = null; //动画

    isShowLoading:boolean = false;
    timeCallback:Function = null;
    init(){
        
    }
    onLoad () {
        coreInit.getInstance().load()
        MainSceneManager.getInstance().init(this)
        this.ViewLoading.active = false;
        AdaptarManager.getInstance().adaptarBg(this.node.getChildByName("Main_Bg"));
        AdaptarManager.getInstance().adaptarLogo(this.node.getChildByName("Logo"));
        this.loadLoad();
        
    }
    loadLoad(){
        ViewManager.getInstance().ShowView("ViewLogin");
    }
    showLoading(){
        if(this.timeCallback){
            this.unschedule(this.timeCallback)
        }
        this.isShowLoading = false
        if(!this.ViewLoading.active){
            this.ViewLoading.active = true;
            this.loadingBg.active = false;
            this.loadingAni.play()
        }
        this.timeCallback = function(){
            if(!this.isShowLoading){
                this.loadingBg.active = true;
            }
        }.bind(this)
        this.scheduleOnce(this.timeCallback,1);
    }

    //隐藏loading
    hideLoading(){
        if(this.timeCallback){
            this.unschedule(this.timeCallback)
        }
        this.isShowLoading = true
        if(this.ViewLoading.active){
            this.ViewLoading.active = false
            this.loadingAni.stop()
        }
    }
    start () {

    }

    // update (dt) {}
}


