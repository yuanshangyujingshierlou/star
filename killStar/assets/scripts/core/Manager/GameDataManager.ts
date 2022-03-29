import UserData from "../Data/UserData";
import UserLocalData from "../Data/UserLocalData";
import FunUtils from "../Util/FunUtils";

class TempData {
    headimgurl:any = null;
    isInputInvite:boolean = true;//是否可以写邀请吗
    shareDesc:string = "";//分享内容
    isShowWelfare:boolean = true;//是否显示每日福利
    fenHongTotalTime:number = 0;//需要的总时间
    fenHongNumTime:number = 0;//剩余的时间
    meiRiFenHongMoney:number = 0;//每日分红
    fenHongAddMoney:number = 0;

    timingRedPacketTime:number = 0;//定时红包的时间
    timingRedPacketType:number = 2;//定时红包的状态 0未到时间 1今日已完成 2待领取 
    
    appleTotalNum:number = 20;
    appleNum:number = 15;

    newUserRedPacket:number = 0;//新用户红包数量;

    SignInNum:number = 0;
    // time:number = 0
    // exportData = null;//导出数据

    // apiToken:any = null;//登录获得的token
    // uid:any = null;
} 
class KaiGuan {
    isOpenTouch:boolean = false;
    isOpenRedPackage:boolean = true;    //是否开启红包
    bannerRefreshTime:number = 3000;  //banner刷新时间
    isOpenShare: boolean = true;    //是否开启分享
    shareDelay : number = 3000;     //分享延迟
    isAllVideo: boolean = false;    //是否全视频
    isAllShare: boolean = false;    //是否全分享
    isEnableOut: boolean = false;    //是否允许导出

    
    isAreaMask: boolean = false;    //是否区域屏蔽
    isPingbiUser : boolean = false; //是否屏蔽用户
}

class HongBao {
    isShowHongBao_inLevel:boolean = true; //关卡内红包是否显示;
    hongBaoNum_inLevel:number = 0;//关卡内红包数量;
    hongBaoNum_inLevel_double:number = 0;//关卡内红包数量;双倍
    
    isShowHongBao_pass:boolean = true; //过关红包是否显示;
    hongBaoNum_pass:number = 0;//过关红包钱数;
    passHongBaoNum:number = 0;//过关红包个数;

    isPassvideo:boolean = true;//过关取消是否看视频
    isPassAdv:boolean = true;//过关收下是否看视频
    isCloseHongBao:boolean = true;//过关取消是否给红包
}

class LoginData {
    code: string = "";       //登陆凭证
    uid: number = 0;
    sid: string = null;
    openid: string = "";
    unionid: string = "";
}
export default class GameDataManager  {

    private static instance: GameDataManager;
    public static getInstance(): GameDataManager
    {
        if(this.instance == null)
        {
            this.instance = new GameDataManager();
        }
        return this.instance;
    }
    tempData: TempData = new TempData();
    kaiGuan: KaiGuan = new KaiGuan();
    loginData: LoginData = new LoginData();
    hongBao: HongBao = new HongBao();

    static KEY_USER_DATA = "userData_sister";
    userData: UserData = new UserData();
    static KEY_USER_LOCAL_DATA = "userLocalData_sister";
    userLocalData:UserLocalData = new UserLocalData();
    init(){
        this.loadAllData()
    }
    loadAllData(){
        let userData = this.getLocalData(GameDataManager.KEY_USER_DATA);
        if(userData){
            this.userData.copy(userData);
            this.onDataInit();
        }
        let name = FunUtils.randomWord(false,8,8)
        this.userData.setName(name,false)
        this.userData.setInvitationNum(name,false)
        let userLocalData = this.getLocalData(GameDataManager.KEY_USER_LOCAL_DATA);
        if(userLocalData){
            this.userLocalData.copy(userLocalData);
        }
        let openId = FunUtils.randomWord(true,6,10)
        this.userLocalData.setOpenId(openId) //设置UId
        this.userLocalData.setRegisteredTime(Date.now())//设置注册时间
    }
    //获取数据
    getLocalData(key:string) {
        let str =cc.sys.localStorage.getItem(key);
        if (str) {
            try {
                let data = JSON.parse(str);
                return data;
            } catch (error) {
                console.log(error);
            }
            return null;
        }
        return null;
    }
    //保存数据
    setLocalData(key:string,data:any) {
        let str = "{}";
        if (data) {
            str = JSON.stringify(data);
        }
        cc.sys.localStorage.setItem(key, str);
    }
    saveUserData(){
        this.setLocalData(GameDataManager.KEY_USER_DATA,this.userData);
    }
    saveUserLocalData(){
        this.setLocalData(GameDataManager.KEY_USER_LOCAL_DATA,this.userLocalData);
    }
    /**
     * 玩家数据初始化
     */
    onDataInit() {
        //隔天初始化
        GameDataManager.getInstance().userData.nextDayClean();
    }
    //移除键值对
    removeItem(key:string){
        cc.sys.localStorage.removeItem(key)
    }
    getUserHead() {
        
    }
    // update (dt) {}
}
