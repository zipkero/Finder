window.__define_resource && __define_resource("LBL06434","LBL10031","LBL06375","MSG03029","LBL06376","MSG03028","LBL00381","LBL00359","BTN00067","BTN00065","BTN00007","BTN00008","LBL80067","LBL93300","MSG00499","LBL07157");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : NGUYEN TRAN QUOC BAO
3. Description : INV.I > SETUP > Price Level by Customer/Vendor (EDIT)
                 재고1 > 기초등록 > 특별단가등록 > 거래처특별단가그룹등록 리스트 > 거래처코드 링크 (거래처특별단가그룹수정)
4. Precaution  :
5. History     : 2015.09.28 - Tho Phan - Restructuring codes
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2019.05.02 (최용환) : A19_01492 Action 3.0 로직변경 - 거래처코드 등록,수정,삭제
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA033M", {
    /********************************************************************** 
    * page user opion Variables(User variables and Object) 
    **********************************************************************/

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    userPermit: '',     // User permission

    /********************************************************************** 
    * page init   Class inheritance , init, render etc
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.userPermit = this.viewBag.Permission.Permit.Value;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    onInitHeader: function (header) {
        var res = ecount.resource;
        header.setTitle(String.format(res.LBL06434, res.LBL10031)).notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            itemControl = g.control(),
            form1 = g.form(),
            res = ecount.resource,
            priceGroupCtrl = {},
            priceGroupCtrl2 = {};


        priceGroupCtrl = ctrl.define("widget.code.priceGroup", "PRICE_GROUP", "PRICE_GROUP", res.LBL06375).maxSelectCount(1).popover(res.MSG03029).codeType(7);
        if (this.priceGroup_Code != null) {
            priceGroupCtrl.addCode({
                label: this.priceGroup_Name, value: this.priceGroup_Code
            });
        }
        priceGroupCtrl = priceGroupCtrl.end();

        priceGroupCtrl2 = ctrl.define("widget.code.priceGroup", "PRICE_GROUP2", "PRICE_GROUP2", res.LBL06376).maxSelectCount(1).popover(res.MSG03028).codeType(7);
        if (this.priceGroup_1_Code != null) {
            priceGroupCtrl2.addCode({
                label: this.priceGroup_1_Name, value: this.priceGroup_1_Code
            });
        }
        priceGroupCtrl2 = priceGroupCtrl2.end();

        form1
            .template("register")
            .add(ctrl.define("widget.label", "BUSINESS_NO", "BUSINESS_NO", res.LBL00381).label(this.BUSINESS_NO).end())
            .add(ctrl.define("widget.label", "CUST_NAME", "CUST_NAME", res.LBL00359).label(this.CUST_NAME).end())
            .add(priceGroupCtrl)
            .add(priceGroupCtrl2);

        contents
            .add(form1)
        ;
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup = [];
            res = ecount.resource;
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(res.BTN00065).addGroup(addgroup));
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(res.BTN00007));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));
        toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    onLoadComplete: function () {
        this.contents.getControl("PRICE_GROUP").setFocus(0);
    },

    onPopupHandler: function (control, config, handler) {
        if (control.id == "PRICE_GROUP" || control.id == "PRICE_GROUP2") {
            config.name = String.format(ecount.resource.LBL80067, control.subTitle);
            config.titlename = config.name;
            config.popupType = false;
            config.additional = false;
        }
        handler(config);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

    onFooterClose: function (e) {
        this.close();
    },

    onFooterReset: function (e) {
        //this.contents.reset();
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 220,
            BUSINESS_NO: this.BUSINESS_NO,
            CUST_NAME: this.CUST_NAME,
            priceGroup_Code: this.priceGroup_Code,
            priceGroup_Name: this.priceGroup_Name,
            priceGroup_1_Code: this.priceGroup_1_Code,
            priceGroup_1_Name: this.priceGroup_1_Name,
            WID: this.WID,
            WDATE: this.WDATE
        };        
        this.contents.getControl("PRICE_GROUP").setFocus(0);
        this.onAllSubmitSelf("/ECERP/ESA/ESA033M", param);
    },
    // SAVE REVIEW button click event
    onButtonSaveReview: function (e) {
        this.onFooterSave(e, 3);
    },
    onFooterSave: function (e, isSaveNew) {

        if (isSaveNew == null || isSaveNew == undefined)
            isSaveNew = 1;
        var invalid = this.contents.validate();
        var thisObj = this,
            res = ecount.resource,
            formdata = this.contents.serialize().merge(),
            data = {},
            authMessage = {};

        if (['R', 'U'].contains(this.userPermit)) {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93300, PermissionMode: 'U' }]);
            ecount.alert(authMessage.fullErrorMsg);
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }

        var saveData =  this.contents.extract().merge();
        data = {
            Request: {
                Data: {
                    BUSINESS_NO: this.BUSINESS_NO,
                    CUST_NAME: formdata.CUST_NAME,
                    PRICE_GROUP: formdata.PRICE_GROUP,
                    PRICE_GROUP2: formdata.PRICE_GROUP2
                }
            }
        }

        //If any field unvalid
        if (invalid.result.length > 0) {
            thisObj.footer.get(0).getControl("Save").setAllowClick();
            invalid.result[0][0].control.setFocus(0);
            return;
        }

        ecount.common.api({
            url: "/SVC/Account/Basic/UpdatePriceLevelbyCustomerVendor",
            data: JSON.stringify(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                }
                else {
                    var arrData = result.Data.split(ecount.delimiter);
                    if (arrData[0] == 0) {

                        thisObj.sendMessage(thisObj, { message: 'Data is saved!' });
                        if (isSaveNew == 1) {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                        else {
                            // Save Review
                            if (isSaveNew == 3) {
                                var param = {
                                    width: ecount.infra.getPageWidthFromConfig(),
                                    height: 220,
                                    BUSINESS_NO: thisObj.BUSINESS_NO,
                                    CUST_NAME: formdata.CUST_NAME,
                                    priceGroup_Code: saveData.PRICE_GROUP.codes.length == 0 ? "" : saveData.PRICE_GROUP.codes[0].value,
                                    priceGroup_Name: saveData.PRICE_GROUP.codes.length == 0 ? "" : saveData.PRICE_GROUP.codes[0].label,
                                    priceGroup_1_Code: saveData.PRICE_GROUP2.codes.length == 0 ? "" : saveData.PRICE_GROUP2.codes[0].value,
                                    priceGroup_1_Name: saveData.PRICE_GROUP2.codes.length == 0 ? "" : saveData.PRICE_GROUP2.codes[0].label,
                                    WID: arrData[2],
                                    WDATE: arrData[1]
                                };
                                thisObj.onAllSubmitSelf("/ECERP/ESA/ESA033M", param);
                            }
                        }
                    }
                    else {
                        ecount.alert(res.MSG00499);
                        this.footer.get(0).getControl("Save").setAllowClick();
                        return false;
                    }
                }
            },
            complete: function () {
                thisObj.footer.get(0).getControl("Save").setAllowClick();
            }
        });
    },

    onFooterHistory: function (e) {
        var res = ecount.resource,
            param = {
                width: 450,
                height: 150,
                lastEditTime: this.WDATE,   
                lastEditId: this.WID
            };
                
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: res.LBL07157,
            popupType: false,
            additional: false,
            param: param
        })
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_ENTER: function (e, target) {
        if (target != null) {
            var control = target.control
            if (control.id === "PRICE_GROUP2") {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },

    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },
});