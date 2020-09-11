window.__define_resource && __define_resource("LBL06434","LBL09999","LBL02424","LBL14713","MSG01691","MSG00530","LBL14714","MSG01693","MSG05466","MSG01136","LBL01743","MSG05467","BTN00067","BTN00765","BTN00065","BTN00007","BTN00008","BTN00959","BTN00204","BTN00203","BTN00033","LBL93303","MSG00748","MSG00299","MSG02237","LBL07157","MSG01694","MSG01692","MSG08770");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : NGUYEN TRAN QUOC BAO
3. Description : INV.I > SETUP > AFTER SALES SERVICE CODE
4. Precaution  :
5. History     :2015.05.25: Edit template js
                2015.09.15(LE DAN): - Code refactoring
                [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA601M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: null,

    whLoad: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    initProperties: function () {
        this.userPermit = this.viewBag.Permission.permit.Value;
        this.whLoad = this.viewBag.InitDatas.WhLoad;
        if (["I"].contains(this.editFlag)) {
            this.resizeLayer(ecount.infra.getPageWidthFromConfig(true), 185);
        } else {
            if (this.whLoad.CD_COMMON == 'N') {
                this.resizeLayer(ecount.infra.getPageWidthFromConfig(true), 205);
            }
            else {
                this.resizeLayer(ecount.infra.getPageWidthFromConfig(true), 185);
            }
        }

    },


    onInitHeader: function (header) {
        header.setTitle(String.format(this.editFlag == 'M' ? ecount.resource.LBL06434 : ecount.resource.LBL09999, ecount.resource.LBL02424)).notUsedBookmark();
    },

    onInitContents: function (contents) {
        var thisObj = this;
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form();

        form.template("register")
            .add(['I'].contains(this.editFlag) ?
                ctrl.define("widget.input.codeType", "CD_CODE", "CD_CODE", ecount.resource.LBL14713)
                                .dataRules(["required"], ecount.resource.MSG01691)
                                .filter("maxlength", { message: String.format(ecount.resource.MSG00530, "3", "3"), max: 3 })
                                .popover(ecount.resource.MSG00530)
                                .value(this.whLoad[0].NEXT_CODE).end()
                : ctrl.define("widget.label", "CD_CODE", "CD_CODE", ecount.resource.LBL14713).popover(ecount.resource.MSG00530).label(this.whLoad.CD_CODE).end())
            .add(ctrl.define("widget.input.codeName", "NM_CODE", "NM_CODE", ecount.resource.LBL14714)
                    .dataRules(["required"], ecount.resource.MSG01693)
                    .popover(ecount.resource.MSG05466)
                    .filter("maxlength", { message: String.format(ecount.resource.MSG01136, "50", "50"), max: 50 })
                    .value(this.whLoad.NM_CODE).end());
        
        if (this.editFlag == 'M') {
            if (this.whLoad.CD_COMMON == 'N') {
                var list = thisObj.viewBag.InitDatas.GetAfterSalesServiceCode;
                var optionList = [];
                var selectedItem = "";

                for (var i = 0, len = list.length; i < len; i++) {
                    var data = list[i];
                    var jj = 0;
                    var j = 1;

                    for (var i = 0; i < list.length; i++) {
                        if (['000', '999'].contains(list[i].CD_CODE))
                            jj++;
                        else {
                            if ((i + 1 - jj).toString() == this.whLoad.NO_CODE)
                                selectedItem = (i + 1 - jj).toString();
                            j++;
                        }
                    }

                    for (var i = 1; i < j; i++) {
                        optionList.push([i, i]);
                    }
                }

                form.add(ctrl.define("widget.select", "NO_CODE", "NO_CODE", ecount.resource.LBL01743)
                            .popover(ecount.resource.MSG05467)
                            .option(optionList).select(selectedItem).end());
            }
        };

        contents.add(form);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             addgroup = [],
            ctrl = widget.generator.control();
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
        if (this.editFlag == 'I') {
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }
        else {
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
            if (['000', '999'].contains(this.whLoad.CD_CODE)) {
                toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
                toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
            }

            else {
                toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                   .css("btn btn-default")
                                                                   .addGroup(
                                                                    [
                                                                       {
                                                                           id: 'use',
                                                                           label: this.whLoad.CD_USE == "Y" ? ecount.resource.BTN00204 : ecount.resource.BTN00203               //Resource : 재사용, 사용중단
                                                                       },
                                                                       { id: 'delete', label: ecount.resource.BTN00033 }
                    ])
                    .noActionBtn().setButtonArrowDirection("up"));  // Delete
                toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
                toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
            }

        }

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    onLoadComplete: function () {
        if (["I"].contains(this.editFlag)) {
            if (this.contents.getControl("CD_CODE").getValue() == '')
                this.contents.getControl("CD_CODE").setFocus(0);
            else
                this.contents.getControl("NM_CODE").setFocus(0);
            //this.resizeLayer(ecount.infra.getPageWidthFromConfig(1), 165);
        }
        else {
            this.contents.getControl("NM_CODE").setFocus(0);
            //this.resizeLayer(ecount.infra.getPageWidthFromConfig(1), 185);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onFooterReset: function (e) {
        
        var cdCode = this.CD_CODE
        var thisObj = this;
        if (cdCode == null && cdCode == undefined) {
            this.contents.reset();
            thisObj.contents.getControl('CD_CODE').setValue('');
            thisObj.contents.getControl('NM_CODE').setValue('');

            //Call API to get the Auto Code
            var formData = JSON.stringify({ CODE_CLASS: 'L01' });
            ecount.common.api({
                url: "/SelfCustomize/Config/GetAutoForeignCurrency",
                data: formData,
                success: function (result) {
                    if (result.Data[0].NEXT_CODE != '') {
                        thisObj.contents.getControl("CD_CODE").setValue(result.Data[0].NEXT_CODE);
                        thisObj.contents.getControl("NM_CODE").setFocus(0);
                    }
                    else
                        thisObj.contents.getControl("CD_CODE").setFocus(0);
                }.bind(thisObj)
            });
           
        }
        else {
            var param = {
                CD_CODE: cdCode,
                editFlag: 'M',
            };
            this.onAllSubmitSelf("/ECERP/ESA/ESA601M", param);
        }

    },

    onFooterClose: function (e) {
        this.close();
    },

    onButtonSaveNew: function (e) {
        this.onFooterSave(null, 2);
    },
    onButtonSaveReview: function (e) {
        this.onFooterSave(null, 3);
    },
    onFooterSave: function (e, type) {
        var btn = this.footer.get(0).getControl("Save");

        if (type == null || type == undefined)
            type = 1;

        if (this.userPermit == "R" || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93303, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var thisObj = this;
        var errList = [];

        var formdata = this.contents.serialize().merge();
        var s_CD_CODE = formdata.CD_CODE;
        var s_NM_CODE = formdata.NM_CODE;

        /*Validate control*/
        var invalid = this.contents.validate();
        if (invalid.result.length > 0)
            errList.push(invalid.result[0][0].control.id);

        if (this.editFlag == 'I') {
            this.checkCode(s_CD_CODE, saveData.bind(this));
        } else {
            saveData.call(this, false, '');
        }

        //Insert & Update data
        function saveData(isError, errMess) {
            if (isError) {
                errList.push('CD_CODE');
                this.contents.getControl('CD_CODE').showError(errMess);
            }

            if (errList.length > 0) {
                var sErr = 'ㆍ' + errList.join('ㆍ') + 'ㆍ';

                if (sErr.indexOf('ㆍCD_CODEㆍ') > -1)
                    this.contents.getControl('CD_CODE').setFocus(0);
                else if (sErr.indexOf('ㆍNM_CODEㆍ') > -1)
                    this.contents.getControl('NM_CODE').setFocus(0);

                btn.setAllowClick();
                return false;
            }
            
            formdata.CD_TYPE = "A";

            if (thisObj.editFlag == 'M') {
                formdata.CD_USE = "";
                formdata.NO_CODE = thisObj.whLoad.CD_COMMON == 'N' ? thisObj.contents.getControl('NO_CODE').getValue() : 0;

                ecount.common.api({
                    url: "/Inventory/Basic/UpdateAfterSalesService",
                    data: Object.toJSON(formdata),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else {
                            thisObj.sendMessage(thisObj, {});
                  
                            if (type == 1) {
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                            else {
                                var param = {
                                    editFlag: type == 2 ? 'I' : 'M',
                                    CD_CODE: formdata.CD_CODE,
                                    //NO_CODE: formdata.NO_CODE
                                };
                                thisObj.onAllSubmitSelf("/ECERP/ESA/ESA601M", param, "details");
                            }
                        }
                    },
                    complete: function () {
                        btn.setAllowClick();
                    }
                });
            } else {
                var objCDCODE = this.contents.getControl("CD_CODE");

                ecount.common.api({
                    url: "/Inventory/Basic/InsertAfterSalesService",
                    data: Object.toJSON(formdata),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data == 1) {
                                objCDCODE.showError(ecount.resource.MSG00748);
                                objCDCODE.setFocus(0);
                                return false;
                            } else {
                                thisObj.sendMessage(thisObj, { type: type });
                                if (type == 1) {
                                    thisObj.setTimeout(function () {
                                        thisObj.close();
                                    }, 0);
                                }
                                else {
                                    var param = {
                                        editFlag: type == 2 ? 'I' : 'M',
                                        CD_CODE: formdata.CD_CODE,
                                        //NO_CODE: formdata.NO_CODE
                                    };
                                    thisObj.onAllSubmitSelf("/ECERP/ESA/ESA601M", param, "details");
                                }
                            }
                        }
                    },
                    complete: function () {
                        btn.setAllowClick();
                    }
                });
            }
        }
    },

    onButtonUse: function (e) {
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93303, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return;
        }

        var formdata = this.contents.serialize().merge();
        formdata.CD_TYPE = "A";
        formdata.CD_USE = this.whLoad.CD_USE == "Y" ? "N" : "Y";
        formdata.NO_CODE = 0;

        var thisObj = this;
        var data = {
            CD_CODE: formdata.CD_CODE,
            CD_TYPE: formdata.CD_TYPE,
            CD_USE: formdata.CD_USE,
            NM_CODE: formdata.NM_CODE,
            NO_CODE: formdata.NO_CODE
        };

        ecount.common.api({
            url: "/Inventory/Basic/UpdateAfterSalesService",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    thisObj.sendMessage(thisObj, {});
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                btn.setAllowClick();
            }
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonDelete: function (e) {
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93303, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var thisObj = this;
        var data = {
            CD_CODE: thisObj.contents.getControl('CD_CODE').getLabel(),
            CD_TYPE: "A"
        }

        var objCDCODE = thisObj.contents.getControl("CD_CODE");

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeleteAfterSalesService",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data == 1) {
                                thisObj.contents.getControl("CD_CODE").setFocus(0);
                                ecount.alert(ecount.resource.MSG02237);
                                return false;
                            }
                            else {
                                thisObj.sendMessage(thisObj, {});
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                        }
                    },
                    complete: function () {
                        btn.setAllowClick();
                    }
                });
            }
            else
                btn.setAllowClick();
        });
    },

    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.whLoad.WDATE,
            lastEditId: this.whLoad.WID
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
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

            if (["I"].contains(this.editFlag)) {
                if (control.id === "NM_CODE")
                    this.footer.getControl('Save').setFocus(0);
            }
            else {
                if (['N'].contains(this.whLoad.CD_COMMON)) {
                    if (control.id === "NM_CODE")
                        this.contents.getControl('NO_CODE').setFocus(0);
                    else if (control.id === "NO_CODE")
                        this.footer.getControl('Save').setFocus(0);
                }
                else {
                    if (control.id === "NM_CODE")
                        this.contents.getControl('NO_CODE').setFocus(0);
                }
            }
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //Check valid code
    checkCode: function (sCode, callback) {
        if (sCode == '')
            callback(false, '');
        else if (sCode == 'ALL')
            callback(true, ecount.resource.MSG01694);
        else if (sCode.length > 3)
            callback(true, ecount.resource.MSG01692);
        else {
            var checkSpecial = sCode.isContainsLimitedSpecial('code');
            if (checkSpecial.result == true)
                callback(true, checkSpecial.message);
            else {
                ecount.common.api({
                    url: "/Inventory/Basic/CheckExistedAfterSalesService",
                    data: Object.toJSON({ CD_TYPE: 'A', CD_CODE: sCode }),
                    success: function (result) {
                        if (result.Status != '200')
                            callback(true, result.fullErrorMsg);
                        else if (result.Data && result.Data.USED == 'Y')
                            callback(true, String.format(ecount.resource.MSG08770, ecount.resource.LBL02424));
                        else
                            callback(false, '');
                    }
                });
            }
        }
    }
});
