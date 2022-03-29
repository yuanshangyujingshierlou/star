import ViewManager from "../../core/Manager/ViewManager";
import BaseView from "../../core/View/BaseView";
import ViewFight from "../../game/view/ViewFight"
import FightManger from "../../game/fight/FightManger"
import GameDataManager from "../../core/Manager/GameDataManager"
import { GameJSB } from "../GameJSB";
const {ccclass, property} = cc._decorator;

@ccclass
export default class proppop extends BaseView {

    time: number;

    onLoad () {
        // this.time = Date.now();
        // let use = this.exam();
        // cc.find("btn/useProp",this.node).active = !use;
        // cc.find("btn/readVeido",this.node).active = use;
    }

    start () {
    }

    update (dt) {

    }
    clickBtn(){
            GameJSB.getAndroidShowRv("使用道具");
    }


    exam(){
        let now = new Date(this.time);
        let killStarTime = parseInt(localStorage.getItem("killStarTime"));
        let last: Date = now;
        if(killStarTime) last = new Date(killStarTime);
        return last.getMonth() == now.getMonth() && last.getDate() == now.getDate() && now != last;
    }

    clickCloseBtn(){
        ViewManager.getInstance().CloseView('proppop');
    }
}
