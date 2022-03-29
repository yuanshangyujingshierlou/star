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

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreEffect extends cc.Component {

    @property(cc.ParticleSystem)
    Particle_1: cc.ParticleSystem = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    init(data){
        this.Particle_1.resetSystem();
        // setTimeout(() => {
        //     FightPoolManger.getInstance().putScoreEffect(this.node)
        // }, 600)
        this.scheduleOnce(() => {
            FightPoolManger.getInstance().putScoreEffect(this.node)
        },0.6);
    }
    start () {

    }

    // update (dt) {}
}
