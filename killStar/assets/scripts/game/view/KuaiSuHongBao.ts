import AudioManager from "../../core/Manager/AudioManager";
import FightManger from "../fight/FightManger";
import { GameJSB } from "../GameJSB";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    progress:cc.Node = null;

    coolingNum:number = null;//领取了多少次快速红包

    coolingTime:number = null;//快速红包冷却时间
    coolingNumMax:number = null;//快速红包冷却次数最大值
    coolingNumMin:number = null;//快速红包冷却次数最小值
    
    coolNumUpperLimit:number = null;//获取一次最大连续获取快速红包的次数
    onLoad () {
        this.coolingNum = 0;
        this.progress.getComponent(cc.Sprite).fillRange = 0;
    }

    start () {

        // this.coolNumUpperLimit = Math.round(4 + (4 - 4 + 1) * Math.random());

    }

    update (dt) {}

    clickIcon(){    //点击快速红包
        this.coolNumUpperLimit = Math.round(this.coolingNumMin + (this.coolingNumMax - this.coolingNumMin + 1) * Math.random());
        console.log("快速红包最大值:",this.coolingNumMax,"快速红包最小值:",this.coolingNumMin)
        console.log(`快速红包{1.cd是领取几次,2.目前领取了几次}${this.coolNumUpperLimit} , ${this.coolingNum}`)
        if(this.coolingNum < this.coolNumUpperLimit){
            let ViewBottom = FightManger.getInstance().ViewFight.ViewBottom;
            if(cc.find("iconBottom/kuaisuhongbao/popLabel",ViewBottom).active)  cc.find("iconBottom/kuaisuhongbao/popLabel",ViewBottom).active = false;
            if(this.progress.getComponent(cc.Sprite).fillRange < 1){
                AudioManager.getInstance().playSound("button")
                this.progress.getComponent(cc.Sprite).fillRange = this.progress.getComponent(cc.Sprite).fillRange + 1/7;
            }
            if(this.progress.getComponent(cc.Sprite).fillRange == 1){
                this.coolingNum++;
                let pamrm = {
                    type:17
                }
                GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(pamrm),"rewards");
                AudioManager.getInstance().playSound("xcclick")
                this.progress.getComponent(cc.Sprite).fillRange = 0;
    
                let hongbaoAni = FightManger.getInstance().ViewFight.hongbaoAni;
                let node = cc.instantiate(hongbaoAni);
                node.setParent(FightManger.getInstance().ViewFight.ViewTop)
                node.getComponent('hongbaoAni').isKuaiSuHongBao = true;
                node.setPosition(270,-1190)
                
            }
        }else{
            console.log("进入cd")
            GameJSB.getAndroidShowToast("红包领取过于频繁，休息一下吧！");
            this.scheduleOnce(()=>{
                this.coolingNum = 0;
                console.log("快速红包cd好了，重置次数为",this.coolingNum)
            },6)
        }
    }
}
