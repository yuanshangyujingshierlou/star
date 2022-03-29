// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// const {ccclass, property} = cc._decorator;
// import everyTask from "../task/everyTask";

// @ccclass
// export default class NewClass extends cc.Component {
//     @property (cc.Node)
//     topContent:cc.Node = null;

//     @property (cc.Node)
//     background:cc.Node = null;

//     @property(cc.Node)
//     bottomBtnContent:cc.Node = null;

//     @property(cc.Button)
//     v_backBtn: cc.Button = null;

//     @property (cc.Node)
//     v_rmb4:cc.Node = null;

//     @property(cc.Label)
//     v_moneyText:cc.Label = null;

//     @property(cc.Button)
//     v_littermoney:cc.Button = null;

//     @property (cc.Node)
//     v_newContent:cc.Node = null;

//     @property 
//     _BtnArr:Array<cc.Button> = [];

//     @property (cc.Node)
//     v_tipsbg:cc.Node = null;

//     @property (cc.Node)
//     v_videoBtn:cc.Node = null;

//     @property (cc.Node)
//     v_bottom:cc.Node = null;

//     @property (cc.Node)
//     v_bottomTip:cc.Node = null;


//     @property (cc.Button)
//     v_introduce:cc.Button = null;

//     @property (cc.Button)
//     v_tixBtn:cc.Button = null;


//     @property
//     videoAd:any = null;

//     @property
//     isSign:boolean = false;

//     @property
//     _qtx_index:number = 0;

//     @property
//     currMoney:number = 0;

//     @property
//     withState:number = 0;
//     @property
//     montx:Array<number> = [1,3];

//     @property
//     _callBack:any = null;

//     @property
//     cash_out:number = 0;

//     @property
//     _coolTime:number = 0;


//     // LIFE-CYCLE CALLBACKS:

//      onLoad () {
//          this.background = this.node.getChildByName("background");
//          this.topContent = this.background.getChildByName("topContent");
//          this.v_backBtn = this.topContent.getChildByName("v_backBtn").getComponent(cc.Button);
//          this.v_rmb4 = this.topContent.getChildByName("v_rmb4");
//          this.v_moneyText = this.topContent.getChildByName("v_moneyText").getComponent(cc.Label);
//          this.v_littermoney = this.topContent.getChildByName("v_littermoney").getComponent(cc.Button);
//          let bottomContent = this.background.getChildByName("bottomContent");
//          this.v_newContent = bottomContent.getChildByName("v_newContent");
//          this.v_tipsbg = this.v_newContent.getChildByName("v_tipsbg");

//          this.v_videoBtn = this.v_tipsbg.getChildByName("v_videoBtn");
//          this.v_bottom = bottomContent.getChildByName("v_bottom");
//          this.v_bottomTip = bottomContent.getChildByName("v_bottomTip");
//          this.v_introduce = this.v_bottomTip.getChildByName("v_introduce").getComponent(cc.Button);
//          this.v_tixBtn = bottomContent.getChildByName("v_tixBtn").getComponent(cc.Button);

//          let newBtnContent = this.v_newContent.getChildByName("newBtnContent");

         
//          let v_03 = newBtnContent.getChildByName("v_03").getComponent(cc.Button);
//          if(v_03){
//              this._BtnArr.push(v_03);
//          }
//          let v_10 = newBtnContent.getChildByName("v_10").getComponent(cc.Button);
//          if(v_10){
//             this._BtnArr.push(v_10);
//         }
//          let v_30 = newBtnContent.getChildByName("v_30").getComponent(cc.Button);
//          if(v_30){
//             this._BtnArr.push(v_30);
//         }
//         this.bottomBtnContent = this.v_bottom.getChildByName("bottomBtnContent");
//         let v_tx30 = this.bottomBtnContent.getChildByName("v_tx30").getComponent(cc.Button);
//         if(v_tx30){
//             this._BtnArr.push(v_tx30);
//         }
//         let v_tx50 = this.bottomBtnContent.getChildByName("v_tx50").getComponent(cc.Button);
//         if(v_tx50){
//             this._BtnArr.push(v_tx50);
//         }
//         let v_tx100 = this.bottomBtnContent.getChildByName("v_tx100").getComponent(cc.Button);
//         if(v_tx100){
//             this._BtnArr.push(v_tx100);
//         }
//         let v_tx150 = this.bottomBtnContent.getChildByName("v_tx150").getComponent(cc.Button);
//         if(v_tx150){
//             this._BtnArr.push(v_tx150);
//         }
//         let v_tx200 = this.bottomBtnContent.getChildByName("v_tx200").getComponent(cc.Button);
//         if(v_tx200){
//             this._BtnArr.push(v_tx200);
//         }
//         let money = cc.sys.localStorage.getItem('MoneyNum');
//         if(money){
//             this.currMoney = Number(money);
//             console.log("read current money is=========================="+money);
//         }
//         let date = new Date();
//         let datestr = date.getFullYear() + "-" + date.getMonth() + "-"+ date.getDate();
//         let saveda = cc.sys.localStorage.getItem('videoSignDate');
//         if(datestr == saveda){
//             this.isSign = true;
//         }
//         console.log("this.currMoney=========================="+this.currMoney);
//         let moneyd = this.currMoney > 0?(this.currMoney/100):(this.currMoney);
//         this.v_moneyText.string = moneyd.toString();

//      }

//     start () {
//          RedUtil.setScale(this.node);
//          this.background.width = this.node.width;
//          this.background.height = this.node.height;
//          this.background.setPosition(-this.node.width*0.5,this.node.height*0.5);

//         //  this.topContent.width = this.node.width;
//         //  this.topContent.height = 418;
//         //  this.topContent.x = -this.node.width*0.5;
//         //  this.topContent.y = 220;

//         //  this.bottomBtnContent.width = this.node.width;
//         //  this.bottomBtnContent.x = -this.node.width*0.5;
//         //  this.bottomBtnContent.y = 220;


//          this.v_backBtn.node.on("click",this.destroySelf,this);
//          this.v_littermoney.node.on("click",this.openMoneyRecord,this);
//          this.v_introduce.node.on("click",this.openwithdrawIn,this);//openwithdrawIn
//          this.v_videoBtn.on("click",this.videocleck,this);
//          this.v_tixBtn.node.on("click",this.tixiancleck,this);

//          if(this._BtnArr.length>0){
//              for(let i=0;i<this._BtnArr.length;i++){
//                  //this._BtnArr[i].node.on()
//                 let clickHandler = new cc.Component.EventHandler();
//                 clickHandler.target = this.node;
//                 clickHandler.component = "withdrawalPage";
//                 clickHandler.handler = "checkq";
//                 clickHandler.customEventData = i.toString();
//                 this._BtnArr[i].clickEvents.push(clickHandler);
//              }
//          }

         
//         this.setInitMessage(); 

        

//     }
//     onEnable(){
//         console.log("onEnable==========");
        
//         RedUtil.eventDispatcher.on("closewithdrawPage",this.destroySelf,this);
//         RedUtil.eventDispatcher.on("withdrawfinsh",this.awardFinsh,this);//awardFinsh

//         if(RedUtil._iseventDot){
//             RedUtil.extportData(2000,0); //进入提现界面打点
//         }
//     }

//     onDisable(){
//         RedUtil.eventDispatcher.off("closewithdrawPage");
//         RedUtil.eventDispatcher.off("withdrawfinsh");
        
//     }

//     setInitMessage():void{
//         //console.log("this.currMoney=========================="+money.toString());

//         let mwidth = this.v_moneyText.node.width;
//         let nwidth = this.v_rmb4.width;
//         let center = this.topContent.width*0.5;
//         let allw = mwidth+nwidth+8;
//         let left = (this.topContent.width - allw)*0.5+nwidth*0.5;
//         this.v_rmb4.x=left;
//         this.v_moneyText.node.x = left+8+nwidth*0.5+mwidth*0.5;

        

//     }

//     changeMessage(count:number):void{
//         this.withState = count;
//         this._qtx_index = count;
 
//         if(count == 1){
//            //this.v_newContent.visible = true;
//            if(this._BtnArr.length>2){
//                this._BtnArr[0].node.active = false;
//            }
//         }else if(count == 2){
//             if(this._BtnArr.length>2){
//                 this._BtnArr[0].node.active = false;
//                 this._BtnArr[1].node.active = false;
//             }          

//         }
//         this.changeBtnState(this._qtx_index,true,false);
//         let withCont = count;
//         console.log("withCont========"+withCont);
//         if(count>2)
//         {
//             withCont = 2;
//         }
//         this.inittips(withCont);
//         if(this.isSign){
//            this.videoCheckBtn();
//         }
//     }


//     inittips(index:number):void{
//         let data = RedUtil.showData[index];     
//         let title = this.v_tipsbg.getChildByName("title").getComponent(cc.Label);
//         let content = this.v_tipsbg.getChildByName("content").getComponent(cc.Label);
//         title.string = data.title;

//         content.string = data.content;
//         if(index == 1){
//             let daten = 0;
//             let daNum = 0;
//             let danci = cc.sys.localStorage.getItem('videosignNumber');
//             if(danci){
//                 daNum = Number(danci);
//             }
//             if(daNum){
//                 let signs = "还未签到";
//                 if(this.isSign){
//                   signs = "已签到";
//                 }
//                 content.string = "1.连续签到2天，可获得提现机会\n2.今日"+ signs + "，已连续签到"+ daNum +"天。"
//             }
            
//         }else{
//             this.v_videoBtn.active = false;
//             title.node.y = -60.482;
//         }
//       }

//     destroySelf():void{
//         RedUtil.withdrawPage = null;
//         if(this._callBack && this._callBack.nextClose){
//            if(RedUtil.getIsInitOpen()){
//               this._callBack.nextClose();
//            }           
//         }
        
//         this.node.destroy();

//     }

//     checkq(event:Event,clickIndex:number):void{
//         if(this._qtx_index == clickIndex){
//             return;
//         }
//         if(this.withState == 0){
//             if(Number(clickIndex) == 1){
//                 RedUtil.opeTips("提现完0.01元才可提现0.03元");
//                 console.log("提现完0.01元才可提现0.03元");
//                 return;
//             }else if(Number(clickIndex) == 2){
//                 RedUtil.opeTips("提现完0.03元才可提现2元");
//               console.log("提现完0.03元才可提现2元");
//               return;
//             }
//         }else if(this.withState == 1){
//             if(Number(clickIndex) == 2){
//                 RedUtil.opeTips("提现完0.03元才可提现2元");
//               return;
//             }
//         }
//         this._qtx_index = Number(clickIndex);
//         //console.log("index========="+Number(clickIndex));
//         for(var i=0;i<8;i++){
//           //console.log("i========="+i);
//             var ischeck = false;
//             if(i==Number(clickIndex)){
//               ischeck = true;
//               this.changeintruText(i);
//             }
//            // if(this._qtx[i]){
//               this.changeBtnState(i,ischeck,i>2?true:false)  //this.v_30   this._qtx[i]
//               //console.log("ischeck========="+ischeck.toString());  
//            // }
//         }

//     }
    
//     changeBtnState(index:number,isCheck:boolean,isposition:boolean):void{
//         //console.log("index=========="+index);
//         if(this._BtnArr.length<=index){
//             return;
//         }
//         let source = this._BtnArr[index];
        
//         if(source)
//         {
//            if(isCheck){                
//               cc.loader.loadRes("alySDK/alyUI/di-1",cc.SpriteFrame,function(err,spriteframe){
//                 source.enabled = false;
//                 let Background = source.node.getChildByName("Background");
//                 Background.getComponent(cc.Sprite).spriteFrame = spriteframe;
//                 let coin = Background.getChildByName("coin");   
//                 coin.color = new cc.Color(253,253,253);      
//                 let litter = Background.getChildByName("litter");
//                 litter.color = new cc.Color(253,253,253);
//                 if(isposition){
//                     coin.y = 12.4;
//                     litter.y = 11.87;
//                     let activily = Background.getChildByName("activily");
//                     if(activily){
//                         activily.active = true;
//                     }
//                 }       

//               })
                   
//            }else{
//              cc.loader.loadRes("alySDK/alyUI/biankuang",cc.SpriteFrame,function(err,spriteframe){
//                 source.enabled = true;
//                 let Background = source.node.getChildByName("Background");
//                 Background.getComponent(cc.Sprite).spriteFrame = spriteframe;
//                 let coin = Background.getChildByName("coin");   
//                 coin.color = new cc.Color(19,86,139);      
//                 let litter = Background.getChildByName("litter");
//                 litter.color = new cc.Color(19,86,139);
//                 if(isposition){
//                     coin.y = 0;
//                     litter.y = 0;
//                     let activily = Background.getChildByName("activily");
//                     if(activily){
//                         activily.active = false;
//                     }
//                 }       

//               })           
//            }
//         }
//       }
    
//     changeintruText(index:number):void{
//         console.log("index-----------"+index);
//         if(index <= 2){
//             if(this.v_tipsbg)
//             {
//                 this.v_tipsbg.active = true;

//             }
//             if(this.v_bottomTip){
//                 this.v_bottomTip.active = false;
//             }
//             if(this.v_bottom){
//                 this.v_bottom.y = -480.804;
//             }

//         }else{
//             if(this.v_bottomTip)
//             {
//                 this.v_bottomTip.active = true;
//             }
//             if(this.v_tipsbg){
//                 this.v_tipsbg.active = false;
//             }
//             if(this.v_bottom){
//                 this.v_bottom.y = -270 ;
//             }
//         }
       
//     }

//     videocleck():void{
//         console.log("videoCleck");
//         let self = this;
//         let aunId = "";
//         let qq = window["qq"];
//         if(qq.aly.aUnID){
//             aunId =  qq.aly.aUnID;
//             console.log("qq.aly.aUnID--------"+qq.aly.aUnID);
//         }
//         this.videoAd = qq.createRewardedVideoAd({
//             adUnitId:aunId
//         });
//         this.videoAd.onError((errm:any)=>{
//             console.log("emerrrrrrr====="+errm);
//             console.log("emerrrrrrr==77==="+JSON.stringify(errm));
//             RedUtil.opeTips(errm);
//         });
//         this.videoAd.onLoad(function(res:any){
//             console.log("onload====="+res);
//         })
//         this.videoAd.show().catch(err => {
//             this.videoAd.load().then(()=> {
//                 console.log("广告加载成功");      
//                 this.videoAd.show().then(()=>{
//                     console.log("广告显示成功");
//                 }).catch(err=>{
//                     console.log("广告显示失败");
//                 })
//             }).catch(err=>{
//                 console.log("广告加载失败");
//             })
//         })
        

//         this.videoAd.onClose((statue:any)=>{
//             if(statue && statue.isEnded || statue === undefined){
//                 this.videoAd.offClose();
//                 let daNum = cc.sys.localStorage.getItem('videosignNumber')
//                 if(daNum){
//                     let cnum = Number(daNum)+1;
//                     cc.sys.localStorage.setItem('videosignNumber',cnum.toString());
//                     console.log("cunm======="+cnum);
//                 }else{
//                     console.log("videosignNumber=======");
//                     cc.sys.localStorage.setItem('videosignNumber',"1");

//                 }
//                 self.videoCheckBtn();
//                 self.inittips(1);

//                 let date = new Date();
//                 let datestr = date.getFullYear() + "-" + date.getMonth() + "-"+ date.getDate();
//                 cc.sys.localStorage.setItem('videoSignDate',datestr);
                   
//                 console.log("广告关闭成功==============");
//             }else{
//                 this.videoAd.offClose();
//             }
//         });


//     }

//     videoCheckBtn():void{
//         console.log("videoCheckBtn===============");
//         let videoBtn = this.v_videoBtn;
//         let self = this;
//         cc.loader.loadRes("alySDK/alyUI/di-2",cc.SpriteFrame,function(err,spriteframe){
//              let Background = videoBtn.getChildByName("Background");
//              Background.getComponent(cc.Sprite).spriteFrame = spriteframe;
//              videoBtn.getComponent(cc.Button).enabled  = false;
//              let btnName = Background.getChildByName("btnName");
//              btnName.getComponent(cc.Label).string = "已签到";
//              btnName.x = -1.5;
//              self.isSign = true;
//         })
//     }

//     tixiancleck():void{
//         if(this.montx.length>this._qtx_index){            
//             let money = this.montx[this._qtx_index];
//             //console.log("this._qtx_index==========="+this._qtx_index);
//             console.log("this.currMoney==========="+this.currMoney);
//             if(this.currMoney>=money){
//                 if(this._qtx_index == 1){
//                     let signN = 0;
//                     let signMum = cc.sys.localStorage.getItem('videosignNumber');
//                     //console.log("signMum============="+signMum);
//                     if(signMum){
//                         signN = Number(signMum);
//                     }
//                     console.log("signMum============="+signN);
//                     if(signN<2){
//                         RedUtil.opeTips("未签到两天不能提现");
//                         return;
//                     }
//                 }   
//                 if(this._coolTime>0){
//                     RedUtil.opeTips("操作太频繁了");
//                     return;
//                 }else{
//                     this._coolTime = 2;
//                 }             
//                 RedUtil.awardRedpack(money,{
//                     SuccessFuc:(mess)=>{
//                         this.awardFinsh(mess);
//                     }
//                 });
//             }
//             else{
//                 RedUtil.opeTips("余额不足哦");
//             }
           
//         }else{
//             RedUtil.opeTips("提现失败");
//         }
        
//     }

//     awardFinsh(mess:any){
//         console.log("withdraw compelet----------"+JSON.stringify(mess));
//         if(mess.code == 0){
//             if(RedUtil._awardMoney>0){               
//                //cc.sys.localStorage.setItem('withdrawNum',(RedUtil._awardMoney).toString());
//                if(RedUtil._iseventDot){
//                 let eventId = 2001;
//                 if(RedUtil._awardMoney == 3){
//                    eventId = 2003;
//                 }
//                 RedUtil.extportData(eventId,0);//提现成功打点
//                 if(RedUtil._isFirstwithdraw && RedUtil._everyTask){
//                     RedUtil._everyTask.getComponent(everyTask).withdrawFinsh();
//                 }
//            }
//             }
//             let money = mess.total_money;
//             if(money){
//                 cc.sys.localStorage.setItem('MoneyNum',money);
//                 console.log("current money is---------------"+money);
//                 //RedUtil.changeWithdrawBtnMoney(money/100);
//                 RedUtil.eventDispatcher.emit("changeWithdrawBtnMoney",money/100);
//             }
//             console.log("提现成功----");
//             RedUtil.opeTips("提现成功");
//             RedUtil.eventDispatcher.emit("closewithdrawPage");
            
//         }else{
//             console.log("提现失败----");
//             RedUtil.opeTips("提现失败");
//             if(RedUtil._awardMoney>0)
//             {
//                 if(RedUtil._iseventDot){
//                     let eventId = 2002;
//                     if(RedUtil._awardMoney == 3){
//                        eventId = 2004;
//                     }
//                     RedUtil.extportData(eventId,0);//提现失败打点
//                 }                              
//             }else{
//                 console.log("没提现？？？");
//             }
            
//         }
//     }
    
//     getParams(parmp:any):void{
//         console.log("withdrawalPage====gegg");
//         if(parmp){
//             if(parmp.callBack){
//                 this._callBack = parmp.callBack;
//                 if(this._callBack && this._callBack.nextOpened){
//                     RedUtil.callBackRun(this.node,this._callBack.nextOpened);
//                 }
//                 this.cash_out = parmp.cash_out;
//                 this.changeMessage(this.cash_out);
//             }
            
//         }
//      }

//      openMoneyRecord():void{
//         RedUtil.LoadResource("alySDK/alyprofabs/moneyRecordPage",function(err,prefab){
//          let newNode = cc.instantiate(prefab);
//          console.log("moneyRecordPage")
//           if(newNode){
//               //newNode.setPosition(0,0);
//               cc.director.getScene().addChild(newNode);
//          }       
  
//         })
//      }

//      openwithdrawIn():void{
//         RedUtil.LoadResource("alySDK/alyprofabs/withdrawIn",function(err,prefab){
//          let newNode = cc.instantiate(prefab);
//          console.log("withdrawIn")
//           if(newNode){
//               //newNode.setPosition(0,0);
//               cc.director.getScene().addChild(newNode);
//          }       
  
//         })
//      }

//      update (dt) {
//          if(this._coolTime>0){
//             this._coolTime -= dt;
//          }
//      }
// }
