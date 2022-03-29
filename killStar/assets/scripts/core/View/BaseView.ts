import ConstView from "./ConstView";
import ListenerManager from "../Manager/ListenerManager";


export class ViewType {
    /** 是否清弹窗 */
    public IsClearPopUpView = false;
    //UI窗体（位置）类型
    public View_Type = ConstView.ViewType.View;
    //UI窗体显示类型
    public Veiw_ShowMode = ConstView.VeiwShowMode.View;
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseView extends cc.Component {
    /** 窗体名字,该窗体的唯一标示(请不要对这个值进行赋值操作, 内部已经实现了对应的赋值) */
    public ViewName: string;
    /** 窗体类型 */
    public VeiwType = new ViewType();
    /** 关闭窗口后销毁 (注意, 此销毁会销毁结点资源,以及其依赖的资源,例如cc.Sprite的图片, 音频等等, 如果你只想销毁结点,请手动调用node的destory方法) */
    public CloseAndDestory = false;
    // onLoad () {}
    start () {
    }
    /**
     * 消息初始化
     * 子类需重写此方法
     * @param obj
     */
    public init(obj?: any) {
        // todo...
    }
    /**
     * 显示窗体
     */
    public showBaseView(){
        this.node.active = true;
        //是不是弹出窗口
        if(this.VeiwType.View_Type == ConstView.ViewType.PopUp) { //
            this.ShowPopUpAnimation(() => {

            });
        }
    }
    /**
     * 显示弹出框
     */
    public showPopUpView() {
        // this.node.active = true;
        // if(this.VeiwType.View_Type == ConstView.ViewType.PopUp) {
            
        // }
    }
    /**
     * 隐藏弹出框 
     */
    public hidePopUpView() {
        // if(this.VeiwType.View_Type == ConstView.ViewType.PopUp) {
        //     this.node.active = false;
        // }
    }
    /**
     * 隐藏, 已经进行删除操作(在全局表中有缓存)
     */
    public Clsose() {
        if(this.VeiwType.View_Type == ConstView.ViewType.PopUp){

        }
        this.HidePopUpAnimation(() => {
            // this.node.active = false;
            this.onClose()
        });
    }
    public onClose(){
        this.node.destroy();
        ListenerManager.getInstance().removeMessageByTarget(this)
    }
    
    /**
     * 弹窗动画
     */
    public ShowPopUpAnimation(callback: Function) {
        callback();
    }
    public HidePopUpAnimation(callback: Function) {
        callback();
    }

    // update (dt) {}
}
