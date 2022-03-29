import ItemBlock from "./ItemBlock";
import ParticleBlock from "./ParticleBlock";
import AdaptarManager from "../../core/Manager/AdaptarManager";
import FunUtils from "../../core/Util/FunUtils";
import ParticleFireworks from "./ParticleFireworks";
import Const from "../Const";
import FightConst from "./FightConst";
import Score from "./Score";
import LoaderManager from "../../core/Manager/LoaderManager";
import ParticleRandom from "./ParticleRandom";
import InColor from "./InColor";
import TextEffect from "./TextEffect";
import HongBao from "./HongBao";
import FightManger from "./FightManger";
import InColorEffect from "./InColorEffect";
import PassEffect from "./PassEffect";
import ScoreEffect from "./ScoreEffect";
import TargetCompleteEffect from "./TargetCompleteEffect";
import VideoBox from "./VideoBox";

export default class FightPoolManger {
    private static instance: FightPoolManger = null;
    public static getInstance(): FightPoolManger {
		if (FightPoolManger.instance == null) {
			FightPoolManger.instance = new FightPoolManger();
		}
		return FightPoolManger.instance;
    }

    public static PATH_FIGHT = "prefabs/fight/"; //地址
    public static PATH_HammerAni = "HammerAni"; //锤子
    public static PATH_ItemBlock= "ItemBlock"; //方块
    public static PATH_ParticleBlock = "ParticleBlock"; //方块消除特效
    public static PATH_ParticleFireworks = "ParticleFireworks"; //烟花特效
    public static PATH_Score = "Score"; //分数
    public static PATH_ParticleRandom = "ParticleRandom"; //特效 随机消除
    public static PATH_InColor = "InColor"; //特效 随机消除
    public static PATH_TextEffect = "TextEffect"; //特效 字体
    public static PATH_HongBao = "HongBao"; //特效 红包
    public static PATH_InColorEffect = "InColorEffect"; //特效 换色
    public static PATH_PassEffect = "PassEffect"; //特效 完美过关
    public static PATH_ScoreEffect = "ScoreEffect"; //特效 分数
    public static PATH_TargetCompleteEffect = "TargetCompleteEffect"; //特效 目标完成
    public static PATH_VideoBox = "VideoBox"; //宝箱视频
    
    
    
    ItemBlockPool:cc.NodePool = null;
    ParticleBlockPool:cc.NodePool = null;
    ParticleFireworksPool:cc.NodePool = null;
    ScorePool:cc.NodePool = null;
    HammerAniPool:cc.NodePool = null;
    ParticleRandomPool:cc.NodePool = null;
    InColorPool:cc.NodePool = null;
    TextEffectPool:cc.NodePool = null;
    HongBaoPool:cc.NodePool = null;
    InColorEffectPool:cc.NodePool = null;
    PassEffectPool:cc.NodePool = null;
    ScoreEffectPool:cc.NodePool = null;
    TargetCompleteEffectPool:cc.NodePool = null;
    VideoBoxPool:cc.NodePool = null;
    

    prefabTable: {[key: string]: cc.Prefab} = {};//所有预制体的集合
    prefabCallBack:Function = null; //回调
    constructor(){
        this.ItemBlockPool = new cc.NodePool();
        this.ParticleBlockPool = new cc.NodePool();
        this.ParticleFireworksPool = new cc.NodePool();
        this.ScorePool = new cc.NodePool();
        this.HammerAniPool = new cc.NodePool();
        this.ParticleRandomPool = new cc.NodePool();
        this.InColorPool = new cc.NodePool();
        this.TextEffectPool = new cc.NodePool();
        this.HongBaoPool = new cc.NodePool();
        this.InColorEffectPool = new cc.NodePool();
        this.PassEffectPool = new cc.NodePool();
        this.ScoreEffectPool = new cc.NodePool();
        this.TargetCompleteEffectPool = new cc.NodePool();        
        this.VideoBoxPool = new cc.NodePool();        
    }
    loadResPrefabArr(prefabCallBack){
        this.prefabCallBack = prefabCallBack;
        let arr = [
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_HammerAni,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_ItemBlock,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_ParticleBlock,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_ParticleFireworks,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_Score,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_ParticleRandom,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_InColor,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_TextEffect,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_HongBao,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_InColorEffect,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_PassEffect,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_ScoreEffect,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_TargetCompleteEffect,
            FightPoolManger.PATH_FIGHT + FightPoolManger.PATH_VideoBox,
            
        ];
        LoaderManager.getInstance().loadResArr(arr,this.loaderPreScuess.bind(this))
    }
    loaderPreScuess(assets:cc.Prefab[]){
        this.prefabTable = {};
        for (let index = 0; index < assets.length; index++) {
            const prefab = assets[index];
            let path = prefab.name;
            this.prefabTable[path] = prefab;
        }
        this.initPool()
    }
    initPool(){
        for(let i = 0;i < 100; i++){
            let pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ItemBlock]);//一百个方块
            this.ItemBlockPool.put(pool);
        }
        for(let i = 0;i < 20;i++){
            let pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ParticleBlock]);
            this.ParticleBlockPool.put(pool);
        }
        for(var i = 0;i < 6;i++){
            let pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ParticleFireworks]);
            this.ParticleFireworksPool.put(pool);
        }
        for(var i = 0; i < 10;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_Score]);
            this.ScorePool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_HammerAni]);
            this.HammerAniPool.put(pool);
        }
        for(var i = 0; i < 8;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ParticleRandom]);
            this.ParticleRandomPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_InColor]);
            this.InColorPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_TextEffect]);
            this.TextEffectPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_HongBao]);
            this.HongBaoPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_InColorEffect]);
            this.InColorEffectPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_PassEffect]);
            this.PassEffectPool.put(pool);
        }
        for(var i = 0; i < 8;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ScoreEffect]);
            this.ScoreEffectPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_TargetCompleteEffect]);
            this.TargetCompleteEffectPool.put(pool);
        }
        for(var i = 0; i < 1;i++){
            var pool = cc.instantiate(this.prefabTable[FightPoolManger.PATH_VideoBox]);
            this.VideoBoxPool.put(pool);
        }
        if(this.prefabCallBack){
            this.prefabCallBack()
        }
    }
    putItemBlock(node:cc.Node) {
        node.parent = null;
        this.ItemBlockPool.put(node);
    }
    addCreateItemBlock(parentNode:cc.Node,pos:cc.Vec2,data?:any){

    }
    createItemBlock(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let poss = FunUtils.deepCopy(pos)
        let objItemBlock =  this.ItemBlockPool.get();
        if (objItemBlock == null) {
            if (!this.prefabTable[FightPoolManger.PATH_ItemBlock]) return null;
            let prefab = this.prefabTable[FightPoolManger.PATH_ItemBlock];
            objItemBlock = cc.instantiate(prefab);
        }
        parentNode.addChild(objItemBlock);
        let fullHeight = AdaptarManager.getInstance().fullHeight;
        poss.y = fullHeight - 360 - Const.Adapter.FightUIBottom + FightConst.FightNum.itemBlockWidth;
        objItemBlock.setPosition(poss);
        let jsItemBlock = objItemBlock.getComponent(ItemBlock) as ItemBlock;
        jsItemBlock.init(data);
        return jsItemBlock;
        // return jsItemBlock;
    }

    getParticleBlock(){
        if (!this.prefabTable[FightPoolManger.PATH_ParticleBlock]) return null;
        let node = this.ParticleBlockPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ParticleBlock]);
        }
        return node;
    }
    putParticleBlock(node:cc.Node) {
        node.parent = null;
        this.ParticleBlockPool.put(node);
    }
    createParticleBlock(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let objParticleBlock = this.getParticleBlock();
        parentNode.addChild(objParticleBlock);
        objParticleBlock.setPosition(pos);
        let jsParticlelock = objParticleBlock.getComponent(ParticleBlock) as ParticleBlock;
        jsParticlelock.init(data);
    }

    getParticleFireworks(){
        if (!this.prefabTable[FightPoolManger.PATH_ParticleFireworks]) return null;
        let node = this.ParticleFireworksPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ParticleFireworks]);
        }
        return node;
    }
    putParticleFireworks(node:cc.Node) {
        node.parent = null;
        this.ParticleFireworksPool.put(node);
    }
    createParticleFireworks(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getParticleFireworks();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsParticlelock = obj.getComponent(ParticleFireworks) as ParticleFireworks;
        jsParticlelock.init(data);
    }

    getScore(){
        if (!this.prefabTable[FightPoolManger.PATH_Score]) return null;
        let node = this.ScorePool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_Score]);
        }
        return node;
    }
    putScore(node:cc.Node){
        node.parent = null;
        this.ScorePool.put(node);
    }
    createScore(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getScore();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(Score) as Score;
        jsObj.init(data);
    }

    getHammerAni(){
        if (!this.prefabTable[FightPoolManger.PATH_HammerAni]) return null;
        let node = this.HammerAniPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_HammerAni]);
        }
        return node;
    }
    putHammerAni(node:cc.Node){
        node.parent = null;
        this.HammerAniPool.put(node);
    }
    createHammerAni(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        
        let obj = this.getHammerAni();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        return obj;
    }

    getParticleRandom(){
        if (!this.prefabTable[FightPoolManger.PATH_ParticleRandom]) return null;
        let node = this.ParticleRandomPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ParticleRandom]);
        }
        return node;
    }
    putParticleRandom(node:cc.Node){
        node.parent = null;
        this.ParticleRandomPool.put(node);
    }
    createParticleRandom(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getParticleRandom();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(ParticleRandom) as ParticleRandom;
        jsObj.init(data);
        // return obj;
    }
    getInColor(){
        if (!this.prefabTable[FightPoolManger.PATH_InColor]) return null;
        let node = this.InColorPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_InColor]);
        }
        return node;
    }
    putInColor(node:cc.Node){
        node.parent = null;
        this.InColorPool.put(node);
    }
    createInColor(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getInColor();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(InColor) as InColor;
        jsObj.init(data);
        return jsObj;
    }

    getTextEffect(){
        if (!this.prefabTable[FightPoolManger.PATH_TextEffect]) return null;
        let node = this.TextEffectPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_TextEffect]);
        }
        return node;
    }
    putTextEffect(node:cc.Node){
        node.parent = null;

        this.TextEffectPool.put(node);
    }
    createTextEffect(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getTextEffect();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(TextEffect) as TextEffect;
        jsObj.init(data);
        // return jsObj;
    }

    getHongBao(){
        if (!this.prefabTable[FightPoolManger.PATH_HongBao]) return null;
        let node = this.HongBaoPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_HongBao]);
        }
        return node;
    }
    putHongBao(node:cc.Node){
        node.parent = null;
        this.HongBaoPool.put(node);
        FightManger.getInstance().HongBao = null;
    }
    createHongBao(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getHongBao();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(HongBao) as HongBao;
        jsObj.init(data);
        return jsObj;
    }
    getInColorEffect(){
        if (!this.prefabTable[FightPoolManger.PATH_InColorEffect]) return null;
        let node = this.InColorEffectPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_InColorEffect]);
        }
        return node;
    }
    putInColorEffect(node:cc.Node){
        node.parent = null;
        this.InColorEffectPool.put(node);
    }
    createInColorEffect(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getInColorEffect();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(InColorEffect) as InColorEffect;
        jsObj.init(data);
        return jsObj;
    }
    getPassEffect(){
        if (!this.prefabTable[FightPoolManger.PATH_PassEffect]) return null;
        let node = this.PassEffectPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_PassEffect]);
        }
        return node;
    }
    putPassEffect(node:cc.Node){
        node.parent = null;
        this.PassEffectPool.put(node);
    }
    createPassEffect(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getPassEffect();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(PassEffect) as PassEffect;
        jsObj.init(data);
        return jsObj;
    }

    getScoreEffect(){
        if (!this.prefabTable[FightPoolManger.PATH_ScoreEffect]) return null;
        let node = this.ScoreEffectPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_ScoreEffect]);
        }
        return node;
    }
    putScoreEffect(node:cc.Node){
        node.parent = null;
        this.ScoreEffectPool.put(node);
    }
    createScoreEffect(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getScoreEffect();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(ScoreEffect) as ScoreEffect;
        jsObj.init(data);
        return jsObj;
    }

    getTargetCompleteEffect(){
        if (!this.prefabTable[FightPoolManger.PATH_TargetCompleteEffect]) return null;
        let node = this.TargetCompleteEffectPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_TargetCompleteEffect]);
        }
        return node;
    }
    putTargetCompleteEffect(node:cc.Node){
        node.parent = null;
        this.TargetCompleteEffectPool.put(node);
    }
    createTargetCompleteEffectt(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getTargetCompleteEffect();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(TargetCompleteEffect) as TargetCompleteEffect;
        jsObj.init(data);
        return jsObj;
    }

    getVideoBox(){
        if (!this.prefabTable[FightPoolManger.PATH_VideoBox]) return null;
        let node = this.VideoBoxPool.get();
        if (node == null) {
            node = cc.instantiate(this.prefabTable[FightPoolManger.PATH_VideoBox]);
        }
        return node;
    }
    putVideoBox(node:cc.Node){
        node.parent = null;
        this.VideoBoxPool.put(node);
    }
    createVideoBox(parentNode:cc.Node,pos:cc.Vec2,data?:any){
        let obj = this.getVideoBox();
        parentNode.addChild(obj);
        obj.setPosition(pos);
        let jsObj = obj.getComponent(VideoBox) as VideoBox;
        jsObj.init(data);
        return jsObj;
    }
    
}