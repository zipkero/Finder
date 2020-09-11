window.__define_resource && __define_resource("LBL02475","LBL01193","LBL00723","LBL93674","LBL93677","LBL93669","LBL03448","LBL17011","LBL05850","LBL05851","LBL05854","LBL05855","LBL05852","LBL05853","LBL01777","LBL14154","LBL14156","LBL14158","LBL02853","LBL04910","LBL04911","LBL04912","LBL04913","LBL04810","LBL04914","LBL04915","LBL07125","BTN00316","LBL03971","LBL01625","LBL03146","LBL07943","LBL07376");
/****************************************************************************************************
1. Create Date : 2016.05.24
2. Creator     : Van Phu Hoi
3. Description : PURCHASE INVOICE STATUS (INV.)
4. Precaution  : 
5. History     : 
                2016.12.22  Luong Ngoc Hoang    : refactoring
                2017.03.15  Pham Nhat Quang     : refactoring
                2017.06.12 (VuThien): refactoring.
                2017.12.26 (Nguyen Duy Thanh) - Job A17_03213 - check permission when click "Unlink from Inv. Slip" in View Transaction
                2018.10.15 (Chung Thanh Phuoc) Disable Sort when data search > 1000
                2019.05.02 (LuongAnhDuy): A19_01008 - 상대분개 500건, 1년조회 제한로직 제거
****************************************************************************************************/
ecount.page.factory("ecount.page.list.status.account", "EBG009R", {

    //Define maxCount
    maxCount: 10000,

    initPageDefaultData: function () {
        this.pageInfo = {
            name: "EBG009R",
            path: "/ECERP/EBG/EBG009R?rbRptSort=" + this.rbRptSort,
            formTypeCode: this.getFormType(), //그리드 양식타입(grid form type)
            formTypeSearch: this.getFormTypeSearch(), //검색조건 양식타입(search form type)
            title: this.getTitle(), //페이지 타이틀
            useDefaultFormType: false, //FORM_SER == 0 사용 여부
            excelApi: [{ path: "/Inventory/Purchases/GetListPurchasesInvoiceForExcel" }],
            menuAuth: "ACCT_CHK", //메뉴 권한(ACCT_CHK:회계, SALE_CHK1:재고-구매, SALE_CHK2:재고-판매, SALE_CHK3:재고-기타, SALE_CHK4:재고-A/S)
            Permission: this.viewBag.Permission.purchase,
            useSignBox: false,
            IO_TYPE: "2",
            button: {
                graph: false
            },
            commonSlip: function (rowItem, param) {
                return {
                    param: {
                        IsPopup: true,
                    },
                    hidSearchData: {
                        SLIP_TYPE: rowItem['GB_TYPE'] == "N" ? "2" : "",

                    },
                    isPopupOpen: true,
                }
            }.bind(this),
            columnMap: { IO_DATE: "TRX_DATE", IO_NO: "TRX_NO", IO_TYPE: "TRX_TYPE", SER_NO: "SER_NO", PRG_URL: "PRG_URL" }
        };

        this.gridInfo = function (param) {
            var api = "/Inventory/Purchases/GetListPurchasesInvoice";
            var field = [
                { id: "ACC301.IO_DATE_NO", type: "acc-common-slip" },
                { id: "ACC301.IO_DATE", type: "acc-common-slip" },
                { id: "ACC301.S_DETAIL", type: "custom", fn: this.setGridS_DETAIL.bind(this) },
                { id: "ACC301.ECTAX_FLAG", type: "custom", fn: this.setGridECTAX_FLAG.bind(this) },
                { id: "ACC301.ECTAX_GB", type: "custom", fn: this.setGridECTAX_GB.bind(this) },
                { id: "ACC301.ECTAX_TYPE", type: "custom", fn: this.setGridECTAX_TYPE.bind(this) },
                { id: "ACSL_DOC_NO.DOC_NO", type: "custom", fn: this.setGrid_NO.bind(this) },
                { id: "ACSL_DOC_NO.CODE_NO", type: "custom", fn: this.setGrid_NO.bind(this) },
                { id: "CREATOR_DATE", type: "custom", fn: this.displayDateColumn.bind(this) },
                { id: "LAST_EDITOR_DATE", type: "custom", fn: this.displayDateColumn.bind(this) },
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

    onInitControl: function (cid, control) {
        switch (cid) {
            case "twTxtIoTypeCd":
                control.setOptions({
                    checkValue: ['', '0', '1', '2', '3'],
                    groupId: "tax"
                });
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
    },

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

    setInitGridSettings: function (settings, param) {
        param.MENU_GUBUN = this.rbRptSort;
        param.SUM_FLAG = 0;
        if (!param.IO_TYPE)
            param.IO_TYPE = this.pageInfo.IO_TYPE;

        if (param.GB_TYPE == "A" && this.header.getSafeControl("chkGbType")) {
            param.GB_TYPE = "";
        }
    },

    setGridSort: function (e, data) {
        var _self = this;

        this._super.setGridSort.apply(this, [e, data, function (searchParam) {
            if (searchParam.IO_TYPE == "") {
                searchParam.IO_TYPE = _self.pageInfo.IO_TYPE;
            }
        }]);
    },

    getTitle: function () {
        var sTitle = "";
        switch (this.rbRptSort) {
            case "S":
                sTitle = ecount.resource.LBL93674;
                break;
            case "T":
                sTitle = ecount.resource.LBL93677;
                break;
            default:
                sTitle = ecount.resource.LBL93669;
                break;
        }
        return sTitle;
    },

    setGridECTAX_TYPE: function (value, rowItem) {//ok
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
                    case '1':
                        strDes = ecount.resource.LBL05851;
                        break;
                    case '3':
                        strDes = ecount.resource.LBL05854;
                        break;
                    case '5':
                        strDes = ecount.resource.LBL05855;
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
                if (["11", "12", "13", "15", "18", "19", "21", "22", "23", "24", "25", "28", "29", "2A", "2B", "2C", "2D", "1F", "2F", "2J"].contains(strIoType)) {
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

    setGridS_DETAIL: function (value, rowItem) {
        var option = {};

        if (rowItem._MERGE_SET != undefined) {
            option.controlType = "widget.label";
            option.data = '';
        }
        else {
            var salePermit = this.viewBag.Permission.purchase;
            option.controlType = "widget.link.multi";

            option.parentAttrs = {
                'class': 'text-center'
            }

            option.attrs = {
                'class': { 'class_0': [], 'class_1': [] },
                'type': 'horizontal'
            }

            if (["S", "B", "P"].contains(rowItem.S_SYSTEM)) {

                option.data = [ecount.resource.BTN00316];

                option.event = {
                    'click': function (e, data) {
                        //View Transaction
                        //Sale = Define("S");SG031
                        //Purchases = Define("B");SG211
                        //Manufacture = Define("P");SG421
                        //Service = Define("V");AG201
                        //Contract = Define("C");AG556
                        var isSVC = "";

                        var dataTemp = {
                            ComCode: this.viewBag.ComCode_L,
                            TrxDate: data.rowItem['TRX_DATE'],
                            TrxNo: data.rowItem['TRX_NO'],
                            ConfirmFlag: this.finalSearchParam.BEFORE_FLAG || "0",
                            PermitCode: this.RPTGUBUN,
                            S_system: data.rowItem['S_SYSTEM'],
                            rbRptSort: this.rbRptSort,
                            TextSaleBuy: 'BUY',
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

    setGrid_NO: function (value, rowItem) {
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
            if (rowItem.ECTAX_GB == "AF") {
                strDes = ecount.resource.LBL07376;
            }
            option.data = strDes;
        }
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

    onHeaderQuickSearch: function (e) {
        this._super.onHeaderQuickSearch.apply(this, arguments);
        var grid = this.contents.getGrid();
        grid.getSettings().setColumnSortable(true);
        grid.draw(this.searchFormParameter);
    },

    onHeaderSearch: function (forceHide) {
        this._super.onHeaderSearch.apply(this, arguments);
        this.contents.getGrid().getSettings().setColumnSortable(true);
    },

    // @override
    onGridAfterRowDataLoad: function (e, data, grid) {
        this._super.onGridAfterRowDataLoad.apply(this, arguments);
        this.setDisableSorted(grid, data);
    },

    //Check null array
    checkNullArray: function (data) {
        if (data.length === 0) return false;
        return true;
    },

    //add function disable sort when data search > 1000
    setDisableSorted: function (grid, data) {
        var self = this;
        var disableSort = 1001;
        if (self.checkNullArray(data)) {
            var rowCount = data.result.Data;
            var settings = grid.getSettings();

            //Set default
            if (rowCount.length !== 0 && rowCount.first().MAXCNT !== undefined) {
                if (rowCount.length >= disableSort) {
                    settings.setColumnSortable(false);
                }
            }
            if (rowCount.length !== 0) {
                if (rowCount.length >= disableSort) {
                    settings.setColumnSortable(false);
                }
            }
            grid.setSettings(settings);
        }
    },

    getFormType: function () {
        switch (this.Nation) {
            case "TW":
                return 'AO219';
            case "KR":
            default:
                return 'AO224';
        }
    },

    getFormTypeSearch: function () {
        switch (this.Nation) {
            case "TW":
                return "AM219";
            case "KR":
            default:
                return "AM070";
        }
    }
});
