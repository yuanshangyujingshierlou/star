// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import redpackSecondWin from "./redPack/redpackSecondWin";
import redpackFirstWin from "./redPack/redpackFirstWin";
import withdraw from "./redPack/withdrawalPage";
import turnPage from "./turnTable/turnPage";
import mainProfitPage from "./turnTable/mainProfitPage";
import everyRedBtn from "./turnTable/everyRedBtn";
// import {RedUtil} from "./RedUtil";
import redStarBtn from "./turnTable/redStarBtn";
import withdrawBtn from "./redPack/withdrawBtn";
import awardtip from "./turnTable/awardtip";
import everyTask from "./task/everyTask";
import everyWithdrawBtn from "./task/everyWithdrawBtn";
import videoWithdrawBtn from "./task/videoWithdrawBtn";
import redRainBtn from "./task/redRainBtn";
import loginSignBtn from "./task/loginSignBtn";
import loginSignWin from "./task/loginSignWin";


// export default class redCenter {
//     private static _instance:redCenter = null;
//     public static getInstance(): redCenter {
//         if (redCenter._instance == null) {
//             redCenter._instance = new redCenter();
//         }
//         return redCenter._instance;
//     }
//     constructor(){
//         RedUtil.eventDispatcher.on("redPackQuestStar",this.redStarredpackQuestfinsh,cc.director.getScene());
//         RedUtil.eventDispatcher.on("redpackQuestfinsh",this.redpackQuestfinsh,cc.director.getScene());
//         RedUtil.eventDispatcher.on("changeWithdrawBtnMoney",this.changeWithdrawBtnMoney,cc.director.getScene());
//         //openEveryTask
//         RedUtil.eventDispatcher.on("openEveryTask",this.openEveryTask,cc.director.getScene());
    
//     }

//     init(isDot:boolean = false,designWidth:number = 720,designHeight:number = 1280,downUrl:string = ""){
//         RedUtil._iseventDot = isDot;
//         RedUtil.WIDTH = designWidth;
//         RedUtil.HEIGHT = designHeight;

//         if(downUrl != ""){
//             //  setTimeout(() => {
//             //     RedUtil.requestInitTask();
//             //  }, 500);

//             let vdata = RedUtil.getGameIds();
//             if(vdata.OpenId != ""){
//                 RedUtil.requestInitTask();
//             }else{
//                  let count = 0;
//                  let val = setInterval(function(){
//                      console.log("count============="+count);
//                      if(RedUtil._initFinsh || count>=5){
//                          clearInterval(val);
//                      }else{
//                         RedUtil.requestInitTask();
//                         count++;
//                      }
//                  },500)
//             }


//              let xmlhttp = new XMLHttpRequest();
//              xmlhttp.timeout= 2000;
//              xmlhttp.ontimeout = function(e){
//                 xmlhttp.open("GET",downUrl,true);
//                 xmlhttp.setRequestHeader('content-type', 'application/json'); 
//                 xmlhttp.send(JSON.stringify({data:"data"}));
//              }
//              xmlhttp.open("GET",downUrl,true);
//              xmlhttp.setRequestHeader('content-type', 'application/json'); 
//              xmlhttp.send(JSON.stringify({data:"data"}));
//              xmlhttp.onreadystatechange = function(){
//                 if(xmlhttp.readyState == 4 && xmlhttp.status == 200){                 
//                   let responseText = xmlhttp.responseText;
//                  // console.log("fullfile==========="+responseText);
//                   let fullfile = JSON.parse(responseText);
//                   //RedUtil._gameInfo = fullfile.all;
//                   for(let i= 0;i<fullfile.all.length;i++){
//                      RedUtil._gameInfo.push(fullfile.all[i]);
//                   }
                                  
//                 }
//               }
//         }
//     }

//     getcurrentMoney():number{
//         let moneyNum = 0;
//         let moneyStr = cc.sys.localStorage.getItem('MoneyNum');
//         if(moneyStr){
//             moneyNum = Number(moneyStr)/100;
//             console.log("moneyNum======moneyNum==1====="+moneyNum);
//             return moneyNum;
//         }else{
//             RedUtil.requestMoney();
//             setTimeout(() => {
//                 moneyStr = cc.sys.localStorage.getItem('MoneyNum');
//                 if(moneyStr){
//                     moneyNum = Number(moneyStr)/100;
//                     console.log("moneyNum======moneyNum=2======"+moneyNum);
//                     return moneyNum;
//                 }
//             }, 500);
//         }
//        // return moneyNum;
//     }

//     openFirstredPage(parentNode:cc.Node,parmp:any){
//         RedUtil.LoadResource("alySDK/alyprofabs/redpackFirstWin",function(err,prefab){
//         let newNode = cc.instantiate(prefab);
//         if(newNode){
//             parentNode.addChild(newNode);
//             //newNode.setPosition(parentNode.width/2,parentNode.height/2);
//             RedUtil.firstRedPage = newNode;
//             if(parmp){
//                 let cla = newNode.getComponent(redpackFirstWin);
//                 cla.getParams(parmp);
//             }
//         }       

//         })
//     }

//     openRedpackFirst({callBack = { scope: null }, activeName="",redpackType = "1",ishaveVideo = true,isOpenSecondPage = false,openEventPotnum = 0,passNum = 0}:{callBack?:any,activeName?:string,redpackType?:string,ishaveVideo?:boolean,isOpenSecondPage?:boolean,openEventPotnum?:number,passNum?:number}){
//         RedUtil._currRedPackNum = passNum;
//         if(redpackType == RedUtil.redPackType.passOver && passNum<4){
//             this.openFirstredPage(cc.director.getScene(),{
//                 callBack:callBack,
//                 activeName:activeName,
//                 redpackType:redpackType,
//                 ishaveVideo:false,
//                 openEventPotnum:openEventPotnum,
//                 passNum:passNum
//             });
//         }else{
//             if(isOpenSecondPage){
//                 RedUtil._isOpenSecondPage = isOpenSecondPage;
//                 RedUtil.openQuestRedPack(activeName,redpackType,isOpenSecondPage,callBack,openEventPotnum);
//             }else{
//                 if(!ishaveVideo && redpackType == RedUtil.redPackType.newPlayer){
//                     let isfirstOpen = cc.sys.localStorage.getItem("FirstOpenRedPack");
//                    // let isfirstOpen = false;
//                     if(!isfirstOpen){
//                         let self = this;
//                         RedUtil.requestCountData({
//                             SuccessFuc:function(count:number){
//                                 if(count<1){
//                                     self.openFirstredPage(cc.director.getScene(),{
//                                         callBack:callBack,
//                                         activeName:activeName,
//                                         redpackType:redpackType,
//                                         ishaveVideo:ishaveVideo,
//                                         openEventPotnum:openEventPotnum,
//                                         passNum:passNum
//                                     });
//                                 }
//                             }
//                         });
//                     }               
//                 }else{
//                     this.openFirstredPage(cc.director.getScene(),{
//                         callBack:callBack,
//                         activeName:activeName,
//                         redpackType:redpackType,
//                         ishaveVideo:ishaveVideo,
//                         openEventPotnum:openEventPotnum,
//                         passNum:passNum
//                     });
//                 }
                
//             }
//         }
//     }

//     openSecondredPage(parentNode:cc.Node,parmp:any):void{
//         RedUtil.LoadResource("alySDK/alyprofabs/redpackSecondWin",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){
//                     parentNode.addChild(newNode);
//                     //newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                     if(parmp){
//                         let cla = newNode.getComponent(redpackSecondWin);
//                         cla.getParams(parmp);
//                     }
//             }       

//         })
//     }

//     openwithdrawPage(parentNode:cc.Node,parmp:any):void{
//         RedUtil.LoadResource("alySDK/alyprofabs/withdraw",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//             if(newNode){           
//                 parentNode.addChild(newNode);
//                 //newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                 RedUtil.withdrawPage = newNode;
//                 if(parmp){
//                     let cla = newNode.getComponent(withdraw);
//                     cla.getParams(parmp);
//                 }
//             }       
    
//         })
//      }

//         openturnPage(parentNode:cc.Node,parmp:any):void{
//             RedUtil.LoadResource("alySDK/alyprofabs/turnPage",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     //newNode.setPosition(0,0);
//                     //newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                     RedUtil._turnPage = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(turnPage);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         openmainProfit(parentNode:cc.Node,parmp:any):void{
//             RedUtil.LoadResource("alySDK/alyprofabs/mainprofit",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                    // newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                     RedUtil._mainprofit = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(mainProfitPage);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }


//         showEveryRedBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null},propTitle="",propIcon=""}:{parentNode?:any,x?:number,y?:number,callBack?:any,propTitle?:string,propIcon?:string}):void{
//             console.log("showEveryRedBtn");
//             let parmp = {
//                 callBack:callBack,
//                 propTitle:propTitle,
//                 propIcon:propIcon
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/everyRedBtn",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._everyRed = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(everyRedBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }
//         destoryEveryBtn(){
//             if(RedUtil._everyRed){
//                 RedUtil._everyRed.getComponent(everyRedBtn).destroySelf();
//             }
//         }

//         showRedStarBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null},propTitle="",propIcon=""}:{parentNode?:any,x?:number,y?:number,callBack?:any,propTitle?:string,propIcon?:string}):void{
//             console.log("showEveryRedBtn");
//             let parmp = {
//                 callBack:callBack,
//                 propTitle:propTitle,
//                 propIcon:propIcon
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/RedStarBtn",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._RedStarBtn = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(redStarBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         destoryRedStarBtn(){
//             if(RedUtil._RedStarBtn){
//             RedUtil._RedStarBtn.getComponent(redStarBtn).destroySelf();
//             }
//         }
//         showwithdrawBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null}}:{parentNode?:any,x?:number,y?:number,callBack?:any}):void{
//             let parmp = {
//                 callBack:callBack    
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/withdrawBtn",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._withdrawBtn = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(withdrawBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }
//         destorywithdrawBtn(){
//             if(RedUtil._withdrawBtn){
//                RedUtil._withdrawBtn.getComponent(withdrawBtn).destroySelf();
//             }
//         }
        
//         redStarredpackQuestfinsh(res:any){  //红包请求 分红星部分
//             if(res.redpacktype==RedUtil.redPackType.turnPage){
//                 if(RedUtil._RedquestState == 1){  //查看我的每日分红
//                     if(RedUtil._mainprofit){
//                         RedUtil._mainprofit.getComponent(mainProfitPage).openMyStarPage(res.money/100,res.total_money/100);
//                         cc.sys.localStorage.setItem('MoneyNum',res.total_money);
//                         if(RedUtil._withdrawBtn){
//                             RedUtil._withdrawBtn.getComponent(withdrawBtn).changeMoney(res.total_money/100);
//                         }
//                     }
//                     RedUtil._RedquestState = 0;
//                 }else if(RedUtil._RedquestState == 2){            //转盘抽奖                                       
//                     let index = 0;
//                     if(res.bonus == "time5"){  //抽到分红星5分钟
//                         index = 0;
//                         if(RedUtil._everyRed){
//                             RedUtil._everyRed.getComponent(everyRedBtn).changeTime(5*60000,res.money/100,res.total_money/100);
//                         }

//                     }else if(res.bonus == "props"){
//                         index = 1;
//                     }
//                     if(RedUtil._turnPage){
//                         RedUtil._turnPage.getComponent(turnPage).startRun(index);
//                     }
//                     RedUtil._RedquestState = 0;
//                 }
//             }
//         }

//         redpackQuestfinsh(res:any,Message:any,isOpenSecondPage:boolean,openEventPotnum:number){
//             console.log("redpackQuestfinsh============");
//                 if(res.money){
//                     RedUtil._currentMoney = res.money;
//                 }                            
//                 if(res.total_money){
//                     cc.sys.localStorage.setItem('MoneyNum',res.total_money);
//                     if(RedUtil._withdrawBtn){
//                         console.log("_withdrawBtn============");
//                         RedUtil._withdrawBtn.getComponent(withdrawBtn).changeMoney(res.total_money/100);
//                     }
//                 }

//                 let redType = Message.redpackType;
//                 if(isOpenSecondPage){
//                     let parentNode = cc.director.getScene();
//                     let parmp = {callBack:Message.callBack,openEventPotnum:openEventPotnum}
//                     RedUtil.LoadResource("alySDK/alyprofabs/redpackSecondWin",function(err,prefab){
//                         let newNode = cc.instantiate(prefab);
//                         if(newNode){
//                             parentNode.addChild(newNode);
//                             newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                             if(parmp){
//                                 let cla = newNode.getComponent(redpackSecondWin);
//                                 cla.getParams(parmp);
//                             }
//                         }       
                
//                     });
//                 }else{
//                     RedUtil.redNect = true;
//                 }
//                 if(redType != RedUtil.redPackType.newPlayer){
//                     if(openEventPotnum>0){
//                         RedUtil.extportData(openEventPotnum*1000+1,0); //过关红包领取成功
//                     }
//                 }else{
//                     if(RedUtil._currRedPackNum>=4){
//                         if(openEventPotnum>0){
//                             RedUtil.extportData(openEventPotnum*1000+1,0); //过关红包领取成功
//                         }
//                     }
//                 }
//         }

//         changeWithdrawBtnMoney(money:number){
//                 console.log("changeWithdrawBtnMoney============"+money);
//                 if(RedUtil._withdrawBtn){
//                     RedUtil._withdrawBtn.getComponent(withdrawBtn).changeMoney(money);
//                 }
//         }
//         openAwardTip({Icon = "",Text = ""} :{Icon?:string,Text?:string}):void{
//             let parentNode = cc.director.getScene();
//             let parmp = {
//                 Icon:Icon,
//                 Text:Text
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/awardtip",function(err,prefab){
//                     let newNode = cc.instantiate(prefab);
//                     if(newNode){                
//                         parentNode.addChild(newNode);
//                         newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                         if(parmp){
//                             let cla = newNode.getComponent(awardtip);
//                             cla.getParams(parmp);
//                         }
//                     }       
            
//                 })
//         }

//         openEveryTask(callBack:any,messCode:any):void{
//             if(RedUtil._everyTask){
//                 RedUtil._everyTask.getComponent(everyTask).refreshMessage(messCode,callBack);
//                 return;
//             }
//             let parmp = {
//                 callBack:callBack,
//                 messageCode:messCode
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/everyTask",function (err,prefab) {
//                 let newNode = cc.instantiate(prefab);
//                 let parentNode = cc.director.getScene();
//                 console.log("openEveryTask===============");
//                 if(newNode){  
//                     RedUtil._everyTask = newNode;              
//                     parentNode.addChild(newNode);
//                    // newNode.setPosition(parentNode.width/2,parentNode.height/2);
//                     if(parmp){
//                         let cla = newNode.getComponent(everyTask);
//                         cla.getParams(parmp);
//                     }
//                 }     
//             })

//         }

//         showEveryWithdrawBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null}}:{parentNode?:any,x?:number,y?:number,callBack?:any}):void{
//             console.log("showEveryWithdrawBtn");
//             let parmp = {
//                 callBack:callBack,
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/everyWithdrawBtn",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._everyWithdrawBtn = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(everyWithdrawBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         destoryEveryWithdrawBtn(){
//             if(RedUtil._everyWithdrawBtn){
//                RedUtil._everyWithdrawBtn.getComponent(everyWithdrawBtn).destroySelf();
//                RedUtil._everyWithdrawBtn = null;
//             }
//         }

//         changeEveryTaskMessage(taskId:number,count:number){
//             RedUtil.changeEveryTaskMessage(taskId,count);
//         }

//         showvideoWithdrawBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null}}:{parentNode?:any,x?:number,y?:number,callBack?:any}):void{
//             console.log("showEveryWithdrawBtn");
//             let parmp = {
//                 callBack:callBack,
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/videoWithdrawBtn",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._videoWithdrawBtn = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(videoWithdrawBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         destoryvideoWithdrawBtn(){
//             if(RedUtil._videoWithdrawBtn){
//                RedUtil._videoWithdrawBtn.getComponent(videoWithdrawBtn).destroySelf();
//                RedUtil._videoWithdrawBtn = null;
//             }
//         }

//         showRedRainBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null}}:{parentNode?:any,x?:number,y?:number,callBack?:any}):void{
//             console.log("showRedRainBtn");
//             let parmp = {
//                 callBack:callBack,
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/redRainBtn",function(err,prefab){
//             let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._redRainBtn = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(redRainBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         destoryRedRainBtn(){
//             if(RedUtil._redRainBtn){
//                RedUtil._redRainBtn.getComponent(redRainBtn).destroySelf();
//                RedUtil._redRainBtn = null;
//             }
//         }


//         showLoginSignBtn({parentNode=cc.director.getScene(),x=0,y=0,callBack={scope:null}}:{parentNode?:any,x?:number,y?:number,callBack?:any}):void{
//             let parmp = {
//                 callBack:callBack,
//             }
//             RedUtil.LoadResource("alySDK/alyprofabs/loginSignBtn",function(err,prefab){
//                 let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     newNode.setPosition(x,y);
//                     RedUtil._loginSignBtn = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(loginSignBtn);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         openSignWin(callBack,res){
//             let parmp = {
//                 callBack:callBack,
//                 MessageCode:res
//             }
//             let parentNode = cc.director.getScene();
//             RedUtil.LoadResource("alySDK/alyprofabs/loginSIgnWin",function(err,prefab){
//                 let newNode = cc.instantiate(prefab);
//                 if(newNode){                
//                     parentNode.addChild(newNode);
//                     RedUtil._LoginSignWin = newNode;
//                     if(parmp){
//                         let cla = newNode.getComponent(loginSignWin);
//                         cla.getParams(parmp);
//                     }
//                 }       
        
//             })
//         }

//         destoryLoginSignBtn(){
//             if(RedUtil._loginSignBtn){
//                RedUtil._loginSignBtn.getComponent(loginSignBtn).destroySelf();
//                RedUtil._loginSignBtn = null;
//             }
//         }
//         //是否弹每日签到页面
//         checkOpenLoginSignWin({callBack={scope:null}}:{callBack?:any}){
//             RedUtil.requestLoginSignCount({
//                 SuccessFuc:(res:any)=>{
//                    if(res.TodayNum<4){
//                       this.openSignWin(callBack,res);
//                    }
//                 }
//             });
//         }

    
// }

