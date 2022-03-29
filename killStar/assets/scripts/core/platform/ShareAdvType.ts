
export default class ShareAdvType {

    public static TypeNum = 11
    //分享 视频 类型
    public static ShareAdvType = {
        none: 0,            //无
        addPropRefrsh: 1,//刷新
        addPropHammer: 2,//锤子
        addPropIncolor: 3,//换色
        addPropRandom:4,//随机消除
        hongBaoInLevelDouble:5,//红包关卡内
        hongBaoPass:6,//红包过关
        hongBaoInvite:7,//红包邀请
        revive:8,//复活
        guoguanquanping:9,//过关视频（可关闭）
        addPropBomb:10,//
        videoBox:11,//视频宝箱
    }
    //显示广告 或者 分享
    public static shareAdvShow:{ [index: number]: number } = {
        0: 0,     // 0 显示分享 1 显示广告
        1: 1,            
        2: 1,               
        3: 1,               
        4: 1,                              
        5: 1,                              
        6: 1,                              
        7: 1,                              
        8: 1,                              
        9: 1,                              
        10: 1,                              
        11: 1,                              
    }  
    public static shareAdvName:{ [index: number]: string } = {
        0: "普通",               
        1: "道具刷新-视频",            
        2: "道具锤子-视频",                 
        3: "道具换色-视频",             
        4: "道具随机消除-视频",                          
        5: "红包关卡内-视频",                          
        6: "红包过关-视频",                          
        7: "红包邀请-视频",                          
        8: "复活-视频",                          
        9: "过关视频（可关闭）",                          
        10: "道具炸弹-视频",                          
        11: "视频宝箱-视频",                          
    }  
    public static androidName:{ [index: number]: string } = {
        0: "putong",               
        1: "shipin-shuaxin",            
        2: "shipin-chuizi",                 
        3: "shipin-huanse",              
        4: "shipin-xiaochu",                          
        5: "shipin-shuangbei",                          
        6: "shipin-hongbao-guoguan",                          
        7: "shipin-hongbao-yaoqing",                          
        8: "shipin-fuhuo",
        9: "guoguanquanping",                       
        10: "shipin-zhadan",                      
        11: "shipin-piaofubaoxiang",                      
    } 
    public static AllAdv(){
        for(let index = 1;index <= ShareAdvType.TypeNum;++index){
            ShareAdvType.shareAdvShow[index] = 1
        }
    }
    public static AllShare(){
        for(let index = 1;index <= ShareAdvType.TypeNum;++index){
            ShareAdvType.shareAdvShow[index] = 0
        }
    }
    
}
