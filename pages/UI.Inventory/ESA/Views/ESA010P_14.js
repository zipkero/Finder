window.__define_resource && __define_resource("LBL13109","LBL13102","LBL13104","MSG07685","LBL13106","LBL08582","MSG07686","LBL13110","LBL08583","MSG07687","BTN00065","BTN00008","MSG00071","LBL02987","MSG00408","LBL07157","MSG00150");
/****************************************************************************************************
1. Create Date : 2017.12.07
2. Creator     : 임명식
3. Description : 다규격품목코드 생성 기본값(multi size prod create default value)
4. Precaution  :
5. History     :  2018.09.17 bsy: [A18_02078] 다규격 품목등록 시, 규격코드를 5개 이상
                  [2019.07.02][On Minh Thien] A19_02182 - 특수문자 제한 및 치환 로직변경 (다규격품목)
                  
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_14", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    EditFlag: "I",

    defaultResult: null,

    groupCdOrigin: {},

    EditorId: "",

    EditorDt: "",
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        debugger
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.permitProd = this.viewBag.Permission.prod;
    },

    initProperties: function () {
        this.defaultResult = {
            SIZE_GROUP_CODE1: "",
            SIZE_GROUP_DES1: "",
            SIZE_CODE_J1: "",
            SIZE_GROUP_CODE2: "",
            SIZE_GROUP_DES2: "",
            SIZE_CODE_J2: "",
            SIZE_GROUP_CODE3: "",
            SIZE_GROUP_DES3: "",
            SIZE_CODE_J3: "",
            PROD_SIZE_TYPE: "P",
            PROD_DIV_SIGN1: "",
            PROD_DIV_SIGN2: "",
            PROD_DIV_SIGN3: "",
            PROD_DIV_SIGN4: "",
            CLASS_DIV_SIGN1: "",
            CLASS_DIV_SIGN2: "",
            CLASS_DIV_SIGN3: "",
            CLASS_DIV_SIGN4: "",
            CODE_NO_DES1: "",
            CODE_NO_DES2: "",
            CODE_NO_DES3: "",
        };
    },

    render: function () {
        this._super.render.apply(this);
        this.EditFlag = $.isEmpty(this.viewBag.InitDatas.MultiSzieProdDefaultSetting) ? "I" : "M";
        if (this.viewBag.InitDatas != null && this.viewBag.InitDatas.MultiSzieProdDefaultSetting) {
            this.EditorId = this.viewBag.InitDatas.MultiSzieProdDefaultSetting.EDITOR_ID;
            this.EditorDt = this.viewBag.InitDatas.MultiSzieProdDefaultSetting.EDIT_DT;
        }
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(resource.LBL13109);
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var self = this;
        var generator = widget.generator,
            ctrl = generator.control(),
            toolbar = generator.toolbar(),
            form = generator.form(),
            controls = new Array(),
            grid = generator.grid();

        var defVal = this.viewBag.InitDatas.MultiSzieProdDefaultSetting || this.defaultResult;

        this.groupCdOrigin = [
            { value: "", label: "" },
            { value: defVal.SIZE_GROUP_CODE1 || "", label: defVal.SIZE_GROUP_DES1 || "" },
            { value: defVal.SIZE_GROUP_CODE2 || "", label: defVal.SIZE_GROUP_DES2 || "" },
            { value: defVal.SIZE_GROUP_CODE3 || "", label: defVal.SIZE_GROUP_DES3 || "" },
        ];
        for (var i = 1; i < 4; i++) {
            var fieldId = String.format("SIZE_GROUP_CD{0}", i.toString()),
                sizeGroupVal = defVal[String.format("SIZE_GROUP_CODE{0}", i.toString())],
                sizeGroupDesVal = defVal[String.format("SIZE_GROUP_DES{0}", i.toString())],
                sizeCodeVal = defVal[String.format("SIZE_CODE_J{0}", i.toString())];
            controls.push(ctrl.define("widget.combine.singleAndMultiCode", fieldId, fieldId, String.format(ecount.resource.LBL13102 + "/" + ecount.resource.LBL13104, i.toString())) //그룹코드1/규격코드1
                 .setOptions({
                     singleCodeTypeName: "widget.code.prodSize",   //싱글코드타입
                     multiCodeTypeName: "widget.multiCode.prodSizeCd",  //멀티코드타입
                     multiCodeTypeOption: { checkMaxCount: 1000 },
                     singleCodeType: 7
                 })
                .setErrorPlacement(i == 1 ? "bottom" : "auto")
                .popover(ecount.resource.MSG07685)
                .codeType(1)
                .fixedSelect($.isEmpty(sizeGroupVal) ? null : [{ value: sizeGroupVal, label: sizeGroupDesVal }, (!$.isEmpty(sizeCodeVal) ? JSON.parse(sizeCodeVal) : [])])
                .singleCell().end());

        }

        controls.push(ctrl.define("widget.combine.separator", "PROD_DIV_SIGN", "PROD_DIV_SIGN", ecount.resource.LBL13106) //품목코드구분기호   
            .label([ecount.resource.LBL08582 + ":&nbsp;", String.format(ecount.resource.LBL13104 + ":&nbsp;", "1"), String.format(ecount.resource.LBL13104 + ":&nbsp;", "2"), String.format(ecount.resource.LBL13104 + ":&nbsp;", "3")])    //라벨 4개 값
            .value([defVal.PROD_DIV_SIGN1, defVal.PROD_DIV_SIGN2, defVal.PROD_DIV_SIGN3, defVal.PROD_DIV_SIGN4])   //인풋 4개 값
            .popover(ecount.resource.MSG07686)
            .singleCell().end());

        controls.push(ctrl.define("widget.combine.radioSeparator", "DES_DIV_SIGN", "DES_DIV_SIGN", ecount.resource.LBL13110)
            .label([ecount.resource.LBL08583 + ":&nbsp;", String.format(ecount.resource.LBL13104 + ":&nbsp;", "1"), String.format(ecount.resource.LBL13104 + ":&nbsp;", "2"), String.format(ecount.resource.LBL13104 + ":&nbsp;", "3")])
            .value([defVal.CLASS_DIV_SIGN1, defVal.CLASS_DIV_SIGN2, defVal.CLASS_DIV_SIGN3, defVal.CLASS_DIV_SIGN4])
            .fixedSelect(defVal.PROD_SIZE_TYPE || "P")   //배열로 input값까지 싹 주셔도 됩니다.
            .popover(ecount.resource.MSG07687)
            .setOptions({
                inputType: "P" == defVal.PROD_SIZE_TYPE ? "codeName" : "general"
            })
            .end());

        form.useInputForm();
        form.setColSize(1);
        form.addControls(controls);
        contents.add(form);
    },
    onInitControl: function (cid, control) {
        var ctrl = widget.generator.control();
        var resource = ecount.resource;
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        footer.add(toolbar);
    },

    /**********************************************************************


    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl("SIZE_GROUP_CD1").setFocus(0);
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/


    onChangeControl: function (control, data, command) {
        switch (control.cid) {
            case "SIZE_GROUP_CD1_code": // 품목규격 
            case "SIZE_GROUP_CD2_code": // 품목규격 
            case "SIZE_GROUP_CD3_code": // 품목규격 
                var reId = control.cid.replace("_code", ""),
                    num = $.parseNumber(reId.right(reId.length - 2) || "1");
                if ($.isEmpty(this.contents.getControl(reId).getValue()[0]) || $.isEmpty(this.contents.getControl(reId).getValue()[0][0].value)) {
                    this.groupCdOrigin[num].value = '';
                    this.groupCdOrigin[num].label = '';
                    this.contents.getControl(reId).get(1).removeAll();
                }
                break;
        }
    },

    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    // 위젯 연동 팝업이 뜨기전에 호출되는 콜백
    onPreInitPopupHandler: function (control, keyword, config, response) {
        //switch (control.id) {
        //    case "SIZE_GROUP_CD1": // 품목규격                                
        //        return false;
        //        break;
        //}

        return true;
    },
    //MSG00071 같은 코드가 이미 등록되어 있습니다. 
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;

        switch (control.id) {
            case "SIZE_GROUP_CD1_code": // 품목규격 
            case "SIZE_GROUP_CD2_code": // 품목규격 
            case "SIZE_GROUP_CD3_code": // 품목규격 
                var reId = control.id.replace("_code", "");
                if (this.codeSelectCheck(true, reId.right(reId.length - 2)) == false) {
                    return false;
                }
                config.DEL_FLAG = "N";
                config.PARAM = "";
                break;
            case "SIZE_GROUP_CD1_multiCode": // 품목규격 
            case "SIZE_GROUP_CD2_multiCode": // 품목규격 
            case "SIZE_GROUP_CD3_multiCode": // 품목규격 
                var reId = control.id.replace("_multiCode", "");
                if (this.codeSelectCheck(false, reId.right(reId.length - 2)) == false) {
                    return false;
                }
                var code = this.contents.getControl("SIZE_GROUP_CD" + reId.right(reId.length - 2).toString()).getValue()[0];

                config.ListFlag = "Search";
                config.CODE_CLASS = code[0].value;
                config.DEL_FLAG = "N";
                config.PARAM = "";
                config.isApplyDisplayFlag = true;
                config.isNewDisplayFlag = true;
                break;

        }
        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id) {
            case "SIZE_GROUP_CD1_code": // 품목규격 
            case "SIZE_GROUP_CD2_code": // 품목규격 
            case "SIZE_GROUP_CD3_code": // 품목규격 
                var reId = control.id.replace("_code", "");
                if (this.codeSelectCheck(true, reId.right(reId.length - 2)) == false) {
                    return false;
                }
                parameter.DEL_FLAG = "N";
                parameter.PARAM = keyword;
                break;
            case "SIZE_GROUP_CD1_multiCode": // 품목규격 
            case "SIZE_GROUP_CD2_multiCode": // 품목규격 
            case "SIZE_GROUP_CD3_multiCode": // 품목규격 
                var reId = control.id.replace("_multiCode", "");
                if (this.codeSelectCheck(false, reId.right(reId.length - 2)) == false) {
                    return false;
                }
                var code = this.contents.getControl("SIZE_GROUP_CD" + reId.right(reId.length - 2).toString()).getValue()[0];

                parameter.ListFlag = "Search";
                parameter.CODE_CLASS = code[0].value;
                parameter.DEL_FLAG = "N";
                parameter.PARAM = keyword;
                parameter.isApplyDisplayFlag = true;
                parameter.isNewDisplayFlag = true;
                break;
        }
        handler(parameter);
    },

    onMessageHandler: function (page, message) {
        var self = this;
        switch (page.pageID) {
            //규격그룹ㄴ
            case 'ES019P':
                var reId = page.controlID.replace("_code", ""),
                    num = $.parseNumber(reId.right(reId.length - 2) || "1"),
                    groupCtl = this.contents.getControl(reId);

                if (this.groupCdOrigin.any(function (item, i) { return i != num && (item.value).toUpperCase() == message.data.CODE_CLASS.toUpperCase(); })) {
                    groupCtl.showError(ecount.resource.MSG00071);
                    groupCtl.setFocus(0);
                    groupCtl.get(0).removeAll();
                    groupCtl.setValue([this.groupCdOrigin[num]]);
                } else if (this.groupCdOrigin[num].value.toUpperCase() != message.data.CODE_CLASS.toUpperCase()) {
                    groupCtl.get(1).removeAll();
                    this.groupCdOrigin[num].value = message.data.CODE_CLASS;
                    this.groupCdOrigin[num].label = message.data.CLASS_DES;
                }
                break;
        }
    },


    //저장버튼
    onFooterSave: function (e) {

        //// 권한체크
        //if (this.EditFlag == "M") {  // 수정 저장은 모든 권한이 있을때만 가능
        //    if (this.viewBag.Permission.prod.Value != "W") {
        //        var msgdto = ecount.common.getAuthMessage("", [{
        //            MenuResource: ecount.resource.LBL02987, PermissionMode: "U"
        //        }]);
        //        ecount.alert(msgdto.fullErrorMsg);              
        //        return;
        //    }
        //}

        //if (!this.viewBag.Permission.prod.CW) {
        //    var msgdto = ecount.common.getAuthMessage("", [{
        //        MenuResource: ecount.resource.LBL02987, PermissionMode: "W"
        //    }]);
        //    ecount.alert(msgdto.fullErrorMsg);          
        //    return;

        //}
        invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            targetControl = invalid.result[0][0].control;

            targetControl.setFocus(0);
            return false;
        }
        var self = this,
            contentsParam = $.extend({}, this.contents.serialize().result),
            saveUrl = this.EditFlag == "I" ? "/Inventory/Basic/InsertStcoMultiClassProdConfig" : "/Inventory/Basic/UpdateStcoMultiClassProdConfig",
            groupCode = [null, this.contents.getControl("SIZE_GROUP_CD1"), this.contents.getControl("SIZE_GROUP_CD2"), this.contents.getControl("SIZE_GROUP_CD3")];


        //if ($.isEmpty(contentsParam.SIZE_GROUP_CD1_code) && $.isEmpty(contentsParam.SIZE_GROUP_CD2_code) && $.isEmpty(contentsParam.SIZE_GROUP_CD3_code)) {
        //    groupCode[1].showError(ecount.resource.MSG00408);
        //    groupCode[1].setFocus(0);
        //    return false;
        //}

        for (var i = 1; i < 4; i++) {
            var sizeGroupCode = contentsParam[String.format("SIZE_GROUP_CD{0}_code", i.toString())];
            //if (!$.isEmpty(sizeGroupCode) && $.isEmpty(contentsParam[String.format("SIZE_GROUP_CD{0}_multiCode", i.toString())])) {
            //    groupCode[i].showError(ecount.resource.MSG00408);
            //    groupCode[i].setFocus(1);
            //    return false;
            //}

            if (i > 1 && (!$.isEmpty(sizeGroupCode)) && $.isEmpty(contentsParam[String.format("SIZE_GROUP_CD{0}_code", (i - 1).toString())])) {
                groupCode[i - 1].showError(ecount.resource.MSG00408);
                groupCode[i - 1].setFocus(0);
                return false;
            }
        }

        var formData = Object.toJSON({
            CODE_CLASS1: contentsParam.SIZE_GROUP_CD1_code,
            CODE_NO_DES1: contentsParam.SIZE_GROUP_CD1_multiCode,
            CODE_CLASS2: contentsParam.SIZE_GROUP_CD2_code,
            CODE_NO_DES2: contentsParam.SIZE_GROUP_CD2_multiCode,
            CODE_CLASS3: contentsParam.SIZE_GROUP_CD3_code,
            CODE_NO_DES3: contentsParam.SIZE_GROUP_CD3_multiCode,
            PROD_DIV_SIGN1: contentsParam.PROD_DIV_SIGN_input1,
            PROD_DIV_SIGN2: contentsParam.PROD_DIV_SIGN_input2,
            PROD_DIV_SIGN3: contentsParam.PROD_DIV_SIGN_input3,
            PROD_DIV_SIGN4: contentsParam.PROD_DIV_SIGN_input4,
            CODE_CLASS_CD: contentsParam.DES_DIV_SIGN_radio || "P",
            CLASS_DIV_SIGN1: contentsParam.DES_DIV_SIGN_input1,
            CLASS_DIV_SIGN2: contentsParam.DES_DIV_SIGN_input2,
            CLASS_DIV_SIGN3: contentsParam.DES_DIV_SIGN_input3,
            CLASS_DIV_SIGN4: contentsParam.DES_DIV_SIGN_input4,
        });

        ecount.common.api({
            url: saveUrl,
            data: formData,
            success: function (result) {
                var message = {   //부모전달시 확인
                    name: "",
                    code: "",
                    data: formData,
                    isAdded: "",
                    addPosition: "next",
                    callback: self.close.bind(self)
                };
                //this.sendMessage(this, message);
                self.close();
            }.bind(self)
        });
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    // History button clicked event
    onFooterHistory: function (e) {

        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.EditorDt,
            lastEditId: this.EditorId
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            additional: true
        });
    },

    //마지막 포커스 (content field last focus)
    onFocusOutHandler: function (event) {
        this.footer.getControl("save").setFocus(0);
    },
    /**********************************************************************
    *  event listener  ==>  [grid]
    **********************************************************************/

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        if (target && target.cid == "save") {
            this.onFooterSave();
        }
    },

    codeSelectCheck: function (isGroup, codeNum) {
        var codeNum = $.parseNumber(codeNum || "1"),
            isEmptySizeGroupCode = false,
            isEmptySizeCode = false,
            groupControl = null,
            sizeControl = null;

        if (isGroup && codeNum > 1) {
            groupControl = this.contents.getControl("SIZE_GROUP_CD" + (codeNum - 1).toString());
            sizeControl = this.contents.getControl("SIZE_GROUP_CD" + (codeNum - 1).toString());

            isEmptySizeGroupCode = $.isEmpty(groupControl.get(0).getSelectedCode()[0]);
            isEmptySizeCode = $.isEmpty(groupControl.getValue()[1]);
            if (isEmptySizeGroupCode == true) {  //|| isEmptySizeCode == true
                groupControl.showError(ecount.resource.MSG00150);
                groupControl.setFocus(isEmptySizeGroupCode ? 0 : 1);
                return false;
            }
        } else if (isGroup == false) {
            groupControl = this.contents.getControl("SIZE_GROUP_CD" + codeNum.toString());
            isEmptySizeGroupCode = $.isEmpty(groupControl.get(0).getSelectedCode()[0]);
            if (isEmptySizeGroupCode) {
                groupControl.get(0).showError(ecount.resource.MSG00150);
                groupControl.setFocus(0);
                return false;
            }
        }
        return true;
    }

});
