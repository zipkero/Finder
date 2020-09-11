window.__define_resource && __define_resource("LBL08493","LBL00653","LBL03209","LBL06825","LBL00655","LBL00754","MSG00170","MSG00172","MSG02918","LBL93305","LBL09999","LBL01408","LBL06434","LBL03142","LBL93360","LBL02282","LBL03515","MSG01136","MSG00597","MSG02917","MSG00599","BTN00067","BTN00765","BTN00065","BTN00007","BTN00959","BTN00204","BTN00203","BTN00033","BTN00008","MSG02605","MSG00299","MSG00678","MSG02834","LBL07157","MSG00676","MSG00675","MSG02054");
/****************************************************************************************************
1. Create Date : 2015.05.25
2. Creator     : PHI lUONG
3. Description : Inv1 > Setup > Internal Use > New Internal Use / 재고1 > 기초등록 > 자가사용유형등록 > 신규
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.10.29 [tuan] Existing Error Fixed (Test.76914)
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA021M"/** page ID */, {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    //ecConfig: ["config.inventory", "config.account", "config.user", "company", "user"],

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/

    dataList: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {        
        this._super.init.apply(this, arguments); 

        // Code title

        // Logic to get the Max Code

        if (this.CODE_CLASS == "S09")
            this.codeHeader = ecount.resource.LBL08493;
        else if (this.CODE_CLASS == "S20")
            this.codeHeader = ecount.resource.LBL00653;
        else
            this.codeHeader = ecount.resource.LBL03209;

        // Code Des Title
        if (this.CODE_CLASS == "S09")
            this.codeDesHeader = ecount.resource.LBL06825;
        else if (this.CODE_CLASS == "S20")
            this.codeDesHeader = ecount.resource.LBL00655;
        else
            this.codeDesHeader = ecount.resource.LBL00754;

        //Pop Over
        if (this.CODE_CLASS == "S09")
            this.codeDesPopOver = ecount.resource.MSG00170;
        else if (this.CODE_CLASS == "S20")
            this.codeDesPopOver = ecount.resource.MSG00172;
        else
            this.codeDesPopOver = ecount.resource.MSG02918;


        //Get Permission 
        this.permission = this.viewBag.Permission.permit;
        
        this.initProperties();
    },

    //Method is a method to render the UI of the page
    render: function () {
        
        //When the method is called onInitHeader () defined on the page, onInitContents (), will onInitFooter () method is called, set the basic layout information.
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    // Set default properties
    initProperties: function () {
        this.dataList = {
            NEXT_CODE: ""
        };
    },
    onInitHeader: function (header) {
        header.notUsedBookmark();
        //New or modified according to the value
        // Show Title
        // Resource value declared in cshtml
        if (this.CODE_CLASS == "S09") {
            this.res = ecount.resource.LBL93305;
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL01408);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL01408);
        }
        else if (this.CODE_CLASS == "S10") { //Defect
            this.res = ecount.resource.LBL93305;
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL03142);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL03142);
        }
        else if (this.CODE_CLASS == "S20") { //Internal Use
            this.res = ecount.resource.LBL93360;
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL02282);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL02282);
        }
        else if (this.CODE_CLASS == "G01") {
            this.res = ecount.resource.LBL03515;
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL03515);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL03515);
        }
        else {
            this.res = this.CLASS_DES;
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, this.CLASS_DES);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, this.CLASS_DES);
        }

        if (['I'].contains(this.editFlag)) {
            header.setTitle(this.HeaderTitlePopUp)
        }
        else {
            header.setTitle(this.HeaserTitlePopUpModify)
        }
    },

    //setting Contents option
    onInitContents: function (contents) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        ctrl = g.control(),
        form1 = g.form(),
        thisqty = this.qty;

        decq = '9' + ecount.config.inventory.DEC_Q;

        form1
            .template("register");

        if (['I'].contains(this.editFlag)) {
            form1.add(ctrl.define("widget.input.codeType", "CODE_NO", "CODE_NO", this.codeHeader)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "2", "5"), max: 5 })
                .dataRules(["required"], ecount.resource.MSG00597)
                .value()
                .popover(ecount.resource.MSG02917)
                .end())
        }
        else {
            form1.add(ctrl.define("widget.label", "CODE_NO", "CODE_NO", this.codeHeader).label(this.CODE_NO).popover(ecount.resource.MSG02917).end())
        }
       
        form1.add(ctrl.define("widget.input.codeName", "CODE_DES", "CODE_DES", this.codeDesHeader).value(this.editFlag == "I" ? "" :this.CODE_DES)
            .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "30", "60"), max: 60 })
            .dataRules(["required"], ecount.resource.MSG00599)
            .popover(this.codeDesPopOver)
            .end())

        contents
            .add(form1);

    },

    //setting Footer option
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        addgroup = [],
        ctrl = widget.generator.control();

        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
        toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce())
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007))
        if (['M'].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                       .css("btn btn-default")
                                                                       .addGroup(
                                                                        [
                                                                           {
                                                                               id: 'use',
                                                                               label: (['Y'].contains(this.USE_GUBUN) ? ecount.resource.BTN00204 : ecount.resource.BTN00203)                //Resource : 재사용, 사용중단
                                                                           },
                                                                           { id: 'delete', label: ecount.resource.BTN00033 }
                ]).noActionBtn().setButtonArrowDirection("up"));  // Delete
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        }
        else {
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }


        //to chain patterns into the toolbar on the contents 
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    //After the document is opening.
    onLoadComplete: function () {
        var self = this;

        //Prevent cross code attach
        if (this.editFlag == "M") {
            var infoData = self.viewBag.InitDatas;
            var InternalCodeDetail = infoData.InternalCodeDetail;
            var result = InternalCodeDetail[0];
            if (result != undefined && result != "" && result != null) {
            }
            else {
                ecount.alert(ecount.resource.MSG02605);
                this.sendMessage(this, "Underfine");
                this.close();
            }
        }

        var thisObj = this;
        if (['I'].contains(this.editFlag)) {
            this.contents.getControl("CODE_NO").setValue(self.viewBag.InitDatas.AutoCode[0].NEXT_CODE);
            if (self.viewBag.InitDatas.AutoCode[0].NEXT_CODE != '' && self.viewBag.InitDatas.AutoCode[0].NEXT_CODE != undefined && self.viewBag.InitDatas.AutoCode[0].NEXT_CODE != null)
                this.contents.getControl("CODE_DES").setFocus(0);
            else
                this.contents.getControl("CODE_NO").setFocus(0);

        } else {
            this.contents.getControl("CODE_DES").setFocus(0);
        }
        
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define action event listener
    ****************************************************************************************************/

    // Save Event
    onFooterSave: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 1);
    },

    // [Save/New] button clicked event
    onButtonSaveNew: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 2);
    },

    // [Save/Review] button clicked event
    onButtonSaveReview: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 3);
    },

    //Reset Event
    onFooterReset: function () {
        if (this.CODE_NO == null || this.CODE_NO == undefined) {
            var btn = this.footer.get(0).getControl('Save');
            this.contents.reset();
            var txtName = this.contents.getControl('CODE_DES')
            var txtCode = this.contents.getControl('CODE_NO')
            var dataAutoCode = {
                CODE_CLASS: this.CODE_CLASS
            }
            //Get AutoCode
            ecount.common.api({
                url: "/SelfCustomize/Config/GetAutoInternalUseCode",
                data: Object.toJSON(dataAutoCode),
                success: function (result) {
                    if (result.Status != "200") {
                        btn.setAllowClick();
                        runSuccessFunc = result.Status == "202";
                        ecount.alert(result.fullErrorMsg);
                    }
                    else {
                        if (result.Data.length > 0) {
                            btn.setAllowClick();
                            if (result.Data[0].NEXT_CODE != "" && result.Data[0].NEXT_CODE != undefined) {
                                txtCode.setValue(result.Data[0].NEXT_CODE);
                                txtName.setFocus(0);
                            }
                            else {
                                txtCode.setFocus(0);
                            }
                        }
                    }
                }.bind(this)
            });
        }
        else {
            var param = {
                editFlag: 'M',
                USE_GUBUN: this.USE_GUBUN,
                CODE_NO: this.CODE_NO,
                CODE_DES: this.CODE_DES,
                CODE_CLASS: this.CODE_CLASS,
                CLASS_DES: this.CLASS_DES,
                WDATE: this.WDATE,
                WID: this.WID,
            };

            this.onAllSubmitSelf("/ECERP/ESA/ESA021M", param);
        }
        

    },

    // Reactivate Event
    onButtonUse: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.permission.Value == "W") {
            var thisObj = this;       
            var data = {
                USE_GUBUN: ['Y'].contains(this.USE_GUBUN) ? 'N' : 'Y',
                CODE_NO: this.contents.getControl('CODE_NO').getLabel(),
                CODE_CLASS: this.CODE_CLASS
                
            }
            ecount.common.api({
                url: "/SVC/Account/Basic/UpdateForInternalUseState",
                data: Object.toJSON({
                    Request: {
                        Data : data
                    }
                }),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    }
                    else {
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                        var action = ['Y'].contains(thisObj.USE_GUBUN) ? 'Reactivate' : 'Deactivate'
                        thisObj.sendMessage(thisObj, action);
                    }
                },
                complete: function () {
                         btnDelete.setAllowClick();
                }
            });
        }
        else {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.res, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
   },
    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //Event Delete
    onButtonDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.permission.Value == "W") {
            var thisObj = this;            
            var formdata = {
                CODE_NO: this.contents.getControl('CODE_NO').getLabel(),
                CODE_CLASS: this.CODE_CLASS
            };
            ecount.confirm(ecount.resource.MSG00299, function (status) {
                if (status === true) {
                    ecount.common.api({
                        url: "/SVC/Common/Infra/DeleteForInternalUse",
                        data: Object.toJSON({
                            Request:
                            {
                                Data: formdata
                            }
                        }),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            }
                            else {
                                if (result.Data != "0") {
                                    if (result.Data == "1")
                                        ecount.alert(ecount.resource.MSG00678);                                    
                                    else if (result.Data == "3")
                                        ecount.alert(ecount.resource.MSG02834);
                                    else if (result.Data == "4")
                                        ecount.alert(ecount.resource.MSG02834);
                                    else if (result.Data == "5") //
                                        ecount.alert(ecount.resource.MSG02834);
                                    else if (result.Data == "6") //
                                        ecount.alert(ecount.resource.MSG02834);
                                    else if (result.Data == "7") //
                                        ecount.alert(ecount.resource.MSG02834);
                                    else if (result.Data == "8") //
                                        ecount.alert(ecount.resource.MSG02834);
                                    else if (result.Data == "9") //
                                        ecount.alert(ecount.resource.MSG02834);
                                } else {
                                    

                                    thisObj.setTimeout(function () {
                                        thisObj.close();
                                    }, 0);
                                    thisObj.sendMessage(thisObj, "Delete");
                                    
                                }
                            }
                        },
                        complete: function () {
                            btnDelete.setAllowClick();
                        }
                    });
                }
                else {
                    btnDelete.setAllowClick();
                }
            });
        } else {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.res, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    //Event Close
    onFooterClose: function () {
        this.close();
    },

    //On History Button Click Event
    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 140,
            lastEditTime: this.viewBag.InitDatas.InternalCodeDetail[0].EDIT_DT,
            lastEditId: this.viewBag.InitDatas.InternalCodeDetail[0].EDITOR_ID,
            popupType: false,
            additional: false

        }
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param
        });
    },


    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F8: function (e, target) {
            this.onFooterSave();
    },

    ON_KEY_ENTER: function (e, target) {
        if (target != null) {
            var control = target.control
            var idx = control.getValue();
            if (control.id === "CODE_DES") {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (cl, type) {
        //CheckExistedInternalUse
        var thisObj = this;
        var res = this.resource;
        var btn = this.footer.get(0).getControl('Save');
        // Get controls 
        var txtName = this.contents.getControl('CODE_DES')
        var txtCode = this.contents.getControl('CODE_NO')
        if (type == null || type == undefined)
            type = 1;
        //Conditions processing
        if ((this.editFlag == "I" && this.permission.Value == "U") || this.permission.Value == "W") {
            var vhk = true;
            var formdata = this.contents.serialize().merge();// Implement new feature
            var ctrl = this.contents.getControl("CODE_NO");
            var code = "";
            var codedes = "";
            code = formdata.CODE_NO.trim();
            codedes = formdata.CODE_DES.trim();

            var invalid = this.contents.validate();

            var data = {
                editFlag: this.editFlag,
                // Entity object
                CODE_NO: ['M'].contains(this.editFlag) ? txtCode.getLabel().trim() : txtCode.getValue().trim(),
                CODE_DES: txtName.getValue().trim(),
                CODE_CLASS: this.CODE_CLASS,
                USE_GUBUN: ['I'].contains(this.editFlag) ? "Y" : this.USE_GUBUN

            }

            var g = this.fnValidCheck();
            //Existed Item Code
            if (cl == "1") {
                ctrl.showError(ecount.resource.MSG00676);
                ctrl.setFocus(0);
            }
            else if (cl == "2") {
                ctrl.showError(ecount.resource.MSG00675);
                ctrl.setFocus(0);
            }
            if (cl == "0" && g == true) {
                //Welldone
            }
            else {
                btn.setAllowClick();
                return false;
            }

            var dataAutoCode = {
                CODE_CLASS: this.CODE_CLASS
            }

            ecount.common.api({
                url: ['I'].contains(this.editFlag) ? "/SVC/Common/Infra/InsertInternalUse" : "/SVC/Account/Basic/UpdateInternalUse",
                data: Object.toJSON({
                    Request: {
                        Data : data
                    }
                }),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        var arrData = result.Data.split(ecount.delimiter);
                        if (arrData[0] == "1") {
                            btn.setAllowClick();
                            ctrl.showError(ecount.resource.MSG00676);
                            ctrl.setFocus(0);
                        }
                        else if (arrData[0] == "2") {
                            btn.setAllowClick();
                            ctrl.showError(ecount.resource.MSG00675);
                            ctrl.setFocus(0);
                        }
                        else {

                            thisObj.sendMessage(thisObj, "Save");
                            // If [Save & New] button is clicked, then clear some inputs' values and keep the popup is still opened
                            if (type == '1') {
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                            else {
                                var param = {
                                    editFlag: type == '2' ? 'I' : 'M',
                                    USE_GUBUN: ['I'].contains(thisObj.editFlag) ? "Y" : thisObj.USE_GUBUN,
                                    CODE_NO: code,
                                    CODE_DES: codedes,
                                    CODE_CLASS: thisObj.CODE_CLASS,
                                    CLASS_DES: thisObj.CLASS_DES,
                                    WDATE: arrData[1],
                                    WID: arrData[2],
                                };

                                thisObj.onAllSubmitSelf("/ECERP/ESA/ESA021M", param);
                            }
                        }
                    }
                }
            });
        }
        else {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.res, PermissionMode: this.editFlag == "I" ? "W": "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    fnValidCheckSpace: function (strThis, strMsgFlag) {
        var index = "";
        index = strThis.indexOf(' ')
        if (index > 0) {
            return false;
        }
    },
    //Handle to callback the fnSave
    fnCallbackDuplicateCheck: function (callback, a) {
        if ((this.permission.CW == true && this.editFlag == "I") || this.permission.CD == true) {
            // Get controls 
            var txtName = this.contents.getControl('CODE_DES')
            var txtCode = this.contents.getControl('CODE_NO')
            var formdata = this.contents.serialize().merge();// Implement new feature
            var cd = txtCode.getValue().trim();
            var data = {
                editFlag: this.editFlag,
                CODE_NO: txtCode.getValue().trim(),
                CODE_DES: txtName.getValue().trim(),
                CODE_CLASS: this.CODE_CLASS,
                USE_GUBUN: ['I'].contains(this.editFlag) ? "Y" : this.USE_GUBUN
            }
            if (['I'].contains(this.editFlag)) {
                if (cd != "" && (ecount.common.ValidCheckSpecialForCodeType(cd).result)) {
                    //If user entried data, call to API to check the item existed or not
                    ecount.common.api({
                        url: "/Common/Infra/CheckExistedInternalUse",
                        data: Object.toJSON(data),
                        success: function (result) {
                            if (result.Status != "200") {
                                this.footer.get(0).getControl('Save').setAllowClick();
                                alert(result.fullErrorMsg);
                            } else {
                                callback(result.Data, a);
                            }
                        }.bind(this),
                        complete: function () {
                        },
                    });
                } else {
                    callback("0", a);
                }
            }
            else
                callback("0", a);
        }
        else {
            this.footer.get(0).getControl('Save').setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.res, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },
    //Valid Input Condition
    fnValidCheck: function () {
        var s = true;
        var ctrl = this.contents.getControl("CODE_NO");
        code = ctrl.getValue().trim();
        //Check whether any input field unvalid or not
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            s = false;
            invalid.result[0][0].control.setFocus(0);
        }

        vhk = this.fnValidCheckSpace(code, true)

        if (vhk == false) {
            s = false;
            ctrl.showError(String.format(ecount.resource.MSG02054, this.codeHeader));
            ctrl.setFocus(0);
        }
        return s;
    },
});