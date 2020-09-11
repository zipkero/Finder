window.__define_resource && __define_resource("LBL06944","LBL93096","LBL93665","MSG00213","MSG00709");
/****************************************************************************************************
1. Create Date : 2016.01.01
2. Creator     : Ho Nguyen Cong Thanh
3. Description : Inv. I > Purchases > Purchase Invoice List | Tax > Tax > Purchase Invoice List (Tax) | Acct. I > Voucher > Purchase Invoice List
4. Precaution  :  
5. History     :  EBG/EBG007M.aspx
                 // 2017.01.20(Thien.Nguyen) - Add parameter load default(onInitControl) for All in one 1 menu(thêm parameter load mặt định cho menu tất cả trong một 1)
                 2017.06.26 (ChauMinh) - Apply List Common
                 2017.11.23 (왕승양) - 거래관리시스템 작업 (modification for CS system)
                 2018.10.29 (phuoc) - Rollback
                 2019.07.01 (NgocHan) [A19_02219] : set key for grid at gridInfo
                 2019.08.26 (Ngoc Han ) [A19_02281] fix test progress 73690 set vaule for param INVOICE_TYPE is '' when choose All
                 2019.08.28 (김형래) - 수신웹메일 기능 제거
                 2019.12.24 (Lap): A19_04086_SetIntervalTask
****************************************************************************************************/
ecount.page.factory("ecount.page.list.search.account", "EBG007M", {
    /*EBG007M.js*/
    initPageDefaultData: function () {

        var titleResource = ecount.resource.LBL06944; // 재고

        if (this.rbRptSort.toUpperCase() == "B") // 회계
            titleResource = ecount.resource.LBL93096;
        else if (this.rbRptSort.toUpperCase() == "T") // 세무
            titleResource = ecount.resource.LBL93665;

        //현재 페이지의 정보
        this.pageInfo = {
            type: "account",                                // 전표타입
            inventoryType: "purchase",
            path: this.isFromCS === true ? ("/ECERP/CSA/EBG007M?rbRptSort=" + this.rbRptSort) : ("/ECERP/EBG/EBG007M?rbRptSort=" + this.rbRptSort),                   // 페이지 URL       
            formTypeCode: this.isFromCS === true ? "OR231" : this.getFormType(),                          // 리스트 양식타입(grid form type)         AR080             
            formTypeSearch: this.isFromCS === true ? "ON320" : this.getFormTypeSearch(),                        // 검색조건 양식타입(search form type)            
            title: this.isFromCS === true ? ecount.resource.LBL93096 : ecount.resource.LBL06944,                // 페이지 타이틀            
            isNewSearchFormType: true,                      // 검색 양식 신규로    
            useFormList: this.isFromCS === true ? false : true,
            Permission: this.viewBag.Permission.sale,
            // data 컬럼 관련   - 종결:P_FLAG
            columnMap: {
                IO_TYPE: "IO_TYPE", GB_TYPE: "GB_TYPE", VERSION: "VERSION_NO", TRX_DATE: "TRX_DATE", TRX_NO: "TRX_NO"
            },
            csFlag: this.isFromCS === true ? "Y" : "N",
            //  엑셀관련
            excelApi: [{ path: "/Inventory/Purchases/GetPurchaseListForExcel" }],
            footerButton:
                [
                    { id: "new", isUse: false },
                    { id: "email", isUse: false },
                    { id: "confirm", isUse: (ecount.config.company.USE_SLIP_CONFIRM == 'Y' || ecount.config.company.USE_SLIP_CONFIRM == 'X') ? true : false },
                    { id: "print", isUse: !this.isFromCS }
                ],
            // 위젯관련
            menuAuth: "SALE_CHK1",

            //docFlag: "44", Purchase Invoice not set up yet

            MenuSeq: 519,

            // 전표정보 
            slip: function (rowItem, param) {
                return {
                    type: "account",  // 한 그리드에 여러개의 전표 타입이 올수 있으므로                    
                    useEcParam: true,
                    param: {
                        rbRptSort: this.rbRptSort
                    }
                }
            }.bind(this),

            // DAC과 연동되면 dac프로퍼티 규칙 적용, 기타는 자바스크립트 규칙적용
            defaultSearchParam: {
                SUB_GUBUN: 'N',
                TAX_GUBUN: "0",
                G_CUST_FLAG: '0',
                P_FLAG: this.actTab == "tabAll" ? "All" : "0",
                IO_TYPE: '2',
                MENU_GUBUN: this.rbRptSort
            }
        };

        //그리드 정보 설정        
        this.gridInfo = function (param) {
           
            var isJournal = param.JOURNAL && param.JOURNAL[0] == "1" ? true : false;           

            switch (this.contents.currentTabId) {
                case 'tabAll':
                    param.BEFORE_FLAG = "9";
                    break;
                case "tabUnconfirmed":
                    param.BEFORE_FLAG = "1";
                    break;
                case "tabConfirm":
                    param.BEFORE_FLAG = "0";
                    break;
            }

            if (this.header.getControl("INVOICE_TYPE", "all") && this.header.getControl("INVOICE_TYPE", "all").getValue(0) == true)//[All] checked
                param.INVOICE_TYPE = '';

            var field = [];

            field.push(
                { id: "ACC301.ECTAX_FLAG", type: "ecTaxFlagLabel" },    // 
                { id: "ACC301.ECTAX_TYPE", type: "ecTaxTypeLabel" },
                { id: "ACC301.ECTAX_GB", type: "ecTaxGbLabel" },
                { id: "ACSL_DOC_NO.DOC_NO", type: "acslDocNo" },
                { id: "ACSL_DOC_NO.CODE_NO", type: "acslCodeNo" },
                { id: "ACC301.S_PRINT", type: "slipPrint" },                // 전표인쇄(Print)  - 
                { id: "ACC301.S_DETAIL", type: "viewDetail" }               // 상세보기
            );

            if (this.isFromCS !== true) {
                field.push(
                    { id: ecount.grid.constValue.checkBoxPropertyName, type: "checkStatus" },
                    { id: "ACC301.IO_DATE", type: "slip" },                 // 전표 연결하기    
                    { id: "ACC301.IO_DATE_NO", type: "slip" }              // 전표 연결하기  
                );
            }
            return {
                hasFormType: true,                                      // 양식 사용할지 여부(true : 사용, false : 직접페이지에서 설정하는 설정)
                api: [{ path: "/Inventory/Purchases/GetListPurchaseListByInvoice" }],
                keyColumn: isJournal ? ['TRX_DATE', 'TRX_NO', 'SLIP_SER', 'SLIP_NO'] : ['IO_DATE', 'IO_NO'],                        // key column                
                shaded: ["ACC301.IO_DATE", "ACC301.IO_DATE_NO"],            // shaded cell target(formset/noFormset)

                //grid init field
                field: field

            }
        };
    },

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
        if (this.isFromCS == null || this.isFromCS === false) {
            this.viewBag.FormInfos[this.pageInfo.formTypeSearch] = this.viewBag.FormInfos.formTypeSearch;
            this.viewBag.FormInfos[this.pageInfo.formTypeCode] = this.viewBag.FormInfos.formType;
        }
        this._super.initProperties.apply(this, arguments);
    },   

    // 페이지마다 처리 해야할 param이 다른경우 
    setInitGridSettings: function (settings, param) {

        if (this.isFromCS === true) {
            param.CUST = this.CUST;
            param.FORM_TYPE = this.pageInfo.formTypeCode;
            param.FORM_SEQ = 1;
            param.ALL_GROUP_WH = "0";
            param.ALL_YN = 'N';
            settings.setCheckBoxUse(false);
        }

        settings.setColumns([
            { id: 'ACC301.fax_send_yn', isHideColumn: !this.isUseTabFax }
        ]);

        settings.setFooterBottomRightHTML(this.TimeStamp)

    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
        var res = ecount.resource;
        var ctrl = widget.generator.control();

        switch (cid) {
            case "twTxtIoTypeCd":
                control.setOptions({
                    checkValue: [5, 1, 2, 3, 4],
                    groupId: "tax"
                });
                break;
        }       
    },

    onPopupHandler: function (control, param, handler) {
        var addParam;
        switch (control.id) {
            case "txtFirstWriteID": case "txtLastUpdatedID":
                addParam = { GwUse: true, Type: true, UserFlag: "id", isIncludeInactive: true, MENU_TYPE: "S", hidGwUse: "1" };
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

    // Type : 'Delete' - Select Delete Api Data generated(dữ liệu API cho xóa được tạo ra)
    setDeleteListApiJsonData: function (apiData) {
        var DeleteDtoList = [];
        $.each(apiData, function (i, val) {
            var ioSlipData = val.TRX_DATE + "-" + val.TRX_NO;

            DeleteDtoList.push({
                TemplateDate: ioSlipData,

                TrxDate: val.TRX_DATE,
                TrxNo: val.TRX_NO,
                TrxType: val.TRX_TYPE,

                IoDate: val.IO_DATE,
                IoNo: val.IO_NO,
                IoType: val.IO_TYPE,

                SerNo: val.SER_NO,
                AccSSystem: val.S_SYSTEM,
                VersionNo: val.VERSION_NO,
                EcTaxType: val.ECTAX_TYPE,
                GbType: val.GB_TYPE,
                SellNo: 0
            });
        });

        return DeleteDtoList;
    },
    //Select Delete API calls(gọi API để xóa)
    callDeleteListApi: function (selectItem) {
        var self = this;
        var formData = Object.toJSON({
            DeleteListInfo: self.setDeleteListApiJsonData(selectItem),
            rbRptSort: self.rbRptSort
        });
        ecount.common.api({
            url: "/Inventory/Purchases/DeletePurchasesList",
            data: formData,
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

    procDeleteSelectedByPage: function (e) {
        var self = this;
        var selectItem = this.contents.getGrid().grid.getChecked();
        var selCnt = selectItem.length;

        if (selCnt == 0) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        this.errDataAllKey = null;
        this.errDataAllKey = [];

        ecount.confirm(ecount.resource.MSG00709, function (status) {
            if (status == false) {
                return;
            }
            self.showProgressbar(true);

            self.callDeleteListApi(selectItem);

            self.showProgressbar(false);
        });
    }
    ,
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);

        var gridObj = this.contents.getGrid(),
            settings = gridObj.grid.settings();

        settings.setFooterBottomRightHTML(this.TimeStamp);
    },

    getConfirmParam: function (selectItem, gbType) {
        var param = this._super.getConfirmParam.apply(this, arguments);

        if (selectItem.TRX_TYPE == "45" && selectItem.SER_NO == "10") {
            $.extend(param, {
                UseFixedAssets: true,
                ASSETS_STATUS: '1'          // 증가(Increase) 
            });
        }

        return param;
    },
    getFormType: function () {
        switch (this.Nation) {
            case "TW":
                return "AR233";
            case "KR":
            default:
                return "AR231";
        }
    },

    getFormTypeSearch: function () {
        switch (this.Nation) {
            case "TW":
                return "AN350";
            case "KR":
            default:
                return "AN330";
        }
    }
});