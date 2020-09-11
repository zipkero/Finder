window.__define_resource && __define_resource("LBL10291","LBL03017","LBL03334","LBL10270","LBL00703","LBL30177","LBL06425","LBL10981","LBL10292","LBL06431","BTN00065","BTN00008","MSG05742","MSG01182","MSG05743","LBL02398","LBL02396","MSG05744","LBL04294","LBL03755","LBL01899","LBL00640","LBL02238","LBL02813","LBL01249","LBL02513","LBL02512","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL06434","LBL10030","MSG04752");
/****************************************************************************************************
1. Create Date : 2015.10.01
2. Creator     : 조영상
3. Description : 제고1 > 기초등록 > 단가적용 변경
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA073P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    strGroupCode: null, // 그룹코드구분 
    isChangeState: null,    // 변경상태값
    Price2: null,   // 단가 변수
    RowKey: null,
    isDefaultViewFlag : false,
    isCustViewFlag: false,
    
    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {

        this._super.init.apply(this, arguments);
        this.strGroupCode = $.isNull(this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG;
        this.Price2 = this.viewBag.InitDatas.GetSale007EGA028Sub;

        this.searchFormParameter = {
            CODE_CLASS: this.CODE_CLASS,
            PROD_CD: this.PROD_CD,
            KIND: this.KIND,
            CLASS_GUBUN: this.CLASS_GUBUN,    // 그룹코드구분(품목그룹구분, 필수값)  
            IN_VAT_RATE : 0
        };
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
        header.setTitle(ecount.resource.LBL10291) // (적용단가선택변경));
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {

        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var grid = g.grid();
        var thisObj = this;

        this.isCustViewFlag = thisObj.viewBag.InitDatas.IsPriceGroupView;

        

        if (this.IsCustView == "Y")
        {
            this.isDefaultViewFlag = true;
            this.isCustViewFlag = true;
        }

        // Initialize Grid
        grid.setRowData(thisObj.viewBag.InitDatas.GridFirstLoad)
            .setKeyColumn(["COME_CDE"])
            .setCheckBoxUse(true)
            .setColumnFixHeader(true)
            .setEditRowDataSample({ PRICE_CONTENT_RESULT: null})
            .setEditable(true, 0, 0)
            .setColumns([
                { propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '140',  },  // 품목코드
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03334, width: '140',  },    // 품목명
                { propertyName: 'PROD_CLASS_DES', id: 'PROD_CLASS_DES', title: ecount.resource.LBL10270, width: '120',  },    // 그룹명
                { propertyName: 'PRICE_GROUP', id: 'PRICE_GROUP', title: ecount.resource.LBL00703, width: '100', align: 'left', isHideColumn: this.isCustViewFlag },
                { propertyName: 'PRICE_GROUP2', id: 'PRICE_GROUP2', title: ecount.resource.LBL30177, width: '100', align: 'left', isHideColumn: true },
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL06425, width: '120', isHideColumn: this.isDefaultViewFlag },  // 특별단가그룹명
                { propertyName: 'KIND', id: 'KIND', title: ecount.resource.LBL10981, controlType: 'widget.select', width: '130', align: 'center', isHideColumn: this.isDefaultViewFlag },    // 단가종류
                { propertyName: 'PRICE_CONTENT', id: 'PRICE_CONTENT', title: ecount.resource.LBL10292, width: '250', align: 'left' },    // 품목그룹별조정내역
                { propertyName: 'PRICE', id: 'PRICE', title: ecount.resource.LBL06431, width: '130', align: 'right', dataType: ecount.config.company.ZERO_DISPLAY_YN ? "9" : "8" + ecount.config.inventory.DEC_P, isCheckZero: ecount.config.company.ZERO_CHK_YN, controlOption: { decimalUnit: [18, ecount.config.inventory.DEC_P] }, isCheckZero: ecount.config.company.ZERO_CHK_YN },  // 적용단가
                { propertyName: 'PRICE_VAT_YN', id: 'PRICE_VAT_YN', title: ecount.resource.LBL30177, controlType: 'widget.select', width: '100', align: 'left'},    // VAT포함여부
            ])

            .setCustomRowCell('KIND', this.setKindValues.bind(this))
            .setCustomRowCell('PRICE_CONTENT', this.setPriceContentValues.bind(this))
            .setCustomRowCell("PRICE_VAT_YN", this.setVatColumnValues.bind(this))
            .setCustomRowCell('PRICE', this.setGridDateCustomPrice.bind(this))
            .setCustomRowCell("PROD_DES", this.setItemDesValue.bind(this))
            .setCustomRowCell("PRICE_GROUP", this.setItemGroupValue.bind(this))

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // [하단] 영역 셋팅
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065))
               .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },

    // [하단] 닫기 버튼
    onFooterClose: function () {
        this.close();
    },

    // [컨텐츠] 품목명 규격 설정
    setItemDesValue: function (value, rowItem) {

        var option = {};
        if (rowItem.SIZE_DES != undefined && rowItem.SIZE_DES != "")
            option.data = value + ' [' + rowItem.SIZE_DES + ']';
        else
            option.data = value;
        return option;
    },

    // [하단] 저장 버튼
    onFooterSave: function () {

        var checkFlag = "N";
        var checkGroup = "N";
        var thisObj = this;
        var isOk = this.setCheckProd();

        var Rk = null;
        var count = 0;

        // 체크 확인
        if (isOk) {

            var check_param = {};
            var param = {};
            var selectItem = this.contents.getGrid().grid.getChecked();
            self.selectedCnt = selectItem.length;

            $.each(this.contents.getGrid().grid.getChecked(), function (i, item) {
                check_param = {
                    PRICE: item.PRICE,
                };
                // 값이 없을 경우 단가종류를 변경 하지 않은 경우
                if ($.isNull(item.PRICE_CONTENT_RESULT)) {
                    // 그룹
                    if (item.KIND == "1") {
                        check_param.KIND = "1";
                        // 조정 내역이 수정이 있는 케이스
                        if (!$.isNull(item.PRICE_CONTENT)) {
                            check_param.PRICE_RATE = item.PRICE_CONTENT.PRICE_RATE;
                        }
                    }
                    // 품목
                    else {
                        check_param.KIND = "2";
                    }
                }
                else {
                    switch (item.PRICE_CONTENT_RESULT) {
                        // 품목 => 그룹
                        case 2:
                        case 3:
                            checkGroup = "Y";

                            if (!$.isNull(item.PRICE_CONTENT.CLASS_CD)) {
                                check_param.KIND = "1";
                                check_param.PRICE_RATE = item.PRICE_CONTENT.PRICE_RATE;
                            }
                            else {
                                check_param.KIND = "3";
                                if (item.PRICE_CONTENT.indexOf("/") != -1) {
                                    check_param.PRICE_RATE = thisObj.fnContentConvert(item.PRICE_CONTENT, 1);
                                }
                            }
                            break;
                        // 그룹 => 품목
                        case 4:
                        case 5:
                            check_param.KIND = "4";
                            break;
                    }
                }

                var checkPrice_Rate = check_param.PRICE_RATE = "" ? check_param.PRICE_RATE : parseFloat(check_param.PRICE_RATE);
                var checkPrice = check_param.PRICE == "" ? check_param.PRICE : parseFloat(check_param.PRICE);

                // 변경 타켓 [그룹]
                // 그룹 조정값 확인
                if (check_param.KIND == "1" || check_param.KIND == "3") {
                    if (checkPrice_Rate == 0 || checkPrice_Rate.toString().trim() == "" || $.isNull(checkPrice_Rate)) {
                        checkFlag = "G";
                    }
                }
                // 변경 타켓 [품목]
                // 적용 단가 확인
                else if (check_param.KIND == "2" || check_param.KIND == "4") {
                    if (checkPrice == 0 || checkPrice.toString().trim() == "" || $.isNull(checkPrice)) {
                        checkFlag = "F";

                        if (count == 0) {
                            Rk = item[ecount.grid.constValue.keyColumnPropertyName];
                        }

                        count++;
                    }
                }
            });

            if (checkFlag == "N") {
                if (checkGroup == "Y") {
                    ecount.confirm(ecount.resource.MSG05742, function (status) {
                        if (status === true) {
                            thisObj.fnSaveApi();
                        }
                    })
                }
                else {
                    thisObj.fnSaveApi();
                }
            }
            else {
                if (checkFlag == "G") {
                    ecount.alert(ecount.resource.MSG01182);
                }
                else {
                    
                    ecount.alert(ecount.resource.MSG05743, function () {
                        thisObj.contents.getGrid().grid.setCellFocus("PRICE", Rk);
                    }.bind(this));

                    
                }
            }
        }
    },

    fnSaveApi:function(){

        var thisObj = this,
            datas = [];
        debugger;
        $.each(this.contents.getGrid().grid.getChecked(), function (i, item) {
            param = {
                CODE_CLASS: item.CODE_CLASS,
                CLASS_CD: item.CLASS_CD,
                PRICE_GUBUN: item.PRICE_GUBUN,
                PRICE_RATE: item.PRICE_RATE,
                PRICE_LESS: item.PRICE_LESS,
                PRICE_RISE: item.PRICE_RISE,
                PROD_CD: item.PROD_CD,
                PRICE: item.PRICE,
                PRICE_VAT_YN: item.PRICE_VAT_YN,
                CLASS_GUBUN: thisObj.strGroupCode
            };

            // 값이 없을 경우 단가종류를 변경 하지 않은 경우
            if ($.isNull(item.PRICE_CONTENT_RESULT)) {
                // 그룹
                if (item.KIND == "1") {
                    param.KIND = "1";

                    // 조정 내역이 수정이 있는 케이스
                    if (!$.isNull(item.PRICE_CONTENT)) {
                        param.PRICE_GUBUN = item.PRICE_CONTENT.PRICE_GUBUN;
                        param.PRICE_RATE = item.PRICE_CONTENT.PRICE_RATE;
                        param.PRICE_LESS = item.PRICE_CONTENT.PRICE_LESS;
                        param.PRICE_RISE = item.PRICE_CONTENT.PRICE_RISE;
                    }
                }
                // 품목
                else {
                    param.KIND = "2";
                }
            }
            else {

                switch (item.PRICE_CONTENT_RESULT) {
                    // 품목 => 그룹
                    case 2:
                    case 3:
                        if (!$.isNull(item.PRICE_CONTENT.CLASS_CD)) {
                            param.KIND = "1";
                            param.PRICE_GUBUN = item.PRICE_CONTENT.PRICE_GUBUN;
                            param.PRICE_RATE = item.PRICE_CONTENT.PRICE_RATE;
                            param.PRICE_LESS = item.PRICE_CONTENT.PRICE_LESS;
                            param.PRICE_RISE = item.PRICE_CONTENT.PRICE_RISE;
                        }
                        else {
                            param.KIND = "3";
                            if (item.PRICE_CONTENT.indexOf("/") != -1) {
                                param.PRICE_GUBUN = thisObj.fnContentConvert(item.PRICE_CONTENT, 0);
                                param.PRICE_RATE = thisObj.fnContentConvert(item.PRICE_CONTENT, 1);
                                param.PRICE_LESS = thisObj.fnContentConvert(item.PRICE_CONTENT, 2);
                                param.PRICE_RISE = thisObj.fnContentConvert(item.PRICE_CONTENT, 3);
                            }
                        }
                        break;
                    // 그룹 => 품목
                    case 4:
                    case 5:
                        param.KIND = "4";
                        break;
                }
            }

            datas.push(param);
        });

        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateBathPriceGroup",
            data: Object.toJSON({ Request: {Data: datas}}),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    thisObj.sendMessage(thisObj, "SAVE");

                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            }.bind(this)
        });
    },

    // [이벤트] 팝업창 내용 내려주기
    onMessageHandler: function (page, message) {
        var thisobj = this;
        thisobj.isChangeState = "MESSAGE";

        switch (page.pageID) {
            case "ESA071P_02":
                
                var class_gubun = "";
                var code_class = "";
                var prod_cd = "";
                var kind = "";
                var _grid = this.contents.getGrid().grid;

                // 비교 (조정내역 변경된 항목의 품목과 그리드의 그룹품목이 같은것 여부 확인)
                $.each(this.contents.getGrid('dataGrid').grid.getRowList(), function (i, item) {
                    // 1.그룹별 인것들중에서
                    if (item.KIND == "1") {
                        if (message.CODE_CLASS == item.CODE_CLASS) {
                            code_class += item.CODE_CLASS + ecount.delimiter,
                            prod_cd += item.PROD_CD + ecount.delimiter,
                            kind += item.KIND + ecount.delimiter
                        }
                    }
                });

                var param = {
                    CODE_CLASS: code_class,
                    PROD_CD: prod_cd,
                    KIND: kind + "1",
                    CLASS_GUBUN: this.strGroupCode,
                    IN_VAT_RATE: thisobj.viewBag.InitDatas.InVatRate
                };

                ecount.common.api({
                    url: "/Inventory/Basic/GetPriceLevelByItem",
                    data: Object.toJSON(param),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            $.each(thisobj.contents.getGrid('dataGrid').grid.getRowList(), function (i, item) {
                                if (item.KIND == "1") {
                                    $.each(result.Data, function (j, p_item) {
                                        if (item.CODE_CLASS == p_item.CODE_CLASS && item.PROD_CD == p_item.PROD_CD) {
                                            thisobj.fnSetCellCustom('PRICE', p_item.PRICE, _grid, i);   // 적용단가 변경
                                            _grid.setCell('PRICE_CONTENT', i, p_item);  // 조정내역 변경
                                        }
                                    });
                                }
                            });
                        }
                    }.bind(this)
                });

                if (thisobj.viewBag.InitDatas.GridFirstLoad[message.ROWINDEX]["KIND"] == "2") {
                    if (message.RESULT != "12") {

                        if (thisobj.viewBag.InitDatas.GridFirstLoad.count() != 1) {
                            _grid.removeRow(message.ROWINDEX, { removeDOM: true });
                            thisobj.viewBag.InitDatas.GridFirstLoad.remove(message.ROWINDEX, this)
                        }
                    }
                }

                message.callback && message.callback();
                break;
        }
    },

    // [컨텐츠] 단가종류 변경 (핵심 프로세스 진입루트)
    setKindValues: function (value, rowItem) {

        var _grid = this.contents.getGrid().grid;
        var option = {
            controlType: 'widget.empty'
        };

        if (rowItem.KIND != "") {
            var selectOption = new Array();
            option.controlType = 'widget.select';
            selectOption.push(['1', ecount.resource.LBL02398, '']); // 품목그룹별단가
            selectOption.push(['2', ecount.resource.LBL02396, '']); // 품목별단가
            option.optionData = selectOption;
        }

        // 단가종류 변경 이벤트
        option.event = {
            'change': function (e, data) {

                var checkFlag = false;
                var objthis = this;
                var param = {
                    KIND: data.rowItem.KIND,
                    CLASS_GUBUN: this.strGroupCode,
                    CODE_CLASS: data.rowItem.CODE_CLASS,
                    PROD_CD: data.rowItem.PROD_CD
                };

                ecount.common.api({
                    url: "/Inventory/Basic/CheckExistedProdPriceLevel",
                    data: Object.toJSON(param),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            _grid.setCell('PRICE_CONTENT_RESULT', data.rowKey, result.Data);

                            if (result.Data == '1') {   // 상태값 1일 경우는 제외
                                ecount.alert(ecount.resource.MSG05744);
                                _grid.setCell("KIND", data.rowKey, "2");
                            }
                            else {
                                objthis.fnSetting('Value', 'PRICE_CONTENT', result.Data, option, data.rowItem, _grid, data.rowKey);
                                objthis.fnSetting('Value', 'PRICE', result.Data, option, data.rowItem, _grid, data.rowKey);
                                _grid.refreshCell('PRICE_VAT_YN', data.rowKey);     // VAT포함여부
                                objthis.isChangeState = "UI";
                                _grid.refreshCell('PRICE_CONTENT', data.rowKey);    // 품목그룹별조정내역
                                _grid.refreshCell('PRICE', data.rowKey);            // 적용단가
                                objthis.fnCheckBox(data.rowIdx, data.rowItem, "KIND");

                                //if(result.Data == "4" || result.Data == "5")
                                //{
                                //    _grid.setCellFocus("PRICE", data.rowKey);
                                //}
                            }
                       } 
                    }
                });

            }.bind(this),
            'editComplete': function (e, data) {
                //if(result.Data == "4" || result.Data == "5")
                //{
                //    _grid.setCellFocus("PRICE", data.rowKey);
                //}
                if (data.rowItem['PRICE_CONTENT_RESULT'] == null)
                    this.contents.getGrid('dataGrid').grid.setCellFocus('PRICE', data.rowKey);
            }.bind(this)
        }
        return option;
    },

    fnCheckBox:function(rowKey, data, target){

        var _grid = this.contents.getGrid().grid;
        var oridata = this.viewBag.InitDatas.GridFirstLoad[rowKey][target];
        var newdata = data[target];

        if (target == "PRICE") {
            oridata = ecount.grid.helper.getDecimalValueByConvertor(this.viewBag.InitDatas.GridFirstLoad[rowKey][target], {
                dataType: "9" + ecount.config.inventory.DEC_P,
                isCheckZero: false,
                amtCalc: 'r',
                isShowIfZero: false
            });
        }
        else if (target == "PRICE_VAT_YN") {
            if (newdata == ecount.resource.LBL04294) {
                newdata == "N";
            } else if (newdata == ecount.resource.LBL03755) {
                newdata == "Y";
            }
        }

        if (oridata != newdata) {
            _grid.addChecked([data[ecount.grid.constValue.keyColumnPropertyName]]);
        }
        else {
            _grid.removeChecked([data[ecount.grid.constValue.keyColumnPropertyName]]);
        }
    },

    // [컨텐츠] 적용단가 변경
    setGridDateCustomPrice: function (value, rowItem) {

        var option = {};

        if (rowItem['PRICE_CONTENT_RESULT'] == null) {
            this.fnSetting('Start', 'PRICE', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, '', ''); // 최초 바인딩
        }
        else {
            this.fnSetting('UI', 'PRICE', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, '', '');    // UI 변경
        }

        option.event = {
            'change': function (e, data) {
                this.fnCheckBox(data.rowIdx, data.rowItem, "PRICE")
            }.bind(this)
            //, 'editComplete': function (e, data) {
            //    if (data.rowItem['PRICE_CONTENT_RESULT'] == null)
            //        this.contents.getGrid('dataGrid').setCellFocus('PRICE', data.rowKey);
            //}.bind(this)
        }
        return option;
    },

    // [컨텐츠] 품목그룹별조정내역 변경
    setPriceContentValues: function (value, rowItem) {
        debugger
        var option = {};

        if (rowItem['PRICE_CONTENT_RESULT'] == null) {  // 최초 바인딩
            if (this.isChangeState == "MESSAGE") {
                option = this.fnContentBind(value);
                this.fnPriceContentClick(option, value);
            }
            else {
                if (value != "") {
                    option = this.fnSetting('Start', 'PRICE_CONTENT', rowItem['PRICE_CONTENT_RESULT'], option, value, '', '');
                }
                else {
                    option = this.fnSetting('Start', 'PRICE_CONTENT', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, '', '');
                }
            }
        }
        else {
            if (this.isChangeState == "UI") {   // UI 변경
                this.fnSetting('UI', 'PRICE_CONTENT', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, '', '');
            } else if (this.isChangeState == "MESSAGE") {
                option = this.fnContentBind(value);
                this.fnPriceContentClick(option, value);
            }
        }
        return option;
    },

    // VAT 포함여부
    setVatColumnValues: function (value, rowItem) {
     
        var option = {};
        var _grid = this.contents.getGrid().grid;
        
        if (rowItem['PRICE_CONTENT_RESULT'] == null) {  // 최초 바인딩
            option = this.fnSetting('Start', 'PRICE_VAT_YN', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, '', '');
        }
        else {
            this.fnSetting('UI', 'PRICE_VAT_YN', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, '', ''); // UI 변경
            if (this.isChangeState == "Value" || this.isChangeState == "selectType") {
                option = this.fnSetting('Value', 'PRICE_VAT_YN', rowItem['PRICE_CONTENT_RESULT'], option, rowItem, _grid, rowItem["K-E-Y"]);
            }
        }

        option.event = {
            'change': function (e, data) {
                this.fnCheckBox(data.rowIdx, data.rowItem, "PRICE_VAT_YN")
            }.bind(this)
        }
        return option;
    },

    setItemGroupValue: function (value, rowItem) {

        var option = {};
        var priceGroup1 = rowItem.PRICE_GROUP;
        var priceGroup2 = rowItem.PRICE_GROUP2;

        if (!$.isNull(priceGroup1) && !$.isNull(priceGroup2)) {
            option.data = (String.format(ecount.resource.LBL01899 + '/' + ecount.resource.LBL00640));
        }
        else if (!$.isNull(priceGroup1) && $.isNull(priceGroup2)) {
            option.data = ecount.resource.LBL01899;
        }
        else if ($.isNull(priceGroup1) && !$.isNull(priceGroup2)) {
            option.data = ecount.resource.LBL00640;
        }
        else {
            option.data = "";
        }

        return option;
    },


    /**********************************************************************
    * define user function
    **********************************************************************/

    // 단가종류 변경 시 진행되는 프로세스
    fnSetting: function (process, target, result, option, totalData, grid, key) {

        // 품목 => 그룹
        // 1 : 품목그룹이 없는 품목일경우  
        // 2 : 품목의그룹은있으나품목그룹단가가설정되지않은상태  
        // 3 : 그외(품목그룹도있고, 품목그룹별단가도설정되었는경우)

        // 그룹 => 품목
        // 4 : 품목별단가가 등록되어있지않은경우
        // 5 : 품목별단가가 이미등록된경우  

        if (process == 'Start') {
            // 품목그룹별조정내역
            if (target == 'PRICE_CONTENT') {
                option = this.fnContentBind(totalData);
                this.fnPriceContentClick(option, totalData);
            }
                // 적용단가
            else if (target == 'PRICE') {
                if (totalData['KIND'] == '1') { // 그룹별
                    option.controlType = 'widget.label';
                }
                else {
                    option.controlType = 'widget.input.number';
                }
            }
            // Vat포함여부 (PRICE_VAT_YN)
            else {

                var selectOption = new Array();
                if (totalData['KIND'] == '1') { // 그룹별
                    option.controlType = 'widget.label';
                    option.data = totalData.PRICE_VAT_YN == 'Y' ? ecount.resource.LBL03755 : ecount.resource.LBL04294;
                }
                else {
                    option.controlType = 'widget.select';
                    selectOption.push(['Y', ecount.resource.LBL03755, '']);
                    selectOption.push(['N', ecount.resource.LBL04294, '']);

                    if (totalData.PRICE_VAT_YN == ecount.resource.LBL03755 || totalData.PRICE_VAT_YN == "Y") {
                        totalData.PRICE_VAT_YN = "Y";
                    }
                    else if (totalData.PRICE_VAT_YN == ecount.resource.LBL04294 || totalData.PRICE_VAT_YN == "N") {
                        totalData.PRICE_VAT_YN = "N";
                    }
                    else {
                        totalData.PRICE_VAT_YN = "N";
                    }

                    option.optionData = selectOption;
                    option.data = totalData.PRICE_VAT_YN;
                }
            }
        } else if (process == 'Value') {
            this.isChangeState = "Value";

            // 품목그룹별조정내역
            if (target == 'PRICE_CONTENT') {
                switch (result) {
                    case 1:
                        // 해당사항없음
                        break;
                    case 2:
                    case 4:
                    case 5:
                        grid.setCell('PRICE_CONTENT', key, this.fnContentBind(totalData).data);
                        break;
                    case 3:
                        // 계산식 부여하여 재 설정
                        var data = {
                            CLASS_CD: totalData.CLASS_CD
                        };
                        this.fnGetPriceInfo(data, key, grid);
                        break;
                }
            }
            // 적용단가
            else if (target == 'PRICE') {
                switch (result) {
                    case 1:
                        // 해당사항없음
                        break;
                    case 2:
                    case 4:
                        grid.setCell('PRICE', key, '0');
                        break;
                    case 3:
                        // 계산식 부여하여 재 설정
                        var data = {
                            CLASS_GUBUN: this.strGroupCode,
                            CLASS_CD: totalData.CLASS_CD,
                            IN_VAT_RATE: '',
                            OUT_VAT_RATE: '',
                            PROD_CD: totalData.PROD_CD,
                            KIND: 'G',
                            P_PRICE_RISE: '',
                            P_PRICE_GUBUN:'',
                            P_PRICE_LESS:0,
                            P_PRICE_RATE: 0,
                            INVATRATE: this.viewBag.InitDatas.InVatRate,
                            CODE_CLASS: totalData.CODE_CLASS
                        };
                        this.fnGetProdPrice(data, key, grid);
                        break;
                    case 5:
                        // 계산식 부여하여 재 설정
                        var data = {
                            CLASS_GUBUN: this.strGroupCode,
                            CLASS_CD: totalData.CLASS_CD,
                            IN_VAT_RATE: '',
                            OUT_VAT_RATE: '',
                            PROD_CD: totalData.PROD_CD,
                            KIND: 'P',
                            P_PRICE_RISE: '',
                            P_PRICE_GUBUN:'',
                            P_PRICE_LESS:0,
                            P_PRICE_RATE: 0,
                            INVATRATE: this.viewBag.InitDatas.InVatRate,
                            CODE_CLASS : totalData.CODE_CLASS
                        };
                        this.fnGetProdPrice(data, key, grid);
                        break;
                }
            }
            // Vat포함여부 (PRICE_VAT_YN)
            else {
                switch (result) {
                    // Vat포함 미사용으로
                    case 1:
                    case 2:
                    case 3:
                        this.isChangeState = "inputType"
                        grid.setCell('PRICE_VAT_YN', key, ecount.resource.LBL04294);
                        break;
                    case 4:
                    case 5:
                        this.isChangeState == "selectType"
                        var selectOption = new Array();

                        selectOption.push(['Y', ecount.resource.LBL03755, '']); // 사용
                        selectOption.push(['N', ecount.resource.LBL04294, '']); // 미사용

                        if (totalData.PRICE_VAT_YN == ecount.resource.LBL03755 || totalData.PRICE_VAT_YN == "Y")
                        {
                            totalData.PRICE_VAT_YN = "Y";
                        }
                        else if (totalData.PRICE_VAT_YN == ecount.resource.LBL04294 || totalData.PRICE_VAT_YN == "N")
                        {
                            totalData.PRICE_VAT_YN = "N";
                        }
                        else {
                            totalData.PRICE_VAT_YN = "N";
                        }
                        option.optionData = selectOption;
                        option.data = totalData.PRICE_VAT_YN;
                        break;
                }
            }
        }
        else if (process == 'UI') {

            // 품목그룹별조정내역
            if (target == 'PRICE_CONTENT') {
                switch (result) {
                    case 1:
                        option.controlType = 'widget.link';
                        break;
                    case 2:
                    case 3:
                        option.controlType = 'widget.link';
                        // 링크박스(품목그룹별단가수정창)
                        this.fnPriceContentClick(option, totalData);
                        break;
                    case 4:
                    case 5:
                        option.controlType = 'widget.label';
                        break;
                }
            }
                // 적용단가
            else if (target == 'PRICE') {
                switch (result) {
                    case 1:
                    case 2:
                    case 3:
                        option.controlType = 'widget.label';
                        break;
                    case 4:
                    case 5:
                        option.controlType = 'widget.input.number';
                        break;
                }
            }
                // Vat포함여부 (PRICE_VAT_YN)
            else {
                switch (result) {
                    case 1:
                    case 2:
                    case 3:
                        option.controlType = 'widget.label';
                        break;
                    case 4:
                    case 5:
                        option.controlType = 'widget.select';
                        break;
                }
            }
        }
        return option;
    },

    // 품목의 조정내역 상세내용 가져오기 API
    fnGetPriceInfo: function (param, key, gird) {

        ecount.common.api({
            url: "/Inventory/Basic/GetPriceInfo",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    this.fnSetCellCustom('PRICE_CONTENT', result.Data, gird, key);
                }
            }.bind(this)
        });
    },
    
    // 품목의 계산식 가져오는 API
    fnGetProdPrice: function (param,key, gird ) {

        ecount.common.api({
            url: "/Inventory/Basic/GetProdPrice",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    

                    if ($.isNull(result.Data[0])) {
                        this.fnSetCellCustom('PRICE', 0, gird, key);
                    }
                    else {
                        this.fnSetCellCustom('PRICE', result.Data[0]['PRICE'], gird, key);
                    }

                }
            }.bind(this)
        });
    },

    // 그리드 선택셀 타입 변경 공통함수
    fnSetCellCustom: function (cate, result, grid, key) {
        if (cate == 'PRICE') {
            grid.setCell(cate, key, result);
        }
        else {
            grid.setCell(cate, key, this.fnContentBind(result).data);
        }
    },

    
    // 조정내역 반환 함수
    fnContentBind: function (value) {

        var Item = {};
        var option = {
            controlType: 'widget.empty'
        };

        if (value[0] == undefined)
        {
            Item = value;
        }
        else {
            Item = value[0];
        }

        if (Item.KIND != "") {
            option.controlType = 'widget.DefaultType';
            if (Item.KIND == "1") {
                option.controlType = 'widget.link';
                //set strPriceGubun Value
                if (Item.PRICE_GUBUN == "I") { this.strPriceGubun = ecount.resource.LBL02238 }
                else if (Item.PRICE_GUBUN == "O") { this.strPriceGubun = ecount.resource.LBL02813 }
                else if (Item.PRICE_GUBUN == "A") { this.strPriceGubun = this.Price2[0].PRICE_1 }
                else if (Item.PRICE_GUBUN == "B") { this.strPriceGubun = this.Price2[0].PRICE_2 }
                else if (Item.PRICE_GUBUN == "C") { this.strPriceGubun = this.Price2[0].PRICE_3 }
                else if (Item.PRICE_GUBUN == "D") { this.strPriceGubun = this.Price2[0].PRICE_4 }
                else if (Item.PRICE_GUBUN == "E") { this.strPriceGubun = this.Price2[0].PRICE_5 }
                else if (Item.PRICE_GUBUN == "F") { this.strPriceGubun = this.Price2[0].PRICE_6 }
                else if (Item.PRICE_GUBUN == "G") { this.strPriceGubun = this.Price2[0].PRICE_7 }
                else if (Item.PRICE_GUBUN == "H") { this.strPriceGubun = this.Price2[0].PRICE_8 }
                else if (Item.PRICE_GUBUN == "9") { this.strPriceGubun = this.Price2[0].PRICE_9 }
                else if (Item.PRICE_GUBUN == "J") { this.strPriceGubun = this.Price2[0].PRICE_10 }
                else {
                    this.strPriceGubun = ecount.resource.LBL02238
                }
                //Set strPriceRise value
                if (Item.PRICE_RISE == "R") { this.strPriceRise = ecount.resource.LBL01249 }
                else if (Item.PRICE_RISE == "C") { this.strPriceRise = ecount.resource.LBL02513 }
                else if (Item.PRICE_RISE == "F") { this.strPriceRise = ecount.resource.LBL02512 }
                else {
                    this.strPriceRise = ecount.resource.LBL01249
                }

                this.iPriceRate = Math.floor(Number(Item.PRICE_RATE) * Number(Math.pow(10, 4))) / Number(Math.pow(10, 4));
                var sPriceRate = String.fastFormat(this.iPriceRate, {
                    fractionLimit: ecount.config.inventory.DEC_RATE,
                    removeFractionIfZero: true
                });

                if (Item.PRICE_LESS == "1000000.0000000000") this.strPriceLess = ecount.resource.LBL00097;
                else if (Item.PRICE_LESS == "100000.0000000000") this.strPriceLess = ecount.resource.LBL00096;
                else if (Item.PRICE_LESS == "10000.0000000000") this.strPriceLess = ecount.resource.LBL00095;
                else if (Item.PRICE_LESS == "1000.0000000000") this.strPriceLess = ecount.resource.LBL00094;
                else if (Item.PRICE_LESS == "100.0000000000") this.strPriceLess = ecount.resource.LBL00093;
                else if (Item.PRICE_LESS == "10.0000000000") this.strPriceLess = ecount.resource.LBL00084;
                else if (Item.PRICE_LESS == "1.0000000000") this.strPriceLess = ecount.resource.LBL00085;
                else if (Item.PRICE_LESS == "0.1000000000") this.strPriceLess = ecount.resource.LBL00086;
                else if (Item.PRICE_LESS == "0.0100000000") this.strPriceLess = ecount.resource.LBL00087;
                else if (Item.PRICE_LESS == "0.0010000000") this.strPriceLess = ecount.resource.LBL00088;
                else {
                    this.strPriceLess = ecount.resource.LBL00085
                }
                
                //option.data = this.strPriceGubun + '/' + this.iPriceRate + '/' + this.strPriceLess + '/' + this.strPriceRise;
                option.data = this.strPriceGubun + '/' + sPriceRate + '/' + this.strPriceLess + '/' + this.strPriceRise;
            }
            else {
                option.data = ecount.resource.LBL02396;
            }
        }
        return option;
    },

    // 원천데이터 조정내역로 변환하여 리턴 함수
    fnContentConvert:function(value, num){

        var strResult = "";
        var jbSplit = value.split('/');

        switch(num)
        {
            //PRICE_GUBUN
            case 0:
                if (jbSplit[num] == ecount.resource.LBL02238) { strResult = "I"; }
                else if (jbSplit[num] == ecount.resource.LBL02813) { strResult = "O"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_1) { strResult = "A"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_2) { strResult = "B"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_3 ) { strResult = "C"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_4 ) { strResult = "D"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_5 ) { strResult = "E"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_6 ) { strResult = "F"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_7 ) { strResult = "G"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_8 ) { strResult = "H"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_9 ) { strResult = "9"; }
                else if (jbSplit[num] == this.Price2[0].PRICE_10) { strResult = "J"; }
                else { strResult = "I"; }
                break;
            //PRICE_RATE
            case 1:
                strResult = jbSplit[num];
                break;
            //PRICE_LESS
            case 2:
                if (jbSplit[num] == ecount.resource.LBL00097) { strResult = "1000000.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00096) { strResult = "100000.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00095) { strResult = "10000.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00094) { strResult = "1000.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00093) { strResult = "100.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00084) { strResult = "10.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00085) { strResult = "1.0000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00086) { strResult = "0.1000000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00087) { strResult = "0.0100000000"; }
                else if (jbSplit[num] == ecount.resource.LBL00088) { strResult = "0.0010000000"; }
                else { strResult = "1.0000000000"; }
                break;
            //PRICE_RISE
            case 3:
                if (jbSplit[num] == ecount.resource.LBL01249) { strResult = "R"; }
                else if (jbSplit[num] == ecount.resource.LBL02513) { strResult = "C"; }
                else if (jbSplit[num] == ecount.resource.LBL02512) { strResult = "F"; }
                else { strResult = "R" }
                break;
        }
        return strResult;
    },
    
    fnPriceContentClick: function (option, totalData) {

        var thisObj = this;
        if (totalData['KIND'] == '1') { // 그룹별일 경우 링크 이벤트 발생
            option.event = {
                'click': function (e, data) {
                    var v_PRICE_GUBUN, v_PRICE_RATE, v_PRICE_LESS, v_PRICE_RISE;
                    if (!$.isNull(data.newValue)) {
                        if ($.isNull(data.newValue.CODE_CLASS)) {
                            if (data.newValue.indexOf("/") != -1) {
                                v_PRICE_GUBUN = thisObj.fnContentConvert(data.newValue, 0);
                                v_PRICE_RATE = thisObj.fnContentConvert(data.newValue, 1);
                                v_PRICE_LESS = thisObj.fnContentConvert(data.newValue, 2);
                                v_PRICE_RISE = thisObj.fnContentConvert(data.newValue, 3);
                            }
                        }
                        else {
                            v_PRICE_GUBUN = data.newValue.PRICE_GUBUN;
                            v_PRICE_RATE = data.newValue.PRICE_RATE;
                            v_PRICE_LESS = data.newValue.PRICE_LESS;
                            v_PRICE_RISE = data.newValue.PRICE_RISE;
                        }
                    }
                    else {
                        v_PRICE_GUBUN = data.rowItem['PRICE_GUBUN'];
                        v_PRICE_RATE = data.rowItem['PRICE_RATE'];
                        v_PRICE_LESS =  data.rowItem['PRICE_LESS'];
                        v_PRICE_RISE =  data.rowItem['PRICE_RISE'];
                    }

                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 300,
                        editFlag: 'V',
                        CODE_CLASS: data.rowItem['CODE_CLASS'],
                        CLASS_CD: data.rowItem['CLASS_CD'],
                        parentPageID: this.pageID,
                        responseID: this.callbackID,
                        CLASS_GUBUN: this.strGroupCode,
                        PROD_CD:data.rowItem['PROD_CD'],
                        rowIndex: data.rowKey,
                        P_CLASS_CD: data.rowItem['CLASS_CD'],
                        P_CLASS_DES: data.rowItem['CLASS_DES'],
                        P_CODE_CLASS_DES: data.rowItem['PROD_CLASS_DES'],
                        P_CODE_CLASS: data.rowItem['CODE_CLASS'],
                        P_PRICE_GUBUN: v_PRICE_GUBUN,
                        P_PRICE_RATE: v_PRICE_RATE,
                        P_PRICE_LESS: v_PRICE_LESS,
                        P_PRICE_RISE: v_PRICE_RISE
                    };

                    if (!$.isNull(data.newValue)) {
                        param.P_CheckRead = "N";
                    }
                    else {
                        param.P_CheckRead = "Y";
                    }

                    this.openWindow({
                        url: '/ECERP/ESA/ESA071P_02',
                        name: String.format(ecount.resource.LBL06434, ecount.resource.LBL10030),
                        param: param,
                        popupType: false,
                        additional: false
                    });
                    e.preventDefault();
                }.bind(this)
            };
        }
    },
   
    // 그리드 선택여부 확인 함수
    setCheckProd: function () {

        var isOk = true,
         _self = this;
        // 체크 확인
        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {    // 품목 선택 여부 체크
            ecount.alert(ecount.resource.MSG04752);
            return false;
        }
        return isOk;
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave();
    },




});