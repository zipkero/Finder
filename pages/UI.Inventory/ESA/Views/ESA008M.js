window.__define_resource && __define_resource("MSG02605","LBL10862","LBL06434","LBL09999","LBL01457","LBL03039","BTN00541","MSG01136","MSG00150","MSG00638","LBL03037","MSG00297","MSG00636","LBL03088","LBL03146","LBL02389","LBL00757","LBL00793","MSG00367","MSG02921","LBL03028","LBL10018","MSG03034","LBL10019","MSG03035","LBL04893","MSG02641","BTN00067","BTN00765","BTN00065","BTN00007","BTN00008","BTN00959","BTN00203","BTN00204","BTN00033","LBL80067","MSG00229","LBL80064","LBL30023","LBL00728","LBL93033","MSG00299","MSG00075","LBL07157","MSG08770","LBL03032","MSG00675","MSG00637");
/****************************************************************************************************
1. Create Date : 2015.04.22
2. Creator     : Le Dan
3. Description : Acct. I/ Inv. I > Setup > Project > New/Modify
4. Precaution  :
5. History     : 
                 [2015.08.14] PHI.LUONG: + PERMISSION RESOURCE, AUTHORITY MESSAGE, API UPDATE
                 [2015.08.20] PHI.LUONG: + APPLY RESET, HEIGH SIZE, 
                                         + SPECIAL CHATACTERS, 
                                         + BLOCK SUBMIT WHEN ALREADY EXISTS THE SPECIAL CHARACTERS IN CODE FIELD
                                         + TEXT AREA SET EMPTY
                 [2016.02.01] 이은규 : 헤더에 옵션 > 사용방법설정 추가
                 [2016.03.21] 안정환 : 소스 리팩토링 적용
                 [2017.12.27] 이현택 : 프로젝트 일괄 사용중단/재사용, 미사용코드 조회 기능 추가
                 2018.12.27 (HoangLinh): Remove $el
                 [2019.01.15][On Minh Thien] A18_03539 (사용자추가수정 화면 UI 수정 요청)
                 [2019.01.30][Le Minh Hau] A19_00415 (프로젝트등록 프로젝트명 자리수 변경)
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA008M", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    userPermit: "",

    editFlag: "I",

    SITE_PJT: null,

    PjtCd: null,

    mode: "I",

    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,
    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();

        this.userPermit = this.viewBag.Permission.Permit.Value;

        if (this.PJT_CD != null && this.PJT_CD != undefined && this.PJT_CD != '') {
            var site_PJT = this.viewBag.InitDatas.ProjectLoad;

            if (site_PJT != null && site_PJT != undefined) {
                this.editFlag = "M";
                this.mode = "M";
                this.SITE_PJT.PJT_CD = site_PJT.PJT_CD;
                this.SITE_PJT.PJT_DES = site_PJT.PJT_DES;
                this.SITE_PJT.ACCT_CHK = site_PJT.ACCT_CHK;
                this.SITE_PJT.SALE_CHK = site_PJT.SALE_CHK;
                this.SITE_PJT.EGW_CHK = site_PJT.EGW_CHK;
                this.SITE_PJT.PAY_CHK = site_PJT.PAY_CHK;
                this.SITE_PJT.PJT_CODE1 = site_PJT.PJT_CODE1;
                this.SITE_PJT.PJT_CODE1_DES = site_PJT.PJT_CODE1_DES;
                this.SITE_PJT.PJT_CODE2 = site_PJT.PJT_CODE2;
                this.SITE_PJT.PJT_CODE2_DES = site_PJT.PJT_CODE2_DES;
                this.SITE_PJT.REMARKS = site_PJT.REMARKS;
                this.SITE_PJT.CANCEL = site_PJT.CANCEL;
                this.SITE_PJT.WID = site_PJT.WID;
                this.SITE_PJT.WDATE = site_PJT.WDATE;
            } else {
                ecount.alert(ecount.resource.MSG02605);
                this.sendMessage(this, "Verify");
                this.close();
            }
        } else if (this.userPermit == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10862, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.close();
        }
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    render: function () {
        this._super.render.apply(this);
    },

    initProperties: function () {
        this.SITE_PJT = {
            PJT_CD: "",
            PJT_DES: "",
            ACCT_CHK: "Y",
            SALE_CHK: "Y",
            EGW_CHK: "Y",
            PAY_CHK: "Y",
            PJT_CODE1: "",
            PJT_CODE1_DES: "",
            PJT_CODE2: "",
            PJT_CODE2_DES: "",
            REMARKS: "",
            CANCEL: "",
            WID: "",
            WDATE: ""
        };

    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(String.format(this.editFlag == "M" ? ecount.resource.LBL06434 : ecount.resource.LBL09999, ecount.resource.LBL10862))
            .add("option", [
                { id: "SelfCustomizing", label: ecount.resource.LBL01457 },
            ]);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form()
            ;
        var pjtCode = null;

        var pjtCd = ["I"].contains(this.editFlag) ? this.viewBag.InitDatas.AutoNewCode : this.SITE_PJT.PJT_CD

        if (["I"].contains(this.editFlag)) {
            pjtCode = ctrl.define("widget.input.codeType", "PJT_CD", "PJT_CD", ecount.resource.LBL03039)
                .hasFn([{
                    id: "NewCode", label: ecount.resource.BTN00541
                }])
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "7", "14"), max: 14 })
                .dataRules(["required"], ecount.resource.MSG00150)
                .value(pjtCd)
                .popover(ecount.resource.MSG00638).end();
        } else {
            pjtCode = ctrl.define("widget.label", "PJT_CD", "PJT_CD", ecount.resource.LBL03039)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "7", "14"), max: 14 })
                .dataRules(["required"], ecount.resource.MSG00150)
                .label(pjtCd)
                .popover(ecount.resource.MSG00638).end();
        }

        form.template("register")
            .add(pjtCode)
            .add(ctrl.define("widget.input.codeName", "PJT_DES", "PJT_DES", ecount.resource.LBL03037)
                .filter("maxlength", { message: String.format(ecount.resource.MSG00297, "60", "60"), max: 60 })
                .dataRules(["required"], ecount.resource.MSG00636)
                .value(this.SITE_PJT.PJT_DES).popover(ecount.resource.MSG00636).end()
            )
            .add(ctrl.define("widget.checkbox", "MENU", "MENU", ecount.resource.LBL03088)
                .label([ecount.resource.LBL03146, ecount.resource.LBL02389, ecount.resource.LBL00757, ecount.resource.LBL00793])
                .value(["1", "2", "3", "4"])
                .select(this.SITE_PJT.ACCT_CHK == "Y" ? "1" : "", this.SITE_PJT.SALE_CHK == "Y" ? "2" : "", this.SITE_PJT.EGW_CHK == "Y" ? "3" : "", this.SITE_PJT.PAY_CHK == "Y" ? "4" : "")
                .dataRules(["required"], ecount.resource.MSG00367)
                .popover(String.format(ecount.resource.MSG02921, ecount.resource.LBL03028)).end())
            .add(ctrl.define("widget.multiCode.processCode", "PJT_CODE1", "PJT_CODE1", ecount.resource.LBL10018).maxSelectCount(1).popover(ecount.resource.MSG03034).end())
            .add(ctrl.define("widget.multiCode.processCode", "PJT_CODE2", "PJT_CODE2", ecount.resource.LBL10019).maxSelectCount(1).popover(ecount.resource.MSG03035).end())
            .add(ctrl.define("widget.textarea", "REMARKS", "REMARKS", ecount.resource.LBL04893)
                .flexible(true).value(this.SITE_PJT.REMARKS)
                .filter("maxlength", { message: String.format(ecount.resource.MSG01136, "1000", "1000"), max: 1000 })
                .popover(ecount.resource.MSG02641).end());

        contents.add(form);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup = [];

        if (this.editFlag == "I") {
            if (this.isAddGroup) {
                addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
                addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
                toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            } else {
                toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
            }
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        } else {
            addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
            addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup));
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button.group", 'deleteRestore').label(ecount.resource.BTN00959)
                .addGroup([{ id: "Activate", label: this.SITE_PJT.CANCEL == "Y" ? ecount.resource.BTN00203 : ecount.resource.BTN00204 },
                { id: 'delete', label: ecount.resource.BTN00033 }])
                .css("btn btn-default")
                .noActionBtn().setButtonArrowDirection("up"));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        if (this.editFlag == "I") {
            this.contents.getControl("PJT_CD").readOnly(false);
            if (this.viewBag.InitDatas.UseAutoCode) {
                if (this.viewBag.InitDatas.AutoNewCode.trim() == "")
                    this.contents.getControl('PJT_CD').setFocus(0);
                else
                    this.contents.getControl('PJT_DES').setFocus(0);
            }
            else
                this.contents.getControl('PJT_CD').setFocus(0);
        }
        else {
            this.contents.getControl("PJT_CD").readOnly(true);
            if (this.SITE_PJT.PJT_CODE1 != null && this.SITE_PJT.PJT_CODE1 != "" && this.SITE_PJT.PJT_CODE1_DES != null && this.SITE_PJT.PJT_CODE1_DES != "") {
                this.contents.getControl("PJT_CODE1").addCode({
                    label: this.SITE_PJT.PJT_CODE1_DES, value: this.SITE_PJT.PJT_CODE1
                });
            }

            if (this.SITE_PJT.PJT_CODE2 != null && this.SITE_PJT.PJT_CODE2 != "" && this.SITE_PJT.PJT_CODE2_DES != null && this.SITE_PJT.PJT_CODE2_DES != "") {
                this.contents.getControl("PJT_CODE2").addCode({
                    label: this.SITE_PJT.PJT_CODE2_DES, value: this.SITE_PJT.PJT_CODE2
                });
            }

            this.contents.getControl('PJT_DES').setFocus(0);
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 895
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id) {
            case "PJT_CODE1":
                parameter.CODE_CLASS = "G10";
                break;
            case "PJT_CODE2":
                parameter.CODE_CLASS = "G11";
                break;
        }
        handler(parameter);
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == 'CM102P') {
            this.contents.getControl('PJT_CD').setValue(message.data[0].AutoCode);
            message.callback && message.callback();
            this.contents.getControl('PJT_CD').onNextFocus();
        }
    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        if (control.id == "PJT_CODE1") {
            params.custGroupCodeClass = "G10";
            params.CODE_CLASS = "G10";
            params.name = String.format(ecount.resource.LBL80067, ecount.resource.LBL10018);
        }

        if (control.id == "PJT_CODE2") {
            params.custGroupCodeClass = "G11";
            params.CODE_CLASS = "G11";
            params.name = String.format(ecount.resource.LBL80067, ecount.resource.LBL10019);
        }
        params.SID = "E010112";
        params.isApplyDisplayFlag = false;
        params.titlename = params.name;
        params.popupType = false;
        params.additional = false;

        handler(params);
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
            popupType: false
        });
    },
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //FN NewCode click event
    onFunctionNewCode: function () {
        if (this.editFlag == "M") {
            return false;
        }
        if (!this.viewBag.InitDatas.UseAutoCode) {
            //Prevent lost layer popup on IE8
            var msf = String.format(ecount.resource.MSG00229, ecount.resource.LBL80064, ecount.resource.LBL30023, ecount.resource.LBL00728);
            this.setTimeout(function () {
                ecount.alert(msf);
            });
            return false;
        }
        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            autoNumberSettings: encodeURIComponent(Object.toJSON([{ CODE_TYPE: "2" }])),
            programID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM102P',
            name: ecount.resource.BTN00541,
            param: params,
            popupType: false,
            additional: false
        });
    },

    // SAVE button click event
    onFooterSave: function (cl, isSaveNew) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 1);
    },

    // SAVE New button click event
    onButtonSaveNew: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 2);

        if (this.mode == "M") {
            this.footer.get(0).getControl("deleteRestore").hide();
            this.footer.get(0).getControl("History").hide();
        }
    },

    // SAVE REVIEW button click event
    onButtonSaveReview: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 3);
    },

    // RESET button click event
    onFooterReset: function (e) {
        if (this.mode == "I") {
            this.contents.reset();
            this.editFlag = "I";
            this.contents.getControl("PJT_CD").readOnly(false);
            this.contents.getControl('PJT_CODE1').setValue('');
            this.contents.getControl('PJT_CODE2').setValue('');

            var chk = this.contents.getControl('MENU');
            chk.setValue(0, true);
            chk.setValue(1, true);
            chk.setValue(2, true);
            chk.setValue(3, true);

            //Reset TextArea
            this.contents.getControl('REMARKS').setValue('');
            this.contents.getControl('PJT_CD').setValue('');

            //Auto Code
            var txtPJT_CD = this.contents.getControl('PJT_CD');
            var txtPJT_DES = this.contents.getControl('PJT_DES');
            if (this.viewBag.InitDatas.UseAutoCode) {
                var data = {
                    IsView: true,
                    CodeType: 2,
                    IoDate: this.viewBag.LocalTime,
                    AutoCodeEditType: "I",
                    UpLoadYn: "N"
                };

                ecount.common.api({
                    url: "/SelfCustomize/Config/GetAutoCodeRepeatCdForViewWithList",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else {
                            txtPJT_CD.setValue(result.Data);
                            txtPJT_DES.setValue('');

                            if (result.Data.trim() == "")
                                txtPJT_CD.setFocus(0);
                            else
                                txtPJT_DES.setFocus(0);
                        }
                    }
                });
            }
            else {
                this.contents.getControl('PJT_CD').setValue('');
                this.contents.getControl('PJT_CD').setFocus(0);
            }
        }
        else {
            var pjtCD = this.PjtCd != null ? this.PjtCd : this.PJT_CD;

            if (pjtCD != null) {
                var param = {
                    PJT_CD: pjtCD
                };

                this.onAllSubmitSelf("/ECERP/ESA/ESA008M", param);
            }
        }
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // DELETE button click event
    onButtonDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }

        var thisObj = this;

        var data = {
            PJT_CD: this.SITE_PJT.PJT_CD,
            ACC105_FLAG: "Y" ,   
            MENU_CODE: "Project",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
            CHECK_TYPE: "A",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
            DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
            PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
        };

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {

                ecount.common.api({
                    url: "/SVC/Account/Basic/DeleteSitePJT",
                    data: Object.toJSON(
                        {
                            Request: {
                                Data: data
                            }
                        }
                    ),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else if (result.Data == "2")
                            ecount.alert(ecount.resource.MSG00075);
                        else {
                            thisObj.sendMessage(thisObj, "Delete");
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                    },
                    complete: function () {
                        btnDelete.setAllowClick();
                    }
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },

    // ACTIVATE button click event
    onButtonActivate: function (e) {
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var thisObj = this;

        var data = {
            PJT_CD: this.SITE_PJT.PJT_CD,
            CANCEL: this.SITE_PJT.CANCEL == "Y" ? "N" : "Y"
        };

        ecount.common.api({
            url: "/SVC/Account/Basic/ActivateProject",
            data: Object.toJSON({
                Request: data              
            }),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {
                    thisObj.sendMessage(thisObj, "Active");
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

    // HISTORY button click event
    onFooterHistory: function (e) {
        var params = {
            width: 450,
            height: 150,
            lastEditTime: this.SITE_PJT.WDATE,
            lastEditId: this.SITE_PJT.WID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: params,
            popupType: false,
            additional: false
        });
    },

    // CLOSE button click event
    onFooterClose: function () {
        this.close();
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (cl, isSaveNew) {
        var btnSave = this.footer.get(0).getControl("Save");

        if (isSaveNew == null || isSaveNew == undefined)
            isSaveNew = 1;

        if (this.userPermit == "R" || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var formData = this.contents.serialize().merge();
        if (formData.PJT_CD != undefined && formData.PJT_CD != null)
            formData.PJT_CD = formData.PJT_CD.trim();
        this.PjtCd = formData.PJT_CD;
        var thisObj = this;
        var sPJT_CD = this.SITE_PJT.PJT_CD;
        var txtPJT_CD = this.contents.getControl('PJT_CD');

        var invalid = this.contents.validate();

        if (invalid.result.length > 0) {

            //Existed Item Code
            if (cl == "1") {
                btnSave.setAllowClick();
                txtPJT_CD.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL03032));
                txtPJT_CD.setFocus(0);
            }

            //Not Existed Item Code
            else if (cl == "2") {
                btnSave.setAllowClick();
                txtPJT_CD.showError(ecount.resource.MSG00675);
                txtPJT_CD.setFocus(0);
            }

            btnSave.setAllowClick();
            invalid.result[0][0].control.setFocus(0);
            return;
        }
        else {
            //Existed Item Code
            if (cl == "1") {
                btnSave.setAllowClick();
                txtPJT_CD.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL03032));
                txtPJT_CD.setFocus(0);
                return;
            }
            //Not Existed Item Code
            else if (cl == "2") {
                btnSave.setAllowClick();
                txtPJT_CD.showError(ecount.resource.MSG00675);
                txtPJT_CD.setFocus(0);
                return;
            }
        }

        if (this.editFlag == "I") {
            sPJT_CD = txtPJT_CD.getValue();

            if (sPJT_CD.trim() == "00") {
                txtPJT_CD.showError(ecount.resource.MSG00637);
                txtPJT_CD.setFocus(0);
                btnSave.setAllowClick();
                return false;
            }
        }

        var chks = this.contents.getControl('MENU');
        var sACCT_CHK = chks.getValue(0) == true ? "Y" : "N";
        var sSALE_CHK = chks.getValue(1) == true ? "Y" : "N";
        var sEGW_CHK = chks.getValue(2) == true ? "Y" : "N";
        var sPAY_CHK = chks.getValue(3) == true ? "Y" : "N";

        formData.ACCT_CHK = sACCT_CHK;
        formData.SALE_CHK = sSALE_CHK;
        formData.EGW_CHK = sEGW_CHK;
        formData.PAY_CHK = sPAY_CHK;
        formData.FLAG = this.editFlag;
        if (this.editFlag == 'I')
            formData.EditMode = '01';
        else
            formData.EditMode = '02';
        this.saveType = isSaveNew;

        //CheckExistedProject
        ecount.common.api({
            url: "/SVC/Account/Basic/SaveProject",
            data: Object.toJSON({
                Request: {
                    Data: formData
                }
            }),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else if (result.Data == "1") {
                    txtPJT_CD.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL03032));
                    txtPJT_CD.setFocus(0);
                }
                else {
                    var params = {
                        sStatus: "Save",
                        PJT_CD: thisObj.contents.getControl('PJT_CD').getValue(),
                        PJT_DES: thisObj.contents.getControl('PJT_DES').getValue()
                    };
                    
                    thisObj.sendMessage(thisObj, params);

                    if (isSaveNew == 1) {
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    } else {
                        var param = {};
                        if (isSaveNew == 2) {
                            var txtPJT_DES = thisObj.contents.getControl('PJT_DES');

                            if (thisObj.viewBag.InitDatas.UseAutoCode) {
                                var data = {
                                    IsView: true,
                                    CodeType: 2,
                                    IoDate: thisObj.viewBag.LocalTime,
                                    AutoCodeEditType: "I",
                                    UpLoadYn: "N"
                                };

                                ecount.common.api({
                                    url: "/SelfCustomize/Config/GetAutoCodeRepeatCdForViewWithList",
                                    data: Object.toJSON(data),
                                    success: function (result) {
                                        if (result.Status != "200")
                                            ecount.alert(result.fullErrorMsg);
                                        else {
                                            txtPJT_CD.setValue(result.Data);
                                            txtPJT_DES.setValue('');

                                            if (result.Data.trim() == "")
                                                txtPJT_CD.setFocus(0);
                                            else
                                                txtPJT_DES.setFocus(0);
                                        }
                                    }
                                });
                            } else {
                                txtPJT_CD.setValue('');
                                txtPJT_DES.setValue('');
                                txtPJT_CD.setFocus(0);
                            }

                            thisObj.contents.getControl("PJT_CD").readOnly(false);
                            thisObj.editFlag = "I";
                            param.isAddgroup = true;
                        } else {
                            thisObj.contents.getControl("PJT_CD").readOnly(true);
                            thisObj.editFlag = "M";

                            param. PJT_CD = thisObj.PjtCd
                            
                        }
                        thisObj.onAllSubmitSelf("/ECERP/ESA/ESA008M", param);
                    }
                }
            },
            complete: function () {
                btnSave.setAllowClick();
            }
        });
    },

    //Handle to callback the fnSave
    fnCallbackDuplicateCheck: function (callback, a) {
        var formData = this.contents.serialize().merge();
        if (formData.PJT_CD != undefined && formData.PJT_CD != null)
            formData.PJT_CD = formData.PJT_CD.trim();

        var cd = formData.PJT_CD.trim();

        if (['I'].contains(this.editFlag)) {
            if (cd != "" && (ecount.common.ValidCheckSpecialForCodeType(cd).result)) {
                //If user entried data, call to API to check the item existed or not
                ecount.common.api({
                    url: "/SVC/Account/Basic/CheckExistedProject",
                    data: Object.toJSON({
                        Request: {                          
                            Data: formData               
                        }
                    }),
                    success: function (result) {
                        if (result.Status != "200")
                            alert(result.fullErrorMsg);
                        else
                            callback(result.Data, a);
                    }.bind(this)
                });
            } else {
                callback("0", a);
            }
        }
        else
            callback("0", a);
    }
});