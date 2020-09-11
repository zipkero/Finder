window.__define_resource && __define_resource("LBL09924","LBL35126","LBL35127","MSG03839","LBL02792","BTN00035","BTN00008","LBL10901","LBL10900","MSG00299","MSG00705","LBL03420");
/****************************************************************************************************
1. Create Date : 2015.05.19
2. Creator     : NGUYEN CHI HIEU
3. Description : List Item by Inspection type Id (Danh mục mặt hàng theo mã giám sát)
4. Precaution  :
5. History     : 
6. Old file: ESA061M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA063P_02", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    userPermit: '',                 // Page permission    
    selectHearderControl: '',
    isShowSearchBtn: true,
    isShowOptionBtn: true,
    finalHeaderSearch: null,
    inspectionType: "inspectionType",
    isUseExcelConvert: false,
    searchFormParameter: null,
    isSendMessage: false,

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            KEYWORD: '', // Value of quick searach
            EXCEL_FLAG: 'N',
            ITEM_CD2: '',
            ITEM_NM: '',
            // SORT, PAGING
            PAGE_SIZE: 100,
            PAGE_CURRENT: 0,
            SORT_COLUMN: '0', // ITEM_NAME
            SORT_TYPE: 'A', //A: ASC , D: DESC            
        };

        this.userPermit = this.viewBag.Permission.Permit.Value;
        this.isUseExcelConvert = ecount.config.user.USE_EXCEL_CONVERT;
    },
    render: function () {
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/
    // Header Initialization
    onInitHeader: function (header) {
        var self = this;
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL09924)
       .useQuickSearch();
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {
        var self = this;
        var g = widget.generator;
        var toolbar = g.toolbar();
        var grid = g.grid();

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl('/Inventory/QcInspection/GetListItemByInspectiontypeId')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["PROD_CD", "PROD_CD"])
            //.setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { index: 0, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL35126, width: '' },
                { index: 1, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL35127, width: '' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Setting checkBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e))
            })

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.LBL02792)); //New button
        toolbar.addLeft(ctrl.define("widget.button", "DeleteAll").label(ecount.resource.BTN00035)); // Delete selected
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008)); // Close button
        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function (e) {

        var self = this;
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        this._keyWord = "ESA060P_03" + this.COM_CODE + ecount.user.WID + new Date()._tick();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        // Load parameter from server
        this.searchFormParameter.INSPECT_TYPE_CD = this.INSPECT_TYPE_CD;
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA063P_04') {
            this.setReload();
        }
        else if (page.pageID == "ESA063P_03") {
            this.isSendMessage = true;
            this.setReload();
        }

        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.header.lastReset(this.searchFormParameter.KEYWORD);
        this.searchFormParameter.KEYWORD = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnIndex;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        // this._super.onGridInit.apply(this, arguments);
        ecount.page.popup.prototype.onGridInit.apply(this, arguments);
    },

    // After grid rendered
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.KEYWORD);
            control.setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // Delete All button clicked event
    onFooterDeleteAll: function () {


        var btn = this.footer.get(0).getControl("DeleteAll");
        var thisObj = this;
        var listProCd = '';

        var selectProCd = this.contents.getGrid().grid.getChecked();

        if (selectProCd.length > 0) {

            // Check user authorization
            if (!['W'].contains(this.userPermit)) {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL10901, PermissionMode: "U" }]); // LBL10900 :Authorization to enter 
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }

            $.each(selectProCd, function (i, data) {
                listProCd += data.PROD_CD + ecount.delimiter;
            });

            var data = {
                editFlag: 'D',
                ListProcCd: listProCd,
                INSPECT_TYPE_CD: thisObj.INSPECT_TYPE_CD
            }
            ecount.confirm(ecount.resource.MSG00299, function (status) {
                if (status) {
                    ecount.common.api({
                        url: "/SVC/Inventory/QcInspection/UpdateSale003ByInspectionType",
                        data: Object.toJSON(data),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                                btn.setAllowClick();
                            }
                            thisObj.setReload();
                        }
                    });
                }
            });
            this.isSendMessage = true;
        }
        else {
            ecount.alert(ecount.resource.MSG00705);
            btn.setAllowClick();
            return;
        }
    },

    // New button clicked event (Đăng ký mục giám sát)
    onFooterNew: function (cid) {
        var res = this.resource;
        var btn = this.footer.get(0).getControl("New");
        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        // Define data transfer object
        var param = {};
        param.width = ecount.infra.getPageWidthFromConfig();
        param.height = 475;
        param.editFlag = 'M';
        param.INSPECT_TYPE_CD = this.INSPECT_TYPE_CD;

        this.openWindow({
            url: '/ECERP/ESA/ESA063P_03',
            name: ecount.resource.LBL03420,
            param: param,
            popupType: false
        });

        btn.setAllowClick();
    },

    // Close button clicked event
    onFooterClose: function () {
        this.isSendMessage == true ? this.sendMessage(this, { callback: this.close.bind(this) }) : this.close()
    },
    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/
    // F2
    //ON_KEY_F2: function (e, target) {        
    //    this.onFooterNew();
    //    e.preventdefault
    //},
    // F8
    //ON_KEY_F8: function (e, target) {
    //    this.resetParam();
    //    this.setReload();
    //},
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        //this.header.getControl("search").setFocus(0);
    },

    //grid row 수량 컬럼
    setGridFormatNumberZero: function (value, rowItem) {
        var option = {};
        if (value == 0) {
            option.data = '';
        }
        else {
            var data = ecount.calc.toFixedBasicPoint('S', 'Q', value);
            if (!$.isEmpty(data)) {
                var decimal = data.toString().split(".").length > 1 ? data.toString().split(".")[1].length : 0;
                data = String.fastFormat(data.toString(), {
                    fractionLimit: decimal,
                    removeFractionIfZero: false
                });
            }

            option.data = data;
        }

        return option;
    },
    // Reload grid
    setReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },
    resetParam: function () {
        this.searchFormParameter.KEYWORD = '';
        this.header.getQuickSearchControl().setValue(this.searchFormParameter.KEYWORD);
        this.searchFormParameter.PAGE_SIZE = 100;
        this.searchFormParameter.PAGE_CURRENT = 1;
        this.contents.getGrid().getSettings().setPagingCurrentPage(1);
    }
});
