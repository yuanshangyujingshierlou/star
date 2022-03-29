/**
 * 优化滚动试图ts
 * author : lidongdong
 * time: 2019.10.17
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class ViewScrollviewPool {

    SpacingNum:number = 10; //间距

    scrollview:cc.ScrollView = null; //滚动视图组件
    contentNode:cc.Node= null; //滚动内容Node
    itemPre:cc.Prefab = null;  //单项预制体
    dataList:any = null; //滚动视图的数据列表
    itemCallBack:Function = null;//回调函数
    initCreateItemNum:number = 0;//初始化创建Item的数量

    ItemWidth:number = 0;
    ItemHeight:number = 0;
    ContentY:number = 0;
    ViewWidth:number = 0;
    ViewHeight:number = 0;
    RowNum:number = 0;
    itemNodeList:cc.Node[] = []; //缓存
    itemMap:{[key:number]:cc.Node} = {}
    /**
     * 1初始化数据
     * @param ItemWidth 单项的宽度 (作图的时候 ItemWidth * RowNum = ViewWidth)
     * @param ItemHeight 单项的高度
     * @param ContentY scrollview 下content的Y坐标
     * @param ViewWidth scrollview 下的view的宽度
     * @param ViewHeight scrollview 下的view的高度
     * @param RowNum 一行有几个Item 数
     * @param initCreateItemNum 初始化创建几个Item
     * @param SpacingNum 间距
     */
    initView(ItemWidth:number,ItemHeight:number,ContentY:number,ViewWidth:number,ViewHeight:number,RowNum:number,initCreateItemNum:number,SpacingNum:number){
        cc.log("===initView=====")
        this.ItemWidth = ItemWidth;
        this.ItemHeight = ItemHeight + SpacingNum;
        this.ContentY = ContentY;
        this.ViewWidth = ViewWidth;
        this.ViewHeight = ViewHeight;
        this.RowNum = RowNum;
        this.initCreateItemNum = initCreateItemNum;
        this.SpacingNum = SpacingNum;
    }
    /**
     * 2初始化 滚动视图
     * @param scrollview scrollview 组件
     * @param contentNode contentNode 
     * @param itemPre item的预制体
     * @param dataList data数据
     * @param itemCallBack 回调函数 处理Item
     */
    initPoolScrollview(scrollview:cc.ScrollView,contentNode:cc.Node,itemPre:cc.Prefab,dataList:any,itemCallBack:Function){
        this.scrollview = scrollview;
        this.contentNode = contentNode;
        this.itemPre = itemPre;
        this.dataList = dataList;
        this.itemCallBack = itemCallBack;
        let num = this.initCreateItemNum;
        if(this.dataList.length <= this.initCreateItemNum){
            num = this.dataList.length;
        }
        for (let i = 0; i < num; ++i) {
            this.createItemNode();
        }
        this.scrollview.node.on("scrolling",this.callback,this);
        this.contentNode.setContentSize(this.ViewWidth,this.getContenHeight())
        this.contentNode.setPosition(cc.v2(0,this.ContentY))
        this.refreshItem()
    }
    callback (event) {
        //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 ScrollView 组件
        var scrollview = event.detail;
        //do whatever you want with scrollview
        //另外，注意这种方式注册的事件，也无法传递 customEventData
        // cc.log("x="+this.node_content.position.x+" y="+this.node_content.position.y);

        this.refreshItem();
    }
    refreshItem(){
        //最上面的Item的Index
        let minItemIndex = Math.floor((this.contentNode.position.y - this.ContentY)/this.ItemHeight);
        let maxItemIndex = Math.ceil((this.contentNode.position.y + this.ViewHeight - this.ContentY)/this.ItemHeight);
        
        for (let index = 0; index < this.dataList.length; index++) {
            if(index >= minItemIndex*this.RowNum && index <= maxItemIndex*this.RowNum){
                let item = this.itemMap[index]
                if(item!= null){

                }else{
                    this.addItem(index)
                }
            }else{
                let item = this.itemMap[index]
                if ( item != null) {
                    //已存在，需要移除
                    this.itemRemove(index,item);
                    
                }
            }
        }
    }
    itemRemove(index : number, item : cc.Node){
        this.itemMap[index] = null;
        delete this.itemMap[index];
        item.active = false
        this.itemNodeList.push(item)
    }
    addItem(index:number){
        
        let itemData = this.getItemData(index);
        let objItem : cc.Node = null;
        if (this.itemNodeList.length <= 0) {
            this.createItemNode();
        }
        objItem = this.itemNodeList.pop();
        objItem.active = true;
        let line = index%this.RowNum;
        let row = Math.floor(index/this.RowNum);
        objItem.x = line*this.ItemWidth-this.ViewWidth/2+this.ItemWidth/2
        objItem.y = -row*this.ItemHeight-this.ItemHeight/2;

        this.itemMap[index] = objItem;
        this.itemCallBack(objItem,itemData,index)
    }
    /**
     * 创建ItemNode
     */
    createItemNode() {
        console.log("=====create========")
        let obj = cc.instantiate(this.itemPre); // 创建节点
        obj.active = false;
        this.contentNode.addChild(obj)
        this.itemNodeList.push(obj);
    }
    /**
     * 获取conten的高
     */
    getContenHeight():number{
        let rowNum = Math.ceil(this.dataList.length/this.RowNum); //向上取整 几行
        let contentHeight = rowNum*this.ItemHeight
        if(contentHeight <= this.ViewHeight + this.SpacingNum){
            contentHeight =this.ViewHeight+this.SpacingNum;
        }
        return contentHeight;
    }
    getItemData (index : number) : any {
        // return this.dataList[this.dataNum-1-index];
        return this.dataList[index];
     }
}
