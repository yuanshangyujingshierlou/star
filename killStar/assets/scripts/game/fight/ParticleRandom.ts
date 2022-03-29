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
import FightConst from "./FightConst";
import FightManger from "./FightManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleRandom extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(data){
        // let move = cc.moveTo(FightConst.FightNum.randomTime,data.MovePos).easing(cc.easeOut(3))
        // let seq = cc.sequence(cc.delayTime(data.Time),move,cc.callFunc(()=>{
        //     FightPoolManger.getInstance().putParticleRandom(this.node)
        //     FightManger.getInstance().randomCheckBlock(data.XId,data.YId)
        //     if(data.IsOver){
        //         FightManger.getInstance().randomCheckNeedFall()
        //     }
        // },this))
        // this.node.runAction(seq)
        cc.tween(this.node)
            .delay(data.Time)
            .to(FightConst.FightNum.randomTime,{position:data.MovePos},{easing: 'quadOut'})
            .call(() =>{
                FightPoolManger.getInstance().putParticleRandom(this.node)
                FightManger.getInstance().randomCheckBlock(data.XId,data.YId)
                if(data.IsOver){
                    FightManger.getInstance().randomCheckNeedFall()
                }
            })
            .start()

    }
    start () {

    }

    // update (dt) {}
}
