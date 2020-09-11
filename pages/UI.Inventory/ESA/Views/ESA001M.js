window.__define_resource && __define_resource("LBL00338","BTN00863","BTN00033","BTN00113","BTN00007","BTN00025","BTN00427","BTN00330","BTN00169","BTN00493","LBL01457","MSG02158","BTN00043","LBL15210","BTN00265","BTN00026","BTN00959","BTN00204","LBL08629","BTN00203","BTN00050","BTN00857","BTN00410","BTN00336","BTN00979","LBL02475","LBL01440","LBL05017","LBL04947","LBL00381","LBL13808","LBL15056","LBL02178","LBL00622","LBL07879","LBL07880","LBL08396","LBL09847","LBL09848","LBL06491","LBL09849","LBL01992","LBL03589","MSG04553","LBL04417","LBL07703","LBL05716","LBL01448","LBL10548","LBL80322","LBL09077","LBL08831","LBL01450","BTN00081","MSG09786","LBL07553","BTN00315","LBL93617","LBL35334","BTN00644","MSG00213","LBL00361","LBL00336","LBL00043","MSG00141","LBL07244","LBL03828","MSG04752","MSG00299","MSG06899","LBL06464","BTN00008","LBL02495","LBL02339","LBL00359","LBL02092","LBL00501","LBL06161","LBL01418","MSG09734","LBL03176","LBL11065","LBL93466","LBL93033","LBL01185","LBL00271","LBL11185","LBL04057","LBL02869","LBL03183","LBL11186","LBL05969","LBL00078","LBL01374","LBL05714","LBL05715","LBL01084","LBL09594","LBL02203","LBL02074","LBL03135","LBL01713","LBL01164","LBL00782","LBL02891","LBL80270");
/****************************************************************************************************
1. Create Date : 2015.09.11
2. Creator     : 양미진
3. Description : 재고/회계 > 기초등록 > 거래처등록 > 리스트
4. Precaution  : 기존에는 회원등록과 같은 페이지로 쓰지만 신규프레임웍에서는 분리하기로 결정
5. History     : 
                [2016.02.01] 이은규: 헤더에 옵션 > 사용방법설정 추가
                2016-03-21 안정환 소스 리팩토링 적용
                2016-04-04 최용환 : 거래처 수금지급예정일 항목 리소스 분리
				2017.04.24 양미진: 연간미사용코드 추가
                2018.01.18(Thien.Nguyen) Add option set shaded for grid, set scroll top for page. 
                2018.07.25(Ngo Thanh Lam) Remove Old button
                2018.09.20(Chung Thanh Phuoc) Add link navigation Customer/VendorName of menu Customer/Vendor List
                2018.10.05 (PhiTa) Apply disable sort when data search > 1000
                2018.11.01 (PhiTa) Remove Apply disable sort > 1000
                2018.12.27 (HoangLinh): Remove $el
                2018.12.21 (PhiVo) applied 17520-A18_04271
                2019.02.25 (PhiVo) A19_00625-FE 리팩토링_페이지 일괄작업 10차
                2019.03.26 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                2019.04.08 (문요한) : 마리아 DB동기화 작업 - 영구삭제
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2019.06.25 (이현택) : 거래처 관계기능 설정 추가 관련 선배포
                2019.07.03 (이현택) : 거래처 관계기능 설정 추가 및 선배포 제거
                2019.08.16 (PhiVo): A19_02611-거래처관계설정 권한 거래처등록바라보도록 (change permission from 'E010119' to 'E010101')
                2019.09.16 (황재빈) : 천건이상 더보기 추가
                2019.10.08 (황재빈): 오천건이상 더보기로 변경
                2019.10.30 (김성범): 조회api 3.0 기준으로 url 및 파라미터변경 ( 엑셀변환은 제외 ) -A19_03373 거래처등록 본메뉴 조회화면 MYSQL에서 조회되도록 변경
				2019.11.22(양미진) - dev 32805 A19_04240 품목 검색 창 스크립트 오류
                2019.12.16[DucThai] - A19_04373 - 거래처등록, 품목등록메뉴 사용자지정 1 ~5 항목 정렬제공 기준확인
				2019.12.17(양미진) - dev 33882 A19_04552 거래처등록자료 변경하기 엑셀파일 다운로드 시 문제                
                2019.11.26 (김봉기) 데이터관리에서 넘어 온경우 그리드 숨기기 및 화면 예외처리
                2019.12.05 (김봉기) 데이터관리에서 넘어 온경우 퀵서치 숨기기 및 검색 안되게 > 바로 백업실행
                2010.12.31 (김봉기) 데이터관리 : onGridRenderBefore에 백업관련 소스 제거
                2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
6. Menu Path   : Inv.I > Setup > Customer/Vendor
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA001M", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    formSearchControlType: 'SN910',                             // 검색컨트롤폼타입
    formInputControlType: 'SI912',                             // 검색컨트롤폼타입
    formTypeCode: 'SR910',                                      // 리스트폼타입
    canCheckCount: 100,                                         // 체크 가능 수 기본 100
    formInfoData: null,                                         // 리스트 양식정보
    isUseSMS: ecount.config.limited.feature.USE_SMS,                    // SMS 사용여부/SMS UseFlag
    isUseBizNo: ecount.config.nation.USE_BIZNO,                 // 사업자번호 사용여부 (use business number)
    isUseExcelConvert: ecount.config.user.USE_EXCEL_CONVERT,    // 액셀변환권한유무
    finalSearchParam: null,
    finalSearchParamForSvc: null,
    finalHeaderSearch: null,                                    // 검색 시 검색 컨트롤 정보 (퀵서치)
    /*선택삭제 관련*/
    selectedCnt: 0,                                             // 선택한 리스트 수
    BusinessNoList: "",                                         // 선택한 거래처코드 리스트
    errDataAllKey: null,
    /*천건이상 더보기 관련*/
    limitCnt: 5001,                                             // 제한할 건 수
    isMoreShow: null,                                           // 천건이상 더보기 보여줄 지 여부
    isMoreFlag: false,                                          // 천건이상 더보기 클릭여부

    /*선택삭제 관련*/

    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,
    // 언어설정
    lan_type: null,
    userFlag: null,
    ALL_GROUP_CUST: null,                                       // 허용거래처그룹 - 0: 전체, 1: 특정그룹
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        if (this.isShowSearchForm == null) {    // [1: 열림(OPEN), 2:닫힘(CLOSE), 3:없음(NONE), 4:자료올리기용(Upload data)]]
            this.isShowSearchForm = "2";
        }
        /* hrkim
        if (this.isDataManagePath == "1") {
            this.isShowSearchForm = "4";
        }
        */

        if (this._userParam != undefined) {
            this.isShowSearchForm = this._userParam.isShowSearchForm;
        }

        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 서비 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "1";
        }

        //==================== 기초정보 설정 START====================
        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];
        //==================== 기초정보 설정 END====================

        /*거래처코드 widgetType을 바꾼다.- 시작(개발및 선배포를 위해서 임시조치) */
        //for (var i = 0; i < (this.viewBag.FormInfos["SN910"].items || []).length; i++) {
        //    var t = this.viewBag.FormInfos["SN910"].items[i];
        //    var searchone = t.subItems.find(function (column) { return column.id.toUpperCase() == "TXTBUSINESSNO" });
        //    if (searchone != null) {
        //        searchone["controlType"] = "widget.input.between";
        //    };
        //};
        this.defaultSearchParameter = this.CustListSearch;
        this.defaultSearchParameter.FORM_TYPE = this.formTypeCode;
        this.defaultSearchParameter.FORM_SER = 1;
        this.defaultSearchParameter.SORT_COLUMN = this.SORT_COLUMN;
        this.defaultSearchParameter.SORT_TYPE = this.SORT_TYPE;
        this.defaultSearchParameter.PAGE_SIZE = this.PAGE_SIZE;
        this.defaultSearchParameter.FROM_BULKUPLOAD_COLUMNS = this.BulkUploadColumns;
        this.defaultSearchParameter.IS_FROM_BULKUPLOAD = this.IsFromBulkUpload;
        this.defaultSearchParameter.LIMIT_COUNT = 5001;
        this.defaultSearchParameter.PRG_ID = this.viewBag.DefaultOption.PROGRAM_ID;
        this.defaultSearchParameter.pageTitle = ecount.resource.LBL00338;
        this.finalSearchParam = this.defaultSearchParameter;

        this.registerDependencies(["inventory.guides.api"]);
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    render: function () {

        this._super.render.apply(this);
    },

    initProperties: function () {

        if (this.viewBag.InitDatas.LoadData[0] != null) {
            this.isMoreShow = this.limitCnt <= this.viewBag.InitDatas.LoadData[0].MAXCNT ? true : false;
            if (this.isMoreShow == true) {
                this.viewBag.InitDatas.LoadData.splice(this.viewBag.InitDatas.LoadData[0].MAXCNT, 1);
                this.viewBag.InitDatas.LoadData[0]["MAXCNT"] = this.limitCnt - 1;
            }
        }

        /*this.finalSearchParam = this.defaultSearchParameter,  */                          // 검색 시 정보
        this.errDataAllKey = new Array();                                // 선택삭제 안된 리스트
        this.lan_type = this.viewBag.Language;
        this.userFlag = this.viewBag.InitDatas.USER_FLAG;                   // 사용자 구분
        this.ALL_GROUP_CUST = this.viewBag.InitDatas.ALL_GROUP_CUST;        // 허용거래처그룹 - 0: 전체, 1: 특정그룹
    },


    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
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
                //case "SD":
                //    toolbar.addLeft(ctrl.define("widget.button", "searchDelete").css("btn btn-sm btn-primary").label(ecount.resource.BTN00033));
                //    break;
            }
        }
        else {
            
          //  if (this.isDataManagePath != '1') {
                toolbar
                    .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                    .addLeft(ctrl.define("widget.button", "Search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113))
                    .addLeft(ctrl.define("widget.button", "Rewrite").label(ecount.resource.BTN00007));
           // } else {
           
            //    toolbar
            //        .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            //        .addLeft(ctrl.define("widget.button", "dmDelete").css("btn btn-sm btn-primary").label(ecount.resource.BTN00033));
            //}
        }


        tabContents
            .onSync()
            .setType(this.formSearchControlType)
            .setOptions({ showFormLayer: (["1", "4"].contains(this.isShowSearchForm || "")) ? true : false  /* 검색 창 접기*/ })
            .setSeq(1);

        contents.add(tabContents).add(toolbar);
        if (!this.viewBag.DefaultOption.ManagementType) {
            header.useQuickSearch((["4"].contains(this.isShowSearchForm || "")) ? false : true)
        }

        var option = [];
        if (this.isUseBizNo == true) {
            if (this.viewBag.InitDatas.stateCode == "KR") {
                // 번호오류리스트
                option.push({ id: this.isUseBizNo ? "InvalidCodeList" : "", label: this.isUseBizNo ? ecount.resource.BTN00025 : "" });
            }
            // 전체삭제
            option.push({ id: this.isUseBizNo ? "TotalDelete" : "", label: this.isUseBizNo ? ecount.resource.BTN00427 : "" });
        }
        // 리스트설정
        option.push({ id: "ListSettings", label: ecount.resource.BTN00330 });
        // 검색창설정
        option.push({ id: "SearchTemplate", label: ecount.resource.BTN00169 });
        // 검색항목설정
        option.push({ id: "SearchItemTemplate", label: ecount.resource.BTN00493 });
        // 사용방법설정
        option.push({ id: "SelfCustomizing", label: ecount.resource.LBL01457 });

        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 

            header.setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
            .notUsedBookmark()
            //.useQuickSearch(false)
                .addContents(contents);
            
        }

        /*else if (this.isDataManagePath == '1') {

            header.setTitle(ecount.resource.LBL00338)
                .addContents(contents);
        } */
        else {
            header.setTitle(ecount.resource.LBL00338)
            .add("search", null, false)
            .add("option", option, false)
            .addContents(contents);
        }

        
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var g = widget.generator,
            grid = g.grid();

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            if (!(["4"].contains(this.isShowSearchForm || ""))) { //4:자료올리기시 사용함.        
                grid
                    .setRowData(this.viewBag.InitDatas.LoadData);
            };
        }

        grid
            .setRowDataUrl('/Svc/Account/Basic/GetListCust')
            .setRowDataParameter(this.finalSearchParamConvertReqeusts.bind(this))
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(['BUSINESS_NO'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(self.ecount.resource.MSG02158, maxcount)) })
            .setPagingUse(true)
            .setColumnSortExecuting(this.setGridSort.bind(this))
            .setColumnSortDisableList(['cust.cancel', 'cust.com_code', 'cust.remarks', 'mem.remarks', 'cust.file', 'cust.detail', 'ADD1', 'ADD2', 'ADD3', 'ADD4', 'ADD5'])

            // Shaded
            .setEventShadedColumnId(['cust.business_no'], { isAllRememberShaded: true })
            .setCustomRowCell('cust.file', this.setGridFile.bind(this))                 // 파일관리
            .setCustomRowCell('cust.remarks', this.setGridRemarks.bind(this))           // 적요
            .setCustomRowCell('cust.detail', this.setGridDetail.bind(this))             // 상세내역
            .setCustomRowCell('cust.com_code', this.setGridComCode.bind(this))          // 통장등록
            .setCustomRowCell('cust.business_no', this.setGridBusinessNo.bind(this))   // 거래처코드//Add link to gird
            .setCustomRowCell('cust.cust_name', this.setGridBusinessNo.bind(this))   // 거래처코드//Add link to gird
            .setCustomRowCell('cust.manage_bond_no', this.setGridResource.bind(this))   // 채권번호관리
            .setCustomRowCell('cust.manage_debit_no', this.setGridResource.bind(this))   // 채무번호관리
            .setEventShadedColumnId(['cust.file', 'cust.detail', 'cust.com_code', 'cust.business_no'], false);

        if (this.MariaDb == 'Y') {
            grid
                .setCustomRowCell('cust.outorder_yn', this.setGridforeign_flag.bind(this))
                .setCustomRowCell('cust_gubun.gubun_des', this.setGridGubunDes.bind(this))  // 업종별구분
                .setCustomRowCell('CUST.G_GUBUN', this.setGridGGubun.bind(this))
                .setCustomRowCell('cust.g_business_type', this.setGridbusiness_type.bind(this))
                .setCustomRowCell('cust.foreign_flag', this.setGridforeign_flag.bind(this))
                .setCustomRowCell('cust.coll_mm', this.setGridcoll_mm.bind(this))
                .setCustomRowCell('cust.manage_bond_no', this.setGridmanage_bond_no.bind(this))
                .setCustomRowCell('cust.manage_debit_no', this.setGridmanage_bond_no.bind(this))
                .setCustomRowCell('cust.io_code_sl_base_yn', this.setGridio_code.bind(this))
                .setCustomRowCell('cust.io_code_by_base_yn', this.setGridio_code.bind(this));

        }




        if (this.isMoreShow == false) {
            grid.setColumnSortable(true)
        };

        contents.addGrid("dataGrid", grid);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "relationship").label(ecount.resource.LBL15210));
        toolbar.addLeft(ctrl.define("widget.button", "CustLevelGroup").label(ecount.resource.BTN00265));
        toolbar.addLeft(ctrl.define("widget.button", "changeNew").label(ecount.resource.BTN00026).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: 'yearlyUnusedCodes', label: ecount.resource.LBL08629 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button.group", "Excel").label(ecount.resource.BTN00050)
            .addGroup([{ id: 'BankAccountExcel', label: ecount.resource.BTN00857 }])
            .permission([ecount.config.user.USE_EXCEL_CONVERT, (inventory.guides.api.getNoPermissionDownExcelFileMessage())])
            .css("btn btn-default").end()
        );
        toolbar.addLeft(ctrl.define("widget.button", "webUploader2").label(ecount.resource.BTN00410));

        if (this.isUseSMS == true) {
            toolbar.addLeft(ctrl.define("widget.button", "SMS").label(ecount.resource.BTN00336));
        }

        if (this.limitCnt != 0 && this.isMoreFlag == false) {
            toolbar.addLeft(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00979));
        }

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },

    onInitControl: function (cid, control) {
        var g = widget.generator,
            ctrl = g.control(),
            subCtrl = g.control();

        switch (cid) {
            case "ddlSgGubun":
                //거래처코드구분
                control.label([ecount.resource.LBL02475, ecount.resource.LBL01440, ecount.resource.LBL05017, ecount.resource.LBL04947]).value(['99', '01', '02', '03']).select('99', '01', '02', '03');
                break;
            case "txtBusinessNo":
                //거래처코드

                //control.maxLength([[0, 30], [0, 30]]);
                //control.setDualType(0); /* from~to 검색 사용함*/
                //control.setOptions({
                //    dualStepButtonInfo: [
                //        { id: "baseDate", label: ecount.resource.LBL00381, dualStep: 0, dualControlId: "" }, { id: "Date", label: ecount.resource.LBL13808, dualStep: 1, dualControlId: "" }
                //    ]
                //});

                control.enableCustomDualControl({ useIndividual: false }).enableSerialzeOnVisible().end();
                control.addDualControls(subCtrl.define('widget.multiCode.cust', 'MULTI', 'MULTI', ecount.resource.LBL15056).setDualLabel(ecount.resource.LBL15056).enableSerialzeOnVisible().end());
                control.addDualControls(subCtrl.define('widget.input.between', 'BETWEEN', 'BETWEEN', ecount.resource.LBL13808).setDualLabel(ecount.resource.LBL13808)
                        .enableSerialzeOnVisible().end());

                break;
            case "txtGBusinessNo":
                //세무신고거래처
                control.maxLength(30);
                break;
            case "txtTaxRegId":
                //종사업장번호
                control.maxLength(4);
                break;
            case "txtCustName":
                //상호(이름)
                control.maxLength(50);
                break;
            case "txtBossName":
                //대표자명
                control.maxLength(50);
                break;
            case "txtUpTae":
                //업태
                control.maxLength(30);
                break;
            case "txtJongMok":
                //종목
                control.maxLength(30);
                break;
            case "txtTel":
                //전화
                control.maxLength(50);
                break;
            case "txtFax":
                //FAX
                control.maxLength(50);
                break;
            case "txtEmail":
                //이메일
                control.maxLength(100);
                break;
            case "txtHpNo":
                //모바일
                control.maxLength(50);
                break;
            case "txtAddr":
                //주소1
                control.maxLength(1000);
                break;
            case "txtDmAddr":
                //주소2
                control.maxLength(1000);
                break;
            case "txtRemarksWin":
                //검색창내용
                control.maxLength(50);
                break;
            case "ddlSgubun":
                //업종별구분
                control.label([ecount.resource.LBL02475, ecount.resource.LBL02178, ecount.resource.LBL00622]).value(['99' + ecount.delimiter + '11' + ecount.delimiter + '13', '11', '13']).select('99' + ecount.delimiter + '11' + ecount.delimiter + '13');
                break;
            case "ddlSforeignFlag":
                //외화거래처
                control.label([ecount.resource.LBL02475, ecount.resource.LBL07879, ecount.resource.LBL07880]).value(['9', 'Y', 'N']).select('9', 'Y', 'N');
                break;
            case "txtUrlPath":
                //홈페이지
                control.maxLength(50);
                break;
            case "txtRemarks":
                //적요
                control.maxLength(40);
                break;
            case "txtpaymentDate":
                //수금지급예정일
                control.label(
                    [
                        [{ type: "radio", value: "A", label: ecount.resource.LBL02475, checked: "checked" }]
                        , [{ type: "radio", value: "B", label: ecount.resource.LBL08396 }]
                        , [{ type: "radio", value: "D", label: "" }, { type: "select", value: "365" }, { type: "label", value: ecount.resource.LBL09847.replace("{0}", "") }]
                        , [{ type: "radio", value: "M", label: "" }, { type: "select", value: "12" }, { type: "label", value: ecount.resource.LBL09848.replace("{0}", "") }, { type: "select", value: "lastday" }, { type: "label", value: ecount.resource.LBL06491 }]
                        , [{ type: "radio", value: "W", label: "" }, { type: "select", value: "52" }, { type: 'label', value: this.lan_type.toLowerCase() == "vi-vn" ? ecount.resource.LBL09849.replace('{0}', '') + " " + ecount.resource.LBL01992 : ecount.resource.LBL09849.replace('{0}', '') }, { type: "select", value: "weekly" }, { type: 'label', value: this.lan_type.toLowerCase() == "en-us" || this.lan_type.toLowerCase() == "vi-vn" ? "" : ecount.resource.LBL01992 }]
                        , [{ type: "radio", value: "N", label: ecount.resource.LBL03589 }]
                    ]
                );
                break;
            case "txtCustLimit":
                //여신한도
                control.numericOnly(18, 2, ecount.resource.MSG04553);
                break;
            case "txtCont1":
            case "txtCont2":
            case "txtCont3":
            case "txtCont4":
            case "txtCont5":
            case "txtCont6":
                //문자형 추가항목
                control.maxLength(100);
                break;
            case "txtNoCustUser1":
                //숫자형 추가항목1
                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_CUST_USER1_F", "NO_CUST_USER1_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and1").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_CUST_USER1_T", "NO_CUST_USER1_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "txtNoCustUser2":
                //숫자형 추가항목2
                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_CUST_USER2_F", "NO_CUST_USER2_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and2").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_CUST_USER2_T", "NO_CUST_USER2_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "txtNoCustUser3":
                //숫자형 추가항목3
                control.inline()
                    .addControl(ctrl.define("widget.input", "NO_CUST_USER3_F", "NO_CUST_USER3_F").numericOnly(18, 6, ecount.resource.MSG04553))
                    .addControl(ctrl.define("widget.label", "and3").label("~"))
                    .addControl(ctrl.define("widget.input", "NO_CUST_USER3_T", "NO_CUST_USER3_T").numericOnly(18, 6, ecount.resource.MSG04553));
                break;
            case "ddlSOutorderYn":
                //출하대상거래처
                control.label([ecount.resource.LBL02475, ecount.resource.LBL04417, ecount.resource.LBL07880]).value(['9∬Y∬N', 'Y', 'N']).select('9∬Y∬N');
                break;
            case "txtCustLimitTerm":
                //여신기간
                var option = [];
                option.push(["999", ecount.resource.LBL02475]);
                for (var i = 0; i < 366; i++) {
                    option.push([i.toString(), i.toString()]);
                }

                control.inline()
                    .addControl(ctrl.define("widget.select", "CUST_LIMIT_TERM", "CUST_LIMIT_TERM").option(option))
                    .addControl(ctrl.define("widget.label", "Ago").label(ecount.resource.LBL07703));
                break;
            case "ddlSioCodeSlBaseYn":
                //거래유형(영업)
                control.columns(7, 5);
                control.addControl(ctrl.define("widget.checkbox.whole", "IO_CODE_SL_BASE_YN", "IO_CODE_SL_BASE_YN").label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL05716]).value(['9', 'Y', 'N']).select('9', 'Y', 'N'));
                control.addControl(ctrl.define("widget.select.ioType.sale", "IO_CODE_SL", "IO_CODE_SL").defaultOptions({ isAdd: false, useYn: 'Y', editFlag: 'I', ioValue: '' }));
                break;
            case "ddlSioCodeByBaseYn":
                //거래유형(구매)
                control.columns(7, 5);
                control.addControl(ctrl.define("widget.checkbox.whole", "IO_CODE_BY_BASE_YN", "IO_CODE_BY_BASE_YN").label([ecount.resource.LBL02475, ecount.resource.LBL08396, ecount.resource.LBL05716]).value(['9', 'Y', 'N']).select('9', 'Y', 'N'));
                control.addControl(ctrl.define("widget.select.ioType.purchase", "IO_CODE_BY", "IO_CODE_BY").defaultOptions({ isAdd: false, useYn: 'Y', editFlag: 'I', ioValue: '' }));
                break;
            case "ddlScanCel":
                //사용구분
                control.label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value(['N∬Y', 'N', 'Y']).select('N');
                break;
            case "txtCustPageGroup2":
                control.setOptions({ subID: cid })
                break;
            case "EtcVal": /*customize*/
                control.addControl(ctrl.define("widget.checkbox", "EtcVal", "BASE_DATE_CHK").label([ecount.resource.LBL10548]));
                break;
            case 'MANAGE_BOND_NO':
            case 'MANAGE_DEBIT_NO':
                //채권/채무번호관리
                var option = [];

                option.push(['', ecount.resource.LBL02475]);
                option.push(['B', ecount.resource.LBL80322]);
                option.push(['M', ecount.resource.LBL09077]);
                option.push(['Y', ecount.resource.LBL08831]);
                option.push(['N', ecount.resource.LBL01450]);

                control.option(option);
                break;
        }
    },

    onInitControl_Submit: function (cid, control) {

        function numericOnly(obj, totLen, decimalLen, msg) {
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
            case "txtBusinessNo":
                //거래처코드
                control.maxLength(30);
                break;
            case "txtGBusinessNo":
                //세무신고거래처
                control.maxLength(30);
                break;
            case "txtTaxRegId":
                //종사업장번호
                control.maxLength(4);
                break;
            case "txtCustName":
                //상호(이름)
                control.maxLength(50);
                break;
            case "txtBossName":
                //대표자명
                control.maxLength(50);
                break;
            case "txtUpTae":
                //업태
                control.maxLength(30);
                break;
            case "txtJongMok":
                //종목
                control.maxLength(30);
                break;
            case "txtTel":
                //전화
                control.maxLength(50);
                break;
            case "txtFax":
                //FAX
                control.maxLength(50);
                break;
            case "txtEmail":
                //이메일
                control.maxLength(100);
                break;
            case "txtHpNo":
                //모바일
                control.maxLength(50);
                break;
            case "txtAddr":
                //주소1
                control.maxLength(1000);
                break;
            case "txtDmAddr":
                //주소2
                control.maxLength(1000);
                break;
            case "txtRemarksWin":
                //검색창내용
                control.maxLength(50);
                break;
            case "txtUrlPath":
                //홈페이지
                control.maxLength(50);
                break;
            case "txtRemarks":
                //적요
                control.maxLength(40);
                break;
            case "txtCustLimit":
                //여신한도
                control.numericOnly(18, 2, ecount.resource.MSG04553);
                break;
            case "txtCont1":
            case "txtCont2":
            case "txtCont3":
            case "txtCont4":
            case "txtCont5":
            case "txtCont6":
                //문자형 추가항목
                control.maxLength(100);
                break;
            case "txtNoCustUser1":
            case "txtNoCustUser2":
            case "txtNoCustUser3":
                //숫자형 추가항목1/숫자형 추가항목2/숫자형 추가항목3
                var option = control.getControlOption(0);
                var option2 = control.getControlOption(2);
                numericOnly(option, 18, 6, ecount.resource.MSG04553);
                numericOnly(option2, 18, 6, ecount.resource.MSG04553);
                control.inline();
                break;
            case "ddlSioCodeSlBaseYn":
            case "ddlSioCodeByBaseYn":
                //거래유형(영업)/거래유형(구매)
                var option = control.getControlOption(1);
                option._defaultOptions = { isAdd: false, useYn: 'Y', editFlag: 'I', ioValue: '' };
                control.columns(7, 5);
                break;
            case "txtCustLimitTerm":
                control.inline();
                break;
        }
    },

    //컨트롤 변경시
    onChangeControl: function (control, data) {
        var controlName
        var controlNameBasic;
        var controlNameCust;
        var selControlName = control.__self.pcid;	//ddlSioCodeSlBaseYn : 영업, ddlSioCodeByBaseYn : 구매

        if (selControlName == "ddlSioCodeSlBaseYn" || selControlName == "ddlSioCodeByBaseYn") {
            controlName = this.header.getControl(selControlName);
            controlNameBasic = this.header.getControl(selControlName, "BASIC");
            controlNameCust = this.header.getControl(selControlName, "CUST");

            if (controlName.get(0).getValue(2) == true) {
                if (controlNameBasic != undefined)
                    controlNameBasic.get(1).show();
                if (controlNameCust != undefined)
                    controlNameCust.get(1).show();
            } else {
                if (controlNameBasic != undefined)
                    controlNameBasic.get(1).hide();
                if (controlNameCust != undefined)
                    controlNameCust.get(1).hide();
            }
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //팝업띄울경우
    onPopupHandler: function (control, param, handler) {
        if (control.id == "txtEmpCd") {
            //담당자
            param.isNewDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
            param.isApplyDisplayFlag = true;
            param.checkMaxCount = 100;
        } else if (control.id == "txtCustPageGroup1") {
            //그룹코드1
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
            param.titlename = control.subTitle;
            param.custGroupCodeClass = "A11";
            param.isApplyDisplayFlag = true;
            param.checkMaxCount = 100;
        } else if (control.id == "txtCustPageGroup2") {
            //그룹코드2
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
            param.titlename = control.subTitle;
            param.custGroupCodeClass = "A12";
            param.isApplyDisplayFlag = true;
            param.checkMaxCount = 100;
        } else if (control.id == "txtSMainCd") {
            //채권관리코드
            param.isNewDisplayFlag = false;
            param.isApplyDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
            param.checkMaxCount = 100;
        } else if (control.id == "txtPriceGroup" || control.id == "txtPriceGroup2") {
            //영업단가그룹/구매단가그룹
            param.isApplyDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
            param.titlename = control.subTitle;
            param.popupType = false;
            param.checkMaxCount = 100;
        }

        else if (control.id == "txtBusinessNo_MULTI") {
            //거래처코드(다중)
            param.isApplyDisplayFlag = true;
            param.FilterCustGubun = "108";
        }

        handler(param);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        if (control.cid === "txtBusinessNo_MULTI") {
            parameter.CALL_TYPE = "108";
        }

        handler(parameter);
    },

    //팝업창에서 부모에게 넘겨준값 컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (page, message) {
        if (message == 'DeleteAll') {
            message.callback && message.callback();
            this.contents.getGrid().draw(this.finalSearchParamConvertReqeusts());
        }
        else if (page.pageID == "SummaryChkAcct") {
            this.viewBag.WidgetDatas["widget.configAccount"].config["AcctDate"] = message.acct_date;
            this.moveYearlyUnusedCodes();
        }
        else {
            message.callback && message.callback();
            switch (page.pageID) {
                case "ESA002M":
                case "NoticeNonDeletable":
                case "CM021P":
                case "EMV002P_02":
                    if (["ESA002M"].contains(page.pageID))
                        this._ON_REDRAW();
                    else
                        this.contents.getGrid().draw(this.finalSearchParamConvertReqeusts());
                    break;
                case "CM100P_02":
                case "EGM024M":
                case "CM100P_24":
                    this.reloadPage();
                    break;
            };
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);

        if (this._userParam) {    // 다른 페이지 이동 후 돌아올때(When you come back after moving to another page)
            if (this._userParam.C_param.PARAM != "") {
                this.defaultSearchParameter.PARAM = this._userParam.C_param.PARAM;
            }
        }

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 3197
    },

    onGridAfterRowDataLoad: function (e, data, grid) {
        if (data.result.Data.length > 0 && data.result && data.result.Data) {

            this.isMoreShow = this.limitCnt <= data.result.Data[0].MAXCNT ? true : false;
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

        btnList.push(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).end());
        btnList.push(ctrl.define("widget.button", "relationship").label(ecount.resource.LBL15210).end());
        btnList.push(ctrl.define("widget.button", "CustLevelGroup").label(ecount.resource.BTN00265).end());
        btnList.push(ctrl.define("widget.button", "changeNew").label(ecount.resource.BTN00026).clickOnce().end());
        btnList.push(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: 'yearlyUnusedCodes', label: ecount.resource.LBL08629 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up")
            .end());
        btnList.push(ctrl.define("widget.button.group", "Excel").label(ecount.resource.BTN00050)
            .addGroup([{ id: 'BankAccountExcel', label: ecount.resource.BTN00857 }])
            .permission([ecount.config.user.USE_EXCEL_CONVERT, (inventory.guides.api.getNoPermissionDownExcelFileMessage())])
            .css("btn btn-default").end()
        );
        btnList.push(ctrl.define("widget.button", "webUploader2").label(ecount.resource.BTN00410).end());

        if (this.isUseSMS == true) {
            btnList.push(ctrl.define("widget.button", "SMS").label(ecount.resource.BTN00336).end());
        }
        if (this.limitCnt != 0 && this.isMoreFlag == false && this.isMoreShow == true) {
            btnList.push(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00979).end());
        }

        toolbar.addLeft(btnList);
    },

    //generateButton: function () {

    //},


    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);

        // 선택삭제 후 삭제되지 않은 거래처리스트 체크박스 넣어주기
        if (this.errDataAllKey.length > 0) {
            this.contents.getGrid("dataGrid").grid.addChecked(this.errDataAllKey);
        }

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            this.header.getQuickSearchControl().setValue(this.finalSearchParam.PARAM);
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
            self.header.getQuickSearchControl().setValue(self.finalSearchParam.PARAM);
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);

            //self.contents.getGrid("dataGrid").grid.render();
            self.contents.getGrid("dataGrid").draw(self.finalSearchParamConvertReqeusts());
        });



    },

    //정렬 (Sort)
    setGridSort: function (e, data) {
        this.header.toggle(true);

        this.finalSearchParam.SORTCOL_INDEX = Number(data.propertyName.replace("A", "")) + 1;
        // 컬럼 숫자만 리턴(Only returns the column number)
        this.finalSearchParam.SORT_COLUMN = data.columnId;
        this.finalSearchParam.SORT_TYPE = (this.finalSearchParam.SORT_TYPE == data.sortOrder) ? 'A' : data.sortOrder ;
        
        if (this.finalSearchParam.BASE_DATE_CHK)
            this.finalSearchParam.BASE_DATE_CHK = false;
        this.contents.getGrid().draw(this.finalSearchParamConvertReqeusts());
    },

    //파일(file)
    setGridFile: function (value, rowItem) {
        var option = [];
        var self = this;
        option.data = ecount.resource.BTN00081;
        option.controlType = "widget.link";
        if (!$.isEmpty(rowItem.CUST_FILE_CNT) && rowItem.CUST_FILE_CNT > 0) {
            option.attrs = {
                'class': ['text-warning-inverse']
            };
        }

        option.event = {
            'click': function (e, data) {
                // var locationAllow = ecount.infra.getGroupwarePermissionByAlert(self.viewBag.InitDatas.GroupwarePermission)
                //     .Excute();
                // if (locationAllow) {
                if ($.isEmpty(data.rowItem["CUST_IDX"])) {
                    ecount.alert(ecount.resource.MSG09786);
                    return false;
                }
                var param = {
                    width: 780,
                    height: 600,
                    BOARD_CD: 7001,
                    custCdAllInOne: data.rowItem["CUST_IDX"],
                    custDesAllInOne: data.rowItem["CUST_DES"],
                    TITLE: "[" + data.rowItem["BUSINESS_NO"].replace("\"", "＂") + "] " + data.rowItem["CUST_NAME"],
                    isFileManage: true
                };

                this.openWindow({
                    // url: "/ECMAIN/ESA/ESA009P_04.aspx?b_type=A01&code=" + data.rowItem["BUSINESS_NO"].replace("\"", "＂") + "&code_des=" + encodeURIComponent(data.rowItem["CUST_NAME"]),
                    url: "/ECERP/EGM/EGM024M",
                    name: ecount.resource.LBL07553,
                    param: param,
                    popupType: false,
                    fpopupID: self.ecPageID
                });
                //  }
            }.bind(this)
        }

        return option;
    },

    //적요
    setGridRemarks: function (rowItem) {
        rowItem.replace('\n', '<br>');
    },

    //상세내역
    setGridDetail: function (rowItem) {
        var option = [];
        var self = this;
        option.data = ecount.resource.BTN00315;
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                if (self.viewBag.Permission.cust_All.Value.equals("W")) {
                    var param = {
                        width: 800,
                        height: 600,
                        cust: data.rowItem["BUSINESS_NO"],
                        //CustEditType: "ALL_IN_ONE_SEARCH"
                    };
                    this.openWindow({
                        url: "/ECERP/ESQ/ESQ501M",
                        name: ecount.resource.LBL93617,
                        param: param,
                        popupType: false,
                        additional: false,
                        fpopupID: self.ecPageID
                    });

                } else {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL35334, PermissionMode: "X" }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    return;
                }
            }.bind(this)
        }

        return option;
    },

    //통장등록
    setGridComCode: function (value, rowItem) {
        var option = [];

        option.data = ecount.resource.BTN00644;
        option.controlType = "widget.link";

        if (rowItem.TONGJANG_CNT > 0) {
            option.attrs = {
                'class': ['text-warning-inverse']
            };
        }

        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 800,
                    height: 450,
                    custNo: data.rowItem['BUSINESS_NO']
                };

                this.openWindow({
                    url: '/ECERP/ESA/ESA001P_05',
                    name: 'ESA001P_05',
                    param: param,
                    popupType: false,
                    additional: true
                });
            }.bind(this)
        }

        return option;
    },

    setGridBusinessNo: function (e) {
        var option = [];

        option.data = e.BUSINESS_NO;
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                this.OpenCustRegisterPopup(data.rawRowItem.BUSINESS_NO);
            }.bind(this)
        }

        return option;
    },

    // 리소스 리턴
    setGridResource: function (rowItem) {
        var option = {};
        option.data = ecount.resource[rowItem];

        return option;
    },

    onFocusOutHandler: function () {
        var ctrl = this.header.getControl("Search");
        ctrl && ctrl.setFocus(0);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //검색
    onHeaderSearch: function (forceHide) {
        if (this._userParam) {
            if (this._userParam.C_param.PARAM != "") {
                if (!this.viewBag.DefaultOption.ManagementType) {
                    this.header.getQuickSearchControl().setValue(this._userParam.C_param.PARAM);
                }

                this.finalSearchParam = this._userParam.C_param;
            }
        } else {
            this.finalSearchParam.PARAM = "";
        }

        this.isMoreFlag = false;
        this.finalSearchParam.LIMIT_COUNT = 5001;
        if (this.dataSearch()) {
            if (!this._userParam) this.header.toggle(forceHide);
        }

        this.contents.getGrid().grid.clearChecked();
    },

    onHeaderDmDelete: function () {
        this.dataSearch();
    },


    //다시작성 
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },

    // quick Search button click event
    onHeaderQuickSearch: function (e) {
        var grid = this.contents.getGrid("dataGrid");
        this.isMoreFlag = false;
        this.finalSearchParam.LIMIT_COUNT = 5001;
        this.cDateNo = "";
        this.header.lastReset(this.finalHeaderSearch);
        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().grid.removeShadedColumn();
        this.contents.getGrid().grid.clearChecked();
        grid.getSettings().setPagingCurrentPage(1); //Paging Page 1
        grid.draw(this.finalSearchParamConvertReqeusts());
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();

        // 페이징 파라미터 세팅
        _self.finalSearchParam.PAGE_SIZE = 10000;
        _self.finalSearchParam.PAGE_CURRENT = 1;
        _self.finalSearchParam.LIMIT_COUNT = 100000;
        _self.finalSearchParam.EXCEL_FLAG = "Y";
        _self.finalSearchParam.IS_FROM_BACKUP = true;

        _self.dataSearch();

        for (var i = 0; i < 4; i++) {
            var invalid;
            switch (i) {
                case 0:
                    invalid = this.header.validate("BASIC");
                    break;
                case 1:
                    invalid = this.header.validate("CUST");
                    break;
                case 2:
                    invalid = this.header.validate("PRICE");
                    break;
                case 3:
                    invalid = this.header.validate("CONT");
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

    // 데이터관리 > 조건 삭제
    onHeaderSearchDelete: function (e) {

    },

    onHeaderClose: function (e) {
        this.close();
        return false;
    },
    //더보기 버튼 클릭
    onFooterMoreData: function (e) {
        // SP에서 LIMIT_COUNT가 0이면 모두 조회로 처리
        this.finalSearchParam.LIMIT_COUNT = 0;
        // 버튼클릭여부
        this.isMoreFlag = true;
        // 다시 그리기
        this.contents.getGrid().draw(this.finalSearchParamConvertReqeusts());

    },

    //SMS
    onFooterSMS: function (e) {
        var sendParameter = new Array();
        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        $.each(selectItem, function (i, data) {
            sendParameter.push(data.BUSINESS_NO);
        });

        var param = {
            width: 800,
            height: 600,
            smsType: "C",
            sendParameter: sendParameter
        }

        this.openWindow({
            url: "/ECERP/ESA/ESA025M",
            name: ecount.resource.LBL00361,
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    // 번호오류리스트
    onDropdownInvalidCodeList: function (e) {
        if (this.viewBag.Permission.cust.Value.equals("W") || this.viewBag.Permission.cust.Value.equals("U") || this.viewBag.Permission.cust.Value.equals("R")) {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 600,
                strFlag: "cust"
            };

            this.openWindow({
                url: '/ECERP/ESA/ESA001P_10',
                name: ecount.resource.BTN00025,
                popupType: false,
                additional: false,
                param: param
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "X" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    //전체삭제
    onDropdownTotalDelete: function (e) {
        if ((this.viewBag.Permission.cust.Value.equals("W")) && this.viewBag.isGuest == "false") {
            var popupParam = {
                width: 480,
                height: 250,
                isSendMsgAfterDelete: true,
                TABLES: 'CUST',
                DEL_TYPE: 'Y',
                DELFLAG: 'Y',
                DeleteCodesDtos: Object.toJSON(this.finalSearchParam)
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/CM021P',
                name: ecount.resource.LBL00043,
                param: popupParam,
                additional: true
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    //검색창설정
    onDropdownSearchTemplate: function (e) {
        if (["W", "U"].contains(this.viewBag.Permission.cust.Value)) {
            var param = {
                width: 1020,
                height: 800,
                FORM_TYPE: "SP910",
                FORM_SEQ: 1
            };

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.BTN00169,
                param: param
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },


    //검색항목 설정 팝업(Search Settings pop-up window)
    onDropdownSearchItemTemplate: function (e) {
        var param = {
            width: 400,
            height: 460,
            FORM_TYPE: this.formSearchControlType,
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


    //리스트 설정 팝업(Form Settings pop-up)
    onDropdownListSettings: function (e) {
        if (["W", "U"].contains(this.viewBag.Permission.cust.Value)) {
            var param = {
                width: 800,
                height: 700,
                FORM_TYPE: this.formTypeCode,
                FORM_SEQ: 1,
                isSaveAfterClose: true
            };

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: 'CM100P_02',
                param: param,
                popupType: false,
                fpopupID: this.ecPageID
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
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

    //New
    onFooterNew: function (e) {// 권한 체크
        if (!this.viewBag.Permission.cust.Value.equals("W") && !this.viewBag.Permission.cust.Value.equals("U")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
        this.OpenCustRegisterPopup();
    },

    // 거래처 관계 설정
    onFooterRelationship: function (e) {
        if (this.userFlag != "M" && this.ALL_GROUP_CUST == "1") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        var param = { width: 1000, height: 900 };
        this.openWindow({
            url: "/ECERP/SVC/ESA/ESA001P_16",
            name: "거래처관계리스트",
            param: param, popupType: false
        });
    },

    //계층그룹(CustLevelGroup)
    onFooterCustLevelGroup: function (e) {
        if (this.userFlag != "M" && this.ALL_GROUP_CUST == "1") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        // 권한 체크
        if (this.viewBag.Permission.cust_tree.Value.equals("X")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07244, PermissionMode: "X" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        } else {
            var params = {
                width: this.viewBag.InitDatas.TableWidthCust + 225,
                height: 570,
                Type: "CREATE"
            };

            // Open popup
            this.openWindow({
                url: '/ECERP/ESA/ESA065M',
                name: ecount.resource.LBL07244,
                param: params
            });
        }
    },

    // 변경(Change) button click event
    onFooterChangeNew: function (e) {
        var btn = this.footer.get(0).getControl("changeNew");
        var grid = this.contents.getGrid().grid;
        var CHANGE_CODE_LIST = [];

        if (!['W'].contains(this.viewBag.Permission.cust.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03828, PermissionMode: "U" }]);
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
            CHANGE_CODE_LIST.push(item['BUSINESS_NO']);
        });

        if (CHANGE_CODE_LIST == '') {
            ecount.alert(ecount.resource.MSG04752);
            btn.setAllowClick();
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 600,
            FormType: "SI912",
            FormSeq: 1,
            KeyList: CHANGE_CODE_LIST,
            fpopupID: this.ecPageID // 추가
        };

        this.openWindow({
            url: "/ECERP/ESA/ESA001P_14",
            name: 'ESA001P_14',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID // 추가
        });

        btn.setAllowClick();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        this.BusinessNoList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (!this.viewBag.Permission.cust.Value.equals("W")) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.BusinessNoList += data.BUSINESS_NO + ecount.delimiter;
            });

            if (self.BusinessNoList.lastIndexOf(ecount.delimiter) == (self.BusinessNoList.length - 1))
                self.BusinessNoList = self.BusinessNoList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }

            //삭제함수
            self.callDeleteListApi(self.BusinessNoList, selectItem);
        });
    },

    // 연간미사용코드(Yearly Unused Codes) button click event
    onButtonYearlyUnusedCodes: function (e) {
        var _self = this;
        var _nowDate = new Date();
        var _firstDayOfMonth = new Date(_nowDate.getFullYear(), _nowDate.getMonth(), 1);
        var _btnSelectedDelete = _self.footer.getControl("deleteRestore");
        var _chkSummary = {
            MenuType: "A" // 회계(A), 재고(S), 미청구(P)
        }

        if (!this.viewBag.Permission.cust.Value.equals("W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        if (this.viewBag.InitDatas.PreDate.substring(0, 6).toString() > _self.viewBag.WidgetDatas["widget.configAccount"].config["AcctDate"].substring(0, 6).toString()) {
            ecount.common.api({
                url: "/Common/Infra/CheckSummary",
                data: Object.toJSON(_chkSummary),
                success: function (result) {
                    if (result.Data.RESULT_YN == "N") {
                        ecount.customAlert(String.format(ecount.resource.MSG06899, result.Data.SUMMARY_MINUTE, result.Data.SUMMARY_DATE),
                            {
                                list: [
                                    {
                                        label: ecount.resource.LBL06464,
                                        callback: _self.moveYearlyUnusedCodes.bind(_self)
                                    },
                                    {
                                        label: ecount.resource.BTN00008,
                                        callback: function () {
                                        }.bind(_self)
                                    }
                                ]
                            });
                    } else {
                        var options = {
                            url: "/ECERP/ECM/SummaryChkAcct",
                            name: ecount.resource.LBL02495,
                            param: {
                                Base_Form_Date: _self.viewBag.InitDatas.PPreDate,
                                Base_To_Date: _self.viewBag.InitDatas.PPreDate,
                                FlagFormID: "",
                                Summary_Flag: "A",
                                EnableCheckMonthsAgo: 0,
                                Inventory_Flag: "0",
                                Account_Flag: "1",
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
    onFooterWebUploader2: function (e) {
        if (!this.viewBag.Permission.cust.Value.equals("W") && !this.viewBag.Permission.cust.Value.equals("U")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        this.openWindow({
            url: '/ECERP/Popup.Common/BulkUploadForm', //'/ECERP/Popup.Common/EZS001M',
            name: ecount.resource.LBL02339,
            additional: true,
            popupType: false,
            param: {
                width: 1000,
                height: 640,
                FormType: 'SI912', //SI912
                IsGetBasicTab: true
            }
        });
    },

    //액셀
    onFooterExcel: function (e) {
        if (!this.viewBag.Permission.cust.Value.equals("X")) {
            var excelSearch = this.finalSearchParam;
            excelSearch.EXCEL_FLAG = "Y";
            this.EXPORT_EXCEL({
                url: "/Account/Basic/ExcelCust",
                param: excelSearch
            });
            excelSearch.EXCEL_FLAG = "N";
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "X" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    //액셀(통장)
    onButtonBankAccountExcel: function (e) {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            ecount.alert(inventory.guides.api.getNoPermissionDownExcelFileMessage());
            return;
        }

        if (!this.viewBag.Permission.cust.Value.equals("X") && this.isUseExcelConvert == true) {
            var excelSearch = this.finalSearchParam;
            excelSearch.EXCEL_FLAG = "Y";
            excelSearch.columns = [
                { index: 0, propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL00381 },
                { index: 1, propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL00359 },
                { index: 2, propertyName: 'CUST_DES', id: 'CUST_DES', title: ecount.resource.LBL02092 },
                { index: 3, propertyName: 'TONGJANG_NUM', id: 'TONGJANG_NUM', title: ecount.resource.LBL00501 },
                { index: 4, propertyName: 'ACCT_NAME', id: 'ACCT_NAME', title: ecount.resource.LBL06161 },
                { index: 5, propertyName: 'ETC', id: 'ETC', title: ecount.resource.LBL01418 + "1" },
                { index: 6, propertyName: 'CMSCODE', id: 'CMSCODE', title: ecount.resource.LBL01418 + "2" }
            ];

            ecount.document.exportExcel("/Account/Basic/ExcelCustByBankAccount", excelSearch);
            excelSearch.EXCEL_FLAG = "N";
        } else {
            if (this.isUseExcelConvert != true) {
                ecount.alert(ecount.resource.MSG00141);
            } else {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "X" }]);
                ecount.alert(msgdto.fullErrorMsg);
            }
            return;
        }
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    ON_KEY_F8: function () {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onHeaderSearch();
        }
    },

    ON_KEY_F2: function () {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onFooterNew();
        }
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (target != null && target.cid == "Search" && !this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch();
        }
    },

    /**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/
    reloadPage: function () {

        var url = "/ECERP/ESA/ESA001M";
        //reset sort to default when reload page (Dev. Progress 5546)
        this.finalSearchParam.SORT_COLUMN = this.defaultSearchParameter.SORT_COLUMN;
        this.finalSearchParam.SORT_TYPE = this.defaultSearchParameter.SORT_TYPE;
        this.onAllSubmit({
            url: url,
            formdata: this.finalHeaderSearch,
            param: {
                CustListSearch: this.finalSearchParam,
                PAGE_SIZE: this.finalSearchParam.PAGE_SIZE,
                SORT_COLUMN: this.finalSearchParam.SORT_COLUMN,
                SORT_TYPE: this.finalSearchParam.SORT_TYPE,
                LIMIT_COUNT: this.finalSearchParam.LIMIT_COUNT
            }
        });
    },

    dataSearch: function (e) {
        for (var i = 0; i < 4; i++) {
            var invalid;
            switch (i) {
                case 0:
                    invalid = this.header.validate("BASIC");
                    break;
                case 1:
                    invalid = this.header.validate("CUST");
                    break;
                case 2:
                    invalid = this.header.validate("PRICE");
                    break;
                case 3:
                    invalid = this.header.validate("CONT");
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
            if (!this.viewBag.DefaultOption.ManagementType) {
                gridObj.draw(this.finalSearchParamConvertReqeusts());
            }
            this.hideProgressbar();

        } else {

            var _self = this;
            _self.showProgressbar(true);

            
            // ====================================
            // 웹자료올리기 > 거래처등록자료변경 > 엑셀서식내려받기> 등록자료포함 일때 타는 부분
            // 데이터 관리.
            // =======================================

           // debugger;
           // if (this.isDataManagePath != '1') {
               
                this.header.toggle(true);
                this.setGridParameter(settings);
                this.finalSearchParam.EXCEL_FLAG = "Y";
                ecount.common.api({
                    url: "/Svc/Account/Basic/GetListCust",
                    data: this.finalSearchParamConvertReqeusts(),
                    success: function (result) {
                        debugger;
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
            //    ecount.confirm(ecount.resource.MSG09734, function (status) {
            //        if (status === true) {
            //            ecount.common.api({
            //                url: "/SVC/SelfCustomize/DataManagement/DeleteForDataManagement",
            //                data: this.finalSearchParamConvertReqeusts(),
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
            //    }.bind(this));
            //}
        };
    },

    reLoadGrid: function () {

        var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;
        var page = settings.getPagingCurrentPage();
        // search parameter setting
        this.setGridParameter(settings);
        settings.setPagingCurrentPage(page);
        gridObj.draw(this.finalSearchParamConvertReqeusts());
        this.header.toggle(true);
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

            settings && settings.setPagingCurrentPage(1); //Paging Page 1
            searchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize("CUST").result);
            $.extend(searchParam, this.header.serialize("PRICE").result);
            $.extend(searchParam, this.header.serialize("CONT").result);

            searchParam.PARAM = this.finalSearchParam.PARAM;
            searchParam.BASE_DATE_CHK = (searchParam.BASE_DATE_CHK != null && searchParam.BASE_DATE_CHK != undefined && searchParam.BASE_DATE_CHK.length > 0) ? true : false;

            //수금/지급 예정일/////////////////////////////////////////////////////////////////
            if (searchParam.COLL_PAY_TYPE[0] == "D")
                searchParam.COLL_PAY_D = searchParam.COLL_PAY_TYPE[1];
            else if (searchParam.COLL_PAY_TYPE[0] == "M") {
                searchParam.COLL_PAY_M = searchParam.COLL_PAY_TYPE[1];
                searchParam.COLL_PAY_D = searchParam.COLL_PAY_TYPE[2];
            }
            else if (searchParam.COLL_PAY_TYPE[0] == "W") {
                searchParam.COLL_PAY_W = searchParam.COLL_PAY_TYPE[1];
                searchParam.COLL_PAY_DW = searchParam.COLL_PAY_TYPE[2];
            }

            searchParam.COLL_PAY_TYPE = searchParam.COLL_PAY_TYPE[0];
            ////////////////////////////////////////////////////////////////////////////////

            if (searchParam.NO_CUST_USER1_F == "")
                searchParam.NO_CUST_USER1_F = null;

            if (searchParam.NO_CUST_USER1_T == "")
                searchParam.NO_CUST_USER1_T = null;

            if (searchParam.NO_CUST_USER2_F == "")
                searchParam.NO_CUST_USER2_F = null;

            if (searchParam.NO_CUST_USER2_T == "")
                searchParam.NO_CUST_USER2_T = null;

            if (searchParam.NO_CUST_USER3_F == "")
                searchParam.NO_CUST_USER3_F = null;

            if (searchParam.NO_CUST_USER3_T == "")
                searchParam.NO_CUST_USER3_T = null;

            if (searchParam.CUST_LIMIT == "")
                searchParam.CUST_LIMIT = null;

            if (searchParam.CANCEL !== undefined && searchParam.CANCEL.length > 1)
                searchParam.CANCEL = '';

            if (searchParam.CUST_LIMIT_TERM !== undefined && searchParam.CUST_LIMIT_TERM == "999")
                searchParam.CUST_LIMIT_TERM = null;
        }

        //그리드 상단 오른쪽  right of top 
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.header.getQuickSearchControl().setValue(searchParam.PARAM);
        }

        if (!$.isEmpty(settings)) {
            settings
                .setHeaderTopMargin(this.header.height())
                .setRowDataParameter(searchParam);
        }
        // 조회 당시 컨트롤 정보

        this.finalHeaderSearch = this.header.extract(true).merge();

        searchParam.EXCEL_FLAG = "N";
        this.finalSearchParam = searchParam;

        if (this.finalSearchParam.BUSINESS_NO_MULTI) {
            this.finalSearchParam.BUSINESS_NO = "∬" + this.finalSearchParam.BUSINESS_NO_MULTI;
        }

        this.finalSearchParam.BUSINESS_NO_FROM = this.finalSearchParam.BUSINESS_NO_BETWEEN_FROM;
        this.finalSearchParam.BUSINESS_NO_TO = this.finalSearchParam.BUSINESS_NO_BETWEEN_TO;

        this.finalSearchParam.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
    },

    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'].toUpperCase() == "Y")
            return true;
    },

    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btnSelectedDelete = this.footer.get(0).getControl("deleteRestore");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {
            Data: {
                DeleteCodes: {
                    MENU_CODE: "Customer",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                    CHECK_TYPE: "B",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                    DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                    PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
                }
            }
        };

        ecount.common.api({
            url: "/SVC/Account/Basic/CustDeleteList",
            data: Object.toJSON(formdata),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (result.Data != null && result.Data != "") {
                    //삭제불가 코드리스트 팝업창 연결
                    self.ShowNoticeNonDeletable(result.Data);

                    //체크해제
                    for (var idx = 0, limit = selectItem.length; idx < limit; idx++) {
                        self.contents.getGrid().grid.removeChecked(selectItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                    }

                    //그리드 리로드
                    self.contents.getGrid().draw(self.finalSearchParamConvertReqeusts());
                }
                else {

                    //그리드 로우 삭제
                    self.contents.getGrid().grid.removeCheckedRow();
                    self.contents.getGrid().draw(self.finalSearchParamConvertReqeusts());
                }
            },
            complete: function (e) {
                btnSelectedDelete.setAllowClick();
            }
        });
    },

    //파일관리 등록 후 그리드 다시 로드
    fileReload: function () {
        this.contents.getGrid().draw(this.finalSearchParamConvertReqeusts());
    },

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
            height: 300,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "Customer"
        };

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    OpenCustRegisterPopup: function (_businessNo) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 850,
            Cust: _businessNo ? _businessNo : ''

        };

        this.openWindow({
            url: "/ECERP/ESA/ESA002M",
            name: ecount.resource.LBL93466,
            param: param
        });

    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnCustomer(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnCustomer(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };

        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                BASIC_CODE: data.BUSINESS_NO,
                MENU_TYPE: "Customer",
                CANCEL_YN: cancelYN,
                PROD_FLAG: ""
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnCustomer: function (updatedList) {
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (!this.viewBag.Permission.cust.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }

        ecount.common.api({
            url: "/SVC/Common/Infra/UpdateYearlyUnusedCodesDeactivate",
            data: Object.toJSON(
                {
                    Request: {
                        Data: { Data: updatedList.Data }
                    }
                }
            ),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.finalSearchParamConvertReqeusts());
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },

    SetReload: function () {
        this.fileReload();
    },

    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }
        var _gridObject = this.contents.getGrid();
        if (_gridObject) {
            _gridObject.grid.clearChecked();
            _gridObject.draw(this.finalSearchParamConvertReqeusts());
        }
        this.header.getQuickSearchControl().hideError();
    },

    moveYearlyUnusedCodes: function (e) {
        var _self = this;
        var btn = _self.footer.getControl("deleteRestore");
        var param = {
            width: 770,
            height: 600,
            Type: "Customer"
        };

        this.openWindow({
            url: "/ECERP/EMV/EMV002P_03",
            name: ecount.resource.LBL08629,
            param: param,
            fpopupID: this.ecPageID
        });

        btn.setAllowClick();
    },

    onDropdownTxtBusinessNo0: function (e) {
        var businessNoBetweenValue = this.header.getControl("txtBusinessNo_BETWEEN").getValue();
        var isEmpty = false;

        businessNoBetweenValue.forEach(function (v) {
            if (v !== "") {
                isEmpty = true;
            }
        })

        if (isEmpty) {
            this.header.getControl("txtBusinessNo").setValue(0, businessNoBetweenValue, true);
        }

        this.header.getControl("txtBusinessNo").setFocus(0);
    },

    onDropdownTxtBusinessNo1: function (e) {
        this.header.getControl("txtBusinessNo_MULTI").setFocus(0);
    },

    onDropdownTxtBusinessNo2: function (e) {
        var businessNoValue = this.header.getControl("txtBusinessNo").getValue();
        //var isEmpty = false;

        //businessNoValue.forEach(function (v) {
        //    if (v !== "") {
        //        isEmpty = true;
        //    }
        //})

        if (businessNoValue) {
            this.header.getControl("txtBusinessNo_BETWEEN").setValue(0, businessNoValue, true);
        }

        this.header.getControl("txtBusinessNo_BETWEEN").setFocus(0);
    },

    onChangeHeaderTab: function (e) {
        if (this.header.getControl("txtBusinessNo") != undefined)
            this.header.getControl("txtBusinessNo").setFocus(0);
    },

    finalSearchParamConvertReqeusts: function () {
        _self = this;

		if (this.MariaDb == 'Y') {
			_self.finalSearchParam.COM_CODE_BY_KEY = _self.COM_CODE_BY_KEY;
			_self.finalSearchParam.FORM_SEQ_BY_KEY = _self.FORM_SEQ_BY_KEY;
			_self.finalSearchParam.FORM_TYPE_BY_KEY = _self.FORM_TYPE_BY_KEY;

            var result = {
                Request: {
                    Data: _self.finalSearchParam
                }
            };
        }
		else {
			_self.finalHeaderSearch.COM_CODE_BY_KEY = _self.COM_CODE_BY_KEY;
			_self.finalHeaderSearch.FORM_SEQ_BY_KEY = _self.FORM_SEQ_BY_KEY;
			_self.finalHeaderSearch.FORM_TYPE_BY_KEY = _self.FORM_TYPE_BY_KEY;

            result = _self.finalHeaderSearch;
        }
        return result;

    },

    //Grid

    setGridforeign_flag: function (value, rowItem) {
        var option = {};
        if (value == "Y") {
            option.data = ecount.resource.LBL01448;
        }
        else {
            option.data = ecount.resource.LBL01185;
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridGubunDes: function (value, rowItem) {
        var option = {};

        if (value == "11") {
            option.data = ecount.resource.LBL00271;
        }
        else if (value == "12") {
            option.data = ecount.resource.LBL11185;
        }
        else if (value == "13") {
            option.data = ecount.resource.LBL00622;
        }
        else if (value == "14") {
            option.data = ecount.resource.LBL04057;
        }
        else if (value == "15") {
            option.data = ecount.resource.LBL02869;
        }
        else if (value == "19") {
            option.data = ecount.resource.LBL03183;
        }
        else if (value == "20") {
            option.data = ecount.resource.LBL11186;
        }
        else if (value == "21") {
            option.data = ecount.resource.LBL05969;
        }
        else if (value == "30") {
            option.data = ecount.resource.LBL11185;
        }
        else if (value == "90") {
            option.data = ecount.resource.LBL00078;
        }
        else if (value == "91") {
            option.data = ecount.resource.LBL01374;
        }

        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    setGridGGubun: function (value, rowItem) {
        var option = {};

        if ($.isEmpty(rowItem.BUSINESS_NO)) {
            option.data = "";
        }
        else {
            if (value == "01") {
                option.data = "[" + ecount.resource.LBL01440 + "]";
            }
            else if (value == "02") {
                option.data = "[" + ecount.resource.LBL05017 + "]";
            }
            else if (value == "03") {
                option.data = "[" + ecount.resource.LBL04947 + "]";
            }
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    setGridbusiness_type: function (value, rowItem) {
        var option = {};
        if (value == "1") {
            option.data = ecount.resource.LBL05714;
        }
        else if (value == "2") {
            option.data = ecount.resource.LBL05715;
        }
        else if (value == "2") {
            option.data = ecount.resource.LBL05715;
        }
        else if (value == "3") {
            option.data = ecount.resource.LBL05716;
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridforeign_flag: function (value, rowItem) {
        var option = {};
        if (value == "Y") {
            option.data = ecount.resource.LBL01448;
        }
        else {
            option.data = ecount.resource.LBL01185;
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridcoll_mm: function (value, rowItem) {


        var option = {};
        if (value == "B") {
            option.data = ecount.resource.LBL80322;
        }
        else if (value == "D") {
            option.data = String.format(ecount.resource.LBL09847, rowItem.COLL_PAY_D);
        }
        else if (value == "M") {
            option.data = String.format(ecount.resource.LBL09848, rowItem.COLL_PAY_M) + ' ';
            if (rowItem.COLL_PAY_D == "31") {
                option.data += ecount.resource.LBL01084;
            }
            else {
                option.data += rowItem.COLL_PAY_D + ecount.resource.LBL09594;
            }
        }
        else if (value == "W") {
            option.data = String.format(ecount.resource.LBL09849, rowItem.COLL_PAY_W) + ' ';
            if (rowItem.COLL_PAY_DW == 1) {
                option.data += ecount.resource.LBL02203;
            }
            else if (rowItem.COLL_PAY_DW == 2) {
                option.data += ecount.resource.LBL02074;
            }
            else if (rowItem.COLL_PAY_DW == 3) {
                option.data += ecount.resource.LBL03135;
            }
            else if (rowItem.COLL_PAY_DW == 4) {
                option.data += ecount.resource.LBL01713;
            }
            else if (rowItem.COLL_PAY_DW == 5) {
                option.data += ecount.resource.LBL01164;
            }
            else if (rowItem.COLL_PAY_DW == 6) {
                option.data += ecount.resource.LBL00782;
            }
            else if (rowItem.COLL_PAY_DW == 7) {
                option.data += ecount.resource.LBL02891;
            }
            else {
                option.data += '';
            }
        }
        else if (value == "N") {
            option.data = ecount.resource.LBL80270;
        }
        else {
            option.data = '';
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridio_code: function (value, rowItem) {

        var option = {};
        if (value == "N")
            option.data = ecount.resource.LBL05716;
        else
            option.data = ecount.resource.LBL08396;

        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    setGridmanage_bond_no: function (value, rowItem) {
        var option = {};
        if (value == "B")
            option.data = ecount.resource.LBL80322;
        else if (value == "M")
            option.data = ecount.resource.LBL09077;
        else if (value == "Y")
            option.data = ecount.resource.LBL08831;
        else
            option.data = ecount.resource.LBL01450;

        return option;
    },

});
