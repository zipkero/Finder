window.__define_resource && __define_resource("LBL10648","LBL35896","MSG01136","MSG03156","LBL35895","LBL10934","MSG06150","LBL10933","LBL10935","LBL10936","LBL10937","LBL10926","LBL06956","LBL10927","LBL10928","LBL10929","LBL10913","LBL06955","LBL10914","LBL10915","LBL10916","BTN00065","BTN00008","LBL10911","LBL10901","MSG03981","LBL07157","MSG02237","MSG10104");
/****************************************************************************************************
1. Create Date : 2016.05.26
2. Creator     : Pham Van Phu
3. Description : Setting Insp type (Cài đặt mục giám sát)
4. Precaution  :
5. History     : 2018.12.21 (PhiVo) applied 17520-A18_04271
6. Old file    : ESA060P_01M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "ESA060P_05", {
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
    // INSPECT_TYPE_NM (Tên đăng ký giám sát)
    INSPECT_TYPE_NM: null,
    // INSPECT_TYPE_CD2 (mã giám đăng ký giám sát)
    INSPECT_TYPE_CD2: null,
    // INSPECT_TYPE_CD (mã giám đăng ký giám sát)
    INSPECT_TYPE_CD: null,

    // Edit flag
    EditFlag: 'I',
    //Cờ cập nhật
    isSaveContentsFlag: false,
    //Cờ gọi hàm thêm mới
    isNewFlag: false,
    //List Item CD
    listItem: '',
    //load data insp setting
    listDataInspSetting: '',
    isDeleteNoInsert: false,

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
        var title = ecount.resource.LBL10648;
        header.setTitle(title)
    },

    onInitContents: function (contents, resource) {
        var ctrl = widget.generator.control();
        var g = widget.generator;
        var self = this;

        form1 = g.form();
        form1.template("register");
        controls = new Array();

        this.EditFlag = self.editFlag;
        form1.useInputForm()
          .executeValidateIfVisible()
          .setColSize(1)
          .setOptions({ _isModifyMode: true });

        controls.push(ctrl.define(this.EditFlag == "M" ? "widget.label" : "widget.input", "CODE_TYPE", "CODE_TYPE", ecount.resource.LBL35896)
           .value(self.ITEM_CD2)
           .label(self.ITEM_CD2)
           .filter("maxlength", { message: String.format(ecount.resource.MSG01136, 15, 30), max: 30 })
           .dataRules(["required"], ecount.resource.MSG03156).readOnly(true)
           .end());

        controls.push(ctrl.define(this.EditFlag == "M" ? "widget.label" : "widget.input", "TYPE_NAME", "TYPE_NAME", ecount.resource.LBL35895)
                .value(self.ITEM_NM)
                .label(self.ITEM_NM)
                .dataRules(["required"]).readOnly(true)
                .end());

        //define widget for ItemCode
        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemCode1", "ItemCode1", ecount.resource.LBL10934)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL10933))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemCode2", "ItemCode2", ecount.resource.LBL10935)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL10933))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemCode3", "ItemCode3", ecount.resource.LBL10936)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL10933))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemCode4", "ItemCode4", ecount.resource.LBL10937)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL10933))
            .end());

        //define widget for ItemNum
        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemNum1", "ItemNum1", ecount.resource.LBL10926)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06956))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemNum2", "ItemNum2", ecount.resource.LBL10927)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06956))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemNum3", "ItemNum3", ecount.resource.LBL10928)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06956))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemNum4", "ItemNum4", ecount.resource.LBL10929)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06956))
            .end());

        //define widget for ItemText
        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemText1", "ItemText1", ecount.resource.LBL10913)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06955))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemText2", "ItemText2", ecount.resource.LBL10914)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06955))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemText3", "ItemText3", ecount.resource.LBL10915)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06955))
            .end());

        controls.push(ctrl.define("widget.code.prodInspectItem", "ItemText4", "ItemText4", ecount.resource.LBL10916)
            .codeType(7)
            .popover(String.format(ecount.resource.MSG06150, ecount.resource.LBL06955))
            .end());

        form1.addControls(controls);

        contents.add(form1);
    },

    onInitFooter: function (footer) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var ctrlSave = ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065);

        toolbar.addLeft(ctrlSave);
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
        if (this.viewBag.InitDatas.LoadDataInspSetting != undefined && this.viewBag.InitDatas.LoadDataInspSetting != null) {
            var lsdata = this.viewBag.InitDatas.LoadDataInspSetting[0];
            this.EDIT_DT = lsdata["EDIT_DT"];
            this.EDIT_ID = lsdata["EDIT_ID"];
            var lsFocus = [];

            for (var i = 1; i < 5; i++) {
                if (lsdata.hasOwnProperty(String.format('CODECODE{0}', i))) {
                    this.contents.getControl(String.format("ItemCode{0}", i)).addCode({ label: lsdata[String.format("CODENAME{0}", i)], value: lsdata[String.format("CODECODE{0}", i)] });
                    if (lsdata[String.format("CODECODE{0}", i)] == null)
                        lsFocus.push(String.format("ItemCode{0}", i));
                }

                if (lsdata.hasOwnProperty(String.format("NUMCODE{0}", i))) {
                    this.contents.getControl(String.format("ItemNum{0}", i)).addCode({ label: lsdata[String.format("NUMNAME{0}", i)], value: lsdata[String.format("NUMCODE{0}", i)] });
                    if (lsdata[String.format("NUMCODE{0}", i)] == null)
                        lsFocus.push(String.format("ItemNum{0}", i));
                }

                if (lsdata.hasOwnProperty(String.format("TEXTCODE{0}", i))) {
                    this.contents.getControl(String.format("ItemText{0}", i)).addCode({ label: lsdata[String.format("TEXTNAME{0}", i)], value: lsdata[String.format("TEXTCODE{0}", i)] });
                    if (lsdata[String.format("TEXTCODE{0}", i)] == null)
                        lsFocus.push(String.format("ItemText{0}", i));
                }
            }

            if (lsFocus != null) {
                lsFocusSort = lsFocus.sort();
                for (var i = 0; i < lsFocusSort.length; i++) {
                    this.contents.getControl(lsFocusSort[i]).setFocus(0);
                    break;
                }
            }
        }
    },

    // 위젯 연동 팝업이 뜨기전에 호출되는 콜백
    onPreInitPopupHandler: function (control, keyword, config, response) {
        return true;
    },

    onPopupHandler: function (control, config, handler) {
        switch (control.id) {
            case 'ItemCode1':
            case 'ItemCode2':
            case 'ItemCode3':
            case 'ItemCode1':
                config.DATA_TYPE = 'C';
                break;
            case 'ItemNum1':
            case 'ItemNum2':
            case 'ItemNum3':
            case 'ItemNum4':
                config.DATA_TYPE = 'N';
                break;
            case 'ItemText1':
            case 'ItemText2':
            case 'ItemText3':
            case 'ItemText4':
                config.DATA_TYPE = 'T';
                break;
            default:
                config.DATA_TYPE = 'C';
                break;
        }

        config.popupType = false;
        config.TYPE = 'ITEM';
        config.isCheckBoxDisplayFlag = false;
        config.title = ecount.resource.LBL10911;
        handler(config);
    },

    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case 'ESA060_P02':
                this.contents.getControl("CODE_TYPE").setValue(message.data);
                page.close();
                this.contents.getControl("CODE_TYPE").onNextFocus();
                break;
        }
    },

    // Reset button clicked event
    onFooterReset: function (e) {
        this.contents.reset();
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
    },

    reloadPage: function () {
        var self = this;
        var param = {
            editFlag: self.EditFlag,
            isCloseFlag: true,
            INSPECT_TYPE_CD2: _INSPECT_TYPE_CD2,
            INSPECT_TYPE_NM: _INSPECT_TYPE_NM,
            INSPECT_TYPE_CD: self.INSPECT_TYPE_CD,
            ITEM_CD: self.ITEM_CD
        };

        self.onAllSubmitSelf("/ECErp/ESA/ESA060P_05", param);
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

        if (!thisObj.fnCheckDuplicateRequired("Code")) {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(ecount.resource.MSG03981);

            return false;
        }
        if (!thisObj.fnCheckDuplicateRequired("Num")) {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(ecount.resource.MSG03981);

            return false;
        }
        if (!thisObj.fnCheckDuplicateRequired("Text")) {
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(ecount.resource.MSG03981);

            return false;
        }

        if (this.saveLoading.locked) return;

        this.saveLoading.locked = true;

        var save_AllTab = ['CODE_TYPE', 'TYPE_NAME', 'ItemCode1', 'ItemCode2', 'ItemCode3', 'ItemCode4', 'ItemNum1', 'ItemNum2', 'ItemNum3', 'ItemNum4', 'ItemText1', 'ItemText2', 'ItemText3', 'ItemText4'];

        $(save_AllTab).each(function (i, data) {
            var invalid = thisObj.contents.validate(data);
            var invalidControl = {};
            var targetControl = {};

            if (invalid.result.length > 0) {
                isError = true;
                invalidControl = thisObj.contents.getControl(invalid.result[0][0].control.id);
                if (invalidControl) {   //현재 탭에 없을때 
                    targetControl = invalidControl;
                } else {
                    thisObj.contents.changeTab(invalid.tabId, false);
                    targetControl = invalid.result[0][0].control;
                }

                targetControl.setFocus(0);
                return false;
            }
        });

        this.fnSave();
    },

    //history
    onFooterHistory: function () {
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

    setInitSetAllow: function () {
        this.hideProgressbar(true);
        this.footer.getControl("save") && this.footer.getControl("save").setAllowClick();
    },

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function () {
        var thisObj = this;
        this.vshowProgressbar();
        var formdata = this.contents.serialize().merge();

        thisObj.fnGetlistItem(formdata);

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            thisObj.footer.get(0).getControl("Save").setAllowClick();
        }

        var data = {
            EditFlag: thisObj.editFlag,
            ITEM_CD2: thisObj.ITEM_CD2,
            ITEM_NM: thisObj.ITEM_NM,
            ListItem: thisObj.listItem,
            INSPECT_TYPE_CD: thisObj.INSPECT_TYPE_CD,
            TYPE: "ITEM_TYPE_CD",
            isDeleteNoInsert: thisObj.isDeleteNoInsert
        };

        ecount.common.api({
            url: "/Inventory/QcInspection/UpdateInspectionType",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    thisObj.vhideProgressbar();
                    ecount.alert(result.fullErrorMsg);
                    this.setInitSetAllow();
                }
                else {
                    if (result.Data.length > 0) {
                        if (thisObj.ErrShow(result))
                            thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                        this.setInitSetAllow();
                    }
                    else
                        thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                }

            }.bind(this),
            complete: function () {
                thisObj.saveLoading.locked = false;
                thisObj.vhideProgressbar();
            }
        });
    },

    //fn Check duplicate 
    fnCheckDuplicateRequired: function (type) {
        var thisObj = this;
        var formdata = this.contents.serialize().merge();// Implement new feature

        for (var i = 1; i < 5; i++) {
            var value_i = formdata[("Item" + type + i)];
            if (value_i != "") {
                for (var K = (i + 1) ; K < 5; K++) {
                    var value_k = formdata[("Item" + type + K)];
                    if (value_k != "") {
                        if (value_i == value_k) {
                            thisObj.contents.getControl("Item" + type + K).setFocus(0);
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },

    // Get list item
    fnGetlistItem: function (formdata) {
        var formdata = this.contents.serialize().merge();// Implement new feature
        if (formdata.ItemCode1 == "" && formdata.ItemCode2 == "" && formdata.ItemCode3 == "" && formdata.ItemCode4 == "" && formdata.ItemNum1 == "" && formdata.ItemNum2 == "" && formdata.ItemNum3 == ""
            && formdata.ItemNum4 == "" && formdata.ItemText1 == "" && formdata.ItemText2 == "" && formdata.ItemText3 == "" && formdata.ItemText4 == "") {
            this.isDeleteNoInsert = true;
        }

        var type = ['ItemCode', 'ItemNum', 'ItemText'];
        for (var j = 0; j <= type.length; j++) {
            for (var i = 1; i < 5; i++) {
                if (formdata.hasOwnProperty(type[j] + i)) {
                    if (j == 0)
                        this.listItem += formdata[type[j] + i] + "-C" + ecount.delimiter;
                    else if (j == 1)
                        this.listItem += formdata[type[j] + i] + "-N" + ecount.delimiter;
                    else
                        this.listItem += formdata[type[j] + i] + "-T" + ecount.delimiter;
                }
            }
        }
    },

    // Show Update error 
    // Hiển thị lỗi khi cài đặt mục giám sát
    ErrShow: function (result) {
        var res = ecount.resource;

        if (result.Data.length < 2) {
            if (result.Data[0].ERRFLAG != null) {
                if (result.Data[0].ERRFLAG == "2") // This code has been used
                    ecount.alert(res.MSG02237);
                else if (result.Data[0].ERRFLAG == "1")  // Error not Upadte 
                    ecount.alert(res.MSG10104);

                return false;
            }
            if (result.Data[0].TypeNotExists != null) { // Item not Exists
                if (result.Data[0].FindControlNext != null)
                    this.contents.getControl(result.Data[0].FindControlNext).setFocus(0);
                return false;
            }
            return true;
        }
        return true;
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
