window.__define_resource && __define_resource("LBL93671","LBL93673","LBL90110","LBL93668","LBL01632","LBL02475","LBL01193","LBL00723","BTN00316","LBL09142","LBL12578","BTN00487","LBL03971","LBL01625","LBL03146","BTN00054","LBL06600","LBL06601","LBL06602","LBL06603","LBL00315","LBL12268","LBL07943","LBL07376","LBL03448","LBL17011","LBL05850","LBL05851","LBL05854","LBL05852","LBL05853","LBL01777","LBL14154","LBL14156","LBL14158","LBL02853","LBL04910","LBL04911","LBL04912","LBL04913","LBL04810","LBL04914","LBL04915","LBL07125","BTN00069","LBL09042","LBL09043","LBL10477","BTN00043","BTN00008","MSG00213","BTN00063");
/****************************************************************************************************
1. Create Date : 2015.11.06
2. Creator     : NGUYEN TRAN QUOC BAO
3. Description : SALES INVOICE STATUS
4. Precaution  : 
5. History     : 2016.04.15 최용환 - 엑셀변환 후 엑셀 플래그 수정 
                 2016.05.08 (Tran Quoc Hung) - Refactoring with new rules
                 2016.06.03 (Nguyen Viet Son) - Refactoring with Apply the way of queryset
                 2016.12.22 Luong Ngoc Hoang : refactoring
                 2017.03.06 (Dang Chi) : Add S_SYSTEM : C (contract)
                 2017.06.12 (VuThien): refactoring.
                 2017.12.26 (Nguyen Duy Thanh) - Job A17_03213 - check permission when click "Unlink from Inv. Slip" in View Transaction
                 2018.10.05 (PhiTa) Apply disable sort when data search > 1000
                 2019.05.02 (LuongAnhDuy): A19_01008 - 상대분개 500건, 1년조회 제한로직 제거
6. Old file    : EBG008R.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.list.status.account", "EBG008R", {
    //Define maxCount
    maxCount: 10000,

    isGetSellDetailLoading: false,

    /**************************************************************************************************** 
    * page initialize
    * phần khởi tạo
    ****************************************************************************************************/

    initPageDefaultData: function () {
        this.pageInfo = {
            name: "EBG008R",
            path: "/ECERP/EBG/EBG008R?rbRptSort=" + this.rbRptSort + "&RPTGUBUN=" + this.RPTGUBUN,
            formTypeCode: this.getFormType(), //그리드 양식타입(grid form type)
            formTypeSearch: this.getFormTypeSearch(), //검색조건 양식타입(search form type)
            title: this.getTitle(), //페이지 타이틀
            useDefaultFormType: false, //FORM_SER == 0 사용 여부
            excelApi: [{ path: "/Inventory/Sale/GetListSaleListForExcel" }],
            menuAuth: "ACCT_CHK", //메뉴 권한(ACCT_CHK:회계, SALE_CHK1:재고-구매, SALE_CHK2:재고-판매, SALE_CHK3:재고-기타, SALE_CHK4:재고-A/S)
            Permission: this.viewBag.Permission.sale,
            useSignBox: false,
            IO_TYPE: "1",
            button: {
                graph: false
            },
            commonSlip: function (rowItem, param) {
                return {
                    ProgramId: this.rbRptSort == "B" ? "E010845" : "",
                    param: {
                        IsPopup: true
                    },
                    hidSearchData: {
                        SLIP_TYPE: rowItem['GB_TYPE'] == "N" ? "2" : ""
                    },
                    isPopupOpen: true,
                }
            }.bind(this),
            columnMap: { IO_DATE: "TRX_DATE", IO_NO: "TRX_NO", IO_TYPE: "TRX_TYPE", SER_NO: "SER_NO", PRG_URL: "PRG_URL" }
        };

        this.gridInfo = function (param) {
            var api = "/Inventory/Sale/GetListSaleListByInvoice";
            var field = [
                { id: "ACC301.IO_DATE_NO", type: "acc-common-slip" },
                { id: "ACC301.IO_DATE", type: "acc-common-slip" },
                { id: "ACC301.S_PRINT", type: "custom", fn: this.setGridSPRINT.bind(this) },
                { id: "ACC301.S_DETAIL", type: "custom", fn: this.setGridS_DETAIL.bind(this) },
                { id: "ACC301.ECTAX_FLAG", type: "custom", fn: this.setGridECTAX_FLAG.bind(this) },
                { id: "ACC301.ECTAX_TYPE", type: "custom", fn: this.setGridECTAX_TYPE.bind(this) },
                { id: "ACC301.ECTAX_GB", type: "custom", fn: this.setGridECTAX_GB.bind(this) },
                { id: "ACSL_DOC_NO.DOC_NO", type: "custom", fn: this.setGridDOC_NO.bind(this) },
                { id: "ACSL_DOC_NO.CODE_NO", type: "custom", fn: this.setGridDOC_NO.bind(this) },
                { id: "CREATOR_DATE", type: "custom", fn: this.displayDateColumn.bind(this) },
                { id: "LAST_EDITOR_DATE", type: "custom", fn: this.displayDateColumn.bind(this) },
                { id: "ACC301.CUST_DES", type: "custom", fn: this.setGridCustDes.bind(this) },
                { id: "ACC301.CUST", type: "custom", fn: this.setGridCust.bind(this) },
                { id: "ACC301.serial", type: "serial" }
            ];

            return {
                hasFormParam: true,
                hasFormType: true, //양식 사용할지 여부(true : 사용, false : 직접페이지에서 설정하는 설정)
                api: api,
                sort: { sortable: true, list: ['REALACCOUNT', 'ACC301.serial'] }, //true list => setColumnSortDisableList, false list => setColumnSortEnableList
                shaded: ['ACC301.IO_DATE', 'ACC301.IO_DATE_NO'], //shaded cell target
                field: field, //grid init field
                keyColumn: ['IO_DATE', 'IO_NO']
            }
        }.bind(this);
    },

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.viewBag.FormInfos[this.pageInfo.formTypeSearch] = this.viewBag.FormInfos.formTypeSearch;
        this.viewBag.FormInfos[this.pageInfo.formType] = this.viewBag.FormInfos.formType;
    },

    getGridListType: function () {
        return ecount.grid.constValue.gridRenderType.typeStatusList;
    },

    getTitle: function () {
        switch (this.rbRptSort) {
            case "S":
                return ecount.resource.LBL93671;
            case "T":
                return ecount.resource.LBL93673;
            case "C":
                return ecount.resource.LBL90110;
            default:
                return ecount.resource.LBL93668;
        }
    },

    // set default value for search controls
    // khởi tạo giá trị mặc định cho các search controls
    onInitControl: function (cid, control) {
        switch (cid) {
            case "twTxtIoTypeCd":
                control.setOptions({
                    checkValue: ['', '0', '1', '2', '3'],
                    groupId: "tax"
                });
                break;
            case "EtcChk":
                var ctrl = widget.generator.control();
                control.addControl(ctrl.define("widget.checkbox", "G_CUST_FLAG", "G_CUST_FLAG").label([ecount.resource.LBL01632]).value([1]));
                break;
            case "chkGbType":
                control.label([ecount.resource.LBL02475, ecount.resource.LBL01193, ecount.resource.LBL00723]).value(['A', 'N', 'Y']).isSerializeByAll();
                if (this._userParam != undefined) {
                    if (this._userParam.C_param != undefined)
                        control.select(this._userParam.C_param);
                    else
                        control.select('Y');
                }
                else
                    control.select('Y');
                break;
            default:
                this._super.onInitControl.apply(this, arguments);
                break;
        }

        if (this.isOpenPopup) {
            switch (cid) {
                case "txtIoTypeCd":
                    if (!$.isNull(this.IO_TYPE) && this.IO_TYPE_DES != "") {
                        var code = { label: this.IO_TYPE_DES, value: this.IO_TYPE }
                        control.addCode(code);
                    }
                    break;
                case "txtSCustCd":
                    if (!$.isNull(this.CUST) && this.CUST_DES) {
                        var code = { label: this.CUST_DES, value: this.CUST }
                        control.addCode(code);
                    }
                    break;
            }
        }
    },

    // Setting param when pop-up launch
    onPopupHandler: function (control, param, handler) {
        var addParam;
        switch (control.id) {
            case "txtCustEmpCd":
                addParam = {
                    accountCheckValue: "1",
                }
                break;
            case "txtFirstWriteID":
            case "txtLastEditID":
                addParam = { GwUse: true, Type: true, UserFlag: "id", isIncludeInactive: true, MENU_TYPE: "S", hidGwUse: "1" };
                break;
        }
        this._super.onPopupHandler.apply(this, [control, param, handler, addParam]);
    },

    onGridAfterFormLoad: function (e, data, gridObj) {
        this._super.onGridAfterFormLoad.apply(this, arguments);
        var finalsettings = this.contents.getGrid().getSettings();
        var self = this;
        if (data.columnForm != null) {
            data.columnForm.columns.forEach(function (col, i) {
                if (col.id.indexOf("_MULTI") >= 0) {
                    var colName = col.id;
                    self.setBindCustomRowCell(finalsettings, colName, col);
                }
            }.bind(this));
            gridObj.setSettings(finalsettings);
        }

        if (this.isOpenPopup && this.isOpenPopup == true) {
            gridObj.getSettings().setCheckBoxUse(true);
            gridObj.getSettings().setCheckBoxHeaderStyle({ visible: false });
            gridObj.getSettings().setCheckBoxCheckingDeterminer(this.setCheckBox.bind(this));
            gridObj.getSettings().setCustomRowCell('CHK_H', this.setGridDateCheck.bind(this));
        }
    },

    setInitGridSettings: function (settings, param) {
        param.MENU_GUBUN = this.rbRptSort;
        param.SUM_FLAG = 0;

        if (param.GB_TYPE == "A" && this.header.getSafeControl("chkGbType")) {
            param.GB_TYPE = "";
        }

        settings.setEventUseAfterRowDataLoadForInitialData(true);
    },

    // @override
    useGridTitleViewWidget: function (id, useMultiTable) {
        if (id == "txtCustEmpCd") {
            return false;
        }
        else {
            return this._super.useGridTitleViewWidget.apply(this, arguments);
        }
    },

    setGridS_DETAIL: function (value, rowItem) {
        var dataTemp = {};
        var option = {};

        if (rowItem._MERGE_SET != undefined) {
            option.controlType = "widget.label";
            option.data = '';
        }
        else {
            option.controlType = "widget.link.multi";

            option.parentAttrs = {
                'class': 'text-center'
            }

            option.attrs = {
                'class': { 'class_0': [], 'class_1': [] },
                'type': 'horizontal'
            }
            if (['V', 'S', 'B', 'P', 'C'].contains(rowItem.S_SYSTEM)) {
                // Service Slip
                if (rowItem.S_SYSTEM == 'V') {
                    option.data = [ecount.resource.BTN00316, ecount.resource.LBL09142];
                }

                // Contract Slip
                else if (rowItem.S_SYSTEM == 'C') {
                    option.data = [ecount.resource.BTN00316, ecount.resource.LBL12578];
                }

                // Sales Slip
                else if (['S', 'B', 'P'].contains(rowItem.S_SYSTEM)) {
                    option.data = [ecount.resource.BTN00316, ecount.resource.BTN00487];
                }

                option.event = {
                    'click': function (e, data) {
                        var s_system = data.rowItem['S_SYSTEM'];
                        if (e.target.attributes.linkid.value == "ACC301.s_detail_0") {
                            //View Transaction
                            //Sale = Define("S");SG031
                            //Purchases = Define("B");SG211
                            //Manufacture = Define("P");SG421
                            //Service = Define("V");AG201
                            //Contract = Define("C");AG556
                            var isSVC = "";

                            dataTemp = {
                                ComCode: this.viewBag.ComCode_L,
                                TrxDate: data.rowItem['TRX_DATE'],
                                TrxNo: data.rowItem['TRX_NO'],
                                ConfirmFlag: data.rowItem['GB_TYPE'] == 'Y' ? '9' : '1',
                                PermitCode: this.RPTGUBUN,
                                S_system: data.rowItem['S_SYSTEM'],
                                rbRptSort: this.rbRptSort,
                                TextSaleBuy: 'SALE',
                                PermitCodeNew: data.rowItem['TRX_TYPE'] + data.rowItem['SER_NO']
                            }

                            if (["S", "B", "P"].contains(data.rowItem['S_SYSTEM'])) {
                                dataTemp = { Request: { Data: dataTemp } };
                                isSVC = "SVC/";
                            }

                            dataTemp.width = ecount.infra.getPageWidthFromConfig(true);
                            dataTemp.height = "500";

                            this.openWindow({
                                url: "/ECERP/" + isSVC + "EBZ/EBZ032P_03",
                                name: ecount.resource.LBL03971,
                                param: dataTemp,
                                popupType: false
                            });
                        }
                        else {
                            //Print Slip
                            dataTemp = {
                                com_code: this.viewBag.ComCode_L,
                                trx_date: data.rowItem['TRX_DATE'],
                                trx_no: data.rowItem['TRX_NO'],
                                confirm_flag: data.rowItem['GB_TYPE'] == 'Y' ? '9' : '1',
                                tax_flag: 'Y'
                            }
                            if (data.rowItem['S_SYSTEM'] == 'V')
                                dataTemp.io_gubun = 8;
                            dataTemp.width = "800";
                            dataTemp.height = "500";

                            if (s_system == "C") {
                                this.getContractDetail(data.rowItem['TRX_DATE'], data.rowItem['TRX_NO'], dataTemp);
                            } else {
                                this.getSellDetail(data.rowItem['TRX_DATE'], data.rowItem['TRX_NO'], dataTemp);
                            }
                        }

                        e.preventDefault();
                    }.bind(this)
                }
            }
            else {
                option.controlType = "widget.label";
                if (rowItem.TRX_NO == '0') {
                    option.data = ecount.resource.LBL01625;
                }
                else {
                    option.data = ecount.resource.LBL03146;
                }
            }
        }
        return option;
    },

    setGridSPRINT: function (value, rowItem) {
        var option = {};

        if (rowItem._MERGE_SET != undefined) {
            option.controlType = "widget.label";
            option.data = '';
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
                    hits: rowItem['HITS'],
                    latrlyDateCs: rowItem['CS_LATELY_DATE'],
                    latrlyIdCs: rowItem['CS_LATELY_ID'],
                    hitsCs: rowItem['CS_HITS']
                })
            }

            if (!$.isNull(rowItem["HITS"]) && rowItem["HITS"] != "0") {
                option.attrs["class"] = ["text-warning-inverse"];
            }

            option.event = {
                'click': function (e, data) {
                    this.salePrint([data.rowItem]);
                    e.preventDefault();
                }.bind(this)
            }
        }
        return option;
    },

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
            returnText = String.format(ecount.resource.LBL06601, tooltip.latrlyIdCs, ecount.infra.getECDateFormat('DATE11', false, tooltip.latrlyDateCs.toDatetime()), tooltip.hitsCs);
        }
        else if ($.isEmpty(tooltip.latrlyDateCs)) {
            returnText = String.format(ecount.resource.LBL06602, tooltip.latrlyId, ecount.infra.getECDateFormat('DATE11', false, tooltip.latrlyDate.toDatetime()), tooltip.hits);
        }
        else {
            returnText = String.format(ecount.resource.LBL06603, tooltip.latrlyId, ecount.infra.getECDateFormat('DATE11', false, tooltip.latrlyDate.toDatetime()), tooltip.hits, tooltip.latrlyIdCs, ecount.infra.getECDateFormat('DATE11', false, tooltip.latrlyDateCs.toDatetime()), tooltip.hitsCs);
        }

        return returnText;
    },

    // 회계에 연결된 판매전표 정보 가져오기(Sale Slips information associated with accounting slips)
    getSellDetail: function (trxDate, trxNo, dataTemp) {
        var self = this;
        if (self.isGetSellDetailLoading) {
            return;
        }

        self.isGetSellDetailLoading = true;

        if (dataTemp.io_gubun == 8) {                    //서비스내역서 Popup
            var param = {
                width: dataTemp.width,
                height: dataTemp.height,
                com_code: dataTemp.com_code,
                trx_date: dataTemp.trx_date,
                trx_no: dataTemp.trx_no,
                confirm_flag: dataTemp.confirm_flag,
                tax_flag: dataTemp.tax_flag,
                io_gubun: dataTemp.io_gubun
            }

            self.openWindow({
                url: "/ECMain/ESD/ESD008M_01.aspx",
                method: 'GET',
                name: ecount.resource.LBL09142,
                param: param,
                popupType: true,        //popup
                fpopupID: this.ecPageID
            });

            self.isGetSellDetailLoading = false;
        } else {                                        //거래명세서 Popup
            var param = {
                TRX_DATE: trxDate,
                TRX_NO: trxNo
            };
            self.SlipListInfos = [];

            ecount.common.api({
                url: "/Account/Common/GetSellDetail",
                data: param,
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert("error");
                    } else {
                        $.each(result.Data, function (i, data) {
                            self.SlipListInfos.push({
                                IO_DATE: data.IO_DATE,
                                IO_NO: data.IO_NO,
                                SER_NO: data.SER_NO,
                                IO_TYPE: data.IO_TYPE,
                                GB_TYPE: data.GB_TYPE,
                                CUST: ""
                            })
                        });
                        var param = {
                            width: 1000,
                            height: 850,

                            Request: {
                                Slips: self.SlipListInfos,                           //layer용

                                FORM_TYPE: 'SF030',
                                BASIC_TYPE: "0",    //FOREIGN_FLAG : 내외자 (선택전표중 첫번째 전표의 내외자구분 사용)
                                TAX_FLAG: "N",     //매출청구서 조회 구분
                                //거래명세서인쇄에 사용할 파라미터
                                cs_flag: 'N',
                                allP_Flag: 'Y',
                                fax_Flag: 'Y',
                                Data: {
                                    FROM_DATE: "",
                                    TO_DATE: "",
                                    TradingStatementPrintingYn: "Y",
                                    IsBill: true
                                }
                            }
                        }

                        self.openWindow({
                            url: "/ECERP/SVC/ESD/ESD007R",    //"/ECMain/ESD/ESD007R.aspx",
                            name: ecount.resource.LBL00315,
                            param: param,
                            popupType: false,     //layer
                            fpopupID: self.ecPageID

                        });
                    }
                },
                complete: function () {
                    self.isGetSellDetailLoading = false;
                },
            });
        }
    },

    getContractDetail: function (trxDate, trxNo, dataTemp) {
        var param = {
            TRX_DATE: trxDate,
            TRX_NO: trxNo
        };
        var slipListInfos = [];
        ecount.common.api({
            url: "/Account/ContractMgmt/GetListACMNContractBillDetailListByTrx",
            data: param,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert("error");
                } else {
                    var arr_IO_DATE = "";
                    var arr_IO_NO = "";
                    var arr_SER_NO = "";
                    var arr_CUST = "";
                    if (result.Data != null && result.Data.length > 0) {
                        $.each(result.Data, function (i, data) {
                            arr_IO_DATE += data.BILL_DATE + ecount.delimiter;
                            arr_IO_NO += data.BILL_NO + ecount.delimiter;
                            arr_SER_NO += data.BILL_SER + ecount.delimiter;
                            arr_CUST += data.CUST + ecount.delimiter;
                        });

                        slipListInfos.push({
                            IO_DATE: arr_IO_DATE.substring(arr_IO_DATE.length - 1, 0),
                            IO_NO: arr_IO_NO.substring(arr_IO_NO.length - 1, 0),
                            SER_NO: arr_SER_NO.substring(arr_SER_NO.length - 1, 0),
                            CUST: arr_CUST.substring(arr_CUST.length - 1, 0)
                        });
                    }
                    else {
                        slipListInfos.push({
                            IO_DATE: "",
                            IO_NO: "",
                            SER_NO: "",
                            CUST: ""
                        });
                    }
                    var param = {
                        width: 1000,
                        height: 850,
                        Slips: slipListInfos,                           //layer용

                        FORM_TYPE: 'AF810',
                        BASIC_TYPE: "0",    //FOREIGN_FLAG : 내외자 (선택전표중 첫번째 전표의 내외자구분 사용)
                        cs_flag: 'N',
                        fax_Flag: 'Y',
                        TradingStatementPrintingYn: "Y",
                        IsBill: false
                    }
                    this.openWindow({
                        url: "/ECERP/EBP/EBP009P_02",
                        name: ecount.resource.LBL12268,
                        param: param,
                        popupType: false,
                        fpopupID: this.ecPageID
                    });
                }
            }.bind(this)
        });
    },

    salePrint: function (printData) {

        var self = this;
        var SlipListInfos = [];
        var NO_FORM = "";
        var S_SYSTEM = printData[0].S_SYSTEM;

        $.each(printData, function (i, date) {
            SlipListInfos.push({
                IO_DATE: date.IO_DATE,
                IO_NO: date.IO_NO,
                SER_NO: "0",
                IO_TYPE: "",
                GB_TYPE: date.GB_TYPE,
                CUST: "",
                NO_FORM: date.NO_FORM,
                HID: date.HID,
                ECTAX_TYPE: date.ECTAX_TYPE,
                INVOICE_KIND: date.ECTAX_FLAG
            })

            if (date.S_SYSTEM == "S") {
                S_SYSTEM = "S";
            }
        });

        var param = {
            width: 1000,
            height: 850,
            Slips: SlipListInfos,
            SlipsInfos: Object.toJSON(SlipListInfos),
            FORM_TYPE: 'AF080',
            FORM_SEQ: printData[0].NO_FORM,
            BASIC_TYPE: "0",
            cs_flag: 'N',
            fax_Flag: 'Y',
            S_SYSTEM: S_SYSTEM,
        };

        this.openWindow({
            url: "/ECERP/EBZ/EBZ032P_07",
            name: 'Sale Print',
            param: param,
            popupType: false,
            //fpopupID: this.ecPageID
        });
    },

    setGridDOC_NO: function (value, rowItem) {
        var option = {};
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

    setGridECTAX_GB: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.label";
        var strDes = '';
        if (rowItem._MERGE_SET != undefined) {
            option.data = '';
        }
        else {
            strDes = ecount.resource.LBL07943;
            if (rowItem.ECTAX_GB == "AF") strDes = ecount.resource.LBL07376;
            option.data = strDes;
        }
        return option;
    },

    setGridECTAX_TYPE: function (value, rowItem) {
        
        var option = {};
        option.controlType = "widget.label";
        if (rowItem._MERGE_SET != undefined) {
            option.data = '';
        }
        else {
            var strDes = '';

            if (this.Nation == "TW") {
                switch (rowItem.ECTAX_TYPE) {
                    case '1':
                        strDes = ecount.resource.LBL03448;
                        break;
                    default:
                        strDes = ecount.resource.LBL17011;
                }
            } else {
                switch (rowItem.ECTAX_TYPE) {
                case '0':
                    strDes = ecount.resource.LBL05850;
                    break;
                case '1' :
                    strDes = ecount.resource.LBL05851;
                    break;
                case '3':
                    strDes = ecount.resource.LBL05854;
                    break;
                case '5' :
                    strDes = ecount.resource.LBL05851 +ecount.resource.LBL05852;
                    break;
                case '6':
                    strDes = ecount.resource.LBL05852;
                    break;
                case 'X':
                    strDes = ecount.resource.LBL05853;
                    break;
                }
            }
            option.data = strDes;
        }
        return option;
    },

    setGridECTAX_FLAG: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.label";
        if (rowItem._MERGE_SET != undefined) {
            option.data = '';
        }
        else {
            var strIoType = rowItem.IO_TYPE;
            var strDes = '';
            if (this.Nation == "TW") {
                if (["71", "72", "73"].contains(strIoType)) {
                    switch (rowItem.ECTAX_FLAG) {
                        case '':
                        case '1':
                            strDes = ecount.resource.LBL01777;
                            break;
                        case '2':
                            strDes = ecount.resource.LBL14154;
                            break;
                        case '4':
                            strDes = ecount.resource.LBL14156;
                            break;
                        case '6':
                            strDes = ecount.resource.LBL14158;
                            break;
                        case '7':
                            strDes = ecount.resource.LBL02853;
                            break;
                    }
                }
            } else {
                if (["11", "12", "13", "18", "23", "2B", "2D", "15", "19", "21", "22", "24", "25", "28", "29", "2A", "2C", "1F", "2F", "2J"].contains(strIoType)) {
                    switch (rowItem.ECTAX_FLAG) {
                        case '00':
                            strDes = ecount.resource.LBL04910;
                            break;
                        case '99':
                            strDes = ecount.resource.LBL04911;
                            break;
                        case '01':
                            strDes = ecount.resource.LBL04912;
                            break;
                        case '02':
                            strDes = ecount.resource.LBL04913;
                            break;
                        case '03':
                            strDes = ecount.resource.LBL04810;
                            break;
                        case '04':
                            strDes = ecount.resource.LBL04914;
                            break;
                        case '05':
                            strDes = ecount.resource.LBL04915;
                            break;
                        case '06':
                            strDes = ecount.resource.LBL07125;
                            break;
                    }
                }
            }

            option.data = strDes;
        }
        return option;
    },

    setGridCustDes: function (value, rowItem) {
        var option = {};
        if (this.finalSearchParam.G_CUST_FLAG == '1')
            option.data = rowItem.CUST_DES;
        return option;

    },

    setGridCust: function (value, rowItem) {
        var option = {};
        if (this.finalSearchParam.G_CUST_FLAG == '1')
            option.data = rowItem.CUST;
        return option;
    },

    displayDateColumn: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.label";
        option.data = (value != null && value != '') ? ecount.infra.getECDateFormat('DATE11', false, value.toDatetime()) : '';
        return option;
    },

    setBindCustomRowCell: function (settings, COL_CD, setup) {
        settings.setCustomRowCell(COL_CD, function (value, rowItem, convertor, dataTypeOption) {
            var option = {};
            if ((value + "").indexOf(ecount.delimiter) > 0) {
                var arr = value.split(ecount.delimiter)
                if (arr.length > 1) {
                    var item1 = ecount.grid.helper.getDecimalValueByConvertor((arr[0].trim() || "0"), dataTypeOption);
                    var item2 = ecount.grid.helper.getDecimalValueByConvertor(arr[1].trim(), dataTypeOption);
                    if (item2 == "")
                        option.data = item1;
                    else
                        option.data = item1 + "<br/>(" + item2 + ")";
                }
            }

            return option;
        });
    },

    //@override onGridAfterRowDataLoad
    onGridAfterRowDataLoad: function (e, data, grid) {

        this._super.onGridAfterRowDataLoad.apply(this, arguments);

        var maxrowcount = data.result.Data.length;
        if (maxrowcount > 1000) {
            var finalsettings = this.contents.getGrid();
            var settings = finalsettings.grid.settings();
            settings.setColumnSortable(false);
            this.finalSearchParam.PAGE_SIZE = 1001;
            settings.setColumnSortEnableList([]);
        }
    },
    //onHeaderSearch: function (forceHide) {
    //    this._super.onHeaderSearch.apply(this, arguments);

    //    this.finalSearchParam.PAGE_SIZE = 1001;
    //    this.contents.getGrid().getSettings().setColumnSortable(true);
    //   //if (this.contents.getGrid().grid.getRowCount() === 1001) {
    //    //    this.contents.getGrid().getSettings().setColumnSortable(false);
    //    //} else {
    //    //    this.contents.getGrid().getSettings().setColumnSortable(true);
    //    //}
    //},

    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);
        if (this.isOpenPopup && this.isOpenPopup == true) {
            this.onHeaderSearch();
        }
    },

    onRefreshFooter: function () {
        //팝업으로 오픈한게 아니라면 부모 로직 실행
        if (!(this.isOpenPopup && this.isOpenPopup == true)) {
            this._super.onRefreshFooter.apply(this, arguments);
            return;
        }

        var toolbar = this.footer.get(0);
        var ctrl = widget.generator.control();
        var res = ecount.resource;
        toolbar.remove();
        var newBtnGroup = [];

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(res.BTN00069).end());
        
        newBtnGroup.push({ id: 'invoice1', label: res.LBL09042 });
        newBtnGroup.push({ id: 'invoice2', label: res.LBL09043 });
        newBtnGroup.push({ id: 'invoice3', label: res.LBL10477 });

        toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-default").label(res.BTN00043)
            .hasDropdown([
                { id: 'invoice1', label: res.LBL09042 },
                { id: 'invoice2', label: res.LBL09043 },
                { id: 'invoice3', label: res.LBL10477 }])
            .addGroup(newBtnGroup).end());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(res.BTN00008).css("btn btn-default").end());

    },

    onHeaderQuickSearch: function (event) {
        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setColumnSortable(true);
        this.finalSearchParam.PAGE_SIZE = 1001;
        grid.draw(this.finalSearchParam);
    },

    onFooterMoreData: function (e) {
        this._super.onFooterMoreData.apply(this, arguments);
        var grid = this.contents.getGrid();
        grid.getSettings().setColumnSortable(false);
    },

    onFooterApply: function (e, data) {
        debugger;
        selectedObj = this.contents.getGrid().grid.getChecked();
        if (selectedObj.length < 1) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        var programId = this.getProgramId(selectedObj[0].TRX_TYPE, selectedObj[0].SER_NO);

        this.sendMessage(this, {
            trxDate: selectedObj[0].TRX_DATE,
            trxNo: selectedObj[0].TRX_NO,
            taxDate: selectedObj[0].IO_DATE,
            taxNo: selectedObj[0].IO_NO,
            gbType: selectedObj[0].GB_TYPE,
            versionNo: selectedObj[0].VERSION_NO,
            cust: selectedObj[0].CUST,
            programId: programId
        });

        this.close();
    },

    onDropdownInvoice1: function () {
        this.openWindow({
            url: '/ECERP/SVC/EBD/EBD010M_09',
            param: {
                name: '매출전표Ⅰ',
                width: 800,
                height: 600,
                ECTAX: 'Y',
                popupType: false,
                isOpenPopup: true,
                EditFlag: 'I',
                Request: {
                    Key: {
                        Date: null,
                        No: null
                    },
                    EditMode: ecenum.editMode.new,
                    FromProgramId: '',
                    PrevUrl: '/ECERP/EBG/EBG008R',
                    UIOption: {
                        Width: 800,
                        Height: 600,
                        IsShowSaveNewButton: false,
                        IsShowSaveReviewButton: false,
                        IsShowSavePrintButton: false,
                        IsShowSlipPrintButton: false,
                        IsShowSlipBillButton: false,
                        IsShowETaxInvoiceTwoButton: false,
                        IsShowWebUploaderButton: false
                    },
                    CustomSaveButtonGroupList: [
                            { id: "save", label: "BTN00063" }
                    ],
                    TrxType: '40',
                    SerNo: '01',
                },
                DefaultViewData: {
                    Acc100: {
                        CUST: this.CUST,
                        CUST_DES: this.CUST_DES
                    }
                },
                width: 800,
                height: 600
            }
        });
    },

    onDropdownInvoice2: function () {
        this.openWindow({
            url: '/ECERP/EBD/EBD001M',
            param: {
                name: '매출전표Ⅱ',
                width: 800,
                height: 600,
                Cust: this.CUST,
                CustDes: this.CUST_DES,
                ECTAX: 'Y',
                trx_ser: '07',
                SER_NO: '07',
                popupType: true,
                isOpenPopup: true,
                EditFlag: 'I'
            }
        });
    },

    onDropdownInvoice3: function () {
        this.openWindow({
            url: '/ECERP/EBD/EBD014M',
            param: {
                name: '매출전표Ⅲ',
                width: 800,
                height: 600,
                Cust: this.CUST,
                CustDes: this.CUST_DES,
                ECTAX: 'Y',
                IoGubun: '1',
                SER_NO: '07',
                popupType: true,
                isOpenPopup: true,
                EditFlag: 'I'
            }
        });
    },

    getFormType: function () {
        switch (this.Nation) {
            case "TW":
                return 'AO218'
            case "KR":
            default:
                return 'AO223'
        }
    },

    getFormTypeSearch: function () {
        switch (this.Nation) {
            case "TW":
                return "AM218";
            case "KR":
            default:
                return "AM060";
        }
    },

    //체크박스
    setCheckBox: function (rowItem) {
        this.contents.getGrid().grid.clearChecked();
        return true;
    },

    setGridDateCheck: function (value, rowItem) {
        var option = {};
        var self = this;

        // 회계전표가 연결된 상태이면 disable
        if(rowItem.S_SYSTEM != "0") {
            option.attrs = {
                'disabled': true
            };
        }

        return option;
    },

    onMessageHandler: function (event, data) {
        var programId = "";
        debugger;
        if (this.isOpenPopup && this.isOpenPopup == true && data.editFlag == "I") {
            switch (event.pageID) {
                case "EBD001M":
                case "EBD014M":
                case "EBD010M_09":
                    if (event.pageID == "EBD010M_09") programId = "E010301"
                    else if (event.pageID == "EBD001M") programId = "E010201"
                    else if (event.pageID == "EBD014M") programId = "E010311"

                    this.sendMessage(this, {
                        trxDate: data.trxDate,
                        trxNo: data.trxNo,
                        taxDate: data.taxDate,
                        taxNo: data.taxNo,
                        cust: data.cust,
                        gbType: data.gbType,
                        versionNo: data.versionNo,
                        programId: programId
                    });

                    this.close();

                    data.callback && data.callback();

                    break;
            }
        } else {
            this._super.onMessageHandler.apply(this, arguments);
        }
    },

    getProgramId: function (trxType, serNo) {
        var result = "";

        if (trxType == "40" && serNo == "01")
            result = "E010301";
        else if (trxType == "98" && serNo == "07")
            result = "E010201";
        else if (trxType == "40" && serNo == "20")
            result = "E010311";

        return result;
    },

    //F8 저장
    ON_KEY_F8: function (e, data) {
        if (this.isOpenPopup) {
            this.onFooterApply(e, data);
            return;
        }

        this._super.ON_KEY_F8.apply(this, arguments);
    },

    //F2 신규
    ON_KEY_F2: function () {
        if (this.isOpenPopup) {
            this.onFooterNew();
        }
    },
});
