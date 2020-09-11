window.__define_resource && __define_resource("LBL09999","LBL10029","LBL06434","LBL06426","MSG03031","MSG00297","LBL06425","MSG03030","BTN00067","BTN00765","BTN00065","BTN00007","BTN00959","BTN00204","BTN00203","BTN00033","BTN00008","LBL06423","MSG00676","MSG00299","MSG00678","LBL07157","MSG08770","MSG00675");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA014M"/** page ID */, {
    header: null,
    contents: null,
    footer: null,
    off_key_esc: true,
    permit: null,
    /**************************************************************************************************** 
     * user option Variables(사용자변수 및 객체) 
     ****************************************************************************************************/
    autoCode: null,
    /********************************************************************** 
    * page init   Class inheritance , init, render etc
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.permit = this.viewBag.Permission.permitESA014M;
    },
    render: function () {
        this._super.render.apply(this);
    },
    /********************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle(this.editFlag == "I" ? String.format(ecount.resource.LBL09999, ecount.resource.LBL10029) : String.format(ecount.resource.LBL06434, ecount.resource.LBL10029))
        .notUsedBookmark();
    },
    onInitContents: function (contents, resource) {
        this.autoCode = this.viewBag.InitDatas.autoCodeItems[0].NEXT_CODE;
        var g = widget.generator,
         toolbar = g.toolbar(),
         ctrl = g.control(),
         form1 = g.form();

        form1.template("register");

        if (['I'].contains(this.editFlag)) {
            form1.add(ctrl.define("widget.input.codeType", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL06426).popover(ecount.resource.MSG03031)
                .dataRules(["required"], this.viewBag.Resource.MSG03031)
                .value("")
                .filter("maxbyte", { message: String.format(ecount.resource.MSG00297, "15", "30"), max: 30 })
                .end());
        }
        else {
            form1.add(ctrl.define("widget.label", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL06426)
                .label(this.codeClass)
                .popover(ecount.resource.MSG03031)
                .end());
        }

        form1.add(ctrl.define("widget.input.codeName", "CLASS_DES", "CLASS_DES", ecount.resource.LBL06425)
            .value(['I'].contains(this.editFlag) ? "" : this.classDes)
            .popover(ecount.resource.MSG03030)
            .dataRules(["required"], this.viewBag.Resource.MSG03030)
            .filter("maxbyte", { message: String.format(ecount.resource.MSG00297, "20", "40"), max: 40 })
            .end());

        contents
            .add(form1);
    },
    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var toolbar = g.toolbar();
        var addgroup = [];
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });

        toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
        if (['M'].contains(this.editFlag)) {
            // if (!(permit.Value == "R" || permit.Value == "U")) {

            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959).css("btn btn-default").addGroup([
                { id: "Deactivate", label: ['N'].contains(this.cancel) ? ecount.resource.BTN00204 : resource.BTN00203 },
                { id: 'delete', label: ecount.resource.BTN00033 },
            ])
                .noActionBtn().setButtonArrowDirection("up"))

        }
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        if (['M'].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        }
        footer.add(toolbar);
    },
    onLoadComplete: function () {
        var vl = this.contents.getControl("CLASS_DES").getValue();
        if (this.editFlag == "I") {
            this.contents.getControl("CODE_CLASS").setValue(this.autoCode);
            if (this.autoCode != '' && this.autoCode != undefined && this.autoCode != null)
                this.contents.getControl("CLASS_DES").setFocus(0);
            else
                this.contents.getControl("CODE_CLASS").setFocus(0);
        }
        else
            this.contents.getControl("CLASS_DES").setFocus(0);
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onFooterSave: function (e) {
        this.fnSave(e, 1)
    },
    //Save New
    onButtonSaveNew: function (e) {
        this.fnSave(e, 2)
    },

    // [Save/Review] button clicked event
    onButtonSaveReview: function (e) {
        this.fnSave(e, 3)
    },
    onFooterClose: function () {
        this.close();
    },
    onButtonDeactivate: function () {
        this.onFooterDeactivate();
    },
    onFooterDeactivate: function () {
        //var btn = this.footer.get(0).getControl("Deactivate");
        var btn = this.footer.get(0).getControl("deleteRestore");
        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06423, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        var thisObj = this;
        var formdata = this.contents.serialize().merge();//new feature
        var data = {
            Request: {
                CANCEL: ['N'].contains(this.cancel) ? 'Y' : 'N',
                CODE_CLASS: formdata.CODE_CLASS
            }
        };
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateStatePriceLevel",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                }
                else {
                    if (result.Data == "1") {
                        ecount.alert(this.viewBag.Resource.MSG00676);
                    }
                    else {
                        thisObj.sendMessage(thisObj, "Deactivate");
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
    },
    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    onButtonDelete: function (e) {
        var btn = this.footer.get(0).getControl("deleteRestore")
        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06423, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        var thisObj = this;
        var formdata = this.contents.serialize().merge();//new feature
        var formdata = {
            Request: {
                CODE_CLASS: formdata.CODE_CLASS
            }
        };
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeletePriceLevel",
                    data: Object.toJSON(formdata),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data == "1") {
                                ecount.alert(this.viewBag.Resource.MSG00678);
                            }
                            else {
                                thisObj.sendMessage(thisObj, "Delete");
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
            } else {
                btn.setAllowClick();
            }
        });
    },
    //event reset
    onFooterReset: function () {
        if (this.codeClass == null || this.codeClass == undefined) {
            this.contents.reset();
                var formData = JSON.stringify({ CODE_CLASS: 'L04' });
                ecount.common.api({
                    url: "/SelfCustomize/Config/GetAutoForeignCurrency",
                    data: formData,
                    success: function (result) {
                        console.log(result)
                        //this.autoCode = result.Data[0].NEXT_CODE;
                        if (result.Status != "200") {
                            runSuccessFunc = result.Status == "202";
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            runSuccessFunc = true;
                            ctrl_Code.setValue(result.Data[0].NEXT_CODE);
                            ctrl_Name.setValue('')
                            ctrl_Name.setFocus(0);
                        }
                    }
                });
        } else {
            var param = {
                editFlag: "M",
                cancel: this.cancel,
                codeClass: this.codeClass,
                classDes: this.classDes,
                modify_dt: this.modify_dt,
                modify_id: this.modify_id,
            };
            this.onAllSubmitSelf("/ECERP/ESA/ESA014M", param);
        }
       
    },
    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.modify_dt,
            lastEditId: this.modify_id,
            parentPageID: this.pageID,  //(Pop-up when this must be declared part)
            popupType: true,             //(Pop-up when this must be declared part)
            responseID: this.callbackID  //(Pop-up when this must be declared part)
        }
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false
        })
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
            if (control.id === "CLASS_DES" && this.footer.getControl('Save') != undefined) {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    fnSave: function (e, type) {
        var btn = this.footer.get(0).getControl("Save");
        if (this.permit.Value == "R" || (this.permit.Value == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06423, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        if (type == null || type == undefined)
            type = 1;
        var thisObj = this;
        var formdata = this.contents.serialize().merge();//new feature
        var ctrl_Code = this.contents.getControl("CODE_CLASS");
        var ctrl_Name = this.contents.getControl("CLASS_DES");
        var code, name;
        code = formdata.CODE_CLASS.trim();
        name = formdata.CLASS_DES.trim();
        var data = {
            EditFlag: this.editFlag,
            CODE_CLASS: code,
            CLASS_DES: name,
            CANCEL: ['I'].contains(this.editFlag) ? "N" : this.cancel,
            FLAG: this.editFlag
        }

        var param = {
            Request: {
                EditFlag: this.editFlag,
                Data: {
                    CODE_CLASS: code,
                    CLASS_DES: name,
                    CANCEL: ['I'].contains(this.editFlag) ? "N" : this.cancel
                }
            }
        };

        var Flag = "N";
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return false;
        }
        //If user entried data, call to API to check the item existed or not
        if (this.editFlag == "I") {
            if (code != "") {
                ecount.common.api({
                    url: "/Inventory/Basic/CheckExistedPriceLevel",
                    async: false,
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            if (result.Data == "1") {
                                btn.setAllowClick();
                                if (invalid.result.length > 0) {
                                    invalid.result[0][0].control.setFocus(0);
                                }
                                Flag = "Y";
                                ctrl_Code.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL10029));
                                ctrl_Code.setFocus(0);
                                return;

                            }
                            else if (result.Data == "2") {
                                btn.setAllowClick();
                                if (invalid.result.length > 0) {
                                    invalid.result[0][0].control.setFocus(0);
                                }
                                Flag = "Y";
                                ctrl_Code.showError(thisObj.viewBag.Resource.MSG00675);
                                ctrl_Code.setFocus(0);
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

        ecount.common.api({
            url: "/SVC/Inventory/Basic/InsertPriceLevel",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    var arrData = result.Data.split(ecount.delimiter);
                    if (arrData[0] == "1") {
                        ctrl_Code.showError(this.viewBag.Resource.MSG00676);
                        ctrl_Code.setFocus(0);
                    }
                    else if (arrData[0] == "2") {
                        ctrl_Code.showError(this.viewBag.Resource.MSG00675);
                        ctrl_Code.setFocus(0);
                    }
                    else {
                        thisObj.sendMessage(thisObj, "Save");
                        if (type == '1') {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                        else {
                            var param = {
                                cancel: ['I'].contains(thisObj.editFlag) ? "N" : thisObj.cancel,
                                codeClass: code,
                                classDes: name,
                                modify_dt: arrData[1],
                                modify_id: arrData[2],
                            };
                            if (type == '2') {
                                param.editFlag = 'I';

                            }
                            else {
                                param.editFlag = 'M';
                            }
                            thisObj.onAllSubmitSelf("/ECERP/ESA/ESA014M", param);
                        }
                    }
                }
            },
            complete: function () {
                btn.setAllowClick();
            }
        });
    }
})