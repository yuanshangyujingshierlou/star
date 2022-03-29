import AdaptarManager from "../core/Manager/AdaptarManager";
import LoaderManager from "../core/Manager/LoaderManager";
import GameDataManager from "../core/Manager/GameDataManager";
import ItemBlock from "./fight/ItemBlock";
import PlatformManger from "../core/platform/PlatformManger";
import Const from "./Const";


/**
 * 新手引导
 */
export enum GuideIds {
	gamePrompt = 0, 	//游戏提示	
	hongBaoPrompt = 1, 	//红包提示;	
}
export default class Guide {
    private static instance: Guide = null;
    public static getInstance(): Guide {
		if (Guide.instance == null) {
			Guide.instance = new Guide();
		}
		return Guide.instance;
	}
	nowGuideId: number = -1; //现在的Id
	isShowing: boolean = false; //是否显示中
	guideViewNode: cc.Node = null; //
	constructor() {

    }
    createView(){
        this.guideViewNode = new cc.Node()
        this.guideViewNode.width = AdaptarManager.getInstance().fullWidth;
        this.guideViewNode.height = AdaptarManager.getInstance().fullHeight;
        let scece = cc.director.getScene()
        scece.addChild(this.guideViewNode)
        this.guideViewNode.setPosition(cc.v2(AdaptarManager.getInstance().fullWidth/2,AdaptarManager.getInstance().fullHeight/2))
    }
    /**
     * 关闭引导
     * @param guideId  引导id
     * @param force  
     */
    closwGuid(guideId:number,force:boolean = false){
        if(this.nowGuideId != guideId && !force){
            return false;
        }
        if(this.isShowing){
            this.isShowing = false
            this.nowGuideId = -1;
            this.guideViewNode.destroy()
            return true;
        }
        return false
    }
    /**
     * 
     */
    openGuide():Guide{
        if (this.isShowing){
			return this;
		}
        this.createView()
        this.isShowing = true;
        return this;
    }
    /**
     * 创建遮罩
     * @param maskType 类型  1 方块  2 圆
     * @param maskPos 遮罩的位置
     * @param maskWidth 遮罩的大小宽
     * @param maskHeight 遮罩的大小高
     * @param bgPost 遮罩背景 位置
     * @param bgWidth 遮罩背景的大小宽
     * @param bgHeight 遮罩背景的大小高
     */
    public async createMask(maskType:number,maskPos:cc.Vec3,maskWidth:number,maskHeight:number,bgPost:cc.Vec2,bgWidth:number,bgHeight:number,){
        let path = "prefabs/common/GuideNode"
        let prefab = await LoaderManager.getInstance().loadRes(path,cc.Prefab) as cc.Prefab;
        let maskNode:cc.Node = cc.instantiate(prefab);
        this.guideViewNode.addChild(maskNode);
        maskNode.width = maskWidth;
        maskNode.height = maskHeight;
        maskNode.setPosition(maskPos)
        let mask:cc.Mask = maskNode.getComponent(cc.Mask)
        if(maskType == 1){
            mask.type = cc.Mask.Type.RECT; //方块
        }else if(maskType == 2){
            mask.type = cc.Mask.Type.ELLIPSE; //圆
        }
        let bg :cc.Node= maskNode.getChildByName("sprite_bg")
        bg.width = bgWidth;
        bg.height = bgHeight;
        bg.setPosition(bgPost)
    }
    //创建骨骼动画
    public async createSpine(spinePos:cc.Vec2){
        let path = "prefabs/common/spineNode" //动态加载龙骨
        let prefab = await LoaderManager.getInstance().loadRes(path,cc.Prefab) as cc.Prefab;
        let spineNode:cc.Node = cc.instantiate(prefab);
        this.guideViewNode.addChild(spineNode);
        spineNode.setPosition(cc.v2(spinePos.x + 61,spinePos.y -122))
        let ske :sp.Skeleton = spineNode.getComponent(sp.Skeleton)
        ske.setAnimation(0,"point", true);
        // spine
    }
    
    public async createLabel(spinePos:cc.Vec2,type){
        let path = "prefabs/common/GuideLabel" //动态加载龙骨
        let prefab = await LoaderManager.getInstance().loadRes(path,cc.Prefab) as cc.Prefab;
        let spineNode:cc.Node = cc.instantiate(prefab);
        this.guideViewNode.addChild(spineNode);
        spineNode.setPosition(cc.v2(spinePos.x,spinePos.y))
        spineNode.getComponent("GuideLabel").init({Type:type})
        
        // spine
    }
    // public async createLabel(LabelPos:cc.Vec3,str:string){
    //     let node = new cc.Node()
    //     let label:cc.Label = node.addComponent(cc.Label)
    //     label.node.color = cc.color(255,255,255,255)
    //     let out = node.addComponent(cc.LabelOutline)
    //     out.width = 0.6
    //     out.color = cc.color(255,255,255,255)
    //     label.fontSize = 35;
    //     label.string = str;
    //     node.zIndex = 100;
    //     this.guideViewNode.addChild(node);
    //     node.setPosition(cc.v2(LabelPos.x - 60,LabelPos.y - 150))
    //     // spine
    // }
    /**
     * 
     * 
     */
    showPrompt(ItemBlock:ItemBlock){
        if (GuideIds.gamePrompt != GameDataManager.getInstance().userData.guideId) {
			return
        }
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.guide_1.eventID,Const.AndroidEvent.guide_1.eventName)
        let itemPos = ItemBlock.node.convertToWorldSpaceAR(cc.v2(0,0))
        let pos = this.guideViewNode.convertToNodeSpaceAR(itemPos);
        this.createSpine(pos)
        let labelPos = cc.v2(0,pos.y + 100)
        this.createLabel(labelPos,1)
        this.nowGuideId = GameDataManager.getInstance().userData.guideId;
        GameDataManager.getInstance().userData.setGuideId(GameDataManager.getInstance().userData.guideId + 1);
    }
    showHongBaoPrompt(hongBao:cc.Node){
        if (GuideIds.hongBaoPrompt != GameDataManager.getInstance().userData.guideId) {
			return
        }
        PlatformManger.getInstance().addOnEvent(Const.AndroidEvent.guide_2.eventID,Const.AndroidEvent.guide_2.eventName)
        let itemPos = hongBao.convertToWorldSpaceAR(cc.v2(0,0))
        let pos = this.guideViewNode.convertToNodeSpaceAR(itemPos);
        this.createSpine(pos)
        let labelPos = cc.v2(0,pos.y + 150)
        this.createLabel(labelPos,2)
        this.nowGuideId = GameDataManager.getInstance().userData.guideId;
        GameDataManager.getInstance().userData.setGuideId(GameDataManager.getInstance().userData.guideId + 1);
    }
}
