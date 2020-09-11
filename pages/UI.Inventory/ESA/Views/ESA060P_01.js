window.__define_resource && __define_resource("LBL93709","LBL10783","LBL35896","BTN00236","MSG01136","MSG03156","LBL10911","LBL35895","BTN00065","BTN00067","BTN00765","BTN00043","BTN00007","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","LBL10901","MSG00722","MSG01561","LBL07157","MSG08770","LBL10949","MSG00676","MSG02237","BTN00495","LBL85142","MSG10104");
/****************************************************************************************************
1. Create Date : 2016.05.17
2. Creator     : Pham Van Phu
3. Description : New Inspection type (Thêm mới đăng ký giám sát)
4. Precaution  :
5. History     : 2018.12.05 (문요한) : 중복코드 체크 보여주기 공통화
                 2018.12.21 (PhiVo) applied 17520-A18_04271
                 [2019.01.15][On Minh Thien] A18_03539 (사용자추가수정 화면 UI 수정 요청)
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6. Old file    : ESA061M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA060P_01", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    // ESC Key off 처리 
    off_key_esc: true,

    //AutoCode (Tự động sinh code mới)
    newCode: null,
    // edit new code
    editCodeValue: null,
    //status code exists 
    isExistsCode: false,

    INSPCECTION_TYPE_CD: null,
    // INSPECT_TYPE_NM (Tên đăng ký giám sát)
    INSPECT_TYPE_NM: null,
    // INSPECT_TYPE_CD2 (mã giám đăng ký giám sát)
    INSPECT_TYPE_CD2: null,

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
            title = ecount.resource.LBL93709;
        if (this.editFlag == "M")
            title = ecount.resource.LBL10783;
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

            controls.push(ctrl.define("widget.input.codeType", "CODE_TYPE", "CODE_TYPE", ecount.resource.LBL35896)
               .value(self.newCode).hasFn([{ id: "codeCheckDuplicate", label: ecount.resource.BTN00236 }])
               .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: "30" })
               .dataRules(["required"], ecount.resource.MSG03156)
               .end());

            controls.push(ctrl.define("widget.input.codeType", "CODE_TYPE1", "CODE_TYPE1", ecount.resource.LBL10911)
               .value(self.newCode)
                .readOnly(true)
                .hideCell(true)
               .end());

            controls.push(ctrl.define("widget.input.codeName", "TYPE_NAME", "TYPE_NAME", ecount.resource.LBL35895)
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

            controls.push(ctrl.define("widget.label", "CODE_TYPE", "CODE_TYPE", ecount.resource.LBL35896)
               .label(self.INSPECT_TYPE_CD2)
               .end());

            controls.push(ctrl.define("widget.input.codeName", "TYPE_NAME", "TYPE_NAME", ecount.resource.LBL35895).
                    value(self.INSPECT_TYPE_NM)
                    .dataRules(["required"])
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
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                       .css("btn btn-default")
                                                                       .addGroup(
                                                                        [
                                                                           {
                                                                               id: 'UseYN',
                                                                               label: (this.USE_YN == "N" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)
                                                                           },
                                                                           { id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));  // Delete
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

    // Reset button clicked event
    onFooterReset: function (e) {
        this.contents.reset();
        this.contents.getControl("CODE_TYPE").setFocus(0);
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
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_F2: function () {
        this.prodNewProcess();
    },

    ON_KEY_F8: function () {
        this.onFooterSave('', false);
        this.setInitSetAllow();
    },

    reloadPage: function () {
        var self = this;
        var param = {
            editFlag: self.EditFlag,
            isCloseFlag: true,
            INSPECT_TYPE_CD2: _INSPECT_TYPE_CD2,
            INSPECT_TYPE_NM: _INSPECT_TYPE_NM,
            INSPECT_TYPE_CD: thisObj.INSPECT_TYPE_CD

        };

        self.onAllSubmitSelf("/ECErp/ESA/ESA060P_01", param);
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
        this.contents.getControl("CODE_TYPE").readOnly(false);
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
            this.footer.get(0).getControl("Save").setAllowClick();

            return false;
        }

        if (this.saveLoading.locked) return;
        this.saveLoading.locked = true;

        //call back save
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), type == null ? false : type);
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Onfooter delete
    onButtonDelete: function () {
        // Check user authorization
        var self = this;
        var btn = self.footer.get(0).getControl("deleteRestore");
        var UserPermit = self.viewBag.Permission.Permit.Value;

        if (!['W'].contains(UserPermit)) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        var lsInspectTypeCd = [];

        if (self.INSPECT_TYPE_CD != undefined && self.INSPECT_TYPE_CD2 != undefined) {
            lsInspectTypeCd = self.INSPECT_TYPE_CD + "-" + self.INSPECT_TYPE_CD2 + "-" + self.INSPECT_TYPE_NM + ecount.delimiter
            if (lsInspectTypeCd.length <= 0) {
                ecount.alert(ecount.resource.MSG00722);
                btn.setAllowClick();
                return false;
            }

            var formData = {
                lsInspectTypeCd: lsInspectTypeCd,
                TYPE: 'INSPECTION_TYPE'
            };

            ecount.confirm(ecount.resource.MSG01561, function (status) {
                if (status) {
                    ecount.common.api({
                        url: "/Inventory/QcInspection/DeleteInspectionType",
                        data: formData,
                        success: function (result) {
                            if (result.Status != "200") {
                                alert(result.fullErrorMsg);
                            }
                            else {
                                if (result.Data.length > 0 && result.Data[0].IsShowErr == 1) {
                                    self.ErrShow(result);
                                }
                                else
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
        }
    },

    // Update UseYn
    onButtonUseYN: function () {
        var self = this;
        var btn = self.footer.get(0).getControl("deleteRestore");
        var UserPermit = self.viewBag.Permission.Permit.Value;

        if (!['W'].contains(UserPermit)) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var data = {
            USE_YN: self.USE_YN == "Y" ? "N" : "Y",
            INSPECT_TYPE_CD: self.INSPECT_TYPE_CD,
            TYPE: "UPDATE_USEYN_TYPE"
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
                btn.setAllowClick();
                self.saveLoading.locked = false;
                self.vhideProgressbar();
            }
        });
    },

    //history
    onFooterHistory: function () {
        if (this.viewBag.InitDatas.LoadData != undefined && this.viewBag.InitDatas.LoadData != null) {
            var lsdata = this.viewBag.InitDatas.LoadData[0];
            this.EDIT_DT = lsdata["EDIT_DT"];
            this.EDIT_ID = lsdata["EDIT_ID"];
        }

        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.EDIT_DT,
            lastEditId: this.EDIT_ID,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        });
    },

    // close
    onFooterClose: function () {
        this.close();
    },

    // Check exists code
    onFunctionCodeCheckDuplicate: function () {
        var thisObj = this;

        if (this.EditFlag == "M") {
            this.contents.getControl("CODE_TYPE").onNextFocus();
            return false;
        }

        var INSPCECTION_TYPE_CD = this.contents.getControl('CODE_TYPE').getValue();
        if (INSPCECTION_TYPE_CD == "") {
            this.contents.getControl("CODE_TYPE").showError('');
            this.contents.getControl("CODE_TYPE").setFocus(0);
            return false;
        }

        var checkCode = INSPCECTION_TYPE_CD.isContainsLimitedSpecial("code");
        if (checkCode.result) {
            this.contents.getControl("CODE_TYPE").showError(checkCode.message);
            this.contents.getControl("CODE_TYPE").setFocus(0);
            return false;
        }

        var data = {
            INSPECT_TYPE_CD2: INSPCECTION_TYPE_CD
        };

        ecount.common.api({
            url: "/Inventory/QcInspection/CheckCodeInspectionExists",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    if (result.Data == "1") {
                        thisObj.contents.getControl("CODE_TYPE").showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL10949));
                        thisObj.contents.getControl("CODE_TYPE").setFocus(0);
                        thisObj.footer.get(0).getControl("Save").setAllowClick();
                    }
                    else {
                        var param = {
                            keyword: INSPCECTION_TYPE_CD,
                            searchType: 'insp_type_cd',
                            isColumSort: true,
                            width: 430,
                            height: 300
                        };

                        thisObj.openWindow({
                            url: '/ECERP/Popup.Search/ES013P',
                            name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL35896),
                            param: param,
                            additional: false
                        });
                    }
                }
            }
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
        var _INSPECT_TYPE_CD2 = formdata.CODE_TYPE;
        var _INSPECT_TYPE_NM = formdata.TYPE_NAME;

        _INSPECT_TYPE_NM = $.trim(_INSPECT_TYPE_NM);

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
            return false;
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

        formdata.TYPE_NAME = _INSPECT_TYPE_NM;

        if (['I'].contains(thisObj.editFlag))
            formdata.USE_YN = 'Y';

        var data = {
            EditFlag: thisObj.editFlag,
            INSPECT_TYPE_CD2: _INSPECT_TYPE_CD2,
            INSPECT_TYPE_NM: _INSPECT_TYPE_NM,
            INSPECT_TYPE_CD: thisObj.INSPECT_TYPE_CD,
            TYPE: "INSPECTION_TYPE"
        };

        ecount.common.api({
            url: "/Inventory/QcInspection/UpdateInspectionType",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    thisObj.vhideProgressbar();
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    if (result.Data.length > 0 && result.Data[0].ERRFLAG == "2") {
                        ecount.alert(ecount.resource.MSG02237);
                        thisObj.setInitSetAllow();
                    }
                    else {
                        if (thisObj.continueFlag == true) {
                            thisObj.reloadItemList(false);
                            if (thisObj.isNewFlag) {
                                thisObj.prodNewProcess();
                                thisObj.setInitSetAllow();
                            }
                            else {
                                thisObj.editFlag = "M";
                                thisObj.typeName = _INSPECT_TYPE_NM;
                                thisObj.INSPECT_TYPE_CD = result.Data[0].INSPECT_TYPE_CD;
                                thisObj.contents.hideCell(['CODE_TYPE']);
                                thisObj.contents.showCell(['CODE_TYPE1']);
                            }
                        }
                        else
                            thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                    }
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
        var _INSPECTION_TYPE_CD2 = formdata.CODE_TYPE;
        var data = {
            INSPECT_TYPE_CD2: _INSPECTION_TYPE_CD2
        };

        if (['I'].contains(this.editFlag)) {
            if (_INSPECTION_TYPE_CD2 != "" && (ecount.common.ValidCheckSpecialForCodeType(_INSPECTION_TYPE_CD2).result)) {
                //If user entried data, call to API to check the item existed or not
                ecount.common.api({
                    url: "/Inventory/QcInspection/CheckCodeInspectionExists",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            if (result.Data == "1") {
                                thisObj.contents.getControl("CODE_TYPE").showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL10949));
                                thisObj.contents.getControl("CODE_TYPE").setFocus(0);
                                thisObj.footer.get(0).getControl("Save").setAllowClick();
                                thisObj.saveLoading.locked = false;
                            }
                            else {
                                thisObj.saveLoading.locked = false;
                                callback(result.Data.Data, a);
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
            parentPageID: "ESA060M",
            isCloseFlag: true,
            name: ecount.resource.BTN00495 + " " + ecount.resource.LBL85142.toLowerCase()
        };

        this.onAllSubmitSelf("/ECErp/ESA/ESA060P_01", param);
    },

    // Show message validation in grid (Thể hiện thông báo lỗi trên lưới)
    setErrorMessageGrid: function (controlId, message, type, rowKey, tab) {
        this.pageOption.errorMessage.grid.push({ controlId: controlId, errorMessage: message, tabId: tab, type: type, rowKey: rowKey });
    },

    ErrShow: function (result) {
        var res = ecount.resource;
        var strJSON = [];
        var msg1 = [res.MSG02237];
        var msg2 = [res.MSG10104];

        $.each(result.Data, function (i, value) {
            if (result.Data[i].IsShowErr == 1)// Exists error show message
            {
                if (result.Data[i].ERRFLAG == "2") {
                    strJSON.push({
                        IO_DATE: result.Data[i].InspCodeNoDelete,
                        CUS_NAME: result.Data[i].InspCodeNameNoDelete,
                        MESSAGE: msg1
                    });
                }

                if (result.Data[i].ERRFLAG == "1") {
                    strJSON.push({
                        IO_DATE: result.Data[i].InspCodeNoDelete,
                        CUS_NAME: result.Data[i].InspCodeNameNoDelete,
                        MESSAGE: msg2
                    });
                }
            }
        });

        var formErrMsg = Object.toJSON(strJSON);
        var param = {
            width: 720,
            height: 500,
            datas: formErrMsg,
            checkType: "TypeCode"
        };

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeCommonDeletable",
            name: 'SendingEC',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
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
