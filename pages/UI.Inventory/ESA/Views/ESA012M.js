window.__define_resource && __define_resource("LBL09999","LBL00612","LBL06434","LBL01457","LBL07438","MSG00150","MSG00465","MSG03016","BTN00541","LBL07447","MSG00131","MSG03015","BTN00067","BTN00765","BTN00065","BTN00007","BTN00959","BTN00204","BTN00203","BTN00033","BTN00008","MSG00229","LBL30025","LBL03178","LBL05117","LBL93295","MSG00676","MSG00299","LBL07157","MSG00048","MSG08770","MSG00675","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Mgmt.Field
4. Precaution  :
5. History     :
                [2016.02.01] 이은규: 헤더에 옵션 > 사용방법설정 추가
                 2016-03-21 안정환 소스 리팩토링 적용
                 2018-06-29 상세 화면에서 삭제시 삭제 공통 적용
                 2018.12.27 (HoangLinh): Remove $el
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA012M"/** page ID */, {
    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,        

    /********************************************************************** 
    * page user opion Variables(User variables and Object) 
    **********************************************************************/

    autoCode: null,
    permission: null,

    // 사용방법설정 팝업창 높이					
    selfCustomizingHeight: 0,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        var infoData = this.viewBag.InitDatas;
        this.permission = this.viewBag.Permission.permitESA012M;        
        this.autoCode = infoData.autoCodeYn[0];
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    onInitHeader: function (header) {
        var res = ecount.resource;
        header.setTitle(this.editFlag == "I" ? String.format(res.LBL09999, res.LBL00612) : String.format(res.LBL06434, res.LBL00612))
              .notUsedBookmark()
              .add("option", [
                    { id: "SelfCustomizing", label: ecount.resource.LBL01457 },
              ]);;
    },


    onInitContents: function (contents) {
        var defaultTitle = ecount.config.inventory.ITEM_TIT + ' ',
            g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            form1 = g.form(),
            res = ecount.resource;


        form1.template("register");

        if (['I'].contains(this.editFlag)) {
            form1.add(ctrl.define("widget.input.codeType", "CODE", "CODE", String.format(res.LBL07438, defaultTitle))
                .dataRules(["required"], res.MSG00150)
                .filter("maxbyte", { message: String.format(res.MSG00465, "7", "14"), max: 14 })
                .popover(res.MSG03016).value("")
                .hasFn([{ id: "newcode", label: res.BTN00541 }]).end());
        }
        else {
            form1.add(ctrl.define("widget.label", "CODE", "CODE", String.format(res.LBL07438, defaultTitle))
                .label(this.codeNo)
                .popover(res.MSG03016)
                .end());
        }

        form1.add(ctrl.define("widget.input.codeName", "NAME", "NAME", String.format(res.LBL07447, defaultTitle)).value(this.editFlag == "I" ? "" : this.codeName)
            .filter("maxbyte", { message: String.format(res.MSG00465, "30", "60"), max: 60 })
            .dataRules(["required"], res.MSG00131)
            .popover(res.MSG03015).end());

        contents
            .add(form1);
    },

    onInitFooter: function (footer) {
        var permit = this.viewBag.Permission.permitESA012M,
            g = widget.generator,
            ctrl = g.control(),
            toolbar = g.toolbar(),
            addgroup = [],
            res = ecount.resource;
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
        toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup))
        toolbar.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));

        if (['M'].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(res.BTN00959)
                                                                        .css("btn btn-default")
                                                                        .addGroup(
                                                                         [
                                                                            {
                                                                                id: 'use',
                                                                                label: (['Y'].contains(this.useYn) ? res.BTN00204 : res.BTN00203)                //Resource : 재사용, 사용중단
                                                                            },
                                                                            { id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));  // Delete
        }

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));

        if (['M'].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        }

        footer.add(toolbar);
    },


    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    onLoadComplete: function () {
        
        if (this.editFlag == 'I') {
            if (this.autoCode.USE_AUTOMAKE) {
                this.contents.getControl('CODE').setValue(this.viewBag.InitDatas.autoCodeItems);
                if (this.viewBag.InitDatas.autoCodeItems.trim() == "")
                    this.contents.getControl("CODE").setFocus(0);
                else
                    this.contents.getControl("NAME").setFocus(0);
            }
            else {
                this.contents.getControl("CODE").setFocus(0);
            }
        }
        else
            this.contents.getControl("NAME").setFocus(0);

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 1061
    },

    onMessageHandler: function (page, message) {
        if (page.pageID == 'CM102P') {
            this.contents.getControl('CODE').setValue(message.data[0].AutoCode);
            message.callback && message.callback();
        };
        this.contents.getControl("CODE").onNextFocus();
    },

    /**************************************************************************************************** 
     * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
     * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
     ****************************************************************************************************/

    onFooterSave: function (e) {
        this.fnSave(e, 1)
    },

    // [Save & New] button clicked event
    onButtonSaveNew: function (e) {
        this.fnSave(e, 2)
    },

    // [Save/Review] button clicked event
    onButtonSaveReview: function (e) {
        this.fnSave(e, 3)
    },
   
    // Function new code
    onFunctionNewcode: function () {
        var param = {},
            res = ecount.resource;

        if (!this.autoCode.USE_AUTOMAKE) {
            this.setTimeout(function () {
                ecount.alert(String.format(res.MSG00229, res.LBL00612, res.LBL30025, String.format(res.LBL03178, res.LBL00612)));
            });
            return false;
        }
        else {
            param = {
                popupType: true,
                autoNumberSettings: encodeURIComponent(Object.toJSON([{ CODE_TYPE: "15" }])),                
                programID: this.viewBag.DefaultOption.PROGRAM_ID
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/CM102P',
                name: res.LBL05117,
                param: param,
                popupType: false
            })
        }
    },

    onFooterClose: function () {
        this.close();
    },


    onButtonUse: function (e) {
        var res = ecount.resource,
            btn = this.footer.get(0).getControl("deleteRestore"),
            data = {},
            thisObj = this,
            formdata = this.contents.serialize().merge();

        if (this.permission.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        
        data = {
            useYn: ['Y'].contains(this.useYn) ? 'N' : 'Y',
            CODE_NO: formdata.CODE,
        };

        ecount.common.api({
            url: "/Inventory/Basic/UpdateState",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                }
                else {
                    if (result.Data == "1") {
                        ecount.alert(res.MSG00676);
                    }
                    else {
                        thisObj.sendMessage(thisObj, { messageType: ['Y'].contains(this.useYn) ? 'Deactivate' : 'Reactivate' });                        
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
        var res = ecount.resource,
            btn = this.footer.get(0).getControl("deleteRestore"),
            thisObj = this,
            formdata = this.contents.serialize().merge(),
            ctrl_Code = this.contents.getControl("CODE"),
        //    data = {},    
            authMessage = {};

        if (this.permission.Value != "W") {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: "U" }]);
            ecount.alert(authMessage.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        
        //data = {
        //    CODE_NO: formdata.CODE,
        //    SALE009_FLAG: 'Y'
        //};        
        var data = [];
        data.push(this.contents.getControl('CODE').getLabel());

        var formdata = {
            DeleteCodes: {
                MENU_CODE: "MgmtFieldCode",      //MENU_CODE (ENUM_BASIC_CODE_TYPE) : 관리항목
                CHECK_TYPE: "S",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                PARAMS: data
            }
        };
        
        ecount.confirm(res.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeleteSale009",
                    data: Object.toJSON(formdata),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else if (result.Data != null && result.Data != "") {                            
                            thisObj.ShowNoticeNonDeletable(result.Data);                            
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
            } else {
                btn.setAllowClick();
            }
        });
    },

    // Reset button clicked event
    onFooterReset: function (e) {
        var thisObj = this,
            formData = {},
            txtCode = this.contents.getControl('CODE'),
            txtName = this.contents.getControl('NAME');
        var cdNo = thisObj.save_CodeNo != null ?  thisObj.save_CodeNo : thisObj.codeNo
        if (cdNo == null || cdNo == undefined) {
            this.contents.reset();
            txtCode.setEmpty();

            // Get new code
            if (this.autoCode.USE_AUTOMAKE) {
                formData = {
                    IsView: true,
                    CodeType: 15,
                    IoDate: this.viewBag.LocalTime,
                    AutoCodeEditType: "I",
                    UpLoadYn: "N"
                };

                ecount.common.api({
                    url: "/SelfCustomize/Config/GetAutoCodeRepeatCdForViewWithList",
                    data: Object.toJSON(formData),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            txtCode.setValue(result.Data);

                            if (result.Data.trim() == "")
                                txtCode.setFocus(0);
                            else
                                txtName.setFocus(0);
                        }
                    }.bind(this)
                });
            } else {
                thisObj.setTimeout(function () { txtCode.setFocus(0); }.bind(this), 0);
            }
        } else {
            var param = {
                useYn:  thisObj.useYn,
                editFlag:'M',
                codeNo: cdNo,
                codeName: thisObj.codeName,
                modify_dt: thisObj.modify_dt,
                MODIFY_ID: thisObj.MODIFY_ID,
            };
            this.onAllSubmitSelf("/ECERP/ESA/ESA012M", param);
        }
        
    },

    onPopupHandler: function (control, config, handler) {
        if (control.id == "newcode") {            
            config.popupType = true;            
        }

        handler(config);
    },


    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.modify_dt,
            lastEditId: this.MODIFY_ID,
            popupType: true,
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false
        })
    },

    // 사용방법설정 Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
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
            if (target.control.id === "NAME" && this.footer.getControl('Save') != undefined) {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    fnSave: function (e, type) {
        var res = ecount.resource,
            btn = this.footer.get(0).getControl("Save"),
            thisObj = this,
            ctrl_Code = this.contents.getControl("CODE"),
            ctrl_Name = this.contents.getControl("NAME"),
            code, name,
            formdata = this.contents.serialize().merge(),
            authMessage = {},
            isValid = true,
            invalid = this.contents.validate();

        if (this.permission.Value == "R" || (this.permission.Value == "U" && this.editFlag == "M")) {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(authMessage.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        if (type == null || type == undefined)
            type = 1;
        code = formdata.CODE.trim();
        name = formdata.NAME.trim();        

        data = {
            EditFlag: this.editFlag,
            CODE_NO: code,
            CODE_DES: name,
            USE_GUBUN: ['I'].contains(this.editFlag) ? "Y" : this.useYn,
            FLAG: this.editFlag
        }

        if (invalid.result.length > 0) {
            btn.setAllowClick();
            invalid.result[0][0].control.setFocus(0);
            isValid = false;
        }

        //If user entried data, call to API to check the item existed or not
        if (this.editFlag == "I") {
            if (code != "") {
                if (code == "00") {
                    ctrl_Code.showError(res.MSG00048);
                    ctrl_Code.setFocus(0);
                    isValid = false;
                } else if (!ctrl_Code.getValue().isContainsLimitedSpecial('code').result) {
                    this.fnCheckExistedMgmtFieldCode(isValid, type, data);
                }                
            }            
        } else if (isValid) {
            this.fnInsertOrUpdateMgmtField(type, data);
        }

        if (!isValid) {
            btn.setAllowClick();
        }
    },

    // Check existed code
    fnCheckExistedMgmtFieldCode: function (isValid, type, data) {
        var res = ecount.resource,
            thisObj = this,
            ctrl_Code = this.contents.getControl("CODE"),
            ctrl_Name = this.contents.getControl("NAME"),
            btn = this.footer.get(0).getControl("Save");

        ecount.common.api({
            url: "/Inventory/Basic/CheckExistedSale009",
            data: Object.toJSON({ CODE_NO: data.CODE_NO }),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    if (result.Data == "1") {
                        ctrl_Code.showError(String.format(res.MSG08770, res.LBL00612));
                        ctrl_Code.setFocus(0);
                        btn.setAllowClick();
                    }
                    else if (result.Data == "2") {
                        ctrl_Code.showError(res.MSG00675);
                        ctrl_Code.setFocus(0);
                        btn.setAllowClick();
                    } else {
                        if (isValid) {
                            thisObj.fnInsertOrUpdateMgmtField(type, data);
                        }                        
                    }
                }
            }
        });
    },

    // Insert or update Mgmt Field
    fnInsertOrUpdateMgmtField: function (type, data) {
        var res = ecount.resource,
            thisObj = this,
            btn = this.footer.get(0).getControl("Save"),
            ctrl_Code = this.contents.getControl("CODE"),
            ctrl_Name = this.contents.getControl("NAME"),
            formData = {};

        ecount.common.api({
            url: "/Inventory/Basic/SaveSale009",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    var arrData = result.Data.split(ecount.delimiter);
                    if (arrData[0] == "1") {
                        ctrl_Code.showError(res.MSG00676);
                        ctrl_Code.setFocus(0);
                    }
                    else if (arrData[0] == "2") {
                        ctrl_Code.showError(res.MSG00675);
                        ctrl_Code.setFocus(0);
                    }
                    else {
                        var params = {
                            sStatus: "Save",
                            CODE: thisObj.contents.getControl("CODE").getValue(),
                            NAME: thisObj.contents.getControl("NAME").getValue()
                        };
                        thisObj.sendMessage(thisObj, params);
                        if (type == 1) {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                        else {
                            var param = {
                                useYn: ['I'].contains(thisObj.editFlag) ? "Y" : thisObj.useYn,
                                codeName: data.CODE_DES,
                                modify_dt: arrData[1],
                                MODIFY_ID: arrData[2],
                                editFlag: type == 2 ? 'I' : 'M'
                            };
                            if (type == 2) {
                                param.save_CodeNo = data.CODE_NO; 
                            }
                            else {
                                param.codeNo = data.CODE_NO;
                            }
                            thisObj.onAllSubmitSelf("/ECERP/ESA/ESA012M", param);
                        }
                    }
                }
            },
            complete: function () {
                btn.setAllowClick();
            }
        });
    },

    //삭제불가 메세지 팝업창
    ShowNoticeNonDeletable: function (data) {

        var msg = data[0].ERR_MSG;
        if (data[0].ERR_MSG != null) {
            ecount.alert(msg);
        } else {
            var param = {
                width: 500,
                height: 300,
                datas: Object.toJSON(data),
                parentPageID: this.pageID,
                responseID: this.callbackID,
                MENU_CODE: "LocationCode"
            }

            this.openWindow({
                url: "/ECERP/Popup.Common/NoticeNonDeletable",
                name: ecount.resource.LBL11065,
                popupType: false,
                additional: false,
                param: param
            });
        }
    }
});