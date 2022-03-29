const {ccclass, property} = cc._decorator;

@ccclass
export default class GoldPig extends cc.Component {

    @property(cc.Node)
    goldPigRedBag:cc.Node = null;
    @property(cc.Label)
    goldPigRedBagLabel:cc.Label = null;

    sorck:boolean = false;//动画锁
    onLoad () {


    }


    start () {
    }

    update (dt) {}



    goldPigAni(){
        let node = cc.instantiate(this.goldPigRedBag);
        node.opacity = 0;
        node.setParent(this.node.getChildByName("pig").getChildByName("goldPigHongBaoHome"));
        node.width = this.goldPigRedBag.width / 2;
        node.height = this.goldPigRedBag.height / 2;
        node.setPosition(node.width * 2,node.height)

        cc.tween(node)
        .to(0.4,{x:7,y:node.height / 2,opacity:255})
        .to(0.3,{x:-7,y:-node.height / 2})
        .start()
        this.schedule(()=>{
            node.removeFromParent();
        },1.5)
    }

    aniAction(num:number){
        if(!num) return;
        if(this.sorck) return
        this.sorck = true;
        this.goldPigRedBagLabel.string = num + "";

        this.schedule(()=>{
            this.goldPigAni();
        },0.7,2)

        this.scheduleOnce(()=>{
            cc.find("displayRedBagCunQianGuan",this.node).opacity = 0;
            cc.find("displayRedBagCunQianGuan",this.node).active = true;
            cc.find("displayRedBagCunQianGuan",this.node).runAction(cc.spawn(cc.fadeIn(0.75),cc.moveTo(0.5,cc.v2(125,0))));
        },2.8)

        this.scheduleOnce(()=>{
            cc.find("displayRedBagCunQianGuan",this.node).runAction(cc.fadeOut(0.75));
        },4.8)

        this.schedule(()=>{
            cc.find("displayRedBagCunQianGuan",this.node).active = false;
            cc.find("displayRedBagCunQianGuan",this.node).setPosition(125,-50);
            this.sorck = false;
        },5.55)
    }
}
