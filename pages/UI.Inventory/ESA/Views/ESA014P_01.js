window.__define_resource && __define_resource("LBL00064","LBL06436","BTN00028","BTN00427","LBL03017","LBL02990","LBL06431","LBL30177","LBL01451","BTN00043","BTN00542","BTN00026","BTN00008","LBL06434","LBL03755","LBL04294","LBL00243","LBL08030","LBL05292","LBL06441","LBL09999","MSG00342","LBL06444","LBL06433");
/****************************************************************************************************
1. Create Date : 2015.05.13
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > Price Level Registration > Price Level by Item > Register Price by Item
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_01", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: '',     // Page permission    

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            CODE_CLASS: this.code_class,
            PARAM: this.param == null ? '' : this.param,
            PAGE_SIZE: this.viewBag.InitDatas.DefaultPageSize,
            PAGE_CURRENT: $.isNumber(this.currentPage) && this.currentPage > 0 ? this.currentPage : 1,
            SORT_COLUMN: this.sort == null ? '' : this.sort,
            SORT_TYPE: this.sortAd == null ? '' : this.sortAd
        };

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

        header.notUsedBookmark();
        header.setTitle(String.format("{0} [{1}] {2}", this.class_des, this.code_class, String.format(resource.LBL00064, resource.LBL06436)))
            .add(ctrl.define("widget.search", "Search").hideButton().handler({
                "click": this.onContentsSearch.bind(this),
                "keydown": this.onContentsSearch.bind(this)
            }))
            .add("option", [
                { id: "Copy", label: this.resource.BTN00028 },
                { id: "DeleteAll", label: this.resource.BTN00427 }
            ]);
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var grid = g.grid();
        var decP = "9" + ecount.config.inventory.DEC_P;

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.GridFirstLoad)
            .setKeyColumn(["PROD_CD", "PROD_DES"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.resource.LBL03017, width: '130' },
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.resource.LBL02990, width: '' },
                { propertyName: 'PRICE', id: 'PRICE', title: this.resource.LBL06431, width: '90', align: 'right', dataType: decP },
                { propertyName: 'PRICE_VAT_YN', id: 'PRICE_VAT_YN', title: this.resource.LBL30177, width: '80', align: 'center' },
                { propertyName: 'DEL_GUBUN', id: 'DEL_GUBUN', title: this.resource.LBL01451, width: '50', align: 'center' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.DefaultPageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['PRICE', 'PRICE_VAT_YN', 'DEL_GUBUN'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell("PROD_CD", this.setItemCodeLink.bind(this))
            .setCustomRowCell("PROD_DES", this.setItemDesValue.bind(this))
            .setCustomRowCell("PRICE_VAT_YN", this.setTaxStatusValue.bind(this))
            .setCustomRowCell("DEL_GUBUN", this.setActiveColumnValues.bind(this));

        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "RegisterBatch").label(resource.BTN00542));
        toolbar.addLeft(ctrl.define("widget.button", "Change").label(resource.BTN00026));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(resource.BTN00008));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document is loaded
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

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        this.setReload(this);        
    },


    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    // After grid rendered
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListPriceByItem");
        
        if (!e.unfocus) {
            this.header.getControl("Search").onFocus(0);
        }        
    },

    // Set [Item Code] column link
    setItemCodeLink: function (value, rowItem) {
        var option = {};
        var res = this.resource;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 150,

                    editFlag: 'M',
                    code_class: this.code_class,
                    prod_cd: rowItem.PROD_CD,
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_02',
                    name: String.format(res.LBL06434, res.LBL06436),
                    param: param,
                    popupType: false,
                    additional: false,
                    parentPageID: this.pageID,
                    responseID: this.callbackID,
                });
                
                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set [Item Description] value
    setItemDesValue: function (value, rowItem) {
        var option = {};

        if (rowItem.SIZE_DES != undefined && rowItem.SIZE_DES.length > 0) {
            option.data = String.format("{0} [{1}]", value, rowItem.SIZE_DES);
        } else {
            option.data = value;
        }

        return option;
    },

    // Set [TaxStatus] value
    setTaxStatusValue: function (value, rowItem) {
        var option = {};

        option.data = ['Y'].contains(value) ? this.resource.LBL03755 : this.resource.LBL04294;
        
        return option;
    },

    // Set Active column values
    setActiveColumnValues: function (value, rowItem) {
        var option = {};

        if (['Y'].contains(rowItem.DEL_GUBUN)) {            
            option.data = this.resource.LBL00243;
        } else {
            option.data = this.resource.LBL08030;
        }

        return option;
    },

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["DEL_GUBUN"] == "Y")
            return true;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    onDropdownCopy: function () {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        // Define data transfer object
        var param = {
            width: 480,
            height: 147,

            code_class: this.code_class,
            class_des: this.class_des,

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA014P_08',
            name: this.resource.LBL06441,
            param: param,
            popupType: false,
            additional: false
        });        
    },

    // Delete All button clicked event
    onDropdownDeleteAll: function () {
        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: 480,
            height: 250,

            TABLES: 'SALE004',
            DEL_TYPE: 'Y',
            DELFLAG: 'Y',
            CODE_CLASS: this.code_class,
            PARAM: this.searchFormParameter.PARAM != undefined ? this.searchFormParameter.PARAM : '',

            SAVENAME: '/ECERP/ESA/ESA014P_01',
            parentPageID: this.pageID,
            responseID: this.callbackID,
            isSendMsgAfterDelete: true
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: this.resource.BTN00427,
            param: param,
            popupType: false,
            additional: false,
            popupID: this.pageID
        });
    },

    // New button clicked event
    onFooterNew: function (cid) {
        var res = this.resource;

        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        
        // Define data transfer object
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 150,

            editFlag: 'I',
            code_class: this.code_class,
            prod_cd: 0,            
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA014P_02',
            name: String.format(res.LBL09999, res.LBL06436),
            param: param,
            popupType: false,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
        });
    },

    // Register-Batch button clicked event
    onFooterRegisterBatch: function (cid) {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            ecount.alert(this.resource.MSG00342);
            e.preventDefault();
            return false;
        }

        var gridSettings = this.contents.getGrid().settings;

        // Define data transfer object
        var param = {
            width: 780,
            height: 600,

            SearchGubun: 1,
            hidPriceGroup: this.code_class,
            hidPriceGroupDes: this.class_des,

            ReloadedPageID: this.pageID,
            NFW_Param: encodeURIComponent(this.header.getControl("Search").getValue()),
            NFW_Sort: this.searchFormParameter.SORT_COLUMN != undefined ? this.searchFormParameter.SORT_COLUMN : '',
            NFW_SortAd: this.searchFormParameter.SORT_TYPE != undefined ? this.searchFormParameter.SORT_TYPE : '',
            NFW_CurrentPage: $.isNumber(gridSettings.getPagingCurrentPage()) ? gridSettings.getPagingCurrentPage() : 1,
            NFW_CodeClass: encodeURIComponent(this.code_class),
            NFW_ClassDes: encodeURIComponent(this.class_des),

            NFW_parentPageID: encodeURIComponent(this.parentPageID),
            NFW_popupType: 'layer',
            NFW_additional: false,
            NFW_responseID: encodeURIComponent(this.responseID),
            NFW_popupID: encodeURIComponent(this.popupID),
            NFW_popupLevel: this.popupLevel,
        };

        // Open popup
        this.openWindow({
            url: '/ECMAIN/ESA/ESA026P_01.aspx',
            name: this.resource.LBL06444,
            param: param,
            popupType: true,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
            fpopupID: this.ecPageID // 추가
        });
    },

    // Change button clicked event
    onFooterChange: function (cid) {
        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var gridSettings = this.contents.getGrid().settings;

        // Define data transfer object
        var param = {
            width: 780,
            height: 600,

            SearchGubun: 1,
			hidPriceGroup: this.code_class,
            hidPriceGroupDes: this.class_des,

            ReloadedPageID: this.pageID,
            NFW_Param: encodeURIComponent(this.header.getControl("Search").getValue()),
            NFW_Sort: this.searchFormParameter.SORT_COLUMN != undefined ? this.searchFormParameter.SORT_COLUMN : '',
            NFW_SortAd: this.searchFormParameter.SORT_TYPE != undefined ? this.searchFormParameter.SORT_TYPE : '',
            NFW_CurrentPage: $.isNumber(gridSettings.getPagingCurrentPage()) ? gridSettings.getPagingCurrentPage() : 1,
            NFW_CodeClass: encodeURIComponent(this.code_class),
            NFW_ClassDes: encodeURIComponent(this.class_des),

            NFW_parentPageID: encodeURIComponent(this.parentPageID),
            NFW_popupType: 'layer',
            NFW_additional: false,
            NFW_responseID: encodeURIComponent(this.responseID),
            NFW_popupID: encodeURIComponent(this.popupID),
            NFW_popupLevel: this.popupLevel,
        };

        // Open popup
        this.openWindow({
            url: '/ECMAIN/ESA/ESA026P_02.aspx',
            name: this.resource.LBL06433,
            param: param,
            popupType: true,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
            fpopupID: this.ecPageID // 추가
        });
    },

    // Close button clicked event
    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/

    // F2
    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Reload grid
    setReload: function (e) {       
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});