window.__define_resource && __define_resource("LBL03420","LBL35126","LBL35127","LBL10900","MSG03839","BTN00069","BTN00008","MSG00722","LBL10901","MSG00299","MSG06002","LBL10908");
/****************************************************************************************************
1. Create Date : 2015.06.06
2. Creator     : NGUYEN CHI HIEU
3. Description : All Item by Inspection (Tất cả mặt hàng theo mã giám sát)
4. Precaution  :
5. History     : 
6. Old file: ESA061M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "ESA063P_03", {

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
    // init properties
    initProperties: function () {
        this.saveLoading = {
            locked: false,
        }
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
        header.setTitle(ecount.resource.LBL03420)
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
            .setRowDataUrl('/Inventory/QcInspection/GetListSetupItemInspectionType')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["PROD_CD", "PROD_CD"])
            //.setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { index: 0, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL35126, width: '' },
                { index: 1, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL35127, width: '' },
                { index: 2, propertyName: 'INSPECT_TYPE_NM', id: 'INSPECT_TYPE_NM', title: ecount.resource.LBL10900, width: '' }
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

            .setCustomRowCell("PROD_CD", this.setItemCodeLink.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00069)); //New button        
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

    // on footer save
    onFooterSave: function () {

        var thisObj = this;
        var title = ecount.resource.LBL10901;

        var UserPermit = thisObj.viewBag.Permission.Permit.Value;

        if (!['W', 'U'].contains(UserPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "W" }]);
            thisObj.footer.getControl("Save").setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }

        //if (this.saveLoading.locked) return;
        //this.saveLoading.locked = true;

        this.fnSave();


    },

    fnSave: function () {
        var btnSave = this.footer.get(0).getControl("Save");
        var thisObj = this;
        var listProCd = '';

        var selectProCd = this.contents.getGrid().grid.getChecked();

        if (selectProCd.length > 0) {
            $.each(selectProCd, function (i, data) {
                listProCd += data.PROD_CD + ecount.delimiter;
            });

            var data = {
                editFlag: 'M',
                ListProcCd: listProCd,
                INSPECT_TYPE_CD: thisObj.INSPECT_TYPE_CD
            }
            ecount.common.api({
                url: "/SVC/Inventory/QcInspection/UpdateSale003ByInspectionType",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200")
                        ecount.alert(result.fullErrorMsg);
                    else
                        thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                }
            });
        }
        else {
            ecount.alert(ecount.resource.MSG06002);
            return;
        }
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
        param.INSPECT_TYPE_CD2 = this.INSPECT_TYPE_CD2;

        this.openWindow({
            url: '/ECERP/ESA/ESA060P_04',
            name: ecount.resource.LBL10908,
            param: param,
            popupType: false
        });

        btn.setAllowClick();
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
    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        this.header.getControl("search").setFocus(0);
    },

    //grid row 수량 컬럼
    setGridFormatNumberZero: function (value, rowItem) {
        var option = {};
        if (value == 0) {
            option.data = '';
        }
        else {
            option.data = ecount.calc.toFixedBasicPoint('S', 'Q', value);
        }

        return option;
    },
    // Reload grid
    setReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    //Show progress bar (hiển thị layout load trang)
    vshowProgressbar: function (overlay) {
        this.saveLoading.locked = true;
        this.showProgressbar(overlay);
    },

    //Hide progress bar (ẩn layout load trang)
    vhideProgressbar: function () {
        this.saveLoading.locked = false;
        this.hideProgressbar(true);
    },

    // Set [Item Code] column link
    setItemCodeLink: function (value, rowItem) {
        var self = this;
        var option = {};
        var res = this.resource;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var title = ecount.resource.LBL10901;

                var UserPermit = self.viewBag.Permission.Permit.Value;
                if (!['W', 'U'].contains(UserPermit)) {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "W" }]);
                    self.footer.getControl("Save").setAllowClick();
                    ecount.alert(msgdto.fullErrorMsg);
                    return false;
                }

                var invalid = self.contents.validate();
                if (invalid.result.length > 0) {
                    invalid.result[0][0].control.setFocus(0);
                    self.footer.get(0).getControl("Save").setAllowClick();
                    return false;
                }
                var listProCd = data.rowItem.PROD_CD + ecount.delimiter;
                var data = {
                    editFlag: 'M',
                    ListProcCd: listProCd,
                    INSPECT_TYPE_CD: self.INSPECT_TYPE_CD
                }
                ecount.common.api({
                    url: "/SVC/Inventory/QcInspection/UpdateSale003ByInspectionType",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else
                            self.sendMessage(self, { callback: self.close.bind(self) });
                    }
                });
                e.preventDefault();
            }.bind(this)
        };
        return option;
    }
});
