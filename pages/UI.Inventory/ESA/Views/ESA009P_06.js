window.__define_resource && __define_resource("BTN00113","BTN00007","BTN00008","BTN00235","LBL15055","LBL30237","MSG04553","LBL02475","LBL06247","LBL05716","LBL03961","LBL07879","LBL07880","LBL01647","LBL08396","LBL10932","LBL10923","LBL09077","LBL08831","LBL01448","BTN00204","LBL05428","LBL13100","LBL10548","LBL01688","LBL03017","LBL03004","LBL80099","BTN00264","MSG02158","MSG00336","MSG01041","LBL10109","MSG04190","LBL03176");
/****************************************************************************************************
1. Create Date  : 2015.11.07
2. Creator      : 이일용
3. Description  : 재고1 > 기초등록 > 품목등록
4. Precaution   :
5. History      : 
                    2016.07.20 (김정수) - 거래명세서 바코드 인쇄 기능 추가.
                    2018.12.21 (PhiVo) applied 17520-A18_04271
                    2019.02.25 (PhiVo) A19_00625-FE 리팩토링_페이지 일괄작업 10차
                    2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
					2020.01.28(양미진) - dev 35857 A20_00294 품목등록 > 바코드 > search > 품목코드(다중),(범위) 선택 불가능
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA009P_06", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    formSearchControlType: 'SN900',                             // 검색컨트롤폼타입
    formInputControlType: 'SI902',                              // 검색컨트롤폼타입
    formTypeCode: 'SR901',                                      // 리스트폼타입
    maxCheckCount: 100,                                         // 체크 가능 수 기본 100
    formInfoData: null,                                         // 리스트 양식정보
    finalSearchParam: null,                                     // 검색 시 정보
    finalHeaderSearch: null,                                    // 검색 시 검색 컨트롤 정보 (퀵서치)
    currentTabId: null,
    isShowSearchForm: '1',
    selectProdCodeList: '',
    selectProdDesList: '',
    //추가 항목
    commonCode: null,
    //선택값저장
    arrSelectBarCode: null,
    isSorted: false,
    gridChecked: false,
    isCheckbox: false,
    isFirstLoad: false, //최초 페이지 로드인지 여부
    colwidth: [160, 80, 160, 160, 160, 160, 160],

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/
    //userPermit: this.viewBag.Permission.Permit.Value,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    // init
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        //==================== 기초정보 설정 START====================
        var infoData = this.viewBag.InitDatas;
        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];

        /*품목코드 widgetType을 바꾼다.- 시작(개발및 선배포를 위해서 임시조치) TODO 명식*/
        //for (var i = 0; i < (this.viewBag.FormInfos["SN900"].items || []).length; i++) {
        //    var t = this.viewBag.FormInfos["SN900"].items[i];
        //    var searchone = t.subItems.find(function (column) { return column.id.toUpperCase() == "TXTSPRODCD" });
        //    if (searchone != null) {
        //        searchone["controlType"] = "widget.input.search";
        //    };
        //};
        /*품목코드 widgetType을 바꾼다.- 끝*/
        //==================== 기초정보 설정 END====================

        this.defaultSearchParameter = {
            FORM_TYPE: this.formTypeCode
            , FORM_SER: '1'
            , PROD_CD: ''
            , PROD_DES: ''
            , PROD_TYPE: ''
            , SIZE_DES: ''
            , BAR_CODE: ''
            , CLASS_CD: ''
            , CLASS_CD2: ''
            , CLASS_CD3: ''
            , PLANT_CD: ''
            , CUST: ''
            , VAT_YN: ''
            , TAX_PERCENT: '' //부가세율(매출)
            , VAT_RATE_BY: ''
            , VAT_RATE_BY_PERCENT: ''
            , INSPECT_STATUS: ''
            , SAMPLE_PERCENT: ''
            , REMARKS_WIN: ''
            , CONT1: ''
            , CONT2: ''
            , CONT3: ''
            , CONT4: ''
            , CONT5: ''
            , CONT6: ''
            , BAL_FLAG: ''
            , SAFE_A0001: ''
            , SAFE_A0002: ''
            , SAFE_A0003: ''
            , SAFE_A0004: ''
            , SAFE_A0005: ''
            , SAFE_A0006: ''
            , CS_FLAG: ''
            , PROCESS_FLAG: ''
            , SET_FLAG: ''
            , CANCEL: ''
            , LAN_TYPE: infoData.lanType
            , PROD_LEVEL_GROUP: ''
            , PROD_LEVEL_GROUP_CHK: ''
            , USER_ID: infoData.USER_ID
            , UNIT: ''
            , REMARKS: ''
            , QC_YN: ''
            , INSPECT_TYPE_CD: ''
            , IN_TERM_F: ''
            , IN_TERM_T: ''
            , MIN_QTY_F: ''
            , MIN_QTY_T: ''
            , MAIN_PROD_CD: ''
            , IN_PRICE_F: ''
            , IN_PRICE_T: ''
            , OUT_PRICE_F: ''
            , OUT_PRICE_T: ''
            , OUT_PRICE1_F: ''
            , OUT_PRICE1_T: ''
            , OUT_PRICE2_F: ''
            , OUT_PRICE2_T: ''
            , OUT_PRICE3_F: ''
            , OUT_PRICE3_T: ''
            , OUT_PRICE4_F: ''
            , OUT_PRICE4_T: ''
            , OUT_PRICE5_F: ''
            , OUT_PRICE5_T: ''
            , OUT_PRICE6_F: ''
            , OUT_PRICE6_T: ''
            , OUT_PRICE7_F: ''
            , OUT_PRICE7_T: ''
            , OUT_PRICE8_F: ''
            , OUT_PRICE8_T: ''
            , OUT_PRICE9_F: ''
            , OUT_PRICE9_T: ''
            , OUT_PRICE10_F: ''
            , OUT_PRICE10_T: ''
            , OUTSIDE_PRICE_F: ''
            , OUTSIDE_PRICE_T: ''
            , LABOR_WEIGHT_F: ''
            , LABOR_WEIGHT_T: ''
            , EXPENSES_WEIGHT_F: ''
            , EXPENSES_WEIGHT_T: ''
            , MATERIAL_COST_F: ''
            , MATERIAL_COST_T: ''
            , EXPENSE_COST_F: ''
            , EXPENSE_COST_T: ''
            , LABOR_COST_F: ''
            , LABOR_COST_T: ''
            , OUT_COST_F: ''
            , OUT_COST_T: ''
            , NO_USER1_F: ''
            , NO_USER1_T: ''
            , NO_USER2_F: ''
            , NO_USER2_T: ''
            , NO_USER3_F: ''
            , NO_USER3_T: ''
            , ITEM_TYPE: ''
            , SERIAL_TYPE: ''
            , PROD_SELL_TYPE: ''
            , PROD_WHMOVE_TYPE: ''
            , QC_BUY_TYPE: ''
            , C0001: ''
            , C0003: ''
            , QUICK_SEARCH: ''
            , EXCEL_FLAG: 'N'
            , SORT_COLUMN: 'PROD_CD'
            , SORT_TYPE: 'A'
            , PAGE_SIZE: this.formInfoData.option.pageSize
            , PAGE_CURRENT: 1
            , Is_From_ESD007R: false
            , MULTI_PROD_FLAG: ''
        };

        if ((this.isFromESD007R()) == false) {
            if (this.__ecPage__.exParam.C_param != undefined) {
                this.finalSearchParam = this.__ecPage__.exParam.C_param;
            } else {
                this.finalSearchParam = this.defaultSearchParameter;
            }
        } else {

            this.finalSearchParam = this.defaultSearchParameter;
        }
    },

    // initProperties
    initProperties: function (options) {
        this.commonCode = { cont1: "", cont2: "", cont3: "", cont4: "", cont5: "", cont6: "", cont7: "", cont8: "", cont9: "" };
        this.finalSearchParam = { QUICK_SEARCH: '' };
        this.arrSelectBarCode = new Array();
        this.isFirstLoad = true;
    },

    // render
    render: function () {
        if (this.isOpenPopup || false) {
            for (var i = 0; i < this.viewBag.FormInfos.SR901.columns.length; i++) {
                this.viewBag.FormInfos.SR901.columns[i].width = this.colwidth[i];
            };
            this.setLayout(this.viewBag.FormInfos.SR901);
        }
        this._super.render.apply(this);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        if ((this.isFromESD007R()) == false) {
            toolbar
                .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113))
                    .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));
        };

        if (this.isShowSearchClose) {
            toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        }

        if ((this.isFromESD007R()) == false) {
            tabContents
                .onSync()
                .setType('SN900')
                .setSeq(1)
                .filter(function (control) {
                    if (control.id === "84") {
                        return false;
                    }
                });
        }

        if ((this.isFromESD007R()) == false) {
            contents
                .add(tabContents)
                .add(toolbar);

            header
                .setTitle(ecount.resource.BTN00235)
                .notUsedBookmark()
                .useQuickSearch(true)
                .add("search", null, false)
                .addContents(contents);

            this.commonCode.cont1 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0101");
            this.commonCode.cont1 = this.commonCode.cont1 == '' ? ' ' : this.commonCode.cont1;
            this.commonCode.cont2 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0102");
            this.commonCode.cont2 = this.commonCode.cont2 == '' ? ' ' : this.commonCode.cont2;
            this.commonCode.cont3 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0103");
            this.commonCode.cont3 = this.commonCode.cont3 == '' ? ' ' : this.commonCode.cont3;
            this.commonCode.cont4 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0104");
            this.commonCode.cont4 = this.commonCode.cont4 == '' ? ' ' : this.commonCode.cont4;
            this.commonCode.cont5 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0105");
            this.commonCode.cont5 = this.commonCode.cont5 == '' ? ' ' : this.commonCode.cont5;
            this.commonCode.cont6 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0106");
            this.commonCode.cont6 = this.commonCode.cont6 == '' ? ' ' : this.commonCode.cont6;
            this.commonCode.cont7 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0201");
            this.commonCode.cont7 = this.commonCode.cont7 == '' ? ' ' : this.commonCode.cont7;
            this.commonCode.cont8 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0202");
            this.commonCode.cont8 = this.commonCode.cont8 == '' ? ' ' : this.commonCode.cont8;
            this.commonCode.cont9 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0203");
            this.commonCode.cont9 = this.commonCode.cont9 == '' ? ' ' : this.commonCode.cont9;
        }
        else {
            header
                .setTitle(ecount.resource.BTN00235)
                .notUsedBookmark()
                .useQuickSearch(false);
        };
    },

    // 일반품목 등록 시 컨트롤 초기화
    onInitControl: function (cid, control) {
        var g = widget.generator,
            ctrl = g.control();

        switch (cid) {
            case "txtSProdCd":
                // 1. 품목코드 1    -> PROD_CD
                if (!$.isEmpty(this.PROD_CD)) {
                    control.value(this.PROD_CD);
                }

				control.enableCustomDualControl({ useIndividual: false }).enableSerialzeOnVisible().end();
                control.addDualControls(ctrl.define('widget.multiCode.prod', 'MULTI', 'MULTI', ecount.resource.LBL15055)
                    .setDualLabel(ecount.resource.LBL15055)
                    .enableSerialzeOnVisible()
                    .end());
                control.addDualControls(ctrl.define('widget.input.between', 'BETWEEN', 'BETWEEN', ecount.resource.LBL30237)
                    .setDualLabel(ecount.resource.LBL30237)
                    .enableSerialzeOnVisible()
                    //.setOptions({ defaultDualStep: ['S', 'M'] })
                    //.setDualType('M')
                    .end());
                // 1. 품목코드 1    -> PROD_CD
                break;
            case "txtSProdDes":
                // 2. 품목명 2     -> PROD_DES
                control.maxLength(100);
                break;
            case "txtSizeDes":
                // 3. 규격명 3     -> SIZE_DES
                control.maxLength(100).value('');
                break;
            case "unit":
                // 4. 단위 4      -> UNIT
                control.maxLength(4).value('');
                break;
            case "rbProdChk":
                // 5. 품목구분 6    -> PROD_TYPE
                break;
            case "in_price":
                // 6. 입고단가 13   -> IN_PRICE
                control.inline()
                    .addControl(ctrl.define("widget.input", "IN_PRICE_F", "IN_PRICE_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and13").label("~"))
                    .addControl(ctrl.define("widget.input", "IN_PRICE_T", "IN_PRICE_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price":
                // 7. 출고단가 14
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE_F", "OUT_PRICE_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and14").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE_T", "OUT_PRICE_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "tax":
                // 8. 부가세율(매출) 10
                control.columns(6, 6);
                control.addControl(ctrl.define("widget.checkbox.whole", "VAT_YN", "VAT_YN").label([ecount.resource.LBL02475, ecount.resource.LBL06247, ecount.resource.LBL05716 + "(%)"]).value(["", "N", "Y"]).select("", "N", "Y"));
                control.addControl(ctrl.define("widget.input", "TAX_PERCENT", "TAX_PERCENT").numericOnly(6, 3, ecount.resource.MSG04553)); //.hide()
                break;
            case "txtBarCode":
                // 9. 바코드 7
                control.maxLength(30).value('');
                break;
            case "txtRemarksWin":
                // 10. 검색창내용 8
                control.maxLength(100).value('');
                break;
            case "cbCsFlag":
                // 11. 품목공유여부 12
                // <cbCsFlag></cbCsFlag>
                control.label([ecount.resource.LBL03961]).value(["1"]);
                break;
            case "ddlBadFlag":
                // 12. 재고수량관리 9
                control.label([ecount.resource.LBL02475, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "1", "0"]).select('', '1', '0')
                break;
            case "52":
                // 13. 이미지 52
                break;
            case "txtTreeGroupCd":
                // 14. 품목계층그룹 63
                break;
            case "txtClassCd1":
                // 15. 그룹코드1 5
                break;
            case "txtClassCd2":
                // 16. 그룹코드2 31
                break;
            case "txtClassCd3":
                // 17. 그룹코드3 32
                break;
            case "cbSetFlag":
                // 18. 세트여부 11
                control.label(ecount.resource.LBL01647).value("1");
                break;
            case "18":
                // 19. {0}당수량 18
                // 제외
                break;
            case "19":
                // 20. 안전재고수량 19
                // 제외
                break;
            case "in_term":
                // 21. 조달기간 20
                control.inline()
                    .addControl(ctrl.define("widget.input", "IN_TERM_F", "IN_TERM_F").numericOnly(5, 0, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and20").label("~"))
                    .addControl(ctrl.define("widget.input", "IN_TERM_T", "IN_TERM_T").numericOnly(5, 0, ecount.resource.MSG04553));
                break;
            case "min_qty":
                // 22. 최소구매단위 21
                control.inline()
                    .addControl(ctrl.define("widget.input", "MIN_QTY_F", "MIN_QTY_F").numericOnly(5, 0, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and21").label("~"))
                    .addControl(ctrl.define("widget.input", "MIN_QTY_T", "MIN_QTY_T").numericOnly(5, 0, ecount.resource.MSG04553));
                break;
            case "txtSCustCd":
                // 23. 구매처 22
                control.setOptions({ checkMaxCount: 100, label: false });
                break;
            case "txtSWhCd":
                // 24. 생산공정 23
                control.setOptions({ checkMaxCount: 100, label: false });
                break;
            case "outside_price":
                // 25. 외주비단가 33
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUTSIDE_PRICE_F", "OUTSIDE_PRICE_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and33").label("~"))
                    .addControl(ctrl.define("widget.input", "OUTSIDE_PRICE_T", "OUTSIDE_PRICE_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "labor_weight":
                // 26. 노무비가중치 34
                control.inline()
                    .addControl(ctrl.define("widget.input", "LABOR_WEIGHT_F", "LABOR_WEIGHT_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and34").label("~"))
                    .addControl(ctrl.define("widget.input", "LABOR_WEIGHT_T", "LABOR_WEIGHT_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "expenses_weight":
                // 27. 경비가중치 35
                control.inline()
                    .addControl(ctrl.define("widget.input", "EXPENSES_WEIGHT_F", "EXPENSES_WEIGHT_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and35").label("~"))
                    .addControl(ctrl.define("widget.input", "EXPENSES_WEIGHT_T", "EXPENSES_WEIGHT_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "remarks":
                // 28. 적요 30
                control.maxLength(100).value('');
                break;
            case "out_price1":
                // 29. 단가A 15
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_1 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE1_F", "OUT_PRICE1_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and15").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE1_T", "OUT_PRICE1_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price2":
                // 30. 단가B 16
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_2 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE2_F", "OUT_PRICE2_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and16").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE2_T", "OUT_PRICE2_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price3":
                // 31. 단가C 17
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_3 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE3_F", "OUT_PRICE3_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and17").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE3_T", "OUT_PRICE3_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price4":
                // 32. 단가D 39
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_4 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE4_F", "OUT_PRICE4_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and39").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE4_T", "OUT_PRICE4_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price5":
                // 33. 단가E 40
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_5 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE5_F", "OUT_PRICE5_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and40").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE5_T", "OUT_PRICE5_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price6":
                // 34. 단가F 41
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_6 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE6_F", "OUT_PRICE6_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and41").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE6_T", "OUT_PRICE6_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price7":
                // 35. 단가G 42
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_7 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE7_F", "OUT_PRICE7_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and42").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE7_T", "OUT_PRICE7_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price8":
                // 36. 단가H 43
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_8 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE8_F", "OUT_PRICE8_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and43").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE8_T", "OUT_PRICE8_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price9":
                // 37. 단가I 44
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_9 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE9_F", "OUT_PRICE9_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and44").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE9_T", "OUT_PRICE9_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price10":
                // 38. 단가J 45
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_10 });
                control.inline()
                   .addControl(ctrl.define("widget.input", "OUT_PRICE10_F", "OUT_PRICE10_F").numericOnly(18, 6, ecount.resource.MSG04553))
                   .addControl(ctrl.define("widget.label", "and44").label("~"))
                   .addControl(ctrl.define("widget.input", "OUT_PRICE10_T", "OUT_PRICE10_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "txtCont1":
                // 39. 문자형추가항목1 24
                if (this.commonCode.cont1 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont1 });

                control.maxLength(100).value('');
                break;
            case "txtCont2":
                // 40. 문자형추가항목2 25
                if (this.commonCode.cont2 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont2 });

                control.maxLength(100).value('');
                break;
            case "txtCont3":
                // 41. 문자형추가항목3 26
                if (this.commonCode.cont3 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont3 });

                control.maxLength(100).value('');
                break;
            case "txtCont4":
                // 42. 문자형추가항목4 27
                if (this.commonCode.cont4 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont4 });

                control.maxLength(100).value('');
                break;
            case "txtCont5":
                // 43. 문자형추가항목5 28
                if (this.commonCode.cont5 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont5 });

                control.maxLength(100).value('');
                break;
            case "txtCont6":
                // 44. 문자형추가항목6 29
                if (this.commonCode.cont6 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont6 });

                control.maxLength(100).value('');
                break;
            case "no_user1":
                // 45. 숫자형추가항목1 36
                if (this.commonCode.cont7 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont7 });

                control.inline()
                  .addControl(ctrl.define("widget.input", "NO_USER1_F", "NO_USER1_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and36").label("~"))
                  .addControl(ctrl.define("widget.input", "NO_USER1_T", "NO_USER1_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user2":
                // 46. 숫자형추가항목2 37
                if (this.commonCode.cont8 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont8 });

                control.inline()
                  .addControl(ctrl.define("widget.input", "NO_USER2_F", "NO_USER2_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and37").label("~"))
                  .addControl(ctrl.define("widget.input", "NO_USER2_T", "NO_USER2_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user3":
                // 47. 숫자형추가항목3 38
                if (this.commonCode.cont9 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont9 });

                control.inline()
                  .addControl(ctrl.define("widget.input", "NO_USER3_F", "NO_USER3_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and38").label("~"))
                  .addControl(ctrl.define("widget.input", "NO_USER3_T", "NO_USER3_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "material_cost":
                // 48. 재료비표준원가 46
                control.inline()
                  .addControl(ctrl.define("widget.input", "MATERIAL_COST_F", "MATERIAL_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and46").label("~"))
                  .addControl(ctrl.define("widget.input", "MATERIAL_COST_T", "MATERIAL_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "expense_cost":
                // 49. 경비표준원가 47
                control.inline()
                  .addControl(ctrl.define("widget.input", "EXPENSE_COST_F", "EXPENSE_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and47").label("~"))
                  .addControl(ctrl.define("widget.input", "EXPENSE_COST_T", "EXPENSE_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "labor_cost":
                // 50. 노무비표준원가 48
                control.inline()
                  .addControl(ctrl.define("widget.input", "LABOR_COST_F", "LABOR_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and48").label("~"))
                  .addControl(ctrl.define("widget.input", "LABOR_COST_T", "LABOR_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_cost":
                // 51. 외주비표준원가 49
                control.inline()
                  .addControl(ctrl.define("widget.input", "OUT_COST_F", "OUT_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                  .addControl(ctrl.define("widget.label", "and49").label("~"))
                  .addControl(ctrl.define("widget.input", "OUT_COST_T", "OUT_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "main_prod_cd":
                // 52. 주품목 50
                break;
            case "main_prod_convert_qty":
                // 53. 주품목 환산수량 51
                // 제외
                break;
            case "qc_yn":
                // 54. 품질검사요청대상-생산입고 53
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N")
                break;
            case "inspect_type_cd":
                // 55. 품질검사유형 54
                break;
            case "inspect_status": // 56. 품질검사방법 55
                control.columns(6, 6);
                /** numericOnly
                 * 숫자 형식만 입력 가능하게 설정한다.
                * @param {Number} totLen 전체 자리수
                * @param {Number} decimalLen 소수점 자리수
                * @param {String} [msg] readonly
                 */
                control.addControl(ctrl.define("widget.checkbox.whole", "INSPECT_STATUS", "INSPECT_STATUS").label([ecount.resource.LBL02475, ecount.resource.LBL10932, ecount.resource.LBL10923 + "(%)"]).value(["", "L", "S"]).select("", "L", "S"));
                control.addControl(ctrl.define("widget.input", "SAMPLE_PERCENT", "SAMPLE_PERCENT").numericOnly(6, 3, ecount.resource.MSG04553));
                break;
            case "56":
                // 57. 파일관리 56
                // 제외
                break;
            case "vat_rate_by":
                // 58. 부가세율(매입) 62
                control.columns(6, 6);
                control.addControl(ctrl.define("widget.checkbox.whole", "VAT_RATE_BY", "VAT_RATE_BY").label([ecount.resource.LBL02475, ecount.resource.LBL06247, ecount.resource.LBL05716 + "(%)"]).value(["", "N", "Y"]).select("", "N", "Y"));
                control.addControl(ctrl.define("widget.input", "VAT_RATE_BY_PERCENT", "VAT_RATE_BY_PERCENT").numericOnly(6, 3, ecount.resource.MSG04553));
                break;
            case "84":
                // 59. 안전재고관리 84
                break;
            case "SAFE_A0001":
                // 59. 안전재고관리-주문서 84-1
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2")
                break;
            case "SAFE_A0002":
                // 59. 안전재고관리-판매 84-2
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2")
                break;
            case "SAFE_A0003":
                // 59. 안전재고관리-생산불출 84-3
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2")
                break;
            case "SAFE_A0004":
                // 59. 안전재고관리-생산입고 84-4
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2")
                break;
            case "SAFE_A0005":
                // 59. 안전재고관리-창고이동 84-5
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2")
                break;
            case "SAFE_A0006":
                // 59. 안전재고관리-자가사용 84-6
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2")
                break;
            case "92":
                // 60. CS최소주문수량 92
                // 제외
                break;
            case "93":
                // 61. CS최소주문단위 93
                // 제외
                break;
            case "64":
                // 62. 재고수량 64
                // 제외
                break;
            case "item_type":
                // 63. 관리항목 57
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL09077, ecount.resource.LBL08831, ecount.resource.LBL07880]).value(["", "B", "M", "Y", "N"]).select("", "B", "M", "Y", "N");
                break;
            case "serial_type":
                // 64. 시리얼/로트No. 58
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL09077, ecount.resource.LBL08831, ecount.resource.LBL07880]).value(["", "B", "M", "Y", "N"]).select("", "B", "M", "Y", "N");
                break;
            case "prod_sell_type":
                // 65. 생산전표생성대상-판매 59
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N")
                break;
            case "prod_whmove_type":
                // 66. 생산전표생성대상-창고이동 60
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N")
                break;
            case "qc_buy_type":
                // 67. 품질검사요청대상-구매 61
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N")
                break;
            case "ddlCancelFlag":
                // 사용구분
                control.label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value(['', 'N', 'Y']).select('', 'N', 'Y');
                break;
            case "cbProcessFlag":
                // 다공정품목
                control
                   .addControl(ctrl.define("widget.checkbox", "PROCESS_FLAG", "PROCESS_FLAG").label([ecount.resource.LBL05428]).value([1]))
                   .addControl(ctrl.define("widget.checkbox", "MULTI_PROD_FLAG", "MULTI_PROD_FLAG").label([ecount.resource.LBL13100]).value([1])) //다규격품목
                   .addControl(ctrl.define("widget.checkbox", "BASE_DATE_CHK", "BASE_DATE_CHK").label([ecount.resource.LBL10548]));
                break;
            default:
                break;
        }
    },

    // 다른 페이지 이동, 돌아올때 실행.
	onInitControl_Submit: function (cid, control) {
        function numericOnly(obj, totLen, decimalLen, msg) {
            if (obj == null) return;

            obj.numericOnly = true;

            if (decimalLen == undefined) {
                decimalLen = decimalLen || ecount.common.number.maxpoint;
            }

            totLen = totLen || ecount.common.number.maxnumber;
            obj.numericRange = [totLen - decimalLen, decimalLen];
            obj.numericMsg = msg || "자리수 초과";
            obj.numericPattern = "";
		};


		switch (cid) {
			case "txtSProdCd":
				// 1. 품목코드 1    -> PROD_CD
				var g = widget.generator,
					ctrl = g.control();

				this._myFormdata = this._formdata;
				control.enableCustomDualControl({ useIndividual: false }).enableSerialzeOnVisible().end();
				control.addDualControls(ctrl.define('widget.multiCode.prod', 'MULTI', 'MULTI', ecount.resource.LBL15055)
					.setDualLabel(ecount.resource.LBL15055)
					.enableSerialzeOnVisible()
					.end());
				control.addDualControls(ctrl.define('widget.input.between', 'BETWEEN', 'BETWEEN', ecount.resource.LBL30237)
					.setDualLabel(ecount.resource.LBL30237)
					.enableSerialzeOnVisible()
					//.setOptions({ defaultDualStep: ['S', 'M'] })
					//.setDualType('M')
					.end());

				break;
            case "txtSProdDes":
                // 2. 품목명 2     -> PROD_DES
                control.maxLength(100).value(this.finalSearchParam.PROD_DES);
                break;
            case "txtSizeDes": // 3. 규격명 3     -> SIZE_DES
                control.maxLength(100);
                break;
            case "unit":
                // 4. 단위 4      -> UNIT
                control.maxLength(4);
                break;
            case "in_term":		    // 21. 조달기간 20
            case "min_qty":	        // 22. 최소구매단위 21
                var option = control.getControlOption(0);
                var option2 = control.getControlOption(2);
                numericOnly(option, 5, 0, ecount.resource.MSG04553);
                numericOnly(option2, 5, 0, ecount.resource.MSG04553);
                control.inline();
                break;
            case "in_price":        // 6. 입고단가 13   -> IN_PRICE
            case "out_price":       // 7. 출고단가 14
            case "outside_price":   // 25. 외주비단가 33
            case "labor_weight":    // 26. 노무비가중치 34
            case "expenses_weight": // 27. 경비가중치 35
            case "out_price1":      // 29. 단가A 15
            case "out_price2":      // 30. 단가B 16
            case "out_price3":      // 31. 단가C 17
            case "out_price4":      // 32. 단가D 39
            case "out_price5":      // 33. 단가E 40
            case "out_price6":      // 34. 단가F 41
            case "out_price7":      // 35. 단가G 42
            case "out_price8":      // 36. 단가H 43
            case "out_price9":      // 37. 단가I 44
            case "out_price10":     // 38. 단가J 45
                var option = control.getControlOption(0);
                var option2 = control.getControlOption(2);
                numericOnly(option, 18, 6, ecount.resource.MSG04553);
                numericOnly(option2, 18, 6, ecount.resource.MSG04553);
                control.inline();
                break;
            case "tax":                 // 8. 부가세율(매출) 10                
                var option1 = control.getControlOption(1);
                if (['Y'].contains(this.defaultSearchParameter.VAT_YN)) {
                    option1.hidden = true;
                }

                numericOnly(option1, 6, 3, ecount.resource.MSG04553);
                control.columns(6, 6);
                break;
            case "txtBarCode":      // 9. 바코드 7
                control.maxLength(30);
                break;
            case "txtRemarksWin":   // 10. 검색창내용 8
                control.maxLength(100);
                break;
            case "remarks":         // 28. 적요 30
                control.maxLength(100);
                break;
            case "txtCont1":        // 39. 문자형추가항목1 24
            case "txtCont2":        // 40. 문자형추가항목2 25
            case "txtCont3":        // 41. 문자형추가항목3 26
            case "txtCont4":        // 42. 문자형추가항목4 27
            case "txtCont5":        // 43. 문자형추가항목5 28
            case "txtCont6":        // 44. 문자형추가항목6 29
                control.maxLength(100);
                break;
            case "no_user1":        // 45. 숫자형추가항목1 36
            case "no_user2":        // 46. 숫자형추가항목2 37
            case "no_user3":        // 47. 숫자형추가항목3 38
                var option = control.getControlOption(0);
                var option2 = control.getControlOption(2);
                numericOnly(option, 18, 6, ecount.resource.MSG04553);
                numericOnly(option2, 18, 6, ecount.resource.MSG04553);
                control.inline();
                break;
            case "material_cost":   // 48. 재료비표준원가 46
            case "expense_cost":    // 49. 경비표준원가 47
            case "labor_cost":      // 50. 노무비표준원가 48
            case "out_cost":        // 51. 외주비표준원가 49
                var option = control.getControlOption(0);
                var option2 = control.getControlOption(2);
                numericOnly(option, 18, 6, ecount.resource.MSG04553);
                numericOnly(option2, 18, 6, ecount.resource.MSG04553);
                control.inline();
                break;
            case "inspect_status":  // 56. 품질검사방법 55
                var option1 = control.getControlOption(1);
                if (['Y'].contains(this.defaultSearchParameter.INSPECT_STATUS)) {
                    option1.hidden = true;
                }

                numericOnly(option1, 6, 3, ecount.resource.MSG04553);
                control.columns(6, 6);
                break;
            case "vat_rate_by": // 58. 부가세율(매입) 62
                var option1 = control.getControlOption(1);
                if (['Y'].contains(this.defaultSearchParameter.VAT_RATE_BY)) {
                    option1.hidden = true;
                    //option2.hidden = true
                }

                numericOnly(option1, 6, 3, ecount.resource.MSG04553);
                control.columns(6, 6);
                break;
        }
    },
    // 컨트롤 변경시
    onChangeControl: function (control, data) {
        var controlName
        var controlNameBasic;
        var selControlName = control.__self.pcid;

        // 부가세율(매출), 부가세율(매입), 품질검사방법
        if (['tax', 'vat_rate_by', 'inspect_status'].contains(selControlName)) {
            controlName = this.header.getControl(selControlName);
            controlNameBasic = this.header.getControl(selControlName, "BASIC");
            controlNameTarget = this.header.getControl(selControlName, "PROD");

            if (controlNameBasic != undefined) {
                this.fnChangeControlShowHide(controlNameBasic, controlNameBasic.get(1), controlName.get(0).getValue(2))
            }

            if (controlNameTarget != undefined) {
                this.fnChangeControlShowHide(controlNameTarget, controlNameTarget.get(1), controlName.get(0).getValue(2))
            }

            if (this.currentTabId == "BASIC") {
                controlNameBasic.get(1).setFocus(0);
            } else if (this.currentTabId == "PROD") {
                controlNameTarget.get(1).setFocus(0);
            }
        }
        else if (selControlName == "cbProcessFlag") {
            controlName = this.header.getControl(selControlName);
            controlNameBasic = this.header.getControl(selControlName, "BASIC");
            controlNameTarget = this.header.getControl(selControlName, "PROD");

            if (control.cid == "PROCESS_FLAG" && control.value == true) {
                controlNameTarget && controlNameTarget.get(1).setValue(0, 0, true);
                if (controlNameBasic != undefined) {
                    controlNameBasic && controlNameBasic.get(1).readOnly(true);
                }

                if (controlNameTarget != undefined) {
                    controlNameTarget && controlNameTarget.get(1).readOnly(true);
                }
            } else if (control.cid == "PROCESS_FLAG" && control.value == false) {

                if (controlNameBasic != undefined) {
                    controlNameBasic && controlNameBasic.get(1).readOnly(false);
                }

                if (controlNameTarget != undefined) {
                    controlNameTarget && controlNameTarget.get(1).readOnly(false);
                }
            }
            if (control.cid == "MULTI_PROD_FLAG" && control.value == true) {
                controlNameTarget && controlNameTarget.get(0).setValue(0, 0, true);
                if (controlNameBasic != undefined) {
                    controlNameBasic && controlNameBasic.get(0).readOnly(true);
                }

                if (controlNameTarget != undefined) {
                    controlNameTarget && controlNameTarget.get(0).readOnly(true);
                }
            } else if (control.cid == "MULTI_PROD_FLAG" && control.value == false) {
                controlNameBasic = this.header.getControl(selControlName, "BASIC");
                controlNameTarget = this.header.getControl(selControlName, "PROD");

                if (controlNameBasic != undefined) {
                    controlNameBasic && controlNameBasic.get(0).readOnly(false);
                }

                if (controlNameTarget != undefined) {
                    controlNameTarget && controlNameTarget.get(0).readOnly(false);
                }
            }
        }
    },

    // 컨트롤 hide or show
    fnChangeControlShowHide: function (control, controlTarget, flag) {
        if (controlTarget.controlType.indexOf('widget.input') > -1) {
            if (control != undefined && controlTarget != undefined) {
                if (flag) {
                    controlTarget.disabled(false);//.show();
                } else {
                    controlTarget.disabled(true);//.hide();
                }
            }
        } else {
            if (control != undefined && controlTarget != undefined) {
                if (flag) {
                    controlTarget.show();
                } else {
                    controlTarget.hide();
                }
            }
        }
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            grid = g.grid();

        if (this.isFromESD007R() == false) {
            this.finalSearchParam.Is_From_ESD007R = false;
            grid
                .setEditable(true, 0, 0)
                .setRowData(this.viewBag.InitDatas.LoadData)
                .setRowDataUrl('/Inventory/Basic/GetListProd')
                .setRowDataParameter(this.finalSearchParam)
                .setFormParameter({ FormType: this.formTypeCode, FormSeq: 2, ReturnType: 5 })
                .setColumns([
                        { propertyName: 'S_CHK', id: 'S_CHK', title: "S_CHK", width: '160', isHideColumn: true },
                        { propertyName: 'S_INPUT', id: 'S_INPUT', title: ecount.resource.LBL01688, width: '105', dataType: "80", controlType: 'widget.input.number', controlOption: { decimalUnit: [3, 0] } }, //"수량"
                        { propertyName: 'SALE003.PROD_CD', id: 'SALE003.PROD_CD', title: ecount.resource.LBL03017, width: '160', align: 'left' }, // "품목코드"
                        { propertyName: 'SALE003.PROD_DES', id: 'SALE003.PROD_DES', title: ecount.resource.LBL03004, width: '160', align: 'left' }, //"품목명"
                        { propertyName: 'S003_SIZE.CLASS_SIZE', id: 'S003_SIZE.CLASS_SIZE', title: ecount.resource.LBL80099, width: '160', align: 'center' }, //"규격"
                        { propertyName: 'SALE003.BAR_CODE', id: 'SALE003.BAR_CODE', title: ecount.resource.BTN00264, width: '160', align: 'center' }, //"바코드"
                        { propertyName: 'S_HIDDEN', id: 'S_HIDDEN', title: 'S_HIDDEN', width: '160', align: 'center', isHideColumn: true }
                ])
                .setKeyColumn(['PROD_CD'])
                .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
                .setColumnFixHeader(true)
                // Paging
                .setPagingUse(true)
                .setPagingRowCountPerPage(50, true)
                // CheckBox
                .setCheckBoxUse(true)
                .setCheckBoxMaxCount(this.maxCheckCount)
                .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })
                .setCheckBoxCallback({ 'click': this.setGridCheckBoxClickEvent.bind(this), 'change': this.setGridCheckBoxChangeEvent.bind(this) })
                .setCheckBoxHeaderCallback({ 'click': this.setGridCheckBoxAllClickEvent.bind(this), 'change': this.setGridCheckBoxChangeEvent.bind(this) })
                .setColumnSortable(true)
                .setColumnSortExecuting(this.setGridSort.bind(this))
                .setColumnSortDisableList(['S_INPUT'])
                .setCustomRowCell('S_INPUT', this.setGridItemQty.bind(this));
        }
        else {
            this.finalSearchParam.Is_From_ESD007R = true;
            this.finalSearchParam["SlipsInfos"] = this.SlipsInfos;
            this.finalSearchParam["Slips"] = this.Slips;
            grid
                .setEditable(true, 0, 0)
                .setRowData(this.viewBag.InitDatas.LoadData)
                .setRowDataUrl('/Inventory/Basic/GetListBarcodeOfProd')
                .setRowDataParameter(this.finalSearchParam)
                .setFormParameter({ FormType: this.formTypeCode, FormSeq: 2, ReturnType: 5 })
                .setCustomRowCell('S_INPUT', this.setGridItemQty.bind(this))
                .setColumns([
                        { propertyName: 'S_CHK', id: 'S_CHK', title: "S_CHK", width: '160', isHideColumn: true },
                        { propertyName: 'S_INPUT', id: 'S_INPUT', title: ecount.resource.LBL01688, width: '105', dataType: "80", controlType: 'widget.input.number', controlOption: { decimalUnit: [3, 0] } }, //"수량"
                        { propertyName: 'SALE003.PROD_CD', id: 'SALE003.PROD_CD', title: ecount.resource.LBL03017, width: '160', align: 'left' }, // "품목코드"
                        { propertyName: 'SALE003.PROD_DES', id: 'SALE003.PROD_DES', title: ecount.resource.LBL03004, width: '160', align: 'left' }, //"품목명"
                        { propertyName: 'S003_SIZE.CLASS_SIZE', id: 'S003_SIZE.CLASS_SIZE', title: ecount.resource.LBL80099, width: '160', align: 'center' }, //"규격"
                        { propertyName: 'SALE003.BAR_CODE', id: 'SALE003.BAR_CODE', title: ecount.resource.BTN00264, width: '160', align: 'center' }, //"바코드"
                        { propertyName: 'S_HIDDEN', id: 'S_HIDDEN', title: 'S_HIDDEN', width: '160', align: 'center', isHideColumn: true }
                ])
                .setKeyColumn(['PROD_CD'])
                .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
                .setColumnFixHeader(true)
                .setPagingUse(false)
                .setCheckBoxUse(true)
                .setCheckBoxRememberChecked(true)
                .setCheckBoxMaxCount(this.maxCheckCount)
                .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })
                .setCheckBoxCallback({ 'click': this.setGridCheckBoxClickEvent.bind(this), 'change': this.setGridCheckBoxChangeEvent.bind(this) })
                .setCheckBoxHeaderCallback({ 'click': this.setGridCheckBoxAllClickEvent.bind(this), 'change': this.setGridCheckBoxChangeEvent.bind(this) })
                .setColumnSortable(true)
                .setColumnSortExecuting(this.setGridSort.bind(this))
                .setColumnSortDisableList(['S_INPUT'])
                .setCustomRowCell('S_INPUT', this.setGridItemQty.bind(this));
        };

        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "barCodePrint").label(ecount.resource.BTN00235).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * define footer button event listener
    **********************************************************************/
    // Bar Code Print
    onFooterBarCodePrint: function (e) {
        var self = this;
        var btn = this.footer.get(0).getControl("barCodePrint");
        var print_code_list = '';
        var isRaisedError = false;

        $.each(this.arrSelectBarCode, function (i, obj) {
            if (print_code_list == '') {
                try {
                    obj.value = (obj.value == null) ? 0 : parseInt(obj.value);
                } catch (e) {
                    obj.value = 0;
                };

                if (obj.value <= 0) {
                    isRaisedError = true;
                    ecount.alert(ecount.resource.MSG00336);
                    btn.setAllowClick();

                    return false;
                }
                else {
                    print_code_list = obj.prodCd + 'ㆍ' + obj.value;
                };
            }
            else {
                try {
                    obj.value = (obj.value == null) ? 0 : parseInt(obj.value);
                } catch (e) {
                    obj.value = 0;
                }

                if (obj.value <= 0) {
                    isRaisedError = true;
                    ecount.alert(ecount.resource.MSG00336);
                    btn.setAllowClick();

                    return false;
                }
                else {
                    print_code_list += '§' + obj.prodCd + 'ㆍ' + obj.value;
                }
            }
        });

        if (isRaisedError) {
            btn.setAllowClick();
            return false;
        }

        if (print_code_list == '') {
            ecount.alert(ecount.resource.MSG01041);
            btn.setAllowClick();

            return false;
        }

        var param = {
            width: 790,
            height: 700,
            hidData: 'SF900;1;A;PROD_CD;' + self.contents.getGrid("dataGrid").grid.settings().getPagingCurrentPage(),
            hidChkValues: print_code_list + '§',
            hidChkValueFlag: print_code_list == '' ? 'N' : 'Y',
            hidFormGubun: this.formTypeCode,
            hidFormSer: '2'
        };

        self.openWindow({
            url: "/ECMain/ESB/ESB001M.aspx",
            name: 'ESB001M',
            param: param,
            popupType: true
        });

        btn.setAllowClick();
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
	},

	onDropdownTxtSProdCd0: function (e) {
		var prodCodeBetweenValue = this.header.getControl("txtSProdCd_BETWEEN").getValue();
		var isEmpty = false;

		prodCodeBetweenValue.forEach(function (v) {
			if (v !== "") {
				isEmpty = true;
			}
		});

		if (isEmpty) {
			this.header.getControl("txtSProdCd").setValue(0, prodCodeBetweenValue, true);
		}
		this.header.getControl("txtSProdCd").setFocus(0);
	},

	onDropdownTxtSProdCd1: function (e) {
		this.header.getControl("txtSProdCd_MULTI").setFocus(0);	},

	onDropdownTxtSProdCd2: function (e) {
		var prodCodeValue = this.header.getControl("txtSProdCd").getValue();

		if (prodCodeValue) {
			this.header.getControl("txtSProdCd_BETWEEN").setValue(0, prodCodeValue, true);
		}
		this.header.getControl("txtSProdCd_BETWEEN").setFocus(0);
	},

    /**********************************************************************
    * define header dropdown event listener
    **********************************************************************/

    /**********************************************************************
    * define header tab event listener
    **********************************************************************/
    //탭 변경시 
    onChangeContentsTab: function (event) {
        this.currentTabId = event.tabId;
    },

    /**********************************************************************
    * define header button event listener
    **********************************************************************/
    // header quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        // 검색시 바코드 선택 초기화
        this.arrSelectBarCode = null;
        this.arrSelectBarCode = new Array();
        this.contents.getGrid().grid.clearChecked();

        var grid = this.contents.getGrid("dataGrid");
        this.header.lastReset(this.finalHeaderSearch);
        this.finalSearchParam.QUICK_SEARCH = this.header.getQuickSearchControl().getValue();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.finalSearchParam);
    },

    // header Search button click event
    onHeaderSearch: function (forceHide) {
        // 검색시 바코드 선택 초기화
        this.arrSelectBarCode = null;
        this.arrSelectBarCode = new Array();
        this.contents.getGrid().grid.clearChecked();

        if (this._userParam) {
            if (this._userParam.C_param.QUICK_SEARCH != "") {
                this.header.getQuickSearchControl().setValue(this._userParam.C_param.QUICK_SEARCH);
            }
        } else {
            this.finalSearchParam.QUICK_SEARCH = "";
        }
        if (this.dataSearch()) {
            if (!this._userParam) this.header.toggle(forceHide);
        }
    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },

    // header close button click event
    onHeaderClose: function () {
        this.close();
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/
    // After the document loaded
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);
        if (this._userParam) {    // 다른 페이지 이동 후 돌아올때(When you come back after moving to another page)
            if (this._userParam.C_param.QUICK_SEARCH != "") {
                this.defaultSearchParameter.QUICK_SEARCH = this._userParam.C_param.QUICK_SEARCH;
            }
		}

		if (this._myFormdata && this._myFormdata["txtSProdCd_MULTI"]) this.header.getControl("txtSProdCd_MULTI").reset(this._myFormdata["txtSProdCd_MULTI"]);
		if (this._myFormdata && this._myFormdata["txtSProdCd_BETWEEN"]) this.header.getControl("txtSProdCd_BETWEEN").reset(this._myFormdata["txtSProdCd_BETWEEN"]);

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        if (this.isFromESD007R() == false) {
            this.finalSearchParam.FORM_TYPE = this.formTypeCode;
            this.finalSearchParam.FORM_SER = "2";
            this.finalSearchParam.PAGE_SIZE = 50;
		};
    },

    // Grid Render Complete
    onGridRenderComplete: function (e, data) {
        var self = this;
        this._super.onGridRenderComplete.apply(this, arguments);
        var grid = this.contents.getGrid().grid;
        var isChecked = false;

        // 페이징이동후에 체크된 바코드 수량을 설정한다.
        if (this.isFromESD007R() == false) {
            if (!e.unfocus) {
                this.header.getQuickSearchControl().setFocus(0);
            };

            $.each(this.arrSelectBarCode, function (j, obj) {
                grid.setCell('S_INPUT', obj.prodCd, obj.value, { isRunChange: false });
            });
        }
        else {
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.getSelectedItem(true, 1);

                var gridItems = grid.getRowList();

                gridItems.forEach(function (saleItem, i) {
                    if (i < self.maxCheckCount)
                        self.arrSelectBarCode.push({ prodCd: saleItem.PROD_CD, value: saleItem.A1 });
                });
            }
            else {
                if (this.gridChecked.length > 0) {
                    isChecked = true;

                    $.each(this.arrSelectBarCode, function (j, obj) {
                        grid.setCell('S_INPUT', obj.prodCd, obj.value, { isRunChange: false });
                        grid.addChecked([obj.prodCd]);
                    });
                }

                if (this.isSorted) {
                    this.arrSelectBarCode = [];
                    this.getSelectedItem(this.gridChecked.length > 0 && isChecked == false ? true : false, 1);
                }
            }
        }
        this.isSorted = false;
    },

    // OnInitContents 후에 실행(맨처음 로딩 될때 한번만 실행됨)
    onGridRenderBefore: function (gridId, settings) {
        var self = this;
        this.setGridParameter(settings); //파라미터 세팅

        settings.setPagingIndexChanging(function (e, data) {
            //페이징변환시 퀵서치검색값 유지되어야함
            self.header.getQuickSearchControl().setValue(self.finalSearchParam.QUICK_SEARCH);
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
            self.contents.getGrid("dataGrid").grid.render();
        });
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;

        switch (control.id) {
            case "txtClassCd1":  // 그룹코드1, 그룹코드2, 그룹코드3
            case "txtClassCd2":
            case "txtClassCd3":
                config.isCheckBoxDisplayFlag = true;
                config.isApplyDisplayFlag = true;
                config.isIncludeInactive = true;        // 사용중단
                break;
            case "txtTreeGroupCd":  // 구매처 
                config.isNewDisplayFlag = false;
                config.isCheckBoxDisplayFlag = true;
                config.isApplyDisplayFlag = true;
                config.name = String.format(ecount.resource.LBL10109, control.subTitle);
                config.titlename = control.subTitle;
                break;
            case "txtSCustCd":  // 구매처 
                config.isNewDisplayFlag = false;
                config.isCheckBoxDisplayFlag = true;
                config.isApplyDisplayFlag = true;
                break;
            case "txtSWhCd":  // 생산공정
                config.titlename = control.subTitle;
                config.name = String.format(ecount.resource.LBL10109, control.subTitle);
                config.custGroupCodeClass = "L03";
                config.CODE_CLASS = "L03";
                config.DEL_FLAG = "N";
                config.SID = "E040102";
                config.ResourceType = "PROD";
                config.isCheckBoxDisplayFlag = true;
                config.isApplyDisplayFlag = true;
                break;
            case "main_prod_cd":  // 주품목
                config.isApplyDisplayFlag = true;
                break;
            case "inspect_type_cd":  // 품질검사유형
                config.isApplyDisplayFlag = true;
                break;
            case "txtSProdCd_MULTI":  //다중코드
                config.isApplyDisplayFlag = true;
        }
        handler(config);
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed   
    },

    // Auto Complete Handler
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id) {
            case "txtSWhCd":  // 생산공정
                parameter.CODE_CLASS = 'L03';
                break;
        }
        handler(parameter);
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/
    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['DEL_GUBUN'] == "Y")
            return true;
    },

    // 체크박스 클릭
    setGridCheckBoxClickEvent: function (event, data) {
        this.isCheckbox = true;
        var grid = this.contents.getGrid().grid;
        var qty = event.target.checked ? '1' : '0';
        if (this.isFromESD007R() == false) {
            if (data.rowItem.A1 != "" && data.rowItem.A1 != "0" && event.target.checked) {
                qty = data.rowItem.A1;
            }
        }
        else {
            qty = grid.getCell('S_INPUT', data.rowKey).toString();
            this.setSelectedBarCode(data.rowKey, data.rowItem.A1.toString(), (event.target.checked ? true : false));

        }

        grid.setCell('S_INPUT', data.rowKey, qty.toString(), { isRunChange: true });
    },

    // 체크박스 ALL 클릭
    setGridCheckBoxAllClickEvent: function (event, data) {
        var grid = this.contents.getGrid().grid;
        var qty = event.target.checked ? '1' : '0';
        var items = grid.getRowList();
        var maxCount = grid.getRowCount();

        if (self.checkMaxCount <= maxCount)
            maxCount = self.checkMaxCount;

        if (this.isFromESD007R() == false) {
            for (var i = 0; i < maxCount; i++) {
                if (i >= maxCount) {
                    break;
                }

                if (items[i] != undefined)
                    grid.setCell('S_INPUT', items[i].PROD_CD, qty.toString(), { isRunChange: true });
            }
        }
        else {
            for (var i = 0; i < maxCount; i++) {
                if (i >= maxCount) {
                    break;
                }

                if (items[i] != undefined) {
                    qty = grid.getCell('S_INPUT', items[i].PROD_CD).toString();
                    this.setSelectedBarCode(items[i].PROD_CD, qty.toString(), (event.target.checked ? true : false));
                    grid.setCell('S_INPUT', items[i].PROD_CD, qty.toString(), { isRunChange: true });
                }
            }
        }
    },

    setGridCheckBoxChangeEvent: function (event, data) {
        var self = this;
        self.gridChecked = self.contents.getGrid().grid.getChecked();
    },

    // 품목코드 click
    setGridItemQty: function (value, rowItem) {
        var option = [];

        option.event = {
            'focus': function (event, data) {
            }.bind(this),
            'click': function (event, data) {
            }.bind(this),
            'change': function (event, data) {
                var grid = this.contents.getGrid().grid;

                if ($.parseNumber(data.newValue) > 0) {
                    grid.addChecked(data.rowKey);
                    this.setSelectedBarCode(data.rowItem.PROD_CD, data.rowItem.A1.toString(), true);
                } else {
                    grid.removeChecked(data.rowKey);
                    this.setSelectedBarCode(data.rowItem.PROD_CD, "0", false);
                }
            }.bind(this),
            'keyup': function (event, data) {
            }.bind(this)
        };

        return option;
    },

    // 정렬 (Sort) click
    setGridSort: function (e, data) {
        if ((this.isFromESD007R()) == false) {
            this.header.toggle(true);
            // 컬럼 숫자만 리턴(Only returns the column number)
            this.finalSearchParam.SORTCOL_INDEX = Number(data.propertyName.replace("A", "")) + 1;
            this.finalSearchParam.SORT_COLUMN = "A" + (Number(data.propertyName.replace("A", ""))).toString();
            this.finalSearchParam.SORT_TYPE = data.sortOrder;
            this.finalSearchParam.SORTCOL_ID = Number(data.propertyName.replace("A", "")) + 1;
            this.contents.getGrid().draw(this.finalSearchParam);
        }
        else {
            // 컬럼 숫자만 리턴(Only returns the column number)
            this.finalSearchParam["SORTCOL_INDEX"] = Number(data.propertyName.replace("A", "")) + 1;
            this.finalSearchParam["SORT_COLUMN"] = "A" + (Number(data.propertyName.replace("A", ""))).toString();
            this.finalSearchParam["SORT_TYPE"] = data.sortOrder;
            this.finalSearchParam["SORTCOL_ID"] = Number(data.propertyName.replace("A", "")) + 1;
            this.contents.getGrid().draw(this.finalSearchParam);
        };

        this.isSorted = true;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    **********************************************************************/
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/
    // F2 click
    ON_KEY_F2: function (e) {
        // 품목등록 신규
        this.onFooterNew(e);
    },

    // F3 click - 서치클릭
    ON_KEY_F3: function (e) {
        this.onHeaderClose();
    },

    // F8 click
    ON_KEY_F8: function (e) {
        this.onHeaderSearch(false);
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (target != null && target.cid == "search") {
            this.onHeaderSearch(false);
        }
    },

    // 엔터Key 
    onFocusOutHandler: function () {
        var ctrl = this.header.getControl("search");
        ctrl && ctrl.setFocus(0);
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    // 바코드 선택값 저장, 삭제
    setSelectedBarCode: function (code, qty, checked) {
        var self = this;
        var isExist = false;
        var removeIdx = -1;

        $.each(this.arrSelectBarCode, function (i, obj) {
            if (code == obj.prodCd) {
                isExist = true;
                removeIdx = i;
            }
        });

        if (checked) {
            if (isExist) {
                self.arrSelectBarCode.remove(removeIdx);
            }
            self.arrSelectBarCode.push({ prodCd: code, value: qty });
        }

        if (!checked) {
            if (isExist) {
                self.arrSelectBarCode.remove(removeIdx);
            }
        }
    },

    getSelectedItem: function (isChecked, type) {
        var _self = this;
        var grid = _self.contents.getGrid().grid;
        var gridCheckedItems = grid.getChecked();
        var gridItems = grid.getRowList();

        if (this.isCheckbox == true) {
            gridItems = gridItems.remove(function (code) {
                for (var i = 0, len = gridCheckedItems.length; i < len; i++) {
                    if (gridCheckedItems[i].PROD_CD == code.PROD_CD)
                        return false;
                }
                return true;
            });
        }

        var isMax100 = false;
        gridItems.forEach(function (saleItem, i) {
            if (isChecked == true) {
                rowKey = saleItem[ecount.grid.constValue.keyColumnPropertyName];
                grid.addChecked([rowKey]);
            }
            
            try {
                if (parseInt(saleItem.A1) >= 100) {
                    isMax100 = true;
                }
            } catch (e) { };
        });

        gridCheckedItems.forEach(function (saleItem) {
            _self.setSelectedBarCode(saleItem.PROD_CD, saleItem.A1.toString(), true);
        });

        if (isMax100 == true) {
            ecount.alert(ecount.resource.MSG04190);
        };

        this.isCheckbox = false;
    },

    // grid parameter setting 
    setGridParameter: function (settings) {
        var searchParam = { PARAM: '' };
        // Grid Setting & Search        
        if (this._userParam != undefined) {
            settings.setPagingCurrentPage(this._userParam.C_CurrentPage);
            if (this._userParam.C_param != "") {
                searchParam = this._userParam.C_param;
            }
        } else {
            settings.setPagingCurrentPage(1); //Paging Page 1
            searchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize("PROD").result);
            $.extend(searchParam, this.header.serialize("QTY").result);
            $.extend(searchParam, this.header.serialize("PRICE").result);
            $.extend(searchParam, this.header.serialize("COST").result);
            $.extend(searchParam, this.header.serialize("CONT").result);
            $.extend(searchParam, this.header.serialize("ITEM").result);
            searchParam.QUICK_SEARCH = this.finalSearchParam.QUICK_SEARCH;

            // cs공유
            searchParam.CS_FLAG = searchParam.CS_FLAG.length > 0 ? '1' : null;
            // 세트 여부
            searchParam.SET_FLAG = searchParam.SET_FLAG.length > 0 ? '1' : null;
            // 다공정여부
            searchParam.PROCESS_FLAG = searchParam.PROCESS_FLAG.length > 0 ? '1' : null;

            searchParam.MULTI_PROD_FLAG = searchParam.MULTI_PROD_FLAG.length > 0 ? true : null;

            searchParam.BASE_DATE_CHK = (searchParam.BASE_DATE_CHK != null && searchParam.BASE_DATE_CHK != undefined && searchParam.BASE_DATE_CHK.length > 0) ? "1" : "0";
        }

        //그리드 상단 오른쪽  right of top 
        if ((this.isFromESD007R()) == false) {
            this.header.getQuickSearchControl().setValue(searchParam.QUICK_SEARCH);
        };

        settings
            .setHeaderTopMargin(this.header.height())
            .setRowDataParameter(searchParam);

        if ((this.isFromESD007R()) == false) {
            // 조회 당시 컨트롤 정보
            this.finalHeaderSearch = this.header.extract(true).merge();
            this.finalSearchParam = searchParam;
            this.finalSearchParam.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        };

        //다중 컨트롤 중 현재 화면에 표시된 컨트롤의 value만 serialize
        if (this.finalSearchParam.PROD_CD_MULTI) {
            this.finalSearchParam.PROD_CD = "∬" + this.finalSearchParam.PROD_CD_MULTI;
        }

        this.finalSearchParam.PROD_CD_FROM = this.finalSearchParam.PROD_CD_BETWEEN_FROM;
        this.finalSearchParam.PROD_CD_TO = this.finalSearchParam.PROD_CD_BETWEEN_TO;
    },

    // draw grid
    dataSearch: function (e) {
        for (var i = 0 ; i < 7; i++) {
            var invalid;
            switch (i) {
                case 0:
                    invalid = this.header.validate("BASIC");
                    break;
                case 1:
                    invalid = this.header.validate("PROD");
                    break;
                case 2:
                    invalid = this.header.validate("QTY");
                    break;
                case 3:
                    invalid = this.header.validate("PRICE");
                    break;
                case 4:
                    invalid = this.header.validate("COST");
                    break;
                case 5:
                    invalid = this.header.validate("CONT");
                    break;
                case 6:
                    invalid = this.header.validate("ITEM");
                    break;
            }

            if (invalid.result.length > 0) {
                this.header.changeTab(invalid.tabId, true);
                this.header.toggleContents(true, function () {
                    invalid.result[0][0].control.setFocus(0);
                });
                return;
            }
        }

        var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;

        // search parameter setting
        this.setGridParameter(settings);
        gridObj.draw(this.finalSearchParam);

        this.header.toggle(true);
    },
    // 단가 정보 매핑
    getObjects: function (obj, val) {
        var retvalue = '';
        $.each(obj, function (i, adata) {
            if (adata.Key.CODE_NO == val)
                retvalue = adata.CODE_DES;
        });
        return retvalue;
    },

    isFromESD007R: function () {
        return (this.Is_From_ESD007R || false);
    },

    findSelectedBarcode: function (rowItem) {
        if ((this.arrSelectBarCode || []).length <= 0) return;

        var returnValue = "0";
        $.each(this.arrSelectBarCode, function (j, obj) {
            if (rowItem.PROD_CD == obj.prodcd) {
                returnValue = obj.value;
            }
        });
        return returnValue;
    }
});