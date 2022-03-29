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
import AdaptarManager from "../../core/Manager/AdaptarManager";
import FightManger from "../fight/FightManger";
import ViewManager from "../../core/Manager/ViewManager";
import GameDataManager from "../../core/Manager/GameDataManager";
import FunUtils from "../../core/Util/FunUtils";
import AudioManager from "../../core/Manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewRegain extends BaseView {

    @property(cc.Node)
    btnContinue: cc.Node = null; //继续游戏
    @property(cc.Node)
    btnRestart: cc.Node = null; //重新开始
    @property(cc.Node)
    btnMusic: cc.Node = null; //音效
    @property(cc.Label)
    label: cc.Label = null; //
    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.btnContinue.on('click', this.onContinue, this);
        this.btnRestart.on('click', this.onRestart, this);
        this.btnMusic.on('click', this.onMusic, this);
        this.setBgSize()
        this.refreshMusic()
    }
    setBgSize(){
        let bg = this.node.getChildByName("bg");
        bg.height = AdaptarManager.getInstance().fullHeight;
        bg.width = AdaptarManager.getInstance().fullWidth;
    }
    init(data){
        if(this.getMapIs0()){ //全是0  所有游戏失败 重新开始游戏
            this.label.string = FunUtils.format("上次游戏获得了{1}分，是否继续游戏？",GameDataManager.getInstance().userData.lastScore)
        }else{
            this.label.string = FunUtils.format("上次游戏获得了{1}分，是否继续游戏？",GameDataManager.getInstance().userData.nowScore)
        }
    }
    onMusic(){

        AudioManager.getInstance().playSound("button")
        if(GameDataManager.getInstance().userLocalData.isMusicOn){
            GameDataManager.getInstance().userLocalData.setMusicOn(false) 
        }else{
            GameDataManager.getInstance().userLocalData.setMusicOn(true) 
        }
        this.refreshMusic()
    }

    refreshMusic(){
        let on = this.btnMusic.getChildByName("on")
        let off = this.btnMusic.getChildByName("off")
        if(GameDataManager.getInstance().userLocalData.isMusicOn){
            on.active = true;
            off.active = false;
        }else{
            on.active = false;
            off.active = true;
        }
    }
    getMapIs0(){
        return GameDataManager.getInstance().userData.checkMapIs0()
    }
    //继续游戏
    onContinue(){
        AudioManager.getInstance().playSound("button")
        ViewManager.getInstance().CloseView("ViewRegain")
        if(this.getMapIs0()){ //全是0  所有游戏失败 重新开始游戏
            FightManger.getInstance().failRestart();
        }else{
            FightManger.getInstance().regainContinue();
        }
        
        
    }
    //重新开始
    onRestart(){
        AudioManager.getInstance().playSound("button")
        ViewManager.getInstance().CloseView("ViewRegain")
        FightManger.getInstance().failRestart();
    }
    start () {

    }

    // update (dt) {}
}
