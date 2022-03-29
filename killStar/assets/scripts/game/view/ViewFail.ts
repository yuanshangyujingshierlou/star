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
import AudioManager from "../../core/Manager/AudioManager";
import PlatformManger from "../../core/platform/PlatformManger";
import ShareAdvType from "../../core/platform/ShareAdvType";
import Const from "../Const";
import QQPlaform from "../../core/platform/QQPlaform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewFail extends BaseView {

    @property(cc.Node)
    btnRevive: cc.Node = null; //复活
    @property(cc.Node)
    btnRestart: cc.Node = null; //重新开始
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.guoguanshibai.eventID,Const.AndroidEvent.guoguanshibai.eventName)
        this.btnRevive.on('click', this.onRevive, this);
        this.btnRestart.on('click', this.onRestart, this);
        this.setBgSize()

        QQPlaform.getInstance().qqShowJimuAd(true)
        AudioManager.getInstance().playSound("fail")
        PlatformManger.getInstance().showBanner(true)
        let pos = this.btnRestart.parent.convertToWorldSpaceAR(this.btnRestart.position)
        PlatformManger.getInstance().showBigVideo(pos.y - 40,545)
    }
    setBgSize(){
        let bg = this.node.getChildByName("bg");
        bg.height = AdaptarManager.getInstance().fullHeight;
        bg.width = AdaptarManager.getInstance().fullWidth;
    }
    init(data){

    }
    onAdv(_type){
        PlatformManger.getInstance().showVideo(_type,{
            type:_type,
            success: function () {
                this.advSuccess()
            }.bind(this),
            fail: function () {
                
            }.bind(this),

            noVideo:function(){

            }.bind(this)
        });
    }
    advSuccess(){
        this.closeUI()
        FightManger.getInstance().failRevive();
    }
    //复活
    onRevive(){
        AudioManager.getInstance().playSound("button");
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_fuhuo.eventID,Const.AndroidEvent.shipin_fuhuo.eventName)
        PlatformManger.getInstance().hideBigVideo();
        let type = ShareAdvType.ShareAdvType.revive;
        this.onAdv(type);
    }
    //重新开始
    onRestart(){
        AudioManager.getInstance().playSound("button");
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.chongxinshiwan.eventID,Const.AndroidEvent.chongxinshiwan.eventName)
        this.closeUI();
        FightManger.getInstance().failViewRestart();
    }
    closeUI(){
        PlatformManger.getInstance().showBanner(true);
        QQPlaform.getInstance().qqShowJimuAd(false);
        PlatformManger.getInstance().hideBigVideo();
        ViewManager.getInstance().CloseView("ViewFail");
    }
    start () {

    }

    // update (dt) {}
}
