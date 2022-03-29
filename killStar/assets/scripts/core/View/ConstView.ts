export default class ConstView  {
    /**
     * src 预制体 路径
     * type 类型 
     * NormalNode 节点界面
     * ChildNode 子节点
     * PopUpNode 弹出框界面 
     */
    //节点
    static ViewNode = {
        Veiw_Node:"ViewNode",
        PopUp_Node:"PopUpNode",
    }
    //path
    static ViewPath = {
        ViewRoot_Name:"Canvas/ViewRoot",
    }
    //窗口类型
    static ViewType = {
        /** 普通窗口 */
        View:0,  
        /** 弹出窗口 */
        PopUp:1, 
    }
    /**显示类型 */
    static VeiwShowMode = {
        /** 普通, 窗体的显示和关闭并不会影响其他窗体 */
        View:0,
        /** 反向切换, 窗体关闭时, 会显示其他窗体 */
        PopUp:1,                      
    }
    /** 是否清理弹出框 */
    static CleanPopUpView = {
        Clean:true,
        Unclean:false,
    }
    static ViewKeyMap = {
        /**
         * src 预制体路径
         * type 窗口类型
         * showMode 显示模式
         * isCleanPopUpView : 是否清理弹出框
         * ZOrder
         */
        "ViewLogin":{src: "prefabs/view/ViewLogin",type:ConstView.ViewType.View,showMode:ConstView.VeiwShowMode.View,isCleanPopUpView:ConstView.CleanPopUpView.Clean,ZOrder:0},
        "ViewFight":{src: "prefabs/view/ViewFight",type:ConstView.ViewType.View,showMode:ConstView.VeiwShowMode.View,isCleanPopUpView:ConstView.CleanPopUpView.Clean,ZOrder:0},
        

        "TextPopUp":{src: "prefabs/view/TextPopUp",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "LevelUpReward":{src: "prefabs/view/LevelUpReward",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "EveryDayReward":{src: "prefabs/view/EveryDayReward",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "hongBaoCunQianGuan":{src: "prefabs/view/hongBaoCunQianGuan",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "zhuanpan":{src: "prefabs/view/zhuanpan",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "HongBaoPopup":{src: "prefabs/view/HongBaoPopup",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "signRedWin":{src: "prefabs/view/signRedWin",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "proppop":{src: "prefabs/view/proppop",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewFail":{src: "prefabs/view/ViewFail",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewRegain":{src: "prefabs/view/ViewRegain",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewGetProp":{src: "prefabs/view/ViewGetProp",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewDrawMoneyMain":{src: "prefabs/view/ViewDrawMoneyMain",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewDrawMoneyInput":{src: "prefabs/view/ViewDrawMoneyInput",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewHongBao":{src: "prefabs/view/ViewHongBao",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewDrawMoney":{src: "prefabs/view/ViewDrawMoney",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewDrawMoneyTip":{src: "prefabs/view/ViewDrawMoneyTip",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewDrawMoneyRecord":{src: "prefabs/view/ViewDrawMoneyRecord",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        
        "ViewInviteFriend":{src: "prefabs/view/ViewInviteFriend",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewSet":{src: "prefabs/view/ViewSet",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        "ViewPassOrInvite":{src: "prefabs/view/ViewPassOrInvite",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0},
        
        //"potView":{src: "prefabs/window/start/startWnd",type:ConstView.ViewType.PopUp,showMode:ConstView.VeiwShowMode.PopUp,isCleanPopUpView:ConstView.CleanPopUpView.Unclean,ZOrder:0}
    }

}
