// Learn TypeScript:

import ViewManager from "../../core/Manager/ViewManager";
import FightManger from "../fight/FightManger";
import ViewFight from "./ViewFight";

const {ccclass, property} = cc._decorator;

@ccclass
export default class hongbaoIcon extends cc.Component {

    @property(cc.Label)
    timeLabel:cc.Label = null;

    private startTime: number;

    onLoad () {
        this.node.zIndex = 101;
        cc.game.setFrameRate(30);
        this.startTime = Date.now();
    }

    start () {

    }

    update (dt) {
        this.iconTime();
        if(FightManger.getInstance().Status == 3 && this.node){
            this.node.parent.parent.getComponent("ViewFight").isIconDisPlay = true
            this.node.removeFromParent();
        }
    }

    iconTime(){
        if(parseFloat(this.timeLabel.string) >= 0){
            let lose = Date.now() - this.startTime;
            let num = (10000 - lose)/1000;
            this.timeLabel.string = num + '';
        }else{
            this.node.parent.parent.getComponent("ViewFight").isIconDisPlay = true
            this.node.removeFromParent();
        }
    }

    clickRedBagIcon(){
            ViewManager.getInstance().ShowView("signRedWin")
            this.node.parent.parent.getComponent("ViewFight").hongbaoType = "幸运红包"
            this.node.parent.parent.getComponent("ViewFight").isIconDisPlay = true
            this.node.removeFromParent();
    }
}
