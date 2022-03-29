
export default class EventManager  {

    private static instance: EventManager;
    public static getInstance(): EventManager
    {
        if(this.instance == null)
        {
            this.instance = new EventManager();
        }
        return this.instance;
    }
    /*
        添加按钮事件监听
        1 btn 这个btn的node
        2 node 这个 node 节点是btn事件处理代码组件所属的节点
        3 MyComponent 这个是btn所属代码文件名 string类型
        4 callback btn的回调函数 string类型
        5 customEventData 自定义事件数据
    */
   /**
    * 添加按钮事件监听
    * @param btnNode btn的Node
    * @param thisNode 这个 node 节点是btn事件处理代码组件所属的节点
    * @param MyComponent 这个是btn所属代码文件名 string类型
    * @param callback btn的回调函数 string类型
    * @param customEventData 自定义事件数据
    */
    addBtnEvent(btnNode:cc.Node,thisNode:cc.Node,MyComponent:string,callback:string,customEventData:string){
        let clickEventHandler :cc.Component.EventHandler= new cc.Component.EventHandler();
        clickEventHandler.target = thisNode;
        clickEventHandler.component = MyComponent;
        clickEventHandler.handler = callback;
        clickEventHandler.customEventData = customEventData;
        var button = btnNode.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    }
}
