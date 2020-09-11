window.__define_resource && __define_resource("BTN00050","MSG00141","LBL09653","BTN00070","BTN00063","BTN00008","MSG03610","MSG10105","BTN00225","MSG10101","MSG10102","MSG10100","MSG02642","MSG09073","LBL09297","BTN00226");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
4. Precaution  :
5. History     : 2015.12.18(Jung Na-Ri) - Make it to get limiteCount and ParentCountrolID from the parent window.
                 [2016-02-17] Nguyen Anh Tuong : 창고계층그룹 공통화 Location Level Group Standardization
                 [2018.05.30] 임태규 : Tree 구조 변경으로 init 필수값 추가 Added Default init value for Data Tree
                 [2019.04.15] 이현택 : UpdateCopyGroupAuthUserAction 3.0 호출로 변경
                 2019.05.06 (PhiVo): A19_01230-계층그룹 신규등록 시 등록 가능 개수 제한
6. Old File    : ESA056M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type3", "ESA056M", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    treeURL: "/Account/Basic/GetSearchDepartmentLevelInfo",

    detailPageID: "/ECERP/ESA/ESA057M",

    limitCount: 0,

    contextmenu: "",

    addroot: "",

    show_at_node: false,

    searchPanel: null,

    off_key_esc: true,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecount-tree");        
    },

    initProperties: function () {
        this.initData = this.viewBag.InitDatas.treeDataLoad;
        this.treeData.SEARCHVALUE = null;
        this.treeData.TYPE = this.viewBag.DefaultOption.Type;

        this.parentControlID = this.viewBag.DefaultOption.Type == "SEARCH" ? (this.viewBag.DefaultOption.parentID ? this.viewBag.DefaultOption.parentID : "txtTreeDeptCd") : null;
        this.limitCount = this.viewBag.DefaultOption.LimitCount ? this.viewBag.DefaultOption.LimitCount : 100;
        this.contextmenu = ["SEARCH", "SELECT"].contains(this.viewBag.DefaultOption.Type) ? [] : ["add", "move", "rename", "deactivate", "activate", "delete", "viewauthor"];
        this.addroot = this.viewBag.DefaultOption.Type == 'SEARCH' ? false : true;

    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        switch (this.Type) {
            case "CREATE":
                toolbar.addLeft(ctrl.define("widget.button", "Excel").css("btn btn-default").label(ecount.resource.BTN00050).permission([ecount.config.user.USE_EXCEL_CONVERT, String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653)]));
                break;
            case "SEARCH":
                toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00070).clickOnce());
                break;
            case "AUTH":
                toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00063).clickOnce());
                break;
            default:
                break;
        }

        toolbar
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).clickOnce())
            .setOptions({ css: "btn btn-default", ignorePrimaryButton: true });
        footer.add(toolbar);
    },

    //[tree event] - render complete
    onLoadTree: function (nodedata) {
        this._super.onLoadTree.apply(this, arguments);
    },

    //[tree event] - click node
    onSelectedNode: function (event, data) {
        if (!this.checkLimitCount())
            return;

        this._super.onSelectedNode.apply(this, arguments);
    },

    openDetail: function (val, text) {  //modify:areum(2016.02.23)

        if (this.isUseTreeDetails === false) {
            return;
        }

        this.$panelLeft.removeClass('col-xs-12').addClass('col-xs-4');
        this.$panelRight.removeClass('hidden');
        var f = $("<form>"), obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9;
        var iframediv = $("<div>");
        var dialogIframe = $(".level-group-iframe");
        var type = this.viewBag.DefaultOption.Type == null ? "SEARCH" : this.viewBag.DefaultOption.Type.toUpperCase();

        obj1 = $("<input type='hidden'>");
        obj2 = $("<input type='hidden'>");
        obj3 = $("<input type='hidden'>");
        obj4 = $("<input type='hidden'>");
        obj5 = $("<input type='hidden'>");
        obj6 = $("<input type='hidden'>");
        obj7 = $("<input type='hidden'>");
        obj8 = $("<input type='hidden'>");
        obj9 = $("<input type='hidden'>");

        f.append(obj1.attr("name", "PCODE").val(val));
        f.append(obj2.attr("name", "Type").val(type));
        f.append(obj3.attr("name", "PText").val(text));
        f.append(obj4.attr("name", "parentPageID").val(this.pageID));
        f.append(obj5.attr("name", "popupLevel").val(this.popupLevel));
        f.append(obj6.attr("name", "responseID").val(this.responseID));
        f.append(obj7.attr("name", "popupType").val(this.popupType));
        f.append(obj8.attr("name", "popupID").val(this.popupID));
        f.append(obj9.attr("name", "ALL_GROUP_SITE").val(this.ALL_GROUP_SITE));

        f.attr("target", "ecframe1");
        f.attr("method", "post");
        f.attr("action", ecount.common.buildSessionUrl(this.detailPageID));
        dialogIframe.append(f);
        f.submit();

        var detailWidth = this.detailWidth || 900;
        var detailheight = this.detailheight || 600;

        this.resizeLayer(detailWidth, detailheight);
    },

    //[tree event] - exceed limit
    onExceedLimit: function (event, data) {
        this._super.onExceedLimit.apply(this, arguments);
    },

    onLoadComplete: function (e) {
        if (["CREATE", "AUTH"].contains(this.Type)) {
            if (!$.isEmpty(this.tree.getNode('ROOT'))) this.showFn(this.tree.getNode('ROOT'));
            this.openDetail('ROOT', '');
        }
        if (!e.unfocus) {
            $('[data-cid=searchTree]')[0].focus();
        }

    },

    onMessageHandler: function (page, message) {
        if (['ESA056P_02', 'ESA056P_04'].contains(page.pageID))
            this.setReload('Reload', message.keyword);
        if (page.pageID == 'EBA004M')
            this.setReload('Reload', '');
    },

    onFooterSave: function () {
        var cdList = '';
        var thisObj = this;
        var btnSave = this.footer.get(0).getControl("Save");
        var selectedNode = this.tree.getSelected();

        if (selectedNode.length > 0) {
            for (var i = 0, j = selectedNode.length; i < j; i++) {
                if (document.getElementById(selectedNode[i].a_attr.id).classList.contains('text-danger')) {
                    btnSave.setAllowClick();
                    ecount.alert(ecount.resource.MSG03610);
                    return false;
                }

                cdList += selectedNode[i].li_attr.id + 'ㆍ';
            }
        }

        ecount.confirm(ecount.resource.MSG10105, function (status) {
            if (status === true) {
                var _data = {
                    Request: {
                        Data: {
                            CD_LIST: cdList,
                            ID_USER: thisObj.UserId,
                            IsGroup: thisObj.IsGroup
                        }
                    }
                };

                ecount.common.api({
                    url: "/SVC/Account/Basic/SaveSiteGroupAuthUser",
                    data: Object.toJSON(_data),
                    success: function (msg) {
                        if (thisObj.RetUrl == 'EMM002M')//from EMM002M.aspx
                            opener.fnRetChkSite();

                        if (thisObj.IsGroup) {
                            var param = [{
                                Data: {
                                    FROM_USER: thisObj.UserId, IsSyncUser: true, IsSettingPopUpChange: true, IsAllGroupAuthSiteCopy: true
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
            } else btnSave.setAllowClick();
        });
    },

    onFooterExcel: function () {

        var key = "ESA_ESA056M" + this.viewBag.ComCode_L + ecount.user.WID + new Date()._tick();

        var options = {
            type: "ExcelDic",
            keyword: key,
            iMaxCnt: null,
            verisionCheck: true
        };

        var params = {
            Type: this.Type,
            hidMaxLevel: 10
        }

        ecount.infra.convertExcel("/ECMAIN/ESA/ESA056E.aspx", params, options);
    },

    onFooterApply: function () {
        this.onSendData();
    },

    onFooterClose: function () {
        this.close();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    //must override
    onSendData: function (data) {
        if (["CREATE", "AUTH"].contains(this.Type))
            return;

        if (!this.checkLimitCount())
            return;

        var selectedNode = this.tree.getSelected();
        var nodes = new Array();

        if (!data && selectedNode.length == 0) {
            this.close();
        }
        else {
            if (selectedNode.length == 0) {
                var node = { NM_GROUP: null, CD_GROUP: null };

                if (data.id) {
                    node.CD_GROUP = data.id;
                    node.NM_GROUP = data.li_attr.hidtext;
                } else {
                    node.CD_GROUP = data[0].id;
                    node.NM_GROUP = data[0].li_attr.hidtext;
                }

                nodes.push(node);
            }
            else {
                for (var i = 0, j = selectedNode.length; i < j; i++) {
                    var node = { CD_GROUP: null, NM_GROUP: null };
                    node.CD_GROUP = selectedNode[i].li_attr.id;
                    node.NM_GROUP = selectedNode[i].li_attr.hidtext;
                    nodes.push(node);
                }
            }
        }

        var message = {
            name: "NM_GROUP",
            code: "CD_GROUP",
            data: nodes,
            isAdded: false,
            addPosition: "current",
            callback: this.close.bind(this)
        };

        this.sendMessage(this, message);
    },

    onTreeViewAuthorNode: function (data) {
        var params = {
            width: 420,
            height: 550,
            PCode: data.id,
            PText: data.li_attr.hidtext,
            LevelGroupType: 'SITE'
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

    onTreeDeactivateNode: function (data) {
        var self = this;
        ecount.confirm(String.format(ecount.resource.MSG10101, data.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    CD_GROUP: data.id,
                    YN_USE: 'N'
                };

                ecount.common.api({
                    url: "/Account/Basic/UpdateSiteGroupUse",
                    data: Object.toJSON(_data),
                    success: function () {
                        data.a_attr = { "class": "text-danger" };
                        this.tree.addNodeCss(data, "text-danger");
                    }.bind(self)
                });
            }
        });
    },

    onTreeActivateNode: function (data) {
        var self = this;
        ecount.confirm(String.format(ecount.resource.MSG10102, data.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    CD_GROUP: data.id,
                    YN_USE: 'Y'
                };

                ecount.common.api({
                    url: "/Account/Basic/UpdateSiteGroupUse",
                    data: Object.toJSON(_data),
                    success: function () {
                        data.a_attr = { "class": "" };
                        this.tree.removeNodeCss(data, "text-danger");
                    }.bind(self)
                });
            }
        });
    },

    //[tree event] - called after rename 
    onTreeRenameNode: function (data, handler) {
        var chk = data.node.text.isContainsLimitedSpecial('name');

        if (chk.result) {
            ecount.alert(chk.message);
            handler.rollback();
        } else {
            var _data = {
                CD_GROUP: data.node.id,
                NM_GROUP: data.node.text
            };

            ecount.common.api({
                url: "/Account/Basic/UpdateSiteGroupName",
                data: Object.toJSON(_data),
                success: function () {
                    data.node.li_attr.hidtext = data.node.text;
                    handler.complete();
                }
            });
        }
    },

    onTreeDeleteNode: function (data, handler) {
        var self = this;
        var inst = $.jstree.reference(data.reference),
            obj = inst.get_node(data.reference);

        ecount.confirm(String.format(ecount.resource.MSG10100, obj.li_attr.hidtext), function (status) {
            if (status === true) {
                var _data = {
                    Request: {
                        Data: {
                            CD_GROUP: obj.id
                        }
                    }
                };

                ecount.common.api({
                    url: '/SVC/Account/Basic/DeleteDeptLevelGroup',
                    data: Object.toJSON(_data),
                    success: function () {
                        $('[data-cid=searchTree]').val('');
                        self.setReload('Reload', '');
                    }
                });
            }
        });
    },

    onTreeAddNode: function (data) {
        var self = this;
        var type = "SITE";
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

    onTreeMoveNode: function (data) {
        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 160,
            PCode: data.id,
            PText: data.li_attr.hidtext
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

    setReload: function (e, val) {
        this._super.onSearchData.apply(this, arguments);
    }
});