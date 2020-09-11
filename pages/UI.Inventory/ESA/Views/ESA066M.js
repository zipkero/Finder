window.__define_resource && __define_resource("BTN00050","MSG00141","BTN00070","BTN00063","BTN00069","BTN00008","MSG02642","MSG09073","LBL09297","BTN00226","MSG10101","MSG10102","MSG10100","BTN00225","MSG00639","MSG03610","MSG10105","LBL02390","LBL03176","LBL07243","LBL07432","LBL35185","LBL00754","LBL03017","LBL03004");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 품목 계층그룹 메인화면 (Item Level Group)
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 [2015-11-20] 이일용 : 품목 계층그룹(조회,검색) 통합 및 리펙토링
                 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                  2016-03-21 안정환 소스 리팩토링 적용
                 [2018.05.30] 임태규 : Tree 구조 변경으로 init 필수값 추가 Added Default init value for Data Tree
                 [2019.04.15] 이현택 : UpdateCopyGroupAuthUserAction 3.0 호출로 변경
                 2019.05.06 (PhiVo): A19_01230-계층그룹 신규등록 시 등록 가능 개수 제한
                 2019.05.23 (문요한) : 사용중단/재사용, 이름수정, 삭제 Action3.0 호출
6. MenuPath    : 품목> 품목계층그룹
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type3", "ESA066M", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    treeURL: "/Inventory/Basic/GetSearchProdLevelGroupInfo",
    treeData: null,
    detailPageID: "/ECERP/ESA/ESA042M",
    parentControlID: null,
    limitCount: 100,
    contextmenu: null,
    addroot: null,
    searchPanel: null,
    show_at_node: false,
    off_key_esc: true,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    // init
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.initData = this.viewBag.InitDatas.ItemLevelGroupLoad;
        this.registerDependencies("ecount-tree");

        //check selected on tree
        var selectedCodes = this.viewBag.DefaultOption.selectedCodes == null ? [] : this.viewBag.DefaultOption.selectedCodes.split(ecount.delimiter);
        $.each(this.initData, function (i, data) {
            if (selectedCodes.contains(data.id)) {
                data.state.selected = true;
            }
        })

    },
    // render
    render: function () {
        this._super.render.apply(this, arguments);
    },

    initProperties: function () {
        if (this.treeData != null) {
            this.treeData.SEARCHVALUE = null;
            this.treeData.TYPE = this.viewBag.DefaultOption.Type;
            this.treeData.YN_USE = "Y";
        } else {
            this.treeData = {
                SEARCHVALUE: null,
                TYPE: this.viewBag.DefaultOption.Type,
                YN_USE: "Y"
            };
        }

        this.parentControlID = this.viewBag.DefaultOption.Type == "SEARCH" ? "txtTreeGroupCd" : null;
        this.contextmenu = ["SEARCH", "SELECT"].contains(this.viewBag.DefaultOption.Type) ? [] : ["add", "move", "rename", "deactivate", "activate", "delete", "viewauthor"];
        this.addroot = this.viewBag.DefaultOption.Type == 'SEARCH' ? false : true;

        if (this.checkMaxCount != undefined) {
            if (this.checkMaxCount > this.limitCount) {
                this.limitCount = this.checkMaxCount;
            }
        }

    },
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    // Init Footer
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        switch (this.Type) {
            case "CREATE":
                toolbar.addLeft(ctrl.define("widget.button", "excel").css("btn btn-default").label(ecount.resource.BTN00050).permission([ecount.config.user.USE_EXCEL_CONVERT, ecount.resource.MSG00141]));
                break;
            case "SEARCH":
                toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00070));
                break;
            case "AUTH":
                toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00063).clickOnce());
                break;
            // new type, support click button ok save and return value, close form
            case "MULTISELECT":
                toolbar.addLeft(ctrl.define("widget.button.group", "saveReturn").label(ecount.resource.BTN00069).clickOnce());
                break;
            default:
                break;
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .setOptions({ css: "btn btn-default", ignorePrimaryButton: true });
        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define tree event listener
    ****************************************************************************************************/
    //[tree event] - render complete
    onLoadTree: function (nodedata) {
        this._super.onLoadTree.apply(this, arguments);
        this.onContentsExtendTree();
    },
    //[tree event] - click node
    onSelectedNode: function (event, data) {
        this._super.onSelectedNode.apply(this, arguments);
    },
    //[tree event] - exceed limit
    onExceedLimit: function (event, data) {
        this._super.onExceedLimit.apply(this, arguments);
    },
    // Tree에서 추가기능을 클릭했을 때 [Tree => click Add]
    onTreeAddNode: function (data) {
        var self = this;
        var type = "PROD";
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
    // Tree에서 이동기능을 클릭했을 때  [Tree => Click Move]
    onTreeMoveNode: function (data) {
        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 370,
            PCode: data.id,
            PText: data.li_attr.hidtext,
            parentPageID: this.pageID,
            responseID: this.callbackID,
            LevelGroupType: 'PROD'
        };

        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA056P_02',
            name: ecount.resource.BTN00226,
            param: params,
            popupType: false,
            additional: false
        });
    },
    // Tree에서 이름수정 기능을 클릭했을 때 [Tree => click RenameNode]
    onTreeRenameNode: function (data, handler) {
        var self = this;
        var chk = data.node.text.isContainsLimitedSpecial('name');
        if (chk.result) {
            ecount.alert(chk.message);
            handler.rollback();
        } else {
            var _data = {
                Data: {
                    CD_GROUP: data.node.id,
                    NM_GROUP: data.node.text,
                    CD_PARENT: data.node.parent
                }
            };
            ecount.common.api({
                url: "/SVC/Inventory/Basic/UpdateProdLevelGroupName",
                data: Object.toJSON(_data),
                success: function () {
                    data.node.li_attr.hidtext = data.node.text;
                    handler.complete();
                }
            });
        }
    },
    // Tree에서 사용중단 기능을 클릭했을 때 [Tree => click Deactivate]
    onTreeDeactivateNode: function (data) {
        var self = this;
        ecount.confirm(String.format(ecount.resource.MSG10101, data.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    Data: {
                        CD_GROUP: data.id,
                        YN_USE: 'N',
                        CD_PARENT: data.parent
                    }
                };
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/UpdateProdLevelGroupUse",
                    data: Object.toJSON(_data),
                    success: function () {
                        data.a_attr = { "class": "text-danger" };
                        this.tree.addNodeCss(data, "text-danger");
                    }.bind(self)
                });
            }
        });
    },
    // Tree에서 재사용 기능을 클릭했을 때 [Tree => click Activate]
    onTreeActivateNode: function (data) {
        var self = this;
        ecount.confirm(String.format(ecount.resource.MSG10102, data.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    Data: {
                        CD_GROUP: data.id,
                        YN_USE: 'Y',
                        CD_PARENT: data.parent
                    }
                };
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/UpdateProdLevelGroupUse",
                    data: Object.toJSON(_data),
                    success: function () {
                        data.a_attr = { "class": "" };
                        this.tree.removeNodeCss(data, "text-danger");
                    }.bind(self)
                });
            }
        });
    },
    // Tree에서 삭제 기능을 클릭했을 때 [Tree => click Delete]
    onTreeDeleteNode: function (data, handler) {
        var self = this;
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);

        ecount.confirm(String.format(ecount.resource.MSG10100, obj.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    Data: {
                        CD_GROUP: obj.id,
                        CD_PARENT: obj.parent
                    }
                };
                ecount.common.api({
                    url: '/SVC/Inventory/Basic/DeleteProdLevelGroup',
                    data: Object.toJSON(_data),
                    success: function () {
                        $('[data-cid=searchTree]').val('');
                        self.setReload('Reload', '');
                    }
                });
            }
        });
    },
    // Tree에서 권한보기 기능을 클릭했을 때 [Tree => click ViewAuthor]
    onTreeViewAuthorNode: function (data) {
        var params = {
            width: 420,
            height: 550,
            PCode: data.id,
            PText: data.li_attr.hidtext,
            LevelGroupType: 'PROD'
        };
        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA056P_03',
            name: ecount.resource.BTN00225,
            param: params,
            popupType: false,
            additional: false
        });
    },
    /**************************************************************************************************** 
    * define Footer Button event listener
    ****************************************************************************************************/
    // 저장버튼 클릭 시
    onFooterSave: function () {
        var cdList = '';
        var thisObj = this;
        var btnSave = this.footer.get(0).getControl("save");
        var selectedNode = this.tree.getSelected();

        if (selectedNode.length == 0) {
            ecount.alert(ecount.resource.MSG00639);
            btnSave.setAllowClick();
            return false;
        }

        if (selectedNode.length > 0) {
            for (var i = 0, j = selectedNode.length; i < j; i++) {
                /*Dom을 찾지말고 데이터에서 찾는다. (17.11.09)*/
                if (selectedNode[i] == null) continue;
                if (selectedNode[i]["a_attr"] == null) continue;
                if ((selectedNode[i]["a_attr"]["class"] || "").indexOf("text-danger") > -1) {
                    btnSave.setAllowClick();
                    ecount.alert(ecount.resource.MSG03610);
                    return false;
                };
                cdList += selectedNode[i].li_attr.id
                if (i != (j - 1)) {
                    cdList += ecount.delimiter;
                }
            }
        }

        ecount.confirm(ecount.resource.MSG10105, function (status) {
            if (status === true) {
                //var _data = {
                //    CD_LIST: cdList,
                //    ID_USER: thisObj.UserID
                //};

                var Param = {
                    Request: {
                        CD_LIST: cdList,
                        ID_USER: thisObj.UserID
                    }
                }

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/SaveProdGroupAuthUser",
                    data: Object.toJSON(Param),
                    success: function (msg) {
                        if (thisObj.IsGroup) {
                            var param = [{
                                Data: {
                                    FROM_USER: thisObj.UserID, IsSyncUser: true, IsSettingPopUpChange: true, IsAllGroupAuthProdCopy: true
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
                                complete: function () {
                                    btnSave.setAllowClick();
                                }
                            });
                        } else {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                    },
                    complete: function () {
                        btnSave.setAllowClick();
                    }
                });
            } else
                btnSave.setAllowClick();
        });
    },

    //click button save with type MULTISELECT
    onFooterSaveReturn: function () {
        var selectedNode = this.tree.getSelected();
        var nodes = new Array();

        for (var i = 0, j = selectedNode.length; i < j; i++) {
            var node = { CODE: null, CODE_DES: null };
            node.CODE = selectedNode[i].id;
            node.CODE_DES = selectedNode[i].text;

            if ((selectedNode[i]["a_attr"]["class"] || "").indexOf("text-danger") == -1) {
                nodes.push(node);
            };
        }



        var message = {
            data: nodes,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    // Excel버튼 클릭 시 [click ExcelButton]
    onFooterExcel: function () {
        if (ecount.config.user.USE_EXCEL_CONVERT != true) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "X" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        var excelObject = {
            excelTitle: String.format("{0} : {1} / {2}", ecount.resource.LBL03176, ecount.company.COM_DES, ecount.resource.LBL07243),
            CD_GROUP: 'ROOT',
            GB_USE: ["CREATE", "AUTH"].contains(this.Type) ? "Y" : "N",
            COLUMNS: [
                { index: 0, propertyName: 'LEVEL_NUM_INFO', id: 'LEVEL_NUM_INFO', title: ecount.resource.LBL07432 },
                { index: 1, propertyName: 'GROUP_INFO', id: 'GROUP_INFO', title: "[" + ecount.resource.LBL35185 + "]" + ecount.resource.LBL00754, Width: '310' },
                { index: 2, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017 },
                { index: 3, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03004 }
            ],
            GUBUN: 'E'
        };

        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListProdLevelGroupForExcel",
            param: excelObject
        });
    },
    // Footer Aply
    onFooterApply: function () {
        this.onSendData();
    },
    // Footer Close
    onFooterClose: function () {
        this.close();
    },
    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    // Load Complete
    onLoadComplete: function () {
        if (["CREATE", "AUTH", "MULTISELECT"].contains(this.Type)) {
            if (!$.isEmpty(this.tree.getNode('ROOT'))) this.showFn(this.tree.getNode('ROOT'));
            this.openDetail('ROOT', '');
        }

        // 포커스설정(딜레이)
        this.setTimeout(function () {
            if ($('[data-cid=searchTree]')[0] != undefined) {
                $('[data-cid=searchTree]')[0].focus();
            }
        }, 1500);
        this.parentControlID = this.parentID == null ? "txtTreeGroupCd" : this.parentID;
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (['ESA056P_02', 'ESA056P_04'].contains(page.pageID)) //그룹이동 or 그룹추가 일 경우는 페이지 reload
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
    // Reload
    setReload: function (e, val) {
        this._super.onSearchData.apply(this, arguments);
    },

    /********************************************************************** 
    *  hotkey  
    **********************************************************************/
    //F8
    ON_KEY_F8: function (event) {
        if (this.Type == "MULTISELECT")
            this.onFooterSaveReturn();
    }
});

