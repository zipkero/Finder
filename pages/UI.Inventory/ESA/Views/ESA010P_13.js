window.__define_resource && __define_resource("LBL13101","LBL00355","LBL08582","MSG00297","BTN00236","BTN00541","MSG00629","MSG07679","LBL08583","MSG02054","MSG07680","LBL13102","LBL13104","MSG07685","LBL13106","MSG07682","LBL13107","LBL13108","MSG07683","MSG07684","BTN00784","LBL05117","BTN00037","LBL03017","LBL03004","LBL13760","BTN00069","BTN00008","MSG00071","MSG00229","LBL80071","LBL02389","LBL04244","MSG00303","MSG00150","MSG08628","LBL02987","MSG07838","LBL13109","MSG07839");
/****************************************************************************************************
1. Create Date : 2017.12.07
2. Creator     : 임명식
3. Description : 다규격품목코드 생성 (multi size prod create)
4. Precaution  :
5. History     : 2018.09.17 bsy: [A18_02078] 다규격 품목등록 시, 규격코드를 5개 이상
                 [2019.07.02][On Minh Thien] A19_02182 - 특수문자 제한 및 치환 로직변경 (다규격품목)
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_13", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    autoCode: null,

    groupCdOrigin: {},

    defaultResult : {},
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {

        this._super.init.apply(this, arguments);
        this.initProperties();
        this.permitProd = this.viewBag.Permission.prod;
    },

    initProperties: function () {
        this.autoCode = {
            AUTOMAKE_TYPE: null,
            INPUTMAKE_TYPE: null,
            MenuName: null,
            NUM_DIGIT_LEN: null,
            Trx: null,
            USE_AUTOMAKE: null,
            USE_BUTTON: null,
            USE_DOCNO: null
        };
        this.autoCode = $.extend({}, this.autoCode, this.viewBag.InitDatas.autoCodeItems[0] || {});

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
        if ($.isEmpty(this.viewBag.InitDatas.MultiSzieProdDefaultSetting)) {
            this.viewBag.InitDatas.MultiSzieProdDefaultSetting = this.defaultResult;
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();        
        header.setTitle(ecount.resource.LBL13101)  //다규격품목코드 생성   
            .add("option", [
                { id: "DefaultValueSetting", label: ecount.resource.LBL00355 },
            ]);
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

        controls.push(ctrl.define("widget.input.codeType", "MAIN_PROD_CD", "MAIN_PROD_CD", ecount.resource.LBL08582)  //대표품목코드
            .singleCell().readOnly(this.EditFlag == "M")
            .filter("maxbyte", { message: String.format(ecount.resource.MSG00297, "10", "20"), max: 20 })       // 한글10, 영문20
                                    .hasFn([{ id: "prodDupCheck", label: ecount.resource.BTN00236 }, { id: "prodCodeCreate", label: ecount.resource.BTN00541 }])
                                    .dataRules(["required"], ecount.resource.MSG00629)  // 품목입력바랍니다.
            .value(this.PROD_CD || "")
            .popover(ecount.resource.MSG07679).end());

        //다규격품목코드 생성시 대표가 되는 품목코드를 입력합니다.   
        controls.push(ctrl.define("widget.input.codeName", "MAIN_PROD_DES", "MAIN_PROD_DES", ecount.resource.LBL08583)  //대표품목명
            .singleCell()
            .hasFn([{ id: "prodDesDupCheck", label: ecount.resource.BTN00236 }])
            .maxLength(100)
            .dataRules(["required"], ecount.resource.MSG02054)
            .value(this.PROD_DES || "")
            .popover(ecount.resource.MSG07680).end()); //다규격품목명 생성시 대표가 되는 품목명을 입력합니다.   MSG07680
       
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
                     singleCodeType: 7,
                     singleCodeTypeOption: {
                         labelContainsType: "search", // 특수문자 체크 설정
                         valueContainsType: "search"
                     }
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
                .popover(ecount.resource.MSG07682)
                .setOptions({
                    inputType: "codeType"
                })
                .singleCell().end());


        controls.push(ctrl.define("widget.combine.separator", "DES_DIV_SIGN", "DES_DIV_SIGN", defVal.PROD_SIZE_TYPE == "P" ? ecount.resource.LBL13107 : ecount.resource.LBL13108) //규격명칭사용형식   
                .label([defVal.PROD_SIZE_TYPE == "P" ? ecount.resource.LBL08583 + ":&nbsp;" : "&nbsp;", String.format(ecount.resource.LBL13104 + ":&nbsp;", "1"), String.format(ecount.resource.LBL13104 + ":&nbsp;", "2"), String.format(ecount.resource.LBL13104 + ":&nbsp;", "3")])    //라벨 4개 값
                .value([defVal.CLASS_DIV_SIGN1, defVal.CLASS_DIV_SIGN2, defVal.CLASS_DIV_SIGN3, defVal.CLASS_DIV_SIGN4])   //인풋 4개 값
                .popover(defVal.PROD_SIZE_TYPE == "P" ? ecount.resource.MSG07683 : ecount.resource.MSG07684)  //MSG07684
                .setOptions({
                    inputType: "P" == defVal.PROD_SIZE_TYPE ? "codeName" : "general"
				})
                .singleCell().end());


        form.useInputForm();
        form.setColSize(1);
        form.addControls(controls);
 
        //툴바
        toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                            .addLeft(ctrl.define("widget.button", "searchText").label(ecount.resource.BTN00784))    //찾기
                            .addLeft(ctrl.define("widget.button", "multiSizeProdCreate").label(ecount.resource.LBL05117))   //코등생성
                            .addLeft(ctrl.define("widget.button", "deleteSelected").label(ecount.resource.BTN00037).hide());    //"선택삭제"
             

        var mergeData1 = {}, mergeData2 = {}, mergeData3 = {};
        mergeData1['_MERGE_USEOWN'] = true;
        mergeData1['_MERGE_START_INDEX'] = 1;
        mergeData1['_COLSPAN_COUNT'] = 2;

        mergeData2['_MERGE_USEOWN'] = true;
        mergeData2['_MERGE_START_INDEX'] = 3;
        mergeData2['_COLSPAN_COUNT'] = 2;

        mergeData3['_MERGE_USEOWN'] = true;
        mergeData3['_MERGE_START_INDEX'] = 5;
        mergeData3['_COLSPAN_COUNT'] = 2;

        var test = [
            //{ SIZE_CD1: "1", SIZE_DES1: "ddddd", SIZE_CD2: "2", SIZE_DES2: "2ddddd", SIZE_CD3: "3", SIZE_DES3: "3ddddd", EDIT_FLAG_MULTI: "M" },
            //{ SIZE_CD1: "11", SIZE_DES1: "ddddd1", SIZE_CD2: "22", SIZE_DES2: "2ddddd2", SIZE_CD3: "33", SIZE_DES3: "3ddddd3", EDIT_FLAG_MULTI: "I" }
        ];
        
        grid
            .setEditable(true, 0, 0)
            .setRowData(this.viewBag.InitDatas.MultiSizeProdList || test)
            .setEditRowDataSample({ SIZE_GROUP_CD1: "", SIZE_GROUP_CD2: "", SIZE_GROUP_CD3: "", EDIT_FLAG_MULTI: "I" })            
            .setCheckBoxUse(true)
            .setColumnRowCustom([0], [{ '_MERGE_SET': new Array(mergeData1, mergeData2, mergeData3) }])
            .setCustomRowCell('CHK_H', this.setGridCheckboxDisabled.bind(this))
            .setCheckBoxHeaderCallback({ 'change': this.setCheckBoxCallback.bind(this) })
            .setCheckBoxCallback({ 'click': this.setCheckBoxCallback.bind(this) })
            .setColumns([
                { propertyName: 'SIZE_CD1', id: 'SIZE_CD1', title: String.format(resource.LBL13104, "1"), width: 45, editable: false },
                { propertyName: 'SIZE_DES1', id: 'SIZE_DES1', title: "", width: 70, editable: false },
                { propertyName: 'SIZE_CD2', id: 'SIZE_CD2', title: String.format(resource.LBL13104, "2"), width: 45, editable: false },
                { propertyName: 'SIZE_DES2', id: 'SIZE_DES2', title: "", width: 70, editable: false },
                { propertyName: 'SIZE_CD3', id: 'SIZE_CD3', title: String.format(resource.LBL13104, "3"), width: 45, editable: false },
                { propertyName: 'SIZE_DES3', id: 'SIZE_DES3', title: "", width: 70, editable: false },
                { propertyName: 'PROD_CD', id: 'PROD_CD', title: resource.LBL03017, width: 150, editable: false },
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: resource.LBL03004, width: 160, editable: false },
                { propertyName: 'SIZE_DES', id: 'SIZE_DES', title: resource.LBL13760, width: 100, editable: false },
            ]);
        contents.add(form)
            .add(toolbar)
            .addGrid("dataGrid", grid);
    },

    onInitControl: function (cid, control) {
        var ctrl = widget.generator.control();
        var resource = ecount.resource;
        
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************


    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl(this.EditFlag == "M" ? "MAIN_PROD_DES" : "MAIN_PROD_CD").setFocus(0);
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
            // 품목코드생성
            case 'CM102P':
                this.contents.getControl('MAIN_PROD_CD').setValue(0, message.data[0].AutoCode, true);
                message.callback && message.callback();
                this.contents.getControl('MAIN_PROD_CD').onNextFocus();
                break;
                // 중복확인
            case 'ES013P':
                var ctrl = this.contents.getControl('MAIN_PROD_CD');    // 품목코드
                if (page.searchType == "prod_des") {
                    ctrl = this.contents.getControl('MAIN_PROD_DES');       // 품목명
                } else if (page.searchType == "prod_cd") {
                    ctrl = this.contents.getControl('MAIN_PROD_CD');
                }
                ctrl.setValue(0, message.data, true);
                page.close();
                ctrl.onNextFocus();
                break;
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
    // 품목코드 중복확인 버튼
    onFunctionProdDupCheck: function () {
        var isValid = true,
            tempProdCd = this.contents.getControl('MAIN_PROD_CD').getValue();
        if (ecount.common.ValidCheckSpecialForCodeType(tempProdCd).result == false) {
            isValid = false;
        }

        if (isValid) {
            var param = {
                keyword: tempProdCd,
                searchType: 'prod_cd',
                isColumSort: true,
                width: 430,
                height: 480
            };
            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03017),
                param: param,
                additional: false
            });
        } else {
            this.contents.getControl('MAIN_PROD_CD').setFocus(0);
        }
    },

    // 품목코드 코드생성 버튼
    onFunctionProdCodeCreate: function () {
        if (!this.autoCode.USE_AUTOMAKE) {
            var msf = String.format(ecount.resource.MSG00229, ecount.resource.LBL80071, ecount.resource.LBL02389, ecount.resource.LBL04244);  // 품목, 재고, 품목코드자동생성
            this.setTimeout(function () {
                ecount.alert(msf);
            });
            return false;
        }
        var params = {
            height: 220,
            width: 820,
            autoNumberSettings: encodeURIComponent(Object.toJSON([{ CODE_TYPE: "7" }])),            
            programID: this.viewBag.DefaultOption.PROGRAM_ID
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM102P',
            name: ecount.resource.BTN00541,
            param: params,
            additional: false
        });
    },

    //품목명 중복확인 버튼
    onFunctionProdDesDupCheck: function () {
        var isValid = true,
            target = this.contents.getControl('MAIN_PROD_DES'),
            tempProdDes = target.getValue();
        if (ecount.common.ValidCheckSpecialForCodeName(tempProdDes).result == false) {
            isValid = false;
        }

        if (isValid) {
            var param = {
                width: 430,
                height: 480,
                keyword: tempProdDes,
                searchType: 'prod_des',
                isColumSort: true
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03004),
                param: param,
                additional: false
            });
        } else {
            target.setFocus(0);
        }
    },

    //찾기버튼 클릭
    onContentsSearchText: function (e) {
        this.ON_KEY_F3();
    },
    //선택 삭제 
    onContentsDeleteSelected: function (flag) {
        var _self = this,
            grid = this.contents.getGrid("dataGrid").grid,
            gridData = grid.getChecked();
        if (gridData.length == 0) {
            ecount.alert(ecount.resource.MSG00303);
            return false;
        };
        function RowDeletes(item) {
            var rowKey = item[ecount.grid.constValue.keyColumnPropertyName];
            grid.setCell("SIZE_GROUP_CD1", rowKey, "", { isRunChange: true, isRunComplete: true });
            grid.setCell("SIZE_GROUP_CD2", rowKey, "", { isRunChange: true, isRunComplete: true });
            grid.setCell("SIZE_GROUP_CD3", rowKey, "", { isRunChange: true, isRunComplete: true });
            grid.setCell("EDIT_FLAG_MULTI", rowKey, "I", { isRunChange: true, isRunComplete: true });
            grid.removeRow(rowKey);
            grid.removeChecked([rowKey], false);
        };

        grid.setCellTransaction().start();
        for (var i = 0; i < gridData.length; i++) {
            RowDeletes(gridData[i]);
        };
        grid.setCellTransaction().end();
        this.setCheckBoxCallback();
    },

    //코드 생성
    onContentsMultiSizeProdCreate: function () {

        debugger;
        var invalidControl = {},
            targetControl = {},
            self = this;
        
        invalid = self.contents.validate();
        if (invalid.result.length > 0) {
            targetControl = invalid.result[0][0].control;

            targetControl.setFocus(0);
            return false;
        }
        
        var mainProdCd = this.contents.getControl("MAIN_PROD_CD").getValue(), mainProdDes = this.contents.getControl("MAIN_PROD_DES").getValue();

        var groupCode1 = this.contents.getControl("SIZE_GROUP_CD1"), groupCode2 = this.contents.getControl("SIZE_GROUP_CD2"), groupCode3 = this.contents.getControl("SIZE_GROUP_CD3"),
            groupCode = [null, groupCode1, groupCode2, groupCode3],
            sizeCode1, sizeCode2, sizeCode3, contentsParam = $.extend({}, this.contents.serialize().result);

        if ($.isEmpty(contentsParam.SIZE_GROUP_CD1_code) && $.isEmpty(contentsParam.SIZE_GROUP_CD2_code) && $.isEmpty(contentsParam.SIZE_GROUP_CD3_code)) {
            groupCode1.get(0).showError(ecount.resource.MSG00150);
            groupCode1.setFocus(0);
            return false;
        }

        for (var i = 1; i < 4; i++) {
            if (!$.isEmpty(contentsParam[String.format("SIZE_GROUP_CD{0}_code", i.toString())]) && $.isEmpty(contentsParam[String.format("SIZE_GROUP_CD{0}_multiCode", i.toString())])) {
                groupCode[i].get(1).showError(ecount.resource.MSG00150);
                groupCode[i].setFocus(1);
                return false;
            }

            if (i > 1 && (!$.isEmpty(contentsParam[String.format("SIZE_GROUP_CD{0}_code", i.toString())])) && $.isEmpty(contentsParam[String.format("SIZE_GROUP_CD{0}_code", (i - 1).toString())])) {
                groupCode[i - 1].get(0).showError(ecount.resource.MSG00150);
                groupCode[i - 1].setFocus(0);
                return false;
            }
        }

        var prodSign1 = contentsParam.PROD_DIV_SIGN_input1, prodSign2 = contentsParam.PROD_DIV_SIGN_input2, prodSign3 = contentsParam.PROD_DIV_SIGN_input3, prodSign4 = contentsParam.PROD_DIV_SIGN_input4,
            desSign1 = contentsParam.DES_DIV_SIGN_input1, desSign2 = contentsParam.DES_DIV_SIGN_input2, desSign3 = contentsParam.DES_DIV_SIGN_input3, desSign4 = contentsParam.DES_DIV_SIGN_input4,
            desType = this.viewBag.InitDatas.MultiSzieProdDefaultSetting.PROD_SIZE_TYPE || "P";
 
        ////54∬et	, 333, 00001∬00002
        groupCode1 = contentsParam.SIZE_GROUP_CD1_code;
        groupCode2 = contentsParam.SIZE_GROUP_CD2_code;
        groupCode3 = contentsParam.SIZE_GROUP_CD3_code;

        sizeCode1 = $.isEmpty(contentsParam.SIZE_GROUP_CD1_multiCode) ? [] : contentsParam.SIZE_GROUP_CD1_multiCode.split(ecount.delimiter);
        sizeDes1 = this.getSizeCodeDess(groupCode[1]);
        sizeCode2 = $.isEmpty(contentsParam.SIZE_GROUP_CD2_multiCode) ? [] : contentsParam.SIZE_GROUP_CD2_multiCode.split(ecount.delimiter);
        sizeDes2 = this.getSizeCodeDess(groupCode[2]);
        sizeCode3 = $.isEmpty(contentsParam.SIZE_GROUP_CD3_multiCode) ? [] : contentsParam.SIZE_GROUP_CD3_multiCode.split(ecount.delimiter);
        sizeDes3 = this.getSizeCodeDess(groupCode[3]);

        //  [A18_02078] 다규격 품목등록 시, 규격코드를 5개 이상
        var totCnt = (sizeCode1.length == 0 ? 1 : sizeCode1.length) * (sizeCode2.length == 0 ? 1 : sizeCode2.length) * (sizeCode3.length == 0 ? 1 : sizeCode3.length)

        if (totCnt > 1000) {
            ecount.alert(String.format(ecount.resource.MSG08628,"1000"));
            return false;
        }

        var createList = [];
        function desCreater(createList, prodSign, desSign, sizeCode, sizeDes) {
            return {
                PROD_CD: String.format("{0}{1}{2}", createList.PROD_CD, sizeCode, prodSign),
                PROD_DES: desType == "P" ? String.format("{0}{1}{2}", createList.PROD_DES, sizeDes, desSign) : createList.PROD_DES,
                SIZE_DES: desType == "P" ? "" : String.format("{0}{1}{2}", createList.SIZE_DES, sizeDes, desSign)
            }
        }
        
        function listCreate(sizeCode1, sizeDes1, sizeCode2, sizeDes2, sizeCode3, sizeDes3) {
            createList.push({
                PROD_CD: String.format("{0}{1}{2}{3}", mainProdCd, prodSign1, sizeCode1, prodSign2),
                PROD_DES: desType == "P" ? String.format("{0}{1}{2}{3}", mainProdDes, desSign1, sizeDes1, desSign2) : mainProdDes,
                SIZE_DES: desType == "P" ? "" : String.format("{0}{1}{2}{3}", "", desSign1, sizeDes1, desSign2),
                SIZE_GROUP_CD1: groupCode1,
                SIZE_GROUP_CD2: groupCode2,
                SIZE_GROUP_CD3: groupCode3,
                SIZE_CD1: sizeCode1,
                SIZE_DES1: sizeDes1,
                SIZE_CD2: sizeCode2,
                SIZE_DES2: sizeDes2,
                SIZE_CD3: sizeCode3,
                SIZE_DES3: sizeDes3,
                EDIT_FLAG_MULTI: "I"              
            });
        }
        
        for (var i = 0; i < sizeCode1.length; i++) {
            if (sizeCode2.length == 0) {
                listCreate(sizeCode1[i], sizeDes1[i], "", "", "", "");
            }
            for (var ii = 0; ii < sizeCode2.length; ii++) {
                if (sizeCode3.length == 0) {
                    listCreate(sizeCode1[i], sizeDes1[i], sizeCode2[ii], sizeDes2[ii], "", "");
                    $.extend(createList[createList.length - 1], desCreater(createList[createList.length - 1], prodSign3, desSign3, sizeCode2[ii], sizeDes2[ii]));
                }
                for (var iii = 0; iii < sizeCode3.length; iii++) {
                    listCreate(sizeCode1[i], sizeDes1[i], sizeCode2[ii], sizeDes2[ii], sizeCode3[iii], sizeDes3[iii]);
                    $.extend(createList[createList.length - 1], desCreater(createList[createList.length - 1], prodSign3, desSign3, sizeCode2[ii], sizeDes2[ii]));
                    $.extend(createList[createList.length - 1], desCreater(createList[createList.length - 1], prodSign4, desSign4, sizeCode3[iii], sizeDes3[iii]));
                }
            }
        }        
        var grid = this.contents.getGrid("dataGrid").grid,
            gridCount = grid.getRowCount();

        if (gridCount == 0 || this.EditFlag == "I") {
            this.contents.getGrid("dataGrid").settings.setRowData(createList);
            this.contents.getGrid("dataGrid").draw();
        } else {
            var onlyInFirstSet = createList.except(grid.getRowList(), function (item) { return item.PROD_CD; });
            grid.addRow(onlyInFirstSet.length);
            for (var i = 0; i < onlyInFirstSet.length; i++) {
                grid.setRow(i + gridCount, onlyInFirstSet[i]);
            }
        }

        var checkData = {
            Type: "custom",
            checkItem: createList
        }

        self.GetListCheckForDuplicates(checkData);
    },

    //저장버튼
    onFooterSave: function (e) {
        // 권한체크
        if (this.EditFlag == "M") {  // 수정 저장은 모든 권한이 있을때만 가능
            if (this.viewBag.Permission.prod.Value != "W") {
                var msgdto = ecount.common.getAuthMessage("", [{
                    MenuResource: ecount.resource.LBL02987, PermissionMode: "U"
                }]);
                ecount.alert(msgdto.fullErrorMsg);              
                return;
            }
        }

        if (!this.viewBag.Permission.prod.CW) {
            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: ecount.resource.LBL02987, PermissionMode: "W"
            }]);
            ecount.alert(msgdto.fullErrorMsg);          
            return;
        }
        var rowData = this.contents.getGrid().grid.getRowList().where(function (item) { return !$.isEmpty(item.PROD_CD); }), self = this, grid = this.contents.getGrid().grid;
        if (rowData.length > 0) {
            var isSave = true, firstRowKey = "", firstCol="";

            rowData.forEach(function (item, i) {
                
                if (item.PROD_CD.subStringBytes(20) != item.PROD_CD) {

                    grid.setCellShowError("PROD_CD", item[ecount.grid.constValue.keyColumnPropertyName], {
                        placement: item[ecount.grid.constValue.keyColumnPropertyName] == "0" ? 'auto' : 'top',
                        message: String.format(ecount.resource.MSG00297, "10", "20"),
                        popOverVisible: !$.isEmpty(String.format(ecount.resource.MSG00297, "10", "20"))
                    });
                    isSave = false;
                    firstRowKey = $.isEmpty(firstRowKey) ? item[ecount.grid.constValue.keyColumnPropertyName] : firstRowKey;
                    firstCol = $.isEmpty(firstCol) ? "PROD_CD" : firstCol;
                }
                if (item.PROD_DES.length > 100) {
                    grid.setCellShowError("PROD_DES", item[ecount.grid.constValue.keyColumnPropertyName], {
                        placement: 'top',
                        message: String.format(ecount.resource.MSG00297, "100", "100"),
                        popOverVisible: !$.isEmpty(String.format(ecount.resource.MSG00297, "100", "100"))
                    });
                    isSave = false;
                    firstRowKey = $.isEmpty(firstRowKey) ? item[ecount.grid.constValue.keyColumnPropertyName] : firstRowKey;
                    firstCol = $.isEmpty(firstCol) ? "PROD_DES" : firstCol;
                }
                if (item.SIZE_DES.length > 100) {
                    grid.setCellShowError("SIZE_DES", item[ecount.grid.constValue.keyColumnPropertyName], {
                        placement: 'top',
                        message: String.format(ecount.resource.MSG00297, "100", "100"),
                        popOverVisible: !$.isEmpty(String.format(ecount.resource.MSG00297, "100", "100"))
                    });
                    isSave = false;
                    firstRowKey = $.isEmpty(firstRowKey) ? item[ecount.grid.constValue.keyColumnPropertyName] : firstRowKey;
                    firstCol = $.isEmpty(firstCol) ? "SIZE_DES" : firstCol;
                }
            });

            var trueCallback = function () {
                var message = {   //부모전달시 확인
                    name: "",
                    code: "",
                    data: {
                        multiList: rowData,
                        prodCd: self.contents.getControl("MAIN_PROD_CD").getValue(),
                        prodDes: self.contents.getControl("MAIN_PROD_DES").getValue()
                    },
                    isAdded: "",
                    callback: self.close.bind(self)
                };
                self.sendMessage(self, message);
            }.bind(this);

            if (isSave == false) {
                if (!$.isEmpty(firstRowKey) && !$.isEmpty(firstCol)) {
                    grid.setCellFocus(firstCol, firstRowKey);
                }
                return false;
            } else {
                var checkData = {
                    Type: "I",
                    checkItem: []
                }
                this.GetListCheckForDuplicates(checkData, trueCallback);
            }


        } else {
            ecount.alert(ecount.resource.MSG07838);
            return false;
        }
    },
    //닫기버튼
    onFooterClose: function () {
  
        this.close();
        return false;
    },

    onDropdownDefaultValueSetting: function (e) {

        this.openWindow({
            url: '/ECERP/ESA/ESA010P_14',
            name: ecount.resource.LBL13109,   // 다규격품목기본값설정   
            param: {
                width: 780,
                height: 400,
            },
        });
    },
    /**********************************************************************
    *  event listener  ==>  [grid]
    **********************************************************************/
    setGridCheckboxDisabled: function (value, rowItem) {
        var option = [];

        if (rowItem.EDIT_FLAG_MULTI == "M") {
            option.attrs = {
                'disabled': true
            };
        }

        option.data = value;
        return option;
    },

    setCheckBoxCallback: function (value, rowItem) {
        var grid = this.contents.getGrid("dataGrid").grid;
        var checkCount = grid.getCheckedKeyList().length,
            searchCtl = this.contents.getControl("searchText"),
            multiCreateCtl = this.contents.getControl("multiSizeProdCreate"),
            deleteCtl = this.contents.getControl("deleteSelected");

        if (checkCount > 0) {
            searchCtl.hide();
            multiCreateCtl.hide();
            deleteCtl.show();
        } else {
            searchCtl.show();
            multiCreateCtl.show();
            deleteCtl.hide();
        }
    },
    //마지막 포커스 (content field last focus)
    onFocusOutHandler: function (event) {
        this.contents.getControl("multiSizeProdCreate").setFocus(0);
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        //this.onContentsApply();
        if (event.target.attributes['id'] && event.target.attributes['id'].value == "txt-contents-searchText") { // ygh #28
            this.contents.getGrid("dataGrid").grid.searchTextCellHighlight(event.target.value);
            event.stopPropagation();
            event.preventDefault();
        }
    },
    //F3 키 콜백
    ON_KEY_F3: function (e) {   // ygh #28
        this.contents.getGrid("dataGrid").grid.searchInputText();
        e && e.preventDefault();
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
            if (isEmptySizeGroupCode == true || isEmptySizeCode == true) {
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
    },

    getSizeCodeDess: function (groupCode) {
        var size = groupCode.getValue()[1];
        if (!$.isEmpty(size)) {
            var des = [];
            for (var i = 0; i < size.length; i++) {
                des.push(size[i].label)
            }
            return des;
        }
        return [];
    },

    //중복체크
    GetListCheckForDuplicates: function (checkData, trueCallback) {
        
        var self = this, grid = self.contents.getGrid().grid;
        var rowData = grid.getRowList().where(function (item) { return !$.isEmpty(item.PROD_CD); });
        var reValue = false;

        if (rowData.length > 0) {

            var prodItems = rowData.where(function (item) {
                if (checkData.Type == "custom") {
                    var isChecked = false;
                    checkData.checkItem.forEach(function (data) {
                        if (item.PROD_CD == data.PROD_CD)
                            isChecked = true;
                    });
                    return isChecked;
                }
                else
                    return (item.EDIT_FLAG_MULTI || "I") == "I";
            });
            var checkProd = prodItems.select(function (item) { return item.PROD_CD; }).join(ecount.delimiter),
                checkProdKey = prodItems.select(function (item) { return item[ecount.grid.constValue.keyColumnPropertyName]; }).join(ecount.delimiter);

            chkParam = {
                PARAM: checkProd,
                SEARCH_TYPE: "prod_cd",
                MULTI_KEY: checkProdKey,
                MULTI_YN: "Y"
            }

            ecount.common.api({
                url: "/Inventory/Common/GetListCheckForDuplicates",
                data: Object.toJSON(chkParam),
                error: function (e) {
                    ecount.alert('중복확인 처리 시 Error');
                }.bind(this),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                    } else if (result.Data.length != 0) {
                        //"이미 존재하는 코드가 있습니다.</br></br>[확인]버튼을 클릭 시 내역을 확인할 수 있습니다."
                        ecount.confirm(ecount.resource.MSG07839, function (isOk) {
                            if (isOk) {
                                var param = {
                                    width: 430,
                                    height: 480,
                                    keyword: "",
                                    searchType: 'prod_cd',
                                    isColumSort: true,
                                    resultList: result.Data,
                                    IsMultiCheck: true,
                                    PARAM: checkProd,
                                    SEARCH_TYPE: "prod_cd",
                                    MULTI_KEY: checkProdKey,
                                    MULTI_YN: "Y"

                                };
                                self.openWindow({
                                    url: '/ECERP/Popup.Search/ES013P',
                                    name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03017),
                                    param: param,
                                    additional: false
                                });
                            }
                            grid.checkAll(false);
                            result.Data.forEach(function (item, i) {
                                grid.addChecked(item.PROD_KEY, false);
                            });
                            self.setCheckBoxCallback();
                        });
                    } else {
                        trueCallback && trueCallback();
                    }
                }
            });
        }
    }
  
});
