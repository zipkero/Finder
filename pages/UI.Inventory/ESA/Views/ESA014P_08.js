window.__define_resource && __define_resource("LBL06441","LBL10282","MSG00263","LBL10283","BTN00028","BTN00008","MSG00262");
/****************************************************************************************************
1. Create Date : 2015.05.13
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > Price Level Registration > Price Level by Item > Register Price by Item > Copy
                 재고1 > 기초등록 > 특별단가등록 > 품목별 탭 > 복사 팝업창
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2019.07.16 (문요한) - SALE004 MariaDB동기화
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_08", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    
    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(resource.LBL06441);
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var form1 = g.form();
        
        form1.template("register")
            .add(ctrl.define("widget.multiCode.priceGroup", "PRICE_GROUP_FROM", "PRICE_GROUP_FROM", ecount.resource.LBL10282).dataRules(["required"], ecount.resource.MSG00263).maxSelectCount(1).end())
            .add(ctrl.define("widget.multiCode.priceGroup", "PRICE_GROUP_TO", "PRICE_GROUP_TO", ecount.resource.LBL10283).dataRules(["required"], ecount.resource.MSG00263).maxSelectCount(1).end())
        ;
        contents.add(form1);
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Copy").label(resource.BTN00028).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.contents.getControl("PRICE_GROUP_FROM").setFocus(0);
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        if (control.id == "PRICE_GROUP_FROM") {
            config.height = 550;
            config.popupType = false;
            config.additional = false;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isCheckBoxDisplayFlag = false;
            
        } else if (control.id == "PRICE_GROUP_TO") {
            config.height = 550;
            config.popupType = false;
            config.additional = false;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isCheckBoxDisplayFlag = false;
        }
        handler(config);
    },

    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.controlID == 'PRICE_GROUP_FROM') {
            this.contents.getControl('PRICE_GROUP_FROM').setFocus(0);
        } else if (page.controlID == 'PRICE_GROUP_TO') {
            this.contents.getControl('PRICE_GROUP_TO').setFocus(0);
        };
        message.callback && message.callback();  // The popup page is closed
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // Copy button clicked event
    onFooterCopy: function (e) {
        var thisObj = this;

        // Data validation
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            this.contents.getControl("PRICE_GROUP_FROM").setFocus(0);
            this.footer.get(0).getControl("Copy").setAllowClick();
            return false;
        }

        // Get form data
        var formdata = this.contents.serialize().merge();

        // Check specific data validations
        if (!this.checkSpecificDataValidation(formdata)) {
            this.footer.get(0).getControl("Copy").setAllowClick();
            return false;
        }
        var dataObj = {
            Request: {
                Data: {
                    CODE_CLASS: formdata.PRICE_GROUP_TO,
                    CODE_CLASS_F: formdata.PRICE_GROUP_FROM,
                    NET_SYSTEM: 'Y'
                }
            }
        };
        // Call API
        ecount.common.api({
            url: "/SVC/Inventory/Basic/CopyPriceLevelItem",
            data: Object.toJSON(dataObj),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                    thisObj.footer.get(0).getControl("Copy").setAllowClick();
                } else {
                    thisObj.setTimeout(function () { thisObj.close(); }, 0);
                    thisObj.sendMessage(thisObj, "Copy");
                }
            },
        });
    },

    // Close button clicked event
    onFooterClose: function (e) {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Copy button
        if (target != null && target.cid == "txtPriceLevelFrom") {
            this.footer.get(0).getControl("Copy").setFocus(0);
            e.preventDefault();
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // Check specific data validation
    checkSpecificDataValidation: function (formData) {
        var isValid = true;
        var des_code = formData.PRICE_GROUP_FROM;
        var source_code = formData.PRICE_GROUP_TO;

        if (des_code == source_code) {
            this.contents.getControl('PRICE_GROUP_FROM').showError(this.resource.MSG00262);
            this.contents.getControl("PRICE_GROUP_FROM").setFocus(0);
            isValid = false;
        }

        return isValid;
    }
});