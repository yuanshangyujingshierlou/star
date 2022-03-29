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
import AudioManager from "../../core/Manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TargetCompleteEffect extends cc.Component {

    @property(cc.ParticleSystem)
    Particle_1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    Particle_2: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    Particle_3: cc.ParticleSystem = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(data){
        // setTimeout(() => {
        //     this.Particle_1.resetSystem();
        //     this.Particle_2.resetSystem();
        //     this.Particle_3.resetSystem();
        //     AudioManager.getInstance().playSound("target_win")
        //     this.node.getComponent(cc.Animation).play("TargetCompleteEffect_ani")
        // }, 300)
        this.scheduleOnce(() => {
            this.Particle_1.resetSystem();
            this.Particle_2.resetSystem();
            this.Particle_3.resetSystem();
            AudioManager.getInstance().playSound("target_win")
            this.node.getComponent(cc.Animation).play("TargetCompleteEffect_ani")
        },0.27);
        // setTimeout(() => {
        //     FightPoolManger.getInstance().putTargetCompleteEffect(this.node)
        // }, 2200)
        this.scheduleOnce(() => {
            FightPoolManger.getInstance().putTargetCompleteEffect(this.node)
        },2.2);
    }

    start () {

    }

    // update (dt) {}
}
