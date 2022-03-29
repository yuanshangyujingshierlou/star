// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { RedUtil } from "../RedUtil";

@ccclass
export default class withdrawSuccess extends cc.Component {

    @property(cc.Button)
    ensureBtn: cc.Button = null;

    @property (cc.Label)
    getMoney: cc.Label = null;

    @property (cc.Node)
    redBg: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {       
        this.redBg = this.node.getChildByName("redBg");
        this.ensureBtn = this.redBg.getChildByName("ensureBtn").getComponent(cc.Button);
        this.getMoney = this.redBg.getChildByName("getMoney").getComponent(cc.Label);
    }

    start () {
        RedUtil.setScale(this.node);
        this.redBg.setPosition(0,0);
        this.ensureBtn.node.on("click",this.clickClose,this);

        RedUtil.setAction(this.redBg,true,null);
    }

    clickClose(){
        let node = this.node;
        RedUtil.setAction(this.redBg,false,function () {
            node.destroy();
        });
    }

    init(money){
        this.getMoney.string = money + "元";
    }

    getParams(parmp:any):void{
        if(parmp){
            if(parmp.Money){
                this.init(parmp.Money);
            }          
        }
     }

    // update (dt) {}
}
