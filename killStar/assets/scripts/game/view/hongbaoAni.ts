import AdaptarManager from "../../core/Manager/AdaptarManager";
import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import FightManger from "../../game/fight/FightManger"
import { GameJSB } from "../GameJSB";
const {ccclass, property} = cc._decorator;

@ccclass
export default class hongbaoAni extends cc.Component {


    isKuaiSuHongBao:boolean = false;
    onLoad () {
        this.node.parent.zIndex = 100;
        this.node.children.forEach((child) => {
            child.active = false;
        });
    }

    start () {
        this.isKuaiSuHongBao ? this.kshbLight() : this.hongbaoLight();
    }

    update (dt) {

    }

    hongbaoLight(){
        let cont = 0;
        let parent = FightManger.getInstance().ViewFight.ViewTop;
        let hongbaoHome = cc.find("hongbaoHome",parent);
        let fullHeight = AdaptarManager.getInstance().fullHeight;
        let gaodu:number = fullHeight >= 1400 ? hongbaoHome.y * 2 + hongbaoHome.y / 2: hongbaoHome.y / 2;

        let pig = cc.find("dongtaiIcon/pig",parent);

        let time = setInterval(() => {
            if(cont == 6)   clearInterval(time)

            if(cont <= 2){
                if(FightManger.getInstance().ViewFight.hongbaocunqianguan > 0){
                    this.node.children[cont + 7].active = true;
                    cc.tween(this.node.children[cont + 7])
                    .to(0.7,{x:pig.x,y:parent.y + pig.y / 2 + parent.getChildByName("dongtaiIcon").y * 2 + gaodu, opacity:87})
                    .start();
                }

                this.node.children[cont].active = true;
                cc.tween(this.node.children[cont])
                .to(0.7,{x:hongbaoHome.x - 120,y:parent.y + gaodu, opacity:87})
                .start();
            }else{
                    this.node.children[cont].active = true;
                    cc.tween(this.node.children[cont])
                    .to(0.7,{x:hongbaoHome.x - 120,y:parent.y + gaodu, opacity:87})
                    .start();
            }
            cont++;
        }, 110);


        setTimeout(()=>{
            this.node.removeFromParent();
        },1050)
    }

    kshbLight(){    //快速红包
        let cont = 0;
        let parent = FightManger.getInstance().ViewFight.ViewTop;
        let hongbaoHome = cc.find("hongbaoHome",parent);
        let fullHeight = AdaptarManager.getInstance().fullHeight;
        let gaodu:number = fullHeight >= 1400 ? hongbaoHome.y * 2 + hongbaoHome.y / 2: hongbaoHome.y / 2;

        let pig = cc.find("dongtaiIcon/pig",parent);

        let time = setInterval(() => {
            if(cont == 6)   clearInterval(time)

            if(cont <= 2){
                if(FightManger.getInstance().ViewFight.hongbaocunqianguan > 0){
                    this.node.children[cont + 7].active = true;
                    cc.tween(this.node.children[cont + 7])
                    .to(1,{x:-270 - 290,y:890 + 97.5 + gaodu, opacity:87})
                    .start();
                }

                this.node.children[cont].active = true;
                cc.tween(this.node.children[cont])
                .to(1,{x:-270 + 225 - 90,y:1140, opacity:87})
                .start();
            }else{
                    this.node.children[cont].active = true;
                    cc.tween(this.node.children[cont])
                    .to(1,{x:-270 +225 -90,y:1140, opacity:87})
                    .start();
            }
            cont++;
        }, 180);


        setTimeout(()=>{
            this.node.removeFromParent();
        },1760)
    }
}
