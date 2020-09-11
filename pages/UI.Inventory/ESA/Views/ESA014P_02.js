window.__define_resource && __define_resource("LBL09999","LBL06434","LBL06436","LBL80071","LBL03004","LBL10029","MSG03031","MSG02140","MSG03384","MSG00631","LBL06431","MSG03032","BTN00065","BTN00067","BTN00765","BTN00007","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","MSG00191","LBL00253","LBL02985","LBL05292","MSG00675","MSG00299","MSG00678","LBL07157","MSG08770","LBL35526","MSG00676");
/****************************************************************************************************
1. Create Date : 2015.05.13
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > Price Level Registration > Price Level by Item > Register Price by Item > New
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
                 2019.07.16 (문요한) - SALE004 MariaDB동기화
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_02", {
    pageID: null,
    header: null,
    contents: null,
    footer: null,
    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    bIsEditMode: null,  // Edit flag
    modifiedObj: null,    // The information of Price Level Item (Modification mode)
    userPermit: null,     // Page permission

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.bIsEditMode = ['M'].contains(this.editFlag);
        this.modifiedObj = {};
        this.modifiedObj = this.viewBag.InitDatas.ModifiedObj;
        this.userPermit = this.viewBag.Permission.Permit.Value;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header, res) {
        var headerTitle = this.editFlag == "I" ? ecount.resource.LBL09999 : ecount.resource.LBL06434;
        header.notUsedBookmark();
        header.setTitle(String.format(headerTitle, ecount.resource.LBL06436));
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var form1 = g.form();
        if (this.isPriceByItemCall == true) {
            if (this.modifiedObj == undefined || this.modifiedObj == null) {
                this.bIsEditMode = false;
                this.modifiedObj = "";
            }
        }

        if (this.bIsEditMode) {
            form1.template("register").add(ctrl.define("widget.label", "txtItemCode", "PROD_CD", ecount.resource.LBL80071).label(this.modifiedObj.PROD_CD).end())
            form1.template("register").add(ctrl.define("widget.label", "txtItemName", "PROD_DES", ecount.resource.LBL03004).label(this.modifiedObj.PROD_DES).end())
            // form1.template("register").add(ctrl.define("widget.multiCode.priceGroup", "code_class", "code_class", ecount.resource.LBL10029).popover(ecount.resource.MSG03031).dataRules(["required"], ecount.resource.MSG02140).maxSelectCount(1).end());
            if (this.isPriceByItemCall == true) {
                form1.template("register").add(ctrl.define("widget.code.priceGroup", "code_class", "code_class", ecount.resource.LBL10029).popover(ecount.resource.MSG03031).readOnly().dataRules(["required"], ecount.resource.MSG02140).maxSelectCount(1).codeType(7).addCode({ label: this.des_class, value: this.code_class }).end());
            }
            else {
                form1.template("register").add(ctrl.define("widget.code.priceGroup", "code_class", "code_class", ecount.resource.LBL10029).popover(ecount.resource.MSG03031).dataRules(["required"], ecount.resource.MSG02140).maxSelectCount(1).codeType(7).end());
            }
        } else {
            if (this.isPriceByItemCall == true) {
                form1.template("register").add(ctrl.define("widget.code.prod", "txtItemCode", "PROD_CD", ecount.resource.LBL80071).popover(resource.MSG03384).dataRules(["required"], resource.MSG00631).maxSelectCount(1).codeType(7).addCode({ label: this.prod_des, value: this.prod_cd }).end());
                form1.template("register").add(ctrl.define("widget.code.priceGroup", "code_class", "code_class", ecount.resource.LBL10029).popover(ecount.resource.MSG03031).readOnly().dataRules(["required"], ecount.resource.MSG02140).maxSelectCount(1).codeType(7).addCode({ label: this.des_class, value: this.code_class }).end());
            }
            else {
                form1.template("register").add(ctrl.define("widget.code.prod", "txtItemCode", "PROD_CD", ecount.resource.LBL80071).popover(resource.MSG03384).dataRules(["required"], resource.MSG00631).maxSelectCount(1).codeType(7).end());
                form1.template("register").add(ctrl.define("widget.code.priceGroup", "code_class", "code_class", ecount.resource.LBL10029).popover(ecount.resource.MSG03031).dataRules(["required"], ecount.resource.MSG02140).maxSelectCount(1).codeType(7).end());
            }

        }

        form1.template("register").add(ctrl.define("widget.custom", "applied_price", "applied_price", resource.LBL06431).popover(ecount.resource.MSG03032).end());

        contents.add(form1);
    },

    // Footer Initialization
    onInitFooter: function (footer, res) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065)
            .addGroup([{ id: "SaveReview", label: ecount.resource.BTN00067 }
                , { id: "SaveNew", label: ecount.resource.BTN00765 }])
            .clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
        if (this.bIsEditMode) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959).css("btn btn-default").addGroup([
                { id: "ActiveDeactive", label: this.modifiedObj.DEL_GUBUN == 'Y' ? ecount.resource.BTN00203 : ecount.resource.BTN00204 },
                { id: 'delete', label: ecount.resource.BTN00033 }
            ])
                .noActionBtn().setButtonArrowDirection("up"));
        }
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        if (this.bIsEditMode) {
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    // Controls Initialization
    onInitControl: function (cid, option) {
        var ctrl = widget.generator.control();

        if (cid == "applied_price") {
            option
                //.columns(10, 2)   [20161031 bsy] 세로줄 처리 위해 제거  inline 추가
                .inline()
                .addControl(ctrl.define("widget.input", "txtPrice", "PRICE", ecount.resource.LBL06431)
                    .dataRules(['required'], ecount.resource.MSG00191)
                    .value(this.modifiedObj.PRICE).numericOnly(18, ecount.config.inventory.DEC_P).alignRight())
                .addControl(ctrl.define("widget.checkbox", "chkPriceVAT_YN", "PRICE_VAT_YN")
                    .label([ecount.resource.LBL00253]).value(['Y'])
                    .select(this.modifiedObj.PRICE_VAT_YN == 'Y' ? 'Y' : ''));
        }
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document is loaded
    onLoadComplete: function () {
        if (this.isPriceByItemCall == true) {
            this.contents.getControl("applied_price").get(0).setFocus(0);
        }
        else {
            if (this.bIsEditMode) {
                this.contents.getControl("code_class").addCode({
                    label: this.modifiedObj.CLASS_DES, value: this.modifiedObj.CODE_CLASS
                });
                this.contents.getControl("applied_price").get(0).setFocus(0);
            } else {
                this.contents.getControl("txtItemCode").setFocus(0);
            }
        }
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.parentPageID = this.pageID;
        config.popupType = false;
        config.additional = false;
        //config.responseID = this.callbackID;

        if (control.id == "txtItemCode") {
            config.width = 430;
            config.height = 645;
            config.isCheckBoxDisplayFlag = false;

            config.popupType = false;
            config.additional = false;
            config.name = ecount.resource.LBL02985;
        }
        if (control.id == "code_class") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isCheckBoxDisplayFlag = false;
        }

        handler(config);
    },

    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ES020P') {
            this.contents.getControl('txtItemCode').setFocus(0);
        };

        if (page.pageID == 'CM020P') {
            this.contents.getControl('code_class').setFocus(0);
        };
        message.callback && message.callback();  // The popup page is closed   
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // [Save] button clicked event
    onFooterSave: function (e) {
        this.fnSave(e, 'Save');
    },
    // [Save & New] button clicked event
    onButtonSaveNew: function (e) {
        this.fnSave(e, 'SaveNew');
    },
    // [Save & New] button clicked event
    onButtonSaveReview: function (e) {
        this.fnSave(e, 'SaveReview');
    },
    // Reset button clicked event
    onFooterReset: function (e) {

        if (this.code_class == null && this.prod_cd == null) {
            this.contents.reset();
        }
        else {
            if (this.isPriceByItemCall == true) {
                var param = {
                    editFlag: 'M',
                    code_class: this.code_class,
                    des_class: this.des_class,
                    prod_cd: this.prod_cd,
                    prod_des: this.prod_des,
                    isPriceByItemCall: true
                };
            }
            else {
                var param = {
                    editFlag: 'M',
                    code_class: this.code_class,
                    prod_cd: this.prod_cd
                };
            }
            this.onAllSubmitSelf("/ECERP/ESA/ESA014P_02", param, "details")
        }
        //this.contents.getControl('applied_price').get(0).setEmpty();
        //this.contents.getControl('applied_price').get(1).setValue(0, false);
        //this.contents.getControl('txtItemCode').setFocus(0);
    },

    // Active/Deactive button clicked event
    onButtonActiveDeactive: function (e) {
        var thisObj = this;
        var res = ecount.resource;
        //var btn = this.footer.get(0).getControl("ActiveDeactive");
        var btn = this.footer.get(0).getControl("deleteRestore");

        var formData = this.contents.serialize().merge();
        // Check user authorization
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var data = {
            Request: {
                Data: {
                    CUST: formData.code_class,
                    PROD_CD: this.modifiedObj.PROD_CD,
                    DEL_GUBUN: this.modifiedObj.DEL_GUBUN == 'Y' ? 'N' : 'Y',
                    EDIT_MODE: ecenum.editMode.modify
                }
            }
        };
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdatePriceLevelItemForActivation",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    if (result.Data == "1") {
                        ctrl.showError(ecount.resource.MSG00675);
                        ctrl.setFocus(0);
                    }
                    else {
                        thisObj.sendMessage(thisObj, "ActiveDeactive");
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    }
                }
            },
            complete: function () { btn.setAllowClick(); }
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Delete button clicked event
    onButtonDelete: function (e) {
        var thisObj = this;
        var res = ecount.resource;
        var btn = this.footer.get(0).getControl("deleteRestore");

        // Check user authorization
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var data = {
            Request: {
                Data: {
                    CUST: this.code_class,
                    PROD_CD: this.prod_cd
                }
            }
        };

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeletePriceLevelItem",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data == "1") {
                                ctrl.showError(ecount.resource.MSG00678);
                                ctrl.setFocus(0);
                            }
                            else {
                                thisObj.sendMessage(thisObj, "Delete");
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                        }
                    },
                    complete: function () { btn.setAllowClick(); }
                });
            }

            btn.setAllowClick();
        });
    },

    // Close button clicked event
    onFooterClose: function () {
        this.close(true);
    },

    // History button clicked event
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.modifiedObj.WDATE,
            lastEditId: this.modifiedObj.WID,
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false,
            additional: false
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/

    // F8
    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (e.target != null && e.target.name == "chkPriceVAT_YN") {
            this.footer.get(0).getControl("Save").setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    //저장및 신규, 내용유지
    moveSaveNewOrReview: function (SaveAction) {
        var formData = this.contents.serialize().merge();
        // Define data transfer object
        var param = {
            editFlag: SaveAction == 'SaveNew' ? 'I' : 'M',
            //code_class: SaveAction == 'SaveNew' ? '' : formData.code_class,
            //prod_cd: SaveAction == 'SaveNew' ? '' : formData.PROD_CD
            code_class: formData.code_class,
            prod_cd: formData.PROD_CD
        };

        this.onAllSubmitSelf("/ECERP/ESA/ESA014P_02", param, "details")
    },
    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (e, SaveAction) {
        var thisObj = this;
        var res = ecount.resource;
        var btn = this.footer.get(0).getControl('Save');

        // Check user authorization
        if (this.userPermit == "R" || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var formData = this.contents.serialize().merge();
        // Get controls
        var objFocusTarget = this.contents.getControl('txtItemCode');
        var objCodeClass = this.contents.getControl('code_class');
        if (this.bIsEditMode) {
            objFocusTarget = this.contents.getControl('code_class');
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            //invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return false;
        }

        var code = formData.PROD_CD.trim();
        // Get input's value
        var dataExs = {
            EDIT_FLAG: "I",
            CUST: formData.code_class, //this.code_class,
            PROD_CD: formData.PROD_CD
        };

        var Flag = "N";

        //If user entried data, call to API to check the item existed or not
        if (formData.code_class != this.code_class) {
            debugger;
            if (code != "") {
                // Call API
                ecount.common.api({
                    url: "/Inventory/Basic/CheckExistedPriceLevelItem",
                    async: false,
                    data: Object.toJSON(dataExs),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else {
                            if (result.Data == "1") {
                                if (invalid.result.length > 0) {
                                    thisObj.contents.getControl("applied_price").get(0).setFocus(0);
                                }
                                Flag = "Y";
                                objFocusTarget.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL35526));
                                objFocusTarget.setFocus(0);
                                btn.setAllowClick();
                                return;
                            }
                            else if (result.Data == "2") {
                                if (invalid.result.length > 0) {
                                    thisObj.contents.getControl("applied_price").get(0).setFocus(0);
                                }
                                Flag = "Y";
                                objFocusTarget.showError(ecount.resource.MSG00675);
                                objFocusTarget.setFocus(0);
                                btn.setAllowClick();
                                return;
                            }
                            else {
                            }
                        }
                    }
                });
            }
            if (Flag == "Y")
                return false;
        }

        var cust = formData.code_class;
        if (this.bIsEditMode) {
            cust = thisObj.modifiedObj.CODE_CLASS;
        }
        // Get input's value
        var dataObj = {
            Request: {
                Data: {
                    EDIT_MODE: thisObj.editFlag === ecenum.editFlag.New ? ecenum.editMode.new : ecenum.editMode.modify,
                    CUST: cust,
                    CODE_CLASS: formData.code_class,
                    PROD_CD: formData.PROD_CD,
                    PRICE: formData.PRICE,
                    PRICE_VAT_YN: formData.PRICE_VAT_YN.length > 0 ? formData.PRICE_VAT_YN[0] : 'N',
                    DEL_GUBUN: ''
                }
            }
        };

        // Call API
        ecount.common.api({
            url: "/SVC/Inventory/Basic/InsertOrUpdatePriceLevelItem",
            data: Object.toJSON(dataObj),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    if (result.Data == "1") {
                        objFocusTarget.showError(ecount.resource.MSG00676); // 이미 존재하는 코드 입니다.\n\n다른 코드를 입력 바랍니다.
                        objFocusTarget.setFocus(0);
                    }
                    else if (result.Data == "2") {
                        objFocusTarget.showError(ecount.resource.MSG00675); // 코드가 존재하지 않습니다.
                        objFocusTarget.setFocus(0);
                    }
                    else {
                        thisObj.sendMessage(thisObj, "Save");
                        if (SaveAction == "Save") {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        } else if (SaveAction == "SaveNew") {
                            thisObj.moveSaveNewOrReview(SaveAction);
                        } else if (SaveAction == "SaveReview") {
                            thisObj.moveSaveNewOrReview(SaveAction);
                        }
                    }
                }
            },
            complete: function () { btn.setAllowClick(); }
        });
    }
});
