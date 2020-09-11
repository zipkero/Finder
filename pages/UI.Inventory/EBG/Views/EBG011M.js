window.__define_resource && __define_resource("LBL90068","LBL00910","LBL03971","LBL02937","LBL35781","LBL30079","LBL00540","LBL03071","LBL09707","MSG05286","MSG04747","MSG05285");
/****************************************************************************************************
1. Create Date : 2016-10-25
2. Creator     : Pham Nhat Quang
3. Description : Acct.I => Voucher => Accounting vs. Inventory
4. Precaution  :  
5. History     : [2017.05.25][Duyet] Apply common status
                  2017.10.31 Huu Lan applied txtAcctPjtGroup1, txtAcctPjtGroup2, txtInvPjtGroup1, txtInvPjtGroup2
                  2017.12.26 (Nguyen Duy Thanh) - Job A17_03213 - check permission when click "Unlink from Inv. Slip" in View Transaction
****************************************************************************************************/
ecount.page.factory("ecount.page.list.status.account", "EBG011M", {

    CR_DR: "",

    // Init page (Khởi tạo trang)
    initPageDefaultData: function () {
        this.pageInfo = { // Page info (Thông tin cài đặt trang)
            name: "EBG011M",
            path: "/ECERP/EBG/EBG011M",
            formTypeCode: "",                      //그리드 양식타입(grid form type)
            formTypeSearch: "AM910",                    //검색조건 양식타입(search form type)
            formTypeSearchMaster: "AF910",              //검색조건 양식타입 마스터(master form type)
            formTypeInput: "",                     //입력 양식 타입(input form type)
            title: ecount.resource.LBL90068,            //페이지 타이틀
            useSumGubun: true,                          //SUM_FLAG 사용 여부
            useDefaultFormType: false,                  //FORM_SER == 0 사용 여부
            useFormList: false,
            columnMap: { IO_DATE: "TRX_DATE", IO_NO: "TRX_NO", IO_TYPE: "TRX_TYPE", SER_NO: "SER_NO" },
            boxWidth: 1290,
            excelApi: [{ path: "/Account/Voucher/GetExcelAccountingVsInventory" }],
            menuAuth: "ACCT_CHK",
            button: { graph: false },
            requiredData: { chkAcctCust: true, chkAcctAccount: true, chkInvAccount: true },
            accSlip: function (rowItem, param) { // Handler for column AcctDetail
                var params, cellOption = null;
                if (["S", "B", "P", "V"].contains(rowItem.S_SYSTEM)) {
                    params = {
                        ComCode: this.viewBag.ComCode_L,
                        TrxDate: rowItem.TRX_DATE,
                        TrxNo: rowItem.TRX_NO,
                        ConfirmFlag: rowItem.GB_TYPE == 'Y' ? '9' : '1',
                        PermitCode: "45",
                        S_system: rowItem.S_SYSTEM,
                        rbRptSort: "S",
                        TextSaleBuy: 'BUY',
                        PermitCodeNew: rowItem.TRX_TYPE + rowItem.SER_NO
                    };
                    if (param.INV_TYPE == "S") {
                        params.PermitCode = "40";
                        params.TextSaleBuy = "SALE";
                    } else if (param.INV_TYPE == "B") {
                        params.TextSaleBuy = "BUY";
                        params.IsShowDisconnectButton = true;
                    }
                }

                //Sale = Define("S");SG031
                //Purchases = Define("B");SG211
                //Manufacture = Define("P");SG421
                //Service = Define("V");AG201
                //Contract = Define("C");AG556
                var isSVC = "";

                if (["S", "B", "P"].contains(rowItem.S_SYSTEM)) {
                    params = { Request: { Data: params } };
                    isSVC = "SVC/";
                }

                if (!$.isEmpty(rowItem.AcctSlipNo) && $.isNull(rowItem._MERGE_SET) && ["S", "B", "P", "V"].contains(rowItem.S_SYSTEM))
                    cellOption = { data: ecount.resource.LBL00910 };

                return {
                    useEcParam: true,
                    param: params,                    
                    name: ecount.resource.LBL03971,
                    path: "/ECERP/" + isSVC + "EBZ/EBZ032P_03",
                    addOption: cellOption,
                    popupType: false,
                    isPopupOpen: ["S", "B", "P", "V"].contains(rowItem.S_SYSTEM),
                }
            }.bind(this),
            commonSlip: function (rowItem, param) {
                return {
                    hidSearchData: {
                        USE_DEFAULT_DATE: "N",
                        GB_TYPE: rowItem['GB_TYPE'],
                        SITE: param.ACCT_DEPT,
                        PJT_CD: ecount.config.company.USE_PJT == "Y" ? param.ACCT_PROJECT : "",
                        CUST: param.ACCT_CUST
                    },
                    param: { s_system: rowItem["S_SYSTEM"], IsPopup: true },
                    isPopupOpen: true,
                }
            }.bind(this),
            link: function (rowItem, paramSearch) { // InvSlipNo
                var sSystem = paramSearch.INV_TYPE, url = "/ECERP/EBG/EBG011M";
                var data = {};
                data["M_Type"] = rowItem["ITEM_IO_TYPE"];
                data["M_Date"] = rowItem["ITEM_IO_DATE"];
                data["M_No"] = rowItem["ITEM_IO_NO"];
                data["M_SerNo"] = "";
                data["M_Pgm"] = "/ECErp/ESG/ESG011M";
                data["M_EditFlag"] = "M";
                data["M_AFlag"] = "";
                data["M_Page"] = "1";
                data["txtDocNo"] = "1";
                data["M_PFlag"] = sSystem == "B" ? "" : "1";
                data["hidPageGubun"] = "";

                var param = {
                    __ecParam__: encodeURIComponent(Object.toJSON(this.finalSearchParam)),
                    searchData: ecount.common.toXML(data),
                    IO_TYPE: rowItem["ITEM_IO_TYPE"],
                    IO_DATE: rowItem["ITEM_IO_DATE"],
                    IO_NO: rowItem["ITEM_IO_NO"],
                    URL: "/ECERP/EBG/EBG011M",
                    SER_NO: 1,
                    EditFlag: "M",
                    A_FLAG: "",
                    PAGE: "1",
                    DOC_NO: "1",
                    callPageName: "",
                    focusFlag: "Y",
                    isOpenPopup: true,
                    isViewPreButton: false,
                    isViewListButton: true,
                    isAllInOnProductCust: true,
                    width: 920,
                    height: 640
                }
                if (["S", "B"].contains(sSystem)) {
                    url = (sSystem == 'S') ? "/ECERP/SVC/ESD/ESD006M" : "/ECERP/SVC/ESG/ESG009M";
                    param = {
                        Request: {
                            Key: {
                                Date: rowItem["ITEM_IO_DATE"],
                                No: rowItem["ITEM_IO_NO"]
                            },
                            EditMode: ecenum.editMode.modify,
                            FromProgramId: "E010730",
                            PrevUrl: "/ECERP/EBG/EBG011M",
                            UIOption : {
                                Width: 920,
                                Height: 640
                            }
                        }
                    }
                } else if (sSystem == "P") {
                    if (rowItem["ITEM_IO_TYPE"] == "42") {
                        if (rowItem["ITEM_TYPE_GUBUN"] == 3)
                            url = "/ECErp/ESJ/ESJ022M";
                        else
                            url = "/ECErp/ESJ/ESJ009M";
                    } else {
                        url = "/ECErp/ESJ/ESJ008M?io_type=43&io_date=" + rowItem["ITEM_IO_DATE"] + "&io_no=" + rowItem["ITEM_IO_NO"] + "&edit_flag=M&net_flag=Y";
                    }
                }
                return {
                    name: ecount.resource.LBL02937,                    
                    path: url,
                    param: param,
                    isNew: !["/ECERP/EBG/EBG011M"].contains(url),
                    isCellLink: true,
                    popupType: false
                }
            }.bind(this),
        }

        // Grid info (Thông tin cài đặt lưới)
        this.gridInfo = function (param) {
            return {
                hasFormParam: true,
                hasFormType: false,             // Not use template  
                api: "/Account/Voucher/GetAccountVsInventory",
                sort: { sortable: false },      // Not use function sort in grid
                shaded: ["AcctSlipNo", "InvSlipNo"],         // Shaded cell target
                field: this.viewBag.InitDatas.GetColumns, // Init field
                mergeSet: [{ list: [{ label: ecount.resource.LBL35781 }, { label: ecount.resource.LBL30079 }] }] // Init mergeSet
            }
        }.bind(this)
    },

    // Popup handler (Mở cửa sổ)
    onPopupHandler: function (control, param, handler) {
        var addParam = { isApplyDisplayFlag: true, isCheckBoxDisplayFlag: true, isIncludeInactive: true };
        switch (control.id) {
            case "txtFirstWriteID":
            case "txtLastUpdatedID":
                addParam = {
                    GwUse: true,
                    Type: true,
                    UserFlag: "id",
                    isIncludeInactive: true,
                    MENU_TYPE: "S",
                    hidGwUse: "1"
                };
                break;
            case "txtAcctCust":
                addParam = $.extend(addParam, { ACC002_FLAG: "Y", callType: 101, FilterCustGubun: 101 });
                break;
            case "txtAcctAccount":
            case "txtAcctDept":
            case "txtAcctProject":
                addParam = $.extend(addParam, { searchCategoryFlag: "A", isOthersDataFlag: 'Y' });
                break;
            case "txtInvCust":
                addParam = $.extend(addParam, { isOthersDataFlag: 'Y', FilterCustGubun: 101 });
                break;
            case "txtInvProject":
                addParam = $.extend(addParam, { searchCategoryFlag: "S", isOthersDataFlag: 'Y' });
                break;
            case "txtAcctPjtGroup1":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.custGroupCodeClass = "G10";
                param.CODE_CLASS = "G10";
                break;
            case "txtAcctPjtGroup2":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.CODE_CLASS = "G11";
                param.custGroupCodeClass = "G11";
                break;
            case "txtInvPjtGroup1":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.custGroupCodeClass = "G10";
                param.CODE_CLASS = "G10";
                break;
            case "txtInvPjtGroup2":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.custGroupCodeClass = "G11";
                param.CODE_CLASS = "G11";
                break;

            default: // txtInvLocation => use addParam for default
                break;
        }
        this._super.onPopupHandler.apply(this, [control, param, handler, addParam]);
    },

    // Init control (Khởi tạo)
    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
        switch (cid) {
            case "ddlSYear":
                control.select(this.BaseDateFrom, this.BaseDateTo).setOptions({ _isMonthCalendar: false });
                break;
            case "rbAmount":
                control.value(["S", "T"]).label([ecount.resource.LBL00540, ecount.resource.LBL03071]).select('S');
                break;
            case "cbOther":
                var ctrl = widget.generator.control();
                control.addControl(ctrl.define("widget.checkbox", "STATUS_UNCONFIRMED", "STATUS_UNCONFIRMED").label([ecount.resource.LBL09707]).value(['Y']));
                break;

        }
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        switch (control.id) {

            case "txtAcctPjtGroup1":
                param.CODE_CLASS = "G10";
                break;
            case "txtAcctPjtGroup2":
                param.CODE_CLASS = "G11";
                break;
            case "txtInvPjtGroup1":
                param.CODE_CLASS = "G10";
                break;
            case "txtInvPjtGroup2":
                param.CODE_CLASS = "G11";
                break;
        }
        handler(param);
    },

    onInitControl_Submit: function (cid, control) {
        if (["cbOther", "cbSelect"].contains(cid)) { }
        else this.onInitControl(cid, control);
    },

    // Message handler (Xủ lý tin nhắn)
    onMessageHandler: function (page, callback) {
        this._super.onMessageHandler.apply(this, arguments);
        switch (page.controlID) {
            case "txtAcctAccount":
                var result = callback.data;
                if (!$.isArray(result))
                    result = [result];
                var control = this.header.getControl("txtAcctAccount");
                var cardType = "";
                var isRemove = true;
                for (var i = 0; i < result.length; i++) {
                    if ($.isEmpty(cardType))
                        cardType = result[i].CR_DR;
                    if (cardType != result[i].CR_DR) { // Dont for use two type CR and DR
                        this.CR_DR = '';
                        control.removeAll();
                        ecount.alert(ecount.resource.MSG05286, function () {
                            control.setFocus(0);
                            control.showError(ecount.resource.MSG05286);
                        });
                        break;
                    }
                    else {
                        if (cardType != this.CR_DR && isRemove) {
                            control.removeAll();
                            isRemove = false;
                        }
                    }
                    control.addCode({ label: result[i].GYE_DES, value: result[i].GYE_CODE, CR_DR: result[i].CR_DR });
                }
                this.CR_DR = cardType;
                break;
        }
    },

    // @Override 
    onLoadComplete: function (e) {
        if (this._userParam && this._userParam.C_isLoaded) {
            if (!this.validateActionCheck())
                this.header.toggle();
            else
                this._super.onLoadComplete.apply(this, arguments);
        }
        else
            this._super.onLoadComplete.apply(this, arguments);
    },

    // Validate for page (Kiểm tra điều kiện khi tìm kiếm)
    onSearchPageValidate: function () {
        var ddlYear = this.header.getSafeControl("ddlSYear");
        if (ddlYear.getSYear() < 2000 || ddlYear.getEYear() < 2000) {
            ddlYear.setFocus(0);
            ddlYear.showError(ecount.resource.MSG04747);
            return false;
        }

        var startDate = new Date(ddlYear.getSYear(), ddlYear.getSMonth() - 1, ddlYear.getSDay());
        var validDate = new Date(ddlYear.getEYear() - 1, ddlYear.getEMonth() - 1, ddlYear.getSDay());
        if (startDate < validDate) {
            ddlYear.setFocus(0);
            ddlYear.showError();
            ecount.alert(ecount.resource.MSG05285);
            return false;
        }
        return true;
    },
    ON_VALIDATE_SEARCHFORM: function () {
        if (!this._super.ON_VALIDATE_SEARCHFORM.apply(this)) return false;
        if (!this.onSearchPageValidate()) return false;
        return true;
    },

    // Get box title (Lấy nội dung tiêu đề)
    getPrintBoxTitle: function (param) {
        return ecount.resource.LBL90068;
    },

    // Set init grid settings (Khởi tạo cài đặt cho lưới)
    setInitGridSettings: function (settings, param) {
        settings.setStyleRowBackgroundColor(function (data) { return data['LineColorYN'] == "N"; }, 'danger')
    },

    // @Override 
    getSearchPageCustom: function (item, param) {
        item.period = String.format("{0} ~ {1}", ecount.infra.getECDateFormat("DATE20", false, param.BASE_DATE_FROM.toDate()), ecount.infra.getECDateFormat("DATE20", false, param.BASE_DATE_TO.toDate()));
        item.excelTitle = item.leftTitle + " / " + item.period;
        return item;
    },

});