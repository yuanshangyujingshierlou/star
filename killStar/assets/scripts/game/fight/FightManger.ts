// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightConst from "./FightConst";
import FightPoolManger from "./FightPoolManger";
import ViewFight from "../view/ViewFight";
import ItemBlock from "./ItemBlock";
import CheckBlock from "./CheckBlock";
import GameDataManager from "../../core/Manager/GameDataManager";
import ViewManager from "../../core/Manager/ViewManager";
import FunUtils from "../../core/Util/FunUtils";
import InColor from "./InColor";
import HongBao from "./HongBao";
import Guide, { GuideIds } from "../Guide";
import HttpCallBack from "../../core/Net/HttpCallBack";
import PlatformManger from "../../core/platform/PlatformManger";
import Const from "../Const";
import { ConfigManager } from "../../core/Manager/ConfigManager";
import AudioManager from "../../core/Manager/AudioManager";
import VideoBox from "./VideoBox";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import QQPlaform from "../../core/platform/QQPlaform";
import hongbaoAni from "../view/hongbaoAni";
import { GameJSB } from "../GameJSB";
// import redCenter from "../../../alySDKW/scripts/RedCenter";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightManger {

    private static instance: FightManger = null;
    public static getInstance(): FightManger {
		if (FightManger.instance == null) {
			FightManger.instance = new FightManger();
		}
		return FightManger.instance;
    }
    ViewFight:ViewFight = null;
    Status:number = FightConst.GameStatus.NoStart ; //0 未开始 1 游戏开始 2 游戏暂停 3 游戏结束 4 下落状态 5无法触摸状态
    Map:Array<Array< ItemBlock>> = null;
    CheckBlock:CheckBlock = new CheckBlock();
    HintTimer:any = null; //
    ScoreMovePos:cc.Vec3 = null;
    HammerAniNode:cc.Node = null; //锤子Node
    inColor:InColor = null;
    HongBao:HongBao = null;
    isHavehongBao:boolean = false;//是否出过红包
    GameModel:string = null; //判断什么平台

    showView:string[] = [];
    roundLevelNum:number = null;    //游戏当前关卡
    VideoBox:VideoBox = null;

    // getMoney(){
    //     let moeny = redCenter.getInstance().getcurrentMoney();
    //     if(moeny > 80){
    //         GameDataManager.getInstance().kaiGuan.isOpenRedPackage = false;
    //     }else{
    //         GameDataManager.getInstance().kaiGuan.isOpenRedPackage = true;
    //     }
    // }
    pushShowView(viewName:string){
        for (let index = 0; index < this.showView.length; index++) {
            const element = this.showView[index];
            if(element == viewName){
                return;
            }
        }
        this.showView.push(viewName)
    }
    getMapIs0(){
        return GameDataManager.getInstance().userData.checkMapIs0()
    }
    initData(ViewFight:ViewFight){
        this.showView = [];
        this.ViewFight = ViewFight;
        this.isHavehongBao = false;
        this.ScoreMovePos = this.ViewFight.getNowTargetScorePos();
        FightManger.getInstance().Status = FightConst.GameStatus.NoStart;
        if (GameDataManager.getInstance().userData.map) {
            // ViewManager.getInstance().ShowView("ViewRegain") 
            if(this.getMapIs0()){ //全是0  所有游戏失败 重新开始游戏
                FightManger.getInstance().failRestart();
            }else{
                FightManger.getInstance().regainContinue();
            }
        }else{
            this.gameStartAni()
        }
    }
    //游戏开始动画
    gameStartAni(){
        this.ViewFight.gameStartAni()
    }
    /**
     * 
     * @param isInit 是否初始化  true 是重新刷新数据 false 获取本地数据
     */
    gameStart(isInit){
        this.initMap(isInit).then((result) => {
            if(!isInit){
                this.ViewFight.setTargetFinish();
            }
            this.Status = FightConst.GameStatus.StartGame;
            this.CheckBlock.setHint();
            this.checkGameOver();
            if(GameDataManager.getInstance().userData.level == 1){
                // if(this.CheckBlock.HintTable[16]){
                //     Guide.getInstance().openGuide().showPrompt(this.CheckBlock.HintTable[16])
                // }else{
                //     Guide.getInstance().openGuide().showPrompt(this.CheckBlock.HintTable[0])
                // }
                Guide.getInstance().openGuide().showPrompt(this.CheckBlock.HintTable[0])
            }
        })
    }
    // getRandomMap(row,vertical){
    //     let colorType = 0
    //     if(row == 0 && vertical == 0){
    //         colorType = FunUtils.getRandom(1,5)
    //     }else{
    //         let type =  GameDataManager.getInstance().userData.map[0][0]
    //         // Math.random()  0<=r<1 随机小数
    //         let random = Math.random()
    //         if(random <= FightConst.randomRowNum){  //出现的概率
    //             colorType = type;
    //         }else{
    //             colorType = FunUtils.getRandom(1,5)
    //         }
    //     }

    //     return colorType;
    // }
    // getRandomMap_1(row,vertical){
    //     let colorType = 0
    //     if(row == 0 && vertical == 0){
    //         colorType = FunUtils.getRandom(1,5)
    //     }else{
    //         let type =  0;
    //         if(vertical == 0){
    //             type =  GameDataManager.getInstance().userData.map[row - 1][9]
    //         }else{
    //             type =  GameDataManager.getInstance().userData.map[row][vertical - 1]
    //         }
           
    //         // Math.random()  0<=r<1 随机小数
    //         let random = Math.random()
    //         if(random <= FightConst.randomRowNum){  //出现的概率
    //             colorType = type;
    //         }else{
    //             colorType = FunUtils.getRandom(1,5)
    //         }
    //     }

    //     return colorType;
    // }

    getRandomMap(row,vertical){
        let colorType = 0
        let randomRowNum = 0
        let randomVerticalNum = 0;
        let level = GameDataManager.getInstance().userData.level;
        if(level <= 3 ){
            randomRowNum = 0.2
            randomVerticalNum = 0.7;
        }else if(level <= 10){
            randomRowNum = 0.2
            randomVerticalNum = 0.5;
        }else{
            randomRowNum = 0.2
            randomVerticalNum = 0.4;
        }
        // randomRowNum = 0.2
        // randomVerticalNum = 0.45;
        // else {
        //     colorType = FunUtils.getRandom(1,5)
        //     return colorType;
        // }
        if(row == 0 && vertical == 0){
            colorType = FunUtils.getRandom(1,8)
        }else{
            let type =  0;
            if(vertical == 0){
                type =  GameDataManager.getInstance().userData.map[row - 1][9]
            }else{
                type =  GameDataManager.getInstance().userData.map[row][vertical - 1]
            }
            // Math.random()  0<=r<1 随机小数
            if(Math.random() <= randomRowNum){  //出现的概率
                colorType = type;
            }else{
                if(row == 0 ){
                    colorType = FunUtils.getRandom(1,8)
                }else{
                    if(Math.random() <= randomVerticalNum){ 
                        colorType = type =  GameDataManager.getInstance().userData.map[row - 1][vertical]
                    }else{
                        colorType = FunUtils.getRandom(1,8)
                    }
                }
            }
        }
        return colorType;
    }
    //初始化地图
    initMap(isInit){
        this.ViewFight.MapNode.removeAllChildren()
        this.cleanAllMap();
        this.ViewFight.playRefrshAction()
        if(this.Map){
            this.Map = null;
        }
        this.Map =  [];
        if(isInit){
            GameDataManager.getInstance().userData.map = [];
        }
        let self = this;
        let num = FightConst.FightNum.rowNum;
        // let mapJosn = ConfigManager.getInstance().config_level.getData(GameDataManager.getInstance().userData.level);
        let mapJosn = ConfigManager.getInstance().config_level.getData(1);
        return new Promise<void>((resolve, reject) => {
            for (let row = 0; row < num; row++) { //行
                self.Map[row] = [];
                if(isInit){
                    GameDataManager.getInstance().userData.map[row] = [];
                }
                for (let vertical = 0; vertical < num; vertical++) { //列
                    let colorType = FunUtils.getRandom(1,8)
                    if(!isInit){
                        colorType = GameDataManager.getInstance().userData.map[row][vertical]
                    }else{
                        colorType = this.getRandomMap(row,vertical)
                        if(mapJosn){
                            colorType = mapJosn[row][vertical]
                        }
                    }
                    self.Map[row][vertical] = this.addItemBlock(row,vertical,colorType);
                    if((row == num - 1) && (vertical == num - 1) ){
                        GameDataManager.getInstance().userData.setMap(row,vertical,colorType,true)
                    }else{
                        GameDataManager.getInstance().userData.setMap(row,vertical,colorType,false)
                    }
                }
            }
            this.CheckBlock.init() //检测初始化
            // setTimeout(() => {
            //     this.CheckBlock.check() //检测
            //     resolve();
            // }, FightConst.FightNum.startAnimationTime * num + FightConst.FightNum.animationSpeed * 1000)

            this.ViewFight.scheduleOnce(() => {
                this.CheckBlock.check() //检测
                resolve(undefined);
            },(FightConst.FightNum.startAnimationTime + 50) * num/1000 + FightConst.FightNum.animationSpeed);
        })
    }
    addItemBlock(row:number,vertical:number,colorType:number){
        if(colorType == 0){
            return null;
        }
        let x = -326;
        let y =  326;
        let parentNode = this.ViewFight.MapNode;
        x = x + FightConst.FightNum.itemBlockWidth * vertical;
        y = y - FightConst.FightNum.itemBlockWidth * row;
        let pos = cc.v2(x,y)
        let data = {
            XId:row,
            YId:vertical,
            FightManger:this,
            StartTime: (FightConst.FightNum.rowNum - row) * FightConst.FightNum.startAnimationTime,
            // StartTime: (row + vertical + 1) * FightConst.FightNum.startAnimationTime/ FightConst.FightNum.rowNum * 2 ,
            Pos:pos,
            ColorType:colorType,
        }
        let Itemblock = FightPoolManger.getInstance().createItemBlock(parentNode,pos,data)
        return Itemblock
    }
    stopAllItemBlockAni(){
        for (let row = 0; row < FightConst.FightNum.rowNum; row++) { //行
            for (let vertical = 0; vertical < FightConst.FightNum.rowNum; vertical++) { //列
                if(this.Map[row][vertical]){
                    this.Map[row][vertical].node.stopAllActions()
                    this.Map[row][vertical].node.scale = 1;
                }
            }
        }
    }
    //属性排序
    objItemSort(type){
        return function(a,b){
            var value1 = a[type];
            var value2 = b[type];
            return value1 - value2;
        }
    }

    loadRedBagAni(){  //消灭星星大于6个动画
        let hongbaoAni = this.ViewFight.hongbaoAni;
        let node = cc.instantiate(hongbaoAni);
        node.setParent(this.ViewFight.node.getChildByName("ViewTop"))
        node.setPosition(0,-700)
    }

    //检测触摸的方块 
    checkTouchBlock(xId,yId){
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        if(this.CheckBlock){
            this.stopAllItemBlockAni();
            if(this.Status == FightConst.GameStatus.HammerStatus){//锤子
                this.Status = FightConst.GameStatus.NOTouch;
                this.Map[xId][yId].playDieAction(0,()=>{
                    this.checkNeedFall(1)
                })
                FightPoolManger.getInstance().putHammerAni(this.HammerAniNode)
                this.propSuccess(FightConst.GameStatus.HammerStatus)
                this.addSocre(this.Map[xId][yId].node.x,this.Map[xId][yId].node.y,FightConst.Score.SmallType,FightConst.TargetScore.PropScore,FightConst.FightNum.dissolveAnimationSpeed,cc.color(255,255,0))
                let scoreData = GameDataManager.getInstance().userData.nowScore + FightConst.TargetScore.PropScore;
                GameDataManager.getInstance().userData.setNowScore(scoreData)
                this.ViewFight.setTargetFinish();
            }else{
                this.Status = FightConst.GameStatus.NOTouch;
                let ItemBlockTable =  this.CheckBlock.MapData[xId][yId];
                let length = ItemBlockTable.length;



                ItemBlockTable.sort(this.objItemSort("xId"))
                ItemBlockTable.sort(this.objItemSort("yId"))
                // console.log("==ItemBlockTable==",ItemBlockTable)
                let scoreNum = 0
                for (let index = 0; index < length; index++) {
                    // let score = FightConst.TargetScore.Score;
                    let score = FightConst.ItemScore;
                    const element:ItemBlock = ItemBlockTable[index];
                    // score = score + 10*index;
                    scoreNum += score;
                    this.addSocre(element.node.x,element.node.y,FightConst.Score.SmallType,score,FightConst.FightNum.dissolveAnimationSpeed * (index+1),cc.color(255,255,0))
                    if(index == length - 1){
                        let x = this.Map[xId][yId].node.x
                        yId == 0 ? x = x + FightConst.FightNum.itemBlockWidth:0
                        yId == 9 ? x = x - FightConst.FightNum.itemBlockWidth:0
                        this.ViewFight.setScoreScale(length,scoreNum)
                        this.addSocre(x,this.Map[xId][yId].node.y,FightConst.Score.BigType,scoreNum,FightConst.FightNum.dissolveAnimationSpeed * (index+1),cc.color(255,255,0))
                        let scoreData = GameDataManager.getInstance().userData.nowScore + scoreNum;
                        GameDataManager.getInstance().userData.setNowScore(scoreData)
                        element.playDieAction(FightConst.FightNum.dissolveAnimationSpeed * index,()=>{
                            this.checkNeedFall(length)
                        });
                    }else{
                        element.playDieAction(FightConst.FightNum.dissolveAnimationSpeed * index);
                    }
                }
                let isAc = this.ViewFight.setTargetFinish();
                if(!isAc){
                    this.setTextEffect(length)
                }
                // this.checkNeedFall(length)
                
            }
            
        }
    }
    //检查需要不需要下落
    checkNeedFall(length){
        // this.onFallData()
        // console.log("====length===",length)
        // setTimeout(() => {
        //     if (this.Status == FightConst.GameStatus.NOTouch) {
        //         this.Status = FightConst.GameStatus.DropStatus;
        //         this.onItemBlockFall()
        //       }
        // }, FightConst.FightNum.dissolveAnimationSpeed * 1000 * length)

        // this.ViewFight.scheduleOnce(() => {
        //     console.log("====Status===",this.Status)
        //     if (this.Status == FightConst.GameStatus.NOTouch) {
        //         this.Status = FightConst.GameStatus.DropStatus;
        //         this.onItemBlockFall()
        //     }
        // },FightConst.FightNum.dissolveAnimationSpeed * length);

        if (this.Status == FightConst.GameStatus.NOTouch) {
            this.Status = FightConst.GameStatus.DropStatus;
            this.onItemBlockFall()
        }
    }
    onFallData(){
        let fallNum = 0;
        let leftMoveNum = 0;
        let num = FightConst.FightNum.rowNum;
        //下落 
        for (let vertical = 0; vertical < num; vertical++) { //行
            fallNum = 0;
            for (let row = num - 1; row >= 0; row--) { //列
                if(this.Map[row][vertical]){
                    if(this.Map[row][vertical].status == FightConst.ItemBlockStatus.Dissolve){
                        fallNum++;
                    }else{
                        if (fallNum != 0) {
                            this.Map[row][vertical].playFallData({
                            x: row + fallNum,
                            y: vertical})
                        }
                    }
                }
            }
        }
        //左移动
        for (let vertical = 0; vertical < num; vertical++) { //行
            if(GameDataManager.getInstance().userData.map[num - 1][vertical]  == 0){
                leftMoveNum++;
            }else{
                if (leftMoveNum != 0) {
                    for (let row = 0; row < num; row++) {
                        if(this.Map[row][vertical]){
                            this.Map[row][vertical].playFallData({
                                x: row,
                                y: vertical - leftMoveNum})
                        }
                    }
                }
            }
        }
        GameDataManager.getInstance().saveUserData()
    }
    //方块下落 和左移
    onItemBlockFall(){
        let fallNum = 0;
        let leftMoveNum = 0;
        let time = 0
        let time1 = 0
        let time2 = 0
        let num = FightConst.FightNum.rowNum;
        let soundNum = 0;//音效播放次数
        //下落 
        for (let vertical = 0; vertical < num; vertical++) { //行
            fallNum = 0;
            for (let row = num - 1; row >= 0; row--) { //列
                if(this.Map[row][vertical]){
                    if(this.Map[row][vertical].status == FightConst.ItemBlockStatus.Dissolve){
                        FightPoolManger.getInstance().putItemBlock(this.Map[row][vertical].node)
                        this.Map[row][vertical] = null;
                        fallNum++;
                    }else{
                        if (fallNum != 0) {
                            time2 = 1;
                            soundNum++;
                            time = 0.08;
                            this.Map[row + fallNum][vertical] = this.Map[row][vertical]
                            this.Map[row][vertical] = null;
                            this.Map[row + fallNum][vertical].playFallAction(fallNum,{
                            x: row + fallNum,
                            y: vertical},soundNum);
                        }
                    }
                }
            }
        }
        //左移动
        for (let vertical = 0; vertical < num; vertical++) { //行
            if(!this.Map[num - 1][vertical]){
                leftMoveNum++;
            }else{
                if (leftMoveNum != 0) {
                    for (let row = 0; row < num; row++) {
                        if(this.Map[row][vertical]){
                            this.Map[row ][vertical- leftMoveNum] = this.Map[row][vertical]
                            this.Map[row][vertical] = null;
                            this.Map[row ][vertical - leftMoveNum].playLeftMoveAction(leftMoveNum,{
                                x: row ,
                                y: vertical - leftMoveNum},time*time2)
                        }
                    }
                    time1 = 1;
                }
            }
        }
        this.ViewFight.scheduleOnce(() => {
            // console.log("===检测==")
            this.CheckBlock.init() //检测初始化
            this.CheckBlock.check()
            this.CheckBlock.setHint()
            this.addHongBao()
            this.checkGameOver()
            GameDataManager.getInstance().saveUserData();
        },time*time2 + 0.05 * time1);
    }
    //检测游戏是否结束
    checkGameOver(){
        let checkData = this.CheckBlock.checkGameOver()
        if( checkData.isGameOver){
            // this.pushHongBao()
            if(this.Status == FightConst.GameStatus.RandomDropStatus){//随机下落的状态
                this.GameOver()
            }else{
                this.gameOverDissolve(checkData.singleNum)
            }
        }else{
            this.Status = FightConst.GameStatus.StartGame;
            this.showHint()
        }
    }
    //游戏结束
    gameOverDissolve(singleNum){
        this.Status = FightConst.GameStatus.EndGame;
        let num = FightConst.FightNum.rowNum;
        let isWin = GameDataManager.getInstance().userData.getIsWin()
        let callbacks = function(){
            this.cleanAllMap();
            this.GameOver();
        }.bind(this)
        if(singleNum > 0 && !isWin){
            this.Status = FightConst.GameStatus.StartGame;
            ViewManager.getInstance().ShowView("proppop");
        //     let dieNum = 0
        //     for (let row = 0; row < num; row++) { //行
        //         for (let vertical = 0; vertical < num; vertical++) { //列
        //             if(this.Map[row][vertical]){
        //                 dieNum++;
        //                 if(singleNum == dieNum){
        //                     console.log("走到了520行")
        //                     this.Map[row][vertical].playDieAction(FightConst.FightNum.dissolveAnimationSpeed * (dieNum - 1),callbacks)
        //                     // callbacks();
        //                 }else{
        //                     console.log("走到了523行")
        //                     this.Map[row][vertical].playDieAction(FightConst.FightNum.dissolveAnimationSpeed * (dieNum - 1))
        //                 }
        //             }
        //         }
        //     }
        }else{
            callbacks()
        }
    }
    GameOver(){
        this.Status = FightConst.GameStatus.EndGame;
        ViewManager.getInstance().CloseView("ViewHongBao")
        let isWin = GameDataManager.getInstance().userData.getIsWin()
        PlatformManger.getInstance().hideBigVideo()
        if(this.VideoBox){
            if(this.VideoBox.LevelTime == 2){
                this.VideoBox.putNode()
            }else{
                this.VideoBox.LevelTime ++;
            }
        }
        if(isWin) { //游戏成功
            this.gameWin()
        }else{ //游戏失败
            let userData = GameDataManager.getInstance().userData;
            let now = userData.nowScore
            userData.setNowScore(userData.targetScore);
            this.addSocre(0,0,2,userData.targetScore - now,0.2,cc.color(255,255,0))
            GameDataManager.getInstance().saveUserData();


            let target = this.ViewFight.nodeMove.getChildByName("nowtarget_label").getComponent(cc.Label)
            target.string = FunUtils.format("{1}/{2}",userData.nowScore,GameDataManager.getInstance().userData.getTargetScore())
            this.ViewFight.nowScore = userData.nowScore;
            let progress = userData.nowScore / GameDataManager.getInstance().userData.getTargetScore()
            if(progress >= 1){
                progress = 1
            }
            this.ViewFight.setTargetPro(progress)

            this.gameWin()
        }
    }
    cleanAllMap(){
        let num = FightConst.FightNum.rowNum;
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.Map && this.Map[row][vertical]){
                    FightPoolManger.getInstance().putItemBlock(this.Map[row][vertical].node)
                    this.Map[row][vertical] = null;
                }
            }
        }
    }
    //失败复活
    failRevive(){
        console.log("failrevive")
        this.cleanAllMap()
        // this.ViewFight.nowScore = GameDataManager.getInstance().userData.nowScore;
        let tergetSocre = GameDataManager.getInstance().userData.getTargetScore()
        let lastScore = GameDataManager.getInstance().userData.lastScore;
        let score = tergetSocre  - lastScore - 1800;
        if(score < 0){
            score = 0;
        }
        GameDataManager.getInstance().userData.nowScore = GameDataManager.getInstance().userData.lastScore + score;
        this.ViewFight.nowScore = GameDataManager.getInstance().userData.nowScore;
        GameDataManager.getInstance().userData.setLastScore()
        this.ViewFight.setNowTargetLabel();
        this.ViewFight.setTopLevelTargetLabel();
        this.gameStart(true);    
        // nextLevel
    }
    failViewRestart(){
        console.log("failViewRestart")
        this.cleanAllMap()
        GameDataManager.getInstance().userData.setLevel(1)
        GameDataManager.getInstance().userData.setNowScore(0)
        this.ViewFight.nowScore = GameDataManager.getInstance().userData.nowScore;
        this.ViewFight.setNowTargetLabel();
        this.ViewFight.setTopLevelTargetLabel();
        this.gameStart(true)  
    }
    // 重回界面  重新开始
    failRestart(){
        console.log("failRestart")
        this.cleanAllMap()
        GameDataManager.getInstance().userData.nowScore = GameDataManager.getInstance().userData.lastScore;
        this.ViewFight.nowScore = GameDataManager.getInstance().userData.nowScore;
        this.ViewFight.setNowTargetLabel();
        this.ViewFight.setTopLevelTargetLabel();
        GameDataManager.getInstance().userData.setLastScore()
        this.gameStart(true)
    }
    //继续游戏
    regainContinue(){
        this.ViewFight.nowScore = GameDataManager.getInstance().userData.nowScore;
        this.ViewFight.setNowTargetLabel();
        this.ViewFight.setTopLevelTargetLabel();
        this.gameStart(false)
    }
    //游戏成功
    gameWin(){
        this.cleanAllMap()
        this.ViewFight.setLevleTarget(false);
        this.addPassEffect()
        let level = GameDataManager.getInstance().userData.level;
        this.roundLevelNum = level;
        GameDataManager.getInstance().userData.setLevel(level + 1);
        GameDataManager.getInstance().userData.setLastScore();
        GameDataManager.getInstance().userData.setMapNull();


        
        this.ViewFight.scheduleOnce(() => {
            this.ViewFight.isWangZhuan ? this.openViewWin() : this.nextLevel();

            let prmam = {
                playlvl:level,
            }
            GameJSB.getAndroidData("/userdata/upgamelvl",JSON.stringify(prmam),"upgamelvl") //关卡过关保存记录
        },0.7);
    }
    addPassEffect(){
        let parentNode = this.ViewFight.MapNode;
        let pos = cc.v2(0,360)
        let data = {   
        }
        FightPoolManger.getInstance().createPassEffect(parentNode,pos,data)
    }
    openViewWin(){
        this.ViewFight.hongbaoType = "过关红包";
        if(window['killStar']['UserInfo'] && window['killStar']['UserInfo'].newuserprizeget === 0) this.ViewFight.hongbaoType = "新手红包";   //每次进入游戏判断下新手红包有没有被领取，如果没被领取过，那么下次通关就给新手红包
        ViewManager.getInstance().ShowView("signRedWin");
    }
    nextLevel(){        
        this.ViewFight.setTargetPro(0)
        this.gameStartAni()
    }
    openRedpackFirst():void{
        //console.log("openreddddddddddddddddddddd");
        // let self = this;
        // let level = GameDataManager.getInstance().userData.level - 1;
        // redCenter.getInstance().openRedpackFirst({
        //     callBack:{
        //         onOpened:function(){
        //             console.log("openFirstRd====112======");
        //             QQPlaform.getInstance().qqShowJimuAd(true)
        //         },
        //         onClosed:function(){
        //             console.log("closefirst====112======");
        //             QQPlaform.getInstance().qqShowJimuAd(false)
        //             self.nextLevel()
        //         },
        //         redpackVideoClose:function(){
        //             console.log("redpackVideoClose=====1==23=======");
        //         },
        //         redPackGetSuccess:function(){   //红包领取成功回调
        //             console.log("红包领取成功====");
        //             redCenter.getInstance().changeEveryTaskMessage(6,1);
        //             redCenter.getInstance().changeEveryTaskMessage(7,1);
        //             redCenter.getInstance().changeEveryTaskMessage(8,1);
        //             redCenter.getInstance().changeEveryTaskMessage(9,1);
        //         },
        //     },
        //     ishaveVideo:true,
        //     redpackType:"3",
        //     activeName:"过关红包",
        //     isOpenSecondPage:false,
        //     openEventPotnum:5,
        //     passNum:level,
        // });
    }
    
    //道具 炸弹
    onPropBomb(){
        if(this.Status != FightConst.GameStatus.StartGame){
            return;
        }
        this.Status = FightConst.GameStatus.BombStatus;
        this.ViewFight.propBombTip.active = true;
        // 
    }
    bombCheckBlock(xId,yId){
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        this.stopAllItemBlockAni();
        this.ViewFight.propBombTip.active = false;
        let table = this.CheckBlock.checkBomb(xId,yId)
        let scoreNum = 0;
        this.Status = FightConst.GameStatus.NOTouch;
        for (let index = 0; index < table.length; index++) {
            // let score = FightConst.TargetScore.Score;
            let score = FightConst.ItemScore;
            const element:ItemBlock = table[index];
            // score = score + 10*index;
            scoreNum += score;
            this.addSocre(element.node.x,element.node.y,FightConst.Score.SmallType,score,FightConst.FightNum.dissolveAnimationSpeed * (index+1),cc.color(255,255,0))
            if(index == table.length - 1){
                let x = this.Map[xId][yId].node.x
                yId == 0 ? x = x + FightConst.FightNum.itemBlockWidth:0
                yId == 9 ? x = x - FightConst.FightNum.itemBlockWidth:0
                this.ViewFight.setScoreScale(table.length,scoreNum)
                this.addSocre(x,this.Map[xId][yId].node.y,FightConst.Score.BigType,scoreNum,FightConst.FightNum.dissolveAnimationSpeed * (index+1),cc.color(255,255,0))
                let scoreData = GameDataManager.getInstance().userData.nowScore + scoreNum;
                GameDataManager.getInstance().userData.setNowScore(scoreData)
                element.playDieAction(0.04 * index,()=>{
                });
            }else{
                element.playDieAction(0.04 * index);
            }
        }
        // this.propSuccess(FightConst.GameStatus.BombStatus)
        this.addInColorEffect(xId,yId);
        this.checkBombFall(table.length);
    }
    //检查需要不需要下落
    checkBombFall(length){
        // setTimeout(() => {
        //     if (this.Status == FightConst.GameStatus.NOTouch) {
        //         this.Status = FightConst.GameStatus.DropStatus;
        //         this.onItemBlockFall()
        //       }
        // }, 0.04 * 1000 * length)
        this.ViewFight.scheduleOnce(() => {
            if (this.Status == FightConst.GameStatus.NOTouch) {
                this.Status = FightConst.GameStatus.DropStatus;
                this.onItemBlockFall()
              }
        },0.04 * length);
    }
    addInColorEffect(xId,yId){
        let parentNode = this.ViewFight.MapNode;
        let pos = this.Map[xId][yId].node.getPosition()
        let data = {
        }
        FightPoolManger.getInstance().createInColorEffect(parentNode,pos,data)
    }
    //随机消除 -------------
    onRandomProp(){
        if(this.Status != FightConst.GameStatus.StartGame){
            return;
        }
        this.Status = FightConst.GameStatus.RandomStatus;
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        let sortTable :ItemBlock [] = [];
        let sortTablePos:cc.Vec2[] = [];
        let randomPos = this.ViewFight.getPropRandomPos();
        let num = FightConst.FightNum.rowNum;
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.Map[row][vertical]){
                    sortTable.push(this.Map[row][vertical])
                    sortTablePos.push(this.Map[row][vertical].Data.Pos)
                }
            }
        }



        sortTable.sort(function (a, b) { return Math.random() > 0.5 ? -1 : 1; });
        let randomLength = 0


        randomLength  = FunUtils.getRandom(100,100)
        if(randomLength >= sortTable.length){
            randomLength = sortTable.length
        }

        let param = {   //自动消除红包
            type:9,
            param:randomLength,
        }
        GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards");
        
        for (let index = 0; index < randomLength; index++) {
            const element = sortTable[index];
            let pos ;
            let isOver = false;
            if(index == randomLength - 1){
                isOver = true;
            }
            let data = {
                MovePos:element.Data.Pos,
                Time:FightConst.FightNum.randomTime * index,
                XId:element.xId,
                YId:element.yId,
                IsOver:isOver,
            }
            if(index == 0){
                pos = randomPos;
            }else{
                pos = sortTable[index - 1].Data.Pos;
            }
            FightPoolManger.getInstance().createParticleRandom(this.ViewFight.MapNode,pos,data) 
        } 
    }
    randomCheckBlock(xId,yId){
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        if(this.CheckBlock){
            for (let row = 0; row < FightConst.FightNum.rowNum; row++) { //行
                for (let vertical = 0; vertical < FightConst.FightNum.rowNum; vertical++) { //列
                    if(this.Map[row][vertical]){
                        this.Map[row][vertical].node.stopAllActions()
                        // this.Map[row][vertical].node.scale = 1;
                    }
                }
            }
            if(this.Status == FightConst.GameStatus.RandomStatus){//随机消除
                this.Map[xId][yId].playDieAction(0)
                this.addSocre(this.Map[xId][yId].node.x,this.Map[xId][yId].node.y,FightConst.Score.SmallType,FightConst.TargetScore.PropScore + 15,FightConst.FightNum.dissolveAnimationSpeed,cc.color(255,255,0))
                let scoreData = GameDataManager.getInstance().userData.nowScore + FightConst.TargetScore.PropScore + 15;
                GameDataManager.getInstance().userData.setNowScore(scoreData)
            }
            this.ViewFight.setTargetFinish();
        }
    }
    randomCheckNeedFall(){
        // setTimeout(() => {
        //     if (this.Status == FightConst.GameStatus.RandomStatus) {
        //         this.propSuccess(FightConst.GameStatus.RandomStatus)
        //         this.Status = FightConst.GameStatus.RandomDropStatus;
        //         this.onItemBlockFall()
        //       }
        // }, FightConst.FightNum.dissolveAnimationSpeed * 1000)
        this.loadRedBagAni();//播放流星道具后的红包动画
        this.ViewFight.scheduleOnce(() => {
            if (this.Status == FightConst.GameStatus.RandomStatus) {
                this.propSuccess(FightConst.GameStatus.RandomStatus)
                this.Status = FightConst.GameStatus.RandomDropStatus;
                this.onItemBlockFall()
              }
        },FightConst.FightNum.dissolveAnimationSpeed );
    }
    onInColorProp(){
        if(this.Status != FightConst.GameStatus.StartGame){
            return;
        }
        this.Status = FightConst.GameStatus.IncolorStatus;
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        this.stopAllItemBlockAni()
        let tabel = this.CheckBlock.checkInColor()
        let pos = cc.v2(0,0);
        let data = {
            ItemBlock:tabel[0],
        }
        this.inColor = FightPoolManger.getInstance().createInColor(this.ViewFight.MapNode,pos,data)

    }
    /**
     * 
     * @param isColor 是否换色成功
     */
    closeInColorProp(isColor){
        if(!isColor){
            this.inColor.itemBlock.node.stopAllActions()
            this.inColor.itemBlock.node.scale = 1;
            this.inColor.itemBlock = null;
            FightPoolManger.getInstance().putInColor(this.inColor.node)
            this.inColor = null;
            this.checkGameOver()
            return;
        }
        if(this.Status == FightConst.GameStatus.IncolorStatus){
            this.inColor.itemBlock.node.stopAllActions()
            this.inColor.itemBlock.node.scale = 1;
            this.inColor.itemBlock = null;
            FightPoolManger.getInstance().putInColor(this.inColor.node)
            this.inColor = null;
            this.propSuccess(FightConst.GameStatus.IncolorStatus)
            this.CheckBlock.init()
            this.CheckBlock.check()
            this.CheckBlock.setHint()
            this.checkGameOver()
            GameDataManager.getInstance().saveUserData()
        }
    }
    //设置锤子道具
    onHammerProp(){
        if(this.Status != FightConst.GameStatus.StartGame){
            return;
        }
        this.Status = FightConst.GameStatus.HammerStatus;
        this.HammerAniNode = FightPoolManger.getInstance().createHammerAni(this.ViewFight.MapNode,cc.v2(0,0))
    }
    //属性排序
    objSort(type){
        return function(a,b){
            var value1 = a[type];
            var value2 = b[type];
            return value1 - value2;
        }
    }
    //重新排序道具
    /**
     * 
     * @param isRefrsh 是否是第多次刷新
     */
    onRefreshProp(isRefrsh){
        if(this.Status != FightConst.GameStatus.StartGame){
            return
        }
        this.Status = FightConst.GameStatus.RefrshStatus;
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        GameDataManager.getInstance().userData.setIsUseRefresh(true)
        this.ViewFight.playRefrshAction()
        let sortTable :ItemBlock [] = [];
        let sortTablePos:cc.Vec3[] = [];
        let num = FightConst.FightNum.rowNum;
        for (let row = 0; row < num; row++) { //行
            for (let vertical = 0; vertical < num; vertical++) { //列
                if(this.Map[row][vertical]){
                    this.Map[row][vertical].node.stopAllActions()
                    this.Map[row][vertical].node.scale = 1;
                    sortTable.push(this.Map[row][vertical])
                    // sortTablePos.push(this.Map[row][vertical].Data.Pos)
                }
            }
        }
        let posLength = 0
        for (let row = num - 1; row >= 0; row--) { //行
            for (let vertical = 0; vertical < num ; vertical++) { //列
                let x = -324;
                let y =  330;
                x = x + FightConst.FightNum.itemBlockWidth * vertical;
                y = y - FightConst.FightNum.itemBlockWidth * row;
                let pos = cc.v3(x,y)
                sortTablePos.push(pos)
                posLength++;
                if(posLength == sortTable.length){
                    break;
                }
            }
        }
        // sortTable.sort(function (a, b) { return Math.random() > 0.5 ? -1 : 1; });
        sortTable.sort(this.objSort("colorType"));
        for (let i = 0; i < sortTable.length; i++) {
            const element = sortTable[i];
            // let  move = cc.moveTo(FightConst.FightNum.sortAnimationSpeed,sortTablePos[i])
            // let seq = cc.sequence(move,cc.callFunc(() => {
                
            // }))
            // element.node.runAction(seq) 
            cc.tween(element.node)
                .to(FightConst.FightNum.sortAnimationSpeed,{position:sortTablePos[i]})
                .call(() => {
                    if(i == sortTable.length - 1){
                        let index = 0
                        for (let row = num - 1; row >= 0; row--) { //行
                            for (let vertical = 0; vertical < num ; vertical++) { //列
                                if(sortTable.length > index){
                                    this.Map[row][vertical] = null;
                                    this.Map[row][vertical] = sortTable[index];
                                    this.Map[row][vertical].setXYId(row,vertical);
                                    this.Map[row][vertical].setDataPos(this.Map[row][vertical].node.x,this.Map[row][vertical].node.y);
                                    index ++;
                                }else{
                                    GameDataManager.getInstance().userData.setMap(row,vertical,0,false)
                                    this.Map[row][vertical] = null;
                                }
                            }
                        }
                        // for (let row = 0; row < num; row++) { //行
                        //     for (let vertical = 0; vertical < num; vertical++) { //列
                        //         if(this.Map[row][vertical]){

                        //             this.Map[row][vertical] = null;
                        //             this.Map[row][vertical] = sortTable[index];
                        //             this.Map[row][vertical].setXYId(row,vertical);
                        //             this.Map[row][vertical].setDataPos(this.Map[row][vertical].node.x,this.Map[row][vertical].node.y);
                        //             index ++;
                        //         }
                        //     }
                        // }
                        this.CheckBlock.init()
                        this.CheckBlock.check()
                        this.CheckBlock.setHint()
                        this.Status = FightConst.GameStatus.StartGame;
                        let checkData = this.CheckBlock.checkGameOver()
                        GameDataManager.getInstance().saveUserData()
                        if(!isRefrsh){
                            this.propSuccess(FightConst.GameStatus.RefrshStatus)
                        }
                        if( checkData.isGameOver){//重新排序
                            this.onRefreshProp(true)
                        }else{
                            this.showHint()
                        }
                    }
                })
                .start()
        }
    }
    //道具使用成功
    propSuccess(status){
        if(FightConst.GameStatus.RefrshStatus == status){
            this.httpUseProp(3,status)
        }else if(FightConst.GameStatus.HammerStatus == status){
            this.httpUseProp(4,status)
        }else if(FightConst.GameStatus.IncolorStatus == status){
            this.httpUseProp(2,status)
        }else if(FightConst.GameStatus.RandomStatus == status){
            this.httpUseProp(1,status)
        }else if(FightConst.GameStatus.BombStatus == status){
            this.httpUseProp(5,status)
        }
    }
    httpUseProp(type,status){
        this.refreshProp(status,1)
    }
    refreshProp(status,num){
        if(FightConst.GameStatus.RefrshStatus == status){
            let propRefrshNum = GameDataManager.getInstance().userData.propRefrsh - num;
            GameDataManager.getInstance().userData.setPropRefrsh(propRefrshNum)
            this.ViewFight.refreshRefrshLabel()
        }else if(FightConst.GameStatus.HammerStatus == status){
            let propHammerNum = GameDataManager.getInstance().userData.propHammer - num;
            GameDataManager.getInstance().userData.setPropHammer(propHammerNum)
            this.ViewFight.refreshHammerLabel()
        }else if(FightConst.GameStatus.IncolorStatus == status){
            let propIncolorNum = GameDataManager.getInstance().userData.propIncolor - num;
            GameDataManager.getInstance().userData.setPropIncolor(propIncolorNum)
            this.ViewFight.refreshIncolorLabel()
        }else if(FightConst.GameStatus.RandomStatus == status){
            let propRandomNum = GameDataManager.getInstance().userData.propRandom - num;
            GameDataManager.getInstance().userData.setPropRandom(propRandomNum)
            this.ViewFight.refreshRandomLabel()
        }else if(FightConst.GameStatus.BombStatus == status){
            let propRandomNum = GameDataManager.getInstance().userData.propBomb - num;
            GameDataManager.getInstance().userData.setPropBomb(propRandomNum)
            this.ViewFight.refreshBombLabel()
        }

        // redCenter.getInstance().changeEveryTaskMessage(2,1);
        // redCenter.getInstance().changeEveryTaskMessage(3,1);
        // redCenter.getInstance().changeEveryTaskMessage(4,1);
        // redCenter.getInstance().changeEveryTaskMessage(5,1);
        
    }
    //添加粒子烟花特效
    addParticleParticleFireworks(){
        let parentNode = this.ViewFight.ViewCenter;
        for (let index = 1; index < 7; index++) {
            let i = index - 1;
            let  colorType = index
            let time = 200;
            time = time * i;
            if(index >= 4){
                colorType = index - 3;
            }
            let y = 0;
            let x = 0;
            index == 1 ? (x= 200,y= -400):0;
            index == 2 ? (x= -100,y= -300):0;
            index == 3 ? (x= 0,y= 0):0;
            index == 4 ? (x= 300,y= 200):0;
            index == 5 ? (x= 0,y= 300):0;
            index == 6 ? (x= -220,y = 100):0;
            let pos = cc.v2(x,y)
            let data = {
                DelayTime:time,
                Time:FightConst.FightNum.particleDissolveTime + 1000 + time,
                ColorType:colorType,
                Index:index,
            }
            FightPoolManger.getInstance().createParticleFireworks(parentNode,pos,data)
        }
        
    }
    //添加粒子特效
    addParticleBlock(x,y,colorType){
        let parentNode = this.ViewFight.MapNode;
        let pos = cc.v2(x,y)
        let data = {
            Time:FightConst.FightNum.particleDissolveTime,
            ColorType:colorType,
        }
        FightPoolManger.getInstance().createParticleBlock(parentNode,pos,data)
    }
    //添加分数
     addSocre(x,y,Type,score,time,color){
        let parentNode = this.ViewFight.MapNode;
        let pos = cc.v2(x,y)
        let data = {
            Type:Type,//1 小字 2 是大字
            MovePos:this.ScoreMovePos,
            Score:score,
            Time:time,
            Color:color,
        }
        FightPoolManger.getInstance().createScore(parentNode,pos,data)
    }
    setTextEffect(length){
        let param = {
            type:4,
            param:length,
           }
        GameJSB.getAndroidData("/userReward/rewards",JSON.stringify(param),"rewards")

        // let rewards = {
        //     code:0,
        //     cctype:"rewards",
        //     message:"成功！",
        //     data:{
        //         type:4,
        //         rewardname:"自动消除红包",
        //         yesdaysave:474,
        //         todaysave:81,
        //         plusintegral:100,
        //         userinteger:19999
        //     }
        // }
        // GameJSB.obtainHttpData(JSON.stringify(rewards));

        if(length < 5){
            AudioManager.getInstance().playSound("xcclick")
            return  ;
        }
        let type = -1;
        if(length == 3){
            // FunUtils.showTip("非常酷");
            type = 1;
        }else if(length == 6){
            // FunUtils.showTip("无与伦比");
            type = 2;
        }else if(length == 9){
            // FunUtils.showTip("精彩绝伦");
            type = 3;
        }else if(length >= 12){
            // FunUtils.showTip("太棒了");
            type = 4;
        }
 
        if(length >= 6 && this.ViewFight.isWangZhuan){
            this.loadRedBagAni();
        }

        this.addTextEffect(type)
    }
    addTextEffect(type){
        if(type == -1){
            return;
        }
        let data = {
            Type:type,//
        }
        let parentNode = this.ViewFight.MapNode;
        FightPoolManger.getInstance().createTextEffect(parentNode,cc.v2(0,0 + 300),data)
    }
    addTargetCompleteEffectt(){
        let data = {
        }
        let parentNode = this.ViewFight.MapNode;
        FightPoolManger.getInstance().createTargetCompleteEffectt(parentNode,cc.v2(0,0 + 300),data)
    }
    //
    addHongBao(){
        if(!this.CheckBlock.checkHongBaoShow()){
            return;
        }
        if(!GameDataManager.getInstance().kaiGuan.isOpenRedPackage){
            return;
        }
        if(!GameDataManager.getInstance().hongBao.isShowHongBao_inLevel){
            return;
        }
        if(this.HongBao){
            return;
        }
        if(this.isHavehongBao){
            return;
        }
        let parentNode = this.ViewFight.MapNode;
        let pos = cc.v2(0,0)
        let y = FunUtils.getRandom(180,324)
        let x = FunUtils.getRandom(0,648)
        x = x - 324;
        pos.x = x;
        pos.y = -y;
        // console.log("=pos.y=",pos.y)
        let data = {
            // Type:1,//
        }
        this.isHavehongBao = true;
        // this.HongBao = FightPoolManger.getInstance().createHongBao(parentNode,pos,data)
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.qipao_exposure.eventID,Const.AndroidEvent.qipao_exposure.eventName)
    }
    pushHongBao(){
        if(this.HongBao){
            FightPoolManger.getInstance().putHongBao(this.HongBao.node)
        }
        this.isHavehongBao = false;
    }
    //显示提示
    showHint(){
        if (this.HintTimer) {
            clearTimeout(this.HintTimer)
        }
        if(this.CheckBlock.HintTable.length > 1){
            this.HintTimer = setTimeout(() => {
                let ItemBlockTable =  this.CheckBlock.HintTable
                let length = ItemBlockTable.length
                for (let index = 0; index < length; index++) {
                    const element:ItemBlock = ItemBlockTable[index];
                    element.playHintAction()
                }
            }, FightConst.FightNum.hintTime)
        }
    }
    // update(dt){
    //     if(this.Status != FightConst.GameStatus.StartGame){
    //         return;
    //     }

    // }
    onVideoBoxAdv(_type){
        PlatformManger.getInstance().showVideo(_type,{
            type:_type,
            success: function () {
                this.advSuccess()
            }.bind(this),
            fail: function () {
                
            }.bind(this),

            noVideo:function(){

            }.bind(this)
        });
    }
    // 看视频宝箱成功
    advSuccess(){
        // PlatformManger.getInstance().redPackTimerResultShow()
    }
    addVideoBox(){
        let x = 0;
        let y = AdaptarManager.getInstance().fullHeight/6;
        let parentNode = this.ViewFight.node;
        let pos = cc.v2(x,y)
        let data = {
        }
        this.VideoBox = FightPoolManger.getInstance().createVideoBox(parentNode,pos,data)
    }
}
