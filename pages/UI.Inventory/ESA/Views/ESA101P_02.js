window.__define_resource && __define_resource("LBL09022","LBL35862","LBL00960","LBL01155","LBL03495","LBL02920","MSG03033","MSG02140","LBL06451","LBL02813","LBL02238","MSG01136","LBL00754","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL01249","LBL02513","LBL02512","BTN00065","BTN00765","BTN00067","BTN00008","BTN00033","BTN00204","BTN00203","BTN00007","MSG00299","BTN00373","LBL07157","LBL06423","MSG00676");
/****************************************************************************************************
1. Create Date : 2015.09.23
2. Creator     : 조영상
3. Description : 제고1 > 기초등록 > 품목그룹별 등록, 수정 팝업창
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA101P_02", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.permit = this.viewBag.Permission.permitESA101;
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header, resource) {

        header.notUsedBookmark();

        // 타입구분 editFlag : I(등록) / M(수정)
        header.setTitle(this.editFlag == "I" ? ecount.resource.LBL09022 + ecount.resource.LBL35862 : ecount.resource.LBL09022 + ecount.resource.LBL00960 + ecount.resource.LBL01155);
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        
        var g = widget.generator,
        toolbar = g.toolbar(),
        ctrl = g.control(),
        form1 = g.form();

        form1.template("register")
        
        // 신규 등록 일 경우
        if (['I'].contains(this.editFlag)) {

            // 품목그룹코드
            form1.add(ctrl.define("widget.multiCode.prodGroup", this.CLASS_GUBUN == "1" ? "txtClassCd1" : this.CLASS_GUBUN == "2" ? "txtClassCd2" : "txtClassCd3", "CLASS_CD", ecount.resource.LBL03495)
                 .popover("품목그룹코드를 입력합니다.")
                 .dataRules(["required"], "품목그룹코드를 입력합니다.")
                 .maxSelectCount(1)
                 .end());

            // 특별단가
            form1.add(ctrl.define("widget.multiCode.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL02920)
                 .popover(ecount.resource.MSG03033)
                 .dataRules(["required"], ecount.resource.MSG02140)
                 .maxSelectCount(1).end())   

            // 단가기준
            form1.add(ctrl.define("widget.select", "PRICE_GUBUN", "PRICE_GUBUN", ecount.resource.LBL06451)
                 .option([
                        ["O", ecount.resource.LBL02813],
                        ["I", ecount.resource.LBL02238],
                        ["A", 'A' + ecount.resource.LBL00960],
                        ["B", 'B' + ecount.resource.LBL00960],
                        ["C", 'C' + ecount.resource.LBL00960],
                        ["D", 'D' + ecount.resource.LBL00960],
                        ["E", 'E' + ecount.resource.LBL00960],
                        ["F", 'F' + ecount.resource.LBL00960],
                        ["G", 'G' + ecount.resource.LBL00960],
                        ["H", 'H' + ecount.resource.LBL00960],
                        ["9", '9' + ecount.resource.LBL00960],
                        ["G", 'G' + ecount.resource.LBL00960]]
                        )
                 .popover("단가기준을 입력합니다.")
                 .select(0)
                 .end());

            // 조정 비율
            form1.add(ctrl.define("widget.input", "PRICE_RATE", "PRICE_RATE", "조정_비율(%)")
                 .value('')
                 .popover("조정비율을 입력합니다.")
                 .dataRules(["required"], "조정비율을 입력합니다.")
                 .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                 .numericOnly(18, 5)
                 .end())

            // 조정 단위처리 레이어영역
            form1.add(ctrl.define("widget.custom", "CUSTOM_LAYER", "CUSTOM_LAYER", "조정_단위처리")
                 .end());
        }
        else
        {

            // 품목그룹코드
            form1.add(ctrl.define("widget.label", "CLASS_CD", "CLASS_CD", ecount.resource.LBL03495)
                .label(this.viewBag.InitDatas.GridFirstLoad[0].CLASS_CD)
                .readOnly()
                .end());

            // 품목그룹명
            form1.add(ctrl.define("widget.label", "CLASS_DES", "CLASS_DES", ecount.resource.LBL00754)
                .label(this.viewBag.InitDatas.GridFirstLoad[0].CLASS_DES)
                .readOnly()
                .end());

            // 특별단가
            form1.add(ctrl.define("widget.multiCode.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL02920)
                 .popover(ecount.resource.MSG03033)
                 .dataRules(["required"], ecount.resource.MSG02140)
                 .addCode({ label: this.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS_DES, value: this.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS})
                 .maxSelectCount(1).end())

            // 단가기준
            form1.add(ctrl.define("widget.select", "PRICE_GUBUN", "PRICE_GUBUN", ecount.resource.LBL06451)
                 .option([
                        ["O", ecount.resource.LBL02813],
                        ["I", ecount.resource.LBL02238],
                        ["A", 'A' + ecount.resource.LBL00960],
                        ["B", 'B' + ecount.resource.LBL00960],
                        ["C", 'C' + ecount.resource.LBL00960],
                        ["D", 'D' + ecount.resource.LBL00960],
                        ["E", 'E' + ecount.resource.LBL00960],
                        ["F", 'F' + ecount.resource.LBL00960],
                        ["G", 'G' + ecount.resource.LBL00960],
                        ["H", 'H' + ecount.resource.LBL00960],
                        ["9", '9' + ecount.resource.LBL00960],
                        ["G", 'G' + ecount.resource.LBL00960]]
                        )
                 .popover("단가기준을 입력합니다.")
                 .select(this.viewBag.InitDatas.GridFirstLoad[0].PRICE_GUBUN)
                 .end());

            // 조정 비율
            form1.add(ctrl.define("widget.input", "PRICE_RATE", "PRICE_RATE", "조정_비율(%)")
                 .value(this.viewBag.InitDatas.GridFirstLoad[0].PRICE_RATE)
                 .popover("조정비율을 입력합니다.")
                 .dataRules(["required"], "조정비율을 입력합니다.")
                 .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                 .numericOnly(18, 5)
                 .end())

            // 조정 단위처리 레이어영역
            form1.add(ctrl.define("widget.custom", "CUSTOM_LAYER", "CUSTOM_LAYER", "조정_단위처리")
                 .end());
        }

        contents.add(form1);
    },

    onInitControl: function (cid, control) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        ctrl = g.control()

        if (cid == "CUSTOM_LAYER") {
            control.columns(6, 6)
            .addControl(ctrl.define("widget.select", "PRICE_LESS", "PRICE_LESS")
                .option([
                        ['1000000.0000000000', ecount.resource.LBL00097],
                        ['100000.0000000000', ecount.resource.LBL00096],
                        ['10000.0000000000', ecount.resource.LBL00095],
                        ['1000.0000000000', ecount.resource.LBL00094],
                        ['100.0000000000', ecount.resource.LBL00093],
                        ['10.0000000000', ecount.resource.LBL00084],
                        ['1.0000000000', ecount.resource.LBL00085],
                        ['0.1000000000', ecount.resource.LBL00086],
                        ['0.0100000000', ecount.resource.LBL00087],
                        ['0.0010000000', ecount.resource.LBL00088]]
                       )
                .select((this.viewBag.InitDatas.GridFirstLoad == null) ? 0 : this.viewBag.InitDatas.GridFirstLoad[0].PRICE_LESS))
            .addControl(ctrl.define("widget.select", "PRICE_RISE", "PRICE_RISE")
                .option([
                        ['R', ecount.resource.LBL01249],
                        ['C', ecount.resource.LBL02513],
                        ['F', ecount.resource.LBL02512]]
                       )
                .select(((this.viewBag.InitDatas.GridFirstLoad == null) ? 0 : this.viewBag.InitDatas.GridFirstLoad[0].PRICE_RISE))
                );
        }
        
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var infoData = this.viewBag.InitDatas;
        var permit = this.viewBag.Permission.permit;
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        // 수정일 경우
        if (["M"].contains(this.editFlag)) {

            // 저장
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([
               { id: "SaveNew", label: ecount.resource.BTN00765 },
               { id: "SaveContents", label: ecount.resource.BTN00067 },
            ]).clickOnce());

            // 닫기
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

            // 삭제
            if (this.viewBag.InitDatas.GridFirstLoad[0].USE_YN == "Y")
            {
                toolbar.addLeft(ctrl.define("widget.button.group", "Delete").label(ecount.resource.BTN00033).addGroup([
                { id: "DeActivate", label: ecount.resource.BTN00204 }, // 사용중단
                ]).clickOnce());
            }
            else
            {
                toolbar.addLeft(ctrl.define("widget.button.group", "Delete").label(ecount.resource.BTN00033).addGroup([
                { id: "ReActivate", label: ecount.resource.BTN00203 }, // 재사용
                ]).clickOnce());
            }

            // 히스토리
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }
        // 추가일 경우
        else
        {
            // 저장
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([
                { id: "SaveNew", label: ecount.resource.BTN00765 },
                { id: "SaveContents", label: ecount.resource.BTN00067 },
            ]).clickOnce());

            // 다시 작성
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));

            // 닫기
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }

        footer.add(toolbar);
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        config.additional = false;

        // 품목 그룹 코드
        if (control.id === "txtClassCd1" || control.id === "txtClassCd2" || control.id === "txtClassCd3") {  // product group
            config.isApplyDisplayFlag = true;       // apply 
            config.isCheckBoxDisplayFlag = true;    // checkbox
            config.isIncludeInactive = true;        // 

        }
            // 특별 단가
        else if (control.id == "CODE_CLASS") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
        }

        handler(config);
    },

    // 저장
    onFooterSave: function (e) {
        this.fnSave(e, false, (this.viewBag.InitDatas.GridFirstLoad == null) ? "Y" : this.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    // 저장/신규
    onButtonSaveNew: function (e) {
        this.fnSave(e, false, (this.viewBag.InitDatas.GridFirstLoad == null) ? "Y" : this.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    // 저장/내용유지
    onButtonSaveContents: function (e) {
        this.fnSave(e, false, (this.viewBag.InitDatas.GridFirstLoad == null) ? "Y" : this.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    // 다시작성
    onFooterReset: function () {
        this.contents.reset();
        this.contents.getControl("CUSTOM_LAYER").get(0).setValue("1000000.0000000000");
        this.contents.getControl("CUSTOM_LAYER").get(1).setValue("R");
    },

    // 닫기
    onFooterClose: function () {
        this.close();
    },

    // 삭제
    onFooterDelete : function(e){

        var thisObj = this;
        var btn = thisObj.footer.get(0).getControl("Delete");
        var formdata = this.contents.serialize().merge();//new feature
   
        var data = {
            CLASS_CD: formdata.CLASS_CD.trim(),
            CODE_CLASS: formdata.CODE_CLASS.trim()
        };

        var ctrl = this.contents.getControl("txtCode");

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeletePriceLevelGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {

                            thisObj.sendMessage(thisObj, "Delete");
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);

                        }
                    },
                    complete: function () { btn.setAllowClick(); }
                });
            } else { btn.setAllowClick(); }
        });
    },

    // 사용중단
    onButtonDeActivate: function(e){
        this.fnSave(e, false, 'N');
    },

    // 재사용
    onButtonReActivate: function(e){
        this.fnSave(e, false, 'Y');
    },

    // 히스토리
    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.GridFirstLoad[0].WDATE,
            lastEditId: this.viewBag.InitDatas.GridFirstLoad[0].WID,
            parentPageID: this.pageID,  //(Pop-up when this must be declared part)
            popupType: true,             //(Pop-up when this must be declared part)
            responseID: this.callbackID  //(Pop-up when this must be declared part)
        }
        //ecount.popup.openWindow('/ECERP/Popup.Search/CM100P_31', this.resource.BTN00373, param, true);

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false
        })
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.fnSave(e, false, (this.viewBag.InitDatas.GridFirstLoad == null) ? "Y" : this.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

    fnSave: function (e, isSaveNew, isUse) {

        var btn = this.footer.get(0).getControl("Save");

        if (this.permit.Value == "R" || (this.permit.Value == "U" && this.editFlag == "M")) {

            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06423, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var thisObj = this;
        var formdata = this.contents.serialize().merge();//new feature

        var ctrl_Code = this.contents.getControl("CODE_CLASS");
    
        var class_cd, code_class, price_gubun, price_less, price_rate, price_rise;

        class_cd = formdata.CLASS_CD.trim();
        code_class = formdata.CODE_CLASS.trim();
        price_gubun = formdata.PRICE_GUBUN.trim();
        price_less = formdata.PRICE_LESS.trim();
        price_rate = formdata.PRICE_RATE.trim();
        price_rise = formdata.PRICE_RISE.trim();
    

        var data = {
            CLASS_CD: class_cd,
            CODE_CLASS: code_class,
            PRICE_GUBUN: price_gubun,
            PRICE_RATE: price_rate,
            PRICE_LESS: price_less,
            PRICE_RISE: price_rise,
            USE_YN: isUse
        }
        var Flag = "N";
        var invalid = this.contents.validate();
            //If user entried data, call to API to check the item existed or not

        if (invalid.result.length > 0)
        {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return;
        }
        
        if (this.editFlag == "I") {
            ecount.common.api({
                url: "/Inventory/Basic/InsertPriceLevelGroup",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        console.log(result.Data);
                        if (result.Data == "99") {
                            ctrl_Code.showError(ecount.resource.MSG00676);
                            ctrl_Code.setFocus(0);
                        }
                        else
                        {
                            thisObj.sendMessage(thisObj, "Save");

                            if (!isSaveNew) {
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                        }
                    }
                },
                complete: function () {
                    btn.setAllowClick();
                }
            });
        }
        else if(this.editFlag == "M")
        {
            ecount.common.api({
                url: "/Inventory/Basic/UpdateStatusPriceLevel",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        console.log(result.Data);
                        thisObj.sendMessage(thisObj, "Save");

                        if (!isSaveNew) {
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
    }
});