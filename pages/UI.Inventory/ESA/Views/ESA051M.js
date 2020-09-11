window.__define_resource && __define_resource("BTN00050","MSG00141","BTN00070","BTN00065","BTN00008","BTN00226","MSG10101","MSG10102","MSG10100","BTN00225","MSG02642","MSG09073","LBL09297","LBL03176","LBL07309","LBL07432","LBL00574","LBL00568","LBL02736","LBL02722","MSG03610","MSG00639");
/****************************************************************************************************
1. Create Date : 2015.07.09
2. Creator     : Nguyen Anh Tuong 
3. Description : Location Add Node
                 재고1 > 기초등록 > 창고등록 > 계층그룹 > 왼쪽 페이지
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                                    - Modify sendMessage function
                 [2016-02-17] Nguyen Anh Tuong : 창고계층그룹 공통화 Location Level Group Standardization
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 [2018.05.30] 임태규 : Tree 구조 변경으로 init 필수값 추가 Added Default init value for Data Tree
                 [2019.04.15] 이현택 : UpdateCopyGroupAuthUserAction 3.0 호출로 변경
6. Old File    : ESA051M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type3", "ESA051M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    treeURL: "",

    detailPageID: "",

    parentControlID: null,

    limitCount: 30,

    addroot: true,

    show_at_node: false,

    TYPE: null,

    $tree: null,

    tree: null,

    searchPanel: null,

    off_key_esc: true,

    init: function () {
        this._super.init.apply(this, arguments);
        this.initData = this.viewBag.InitDatas.LocationLevelInfo;
        this.initProperties();
        this.treeData.SEARCHVALUE = null;
        this.treeData.TYPE = this.viewBag.DefaultOption.Type;
        this.parentControlID = this.viewBag.DefaultOption.Type == "SEARCH" ? (this.viewBag.DefaultOption.parentID ? this.viewBag.DefaultOption.parentID : "txtTreeDeptCd") : null;
        this.limitCount = this.viewBag.DefaultOption.LimitCount ? this.viewBag.DefaultOption.LimitCount : 100;
        this.contextmenu = ["SEARCH", "SELECT"].contains(this.viewBag.DefaultOption.Type) ? [] : ["add", "move", "rename", "deactivate", "activate", "delete", "viewauthor"];
        this.addroot = this.viewBag.DefaultOption.Type == 'SEARCH' ? false : true;
        this.registerDependencies("ecount-tree");
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    // Set Default Properties
    initProperties: function () {
        this.parentControlID = this.viewBag.DefaultOption.Type == "SEARCH" ? "txtTreeWhCd" : null;
        this.treeURL = "/Inventory/Basic/GetSearchLocationLevelGroupInfo";
        this.detailPageID = "/ECErp/ESA/ESA052M";
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        switch (this.Type) {
            case "CREATE":
                toolbar.addLeft(ctrl.define("widget.button", "Excel").css("btn btn-default").label(ecount.resource.BTN00050).permission([ecount.config.user.USE_EXCEL_CONVERT, ecount.resource.MSG00141]));
                break;
            case "SEARCH":
                toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00070));
                break;
            case "AUTH":
                toolbar.addLeft(ctrl.define("widget.button", "Save").css("btn btn-primary").label(ecount.resource.BTN00065));
                break;
            default:
                break;
        }
        toolbar
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
            .setOptions({ css: "btn btn-default", ignorePrimaryButton: true });
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
    onTreeRenameNode: function (data, handler) {
        var chk = data.node.text.isContainsLimitedSpecial('name');
        if (chk.result) {
            ecount.alert(chk.message);
            handler.rollback();
        } else {
            var _data = {
                Request: {
                    CD_GROUP: data.node.id,
                    NM_GROUP: data.node.text
                }
            };

            ecount.common.api({
                url: "/SVC/Inventory/Basic/UpdateLocationLevelGroupNode",
                data: Object.toJSON(_data),
                success: function (msg) { }
            });
            data.node.li_attr.hidtext = data.node.text;
            data.node.li_attr.hidtext = data.node.text;
            data.text = data.node.text;
            handler.complete();
        }
    },
    onTreeMoveNode: function (data) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 160,
            PCode: data.id,
            PText: data.li_attr.hidtext,
            LevelGroupType: 'WH'
        };

        this.openWindow({
            url: '/ECERP/Popup.Common/ESA056P_02',
            name: ecount.resource.BTN00226, param: param, popupType: false, additional: false
        });
    },

    onLoadComplete: function (handler) {
        var thisObj = this;
        if (this.TYPE != "SELECT") {
            if (["CREATE", "AUTH"].contains(this.Type)) {
                if (!$.isEmpty(this.tree.getNode('ROOT'))) this.showFn(this.tree.getNode('ROOT'));
                thisObj.openDetail('ROOT', '');
            }
        }

        var search = this.getSearchControl();
        if (search) {
            search.onFocus();
        }
    },

    onTreeDeactivateNode: function (data) {
        var self = this;

        ecount.confirm(String.format(ecount.resource.MSG10101, data.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    Request: {
                        CD_GROUP: data.id,
                        YN_USE: 'N'
                    }
                };

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/UpdateStateLocationLevelGroupNode",
                    data: Object.toJSON(_data),
                    success: function (msg) {
                        data.a_attr = { href: "javascript:;", "class": "text-danger", id: data.a_attr.id };
                        self.tree.addNodeCss(data, "text-danger");
                    }
                });

            }
        });
    },

    onTreeActivateNode: function (data) {
        var self = this;

        ecount.confirm(String.format(ecount.resource.MSG10102, data.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = { 
                    Request: {
                        CD_GROUP: data.id,
                        YN_USE: 'Y'
                    }
                };
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/UpdateStateLocationLevelGroupNode",
                    data: Object.toJSON(_data),
                    success: function (msg) {
                        data.a_attr = { href: "javascript:;", "class": null, id: data.a_attr.id };
                        self.tree.removeNodeCss(data, "text-danger");
                    }
                });
            }
        });
    },

    onTreeDeleteNode: function (data, handler) {
        var self = this;
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);
        ecount.confirm(String.format(ecount.resource.MSG10100, obj.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    CD_GROUP: obj.id
                };
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeleteLocationLevelGroupNode",
                    data: Object.toJSON(_data),
                    success: function (msg) {
                        handler.complete();
                        self.openDetail('ROOT', '');
                        self.setReload('Reload', '');
                    }
                });
            }
        });
    },

    onTreeViewAuthorNode: function (data) {
        var param = {
            width: 350,
            height: 500,
            PCode: data.id,
            PText: data.li_attr.hidtext,
            LevelGroupType: 'WH'
        };

        this.openWindow({
            //url: '/ECERP/ESA/ESA051P_03',
            url: '/ECERP/Popup.Common/ESA056P_03',
            name: ecount.resource.BTN00225, param: param, popupType: false, additional: false
        });
    },
    onTreeAddNode: function (data) {
        var self = this;
        var type = "WH";
        var _data = {
            Request: {
                Data: {
                    TYPE: type,
                    CD_PARENT: data.id
                }
            }
        };

        ecount.common.api({
            url: "/SVC/Common/ValidateLevelGroup",
            data: Object.toJSON(_data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                    isError = true;
                }
                else {
                    switch (result.Data.ERR_FLAG) {
                        case '2':
                            ecount.alert('Invalid code. May be deleted by other users!', function () {
                                self.setReload('Reload', '');
                                self.openDetail('ROOT', '');
                            });
                            break;
                        case '3':
                            ecount.alert(ecount.resource.MSG02642);
                            break;
                        case '4':
                            ecount.alert(ecount.resource.MSG09073);
                            break;
                        default:
                            var params = {
                                width: ecount.infra.getPageWidthFromConfig(true),
                                height: 300,
                                PCode: data.id,
                                PText: data.li_attr.hidtext,
                                parentPageID: self.pageID,
                                responseID: self.callbackID,
                                LevelGroupType: type
                            };

                            //Open popup
                            self.openWindow({
                                url: '/ECERP/Popup.Common/ESA056P_04',
                                name: ecount.resource.LBL09297,
                                param: params,
                                popupType: false,
                                additional: false
                            });
                            break;
                    }
                }
            },
            complete: function () {
            }
        });
    },

    //A value that has been passed on to parents in the pop-up window control flag
    onMessageHandler: function (page, message) {
        if (['ESA056P_02', 'ESA056P_04'].contains(page.pageID))
            this.setReload('Reload', message.keyword);
    },

    //must override
    onSendData: function (data) {
        if (["CREATE", "AUTH"].contains(this.Type))
            return;
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
                for (var i = 0, j = selectedNode.length; i < j; i++) {
                    var node = { CODE: null, CODE_DES: null };
                    node.CODE = selectedNode[i].li_attr.id;
                    node.CODE_DES = selectedNode[i].li_attr.hidtext;
                    nodes.push(node);
                }
            }velGroup
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

    onFooterExcel: function () {
        if (ecount.config.user.USE_EXCEL_CONVERT == true) {
            var excelObject = {
                ExcelTitle: String.format("{0} : {1} / {2}", ecount.resource.LBL03176, ecount.company.COM_DES, ecount.resource.LBL07309),
                CD_GROUP: 'ROOT',
                GB_USE: ["CREATE", "AUTH"].contains(this.Type) ? "Y" : "N",
                COLUMNS: [
                    { index: 0, propertyName: 'LEVEL_NUM_INFO', id: 'LEVEL_NUM_INFO', title: ecount.resource.LBL07432 },
                    { index: 1, propertyName: 'GROUP_INFO', id: 'GROUP_INFO', title: "[" + ecount.resource.LBL00574 + "]" + ecount.resource.LBL00568, Width: '310' },
                    { index: 2, propertyName: 'WH_CD', id: 'WH_CD', title: ecount.resource.LBL02736 },
                    { index: 3, propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL02722 }
                ],
                GUBUN: 'E'
            };
            ecount.document.exportExcel("/Inventory/Basic/GetLocationLevelGroupForExcel", excelObject);
            excelObject.GUBUN = "Y";
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "X" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

    },

    onFooterApply: function () {
        this.onSendData();
    },

    onFooterClose: function () {
        this.close();
    },

    onFooterSave: function () {
        var thisObj = this;
        var selectedNode = this.tree.getSelected();
        var cdList = '';
        var splitChar = ecount.delimiter;
        var countDeactiveList = 0;
        if (selectedNode.length == 0) {
            cdList += splitChar;
        } else {
            for (var i = 0, j = selectedNode.length; i < j; i++) {
                if (selectedNode[i].a_attr.style != null && selectedNode[i].a_attr.style == "color:red") {
                    countDeactiveList++;
                }
                cdList += selectedNode[i].li_attr.id + splitChar;
            }
        }
        cdList = cdList.substring(0, cdList.length - 1);

        if (countDeactiveList > 0) {
            ecount.alert(ecount.resource.MSG03610);
            return false;
        } else if (cdList == '') {
            ecount.alert(ecount.resource.MSG00639);
            return false;
        }
        var _data = {
            Request: {
                Data: {
                    CD_LIST: cdList,
                    ID_USER: this.UserId
                }
            }
        };
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateSale001GroupAuthUser",
            data: Object.toJSON(_data),
            success: function (msg) {
                if (thisObj.IsGroup) {
                    var param = [{
                        Data: {
                            FROM_USER: thisObj.UserId, IsSyncUser: true, IsSettingPopUpChange: true, IsAllGroupAuthWhCopy: true
                        }
                    }];

                    ecount.common.api({
                        url: "/SVC/SelfCustomize/User/UpdateCopyGroupAuthUser",
                        data: Object.toJSON(Request = { Data: param }),
                        success: function (msg) {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        },
                    });
                } else {
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            }
        });
    },

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    setReload: function (e, val) {
        this._super.onSearchData.apply(this, arguments);
    }
});