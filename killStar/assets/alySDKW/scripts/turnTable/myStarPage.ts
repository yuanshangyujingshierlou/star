// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import turnPage from "./turnPage";
import { RedUtil } from "../RedUtil";

@ccclass
export default class myStarPage extends cc.Component {

    @property(cc.Label)
    v_xianshi: cc.Label = null;

    @property(cc.Label)
    v_fenhong: cc.Label = null;

    @property(cc.Label)
    v_leiji: cc.Label = null;

    @property(cc.Label)
    v_yongjiu: cc.Label = null;

    @property (cc.Button)
    v_selectBtn:cc.Button = null;

    @property (cc.Button)
    v_closeBtn:cc.Button = null;

    @property
    v_propTitle:string = "";

    @property
    v_propIcon:string = "";

    @property
    surplusNum:number = 0;

    @property
    _callBack:any = null;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         let redBg = this.node.getChildByName("redBg");
         this.v_fenhong = redBg.getChildByName("v_fenhong").getComponent(cc.Label);
         this.v_xianshi = redBg.getChildByName("v_xianshi").getComponent(cc.Label);
         this.v_leiji = redBg.getChildByName("v_leiji").getComponent(cc.Label);
         this.v_yongjiu = redBg.getChildByName("v_yongjiu").getComponent(cc.Label);
         this.v_selectBtn = redBg.getChildByName("v_selectBtn").getComponent(cc.Button);

         this.v_closeBtn = this.node.getChildByName("v_closeBtn").getComponent(cc.Button);


     }

    start () {
         RedUtil.setScale(this.node);
         this.v_closeBtn.node.on("click",this.destroySelf,this);
         this.v_selectBtn.node.on("click",this.openTurnPage,this);

    }

    destroySelf():void{
        this.node.destroy();
    }

    openTurnPage():void{  
        let parmp = {
            starNum:this.surplusNum,
            propTitle:this.v_propTitle,
            propIcon:this.v_propIcon,
            callBack:this._callBack
        }
        cc.loader.loadRes("alySDK/alyprofabs/turnPage",function(err,prefab){
            let newNode = cc.instantiate(prefab);
             if(newNode){       
                 let parentNode = cc.director.getScene();   
                 parentNode.addChild(newNode);
                 newNode.setPosition(parentNode.width/2,parentNode.height/2);
                 
                 if(parmp){
                     let cla = newNode.getComponent(turnPage);
                     cla.getParams(parmp);
                 }
            }       
     
         })
    }

    getParams(parmp:any):void{
        if(parmp){
            if(parmp.callBack){
                this._callBack = parmp.callBack;
            }
            if(parmp.propTitle&&parmp.propTitle!=""){
                this.v_propTitle = parmp.propTitle;

            }
            if(parmp.propIcon&&parmp.propIcon!=""){
                this.v_propIcon = parmp.propIcon;
            }
            this.v_xianshi.string = "获得限时分红星："+ parmp.xianshi + "颗";
            
            this.v_fenhong.string = "今日分红："+ parmp.today + "元";
            
            this.v_leiji.string = "累计分红："+ parmp.allNum + "元";
             
            let strv = "未获得";
            if(parmp.longNum>0){
                strv = parmp.longNum + "颗";
            }
            this.v_yongjiu.string = "永久分红星："+ strv;

            this.surplusNum = parmp.starNum;
        
        }
     }

    // update (dt) {}
}
