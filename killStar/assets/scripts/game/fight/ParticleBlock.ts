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
export default class ParticleBlock extends cc.Component {

    @property(cc.ParticleSystem)
    particle_1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_2: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_3: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_4: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_5: cc.ParticleSystem = null;

    @property(cc.ParticleSystem)
    particle_6: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_7: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_8: cc.ParticleSystem = null;


    color = {
        "1":cc.color(35,170,0),
        "2":cc.color(0,186,255),
        "3":cc.color(242,74,149),
        "4":cc.color(255,1,0),
        "5":cc.color(247,146,21),

        "6":cc.color(242,74,149),
        "7":cc.color(255,1,0),
        "8":cc.color(247,146,21),
    }

    // onLoad () {}
    init(data){
        this.node.scale = 0.5
        this.particle_1.resetSystem();
        this.particle_2.resetSystem();
        this.particle_3.resetSystem();
        this.particle_4.resetSystem();
        this.particle_5.resetSystem();

        this.particle_6.resetSystem();
        this.particle_7.resetSystem();
        this.particle_8.resetSystem();
        // this.particle_1.startColor = this.color[data.ColorType]
        this.particle_1.startColor = cc.color(255,255,255)
        this.particle_2.startColor = this.color[data.ColorType]
        this.particle_3.startColor = this.color[data.ColorType]
        this.particle_4.startColor = this.color[data.ColorType]
        this.particle_5.startColor = this.color[data.ColorType]

        this.particle_6.startColor = this.color[data.ColorType]
        this.particle_7.startColor = this.color[data.ColorType]
        this.particle_8.startColor = this.color[data.ColorType]
        // this.particle_5.startColor = cc.color(255,255,255)
        this.particle_1.endColor = cc.color(255,255,255)
        this.particle_2.endColor = this.color[data.ColorType]
        this.particle_3.endColor = this.color[data.ColorType]
        this.particle_4.endColor = this.color[data.ColorType]
        this.particle_5.endColor = cc.color(255,255,255)

        this.particle_6.endColor = this.color[data.ColorType]
        this.particle_7.endColor = this.color[data.ColorType]
        this.particle_8.endColor = cc.color(255,255,255)
        this.node.active = true;
        // setTimeout(() => {
        //     FightPoolManger.getInstance().putParticleBlock(this.node)
        // }, data.Time)

        this.scheduleOnce(() => {
            FightPoolManger.getInstance().putParticleBlock(this.node)
        },data.Time/1000);
    }
    start () {

    }

    // update (dt) {}
}
