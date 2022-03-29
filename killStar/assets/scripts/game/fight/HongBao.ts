// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightPoolManger from "./FightPoolManger";
import Guide, { GuideIds } from "../Guide";
import PlatformManger from "../../core/platform/PlatformManger";
import Const from "../Const";
import QQPlaform from "../../core/platform/QQPlaform";
import redCenter from "../../../alySDKW/scripts/RedCenter";
import GameDataManager from "../../core/Manager/GameDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HongBao extends cc.Component {

    @property(cc.ParticleSystem)
    particle_1: cc.ParticleSystem = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on('click', this.onHongbao, this);
        
    }
    init(data){
        this.particle_1.resetSystem();
        Guide.getInstance().openGuide().showHongBaoPrompt(this.node)
    }
    onHongbao(){
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.qipao_click.eventID,Const.AndroidEvent.qipao_click.eventName)
        Guide.getInstance().closwGuid(GuideIds.hongBaoPrompt)
        // FightManger.getInstance().getMoney(1)
        this.openRedpackFirst()
        FightPoolManger.getInstance().putHongBao(this.node)
    }
    openRedpackFirst():void{
        //console.log("openreddddddddddddddddddddd");
        let level = GameDataManager.getInstance().userData.level;
        redCenter.getInstance().openRedpackFirst({
            callBack:{
                onOpened:function(){
                    console.log("openFirstRd==========");
                    QQPlaform.getInstance().qqShowJimuAd(true)
                },
                onClosed:function(){
                    console.log("closefirst==========");
                    QQPlaform.getInstance().qqShowJimuAd(false)
                },
                redpackVideoClose:function(){
                    console.log("redpackVideoClose=====1=========");
                }
            },
            ishaveVideo:true,
            redpackType:"4",
            activeName:"关卡内红包",
            isOpenSecondPage:false,
            openEventPotnum:4,
            passNum:level,
        });
    }
    start () {
        
    }

    // update (dt) {}
}
