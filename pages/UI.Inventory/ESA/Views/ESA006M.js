window.__define_resource && __define_resource("MSG02605","LBL09999","LBL07275","LBL06434","LBL02736","MSG01136","MSG00559","MSG03026","BTN00541","LBL02722","MSG00563","MSG03025","LBL00703","MSG03023","LBL02794","MSG03027","LBL08977","MSG04768","LBL08978","MSG04769","LBL06371","MSG03425","LBL06372","MSG03427","LBL07309","MSG04809","BTN00067","BTN00765","BTN00065","BTN00007","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","LBL08396","LBL05716","MSG03475","LBL10109","MSG00229","LBL80063","LBL30025","LBL00729","MSG00637","MSG08770","LBL02721","MSG05588","MSG04919","LBL93292","MSG00048","MSG00299","LBL02718","LBL07157","MSG00126","MSG04449","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator     : Nguyen Anh Tuong
3. Description : Groupcode popup page with edit,list,modify data
4. Precaution  :
5. History     :  2016-03-21 안정환 소스 리팩토링 적용
                  2018.01.29: Huu Lan: Moved Type field after Location Name field and Applied combine widget Type
                  2018.12.05 (문요한) : 중복코드 체크 보여주기 공통화
                  2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA006M", {

    userPermit: "",

    hidOldOutCust: "",

    hidOldChkGubun: "",

    off_key_esc: true,

    ctrlList: null,

    iserror: null,

    LocationEdit: null,

    locationData: null,

    /**************************************************************************************************** 
     * page initialize
     ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.userPermit = this.viewBag.Permission.Permit.Value
    },

    render: function () {
        this._super.render.apply(this);

        if (this.LocationEdit != null && this.LocationEdit != undefined && this.WH_CD != '' && this.WH_CD != undefined) {
            var locationEdit = this.viewBag.InitDatas.LocationLoad;

            if (locationEdit != null && locationEdit != undefined) {
                this.editFlag = "M";

                this.LocationEdit.WH_CD = locationEdit.WH_CD;
                this.LocationEdit.CHK_GUBUN = locationEdit.CHK_GUBUN;
                this.LocationEdit.WH_DES = locationEdit.WH_DES;
                this.LocationEdit.PLANT_DES = locationEdit.PLANT_DES;
                this.LocationEdit.PLANT_CD = locationEdit.PLANT_CD;
                this.LocationEdit.OUT_CUST_DES = locationEdit.OUT_CUST_DES;
                this.LocationEdit.COM_DES = locationEdit.COM_DES;
                this.LocationEdit.COM_DES2 = locationEdit.COM_DES2;
                this.LocationEdit.OUT_CUST = locationEdit.OUT_CUST;
                this.LocationEdit.CUST = locationEdit.CUST;
                this.LocationEdit.PRICE_GROUP = locationEdit.PRICE_GROUP;
                this.LocationEdit.PRICE_GROUP2 = locationEdit.PRICE_GROUP2;
                this.LocationEdit.PRICE_GROUP_DES = locationEdit.PRICE_GROUP_DES;
                this.LocationEdit.PRICE_GROUP_DES2 = locationEdit.PRICE_GROUP_DES2;
                this.LocationEdit.WH_VAT_RATE = locationEdit.WH_VAT_RATE;
                this.LocationEdit.WH_VAT_RATE_YN = locationEdit.WH_VAT_RATE_YN;
                this.LocationEdit.WH_VAT_RATE_BY = locationEdit.WH_VAT_RATE_BY;
                this.LocationEdit.WH_VAT_RATE_BY_BASE_YN = locationEdit.WH_VAT_RATE_BY_BASE_YN;
                this.LocationEdit.WDATE = locationEdit.WDATE;
                this.LocationEdit.UNAME = locationEdit.UNAME;
                this.LocationEdit.DEL_GUBUN = locationEdit.DEL_GUBUN;
            } else {
                ecount.alert(ecount.resource.MSG02605);
                this.sendMessage(this, {});
                var thisObj = this;
                thisObj.setTimeout(function () {
                    thisObj.close();
                }, 0);
            }
        }
    },

    initProperties: function () {
        this.LocationEdit = {
            CHK_GUBUN: "",
            WH_CD: "",
            WH_DES: "",
            PLANT_DES: "",
            PLANT_CD: "",
            OUT_CUST_DES: "",
            COM_DES: "",
            COM_DES2: "",
            OUT_CUST: "",
            CUST: "",
            PRICE_GROUP: "",
            PRICE_GROUP2: "",
            PRICE_GROUP_DES: "",
            PRICE_GROUP_DES2: "",
            WH_VAT_RATE: "",
            WH_VAT_RATE_YN: "",
            WH_VAT_RATE_BY: "",
            WH_VAT_RATE_BY_BASE_YN: "",
            WDATE: "",
            WID: "",
            DEL_GUBUN: ""
        };
        this.locationData = {};
        this.ctrlList = [];
        this.iserror = {};

    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    /********************************************************************** 
    * render form form  layout setting [onInitHeader, onInitContents, onInitFooter ...](ui setting)  
    **********************************************************************/

    //Header Initialization
    onInitHeader: function (header) {
        header.setTitle(['I'].contains(this.editFlag) ? String.format(ecount.resource.LBL09999, ecount.resource.LBL07275) : String.format(ecount.resource.LBL06434, ecount.resource.LBL07275));
        header.notUsedBookmark();
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            c = g.control(),
            f = g.form();
        var list = this.viewBag.InitDatas.custs;

        var optionData = [];
        var selectedValue = this.LocationEdit.CUST;

        for (var i = 0; i < list.length; i++) {
            var business_no = list[i].BUSINESS_NO;
            var set_bus_no = '';
            if (business_no.length == 10) {
                set_bus_no = business_no.substr(0, 3) + '-' + business_no.substr(3, 2) + '-' + business_no.substr(5, 5);
            }
            optionData.push([list[i].BUSINESS_NO, list[i].COM_DES + "  " + set_bus_no]);
        }

        this.locationData = this.viewBag.InitDatas.locationLevels;
        debugger
        f.template("register")

            .add(['I'].contains(this.editFlag) ?
                c.define("widget.input.codeType", "WH_CD", "WH_CD", ecount.resource.LBL02736)
                    .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "2", "5"), max: 5 })
                    .dataRules(["required"], ecount.resource.MSG00559)
                    .popover(ecount.resource.MSG03026)
                    .hasFn([{ id: "NewCode", label: ecount.resource.BTN00541 }]).end()
                : c.define("widget.label", "WH_CD", "WH_CD", ecount.resource.LBL02736).popover(ecount.resource.MSG03026).label(this.WH_CD).end())

            .add(c.define("widget.input.codeName", "WH_DES", "WH_DES", ecount.resource.LBL02722)
                .filter("maxlength", { message: String.format(ecount.resource.MSG01136, "50", "50"), max: 50 })
                .dataRules(['required'], ecount.resource.MSG00563)
                .value(this.LocationEdit.WH_DES).popover(ecount.resource.MSG03025).end())
            .add(c.define("widget.combine.factoryType", "CHK_GUBUN", "CHK_GUBUN", ecount.resource.LBL00703).popover(ecount.resource.MSG03023).end())

            .add(c.define("widget.select", "other_establish", "other_establish", ecount.resource.LBL02794).option(optionData).select(selectedValue)
                .popover(ecount.resource.MSG03027).end())

            .add(c.define("widget.combine.radioRate", "WH_VAT_RATE", "WH_VAT_RATE", ecount.resource.LBL08977).popover(ecount.resource.MSG04768).end())              //[2016.10.31 bsy] 위젯 타입 변경
            .add(c.define("widget.combine.radioRate", "WH_VAT_RATE_BY", "WH_VAT_RATE_BY", ecount.resource.LBL08978).popover(ecount.resource.MSG04769).end())        //[2016.10.31 bsy] 위젯 타입 변경
            .add(c.define("widget.code.priceGroup", "PRICE_GROUP", "PRICE_GROUP", ecount.resource.LBL06371).maxSelectCount(1).popover(ecount.resource.MSG03425).codeType(7).end()) //MSG03425
            .add(c.define("widget.code.priceGroup", "PRICE_GROUP2", "PRICE_GROUP2", ecount.resource.LBL06372).maxSelectCount(1).popover(ecount.resource.MSG03427).codeType(7).end()) //MSG03427//ecount.resource.LBL06372
            .add(c.define("widget.multiCode.whLevelGroup", "txtTreeWhCd", "txtTreeWhCd", ecount.resource.LBL07309)
                .setOptions({ label: null }).popover(ecount.resource.MSG04809)
                .end());

        contents.add(f);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var t = widget.generator.toolbar(),
            addgroup = [],
            c = widget.generator.control();
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
        if (['M'].contains(this.editFlag)) {
            t.addLeft(c.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
        } else {
            if (this.isAddGroup) {
                t.addLeft(c.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            }
            else {
                t.addLeft(c.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
            }
        }

        t.addLeft(c.define("widget.button", "Reset").label(ecount.resource.BTN00007));
        if (['M'].contains(this.editFlag)) {
            t.addLeft(c.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .css("btn btn-default")
                .addGroup(
                    [
                        {
                            id: 'use',
                            label: (this.DEL_GUBUN == "Y" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)                //Resource : 재사용, 사용중단
                        },
                        { id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));
        }
        t.addLeft(c.define("widget.button", "Close").label(ecount.resource.BTN00008));
        if (['M'].contains(this.editFlag)) {
            t.addLeft(c.define("widget.button", "History").label("H"));
        }
        footer.add(t);
    },

    /**********************************************************************     
    * event form listener [tab, content, search, popup ..](Events occurring in form)
    =>Events occurring in class parents, tab,onload, popup, search etcf
    onChangeControl, onChangeContentsTab, onLoadTabPane, onLoadComplete, onMessageHandler...     
    **********************************************************************/
    onLoadComplete: function () {
        var thisObj = this;
        for (var i = 0; i < this.contents.items[0].rows.length; i++) {
            this.ctrlList.push(this.contents.items[0].rows[i].id);
        }

        hidOldOutCust = this.LocationEdit.OUT_CUST;
        hidOldChkGubun = this.LocationEdit.CHK_GUBUN;

        var ctrlProcessCode = this.contents.getControl("CHK_GUBUN");
        //ctrlProcessCode.get(1).defaultParam.CODE_CLASS = "L03";
        //ctrlProcessCode.get(1).defaultParam.DEL_FLAG = null;

        if (this.LocationEdit.PRICE_GROUP != null && this.LocationEdit.PRICE_GROUP_DES != "") {
            this.contents.getControl("PRICE_GROUP").addCode({
                label: this.LocationEdit.PRICE_GROUP_DES, value: this.LocationEdit.PRICE_GROUP
            });
        }

        if (this.LocationEdit.PRICE_GROUP2 != null && this.LocationEdit.PRICE_GROUP_DES2 != "") {
            this.contents.getControl("PRICE_GROUP2").addCode({
                label: this.LocationEdit.PRICE_GROUP_DES2, value: this.LocationEdit.PRICE_GROUP2
            });
        }

        if (ecount.company.VAT_SITE == 'N') {
            this.contents.hideRow("other_establish");
        }

        if (this.editFlag == "M") {
            for (var i = 0; i < this.locationData.length; i++) {
                if (this.locationData[i].NM_GROUP != null)
                    this.contents.getControl("txtTreeWhCd").addCode({ label: this.locationData[i].NM_GROUP, value: this.locationData[i].CD_PARENT });
            }

            ctrlProcessCode.get(0).setValue(hidOldChkGubun)

            if (hidOldChkGubun == "1") {
                if (!$.isEmpty(this.LocationEdit.PLANT_CD) && !$.isEmpty(this.LocationEdit.PLANT_DES)) {

                    ctrlProcessCode.get(1).addCode({
                        label: this.LocationEdit.PLANT_DES, value: this.LocationEdit.PLANT_CD
                    });
                }
            }
            else if (hidOldChkGubun == "2") {
                if (!$.isEmpty(this.LocationEdit.PLANT_CD) && !$.isEmpty(this.LocationEdit.PLANT_DES)) {

                    ctrlProcessCode.get(1).addCode({
                        label: this.LocationEdit.PLANT_DES, value: this.LocationEdit.PLANT_CD
                    });
                }

                if (!$.isEmpty(this.LocationEdit.OUT_CUST) && !$.isEmpty(this.LocationEdit.OUT_CUST_DES)) {

                    ctrlProcessCode.get(2).addCode({
                        label: this.LocationEdit.OUT_CUST_DES, value: this.LocationEdit.OUT_CUST
                    });

                }
            }
            ctrlProcessCode.toggleFactoryType("change", undefined, true);
            this.contents.getControl("WH_DES").setFocus(0);
        }

        if (this.editFlag == "I") {
            if (!$.isNull(this.viewBag.InitDatas.AutoNewCode.RepeatCd) && this.viewBag.InitDatas.AutoNewCode.RepeatCd.trim() != '') {
                this.contents.getControl('WH_CD').setValue(this.viewBag.InitDatas.AutoNewCode.RepeatCd);
                this.contents.getControl("WH_DES").setFocus(0);
            } else {
                var btnCode = this.contents.getControl('WH_CD');
                thisObj.setTimeout(function () {
                    btnCode.setFocus(0);
                }, 0);
            }
            ctrlProcessCode.setValue(0);
        }
    },

    //A value that has been passed on to parents in the pop-up window control flag
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed
        //passing value to popup page from newcode
        if (page.pageID == 'CM102P') {   //pages check
            this.contents.getControl('WH_CD').setValue(message.data[0].AutoCode); //Value assignment
            message.callback && message.callback();  // The popup page is closed
            this.contents.getControl('WH_DES').setFocus(0);
        };

        if (page.pageID == 'ES013P') {
            this.contents.getControl("WH_DES").setValue(message.data);
            page.close();
            this.contents.getControl('WH_DES').onNextFocus();
        }
    },

    //Init control when this form generate
    onInitControl: function (cid, option) {
        var ctrl = widget.generator.control();
        if (cid == "WH_VAT_RATE") {

            //[2016.10.27 bsy] 공통위젯으로 변경
            //widget.combine.radioRate            
            option.value(["N", "Y", (this.LocationEdit.WH_VAT_RATE == "" ? 0 : this.LocationEdit.WH_VAT_RATE)])
                .label([ecount.resource.LBL08396, ecount.resource.LBL05716])
                .numericOnly(6, 3)
                .fixedSelect(this.LocationEdit.WH_VAT_RATE_YN == "" ? 'N' : this.LocationEdit.WH_VAT_RATE_YN)
                ;
            option.popover(ecount.resource.MSG03475);

        } else if (cid == "WH_VAT_RATE_BY") {

            //[2016.10.27 bsy] 공통위젯으로 변경
            //widget.combine.radioRate            
            option.value(["N", "Y", (this.LocationEdit.WH_VAT_RATE_BY == "" ? 0 : this.LocationEdit.WH_VAT_RATE_BY)])
                .label([ecount.resource.LBL08396, ecount.resource.LBL05716])
                .numericOnly(6, 3)
                .fixedSelect(this.LocationEdit.WH_VAT_RATE_BY_BASE_YN == "" ? 'N' : this.LocationEdit.WH_VAT_RATE_BY_BASE_YN)
                ;
            option.popover(ecount.resource.MSG03475);
        }
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id) {
            case "CHK_GUBUN_processCode":
                parameter.CODE_CLASS = "L03";
                parameter.DEL_FLAG = "N";
                break;
        }
        handler(parameter);
    },

    onPopupHandler: function (control, param, handler) {
        if (control.id == "PRICE_GROUP" || control.id == "PRICE_GROUP2") {
            param.CALL_TYPE = 102;
            param.isIncludeInactive = false;
            param.DEL_FLAG = "N";
            param.name = String.format(ecount.resource.LBL10109, control.subTitle);
            param.titlename = param.name;
        }
        else if (control.id == "txtTreeWhCd") {
            param.popupType = false;
        } else if (control.id == "History") {
            param.popupType = true;
        }
        else if (control.id == "CHK_GUBUN_processCode") {
            param.popupType = true;
            param.titlename = control.subTitle;
            param.name = String.format(ecount.resource.LBL10109, control.subTitle);
            param.custGroupCodeClass = "L03";
            param.CODE_CLASS = "L03";
            param.DEL_FLAG = "N";
            param.SID = "E040102";
            param.ispopupCloseUse = false;
        }
        else if (control.id == "CHK_GUBUN_outerFactory") {
            param.popupType = true;
            param.isCheckBoxDisplayFlag = false;
        }

        param.popupType = false;
        param.additional = false;
        handler(param); //This must be declared part
    },

    /********************************************************************** 
   * event  [button, link, FN, optiondoropdown..] 
   **********************************************************************/
    //when click on new code
    onFunctionNewCode: function (e) {
        if (!this.viewBag.InitDatas.UseAutoCode) {
            ecount.alert(String.format(ecount.resource.MSG00229, ecount.resource.LBL80063, ecount.resource.LBL30025, ecount.resource.LBL00729));
            return false;
        }
        var param = {
            autoNumberSettings: encodeURIComponent(Object.toJSON(
                [{ CODE_TYPE: "6" }]
            )),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            programSeq: "",
            programID: ""
        };
        this.openWindow({ url: '/ECERP/Popup.Search/CM102P', name: ecount.resource.BTN00541, param: param, popupType: false, additional: false });
    },

    onChangeControl: function (control, data) {
        //this._super.onChangeControl.apply(this, arguments);
    },

    ON_KEY_ENTER: function (e, target) {
        if (target != null) {
            if (target.control.id === "txtTreeWhCd" && this.footer.getControl('Save') != undefined) {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },

    // Save button click event
    onFooterSave: function (e, type) {
        debugger
        var errList = [];
        if (type == null || type == undefined)
            type = 1;
        var btnSave = this.footer.get(0).getControl("Save");
        var wh_code = this.contents.getControl('WH_CD');

        var isOk = this.fnValidCheck();

        if (!isOk) {
            btnSave.setAllowClick();
            return false;
        }

        if (this.editFlag == "I") {

            if (wh_code.getValue().trim() == "00") {
                wh_code.showError(ecount.resource.MSG00637);
                wh_code.setFocus(0);
                btnSave.setAllowClick();
                return false;
            }
        }

        if (this.userPermit == "W" || (this.userPermit == "U" && !['M'].contains(this.editFlag))) {
            var thisObj = this;
            var tree = this.contents.getControl('txtTreeWhCd').serialize().value;
            var gubun = this.contents.getControl('CHK_GUBUN').get(0).getValue();
            var invalid = this.contents.validate();
            if (invalid.result.length > 0 && invalid.result[0][0].control != undefined && invalid.result[0][0].control.id != undefined
            )
                errList.push(invalid.result[0][0].control.id);



            var saveData = function (isError, errMess) {
                if (isError) {
                    errList.push(wh_code.id);
                    wh_code.showError(errMess);
                }

                if (errList.length > 0) {
                    //Set focus to the first control that has error
                    $.each(this.ctrlList, function (index, val) {
                        if (errList.contains(val)) {
                            thisObj.setTimeout(function () {
                                thisObj.contents.getControl(val).setFocus(0);
                            }, 0);
                            return false;
                        }
                    });
                    btnSave.setAllowClick();
                    return false;
                }

                if (this.iserror.length > 0)
                    return false;

                var btnCode = thisObj.contents.getControl('WH_CD');

                var ctrlProcessCode = thisObj.contents.getControl("CHK_GUBUN");
                var OutCust = ctrlProcessCode.get(2);

                var data = {
                        editFlag: thisObj.editFlag == "I" ? "01" : "02",
                        CD_PARENT: tree,
                        CD_GROUP: ['M'].contains(thisObj.editFlag) ? thisObj.WH_CD : btnCode.getValue(),
                        OLD_OUT_CUST: hidOldOutCust,
                        OLD_CHK_GUBUN: hidOldChkGubun,
                        objSave: {
                            WH_CD: ['M'].contains(thisObj.editFlag) ? thisObj.WH_CD : btnCode.getValue(),
                            WH_DES: thisObj.contents.getControl('WH_DES').getValue(),
                            CHK_GUBUN: gubun,
                            PLANT_CD: gubun != "0" ? ctrlProcessCode.get(1).getSelectedCode()[0] : "",
                            CUST: thisObj.contents.getControl('other_establish').getValue(),
                            OUT_CUST: gubun == "2" ? ctrlProcessCode.get(2).getSelectedCode()[0] : "",
                            PLANT_DES: gubun != "0" ? ctrlProcessCode.get(1).getSelectedLabel()[0] : "",
                            PRICE_GROUP: thisObj.contents.getControl('PRICE_GROUP').getSelectedCode()[0],
                            PRICE_GROUP2: thisObj.contents.getControl('PRICE_GROUP2').getSelectedCode()[0],

                            //[2016.10.31 bsy] 세로줄 위젯 변경에 따른 처리 

                            WH_VAT_RATE_BY: thisObj.contents.getControl('WH_VAT_RATE_BY').getValue()[1],
                            WH_VAT_RATE: thisObj.contents.getControl('WH_VAT_RATE').getValue()[1],
                            WH_VAT_RATE_BY_BASE_YN: thisObj.contents.getControl('WH_VAT_RATE_BY').getValue()[0],
                            WH_VAT_RATE_YN: thisObj.contents.getControl('WH_VAT_RATE').getValue()[0],

                            YYYYMM: thisObj.viewBag.LocalTime,
                        }
                };

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/SaveSale001Location",
                    data: Object.toJSON(data),
                    complete: function () {
                        btnSave.setAllowClick();
                        return false;
                    },
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else if (result.Data == "Y") {
                            if (thisObj.editFlag == "I") {
                                btnCode.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL02721));
                                btnCode.setFocus(0);
                                return;
                            }
                            else if (thisObj.editFlag == "M") {
                                if (gubun == "2") {
                                    OutCust.showError(ecount.resource.MSG05588);
                                    OutCust.setFocus(0);
                                }
                                else {
                                    ecount.alert(ecount.resource.MSG05588);
                                }

                                return;
                            }
                        } else if (result.Data == "3") {
                            ecount.alert(ecount.resource.MSG04919);
                            return;
                        } else {
                            var params = {
                                sStatus: "reload",
                                WH_CD: ['M'].contains(thisObj.editFlag) ? thisObj.WH_CD : btnCode.getValue(),
                                WH_DES: thisObj.contents.getControl('WH_DES').getValue(),
                            };

                            thisObj.sendMessage(thisObj, params);
                            if (type == 1) {
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                            else {
                                var param = {
                                    DEL_GUBUN: ['I'].contains(thisObj.editFlag) ? "N" : thisObj.DEL_GUBUN,
                                };

                                if (type == '2') {
                                    param.editFlag = 'I'
                                    param.isAddGroup = true,
                                        param.SAVE_WH_CD = ['M'].contains(thisObj.editFlag) ? thisObj.WH_CD : btnCode.getValue()
                                }
                                else {
                                    param.editFlag = 'M'
                                    param.WH_CD = ['M'].contains(thisObj.editFlag) ? thisObj.WH_CD : btnCode.getValue()
                                }
                                thisObj.onAllSubmitSelf('/ECERP/ESA/ESA006M', param);
                            }
                        }
                    }
                });
            }

            //check data is not null
            if (this.editFlag == 'I') {
                this.fnCheckCode(wh_code.getValue(), saveData.bind(this));
            } else {
                saveData.call(this, false, '');
            }
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93292, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }
    },

    //Check valid code
    fnCheckCode: function (sCode, callback) {
        if (sCode == '')
            callback(false, '');
        else if (sCode == '00')
            callback(true, ecount.resource.MSG00048);
        else {
            ecount.common.api({
                url: "/SVC/Inventory/Basic/CheckExistSale001",
                data: Object.toJSON({ WH_CD: sCode }),
                success: function (result) {
                    if (result.Status != "200")
                        callback(true, result.fullErrorMsg);
                    else if (result.Data == '1')
                        callback(true, String.format(ecount.resource.MSG08770, ecount.resource.LBL02721));
                    else
                        callback(false, '');
                }
            });
        }
    },

    //Save and New button click even
    onButtonSaveNew: function (e) {
        this.onFooterSave(e, 2);
    },

    //Save and New button click even
    onButtonSaveReview: function (e) {
        this.onFooterSave(e, 3);
    },

    // Reactivate button click event
    onButtonUse: function (e) {
        var btnReactivate = this.footer.get(0).getControl("deleteRestore");
        var key = [];
        if (this.userPermit == "W") {
            var thisObj = this;

            key.push({
                DEL_GUBUN: this.DEL_GUBUN == "Y" ? 'N' : 'Y',
                WH_CD: this.contents.getControl('WH_CD').getLabel()
            });
            var data = { Data: key };

    
            ecount.common.api({
                url: "/SVC/Inventory/Basic/UpdateListStateSale001Location",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    }
                    else {
                        thisObj.sendMessage(thisObj, {});
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    }
                },
                complete: function (e) {
                    btnReactivate.setAllowClick();
                }
            });
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnReactivate.setAllowClick();
            return false;
        }
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Delete button click event
    onButtonDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");

        //CHECK PERMISION ON DELETE
        if (this.userPermit == "W") {
            //var formdata = { WH_CD: this.contents.getControl('WH_CD').getLabel(), YYYYMM: viewBag.LocalTime };
            thisobject = this;

            //선택삭제시에도 사용해야하기 때문에 배열형식로 보내주세요.
            var data = [];
            data.push(this.contents.getControl('WH_CD').getLabel());

            var formdata = {

                    MENU_CODE: "LocationCode",      //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                    CHECK_TYPE: "S",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                    DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                    PARAMS: data

            };

            ecount.confirm(ecount.resource.MSG00299, function (status) {
                if (status === true) {
                    ecount.common.api({
                        url: "/SVC/Inventory/Basic/DeleteSale001Location",
                        data: Object.toJSON(formdata),
                        success: function (result) {
                            if (result.Status != "200") {
                                alert(result.fullErrorMsg);
                            }
                            else if (result.Data != null && result.Data != "") {
                                thisobject.ShowNoticeNonDeletable(result.Data);
                            }
                            else {
                                thisobject.sendMessage(thisobject, {});
                                thisobject.setTimeout(function () {
                                    thisobject.close();
                                }, 0);
                            }
                        },
                        complete: function (e) {
                            btnDelete.setAllowClick();
                        }
                    });
                }
                else {
                    btnDelete.setAllowClick();
                }
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02718, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }
    },

    // Rest button click event
    onFooterReset: function (e) {
        var whCD = this.SAVE_WH_CD != null ? this.SAVE_WH_CD : this.WH_CD

        if ($.isEmpty(whCD)) {
            var txtWH_CD = this.contents.getControl("WH_CD");
            var txtWH_DES = this.contents.getControl('WH_DES');

            if (['I'].contains(this.editFlag)) {

                this.contents.getControl('CHK_GUBUN').get(0).reset();
                this.contents.getControl('CHK_GUBUN').get(1).reset();
                //this.contents.getControl('CHK_GUBUN').get(1).hide();
                this.contents.getControl('CHK_GUBUN').get(0).setValue(0);

                txtWH_CD.reset();
                txtWH_DES.reset();

                this.contents.getControl('other_establish').reset();
                this.contents.getControl('WH_VAT_RATE').reset();
                this.contents.getControl('WH_VAT_RATE_BY').reset();
                this.contents.getControl('PRICE_GROUP').reset();
                this.contents.getControl('PRICE_GROUP2').reset();
                this.contents.getControl('txtTreeWhCd').reset();

                if (this.viewBag.InitDatas.UseAutoCode) {
                    var data = {
                        IsView: true,
                        CodeType: 6,
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
                            else if (result.Data && result.Data != '') {
                                txtWH_CD.setValue(result.Data);
                                txtWH_DES.setFocus(0);
                            } else {
                                txtWH_CD.setFocus(0);
                            }
                        }
                    });
                } else {
                    txtWH_CD.setFocus(0);
                }
            } else {
                txtWH_DES.setValue('');
                txtWH_DES.setFocus(0);
            }
        }
        else {
            var param = {
                WH_CD: whCD,
                editFlag: 'M',
                DEL_GUBUN: this.DEL_GUBUN,
            };

            this.onAllSubmitSelf('/ECERP/ESA/ESA006M', param);
        }

    },

    // Hosty button click event
    onFooterHistory: function (e) {
        var param = {
            lastEditTime: this.LocationEdit.WDATE,
            lastEditId: this.LocationEdit.UNAME,
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            width: 450,
            height: 150
        };
        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    fnValidCheck: function () {

        var ctrlProcessCode = this.contents.getControl("CHK_GUBUN");

        if (ctrlProcessCode.get(0).getValue() == "1" && $.isEmpty(ctrlProcessCode.get(1).getValue())) // PROCESS_CODE
        {
            ctrlProcessCode.get(1).showError(ecount.resource.MSG00126);
            ctrlProcessCode.get(1).setFocus(0);
            return false;
        }

        if (ctrlProcessCode.get(0).getValue() == "2" && ($.isEmpty(ctrlProcessCode.get(1).getValue()) || $.isEmpty(ctrlProcessCode.get(2).getValue()))) { // PROCESS_CODE || out_cust
            if ($.isEmpty(ctrlProcessCode.get(2).getValue())) {
                ctrlProcessCode.get(2).showError(ecount.resource.MSG04449)
                ctrlProcessCode.get(2).setFocus(0);
            }
            else {
                ctrlProcessCode.get(1).showError(ecount.resource.MSG00126);
                ctrlProcessCode.get(1).setFocus(0);
            }
            return false;
        }

        return true;
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