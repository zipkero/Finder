window.__define_resource && __define_resource("BTN00113","BTN00007","LBL93573","LBL12532","LBL12533","LBL01482","BTN00114","LBL05432","LBL09527","BTN00493","LBL16836","LBL09528","LBL01070","LBL08306","LBL13750","LBL02191","LBL02056","LBL13751","LBL02475","LBL02739","LBL02740","LBL00444","LBL01209","LBL00384","MSG00080","BTN00010","LBL93603","MSG00962","MSG04944","MSG03932","MSG04336","MSG04349","BTN00108","MSG00205","LBL02935","LBL01685","LBL00640","LBL02627","LBL00381","LBL00359","LBL03236","LBL03243","LBL02374","LBL07973");
/****************************************************************************************************
1. Create Date : 2017.03.23
2. Creator     : 강성훈
3. Description : 거래처관리대장1 > 출력물
4. Precaution  : 
5. History     : 2017.11.20(양미진) - 재집계 후 조회 클릭시 오류 수정
                 2018.11.09(PhiTa) - A18_03390_거래처관리대장1 회계전표별 외화잔액 구분값 추가 후속잡
                 2019.01.09 (HoangLinh): A18_04370_1 - Refactoring
                 [2019.03.05][On Minh Thien] A19_00527 (간편검색 공통화 적용)
                 2019.04.16 (tuan) Email, Fax 3.0 (A18_03057_발송Email 리스트 개발방식개선)
                 2019.06.07(신선미) - A19_01943 거래처관리대장1(채권) 메일발송시 무한로딩발생
                 2019.06.13(이현택) - 거래처관계(구 채권관리코드) 관련 로직 수정
                 2019.07.08(최용환) - Dev.26152 거래처관리대장1 - 화면 클릭이 안되는 문제 오류수정
                 2019.07.23 (Tran Minh Tuan) - A19_02365 - 거래처관리대장1(채권) 양식선택한거 한번에 적용 안됨
                 2019.08.12 (Ngoc Han) [A19_02797] add more parameter use to insert into History table when user search Summarize by is By account voucher at dataSearch
                 2019.08.30 (Tran Minh Tuan) [A19_A19_03127] Remove all logic that is applied in job A19_02797
6. Old file    : EBG005M.ASPX
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "EBG005M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    isMoreFlag: false,     //  "천건이상" 버튼 클릭 여부
    baseCount: 1000,        // 1000건 이상 체크 
    listCount: 15,
    maxCount: 10000,        // 10000건 이상인 체크
    searchConditionTitle: '',
    currentTabId: null,
    formTypeCode: this.RPT_GUBUN == "1" ? 'AO010' : this.RPT_GUBUN == "2" ? 'AO011' : 'AO012', //그리드 양식타입(grid form type)
    bodyRowCount: 25,                // Row count for page break (So dong cho 1 trang khi page break)
    defaultSearchParam: null,
    finalSearchParam: null,      // 조회시 search_param
    arrTITLENM: null,
    arrTITLECD: null,
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
    isShowSearchBtn: true,      // 검색버튼 visible flag (search button visible flag)
    isShowOptionBtn: true,      // option visible flag 
    isSlipPopup: null,          // 전표 Popup open 여부 (Slip  popup open flag)
    isLoaded: false,
    isUseExcelConvert: false,    //엑셀변환 권한유무
    rightHtml: '',
    searchDes: null,
    isHaveDefaultTemplate: false,
    saleAutoCodeInfo: null,
    curDate: null,              // 현재날짜 (CURRET DATE)
    searial: 0,
    gridWidth: 750,
    printPageSet: null,
    pdfHtml: null,
    printHtml: null,
    gridwidth_Temp: 750,
    cDateNo: "",                    //  활성화 되었던 전표 정보
    clickedRowId: null,     // clicked rowID
    clickedRowCustId: null,     // clicked rowID
    localsort: false,
    isAdditionalPopup: false,
    alreadyIncludedLayout: true,
    setAutoFocusOnTabPane: false,
    journalFlag: 0,
    journalPageSize: 500,
    strRealGyeDes: '',
    boxTitle_temp: '',
    intPageIndexHeader: 0,
    intPageIndexFooter: 0,

    currentDate: "",
    totalCount: 0,
    currentRptGubun: 1,
    isMultiCust: false,
    strCustGubun: 0,
    businessLineNum: 0,
    custLimitLine: 0,
    cusrrentCustDes: "",
    strGyeDes0: "",
    permissions: null,
    isLoadComplete: false,
    isRunFromCheckbox: false,
    emkName: "",
    custName: "",
    strCustF: "",
    widthBalancePopup: 0,
    heightBalancePopup: 0,
    widthEmail: 0,
    heightEmail: 0,
    widthFax: 0,
    heightFax: 0,
    dateValue: "",
    typeValue: "",
    noValue: "",
    serValue: "",
    pageReset: 0,
    isUpdateBalance: false,
    isDisplayTopData: true,
    cCustNo: "",
    topLeftHtml: "",
    isCompleteRender: false,
    isSearchBtnClick: false,

    isCust: true,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecmodule.account.common", "commonlib.base");
        this.ecRequire(["ecmodule.common.upbalance"]);
    },
    // 기본 정보 설정
    initProperties: function () {
        var self = this;
        this.defaultSearchParam = { FORM_GUBUN: self.formTypeCode, FORM_SER: 99999, PAGE_SIZE: 1000, PAGE_CURRENT: 1, SORTCOL_INDEX: 0, SORT_TYPE: 'A', PRINT_TYPE: 'P', SORTCOL_ID: '', PARAM: '' };

        this.finalSearchParam = { FORM_GUBUN: self.formTypeCode, PARAM: '' };
        this.printPageSet = {
            printCss: ""
        };
        this.permissions = $.extend({}, this.permissions, this.viewBag.Permission || {});
        this.widthBalancePopup = 720;
        this.heightBalancePopup = 300;
        this.widthEmail = 860;
        this.heightEmail = 650;
        this.widthFax = 760;
        this.heightFax = 650;

        this.listTemplate1 = [];
        this.listTemplate2 = [];
        this.listTemplate3 = [];

        this.listOrgTemplate1 = [];
        this.listOrgTemplate2 = [];
        this.listOrgTemplate3 = [];

        if (!this.isSearchData) this.isSearchData = false;

        var isCsDefault = false;
        var iIndexCsDefault = 99999;

        var self = this,
            formInfo = self.viewBag.InitDatas;
        if (formInfo) {
            if (formInfo.allowFormList1 && formInfo.allowFormList1.length > 0) { //AO010
                $.each(formInfo.allowFormList1, function (i, item) {
                    if (item.BASIC_TYPE == "3") {
                        isCsDefault = true;
                        iIndexCsDefault = i;
                    }

                    if (item.FORM_SEQ == 99999) {
                        self.listTemplate1.push([item.FORM_SEQ, item.TITLE_NM.length > 10 ? item.TITLE_NM.substr(0, 10) : item.TITLE_NM]);
                        self.selected1 = item.FORM_SEQ;
                    }
                });

                $.each(formInfo.allowFormList1, function (i, item) {
                    if (item.FORM_SEQ != 99999) {
                        if (item.FORM_SEQ < 1000) {
                            self.listOrgTemplate1.push(item);
                        }
                        if (item.BASIC_TYPE == "0" && item.FORM_SEQ != 1000)
                            self.selected1 = item.FORM_SEQ;
                        self.listTemplate1.push([item.FORM_SEQ, item.TITLE_NM.length > 10 ? item.TITLE_NM.substr(0, 10) : item.TITLE_NM]);
                    }
                });

                if (isCsDefault == true && self.selected1 != undefined) {
                    formInfo.allowFormList1[iIndexCsDefault].BASIC_TYPE = "N";
                }

                if (self._userParam) {
                    self.selected1 = self._userParam.C_formSer1;
                }
            }

            isCsDefault = false;
            iIndexCsDefault = 99999;
            if (formInfo.allowFormList2 && formInfo.allowFormList2.length > 0) {
                $.each(formInfo.allowFormList2, function (i, item) {
                    if (item.BASIC_TYPE == "3") {
                        isCsDefault = true;
                        iIndexCsDefault = i;
                    }

                    if (item.FORM_SEQ == 99999) {
                        self.listTemplate2.push([item.FORM_SEQ, item.TITLE_NM.length > 10 ? item.TITLE_NM.substr(0, 10) : item.TITLE_NM]);
                        self.selected2 = item.FORM_SEQ;
                    }
                });

                $.each(formInfo.allowFormList2, function (i, item) {
                    if (item.FORM_SEQ != 99999) {
                        if (item.FORM_SEQ < 1000) {
                            self.listOrgTemplate2.push(item);
                        }
                        if (item.BASIC_TYPE == "0" && item.FORM_SEQ != 1000)
                            self.selected2 = item.FORM_SEQ;
                        self.listTemplate2.push([item.FORM_SEQ, item.TITLE_NM.length > 10 ? item.TITLE_NM.substr(0, 10) : item.TITLE_NM]);
                    }
                });

                if (isCsDefault == true && self.selected2 != undefined) {
                    formInfo.allowFormList2[iIndexCsDefault].BASIC_TYPE = "N";
                }

                if (self._userParam) {
                    self.selected2 = self._userParam.C_formSer2;
                }
            }

            isCsDefault = false;
            iIndexCsDefault = 99999;
            if (formInfo.allowFormList3 && formInfo.allowFormList3.length > 0) {
                $.each(formInfo.allowFormList3, function (i, item) {
                    if (item.BASIC_TYPE == "3") {
                        isCsDefault = true;
                        iIndexCsDefault = i;
                    }

                    if (item.FORM_SEQ == 99999) {
                        self.listTemplate3.push([item.FORM_SEQ, item.TITLE_NM.length > 10 ? item.TITLE_NM.substr(0, 10) : item.TITLE_NM]);
                        self.selected3 = item.FORM_SEQ;
                    }
                });

                $.each(formInfo.allowFormList3, function (i, item) {
                    if (item.FORM_SEQ != 99999) {
                        if (item.FORM_SEQ < 1000) {
                            self.listOrgTemplate3.push(item);
                        }
                        if (item.BASIC_TYPE == "0" && item.FORM_SEQ != 1000)
                            self.selected3 = item.FORM_SEQ;
                        self.listTemplate3.push([item.FORM_SEQ, item.TITLE_NM.length > 10 ? item.TITLE_NM.substr(0, 10) : item.TITLE_NM]);
                    }
                });

                if (isCsDefault == true && self.selected3 != undefined) {
                    formInfo.allowFormList3[iIndexCsDefault].BASIC_TYPE = "N";
                }

                if (self._userParam) {
                    self.selected3 = self._userParam.C_formSer3;
                }
            }
        }
    },

    render: function ($parent) {

        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header, resource) {
        var self = this;
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();
        var opt1 = ctrl.define("widget.select", "formList");

        tabContents
            .onSync()
            .setType(self.SEARCH_FORM_TYPE);

        if (this.isFromCS === true) {
            tabContents.setOptions({
                showFormLayer: this.IsHeaderSearch == "Y",
                simpleSearch: ["today", "yesterday", "week", "lastWeek", "month", "lastMonth", "endDay"]
            })
        }
        else {
            tabContents.setOptions({
                showFormLayer: this.IsHeaderSearch == "Y"
            })
        }

        tabContents.filter(function (control) {
            if (control.id === "txtPjtCd" && !((ecount.config.company.USE_PJT == "Y" || ecount.config.company.USE_PJT_FLAG) && ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C")) return false;

            if (control.id === "txtSiteCd" && !(ecount.config.company.USE_DEPT == "Y" && ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C")) return false;
            if (control.id === "txtTreeSiteCd" && !(ecount.config.company.USE_DEPT == "Y" && ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C")) return false;

            if (control.id === "txtSWhCd" && !(ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C")) return false;
            if (control.id === "txtTreeWhCd" && !(ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C")) return false;
        });

        toolbar
            .setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true }) //중요 ignorePrimaryButton 확인
            .addLeft(this.listTemplate1.length > 0 ? opt1.option(this.listTemplate1).select(this.selected1) : opt1)
            .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113));

        if (this.isFromCS !== true) {
            toolbar
                .search("search", this.getFormListSearchOption(), "status")
                .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));
        }

        contents.add(tabContents).add(toolbar);

        var titleDes = ecount.resource.LBL93573;
        if (!$.isNull(this.RPT_GUBUN)) {
            if (this.RPT_GUBUN == "1") {
                titleDes = ecount.resource.LBL12532;
            } else {
                titleDes = ecount.resource.LBL12533;
            }
        }
        //외화 구분
        if (ecount.company.FOREIGN_YN == "00") {
            header.setTitle(titleDes)
            header.add("search", null, true);
            if (!$.isNull(this.RPT_GUBUN)) {
                if (this.RPT_GUBUN == "1") {
                    header.add("option", [
                        {
                            id: "templateSetting", label: ecount.resource.LBL01482, isChildDepth: true, childItems: ecmodule.common.base.getFormListOption({
                                thisObj: this, id: "formListOption", formList: this._userParam != undefined && this._userParam != null ? (this._userParam.C_formGubun == "AO012" ? this.listOrgTemplate3 : (this._userParam.C_formGubun == "AO010" ? this.listOrgTemplate1 : this.listOrgTemplate2)) : this.listOrgTemplate1
                            })
                        },
                        { id: "sentMail", label: ecount.resource.BTN00114 },
                        { id: "sentFax", label: ecount.resource.LBL05432 },
                        { id: "preInvoiceReceive", label: ecount.resource.LBL09527 },
                        { id: "searchTemplate", label: ecount.resource.BTN00493 },
                        { id: "emailFaxTopSend", label: ecount.resource.LBL16836 }
                    ], true);
                } else {
                    header.add("option", [
                        {
                            id: "templateSetting", label: ecount.resource.LBL01482, isChildDepth: true, childItems: ecmodule.common.base.getFormListOption({
                                thisObj: this, id: "formListOption", formList: this._userParam != undefined && this._userParam != null ? (this._userParam.C_formGubun == "AO012" ? this.listOrgTemplate3 : (this._userParam.C_formGubun == "AO010" ? this.listOrgTemplate1 : this.listOrgTemplate2)) : this.listOrgTemplate1
                            })
                        },
                        { id: "sentMail", label: ecount.resource.BTN00114 },
                        { id: "sentFax", label: ecount.resource.LBL05432 },
                        { id: "preInvoicePay", label: ecount.resource.LBL09528 },
                        { id: "searchTemplate", label: ecount.resource.BTN00493 },
                        { id: "emailFaxTopSend", label: ecount.resource.LBL16836 }
                    ], true);
                }
            } else {
                header.add("option", [
                    {
                        id: "templateSetting", label: ecount.resource.LBL01482, isChildDepth: true, childItems: ecmodule.common.base.getFormListOption({
                            thisObj: this, id: "formListOption", formList: this._userParam != undefined && this._userParam != null ? (this._userParam.C_formGubun == "AO012" ? this.listOrgTemplate3 : (this._userParam.C_formGubun == "AO010" ? this.listOrgTemplate1 : this.listOrgTemplate2)) : this.listOrgTemplate1
                        })
                    },
                    { id: "sentMail", label: ecount.resource.BTN00114 },
                    { id: "sentFax", label: ecount.resource.LBL05432 },
                    { id: "preInvoiceReceive", label: ecount.resource.LBL09527 },
                    { id: "preInvoicePay", label: ecount.resource.LBL09528 },
                    { id: "searchTemplate", label: ecount.resource.BTN00493 },
                    { id: "emailFaxTopSend", label: ecount.resource.LBL16836 }
                ], true);
            }
            header.addContents(contents);
        }
        else {
            header.setTitle(titleDes)
                .add("search", null, true);
            if (!$.isNull(this.RPT_GUBUN)) {
                if (this.RPT_GUBUN == "1") {
                    header.add("option", [
                        {
                            id: "templateSetting", label: ecount.resource.LBL01482, isChildDepth: true, childItems: ecmodule.common.base.getFormListOption({
                                thisObj: this, id: "formListOption", formList: this._userParam != undefined && this._userParam != null ? (this._userParam.C_formGubun == "AO012" ? this.listOrgTemplate3 : (this._userParam.C_formGubun == "AO010" ? this.listOrgTemplate1 : this.listOrgTemplate2)) : this.listOrgTemplate1
                            })
                        },
                        { id: "sentMail", label: ecount.resource.BTN00114 },
                        { id: "preInvoiceReceive", label: ecount.resource.LBL09527 },
                        { id: "searchTemplate", label: ecount.resource.BTN00493 },
                        { id: "emailFaxTopSend", label: ecount.resource.LBL16836 }
                    ], true);
                } else {
                    header.add("option", [
                        {
                            id: "templateSetting", label: ecount.resource.LBL01482, isChildDepth: true, childItems: ecmodule.common.base.getFormListOption({
                                thisObj: this, id: "formListOption", formList: this._userParam != undefined && this._userParam != null ? (this._userParam.C_formGubun == "AO012" ? this.listOrgTemplate3 : (this._userParam.C_formGubun == "AO010" ? this.listOrgTemplate1 : this.listOrgTemplate2)) : this.listOrgTemplate1
                            })
                        },
                        { id: "sentMail", label: ecount.resource.BTN00114 },
                        { id: "preInvoicePay", label: ecount.resource.LBL09528 },
                        { id: "searchTemplate", label: ecount.resource.BTN00493 },
                        { id: "emailFaxTopSend", label: ecount.resource.LBL16836 }
                    ], true);
                }
            } else {
                header.add("option", [
                    {
                        id: "templateSetting", label: ecount.resource.LBL01482, isChildDepth: true, childItems: ecmodule.common.base.getFormListOption({
                            thisObj: this, id: "formListOption", formList: this._userParam != undefined && this._userParam != null ? (this._userParam.C_formGubun == "AO012" ? this.listOrgTemplate3 : (this._userParam.C_formGubun == "AO010" ? this.listOrgTemplate1 : this.listOrgTemplate2)) : this.listOrgTemplate1
                        })
                    },
                    { id: "sentMail", label: ecount.resource.BTN00114 },
                    { id: "preInvoiceReceive", label: ecount.resource.LBL09527 },
                    { id: "preInvoicePay", label: ecount.resource.LBL09528 },
                    { id: "searchTemplate", label: ecount.resource.BTN00493 },
                    { id: "emailFaxTopSend", label: ecount.resource.LBL16836 }
                ], true);
            }
            header.addContents(contents);
        }
    },

    onInitContents: function (contents, resource) {
        var g = widget.generator,
            ctrl = g.control(),
            form1 = g.form(),
            grid = g.grid(),
            res = ecount.resource,
            tabContents = g.tabContents();

        tabContents.onSingleMode();
        tabContents.createTab("tabList", ecount.resource.LBL01070, null, true, "left");//e-Approval

        contents.add(tabContents).addGrid("dataGrid-" + this.pageID, null);
    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        footer.add(toolbar);
    },
    // 페이지 오픈시 위젯 설정
    onInitControl_Submit: function (cid, control) {
    },

    onInitControl: function (cid, control) {
        var defaultParam = [];
        var res = ecount.resource;
        var ctrl = widget.generator.control();
        switch (cid) {
            case "txtSWhCd":
                if (ecount.user.ALL_GROUP_WH == 1) {
                    if (ecount.config.user.ALLOW_WH_CD) {
                        control.addCode({ label: ecount.config.user.ALLOW_WH_DES, value: ecount.config.user.ALLOW_WH_CD });
                    }
                }
                break;

            case "txtSiteCd":
                if (ecount.user.ALL_GROUP_SITE == 1) {
                    if (this.countDept == 1) {
                        control.addCode({ label: this.SITE_DESC, value: this.SITE_CD });
                    }
                }
                break;
            case "rbGubun0":
                control.label([res.LBL08306, res.LBL13750, res.LBL02191, res.LBL02056, res.LBL13751]).value(['1', '4', '2', '3', '5']).select('4');
                break;
            case "rbGubun1":
                control.label([res.LBL02475, res.LBL02739, res.LBL02740]).value(['3', '1', '2']);
                if (!$.isEmpty(this.Gubun1)) {
                    control.select(this.Gubun1);
                } else {
                    control.select('1');
                }
                break;
            case "rbSumGubun":
                control.label([res.LBL02475, res.LBL02739, res.LBL02740]).value(['', '0', '9']).select('0');
                break;
            case "EtcChk":
                control
                    .addControl(ctrl.define("widget.checkbox", "cbRptConfirm", "cbRptConfirm").label([res.LBL00444]).value([1]).select((ecount.config.company.RPT_CONFIRM == "Y") ? '1' : '0'))
                    .addControl(ctrl.define("widget.checkbox", "cbBeforeFlag", "cbBeforeFlag").label([res.LBL01209]).value([1]).hide())
                    .addControl(ctrl.define("widget.checkbox", "cbNoCust", "cbNoCust").label([res.LBL00384]).value([1]))
                break;
            default:
                break;
        }
    },


    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (event) {

        this.setChangerbGubun1("all");
        this.setChangerbGubun0("all");

        if (this.IsSelfOpenPopup == "Y") {
            this.isCust = false;
        }
        this.header.getControl("EtcChk", "basic") && this.header.getControl("EtcChk", "basic").get(1).hide();
        this.header.getControl("EtcChk", "all") && this.header.getControl("EtcChk", "all").get(1).hide();

        if (this.IsHeaderSearch == "N") {
            if (this.header.getControl("formList")) {
                this.header.getControl("formList").setValue(this.FormSer);
            }
            this.onHeaderSearch(false);
        }

        if (!$.isNull(this.RPT_GUBUN)) {
            this.header.getControl("rbGubun1", "basic").setValue(0, this.Gubun1, true);
            this.header.getForm("basic")[0].hideRow("rbGubun1");
            this.header.getForm("all")[0].hideRow("rbGubun1");
        }
    },

    onPopupHandler: function (control, param, handler) {
        var self = this;
        switch (control.id) {
            case "txtSiteCd":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.isOthersDataFlag = 'Y';
                param.checkMaxCount = 100;
                param.CHKFLAG = 'A';
                break;
            case "txtSCustCd":
                if (!self.header.getControl("EtcChk", "all").get(2).getValue()) {
                    param.isApplyDisplayFlag = true;       // apply 
                    param.isCheckBoxDisplayFlag = true;    // checkbox
                    param.isIncludeInactive = true;
                    param.FilterCustGubun = 101;//       
                }
                else {
                    ecount.alert(ecount.resource.MSG00080);
                    self.header.getControl("txtSCustCd", "all").removeAll();
                    self.header.getControl("txtCustGroup1", "all").removeAll();
                    self.header.getControl("txtCustGroup2", "all").removeAll();
                    self.header.getControl("txtTreeCustCd", "all").removeAll();
                    return false;
                }
                break;
            case "txtCustGroup1":
                param.isApplyDisplayFlag = true;       // apply 
                param.isIncludeInactive = true;
                param.isCheckBoxDisplayFlag = true;    // checkbox
                if (!self.header.getControl("EtcChk", "all").get(2).getValue()) {
                }
                else {
                    ecount.alert(ecount.resource.MSG00080);
                    self.header.getControl("txtSCustCd", "all").removeAll();
                    self.header.getControl("txtCustGroup1", "all").removeAll();
                    self.header.getControl("txtCustGroup2", "all").removeAll();
                    self.header.getControl("txtTreeCustCd", "all").removeAll();
                    return false;
                }
                break;
            case "txtCustGroup2":
                param.isApplyDisplayFlag = true;       // apply 
                param.isIncludeInactive = true;
                param.isCheckBoxDisplayFlag = true;    // checkbox
                if (!self.header.getControl("EtcChk", "all").get(2).getValue()) {
                }
                else {
                    ecount.alert(ecount.resource.MSG00080);
                    self.header.getControl("txtSCustCd", "all").removeAll();
                    self.header.getControl("txtCustGroup1", "all").removeAll();
                    self.header.getControl("txtCustGroup2", "all").removeAll();
                    self.header.getControl("txtTreeCustCd", "all").removeAll();
                    return false;
                }
                break;
            case "txtTreeCustCd":
                if (!self.header.getControl("EtcChk", "all").get(2).getValue()) {
                }
                else {
                    ecount.alert(ecount.resource.MSG00080);
                    self.header.getControl("txtSCustCd", "all").removeAll();
                    self.header.getControl("txtCustGroup1", "all").removeAll();
                    self.header.getControl("txtCustGroup2", "all").removeAll();
                    self.header.getControl("txtTreeCustCd", "all").removeAll();
                    return false;
                }
                break;
            case "txtPjtCd":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.searchCategoryFlag = 'A';
                param.checkMaxCount = 100;
                break;
            case "txtSWhCd":
                param.isApplyDisplayFlag = true;       // apply 
                param.isIncludeInactive = true;        // 
                param.isNewDisplayFlag = false;
                break;
            case "txtPjtGroup1":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.custGroupCodeClass = "G10";
                param.CODE_CLASS = "G10";
                break;
            case "txtPjtGroup2":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.custGroupCodeClass = "G11";
                param.CODE_CLASS = "G11";
                break;
            default:
                break;
        }
        handler(param);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        var self = this;
        if (control.id == "txtPjtCd" || control.id == "txtSiteCd") {
            parameter.CHK_FLAG = "A";
            if (control.id == "txtSiteCd")
                parameter.isOthersDataFlag = "N";
        }
        if (control.id == "txtSCustCd") {
            if (self.header.getControl("EtcChk", "all").get(2).getValue()) {
                ecount.alert(ecount.resource.MSG00080);
                self.header.getControl("txtSCustCd", "all").removeAll();
                self.header.getControl("txtCustGroup1", "all").removeAll();
                self.header.getControl("txtCustGroup2", "all").removeAll();
                self.header.getControl("txtTreeCustCd", "all").removeAll();
                return false;
            }
            else {
                parameter.CALL_TYPE = "101";
            }
        }
        if (control.id == "txtCustGroup1" || control.id == "txtCustGroup2" || control.id == "txtTreeCustCd") {
            if (self.header.getControl("EtcChk", "all").get(2).getValue()) {
                ecount.alert(ecount.resource.MSG00080);
                self.header.getControl("txtSCustCd", "all").removeAll();
                self.header.getControl("txtCustGroup1", "all").removeAll();
                self.header.getControl("txtCustGroup2", "all").removeAll();
                self.header.getControl("txtTreeCustCd", "all").removeAll();
                return false;
            }
        }

        if (control.id == "txtPjtGroup1") {
            parameter.CODE_CLASS = "G10";

        }
        if (control.id == "txtPjtGroup2") {
            parameter.CODE_CLASS = "G11";
        }

        handler(parameter);
    },

    onMessageHandler: function (page, callback) {
        var data = callback;
        switch (page.pageID) {
            case "SummaryChkAcct":
                var _self = this;
                _self.isUpdateBalance = true;
                _self.viewBag.WidgetDatas["widget.configAccount"].config["AcctDate"] = callback.acct_date;
                if (callback.JobType == updatebalanceOptions.resultMessage().error) {
                }
                else if (callback.JobType == updatebalanceOptions.resultMessage().nosave) {
                    _self.getCustVendInfoBeforeSearch();
                }
                else {
                    _self.getCustVendInfoBeforeSearch();
                };
                _self.setTimeout(function () {
                    callback.callback && callback.callback();
                }.bind(_self), 0);

                break;
            case "SummaryPreinvoiced"://미청구 채권,채무 재집계
                if (data.bond_debit_date != undefined && data.bond_debit_date != "") {
                    ecount.config.account.SALE_BOND_DATE = data.bond_debit_date;
                    ecount.config.account.BUY_DEBT_DATE = data.bond_debit_date;
                }

                this.getCustVendInfoBeforeSearch();
                break;
            case "CM100P_24"://양식 설정
                data.callback && data.callback();
                this.reloadPage("CM100P_24");
                break;
            case "ESC001P_31_02":
                data.callback && data.callback();
                this.reloadPage("ESC001P_31_02");
                break;
            case "ESC001P_322": // Email/Fax 발송설정
                data.callback && data.callback();
                this.reloadPage("ESC001P_322");
                break;
        };
    },

    //하단 다시 그리기
    onRefreshFooter: function () {
        var toolbar = this.footer.get(0);
        var ctrl = widget.generator.control();
        var res = ecount.resource;
        toolbar.remove();

        var btnList = [];
        btnList.push(ctrl.define("widget.button", "Email").label(res.BTN00010).css("btn btn-default").end());
        toolbar.addLeft(btnList);
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
        this.isCust = true;
    },

    onGridAfterFormLoad: function (e, data, grid) { },

    setCustomCustLink: function (value, rowItem) {
        var option = {};
        var self = this;
        option.controlType = "widget.link";
        option.data = rowItem["CUST"];
        option.event = {
            'click': function (e, data) {
                // 거래처 관리 대장 팝업
                var url = "";
                var formSer = self.header.getControl("formList") ? self.header.getControl("formList").getValue() : "";
                var userParam = {
                    C_formSer: formSer,
                    C_formGubun: self.formTypeCode,
                    C_formSer1: self.selected1,
                    C_formSer2: self.selected2,
                    C_formSer3: self.selected3
                };

                var Gubun0 = self.header.getControl("rbGubun0", "all").getValue();
                if (Gubun0 == "4")
                    if (self.formTypeCode == "AO010") {
                        userParam.C_formSer1 = formSer;
                        self.selected1 = formSer;
                    }
                    else if (self.formTypeCode == "AO011") {
                        userParam.C_formSer2 = formSer;
                        self.selected2 = formSer;
                    }
                    else if (self.formTypeCode == "AO012") {
                        userParam.C_formSer3 = formSer;
                        self.selected3 = formSer;
                    }
                
                if (formSer == "99999")
                    url = "/ECERP/EBZ/EBZ029R";
                else
                    url = "/ECERP/EBZ/EBZ056R";

                var param = {
                    width: 800,
                    height: 600,
                    // 상단 컨트롤 정보
                    __ecPage__: encodeURIComponent(Object.toJSON({ 
                        formdata: self.finalHeaderSearch,
                        _userParam: $.extend(self._userParam, userParam)
                    })),
                    IsHeaderSearch: "N",  // 상단 검색 창이 보일지 말지
                    IsOpenPopup: "Y",      // 팝업으로 오픈 됐는지 여부
                    IsSelfOpenPopup: "Y",   // 거래처 관리 대장에서 팝업으로 오픈 한건지 여부
                    BalanceCheckYn: "N",
                    RPT_GUBUN: self.RPT_GUBUN,
                    FormSer: self.header.getControl("formList") && self.header.getControl("formList").getValue(),
                    CUST: data.rowItem['CUST'],
                    CUST_DES: data.rowItem['CUST_DES'],
                    CUST_SEARCH: self.finalSearchParam.CUST != undefined ? self.finalSearchParam.CUST : "",
                    Gubun1: self.finalSearchParam.GUBUN_1 != undefined ? self.finalSearchParam.GUBUN_1 : "",
                    MAIN_CUST_CONVERT_YN: self.finalSearchParam.MAIN_CUST_CONVERT_YN != undefined ? self.finalSearchParam.MAIN_CUST_CONVERT_YN : "",
                    MAIN_CUST_CONVERT_ALL_YN: self.finalSearchParam.MAIN_CUST_CONVERT_ALL_YN != undefined ? self.finalSearchParam.MAIN_CUST_CONVERT_ALL_YN : "",
                }
                self.openWindow({
                    url: url,
                    name: ecount.resource.LBL93573,
                    param: param,
                    popupType: false,
                    additional: false,
                    fpopupID: this.ecPageID
                });
            }
        }
        return option;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //컨트롤 변경시 이벤트
    onChangeControl: function (e) {
        var control = e.__self;
        var currentTabIdAtHeader = "all";
        switch (control.id) {
            case "txtSCustCd":
                var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);

                if (searchParam.CUST.split(ecount.delimiter).length > 1) {
                    this.isMultiCust = true;
                }
                else {
                    this.isMultiCust = false;
                }
                break;

            case "rbSumGubun":
                var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);
                this.currentRptGubun = (searchParam.RPT_GUBUN.split(ecount.delimiter).contains('0') && searchParam.RPT_GUBUN.split(ecount.delimiter).contains('9')) ? 3 :
                    (searchParam.RPT_GUBUN.split(ecount.delimiter).contains('0') ? 1 : 2);
                break;
            case "cbNoCust":
                if (this.header.getControl("EtcChk", currentTabIdAtHeader).get(2).getValue()) {
                    this.isRunFromCheckbox = true;
                    this.header.getControl("txtSCustCd", currentTabIdAtHeader).removeAll();
                    this.header.getControl("txtCustGroup1", currentTabIdAtHeader).removeAll();
                    this.header.getControl("txtCustGroup2", currentTabIdAtHeader).removeAll();
                    this.header.getControl("txtTreeCustCd", currentTabIdAtHeader).removeAll();
                }

                if (this.isLoadPopup) {
                    var control = this.header.getControl("txtSCustCd", "all");
                    control.addCode({ label: this.CUST_DESC, value: this.CUST });
                }

                break;
            case "rbGubun1":    // 채권채무 구분
                this.setChangerbGubun1(currentTabIdAtHeader);
                break;
            case "rbGubun0":
                this.setChangerbGubun0(currentTabIdAtHeader);
                break;
            default:
                break;
        }
    },

    // 채권채무 구분 체인지
    setChangerbGubun1: function (currentTabIdAtHeader) {
        var gubunObj = this.header.getControl("rbGubun1", currentTabIdAtHeader);
        var gubunObj0 = this.header.getControl("rbGubun0", currentTabIdAtHeader);
        if (gubunObj && gubunObj.getValue(0) == true) {

            var selected3_1 = this.selected3;
            if (this.header.getControl("MainCustFlag", "basic")) {
                this.header.getControl("MainCustFlag", "basic").get(0).setReadOnly(true);
            }

            if (this.header.getControl("MainCustFlag", "all")) {
                this.header.getControl("MainCustFlag", "all").get(0).setReadOnly(true);
            }

            if (gubunObj0) {
                if (gubunObj0.getValue() == "4") { 
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(false);
                    }
                    selected3_1 = this.selected3;
                }
                else {
                    selected3_1 = "99999";
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(true);
                    }
                }
            }
            this.fnChangeFormSetup(this.listTemplate3, this.listOrgTemplate3, "AO012", selected3_1, currentTabIdAtHeader);
        }
        else if (gubunObj && gubunObj.getValue(1) == "1") {
            var selected1_1 = this.selected1;

            if (this.header.getControl("MainCustFlag", "basic")) {
                this.header.getControl("MainCustFlag", "basic").get(0).setReadOnly(false);
                if (ecount.config.user.ALL_GROUP_CUST == '1') {
                    this.header.getControl("MainCustFlag", "basic").get(0).setReadOnly(true, 0);
                    this.header.getControl("MainCustFlag", "basic").get(0).setReadOnly(true, 2);
                }
            }

            if (this.header.getControl("MainCustFlag", "all")) {
                this.header.getControl("MainCustFlag", "all").get(0).setReadOnly(false);
                if (ecount.config.user.ALL_GROUP_CUST == '1') {
                    this.header.getControl("MainCustFlag", "all").get(0).setReadOnly(true, 0);
                    this.header.getControl("MainCustFlag", "all").get(0).setReadOnly(true, 2);
                }
            }

            if (gubunObj0) {
                if (gubunObj0.getValue() == "4") {
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(false);
                    }
                    selected1_1 = this.selected1;
                }
                else {
                    selected1_1 = "99999";
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(true);
                    }
                }
            }
            this.fnChangeFormSetup(this.listTemplate1, this.listOrgTemplate1, "AO010", selected1_1, currentTabIdAtHeader);
        }
        else if (gubunObj && gubunObj.getValue(2) == "2") {
            var selected2_1 = this.selected2;

            if (this.header.getControl("MainCustFlag", "basic")) {
                this.header.getControl("MainCustFlag", "basic").get(0).setReadOnly(true);
            }

            if (this.header.getControl("MainCustFlag", "all")) {
                this.header.getControl("MainCustFlag", "all").get(0).setReadOnly(true);
            }

            if (gubunObj0) {
                if (gubunObj0.getValue() == "4") {
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(false);
                    }
                    selected2_1 = this.selected2;
                }
                else {
                    selected2_1 = "99999";
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(true);
                    }
                }
            }
            this.fnChangeFormSetup(this.listTemplate2, this.listOrgTemplate2, "AO011", selected2_1, currentTabIdAtHeader);
        }
        else {
            var selected3_1 = this.selected3;

            if (gubunObj0) {
                if (gubunObj0 && gubunObj0.getValue() == "4") {
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(false);
                    }
                    selected3_1 = this.selected3;
                }
                else {
                    selected3_1 = "99999";
                    if (this.header.getControl("formList")) {
                        this.header.getControl("formList").readOnly(true);
                    }
                }
            }

            this.fnChangeFormSetup(this.listTemplate3, this.listOrgTemplate3, "AO012", selected3_1, currentTabIdAtHeader);
        }
    },

    // 집계구분 체인지
    setChangerbGubun0: function (currentTabIdAtHeader) {
        var gubunObj = this.header.getControl("rbGubun0", currentTabIdAtHeader);

        this.header.getControl("formList", currentTabIdAtHeader) && this.header.getControl("formList", currentTabIdAtHeader).readOnly(true);

        if ((gubunObj && (gubunObj.getValue() == "4"))) {
            var gubunObj1 = this.header.getControl("rbGubun1", "all");
            if (gubunObj1 && gubunObj1.getValue(0) == "0") {
                this.fnChangeFormSetup(this.listTemplate3, this.listOrgTemplate3, "AO012", this.selected3, currentTabIdAtHeader);
            }
            else if (gubunObj1 && gubunObj1.getValue(1) == "1") {
                this.fnChangeFormSetup(this.listTemplate1, this.listOrgTemplate1, "AO010", this.selected1, currentTabIdAtHeader);
            }
            else if (gubunObj1 && gubunObj1.getValue(2) == "2") {
                this.fnChangeFormSetup(this.listTemplate2, this.listOrgTemplate2, "AO011", this.selected2, currentTabIdAtHeader);
            }
            else {
                this.fnChangeFormSetup(this.listTemplate3, this.listOrgTemplate3, "AO012", this.selected3, currentTabIdAtHeader);
            }
        }

        if ((gubunObj && (gubunObj.getValue() != "4"))) {
            this.header.getControl("formList", currentTabIdAtHeader) && this.header.getControl("formList", currentTabIdAtHeader).setValue("99999");
            this.header.getControl("formList", currentTabIdAtHeader) && this.header.getControl("formList", currentTabIdAtHeader).readOnly(true);
        }
        else {

            this.header.getControl("formList", currentTabIdAtHeader) && this.header.getControl("formList", currentTabIdAtHeader).readOnly(false);
            var gubunObj1 = this.header.getControl("rbGubun1", "all");
            if (gubunObj1 && gubunObj1.getValue(0) == "0") {
                this.fnChangeFormSetup(this.listTemplate3, this.listOrgTemplate3, "AO012", this.selected3, currentTabIdAtHeader);
            }
            else if (gubunObj1 && gubunObj1.getValue(1) == "1") {
                this.fnChangeFormSetup(this.listTemplate1, this.listOrgTemplate1, "AO010", this.selected1, currentTabIdAtHeader);
            }
            else if (gubunObj1 && gubunObj1.getValue(2) == "2") {
                this.fnChangeFormSetup(this.listTemplate2, this.listOrgTemplate2, "AO011", this.selected2, currentTabIdAtHeader);
            }
            else {
                this.fnChangeFormSetup(this.listTemplate3, this.listOrgTemplate3, "AO012", this.selected3, currentTabIdAtHeader);
            }
        }
    },

    //출력물or 양식 select box 컨트롤
    fnChangeFormSetup: function (listTemplate, listOrgTemplate, TypeCode, selected, currentTabIdAtHeader) {
        this.viewBag.InitDatas.allowFormList = null;
        this.viewBag.InitDatas.allowFormList = listOrgTemplate;

        var controlFormList = this.header.getControl("formList", currentTabIdAtHeader);
        if (controlFormList) {
            controlFormList.removeOption();
            controlFormList.addOption(listTemplate);
        }
        this.header.removeOptionChildItems('templateSetting');
        this.header.insertOptionChildItems("templateSetting", ecmodule.common.base.getFormListOption({
            thisObj: this, id: "formListOption", formList: listOrgTemplate
        }));
        this.formTypeCode = TypeCode;
        this.defaultSearchParam.FORM_GUBUN = this.formTypeCode;
        if (this.header.getControl("formList", currentTabIdAtHeader)) {
            this.header.getControl("formList", currentTabIdAtHeader).setValue(selected);
        }
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 상단 버튼 이벤트 시작
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 양식 버튼 클릭 이벤트
    onDropdownFormListOption: function (event) {
        //if this page has another case, you have to implement this function, don't modify  ecmodule.common.base.setDropdownFormListOption funtion.
        //예외사항 있을 시 여기에 구현하세요. ecmodule.common.base.setDropdownFormListOption 공통은 수정하지 마세요.
        ecmodule.common.base.setDropdownFormListOption({ thisObj: this, formType: this.formTypeCode, event: event, isSaveAfterClose: true });
    },

    // 이메일 발송 내역
    onDropdownSentMail: function () {
        var useTabFax = true;
        if (!ecount.config.limited.feature.USE_FAX || ecount.company.FOREIGN_YN != "00") {
            useTabFax = false;
        }
        var paramSentEmail = {
            width: this.widthEmail,
            height: this.heightEmail,
            parentPageID: this.pageID,
            Request: {
                activeTab: "tabSentEmail",
                Data: {
                    docFlag: "88",
                    menuFormType: "",
                    useTabFax: useTabFax,
                    ROOM_SEQ: '',
                    activeTab: "tabSentEmail",
                    actTab: "tabSentEmail",
                    menuGubun: 1
                },
                BASE_DATE_FROM: this.bDateFrom,
                BASE_DATE_TO: this.bDateTo
            }
        };
        this.openWindow({ url: '/ECERP/SVC/ESD/ESD023M', name: ecount.resource.LBL93603, param: paramSentEmail, popupType: false, additional: false });
    },

    // 팩시 발송 내역
    onDropdownSentFax: function () {
        var useTabFax = true;
        if (!ecount.config.limited.feature.USE_FAX || ecount.company.FOREIGN_YN != "00") {
            useTabFax = false;
        }
        var paramSentFax = {
            width: this.widthFax,
            height: this.heightFax,
            parentPageID: this.pageID,
            Request: {
                activeTab: "tabSentFax",
                Data: {
                    docFlag: "88",
                    menuFormType: "",
                    useTabFax: useTabFax,
                    ROOM_SEQ: '',
                    activeTab: "tabSentFax",
                    actTab: "tabSentFax",
                    menuGubun: 1
                },
                BASE_DATE_FROM: this.bDateFrom,
                BASE_DATE_TO: this.bDateTo
            }
        };
        this.openWindow({ url: '/ECERP/SVC/ESD/ESD024M', name: ecount.resource.LBL93603, param: paramSentFax, popupType: false, additional: false });
    },

    // 미청구 채권 재집계
    onDropdownPreInvoiceReceive: function () {
        var param = {
            FLAG: "R", //Receivables 
            FlagFormID: "61",
            parentPageID: this.pageID,
            width: this.widthBalancePopup,
            height: this.heightBalancePopup
        };
        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/ECM/SummaryPreInvoiced', name: ecount.resource.LBL09527, param: param, popupType: false, additional: false });
    },

    // 미청구 채무 재집계
    onDropdownPreInvoicePay: function () {
        var param = {
            FLAG: "P", //Payables 
            FlagFormID: "61",
            parentPageID: this.pageID,
            width: this.widthBalancePopup,
            height: this.heightBalancePopup
        };
        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/ECM/SummaryPreInvoiced', name: ecount.resource.LBL09528, param: param, popupType: false, additional: false });
    },

    // Email/Fax 발송설정
    onDropdownEmailFaxTopSend: function (e) {
        var param = {
            width: 650,
            height: 200,
            POPUP_CD: '811'
        }

        this.openWindow({
            url: "/ECERP/ESC/ESC001P_322",
            name: 'ESC001P_322',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    //검색창 설정 팝업(Search Settings pop-up window)
    onDropdownSearchTemplate: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 420,
            FORM_TYPE: this.SEARCH_FORM_TYPE,
            FORM_TYPE_MASTER: "",
            FORM_TYPE_INPUT: "",
            FORM_SEQ: 1,
            NetFlag: "N",
            FIRST_FLAG: "Y"
        }
        this.openWindow({
            url: "/ECErp/Popup.Form/CM100P_24",
            name: 'CM100P_24',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },
    onDropdownOldMenu: function () {
        this.onAllSubmitSelf({
            url: "/Ecmain/CM3/CM_Search_Acct_Main.aspx?RPTGUBUN=42"
        });
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 상단 버튼 이벤트 끝
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 간편 검색
    onHeaderSimpleSearch: function (e) {
        this.onHeaderSearch(true);
    },

    //메일 발송
    onFooterEmail: function () {
        var mailContents = "";
        var custList = "";

        var data = this.contents.getGrid().grid.getChecked();
        if (data.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        $.each(data, function (i, item) {
            custList = custList + item.CUST + ecount.delimiter;
        });

        var Customer_Form_Type = "";
        if (this.finalSearchParam.GUBUN_1 == "3")
            Customer_Form_Type = "AO012";
        else if (this.finalSearchParam.GUBUN_1 == "2")
            Customer_Form_Type = "AO011";
        else
            Customer_Form_Type = "AO010";

        var param = {
            width: 1200,
            height: 800,
            FORM_TYPE: "CUSTOMER",
            FORM_SEQ: this.header.getControl("formList") && this.header.getControl("formList").getValue(),
            FROM_SALESLIST: "Y",
            FROM_DATE: this.finalSearchParam.BASE_DATE_FROM,
            TO_DATE: this.finalSearchParam.BASE_DATE_TO,
            HeaderSearch: Object.toJSON(this.finalHeaderSearch),
            CUST_LIST: custList,
            INNER_HTML: mailContents,
            TradingStatementPrintingYn: "N",
            AccessType: "E",
            Customer_Form_Type: Customer_Form_Type,
            CUST_SEARCH: this.finalSearchParam.CUST != undefined ? this.finalSearchParam.CUST : "",
            BOND_DEBIT_TYPE: this.finalSearchParam.GUBUN_1,
            MAIN_CUST_CONVERT_YN: this.finalSearchParam.MAIN_CUST_CONVERT_YN,
            MAIN_CUST_CONVERT_ALL_YN: this.finalSearchParam.MAIN_CUST_CONVERT_ALL_YN,
            RPT_GUBUN: this.RPT_GUBUN
        }

        this.openWindow({
            url: '/ECERP/Popup.Common/ES300M',
            param: param,
            popupType: false
        });
    },

    // 일자 설정
    fnGetDateFromString1: function (strDate) {
        return strDate.substring(0, 4) + "." + strDate.substring(4, 6) + "." + strDate.substring(6, 8);
    },

    // 상단 검색 버튼 클릭
    onHeaderSearch: function (forceHide) {

        if (forceHide != false) {
            this.isSearchBtnClick = true;
            this.BalanceCheckYn = "Y";
        }
        var currentTabIdAtHeader = "all";
        this.isHeaderSearch = "N";
        this.isUpdateBalance = false;
        this.intPageIndexFooter = 0;
        this.intPageIndexHeader = 0;
        var invalid = this.header.validate("all");

        if (invalid.result.length > 0) {
            var targetControl;
            var invalidControl = this.header.getControl(invalid.result[0][0].control.id);
            if (invalidControl) {
                targetControl = invalidControl;
            } else {
                this.header.changeTab(invalid.tabId, true);
                targetControl = invalid.result[0][0].control;
            }
            if (targetControl.id == "rbProdChk") {
                this.header.showGroupRow("txtSProdCd");
            }
            this.header.toggleContents(true, function () {
                targetControl.setFocus(0);
            });
            targetControl.setFocus(0);
            return;
        }

        // 양식 권한 체크
        if (this.header.getControl("formList") && this.header.getControl("formList").getValue() == "") {
            ecount.alert(ecount.resource.MSG04944);
            return false;
        }

        var self = this;
        var initFalg = true;
        var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);
        searchParam["FORM_SER"] = this.header.getControl("formList", currentTabIdAtHeader) ? this.header.getControl("formList", currentTabIdAtHeader).getValue() : "";
        var yymm = searchParam.BASE_DATE_FROM.substring(0, 4) + searchParam.BASE_DATE_FROM.substring(4, 6);
        var strIniYYMM = ecount.company.INI_YYMM;
        var year = parseInt(strIniYYMM.substring(0, 4));
        var month = parseInt(strIniYYMM.substring(4, 6));
        if (month == 12) {
            month = 1;
            year = year + 1;
        }
        else {
            month = month + 1;
        }

        var date = String.format("{0}-{1}-01", year.toString(), month.toString()).toDate();
        var strAlert = String.format(ecount.resource.MSG03932, ecount.infra.getECDateFormat('DATE20', false, date));

        if (parseInt(yymm) <= parseInt(strIniYYMM)) {
            ecount.alert(strAlert, function () {
                self.header.getControl("ddlSYear").setFocus(1);
                return false;
            });
            return false;
        }

        var _preInvoicedUpdateBalanceFlag = true;
        if (!this._userParam) self.isMoreFlag = false;
        this.isMultiCust == searchParam.CUST.split(ecount.delimiter).length > 1 ? true : false;

        var _menuType = "B";
        if (searchParam.GUBUN1 == 1)
            _menuType = "R";
        if (searchParam.GUBUN1 == 2)
            _menuType = "P";

        if (!$.isEmpty(searchParam.cbNoCust[0]) && self.isCust == true) {
            self.isCust = false;
        }

        if ($.isEmpty(searchParam.CUST) && $.isEmpty(searchParam.CUST_GROUP1) && $.isEmpty(searchParam.CUST_GROUP2) && $.isEmpty(searchParam.CUST_LEVEL_GROUP) && $.isEmpty(searchParam.cbNoCust[0])) {
            ecount.alert(ecount.resource.MSG04336, function () {
                self.header.getControl("txtSCustCd").setFocus(0);
                return false;
            });
            return false;
        }
        else {
            // 기수를 사용하는 메뉴에서 기수가 존재하는지 확인
            if (this.getPhaseCheck()) {
                return false;
            }
            searchParam.MAIN_CUST_CONVERT_YN = "N";
            var param = {};
            param.CUST = searchParam.CUST;
            param.CUST_GROUP1 = searchParam.CUST_GROUP1;
            param.CUST_GROUP2 = searchParam.CUST_GROUP2;
            param.CD_CUST_TREE = searchParam.CUST_LEVEL_GROUP;
            param.CB_CUST_SUBTREE = searchParam.CUST_LEVEL_GROUP_CHK;
            param.CB_MAIN_CUST_FLAG = searchParam.MAIN_CUST_CONVERT_YN == "Y" ? "1" : "0";
            param.MAIN_CUST_CONVERT_YN = searchParam.MAIN_CUST_CONVERT_YN;
            
            ecount.common.api({
                url: "/Inventory/Others/GetListCmcdCustCheckList",
                data: Object.toJSON(param),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                        return false;
                    }
                    else {
                        self.totalCount = result.Data.Data[0].TOTAL_COUNT;
                        if (self.totalCount == 0 && self.isCust == true) {
                            ecount.alert(ecount.resource.MSG04349, function () {
                                self.header.getControl("txtSCustCd").setFocus(0);
                                return false;
                            });
                            return false;
                        }
                        else {
                            if (self.totalCount > 1) {
                                self.setUpdateBalance(_preInvoicedUpdateBalanceFlag, _menuType);
                            }
                            else {
                                self.fnGetTopSettingData(self.setUpdateBalance.bind(self), _preInvoicedUpdateBalanceFlag, _menuType, searchParam);
                            }
                        }
                    }
                }
            });
        }        
    },

    //탑설정정보 불러오기
    fnGetTopSettingData: function (callback, _preInvoicedUpdateBalanceFlag, _menuType, searchParam, self) {

        var _self = self;
        this.isMultiCust = this.totalCount > 1 ? true : false;
        callback(_preInvoicedUpdateBalanceFlag, _menuType);

    },

    // 데이터 검색
    dataSearch: function (initFlag) {
        //거래처 관리 대장에서 이동 됐을때는 체크 하지 않는다.
        if (this.isSearchBtnClick == true) {
            // 출력물 or 양색 or 다중 거래처 페이지 이동
            var formSer = this.header.getControl("formList", "all") ? this.header.getControl("formList", "all").getValue() : "";
            var sCustCnt = this.header.getControl("txtSCustCd", "all").getSelectedItem().length;

            var userParam = {
                C_formSer: formSer,
                C_formGubun: this.formTypeCode,
                C_formSer1: this.selected1,
                C_formSer2: this.selected2,
                C_formSer3: this.selected3
            };
            var Gubun0 = this.header.getControl("rbGubun0", "all").getValue();
            if (Gubun0 == "4")
                if (this.formTypeCode == "AO010") {
                    userParam.C_formSer1 = formSer;
                    this.selected1 = formSer;
                }
                else if (this.formTypeCode == "AO011") {
                    userParam.C_formSer2 = formSer;
                    this.selected2 = formSer;
                }
                else if (this.formTypeCode == "AO012") {
                    userParam.C_formSer3 = formSer;
                    this.selected3 = formSer;
                }

            if ((formSer == "99999" || formSer != "99999") && this.totalCount <= 1) {
                var _self = this;
                _self.finalHeaderSearch = this.header.extract("all").merge();  // 페이지 이동을 위해 현재 검색 조건 컨트롤 담는다
                var url = "";
                if (formSer == "99999") {
                    url = "/ECERP/EBZ/EBZ029R";
                }
                else if (formSer != "99999") {
                    url = "/ECERP/EBZ/EBZ056R";
                }

                if (url != "") {
                    var param = {
                        IsHeaderSearch: "N",  // 상단 검색 창이 보일지 말지
                        IsOpenPopup: "N",      // 팝업으로 오픈 됐는지 여부
                        IsSelfOpenPopup: "Y",   // 거래처 관리 대장에서 팝업으로 오픈 한건지 여부
                        BalanceCheckYn: "N",
                        FormSer: _self.header.getControl("formList") ? _self.header.getControl("formList").getValue() : "",
                        RPT_GUBUN: this.RPT_GUBUN
                    }

                    this.onAllSubmitSelf({
                        url: url,
                        formdata: _self.finalHeaderSearch,
                        param: param,
                        _userParam: $.extend(this._userParam, userParam)
                        
                    });
                    return;
                }
            }
        }

        var currentTabIdAtHeader = "all";
        this.intPageIndexFooter = 0;
        this.businessLineNum = 0;
        this.custLimitLine = 0;
        this.header.getButton("search").show();
        this.intPageIndexHeader = 0;
        var res = ecount.resource;
        var inventory = ecount.config.inventory;
        var company = ecount.config.company;
        var settings = widget.generator.grid(),
            settingsTop = widget.generator.grid(),
            settingsData = widget.generator.grid(),
            gridData = this.contents.getGrid("dataGrid-" + this.pageID);

        var self = this;
        var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);

        //집계구분
        var gubun0 = searchParam.GUBUN0;
        if (gubun0 == "1") {
            searchParam.GUBUN_0 = "1";
            searchParam.GUBUN2 = "1";
        } else if (gubun0 == "4") {
            searchParam.GUBUN_0 = "1";
            searchParam.GUBUN2 = "2";
        } else if (gubun0 == "2") {
            searchParam.GUBUN_0 = "2";
            searchParam.GUBUN2 = "1";
        } else if (gubun0 == "3") {
            searchParam.GUBUN_0 = "3";
            searchParam.GUBUN2 = "1";

        } else if (gubun0 == "5") {
            searchParam.GUBUN_0 = "1";
            searchParam.GUBUN2 = "3";
        }

        if (!$.isNull(this.RPT_GUBUN)) {
            searchParam.GUBUN1 = this.RPT_GUBUN;
        }

        searchParam.FORM_SER = this.header.getControl("formList", "all") ? this.header.getControl("formList", "all").getValue() : "";

        this.cCustNo = "";

        if (this.isMoreFlag) {
            searchParam.PAGE_SIZE = this.maxCount;
        } else {
            searchParam.PAGE_SIZE = this.baseCount;
        }

        if (!this._userParam) {
            searchParam.SORTCOL_INDEX = "0";
        }

        if (this.C_formGubun != null && this.C_formGubun != undefined) {
            searchParam.FORM_GUBUN = this.C_formGubun;
        }

        searchParam.GUBUN_1 = searchParam.GUBUN1; 
        searchParam.GUBUN_2 = searchParam.GUBUN2;     
        
        this.searial = 0;

        var param = {
            project: ((ecount.config.company.USE_PJT == "Y" || ecount.config.company.USE_PJT_FLAG) && ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C") ? this.header.getControl("txtPjtCd", "all").getSelectedLabel() : "",

            dateFrom: searchParam.BASE_DATE_FROM,
            dateTo: searchParam.BASE_DATE_TO
        };

        this.searchConditionTitle = ecount.document.getSearchConditionTitle("account", param);
        this.rightHtml = this.searchConditionTitle.period;

        if (this.IsShowSearchForm == "3") {
            rightHtml = "<button type='button' class='btn btn-default btn-xs' onclick='return window[\"" + ecount.page.prefix + this.pageID + "\"].morePop()'>" + res.BTN00108 + "</button>";
        }

        if (this.viewBag.InitDatas.bodyRowCountList) {
            this.bodyRowCount = this.viewBag.InitDatas.bodyRowCountList[searchParam.FORM_SER];
        }

        searchParam.SIGN_BOX = this.header.getControl("EtcChk", currentTabIdAtHeader).get(0).getValue();
        searchParam.FOREIGN_CHK = this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbNoCust") == null || this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbNoCust") == undefined ? "0" : (this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbNoCust").getValue() == false ? "0" : "1")

        searchParam.CUST_DESC = this.header.getControl("txtSCustCd", currentTabIdAtHeader) && this.header.getControl("txtSCustCd", currentTabIdAtHeader).getSelectedLabel().join(ecount.delimiter);
        searchParam.CUST_LEVEL_DESC = this._getSelectedLabels("txtTreeCustCd", currentTabIdAtHeader);
        searchParam.CUST_GROUP1_DESC = this._getSelectedLabels("txtCustGroup1", currentTabIdAtHeader);
        searchParam.CUST_GROUP2_DESC = this._getSelectedLabels("txtCustGroup2", currentTabIdAtHeader);

        if (ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C") {
            searchParam.WH_DESC = this.header.getControl("txtSWhCd", currentTabIdAtHeader).getSelectedLabel().join(ecount.delimiter);
            searchParam.WH_LEVEL_DESC = this._getSelectedLabels("txtTreeWhCd", currentTabIdAtHeader);
        }
        else {
            searchParam.WH_CD = "";
            searchParam.WH_DESC = "";
            searchParam.WH_LEVEL_DESC = "";
        }

        if (ecount.config.company.USE_DEPT == "Y" && ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C" && this.header.getControl("txtSiteCd", currentTabIdAtHeader)) {
            searchParam.SITE_DESC = ecount.config.company.USE_DEPT == "Y" ? this.header.getControl("txtSiteCd", currentTabIdAtHeader).getSelectedLabel().join(ecount.delimiter) : "";
            searchParam.DEPT_LEVEL_DESC = ecount.config.company.USE_DEPT == "Y" ? this.header.getControl("txtTreeSiteCd", currentTabIdAtHeader).getSelectedLabel().join(ecount.delimiter) : "";
        }
        else {
            searchParam.SITE_CD = "";
            searchParam.SITE_DESC = "";
            searchParam.DEPT_LEVEL_DESC = "";
        }

        if ((ecount.config.company.USE_PJT == "Y" || ecount.config.company.USE_PJT_FLAG) && ecount.config.inventory.BOND_DEBT_SEARCH_TYPE != "C" && this.header.getControl("txtPjtCd", currentTabIdAtHeader)) {
            searchParam.PJT_DESC = ecount.config.company.USE_PJT == "Y" ? this.header.getControl("txtPjtCd", currentTabIdAtHeader).getSelectedLabel().join(ecount.delimiter) : '';
        }
        else {
            searchParam.PJT_CD = "";
            searchParam.PJT_DESC = "";
        }

        searchParam.NEWFLAG = this.NEWFLAG;
        searchParam.MAIN_CUST_CONVERT_YN = "N";
        searchParam.CUST_EMP = "";
        searchParam.INC_CUST = 0;
        searchParam.RPT_GUBUN = this.RPT_GUBUN;

        if (this.totalCount > 1) {
            searchParam.MCUST_GUBUN = 1;
            searchParam.PAGE_SIZE = this.baseCount;
            this.isDisplayTopData = false;
        }
        else if (this.totalCount == 0) {
            searchParam.MCUST_GUBUN = 0;
            searchParam.PAGE_SIZE = this.baseCount;
            this.isDisplayTopData = false;
        }
        else {
            searchParam.MCUST_GUBUN = 0;
            searchParam.PAGE_SIZE = this.baseCount;
            this.isDisplayTopData = true;
        }

        searchParam.PAGE_ID = "EBZ056R";
        searchParam.CUST_FIRST = searchParam.CUST.split(ecount.delimiter)[0];
        searchParam.FOREIGN_AMT_FLAG = this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbMainCustFlag") == null || this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbMainCustFlag") == undefined ? "0" : (this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbMainCustFlag").getValue() == false ? "0" : "1")
        searchParam.TOTAL_COUNT = this.totalCount;

        if (this.IsSelfOpenPopup == "Y") {
            this.header.getControl("EtcChk", "all").get(2).setValue(0, false, true);
        }
        searchParam.NO_CUST = this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbNoCust") == null || this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbNoCust") == undefined ? "0" : (this.header.getControl("EtcChk", currentTabIdAtHeader).get("cbNoCust").getValue() == false ? "0" : "1")

        if ($.isEmpty(searchParam.CUST) && !$.isEmpty(this.strCustF) && searchParam.MCUST_GUBUN != "1" && searchParam.NO_CUST != "1") {
            searchParam.CUST = this.strCustF;
        }

        var apiUrl1Cust = "";
        this.isSearchData = true;

        if (searchParam.GUBUN_1 == "3")
            searchParam.FORM_GUBUN = "AO012";
        else if (searchParam.GUBUN_1 == "2")
            searchParam.FORM_GUBUN = "AO011";
        else
            searchParam.FORM_GUBUN = "AO010";

        var ZERO_DISPLAY_YN = ecount.config.company.ZERO_DISPLAY_YN ? "9" : "8";
        var ZERO_CHK = ecount.config.company.ZERO_CHK_YN;
        
        apiUrl1Cust = '/Account/Others/GetReceivableByCustManageByDynamicTemplate';

        settingsData.setHeaderTopMargin(this.header.height());
        settingsData.setHeaderFix(false);
        settingsData.setColumnFixHeader(true);
        settingsData.setStyleBoldOnMergeRow(true);
        settingsData.setEmptyGridMessage(res.MSG00205);
        settingsData.setGridTypeMultipleGridPerPage(false);
        settingsData.setGridTypeUseTableCutLine(false);
        settingsData.setRowDataUrl(apiUrl1Cust);
        settingsData.setKeyColumn(['CUST']);
        settingsData.setCheckBoxUse(true);
        settingsData.setPagingUse(true);
        settingsData.setCheckBoxRememberChecked(true);
        settings.setEventShadedColumnId(["CUST", "CUST_DES"], true);    // 음영 추가
        settings.setEventGroupShaded(false, ["CUST", "CUST_DES"]);    // 음영 추가

        settingsData.setEventShadedColumnId(['CUST'], false);

        settingsData.setCheckBoxCallback({
            'click': function (e, data) {
            }
        })
        settingsData.setPagingRowCountPerPage(15, true);
        settingsData.setPagingUseDefaultPageIndexChanging(true);
        settingsData.setHeaderTopRightHTML(this.searchConditionTitle.period);


        var amt1_resource = "";
        var amt2_resource = "";
        if (searchParam.GUBUN_1 == "1") {
            amt1_resource = ecount.resource.LBL02935;
            amt2_resource = ecount.resource.LBL01685;
        }
        else if (searchParam.GUBUN_1 == "2") {
            amt1_resource = ecount.resource.LBL00640;
            amt2_resource = ecount.resource.LBL02627;
        }
        else {
            amt1_resource = ecount.resource.LBL02935;
            amt2_resource = ecount.resource.LBL01685;
        }

        searchParam.Columns = [];
        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'CUST', id: 'CUST', title: ecount.resource.LBL00381, fontSize: 11, width: 85 });
        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'CUST_DES', id: 'CUST_DES', title: ecount.resource.LBL00359, width: 200, fontSize: 11, align: 'left' });
        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'PREV_AMT', id: 'PREV_AMT', title: ecount.resource.LBL03236, width: 100, fontSize: 11, align: 'right' });

        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'AMT1', id: 'AMT1', title: amt1_resource, width: 80, fontSize: 11, align: 'right' });
        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'AMT2', id: 'AMT2', title: amt2_resource, width: 80, fontSize: 11, align: 'right' });


        if (searchParam.GUBUN_1 == "3") {
            searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'AMT1_1', id: 'AMT1_1', title: ecount.resource.LBL00640, width: 80, fontSize: 11, align: 'right' });
            searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'AMT2_1', id: 'AMT2_1', title: ecount.resource.LBL02627, width: 80, fontSize: 11, align: 'right' });
        }
        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'DISCOUNT', id: 'DISCOUNT', title: ecount.resource.LBL03243, width: 100, fontSize: 11, align: 'right' });
        searchParam.Columns.push({ index: searchParam.Columns.length, propertyName: 'BAL_AMT', id: 'BAL_AMT', title: ecount.resource.LBL02374, width: 105, fontSize: 11, align: 'right' });

        if (searchParam.Columns != null && searchParam.Columns != undefined) {
            settingsData.setColumns(searchParam.Columns);
        }

        settingsData.setCustomRowCell('CUST', this.setCustomCustLink.bind(this));
        settingsData.setCustomRowCell('PREV_AMT', this.setCustomPREV_AMT.bind(this));
        settingsData.setCustomRowCell('AMT1', this.setCustomAMT1.bind(this));
        settingsData.setCustomRowCell('AMT2', this.setCustomAMT2.bind(this));
        settingsData.setCustomRowCell('AMT1_1', this.setCustomAMT1_1.bind(this));
        settingsData.setCustomRowCell('AMT2_1', this.setCustomAMT2_1.bind(this));
        settingsData.setCustomRowCell('BAL_AMT', this.setCustomBAL_AMT.bind(this));

        //조회 시 검색 조건[Excel 등 조건 유지위해]  (When querying the search criteria [for Excel...])
        this.finalSearchParam = searchParam;
        this.finalSearchParam.ExcelTitle = this.searchConditionTitle.excelTitle;      // excel title
        this.finalHeaderSearch = this.header.extract("all").merge();  // 조회 당시 컨트롤 정보        
        this.finalSearchParam.isLoadPopup = this.isLoadPopup;
        if (initFlag) {
            this.cDateNo = "";
        }

        if (this._userParam && this._userParam.C_CurrentPage) {
            this.finalSearchParam.PAGE_CURRENT = this._userParam.C_CurrentPage;
        }
        if (this._userParam && this.isListOnly) {
            settingsData.setPagingCurrentPage(this._userParam.C_CurrentPage);
            settingsData.setPagingIndexChanging(function (e, data) {
                self.contents.getGrid("dataGrid-" + self.pageID).grid.settings().setPagingCurrentPage(self.finalSearchParam.PAGE_CURRENT);
                self.contents.getGrid("dataGrid-" + self.pageID).grid.render();
            });
        }
        gridData.setSettings(settingsData);
        gridData.draw(this.finalSearchParam);
        this.header.toggle(true);
        //조회 후 값 초기화 (initialization value)
        if (this.SearchMode) this.SearchMode = "";
        this.defaultSearchParam.SORTCOL_ID = '';
        this.defaultSearchParam.SORTCOL_INDEX = '0';

        this.isLoaded = true;
        this.defaultSearchParam.SORTCOL_ID = '';
        this.defaultSearchParam.SORTCOL_INDEX = '0';

        this.header.getButton("search").show();
        this.header.getButton("option").show();

    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_F8: function () {
        this.onHeaderSearch(true);
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //재집계 체크
    setUpdateBalance: function (preFlag, MenuType, _tophtml) {
        var _self = this;
        this._topHtml = _tophtml;
        if (preFlag) {
            _self.saveUpdateBalance(_self, MenuType, _self.resultUpdateBalance_Callback.bind(_self));
        }
        else {
            _self.saveUpdateBalance(_self, MenuType);
        }
    },

    resultUpdateBalance_Callback: function (data) {
        var _self = this;
        //
        if (data != null && data.JobType != null && data.JobType == "ByPass") {
            result = _self.saveUpdateBalance(_self, "A");   //미청구재집계 후 재집계해야할 메뉴타입 지정해주세요. (회계 : A, 재고 : S)
        } else {
            var resultData = data.split(ecount.delimiter);
            if (resultData[1] == "0") {
                if (resultData[2] != null && resultData[2] != "") {
                    ecount.config.account.SALE_BOND_DATE = resultData[2];
                    ecount.config.account.BUY_DEBT_DATE = resultData[2];
                }
                result = _self.saveUpdateBalance(_self, "A");   //미청구재집계 후 재집계해야할 메뉴타입 지정해주세요. (회계 : A, 재고 : S)
            }
        }
    },

    // 재집계 설정
    saveUpdateBalance: function (_self, MenuType, callback) {
        var _formID = "AM012";

        if (this.BalanceCheckYn == "N") {
            this.getCustVendInfoBeforeSearch();
        }
        else {
            var option = _self.setUpdateBalanceParam(_self, MenuType);
            var result = ecount.updatebalance.setting(_formID, option, callback);
            if (result == false && this.totalCount == 1) {
                this.getCustVendInfoBeforeSearch();
            }
        }
    },

    // 재집계 체크 후 검색
    getCustVendInfoBeforeSearch: function () {
        var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);

        var self = this;
        var infoParam = {};
        if (!this.isMultiCust) {
            infoParam.CUST_FIRST = searchParam.CUST.split(ecount.delimiter)[0];
        }
        else {
            infoParam.CUST_FIRST = searchParam.CUST;
        }
        infoParam.CUST_GROUP1 = searchParam.CUST_GROUP1;
        infoParam.CUST_GROUP2 = searchParam.CUST_GROUP2;
        infoParam.CUST_LEVEL_GROUP = searchParam.CUST_LEVEL_GROUP;
        infoParam.CUST_LEVEL_GROUP_CHK = searchParam.CUST_LEVEL_GROUP_CHK;
        infoParam.RPT_GUBUN = this.currentRptGubun;


        var checkCountParam = {};
        checkCountParam.CUST = searchParam.CUST;
        checkCountParam.CUST_GROUP1 = searchParam.CUST_GROUP2;
        checkCountParam.CUST_GROUP2 = searchParam.CUST_GROUP2;
        checkCountParam.CD_CUST_TREE = searchParam.CUST_LEVEL_GROUP;
        checkCountParam.CB_CUST_SUBTREE = searchParam.CUST_LEVEL_GROUP_CHK;
        checkCountParam.RPT_GUBUN = this.currentRptGubun;

        if (!$.isEmpty(searchParam.cbNoCust[0])) {
            self.dataSearch();
        }
        else {
            if (this.totalCount > 1) {
                self.dataSearch();
            }
            else {
                var callback = function (data) {
                    if (!$.isEmpty(data)) {
                        if (!self.isMultiCust) {
                            self.emkName = data.EMP_KNAME == null ? "" : data.EMP_KNAME;
                            self.custName = data.CUST_NAME == null ? "" : data.CUST_NAME;
                            self.strCustGubun = data.GUBUN;
                            self.strGyeDes0 = data.GYE_CODE;
                            self.strCustF = data.BUSINESS_NO;
                            self.dataSearch();
                        }
                        else {
                            self.emkName = data[0].EMP_KNAME == null ? "" : data[0].EMP_KNAME;
                            self.custName = data[0].CUST_DESC == null ? "" : data[0].CUST_DESC;
                            self.strCustGubun = data[0].GUBUN;
                            self.strGyeDes0 = data[0].GYE_CODE;
                            $.each(data, function (i, dt) {
                                self.strCustF += dt.BUSINESS_NO + "ㆍ";

                            });
                            self.dataSearch();
                        }
                    }
                    else {
                        self.isDisplayTopData = false;
                        self.dataSearch();
                    }
                }.bind(this);
                this.getCustInfo(infoParam, callback);
            }
        }
    },

    // 재집계 파라미터 설정
    setUpdateBalanceParam: function (_self, MenuType) {
        this.finalSearchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);

        var _from_date = this.finalSearchParam.BASE_DATE_FROM;
        var _to_date = this.finalSearchParam.BASE_DATE_TO;
        var _updateInven_flag = false;
        var _updateaccount_flag = false;
        var _updatePreInvoiced_flag = false;
        var _enableCheckMonthsAgo = 3;
        var _summary_flag = "2";
        var _sale_date = "";
        var _accountDate = "";
        var _account102Date = "";
        var _bondDate = "";
        var _debitDate = "";
        var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);
        if (MenuType == "S") {
            _updateInven_flag = true;
            _sale_date = "";
        }
        else if (MenuType == "A") {

            _updateaccount_flag = true;
            _summary_flag = "2";            //(this is param for Accont) A: ACC102,ACC105 , 1: ACC102, 2:ACC105
            _enableCheckMonthsAgo = 3;      //전전전월 : 3, 전전월 : 2, 당월 : 0
            _accountDate = this.viewBag.WidgetDatas["widget.configAccount"].config["AcctDate"];
        }
        else if (MenuType == "R" || MenuType == "P" || MenuType == "B") {
            _updatePreInvoiced_flag = true;
            _bondDate = ecount.config.account.SALE_BOND_DATE;
            _debitDate = ecount.config.account.BUY_DEBT_DATE;
        }

        var options = {
            saleDate: _sale_date,
            accountDate: _accountDate,
            bondDate: _bondDate,
            debitDate: _debitDate,
            base_from_date: (_from_date.substr(0, 4) + _from_date.substr(4, 2) + _from_date.substr(6, 2)),
            base_to_date: (_to_date.substr(0, 4) + _to_date.substr(4, 2) + _to_date.substr(6, 2)),
            updatebalance_inventory_flag: _updateInven_flag || false,
            updatebalance_account_flag: _updateaccount_flag || false,
            updatebalance_preinvoiced_flag: _updatePreInvoiced_flag,
            MonthlyClosing_flag: true,
            summary_flag: _summary_flag || 2,
            EnableCheckMonthsAgo: _enableCheckMonthsAgo,
            MENU_TYPE: MenuType,
            Flag_From_To: true,
            thispage: _self
        }

        return options;
    },

    // 거래처 정보 불러오기
    getCustInfo: function (infoParam, callBack) {
        var self = this;
        ecount.common.api({
            url: "/Inventory/Others/GetCustVendTotalCount",
            data: Object.toJSON(infoParam),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                    return false;
                }
                else {
                    if (!self.isMultiCust) {
                        var data = result.Data.Data[0];
                        callBack && callBack(data);
                    }
                    else {
                        var data = result.Data.Data;
                        callBack && callBack(data);
                    }
                }
            }
        });
    },

    _getSelectedLabels: function (id, tabId) {
        var _tabId = (tabId == undefined || tabId == "") ? "all" : tabId;
        var ctr = this.header.getControl(id, _tabId);
        if (ctr == undefined)
            return "";
        return ctr.getSelectedLabel().join(ecount.delimiter);
    },

    // 페이지 다시 로딩(검색항목설정 등등.....)
    reloadPage: function (pageID) {
        var self = this;
        var IsHeaderSearch = ($.isEmpty(self.finalHeaderSearch)) ? "Y" : "N";

        var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);

        var param = {
            IsHeaderSearch: IsHeaderSearch,  // 상단 검색 창이 보일지 말지
            IsOpenPopup: this.IsOpenPopup,      // 팝업으로 오픈 됐는지 여부
            IsSelfOpenPopup: "Y",   // 거래처 관리 대장에서 팝업으로 오픈 한건지 여부
            IsOpenPopup2: "Y",
            BalanceCheckYn: "N",
            FormSer: self.header.getControl("formList") ? self.header.getControl("formList").getValue() : "",
            RPT_GUBUN: self.RPT_GUBUN
        }

        this.onAllSubmitSelf({
            url: "/ECERP/EBG/EBG005M",
            formdata: self.finalHeaderSearch,
            param: param
        });
    },

    // 일자 설정
    fnGetDateFromString: function (strDate) {
        return new Date(strDate.substring(0, 4), strDate.substring(4, 6) - 1, strDate.substring(6, 8));
    },

    // 팝업에서 받는 리턴값(입력화면)
    _ON_REDRAW: function (param) {
        this._super._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }
        this.setReload((param && param.editDateNo || ""));
    },

    // 그리드 바인딩
    setReload: function (editDateNo) {
        this.cDateNo = "";
        if ($.isEmpty(editDateNo) == false) {
            this.cDateNo = editDateNo;
            this.clickedRowId = editDateNo;
        }
        this.intPageIndexFooter = 0;
        this.intPageIndexHeader = 0;
        this.contents.getGrid("grid-" + this.pageID).draw(this.finalSearchParam);
    },

    // get date 105
    getDate105: function (sDate) {
        var s_DATE_2 = sDate.toDate();
        s_DATE_2 = (s_DATE_2.addMonths(-2).format("yyyyMM") + "01").toDate();
        // Get ACCT_DATE
        if (ecount.config.account.ACCT_DATE.toDate() < s_DATE_2)
            sDate = s_DATE_2.format("yyyyMM") + "01";
        else {
            if (ecount.config.account.ACCT_DATE.toDate() < sDate.toDate())
                sDate = ecount.config.account.ACCT_DATE.substring(0, 6) + "01";
            else
                sDate = sDate.toDate().addDays(-1).format("yyyyMM") + "01";
        }
        return sDate;
    },

    /**
   * 회계 기수 체크
   **/
    getPhaseCheck: function () {
        var self = this;
        //addDays(-1) 로직은 1일기준으로 전달로 변경하는 로직인걸로 추측되나 ToDate로 변경하면 의미가 없음
        //그렇지만 다시 From으로 변경할때 문제가 생길 소지가 있기때문에 그냥놔둠(팀장님 체크[박철민]) By 류상민
        var baseDateFrom = self.header.getSafeControl("ddlSYear").getDate()[1].format('yyyyMMdd');
        var sDate = self.getDate105(baseDateFrom.toDate().addDays(-1).format("yyyyMMdd"));
        var isEmptyPhase = false;

        if (!$.isEmpty(sDate)) {
            ecount.common.api({
                async: false,
                url: "/Account/Common/CheckAccountPhase",
                data: { INPUT_DATE: sDate },
                success: function (result) {
                    if (result.Status != "200")
                        ecount.alert(result.fullErrorMsg);
                    else {
                        if (result && result.Data) {
                            self.openWindow({
                                url: "/ECERP/EMG/EMG001P_16",
                                name: ecount.resource.LBL07973,
                                param: { height: 230, width: 500 },
                                popupType: false,
                                fpopupID: self.ecPageID
                            });
                            isEmptyPhase = true;
                        }
                    }
                }.bind(this)
            });
        }

        return isEmptyPhase;
    },

    setCustomPREV_AMT: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (this.finalSearchParam.GUBUN_2 == "3")
            return this.fnFormatForeignAmount(value, rowItem.PREV_AMT_F, option);
        else
            return option;
    },

    setCustomAMT1: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (this.finalSearchParam.GUBUN_2 == "3")
            return this.fnFormatForeignAmount(value, rowItem.AMT1_F, option);
        else
            return option;
    },

    setCustomAMT2: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (this.finalSearchParam.GUBUN_2 == "3")
            return this.fnFormatForeignAmount(value, rowItem.AMT2_F, option);
        else
            return option;
    },

    setCustomAMT1_1: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (this.finalSearchParam.GUBUN_2 == "3")
            return this.fnFormatForeignAmount(value, rowItem.AMT1_1_F, option);
        else
            return option;
    },

    setCustomAMT2_1: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (this.finalSearchParam.GUBUN_2 == "3")
            return this.fnFormatForeignAmount(value, rowItem.AMT2_1_F, option);
        else
            return option;
    },

    setCustomBAL_AMT: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (this.finalSearchParam.GUBUN_2 == "3")
            return this.fnFormatForeignAmount(value, rowItem.BAL_AMT_F, option);
        else
            return option;
    },

    fnFormatForeignAmount: function (value, value_f, option) {
        var item1 = "";
        var item2 = "";

        if (value == "0") {
            item1 = ecount.config.company.ZERO_DISPLAY_YN == true ? value : "";
        } else {
            item1 = value;
        }

        if (value_f == "0") {
            item2 = ecount.config.company.ZERO_DISPLAY_YN == true ? "(" + value_f + ")" : "";
        } else if (value_f != "") {
            item2 = "(" + value_f + ")";
        }

        if (item2 != "")
            item1 += '<br />';

        option.data = item1 + item2;
        return option;
    },

    getFormListSearchOption: function () {
        if (this.viewBag.InitDatas.allowFormList1.length > 0) {
            var option, selectedValue;
            var self = this;

            var optionList = this.setFormListSearchOptionSort(this.viewBag.InitDatas.allowFormList1);

            var formList = (function (optionList) {
                var option = [];
                var selectedValue;
                var selectedValueZA;
                var firstSelectedValue;
                var textDanger = "";

                //우선순위
                //1.사용자가 등록한 기본양식
                //2.사용자가 등록한 첫번째 양식
                //3.출력물||기본값
                for (var i = 0, len = optionList.length; i < len; i++) {
                    // 기본설정
                    // 사용자가 등록한 기본양식
                    if (optionList[i].ORD == 0 && optionList[i].BASIC_TYPE == "0") {
                        selectedValue = optionList[i].FORM_SEQ;
                    }

                    option.push([optionList[i].FORM_SEQ, optionList[i].TITLE_NM.length > 10 ? optionList[i].TITLE_NM.substr(0, 10) : optionList[i].TITLE_NM, textDanger]);
                }

                //사용자가 등록한 첫번째 양식
                if (!selectedValue) {
                    if (optionList.clone().filter(function (item) { return item.ORD == 0 }).sort(function (a, b) { return a.FORM_SEQ > b.FORM_SEQ; }).length > 0) {
                        firstSelectedValue = optionList.clone().filter(function (item) { return item.ORD == 0 })
							.sort(
								function (a, b) {
								    if (a.FORM_SEQ > b.FORM_SEQ) return 1;
								    if (a.FORM_SEQ < b.FORM_SEQ) return -1;
								    return 0;
								})[0].FORM_SEQ;
                    }

                    //출력물||기본값
                    if (!firstSelectedValue) {
                        var zaFormSeq = optionList.filter(function (item) { return item.ORD == 1; })
                        var outputSeq = zaFormSeq.filter(function (item) { return item.BASIC_TYPE == "1" });     //출력물
                        var defaultSeq = zaFormSeq.filter(function (item) { return item.BASIC_TYPE == "0" });    //기본

                        selectedValue = outputSeq.length > 0 ? (outputSeq[0] ? outputSeq[0].FORM_SEQ : "") : (defaultSeq[0] ? defaultSeq[0].FORM_SEQ : "");
                    }
                    else {
                        selectedValue = firstSelectedValue;
                    }
                }

                return {
                    option: option, selectedValue: selectedValue
                };
            }.bind(this))(optionList);

            option = formList.option;
            selectedValue = formList.selectedValue;
            return { option: $.isEmpty(option) ? null : option, select: selectedValue, selectedValue: selectedValue };
        }
        else {
            return [];
        }
    },

    setFormListSearchOptionSort: function (list) {
        list.forEach(function (item) {
            if (item.FORM_SEQ > 999 && item.FORM_SEQ < 9000) {
                item.FORM_SEQ = 0;
            }
        });

        return list.sort(function (a, b) {
            if (a.ORD == 1) { return -1; }
            if (b.ORD == 1) { return 1; }

            if (a.TITLE_NM > b.TITLE_NM) { return 1; }
            if (a.TITLE_NM < b.TITLE_NM) { return -1; }

            return 0;
        });
    },

});