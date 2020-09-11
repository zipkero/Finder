window.__define_resource && __define_resource("LBL09999","LBL06434","LBL06436","LBL03017","MSG03384","MSG00631","LBL02920","MSG03033","MSG02140","LBL06431","MSG03032","BTN00065","BTN00765","BTN00224","BTN00223","BTN00007","BTN00008","BTN00033","MSG00191","LBL00253","LBL02985","LBL05292","MSG00675","MSG00299","MSG00678","LBL07157","MSG00676");
/****************************************************************************************************
1. Create Date : 2015.05.15
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > Price Level Registration > Price Level by Item > Input Price by Item > New
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_07", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    bIsEditMode: null,  // Edit flag
    modifiedObj: null,  // The information of Price Level Item (Modification mode)
    userPermit: '',     // Page permission

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
        var headerTitle = this.editFlag == "I" ? res.LBL09999 : res.LBL06434;
        header.notUsedBookmark();
        header.setTitle(String.format(headerTitle, res.LBL06436));
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var form1 = g.form();

        // Define controls
        var itemCode = this.bIsEditMode ? ctrl.define("widget.label", "lblItemCode", "G_PROD_CD", this.viewBag.Resource.LBL03017).label(this.prod_cd).popover(resource.MSG03384).end()
                : ctrl.define("widget.multiCode.prod", "txtItemCode", "PROD_CD", this.viewBag.Resource.LBL03017).popover(resource.MSG03384).dataRules(["required"], resource.MSG00631).maxSelectCount(1).end();

        var priceLevel = this.bIsEditMode ? ctrl.define("widget.label", "lblPriceLevel", "G_PRICE_GROUP", this.viewBag.Resource.LBL02920).label(this.code_class).popover(resource.MSG03033).end()
                : ctrl.define("widget.multiCode.priceGroup", "txtPriceLevel", "PRICE_GROUP", resource.LBL02920).popover(resource.MSG03033).dataRules(["required"], resource.MSG02140).maxSelectCount(1).end();

        var appliedPrice = ctrl.define("widget.custom", "applied_price", "applied_price", resource.LBL06431).popover(this.viewBag.Resource.MSG03032).end();

        // Add controls
        form1.template("register")
            .add(itemCode)
            .add(priceLevel)
            .add(appliedPrice);

        contents.add(form1);
    },

    // Footer Initialization
    onInitFooter: function (footer, res) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        if (this.editFlag == "I")
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(res.BTN00065).addGroup([{ id: "SaveNew", label: res.BTN00765 }]).clickOnce());
        else
            toolbar.addLeft(ctrl.define("widget.button", "Save").label(res.BTN00065).clickOnce());

        if (this.bIsEditMode)
            toolbar.addLeft(ctrl.define("widget.button", "ActiveDeactive").label(this.modifiedObj.DEL_GUBUN == 'Y' ? res.BTN00224 : res.BTN00223).clickOnce());

        if (!this.bIsEditMode)
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(res.BTN00007));

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));

        if (this.bIsEditMode) {
            toolbar.addLeft(ctrl.define("widget.button", "Delete").label(res.BTN00033).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    // Controls Initialization
    onInitControl: function (cid, option) {
        var ctrl = widget.generator.control();
        console.log(cid);

        if (cid == "applied_price") {
            // Add controls
            option.columns(10, 2)
                .addControl(ctrl.define("widget.input", "price", "PRICE", this.viewBag.Resource.LBL06431).dataRules(['required'], this.viewBag.Resource.MSG00191).value(this.modifiedObj.PRICE).numericOnly(18, ecount.config.inventory.DEC_P).alignRight())
                .addControl(ctrl.define("widget.checkbox", "chkPriceVAT_YN", "PRICE_VAT_YN").label([this.viewBag.Resource.LBL00253]).value(['Y']).select(this.modifiedObj.PRICE_VAT_YN == 'Y' ? 'Y' : ''));
        }
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document is loaded
    onLoadComplete: function () {
        if (!this.bIsEditMode) {
            this.contents.getControl("txtItemCode").setFocus(0);
        }
        else {
            this.contents.getControl("applied_price").get(0).setFocus(0);
        }
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.parentPageID = this.pageID;
        config.popupType = false;
        config.additional = false;
        config.responseID = this.callbackID;

        if (control.id == "txtItemCode") {
            config.width = 430;
            config.height = 645;
            config.isCheckBoxDisplayFlag = false;
            config.name = this.resource.LBL02985;
        } else if (control.id == "txtPriceLevel") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
        }

        handler(config);
    },

    // Message Handler
    onMessageHandler: function (page, message) {
        // [Item Code] value
        if (page.pageID == 'ES020P') {
            this.contents.getControl("txtItemCode").addCode({
                label: message.data.PROD_DES, value: message.data.PROD_CD
            });
        } else if (page.pageID == 'CM020P') { // [Price Level] value
            this.contents.getControl("txtPriceLevel").addCode({
                label: message.data.CLASS_DES, value: message.data.CODE_CLASS
            });
        }

        message.callback && message.callback();  // The popup page is closed   
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // [Save] button clicked event
    onFooterSave: function (e) {
        this.fnSave(e, false);
    },

    // [Save & New] button clicked event
    onButtonSaveNew: function (e) {
        this.fnSave(e, true);
    },

    // Reset button clicked event
    onFooterReset: function (e) {
        this.contents.reset();
        this.contents.getControl('applied_price').get(0).setEmpty();
        this.contents.getControl('applied_price').get(1).setValue(0, false);
        this.contents.getControl("txtItemCode").setFocus(0);
    },

    // Active/Deactive button clicked event
    onFooterActiveDeactive: function (e) {
        var thisObj = this;
        var res = this.resource;
        var btn = this.footer.get(0).getControl("ActiveDeactive");

        // Check user authorization
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var data = {
            CUST: this.code_class,
            PROD_CD: this.prod_cd,
            DEL_GUBUN: this.modifiedObj.DEL_GUBUN == 'Y' ? 'N' : 'Y'
        };

        var ctrl = this.contents.getControl('txtItemCode');

        ecount.common.api({
            url: "/Inventory/Basic/UpdatePriceLevelItemForActivation",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    if (result.Data == "1") {
                        ctrl.showError(res.MSG00675);
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

    // Delete button clicked event
    onFooterDelete: function (e) {
        var thisObj = this;
        var res = this.resource;
        var btn = this.footer.get(0).getControl("Delete");

        // Check user authorization
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var data = {
            CUST: this.code_class,
            PROD_CD: this.prod_cd,
        };

        var ctrl = this.contents.getControl('txtItemCode');

        ecount.confirm(thisObj.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeletePriceLevelItem",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data == "1") {
                                ctrl.showError(res.MSG00678);
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
        this.close();
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
            name: this.resource.LBL07157,
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
        this.onFooterSave(e);
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

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (e, isSaveAndNew) {
        var thisObj = this;
        var res = this.resource;
        var btn = this.footer.get(0).getControl("Save");

        // Check user authorization
        if (this.userPermit == "R" || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        // Data validation
        var invalid = this.contents.validate();
        var formData = this.contents.serialize().merge();

        if (invalid.result.length > 0) {
            // Check Item Code is empty
            if (!this.bIsEditMode && formData.PROD_CD.length == 0) {
                this.contents.getControl("txtItemCode").setFocus(0);
            } else if (!this.bIsEditMode && formData.PRICE_GROUP.length == 0) { // Check Price Level is empty
                this.contents.getControl("txtPriceLevel").setFocus(0);
            } else if (formData.PRICE.length == 0) { // Check Price is empty
                this.contents.getControl("applied_price").get(0).setFocus(0);
            }

            btn.setAllowClick();
            return false;
        }

        if (this.bIsEditMode) {
            formData.PRICE_GROUP = formData.G_PRICE_GROUP;
            formData.PROD_CD = formData.G_PROD_CD;
        }

        // Get input's value
        var dataObj = {
            EDIT_FLAG: this.editFlag,
            CUST: formData.PRICE_GROUP,
            PROD_CD: formData.PROD_CD,
            PRICE: formData.PRICE,
            PRICE_VAT_YN: formData.PRICE_VAT_YN.length > 0 ? formData.PRICE_VAT_YN[0] : 'N',
        };

        var txtItemCode = this.contents.getControl('txtItemCode');
        var txtPriceLevel = this.contents.getControl('txtPriceLevel');

        // Call API
        ecount.common.api({
            url: "/Inventory/Basic/InsertOrUpdatePriceLevelItem",
            data: Object.toJSON(dataObj),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    if (result.Data == "1") {
                        txtItemCode.showError(res.MSG00676);
                        txtItemCode.setFocus(0);
                    }
                    else if (result.Data == "2") {
                        txtItemCode.showError(res.MSG00675);
                        txtItemCode.setFocus(0);
                    }
                    else {
                        // Send message for reloading grid
                        thisObj.sendMessage(thisObj, "Save");

                        // If [Save & New] button is clicked, then clear some inputs' values and keep the popup is opened
                        if (isSaveAndNew) {
                            txtItemCode.removeAll();
                            txtPriceLevel.removeAll();
                            txtItemCode.setFocus(0);
                        } else {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                    }
                }
            },
            complete: function () { btn.setAllowClick(); }
        });
    },
});