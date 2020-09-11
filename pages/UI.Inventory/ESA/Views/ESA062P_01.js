window.__define_resource && __define_resource("LBL10922","LBL03116","LBL10921","BTN00236","MSG01136","LBL02263","LBL02960","LBL10911","LBL10920","BTN00065","BTN00067","BTN00765","BTN00043","BTN00007","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","LBL07157","LBL10901","MSG00722","MSG02620","MSG00676","BTN00495","LBL85142","MSG10104");
/****************************************************************************************************
1. Create Date : 2016.05.25
2. Creator     : Pham Van Phu
3. Description : Reg. Sub Insp. Item Code (Thêm mới hạng mục chi tiết)
4. Precaution  :
5. History     : 2018.12.21 (PhiVo) applied 17520-A18_04271
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6. Old file    : ESA062P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA062P_01", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    // ESC Key off 처리 
    off_key_esc: true,

    //AutoCode
    newCode: null,
    // edit new code
    editCodeValue: null,
    //status code exists 
    isExistsCode: false,

    INSPCECTION_TYPE_CD: null,
    // ITEM_NM (Tên mục giám sát)
    ITEMDETAIL_NM: null,
    // ITEM_CD2 (mã mục giám sát)
    ITEMDETAIL_CD2: null,
    // ITEM_CD (mã giám đăng ký giám sát)
    ITEMDETAIL_CD: null,
    //USE_YN (sủ dụng) 
    USE_YN: '',

    // Edit flag
    EditFlag: 'I',
    //Cờ cập nhật
    isSaveContentsFlag: false,
    //Cờ gọi hàm thêm mới
    isNewFlag: false,
    typeName: '',

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5cnwvbJO3&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);

    },

    // init properties
    initProperties: function () {
        this.saveLoading = {
            locked: false,
        }
    },

    // render
    render: function ($parent) {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5lBc6pRn2&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/
    onInitHeader: function (header) {
        header.notUsedBookmark();
        var title = "";
        if (this.editFlag == "I")
            title = String.format('{0}', ecount.resource.LBL10922);
        if (this.editFlag == "M")
            title = String.format('{0}', ecount.resource.LBL03116);
        header.setTitle(title)
    },

    onInitContents: function (contents, resource) {
        var ctrl = widget.generator.control();
        var g = widget.generator;
        var self = this;

        form1 = g.form();
        form1.template("register");
        controls = new Array();

        if (self.editFlag == "I") {
            this.EditFlag = self.editFlag;
            self.newCode = this.viewBag.InitDatas.autoNewCode[0].NEXT_CODE;

            form1.useInputForm()
              .executeValidateIfVisible()
              .setColSize(1)
              .setOptions({ _isModifyMode: true });

            controls.push(ctrl.define("widget.input.codeType", "CODE_TYPE", "CODE_TYPE", ecount.resource.LBL10921)
               .value(self.newCode).hasFn([{ id: "codeCheckDuplicate", label: ecount.resource.BTN00236 }])
               .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "5", "10"), max: "10" })
               .dataRules(["required"], String.format('{0} {1}', ecount.resource.LBL02263, ecount.resource.LBL02960))
               .end());

            controls.push(ctrl.define("widget.input.codeType", "CODE_TYPE1", "CODE_TYPE1", ecount.resource.LBL10911)
               .value(self.newCode)
                .readOnly(true)
                .hideCell(true)
               .end());

            controls.push(ctrl.define("widget.input.codeName", "TYPE_NAME", "TYPE_NAME", ecount.resource.LBL10920)
                     .dataRules(["required"])
                    .filter("maxlength", { message: String.format(ecount.resource.MSG01136, 30, 30), max: 30 })
                    .end());
        }
        else {
            // If is Modify
            this.isSaveContentsFlag = true;
            this.EditFlag = self.editFlag;
            form1.useInputForm()
              .executeValidateIfVisible()
              .setColSize(1)
              .setOptions({ _isModifyMode: true });

            controls.push(ctrl.define("widget.input.codeType", "CODE_TYPE", "CODE_TYPE", ecount.resource.LBL10921)
               .value(self.ITEMDETAIL_CD2)
               .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "5", "10"), max: "10" })
               .dataRules(["required"], String.format('{0} {1}', ecount.resource.LBL02263, ecount.resource.LBL02960)).readOnly(true)
               .end());

            controls.push(ctrl.define("widget.input.codeName", "TYPE_NAME", "TYPE_NAME", ecount.resource.LBL10920)
                     .dataRules(["required"])
                     .value(self.ITEMDETAIL_NM)
                    .filter("maxlength", { message: String.format(ecount.resource.MSG01136, 30, 30), max: 30 })
                    .end());
        }

        form1.addControls(controls);

        contents.add(form1);
    },

    onInitFooter: function (footer) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var ctrlSave = ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065);

        if (this.isSaveContentsFlag) // If's modify
            ctrlSave.addGroup([{ id: 'SaveContinue', label: ecount.resource.BTN00067 }, { id: 'SaveNew', label: ecount.resource.BTN00765 }]);
        else if (this.isSaveFlag) //this.isSaveContentsFlag= false && isSaveFlag = true ==> It's New 
            ctrlSave.addGroup([{ id: 'SaveNew', label: ecount.resource.BTN00043 }]);

        toolbar.addLeft(ctrlSave.clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));

        if (this.editFlag == "M") {
            if (this.editFlag == "M") {
                toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                           .css("btn btn-default")
                                                                           .addGroup(
                                                                            [
                                                                               {
                                                                                   id: 'UseYN',
                                                                                   label: (this.USE_YN == "N" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)
                                                                               },
                                                                                { id: 'delete', label: ecount.resource.BTN00033 }
                    ]).noActionBtn().setButtonArrowDirection("up"));  // Delete
            }
        }

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        if (this.editFlag == "M")
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
    },

    onFocusOutHandler: function () {
        var ctrl = this.footer.getControl("Save");
        ctrl && ctrl.setFocus(0);
    },
    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onChangeControl: function (event) {
    },

    // 페이지 로딩 완료 후 이벤트
    onLoadComplete: function (e) {
        this.contents.getControl("TYPE_NAME").setFocus(0);
    },

    // 위젯 연동 팝업이 뜨기전에 호출되는 콜백
    onPreInitPopupHandler: function (control, keyword, config, response) {
        return true;
    },

    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },

    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case 'ES013P':
                this.contents.getControl("CODE_TYPE").setValue(message.data);
                page.close();
                this.contents.getControl("CODE_TYPE").onNextFocus();
                break;
        }
    },

    //history
    onFooterHistory: function () {
        this.openWindow({
            url: '/ECERP/Popup.Search/ES303P',
            name: ecount.resource.LBL07157,
            popupType: false,
            param: {
                width: 440,
                height: 194,
                ITEM_CD: this.ITEM_CD,
                ITEMDETAIL_CD: this.ITEMDETAIL_CD,
                isShowItem: true,
                historySlipNo: this.ITEMDETAIL_CD,
                menuType: "Sub_Insp",
                isParentHistoryListFlag: false
            }
        });
    },

    // Reset button clicked event
    onFooterReset: function (e) {
        this.contents.reset();
        var vTypeName = this.typeName == '' ? this.contents.getControl("TYPE_NAME").getValue() : this.typeName;
        this.contents.getControl("TYPE_NAME").setValue(vTypeName == '' ? '' : vTypeName);
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) { },

    onGridAfterFormLoad: function (e, data, grid) { },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_F2: function () {
        this.prodNewProcess();
    },

    ON_KEY_F8: function () {
        this.onFooterSave();
        this.setInitSetAllow();
    },

    reloadPage: function () {
        var self = this;
        var param = {
            editFlag: self.EditFlag,
            isCloseFlag: true,
            ITEMDETAIL_CD2: self.ITEMDETAIL_CD2,
            ITEMDETAIL_NM: self.ITEMDETAIL_NM,
            ITEMDETAIL_CD: self.ITEMDETAIL_CD,
            ITEM_CD: self.ITEM_CD,
            USE_YN: self.USE_YN,
            TYPE: "SUB_INSP_ITEM"
        };

        self.onAllSubmitSelf("/ECErp/ESA/ESA062P_01", param);
    },

    // Footer 버튼 클릭 이벤트 시작-----------------------------------------------------------------------------
    // 저장버튼 클릭
    onFooterSave: function (e, type) {
        var thisObj = this;
        var title = ecount.resource.LBL10901;
        var UserPermit = thisObj.viewBag.Permission.Permit.Value;
        var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: thisObj.editFlag == "I" ? "W" : "U" }]);

        if (!['W', 'U'].contains(UserPermit) && thisObj.editFlag == "I") {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }
        if (!['W'].contains(UserPermit) && thisObj.editFlag == "M") {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            this.footer.get(0).getControl("Save").setAllowClick();

            return false;
        }

        if (this.saveLoading.locked) return;

        this.saveLoading.locked = true;
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), type == null ? false : type);
    },

    // Save and Continues
    onButtonSaveContinue: function () {
        this.continueFlag = true;
        this.setSave(false);
        this.setInitSetAllow();
    },

    // Save and New
    onButtonSaveNew: function () {
        this.continueFlag = true;
        this.setSave(true);
        this.setInitSetAllow();
    },

    setSave: function (type) {
        this.isNewFlag = type;
        var thisObj = this;
        var title = ecount.resource.LBL10901;
        var UserPermit = thisObj.viewBag.Permission.Permit.Value;
        var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: thisObj.editFlag == "I" ? "W" : "U" }]);

        if (!['W', 'U'].contains(UserPermit) && thisObj.editFlag == "I") {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        if (!['W'].contains(UserPermit) && thisObj.editFlag == "M") {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            thisObj.footer.get(0).getControl("Save").setAllowClick();

            return false;
        }

        if (thisObj.saveLoading.locked) return;

        thisObj.saveLoading.locked = true;
        //call back save
        thisObj.fnCallbackDuplicateCheck(thisObj.fnSave.bind(thisObj), type == null ? false : type);
    },

    // Update UseYn
    onButtonUseYN: function () {
        var self = this;
        var title = ecount.resource.LBL10901;
        var UserPermit = self.viewBag.Permission.Permit.Value;

        if (!['W'].contains(UserPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "U" }]);
            self.footer.getControl("Save").setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        var data = {
            USE_YN: self.USE_YN == "Y" ? "N" : "Y",
            ITEM_CD: self.ITEM_CD,
            ITEMDETAIL_CD2: self.ITEMDETAIL_CD2,
            ITEMDETAIL_CD: self.ITEMDETAIL_CD,
            ITEMDETAIL_NM: self.ITEMDETAIL_NM,
            TYPE: "UPDATE_USEYN_SUB_ITEM"
        };

        ecount.common.api({
            url: "/Inventory/QcInspection/UpdateInspectionItem",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    self.vhideProgressbar();
                    ecount.alert(result.fullErrorMsg);
                }
                else
                    self.sendMessage(self, { callback: self.close.bind(self) });
            }.bind(this),
            complete: function () {
                self.saveLoading.locked = false;
                self.vhideProgressbar();
            }
        });
    },
    
    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Delete button clicked event
    onButtonDelete: function () {
        // Check user authorization
        var self = this;
        var btn = self.footer.get(0).getControl("deleteRestore");
        var lsInspectItemDetailCd = [];

        if (self.ITEMDETAIL_CD != undefined && self.ITEM_CD != undefined)
            lsInspectItemDetailCd = self.ITEM_CD + "-" + self.ITEMDETAIL_CD + ecount.delimiter

        if (lsInspectItemDetailCd.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            btn.setAllowClick();

            return false;
        }

        var UserPermit = self.viewBag.Permission.Permit.Value;
        if (!['W'].contains(UserPermit)) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        var formData = {
            lsInspectItemDetailCd: lsInspectItemDetailCd,
            TYPE: 'INSPECTION_ITEM_DETAIL'
        };

        ecount.confirm(ecount.resource.MSG02620, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/QcInspection/DeleteInspectionItemDetail",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data.length > 0) {
                                var msgErr = self.ErrShow(result);
                                if (msgErr != '')
                                    ecount.alert(msgErr);
                            }
                            self.sendMessage(self, { callback: self.close.bind(self) });
                        }
                    },
                    complete: function () {
                        btn.setAllowClick();
                    }
                });
            } else {
                btn.setAllowClick();
            }
        });
        return true;
    },

    // close
    onFooterClose: function () {
        this.close();
    },

    // Check exists code
    onFunctionCodeCheckDuplicate: function () {
        if (this.EditFlag == "M") {
            this.contents.getControl("CODE_TYPE").onNextFocus();

            return false;
        }

        var ITEMDETAIL_CD2 = this.contents.getControl('CODE_TYPE').getValue();

        if (ITEMDETAIL_CD2 == "") {
            this.contents.getControl("CODE_TYPE").showError('');
            this.contents.getControl("CODE_TYPE").setFocus(0);

            return false;
        }

        var checkCode = ITEMDETAIL_CD2.isContainsLimitedSpecial("code");
        if (checkCode.result) {
            this.contents.getControl("CODE_TYPE").showError(checkCode.message);
            this.contents.getControl("CODE_TYPE").setFocus(0);

            return false;
        }

        var param = {
            keyword: ITEMDETAIL_CD2,
            searchType: 'insp_sub_item_cd',
            isColumSort: true,
            width: 430,
            height: 300
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/ES013P',
            name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL10922),
            param: param,
            additional: false
        });
    },

    setInitSetAllow: function () {
        this.hideProgressbar(true);
        this.footer.getControl("save") && this.footer.getControl("save").setAllowClick();
    },

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (cl, type) {
        var thisObj = this;
        this.vshowProgressbar();
        var formdata = this.contents.serialize().merge();
        var _ITEMDETAIL_CD2 = formdata.CODE_TYPE;
        var _ITEMDETAIL_NM = formdata.TYPE_NAME;
        _ITEMDETAIL_NM = $.trim(_ITEMDETAIL_NM);

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            thisObj.footer.get(0).getControl("Save").setAllowClick();
            bFlag = false;
            //Item is Existed
            if (cl != null) {
                thisObj.footer.get(0).getControl("Save").setAllowClick();
                thisObj.contents.getControl("CODE_TYPE").showError(ecount.resource.MSG00676);
                thisObj.contents.getControl("CODE_TYPE").setFocus(0);
            }
        }
        else {
            //Item is Existed
            if (cl != null) {
                bFlag = false;
                thisObj.footer.get(0).getControl("Save").setAllowClick();
                thisObj.contents.getControl("CODE_TYPE").showError(ecount.resource.MSG00676);
                thisObj.contents.getControl("CODE_TYPE").setFocus(0);
            }
        }

        formdata.TYPE_NAME = _ITEMDETAIL_NM;

        if (['I'].contains(thisObj.editFlag))
            formdata.USE_YN = 'Y';

        var data = {
            EditFlag: thisObj.editFlag,
            ITEM_CD: thisObj.ITEM_CD,
            ITEMDETAIL_CD2: _ITEMDETAIL_CD2,
            ITEMDETAIL_NM: _ITEMDETAIL_NM,
            ITEMDETAIL_CD: thisObj.ITEMDETAIL_CD,
            TYPE: "INSP_SUB_ITEM"
        };

        ecount.common.api({
            url: "/Inventory/QcInspection/UpdateInspectionItem",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    thisObj.vhideProgressbar();
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    if (thisObj.continueFlag == true) {
                        thisObj.reloadItemList(false);
                        if (thisObj.isNewFlag) {
                            thisObj.prodNewProcess();
                            thisObj.setInitSetAllow();
                        }
                        else {
                            if (result.Data.length > 0) {
                                thisObj.typeName = _ITEMDETAIL_NM;
                                thisObj.editFlag = "M";
                                thisObj.ITEMDETAIL_CD = result.Data[0].INSPECT_TYPE_CD;
                                thisObj.contents.hideCell(['CODE_TYPE']);
                                thisObj.contents.showCell(['CODE_TYPE1']);
                            }
                        }
                    }
                    else
                        thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                }
            }.bind(this),
            complete: function () {
                thisObj.continueFlag = false;
                thisObj.saveLoading.locked = false;
                thisObj.vhideProgressbar();
                thisObj.footer.get(0).getControl("Save").setAllowClick();
            }
        });
    },

    //Handle to callback the fnSave
    fnCallbackDuplicateCheck: function (callback, a) {
        var thisObj = this;
        var formdata = this.contents.serialize().merge();// Implement new feature
        var _ITEMDETAIL_CD2 = formdata.CODE_TYPE;
        var data = {
            SEARCH_TYPE: "insp_sub_item_cd",
            PARAM: _ITEMDETAIL_CD2
        };

        if (['I'].contains(this.editFlag)) {
            if (_ITEMDETAIL_CD2 != "" && (ecount.common.ValidCheckSpecialForCodeType(_ITEMDETAIL_CD2).result)) {
                //If user entried data, call to API to check the item existed or not
                ecount.common.api({
                    url: "/Inventory/QcInspection/CheckCodeSubItemExists",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            if (result.Data.length == 0) {
                                thisObj.saveLoading.locked = false;
                                callback(result.Data.Data, a);
                            }
                            else {
                                thisObj.footer.get(0).getControl("Save").setAllowClick();
                                thisObj.contents.getControl("CODE_TYPE").showError(ecount.resource.MSG00676);
                                thisObj.contents.getControl("CODE_TYPE").setFocus(0);
                                thisObj.saveLoading.locked = false;
                            }
                        }
                    }
                });
            }
            else {
                callback("0", a);
            }
        }
        else
            callback(null, a);
    },

    prodNewProcess: function () {
        var param = {
            editFlag: 'I',
            width: 756,
            height: 200,
            isOpenPopup: true,
            parentPageID: "ESA062P_01",
            isCloseFlag: true,
            name: ecount.resource.BTN00495 + " " + ecount.resource.LBL85142.toLowerCase(),
            ITEM_CD: this.ITEM_CD
        };

        this.onAllSubmitSelf("/ECErp/ESA/ESA062P_01", param);
    },

    ErrShow: function (result) {
        var msg = '';
        var res = ecount.resource;
        if (result.Data.length > 0) {
            for (var i = 0; i < result.Data.length; i++) {
                if (result.Data[i].IsShowErr == 1)// Exists error show message
                {
                    if (result.Data[i].ERRFLAG != null) {
                        if (result.Data[i].ERRFLAG == "1") // Error not delete
                            msg += "<br/>" + res.MSG10104;
                    }
                }
            }
        }
        return msg;
    },
    // Show message validation in grid (Thể hiện thông báo lỗi trên lưới)
    setErrorMessageGrid: function (controlId, message, type, rowKey, tab) {
        this.pageOption.errorMessage.grid.push({ controlId: controlId, errorMessage: message, tabId: tab, type: type, rowKey: rowKey });
    },

    //Show progress bar (hiển thị layout load trang)
    vshowProgressbar: function (overlay) {
        this.saveLoading.locked = true;
        this.showProgressbar(overlay);
    },

    //Hide progress bar (ẩn layout load trang)
    vhideProgressbar: function () {
        this.saveLoading.locked = false;
        this.hideProgressbar(true);
    },

    // 품목등록 리스트 reload
    reloadItemList: function (isClose) {
        var self = this;
        this.sendMessage(this, {});

        if (isClose == true) {
            this.setTimeout(function () {
                self.close();
            }, 0);
        }
    },
});
