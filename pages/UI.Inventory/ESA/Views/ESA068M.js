window.__define_resource && __define_resource("BTN00070","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.9.24
2. Creator     : ParkHyunMin
3. Description : Location Add Node
4. Precaution  :
5. History     : 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                2016-03-21 안정환 소스 리팩토링 적용
6. Old File    : ESA068M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type3", "ESA068M", {

    treeURL: "/Inventory/Basic/GetSearchLocationLevelInfo",

    treeData: null,

    TYPE: "SEARCH",     //dto parameter

    detailPageID: "/ECERP/ESA/ESA052M",

    parentControlID: null,//"txtTreeWhCd",

    limitCount: 100,

    $tree: null,    //jstree 

    tree: null,     //ecount.layout.tree

    //contextmenu : ["rename", "delete"],
    //addroot: true,
    //show_at_node: false,
    searchPanel: null,

    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.initData = this.viewBag.InitDatas.LocationLevelInfo;
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    
    initProperties: function () {
        this.treeData = {
            CD_PARENT: 'ROOT',
            YN_USE: null,
            SEARCHVALUE: null
        },
        this.parentControlID = this.parentControlID;


    },
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.Type == "SEARCH") {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(resource.BTN00070));
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008)).setOptions({ css: "btn btn-default", ignorePrimaryButton: true });

        footer.add(toolbar);
    },

    //[tree event] - render complete
    onLoadTree: function (nodedata) {
        this._super.onLoadTree.apply(this, arguments);
    },

    //[tree event] - click node
    onSelectedNode: function (event, data) {
        this._super.onSelectedNode.apply(this, arguments);
    },

    //[tree event] - exceed limit
    onExceedLimit: function (event, data) {
        this._super.onExceedLimit.apply(this, arguments);
    },

    //[tree event] - called after rename 
    onRenameNode: function (data, handler) {
        handler.rollback();
    },

    //[tree event] - called before delete
    onDeleteNode: function (data, handler) {
        handler.complete();
    },

    //must override
    onSendData: function (data) {
        if (!this.checkLimitCount()) {
            return;
        }

        var selectedNode = this.tree.getSelected();
        var nodes = new Array();

        if (!data && selectedNode.length == 0) {
            nodes = new Array();
        }
        else {
            if (selectedNode.length == 0) {
                var node = { CODE: null, CODE_DES: null };                
                if (data.id) {
                    node.CODE = data.id;
                    node.CODE_DES = data.li_attr.hidtext;
                } else {
                    node.CODE = data[0].id;
                    node.CODE_DES = data[0].li_attr.hidtext;
                }
                nodes.push(node);
            }
            else {
                for (var i = 0, j = selectedNode.length; i < j ; i++) {
                    var node = { CODE: null, CODE_DES: null };
                    node.CODE = selectedNode[i].li_attr.id;
                    node.CODE_DES = selectedNode[i].li_attr.hidtext;
                    nodes.push(node);
                }
            }
        }

        var message = {
            name: "CODE_DES",
            code: "CODE",
            data: nodes,
            isAdded: false,
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    onFooterApply: function () {
        this.onSendData();
    },

    onFooterClose: function () {
        this.close();
    }


    //onContentsExtendTree: function () { },

    //onContentsCloseTree: function () { },


});
