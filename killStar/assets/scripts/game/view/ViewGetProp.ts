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
import ShareAdvType from "../../core/platform/ShareAdvType";
import FightConst from "../fight/FightConst";
import PlatformManger from "../../core/platform/PlatformManger";
import AudioManager from "../../core/Manager/AudioManager";
import HttpCallBack from "../../core/Net/HttpCallBack";
import Const from "../Const";
import { RedUtil } from "../../../alySDKW/scripts/RedUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewGetProp extends BaseView {

    @property(cc.Node)
    btnGetProp: cc.Node = null; //获取道具
    @property(cc.Node)
    btnClose: cc.Node = null; //取消
    @property(cc.Sprite)
    propImg: cc.Sprite = null; //
    @property(cc.Label)
    label: cc.Label = null; //
    @property(cc.Node)
    tipNode: cc.Node = null; //
    @property(cc.SpriteFrame)
    propSpritFrame: cc.SpriteFrame[] = []; //
    // LIFE-CYCLE CALLBACKS:
    data:any = null;
    onLoad () {
        this.btnGetProp.on('click', this.onGetProp, this);
        this.btnClose.on('click', this.onUiClose, this);
        this.setBgSize()
        this.btnClose.active = false;
        this.scheduleOnce(function(){
            this.btnClose.active = true;
        },2);

        PlatformManger.getInstance().showBanner(false)
        let pos = this.btnClose.parent.convertToWorldSpaceAR(this.btnClose.position)
        PlatformManger.getInstance().showBigVideo(pos.y -35 ,463)

        RedUtil.extportData(8000,0);
    }
    setBgSize(){
        let bg = this.node.getChildByName("bg");
        bg.height = AdaptarManager.getInstance().fullHeight;
        bg.width = AdaptarManager.getInstance().fullWidth;
    }
    init(data){
        this.data = data;
        this.tipNode.active = false;
        this.label.node.active = false;
        if(ShareAdvType.ShareAdvType.addPropRefrsh == data.AdvType){
            this.label.node.active = true;
            this.label.string = FunUtils.format("{1}",FightConst.PropTip.PropRefrsh)
            this.propImg.spriteFrame = this.propSpritFrame[0]
        }else if(ShareAdvType.ShareAdvType.addPropHammer == data.AdvType){
            this.label.node.active = true;
            this.label.string = FunUtils.format("{1}",FightConst.PropTip.PropHammer)
            this.propImg.spriteFrame = this.propSpritFrame[1]
        }else if(ShareAdvType.ShareAdvType.addPropIncolor== data.AdvType){
            this.label.node.active = true;
            this.label.string = FunUtils.format("{1}",FightConst.PropTip.PropIncolor)
            this.propImg.spriteFrame = this.propSpritFrame[2]
        }else if(ShareAdvType.ShareAdvType.addPropRandom== data.AdvType){
            this.label.node.active = true;
            this.label.string = FunUtils.format("{1}",FightConst.PropTip.PropRandom)
            this.propImg.spriteFrame = this.propSpritFrame[3]
        }else if(ShareAdvType.ShareAdvType.addPropBomb == data.AdvType){
            this.label.string = FunUtils.format("{1}",FightConst.PropTip.PropBomb)
            this.label.node.active = false;
            this.propImg.spriteFrame = this.propSpritFrame[4];
            this.tipNode.active = true;
        }
    }
    onAdv(_type){
        PlatformManger.getInstance().showVideo(_type,{
            type:_type,
            success: function () {
                this.advSuccess(_type)
            }.bind(this),
            fail: function () {
                
            }.bind(this),

            noVideo:function(){

            }.bind(this)
        });
    }
    // 看视频成功 (添加道具)
    advSuccess(_type){
        RedUtil.extportData(8001,0);
        if(ShareAdvType.ShareAdvType.addPropRefrsh == _type){
            this.httpGetProp(3,_type)
        }else if(ShareAdvType.ShareAdvType.addPropHammer == _type){
            this.httpGetProp(4,_type)
        }else if(ShareAdvType.ShareAdvType.addPropIncolor == _type){
            this.httpGetProp(2,_type)
        }else if(ShareAdvType.ShareAdvType.addPropRandom == _type){
            this.httpGetProp(1,_type)
        }else if(ShareAdvType.ShareAdvType.addPropBomb == _type){
            this.httpGetProp(5,_type)
        }
    }

    httpGetProp(type,_type){
        // let callback = function(responseText){
        //    this.refreshProp(_type,responseText.data.num)
        // }.bind(this)
        // HttpCallBack.getInstance().sendAddProp(type,callback)

        this.refreshProp(_type,FightConst.VideoPropNum)
    }

    refreshProp(_type,num){
        if(ShareAdvType.ShareAdvType.addPropRefrsh == _type){
            // let propRefrshNum = GameDataManager.getInstance().userData.propRefrsh + 1;
            GameDataManager.getInstance().userData.setPropRefrsh(num)
            FightManger.getInstance().ViewFight.refreshRefrshLabel()
        }else if(ShareAdvType.ShareAdvType.addPropHammer == _type){
            // let propHammerNum = GameDataManager.getInstance().userData.propHammer + 1;
            GameDataManager.getInstance().userData.setPropHammer(num)
            FightManger.getInstance().ViewFight.refreshHammerLabel()
        }else if(ShareAdvType.ShareAdvType.addPropIncolor== _type){
            // let propIncolorNum = GameDataManager.getInstance().userData.propIncolor + 1;
            GameDataManager.getInstance().userData.setPropIncolor(num)
            FightManger.getInstance().ViewFight.refreshIncolorLabel()
        }else if(ShareAdvType.ShareAdvType.addPropRandom== _type){
            // let propRandomNum = GameDataManager.getInstance().userData.propRandom + 1;
            GameDataManager.getInstance().userData.setPropRandom(num)
            FightManger.getInstance().ViewFight.refreshRandomLabel()
        }else if(ShareAdvType.ShareAdvType.addPropBomb == _type){
            // let propRandomNum = GameDataManager.getInstance().userData.propBomb + 1;
            GameDataManager.getInstance().userData.setPropBomb(num)
            FightManger.getInstance().ViewFight.refreshBombLabel()
        }
        this.viewClose()
    }
    //
    onGetProp(){
        AudioManager.getInstance().playSound("button")
        if(ShareAdvType.ShareAdvType.addPropRefrsh == this.data.AdvType){
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_shuaxin.eventID,Const.AndroidEvent.shipin_shuaxin.eventName)
        }else if(ShareAdvType.ShareAdvType.addPropHammer == this.data.AdvType){
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_chuizi.eventID,Const.AndroidEvent.shipin_chuizi.eventName)
        }else if(ShareAdvType.ShareAdvType.addPropIncolor== this.data.AdvType){
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_huanse.eventID,Const.AndroidEvent.shipin_huanse.eventName)
        }else if(ShareAdvType.ShareAdvType.addPropRandom== this.data.AdvType){
            PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.shipin_xiaochu.eventID,Const.AndroidEvent.shipin_xiaochu.eventName)
        }
        this.onAdv(this.data.AdvType)
    }
    //
    onUiClose(){
        AudioManager.getInstance().playSound("button")
       this.viewClose()
    }
    viewClose(){
        PlatformManger.getInstance().hideBigVideo()
        PlatformManger.getInstance().showBanner(true);
        ViewManager.getInstance().CloseView("ViewGetProp")
    }
    start () {

    }

    // update (dt) {}
}
