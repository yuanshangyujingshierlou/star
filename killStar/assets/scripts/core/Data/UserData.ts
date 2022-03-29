import FunUtils from "../Util/FunUtils";
import GameDataManager from "../Manager/GameDataManager";
import Const from "../../game/Const";
import FightConst from "../../game/fight/FightConst";

export default class UserData  {
    constructor() {
    }
    
    lastCleanTime: number = Date.now();   //上次隔天清理时间
    map:Array<Array< number>> = null;  //存储 二位数组  地图type

    level:number = 1;//关卡;
    
    nowScore:number = 0;//现在分数;
    lastScore:number = 0;//上局的分数；
    //算目标分
    targetScore:number = 0;//目标分数
    targetAddScore:number = 0;//目标添加的分数
    targetTableNum:number = 0;//目标Table下标
    targetLevel:number = 0;//目标关卡

    //道具数量
    propRefrsh:number = 1;//刷新
    propHammer:number = 1;//锤子
    propIncolor:number = 1;//换色
    propRandom:number = 1;//随机消除
    propBomb:number = 1;//炸弹

    money:number = 0;
    name:string = "";
    guideId:number = 0;//引导Id;
    invitationNum:string = ""//邀请码
    invitationHttp:string = ""//邀请码链接

    loginToken:string = null;
    uid:number = 0;

    isUseRefresh:boolean = false;//是否使用道具了

    copy(data: UserData){
        if (data.lastCleanTime) {
            this.lastCleanTime = data.lastCleanTime;
        }
        if (data.map) {
            this.map = data.map;
        }
        if (data.level) {
            this.level = data.level;
        }
        if (data.nowScore) {
            this.nowScore = data.nowScore;
        }
        if (data.lastScore) {
            this.lastScore = data.lastScore;
        }
        if (data.targetScore) {
            this.targetScore = data.targetScore;
        }
        if (data.targetAddScore) {
            this.targetAddScore = data.targetAddScore;
        }
        if (data.lastScore) {
            this.targetTableNum = data.targetTableNum;
        }
        if (data.targetLevel) {
            this.targetLevel = data.targetLevel;
        }
        
        if (data.propRefrsh) {
            this.propRefrsh = data.propRefrsh;
        }
        if (data.propHammer) {
            this.propHammer = data.propHammer;
        }
        if (data.propIncolor) {
            this.propIncolor = data.propIncolor;
        }
        if (data.propRandom) {
            this.propRandom = data.propRandom;
        }
        if (data.propBomb) {
            this.propBomb = data.propBomb;
        }
        if (data.money) {
            this.money = data.money;
        }
        if (data.name) {
            this.name = data.name;
        }
        
        if (data.guideId) {
            this.guideId = data.guideId;
        }
        if (data.invitationNum) {
            this.invitationNum = data.invitationNum;
        }
        if (data.invitationHttp) {
            this.invitationHttp = data.invitationHttp;
        }
        if (data.loginToken) {
            this.loginToken = data.loginToken;
        }
        if (data.uid) {
            this.uid = data.uid;
        }
        if (data.isUseRefresh) {
            this.isUseRefresh = data.isUseRefresh;
        }
        
    }
    //清理数据
    clearData(){
        this.lastCleanTime = Date.now();
    }
    //隔天清理
    nextDayClean() {
        let now = Date.now();
        //找到今天0点
        let todayZero = new Date();
        todayZero.setHours(0);
        todayZero.setMinutes(0);
        todayZero.setSeconds(0);
        if (this.lastCleanTime < todayZero.getTime()) {
            this.lastCleanTime = now;
            GameDataManager.getInstance().saveUserData()
        }
    }
    setTargetScore(targetScore:number){
        this.targetScore = targetScore
        GameDataManager.getInstance().saveUserData()
    }
    setTargetAddScore(targetAddScore:number){
        this.targetAddScore = targetAddScore
        GameDataManager.getInstance().saveUserData()
    }
    setTargetTableNum (targetTableNum:number){
        this.targetTableNum = targetTableNum
        GameDataManager.getInstance().saveUserData()
    }
    setTargetLevel (level:number){
        this.targetLevel = level
        GameDataManager.getInstance().saveUserData()
    }
    setPropRefrsh (propRefrsh:number){
        this.propRefrsh = propRefrsh
        GameDataManager.getInstance().saveUserData()
    }
    setPropHammer (propHammer:number){
        this.propHammer = propHammer
        GameDataManager.getInstance().saveUserData()
    }
    setPropIncolor (propIncolor:number){
        this.propIncolor = propIncolor
        GameDataManager.getInstance().saveUserData()
    }
    setPropRandom (propRandom:number){
        this.propRandom = propRandom;
        GameDataManager.getInstance().saveUserData()
    }
    setPropBomb (propBomb:number){
        this.propBomb = propBomb;
        GameDataManager.getInstance().saveUserData()
    }
    setLoginToken(loginToken:string){
        this.loginToken = loginToken;
        GameDataManager.getInstance().saveUserData()
    }
    setUid(uid:number){
        this.uid = uid;
        GameDataManager.getInstance().saveUserData()
    }
    getTargetScore(){
        // this.targetScore = FightConst.TargetScoreTotal
        // let addscore = (this.level - 1)*50
        // if( addscore >= 200 ){
        //     addscore = 200
        // }


        // this.targetScore = 10000;
        this.targetScore = FightConst.TargetScoreTotal * this.level + Math.floor(this.level/10)*100;
        // this.targetScore = FightConst.TargetScoreTotal * this.level + Math.floor(this.level/10)*450;

        return this.targetScore;
        
    }
    setGuideId(_guideId:number){
        if(this.guideId >= _guideId){
            return false;
        }
        this.guideId = _guideId;
        GameDataManager.getInstance().saveUserData()
        return true;
    }
    setLevel(level:number){
        this.level = level
        GameDataManager.getInstance().saveUserData()
    }

    setMoney(money){
        this.money = money;
        GameDataManager.getInstance().saveUserData()
    }
    setName(name,isBool){ //isBool 是否强制修改
        if(this.name == "" || isBool){
            this.name = name;
            GameDataManager.getInstance().saveUserData()
        }
    }
    setInvitationNum(invitationNum,isBool){ //isBool 是否强制修改
        if(this.invitationNum == "" || isBool){
            this.invitationNum = invitationNum;
            GameDataManager.getInstance().saveUserData()
        }
    }
    setInvitationHttp(invitationHttp){ //isBool 是否强制修改
        this.invitationHttp = invitationHttp;
        GameDataManager.getInstance().saveUserData()
    }
    setNowScore(nowScore){
        this.nowScore = nowScore;
        // GameDataManager.getInstance().saveUserData();
    }
    setLastScore(){
        this.lastScore = this.nowScore;
        GameDataManager.getInstance().saveUserData();
    }
    setMap(x,y,id,isBool){
        this.map[x][y] = id;
        if(isBool){
            GameDataManager.getInstance().saveUserData();
        }
    }
    setMapNull(){
        this.map = null;
        GameDataManager.getInstance().saveUserData();
    }

    //是否赢了
    getIsWin(){
        if(this.nowScore >= this.targetScore){
            return true
        }
        return false;
    }

    //检测map 是不是全是0
    checkMapIs0(){
        for (let x = 0; x < FightConst.FightNum.rowNum; x++) {
            for (let y = 0; y < FightConst.FightNum.rowNum; y++) {
                if(this.map[x][y] != 0){
                    return false;
                }
            }
        }
        return true;
    }

    setIsUseRefresh(isUseRefresh:boolean){
        this.isUseRefresh = isUseRefresh;
        GameDataManager.getInstance().saveUserData();
    }
}
