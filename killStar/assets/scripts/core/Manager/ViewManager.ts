import ConstView from "../View/ConstView";
import BaseView from "../View/BaseView";
import LoaderManager from "./LoaderManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewManager extends cc.Component {

    private viewNode: cc.Node = null;                              // 全屏显示的UI 挂载结点
    private childNode: cc.Node = null;                               // 子节点 （场景上的单个单独的预制体挂点）
    private popUpNode: cc.Node = null;                               // 弹出窗口 的节点
    

    private allViewTable: {[key: string]: BaseView} = {};           // 所有的View
    private popUpViewTable:Array<BaseView> = [];                    // 所有弹出框View
    private nowShowViewTable: {[key: string]: BaseView} = {};       // 正在显示的窗体(不包括弹窗)
    private allNameTable: {[key: string]: string} = {};         // 所有的View名字

    private static instance: ViewManager;
    public static getInstance(): ViewManager
    {
        if(this.instance == null)
        {   
            //把ViewManager 添加到scene
            this.instance = cc.find(ConstView.ViewPath.ViewRoot_Name).addComponent<ViewManager>(this); 
        }
        return this.instance;
    }
    onLoad () {}
    start() {
        this.viewNode = this.node.getChildByName(ConstView.ViewNode.Veiw_Node); 
        this.popUpNode = this.node.getChildByName(ConstView.ViewNode.PopUp_Node);
    }
    
    /**
     * 显示View
     * @param viewName 窗体的名字
     * @param obj 初始化信息, 可以不要
     */
    public async ShowView(viewName: string, obj?: any) {
        if(this.nameIsShowing(viewName)){
            cc.log(`${viewName}窗体已经在显示`);
            return ; 
        }
        this.allNameTable[viewName] = viewName;
        let viewData = ConstView.ViewKeyMap[viewName]
        if(viewName == "" || viewName == null) return ;
        if(this.viewIsShowing(viewName)) {
            cc.log(`${viewName}窗体已经在显示`);
            return ;  
        }
        let baseView = await this.LoadAllVeiw(viewName);
        if(baseView == null) return ;
        // 初始化窗体名称
        baseView.ViewName = viewName;
        baseView.VeiwType.IsClearPopUpView = viewData.isCleanPopUpView
        baseView.VeiwType.View_Type = viewData.type
        baseView.VeiwType.Veiw_ShowMode = viewData.showMode
        // 初始化窗体信息   如果预制体默认active为true 那么先执行了onload start 在执行的init
        // 是否清理弹窗
        if(baseView.VeiwType.IsClearPopUpView) {
            this.ClearPopUpViewTable();
        }
        switch(viewData.showMode) {
            case ConstView.VeiwShowMode.View:                    // 普通模式显示
                this.LoadViewNowCache(viewName, obj);//界面
            break;
            case ConstView.VeiwShowMode.PopUp:                      // 反向切换
                this.PushViewToStack(viewName, obj); //弹窗
            break;
        }
    }
     /**
     * 重要方法 关闭一个UIForm
     * @param viewName 
     */
    public CloseView(viewName: string) {
        let viewData = ConstView.ViewKeyMap[viewName]
        if(viewName == "" || viewName == null) return ;
        let baseView = this.allViewTable[viewName];
        if(baseView == null) return;
        switch(viewData.showMode) {
            case ConstView.VeiwShowMode.View:                             // 普通模式显示
                this.ExitView(viewName);
            break;
            case ConstView.VeiwShowMode.PopUp:                      // 反向切换
                this.ExitPopVeiw(viewName);
            break;
        }

        // 判断是否销毁该窗体 
        if(baseView.CloseAndDestory) {
            LoaderManager.getInstance().releaseNodeRes(baseView.node);
        }
    }
    /**
     * 窗体是否正在显示
     * @param viewName 
     */
    public viewIsShowing(viewName: string) {
        let baseView = this.allViewTable[viewName];
        if (baseView == null) {
            return false;
        }
        return baseView.node.active;
    }
    public nameIsShowing(viewName: string){
        let baseView = this.allNameTable[viewName];
        if (baseView == null) {
            return false;
        }
        return true;
    }
    /**
     * 从全部的UI窗口中加载, 并挂载到结点上
     */
    private async LoadAllVeiw(viewName: string) {
        let baseView = this.allViewTable[viewName];
        if (baseView == null) {
            //加载指定名称的“UI窗体”
            baseView  = await this.LoadVeiw(viewName) as BaseView;
        }
        return baseView;
    }
    /**
     * 从resources中加载
     * @param viewName 
     */
    private async LoadVeiw(viewName: string) {
        let viewData = ConstView.ViewKeyMap[viewName]
        let strViewPath = viewData.src;
        if(strViewPath == "" || strViewPath == null){
            return ;
        }
        let pre = await LoaderManager.getInstance().loadRes(strViewPath,cc.Prefab) as cc.Prefab;
        let node: cc.Node = cc.instantiate(pre);
        let baseView = node.getComponent(BaseView);
        if(baseView == null) {
            return ;
        }
        node.active = false;
        switch(viewData.type) {
            case ConstView.ViewType.View:
                if(ViewManager.getInstance().viewNode) ViewManager.getInstance().viewNode.addChild(node);
            break;
            case ConstView.ViewType.PopUp:
                if(ViewManager.getInstance().popUpNode) ViewManager.getInstance().popUpNode.addChild(node);
            break;
        }
        this.allViewTable[viewName] = baseView;
        return baseView;
    }
     /**
     * 清除弹出框所有窗口
     */
    private ClearPopUpViewTable() {

        if(this.popUpViewTable.length >= 1){
            for (let index = this.popUpViewTable.length - 1; index >= 0; index--) {
                let element = this.popUpViewTable[index];
                for (const key in this.allViewTable) {
                    if(element == this.allViewTable[key]){
                        this.RemoveAllViewTable(key)
                        break;
                    }
                }
                element.Clsose();
            }
        }
        this.popUpViewTable = [];
        // if(this.popUpViewTable != null && this.popUpViewTable.length >= 1) {
        //     this.popUpViewTable = [];
        //     return true;
        // }
        // return false;
    }
    /**
     * 加载到缓存中
     * @param viewName
     */
    private LoadViewNowCache(viewName: string, obj: any) {
        let baseView: BaseView = null;
        let baseViewFromAllCache: BaseView = null;
        baseView = this.nowShowViewTable[viewName];
        if(baseView != null) return ;     // 要加载的窗口正在显示
        baseViewFromAllCache = this.allViewTable[viewName];
        if(baseViewFromAllCache != null) {
            baseViewFromAllCache.init(obj);
            this.nowShowViewTable[viewName] = baseViewFromAllCache;
            baseViewFromAllCache.showBaseView();
        }
    }
    /**
     * 加载到栈中(弹窗)
     * @param viewName
     */
    private PushViewToStack(viewName: string, obj: any) {
        if(this.popUpViewTable.length > 0) {
            let topView = this.popUpViewTable[this.popUpViewTable.length-1];
            topView.hidePopUpView(); 
        }
        let baseView = this.allViewTable[viewName];
        if(baseView == null) return ;
        baseView.init(obj);
        // 加入栈中, 同时设置其zIndex 使得后进入的窗体总是显示在上面
        this.popUpViewTable.push(baseView);       
        baseView.node.zIndex = this.popUpViewTable.length;
        baseView.showBaseView();
    }
    /**
     * --------------------------------- 关闭窗口 --------------------------
     */
    /**
     * 关闭View
     * @param viewName 
     */
    private ExitView(viewName: string) {
        let baseView = this.allViewTable[viewName];
        if(baseView == null) return ;
        baseView.Clsose();
        this.nowShowViewTable[viewName] = null;
        delete this.nowShowViewTable[viewName];
        this.RemoveAllViewTable(viewName)
    }
    private ExitPopVeiw(viewName) {
        if(this.popUpViewTable.length >= 2) {
            let topView = this.popUpViewTable.pop();
            topView.Clsose();
            topView = this.popUpViewTable[this.popUpViewTable.length-1];
            topView.showPopUpView();
        }else if(this.popUpViewTable.length >= 1) {
            let topView = this.popUpViewTable.pop();//pop() 方法用于删除并返回数组的最后一个元素。
            topView.Clsose();
        }
        this.RemoveAllViewTable(viewName)
    }
    private RemoveAllViewTable(viewName: string){
        this.allViewTable[viewName] = null;
        delete this.allViewTable[viewName];
        
        this.allNameTable[viewName] = null;
        delete this.allNameTable[viewName];
    }
}
