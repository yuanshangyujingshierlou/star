// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightConst{

    static FightNum = {
        itemBlockWidth:72,//宽度
        itemBlockBgNum:8,//几种方块
        rowNum : 10, //行数
        gap:0,//每个方块的间隔
        startAnimationTime:100,//最开始动画生成的速度
        animationSpeed:0.3,//动画速度
        dissolveAnimationSpeed:0.04,//消失动画速度
        hintAnimationSpeed:0.5,//提示动画速度
        hintTime:3000,//多长时间开始提示
        particleDissolveTime: 1000,//粒子消失时间
        sortAnimationSpeed:0.5,//排序速度
        randomTime:0.2,//随机消除的时间
    }
    static GameStatus = { //游戏状态
        NoStart:0,      //没有开始
        StartGame:1,    //开始游戏
        PauseGame:2,    //暂停游戏
        EndGame:3,      //结束游戏
        DropStatus:4,   //下落状态
        RandomDropStatus:5,//随机下落的状态
        NOTouch:6,      //无法触摸状态
        HammerStatus:7,     //锤子状态
        RefrshStatus:8,      //排序状态
        IncolorStatus:9,   //换色状态；
        RandomStatus:10,   //随机消除状态；
        BombStatus:11,   //炸弹状态；

    }
    static ItemBlockStatus = {
        Normal: 0,      //普通
        YesTouch:1,     //可触发点击
        Dissolve:2,     //消失
    }
    static ItemBlockType = {
        Normal: 0,      //没有道具
        Double:1,       //双倍道具
        Bomb:2,         //炸弹道具
    }
    /**
     * 目标分数
     */
    static  TargetScore = {
        Score:5,//普通的方块给多少分
        PropScore:10,//道具消除每个给多少分
        OneScore:4000,
        MaxOneScore:8200,
        MaxScore:2200,
        TwoScore:1600,
        Table: [300,50,100],
    }
    //分数字体
    static Score = {
        SmallType:1,//小字
        BigType:2, //大字
        SmallSize:70, //字体的大小
        BigSize:140,
    }

    static PropTip = {
        PropRefrsh: "立即刷新当前布局",//刷新
        PropHammer: "可击碎任意选中的方块",//锤子
        PropIncolor: "将选中的方块更换成任意颜色",//换色
        PropRandom:"随机消除场上6至8个方块",//随机消除
        PropBomb:"消除3X3区域的方块",//随机消除
    }

    static randomRowNum:number = 0.25; //横向概率
    static randomVerticalNum:number = 0.25; //竖向概率

    static VideoPropNum = 0;
          
    static TargetScoreTotal = 1900;
    static ItemScore = 20;
    
}
