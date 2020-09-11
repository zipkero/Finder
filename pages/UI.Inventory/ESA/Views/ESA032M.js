window.__define_resource && __define_resource("LBL35004","LBL06371","LBL06372","LBL00865","LBL10548","BTN00113","BTN00007","LBL00064","LBL10031","BTN00330","BTN00050","MSG00141","LBL07436","LBL03176","LBL06434","LBL10398","LBL10397");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : Bao
3. Description : Inv. I > Setup >Price Level by Customer/Vendor / 재고1 > 기초등록 > 특별단가등록 > 거래처특별단가그룹등록 리스트
4. Precaution  :
5. History     : 2015.09.28 - Tho Phan - Restructuring codes
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) Add option set shaded for grid, set scroll top for page, modify onMessageHandler function.
                 2018.06.25(Hoang Linh) Apply header search
                 2018.09.20(Chung Thanh Phuoc) Add link navigation Customer/Vendor Code/ Customer/Vendor Name of Price Level Group by Customer/Vendor
                 2018.10.16 (PhiTa) Apply disable sort when data search > 1000
                 2018.11.01 (PhiTa) Remove Apply disable sort > 1000
                 2019.03.06 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
 ****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA032M", {
    /********************************************************************** 
    * page user opion Variables(User variables and Object) 
    **********************************************************************/

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    canCheckCount: 100,
    formTypeCode: 'SR983',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보
    cBusinessNo: "",    //  활성화 되었던 전표 정보
    ALL_GROUP_CUST: "",
    /********************************************************************** 
    * page init   Class inheritance , init, render etc
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);

        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];

        this.searchFormParameter = {
            PARAM: this.PARAM,
            PAGE_SIZE: this.formInfoData.option.pageSize,
            PAGE_CURRENT: 0,
            SORT_COLUMN: 'CUST_NAME',
            SORT_TYPE: 'ASC',
            FORM_TYPE: this.formTypeCode,
            FORM_SER: '1',
            INI_COM_CODE: this.viewBag.InitDatas.IniComCode,
            CUST_CD: this.CUST_CD,
            PRICE_GROUP: this.PRICE_GROUP,
            PRICE_GROUP2: this.PRICE_GROUP2,
            BASE_DATE_CHK: this.BASE_DATE_CHK
        };
        
        this.ALL_GROUP_CUST = this.viewBag.InitDatas.ALL_GROUP_CUST;
    },

    render: function () {
        this._super.render.apply(this);

    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    onInitHeader: function (header) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            contents = g.contents(),
            form = g.form(),
            res = ecount.resource;

        //Header search content
        form
            .add(ctrl.define("widget.multiCode.cust", "txtSCustCd", "CUST_CD", res.LBL35004).setOptions({
                defaultParam: {
                    ACC002_FLAG: "N", CALL_TYPE: 102, DEL_FLAG: "N", EMP_FLAG: "N", GYE_CODE: "", IO_TYPE: "10", PARAM: "", PROD_SEARCH: "9",
                    SEARCH_GB: "2", SORT_COLUMN: "CUST_NAME", SORT_TYPE: "A", CallFlag: "O", PARENT: "", SeachType: "B", isApplyDisplayFlag: true
                }
            }).end())
            .add(ctrl.define("widget.multiCode.priceGroup", "PRICE_GROUP", "PRICE_GROUP", res.LBL06371).codeType(7).end())
            .add(ctrl.define("widget.multiCode.priceGroup", "PRICE_GROUP2", "PRICE_GROUP2", res.LBL06372).codeType(7).end())
            .add(ctrl.define('widget.checkbox', 'EtcChk', 'EtcChk', res.LBL00865, null)
                .label(res.LBL10548).value([1]).select([0]).end())
            ;
        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(res.BTN00113))
            .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));

        contents
            .add(form)
            .add(toolbar);
        /***************************************************************************************/

        header.setTitle(String.format(res.LBL00064, res.LBL10031))
            .useQuickSearch()
            .add('search', null, false) //중요 null, false 확인
            .add("option", [
                { id: "ListSettings", label: res.BTN00330 },
            ])
            .addContents(contents);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid();

        // Initialize Grid
        grid
            .setRowData(this.viewBag.InitDatas.GridFirstLoad)
            .setRowDataUrl("/Account/Basic/GetListPriceLevelByCusVend")
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["BUSINESS_NO", "CUST_NAME"])
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardEnterForExecute(true)
            .setKeyboardPageMove(true)
            .setColumnFixHeader(true)

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.fnColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell("CUST.BUSINESS_NO", this.setModificationLink.bind(this))
            .setCustomRowCell("CUST.CUST_NAME", this.setModificationLink.bind(this))
            .setCustomRowCell('CUST.PRICE_GROUP_DES', this.setPriceGroup1Link.bind(this))
            .setCustomRowCell('CUST.PRICE_GROUP_DES2', this.setPriceGroup2Link.bind(this))
            .setCustomRowCell('CUST.PRICE_GROUP', this.setPriceGroup1Link.bind(this))
            .setCustomRowCell('CUST.PRICE_GROUP2', this.setPriceGroup2Link.bind(this))

            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setEventShadedColumnId(['CUST.BUSINESS_NO'], { isAllRememberShaded: true });

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    onLoadComplete: function (e) {
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    onHeaderQuickSearch: function (e) {
        var grid = this.contents.getGrid();

        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.ALL_GROUP_CUST = this.ALL_GROUP_CUST;

        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    //Header Search button click event
    onHeaderSearch: function () {
        var self = this;
        self.searchFormParameter = $.extend({}, self.searchFormParameter, self.header.serialize().result);
        self.searchFormParameter.PARAM = "";
        self.searchFormParameter.BASE_DATE_CHK = self.searchFormParameter.EtcChk.length > 0 ? '1' : '';
        self.searchFormParameter.ALL_GROUP_CUST = this.ALL_GROUP_CUST;
        this.contents.getGrid().grid.clearChecked();

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        this.header.reset();
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case "ESA033M":
                this._ON_REDRAW();
                break;
            case "CM100P_02":
                this.reloadPage();
                break;
        }
    },

    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    reloadPage: function () {
        this.onAllSubmit({
            url: "/ECERP/ESA/ESA032M",
            param: this.searchFormParameter
        });
    },

    onGridRenderComplete: function (e, data, gridObj) {
        var self = this;
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();

            control.setValue(self.searchFormParameter.PARAM);
            control.setFocus(0);
        }
    },
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

    onFooterExcel: function () {
        var res = ecount.resource,
            self = this;

        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        self.searchFormParameter.ALL_GROUP_CUST = this.ALL_GROUP_CUST;
        self.searchFormParameter.excelTitle = String.format("{0} : {1}", res.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.EXCEL_FLAG = "Y";
        self.searchFormParameter.PAGE_CURRENT = 1;
        self.searchFormParameter.PAGE_SIZE = 30000;
        self.EXPORT_EXCEL({
            url: "/Account/Basic/GetListPriceLevelByCusVendForExcel",
            param: self.searchFormParameter
        });
    },

    onPopupHandler: function (control, config, handler) {
        switch (control.id) {
            case "txtSCustCd":
                config.isApplyDisplayFlag = true;
                config.isCheckBoxDisplayFlag = true;
                config.isIncludeInactive = true;
                break;
            case "PRICE_GROUP":
            case "PRICE_GROUP2":
                config.isApplyDisplayFlag = true;
                config.isCheckBoxDisplayFlag = true;
                config.isIncludeInactive = true;
                config.titlename = control.subTitle;
                config.popupType = false;
                config.checkMaxCount = 100;
                break;
            default:
                this._super.onPopupHandler.apply(this, arguments);
        }

        handler(config);
    },

    //BeforeOpenPopup
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        handler(parameter);
    },

    ON_KEY_F8: function (e, target) {
        this.onHeaderSearch();
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    fnColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    setModificationLink: function (value, rowItem) {
        var option = {},
            res = ecount.resource;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 280,
                    BUSINESS_NO: data.rowItem['BUSINESS_NO'],
                    CUST_NAME: data.rowItem['CUST_NAME'],
                    priceGroup_Code: data.rowItem['PRICE_GROUP'],
                    priceGroup_Name: data.rowItem['PRICE_GROUP_DES'],
                    priceGroup_1_Code: data.rowItem['PRICE_GROUP2'],
                    priceGroup_1_Name: data.rowItem['PRICE_GROUP_DES2'],
                    WID: data.rowItem['WID'],
                    WDATE: data.rowItem['WDATE']
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA033M',
                    name: String.format(res.LBL06434, res.LBL10031),
                    popupType: false,
                    additional: false,
                    param: param
                })

                e.preventDefault();
            }.bind(this)
        };


        return option;
    },

    setPriceGroup1Link: function (value, rowItem) {
        var option = {};

        option.event = {
            'click': function (e, data) {

                var param = {
                    width: 930,
                    height: 550,
                    cust: data.rowItem['BUSINESS_NO'],
                    code_class: data.rowItem['PRICE_GROUP'],
                    name: String.format(ecount.resource.LBL10398, "[" + data.rowItem["PRICE_GROUP_DES"] + "]"),
                    custyn: "Y"
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA073M',
                    name: String.format(ecount.resource.LBL10398, "[" + data.rowItem["PRICE_GROUP_DES"] + "]"),

                    popupType: false,
                    additional: false,
                    param: param
                })

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    setPriceGroup2Link: function (value, rowItem) {
        var option = {};

        option.event = {
            'click': function (e, data) {

                var param = {
                    width: 930,
                    height: 550,
                    cust: data.rowItem['BUSINESS_NO'],
                    code_class: data.rowItem['PRICE_GROUP2'],
                    name: String.format(ecount.resource.LBL10397, "[" + data.rowItem["PRICE_GROUP_DES2"] + "]"),
                    custyn: "Y"
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA073M',
                    name: String.format(ecount.resource.LBL10397, "[" + data.rowItem["PRICE_GROUP_DES2"] + "]"),
                    popupType: false,
                    additional: false,
                    param: param
                })

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
    },

    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'].toUpperCase() == "Y")
            return true;
    },

    // When you press the Search button
    // 검색버튼 눌렀을 때
    dataSearch: function () {
        var gridObj = this.contents.getGrid("dataGrid");
        var tabId = this.header.currentTabId;
        var invalid = this.header.validate(tabId);
        if (invalid.result.length > 0) {
            return;
        }

        this.contents.getGrid().grid.removeShadedColumn();

        gridObj.draw(this.searchFormParameter);

        this.header.toggle(true);
    },

    getTargetTabId: function (allTabId) {
        var tabId = this.header.currentTabId;
        tabId = this.isCustomTab(tabId) ? tabId : (allTabId || "all");

        return tabId;
    },

});