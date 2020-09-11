window.__define_resource && __define_resource("LBL12143","LBL12144","LBL09999","LBL06434","LBL02093","MSG03019","MSG03901","MSG01136","LBL00504","MSG03123","MSG00084","LBL06161","MSG06647","BTN00839","LBL11680","MSG06648","LBL05342","LBL35154","MSG03018","LBL35155","BTN00065","BTN00765","BTN00007","BTN00008","BTN00033","LBL01490","LBL04057","MSG00299","MSG00678","LBL07157","MSG00676","MSG00675","MSG06629","MSG06630");
/****************************************************************************************************
1. Create Date : 2015.05.05
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > PIC/Employee > Bank Account link > New
4. Precaution  :
5. History     :  2016-03-21 안정환 소스 리팩토링 적용
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA001P_06", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: '',     // Page permission    

    //apiBankRes: 'N',

    //acctNameType: 'U',

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

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

    // Header Initialization
    onInitHeader: function (header) {
        var headerTitle = this.editFlag == "I" ? ecount.resource.LBL12143 : ecount.resource.LBL12144;        
        //var headerTitle = this.editFlag == "I" ? ecount.resource.LBL09999 : ecount.resource.LBL06434;

        header.notUsedBookmark();
        header.setTitle(headerTitle);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator;
        var ctrl = g.control();
        var form1 = g.form();
        
        // Define controls
        if (this.MENU_USEYN == 'N') {
            var txtBankName = ctrl.define("widget.input.codeName", "txtBankName", "CUST_DES", ecount.resource.LBL02093)
                            .popover(ecount.resource.MSG03019).dataRules(["required"], ecount.resource.MSG03901)
                            .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "50", "100"), max: 100 })
                            .value(this.cust_des)
                            .end();
        }
        else {
            var txtBankName = ctrl.define("widget.code.bankCd", "txtBankName", "CUST_DES", ecount.resource.LBL02093)
                            .popover(ecount.resource.MSG03019)
                            .setOptions({
                                controlType: "widget.code.bankCd",
                                data: null,
                                valueColumn: "BANK_CD",
                                labelColumn: "BANK_DES",
                            })
                            .enableLabel()
                            .end();
        }

        var txtBankAccNo = ctrl.define("widget.input.codeName", "txtBankAccNo", "TONGJANG_NUM", ecount.resource.LBL00504)
                            .popover(ecount.resource.MSG03123).dataRules(["required"], ecount.resource.MSG00084)
                            .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                            .value(this.tongjang_num)
                            .end();

        if (this.MENU_USEYN == 'N') {
            // ACCT_NAME (예금주명)
            var txtAcctName = ctrl.define("widget.input.general", "txtAcctName", "ACCT_NAME", ecount.resource.LBL06161)                                
                                .popover(ecount.resource.MSG06647)
                                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "25", "50"), max: 50 })
                                .value(this.ACCT_NAME)
                                .end();
        }
        else {
            // ACCT_NAME (예금주명)
            var txtAcctName = ctrl.define("widget.input.general", "txtAcctName", "ACCT_NAME", ecount.resource.LBL06161)
                                .hasFn([{ id: "SerachAcctHolder", label: ecount.resource.BTN00839 }])
                                .popover(ecount.resource.MSG06647)
                                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "25", "50"), max: 50 })
                                .value(this.ACCT_NAME)
                                .end();
        }

        // DEFAULT_FLAG (기본이체통장)
        var chkIsDefault = ctrl.define("widget.checkbox", "chkIsDefault", "IS_DEFAULT", ecount.resource.LBL11680)
                        .popover(ecount.resource.MSG06648)
                        .label([ecount.resource.LBL05342])
                        .value(true)
                        .select(this.IS_DEFAULT)
                        .end();

        var txtRemarks1 = ctrl.define("widget.input.general", "txtRemarks1", "ETC", ecount.resource.LBL35154)
                            .popover(ecount.resource.MSG03018)
                            .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "50", "100"), max: 100 })
                            .value(this.etc)
                            .end();

        var txtRemarks2 = ctrl.define("widget.input.general", "txtRemarks2", "CMSCODE", ecount.resource.LBL35155)
                            .popover(ecount.resource.MSG03018)
                            .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "50", "100"), max: 100 })
                            .value(this.cmscode)
                            .end();

        form1.colgroup({ width: '' });
        // Add controls
        if (this.DEFAULT_VIEW_FLAG == 'N')
            form1.template("register").add(txtBankName).add(txtBankAccNo).add(txtAcctName).add(txtRemarks1).add(txtRemarks2);
        else 
            form1.template("register").add(txtBankName).add(txtBankAccNo).add(txtAcctName).add(chkIsDefault).add(txtRemarks1).add(txtRemarks2);

        contents.add(form1);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
                
        if (this.editFlag == "I")
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([{ id: "SaveNew", label: ecount.resource.BTN00765 }]).clickOnce());
        else
            toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());        

        if(this.editFlag == "I")
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        if (this.editFlag == "M") {
            toolbar.addLeft(ctrl.define("widget.button", "Delete").label(ecount.resource.BTN00033).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.contents.getControl("txtBankName").setFocus(0);
        if (this.MENU_USEYN != 'N')
            this.contents.getControl("txtBankName").addCode({ label: this.cust_des, value: this.BANK_CD });        
    },

    onChangeControl: function (control) {        
        if (control.cid == 'txtAcctName') {
            this.ACCT_NAME_TYPE = 'U'
        }
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
        this.contents.getControl('txtBankName').setFocus(0);
    },

    // Delete button clicked event
    onFooterDelete: function (e) {
        var thisObj = this;
        var res = ecount.resource;
        var btn = thisObj.footer.get(0).getControl("Delete");

        var sResource;
        if (this.pageName == 'ESA015M') {
            sResource = ecount.resource.LBL01490;
        }
        else if (this.pageName == 'EBA011M') {
            sResource = ecount.resource.LBL04057;
        }

        // Check user authorization
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: sResource, PermissionMode: "D" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }        

        var data = {
            CUST: this.custNo,
            SER_NO: this.ser_no
        };

        var ctrl = this.contents.getControl("txtBankName");

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Account/Basic/DeleteTongJang",
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
                                if (thisObj.pageName == 'EBQ003P_02') {
                                    
                                    var dataObj = thisObj.makeSendData();                                   

                                    var message = {
                                        callback: thisObj.close.bind(thisObj)
                                    };
                                    message.data = dataObj;
                                    message.data.rowKey = thisObj.INDEX;

                                    thisObj.sendMessage(thisObj, message);
                                }
                                else {
                                    thisObj.sendMessage(thisObj, "Delete");

                                    thisObj.setTimeout(function () {
                                        thisObj.close();
                                    }, 0);
                                }
                            }
                        }                        
                    },
                    complete: function () { btn.setAllowClick(); }
                });
            } else { btn.setAllowClick(); }
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
            lastEditTime: this.wdate, 
            lastEditId: this.write_id,  
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
        this.onFooterSave(e);
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (target != null && target.cid == "txtRemarks2") {
            this.footer.get(0).getControl("Save").setFocus(0);
            e.preventDefault();
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (e, isSaveAndNew) {
        var thisObj = this;
        var res = ecount.resource;
        var btn = this.footer.get(0).getControl('Save');

        var sResource;
        if (this.pageName == 'ESA015M') {
            sResource = ecount.resource.LBL01490;
        }
        else if (this.pageName == 'EBA011M') {
            sResource = ecount.resource.LBL04057;
        }

        // Check user authorization
        if (this.userPermit == "R" || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: sResource, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        // Get form data
        var formData = this.contents.serialize().merge();

        // Basic data validation
        var invalid = this.contents.validate();

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return false;
        }

        // Validate specific logic
        var validData = this.checkSpecificDataValidation(formData);

        if (!validData.isValid) {            
            if (validData.validRow != '')
                this.contents.getControl(validData.validRow).setFocus(0);
            btn.setAllowClick();

            return false;
        }
        
        // Get inputs' values
        var dataObj = {
            // Extend properties
            EDIT_FLAG: this.editFlag,

            // Entity properties
            CUST: this.custNo,
            SER_NO: this.ser_no,
            CUST_DES: this.MENU_USEYN != 'N' ? this.contents.getControl("txtBankName").getValue(1) : this.contents.getControl("txtBankName").getValue(),
            TONGJANG_NUM: formData.TONGJANG_NUM,
            ETC: formData.ETC,
            CMSCODE: formData.CMSCODE,
            pageName: this.pageName,
            BANK_CD: this.MENU_USEYN != 'N' ? formData.CUST_DES : '',
            ACCT_NAME: formData.ACCT_NAME,
            ACCT_NAME_TYPE: this.ACCT_NAME_TYPE,
            IS_DEFAULT: this.DEFAULT_VIEW_FLAG != 'N' ? this.contents.getControl("chkIsDefault").getValue() == true ? 1 : 0 : 1,
        };
        
        // Get controls need to be cleared
        var txtBankName = this.contents.getControl("txtBankName");
        var txtBankAccNo = this.contents.getControl("txtBankAccNo");

        // Call API
        ecount.common.api({
            url: "/Account/Basic/InsertOrUpdatePICBankAcc",
            data: Object.toJSON(dataObj),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    if (result.Data == "1") {
                        txtBankName.showError(ecount.resource.MSG00676);
                        txtBankName.setFocus(0);
                    }
                    else if (result.Data == "2") {
                        txtBankName.showError(ecount.resource.MSG00675);
                        txtBankName.setFocus(0);
                    }
                    else {                        
                        dataObj.IS_DEFAULT = 1;
                        ecount.common.api({
                            url: "/Account/Basic/GetCustTongJangIsDefault",
                            data: Object.toJSON(dataObj),
                            success: function (result) {
                                if (result.Status != "200")
                                    ecount.alert(result.fullErrorMsg);
                                else {
                                    if (result.Data.length > 0) {
                                        // 기본이체 false로 나머지 통장 Update
                                        dataObj.IS_DEFAULT = 0;
                                        dataObj.SER_NO = result.Data[0].SER_NO;
                                        ecount.common.api({
                                            url: "/Account/Basic/UpdateCustTongJangByIsDefault",
                                            data: Object.toJSON(dataObj),
                                            success: function (result) {                                                
                                                if (result.Status != "200")
                                                    ecount.alert(result.fullErrorMsg);                                                
                                            },                                            
                                        });
                                    }
                                }                                
                            },
                            complete: function () {
                                // Send message for reloading grid
                                //thisObj.sendMessage(thisObj, "Save");
                                var message = {
                                    callback: thisObj.close.bind(thisObj)
                                };
                                if (thisObj.pageName == 'EBQ003P_02') {
                                    message.data = dataObj;
                                    message.data.rowKey = thisObj.INDEX;                                    
                                }
                                thisObj.sendMessage(thisObj, message);
                            }
                        });
                        // If [Save & New] button is clicked, then clear some inputs' values and keep the popup is opened
                        if (isSaveAndNew) {
                            txtBankName.setEmpty();
                            txtBankAccNo.setEmpty();
                            txtBankName.setFocus(0);
                        } else {                            
                            //thisObj.setTimeout(function () {
                            //    thisObj.close();
                            //}, 0);
                        }                        
                    }
                }                
            },
            complete: function () {
                btn.setAllowClick();                
            }
        });
    },

    // Validate specific data validation
    checkSpecificDataValidation: function (formData) {
        var validData = { isValid:  true, validRow: '' };        
        
        var strBankAccNo = formData.TONGJANG_NUM;   

        var bankName = '';
        if (this.MENU_USEYN == 'N')
            bankName = this.contents.getControl("txtBankName").getValue();
        else
            bankName = this.contents.getControl("txtBankName").getValue(1)

        if (bankName == '') {
            this.contents.getControl('txtBankName').showError(ecount.resource.MSG03901);
            //this.contents.getControl('txtBankName').setFocus(0);
            validData.isValid = false;
            validData.validRow = 'txtBankName';
        }
        
        if (this.contents.getControl("txtBankAccNo").getValue() == '') {
            this.contents.getControl('txtBankAccNo').showError(ecount.resource.MSG00084);
            //this.contents.getControl('txtBankAccNo').setFocus(0);
            validData.isValid = false;
            validData.validRow = 'txtBankAccNo';
        }        

        return validData;
    },


    // onFunction SerachAcctHolder
    onFunctionSerachAcctHolder: function () {
        var self = this;
        //var btn = self.footer.get(0).getControl("checkAcctName");               

        //Check require
        var bankCd = this.contents.getControl('txtBankName').getValue(0);
        var bankName = this.contents.getControl('txtBankName').getValue(1);
        var bankAcctNo = this.contents.getControl('txtBankAccNo').getValue().replaceAll("-","");

        if (bankCd == '') {
            this.contents.getControl("txtBankName").showError(ecount.resource.MSG06629);
            this.contents.getControl("txtBankName").setFocus(0);                        
            return false;
        }

        if (bankAcctNo == '') {
            this.contents.getControl("txtBankAccNo").showError(ecount.resource.MSG06630);
            this.contents.getControl("txtBankAccNo").setFocus(0);
            return false;
        }

        var form = [];

        form.push(
            {   
                BANK_CD: bankCd,
                BANK_DES: bankName,
                ACCT_NO: bankAcctNo,
                EMP_KNAME: this.contents.getControl('txtAcctName').getValue(),
                BankHolder: ''
            });

        var BankParam = {
            BANK_CD: '004',     //인터넷뱅킹코드
            BANKING_ID: '',
            BANKING_PW: '',
            ITEM1: '',
            ITEM2: '',
            ITEM3: '',
            ITEM4: '',
            ITEM5: '',
            ITEM6: '',
            ITEM7: '',
            ITEM8: '',
            ITEM9: '',
            ITEM10: '',
            StatusCode: "",
            ErrorMessage: "",
            Data: form
        }

        self.showProgressbar();
        ecount.common.api({
            url: "/Account/BankTransfer/GetAccountHolderForSearch",
            data: Object.toJSON({ HolderDto: BankParam }),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {
                    if (result.Data != null && result.Data != undefined && result.Data.Data.length > 0) {
                        // Call page for update acct name of Bank table                        
                        var bankAcctName = result.Data.Data[0].ACCT_NAME;
                        if (bankAcctName != undefined && bankAcctName != '') {
                            self.contents.getControl("txtAcctName").setValue(bankAcctName);
                            self.ACCT_NAME_TYPE = 'S';
                        } else {
                            if (result.Data.StatusCode == '9999') {
                                if (result.Data.Data.length > 0) {
                                    var t = result.Data.Data[0].RtnMessage.replace(/\[.*\]/gi, '');
                                    ecount.alert(t);
                                }
                                else
                                    ecount.alert(result.Data.ErrorMessage);
                            }
                        }
                    }
                    else {
                        if (result.Data.StatusCode == '9998')
                            ecount.alert(result.Data.ErrorMessage);
                        else 
                            ecount.alert("국민은행 API가 원할하지 않습니다.");
                    }
                }
            },
            complete: function () {
                self.hideProgressbar();
                //btn.setAllowClick();
            }
        });
    },

    // MakeSendData
    makeSendData: function () {
        // Get inputs' values
        var dataObj = {
            // Extend properties
            EDIT_FLAG: 'D',
            // Entity properties
            CUST: this.custNo,
            SER_NO: null,
            CUST_DES: '',
            TONGJANG_NUM: '',
            ETC: '',
            CMSCODE: '',
            pageName: this.pageName,
            BANK_CD: '',
            ACCT_NAME: '',
            ACCT_NAME_TYPE: '',
            IS_DEFAULT: 0,
            
        };

        return dataObj;
    },
});