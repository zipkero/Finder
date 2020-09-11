window.__define_resource && __define_resource("LBL93091","BTN00330","BTN00172","LBL01457","BTN00493","MSG00205","MSG02158","LBL07728","LBL01632","MSG01136","MSG04553","MSG00909","MSG00908","MSG00706","MSG00213","MSG00342","MSG00299","MSG04944","LBL03176","BTN00430","BTN00148","BTN00260","BTN00035","BTN00079","LBL03682","LBL09909","MSG10020","LBL09336","LBL01118","LBL01099","LBL01788","LBL01789","LBL08609","LBL08619","BTN00054","MSG09307","LBL02748","LBL02253","LBL02186","LBL01618","MSG00141","LBL06600","LBL06601","LBL06602","LBL06603","MSG02306","LBL02506","MSG04617","LBL01042","MSG07882");
/****************************************************************************************************
1. Create Date : 2016.12.19
2. Creator     : Le Minh Hoang
3. Description : Acct. I > Voucher > Unconfirmed Voucher List
4. Precaution  :
5. History     : Nguyen Duc Tai (2018.05.22):  change isIncludeInactive of txtFirstWriteID to true
               : 2019.02.13 Nguyen Thi Ngoc Han [A18_04310] 1.add more this.contents.getGrid() before use function grid.getColumnInfoList() at funtion CustomTotal2, CustomTotal3
                                                            2. fix Existing error add more parameter to function onAllSubmit() at function reloadPage()
                                                            3. fix Existing error at function onMessageHandler with case "CM100P_02" change from call reloadPage() to call onHeaderSearch() then setup template Journals
                 [2019.04.23][On Minh Thien] A19_01342 (간편검색 공통화 적용 누락 페이지 재요청)
                 2019.06.06 (Duyet): Add more logic for show popup by type openWindow (Menu By Receipt)
                 2018.06.05 (이현택) - 계정코드 체크 갯수 100개로 제한
                 2019.06.21 (PhiVo): A19_01670-수정화면 진입시 화면전환이아닌 모달창으로 뜨도록
                 2019.06.25 (Duyet): Change logic check for menu Log Misc Expenses to NF 3.0
                 2019.07.16 (Hao): Change logic check for menu Cash > To Others to NF 3.0
                 2019.07.15 (Duyet): Change logic check for menu Loan Repayment ＆ Interest to NF 3.0
                 2019.07.25 (Hao): Change logic check for menu Import > Update Account to NF 3.0
                 2019.08.01 (AiTuan): A19_02423 전표조회/수정 내 전표인쇄 항목과 결의서인쇄 항목 분리 
                 2019.08.12 (tuan): Change logic check for menu None Cash > Receipt to NF 3.0
                 2019.12.24 (Lap): A19_04086_SetIntervalTask
                 2020.01.22 (박철민) - A18_02228 - 양식설정공통화 - 지출결의서인쇄
6. Menupath    : Acct. I > Voucher > Unconfirmed Voucher List (login with special com_code)
7. Old file    : EBG/EBG001M.aspx
****************************************************************************************************/


ecount.page.factory("ecount.page.list", "EBG015M", {
    /********************************************************************** 
    * Page user opion Variables
    **********************************************************************/
    formTypeCode: null,                     // Resource Settings Form type()
    finalSearchParam: null,                 // Search Information()
    finalHeaderSearch: null,                // The header information of the time to search()
    strPFlag: "0",
    strGbType: "2",
    rptForm: "BEFORE",
    strBeforeFlag: "Y",
    journalFlag: '0',
    userPermit: null,
    acctPermit: null,
    buyPermit: null,
    salePermit: null,
    make1Permit: null,
    make2Permit: null,
    strPermit: null,
    strSlipType1: "2",
    BalanceBasis: false,
    checkDate: null,
    popupDataPrint: {},
    perType: "",
    FirstRow: 0,
    eapprovalWindow: "",   //전자결재 팝업 Window,
    eapprovalList: "",      //Approval list(danh sách chứng thực)
    searchXmlapproval: "",
    isShowNextSlipOfPrePage: false,  // 전 페이지에서 다음전표 보여주는 여부

    splitFlag: "ㆍ",
    columnMap: {
        IO_TYPE: "IO_TYPE", GB_TYPE: "GB_TYPE3", VERSION: "VERSION_NO", TRX_DATE: "TRX_DATE", TRX_NO: "TRX_NO", CONFIRM_FLAG: "CONFIRM_FLAG", TRX_TYPE: "TRX_TYPE", SER_NO: "SER_NO"
    },

    /****************************************************************************************************
    * page initialize(khỏi tạo trang)
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        if (this.isShowSearchForm == null)
            this.isShowSearchForm = "2";
        window.thisPage = this;
        if (this._userParam != undefined)
            this.isShowSearchForm = this._userParam.isShowSearchForm;

        this.useSlipAuth = ecount.config.user.SLIP_PER_TYPE == "1" ? true : (ecount.config.user.SLIP_AUTH_TYPE == "4" ? false : true);

        this.registerDependencies("common.guides.api", "ecmodule.account.common");

    },

    // initProperties
    initProperties: function () {
        this.pageOption = $.extend({}, this.pageOption, this);
        // User Permit (Quyền người dùng)
        this.userPermit = this.viewBag.Permission.strUserPermit.Value;
        this.acctPermit = this.viewBag.Permission.strAcctPermit.Value;
        this.buyPermit = this.viewBag.Permission.strBuyPermit.Value;
        this.salePermit = this.viewBag.Permission.strSalePermit.Value;
        this.make1Permit = this.viewBag.Permission.strMake1Permit.Value;
        this.make2Permit = this.viewBag.Permission.strMake2Permit.Value;
        this.sTetOrderPermit = this.viewBag.Permission.strSTetOrderPermit.Value;
        this.strSlipType1 = "2";
        this.perType = this.StrPerType;
        this.checkDate = this.viewBag.InitDatas.DateFormat;
        this.journalFlag = this.JournalFlag;
        var datalimit = this.viewBag.InitDatas.FConfig.W_DATE;
        if (parseInt(datalimit) > 20141023) {
            this.strNewCodeFlag = "Y";
            this.acctPermit = this.userPermit;
        }

        //Search Param (Tham số tìm kiếm)
        this.finalSearchParam = {
            PARAM: this.PARAM || ''
        }
        var infoData = this.viewBag.InitDatas;
        //setting depend on journal
        if (this.journalFlag == "0") {
            this.formInfoData = this.viewBag.FormInfos["AR070"];
            this.formTypeCode = "AR070";
        } else {
            this.formInfoData = this.viewBag.FormInfos["AR080"];
            this.formTypeCode = "AR080";
        }
        this.saleAutoCodeInfo = infoData.autoCodeItems;
        this.journalPageSize = this.PageSizeLimitedWithJournal;

        this.defaultSearchParameter = {
            FORM_GUBUN: this.formTypeCode,
            FORM_SER: 1,
            PAGE_SIZE: this.formInfoData.option.pageSize,
            LIST_FLAG: '1',
            GB_TYPE: '2',
            JFLAG: "0",
            ETCVAL: "0",
            SLIP_TYPE: "2",
            SITE: this.site_Cd,
            PAGE_CURRENT: 1,
            SEARCH_RANGE: this.viewBag.Permission.strUserPermit2.SR //this.viewBag.Permission.strUserPermit2._searchRange
        };

        this.FormType = {
            Type1: '',
            Type2: '',
            Type3: ''
        };

        this.popupDataPrint = {
            hidSearchXml: "",
            hidSelValue: "",
            hidPrint: "",
            hidSlipMode: ""
        };
    },

    //render
    render: function () {
        this.pageOption = $.extend({}, this.pageOption, this);
        this.pageOption.SearchParam = $.extend({}, this.SearchParam, this);
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting(tùy chỉnh giao diện)
    ****************************************************************************************************/
    //Headers option settings(tùy chỉnh tiêu đề)
    onInitHeader: function (header, resource) {
        var self = this;
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar();

        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .search("search", null, "list")

        tabContents
            .onSync()
            .setType("AN860")
            .setOptions({
                showFormLayer: this.isShowSearchForm == "1" ? true : false,
            })
            .filter(function (control) {
                // Whether the project (Project, whether to use)(kiểm tra mã dự án)
                if (control.id === "txtPjtCd" && ecount.config.company.USE_PJT != "Y")   // USE_PJT = "N" Not display and = "Y" display
                    return false;
                if (control.id === "txtSiteCd" && ecount.config.company.USE_DEPT != "Y")   // USE_DEPT = "N" Not display and = "Y" display
                    return false;
                if (control.id === "txtTreeSiteCd" && ecount.config.company.USE_DEPT != "Y")   // USE_DEPT = "N" Not display and = "Y" display
                    return false;
                // Management no use flag(quản lý sử dụng)
                if (control.id == "txtDocNo" && self.saleAutoCodeInfo.USE_DOCNO != true) {
                    return false;
                }
            });

        contents.add(tabContents).add(toolbar);
        header.useQuickSearch(); //Displayed on screen when loading(trình chiếu lên màn hình khi quay lại trang)
        header.setTitle(ecount.resource.LBL93091);

        header.add("search", null, false)  //type, button list(danh sách nút nhấn và loại)
            .add("option", [
                { id: "templateSetting", label: ecount.resource.BTN00330 },
                { id: "CustomizeJournal", label: ecount.resource.BTN00172 },
                { id: "SelfCustomizing", label: ecount.resource.LBL01457 },
                { id: "searchTemplate", label: ecount.resource.BTN00493 }
            ], false)
            .addContents(contents);
    },

    //Init content (Khởi tạo nội dung)
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            grid = g.grid();

        this.BalanceBasis = ecount.config.inventory.USE_BALANCE_BASIS;

        grid
            .setRowData(this.viewBag.InitDatas.LoadData)

            .setHeaderFix(true)
            .setColumnFixHeader(true)
            .setFooterBottomRightHTML(this.timeStamp)
            .setEmptyGridMessage(ecount.resource.MSG00205)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(self.ecount.resource.MSG02158, maxcount)); }) // Alert user(cảnh báo người dùng)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setColumnSortable(false)
            .setPagingUse(true)
            .setCheckBoxRememberChecked(true)
            .setEventShadedColumnId(['acc100.trx_date_no', 'acc101.trx_date_no'], { isAllRememberShaded: true, useShadedCellData: true })
            .setEventGroupShaded(true, ['acc100.trx_date_no', 'acc101.trx_date_no'])
            .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, this.setGridCheckboxOption.bind(this))   //CheckBox option (tùy chỉnh lựa chọn)
            .setCustomRowCell('acc100.s_print', this.setGridS_PRINT.bind(this))
            .setCustomRowCell('acc100.s_print_s', this.setGridS_PRINT_S.bind(this))
            .setCustomRowCell('acc100.ser_no', this.setGridSERNO.bind(this))
            .setCustomRowCell('ACSL_DOC_NO.CODE_NO', this.setGridCODE_NO.bind(this))
            .setCustomRowCell('acc101.cr_amt', this.setGridCredit.bind(this))
            .setCustomRowCell('acc101.dr_amt', this.setGridDr.bind(this))
        ;

        //Setting grid depend on journal or not
        if (this.journalFlag == "1") {
            grid.setRowDataUrl('/Account/Voucher/GetVoucherListJournal')
                .setKeyColumn(['TRX_DATE', 'TRX_NO', 'SLIP_NO', 'SLIP_SER'])
                .setStyleRowBackgroundColor(this.setRowBackgroundColorJournal.bind(this), 'danger')
                .setCustomRowCell('acc101.trx_date_no', this.setConnectVoucherJournal.bind(this))
                .setCheckBoxUse(false);
        } else {
            grid.setRowDataUrl('/Account/Voucher/GetVoucherList')
                .setKeyColumn(['TRX_DATE', 'TRX_NO'])
                .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
                .setCustomRowCell('acc100.trx_date_no', this.setConnectVoucher.bind(this))
                .setCheckBoxUse(true)
                .setCheckBoxMaxCount(this.canCheckCount);
        }

        contents
            .addGrid("dataGrid", grid);
    },

    //Footer Options settings(thiết lập tùy chỉnh phần dưới của trang)
    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        footer.add(toolbar);
    },

    // set default value for search controls
    // khởi tạo giá trị mặc định cho các search controls
    onInitControl: function (cid, control) {
        var res = ecount.resource;
        var ctrl = widget.generator.control();
        if (cid == "txtSCustCd") {
            control.setOptions({
                isApplyDisplayFlag: true,
                isCheckBoxDisplayFlag: true,
                checkMaxCount: 100,
                isIncludeInactive: true
            });
        }
        if (cid == "txtCustEmpCd" || cid == "txtItemCd" || cid == "txtSProdCd" || cid == "txtLastUpdatedID" || cid == "rbQcInspectFirstUpdate") {
            control.setOptions({
                isApplyDisplayFlag: true,
                isCheckBoxDisplayFlag: true,
                checkMaxCount: 100,
                isIncludeInactive: true
            });
        }
        switch (cid) {
            case "EtcChk":
                var ctrl = widget.generator.control();
                control
                    .addControl(ctrl.define("widget.checkbox", "JOURNAL", "JOURNAL").label([ecount.resource.LBL07728]).value([1]).select(['0']));
                break;
            case "cbGCustFlag":
                control.label(ecount.resource.LBL01632).value('1');
                break;
            case "txtCustEmpCd":
                control.setOptions({
                    isApplyDisplayFlag: true,
                    isCheckBoxDisplayFlag: true
                });
                break;
            case 'txtDocNo':
                control.filter('maxlength', { message: String.format(res.MSG01136, '30', '30'), max: 30 });
                break;
            case "txtEMoney":
                control.inline().setOptions({ _betweenSuffix: ['F', 'T'] }).numericOnly(18, 2, ecount.resource.MSG04553).end();
                break;
            case "txtPjtCd":
                control.isApplyDisplayFlag = true;
                control.isCheckBoxDisplayFlag = true;
                control.isIncludeInactive = true;
                control.checkMaxCount = 100;
                control.searchCategoryFlag = 'A';
                break;
            case "txtAccCase":
                control.isApplyDisplayFlag = true;
                control.isCheckBoxDisplayFlag = true;
                control.isIncludeInactive = true;
                break;
            case "txtTreeSiteCd":
                control.isApplyDisplayFlag = true;
                control.isCheckBoxDisplayFlag = true;
                control.checkMaxCount = 100;
                control.parentID = 'txtTreeSiteCd';
                break;
            case "txtGyeCode":
                control.isApplyDisplayFlag = true;
                control.isCheckBoxDisplayFlag = true;
                break;
            case "txtCustGroup1":
                control.isApplyDisplayFlag = true;
                control.isIncludeInactive = true;
                control.isCheckBoxDisplayFlag = true;
                break;
            case "txtCustGroup2":
                control.isApplyDisplayFlag = true;
                control.isIncludeInactive = true;
                control.isCheckBoxDisplayFlag = true;
                break;
            case "txtTreeCustCd":
                control.isApplyDisplayFlag = true;
                control.isCheckBoxDisplayFlag = true;
                control.checkMaxCount = 100;
                break;

            case "txtBillNo":
                control.isIncludeInactive = true;
                control.isApplyDisplayFlag = true;
                control.checkMaxCount = 100;
                break;
            default: break;
        }
    },

    // Event init control submit
    onInitControl_Submit: function (cid, control) {
        var res = ecount.resource;
        if (cid == "txtBillNo") {
            control.setOptions({
                checkMaxCount: 100,
                isIncludeInactive: true,
                isApplyDisplayFlag: true
            })

        }
        if (cid == "txtEMoney") {
            control.inline().setOptions({ _betweenSuffix: ['F', 'T'] }).numericOnly(18, 2, ecount.resource.MSG04553).end();
        }
        if (cid == "txtGyeCode") {
            control.isApplyDisplayFlag = true;
            control.isCheckBoxDisplayFlag = true;
        }
        if (cid == "txtSCustCd" || cid == "txtCustEmpCd" || cid == "txtCustGroup1" || cid == "txtCustGroup2"
            || cid == "txtLastUpdatedID" || cid == "rbQcInspectFirstUpdate") {
            control.setOptions({
                isApplyDisplayFlag: true,
                isCheckBoxDisplayFlag: true,
                checkMaxCount: 100,
                isIncludeInactive: true
            });
        }
    },


    /****************************************************************************************************
    * define action event listener (định nghĩa sự kiện)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    // Reset header search param (Thiết lập tại điều kiện search)
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },

    onFooterEapproval: function (e) {
        var self = this;
        var selectItem = this.contents.getGrid().grid.getChecked();
        var formdata = { ERPS: [] };

        if (selectItem.length == 0) {
            ecount.alert(ecount.resource.MSG00909);
            return false;
        } else if (selectItem.length > 20) {
            ecount.alert(ecount.resource.MSG00908);
            return false;
        }

        $.each(selectItem, function (i, item) {
            formdata.ERPS.push({
                PRG_ID: ecmodule.common.eapproval.code.getAccInfo(item.PRG)
                , TYPE: item.PRG
                , DATE: item.TRX_DATE
                , NO: item.TRX_NO
                , VERSION_NO: item.VERSION_NO
                , MAKE_TYPE: 'S'
                , SER_NO: item.SER_NO
                , TRX_TYPE: item.TRX_TYPE
                , IDX: ''
            });
        });

        // 전자결재 공통 호출 (Call EApproval Common funtion)
        ecmodule.common.eapproval.createGWERDoc(this, formdata);
    },

    //Header search button click
    onHeaderSearch: function (forceHide) {
        this.journalFlag = 0;
        var self = this;
        var initFalg = true;
        this.TrxDateOld = "";
        this.TrxNoOld = "";
        this.FirstRow = 0;

        if (this._userParam) {
            initFalg = false;
        }
        var searchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize("all").result);
        this.finalSearchParam = searchParam;
        this.finalSearchParam.PARAM = "";
        this.contents.getGrid().grid.clearChecked();

        if (self.dataSearch(initFalg)) {
            if (!self._userParam && self.searchMode != "Y") {
                self.header.toggle(forceHide);
            }
        }
    },

    //Simple search (Tìm kiếm nhanh)
    onHeaderSimpleSearch: function (e) {
        this.journalFlag = 0;
        this.onHeaderSearch(e);
    },

    //Quick Search button click event(hàm tìm kiếm nhanh)
    onHeaderQuickSearch: function (e, value) {
        this.TrxDateOld = "";
        this.TrxNoOld = "";
        this.FirstRow = 0;
        var grid = this.contents.getGrid("dataGrid");

        this.cDateNo = "";
        this.header.lastReset(this.finalHeaderSearch);
        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
        grid.getSettings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.clearChecked();
        grid.draw(this.finalSearchParam);

        // 음영처리 초기화
        grid.grid.removeShadedColumn();
    },

    //Confirm Selected Voucher
    onFooterConfirm: function (e) {
        this.procConfirmStateChangeMulti();

    },

    //[Print] Footer Button (in)
    onFooterPrint: function (e) {
        var self = this;
        var selectItem = this.contents.getGrid().grid.getChecked();
        if (selectItem.length == 0) {
            ecount.alert(ecount.resource.MSG00706);
            return;
        }
        var datetrx = "";
        var valueitem = "";
        $.each(selectItem, function (i, val) {
            if (val["SLIP_NO"] != "" && parseInt(val["SLIP_NO"]) > 0) {
                var strGbType1 = "";

                strGbType1 = strGbType1 == "Y" ? "AFTER" : "BEFORE";
                var strSlipType = val.PRG;
                valueitem = valueitem + val.TRX_DATE.substr(0, 4) + "/" + val.TRX_DATE.substr(4, 2) + "/" + val.TRX_DATE.substr(6, 2) + "-" + val.TRX_NO + "-" + strGbType1 + "-" + val.PRG + ";";
                datetrx = val.TRX_DATE;
            } else {
                //case ajustment
                if (val["SER_NO"] == "99") {
                    var strGbType1 = "";
                    strGbType1 = strGbType1 == "Y" ? "AFTER" : "BEFORE";
                    var strSlipType = val.PRG;
                    valueitem = valueitem + val.TRX_DATE.substr(0, 4) + "/" + val.TRX_DATE.substr(4, 2) + "/" + val.TRX_DATE.substr(6, 2) + "-" + val.TRX_NO + "-" + strGbType1 + "-" + val.PRG + ";";
                    datetrx = val.TRX_DATE;
                } else if (val["TRX_TYPE"] == "98" && (val["SER_NO"] == "04" || val["SER_NO"] == "05" || val["SER_NO"] == "06")) {
                    var strGbType1 = "";
                    strGbType1 = strGbType1 == "Y" ? "AFTER" : "BEFORE";
                    var strSlipType = val.PRG;
                    valueitem = valueitem + val.TRX_DATE.substr(0, 4) + "/" + val.TRX_DATE.substr(4, 2) + "/" + val.TRX_DATE.substr(6, 2) + "-" + val.TRX_NO + "-" + strGbType1 + "-" + val.PRG + ";";
                    datetrx = val.TRX_DATE;
                } else {
                }
            }

        });
        // self.GetformType("", true, valueitem, datetrx)
        self.PopPageMovement(valueitem, datetrx, "Y", "Y");
    },
    

    //[Delete Selected] Footer Button(Chức năng xóa chọn)
    onFooterDeleteSelected: function (e) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var selCnt = selectItem.length;
        if (selCnt == 0) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (this.viewBag.Permission.strUserPermit.Value != "W" && this.acctPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.headerTitle, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        //check slip allow undoconfirm or not 
        var listcheck = this.CheckSlip(selectItem);
        if (listcheck != "") {
            var message = ecount.resource.MSG00342;
            ecount.alert(message);
            return false;
        }
        var self = this;
        this.initDeleteAsync();
        this.errDataAllKey = null;
        this.errDataAllKey = [];
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status == false) {
                return;
            }
            self.showProgressbar(true);
            self.callDeleteListApi(selectItem);
            self.showProgressbar(false);
        });
    },

    //Export excel (Xuất excel)
    onFooterExcel: function (e) {
        var excelSearch = this.finalSearchParam;
        if (excelSearch.JOURNAL[0] != "1") {
            if (excelSearch.JOURNAL != undefined) {
                if (excelSearch.JOURNAL[0] == "1") {
                    excelSearch.LIST_FLAG = "2";
                }
            } else {
                excelSearch.LIST_FLAG = "1";
            }
            if (excelSearch.IN_JOURNAL != undefined) {
                if (excelSearch.IN_JOURNAL[0] == "1") {
                    excelSearch.JFLAG = "1";
                }
            } else {
                excelSearch.JFLAG = "0";
            }
            if (excelSearch.ChkETCVAL != undefined) {
                if (excelSearch.ChkETCVAL[0] == "1") {
                    excelSearch.ETCVAL = "1";
                }
            } else {
                excelSearch.ETCVAL = "0";
            }
            excelSearch.SLIP_TYPE = this.strSlipType1;
            if (excelSearch.FORM_SER == "") {
                ecount.alert(ecount.resource.MSG04944);
                return false;
            }
            excelSearch.PARAM = this.finalSearchParam.PARAM;

            excelSearch.ORDER_FLAG = this.hidSTETOrderPopupFlag;

            if (this.hidSearchFlag == "N") {
                excelSearch.ORDER_PROC_NO = this.hidSTETOrderProcNo;
                excelSearch.ORDER_PROC_STEP = this.hidSTETOrderProcStep;
            } else {
                excelSearch.ORDER_PROC_NO = "";
                excelSearch.ORDER_PROC_STEP = 0;
            }
            excelSearch.excelTitle = String.format("{0} : {1} / {2}~{3}", ecount.resource.LBL03176, ecount.company.COM_DES, ecount.infra.getECDateFormat('DATE10', false, excelSearch.BASE_DATE_FROM.toDate()), ecount.infra.getECDateFormat('DATE10', false, excelSearch.BASE_DATE_TO.toDate()));
            excelSearch.EXCEL_FLAG = "Y";
            this.EXPORT_EXCEL({
                url: "/Account/Voucher/GetUnconfirmedVoucherListExcel",
                param: excelSearch
            });
            excelSearch.EXCEL_FLAG = "N";
        } else {
            if (excelSearch.JOURNAL != undefined) {
                if (excelSearch.JOURNAL[0] == "1") {
                    excelSearch.LIST_FLAG = "2";
                }
            } else {
                excelSearch.LIST_FLAG = "1";
            }
            if (excelSearch.IN_JOURNAL != undefined) {
                if (excelSearch.IN_JOURNAL[0] == "1") {
                    excelSearch.JFLAG = "1";
                }
            } else {
                excelSearch.JFLAG = "0";
            }

            if (excelSearch.ChkETCVAL != undefined) {
                if (excelSearch.ChkETCVAL[0] == "1") {
                    excelSearch.ETCVAL = "1";
                }
            } else {
                excelSearch.ETCVAL = "0";
            }
            excelSearch.SLIP_TYPE = this.strSlipType1;
            if (excelSearch.FORM_SER == "") {
                ecount.alert(ecount.resource.MSG04944);
                return false;
            }
            excelSearch.PARAM = this.finalSearchParam.PARAM;
            if (this.strSlipType1 != "4") {
                excelSearch.ORDER_FLAG = this.hidSTETOrderPopupFlag;
            }
            if (this.hidSearchFlag == "N" && this.strSlipType1 != "4") {
                excelSearch.ORDER_PROC_NO = this.hidSTETOrderProcNo;
                excelSearch.ORDER_PROC_STEP = this.hidSTETOrderProcStep;
            } else {
                excelSearch.ORDER_PROC_NO = "";
                excelSearch.ORDER_PROC_STEP = 0;
            }

            excelSearch.excelTitle = String.format("{0} : {1} / {2}~{3}", ecount.resource.LBL03176, ecount.company.COM_DES, ecount.infra.getECDateFormat('DATE10', false, excelSearch.BASE_DATE_FROM.toDate()), ecount.infra.getECDateFormat('DATE10', false, excelSearch.BASE_DATE_TO.toDate()));
            excelSearch.EXCEL_FLAG = "Y";
            this.EXPORT_EXCEL({
                url: "/Account/Voucher/GetUnconfirmedVoucherListJournalExcel",
                param: excelSearch
            });
            excelSearch.EXCEL_FLAG = "N";
        }
    },



    /****************************************************************************************************
    * define common event listener(định nghĩa sự kiện chung)
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    //funtion onload conplete()
    onLoadComplete: function (e) {
        if (this._userParam) {
            this.defaultSearchParameter.SORTCOL_INDEX = this._userParam.C_SORTCOL_INDEX;
            this.defaultSearchParameter.SORT_TYPE = this._userParam.C_SORT_TYPE;
            this.defaultSearchParameter.SORTCOL_ID = this._userParam.C_SORTCOL_ID;
            this.isMoreFlag = this._userParam.C_MoreFlag;
            if (this._userParam.C_param.PARAM != "") {
                this.defaultSearchParameter.PARAM = this._userParam.C_param.PARAM;
            }
        }

        this.header.toggle(true);

        if (this.isShowSearchForm != "3" && !this._formdata) {
        } else {
            this.onHeaderSearch();
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    //Add button at the bottom(các nút ở cuối trang)
    onRefreshFooter: function () {

        var toolbar = this.footer.get(0);
        var ctrl = widget.generator.control();
        var res = ecount.resource;
        if (this.journalFlag == "0") {
            if (this.strGbType == "z") {
                toolbar.remove();
            } else {
                toolbar.remove();
                var btnList = [];
                btnList.push(ctrl.define("widget.button", "confirm").label(res.BTN00430).end());
                btnList.push(ctrl.define("widget.button", "print").label(res.BTN00148).end());
                btnList.push(ctrl.define("widget.button", "eapproval").label(res.BTN00260).end());
                btnList.push(ctrl.define("widget.button", "deleteSelected").label(res.BTN00035).end());
                btnList.push(ctrl.define("widget.button", "excel").label(res.BTN00079).permission([ecount.config.user.USE_EXCEL_CONVERT, (inventory.guides.api.getNoPermissionDownExcelFileMessage())]).end());
                toolbar.addLeft(btnList); // sử dụng mảng (Use arrary)
            }
        } else {
            toolbar.remove();
            var btnList = [];
            btnList.push(ctrl.define("widget.button", "excel").label(res.BTN00079).permission([ecount.config.user.USE_EXCEL_CONVERT, (inventory.guides.api.getNoPermissionDownExcelFileMessage())]).end());
            toolbar.addLeft(btnList); // sử dụng mảng (Use arrary)
        }
    },

    // Reload grid (Tải lại lưới)
    reloadGrid: function (e) {
        this.contents.getGrid().draw(this.finalSearchParam);
        this.header.getQuickSearchControl().hideError();
    },

    //event handle after close popup widget(Sự kiện sau khi đóng widget).
    onMessageHandler: function (event, data) {
        /* 전자결재 후 페이지 리로드(Reload page after approval) - START */
        if (common.pageToPage.constructRefReceiver(this, event, data,
            {
            getInitData: function (event, data) {
                    if (event.fromID == "EGD002M") {
                        return {};
        }
                    return null;
        }.bind(this),
            receiveMessage: function (from, idata, command, data) {
                    switch (command) {
                        case "ADD":
                        case "MODIFY":
                        case "DELETE":
                            this.reloadPage();
                            break;
        }
        }.bind(this)
        })) { return; }
        /* 전자결재 후 페이지 리로드(Reload page after approval) - END */

        switch (event.pageID) {
            case "EBP002M":
                this.header.getQuickSearchControl().setFocus(0);
                break;
            case "CM100P_02":
            case "CM100P_24":       //양식 설정  
            case "CM100P_51":
            case "ESC001P_31_02":   //간편검색설정
            case "EBA062M_CON":
                this.reloadPage();
                break;
            case "EBH002M":
            case "EBZ032P_03":
            case "EBD010M_10":
            case "EBZ021R":
            case "EBC006M_000":
            case "EBC006M_001":
            case "EBD001M":
            case "EBD002M":
            case "EBD010M_01":
            case "EBD010M_02":
            case "EBD010M_03":
            case "EBD010M_05_00":
            case "EBD010M_05_001":
            case "EBD010M_12":
            case "EBD010M_13_00":
            case "EBD010M_13_001":
            case "EBD010M_04":
            case "EBD010M_06":
            case "EBD010M_09":  // 매출전표1
            case "EBD010M_10":
            case "EBD010M_11":
            case "EBD010M_15":
            case "EBD010M_16":
            case "EBD010M_30":
            case "EBD010M_31":
            case "EBD010M_32":
            case "EBD015M":
            case "EBD016M":
            case "EBD010M_50":
            case "EBD010M_51":
            case "EBD010M_52":      // 세금)계산서수령
            case "EBD010M_53":
            case "EBD010M_54":      // 매입대금청구서수령
            case "EBD010M_55":
            case "EBD010M_99":
            case "EBD014M":
            case "EBC001M_000":
            case "EBC001M_001": // Payable List 
            case "EBC006M_001":  // Check Received List 
            case "EBC006M_000":  // Checks Issued List 
            case "EBH015P_01":
            case "EPA041M":
            case "EGD002M":         //전자결재
                this._ON_REDRAW();
                break;
            case "EBZ015R":
                this.onAllSubmit({
                    url: "/Ecmain/CM3/CM_Search_Acct_Main.aspx?RptGubun=28",
                    param: null
                });
                break;
            case "ChatRoomList":
                this.setNotiToMessenger(data);
                break;
            case "EBQ003P_02":
                this.setTimeout(function () {
                    data.callback && data.callback(false);
                    this.setReload();
                }.bind(this), 0);
                break;
        }
        this.setTimeout(function () {
            data.callback && data.callback(false);
        }.bind(this), 0);
    },

    //If the pop-up launch(kiểm tra popup)
    onPopupHandler: function (control, param, handler) {
        if (control.id == "txtSCustCd") {           //Account(tài khoản)
            param.isApplyDisplayFlag = true;        // apply (nút apply)
            param.isCheckBoxDisplayFlag = true;     // checkbox (nút checkbox)
            param.isIncludeInactive = true;         // Stop using buttons inclusion(ngưng sử dụng)
            param.FilterCustGubun = "101";
            param.GYE_CODE = "102";
            param.CALL_TYPE = "101";
        } else if (control.id == "txtGyeCode") {
            param.isApplyDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
        } else if (control.id == "txtCustGroup1" || control.id == "txtCustGroup2") {//Group account(nhóm tài khoản)
            param.isApplyDisplayFlag = true;        // apply      (nút apply)
            param.isCheckBoxDisplayFlag = true;     // checkbox(nút checkbox)
            param.isIncludeInactive = true;         // Stop using buttons inclusion(ngưng sử dụng)
        }
        else if (control.id == "txtPjtCd") {//project(dự án)
            param.isApplyDisplayFlag = true;        // apply (nút apply)
            param.isCheckBoxDisplayFlag = true;     // checkbox(nút checkbox)
            param.isIncludeInactive = true;         // Stop using buttons inclusion(ngưng sử dụng)
            param.searchCategoryFlag = 'A';
        }
        else if (control.id == "txtCustEmpCd") {//It accounts management personnel(quản lý tài khoản cá nhân)
            param.isApplyDisplayFlag = true;        // apply (nút apply)
            param.isCheckBoxDisplayFlag = true;     // checkbox     (nút checkbox)
            param.isIncludeInactive = false;        // Stop using buttons inclusion(ngưng sử dụng)
            param.accountCheckValue = "1";
        }
        else if (control.id == "txtLastUpdatedID") {//Final workerID(mã người đăng nhập cuối)
            param.isApplyDisplayFlag = false;
            param.popupType = false;
            param.additional = false;
            param.Type = false;
            param.Title = ecount.resource.LBL03682;
            param.GwUse = true;
            param.UserFlag = "id";
            param.AddButtonFlag = "y";
            param.isIncludeInactive = true;        // Stop using buttons inclusion(ngưng sử dụng)            
            param.MENU_TYPE = "S";
            param.hidGwUse = "1";
            param.PRG_ID = this.PRG_ID || "";
            param.TYPE_FLAG = "M";
        } else if (control.id == "rbQcInspectFirstUpdate") {
            param.isApplyDisplayFlag = false;
            param.popupType = false;
            param.additional = false;
            param.Type = false;
            param.Title = ecount.resource.LBL03682;
            param.GwUse = true;
            param.UserFlag = "id";
            param.AddButtonFlag = "y";
            param.isIncludeInactive = true;
            param.MENU_TYPE = "S";
            param.hidGwUse = "1";
        }
        else if (control.id == "txtSiteCd") {
            param.isApplyDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;
            param.checkMaxCount = 100;
            param.CHKFLAG = 'A';
            param.isOthersDataFlag = ecount.user.ALL_GROUP_SITE == 1 ? "N" : "Y";
        }
        else if (control.id == "txtTreeSiteCd") {
            param.isApplyDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.checkMaxCount = 100;
            param.parentID = 'txtTreeSiteCd';
        } else if (control.id == "txtBillNo") {
            param.isIncludeInactive = true;         // Stop using buttons inclusion(ngưng sử dụng)
            param.isApplyDisplayFlag = true;

        } else if (control.id == "txtFirstWriteID") {
            param.MENU_TYPE = "S";
            param.Title = ecount.resource.LBL09909;
            param.Type = false;
            param.isIncludeInactive = true;        // Stop using buttons inclusion(ngưng sử dụng)            
            param.hidGwUse = "1";
            param.PRG_ID = this.PRG_ID || "";
            param.TYPE_FLAG = "C";
        }
        handler(param);
    },

    //Set focus
    onFocusOutHandler: function () {
        var ctrl = this.header.getControl("search");
        ctrl && ctrl.setFocus(0);
    },

    //auto open popup
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        if (control.id == "txtCustEmpCd") {
            parameter.ACCT_CHK = "1";
        }
        if (control.id == "txtPjtCd" || control.id == "txtSiteCd") {
            parameter.CHK_FLAG = "A";
            if (control.id == "txtSiteCd")
                parameter.isOthersDataFlag = "N";
        }
        if (control.id == "txtSCustCd") {
            parameter.CALL_TYPE = "101";
        }
        handler(parameter);
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
        var grid = this.contents.getGrid();
        var columnList = grid.grid.getColumnInfoList();
        if (this.journalFlag == "1") {
            if (columnList) {
                if (columnList.length > 2) {
                    if (columnList[2].id != "acc100.s_print" && columnList[2].id != "acc100.ser_no" &&
                        columnList[2].id != "ACSL_DOC_NO.CODE_NO" && columnList[2].id != "acc101.cr_amt" &&
                        columnList[2].id != "acc101.dr_amt" && columnList[2].id != "acc101.trx_date_no" &&
                        columnList[2].id != "acc100.trx_date_no") {
                        grid.settings.setCustomRowCell(columnList[2].id, this.CustomTotal2.bind(this));
                    }
                }
                if (columnList.length > 3)
                    if (columnList[2].id != "acc100.s_print" && columnList[2].id != "acc100.ser_no" &&
                        columnList[2].id != "ACSL_DOC_NO.CODE_NO" && columnList[2].id != "acc101.cr_amt" &&
                        columnList[2].id != "acc101.dr_amt" && columnList[2].id != "acc101.trx_date_no" &&
                        columnList[2].id != "acc100.trx_date_no") {
                        grid.settings.setCustomRowCell(columnList[3].id, this.CustomTotal3.bind(this));
                    }
            }
        }
    },

    onGridRenderBefore: function (gridId, settings) {
        var self = this;
        this.setGridParameter(settings, true);
        settings.setPagingIndexChanging(function (e, data) {
            self.header.getQuickSearchControl().setValue(self.finalSearchParam.PARAM);
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
            self.contents.getGrid("dataGrid").grid.render();
        });
    },

    // Grid Render Complete
    onGridRenderComplete: function (e, data) {
        //
        this._super.onGridRenderComplete.apply(this, arguments);
        var grid = this.contents.getGrid().grid;
        var items = grid.getRowList();
        var pageSize = this.contents.getGrid("dataGrid").parameter.PAGE_SIZE;
        if (!pageSize)
            pageSize = this.formInfoData.option.pageSize;

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setValue(this.finalSearchParam.PARAM);
            this.header.getQuickSearchControl().setFocus(0);
        }

        // 다음전표 보여줘야 하는 경우
        if (this.isShowNextSlipOfPrePage) {
            this.slipNext();
        }
    },

    onGridAfterRowDataLoad: function (e, data) {
        var gridObj = this.contents.getGrid(),
            settings = gridObj.grid.settings();
        settings.setFooterBottomRightHTML(this.timeStamp);
    },

    onGridAfterFormLoad: function (e, data, gridForm) {
        this.defaultSearchParameter.PAGE_SIZE = data.columnForm.option.pageSize;
    },

    /****************************************************************************************************
   *  define hotkey event listener(định nghĩa sự kiện phím tắt)
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
   ****************************************************************************************************/

    //Hot Key F8
    ON_KEY_F8: function () {
        this.onHeaderSearch();
    },

    /****************************************************************************************************
   * define fuction of buttons on drop down settings (định nghĩa sự kiện của các buttons drop down list)
   ****************************************************************************************************/
    //Option - thiết lập tìm kiếm trong popup(Search Settings pop-up window)
    onDropdownSearchTemplate: function (e) {
        var param = {
            width: 400,
            height: 420,
            FORM_TYPE: "AN860",
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

    //Option - thiết lập tìm kiếm trong form(Form Settings pop-up)
    onDropdownTemplateSetting: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: "AR070",
            FORM_SEQ: 1,
            isSaveAfterClose: true
        }
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    //Option - thiết lập tìm kiếm trong form(Form Settings pop-up)
    onDropdownCustomizeJournal: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: "AR080",
            FORM_SEQ: 1,
            isSaveAfterClose: true
        }
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    // Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        // 매출전표3 Seq: 3953        
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
    /****************************************************************************************************
    * define user action (định nghĩa sự kiện người dùng)
    ****************************************************************************************************/
    //Asynchronous: Delete initialization(khởi tạo việc xóa)
    initDeleteAsync: function () {
        AsyncSendCNT = 0;   //Select Delete to send CNT(chọn xóa để gửi CNT)
        AsyncRecvCNT = 0;   //Select Delete recipient CNT(chọn xóa CNT)
    },

    dataSearch: function (initFlag) {
        var grid = this.contents.getGrid("dataGrid");
        if (this.finalSearchParam.JOURNAL[0] == "1") {
            this.journalFlag = "1";
        } else {
            this.journalFlag = "0";
        }
        if (this.journalFlag == "0") {
            this.formInfoData = this.viewBag.FormInfos["AR070"];
            this.formTypeCode = "AR070";
        } else {
            this.formInfoData = this.viewBag.FormInfos["AR080"];
            this.formTypeCode = "AR080";
        }
        this.defaultSearchParameter.GUBUN = this.formTypeCode;

        if (this.journalFlag == "1") {
            grid.settings.setRowDataUrl('/Account/Voucher/GetVoucherListJournal')
                .setKeyColumn(['TRX_DATE', 'TRX_NO', 'SLIP_NO', 'SLIP_SER'])
                .setStyleRowBackgroundColor(this.setRowBackgroundColorJournal.bind(this), 'danger')
                .setCustomRowCell('acc101.trx_date_no', this.setConnectVoucherJournal.bind(this))
                .setCheckBoxUse(false);
        } else {
            grid.settings.setRowDataUrl('/Account/Voucher/GetVoucherList')
                .setKeyColumn(['TRX_DATE', 'TRX_NO'])
                .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
                .setCustomRowCell('acc100.trx_date_no', this.setConnectVoucher.bind(this))
                .setCheckBoxUse(true)
                .setCheckBoxMaxCount(this.canCheckCount);
        }

        var settings = grid.settings;
        var invalid = this.header.validate("all");
        if (invalid.result.length > 0) {
            var targetControl;
            var invalidControl = this.header.getControl(invalid.result[0][0].control.id);

            if (invalidControl) {   //현재 탭에 없을때
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
        if (initFlag) {
            this.cDateNo = "";
        }
        // search parameter setting
        if (!this.setGridParameter(settings)) {
            return false;
        }
        //this.setGridParameter(settings);
        grid.draw(this.finalSearchParam);
        this.header.toggle(true);
        this.errDataAll = "";

        // 음영처리 초기화
        grid.grid.removeShadedColumn();
    },

    //Set data for grid search(Xet data khi search)
    setGridParameter: function (settings, pageType) {
        var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;
        var rightHtml = "";     //The upper right grid(lưới phía trên bên phải)
        var searchParam = { PARAM: '' };
        // Grid Setting & Search   (thiết lập cho lưới và tìm kiếm)
        if (this._userParam != undefined) {
            settings.setPagingCurrentPage(this._userParam.C_CurrentPage);
            if (this._userParam.C_param != "") {
                searchParam = this._userParam.C_param;
            }
        } else {
            settings.setPagingCurrentPage(1); //Paging Page 1(phân trang thứ 1)
            searchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize("all").result);
            if (this.journalFlag == "1") {
                searchParam.LIST_FLAG = "2";
            } else {
                searchParam.LIST_FLAG = "1";
            }
            if (searchParam.IN_JOURNAL != undefined) {
                if (searchParam.IN_JOURNAL[0] == "1") {
                    searchParam.JFLAG = "1";
                }
            } else {
                searchParam.JFLAG = "0";
            }

            if (searchParam.ChkETCVAL != undefined) {
                if (searchParam.ChkETCVAL[0] == "1") {
                    searchParam.ETCVAL = "1";
                }
            } else {
                searchParam.ETCVAL = "0";
            }
            searchParam.SLIP_TYPE = this.strSlipType1;
            if (searchParam.FORM_SER == "") {
                ecount.alert(ecount.resource.MSG04944);
                return false;
            }
            searchParam.PARAM = this.finalSearchParam.PARAM;
            searchParam.ORDER_FLAG = this.hidSTETOrderPopupFlag;
            if (this.hidSearchFlag == "N") {
                searchParam.ORDER_PROC_NO = this.hidSTETOrderProcNo;
                searchParam.ORDER_PROC_STEP = this.hidSTETOrderProcStep;
            } else {
                searchParam.ORDER_PROC_NO = "";
                searchParam.ORDER_PROC_STEP = 0;
            }
        }
        if (!this._userParam) {
            // CHECK Validator (KIỂM TRA SỐ TIỀN)
            if (searchParam.AMT_F == "")
                searchParam.AMT_F = "0";

            if (searchParam.AMT_T == "")
                searchParam.AMT_T = "0";

            var num1 = new Decimal(searchParam.AMT_F);
            var num2 = new Decimal(searchParam.AMT_T);
            if (num1 != 0 && num2 != 0) {
                if (num1.greaterThan(num2)) {
                    ecount.alert(ecount.resource.MSG10020);
                    return false;
                }
            }

        }
        if (!this._userParam) {
            searchParam.SORTCOL_INDEX = "0";
        }

        if (this._userParam) {
            if (this._userParam.C_param.PARAM != "") {
                searchParam.PARAM = this._userParam.C_param.PARAM;
            }
        }
        this.searial = 0;
        var param = {
            customer: this.header.getControl("txtSCustCd", "all") != undefined ? this.header.getControl("txtSCustCd", "all").getSelectedLabel() : "",
            project: ecount.config.company.USE_PJT == "Y" && this.header.getControl("txtPjtCd", "all") != undefined ? this.header.getControl("txtPjtCd", "all").getSelectedLabel() : "",
            dateFrom: searchParam.BASE_DATE_FROM,
            dateTo: searchParam.BASE_DATE_TO
        };
        var paramDep = {
            dept: (this.header.getControl("txtSiteCd", "all") != undefined) ? this.header.getControl("txtSiteCd", "all").getSelectedLabel() : ""
        };

        var searchConditionTitle = ecount.document.getSearchConditionTitle("inventory", param);
        var plusMark = " / ";
        var etcMark = " " + ecount.resource.LBL09336;
        var displayTitle = [];
        if (paramDep.dept && paramDep.dept.length > 0) {
            displayTitle.push(paramDep.dept[0] + (paramDep.dept.length != 1 ? etcMark : ""));
        }
        searchConditionTitle.leftTitle = searchConditionTitle.leftTitle + (displayTitle.length > 0 ? " / " : "") + displayTitle.join(plusMark);

        //The upper right grid(lưới phía trên bên phải)
        rightHtml = String.format("{0}~{1}", ecount.infra.getECDateFormat('DATE10', false, searchParam.BASE_DATE_FROM.toDate()), ecount.infra.getECDateFormat('DATE10', false, searchParam.BASE_DATE_TO.toDate()));
        this.header.getQuickSearchControl().setValue(searchParam.PARAM);
        if (this.SelectedForm == "N") {
            this.checkFormSeq = this.LastForm;
            this.SelectedForm = "";
            this.flagInitialFormSeq = true;
        } else if (this.SelectedForm == "0") {
            this.checkFormSeq = this.SelectedForm;
            this.SelectedForm = "";
            this.flagInitialFormSeq = true;
        } else {
            this.checkFormSeq = searchParam.FORM_SER;
            this.flagInitialFormSeq = false;
        }
        if (this.journalFlag == "1") {
            settings.setFormParameter({ FormType: "AR080", FormSeq: 1 })
        } else {
            settings.setFormParameter({ FormType: "AR070", FormSeq: this.checkFormSeq })
        }
        settings.setHeaderTopRightHTML(rightHtml)
            .setHeaderTopMargin(this.header.height())
            .setRowDataParameter(searchParam);

        this.finalHeaderSearch = this.header.extract("all").merge();  // Lookup information at the time of control(tìm kiếm thông tin tại thời gian của control)
        searchParam.EXCEL_FLAG = "N";
        this.finalSearchParam = searchParam;
        this.finalSearchParam.excelTitle = searchConditionTitle.excelTitle;      // excel title (tiêu đề tập tin excel)

        return true;

    },

    setConnectVoucher: function (value, rowItem) {
        var option = {};
        var self = this;
        if (self.userPermit == "W") {
            if (rowItem["SLIP_TYPE"] == "9000") {
                if (self.hidBankRec != null && self.hidBankRec == "Y")
                    option.controlType = "widget.label";
                else {
                    if (rowItem["GB_TYPE3"] == "Z") {
                        option.controlType = "widget.label";
                    }
                    else {
                        if (self.hidSTETOrderPopupFlag == "Y") {
                            option.controlType = "widget.label";
                        } else {
                            option.controlType = "widget.link";
                        }
                    }
                }
            }
            else {
                if (rowItem["PRG_URL"] != null && rowItem["PRG_URL"] != "" && rowItem["PRG_URL"] != undefined) {
                    if (self.hidBankRec != null && self.hidBankRec == "Y")
                        option.controlType = "widget.label";
                    else {
                        if (rowItem["GB_TYPE3"] == "Z") {
                            option.controlType = "widget.label";
                        }
                        else {
                            if (self.hidSTETOrderPopupFlag == "Y") {
                                if (self.hidSearchFlag == "N")
                                    option.controlType = "widget.link";
                                else
                                    option.controlType = "widget.label";
                            }
                            else
                                option.controlType = "widget.link";
                        }
                    }
                }
                else {
                    option.controlType = "widget.label";
                }

            }
        }
        else {
            option.controlType = "widget.link";
        }

        if (self.journalFlag == "1") {
            option.data = value + "-" + rowItem.SLIP_SER;
        }
        option.event = {
            'click': function (e, data) {
                this.slipLinkClick(e, data);
            }.bind(this)
        }

        return option;
    },

    //Link slip for journal voucher list
    setConnectVoucherJournal: function (value, rowItem) {
        var option = {};
        if (rowItem._MERGE_SET != undefined) {
            var grid = this.contents.getGrid();
            var columnList = grid.grid.getColumnInfoList();
            if (columnList) {
                if (columnList.length > 2) {
                    if (columnList[2].id == "acc101.trx_date_no" || columnList[3].id == "acc101.trx_date_no") {
                        var temp = '0';
                        var thousandSeparator = ecount.config.company.THOU_SEPARATOR;
                        var decimalSeparator = ecount.config.company.DEC_SEPARATOR;
                        if (rowItem.A2 && columnList[2].id == "acc101.trx_date_no") {
                            temp = rowItem.A2.replace(/,/g, '');
                            thousandSeparator = columnList[2].thousandSeparator;
                            decimalSeparator = columnList[2].decimalSeparator;
                        } else if (rowItem.A3 && columnList[3].id == "acc101.trx_date_no") {
                            temp = rowItem.A3.replace(/,/g, '');
                            thousandSeparator = columnList[3].thousandSeparator;
                            decimalSeparator = columnList[3].decimalSeparator;
                        }
                        value = String.fastFormat(temp, {
                            fractionLimit: ecount.config.company.DEC_AMT,
                            removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
                        });
                        option.data = value;
                        return option;
                    } else {
                        option.data = "";
                        return option;
                    }
                }
            }
        }
        var self = this;
        var strMasterFlag = self.viewBag.InitDatas.IsMaster; //chú ý masterflag
        //chú ý masterflag
        if (rowItem["GB_TYPE3"] == "N" && strMasterFlag == "N")
            self.userPermit = self.acctPermit;
        else
            self.userPermit = self.userPermit;
        var strTrxNo = rowItem.TRX_NO;
        var strUdeptCd = self.viewBag.InitDatas.FConfig.UDEPT_CD;
        var strTrxSite = rowItem.SITE;

        if (!(strTrxNo == "0" || (strUdeptCd != "00" && strUdeptCd != "NONE" && strUdeptCd != strTrxSite)) && self.userPermit == "W") {
            if (rowItem["SLIP_TYPE"] == "9000") {
                if (self.hidBankRec != null && self.hidBankRec == "Y") {
                    return
                } else {
                    if (rowItem["GB_TYPE3"] == "Z") {
                        return;
                    } else {
                        if (self.hidSTETOrderPopupFlag == "Y") {
                            option.controlType = "widget.label";
                        } else {
                            option.controlType = "widget.link";
                        }
                    }
                }
            } else {
                if (rowItem["PRG_URL"] != null && rowItem["PRG_URL"] != "" && rowItem["PRG_URL"] != undefined) {
                    if (self.hidBankRec == "Y") {
                        option.controlType = "widget.label";
                    } else {
                        if (rowItem["GB_TYPE3"] == "Z") {
                            option.controlType = "widget.label";
                        } else {
                            if (self.hidSTETOrderPopupFlag == "Y") {
                                if (self.hidSearchFlag == "N") {
                                    option.controlType = "widget.link";
                                } else {
                                    option.controlType = "widget.label";
                                }
                            } else {
                                option.controlType = "widget.link";
                            }

                        }
                    }
                } else {
                    option.controlType = "widget.label";
                }
            }
        } else {

            option.controlType = "widget.link";
        }
        option.data = value + "-" + rowItem.SLIP_SER;
        option.event = {
            'click': function (e, data) {
                this.slipLinkClickJournal(e, data);
            }.bind(this)
        }

        return option;
    },

    slipLinkClick: function (e, data) {
        var self = this;
        if (self.userPermit == "W") {
            if (data.rowItem["SLIP_TYPE"] == "9000") {
                if (self.hidBankRec != null && self.hidBankRec == "Y") {
                    return
                } else {
                    if (data.rowItem["GB_TYPE3"] == "Z") {
                        return;
                    } else {
                        if (self.hidSTETOrderPopupFlag == "Y") {
                            return;
                        } else {
                            self.LinkSlip(data);
                        }
                    }
                }

            } else {
                if (data.rowItem["PRG_URL"] != null && data.rowItem["PRG_URL"] != "" && data.rowItem["PRG_URL"] != undefined) {
                    if (self.hidBankRec == "Y") {
                        return;
                    } else {
                        if (data.rowItem["GB_TYPE3"] == "Z") {
                            return;
                        } else {
                            if (self.hidSTETOrderPopupFlag == "Y") {
                                if (self.hidSearchFlag == "N") {
                                    self.fnModifySlip(data.rowItem["TRX_DATE"], data.rowItem["TRX_NO"], '', data.rowItem["SER_NO"], data.rowItem["GB_TYPE"])
                                } else {
                                    return;
                                }
                            } else {
                                self.LinkSlip(data);
                            }
                        }
                    }

                } else {
                    return
                }
            }
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: self.headerTitle, PermissionMode: "U"
            }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    slipLinkClickJournal: function (e, data) {
        var self = this;
        var strMasterFlag = self.viewBag.InitDatas.IsMaster;
        if (data.rowItem["GB_TYPE3"] == "N" && strMasterFlag == "N")
            self.userPermit = self.acctPermit;
        else
            self.userPermit = self.userPermit;
        var strTrxNo = rowItem.TRX_NO;
        var strUdeptCd = self.viewBag.InitDatas.FConfig.UDEPT_CD;
        var strTrxSite = rowItem.SITE;

        if (!(strTrxNo == "0" || (strUdeptCd != "00" && strUdeptCd != "NONE" && strUdeptCd != strTrxSite)) && self.userPermit == "W") {
            if (data.rowItem["SLIP_TYPE"] == "9000") {
                if (self.hidBankRec != null && self.hidBankRec == "Y") {
                    return
                } else {
                    if (data.rowItem["GB_TYPE3"] == "Z") {
                        return;
                    } else {
                        if (self.hidSTETOrderPopupFlag == "Y") {
                            return;
                        } else {
                            self.LinkSlip(data);
                        }

                    }
                }
            } else {
                if (data.rowItem["PRG_URL"] != null && data.rowItem["PRG_URL"] != "" && data.rowItem["PRG_URL"] != undefined) {
                    if (self.hidBankRec == "Y") {
                        return;
                    } else {
                        if (data.rowItem["GB_TYPE3"] == "Z") {
                            return;
                        } else {
                            if (self.hidSTETOrderPopupFlag == "Y") {
                                if (self.hidSearchFlag == "N") {
                                    self.fnModifySlip(data.rowItem["TRX_DATE"], data.rowItem["TRX_NO"], '', data.rowItem["SER_NO"], data.rowItem["GB_TYPE"])
                                } else {
                                    return;
                                }
                            } else {
                                self.LinkSlip(data);
                            }

                        }
                    }
                } else {
                    return
                }
            }
        } else {
            if (self.userPermit == "W") {
                self.LinkSlip(data);
            }
            else {
                var msgdto = ecount.common.getAuthMessage("", [{
                    MenuResource: self.headerTitle, PermissionMode: "U"
                }]);
                ecount.alert(msgdto.fullErrorMsg);
                return;
            }
        }
    },

    // Set background color for [Active] column
    setRowBackgroundColor: function (rowItem) {
        if (rowItem.IO_TYPE != null || rowItem.IO_TYPE != "") {
            if (rowItem.IO_GUBUN == 1) {
                return "danger";
            }

            if (rowItem.IO_GUBUN == 2) {
                return "muted";
            }
        }
    },

    // Set background color for [Active] column
    setRowBackgroundColorJournal: function (data) {
        if (data._MERGE_SET != undefined)
            return 'muted text-bold';

        if (data.TRX_DATE == null || data.TRX_DATE == "") {
            return "";
        }
        if ((data.TRX_DATE != this.TrxDateOld || data.TRX_NO != this.TrxNoOld) && this.FirstRow != 0) {
            this.TrxDateOld = data.TRX_DATE;
            this.TrxNoOld = data.TRX_NO;
            this.FirstRow = this.FirstRow + 1;
        }
        if (this.FirstRow == 0) {
            this.TrxDateOld = data.TRX_DATE;
            this.TrxNoOld = data.TRX_NO;
            this.FirstRow = 1;
            return "";
        } else {
            if (this.FirstRow % 2 == 0) {
                return "danger";
            } else {
                return "";
            }
        }
    },

    //grid row CheckBox Option Set(dòng dữ liệu theo checkbox)
    setGridCheckboxOption: function (value, rowItem) {
        var option = {};
        if (rowItem.TRX_TYPE == "98" && rowItem.SER_NO == "99") {
            option.attrs = {
                'disabled': true
            };
        }

        if (this.hidSTETOrderPopupFlag == "Y" && this.hidSearchFlag != "N") {
            if (rowItem.PROC_NO != "" || rowItem.GB_TYPE3 == "N") {
                option.attrs = {
                    'disabled': true
                };
            }
        }
        if (rowItem.GB_TYPE3 == "Z") {
            option.attrs = {
                'disabled': true
            };
        }
        return option;
    },

    //Custom row serno
    setGridSERNO: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.label";
        if (this.journalFlag == "1") {
            if (rowItem._MERGE_SET != undefined) {
                var grid = this.contents.getGrid();
                var columnList = grid.grid.getColumnInfoList();
                if (columnList) {
                    if (columnList.length > 2) {
                        if (columnList[2].id == "acc100.ser_no" || columnList[3].id == "acc100.ser_no") {
                            var temp = '0';
                            var thousandSeparator = ecount.config.company.THOU_SEPARATOR;
                            var decimalSeparator = ecount.config.company.DEC_SEPARATOR;
                            if (rowItem.A2 && columnList[2].id == "acc100.ser_no") {
                                temp = rowItem.A2.replace(/,/g, '');
                                thousandSeparator = columnList[2].thousandSeparator;
                                decimalSeparator = columnList[2].decimalSeparator;
                            } else if (rowItem.A3 && columnList[3].id == "acc100.ser_no") {
                                temp = rowItem.A3.replace(/,/g, '');
                                thousandSeparator = columnList[3].thousandSeparator;
                                decimalSeparator = columnList[3].decimalSeparator;
                            }

                            value = String.fastFormat(temp, {
                                fractionLimit: ecount.config.company.DEC_AMT,
                                removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
                            });
                            option.data = value;
                            return option;
                        } else {
                            option.data = "";
                            return option;
                        }
                    }
                }
            }
        }
        var strDes = '';
        var intIoType = "";

        strDes = rowItem["SER_DES"];
        if (rowItem["IO_TYPE"] != "" && rowItem["IO_TYPE"] != undefined) {
            intIoType = rowItem["IO_GUBUN"];
            if (intIoType.substring(0, 1) == "1")
                strDes = rowItem["SER_DES"] + "(" + ecount.resource.LBL01118 + ")";
            else if (intIoType.substring(0, 1) == "2")
                strDes = rowItem["SER_DES"] + "(" + ecount.resource.LBL01099 + ")";
            else
                strDes = rowItem["SER_DES"];
        }

        switch (rowItem.FROM_SLIP_CD) {
            case '2010':
                strDes = ecount.resource.LBL01788 + "(" + strDes + ")";
                break;
            case '2020':
                strDes = ecount.resource.LBL01789 + "(" + strDes + ")";
                break;
            case '2030':
                strDes = ecount.resource.LBL08609 + "(" + strDes + ")";
                break;
            case '2040':
                strDes = ecount.resource.LBL08619 + "(" + strDes + ")";
                break;
        }

        if (rowItem["SER_DES"].indexOf("LBL") >= 0)
            strDes = ecount.resource[rowItem["SER_DES"]];
        else
            strDes = rowItem["SER_DES"];

        option.data = strDes;
        return option;
    },

    //Set for print(nhấn link print on grid)
    setGridS_PRINT: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = ecount.resource.BTN00054;
        if (rowItem.GB_TYPE3 == "Z") {
            option.data = ecount.resource.BTN00054;
        } else {
            option.controlType = "widget.link";
            option.data = ecount.resource.BTN00054;
            option.attrs = {
                'data-trigger': 'hover',
                'data-toggle': 'tooltip',
                'data-placement': 'auto',
                'data-html': true,
                'title': this.printTooltip({
                    latrlyDate: rowItem['LATELY_DATE'],
                    latrlyId: rowItem['LATELY_ID'],
                    hits: rowItem['HITS']
                })
            }
            var strPrintClass = "link-blue";

            if (!$.isNull(rowItem["HITS"]) && rowItem["HITS"] != "0") {
                strPrintClass = "text-warning-inverse";
            }

            if (rowItem["SLIP_NO"] != "" && parseInt(rowItem["SLIP_NO"]) > 0) {
                option.data = ecount.resource.BTN00054;
            } else {
                var self = this;
                //case ajustment
                if (rowItem["SER_NO"] == "99") {
                    option.data = ecount.resource.BTN00054;
                } else if (rowItem["TRX_TYPE"] == "98" && (rowItem["SER_NO"] == "04" || rowItem["SER_NO"] == "05" || rowItem["SER_NO"] == "06")) {
                    option.data = ecount.resource.BTN00054;
                } else {
                    option.data = "";
                }
            }

            option.attrs["class"] = [strPrintClass];
            option.event = {
                'click': function (e, data) {
                    self.GetformType(data);
                    e.preventDefault();
                }.bind(this)
            }
        }
        return option;
    },

  //Set for print(nhấn link print on grid)
    setGridS_PRINT_S: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = ecount.resource.BTN00054;
        if (rowItem.GB_TYPE3 == "Z") {
            option.data = ecount.resource.BTN00054;
        }
        else {
            option.controlType = "widget.link";
            option.data = ecount.resource.BTN00054;
            option.attrs = {
                'data-trigger': 'hover',
                'data-toggle': 'tooltip',
                'data-placement': 'auto',
                'data-html': true,
                'title': this.printTooltip({
                    latrlyDate: rowItem['LATELY_DATE'],
                    latrlyId: rowItem['LATELY_ID'],
                    hits: rowItem['HITS']
                })
            }
            var strPrintClass = "link-blue";

            if (rowItem["TRX_TYPE"] == "98" && (rowItem["SER_NO"] == "04" || rowItem["SER_NO"] == "05" || rowItem["SER_NO"] == "06")) {
                switch (rowItem["SER_NO"]) {
                    case "04":
                        if (rowItem["HITS2"] != null && rowItem["HITS2"] != "0")
                            strPrintClass = "text-warning-inverse";
                        else {
                            strPrintClass = "";
                        }

                        option.attrs = {
                            'data-trigger': 'hover',
                            'data-toggle': 'tooltip',
                            'data-placement': 'auto',
                            'data-html': true,
                            'title': this.printTooltip({
                                latrlyDate: rowItem['LATELY_DATE2'],
                                latrlyId: rowItem['LATELY_ID2'],
                                hits: rowItem['HITS2']
                            })
                        }
                        break;
                    case "05":
                        if (rowItem["HITS2"] != null && rowItem["HITS2"] != "0")
                            strPrintClass = "text-warning-inverse";
                        else {
                            strPrintClass = "";
                        }
                        option.attrs = {
                            'data-trigger': 'hover',
                            'data-toggle': 'tooltip',
                            'data-placement': 'auto',
                            'data-html': true,
                            'title': this.printTooltip({
                                latrlyDate: rowItem['LATELY_DATE2'],
                                latrlyId: rowItem['LATELY_ID2'],
                                hits: rowItem['HITS2']
                            })
                        }
                        break;
                    case "06":
                        if (rowItem["HITS2"] != null && rowItem["HITS2"] != "0")
                            strPrintClass = "text-warning-inverse";
                        else {
                            strPrintClass = "";
                        }
                        option.attrs = {
                            'data-trigger': 'hover',
                            'data-toggle': 'tooltip',
                            'data-placement': 'auto',
                            'data-html': true,
                            'title': this.printTooltip({
                                latrlyDate: rowItem['LATELY_DATE2'],
                                latrlyId: rowItem['LATELY_ID2'],
                                hits: rowItem['HITS2']
                            })
                        }
                        break;
                    default:
                        break;
                }
            }
            if (rowItem["SLIP_NO"] != "" && parseInt(rowItem["SLIP_NO"]) > 0) {
                option.data = ecount.resource.BTN00054;
            } else {
                var self = this;
                //case ajustment
                if (rowItem["SER_NO"] == "99") {
                    option.data = ecount.resource.BTN00054;
                } else if (rowItem["TRX_TYPE"] == "98" && (rowItem["SER_NO"] == "04" || rowItem["SER_NO"] == "05" || rowItem["SER_NO"] == "06")) {
                    option.data = ecount.resource.BTN00054;
                } else {
                    option.data = "";
                }
            }

            option.attrs["class"] = [strPrintClass];
            option.event = {
                'click': function (e, data) {
                    self.GetformType_Journal(data);
                    e.preventDefault();
                }.bind(this)
            }
        }
        return option;
    },

    //function get formtype (cho sự kiện in)
    GetformType: function (data) {
        if (data.rowItem["SLIP_NO"] != "" && parseInt(data.rowItem["SLIP_NO"]) > 0) {
            var self = this;
            if (self.strFormTypeFlag == "N") {
                self.strRptForm = "BEFORE";
                self.strBeforeFlag = "Y";
            }
            self.printPopup2(data.rowItem["TRX_DATE"], data.rowItem["TRX_NO"], data.rowItem["GB_TYPE3"]);
        } else {
            var self = this;
            //case ajustment
            if (data.rowItem["SER_NO"] == "99") {
                self.printPopup2(data.rowItem["TRX_DATE"], data.rowItem["TRX_NO"], data.rowItem["GB_TYPE3"]);

            }
            else if (data.rowItem["TRX_TYPE"] == "98" && (data.rowItem["SER_NO"] == "04" || data.rowItem["SER_NO"] == "05" || data.rowItem["SER_NO"] == "06")) {
                self.printPopup2(data.rowItem["TRX_DATE"], data.rowItem["TRX_NO"], data.rowItem["GB_TYPE3"]);
            }
        }

    },

    //function get formtype (cho sự kiện in)
    GetformType_Journal: function (data) {
        self = this;
        if (data.rowItem["TRX_TYPE"] == "98" && (data.rowItem["SER_NO"] == "04" || data.rowItem["SER_NO"] == "05" || data.rowItem["SER_NO"] == "06")) {
            var strPrintKeys = "";

            switch (data.rowItem["SER_NO"]) {
                case "04": // 지출결의서
                    //strPrintKeys = "rpt_type=1&rpt_form=" + self.rptForm + "&trx_date=" + data.rowItem["TRX_DATE"] + "&trx_no=" + data.rowItem["TRX_NO"];
                    //self.printPopup(self.FormType.Type1, strPrintKeys);
                    self.printPopupEtcNew(data.rowItem["TRX_DATE"] + "-" + data.rowItem["TRX_NO"] + ";", data.rowItem["TRX_DATE"], "", data.rowItem[this.columnMap.GB_TYPE], "AF040");
                    break;
                case "05":
                    //strPrintKeys = "rpt_type=2&rpt_form=" + self.rptForm + "&trx_date=" + data.rowItem["TRX_DATE"] + "&trx_no=" + data.rowItem["TRX_NO"];
                    //self.printPopup(self.FormType.Type2, strPrintKeys);
                    self.printPopupEtcNew(data.rowItem["TRX_DATE"] + "-" + data.rowItem["TRX_NO"] + ";", data.rowItem["TRX_DATE"], "", data.rowItem[this.columnMap.GB_TYPE], "AF050");
                    break;
                case "06":
                    strPrintKeys = "rpt_type=3&rpt_form=" + self.rptForm + "&trx_date=" + data.rowItem["TRX_DATE"] + "&trx_no=" + data.rowItem["TRX_NO"];
                    self.printPopup(self.FormType.Type3, strPrintKeys);
                    break;
                default:
                    break;
            }
        }
        else {
            ecount.alert(ecount.resource.MSG09307);
        }

    },

    //Print on grid(gọi page in)
    printPopup: function (flag, param) {
        debugger
        var url, page;
        switch (flag) {
            case "0":// 전표미포함
                page = "EBG002P_01";
                break;
            case "1":// 전표포함
                page = "EBG002P_02";
                break;
            case "2":// 비영리
                page = "EBG002P_03";
                break;
            default:
                page = "EBG002P_01";
                break;
        }

        url = "/ECMain/EBG/" + page + ".aspx?" + param;
        this.openWindow({
            url: url,
            name: ecount.resource.LBL02748,
            additional: true,
            popupType: true,
            param: {
                width: 740,
                height: 500
            }
        });
    },

    printPopupEtcNew: function (strSelValue, strTrxDate, strPrint, strGbType, printFormType, resourceName) {
        debugger
        var arrTrxDate = strTrxDate.split("/");
        var data = {};
        data["ddlSYear"] = arrTrxDate[0].substr(0, 4);
        data["ddlSMonth"] = arrTrxDate[0].substr(4, 2);
        data["txtSDay"] = arrTrxDate[0].substr(6, 2);
        data["ddlEYear"] = arrTrxDate[0].substr(0, 4);
        data["ddlEMonth"] = arrTrxDate[0].substr(4, 2);
        data["txtEDay"] = arrTrxDate[0].substr(6, 2);
        data["M_SlipType"] = this.slip_type;        // self.strSlipType1;
        data["txtSiteCd"] = "";
        data["txtSiteDes"] = "";
        data["txtPjtCd"] = "";
        data["txtPjtDes"] = "";

        var rptForm = "AFTER";
        self.strBeforeFlag = "N";

        var currentTabId = this.contents.currentTabId;
        if (currentTabId == "tabUnconfirmed") currentTabId = "tabIng";
        if (currentTabId == "tabConfirm") currentTabId = "tabComplete";

        if ((rptForm == "AFTER" || (strPrint != "" && strPrint == "Y")) && currentTabId != "tabIng" && strGbType == "Y")
            data["M_RptGubun"] = "26";
        else
            data["M_RptGubun"] = "51";

        data["hidSelValue"] = strSelValue;
        data["Mode"] = "TRXNO";
        data["M_TabFlag"] = currentTabId;

        var slips = [];
        strSelValue.split(";").forEach(function (value, index) {
            if (value != "") {
                slips.push({
                    IO_DATE: value.split("-")[0].replaceAll("/", ""),
                    IO_NO: value.split("-")[1]
                });
            }
        });


        var hidprint = "Y";
        if (strPrint != "")
            hidprint = strPrint;

        var popupDataPrint = {
            Request: {
                FORM_TYPE: printFormType,
                FORM_SEQ: 0,
                Slips: slips,
                Data: {
                    SITE: "",
                    PJT: ""
                }
            }
        };
        popupDataPrint.Request.Data.hidSelValue = strSelValue;
        popupDataPrint.Request.Data.hidPrint = hidprint;
        popupDataPrint.Request.Data.hidSlipMode = "Y";
        popupDataPrint.Request.Data.hidSearchXml = ecount.common.toXML(data);
        popupDataPrint.Request.Data.HistoryFormType = printFormType;

        this.openWindow({
            url: '/ECERP/SVC/EBG/EBG002P_01',
            name: ecount.resource[resourceName],   //ecount.resource.LBL02253,
            additional: true,
            popupType: false,
            param: $.extend({
                width: 800,
                height: 600,
            }, popupDataPrint)
        });
    },

    printPopup2: function (strTrxDate, strTrxNo, strGbType) {
        var DateNo = strTrxDate + "-" + strTrxNo + ";";
        this.PopPageMovement(DateNo, strTrxDate, "", strGbType, "AF020", "LBL02186");
    },

    PopPageMovement: function (strSelValue, strTrxDate, strPrint, strGbType, printFormType, resourceName) {
        var self = this;
        var arrTrxDate = strTrxDate.split("/");
        var data = {};
        data["ddlSYear"] = arrTrxDate[0].substr(0, 4);
        data["ddlSMonth"] = arrTrxDate[0].substr(4, 2);
        data["txtSDay"] = arrTrxDate[0].substr(6, 2);
        data["ddlEYear"] = arrTrxDate[0].substr(0, 4);
        data["ddlEMonth"] = arrTrxDate[0].substr(4, 2);
        data["txtEDay"] = arrTrxDate[0].substr(6, 2);
        data["M_SlipType"] = self.strSlipType1;
        data["txtSiteCd"] = "";
        data["txtSiteDes"] = "";
        data["txtPjtCd"] = "";
        data["txtPjtDes"] = "";
        data["M_RptGubun"] = "51"; //unconfirm voucher
        data["hidSelValue"] = strSelValue;
        data["Mode"] = "TRXNO";

        var hidprint = "Y";
        if (strPrint != "")
            hidprint = strPrint;
        self.popupDataPrint.hidSelValue = strSelValue;
        self.popupDataPrint.hidPrint = hidprint;
        self.popupDataPrint.hidSlipMode = "Y";
        self.popupDataPrint.hidSearchXml = ecount.common.toXML(data);

        var slips = [];
        strSelValue.split(";").forEach(function (value, index) {
            if (value != "") {
                slips.push({
                    IO_DATE: value.split("-")[0].replaceAll("/", ""),
                    IO_NO: value.split("-")[1]
                });
            }
        });

        var popupDataPrint = {
            Request: {
                FORM_TYPE: printFormType,
                FORM_SEQ: 0,
                Slips: slips,
                Data: {
                    SITE: "",
                    PJT: "",
                }
            }
        };

        popupDataPrint.Request.Data.hidSelValue = self.popupDataPrint.hidSelValue;
        popupDataPrint.Request.Data.hidPrint = self.popupDataPrint.hidPrint;
        popupDataPrint.Request.Data.hidSlipMode = self.popupDataPrint.hidSlipMode;
        popupDataPrint.Request.Data.hidSearchXml = self.popupDataPrint.hidSearchXml;

        this.openWindow({
            url: "/ECERP/SVC/EBZ/EBZ013P_01",
            name: ecount.resource.LBL02186,
            additional: true,
            popupType: false,
            param: $.extend({
                width: 800,
                height: 600,
            }, popupDataPrint)
        });
    },

    CheckSlip: function (apiData) {
        var value = "";
        $.each(apiData, function (i, val) {
            if (val.TRX_TYPE == "98" && val.SER_NO == "99") {
                value = value + val.TRX_DATE + "-" + val.TRX_NO;
                value = value != "" ? value + "," : value;
            }
        });
        return value;
    },

    LinkSlip: function (data) {
        var optionData = {};
        var self = this;
        //신규프레임웍 파라미터
        optionData.PARAM = {
            width: 800,
            height: 600,
            EditFlag: "M",
            s_system: data.rowItem["S_SYSTEM"]
        }

        if (data.columnId == "acc100.trx_date_no")
            optionData.PARAM.isOpenPopup = true;

        var EC_Param = this.finalSearchParam;
        EC_Param.JournalFlag = this.journalFlag;
        EC_Param.C_CurrentPage = self.contents.getGrid("dataGrid").grid.settings().getPagingCurrentPage();

        //TRX_DATE,TRX_NO,TRX_TYPE,SER_NO,PARENT_URL 값 필수
        optionData.hidSearchData = {
            USE_DEFAULT_DATE: "N",
            SLIP_TYPE: data.rowItem['GB_TYPE3'] == "N" ? "2" : "1",
            TRX_DATE: data.rowItem['TRX_DATE'],
            TRX_NO: data.rowItem['TRX_NO'],
            TRX_TYPE: data.rowItem['TRX_TYPE'],
            SER_NO: data.rowItem['SER_NO'],
            DATE_F: { ddlSYear: self.finalSearchParam.BASE_DATE_FROM.substr(0, 4), ddlSMonth: self.finalSearchParam.BASE_DATE_FROM.substr(4, 2), txtSDay: self.finalSearchParam.BASE_DATE_FROM.substr(6, 2) },
            DATE_T: { ddlEYear: self.finalSearchParam.BASE_DATE_TO.substr(0, 4), ddlEMonth: self.finalSearchParam.BASE_DATE_TO.substr(4, 2), txtEDay: self.finalSearchParam.BASE_DATE_TO.substr(6, 2) },
            SITE: self.finalSearchParam.SITE,
            PJT_CD: ecount.config.company.USE_PJT == "Y" ? self.finalSearchParam.PJT_CD : "",
            CUST: self.finalSearchParam.CUST,
            CUST_DES: self.finalSearchParam.CUST_NAME,
            ACCCASE: self.finalSearchParam.ACCCASE,
            SUB_CODE: self.finalSearchParam.SUB_CODE,
            AMT_F: self.finalSearchParam.AMT_F,
            AMT_T: self.finalSearchParam.AMT_T,
            REMARKS: self.finalSearchParam.REMARKS,
            GYE_CODE_F: self.finalSearchParam.GYE_CODE,
            GYE_CODE_T: self.finalSearchParam.GYE_CODE,
            LAST_ID: self.finalSearchParam.LAST_ID,

            CUST_GROUP1: self.finalSearchParam.CUST_GROUP1,
            CUST_GROUP2: self.finalSearchParam.CUST_GROUP2,
            CUST_LEVEL_GROUP: self.finalSearchParam.CUST_LEVEL_GROUP,
            CUST_LEVEL_GROUP_CHK: self.finalSearchParam.CUST_LEVEL_GROUP_CHK,
            SITE_LEVEL_GROUP: self.finalSearchParam.SITE_LEVEL_GROUP,
            SITE_LEVEL_GROUP_CHK: self.finalSearchParam.SITE_LEVEL_GROUP_CHK,
            BILL_NO: self.finalSearchParam.BILL_NO,
            CHECKJOURNAL: self.journalFlag,
            DOC_NO: self.finalSearchParam.DOC_NO,
            PARENT_URL: "/ECERP/EBG/EBG015M",
            PRG_URL: data.rowItem['PRG_URL'],
            EC_PAGE: encodeURIComponent(Object.toJSON(
                {
                    formdata: self.header.extract("all").result,
                    _userParam:
                    {
                        C_DATE_NO: data.rowItem['TRX_DATE'] + data.rowItem['TRX_NO'] + (self.journalFlag == "1" ? data.rowItem.SLIP_SER : ""),
                        C_formSer: 1,
                        JournalFlag: self.journalFlag,
                        isShowSearchForm: 2,
                        C_param: self.finalSearchParam,
                        C_CurrentPage: self.contents.getGrid("dataGrid").grid.settings().getPagingCurrentPage(),
                    },
                    view: {
                        currentTabId: self.header.currentTabId,
                        currentPage: null,
                        scroll: $(document).scrollTop()
                    }
                })),
            EC_Param: Object.toJSON(EC_Param),
        }


        //재고연결전표 확인여부
        optionData.isCheckinventory = ecount.config.inventory.USE_BALANCE_BASIS == false ? true : false;

        //결과값 받아서 처리 callback함수
        optionData.callback = function (option) {
            if (option.URL) {
                var dateno = "";
                if (self.journalFlag == "1") {
                    dateno = option.hidSearchData.TRX_DATE + option.hidSearchData.TRX_NO + data.rowItem.SLIP_SER;
                } else {
                    dateno = option.hidSearchData.TRX_DATE + option.hidSearchData.TRX_NO;
                }

                var paramData = {
                    url: option.URL,
                    popupType: option.URL.toUpperCase().indexOf("ECMAIN") > -1 ? true : false,
                    param: option.PARAM,
                    _userParam: {
                        C_DATE_NO: dateno,
                        C_formSer: 1,
                        JournalFlag: self.journalFlag,
                        isShowSearchForm: 2,
                        C_param: self.finalSearchParam,
                        C_CurrentPage: self.contents.getGrid("dataGrid").grid.settings().getPagingCurrentPage(),
                    },
                    formdata: self.finalHeaderSearch,
                };
                if (option.URL == "/ECERP/SVC/ESD/ESD006M") {
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            }
                        }
                    };
                    self.openWindow(paramData);
                }
                else if (option.URL == "/ECERP/SVC/EBD/EBD010M_09") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '40',
                            SerNo: '01',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_10") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '45',
                            SerNo: '01',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_54") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '16',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_05_00") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '16',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_13_00") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '02',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_16") { //To Credit Card
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '07',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                }
                else if (option.URL == "/ECERP/SVC/EBD/EBD010M_32") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '10',
                            SerNo: '08',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD001M") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            SerNo: option.PARAM.SER_NO,
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_02") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            SerNo: option.PARAM.SER_NO,
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_01") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '10',
                            SerNo: '02',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_55") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '15',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_50") { //To Customs Broker
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '13',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_13_001") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '08',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_51") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '90',
                            SerNo: '03',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_11") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010407",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '50',
                            SerNo: '01',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_12") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010407",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '10',
                            SerNo: '05',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (["/ECERP/SVC/EBD/EBD010M_04", "/ECERP/SVC/EBD/EBD010M_03"].contains(option.URL)) {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            SerNo: option.PARAM.SER_NO,
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_52") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_15") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_53") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_06") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else if (option.URL == "/ECERP/SVC/EBD/EBD010M_05_001") {
                    data["M_SlipType"] = option.hidSearchData.SLIP_TYPE;
                    paramData.param = {
                        Request: {
                            Key: {
                                Date: option.PARAM.IO_DATE,
                                No: option.PARAM.IO_NO
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010707",
                            PrevUrl: "/ECERP/EBG/EBG015M",
                            UIOption: {
                                Width: 800,
                                Height: 600
                            },
                            TrxType: '20',
                            SerNo: '05',
                            hidSearchXml: ecount.common.toXML(data),
                        }
                    };
                    self.openWindow(paramData);
                } else {
                    self.openWindow(paramData);
                }
            } else {
                var paramTemp = {};
                paramTemp = {
                    Io_Date: data.rowItem['IO_DATE'],
                    Io_No: data.rowItem['IO_NO'],
                    hidEditFlag: 'M'
                }
                paramTemp.width = "800";
                paramTemp.height = "500";

                self.openWindow({
                    url: "/ECMain/ETA/ETA004M.aspx?ListYn=Y",
                    name: ecount.resource.LBL01618,
                    param: paramTemp,
                    popupType: true,
                    fpopupID: self.ecPageID
                });
            }
        }

        //회계전표연결 체크로직(Check Connect Invoice)
        ecmodule.account.common.checkConnectInvoice(optionData);
    },

    CustomTotal2: function (value, rowItem) {
        var option = {};
        if (rowItem._MERGE_SET != undefined) {
            var temp = '0';
            var grid = this.contents.getGrid();
            var columnList = grid.grid.getColumnInfoList();
            var thousandSeparator = columnList[2].thousandSeparator;
            var decimalSeparator = columnList[2].decimalSeparator;
            if (rowItem.A2) {
                temp = rowItem.A2.replace(/,/g, '');
            }
            value = String.fastFormat(temp, {
                fractionLimit: ecount.config.company.DEC_AMT,
                removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
            });
            option.data = value;


        }
        return option;
    },

    CustomTotal3: function (value, rowItem) {
        var option = {};
        if (rowItem._MERGE_SET != undefined) {
            var temp = '0';
            var grid = this.contents.getGrid();
            var columnList = grid.grid.getColumnInfoList();
            var thousandSeparator = columnList[3].thousandSeparator;
            var decimalSeparator = columnList[3].decimalSeparator;
            if (rowItem.A3) {
                temp = rowItem.A3.replace(/,/g, '');
            }

            value = String.fastFormat(temp, {
                fractionLimit: ecount.config.company.DEC_AMT,
                removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
            });
            option.data = value;
        }
        return option;
    },

    //Custom row code_no()
    setGridCODE_NO: function (value, rowItem) {
        var option = {};
        if (this.journalFlag == "1") {
            if (rowItem._MERGE_SET != undefined) {
                var grid = this.contents.getGrid();
                var columnList = grid.grid.getColumnInfoList();
                if (columnList) {
                    if (columnList.length > 2) {
                        if (columnList[2].id == "acsl_doc_no.code_no" || columnList[3].id == "acsl_doc_no.code_no") {
                            var temp = '0';
                            var thousandSeparator = ecount.config.company.THOU_SEPARATOR;
                            var decimalSeparator = ecount.config.company.DEC_SEPARATOR;
                            if (rowItem.A2 && columnList[2].id == "acsl_doc_no.code_no") {
                                temp = rowItem.A2.replace(/,/g, '');
                                thousandSeparator = columnList[2].thousandSeparator;
                                decimalSeparator = columnList[2].decimalSeparator;
                            } else if (rowItem.A3 && columnList[3].id == "acsl_doc_no.code_no") {
                                temp = rowItem.A3.replace(/,/g, '');
                                thousandSeparator = columnList[3].thousandSeparator;
                                decimalSeparator = columnList[3].decimalSeparator;
                            }

                            value = String.fastFormat(temp, {
                                fractionLimit: ecount.config.company.DEC_AMT,
                                removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
                            });
                            option.data = value;
                            return option;
                        } else {
                            option.data = "";
                            return option;
                        }
                    }
                }
            }
        }
        var strDes = '';
        if (rowItem._MERGE_SET != undefined) {
            option.data = '';
        }
        else {
            if (value == '0')
                strDes = "";
            else
                strDes = value;
            option.data = strDes;
        }
        return option;
    },

    //Custom row Credit
    setGridCredit: function (value, rowItem) {
        var option = {};
        if (rowItem._MERGE_SET != undefined) {
            var grid = this.contents.getGrid();
            var columnList = grid.grid.getColumnInfoList();
            if (columnList) {
                if (columnList.length > 2) {
                    if (columnList[2].id == "acc101.cr_amt" || columnList[3].id == "acc101.cr_amt") {
                        var temp = '0';
                        var thousandSeparator = ecount.config.company.THOU_SEPARATOR;
                        var decimalSeparator = ecount.config.company.DEC_SEPARATOR;
                        if (rowItem.A2 && columnList[2].id == "acc101.cr_amt") {
                            temp = rowItem.A2.replace(/,/g, '');
                            thousandSeparator = columnList[2].thousandSeparator;
                            decimalSeparator = columnList[2].decimalSeparator;
                        } else if (rowItem.A3 && columnList[3].id == "acc101.cr_amt") {
                            temp = rowItem.A3.replace(/,/g, '');
                            thousandSeparator = columnList[3].thousandSeparator;
                            decimalSeparator = columnList[3].decimalSeparator;
                        }
                        value = String.fastFormat(temp, {
                            fractionLimit: ecount.config.company.DEC_AMT,
                            removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
                        });
                        option.data = value;
                        return option;
                    } else {
                        option.data = "";
                        return option;
                    }
                }
            }
        }
        var valueCredit = rowItem.CR_AMT;
        if (valueCredit != null && valueCredit != 0 && valueCredit != "") {
            if (rowItem.SLIP_GUBUN == "1") {
                option.data = "(" + value + ")";
            } else {
                option.data = value;
            }
        } else {
            option.data = "";
        }

        return option;
    },

    //custom cell Dr ()
    setGridDr: function (value, rowItem) {
        var option = {};
        if (rowItem._MERGE_SET != undefined) {
            var grid = this.contents.getGrid();
            var columnList = grid.grid.getColumnInfoList();
            if (columnList) {
                if (columnList.length > 2) {
                    if (columnList[2].id == "acc101.dr_amt" || columnList[3].id == "acc101.dr_amt") {
                        var temp = '0';
                        var thousandSeparator = ecount.config.company.THOU_SEPARATOR;
                        var decimalSeparator = ecount.config.company.DEC_SEPARATOR;
                        if (rowItem.A2 && columnList[2].id == "acc101.dr_amt") {
                            temp = rowItem.A2.replace(/,/g, '');
                            thousandSeparator = columnList[2].thousandSeparator;
                            decimalSeparator = columnList[2].decimalSeparator;
                        } else if (rowItem.A3 && columnList[3].id == "acc101.dr_amt") {
                            temp = rowItem.A3.replace(/,/g, '');
                            thousandSeparator = columnList[3].thousandSeparator;
                            decimalSeparator = columnList[3].decimalSeparator;
                        }

                        value = String.fastFormat(temp, {
                            fractionLimit: ecount.config.company.DEC_AMT,
                            removeFractionIfZero: false, currencySeparator: thousandSeparator, fractionSeparator: decimalSeparator
                        });
                        option.data = value;
                        return option;
                    } else {
                        option.data = "";
                        return option;
                    }
                }
            }
        }
        var valueCredit = rowItem.DR_AMT;
        if (valueCredit != null && valueCredit != 0 && valueCredit != "") {
            if (rowItem.SLIP_GUBUN == "2") {
                option.data = "(" + value + ")";
            } else {
                option.data = value;
            }
        } else {
            option.data = "";
        }

        return option;
    },

    //오더관리진행단계 > 조회 클릭 > 전표번호 클릭
    fnModifySlip: function (pdata, pdata_no, strSlipType, pdata_serno, accSlipType) {
        return;
    },

    //create data for confirm and undo confirm
    setConfirmApiJsonData: function (apiData, gubun) {
        var ConfirmDtoList = [];
        $.each(apiData, function (i, val) {
            ConfirmDtoList.push({
                TRX_DATE: val.TRX_DATE,
                TRX_NO: val.TRX_NO,
                SLIPTYPE: "2",
                VERSION_NO: val.VERSION_NO,
                GUBUN: gubun
            });
        });
        return ConfirmDtoList;
    },

    //Select Delete API calls(gọi API để xóa)
    callDeleteListApi: function (selectItem) {
        var self = this;
        var checkpermist = self.setDeleteListApiJsonData(selectItem);
        if (checkpermist == false) {
            self.hideProgressbar(true);
            return
        }
        var formData = Object.toJSON({
            DeleteListInfo: self.setDeleteListApiJsonData(selectItem),
            SlipType: self.strSlipType1
        });

        ecount.common.api({
            url: "/Account/Common/DeleteAccountVoucher",
            data: formData,
            error: function (errorMsg) {
                var message = JSON.parse(errorMsg.responseText);
                var msg = message.Error.Message.replace(/\\n/g, '</br>');
                ecount.alert(msg + '</br>' + message.Error.MessageDetail);
                return false
            },
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (!$.isEmpty(result.Data)) {
                    self.errDataAllKey = result.Data;
                    self.contents.getGrid().draw(self.finalSearchParam);
                    self.fnErrMessage(result.Data);
                } else {
                    for (var idx = 0, limit = selectItem.length; idx < limit; idx++) {
                        self.contents.getGrid().grid.removeChecked(selectItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                    }
                    self.contents.getGrid().draw(self.finalSearchParam);
                }
            },
            complete: function () {
                self.hideProgressbar(true);
            }
        });
    },

    //Create data json for delete selected
    setDeleteListApiJsonData: function (apiData) {
        var self = this;
        var tempUserpermit = self.userPermit;
        var DeleteDtoList = [];

        $.each(apiData, function (i, val) {
            if (self.perType == "1" || tempUserpermit == "W") {
                self.ErrFlag = "N";
                var ioSlipData = val.TRX_DATE.substr(0, 4) + "/" + val.TRX_DATE.substr(4, 2) + "/" + val.TRX_DATE.substr(6, 2) + "-" + val.TRX_NO;
                DeleteDtoList.push({
                    TrxDate: val.TRX_DATE,
                    TrxType: val.TRX_TYPE,
                    TrxNo: val.TRX_NO,
                    SerNo: val.SER_NO,
                    AccSSystem: val.S_SYSTEM,
                    VersionNo: val.VERSION_NO,
                    GbType: val.GB_TYPE3,
                    TemplateDate: ioSlipData,
                    Unconfirm_Flag: "Y"
                });
            } else {
                var message = ecount.resource.MSG00141;
                ecount.alert(message);
                return false;
            }
        });
        return DeleteDtoList;
    },

    //Error Message
    fnErrMessage: function (ErrMsg) {
        var formErrMsg = Object.toJSON(ErrMsg);
        var param = {
            width: 600,
            height: 500,
            datas: formErrMsg
        }
        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeCommonDeletable",
            name: 'SendingEC',
            param: param,
            popupType: true,
            fpopupID: this.ecPageID
        });
    },

    //Show tooltip(Hiển thị tootip)
    printTooltip: function (option) {
        var returnText = ecount.resource.LBL06600.unescapeHTML();
        var tooltip = {
            latrlyDate: "",
            latrlyId: "",
            hits: "",
            latrlyDateCs: "",
            latrlyIdCs: "",
            hitsCs: ""
        }

        tooltip = $.extend({}, tooltip, option || {})
        if ($.isEmpty(tooltip.latrlyDate) && $.isEmpty(tooltip.latrlyDateCs))
            return returnText
        if ($.isEmpty(tooltip.latrlyDate)) {
            returnText = String.format(ecount.resource.LBL06601, tooltip.latrlyIdCs, Date.ecFormat("G", tooltip.latrlyDateCs), tooltip.hitsCs);
        }
        else if ($.isEmpty(tooltip.latrlyDateCs)) {
            returnText = String.format(ecount.resource.LBL06602, tooltip.latrlyId, Date.ecFormat("G", tooltip.latrlyDate), tooltip.hits);
        }
        else {
            returnText = String.format(ecount.resource.LBL06603, tooltip.latrlyId, Date.ecFormat("G", tooltip.latrlyDate), tooltip.hits, tooltip.latrlyIdCs, Date.ecFormat("E", tooltip.latrlyDateCs), tooltip.hitsCs);
        }

        return returnText;
    },

    /*---------------------  재고  Confirm/cancle Start ---------------------*/
    /**
    *  회계 - 확인/확인취소 하단 버튼 클릭시 
    **/
    procConfirmStateChangeMulti: function () {
        this.procConfirmStateChange(this.contents.getGrid().grid.getChecked());
    },

    // 회계 - 확인/확인취소
    procConfirmStateChange: function (selectItem) {
        var gbType = "Y";        // 현재 GB_TYPE 
        var res = ecount.resource;
        var msg = res.MSG02306;

        // 권한체크: 확인기능 사용여부 체크 및  입력 모든 권한        
        if (ecount.config.user.SLIP_PER_TYPE != "1") {  // 마스터가 아닐때만
            if (ecount.config.user.SLIP_PER_TYPE == "4") {     // // 회계 전표 수정/조회 권한으로 체크 
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02506, PermissionMode: "C" }]);    // 확인권한
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }
        }

        // 단일, 다중 모두 사용 한다. (즉 그리드에서 확인여부 클릭시 or 버튼클릭으로 선택된 리스트)
        if (selectItem.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        ecount.confirm(msg, function (status) {
            if (status === true) {
                // 선택된 데이타 정보 Get, 편집일자등 체크 해서 실패리스트가 있으면 처리 하지 않음 (차후 확인 공통화 때 처리 로직 처리) 
                if (this.getSelectedItemsForConfirm(selectItem) == false) return false;
                this.callConfirmApi(selectItem, gbType == "Y" ? "Y" : "N");
            }
        }.bind(this));
    },

    // 회계 - 확인/확인취소: 선택된 리스트 값 Get 
    getSelectedItemsForConfirm: function (selectItem) {
        var limitDate = ecount.config.account.LIMIT_DATE.left(10).toDate().format("yyyyMMdd");
        var trxNoType = "";
        var failListByAccountDate = "", failListByClosing = "", trxDateNoTypeList = "", trxDataeAndNoList = "";

        $.each(selectItem, function (i, data) {
            trxNoType = data[this.columnMap.TRX_DATE] + "-" + data[this.columnMap.TRX_NO];

            if (data[this.columnMap.TRX_DATE] < limitDate) {  //  편집제한일자
                failListByAccountDate += trxNoType + this.splitFlag;
            } else if ((data.TRX_TYPE == "98" && data.SER_NO == "99") || (data.TRX_TYPE == "98" && data.SER_NO == "97")) {
                // 결산 전표이면 확인 처리 할수 없다. 
                failListByClosing += trxNoType + this.splitFlag;
            }
            else {
                trxDateNoTypeList += trxNoType + this.splitFlag;
            }
        }.bind(this));

        trxDataeAndNoList = trxDataeAndNoList.substring(0, trxDataeAndNoList.length - 1);

        if (failListByAccountDate != "") {
            ecount.alert(String.format(ecount.resource.MSG04617, ecount.resource.LBL01042));
            return false;
        }

        if (failListByClosing != "") {
            ecount.alert(ecount.resource.MSG00342);
            return false;
        }

        return true;
    },

    // 회계 Select Delete API calls(gọi API để xóa)
    callConfirmApi: function (selectItem, gbType) {
        var self = this;
        var formData = Object.toJSON({
            ConfirmDataList: self.setConfirmApiJsonData(selectItem, gbType)
        });

        ecount.common.api({
            url: "/Account/Common/ConfirmList",
            data: formData,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (!$.isEmpty(result.Data)) {
                    self.errDataAllKey = result.Data;
                    self.contents.getGrid().draw(self.finalSearchParam);
                    self.showErrMessageForSlip(gbType == "Y" ? "Confirm" : "UndoConfirm", result.Data);
                } else {

                    selectItem.forEach(function (slip) {
                        slip.SLIP_CD = ecmodule.common.notification.getAcccountSlipCd(slip.TRX_TYPE, slip.SER_NO);
                    });
                    ecmodule.common.notification.updateNotiToMessenger({
                        roomSeq: self.ROOM_SEQ,             //Room seq when it is called from messenger
                        actionType: gbType == "Y" ? "C" : "CC",  //refer to the SFMS_MESSENGER_LINK_ACTION_TYPE.cs
                        data: selectItem
                    });
                    self.contents.getGrid().draw(self.finalSearchParam);
                }

            },
            complete: function () {
                self.hideProgressbar(true);
                self.footer.getControl("confirm").setAllowClick();
            }
        });
    },

    // 회계 - 확인/확인취소create data for confirm and undo confirm  bsy 신규로 만든거
    setConfirmApiJsonData: function (apiData, gbType) {
        var self = this;
        var ConfirmDtoList = [];
        $.each(apiData, function (i, item) {
            ConfirmDtoList.push(self.getConfirmParam(item, gbType));
        }.bind(this));
        return ConfirmDtoList;
    },

    // 확인/취소 파라미터 생성 (Get confirm param)
    getConfirmParam: function (item, gbType) {
        var param = {
            TRX_TYPE: item.TRX_TYPE,
            TRX_DATE: item.TRX_DATE,
            TRX_NO: item.TRX_NO,
            SER_NO: item.SER_NO,
            GB_TYPE: gbType,
            VERSION_NO: item.VERSION_NO,
            SLIPTYPE: "2",
            IsCheckVersion: true,
            IsUpdateVersionCheck: true,
        }

        if (item.TRX_TYPE == "45" && item.SER_NO == "10") {
            $.extend(param, {
                UseFixedAssets: true,
                ASSETS_STATUS: '1'          // 증가(Increase) 
            });
        }

        return param;
    },

    /*---------  회계 Confirm/cancle End ---------------------*/

    //Reload page (Tải lại trang)
    reloadPage: function () {
        var EC_Param = this.finalSearchParam;
        EC_Param.JournalFlag = this.journalFlag;
        EC_Param.C_CurrentPage = "1";

        var params = {};
        params.EC_Param = EC_Param;

        this.onAllSubmitSelf({
            url: "/ECERP/EBG/EBG015M",
            formdata: this.finalHeaderSearch,
            param: params
        });
    },

    _ON_REDRAW: function (param) {
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }
        this.setReload((param && param.editDateNo || ""));
    },

    // Reload grid
    setReload: function (editDateNo) {
        this.cDateNo = "";
        if ($.isEmpty(editDateNo) == false) {
            this.cDateNo = editDateNo;
        }

        this.contents.getGrid().grid.clearChecked();
        this.contents.getGrid().draw(this.finalSearchParam);
    },

    // 다음전표
    slipNext: function (param) {
        var currentIndex = param && param.currentIndex;
        var linkColumnId = param && param.linkColumnId;
        var callback = param && param.callback;
        var grid = this.contents.getGrid(this.gridName).grid;
        var shadedColumn = grid.getShadedColumn();
        var currentPage = grid.settings().getPagingCurrentPage();

        // 클릭된 링크가 없는 경우 종료
        if (($.isNull(currentIndex) || $.isNull(linkColumnId)) && $.isEmpty(shadedColumn)) {
            return;
        }

        if ($.isNull(currentIndex)) {
            if (this.isShowNextSlipOfPrePage) {
                currentIndex = grid.getRowCount();
            } else {
                var shadedRowKey = shadedColumn.first().shadedKey;
                if ($.isArray(shadedRowKey)) {
                    shadedRowKey = shadedRowKey.first();
                }
                currentIndex = grid.getRowIndexByKey(shadedRowKey);
            }
        }

        // [1] 다음전표가 없는 경우
        if (currentIndex == 0 && currentPage == 1) {
            this.isShowNextSlipOfPrePage = false;
            ecount.alert(ecount.resource.MSG07882);
        }

            // [2] 다음전표가 전 페이지에 있는 경우
        else if (currentIndex == 0 && currentPage > 1) {
            this.isShowNextSlipOfPrePage = true;
            grid.settings().setPagingCurrentPage(currentPage - 1);
            this._ON_REDRAW({ unfocus: true });
        }

            // [3] 다음전표가 현재 페이지에 있는 경우
        else if (currentIndex > 0) {
            linkColumnId = linkColumnId || shadedColumn.first().columnId;
            var nextIndex = currentIndex - 1;
            var nextKey = grid.getRowKeyByIndex(nextIndex);
            var nextRowItem = grid.getRowItem(nextKey);
            var controlType = grid.getCellControlType(linkColumnId, nextKey);
            var data = {
                rowItem: nextRowItem,
                callback: callback
            };

            // 링크가 아닌 경우 다음전표로 넘어감
            if (controlType != "widget.link") {
                this.slipNext({
                    currentIndex: nextIndex,
                    linkColumnId: linkColumnId,
                    callback: callback
                });
                return;
            }

            this.isShowNextSlipOfPrePage = false;
            grid.setCellFocus(linkColumnId, nextKey, { direction: "up" });
            grid.clickShadedByKey(linkColumnId, nextKey);

            if (this.journalFlag == "1") {
                this.slipLinkClickJournal(null, data);
            } else {
                this.slipLinkClick(null, data);
            }
        }
            // [4] 기타 오류
        else {
            this.isShowNextSlipOfPrePage = false;
        }
    },

    erpCDToPrgId: function (erpCd) {

        switch (erpCd) {
            case "CASE94"://지출결의서
                retval = "E010408";
                break;
            case "CASE93"://입금보고서
                retval = "E010403";
                break;
            case "EST"://견적서
                retval = "E040201";
                break;
            case "ORD"://주문서
                retval = "E040203";
                break;
            case "HYUN"://발주요청서
                retval = "E040314";
                break;
            case "REQ"://발주서
                retval = "E040301";
                break;
            case "PLN"://작업지시서
                retval = "E040411";
                break;
            default:
                retval = erpCd;
                break;
        }
        return retval;

    }
    

});
