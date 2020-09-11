window.__define_resource && __define_resource("LBL09999","LBL01977","LBL06434","LBL01984","MSG01136","MSG00597","MSG02917","LBL06386","MSG00599","MSG03385","LBL03142","MSG01397","MSG03386","LBL04196","LBL03589","MSG01061","BTN00067","BTN00765","BTN00065","BTN00007","BTN00275","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","MSG02605","MSG00675","LBL93039","MSG00299","MSG00678","MSG02012","LBL07157","MSG08770","LBL11940","MSG02054");
    /****************************************************************************************************
    1. Create Date : 2015.04.15
    2. Creator     : PHI
    3. Description : Inv. I > Setup > FOREIGN CURRENCY > New
    4. Precaution  :
    5. History     : 
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
         2018.12.05 (이은총) : 중복메세지 설정
         2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
         2019.06.05 (NguyenDucThinh) A18_04171 Update resource
    ****************************************************************************************************/

    ecount.page.factory("ecount.page.popup.type2", "ESA035M", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    permission: null,


    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        //Get Permission
        this.permission = this.viewBag.Permission.permit;

        //Title
        this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL01977);
        this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL01977);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
        //onInitHeader(헤더 옵션 설정)
    onInitHeader: function (header) {
        header.notUsedBookmark();
        if (this.editFlag == "I") {
            header.setTitle(this.HeaderTitlePopUp);
        }
        else {
            header.setTitle(this.HeaserTitlePopUpModify);
        }
    },

        //onInitContents(본문 옵션 설정)
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form1 = generator.form();

        form1.template("register");

        if (this.editFlag == "I") {
            form1
                .add(ctrl.define("widget.input.codeType", "ForeignCode", "ForeignCode", ecount.resource.LBL01984)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "2", "5"), max: 5 })
                .dataRules(["required"], ecount.resource.MSG00597)
                .value()
                .popover(ecount.resource.MSG02917)
                .end());
        }
        else {
            form1
                .add(ctrl.define("widget.label", "ForeignCode", "ForeignCode", ecount.resource.LBL01984)
                .label(this.codeClassNo)
                .popover(ecount.resource.MSG02917)
                .end());
        }


        form1

        .add(ctrl.define("widget.input.codeName", "ForeignDes", "ForeignDes", ecount.resource.LBL06386)
        .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
        .dataRules(["required"], ecount.resource.MSG00599)
        .value()
        .popover(ecount.resource.MSG03385)
        .end())

        .add(ctrl.define("widget.input.general", "ForeignRate", "ForeignRate", ecount.resource.LBL03142)
        .numericOnly(18, 4, String.format(ecount.resource.MSG01397, "18"))
        .popover(ecount.resource.MSG03386)
        .end());

        if (this.codeClassType == "S10") {
            form1.add(ctrl.define("widget.select", "Decimal", "Decimal", ecount.resource.LBL04196)
            .option([[0, ecount.resource.LBL03589], [1, 1], [2, 2], [3, 3], [4, 4]]).select(2)
            .popover(ecount.resource.MSG01061)
            .end());
        }

        contents
            .add(form1)
    },

        //onInitFooter(풋터 옵션 설정)
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            addgroup = [],
            ctrl = widget.generator.control();
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });

        toolbar.addLeft(ctrl.define("widget.button.group", "save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce())
        toolbar.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));
        if (this.isListDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "list").label(ecount.resource.BTN00275));
        if (['M'].contains(this.editFlag)) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                       .css("btn btn-default")
                                                                       .addGroup(
                                                                        [
                                                                           {
                                                                               id: 'use',
                                                                               label: (this.useFlag == "N" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)                //Resource : 재사용, 사용중단
                                                                           },
                                                                           { id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));  // Delete
            if (this.isCloseDisplayFlag)
                toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        } else {
            if (this.isCloseDisplayFlag)
                toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        }
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

        var infoData = this.viewBag.InitDatas;
        if (this.editFlag == "M") {
            var ViewForeignCurrency = infoData.ViewForeignCurrency;
            var result = ViewForeignCurrency[0];

            if (result != undefined && result != "" && result != null) {
                var Frate,
                    FDigit;

                if (result.EXCHANGE_RATE == null || result.EXCHANGE_RATE == undefined || result.EXCHANGE_RATE == "")
                    Frate = '';
                else
                    Frate = result.EXCHANGE_RATE;

                if (result.AMTDIGIT_LEN == null || result.AMTDIGIT_LEN == undefined || result.AMTDIGIT_LEN == "")
                    FDigit = 0;
                else
                    FDigit = result.AMTDIGIT_LEN;


                this.contents.getControl("ForeignCode").setLabel(result.CODE_NO);
                this.contents.getControl("ForeignDes").setValue(result.CODE_DES);
                this.contents.getControl("ForeignRate").setValue(Frate);

                if (this.codeClassType == "S10") {
                    this.contents.getControl("Decimal").setValue(FDigit);
                }
                this.useFlag = result.USE_GUBUN;

                this.lastModifyDate = !$.isNull(result.WDATE) ? result.WDATE : "";

                this.lastModifyId = !$.isNull(result.WID) ? result.WID : "";

                this.contents.getControl("ForeignDes").setFocus(0);
            }
            else {
                ecount.alert(ecount.resource.MSG02605);
                this.sendMessage(this, "Underfine");
                this.close();
            }
        }

        else {

            var AutoForeignCurrency = infoData.AutoForeignCurrency;
            var result = AutoForeignCurrency[0];

            this.contents.getControl("ForeignCode").setValue(result.NEXT_CODE);

            if (result.NEXT_CODE != '' && result.NEXT_CODE != undefined && result.NEXT_CODE != null) {
                this.contents.getControl("ForeignCode").setValue(result.NEXT_CODE);
                this.contents.getControl("ForeignDes").setFocus(0);
            }
            else
                this.contents.getControl("ForeignCode").setFocus(0);
            


        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

        //onBeforeEventHandler(버튼 이벤트 클릭전 호출)
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Save Event
    onFooterSave: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 1);
    },

    // [Save & New] button clicked event
    onButtonSaveNew: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 2);
    },

    // [Save/Review] button clicked event
    onButtonSaveReview: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 3);
    },

    // on Footer Reset
    onFooterReset: function () {
        if (this.codeClassNo == null || this.codeClassNo == undefined) {
            this.contents.reset();
            var ctrl = this.contents.getControl("ForeignCode");
            var ctrldes = this.contents.getControl("ForeignDes");
            var formDataAutoCode = JSON.stringify({ CODE_CLASS: this.codeClassType });
            if (['I'].contains(this.editFlag)) {
                //Get AutoCode
                ecount.common.api({
                    url: "/SelfCustomize/Config/GetAutoForeignCurrency",
                    data: formDataAutoCode,
                    success: function (result) {
                        ctrl.setValue(result.Data[0].NEXT_CODE);
                        //Set Focus
                        if (ctrl.getValue().trim() == "")
                            ctrl.setFocus(0);
                        else
                            ctrldes.setFocus(0);

                    }.bind(this),
                });
            }
        }
        else {
            var param = {
                editFlag: "M",
                useFlag:  this.useFlag,
                codeClassNo: this.codeClassNo,
                codeClassType: this.codeClassType,
                codeClassDes: this.codeClassDes,
                isCloseDisplayFlag: true,
            };
            this.onAllSubmitSelf("/ECERP/ESA/ESA035M", param);
        }
    },

    // Go to List Page
    onFooterList: function () {
        var param = {
            CODE_CLASS: this.codeClassType,
            CLASS_DES: this.codeClassDes
        }
        this.openWindow({
            url: '/ECMAIN/ESA/ESA034M.aspx',
            name: "ESA034M",
            param: param
        });
    },

    //Active/DeActive Button Event
    onButtonUse: function (e) {
        var thisObj = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.permission.Value == "W") {
            var use = this.useFlag == "Y" ? "N" : "Y";
            var formData = JSON.stringify({
                Request: {
                    Data: {
                        CODE_CLASS: this.codeClassType,
                        CODE_NO: this.codeClassNo,
                        USE_GUBUN: use
                    }
                }
            });
            ecount.common.api({
                url: "/SVC/Account/Basic/UpdateUseForeignCurrency",
                data: formData,
                success: function (result) {
                    if (result.Data.ERRFLAG == "1")
                        ecount.alert(ecount.resource.MSG00675); //코드가 존재하지 않습니다.'              
                    else {
                        thisObj.sendMessage(thisObj, "Saved");
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    }
                },
                complete: function(){
                    btnDelete.setAllowClick();
                }
            });
        } else {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93039, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    //Close Button Event
    onFooterClose: function () {
        this.close();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },


    // Confirm on Delete
    onButtonDelete: function () {
        var thisObj = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var formData = JSON.stringify({
            Request: {
                Data: {
                    CODE_CLASS: this.codeClassType,
                    CODE_NO: this.codeClassNo
                }
            }
        });
        if (this.permission.CD) {
            ecount.confirm(ecount.resource.MSG00299, function (status) {

                if (status === true) {
                    ecount.common.api({
                        url: "/SVC/Account/Basic/DeleteForeignCurrency",
                        data: formData,
                        success: function (result) {
                            if (result.Data.ERRFLAG == "1")
                                ecount.alert(ecount.resource.MSG00678); //No code to delete.
                            else if (result.Data.ERRFLAG == "2") {
                                ecount.alert(ecount.resource.MSG02012); //This code is already being used at [Inventory] > [Inv. Mov.] > [Internal Use].\n\nPlease verify the code from the menu and then try it again
                                btnDelete.setAllowClick();
                            }
                            else {
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                                thisObj.sendMessage(thisObj, "Delete");
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
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93039, PermissionMode: "U" }]);
            btnDelete.setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    //History Button Event
    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 140,
            lastEditTime: this.lastModifyDate,
            lastEditId: this.lastModifyId,
            popupType: false,
            additional: false,
        }
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param
        });
    },

    setReload: function (e) {
       
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    //Enter event
    ON_KEY_ENTER: function (e, target) {
        if (target != null) {
            var control = target.control
            var idx = control.getValue();

            if (this.codeClassType == "S10") {
                if (control.id === "Decimal") {
                    this.footer.getControl('save').setFocus(0);
                }

            }
            else if (control.id === "ForeignRate") {
                this.footer.getControl('save').setFocus(0);
            }
        }
    },

    //Check white space
    fnValidCheckSpace: function (strThis, strMsgFlag) {
        var index = "";
        index = strThis.indexOf(' ')
        if (index > 0) {
            return false;
        }
    },

    // [Save] and [Save & New] button function
    // isSaveAndNew: to check whether [Save & New] button is clicked
    fnSave: function (cl, type) {
        var thisObj = this;
        var btn = this.footer.get(0).getControl('save');
        var ctrl = this.contents.getControl("ForeignCode");
        var ctrldes = this.contents.getControl("ForeignDes");
        var ctrl_ex_rate = this.contents.getControl("ForeignRate");
        if (type == null || type == undefined)
            type = 1;
        if ((this.permission.CW == true && this.editFlag == "I") || this.permission.CD == true) {

            //Serialize all contents in current form
            var formdata = this.contents.serialize().merge();
            var vhk = true;
            var code = "";
            var codedes = "";
            code = formdata.ForeignCode.trim();
            codedes = formdata.ForeignDes.trim();

            //Find unvalid field in current form
            var invalid = this.contents.validate();

            //Init the param string
            var formData = JSON.stringify({
                Request: {
                    Data: {
                        editFlag: this.editFlag,
                        CODE_CLASS: this.codeClassType
                        , CODE_NO: formdata.ForeignCode.trim()
                        , CODE_DES: formdata.ForeignDes.trim()
                        , EXCHANGE_RATE: $.isEmpty(formdata.ForeignRate) ? 0 : formdata.ForeignRate
                        , AMTDIGIT_LEN: this.codeClassType == "S10" ? formdata.Decimal : 0
                    }
                }
            });

            //Set Frate default value
            if (ctrl_ex_rate == '') {
                ctrl_ex_rate.setValue("0");
            }

            //If any field unvalid
            if (invalid.result.length > 0) {
                btn.setAllowClick();
                invalid.result[0][0].control.setFocus(0);

                //Existed Item Code
                if (cl == "1") {
                    // 이미 {0}에 존재하는 코드입니다.
                    ctrl.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL11940)); 
                    ctrl.setFocus(0);
                }

                //Not Existed Item Code
                else if (cl == "2") {
                    ctrl.showError(ecount.resource.MSG00675);
                    ctrl.setFocus(0);
                }

                return;
            }
            else {
                //Existed Item Code
                if (cl == "1") {
                    btn.setAllowClick();
                    // 이미 {0}에 존재하는 코드입니다.
                    ctrl.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL11940)); 
                    ctrl.setFocus(0);
                    return;
                }

                //Not Existed Item Code
                else if (cl == "2") {
                    btn.setAllowClick();
                    ctrl.showError(ecount.resource.MSG00675);
                    ctrl.setFocus(0);
                    return;
                }
            }

            //Check White Space
            vhk = this.fnValidCheckSpace(code, true)

            if (vhk == false) {
                btn.setAllowClick();
                txtCode.showError(String.format(ecount.resource.MSG02054, this.codeHeader));
                txtCode.setFocus(0);
                return;
            }

            var formDataAutoCode = JSON.stringify({ CODE_CLASS: this.codeClassType });

            var url = ['I'].contains(this.editFlag) ? "/SVC/Account/Basic/InsertForeignCurrency" : "/SVC/Common/Infra/UpdateForeignCurrency";

            //Ajax sychronizing
            ecount.common.api({
                url: url,
                data: formData,
                success: function (result) {
                    if (result.Status != "200") {
                        btn.setAllowClick();
                        alert(result.fullErrorMsg);
                    } else {
                        var params = {
                            sStatus: "Save",
                            AMTDIGIT_LEN: thisObj.codeClassType == "S10" ? thisObj.contents.getControl('Decimal').getValue() : 0,
                            CODE_CLASS: thisObj.codeClassType,
                            CODE_DES: thisObj.contents.getControl('ForeignDes').getValue(),
                            CODE_NO: thisObj.contents.getControl('ForeignCode').getValue(),
                            EXCHANGE_RATE: thisObj.contents.getControl('ForeignRate').getValue()
                        };
                        thisObj.sendMessage(thisObj, params);
                        if (type == '1') {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                        else {
                            var param = {
                                editFlag: type == 2 ? 'I' : 'M',
                                useFlag: ['I'].contains(thisObj.editFlag) ? "Y" : thisObj.useFlag,
                                codeClassNo: code,
                                codeClassType: thisObj.codeClassType,
                                codeClassDes: thisObj.codeClassDes,
                                isCloseDisplayFlag: true,
                            };

                            thisObj.onAllSubmitSelf("/ECERP/ESA/ESA035M", param);
                        }
                    }
                },
                complete: function () {
                    btn.setAllowClick();
                }
            });
        } else {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93039, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    //Handle to callback the fnSave
    fnCallbackDuplicateCheck: function (callback, a) {
        var formdata = this.contents.serialize().merge();// Implement new feature
        var cd = formdata.ForeignCode.trim();
        var formData = JSON.stringify({
            editFlag: this.editFlag,
            CODE_CLASS: this.codeClassType,
            CODE_NO: formdata.ForeignCode.trim(),
            CODE_DES: formdata.ForeignDes.trim(),
            EXCHANGE_RATE: $.isEmpty(formdata.ForeignRate) ? 0 : formdata.ForeignRate,
            AMTDIGIT_LEN: this.codeClassType == "S10" ? formdata.Decimal : 0
        });
        if (['I'].contains(this.editFlag)) {
            if (cd != "" && (ecount.common.ValidCheckSpecialForCodeType(cd).result)) {
                //If user entried data, call to API to check the item existed or not
                ecount.common.api({
                    url: "/Account/Basic/CheckExistedForeignCurrency",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
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
    },

});
