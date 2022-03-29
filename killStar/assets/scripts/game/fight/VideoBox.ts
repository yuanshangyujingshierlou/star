// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FightPoolManger from "./FightPoolManger";
import FightManger from "./FightManger";
import ShareAdvType from "../../core/platform/ShareAdvType";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import FunUtils from "../../core/Util/FunUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VideoBox extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:
    LevelTime:number = 0;
    onLoad () {
        // this.node.on('click', this.onclick, this);
    }

    start () {

    }
    init(data){
        this.node.zIndex = 999;
        this.LevelTime = 0;
        this.playAni()
    }
    playAni(){
        this.node.getComponent(cc.Animation).play()
        let pos_1 = cc.v2(this.node.position);
        let pos_2 = cc.v2(AdaptarManager.getInstance().fullWidth/ 2 - 150, 0);
        let pos_3 = cc.v2(this.node.x, -AdaptarManager.getInstance().fullHeight/6);
        let pos_4 = cc.v2(-AdaptarManager.getInstance().fullWidth/ 2 +  150, 0);
        let time = 5;
        let tween = cc.tween()
            .to(time,{position:pos_2})
            .to(time,{position:pos_3})
            .to(time,{position:pos_4})
            .to(time,{position:pos_3})
            .to(time,{position:pos_2})
            .to(time,{position:pos_3})
            .to(time,{position:pos_4})
            .to(time,{position:pos_3})
            .to(time,{position:pos_2})
            .to(time,{position:pos_1})
            .to(time,{position:pos_4})
            .to(time,{position:pos_1})
        tween.clone(this.node).repeatForever().start()
    }
    onclick(){
        let type = ShareAdvType.ShareAdvType.videoBox;
        FightManger.getInstance().onVideoBoxAdv(type)
        this.putNode()
    }
    putNode(){
        this.node.getComponent(cc.Animation).stop()
        this.node.stopAllActions();
        FightManger.getInstance().VideoBox = null;
        FightPoolManger.getInstance().putVideoBox(this.node)
    }
    // update (dt) {}
}
