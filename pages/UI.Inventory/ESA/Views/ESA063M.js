window.__define_resource && __define_resource("LBL35126","LBL35127","LBL08838","LBL08839","LBL10894","LBL03103","LBL10900","LBL03696","BTN00079","MSG00141","BTN00008","LBL03100","BTN00107","BTN00275","LBL10921","MSG00722","LBL10901","MSG00299","LBL10908","LBL07436","LBL07879","LBL07880","LBL08396","LBL08478","LBL08477");
/****************************************************************************************************
1. Create Date : 2015.05.19
2. Creator     : NGUYEN CHI HIEU
3. Description : List Inspection item (Danh mục hàng giám sát)
4. Precaution  :
5. History     : 
6. Old file: ESA061M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA063M", {

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
            columns: [
                { index: 0, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL35126, width: '' },
                { index: 1, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL35127, width: '' },
                { index: 2, propertyName: 'QC_BUY_TYPE', id: 'QC_BUY_TYPE', title: ecount.resource.LBL08838, width: '', align: 'left' },
                { index: 3, propertyName: 'QC_YN', id: 'QC_YN', title: ecount.resource.LBL08839, width: '', align: 'left' },
                { index: 4, propertyName: 'INSPECT_STATUS', id: 'INSPECT_STATUS', title: ecount.resource.LBL10894, width: '80', align: 'left' }, //품목그룹=>품목그룹명
                { index: 5, propertyName: 'SAMPLE_PERCENT', id: 'SAMPLE_PERCENT', title: ecount.resource.LBL03103, width: '80', align: 'right' },
                { index: 6, propertyName: 'INSPECT_TYPE_NM', id: 'INSPECT_TYPE_NM', title: ecount.resource.LBL10900, width: '80', align: 'left' }
            ]
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
        header.setTitle(ecount.resource.LBL03696)
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
            .setRowDataUrl('/Inventory/QcInspection/GetListSTQCInspectiontypeSettingsByItem')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["PROD_CD", "PROD_CD"])
            //.setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { index: 0, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL35126, width: '' },
                { index: 1, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL35127, width: '' },
                { index: 2, propertyName: 'QC_BUY_TYPE', id: 'QC_BUY_TYPE', title: ecount.resource.LBL08838, width: '', align: 'left' },
                { index: 3, propertyName: 'QC_YN', id: 'QC_YN', title: ecount.resource.LBL08839, width: '', align: 'left' },
                { index: 4, propertyName: 'INSPECT_STATUS', id: 'INSPECT_STATUS', title: ecount.resource.LBL10894, width: '80', align: 'left' }, //품목그룹=>품목그룹명
                { index: 5, propertyName: 'SAMPLE_PERCENT', id: 'SAMPLE_PERCENT', title: ecount.resource.LBL03103, width: '80', align: 'right' },
                { index: 6, propertyName: 'INSPECT_TYPE_NM', id: 'INSPECT_TYPE_NM', title: ecount.resource.LBL10900, width: '80', align: 'left' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)            
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //// Custom Cells
            .setCustomRowCell("QC_BUY_TYPE", this.setQC_YN.bind(this))
            .setCustomRowCell("QC_YN", this.setQC_YN.bind(this))        
            .setCustomRowCell("INSPECT_STATUS", this.setGetInspectStatus.bind(this))
            .setCustomRowCell("SAMPLE_PERCENT", this.setGridFormatNumberZero.bind(this))
            .setCustomRowCell("PROD_CD", this.setItemCodeLink.bind(this));
            //.setCustomRowCell("DATA_TYPE", this.setDataType.bind(this))
            //.setCustomRowCell("USE_YN", this.setUseYN.bind(this))
            //.setCustomRowCell("SUB_INSP_ITEM", this.setLinkButtonSettingItem.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();       
        toolbar.addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00079).permission([ecount.config.user.USE_EXCEL_CONVERT, ecount.resource.MSG00141]));// Excel button
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
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {        
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA063P_01') {
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
                    height: 295,
                    editFlag: 'M',
                    INSPECT_STATUS: data.rowItem.INSPECT_STATUS,
                    INSPECT_TYPE_CD: data.rowItem.INSPECT_TYPE_CD,
                    INSPECT_TYPE_CD2: data.rowItem.INSPECT_TYPE_CD2,
                    PROD_CD: data.rowItem.PROD_CD,
                    PROD_DES: data.rowItem.PROD_DES,
                    QC_BUY_TYPE: data.rowItem.QC_BUY_TYPE,
                    QC_YN: data.rowItem.QC_YN,
                    SAMPLE_PERCENT: data.rowItem.SAMPLE_PERCENT,
                    INSPECT_TYPE_NM: data.rowItem.INSPECT_TYPE_NM,
                    EDIT_ID: data.rowItem.EDIT_ID,
                    EDIT_DT: data.rowItem.EDIT_DT
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA063P_01',
                    name: ecount.resource.LBL03100,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    // Set [Item setting] column button (Cài đặt cho nút mặt hàng kiểm tra phụ)
    setLinkButtonSettingItem: function (value, rowItem) {
        var option = {};
        var res = this.resource;

        if (rowItem.DATA_TYPE == "C") {
            option.controlType = "widget.link";
            option.data = res.BTN00107;
        }

        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig() + 50,
                    height: 400,
                    ITEM_CD: data.rowItem.ITEM_CD,
                    ITEMDETAIL_CD2: data.rowItem.ITEM_CD2,
                    ITEMDETAIL_CD: data.rowItem.ITEM_CD
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA062M',
                    name: String.format('{0} {1}', res.BTN00275, res.LBL10921),
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // Delete All button clicked event
    onFooterDeleteAll: function () {
        
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var btn = this.footer.get(0).getControl("DeleteAll");
        var arrPriceLevelBatch = [];
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);

        $.each(grid.getCheckedObject(), function (i, item) {
            if (item['PRICE'] != undefined) {
                var param = {
                    CUST: item['CODE_CLASS'],
                    CODE_CLASS: item['CODE_CLASS'],
                    PROD_CD: item['PROD_CD'],
                    PRICE: item['PRICE'],
                    PRICE_VAT_YN: item['PRICE_VAT_YN']
                };
                arrPriceLevelBatch.push(param);
            }
        });

        if (arrPriceLevelBatch.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            btn.setAllowClick();
            return false;
        }

        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var formData = Object.toJSON(arrPriceLevelBatch);

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeleteBatchPriceLevelForItem",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.dataSearch();
                        }
                    }
                });
            }
            btn.setAllowClick();
        });
        return true;
    },

    // New button clicked event (Đăng ký mục giám sát)
    onFooterNew: function (cid) {
        var res = this.resource;
        var btn = this.footer.get(0).getControl("New");
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            //btn.setAllowClick();
            return false;
        }
        // Define data transfer object
        var param = {};
        param.width = 756;
        param.height = 250;
        param.editFlag = 'I';

        this.openWindow({
            url: '/ECERP/ESA/ESA060P_04',
            name: ecount.resource.LBL10908,
            param: param,
            popupType: false
        });

        btn.setAllowClick();
    },

    // Export excel to file
    onFooterExcel: function () {
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        var excelSearch = this.searchFormParameter;
        excelSearch.EXCEL_FLAG = "Y";
        excelSearch.TYPE = "EXPORT_EXCEL";

        this.EXPORT_EXCEL({
            url: "/Inventory/QcInspection/GetListSTQCInspectiontypeSettingsByItemExcel",
            param: excelSearch
        });
        excelSearch.EXCEL_FLAG = "N";
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
    // F8
    //ON_KEY_F8: function (e, target) {
    //    this.resetParam();
    //    this.setReload();
    //},
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        //this.header.getControl("search").setFocus(0);
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
       
    // Set setQC_YN
    setQC_YN: function (value, rowItem) {        
        var option = {};
        if (value == "Y") {
            option.data = ecount.resource.LBL07879; // 사용
        }
        else if (value == "N") {
            option.data = ecount.resource.LBL07880; // 사용안함
        }
        else {
            option.data = ecount.resource.LBL08396; // 기본설정
        }
        return option;

    },

    // Set GetInspectStatus
    setGetInspectStatus: function (value, rowItem) {        
        var option = {};
        if (value == "L") {
            option.data = ecount.resource.LBL08478; // 사용
        }
        else if (value == "S") {
            option.data = ecount.resource.LBL08477; // 사용안함
        }
        else {
            option.data = '';
        }
        return option;
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
