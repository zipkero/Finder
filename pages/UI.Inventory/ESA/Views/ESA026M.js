window.__define_resource && __define_resource("LBL00064","LBL06436","BTN00050","BTN00410","LBL06426","LBL06425","LBL01451","LBL03007","LBL07436","LBL00329","LBL02716","BTN00026","BTN00600","BTN00644","LBL05292","MSG00141","MSG00679","BTN00027","LBL00364","LBL07915","LBL02339");
/****************************************************************************************************
1. Create Date : 2015.05.05
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > Price Level Registration > Price Level by Item
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA026M", {   

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: '',

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            GUBUN: '90',
            PARAM: this.param == null ? '' : this.param,
            PAGE_SIZE: this.viewBag.InitDatas.DefaultPageSize,
            PAGE_CURRENT: $.isNumber(this.currentPage) && this.currentPage > 0 ? this.currentPage : 1,
            SORT_COLUMN: this.sort == null ? 'CODE_CLASS' : this.sort,
            SORT_TYPE: this.sortAd == null ? 'ASC' : this.sortAd,
        };
        this._keyWord = "ESA_ESA026M" + this.viewBag.ComCode + ecount.user.WID + new Date()._tick();

        this.userPermit = this.viewBag.Permission.Permit.Value;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header, resource) {
        var g = widget.generator;
        var ctrl = g.control();

        header.setTitle(String.format(resource.LBL00064, resource.LBL06436))
            .add(ctrl.define("widget.search", "Search").hideButton().value(this.param).handler({
                "click": this.onContentsSearch.bind(this),
                "keydown": this.onContentsSearch.bind(this)
            }))
            .add("option", [
                { id: "Excel", label: this.resource.BTN00050 },
                { id: "ECWebUploader", label: this.resource.BTN00410 },
            ]);
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var toolbar = g.toolbar();
        var grid = g.grid();

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.GridFirstLoad)
            .setKeyColumn(["CODE_CLASS", "CLASS_DES"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: this.resource.LBL06426, width: '' },
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: this.resource.LBL06425, width: '' },
                { propertyName: 'CANCEL', id: 'CANCEL', title: this.resource.LBL01451, width: '55', align: 'center' },
                { propertyName: 'REGISTER', id: 'REGISTER', title: this.resource.LBL03007, width: '90', align: 'center' },
                { propertyName: 'EXCEL', id: 'EXCEL', title: this.resource.LBL07436, width: '75', align: 'center' },
                { propertyName: 'CUSTOMER_VENDOR', id: 'CUSTOMER_VENDOR', title: this.resource.LBL00329, width: '55', align: 'center' },
                { propertyName: 'LOCATION', id: 'LOCATION', title: this.resource.LBL02716, width: '55', align: 'center' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.DefaultPageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['CANCEL', 'REGISTER', 'EXCEL', 'CUSTOMER_VENDOR', 'LOCATION'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell("CANCEL", this.setActiveColumnValues.bind(this))
            .setCustomRowCell("REGISTER", this.setRegisterPriceByItemLink.bind(this))
            .setCustomRowCell("EXCEL", this.setExcelLink.bind(this))
            .setCustomRowCell("CUSTOMER_VENDOR", this.setCustomerVendorLink.bind(this))
            .setCustomRowCell("LOCATION", this.setLocationLink.bind(this))
        ;

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Change").label(resource.BTN00026));
        toolbar.addLeft(ctrl.define("widget.button", "InputPrice").label(resource.BTN00600));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.header.getControl("Search").setValue(this.searchFormParameter.PARAM);

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(this.searchFormParameter.PAGE_CURRENT);
        grid.getSettings().setHeaderTopMargin(this.header.height());        
    },

    // Search button click event
    onContentsSearch: function (e, value) {
        this.searchFormParameter.PARAM = value;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    // After grid rendered
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListPriceLevelByItem");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
        if (!e.unfocus) {
            this.header.getControl("Search").onFocus(0);
        }
    },

    // Set [Reg.] link for Price Level
    setRegisterPriceByItemLink: function (value, rowItem) {
        var option = {};
        var thisObj = this;
        var res = this.resource;

        option.controlType = "widget.link";
        option.data = this.resource.BTN00644;
        option.attrs = { 'class': ['text-Default'] };
        option.event = {
            'click': function (e, data) {
                // Check user authorization
                if (thisObj.userPermit == "R") {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "W" }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    e.preventDefault();
                    return false; 
                }

                // Define data transfer object
                var param = {
                    width: 600,
                    height: 500,

                    code_class: rowItem.CODE_CLASS,
                    class_des: rowItem.CLASS_DES,
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_01',
                    name: String.format(res.LBL00064, res.LBL06436),
                    param: param,
                    parentPageID: this.pageID,                    
                    responseID: this.callbackID,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set [Excel] link for Price Level
    setExcelLink: function (value, rowItem) {
        var option = {};
        var thisObj = this;

        option.controlType = "widget.link";
        option.data = this.resource.BTN00050;
        option.attrs = { 'class': ['text-Default'] };
        option.event = {
            'click': function (e, data) {
                // Check user authorization
                if (!ecount.config.user.USE_EXCEL_CONVERT) {
                    ecount.alert(thisObj.resource.MSG00141);
                    e.preventDefault();
                    return false;
                }

                if (rowItem.CODE_CLASS != undefined && rowItem.CODE_CLASS.length == 0) {
                    ecount.alert(thisObj.resource.MSG00679);
                    e.pereventDefault();
                    return false;
                }

                var param = {
                    hid_historyback: 'Y',
                    Sort: (this.searchFormParameter.SORT_COLUMN != undefined ? this.searchFormParameter.SORT_COLUMN : ''),
                    SortAd: (this.searchFormParameter.SORT_TYPE != undefined ? this.searchFormParameter.SORT_TYPE : ''),
                    excel_flag: 'EC',
                    code_class: rowItem.CODE_CLASS,
                    text_search: (this.searchFormParameter.PARAM != undefined ? this.searchFormParameter.PARAM : ''),
                    hidSessionKey: this._keyWord,
                    fpopupID: this.ecPageID // 추가
                };

                var options = {
                    type: "ExcelDic",
                    keyword: this._keyWord,
                    iMaxCnt: this.contents.getGrid().getSettings().getPagingTotalRowCount(),
                    verisionCheck: true
                };

                ecount.infra.convertExcel("/ECMAIN/ESA/ESA026E.aspx", param, options);
                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set [Customer/Vendor] link for Price Level
    setCustomerVendorLink: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.link";
        option.data = this.resource.BTN00027;
        option.attrs = { 'class': ['text-Default'] };
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 400,
                    heigth: 500,
                    codeClass: data.rowItem['CODE_CLASS'],
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_04',
                    name: this.resource.LBL00364,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set [Location] link for Price Level
    setLocationLink: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.link";
        option.data = this.resource.BTN00027;
        option.attrs = { 'class': ['text-Default'] };
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 400,
                    heigth: 500,
                    codeClass: data.rowItem['CODE_CLASS'],
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_09',
                    name: this.resource.LBL07915,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set Active column values
    setActiveColumnValues: function (value, rowItem) {
        var option = {};

        if (['Y'].contains(rowItem.CANCEL)) {
            option.data = 'No';
        } else {
            option.data = 'Yes';
        }

        return option;
    },

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["CANCEL"] == "Y")
            return true;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    onDropdownExcel: function () {
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            ecount.alert(this.resource.MSG00141);
            return false;
        }

        var param = {
            hid_historyback: 'Y',
            Sort: (this.searchFormParameter.SORT_COLUMN != undefined ? this.searchFormParameter.SORT_COLUMN : ''),
            SortAd: (this.searchFormParameter.SORT_TYPE != undefined ? this.searchFormParameter.SORT_TYPE : ''),
            excel_flag: 'E',
            code_class: '',
            text_search: (this.searchFormParameter.PARAM != undefined ? this.searchFormParameter.PARAM : ''),
            hidSessionKey: this._keyWord,
            fpopupID: this.ecPageID // 추가
        };

        var options = {
            type: "ExcelDic",
            keyword: this._keyWord,
            iMaxCnt: this.contents.getGrid().getSettings().getPagingTotalRowCount(),
            verisionCheck: true
        };

        ecount.infra.convertExcel("/ECMAIN/ESA/ESA026E.aspx", param, options);
    },

    // Dropdown WebUploader clicked event
    onDropdownECWebUploader: function () {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        // Define data transfer object
        var param = {
            width: 770,
            height: 600,
            CurrentPageID: this.pageID
        };

        // Open popup
        this.openWindow({
            url: '/ECMain/EZS/EZS003M.aspx?DocCode=EZS009M&addrow=1&ForeignFlag=0&wonga_gubun=1&yymm_f=&yymm_t=',
            name: this.resource.LBL02339,
            param: param,
            popupType: true,
            additional: false,
            popupID: this.pageID,
            fpopupID: this.ecPageID // 추가
        });
    },

    // Change button clicked event
    onFooterChange: function (cid) {
        var gridSettings = this.contents.getGrid().settings;

        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
                SearchGubun: 0,
                NewFramework: true,
                NFW_Param: this.searchFormParameter.PARAM != undefined ? encodeURIComponent(this.searchFormParameter.PARAM) : '',
                NFW_Sort: this.searchFormParameter.SORT_COLUMN != undefined ? this.searchFormParameter.SORT_COLUMN : '',
                NFW_SortAd: this.searchFormParameter.SORT_TYPE != undefined ? this.searchFormParameter.SORT_TYPE : '',
                NFW_CurrentPage: $.isNumber(gridSettings.getPagingCurrentPage()) ? gridSettings.getPagingCurrentPage() : 1,
                fpopupID: this.ecPageID // 추가
            };

        this.onAllSubmit("/ECMain/ESA/ESA026P_03.aspx", param, "all");
    },

    // Input Price by item clicked event
    onFooterInputPrice: function (cid) {
        var res = this.resource;
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        // Define data transfer object
        var param = {
            width: 765,
            height: 650,            
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA014P_06',
            name: String.format(res.LBL00064, res.LBL06436),
            param: param,
            popupType: false,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID
        });
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

 

});