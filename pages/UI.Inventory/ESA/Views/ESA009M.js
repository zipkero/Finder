window.__define_resource && __define_resource("LBL10419","BTN00863","BTN00113","BTN00007","BTN00033","BTN00008","BTN00427","BTN00162","BTN00330","BTN00169","BTN00493","LBL01457","LBL15055","LBL30237","MSG04553","LBL02475","LBL06247","LBL05716","LBL03961","LBL07879","LBL07880","LBL01647","MSG07850","MSG07851","LBL08396","LBL10932","LBL10923","LBL09077","LBL08831","LBL01448","BTN00204","LBL05428","LBL13100","LBL10548","MSG02158","BTN00171","LBL12931","BTN00043","BTN00264","LBL15210","BTN00265","BTN00026","LBL02915","BTN00959","LBL13249","BTN00203","BTN00050","BTN00410","BTN00096","LBL02390","LBL01235","MSG00141","LBL15211","LBL07243","MSG04752","MSG00213","MSG00299","LBL06464","MSG06899","LBL02402","LBL07436","LBL02339","LBL00043","LBL10109","MSG01778","BTN00081","BTN00315","LBL02072","LBL03176","MSG09734","BTN85009","LBL11065","LBL08629","LBL93033");
/****************************************************************************************************
1. Create Date  : 2015.11.07
2. Creator      : 이일용
3. Description  : 재고1 > 기초등록 > 품목등록
4. Precaution   :
5. History      : 
                 [2016.02.01] 이은규: 헤더에 옵션 > 사용방법설정 추가
                 2017.04.12 안정환 : 숫자형 추가항목 4~10 추가
				 2017.04.24 양미진: 연간미사용코드 추가
                 2017.12.05 (Hao) Connect All-In-One II to NF
                 018.01.16(Thien.Nguyen) add shaded grid option , set scroll top for page. 
                 2018.02.08(Hao) - Fix dev 6717 품목등록 - 품질검사유형등록 입력 후 저장해도 적용이 되지 않는 문제
                 2018.04.18(HoangLinh) - Fix dev 8729 - 품목등록 - 재고수량관리 체크값 관련 문제
                 2018.04.25(임태규) - A18_01115 품목전체삭제 서버 Loop를 Client 함수 재귀로 변경, SEARCH_CNT로 한번에 삭제 할 품목 수량 지정
                 2018.07.11(Ngo Thanh Lam) - Remove [Change(Old)] button and [ECOUNT Web Uploader(Old)] button
                 2018.09.20(Chung Thanh Phuoc) Add link navigation Item Code/Item Name of New Item
                 2018.10.16 (PhiTa) Apply disable sort when data search > 1000
                 2018.11.01 (PhiTa) Remove Apply disable sort > 1000
                 2018.12.21 (PhiVo) applied 17520-A18_04271
                 2018.12.27 (HoangLinh): Remove $elDeleteMultiProd
                 2019.01.09 (HoangLinh): A18_04370_1 - Refactoring
                 2019.02.25 (PhiVo) A19_00625-FE 리팩토링_페이지 일괄작업 10차
                 2019.03.19 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019.04.04 (Hao): Remove delimiter when adjust
                 2019.03.28 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거: Change logic get param in method onFooterBarCode
                 2019.04.10 (강성훈): 삭제, 사용중단 3.0 적용
                 2019.04.23 (AiTuan): setGridItemBYN for field 'sale003.qc_yn' and 'sale003.qc_buy_type'
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.09.17 (황재빈): 천건이상 더보기 적용
                 2019.09.23 (석태진): 기초코드 검색조건 다중검색 추가
				 2019.11.22(양미진) - dev 32805 A19_04240 품목 검색 창 스크립트 오류
                 2019.12.06 (HRKIM): 데이터 관리삭제
                 2019.12.16[DucThai] - A19_04373 - 거래처등록, 품목등록메뉴 사용자지정 1 ~5 항목 정렬제공 기준확인
                 2019.12.19 (김봉기) : 데이터백업 관련 파라미터 추가
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
6. Old file    : ESA009M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA009M", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    formSearchControlType: 'SN900',                             // 검색컨트롤폼타입
    formInputControlType: 'SI902',                              // 검색컨트롤폼타입
    formTypeCode: 'SR900',                                      // 리스트폼타입
    maxCheckCount: 100,                                         // 체크 가능 수 기본 100
    formInfoData: null,                                         // 리스트 양식정보
    isUseExcelConvert: null,                                    // 액셀변환권한유무
    finalSearchParam: null,                                     // 검색 시 정보
    finalHeaderSearch: null,                                    // 검색 시 검색 컨트롤 정보 (퀵서치)

    /*선택삭제 관련*/
    selectedCnt: 0,                                             // 선택한 리스트 수
    errDataAllKey: null,                                        // 선택삭제 안된 리스트
    /*선택삭제 관련*/
    currentTabId: 'BASIC',
    isShowSearchForm: '1',
    selectProdCodeList: '',
    selectProdDesList: '',

    /*천건이상 더보기 관련*/
    limitCnt: 1001,                                             // 제한할 건 수
    isMoreShow: null,                                           // 천건이상 더보기 보여줄 지 여부
    isMoreFlag: false,                                          // 천건이상 더보기 클릭여부

    //추가 항목
    commonCode: null,

    //전체삭제 시 한번에 조회할 품목 수량
    SEARCH_CNT: 1000,

    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,

    cProdCd: "",
    userFlag: null,
    ALL_GROUP_PROD: null,     // 허용품목그룹 - 0: 전체, 1: 특정그룹

    formInfo: null, // 정렬문제로 인해 예외처리

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

        if (this.isShowSearchForm == null) {    // [1: 열림(OPEN), 2:닫힘(CLOSE), 3:없음(NONE), 4:자료올리기용(Upload data)]]
            this.isShowSearchForm = "2";
        }

        //if (this.isDataManagePath == "1") {
        //    this.isShowSearchForm = "4";
        //}
        if (this._userParam != undefined) {
            this.isShowSearchForm = this._userParam.isShowSearchForm;
        }

        //==================== 기초정보 설정 START====================
        var infoData = this.viewBag.InitDatas;
        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];
        /*품목코드 widgetType을 바꾼다.- 시작(개발및 선배포를 위해서 임시조치) TODO 명식*/
        //for (var i = 0; i < (this.viewBag.FormInfos["SN900"].items || []).length; i++) {
        //    var t = this.viewBag.FormInfos["SN900"].items[i];
        //    var searchone = t.subItems.find(function (column) { return column.id.toUpperCase() == "TXTSPRODCD" });
        //    if (searchone != null) {
        //        searchone["controlType"] = "widget.input.between";
        //    };
        //};
        /*품목코드 widgetType을 바꾼다.- 끝*/
        //==================== 기초정보 설정 END====================

        this.defaultSearchParameter = {
            FORM_TYPE: this.formTypeCode
            , FORM_SER: '1'
            , PROD_CD: this.PROD_CD == null ? '' : this.PROD_CD
            , PROD_DES: this.PROD_DES == null ? '' : this.PROD_DES
            , PROD_TYPE: ''
            , SIZE_DES: ''
            , LIMIT_COUNT: 1001
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
            , SAFE_A0007: ''
            , CS_FLAG: ''
            , PROCESS_FLAG: ''
            , SET_FLAG: ''
            , CANCEL: this.CANCEL ? this.CANCEL : ''
            , LAN_TYPE: infoData.lanType
            , PROD_LEVEL_GROUP: ''//CD_TREE
            , PROD_LEVEL_GROUP_CHK: ''//CB_SUBTREE
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
            , NO_USER4_F: ''
            , NO_USER4_T: ''
            , NO_USER5_F: ''
            , NO_USER5_T: ''
            , NO_USER6_F: ''
            , NO_USER6_T: ''
            , NO_USER7_F: ''
            , NO_USER7_T: ''
            , NO_USER8_F: ''
            , NO_USER8_T: ''
            , NO_USER9_F: ''
            , NO_USER9_T: ''
            , NO_USER10_F: ''
            , NO_USER10_T: ''
            , ITEM_TYPE: ''
            , SERIAL_TYPE: ''
            , PROD_SELL_TYPE: ''
            , PROD_WHMOVE_TYPE: ''
            , QC_BUY_TYPE: ''
            , C0001: ''
            , QUICK_SEARCH: this.QUICK_SEARCH ? this.QUICK_SEARCH : ''
            , EXCEL_FLAG: 'N'
            , SORT_COLUMN: 'PROD_CD'
            , SORT_TYPE: 'A'
            , PAGE_SIZE: this.formInfoData.option.pageSize
            , PAGE_CURRENT: 1
            , BASE_DATE_CHK: ''
            , MULTI_PROD_FLAG: ''
            , IS_FROM_BULKUPLOAD: (this.IsFromBulkUpload || false)
            , FROM_BULKUPLOAD_COLUMNS: (this.BulkUploadColumns || "")
            , isFromESA009M: true  //품목 등록에서의 검색인지
            , pageTitle: ecount.resource.LBL10419
            , PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID

        };

        this.finalSearchParam = this.defaultSearchParameter;
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    // initProperties
    initProperties: function (options) {


        this.formInfo = this.viewBag.FormInfos.SR900.columns;
        var len = this.formInfo.length;
        for (var i = 0; i < len; i++) {
            this.formInfo[i].sort = "A";
        }
        if (this.viewBag.InitDatas.LoadData[0] != null) {
            this.isMoreShow = this.limitCnt <= this.viewBag.InitDatas.LoadData[0].MAXCNT ? true : false;
            if (this.isMoreShow == true) {
                this.viewBag.InitDatas.LoadData.splice(this.viewBag.InitDatas.LoadData[0].MAXCNT, 1);
                this.viewBag.InitDatas.LoadData[0]["MAXCNT"] = this.limitCnt - 1;
            }
        }

        this.isUseExcelConvert = ecount.config.user.USE_EXCEL_CONVERT;
        this.commonCode = { cont1: "", cont2: "", cont3: "", cont4: "", cont5: "", cont6: "", cont7: "", cont8: "", cont9: "" };
        this.errDataAllKey = new Array();
        this.finalSearchParam = { QUICK_SEARCH: '' };
        this.userFlag = this.viewBag.InitDatas.USER_FLAG;        // 사용자 구분
        this.ALL_GROUP_PROD = this.viewBag.InitDatas.ALL_GROUP_PROD;        // 허용품목그룹 - 0: 전체, 1: 특정그룹
    },

    // render
    render: function () {
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
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 
            toolbar
                .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            switch (this.viewBag.DefaultOption.ManagementType) {
                case "BA": // BA:Excel, UF:자료올리기형태, ZI:백업, AT:첨부파일, SD:조건삭제
                    toolbar.addLeft(ctrl.define("widget.button", "excelDownload").css("btn btn-sm btn-primary").label(ecount.resource.BTN00863));
                    break;
            }
        }
        else {
            //if (this.isDataManagePath != '1') {
                toolbar
                    .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                    .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113))
                    .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));
           //  else {
            //    toolbar
            //        .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            //        .addLeft(ctrl.define("widget.button", "dmDelete").css("btn btn-sm btn-primary").label(ecount.resource.BTN00033));
           // }
        }


        if (this.isShowSearchClose) {
            toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        }

        tabContents
            .onSync()
            .setType('SN900')
            .setOptions({ showFormLayer: (["1", "4"].contains(this.isShowSearchForm || "")) ? true : false  /* 검색 창 접기*/ })
            .setSeq(1)
            .filter(function (control) {
                if (control.id === "84") { // 안전재고 숨기기
                    return false;
                }
            });

        contents.add(tabContents).add(toolbar);
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 
            header.setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
            .notUsedBookmark()
            .useQuickSearch(false);
        }
        else {
            header
                .setTitle(ecount.resource.LBL10419)
                .useQuickSearch((["4"].contains(this.isShowSearchForm || "")) ? false : true);
        }

        if (!(["4"].contains(this.isShowSearchForm || "")) && !this.viewBag.DefaultOption.ManagementType) {
            header.add("search", null, false)
                .add("option", [
                    { id: "TotalDelete", label: ecount.resource.BTN00427 },       // 전체삭제
                    { id: "SetItemAccounts", label: ecount.resource.BTN00162 },   // 품목계정추가
                    { id: "ListSettings", label: ecount.resource.BTN00330 },      // 리스트설정
                    { id: "SearchTemplate", label: ecount.resource.BTN00169 },    // 검색창설정
                    { id: "SearchItemTemplate", label: ecount.resource.BTN00493 }, // 검색항목설정
                    { id: "SelfCustomizing", label: ecount.resource.LBL01457 }      // 사용방법설정               
                ], false);
        }

        header.addContents(contents);

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
        this.commonCode.cont10 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0204");
        this.commonCode.cont10 = this.commonCode.cont10 == '' ? ' ' : this.commonCode.cont10;
        this.commonCode.cont11 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0205");
        this.commonCode.cont11 = this.commonCode.cont11 == '' ? ' ' : this.commonCode.cont11;
        this.commonCode.cont12 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0206");
        this.commonCode.cont12 = this.commonCode.cont12 == '' ? ' ' : this.commonCode.cont12;
        this.commonCode.cont13 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0207");
        this.commonCode.cont13 = this.commonCode.cont13 == '' ? ' ' : this.commonCode.cont13;
        this.commonCode.cont14 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0208");
        this.commonCode.cont14 = this.commonCode.cont14 == '' ? ' ' : this.commonCode.cont14;
        this.commonCode.cont15 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0209");
        this.commonCode.cont15 = this.commonCode.cont15 == '' ? ' ' : this.commonCode.cont15;
        this.commonCode.cont16 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0210");
        this.commonCode.cont16 = this.commonCode.cont16 == '' ? ' ' : this.commonCode.cont16;
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
                    .addControl(ctrl.define("widget.label", "and13", "and13").label("~"))
                    .addControl(ctrl.define("widget.input", "IN_PRICE_T", "IN_PRICE_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price":
                // 7. 출고단가 14
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE_F", "OUT_PRICE_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and14", "and14").label("~"))
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
                var Badflag = ["", "1", "0"].join(ecount.delimiter);
                // 12. 재고수량관리 9
                control.label([ecount.resource.LBL02475, ecount.resource.LBL07879, ecount.resource.LBL07880]).value([Badflag, "1", "0"]).select(Badflag)
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
                    .addControl(ctrl.define("widget.label", "and20", "and20").label("~"))
                    .addControl(ctrl.define("widget.input", "IN_TERM_T", "IN_TERM_T").numericOnly(5, 0, ecount.resource.MSG04553));
                break;
            case "min_qty":
                // 22. 최소구매단위 21
                control.inline()
                    .addControl(ctrl.define("widget.input", "MIN_QTY_F", "MIN_QTY_F").numericOnly(5, 0, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and21", "and21").label("~"))
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
                    .addControl(ctrl.define("widget.label", "and33", "and33").label("~"))
                    .addControl(ctrl.define("widget.input", "OUTSIDE_PRICE_T", "OUTSIDE_PRICE_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "labor_weight":
                // 26. 노무비가중치 34
                control.inline()
                    .addControl(ctrl.define("widget.input", "LABOR_WEIGHT_F", "LABOR_WEIGHT_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and34", "and34").label("~"))
                    .addControl(ctrl.define("widget.input", "LABOR_WEIGHT_T", "LABOR_WEIGHT_T").numericOnly(18, 6, ecount.resource.MSG04553))
                    .popover(ecount.resource.MSG07850);
                break;
            case "expenses_weight":
                // 27. 경비가중치 35
                control.inline()
                    .addControl(ctrl.define("widget.input", "EXPENSES_WEIGHT_F", "EXPENSES_WEIGHT_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and35", "and35").label("~"))
                    .addControl(ctrl.define("widget.input", "EXPENSES_WEIGHT_T", "EXPENSES_WEIGHT_T").numericOnly(18, 6, ecount.resource.MSG04553))
                    .popover(ecount.resource.MSG07851);
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
                    .addControl(ctrl.define("widget.label", "and15", "and15").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE1_T", "OUT_PRICE1_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price2":
                // 30. 단가B 16
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_2 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE2_F", "OUT_PRICE2_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and16", "and16").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE2_T", "OUT_PRICE2_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price3":
                // 31. 단가C 17
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_3 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE3_F", "OUT_PRICE3_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and17", "and17").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE3_T", "OUT_PRICE3_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price4":
                // 32. 단가D 39
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_4 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE4_F", "OUT_PRICE4_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and39", "and39").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE4_T", "OUT_PRICE4_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price5":
                // 33. 단가E 40
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_5 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE5_F", "OUT_PRICE5_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and40", "and40").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE5_T", "OUT_PRICE5_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price6":
                // 34. 단가F 41
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_6 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE6_F", "OUT_PRICE6_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and41", "and41").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE6_T", "OUT_PRICE6_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price7":
                // 35. 단가G 42
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_7 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE7_F", "OUT_PRICE7_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and42", "and42").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE7_T", "OUT_PRICE7_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price8":
                // 36. 단가H 43
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_8 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE8_F", "OUT_PRICE8_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and43", "and43").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE8_T", "OUT_PRICE8_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price9":
                // 37. 단가I 44
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_9 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE9_F", "OUT_PRICE9_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and44", "and44").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_PRICE9_T", "OUT_PRICE9_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_price10":
                // 38. 단가J 45
                control.setOptions({ subTitle: ecount.config.inventory.PRICE_10 });
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_PRICE10_F", "OUT_PRICE10_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and45", "and45").label("~"))
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
                    .addControl(ctrl.define("widget.label", "and36", "and36").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER1_T", "NO_USER1_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user2":
                // 46. 숫자형추가항목2 37
                if (this.commonCode.cont8 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont8 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER2_F", "NO_USER2_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and37", "and37").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER2_T", "NO_USER2_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user3":
                // 47. 숫자형추가항목3 38
                if (this.commonCode.cont9 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont9 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER3_F", "NO_USER3_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and38", "and38").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER3_T", "NO_USER3_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user4":
                // 48. 숫자형추가항목4 38
                if (this.commonCode.cont10 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont10 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER4_F", "NO_USER4_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and50", "and50").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER4_T", "NO_USER4_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user5":
                // 49. 숫자형추가항목5 38
                if (this.commonCode.cont11 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont11 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER5_F", "NO_USER5_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and51", "and51").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER5_T", "NO_USER5_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user6":
                // 50. 숫자형추가항목6 38
                if (this.commonCode.cont12 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont12 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER6_F", "NO_USER6_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and52", "and52").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER6_T", "NO_USER6_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user7":
                // 47. 숫자형추가항목7 38
                if (this.commonCode.cont13 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont13 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER7_F", "NO_USER7_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and53", "and53").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER7_T", "NO_USER7_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user8":
                // 47. 숫자형추가항목8 38
                if (this.commonCode.cont14 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont14 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER8_F", "NO_USER8_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and54", "and54").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER8_T", "NO_USER8_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user9":
                // 47. 숫자형추가항목9 38
                if (this.commonCode.cont15 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont15 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER9_F", "NO_USER9_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and55", "and55").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER9_T", "NO_USER9_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "no_user10":
                // 47. 숫자형추가항목10 38
                if (this.commonCode.cont16 != ' ')
                    control.setOptions({ subTitle: this.commonCode.cont16 });

                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_USER10_F", "NO_USER10_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and56", "and56").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_USER10_T", "NO_USER10_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "material_cost":
                // 48. 재료비표준원가 46
                control.inline()
                    .addControl(ctrl.define("widget.input", "MATERIAL_COST_F", "MATERIAL_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and46", "and46").label("~"))
                    .addControl(ctrl.define("widget.input", "MATERIAL_COST_T", "MATERIAL_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "expense_cost":
                // 49. 경비표준원가 47
                control.inline()
                    .addControl(ctrl.define("widget.input", "EXPENSE_COST_F", "EXPENSE_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and47", "and47").label("~"))
                    .addControl(ctrl.define("widget.input", "EXPENSE_COST_T", "EXPENSE_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "labor_cost":
                // 50. 노무비표준원가 48
                control.inline()
                    .addControl(ctrl.define("widget.input", "LABOR_COST_F", "LABOR_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and48", "and48").label("~"))
                    .addControl(ctrl.define("widget.input", "LABOR_COST_T", "LABOR_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "out_cost":
                // 51. 외주비표준원가 49
                control.inline()
                    .addControl(ctrl.define("widget.input", "OUT_COST_F", "OUT_COST_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and49", "and49").label("~"))
                    .addControl(ctrl.define("widget.input", "OUT_COST_T", "OUT_COST_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "main_prod_cd":
                // 52. 주품목 50
                break;
            case "main_prod_convert_qty":
                // 53. 주품목 환산수량 51
                break;
            case "qc_yn":
                // 54. 품질검사요청대상-생산입고 53
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N");
                break;
            case "inspect_type_cd":
                // 55. 품질검사유형 54
                break;
            case "inspect_status":
                // 56. 품질검사방법 55
                control.columns(6, 6);
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
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
                break;
            case "SAFE_A0002":
                // 59. 안전재고관리-판매 84-2
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
                break;
            case "SAFE_A0003":
                // 59. 안전재고관리-생산불출 84-3
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
                break;
            case "SAFE_A0004":
                // 59. 안전재고관리-생산입고 84-4
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
                break;
            case "SAFE_A0005":
                // 59. 안전재고관리-창고이동 84-5
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
                break;
            case "SAFE_A0006":
                // 59. 안전재고관리-자가사용 84-6
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
                break;
            case "SAFE_A0007":
                // 59. 안전재고관리-불량처리 84-7
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "0", "1", "2"]).select("", "0", "1", "2");
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
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N");
                break;
            case "prod_whmove_type":
                // 66. 생산전표생성대상-창고이동 60
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N");
                break;
            case "qc_buy_type":
                // 67. 품질검사요청대상-구매 61
                control.label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["", "B", "Y", "N"]).select("", "B", "Y", "N");
                break;
            case "ddlCancelFlag":
                var CancelFlag = ["", "N", "Y"].join(ecount.delimiter);
                // 사용구분
                control.label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value([CancelFlag, 'N', 'Y']).select('N');
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
                    option1.hidden = true
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
            case "no_user4":        // . 숫자형추가항목4 39
            case "no_user5":        // . 숫자형추가항목5 
            case "no_user6":        // . 숫자형추가항목6 
            case "no_user7":        // . 숫자형추가항목7 
            case "no_user8":        // . 숫자형추가항목8 
            case "no_user9":        // . 숫자형추가항목9 
            case "no_user10":        // . 숫자형추가항목10 
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
                this.fnChangeControlShowHide(controlNameBasic, controlNameBasic.get(1), controlName.get(0).getValue(2));
            }

            if (controlNameTarget != undefined) {
                this.fnChangeControlShowHide(controlNameTarget, controlNameTarget.get(1), controlName.get(0).getValue(2));
            }

            if (this.currentTabId == "BASIC") {
                controlNameBasic.get(1).setFocus(0);
            } else if (this.currentTabId == "PROD") {
                controlNameTarget.get(1).setFocus(0);
            }
        } else if (selControlName == "cbProcessFlag") {
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
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            if (!(["4"].contains(this.isShowSearchForm || ""))) { //4:자료올리기시 사용함.        
                grid
                    .setRowData(this.viewBag.InitDatas.LoadData);
            }
        };
        grid
            .setRowDataUrl('/Inventory/Basic/GetListProd')
            .setRowDataParameter(this.finalSearchParam)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(['PROD_CD'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setCheckBoxUse(true)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCount(this.maxCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })
            .setColumnSortExecuting(this.setGridSort.bind(this))
            .setEventShadedColumnId(['sale003.prod_cd'], { isAllRememberShaded: true })
            .setColumnSortDisableList(['sale003.del_gubun', 'sale003.com_code', 'sale003_img.prod_img', 'ADD1', 'ADD2', 'ADD3', 'ADD4', 'ADD5'])
            .setCustomRowCell('sale003.prod_cd', this.setGridItemProdCd.bind(this)) // 품목코드
            .setCustomRowCell('sale003.prod_des', this.setGridItemProdCd.bind(this)) // 품목코드
            .setCustomRowCell('sale003.com_code', this.setGridItemFileMgr.bind(this)) // 파일관리
            .setCustomRowCell('sale003.detail', this.setGridItemDetail.bind(this)) // 상세내역
            .setCustomRowCell('sale003_img.prod_img', this.setGridImage.bind(this)) // 이미지
            .setCustomRowCell('SALE003.ITEM_TYPE', this.setGeridItemBMYN.bind(this)) // 관리항목
            .setCustomRowCell('SALE003.SERIAL_TYPE', this.setGeridItemBMYN.bind(this)) // 상세내역    
            .setCustomRowCell('SALE003.PROD_SELL_TYPE', this.setGridItemBYN.bind(this))
            .setCustomRowCell('SALE003.PROD_WHMOVE_TYPE', this.setGridItemBYN.bind(this))
            .setCustomRowCell('SALE003.QC_BUY_TYPE', this.setGridItemBYN.bind(this))
            .setCustomRowCell('sale003.qc_yn', this.setGridItemBYN.bind(this))
        ;

        if (this.isMoreShow == false) {
            grid.setColumnSortable(true);
        }

        /*
        관리항목	SALE003.ITEM_TYPE
        시리얼/로트No.	SALE003.SERIAL_TYPE
        생산전표생성대상-판매	SALE003.PROD_SELL_TYPE
        생산전표생성대상-창고이동	SALE003.PROD_WHMOVE_TYPE
        품질검사요청대상-구매	SALE003.QC_BUY_TYPE
        품질검사요청대상-생산입고	sale003.qc_yn
        */

        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addGroupList = [];
        if (!(["4"].contains(this.isShowSearchForm || ""))) { //4:자료올리기시 사용함.
            if (ecount.config.inventory.PROC_FLAG == "Y") {
                addGroupList.push({ id: 'newMultipleProcesses', label: ecount.resource.BTN00171 });
            }
            if (ecount.config.inventory.USE_OEM_PROD) {
                addGroupList.push({ id: 'newOemProd', label: ecount.resource.LBL12931 });
            }
            if (addGroupList.length > 0)
                toolbar.addLeft(ctrl.define("widget.button.group", "new").label(ecount.resource.BTN00043).addGroup(addGroupList).clickOnce());
            else
                toolbar.addLeft(ctrl.define("widget.button.group", "new").label(ecount.resource.BTN00043));
            toolbar.addLeft(ctrl.define("widget.button", "barCode").label(ecount.resource.BTN00264).clickOnce());

            toolbar.addLeft(ctrl.define("widget.button", "relationship").label(ecount.resource.LBL15210));

            toolbar.addLeft(ctrl.define("widget.button", "levelGroup").label(ecount.resource.BTN00265).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "changeNew").label(ecount.resource.BTN00026).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "inventoryAdjustment").label(ecount.resource.LBL02915).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .addGroup([
                    { id: "Deactivate", label: ecount.resource.BTN00204 },
                    { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                    { id: 'yearlyUnusedCodes', label: ecount.resource.LBL13249 },
                    { id: "Activate", label: ecount.resource.BTN00203 }
                ]).css("btn btn-default")
                .noActionBtn().setButtonArrowDirection("up"));
            toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());
            toolbar.addLeft(ctrl.define("widget.button", "webUploader2").label(ecount.resource.BTN00410));

            if (this.limitCnt != 0 && this.isMoreFlag == false) {
                toolbar.addLeft(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00096));
            }
        }

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },
    /**********************************************************************
    * define footer button event listener
    **********************************************************************/
    // 신규(New) button click event LBL02390
    onFooterNew: function (e) {
        var param = "";
        var btn = this.footer.get(0).getControl("new");

        if (!['W', 'U'].contains(this.viewBag.Permission.Permit.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var param = {
            isMultiProcess: false,
            EditFlag: "I",
            isSaveContentsFlag: false,   // 저장유지버튼 사용여부
            PROD_FLAG: "S",
            PROD_CD: ""
        };

        this.openItemReg(param);

        btn.setAllowClick();
    },

    // 신규(다공정) button click event
    onButtonNewMultipleProcesses: function (e) {
        var self = this;
        var btn = self.footer.get(0).getControl("new");
        if (!['W', 'U'].contains(self.viewBag.Permission.Permit.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var param = {
            isMultiProcess: true,
            EditFlag: "I",
            isSaveContentsFlag: false,   // 저장유지버튼 사용여부
            PROD_FLAG: "G",
            PROD_CD: ""
        };

        this.openItemReg(param);

        btn.setAllowClick();
    },
    //신규 oem등록
    onButtonNewOemProd: function (e) {
        var self = this;
        var btn = self.footer.get(0).getControl("new");
        if (!['W', 'U'].contains(self.viewBag.Permission.Permit.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var param = {
            isMultiProcess: false,
            isOemProd: true,
            EditFlag: "I",
            isSaveContentsFlag: false,   // 저장유지버튼 사용여부
            PROD_FLAG: "S",
            PROD_CD: ""
        };

        this.openItemReg(param);

        btn.setAllowClick();
    },

    // 바코드(Barcode) button click event
    onFooterBarCode: function (e) {
        var btn = this.footer.get(0).getControl("barCode");
        var userParam = {
            isShowSearchForm: 1
            , C_ActiveTab: this.currentTabId
            , C_CurrentPage: '1'
            , C_param: this.finalSearchParam
        };
        // 바코드화면 품목등록리스트의 정렬컬럼 따라가지 못하게 수정
        userParam.C_param.SORT_COLUMN = "PROD_CD";

        var ecPage = this.fnAllSubmitData(this.currentTabId, userParam, this.finalHeaderSearch);

        // TODO: Change logic get param
        var param = $.extend({ width: 810, height: 700, __ecPage__: ecPage, }, this.finalSearchParam);

        this.openWindow({
            url: "/ECERP/ESA/ESA009P_06",
            name: ecount.resource.LBL01235,
            formdata: this.finalHeaderSearch,
            param: param,
            popupType: false
        });

        btn.setAllowClick();
    },
    // 품목관계
    onFooterRelationship: function (e) {
        if (this.userFlag != "M" && this.ALL_GROUP_PROD == "1") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        var param = { width: 900, height: 900 };
        this.openWindow({
            url: "/ECERP/SVC/ESA/ESA009P_17",
            name: ecount.resource.LBL15211,     // 품목관계리스트                        
            param: param, popupType: false
        });
    },
    // 검색정보
    fnAllSubmitData: function (tabId, userParam, formdata) {
        // ecount.page.js 에서 가져옴.
        var ecPage = $.extend({}, this.extract(tabId, formdata));
        if (userParam) {
            ecPage.exParam = userParam; //@TODO: 베트남 배포시 제거
            ecPage._userParam = userParam;
        }
        return encodeURIComponent(Object.toJSON(ecPage));
    },

    // 품목계층그룹(LevelGroup) button click event
    onFooterLevelGroup: function (e) {
        var self = this;
        var btn = self.footer.get(0).getControl("levelGroup");

        if (this.userFlag != "M" && this.ALL_GROUP_PROD == "1") {
            ecount.alert(ecount.resource.MSG00141);
            btn.setAllowClick();
            return false;
        }

        // 권한 체크
        if (this.viewBag.Permission.PermitProdTree.Value.equals("X")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07243, PermissionMode: "R" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return;
        } else {
            var params = {
                width: self.viewBag.InitDatas.TableWidthCust + 225,
                height: 600,
                Type: "CREATE",
                parentPageID: this.pageID,
                responseID: this.callbackID
            };
            // Open popup
            this.openWindow({
                url: '/ECERP/ESA/ESA066M',
                name: ecount.resource.LBL07243,
                param: params, popupType: false, additional: true
            });
        }

        btn.setAllowClick();
    },

    // 변경(Change) button click event
    onFooterChangeNew: function (e) {
        var btn = this.footer.get(0).getControl("changeNew");
        var grid = this.contents.getGrid().grid;
        var CHANGE_CODE_LIST = [];

        if (!['W'].contains(this.viewBag.Permission.Permit.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        if (grid.getRowCount() < 1) {
            ecount.alert(ecount.resource.MSG04752);
            btn.setAllowClick();
            return false;
        }

        $.each(grid.getCheckedObject(), function (i, item) {
            CHANGE_CODE_LIST.push(item['PROD_CD']);
        });

        if (CHANGE_CODE_LIST == '') {
            ecount.alert(ecount.resource.MSG04752);
            btn.setAllowClick();
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 600,
            FormType: "SI902",
            FormSeq: 1,
            KeyList: CHANGE_CODE_LIST,
            fpopupID: this.ecPageID // 추가
        };

        this.openWindow({
            url: "/ECERP/ESA/ESA009P_14",
            name: 'ESA009P_14',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID // 추가
        });

        btn.setAllowClick();
    },

    // 재고조정(Inventory Adjustment) button click event
    onFooterInventoryAdjustment: function (e) {
        var self = this;
        var btn = self.footer.get(0).getControl("inventoryAdjustment");
        var grid = self.contents.getGrid().grid;
        var CODE_LIST = '';

        if (!['W'].contains(self.viewBag.Permission.Permit.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (grid.getRowCount() < 1) {
            ecount.alert(ecount.resource.MSG00213);
            return false;
        }

        $.each(grid.getCheckedObject(), function (i, item) {
            if (CODE_LIST != "") CODE_LIST += ecount.delimiter;
            CODE_LIST += item['PROD_CD'];
        });

        if (CODE_LIST == '') {
            ecount.alert(ecount.resource.MSG04752);
            btn.setAllowClick();
            return false;
        }

        var param = {
            width: 1050,
            height: 700,
            ProdCds: CODE_LIST,
            FromProd: 'Y',
            SORT_COLUMN: 'PROD_CD',
            SORT_TYPE: 'A'
        };

        if (!$.isEmpty(this.finalSearchParam.SORTCOL_INDEX)) {
            var id = this.viewBag.FormInfos.SR900.columns[this.finalSearchParam.SORTCOL_INDEX - 1].id;
            if (!$.isEmpty(id)) {
                if (id.split('.').length > 1) id = id.split('.')[1];
                if (['PROD_CD', 'PROD_DES', 'SIZE_DES'].contains(id.toUpperCase())) {
                    param.SORT_COLUMN = id.toUpperCase();
                    param.SORT_TYPE = this.finalSearchParam.SORT_TYPE;
                }
            }
        }

        this.openWindow({
            url: '/ECErp/ESP/ESP007P_02',
            name: "ESP007P_02",
            param: param
        });

        btn.setAllowClick();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // 선택삭제(chioce delete) button click event
    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = self.footer.get(0).getControl("deleteRestore");
        self.selectProdCodeList = '';

        if (!['W'].contains(self.viewBag.Permission.Permit.Value)) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var selectItem = self.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt === 0) {
            ecount.alert(ecount.resource.MSG00213);
            btnDelete.setAllowClick();
            return;
        }

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }

            $.each(selectItem, function (i, data) {
                self.selectProdCodeList += data.PROD_CD + 'ㆍ' + data.PROD_DES + ecount.delimiter;
            });

            if (self.selectProdCodeList.lastIndexOf(ecount.delimiter) === (self.selectProdCodeList.length - 1))
                self.selectProdCodeList = self.selectProdCodeList.slice(0, -1);

            self.callSelectDeleteListApi(self.selectProdCodeList, selectItem);
        });

        btnDelete.setAllowClick();
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();

        // 페이징 파라미터 세팅gridObj.draw(this.searchFormParameter);
        _self.finalSearchParam.PAGE_SIZE = 10000;
        _self.finalSearchParam.PAGE_CURRENT = 1;
        _self.finalSearchParam.LIMIT_COUNT = 100000;
        _self.finalSearchParam.EXCEL_FLAG = "N";
        _self.finalSearchParam.IS_FROM_BACKUP = true;

        _self.dataSearch();

        for (var i = 0; i < 7; i++) {
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
                _self.hideProgressbar();
                return false;
            }
        }

        ecount.common.api({
            url: "/ECAPI/SVC/SelfCustomize/DataManagement/DataBackupRequest",

            data: Object.toJSON({
                BackupObj: _obj,
                KEY: _obj.KEY + "|" + _self.viewBag.DefaultOption.ManagementType,
                pageSessionKey: _self.viewBag.DefaultOption.SessionKey,
                ManagementType: _self.viewBag.DefaultOption.ManagementType,
                PARAM: _self.finalSearchParam
            }),

            success: function (result) {
                _self.hideProgressbar();
                _self.close();
            },
            error: function (result) {
                _self.footer.getControl("excelDownload") && _self.footer.getControl("excelDownload").setAllowClick();
            }
            .bind(_self)
        });
    },

    // 재고, 회계 재집계 가능 팝업 콜백 함수
    customAlert: function () {
        customAlert = new Array();
        var _self = this;

        customAlert.push({
            label: ecount.resource.LBL06464,
            callback: function () {
                _self.moveYearlyUnusedCodes();

                return -1;
            }.bind(this)
        },
            {
                label: ecount.resource.BTN00008,
                callback: function () {
                }.bind(this)
            });

        return customAlert;
    },

    // 연간미사용코드(Yearly Unused Codes) button click event
    onButtonYearlyUnusedCodes: function (e) {
        var _self = this;
        var _btnSelectedDelete = _self.footer.getControl("deleteRestore");
        var _chkSummary = {
            MenuType: "S" // 회계(A), 재고(S), 미청구(P)
        };

        if (!['W'].contains(_self.viewBag.Permission.Permit.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            _btnSelectedDelete.setAllowClick();
            return false;
        }

        if (this.viewBag.InitDatas.PreDate.substring(0, 6).toString() > _self.viewBag.WidgetDatas["widget.configInventory"].config["SaleDate"].substring(0, 6).toString()) {
            ecount.common.api({
                url: "/Common/Infra/CheckSummary",
                data: Object.toJSON(_chkSummary),
                success: function (result) {
                    if (result.Data.RESULT_YN == "N") {
                        ecount.customAlert(String.format(ecount.resource.MSG06899, result.Data.SUMMARY_MINUTE, result.Data.SUMMARY_DATE),
                            {
                                list: [{
                                    label: ecount.resource.LBL06464,
                                    callback: _self.moveYearlyUnusedCodes.bind(_self)
                                }, {
                                    label: ecount.resource.BTN00008,
                                    callback: function () {
                                    }.bind(_self)
                                }]
                            });
                    } else {
                        var options = {
                            url: "/ECERP/ECM/SummaryChk",
                            name: ecount.resource.LBL02402,
                            param: {
                                Base_Form_Date: _self.viewBag.InitDatas.PPreDate,
                                Base_To_Date: _self.viewBag.InitDatas.PPreDate,
                                FlagFormID: "",
                                Summary_Flag: "S",
                                EnableCheckMonthsAgo: 0,
                                Inventory_Flag: "1",
                                Account_Flag: "0",
                                width: 650,
                                height: 350,
                                modal: true
                            }
                        };

                        _self.openWindow(options);
                    }
                }
            });
        } else {
            _self.moveYearlyUnusedCodes();
        }

        _btnSelectedDelete.setAllowClick();
    },

    // 엑셀(Excel) button click event
    onFooterExcel: function (e) {
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        var excelSearch = this.finalSearchParam;
        excelSearch.EXCEL_FLAG = "Y";
        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListProdForExcel",
            param: excelSearch
        });

        excelSearch.EXCEL_FLAG = "N";
    },
    onFooterWebUploader2: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Common/BulkUploadForm', //'/ECERP/Popup.Common/EZS001M',
            name: ecount.resource.LBL02339,
            additional: true,
            popupType: false,
            param: {
                width: 1000,
                height: 640,
                FormType: 'SI902', //SI420
                IsGetBasicTab: true
            }
        });
    },

    /**********************************************************************
    * define header dropdown event listener
    **********************************************************************/
    //전체삭제
    onDropdownTotalDelete: function (e) {
        var self = this;
        if (self.viewBag.Permission.Permit.Value.equals("W") && self.viewBag.isGuest == "false") {
            var popupParam = {
                width: 480,
                height: 250,
                isSendMsgAfterDelete: true,
                TABLES: 'SALE003',
                DEL_TYPE: 'Y',
                DELFLAG: 'Y',
                DeleteCodesDtos: Object.toJSON(this.finalSearchParam),
                SEARCH_CNT: this.SEARCH_CNT
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/CM021P',
                name: ecount.resource.LBL00043,
                param: popupParam,
                additional: true
            });

        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    //품목계정추가
    onDropdownSetItemAccounts: function (e) {
        var self = this;
        if (!self.viewBag.Permission.Permit.Value.equals("W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: 550,
            height: 500
        };

        this.openWindow({
            url: "/ECERP/Popup.Common/ESA010P_05",
            name: ecount.resource.BTN00162,
            param: param,
            popupType: false
        });
    },

    //양식 설정 팝업(Form Settings pop-up)
    onDropdownListSettings: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formTypeCode,
            isSaveAfterClose: true, // Save and close
            FORM_SEQ: 1
        };

        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    //검색창설정
    onDropdownSearchTemplate: function (e) {
        var self = this;
        if (self.viewBag.Permission.Permit.Value.equals("W") || self.viewBag.Permission.Permit.Value.equals("U")) {
            var param = {
                width: 1020,
                height: 800,
                FORM_TYPE: "SP900",
                FORM_SEQ: 1
            };

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.BTN00169,
                param: param
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02390, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    //검색창 설정 팝업(Search Settings pop-up window)
    onDropdownSearchItemTemplate: function (e) {
        var param = {
            width: 400,
            height: 460,
            FORM_TYPE: this.formSearchControlType,
            FORM_TYPE_MASTER: "SR900",
            FORM_TYPE_INPUT: "SI902",
            FORM_SEQ: 1,
            NetFlag: "N",
            FIRST_FLAG: "Y"
        };

        this.openWindow({
            url: "/ECErp/Popup.Form/CM100P_24",
            name: 'CM100P_24',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
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
            popupType: false,
        });
    },

    /**********************************************************************
    * define header tab event listener
    **********************************************************************/
    //탭 변경시 
    onChangeHeaderTab: function (event) {
        this.currentTabId = event.tabId;

        if (this.header.getControl("txtSProdCd") != undefined)
            this.header.getControl("txtSProdCd").setFocus(0);
    },

    /**********************************************************************
    * define header button event listener
    **********************************************************************/
    // header quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.cProdCd = "";
        this.isMoreFlag = false;
        this.finalSearchParam.LIMIT_COUNT = 1001;
        var grid = this.contents.getGrid("dataGrid");
        this.header.lastReset(this.finalHeaderSearch);
        this.finalSearchParam.QUICK_SEARCH = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().grid.removeShadedColumn();
        this.contents.getGrid().grid.clearChecked();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.finalSearchParam);
    },
    // header Search button click event
    onHeaderSearch: function (forceHide) {
        if (this._userParam) {
            if (this._userParam.C_param.QUICK_SEARCH != "") {
                this.header.getQuickSearchControl().setValue(this._userParam.C_param.QUICK_SEARCH);
            }
        } else {
            this.finalSearchParam.QUICK_SEARCH = "";
        }
        this.isMoreFlag = false;
        this.finalSearchParam.LIMIT_COUNT = 1001;
        if (this.dataSearch()) {
            if (!this._userParam) this.header.toggle(forceHide);
        }
    },

    onHeaderDmDelete: function () {
        debugger;
        if (this._userParam) {
            if (this._userParam.C_param.QUICK_SEARCH != "") {
                this.header.getQuickSearchControl().setValue(this._userParam.C_param.QUICK_SEARCH);
            }
        } else {
            this.finalSearchParam.QUICK_SEARCH = "";
        }
        this.isMoreFlag = false;
        this.finalSearchParam.LIMIT_COUNT = 1001;
        this.dataSearch();
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

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 관리에서 넘어온 경우가 아닐때만 포커스
            this.header.getQuickSearchControl().setFocus(0);
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 1077
    },

    onGridAfterRowDataLoad: function (e, data, grid) {

        if (data.result.Data.length > 0 && data.result && data.result.Data) {

            this.isMoreShow = this.limitCnt <= data.result.Data[0].MAXCNT;

            if (this.isMoreShow == true && this.isMoreFlag == false) {
                this.isMoreFlag = false;
                data.result.Data.splice(data.result.Data[0].MAXCNT, 1);
                data.result.Data[0]["MAXCNT"] = this.limitCnt - 1;
            }
            else {
                this.isMoreFlag = true;
            }

            if (this.isMoreShow == true) {
                grid.settings.setColumnSortable(false);
            } else {
                grid.settings.setColumnSortable(true);
            }

        }
    },

    _refreshFooter: function () {
        var toolbar = this.footer.get(0);
        var ctrl = widget.generator.control();
        toolbar.remove();
        var btnList = [];

        addGroupList = [];
        if (!(["4"].contains(this.isShowSearchForm || ""))) { //4:자료올리기시 사용함.
            if (ecount.config.inventory.PROC_FLAG == "Y") {
                addGroupList.push({ id: 'newMultipleProcesses', label: ecount.resource.BTN00171 });
            }
            if (ecount.config.inventory.USE_OEM_PROD) {
                addGroupList.push({ id: 'newOemProd', label: ecount.resource.LBL12931 });
            }
            if (addGroupList.length > 0)
                btnList.push(ctrl.define("widget.button.group", "new").label(ecount.resource.BTN00043).addGroup(addGroupList).clickOnce().end());
            else
                btnList.push(ctrl.define("widget.button.group", "new").label(ecount.resource.BTN00043).end());
            btnList.push(ctrl.define("widget.button", "barCode").label(ecount.resource.BTN00264).clickOnce().end());

            btnList.push(ctrl.define("widget.button", "relationship").label(ecount.resource.LBL15210).end());

            btnList.push(ctrl.define("widget.button", "levelGroup").label(ecount.resource.BTN00265).clickOnce().end());
            btnList.push(ctrl.define("widget.button", "changeNew").label(ecount.resource.BTN00026).clickOnce().end());
            btnList.push(ctrl.define("widget.button", "inventoryAdjustment").label(ecount.resource.LBL02915).clickOnce().end());
            btnList.push(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .addGroup([
                    { id: "Deactivate", label: ecount.resource.BTN00204 },
                    { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                    { id: 'yearlyUnusedCodes', label: ecount.resource.LBL13249 },
                    { id: "Activate", label: ecount.resource.BTN00203 }
                ]).css("btn btn-default")
                .noActionBtn().setButtonArrowDirection("up")
                .end());
            btnList.push(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());
            btnList.push(ctrl.define("widget.button", "webUploader2").label(ecount.resource.BTN00410).end());

            if (this.limitCnt != 0 && this.isMoreFlag == false && this.isMoreShow == true) {
                btnList.push(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00096).end());
            }
        }

        toolbar.addLeft(btnList);
    },

    // Grid Render Complete
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        // 선택삭제 후 삭제되지 않은 품목코드 체크박스 넣어주기
        if (this.errDataAllKey.length > 0) {
            this.contents.getGrid("dataGrid").grid.addChecked(this.errDataAllKey);
        }

        /*
          아래 조건은 [전체삭제]에 모든 파라미터가 적용된 후에는 제거해야함
          Have to remove bellow codes(if...) if all parameters added to [All delete]
        */
        if (this.finalSearchParam.EXPENSES_WEIGHT_F == "" &&
            this.finalSearchParam.EXPENSES_WEIGHT_T == "" &&
            this.finalSearchParam.EXPENSE_COST_F == "" &&
            this.finalSearchParam.EXPENSE_COST_T == "" &&
            this.finalSearchParam.INSPECT_STATUS == ecount.delimiter + "L" + ecount.delimiter + "S" &&
            this.finalSearchParam.INSPECT_TYPE_CD == "" &&
            this.finalSearchParam.IN_PRICE_F == "" &&
            this.finalSearchParam.IN_PRICE_T == "" &&
            this.finalSearchParam.IN_TERM_F == "" &&
            this.finalSearchParam.IN_TERM_T == "" &&
            this.finalSearchParam.ITEM_TYPE == ecount.delimiter + "B" + ecount.delimiter + "M" + ecount.delimiter + "Y" + ecount.delimiter + "N" &&
            this.finalSearchParam.LABOR_COST_F == "" &&
            this.finalSearchParam.LABOR_COST_T == "" &&
            this.finalSearchParam.LABOR_WEIGHT_F == "" &&
            this.finalSearchParam.LABOR_WEIGHT_T == "" &&
            this.finalSearchParam.MAIN_PROD_CD == "" &&
            this.finalSearchParam.MATERIAL_COST_F == "" &&
            this.finalSearchParam.MATERIAL_COST_T == "" &&
            this.finalSearchParam.MIN_QTY_F == "" &&
            this.finalSearchParam.MIN_QTY_T == "" &&
            this.finalSearchParam.NO_USER1_F == "" &&
            this.finalSearchParam.NO_USER1_T == "" &&
            this.finalSearchParam.NO_USER2_F == "" &&
            this.finalSearchParam.NO_USER2_T == "" &&
            this.finalSearchParam.NO_USER3_F == "" &&
            this.finalSearchParam.NO_USER3_T == "" &&
            this.finalSearchParam.NO_USER4_F == "" &&
            this.finalSearchParam.NO_USER4_T == "" &&
            this.finalSearchParam.NO_USER5_F == "" &&
            this.finalSearchParam.NO_USER5_T == "" &&
            this.finalSearchParam.NO_USER6_F == "" &&
            this.finalSearchParam.NO_USER6_T == "" &&
            this.finalSearchParam.NO_USER7_F == "" &&
            this.finalSearchParam.NO_USER7_T == "" &&
            this.finalSearchParam.NO_USER8_F == "" &&
            this.finalSearchParam.NO_USER8_T == "" &&
            this.finalSearchParam.NO_USER9_F == "" &&
            this.finalSearchParam.NO_USER9_T == "" &&
            this.finalSearchParam.NO_USER10_F == "" &&
            this.finalSearchParam.NO_USER10_T == "" &&
            this.finalSearchParam.OUTSIDE_PRICE_F == "" &&
            this.finalSearchParam.OUTSIDE_PRICE_T == "" &&
            this.finalSearchParam.OUT_COST_F == "" &&
            this.finalSearchParam.OUT_COST_T == "" &&
            this.finalSearchParam.OUT_PRICE1_F == "" &&
            this.finalSearchParam.OUT_PRICE1_T == "" &&
            this.finalSearchParam.OUT_PRICE2_F == "" &&
            this.finalSearchParam.OUT_PRICE2_T == "" &&
            this.finalSearchParam.OUT_PRICE3_F == "" &&
            this.finalSearchParam.OUT_PRICE3_T == "" &&
            this.finalSearchParam.OUT_PRICE4_F == "" &&
            this.finalSearchParam.OUT_PRICE4_T == "" &&
            this.finalSearchParam.OUT_PRICE5_F == "" &&
            this.finalSearchParam.OUT_PRICE5_T == "" &&
            this.finalSearchParam.OUT_PRICE6_F == "" &&
            this.finalSearchParam.OUT_PRICE6_T == "" &&
            this.finalSearchParam.OUT_PRICE7_F == "" &&
            this.finalSearchParam.OUT_PRICE7_T == "" &&
            this.finalSearchParam.OUT_PRICE8_F == "" &&
            this.finalSearchParam.OUT_PRICE8_T == "" &&
            this.finalSearchParam.OUT_PRICE9_F == "" &&
            this.finalSearchParam.OUT_PRICE9_T == "" &&
            this.finalSearchParam.OUT_PRICE10_F == "" &&
            this.finalSearchParam.OUT_PRICE10_T == "" &&
            this.finalSearchParam.OUT_PRICE_F == "" &&
            this.finalSearchParam.OUT_PRICE_T == "" &&
            this.finalSearchParam.PROCESS_FLAG == null &&
            this.finalSearchParam.MULTI_PROD_FLAG == null &&
            this.finalSearchParam.PROD_SELL_TYPE == ecount.delimiter + "B" + ecount.delimiter + "Y" + ecount.delimiter + "N" &&
            this.finalSearchParam.PROD_WHMOVE_TYPE == ecount.delimiter + "B" + ecount.delimiter + "Y" + ecount.delimiter + "N" &&
            this.finalSearchParam.QC_BUY_TYPE == ecount.delimiter + "B" + ecount.delimiter + "Y" + ecount.delimiter + "N" &&
            this.finalSearchParam.QC_YN == ecount.delimiter + "B" + ecount.delimiter + "Y" + ecount.delimiter + "N" &&
            this.finalSearchParam.REMARKS == "" &&
            this.finalSearchParam.SAFE_A0001 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAFE_A0002 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAFE_A0003 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAFE_A0004 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAFE_A0005 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAFE_A0006 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAFE_A0007 == ecount.delimiter + "0" + ecount.delimiter + "1" + ecount.delimiter + "2" &&
            this.finalSearchParam.SAMPLE_PERCENT == "" &&
            this.finalSearchParam.SERIAL_TYPE == ecount.delimiter + "B" + ecount.delimiter + "M" + ecount.delimiter + "Y" + ecount.delimiter + "N" &&
            this.finalSearchParam.TAX_PERCENT == "" &&
            this.finalSearchParam.UNIT == "" &&
            this.finalSearchParam.VAT_RATE_BY == ecount.delimiter + "N" + ecount.delimiter + "Y" &&
            this.finalSearchParam.VAT_RATE_BY_PERCENT == "" &&
            this.finalSearchParam.VAT_YN == ecount.delimiter + "N" + ecount.delimiter + "Y") {
            this.header.showOptionItem("TotalDelete");
        } else {
            this.header.hideOptionItem("TotalDelete");
        }

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();
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
                config.isIncludeInactive = true;        // 사용중단
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
                config.isIncludeInactive = true;        // 사용중단
                break;
            case "main_prod_cd":  // 주품목
                config.isApplyDisplayFlag = true;
                config.isIncludeInactive = true;        // 사용중단
                break;
            case "inspect_type_cd":  // 품질검사유형
                config.isApplyDisplayFlag = true;
                config.isNewDisplayFlag = false;
                config.isIncludeInactive = true;        // 사용중단
                config.callPageName = 'ESA009M';
                //DATA_TYPE
                break;
            case "txtSProdCd_MULTI":  //다중코드
                config.isApplyDisplayFlag = true;
        }

        handler(config);
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case "ESA010M":
                this._ON_REDRAW();
                break;
            case "EMV002P_02":
                this.SetReload();
                break;
            case "SummaryChk":
                this.viewBag.WidgetDatas["widget.configInventory"].config["SaleDate"] = message.sale_date;
                this.moveYearlyUnusedCodes();
                break;
            case "CM100P_02":
            case "CM100P_24":
                this.reloadPage();
                break;
            case "CM021P":
                var _page = page, _message = message;
                this.showProgressbar(null, null, 0);
                ecount.global.setTimeout(this.ecPageID, function () {
                    this.allDeleteCallBack(_page, JSON.parse(_message));
                }.bind(this), 0);

                var message = {
                    callback: page.close.bind(page)
                };
                break;
            default:
                if (message == "DeleteAll") {
                    this.reloadPage();
                }
                break;
        }

        message.callback && message.callback();  // The popup page is closed   
    },

    //전체 삭제 콜백
    allDeleteCallBack: function (object, formData) {
        ecount.common.api({
            url: object.DeleteApiUrl,
            data: formData,
            //data: {               
            //        Data: this.finalSearchParam                
            //},
            error: function () {
                this.hideProgressbar();
            }.bind(this),
            success: function (result) {
                //검색하여 삭제처리한 품목코드 수량이 지정한 검색 수량(SEARCH_CNT)보다 작으면 반복 중단
                if (result.Data < object.SEARCH_CNT) {
                    //end
                    this.hideProgressbar();
                    this.reloadPage();
                } else {
                    this.allDeleteCallBack(object, formData);
                 //   this.hideProgressbar();
                 //   this.reloadPage();

              //      this.allDeleteCallBack(object, formData);
                }
            }.bind(this)
        });
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

    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.SetReload();
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/
    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['DEL_GUBUN'].toUpperCase() == "Y")
            return true;
    },

    // 품목코드 click
    setGridItemProdCd: function (value, rowItem) {
        var option = [];
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                if (data.rowItem.PROD_CD == data.rowItem.G_PROD_CD) {
                    if (ecount.config.inventory.PROC_FLAG != "Y") {
                        ecount.alert(ecount.resource.MSG01778);
                        return false;
                    }
                }

                var param = "";
                var ProdCd = data.rowItem.PROD_CD;
                var GProdCd = data.rowItem.G_PROD_CD;
                var MProdCd = data.rowItem.M_PROD_CD || "";

                param = {
                    isMultiProcess: (ProdCd == GProdCd) ? true : false,
                    EditFlag: "M",
                    isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                    PROD_FLAG: (ProdCd == GProdCd) ? "G" : ((ProdCd == MProdCd) ? "M" : "S"),
                    PROD_CD: ProdCd
                }

                this.openItemReg(param);

                e.preventDefault();
            }.bind(this)
        }

        return option;
    },

    // 파일(file) click
    setGridItemFileMgr: function (value, rowItem) {

        var option = [];
        option.data = ecount.resource.BTN00081;
        option.controlType = "widget.link";

        if (!$.isEmpty(rowItem.PROD_FILE_CNT) && rowItem.PROD_FILE_CNT > 0) {
            option.attrs = {
                'class': ['text-warning-inverse']
            };
        }

        option.event = {
            'click': function (e, data) {
                //var locationAllow = ecount.infra.getGroupwarePermissionByAlert(this.viewBag.InitDatas.GroupwarePermission).Excute();
                //if (locationAllow) {
                    var param = {
                        width: 780,
                        height: 600,
                        BOARD_CD:7000,
                        prodCdAllInOne: data.rowItem.PROD_CD,
                        prodDesAllInOne: data.rowItem.PROD_DES,
                        isFileManage: true
                    };

                    this.openWindow({
                      //  url: "/ECMain/ESA/ESA009P_04.aspx?b_type=S01&code=" + encodeURIComponent(data.rowItem.PROD_CD) + "&code_des=" + encodeURIComponent(data.rowItem.PROD_DES),
                        url: "/ECERP/EGM/EGM024M",
                        name: 'ESA009P_04',
                        param: param,
                        popupType: false
                    });
            //    }
            }.bind(this)
        }

        return option;
    },

    // 기본설정, 필수입력, 선택입력, 사용안함
    setGeridItemBMYN: function (value, rowItem) {
        var option = [];
        if (value == "B") option.data = ecount.resource.LBL08396;
        else if (value == "M") option.data = ecount.resource.LBL09077;
        else if (value == "Y") option.data = ecount.resource.LBL08831;
        else if (value == "N") option.data = ecount.resource.LBL07880;

        return option;
    },

    // 기본설정, 사용, 사용안함
    setGridItemBYN: function (value, rowItem) {
        var option = [];
        if (value == "B") option.data = ecount.resource.LBL08396;
        else if (value == "Y") option.data = ecount.resource.LBL07879;
        else if (value == "N") option.data = ecount.resource.LBL07880;

        return option;
    },

    // 대표품목 BOM동기회
    //setGeridItemBYN: function (value, rowItem) {
    //    var option = [];
    //    if (value == "true") option.data = "Y";
    //    else option.data = "N";

    //    return option;
    //},

    // 상세보기 click
    setGridItemDetail: function (value, rowItem) {
        var option = [];
        option.data = ecount.resource.BTN00315;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 800,
                    height: 700,
                    PROD_CD: encodeURIComponent(data.rowItem.PROD_CD),
                    ProdEditType: "ALL_IN_ONE_SEARCH"
                };

                this.openWindow({
                    url: "/ECErp/ESQ/ESQ503M",
                    name: 'ESA009P_04',
                    param: param,
                    popupType: false
                });
            }.bind(this)
        }

        return option;
    },

    // 이미지 링크 click
    setGridImage: function (value, rowItem) {
        var option = {};
        if (!$.isNull(rowItem.ATTACH_INFO) && !$.isNull(rowItem.FS_OWNER_KEY)) {
            option.data = rowItem.FILE_FULLPATH;
            option.controlType = "widget.thumbnailLink";
        }
        else {
            option.data = '';
            option.controlType = "widget.link";
        }

        option.dataType = "1";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 400,
                    height: 420,
                    Request: {
                        PROD_CD: data.rowItem.PROD_CD,
                        isViewOnly: true
                    }
                };

                this.openWindow({
                    url: '/ECERP/SVC/EGG/EGG024M',
                    name: ecount.resource.LBL02072,
                    param: param,
                    popupType: false,
                    additional: true
                });

                data.event.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // 정렬 (Sort) click
    setGridSort: function (e, data) {
        this.header.toggle(true);
        // 컬럼 숫자만 리턴(Only returns the column number)
        this.finalSearchParam.SORTCOL_INDEX = Number(data.propertyName.replace("A", "")) + 1;
        this.finalSearchParam.SORT_COLUMN = "A" + (Number(data.propertyName.replace("A", ""))).toString();
        //this.finalSearchParam.SORT_COLUMN = data.columnId;
        this.finalSearchParam.SORT_TYPE = this.getSortInfo(data.columnId)
        this.finalSearchParam.SORTCOL_ID = Number(data.propertyName.replace("A", "")) + 1;
        this.contents.getGrid().draw(this.finalSearchParam);
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
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onFooterNew(e);
        }
    },

    // F3 click - 서치클릭
    ON_KEY_F3: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderClose();
        }
    },

    // F8 click
    ON_KEY_F8: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch(false);
        }
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (target != null && target.cid == "search" && !this.viewBag.DefaultOption.ManagementType) {
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
            settings && settings.setPagingCurrentPage(1); //Paging Page 1
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
        this.header.getQuickSearchControl().setValue(searchParam.QUICK_SEARCH);

        if (!$.isEmpty(settings)) {
            settings
                .setHeaderTopMargin(this.header.height())
                .setRowDataParameter(searchParam);
        }
        // 조회 당시 컨트롤 정보
        this.finalHeaderSearch = this.header.extract(true).merge();

        this.finalSearchParam = searchParam;
        this.finalSearchParam.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);

        //다중 컨트롤 중 현재 화면에 표시된 컨트롤의 value만 serialize
        if (this.finalSearchParam.PROD_CD_MULTI) {
            this.finalSearchParam.PROD_CD = "∬" + this.finalSearchParam.PROD_CD_MULTI;
        }

        this.finalSearchParam.PROD_CD_FROM = this.finalSearchParam.PROD_CD_BETWEEN_FROM;
        this.finalSearchParam.PROD_CD_TO = this.finalSearchParam.PROD_CD_BETWEEN_TO;

    },

    // draw grid
    dataSearch: function (e) {
        debugger;
        for (var i = 0; i < 7; i++) {
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

        if (!(["4"].contains(this.isShowSearchForm || ""))) { //4:자료올리기시 사용함.
            this.showProgressbar(true);
            var gridObj = this.contents.getGrid("dataGrid"),
                settings = gridObj.settings;
            this.header.toggle(true);

            // search parameter setting
            this.setGridParameter(settings);
            gridObj.grid.removeShadedColumn();
            if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터백업에서 온경우 적용하지 않음
                gridObj.draw(this.finalSearchParam);
            }
            
            this.hideProgressbar();
        }
        else {
            var _self = this;
            _self.showProgressbar(true);
           // if (this.isDataManagePath != '1') {
                this.setGridParameter(settings);
                this.header.toggle(true);
                ecount.common.api({
                    url: "/Inventory/Basic/GetListProd",
                    data: this.finalSearchParam,
                    success: function (result) {
                        /*엑셀에서의 경우는 화면에 출력하지 않고, 부모창으로 값을 전송한다. 결과값.*/
                        var message = {
                            data: (result.Data || []),
                            callback: _self.close.bind(_self)
                        };
                        _self.sendMessage(_self, message); /*처리 이후 호출한 페이지에 message 전송.*/
                    },
                    complete: function () {
                        _self.hideProgressbar();
                    }
                });
            //} else {
            //    this.setGridParameter(settings);
            //    var  paramData = {
            //        data: this.finalSearchParam
            //    };
            //    ecount.confirm(ecount.resource.MSG09734, function (status) {
            //        if (status === true) {
            //            ecount.common.api({
            //                url: "/SVC/SelfCustomize/DataManagement/DeleteForDataManagement",
            //                data: paramData,
            //                success: function (result) {
            //                    var message = {
            //                        data: (result.Data || []),
            //                        callback: _self.close.bind(_self)
            //                    };
            //                    _self.sendMessage(_self, message);
            //                },
            //                complete: function () {
            //                    _self.hideProgressbar();
            //                }
            //            });
            //        }
            //    });
            //}
        };
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

    // 선택 리스트등 정보 clear 
    setSelectProdClear: function () {
        this.selectProdCodeList = "";
        this.selectProdDesList = "";
    },

    //삭제 처리
    callSelectDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var DeleteLists = [];
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            DeleteLists.push({ Code: val.split("ㆍ")[0], Name: val.split("ㆍ")[1] });
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val.split("ㆍ")[0]);
            }
        });

        var formData = Object.toJSON({
            //Request: {
            //    Data: {
            MENU_CODE: "Item",              //MENU_CODE (ENUM_BASIC_CODE_TYPE)
            CHECK_TYPE: "S",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
            DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
            PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
            //DeleteListInfo: DeleteLists
            //    }
            //}
        });

        ecount.common.api({
            //url: "/SVC/Inventory/Basic/DeleteMultiProd",
            url: "/SVC/Inventory/Basic/DeleteItemCheckList",
            data: formData,
            success: function (result) {
                //if (result.Status != "200") {
                //    ecount.alert(result.fullErrorMsg + result.Data);
                //    self.hideProgressbar();
                //} else {
                //    var allDeleteFlag = true;
                //    var arrExcuteFlag = result.Data.ExcuteFlag.split(ecount.delimiter);

                //    for (var i = 0, limit = arrExcuteFlag.length; i < limit; i++) {
                //        if (arrExcuteFlag[i] != "True") {
                //            allDeleteFlag = false;
                //            break;
                //        }
                //    }

                //    if (allDeleteFlag == false) {
                //        self.getSelectDeleteResult(result);
                //    }

                //    for (var i = 0, limit = DeleteLists.length; i < limit; i++) {
                //        self.contents.getGrid().grid.removeChecked(DeleteLists[i].Code);
                //    }

                //    self.contents.getGrid().draw(self.finalSearchParam);
                //}

                if (result.Status !== "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (result.Data !== null && result.Data.length === 1 && result.Data[0].CHECK_CODE === null) {
                    ecount.alert(result.Data[0].ERR_MSG);
                }
                else if (result.Data !== null && result.Data !== "" && result.Data !== undefined && result.Data.length > 0) {

                    //삭제불가 코드리스트 팝업창 연결
                    self.ShowNoticeNonDeletable(result.Data);

                    //체크해제
                    for (var idx = 0, limit = selectItem.length; idx < limit; idx++) {
                        self.contents.getGrid().grid.removeChecked(selectItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                    }

                    //그리드 리로드
                    self.contents.getGrid().draw(self.finalSearchParam);
                }
                else {

                    //그리드 로우 삭제
                    self.contents.getGrid().grid.removeCheckedRow();

                    self.contents.getGrid().draw(self.finalSearchParam);

                }
            },
            complete: function () {
                btnDelete.setAllowClick();
            }
        });
    },

    //api에서 체크된 거래처정보 팝업으로 연결
    getSelectDeleteResult: function (result) {
        var codeList = null;
        excuteFlag = result.Data.ExcuteFlag.split(ecount.delimiter);
        codeList = result.Data.CodeList.split(ecount.delimiter);

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        for (var i = 0, Limit = excuteFlag.length; i < Limit; i++) {
            if (excuteFlag[i] == "False") {
                this.errDataAllKey.push(codeList[i]);
            }
        }

        var param = {
            width: 500,
            height: 600,
            PageGubun: "PROD",
            CodeList: result.Data.CodeList,
            NameList: result.Data.NameList,
            ExcuteFlag: result.Data.ExcuteFlag,
            ApplyResult_01: result.Data.ApplyResult_01,
            ApplyResult_01_Count: result.Data.ApplyResult_01_Count,
            ApplyResult_02: result.Data.ApplyResult_02,
            ApplyResult_02_Count: result.Data.ApplyResult_02_Count,
            ApplyResult_03: result.Data.ApplyResult_03,
            ApplyResult_03_Count: result.Data.ApplyResult_03_Count,
            ApplyResult_04: result.Data.ApplyResult_04,
            ApplyResult_04_Count: result.Data.ApplyResult_04_Count,
            ApplyResult_05: result.Data.ApplyResult_05,
            ApplyResult_05_Count: result.Data.ApplyResult_05_Count,
            ApplyResult_06: result.Data.ApplyResult_06,
            ApplyResult_06_Count: result.Data.ApplyResult_06_Count,
            ApplyResult_07: result.Data.ApplyResult_07,
            ApplyResult_07_Count: result.Data.ApplyResult_07_Count,
            ApplyResult_08: result.Data.ApplyResult_08,
            ApplyResult_08_Count: result.Data.ApplyResult_08_Count,
            ApplyResult_09: result.Data.ApplyResult_09,
            ApplyResult_09_Count: result.Data.ApplyResult_09_Count,
            ApplyResult_10: result.Data.ApplyResult_10,
            ApplyResult_10_Count: result.Data.ApplyResult_10_Count,
            ApplyResult_10_Bom: result.Data.ApplyResult_10_Bom,
            ApplyResult_11: result.Data.ApplyResult_11,
            ApplyResult_11_Count: result.Data.ApplyResult_11_Count
        }

        this.openWindow({
            url: "/ECERP/ESA/ESA009P_16",
            name: ecount.resource.BTN85009,
            param: param
        });
    },

    // 검색창설정후 reload
    reloadPage: function () {
        var urlstring = "/ECERP/ESA/ESA009M";

        //reset sort to default when reload page (Dev. Progress 5546)
        this.finalSearchParam.SORT_COLUMN = this.defaultSearchParameter.SORT_COLUMN;
        this.finalSearchParam.SORT_TYPE = this.defaultSearchParameter.SORT_TYPE;

        var _param = this.finalSearchParam;
        _param.CurrentPage = "1";
        this.onAllSubmit({
            url: urlstring,
            formdata: this.finalHeaderSearch,
            param: _param
        });
    },

    ////삭제불가 메세지 팝업창
    //ShowNoticeNonDeletable: function (result) {
    //    var codeList = null;

    //    excuteFlag = result.Data.ExcuteFlag.split(ecount.delimiter);
    //    codeList = result.Data.CodeList.split(ecount.delimiter);
    //    this.errDataAllKey = null;
    //    this.errDataAllKey = new Array();

    //    for (var i = 0, Limit = excuteFlag.length; i < Limit; i++) {
    //        if (excuteFlag[i] == "False") {
    //            this.errDataAllKey.push(codeList[i]);
    //        }
    //    }

    //    var param = {
    //        width: 520,
    //        height: 300,
    //        datas: Object.toJSON(codeList),
    //        parentPageID: this.pageID,
    //        responseID: this.callbackID,
    //        MENU_CODE: "Dept"
    //    };

    //    this.openWindow({
    //        url: "/ECERP/Popup.Common/NoticeNonDeletable",
    //        name: ecount.resource.LBL11065,
    //        popupType: false,
    //        additional: false,
    //        param: param
    //    });
    //},

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
            height: 500,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "Item"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    // 전체삭제후 reload
    reLoadGrid: function () {
        var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;
        var page = settings.getPagingCurrentPage();

        // search parameter setting
        this.setGridParameter(settings);
        settings.setPagingCurrentPage(page);
        gridObj.draw(this.finalSearchParam);
        this.header.toggle(true);
    },

    //그리드 다시 로드 SetReload
    SetReload: function () {
        var _gridObject = this.contents.getGrid();
        if (_gridObject) {
            _gridObject.grid.clearChecked()
            _gridObject.draw(this.finalSearchParam);
        }
        debugger;
        this.header.getQuickSearchControl().hideError();
    },

    // 품목등록창 오픈
    openItemReg: function (inValue) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 700,
            isMultiProcess: inValue.isMultiProcess,
            EditFlag: inValue.EditFlag,
            isSaveContentsFlag: inValue.isSaveContentsFlag,   // 저장유지버튼 사용여부
            isCloseFlag: true,  // 닫기버튼 사용여부
            PROD_FLAG: inValue.PROD_FLAG,
            PROD_CD: inValue.PROD_CD,
            isOemProd: inValue.isOemProd || false
        };

        this.openWindow({
            url: "/ECERP/ESA/ESA010M",
            name: ecount.resource.LBL02390,
            param: param
        });
    },

    moveYearlyUnusedCodes: function (e) {
        var btn = this.footer.getControl("deleteRestore");
        var param = {
            width: 770,
            height: 600,
            Type: "Item"
        };

        this.openWindow({
            url: "/ECERP/EMV/EMV002P_02",
            name: ecount.resource.LBL08629,
            param: param,
            fpopupID: this.ecPageID
        });

        btn.setAllowClick();
    },

    //더보기 버튼 클릭
    onFooterMoreData: function (e) {

        // SP에서 LIMIT_COUNT가 0이면 모두 조회로 처리
        this.finalSearchParam.LIMIT_COUNT = 0;
        // 버튼클릭여부
        this.isMoreFlag = true;
        // 다시 그리기
        this.contents.getGrid().draw(this.finalSearchParam);

    },

    onDropdownTxtSProdCd0: function (e) {
        var prodCodeBetweenValue = this.header.getControl("txtSProdCd_BETWEEN").getValue();
        var isEmpty = false;

        prodCodeBetweenValue.forEach(function (v) {
            if (v !== "") {
                isEmpty = true;
            }
        })

        if (isEmpty) {
            this.header.getControl("txtSProdCd").setValue(0, prodCodeBetweenValue, true);
        }
        this.header.getControl("txtSProdCd").setFocus(0);

    },

    onDropdownTxtSProdCd1: function (e) {

        this.header.getControl("txtSProdCd_MULTI").setFocus(0);
    },

    onDropdownTxtSProdCd2: function (e) {
        var prodCodeValue = this.header.getControl("txtSProdCd").getValue();

        if (prodCodeValue) {
            this.header.getControl("txtSProdCd_BETWEEN").setValue(0, prodCodeValue, true);
        }
        this.header.getControl("txtSProdCd_BETWEEN").setFocus(0);

    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnItem(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnItem(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };

        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                PROD_CD: data.PROD_CD,
                DEL_GUBUN: cancelYN,
                PROD_FLAG: (data.PROD_CD == data.G_PROD_CD) ? "G" : ((data.PROD_CD == data.M_PROD_CD) ? "M" : "S")
            });
        });

        return updatedList;
    },

    getSortInfo: function (columnId) {


        var endPoint = this.formInfo.length;
        for (var i = 0; i < endPoint; i++) {

            if (this.formInfo[i].id == columnId) {
                this.formInfo[i].sort = this.formInfo[i].sort == "D" ? "A" : "D";
                return this.formInfo[i].sort;
            }
        }
    },

    updateActiveYnItem: function (updatedList) {
        var self = this;
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();

            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: ecount.resource.LBL93033, PermissionMode: "U"
            }]);
            ecount.alert(msgdto.fullErrorMsg);

            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();

            return;
        }


        var formData = Object.toJSON({
            Request: {
                Data: updatedList.Data
            }
        });


        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateSale003ForDelFlag",
            data: formData,
            success: function (result) {
                if (result.Status == "200") {
                    self.reloadPage();
                }
            },
            complete: function () {
                btn.setAllowClick();
            }
        });
    },
});
