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
export default class ParticleFireworks extends cc.Component {

    @property(cc.ParticleSystem)
    particle_1: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_2: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    particle_3: cc.ParticleSystem = null;


    color = {
        "1" :{
            "1":cc.color(255,73,27),
            "2":cc.color(252,166,55),
            "3":cc.color(255,100,27),

            "4":cc.color(228,0,0),
            "5":cc.color(255,71,0),
            "6":cc.color(255,0,0),
        },
        "2" :{
            "1":cc.color(253,213,54),
            "2":cc.color(253,213,54),
            "3":cc.color(255,237,27),

            "4":cc.color(255,102,0),
            "5":cc.color(255,102,0),
            "6":cc.color(255,173,0),
        },
        "3" :{
            "1":cc.color(127,255,27),
            "2":cc.color(127,255,27),
            "3":cc.color(127,255,27),

            "4":cc.color(22,182,0),
            "5":cc.color(22,182,0),
            "6":cc.color(22,182,0),
        }
    }
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    init(data){
        this.node.scale = 0.5;
        this.particle_1.startColor = this.color[data.ColorType][1]
        this.particle_2.startColor = this.color[data.ColorType][2]
        this.particle_3.startColor = this.color[data.ColorType][3]

        this.particle_1.endColor = this.color[data.ColorType][4]
        this.particle_2.endColor = this.color[data.ColorType][5]
        this.particle_3.endColor = this.color[data.ColorType][6]
        this.node.active = false;
        // setTimeout(() => {
        //     let num = data.Index % 3;
        //     if(num == 0){
        //         num = 3
        //     }
        //     let name = "fireworks_0" + num;
        //     AudioManager.getInstance().playSound(name)
        //     this.node.active = true;
        //     this.particle_1.resetSystem();
        //     this.particle_2.resetSystem();
        //     this.particle_3.resetSystem();
        // }, data.DelayTime)
        this.scheduleOnce(() => {
            let num = data.Index % 3;
            if(num == 0){
                num = 3
            }
            let name = "fireworks_0" + num;
            AudioManager.getInstance().playSound(name)
            this.node.active = true;
            this.particle_1.resetSystem();
            this.particle_2.resetSystem();
            this.particle_3.resetSystem();
        },data.DelayTime/1000);
        // setTimeout(() => {
        //     // this.particle_1.stopSystem();
        //     // this.particle_2.stopSystem();
        //     // this.particle_3.stopSystem();
        //     FightPoolManger.getInstance().putParticleFireworks(this.node)
        // }, data.Time)
        this.scheduleOnce(() => {
            FightPoolManger.getInstance().putParticleFireworks(this.node)
        },data.Time/1000);
    }
    start () {

    }

    // update (dt) {}
}
