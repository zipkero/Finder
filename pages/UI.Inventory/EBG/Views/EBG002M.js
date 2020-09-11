window.__define_resource && __define_resource("LBL93100","MSG01136","LBL03634","BTN00575","LBL35850","LBL03682","MSG00706","LBL02253","LBL02186","BTN00054","LBL05309","LBL05396");
/****************************************************************************************************
1. Create Date : 2016-09-12.
2. Creator     : Luong Ngoc Hoang
3. Description : Acct. I > Voucher > Print Receipt Journal
4. Precaution  :  
5. History     : 2018.06.05 (이현택) - 계정코드 체크 갯수 100개로 제한
                 2019.09.12 (LuongAnhDuy) - A19_02351 - 지출결의서인쇄 출금계좌에 카드도 보이도록
6. Old file    : EBG/EBG002M.aspx?RptGubun=2 
****************************************************************************************************/
ecount.page.factory("ecount.page.list.search.account", "EBG002M", {

    strRptGubun: null,

    FormOutSet: null,

    strBeforeFlag: "AFTER",

    initPageDefaultData: function () {

        //현재 페이지의 정보
        this.pageInfo = {
            type: "account",                                // 전표타입
            //inventoryType: "sale",
            //printType: "invoice",                   // 청구서인쇄
            path: "/ECERP/EBG/EBG002M",                     // 페이지 URL        
            formTypeCode: "AR050",                          // 리스트 양식타입(grid form type)         AR080             
            formTypeSearch: "AM560",                        // 검색조건 양식타입(search form type)            
            title: ecount.resource.LBL93100,                // 페이지 타이틀            
            isNewSearchFormType: true,                      // 검색 양식 신규로    
            useFormList: true,
            Permission: this.viewBag.Permission.Permit,
            // data 컬럼 관련   - 종결:P_FLAG
            columnMap: {
                IO_TYPE: "IO_TYPE", GB_TYPE: "GB_TYPE", VERSION: "VERSION_NO", TRX_DATE: "TRX_DATE", TRX_NO: "TRX_NO"
            },
            //  엑셀관련

            footerButton:
                [
                    { id: "new", isUse: false },
                    { id: "excel", isUse: false },
                    { id: "deleteSelected", isUse: false }, //id: "deleteSelected"
                    { id: "email", isUse: false },
                    { id: "confirm", isUse: false }
                ],
            // 위젯관련
            menuAuth: "ACCT_CHK",

            MenuSeq: 105,

            // 전표정보 
            slip: function (rowItem, param) {
                return {
                    type: "account",  // 한 그리드에 여러개의 전표 타입이 올수 있으므로
                    // columnMap: { IO_DATE: "IO_DATE", IO_NO: "IO_NO", IO_TYPE: "IO_TYPE" },
                    useEcParam: true,
                    param: {
                        //strMPflag: this.contents.currentTabId
                    }
                }
            }.bind(this),

            // DAC과 연동되면 dac프로퍼티 규칙 적용, 기타는 자바스크립트 규칙적용
            defaultSearchParam: {}

        };

        //그리드 정보 설정        
        this.gridInfo = function (param) {
            var isJournal = param.JOURNAL && param.JOURNAL[0] == "1" ? true : false;

            switch (this.contents.currentTabId) {
                case 'tabAll':
                    param.BEFORE_FLAG = "";
                    break;
                case "tabUnconfirmed":
                    param.BEFORE_FLAG = "N";
                    break;
                case "tabConfirm":
                    param.BEFORE_FLAG = "Y";
                    break;
            }

            return {
                hasFormType: true,                                      // 양식 사용할지 여부(true : 사용, false : 직접페이지에서 설정하는 설정)
                api: [{ path: "/Inventory/Purchases/GetListPrintReceiptJournal" }],
                keyColumn: isJournal ? ['TRX_DATE', 'TRX_NO', 'SLIP_SER', 'SLIP_NO'] : ['TRX_DATE', 'TRX_NO'],                        // key column                
                shaded: ["acc100.trx_date", "acc100.trx_date_no"],            // shaded cell target(formset/noFormset)
                //grid init field
                field: [
                    { id: ecount.grid.constValue.checkBoxPropertyName, type: "checkStatus" },
                    { id: "acc100.trx_date", type: "custom" },                 // 전표 연결하기    
                    { id: "acc100.trx_date_no", type: "custom" },              // 전표 연결하기                        
                    { id: "acsl_doc_no.doc_no", type: "acslDocNo" },
                    { id: "acsl_doc_no.code_no", type: "acslCodeNo" },
                    { id: "acc100.s_print_s", type: "custom", fn: this.configCellPrint1.bind(this) },
                    { id: "acc100.s_print", type: "custom", fn: this.configCellPrint2.bind(this) },
                    { id: "acc100.s_print_detail", type: "custom", fn: this.configCellPrint3.bind(this) },
                    { id: "acc100.s_print_deposit_slip", type: "custom", fn: this.configCellPrint4.bind(this) },
                ]
            }
        };
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);

        this.strRptGubun = this.viewBag.FormInfos["RPT_GUBUN"];
        this.FormoutSet = this.viewBag.FormInfos["FormoutSet"];

        var res = ecount.resource;
        var ctrl = widget.generator.control();
        if (cid == "txtSCustCd" || cid == "txtItemCd" || cid == "txtCustGroup1" || cid == "txtCustGroup2"
            || cid == "txtSProdCd" || cid == "txtLastUpdatedID" || cid == "txtFirstWriteID") {
            control.setOptions({
                isApplyDisplayFlag: true,
                isCheckBoxDisplayFlag: true,
                checkMaxCount: 100
            });
        }
        switch (cid) {
            case 'txtDocNo':
                control.filter('maxlength', { message: String.format(res.MSG01136, '30', '30'), max: 30 });
                break;
        }
    },

    // Footer Initialization ( khởi tạo footer )
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup = [];

        addgroup.push({
            id: "PrintByVoucher", label: ecount.resource.LBL03634
        });
        addgroup.push({
            id: "PrintVoucher", label: ecount.resource.BTN00575
        });
        toolbar.addLeft(ctrl.define("widget.button.group", "Print").label(ecount.resource.LBL35850).addGroup(addgroup));

        footer.add(toolbar);
    },

    //[Print] Footer Button 
    onFooterPrint: function () {
        this.openPrintPopup(null, "1");
    },

    onButtonPrintVoucher: function () {
        this.openPrintPopup(null, "2");
    },
    onButtonPrintByVoucher: function () {
        this.openPrintPopup(null, "3");
    },
    onAutoCompleteHandler: function (control, keyword, param, handler) {
        var addParam;
        switch (control.id) {
            case "acct_no_f":
                addParam = {
                    CALL_TYPE: '1',
                    isOthersDataFlag: "N",
                    ACC002_FLAG: 'Y',
                    DEL_FLAG: 'N',
                    EMP_FLAG: 'N',
                    PROD_SEARCH: '9',
                    IO_TYPE: '00',
                    TYPE: 'ACCTCM'
                }
                break;
        }
        this._super.onAutoCompleteHandler.apply(this, [control, keyword, param, handler, addParam]);
    },
    onPopupHandler: function (control, param, handler) {
        var addParam;

        switch (control.id) {
            case "acct_no_f":
                addParam = {
                    CallType: '1',
                    gubun: 'CASE93',//Employee (Nhân  viên)
                    checkMaxCount: 100,
                    isApplyDisplayFlag: true,
                    isCheckBoxDisplayFlag: true,
                    isIncludeInactive: true,
                    isOthersDataFlag: 'Y',
                    searchCategoryFlag: 'A',
                    Type: 'ACCTCM',
                    ACC002_FLG: 'Y',
                    MergeFlag: 'Y',
                    empflag: 'N',
                    iotype: '00',
                    delflag: 'N',
                    accflag: 'Y',
                    strInputFlag: 'N',
                    PageGubun: 'Y',
                    isCommonFlag: false
                }
                break;
            case "txtFirstWriteID":
                addParam = {
                    isApplyDisplayFlag: false,
                    popupType: false,
                    additional: false,
                    Type: false,
                    Title: ecount.resource.LBL03682,
                    GwUse: true,
                    UserFlag: "id",
                    AddButtonFlag: "y",
                    isIncludeInactive: true,
                    MENU_TYPE: "S",
                    hidGwUse: "1",
                }
                break;

            case "txtLastUpdatedID":
                addParam = {
                    isApplyDisplayFlag: false,
                    popupType: false,
                    additional: false,
                    Type: false,
                    Title: ecount.resource.LBL03682,
                    GwUse: true,
                    UserFlag: "id",
                    AddButtonFlag: "y",
                    isIncludeInactive: true,        // Stop using buttons inclusion(ngưng sử dụng) 
                    MENU_TYPE: "S",
                    hidGwUse: "1",
                }
                break;

            case "txtSCustCd"://Account(tài khoản)
                addParam = {
                    isApplyDisplayFlag: true,       // apply (nút apply)
                    isCheckBoxDisplayFlag: true,    // checkbox (nút checkbox)
                    isIncludeInactive: true,         // Stop using buttons inclusion(ngưng sử dụng) 
                    FilterCustGubun: 101,
                }
                break;
            case "txtCustGroup1", "txtCustGroup2"://Group account(nhóm tài khoản)
                addParam = {
                    isApplyDisplayFlag: true,       // apply      (nút apply)   
                    isCheckBoxDisplayFlag: true,    // checkbox(nút checkbox)
                    isIncludeInactive: true,         // Stop using buttons inclusion(ngưng sử dụng) 
                }
                break;
            case "txtPjtCd"://project(dự án)
                addParam = {
                    isApplyDisplayFlag: true,       // apply (nút apply)
                    isCheckBoxDisplayFlag: true,    // checkbox(nút checkbox)
                    isIncludeInactive: true,         // Stop using buttons inclusion(ngưng sử dụng)
                    searchCategoryFlag: 'A',
                }
                break;
            case "txtSiteCd":
                addParam = {
                    isApplyDisplayFlag: true,
                    isCheckBoxDisplayFlag: true,
                    isIncludeInactive: true,
                    checkMaxCount: 100,
                    CHKFLAG: 'A',
                    isOthersDataFlag: ecount.user.ALL_GROUP_SITE == "1" ? "N" : "Y",
                }
                break;
            case "txtGyeCode":
                addParam = {
                    isApplyDisplayFlag: true,       // apply (nút apply)
                    isCheckBoxDisplayFlag: true,    // checkbox(nút checkbox)
                    isIncludeInactive: true,
                }
                break;
            //checkMaxCount : 1000000,
            case "txtTreeSiteCd":
                addParam = {
                    parentID: 'txtTreeSiteCd',
                }
                break;

        }
        this._super.onPopupHandler.apply(this, [control, param, handler, addParam]);
    },

    // @overide
    filterAppendCheck: function (control) {
        if (control.id == "txtDocNo" && this.autoCodeInfo.USE_DOCNO === false) // && 
            return false;
        return true;
    },

    //Processing Print Order Settings
    sortListByPrintOrderSettings: function (lst) {
        if (lst && lst.length > 1 && lst[0]["TRX_DATE"] != "" && lst[0]["TRX_NO"] > 0) {
            var _printOrder = ecount.config.company.PRT_SORT_CD || "D";
            _printOrder = (_printOrder == "D" ? -1 : 1);
            return lst.sort(function (a, b) {
                var bolResult = _printOrder;
                if (a["TRX_DATE"] < b["TRX_DATE"])
                    bolResult = 0 - _printOrder;
                else if (a["TRX_DATE"] > b["TRX_DATE"])
                    bolResult = _printOrder;
                else
                    bolResult = a["TRX_NO"] < b["TRX_NO"] ? 0 - _printOrder : (bolResult = a["TRX_NO"] > b["TRX_NO"] ? _printOrder : 0);
                return bolResult;
            });
        }
        return lst;
    },

    openPrintPopup: function (printData, actionCode) {
        var fpopupID = null;
        var param = {
            width: 800,
            height: 600
        };

        var selectedItems = null; // list selected items
        if (printData == null) {
            // preparing list selected items when clicked then print button on footter
            var selectedItems = this.contents.getGrid().getCheckedItem();
            if (selectedItems == null || selectedItems.length == 0) {
                ecount.alert(ecount.resource.MSG00706);
                return;
            }
        }

        //Processing Print Order Settings
        selectedItems = this.sortListByPrintOrderSettings(selectedItems);

        var url = "";

        if (printData == null) { // when clicked then print buttons on footer (khi nút được click là nút in ở bên dưới footer)

            switch (this.contents.currentTabId) {
                case "tabConfirm":
                    this.strBeforeFlag = "AFTER";
                    break;
                case "tabUnconfirmed":
                    this.strBeforeFlag = "BEFORE";
                    break;
                case "tabAll":
                    //this.strBeforeFlag = "BEFORE";
                    break;
            }

            param.hidSelValue = "";
            param.hidSelValue = selectedItems.select(function (item) {
                var strTrxDate2 = item.TRX_DATE == null ? null : item.TRX_DATE.toDate().format("yyyy/MM/dd");

                var completed = item.GB_TYPE === "Y" ? "AFTER" : "BEFORE";

                return String.format("{0}-{1}-{2}-CASE09;", strTrxDate2, item.TRX_NO, completed);
            }).join("");
        } else {
            // when clicked print buttons in grid (khi nút được click là nút in ở trên grid)
            switch (this.contents.currentTabId) {
                case "tabConfirm":
                    this.strBeforeFlag = "AFTER";
                    break;
                case "tabUnconfirmed":
                    this.strBeforeFlag = "BEFORE";
                    break;
                case "tabAll":
                    this.strBeforeFlag = printData[0].GB_TYPE === "Y" ? "AFTER" : "BEFORE";
                    break;
            }

            var strTrxDate2 = printData[0].TRX_DATE == null ? null : printData[0].TRX_DATE.toDate().format("yyyy/MM/dd");
            param.hidSelValue = String.format("{0}-{1}-{2};", strTrxDate2, printData[0].TRX_NO, this.strBeforeFlag);
        }

        if (actionCode == "1") {
            url = "/ECERP/SVC/EBG/EBG002P_01";
            fpopupID = "EBG002P_01";
        } else {
            url = "/ECERP/SVC/EBZ/EBZ013P_01";
            fpopupID = "EBZ013P_01";
        }
        // set post request params (thiết lập thêm các tham số post)
        param.RptGubun = this.strRptGubun;
        param.hidPrint = "Y";
        param.hidPrtGubun = (actionCode == "2") ? "N" : "Y";

        // set xml data ( thiết lập data cho dữ liệu xml )
        var data = {};

        data["ddlSYear"] = this.finalSearchParam.BASE_DATE_FROM.substr(0, 4);
        data["ddlSMonth"] = this.finalSearchParam.BASE_DATE_FROM.substr(4, 2);
        data["txtSDay"] = this.finalSearchParam.BASE_DATE_FROM.substr(6, 2);
        data["ddlEYear"] = this.finalSearchParam.BASE_DATE_TO.substr(0, 4);
        data["ddlEMonth"] = this.finalSearchParam.BASE_DATE_TO.substr(4, 2);
        data["txtEDay"] = this.finalSearchParam.BASE_DATE_TO.substr(6, 2);


        var plusMark = "ㆍ";
        var labels = [];

        var searchSiteDes = "", txtTreeSiteCd = "";
        var searchPrjDes = "";
        var searchCustDes = "";
        var searchCustGroupDes1 = "";
        var searchCustGroupDes2 = "";
        var searchCustEmpDes = "";

        var reg_replace = RegExp(ecount.delimiter, "g");

        data["txtSiteCd"] = this.finalSearchParam.SITE != null ? (this.finalSearchParam.SITE + "").replace(reg_replace, "ㆍ") : "";

        labels = this.header.getControl("txtSiteCd", "all") != undefined ? this.header.getControl("txtSiteCd", "all").getSelectedLabel() : [];
        if (labels.length > 0) {
            searchSiteDes = labels.join(plusMark);
        }
        data["txtSiteDes"] = searchSiteDes;

        labels = this.header.getControl("txtTreeSiteCd", "all") != undefined ? this.header.getControl("txtTreeSiteCd", "all").getSelectedLabel() : [];
        if (labels.length > 0) {
            txtTreeSiteCd = labels.join(plusMark);
        }
        data["txtTreeSiteCd"] = txtTreeSiteCd;
        data["txtTreeSiteNm"] = "";
        data["cbSubTreeSite"] = "";

        if (ecount.config.company.USE_PJT == "Y") {
            data["txtPjtCd"] = this.finalSearchParam.PJT_CD != null ? (this.finalSearchParam.PJT_CD + "").replace(reg_replace, "ㆍ") : "";
            labels = ecount.config.company.USE_PJT == "Y" ? (this.header.getControl("txtPjtCd", "all") != undefined ? this.header.getControl("txtPjtCd", "all").getSelectedLabel() : []) : [];
            if (labels.length > 0) {
                searchPrjDes = labels.join(plusMark);
            }
            data["txtPjtDes"] = searchPrjDes;
        } else {
            data["txtPjtCd"] = "";
            data["txtPjtDes"] = "";
        }
        data["M_FirstFlag"] = "Y";

        if (printData == null) {
            if (this.contents.currentTabId === "tabAll") {
                data["M_SlipType"] = "4"; // Hide the template setup button when user is in tab All
            }
        }

        data["M_Page"] = this.contents.getGrid().grid.settings().getPagingCurrentPage();

        data["FirstFlag"] = "Y";
        data["M_Pgm"] = "";
        data["M_Date"] = "";
        data["M_No"] = "0";
        data["M_Type"] = "";
        data["M_TrxSer"] = "";
        data["M_EditFlag"] = "M";
        data["M_RptGubun"] = this.strBeforeFlag == "AFTER" ? "26" : "51";
        data["M_FocusX"] = "0";
        data["M_FocusY"] = "0";
        data["M_SerNo"] = "1";
        data["M_TrxDate"] = "";
        data["M_TrxNo"] = "0";
        data["ddlFormSer"] = "0";
        data["ddlEmpCd"] = "ALL/전체";
        data["txtDocNo"] = (this.header.getControl("txtDocNo", "all") != undefined ? this.header.getControl("txtDocNo", "all").getValue() : "");
        data["hidSelValue"] = param.hidSelValue;
        data["Mode"] = "TRXNO";

        param.hidSearchXml = ecount.common.toXML(data);

        var slips = [];
        param.hidSelValue.split(";").forEach(function (value, index) {
            if (value != "") {
                slips.push({
                    IO_DATE: value.split("-")[0].replaceAll("/", ""),
                    IO_NO: value.split("-")[1]
                });
            }
        });

        var popupDataPrint = {
            width: 800,
            height: 600,
            Request: {
                FORM_TYPE: actionCode == "1" ? "AF050" : "AF020",
                FORM_SEQ: 0,
                Slips: slips,
                Data: {
                    SITE: "",
                    PJT: "",
                    IS_BYLINE: actionCode == "1" ? false : param.hidPrtGubun == "Y" ? true : false,
                    HistoryFormType: actionCode == "1" ? "AF050" : param.hidPrtGubun == "Y" ? "AF100" : "AF070",
                }
            }
        };

        $.extend(param, popupDataPrint);
        param.Request.Data.hidSelValue = param.hidSelValue;
        param.Request.Data.hidPrint = param.hidPrint;
        param.Request.Data.hidSearchXml = param.hidSearchXml;
        param.Request.Data.hidPrtGubun = param.hidPrtGubun;

        // open popup
        this.openWindow({
            url: url,
            name: actionCode == "1" ? ecount.resource.LBL02253 : ecount.resource.LBL02186,
            param: param,
            popupType: false,
            fpopupID: fpopupID
        });
    },

    configCellPrint: function (value, rowItem, actionCode) {
        var option = {};

        var salePermit = this.viewBag.Permission.sale;
        option.controlType = "widget.link";
        option.data = ecount.resource.BTN00054;

        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true
        };

        option.event = {
            'click': function (e, data) {
                if (actionCode == "4") {
                    this.openDepositSlipPopup([data.rowItem], actionCode);
                }
                else
                    this.openPrintPopup([data.rowItem], actionCode);
                e.preventDefault();
            }.bind(this)
        }
        return option;
    },

    openDepositSlipPopup: function (value, rowItem) {
        var param = {
            width: 700,
            height: 600,
            Request: {
                Slips: [
                    {
                        IO_DATE: value[0].TRX_DATE,
                        IO_NO: value[0].TRX_NO,
                        SER_NO: 0,
                        GB_TYPE: "Y",
                        CUST: "",
                        IO_TYPE: "11"
                    }],
                FORM_TYPE: "AF030",
                CS_FLAG: "N",
                FAX_FLAG: "N",
                BASIC_TYPE: "0",
                FORM_SEQ: 100
            }
        };

        this.openWindow({
            url: '/ECERP/SVC/POPUP/EMQ002R_01',
            name: "Deposit Slip",
            param: param,
            popupType: false
        });
    },

    configCellPrint4: function (value, rowItem) {

        if (rowItem["GB_TYPE"] === "Z") return;

        var option = this.configCellPrint(value, rowItem, "4");
        if (!$.isNull(rowItem["HITS4"]) && !$.isEmpty(rowItem["HITS4"]) && rowItem["HITS4"] != "0") {
            option.attrs["class"] = ["text-warning-inverse"];
        } else option.attrs["class"] = ["link-blue"];

        option.attrs['title'] = $.isEmpty(rowItem["LATELY_DATE4"]) ?
            ecount.resource.LBL05309 :
            String.format(self.ecount.resource.LBL05396, rowItem["LATELY_ID4"],
                ecount.infra.getECDateFormat('date11', false, rowItem["LATELY_DATE4"].toDatetime()), rowItem["HITS4"]);
        return option;
    },

    configCellPrint3: function (value, rowItem) {

        if (rowItem["GB_TYPE"] === "Z") return;

        var option = this.configCellPrint(value, rowItem, "3");
        if (!$.isNull(rowItem["HITS3"]) && !$.isEmpty(rowItem["HITS3"]) && rowItem["HITS3"] != "0") {
            option.attrs["class"] = ["text-warning-inverse"];
        } else option.attrs["class"] = ["link-blue"];

        option.attrs['title'] = $.isEmpty(rowItem["LATELY_DATE3"]) ?
                ecount.resource.LBL05309 :
                String.format(self.ecount.resource.LBL05396, rowItem["LATELY_ID3"],
                    ecount.infra.getECDateFormat('date11', false, rowItem["LATELY_DATE3"].toDatetime()), rowItem["HITS3"]);
        return option;
    },

    configCellPrint1: function (value, rowItem) {

        if (rowItem["GB_TYPE"] === "Z") return;

        var option = this.configCellPrint(value, rowItem, "1");
        if (!$.isNull(rowItem["HITS"]) && !$.isEmpty(rowItem["HITS"]) && rowItem["HITS"] != "0") {
            option.attrs["class"] = ["text-warning-inverse"];
        } else option.attrs["class"] = ["link-blue"];

        option.attrs['title'] = $.isEmpty(rowItem["LATELY_DATE"]) ?
               ecount.resource.LBL05309 :
               String.format(self.ecount.resource.LBL05396, rowItem["LATELY_ID"],
                   ecount.infra.getECDateFormat('date11', false, rowItem["LATELY_DATE"].toDatetime()), rowItem["HITS"]);
        return option;
    },

    configCellPrint2: function (value, rowItem) {

        if (rowItem["GB_TYPE"] === "Z") return;

        var option = this.configCellPrint(value, rowItem, "2");
        if (!$.isNull(rowItem["HITS2"]) && !$.isEmpty(rowItem["HITS2"]) && rowItem["HITS2"] != "0") {
            option.attrs["class"] = ["text-warning-inverse"];
        } else option.attrs["class"] = ["link-blue"];

        option.attrs['title'] = $.isEmpty(rowItem["LATELY_DATE2"]) ?
               ecount.resource.LBL05309 :
               String.format(self.ecount.resource.LBL05396, rowItem["LATELY_ID2"],
                   ecount.infra.getECDateFormat('date11', false, rowItem["LATELY_DATE2"].toDatetime()), rowItem["HITS2"]);
        return option;
    },
});