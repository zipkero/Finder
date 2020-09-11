window.__define_resource && __define_resource("LBL03100","LBL35126","LBL35127","LBL08838","LBL08396","LBL07879","LBL07880","LBL08839","LBL03099","LBL10949","BTN00065","BTN00067","BTN00007","BTN00008","LBL10932","LBL10923","MSG03475","LBL10901","BTN00236","LBL35896","MSG00676","MSG10104","LBL07157");
/****************************************************************************************************
1. Create Date : 2016.05.17
2. Creator     : NGUYEN CHI HIEU
3. Description : New Inspection type (Thêm mới đăng ký giám sát)
4. Precaution  :
5. History     : 2018.12.21 (PhiVo) applied 17520-A18_04271
6. Old file    : ESA063P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "ESA063P_01", {
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

    INSPECT_STATUS: null,

    INSPECT_TYPE_CD: null,

    INSPECT_TYPE_CD2: null,

    PROD_CD: null,

    PROD_DES: null,

    QC_BUY_TYPE: null,

    QC_YN: null,

    SAMPLE_PERCENT: null,

    // Edit flag
    editFlag: 'M',
    //Cờ cập nhật
    isSaveContentsFlag: false,
    //Cờ gọi hàm thêm mới
    isNewFlag: false,

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
    ****************************************************************************************************/
    onInitHeader: function (header) {
        header.notUsedBookmark();
        var title = "";
        title = String.format('{0}', ecount.resource.LBL03100);
        header.setTitle(title)
    },

    onInitContents: function (contents, resource) {
        var ctrl = widget.generator.control();
        var g = widget.generator;
        var self = this;
        form1 = g.form();
        form1.template("register");
        controls = new Array();

        // If is Modify
        this.isSaveContentsFlag = true;
        this.editFlag = self.editFlag;

        form1.useInputForm()
          .executeValidateIfVisible()
          .setColSize(1)
          .setOptions({ _isModifyMode: true });
        
        controls.push(ctrl.define("widget.label", "PROD_CD", "PROD_CD", ecount.resource.LBL35126)
                    .label(this.PROD_CD) // VALUE DEFAULT
                    .singleCell()
                    .end());

        controls.push(ctrl.define("widget.label", "PROD_DES", "PROD_DES", ecount.resource.LBL35127)
                    .label(this.PROD_DES) // VALUE DEFAULT
                    .singleCell()
                    .end());

        controls.push(ctrl.define("widget.select", "QC_BUY_TYPE", "QC_BUY_TYPE", ecount.resource.LBL08838).option(
                 ["B", ecount.resource.LBL08396],
                 ["Y", ecount.resource.LBL07879],
                 ["N", ecount.resource.LBL07880]).select("1").end());

        controls.push(ctrl.define("widget.select", "QC_YN", "QC_YN", ecount.resource.LBL08839).option(
                 ["B", ecount.resource.LBL08396],
                 ["Y", ecount.resource.LBL07879],
                 ["N", ecount.resource.LBL07880]).select("1").end());

        controls.push(ctrl.define("widget.custom", "StatusOption", "StatusOption", ecount.resource.LBL03099)
                .end());

        //define widget for ItemCode
        controls.push(ctrl.define("widget.code.prodInspectType", "InspectTypeCd", "InspectTypeCd", ecount.resource.LBL10949)
            .codeType(7)            
            .end());

        form1.addControls(controls);
        contents.add(form1);
    },

    onInitFooter: function (footer) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var ctrlSave = ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065);
        ctrlSave.addGroup([{ id: 'SaveContinue', label: ecount.resource.BTN00067 }]);

        toolbar.addLeft(ctrlSave.clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        if (this.editFlag == "M")
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        var ctrl = widget.generator.control();
        
        if (cid == "StatusOption") {
            control.columns(3, 3,6)
                .addControl(ctrl.define("widget.radio", "InspectStatus", "InspectStatus", ecount.resource.LBL03099)
                    .label([ecount.resource.LBL10932, ecount.resource.LBL10923]).value(["L", "S"])
                    .select(this.INSPECT_STATUS))
                 
                .addControl(ctrl.define("widget.input", "SamplePercent", "SamplePercent")
                    .dataRules({ min: 0 }, ecount.resource.MSG03475)
                    .numericOnly(4, 2)
                    .value(this.SAMPLE_PERCENT))
                .addControl(ctrl.define("widget.label", "titlePercent", "titlePercent").label('%'));
        }
    },

    onFocusOutHandler: function () {
        var ctrl = this.footer.getControl("Save");
        ctrl && ctrl.setFocus(0);
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    onChangeControl: function (control, data) {        
        switch (control.cid) {            
            case "InspectStatus":                
                if (control.cindex == "1") {
                    this.contents.getControl("StatusOption").get(1).show();
                    this.contents.getControl("StatusOption").get(2).show();
                    this.contents.getControl("StatusOption").get(1).setFocus(0);
                } else {
                    this.contents.getControl("StatusOption").get(1).hide();
                    this.contents.getControl("StatusOption").get(2).hide();
                }
                break;
        }
    },

    // 페이지 로딩 완료 후 이벤트
    onLoadComplete: function (e) {
        this.contents.getControl("QC_BUY_TYPE").setValue(this.QC_BUY_TYPE);
        this.contents.getControl("InspectTypeCd").addCode({ label: this.INSPECT_TYPE_NM, value: this.INSPECT_TYPE_CD });        
        this.contents.getControl("QC_YN").setValue(this.QC_YN);     
        
        if (this.INSPECT_STATUS == "S") {
            this.contents.getControl("StatusOption").get(1).show();
            this.contents.getControl("StatusOption").get(2).show();            
        } else {
            this.contents.getControl("StatusOption").get(1).hide();
            this.contents.getControl("StatusOption").get(2).hide();
        }

        this.contents.getControl("QC_BUY_TYPE").setFocus(0);
    },

    // 위젯 연동 팝업이 뜨기전에 호출되는 콜백
    onPreInitPopupHandler: function (control, keyword, config, response) {
        return true;
    },

    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
        config.isCheckBoxDisplayFlag = false;
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
        this.contents.getControl("QC_BUY_TYPE").setValue(this.QC_BUY_TYPE == "" ? "B" : this.QC_BUY_TYPE);
        this.contents.getControl("QC_YN").setValue(this.QC_YN == "" ? "B" : this.QC_YN);
        if (this.INSPECT_STATUS == "S") {
            this.contents.getControl("StatusOption").get(1).show();
            this.contents.getControl("StatusOption").get(2).show();
            this.contents.getControl("StatusOption").get(1).setFocus(0);
        } else {
            this.contents.getControl("StatusOption").get(1).hide();
            this.contents.getControl("StatusOption").get(2).hide();
        }
        this.contents.getControl("InspectTypeCd").addCode({ label: this.INSPECT_TYPE_NM == "" ? "" : this.INSPECT_TYPE_NM, value: this.INSPECT_TYPE_CD == "" ? "" : this.INSPECT_TYPE_CD });
    },

    /****************************************************************************************************
    * define grid event listener
    ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) { },

    onGridAfterFormLoad: function (e, data, grid) { },


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]

    ****************************************************************************************************/
    
    /**************************************************************************************************** 
    *  define hotkey event listener
    
    ****************************************************************************************************/
    ON_KEY_F8: function () {
        this.setSave(false);
        this.setInitSetAllow();
    },

    reloadPage: function () {
        var self = this;
        var param = {
            editFlag: self.editFlag,
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

        if (UserPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "U" }]);
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

    setSave: function (type) {        
        this.isNewFlag = type;
        var thisObj = this;
        var title = ecount.resource.LBL10901;
        var UserPermit = thisObj.viewBag.Permission.Permit.Value;

        if (UserPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "U" }]);
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

    // close
    onFooterClose: function () {
        this.close();
    },

    // Check exists code
    onFunctionCodeCheckDuplicate: function () {
        if (this.editFlag == "M") {
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

        var param = {
            keyword: INSPCECTION_TYPE_CD,
            searchType: 'insp_type_cd',
            isColumSort: true,
            width: 430,
            height: 300
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/ES013P',
            name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL35896),
            param: param,
            additional: false
        });
    },

    setInitSetAllow: function () {
        this.footer.getControl("save") && this.footer.getControl("save").setAllowClick();
    },

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (cl, type) {
        var thisObj = this;
        this.vshowProgressbar();
        var formdata = this.contents.serialize().merge();
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

        var strSamplePercent = formdata.SamplePercent;
        if (formdata.InspectStatus == "S" && strSamplePercent == '') {
            formdata.SamplePercent = 5;
        }

        if (formdata.InspectStatus == "L") {
            formdata.SamplePercent = 0;
        } 

        var data = {
            ERRFLAG: thisObj.editFlag,
            PROD_CD: formdata.PROD_CD,
            QC_YN: formdata.QC_YN,
            INSPECT_STATUS: formdata.InspectStatus,
            SAMPLE_PERCENT: formdata.SamplePercent,
            INSPECT_TYPE_CD: formdata.InspectTypeCd,
            QC_BUY_TYPE: formdata.QC_BUY_TYPE,
            ERRFLAG: formdata.ERRFLAG
        };

        ecount.common.api({
            url: "/SVC/Inventory/QcInspection/UpdateSTQCInspectiontypeSettingsByItem",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    thisObj.vhideProgressbar();
                    ecount.alert(result.fullErrorMsg);
                }
                else {                    
                    if (result.Data == "1") {
                        ecount.alert(ecount.resource.MSG10104);
                        thisObj.setInitSetAllow();
                    }
                    else {
                        thisObj.reloadItemList(thisObj.continueFlag);
                        if (thisObj.continueFlag == true) {                            
                            thisObj.setInitSetAllow();
                            thisObj.continueFlag = false;
                        }
                        else
                            thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                    }
                }
            }.bind(this),
            complete: function () {
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
            SEARCH_TYPE: "insp_type_cd",
            PARAM: _INSPECTION_TYPE_CD2
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
                            if (result.Data.length == 0)
                                callback(result.Data.Data, a);
                            else {
                                thisObj.footer.get(0).getControl("Save").setAllowClick();
                                thisObj.contents.getControl("CODE_TYPE").showError(ecount.resource.MSG00676);
                                thisObj.contents.getControl("CODE_TYPE").setFocus(0);
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

    //history
    onFooterHistory: function () {
        this.openWindow({
            url: '/ECERP/Popup.Search/ES303P',
            name: ecount.resource.LBL07157,
            param: {
                width: 450,
                height: 300,
                menuType: "14",
                historySlipNo: this.PROD_CD,
                isShowItem: true // Show title of Item (Nguyen Chi Hieu: Add a isShowItem property in ES303PAction)
            }
        });
    },

    // 품목등록 리스트 reload
    reloadItemList: function (isClose) {
        var self = this;
        this.sendMessage(this, {});

        if (!isClose) {
            this.setTimeout(function () {
                self.close();
            }, 0);
        }
    },
});
