window.__define_resource && __define_resource("LBL00064","LBL06436","LBL03017","LBL03004","LBL06426","LBL06438","LBL01451","LBL06431","LBL30177","LBL00329","BTN00043","BTN00008","LBL06434","LBL03755","LBL04294","BTN00027","LBL00364","LBL00243","LBL08030","LBL05292","LBL09999");
/****************************************************************************************************
1. Create Date : 2015.05.14
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > Price Level Registration > Price Level by Item > Input Price by Item
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_06", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: null,     // Page permission

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: '',
            PAGE_SIZE: this.viewBag.InitDatas.DefaultPageSize,
            PAGE_CURRENT: 0,
            SORT_COLUMN: '',
            SORT_TYPE: ''
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
        header.setTitle(String.format(resource.LBL00064, resource.LBL06436))
            .add(ctrl.define("widget.search", "Search").hideButton().handler({
                "click": this.onContentsSearch.bind(this),
                "keydown": this.onContentsSearch.bind(this)
            }));
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        var ctrl = g.control();
        var grid = g.grid();
        var decP = "9" + ecount.config.inventory.DEC_P;

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.GridFirstLoad)
            .setKeyColumn(["PROD_CD", "CODE_CLASS"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.resource.LBL03017, width: '100' },
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.resource.LBL03004, width: '' },
                { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: this.resource.LBL06426, width: '100' },
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: this.resource.LBL06438, width: '' },
                { propertyName: 'DEL_GUBUN', id: 'DEL_GUBUN', title: this.resource.LBL01451, width: '55', align: 'center' },
                { propertyName: 'PRICE', id: 'PRICE', title: this.resource.LBL06431, width: '100', align: 'right', dataType: decP },
                { propertyName: 'PRICE_VAT_YN', id: 'PRICE_VAT_YN', title: this.resource.LBL30177, width: '80', align: 'center' },
                { propertyName: 'CUSTOMER_VENDOR', id: 'CUSTOMER_VENDOR', title: this.resource.LBL00329, width: '50', align: 'center' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.DefaultPageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['CODE_CLASS', 'CLASS_DES', 'PRICE', 'PRICE_VAT_YN', 'DEL_GUBUN', 'CUSTOMER_VENDOR'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell("PROD_CD", this.setItemCodeLink.bind(this))
            .setCustomRowCell("PRICE_VAT_YN", this.setTaxStatusValue.bind(this))
            .setCustomRowCell("DEL_GUBUN", this.setActiveColumnValues.bind(this))
            .setCustomRowCell("CUSTOMER_VENDOR", this.setCustomerVendorLink.bind(this));

        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(resource.BTN00008));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());        
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
        //console.log(page.controlID);  //추가되었습니다.(코드 컨트롤에서 호출될 때만 추가)
    },


    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    // After grid rendered
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListPriceByItem1");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
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
                    height: 167,

                    editFlag: 'M',
                    code_class: data.rowItem['CODE_CLASS'],
                    prod_cd: data.rowItem['PROD_CD']
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_07',
                    name: String.format(res.LBL06434, res.LBL06436),
                    param: param,
                    popupType: false,
                    additional: false,
                    parentPageID: this.pageID,
                    responseID: this.callbackID
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set [TaxStatus] value
    setTaxStatusValue: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(value) ? this.resource.LBL03755 : this.resource.LBL04294;

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
                    width: 390,
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

    // New button clicked event
    onFooterNew: function () {
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
            height: 177,

            editFlag: 'I',
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA014P_07',
            name: String.format(res.LBL09999, res.LBL06436),
            param: param,                        
            popupType: false,            
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
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
    },
});