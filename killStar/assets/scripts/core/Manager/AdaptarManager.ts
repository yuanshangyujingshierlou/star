

export default class AdaptarManager{
    private static instance: AdaptarManager;
    public static getInstance(): AdaptarManager
    {
        if(this.instance == null)
        {
            this.instance = new AdaptarManager();
        }
        return this.instance;
    }
    static WIDTH = 720;
    static HEIGHT = 1280;
    fullWidth:number=0;
    fullHeight:number = 0;
    //横屏
    initLandscape(){
        let designSize = cc.view.getFrameSize();
        let deviceHeight = designSize.height
        let deviceWidth = designSize.width
        this.fullWidth = deviceHeight/deviceWidth * AdaptarManager.WIDTH;
        this.fullHeight = AdaptarManager.WIDTH;
    }
    //---------------------------
    /**
     * 竖屏
     */
    initVertical(){
        let designSize = cc.view.getFrameSize();
        let deviceHeight = designSize.height
        let deviceWidth = designSize.width
        this.fullHeight = deviceHeight/deviceWidth * AdaptarManager.WIDTH;
        this.fullWidth = AdaptarManager.WIDTH;
    }
    adaptarBg(bgNode:cc.Node){
        if (bgNode) {
            bgNode.width = this.fullWidth;
            bgNode.height = this.fullHeight;
            bgNode.setPosition(cc.v2(0,0))
        }
    }
    adaptarLogo(logoNode){
        if (logoNode) {
            logoNode.y = this.fullHeight/2 - 380
        }
    }
    //适配底部UI
    adapterVerticalUIBottom(node) {
        if (node) {
            node.y = -this.fullHeight/2 + 230
            if((this.fullHeight / this.fullWidth ) > 2.0){ //长屏
                node.y = -this.fullHeight/2 + 360
            }
        }
    }
    //适配游戏的底部配置
    adapterFightUIBottom(node) {
        if (node) {
            // node.y = -this.fullHeight/2 + Const.Adapter.FightUIBottom + 50
            node.y = -450
            if(this.fullHeight > 1334){
                node.getChildByName("iconBottom").y = -150
            }else if(this.fullHeight <= 1334){
                node.getChildByName("iconBottom").y = -75
            }
        }
    }
    adapterDarwMoneyDownUI(node){
        if (node) {
            node.y = -this.fullHeight/2 + 20
        }
    }
    adapterFightUITop(node) {
        if (node) {
            if(this.fullHeight >= 1400){
                node.y = this.fullHeight/2;
                if(node.getChildByName("dongtaiIcon")){
                    node.getChildByName("dongtaiIcon").y = node.getChildByName("dongtaiIcon").y - 120
                }
            }else{
                node.y = this.fullHeight/2;
            }
        }
    }

    adapterFightUIMoveNode(node){
        if (node) {
            if(this.fullHeight == 1280){
                node.y = -177;
            }else if(this.fullHeight > 1280 && this.fullHeight < 1400){
                node.y = -177 - (this.fullHeight - 1280)/2
            }else if(this.fullHeight >= 1400){
                node.y = -177 - (this.fullHeight - 1280 - 80)/2
            }
        }
    }
    //适配上面的UI
    adapterVerticalUITop(node) {
        if (node) {
            node.y = this.fullHeight/2 - 70
            if((this.fullHeight / this.fullWidth ) > 1.8){
                node.y = this.fullHeight/2 - 70
            }
        }
    }
    //是不是长屏幕
    isChangPing(){
        if(this.fullHeight >= 1400){
            return true;
        }
        return false;
    }
    //适配上面的UI
    adapterVerticalUIFindTop(node) {
        if (node) {
            node.y = this.fullHeight/2
            if((this.fullHeight / this.fullWidth ) > 2.0){
                node.y = this.fullHeight/2 - 170
            }
        }
    }
    //适配弹出框
    adapterVerticalUIWnd(node){
        if (node) {
            node.x = AdaptarManager.WIDTH/2
            node.y = this.fullHeight/2
        }
    }
}
