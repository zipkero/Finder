window.__define_resource && __define_resource("LBL08975","LBL07243","MSG04149","MSG00590","LBL02072","MSG01390","BTN00236","LBL03004","LBL80099","LBL01234","MSG00710");
/****************************************************************************************************
1. Create Date : 2015.11.10
2. Creator     : 전영준
3. Description : 재고>기초등록>품목등록 > 변경클릭> 품목선택변경 팝업
4. Precaution  :
5. History     : 2018.05.22(임명식) - 
               : 2018.08.23 Do Xuan Khanh: Add Property isNotUsePopover: true,
                 2018.12.07(bsy) - 품목구분 - 무형상품 숨김처리
                 2019.11.05(PhiVo) - A17_02590 - Change URL /ECERP/EGG/EGG025M to /ECERP/SVC/ENT/ENT007M
****************************************************************************************************/
ecount.page.factory("ecount.page.changeSelected", "ESA009P_14", {

    pageID: null,
    isShowSaveButtonByRow: true,
    sendData: [],
    _isFormSetting : false,
    firstVatRate: true,
    _isChangeData: true,
    // 단가 총 자릿수
    lenUnitPrice: 18,

    // 단가 소수점 자릿수
    lenDotUnitPrice: 6,

    // 기타 총 자릿수
    lenEtc: 18,

    // 기타 소수점 자릿수
    lenDotEtc: 6,

    lan_type: "",

    //상단적용클릭여부
    isSetApplyCall: false,

    //initcontrol실행시 순번
    initControlIdx: null,

    //부품목 prodType
    checkProdTypeByMainProdCD: [],
    
    //검색시 line
    popupLine: 0,

    popupIsForm: false,

    // Not use Popover
    isNotUsePopover: true,

    isLineSave: false,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.formTypeCode = this.viewBag.InitDatas.formType;
        this.initProperties();
        this.registerDependencies("ecmodule.common.initControls");
    },

    initProperties: function () {
        this._super.initProperties.apply(this, arguments);
        this.EditFlag = "M";
        this.checkProdTypeByMainProdCD = new Array(this._itemRowCnt + 1);
        this._loadShowColumns = ['PROD_TYPE_BASE', 'MAIN_PROD_CD_BASE', 'EXPENSE_COST', 'LABOR_COST', 'OUT_COST', 'MATERIAL_COST'];
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    onInitHeader: function (header) {
        header
            .setTitle(ecount.resource.LBL08975)
            .notUsedBookmark()
    },

    onInitContents: function (contents) {
        var controls = this._super.onInitContents.apply(this, arguments);
    },

    onInitFooter: function (footer) {
        this._super.onInitFooter.apply(this, arguments);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    //데이터 맵핑
    getRowDatas: function(rowData){
        if ($.isEmpty(rowData) && $.isEmpty(this.prodView)) {
            this.FormDefaultValueConvertData.InputDefaultValue["G_PROD_CD"] = "";
            this.prodView = this.FormDefaultValueConvertData.InputDefaultValue;
            this.viewBag.InitDatas.ProdLevelGroup = this.FormDefaultValueConvertData.InputLevelGroup;
            this.setupView = this.FormDefaultValueConvertData.InputSetupView;
            this.isMultiProcess = false
            this.PROD_FLAG = "S";
        } else if (!$.isEmpty(rowData) && this.initControlIdx != rowData.rowIdx) {
            this.initControlIdx = rowData.rowIdx;
            this.prodView = this.viewBag.InitDatas.ListData[rowData.rowIdx];
            this.viewBag.InitDatas.ProdLevelGroup = this.viewBag.InitDatas.ListLevelGroup.where(function (item) { return item.CD_GROUP == this.prodView.PROD_CD; }.bind(this));
            this.setupView = this.viewBag.InitDatas.ListSetup.where(function (item) { return item.Key.PROD_CD == this.prodView.PROD_CD; }.bind(this));
            this.imageList = this.viewBag.InitDatas.ListImage.where(function (item) { return item.PROD_CD == this.prodView.PROD_CD; }.bind(this));
            this.isMultiProcess = (this.prodView.PROD_CD == this.prodView.G_PROD_CD);
            this.PROD_FLAG = (this.prodView.PROD_CD == this.prodView.G_PROD_CD) ? "G" : "S";
        }
    },
    //본문
    onInitControl: function (cid, control, controlType, rowData) {
        var ctrl = widget.generator.control();
        cid = rowData ? rowData.columnId : (cid || "");
        this.getRowDatas(rowData);
        if (cid.indexOf("checkItem") > -1) {
            control.value("Y");
            control.select("Y");
            control.label("");
            control.isNoLabel();
            control.setOptions({ number: [(rowData.rowIdx+1)] })


        }
        ecmodule.common.initControls.prodInitControl.call(this, cid, control, controlType, rowData, this);
    },

    //로드 완료후
    onLoadComplete: function () {
        this.setLoadSetting(this.itemRowCnt, true)
        this.bomSyncVisible(null, this.itemRowCnt, true);
        for (var i = 0; i < this._itemRowCnt; i++) {
            this.setLoadSetting(i);
            this.bomSyncVisible(null, i);
        }

        this._super.onLoadComplete.apply(this, arguments);
        //this.contents.getForm()[0].show();
        this.firstVatRate = false;
    },

    //팝업창 결과
    onMessageHandler: function (page, data) {
        switch (page.pageID) {
            case "ENT007M":
                this.contents.getControl($.isEmpty(data.CheckLine) ? 'PROD_IMAGE' : 'PROD_IMAGE_' + data.CheckLine).onMessage(page, data.data);
                this.ProdImageData = data.data;
                this.setTimeout(function () {
                    data.callback && data.callback(false);
                }.bind(this), 0);
                break;
            case "ES020P":
                var line = this.popupIsForm ? this._itemRowCnt : this.popupLine;
                this.checkProdTypeByMainProdCD[line] = data.data.PROD_TYPE;
                this.bomSyncVisible && this.bomSyncVisible(page, line, this.popupIsForm);
                break;
            case 'ES013P':
                if (page.searchType == "prod_des") {
                    ctrl = this.contents.getControl(this.getControlName(data.CheckLine, $.isEmpty(data.CheckLine), "PROD_DES"));       // 품목명
                } else if (page.searchType == "size_des") {     // 규격명                    
                    ctrl = this.contents.getControl(this.getControlName(data.CheckLine, $.isEmpty(data.CheckLine), "SIZE_DES_BASE")).get(1);
                } else if (page.searchType == "bar_code") {      // Barcode
                    ctrl = this.contents.getControl(this.getControlName(data.CheckLine, $.isEmpty(data.CheckLine), "BAR_CODE"));
                }
                ctrl.setValue(0, data.data, true);
                page.close();
                ctrl.onNextFocus();
                break;
            default:
                this._super.onMessageHandler.apply(this, arguments);
                break;
        }

    },

    //팝업오픈
    onPopupHandler: function (control, config, handler) {
        var line = $.isEmpty(control.rowIdxTable) ? 0 : control.rowIdxTable,
           isForm = !control._useTableRowIndex,
           cid = isForm ? control.id : control.originControlID; //control.id.replace("_" + line.toString(), "");
        this.popupLine = line;
        this.popupIsForm = isForm;
        config.popupType = false;
        // 그룹코드 공통 셋팅
        if (["txtClassCd1", "txtClassCd2", "txtClassCd3", "CLASS_CD", "CLASS_CD2", "CLASS_CD3"].contains(cid)) {
            config.SID = "E040103";
            config.isNewDisplayFlag = true;
            config.isApplyDisplayFlag = false;       // apply
            config.isCheckBoxDisplayFlag = false;    // checkbox
            config.isIncludeInactive = false;        //                 
            config.additional = false;
            config.titlename = control.subTitle || control.title;
            config.name = control.subTitle || control.title;
        }

        switch (cid) {
            case "CLASS_CD":
            case "txtClassCd1":       // 그룹코드
                config.CODE_CLASS = "L07";
                config.custGroupCodeClass = "L07";
                break;
            case "CLASS_CD2":
            case "txtClassCd2":
                config.CODE_CLASS = "L08";
                config.custGroupCodeClass = "L08";
                break;
            case "CLASS_CD3":
            case "txtClassCd3":
                config.CODE_CLASS = "L09";
                config.custGroupCodeClass = "L09";
                break;
            case "SIZE_CD": // 품목규격                                
                config.DEL_FLAG = "N";
                config.PARAM = "";
                break;
            case "CUST":  // 구매처 
                config.isNewDisplayFlag = true;
                config.isCheckBoxDisplayFlag = false;
                break;
            case "WH_CD_BASE":  // 생산공정                
            case "WH_CD":  // 생산공정                 
            
                config.custGroupCodeClass = "L03";
                config.CODE_CLASS = "L03";
                config.DEL_FLAG = "N";
                config.isOnePopupClose = false;
                config.SID = "E040103";
                config.ResourceType = "PROD";
                config.titlename = control.subTitle || control.title;
                config.name = control.subTitle || control.title;
                break;

            case "MAIN_PROD_CD":  // 주품목 "MAIN_PROD_CD_BASE"
                config.MAIN_YN = "Y";
                config.isOnePopupClose = false;
                break;
            case "INSPECT_TYPE_CD":  // 품질검사유형
                config.isOnePopupClose = false;
                config.isCheckBoxDisplayFlag = false;    // checkbox                
                break;
            case "PROD_LEVEL_GROUP":
                config.titlename = ecount.resource.LBL07243;
                config.name = ecount.resource.LBL07243;
            default:
                this._super.onPopupHandler.apply(this, arguments);
                break;
                //거래처 관련 팝업 항목 설정
        }
        // API 조회 데이터가 1건이더라도 팝업을 오픈 한다.

        handler(config);
    },

    //검색자동완성
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        var line = $.isEmpty(control.rowIdxTable) ? 0 : control.rowIdxTable,
          isForm = !control._useTableRowIndex,
          cid = isForm ? control.id : control.originControlID; //control.id.replace("_" + line.toString(), "");
        this.popupLine = line;
        this.popupIsForm = isForm;
        switch (cid) {
            case "WH_CD_BASE":  // 생산공정
            case "WH_CD":  // 생산공정                                 
                parameter.CODE_CLASS = 'L03';
                break;
            case "CLASS_CD":
            case "txtClassCd1":       // 그룹코드
                parameter.CODE_CLASS = "L07";
                break;
            case "CLASS_CD2":
            case "txtClassCd2":
                parameter.CODE_CLASS = "L08";
                break;
            case "CLASS_CD3":
            case "txtClassCd3":
                parameter.CODE_CLASS = "L09";
                break;
            case "MAIN_PROD_CD":  // 주품목 MAIN_PROD_CD_BASE
                parameter.MAIN_YN = "Y";
                parameter.isOnePopupClose = false;
                break;
            default:
                this._super.onAutoCompleteHandler.apply(this, arguments);
                break;
        }
        handler(parameter);
    },

    //값 변경시 
    onChangeControl: function (control) {
        var line = $.isEmpty(control.rowIndex) ? 0 : control.rowIndex,
            isForm = $.isEmpty(control.useTableRowIndex) || control.useTableRowIndex == false  ? true : false ,
            cid = isForm ? control.cid : control.originID;   //     control.cid.replace("_" + line.toString(), "")
        switch (cid) {
            // 주품목
            case "MAIN_PROD_CD":
                this.bomSyncVisible(null, line, isForm);
                break;
                // 품목구분 PROD_TYPE
            case "PROD_TYPE_BASE":                
                var getData = this.getDataOrControlName(line, isForm, "PROD_TYPE_BASE"),
                    prodData = getData.data,
                    controlName = getData.controlName,
                    setFlagName = this.getControlName(line, isForm, "SET_FLAG"),
                    mainProdCdName = this.getControlName(line, isForm, "MAIN_PROD_CD_BASE"),
                    prodTypeName = this.getControlName(line, isForm, "PROD_TYPE");
                       
                if (prodData.PROD_TYPE != "3" && isForm != true) {
                    //※ 주의\r\n- 등록된 BOM이 있다면, 원가계산 등에 영향을 미칠 수 있습니다.\r\n- 주품목일 경우 종품목의 품목구분도 같이 변경됩니다.
                    if (this.isSetApplyCall != true) { //일괄변경시에는 제외
                        ecount.alert(ecount.resource.MSG04149);
                    }
                    var mainProdCd = this.contents.getControl(mainProdCdName) ?
                        this.contents.getControl(mainProdCdName).get(this.getControlName(line, isForm, "MAIN_PROD_CD")).getSelectedItem().first().value
                        : prodData.MAIN_PROD_CD;
                    if (!$.isEmpty(mainProdCd)) {
                        line = isForm ? this._itemRowCnt : line

                        var mainProdtypeVal = (prodData && (prodData.MAIN_PROD_TYPE || prodData.MAIN_PROD_CD_PROD_TYPE));

                        this.contents.getControl(controlName).get(prodTypeName).setValue(0, this.checkProdTypeByMainProdCD[line] || mainProdtypeVal);
                        if (this.prodView && !(["1", "3"].contains(this.checkProdTypeByMainProdCD[line] || mainProdtypeVal))) {
                            this.contents.getControl(controlName).get(setFlagName).hide(true);
                        } else {
                            this.contents.getControl(controlName).get(setFlagName).show(true);
                        }
                    }
                }
                var typeControl = this.contents.getControl(controlName);

                var prodType = typeControl ? typeControl.get(prodTypeName).getValue() : getData.PROD_TYPE;

                this.bomSyncVisible(null, line, isForm);

                //원가-재료비 활성화여부
                // 제품, 반제품 일때 
                this.setMeterialCostControlByProdType(!["1", "2"].contains(prodType), line, isForm);
                
                //원가-재료비외 활성화여부
                // 원재료, 부재료, (상품 & SET가 아닐때)
                this.setCostControlByProdType(!(["0", "4"].contains(prodType) || (prodType == "3" && (typeControl ? typeControl.get(setFlagName).getValue() : getData.SET_FLAG) == "0")), line, isForm);
                //this.checkProdTypeByMainProdCD = "";
                break;
            // 세트여부
            case "SET_FLAG":
                var getData = this.getDataOrControlName(line, isForm, "PROD_TYPE_BASE"),
                   prodData = getData.data,
                   controlName = getData.controlName;
                var typeControl = this.contents.getControl(controlName);
                var prodType = typeControl ? typeControl.get(this.getControlName(line, isForm, "PROD_TYPE")).getValue() : getData.PROD_TYPE;

                // BOM SYNC 컨트롤 활성화 여부 
                this.bomSyncVisible(null, line, isForm);
                //원가-재료비외 활성화여부
                // 원재료, 부재료, (상품 & SET가 아닐때)
                this.setCostControlByProdType(!(["0", "4"].contains(prodType) || (prodType == "3" && (typeControl ? typeControl.get(this.getControlName(line, isForm, "SET_FLAG")).getValue() : getData.SET_FLAG) == "0")), line, isForm);
                break;
            default:
                this._super.onChangeControl.apply(this, arguments);
                break;


        };
    },
    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //이미지등록
    onContentsPROD_IMAGE: function (e) {
        var line = $.isEmpty(e.rowIndex) ? null : e.rowIndex,
            isForm = $.isEmpty(e.useTableRowIndex) || e.useTableRowIndex == false  ? true : false ,
            locationAllow = ecount.infra.getGroupwarePermissionByAlert(this.viewBag.InitDatas.GroupwarePermission).Excute();

        if (locationAllow) {
            //등록된 이미지 개수 체크
            var controlName = isForm ? "PROD_IMAGE" : "PROD_IMAGE_" + line;
            if (this.contents.getControl(controlName).getItemCount() >= 5) {
                ecount.alert(String.format(ecount.resource.MSG00590, ecount.resource.LBL02072, '5'));
                return false;
            }
            var param = {
                width: 780,
                height: 800,
                hidFlag: "I",
                AFlag: "4",
                PageType: "PROD",
                MaxCheckCount: 5,
                CheckedCount: 0,
                isViewApplyButton: true,
                CheckLine : line
            }
            this.openWindow({
                url: '/ECERP/SVC/ENT/ENT007M',
                name: "ENT007M",
                param: param,
                popupType: false,
                additional: true
            });
        }
    },

    //닫기
    onFooterClose: function () {
        var thisObj = this;
        thisObj.sendMessage(this, {});
        thisObj.setTimeout(function () {
            thisObj.close();
        }, 0);
    },

    
    //
    //하단저장
    onFooterSave: function (e) {
        var btn = this.footer.get(0).getControl("save"),
            isRaisedError = false,
            self = this,
            o = this.contents.getForm()[1].serialize(),
            rowItem = [];
        this.sendData = [];

        var isRaisedError = this.getTableFormSaveDatas();

        if (isRaisedError == false) {
            var listOfProdCode = [];
            listOfProdCode = (this.sendData || []).select(function (item) {
                return item.PROD_CD;
            });
            if (listOfProdCode.length > 0) {
                this._super.onFooterSave.apply(this);
                btn.setAllowClick();
            } else {
                ecount.alert(ecount.resource.MSG01390);
                btn.setAllowClick();
                return;
            };
        };
        btn.setAllowClick();
    },

    //라인별저장
    onContentsLineSave: function (e) {
        var isForm = !e.useTableRowIndex;
        this.onSaveDataByRow(e, e.rowIndex);
    },
    
    /*라인별 저장시 사용한다. */
    onSaveDataByRow: function (e, line) {
       
        var self = this;
        this.sendData = [];
        var isRaisedError = this.getTableFormSaveDatas(true, line);
        if (!isRaisedError) {
            this.SaveData(true);
        }
    },

    onFunctionProdDesDupCheck: function (e) {
        var isValid = true;
        var target = this.contents.getControl($.isEmpty(e.rowIndex) ? 'PROD_DES' : 'PROD_DES_' + e.rowIndex);
       
        if (ecount.common.ValidCheckSpecialForCodeName(target.getValue()).result == false) {
            isValid = false;
        }
        this.openDupCheck(isValid, "prod_des", target.getValue(), target, String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03004), e.rowIndex || "");
    },
    onFunctionSizeDesDupCheck: function (e) {
        var isValid = true;
        var target = this.contents.getControl($.isEmpty(e.rowIndex) ? 'SIZE_DES_BASE' : 'SIZE_DES_BASE_' + e.rowIndex).get(1);

        if (ecount.common.ValidCheckSpecialForCodeName(target.getValue()).result == false) {
            isValid = false;
        }
        this.openDupCheck(isValid, "size_des", target.getValue(), target, String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL80099), e.rowIndex || "");
    },
    onFunctionBarCodeDupCheck: function (e) {
        var isValid = true;
        var target = this.contents.getControl($.isEmpty(e.rowIndex) ? 'BAR_CODE' : 'BAR_CODE_' + e.rowIndex);

        if (ecount.common.ValidCheckSpecial(target.getValue()).result == false) {
            isValid = false;
        }
        this.openDupCheck(isValid, "bar_code", target.getValue(), target, String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL01234), e.rowIndex || "");
    },
    /**********************************************************************
    * define user function
    **********************************************************************/
    //중복체크
    openDupCheck: function (isValid, searchType, keyword, target, name, line) {
        if (isValid) {
            var param = {
                keyword: keyword,
                searchType: searchType,
                isColumSort: true,
                width: 430,
                height: 480,
                CheckLine: line
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: name,
                param: param,
                isColumSort: true,
                additional: false
            });
        } else {
            target.setFocus(0);
        }
    },

    //상단변경시 값 체인지
    setSelApplyFocus: function (value) {
        //if (this._selectedItem.contains("MAIN_PROD_CD_BASE")) {
        //    this.bomSyncVisible(null, i, true);
        //    for (var i = 0; i < this._itemRowCnt; i++) {
        //        this.bomSyncVisible(null, i);
        //    }
        //}
        value = this.getControlReName(value);
        this._super.setSelApplyFocus.apply(this, arguments);

    },

    //상단 기본값 적용  따로 처리할게있는경우
    setApply: function (e, callback) {
        var self = this;
        //i:rowidx, row_id : id, chControl: 해당컨트롤obj, saveRowValue: 변경할값, prodData: row값들
        callback = function (i, row_id, chControl, saveRowValue, prodData) {
            var isCase = false;
            switch (row_id) {
                case "PROD_IMAGE":
                    chControl.removeAll && chControl.removeAll();
                    //dvar tmpImageList = self.contents.getControl("PROD_IMAGE")._imageList,
                    // test진행상황 66037
                    var tmpImageList = self.contents.getControl("PROD_IMAGE").getImageList(),
                        imgList;
                    if(tmpImageList && tmpImageList.length > 0){
                        imgList = Object.clone(tmpImageList, true); //$.extend(true, [], tmpImageList);
                        for (var i = 0; i < imgList.length; i++) {
                            delete imgList[i]["imgItemKey"];
                        }
                    }
                    
                    chControl && imgList && chControl.onMessage(null, imgList); //self.ProdImageData
                    isCase = true;
                    break;
                case "PROD_TYPE_BASE":
                    var isMultiProcess = (prodData.PROD_CD == prodData.G_PROD_CD);
                    var PROD_FLAG = (prodData.PROD_CD == prodData.G_PROD_CD) ? "G" : "S";

                    var isRestore = (chControl.controlList[0] && chControl.controlList[0].isReadOnly() == false)  && ((PROD_FLAG == "G" && !["0", "3", "4"].contains(saveRowValue[0].value)) || PROD_FLAG == "S");
                    if (isRestore) {
                        chControl && chControl.restore(saveRowValue);
                    }
                    chControl.removeCode && chControl.removeCode();
                    isCase = true;
                    break;
                case "MAIN_PROD_CD_BASE":
                    if (!chControl.isHideAll) {
                        self.checkProdTypeByMainProdCD[i] = self.checkProdTypeByMainProdCD[self._itemRowCnt] || "";
                        if (chControl.isCombine && chControl.controlList) {
                            chControl.controlList.forEach(function (key, j) {
                                key.removeCode && key.removeCode();
                                key.removeAll && key.removeAll();
                            });
                        } else {
                            chControl.removeAll && chControl.removeAll();
                        }
                        chControl && chControl.restore(saveRowValue);
                    }
                    isCase = true;
                    break;
                case "EXPENSE_COST":
                case "OUT_COST":
                case "MATERIAL_COST":
                case "LABOR_COST":
                    if (!chControl._readOnly) {
                        chControl.restore(saveRowValue);
                    }
                    isCase = true;
                    break;

            }
            return isCase;
        }
        this._super.setApply.apply(this, arguments);
    },
    
    /*디비에 저장할 데이터 가공하는 영역*/
    getSendData: function (data) {
        var isSave = this._super.CheckSaveData.apply(this);
        if (isSave == true) {
            var objectData = this._super.getSaveRowData(data.rowItem);
            var _keys = this._super._KeysOfJson(objectData);
            for (var i = 0; i < _keys.length; i++) {
                if (objectData[(_keys[i])] == null) continue;
            };
        }
        else {
            return {}; /*실패처리해야된다.*/
        };
        var send_data = objectData; /*업데이트할 데이터만 가공해서 넘긴다.*/
        
        return send_data;
    },

    //품목 기본값 변경
    prodSaveValueSet: function (data) {
        data.forEach(function (item, i) {
            Object.keys(item).forEach(function (key, j) {
                if ($.isArray(item[key]) && !["PROD_IMAGE"].contains(key)) {
                    if (['IN_PRICE_VAT', 'OUT_PRICE_VAT', 'OUTSIDE_PRICE_VAT', 'CS_FLAG'].contains(key)) {
                        item[key] = item[key].length > 0 ? item[key][0] : "0";
                    } else {
                        item[key] = item[key].length > 0 ? item[key][0] : "N";
                    }
                } else {
                    switch (key) {
                        case "SIZE_FLAG": //자료올리기 형태로 변경
                            if (item["SIZE_FLAG"] == "0" || item["SIZE_FLAG"] == "3") {
                                item["SIZE_FLAG"] = item["SIZE_FLAG"] == "0" ? "2" : "1";
                                item["SIZE_DES"] = item["SIZE_FLAG"] == "2" ? item["SIZE_CD"] : item["SIZE_DES"]
                            }else if (item["SIZE_FLAG"] == "1") {
                                item["SIZE_FLAG"] = "3";
                            } else if (item["SIZE_FLAG"] == "2") {
                                item["SIZE_FLAG"] = "4";
                                item["SIZE_DES"] = item["SIZE_CALC_CD"];
                            }
                            item["SIZE_CALC_CD"] = "";
                            item["SIZE_CD"] = "";

                            break;
                        case "OEM_PROD_TYPE_radio":
                        case "OEM_PROD_TYPE_code":
                            item['OEM_PROD_TYPE_radio' == key ? "OEM_PROD_TYPE" : "OEM_PROD_CD"] = item[key];
                            delete item[key];
                            break;
                        case "TAX_radio":
                        case "TAX_input":
                            item['TAX_radio' == key ? "VAT_YN" : "TAX"] = item[key];
                            delete item[key];
                            break;
                        case "VAT_RATE_BY_radio":
                        case "VAT_RATE_BY_input":
                            item['VAT_RATE_BY_radio' == key ? "VAT_RATE_BY_BASE_YN" : "VAT_RATE_BY"] = item[key];
                            delete item[key];
                            break;
                        case "CSLimitUnit":
                            item["CSORD_C0003"] = item[key];
                            delete item[key];
                            break;
                    }
                }
            }.bind(this));
            for (var i = 1; i < 11; i++) {
                var colOut = String.format("OUT_PRICE{0}_VAT_YN", i.toString());
                if (Object.keys(item).contains(colOut)) {
                    item[colOut] = item[colOut] == "1" ? "Y" : "N";
                }
            }
        }.bind(this));

        return data;
    },
    //저장
    SaveData: function (isLine) {

        this.showProgressbar(true);
        var self = this,
            btn = this.footer.get(0).getControl("save"),
            paramData = {};
        
        if (self.isLineSave)
            return;

        var listOfProdCode = this.sendData.select(function (o) {
            return o["PROD_CD"];
        });

        if (this.sendData.length > 0 && listOfProdCode.length > 0) {
            this.sendData = this.prodSaveValueSet(this.sendData);
            paramData = {
                DefaultBulkDatas: [],
                FORM_SEQ: 2,
                FORM_TYPE:"SI902",
                GetSelectedColumns: this._selectedItem,
                IsGetBasicTab:true,
                IsSlipBundling: true,
                IsListSelectChangeData: true
            }
            this.sendData.forEach(function (item, i) {
                paramData.DefaultBulkDatas.push({
                    BulkDatas: item,
                    Line: item.Line
                })
            }.bind(this));
            self.isLineSave = true;
            save.call(this);
        }
        else {
            btn.setAllowClick();
        };

        function save() {
            ecount.common.api({
                url: "/Inventory/Basic/UploadRegistedProductDataDataForTemplate",
                data: paramData,
                complete: function () {
                    self.isLineSave = false;
                    return false;
                },
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(ecount.resource.MSG00710, function () {
                            self.close(false);
                            btn.setAllowClick();
                        });
                        return;
                    };
                    self.hideProgressbar(true);
                    self.resultData = result.Data;  //resultData: ECount.ERP.Data.Common.Form.BulkDataTemplateErrDataDto > 형태
                    self.openErrorResult({ isLine: isLine });
                    self.checkErrorResult(self.resultData['ResultDetails']);
                }
            });
            
            btn.setAllowClick();
        }
    },

    

    //컨트롤 이름 변경
    getControlReName: function (value) {
        if (["CLASS_CD", "CLASS_CD2", "CLASS_CD3"].contains(value)) {
            value = value.replace("CLASS_CD", "") == "" ? "txtClassCd1" : String.format("txtClassCd{0}", value.replace("CLASS_CD", ""));
        }
        return value;
    },

    //로드완료시 값 변경
    setLoadSetting: function (line, isForm) {        
        var getData = this.getDataOrControlName(line, isForm, "PROD_TYPE_BASE"),
            prodData = getData.data,
            controlName = getData.controlName,
            getControl = this.contents.getControl(controlName),
            prodTypeContorlName = this.getControlName(line, isForm, "PROD_TYPE");

        var prodType = getControl ? getControl.get(prodTypeContorlName).getValue() : prodData.PROD_TYPE;
        
        var isMultiProcess = (prodData.PROD_CD == prodData.G_PROD_CD);
        var PROD_FLAG = (prodData.PROD_CD == prodData.G_PROD_CD) ? "G" : "S";
        if (isForm) {
            isMultiProcess = false;
            PROD_FLAG = "S";
        }

        if (isMultiProcess == true && PROD_FLAG && PROD_FLAG.equals("G")) {
            var isProdTypeDefCange = prodData && ["0", "3", "4"].contains(prodData.PROD_TYPE) && this.EditFlag == "I";
            getControl && getControl.get(prodTypeContorlName).hideCompByValue(["0", "3", "4", "7"]);
            getControl && getControl.get(prodTypeContorlName).setValue(0, prodData ? (isProdTypeDefCange ? "1" : prodData.PROD_TYPE) : "1");
        }        

        if (prodData && !(["1", "3"].contains(prodData.PROD_TYPE))) {
            getControl && getControl.get(this.getControlName(line, isForm, "SET_FLAG")).hide(true);
            
        }
        // 다공정의 하위공정이면 주품목 설정을 숨김
        if (prodData && prodData.G_PROD_CD != "") {
            mainControlName = isForm ? "MAIN_PROD_CD_BASE" : String.format("MAIN_PROD_CD_BASE_{0}", line);
            this.contents.getControl(mainControlName) && this.contents.getControl(mainControlName).hideAll();  // 모든탭에서 숨기기
        }
        //원가-재료비 활성화여부
        // 제품, 반제품 일때 
        this.setMeterialCostControlByProdType(!["1", "2"].contains(prodData.PROD_TYPE),line, isForm);

        //원가-재료비외 활성화여부
        // 원재료, 부재료, (상품 & SET가 아닐때)
        this.setCostControlByProdType(!(["0", "4"].contains(prodData.PROD_TYPE) || (prodData.PROD_TYPE == "3" && (getControl ? getControl.get(this.getControlName(line, isForm, "SET_FLAG")).getValue() : prodData.SET_FLAG) == "0")), line, isForm);
    },

    // 표준원가 컨트롤 
    setCostControlByProdType: function (isVisible,line, isForm) {
        var expNameCtl = this.contents.getControl(isForm ? "EXPENSE_COST" : String.format("EXPENSE_COST_{0}", line)),
            labNameCtl = this.contents.getControl(isForm ? "LABOR_COST" : String.format("LABOR_COST_{0}", line)),
            outNameCtl = this.contents.getControl(isForm ? "OUT_COST" : String.format("OUT_COST_{0}", line))
            
        expNameCtl && expNameCtl.setReadOnly(isForm ? false: !isVisible);
        labNameCtl && labNameCtl.setReadOnly(isForm ? false : !isVisible);
        outNameCtl && outNameCtl.setReadOnly(isForm ? false : !isVisible);
        if (!isVisible) {
            expNameCtl && expNameCtl.setValue(0, 0, true);
            labNameCtl && labNameCtl.setValue(0, 0, true);
            outNameCtl && outNameCtl.setValue(0, 0, true);
        }
    },

    // 표준원가- 재료비 컨트롤 활성화 여부 
    setMeterialCostControlByProdType: function (isVisible, line, isForm) {
        var matNameCtl = this.contents.getControl(isForm ? "MATERIAL_COST" : String.format("MATERIAL_COST_{0}", line));
        matNameCtl && matNameCtl.setReadOnly(isForm ? false : !isVisible);
        if (!isVisible) {
            matNameCtl && matNameCtl.setValue(0, 0, true);
        }
    },

    // BOM SYNC 컨트롤 활성화 여부 
    bomSyncVisible: function (page, line, isForm) {
        var basicCtrl = null,
            ctrlBomYn = null,
            line = line || 0,
            getData = this.getDataOrControlName(line, isForm, "MAIN_PROD_CD_BASE"),
            prodData = getData.data,
            controlName = getData.controlName,
            syncControlName = this.getControlName(line, isForm, "SYNC_BOM_YN");

        if (prodData == null || (prodData && prodData.SYNC_BOM_YN != "Y")) {
            if (this.contents.getControl(controlName)) {

                basicCtrl = this.contents.getControl(controlName);                     //기본탭의 주품목코드
                ctrlBomYn = this.contents.getControl(controlName).get(syncControlName);    //수량탭의 주품목코드의 BOM동기화
                // 주품목을 입력한 경우
                if (this.contents.getControl(controlName)
                    .get(this.getControlName(line, isForm, "MAIN_PROD_CD"))
                    .getSelectedCode().where(function (x) {
                        return $.isEmpty(x) == false;
                }).length > 0) {
                    //보이는 조건
                    //  제품, 반제품, 상품이면서 세트체크 일때
                    //안보이는 조건
                    //  원재료, 부재료, 상품인데 체크아닐 때
                    if (this.isShowBomYn && this.isShowBomYn.call(this, line, isForm) === true) {
                        ctrlBomYn.show();
                        if (basicCtrl && basicCtrl.get) {
                            basicCtrl.get(syncControlName).show();
                        }
                    } else {
                        ctrlBomYn.setValue("N");
                        ctrlBomYn.hide();
                        if (basicCtrl && basicCtrl.get) {
                            basicCtrl.get(syncControlName).hide();
                        }
                    }
                } else {
                    ctrlBomYn.setValue("N");
                    ctrlBomYn.hide();
                    if (basicCtrl && basicCtrl.get) {
                        basicCtrl.get(syncControlName).hide();
                    }
                }

            }
        }
    },

    //bom체크
    isShowBomYn: function (line, isForm) {
        var getData = this.getDataOrControlName(line, isForm, "PROD_TYPE_BASE");
        var controlName = getData.controlName,
             prodData = getData.data,
            prodTypeControl = this.contents.getControl(controlName),
            thisProdType = prodTypeControl ? prodTypeControl.get(this.getControlName(line, isForm, "PROD_TYPE")).getValue() : prodData && prodData.PROD_TYPE,           //현재 품목의 품목구분
            _result = false;
        line = isForm ? this._itemRowCnt : line;
        this.checkProdTypeByMainProdCD[line] = this.checkProdTypeByMainProdCD[line] || (prodData && (prodData.MAIN_PROD_TYPE || prodData.MAIN_PROD_CD_PROD_TYPE));

        //주품목의 품목구분과 현재품목의 품목구분이 같은지 비교
        if (this.checkProdTypeByMainProdCD[line] && this.checkProdTypeByMainProdCD[line].equals(thisProdType)) {
            //생산가능한 품목구분인지
            if (['1', '2', '3'].contains(thisProdType)) {                                 
                _result = true;
                //생산가능한 품목구분인데, 상품이면서 세트구분에 체크가 안되어 있다면
                var setFlag = prodTypeControl ? prodTypeControl.get(this.getControlName(line, isForm, "SET_FLAG")).getValue() : prodData.SET_FLAG
                if (thisProdType.equals('3') && setFlag == "0") {
                    _result = false;
                }
            }
        } else {
            _result = false;
        }
       // this.checkProdTypeByMainProdCD = "";
        return _result;
    },
    //(i, key, checkControls, rowDatas)
    //공통이외의 체크
    etcValidateCheck: function (i, key, checkControls, rowDatas) {
        if (key == "PROD_IMAGE" && this.getIsColEssentialYn("PROD_IMAGE")) {
            if (checkControls && checkControls.getValue().length == 0) {
                checkControls.showError();
                return false;
            }
        }
        return true;
    },



});