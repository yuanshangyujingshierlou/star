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
export default class InColorEffect extends cc.Component {

    @property(cc.ParticleSystem)
    Particle_1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    Particle_2: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    Particle_3: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    Particle_4: cc.ParticleSystem = null;
    onLoad () {
        
    }
    init(data){
        this.Particle_1.resetSystem();
        this.Particle_2.resetSystem();
        this.Particle_3.resetSystem();
        this.Particle_4.resetSystem();
        // setTimeout(() => {
        //     FightPoolManger.getInstance().putInColorEffect(this.node)
        // }, 1000)
        this.scheduleOnce(() => {
            FightPoolManger.getInstance().putInColorEffect(this.node)
        },1);
    }

    start () {

    }

    // update (dt) {}
}
