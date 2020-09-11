window.__define_resource && __define_resource("LBL08833","LBL09999","LBL00078","LBL06434","BTN00067","BTN00765","BTN00065","BTN00007","BTN00008","BTN00959","BTN00204","BTN00203","BTN00033","MSG00150","MSG02054","LBL01486","LBL04590","LBL01490","LBL02881","LBL02279","LBL07157","MSG00299","MSG00678","MSG00291","LBL11065","MSG08770","LBL00338","LBL35400","LBL35399","LBL35398","LBL35397","LBL01484","LBL03529");
/****************************************************************************************************
1. Create Date : 2015.04.15
2. Creator        : Bao
3. Description  : Inv. I > Setup > PIC/Employee > New (PIC/Employee Registration)
4. Precaution   : None
5. History        : 
                        [2015.08.14] PHI.LUONG: + PERMISSION RESOURCE, AUTHORITY MESSAGE, API UPDATE
                        [2015.08.20] PHI.LUONG: + APPLY RESET, HEIGH SIZE, 
                                                + SPECIAL CHATACTERS, 
                                                + BLOCK SUBMIT WHEN ALREADY EXISTS THE SPECIAL CHARACTERS IN CODE FIELD
                                                + TEXT AREA SET EMPTY

                        [2015.08.30] PHI.LUONG: 
                                            + CALLBACK, AJAX SYCHRONIZING ON ITEM CODE EXISTING CHECKING 
                                            + RESOURCE CHANGES, 
                                            + PERMISSION IN API - PRESENTATION
                         2016-03-21 안정환 소스 리팩토링 적용
                         2018-04-06 김우정 : 사원(담당)등록 양식설정
                         2018-09-20 Huu Lan Applied Dev 12442 사원등록 > 추가항목등록에서 명칭 수정 시 반영안되는 문제
                         2018-12-05 (문요한) : 중복코드 체크 보여주기 공통화
                         2019-03-05 (문요한) : 저장로직 3.0 변경
                         2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/

ecount.page.factory("ecount.page.formsetBasic", "ESA016M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체)   0
    ****************************************************************************************************/

    fd: null,

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

    initProperties: function () {
        this.fd = {
            fd1: '',
            fd2: '',
            fd3: '',
            fd4: '',
            fd5: '',
            fd6: ''
        };
        this.WhLoad = this.viewBag.InitDatas.WhLoad;
        this.permit = this.viewBag.Permission.permit;
        this.isUsePopover = true;
        //initcontrol 정보
        this._pageOption = { onInitControl: this.empOnInitControl.bind(this) };
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    onInitHeader: function (header) {
        var options = []

        options.push({ id: "InputSetting", label: ecount.resource.LBL08833 });

        header.setTitle(this.editFlag == 'I' ? String.format(ecount.resource.LBL09999, ecount.resource.LBL00078) : String.format(ecount.resource.LBL06434, ecount.resource.LBL00078))
            .notUsedBookmark()
            .add("option", options, false);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            form1 = g.form(),
            isEditable = ['M'].contains(this.editFlag),
            res = ecount.resource;

        form1.useInputForm()
            .executeValidateIfVisible()
            .setColSize(1)
            .setType("SI950")
            .showLeftAndRightBorder(true)

        contents.add(form1);
    },

    setGridBusinessNo: function (value, rowItem) {
        var option = {};

        if (["M"].contains(this.editFlag)) {
            option.controlType = "widget.label";
            option.data = value;
        }

        return option;
    },

    onInitFooter: function (footer) {
        this.cancelFlag = this.WhLoad.CANCEL;

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup = [],
            res = ecount.resource;


        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
        if (['M'].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
        } else {
            if (this.isAddGroup) {
                toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            }
            else {
                toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
            }
        }

        if (["I"].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(res.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));
        }
        else {
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(res.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(res.BTN00959)
                .css("btn btn-default")
                .addGroup(
                    [
                        {
                            id: 'use',
                            label: (['N'].contains(this.cancelFlag) ? res.BTN00204 : res.BTN00203)                //Resource : 재사용, 사용중단
                        },
                        { id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));  // Delete


            toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA002P_02') {
            this.sendMessage(this, { data: "Revision", callback: this.close.bind(this) });
        }
        else if (page.pageID == 'ES013P') {
            this.contents.getControl("BUSINESS_NO").setValue(message.data);
            page.close();
            this.contents.getControl("BUSINESS_NO").onNextFocus();
        }
        else if (page.pageID == 'ESA002P_01') {
            message.callback && message.callback();
            this.reloadPage();
        }
        else if (page.pageID == 'CM100P_07_CM') {
            message.callback && message.callback();
            this.reloadPage();
        }
        else {
            this.contents.setTitle('cont1', message.title01, false);
            this.contents.setTitle('cont2', message.title02, false);
            this.contents.setTitle('cont3', message.title03, false);
            this.contents.setTitle('cont4', message.title04, false);
            this.contents.setTitle('cont5', message.title05, false);
            this.contents.setTitle('cont6', message.title06, false);
        }
    },

    onFunctionCheck: function () {
        var btn = this.footer.get(0).getControl("Save");
        var ctrl = this.contents.getControl("BUSINESS_NO");
        var s_business_no = ctrl.getValue().trim();

        if (s_business_no == "") {
            ctrl.showError(ecount.resource.MSG00150);
            ctrl.setFocus(0);
            return false;
        }

        if (this.hasWhiteSpace(s_business_no) == true) {
            var msg1 = ecount.resource.MSG02054;
            var msg2 = ecount.resource.LBL01486;
            var strMsg = msg1.replace('{0}', msg2);
            ctrl.showError(strMsg);
            ctrl.setFocus(0);
            return false;
        }

        var checkCharacters = s_business_no.isContainsLimitedSpecial("code");

        if (checkCharacters.result) {
            ctrl.showError(checkCharacters.message);
            ctrl.setFocus(0);
            return false;
        }

        //If user entried data, call to API to check the item existed or not
        ecount.common.api({
            url: "/SVC/Account/Basic/CheckExistedCustCommon",
            data: Object.toJSON({ Data: { BUSINESS_NO: s_business_no } }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    if (result.Data != null) {
                        msg = this.getErrorMessage(result.Data);
                        ctrl.showError(msg);
                        ctrl.setFocus(0);
                    } else {
                        var param = {
                            width: ecount.infra.getPageWidthFromConfig(true),
                            height: 350,
                            keyword: s_business_no,
                            searchType: 'txtbusinessno',
                            isColumSort: true,
                        };

                        this.openWindow({
                            url: '/ECERP/Popup.Search/ES013P',
                            name: ecount.resource.LBL04590,
                            popupType: false,
                            additional: false,
                            param: param
                        })
                        ctrl.setFocus(0);
                    }
                    btn.setAllowClick();
                }

            }.bind(this),
            complete: function () {
            },
        });
    },

    onFunctionCodeRevision: function () {
        if (this.permit.Value == "R" || this.permit.Value == "U") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "U" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }

        var s_business_no = this.contents.getControl('BUSINESS_NO').getLabel();
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 290,
            Code: s_business_no,
            RequestType: 'cust',
            RequestSubType: "7",
        };
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA002P_02',
            name: ecount.resource.LBL02881,
            popupType: false,
            additional: false,
            param: param
        })
    },

    onDropdownInputSetting: function () {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 600,
            FORM_TYPE: "SI950",
            FORM_SEQ: 1,
            IS_USE_POPOVER: false
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_07_CM",
            name: ecount.resource.LBL02279,
            param: param
        })
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

    onFooterClose: function (e) {
        this.close();
    },

    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.WhLoad.WDATE,
            lastEditId: this.WhLoad.WID,
            popupType: true
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: true,
            param: param
        })
    },

    onButtonSaveNew: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 2);
    },

    // SAVE REVIEW button click event
    onButtonSaveReview: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 3);
    },

    onFooterSave: function (e, type) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 1);
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonDelete: function (e) {
        if (this.permit.Value == "R" || this.permit.Value == "U") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: 'U' }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.footer.get(0).getControl("deleteRestore").setAllowClick();
            return false;
        }

        var thisObj = this;
        var data = [];

        data.push(thisObj.contents.getControl('BUSINESS_NO').getLabel());

        var formdata = {
            Data: {
                MENU_CODE: "EmployeePic",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                CHECK_TYPE: "A",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                PARAMS: data                //단일, 선택삭제시 삭제할 거래처코드               
            }
        };


        var objCustName = this.contents.getControl("CUST_NAME");

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/SVC/Account/Basic/DeleteCusEmp",
                    data: Object.toJSON(formdata),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else if (result.Data != null && result.Data != "") {
                            //삭제불가 코드리스트 팝업창 연결
                            thisObj.ShowNoticeNonDeletable(result.Data);

                        } else {
                            if (result.Data == 1) {
                                objCustName.showError(ecount.resource.MSG00678);
                                return false;
                            }
                            else {
                                thisObj.sendMessage(thisObj, "Data is deleted!");
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                        }
                    },
                    complete: function () {
                        thisObj.footer.get(0).getControl("deleteRestore").setAllowClick();
                    }
                });
            }
            thisObj.footer.get(0).getControl("deleteRestore").setAllowClick();
        });
    },

    onButtonUse: function (e) {
        if (this.permit.Value == "R" || (this.permit.Value == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: 'U' }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.footer.get(0).getControl("deleteRestore").setAllowClick();
            return false;
        }

        var thisObj = this;
        var data = {
            Data: {
                Key: {
                    BUSINESS_NO: thisObj.contents.getControl('BUSINESS_NO').getLabel()
                },
                CANCEL: ['N'].contains(this.cancelFlag) ? 'Y' : 'N'

            }
        }
        ecount.common.api({
            url: "/SVC/Account/Basic/UpdateCancelCusEmp",
            data: JSON.stringify(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                }
                else {
                    thisObj.sendMessage(thisObj, "Data is deactive!");
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                thisObj.footer.get(0).getControl("deleteRestore").setAllowClick();
            }
        });
    },

    onFooterReset: function (e) {
        var custNo = this.custNo
        if (custNo == null) {
            this.contents.reset();
            var thisObj = this;
            thisObj.contents.getControl("REMARKS").setValue('');
            thisObj.contents.getControl("BUSINESS_NO").setValue('');
            if (["I"].contains(this.editFlag)) {

                //Call API to get the Auto Code
                var formData = JSON.stringify({ Data: { CODE_CLASS: 'A04' } });
                ecount.common.api({
                    url: "/SVC/SelfCustomize/Config/GetAutoForeignCurrency",
                    data: formData,
                    success: function (result) {

                        //Set data
                        thisObj.contents.getControl("BUSINESS_NO").setValue(result.Data[0].NEXT_CODE);

                        //Set Focus
                        if (result.Data[0].NEXT_CODE == undefined || result.Data[0].NEXT_CODE == null || result.Data[0].NEXT_CODE.trim() == '')
                            thisObj.setTimeout(function () { thisObj.contents.getControl("BUSINESS_NO").setFocus(0); }.bind(thisObj), 0);
                        else
                            thisObj.setTimeout(function () { thisObj.contents.getControl("CUST_NAME").setFocus(0); }.bind(thisObj), 0);
                    }.bind(thisObj)
                });
            }
            else {
                thisObj.setTimeout(function () { this.contents.getControl("CUST_NAME").setFocus(0); }.bind(this), 0);
            }
        }
        else {

            var param = {
                custNo: custNo,
                editFlag: 'M',
            };

            this.onAllSubmitSelf("/ECERP/ESA/ESA016M", param);
        }

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
            if (control.id === "cont6") {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    setReload: function (e) {

    },

    fnSpliterCheckID: function () {
        var strErrFlag = "N";
        var strValue = this.contents.getControl('CUST_NAME').getValue();
        var iCode = 0;
        var iLength = strValue.length;
        var strReturnValue = "";
        for (var i = 0; i < iLength; i++) {
            iCode = strValue.substring(i, i + 1).charCodeAt(0);
            if (iCode == 8748) {
                strErrFlag = "Y";
                break;
            }
        }
        return strErrFlag;
    },

    getColEssentialYn: function (cid) {
        if (this.viewBag.FormInfos.SI950) {
            var items = this.viewBag.FormInfos.SI950.columns;

            return items.any(function (item) {
                return item.title == cid && item.colEssentialYn == "Y";
            });
        }
        return false;
    },

    hasWhiteSpace: function (s) {
        return s.indexOf(' ') >= 0;
    },

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (cl, type) {

        if (type == null || type == undefined)
            type = 1;

        if (this.permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: ['M'].contains(this.editFlag) ? 'U' : 'W' }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }
        var formdata = this.contents.serialize().merge();

        if (formdata.BUSINESS_NO != undefined && formdata.BUSINESS_NO != null)
            formdata.BUSINESS_NO = formdata.BUSINESS_NO.trim();
        var s_business_no = formdata.BUSINESS_NO;       // BUSINESS_NO
        var s_cust_name = formdata.CUST_NAME;           // CUST_NAME
        s_cust_name = $.trim(s_cust_name);

        var invalid = this.contents.validate();         // 사원(담당)코드, 사원(담당)명, 메뉴 validation 체크
        var thisObj = this;

        if (cl != "0") {
            var msg = this.getErrorMessage(cl);
            this.contents.getControl("BUSINESS_NO").showError(msg);
            this.contents.getControl("BUSINESS_NO").setFocus(0);
            thisObj.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            thisObj.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }

        if (["I"].contains(this.editFlag)) {
            // 사원(담당)코드 공백 체크
            if (this.hasWhiteSpace(s_business_no) == true) {
                var msg1 = ecount.resource.MSG02054;
                var msg2 = ecount.resource.LBL01486;
                var strMsg = msg1.replace('{0}', msg2);
                this.contents.getControl("BUSINESS_NO").showError(strMsg);
                this.contents.getControl("BUSINESS_NO").setFocus(0);
                this.footer.get(0).getControl("Save").setAllowClick();
                return false;
            }

            // 사원(담당)코드 사용 불가능한 코드 체크
            if ((s_business_no == "0") || (s_business_no == "000") || ((s_business_no.length == 4) && (s_business_no.substring(0, 3) == "zzz") || (s_business_no.substring(0, 3) == "ZZZ"))) {
                this.contents.getControl("BUSINESS_NO").showError(ecount.resource.MSG00291);
                this.contents.getControl("BUSINESS_NO").setFocus(0);
                this.footer.get(0).getControl("Save").setAllowClick();
                return false;
            }
        }
        else {
            if (this.permit.Value == "U") {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: 'U' }]);
                ecount.alert(msgdto.fullErrorMsg);
                this.footer.get(0).getControl("Save").setAllowClick();
                return false;
            }
        }

        // 구분자(∬) 체크
        if (this.fnSpliterCheckID() == 'Y') {
            return false;
        }

        formdata.BUSINESS_NO = formdata.BUSINESS_NO;
        formdata.G_BUSINESSNO = formdata.BUSINESS_NO;
        formdata.CUST_NAME = s_cust_name;

        var menuChecked = formdata.MENU.split(ecount.delimiter);

        var data = {
            Data: {
                Cust: formdata,
                NewCustEmp: {
                    ACCT_CHK: menuChecked.contains('2') ? '1' : '0',
                    SALE_CHK1: menuChecked.contains('3') ? '1' : '0',
                    SALE_CHK2: menuChecked.contains('4') ? '1' : '0',
                    SALE_CHK3: menuChecked.contains('5') ? '1' : '0',
                    SALE_CHK4: menuChecked.contains('6') ? '1' : '0'
                }
            },
            EditMode: thisObj.editFlag == "I" ? ecenum.editMode.new : ecenum.editMode.modify
        };

        ecount.common.api({
            url: "/SVC/Account/Basic/InsertPicEmp",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else if (this.editFlag == "I" && result.Data != null) {
                    var msg = this.getErrorMessage(result.Data);
                    thisObj.contents.getControl("BUSINESS_NO").showError(msg);
                    thisObj.contents.getControl("BUSINESS_NO").setFocus(0);
                } else {
                    var params = {
                        sStatus: type,
                        business_no: formdata.BUSINESS_NO,
                        txtCustName: formdata.CUST_NAME
                    };

                    thisObj.sendMessage(thisObj, params); //부모창 업데이트

                    if (type == 1) {
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    }
                    else {
                        var param = {
                            editFlag: type == 2 ? 'I' : 'M',
                            custNo: formdata.BUSINESS_NO,
                        };
                        thisObj.onAllSubmitSelf("/ECERP/ESA/ESA016M", param);
                    }
                }
            }.bind(this),
            complete: function () {
                thisObj.footer.get(0).getControl("Save").setAllowClick();
            }
        });
    },
    //
    //Handle to callback the fnSave
    fnCallbackDuplicateCheck: function (callback, a) {

        var formdata = this.contents.serialize().merge();// Implement new feature
        var s_business_no = formdata.BUSINESS_NO;
        if (['I'].contains(this.editFlag)) {
            if (s_business_no != "" && (ecount.common.ValidCheckSpecialForCodeType(s_business_no).result) && this.hasWhiteSpace(s_business_no) == false) {
                //If user entried data, call to API to check the item existed or not
                ecount.common.api({
                    url: "/SVC/Account/Basic/CheckExistedCustCommon",
                    data: Object.toJSON({ Data: { BUSINESS_NO: s_business_no } }),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            if (result.Data != null)
                                callback(result.Data, a);
                            else
                                callback("0", a);
                        }

                    }
                });
            } else {
                callback("0", a);
            }
        }
        else
            callback("0", a);
    },

    //삭제불가 메세지 팝업창
    ShowNoticeNonDeletable: function (data) {

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        //그리드 리로드후 삭제되지 않은 코드들 체크하기 위해 담아둠 (=> onGridRenderComplete에서 체크로직 진행)
        for (var i = 0; i < data.length; i++) {
            this.errDataAllKey.push(data[i].CHECK_CODE);
        }

        var param = {
            width: 520,
            height: 300,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "EmployeePic"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    reloadPage: function () {
        var self = this;

        var param = {
            editFlag: self.editFlag,
            custNo: self.custNo
        }
        self.onAllSubmitSelf("/ECErp/ESA/ESA016M", param);
    },
    getErrorMessage: function (GUBUN) {
        var msg = "";
        switch (GUBUN) {
            case "11":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL00338);
                break;
            case "14":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35400);
                break;
            case "15":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35399);
                break;
            case "20":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35398);
                break;
            case "30":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35397);
                break;
            case "90":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL01484);
                break;
            case "GY":
                msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL03529);
                break;
            default:
                break;
        }
        return msg;
    }
});