window.__define_resource && __define_resource("LBL10911","LBL10910","LBL00021","LBL03043","LBL00344","LBL02791","LBL10909","MSG03839","BTN00043","BTN00079","MSG00141","BTN00959","BTN00204","BTN00033","BTN00203","BTN00008","LBL03115","BTN00107","LBL10784","MSG00722","LBL10901","MSG02620","LBL10908","LBL07436","LBL10933","LBL06956","LBL06955","MSG10104");
/****************************************************************************************************
1. Create Date : 2015.05.19
2. Creator     : Pham Van Phu
3. Description : List Inspection item (Danh mục hàng giám sát)
4. Precaution  :
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6. Old file: ESA061M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA060P_03", {

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
            PARAM: '',
            EXCEL_FLAG: 'N',
            ITEM_CD2: '',
            ITEM_NM: '',
            // SORT, PAGING
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1,
            SORT: '0', // ITEM_NAME
            SORT_TYPE: '', //A: ASC , D: DESC
            columns: [
               { index: 0, propertyName: 'ITEM_CD2', id: 'ITEM_CD2', title: ecount.resource.LBL10911, width: '' },
               { index: 1, propertyName: 'ITEM_NM', id: 'ITEM_NM', title: ecount.resource.LBL10910, width: '' },
               { index: 2, propertyName: 'DATA_TYPE', id: 'DATA_TYPE', title: ecount.resource.LBL00021, width: '', align: 'center' },
               { index: 3, propertyName: 'MUST_YN', id: 'MUST_YN', title: ecount.resource.LBL03043, width: '', align: 'center' },
               { index: 4, propertyName: 'USE_YN', id: 'USE_YN', title: ecount.resource.LBL00344, width: '80', align: 'center' },
               { index: 5, propertyName: 'SUB_INSP_ITEM', id: 'SUB_INSP_ITEM', title: ecount.resource.LBL02791, width: '140', align: 'center' }
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
        header.setTitle(ecount.resource.LBL10909)
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
            .setRowDataUrl('/Inventory/QcInspection/GetListForSearchStqcInspectItem')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["ITEM_CD2", "ITEM_NM"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { index: 0, propertyName: 'ITEM_CD2', id: 'ITEM_CD2', title: ecount.resource.LBL10911, width: '' },
                { index: 1, propertyName: 'ITEM_NM', id: 'ITEM_NM', title: ecount.resource.LBL10910, width: '' },
                { index: 2, propertyName: 'DATA_TYPE', id: 'DATA_TYPE', title: ecount.resource.LBL00021, width: '', align: 'center' },
                { index: 3, propertyName: 'MUST_YN', id: 'MUST_YN', title: ecount.resource.LBL03043, width: '', align: 'center' },
                { index: 4, propertyName: 'USE_YN', id: 'USE_YN', title: ecount.resource.LBL00344, width: '80', align: 'center' }, //품목그룹=>품목그룹명
                { index: 5, propertyName: 'SUB_INSP_ITEM', id: 'SUB_INSP_ITEM', title: ecount.resource.LBL02791, width: '140', align: 'center' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['DATA_TYPE', 'MUST_YN', 'USE_YN', 'SUB_INSP_ITEM'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Setting checkBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e))
            })

            // Custom Cells
            .setCustomRowCell("ITEM_CD2", this.setItemCodeLink.bind(this))
            .setCustomRowCell("DATA_TYPE", this.setDataType.bind(this))
            .setCustomRowCell("USE_YN", this.setUseYN.bind(this))
            .setCustomRowCell("SUB_INSP_ITEM", this.setLinkButtonSettingItem.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        //if (this.userPermit == "W" || this.userPermit == "U")
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043)); //New button

        toolbar.addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00079).permission([ecount.config.user.USE_EXCEL_CONVERT, ecount.resource.MSG00141]));// Excel button

        //if (this.userPermit == "W" || this.userPermit == "U")
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
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
        if (page.pageID == 'ESA060P_04')
            this.setReload();
        else if (page.pageID == 'ESA060P_03')
            this.setReload();
        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT = data.columnId;
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
            control.setValue(this.searchFormParameter.PARAM);
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
                    height: 235,
                    editFlag: 'M',
                    ITEM_NM: data.rowItem.ITEM_NM,
                    ITEM_CD2: data.rowItem.ITEM_CD2,
                    ITEM_CD: data.rowItem.ITEM_CD,
                    DATA_TYPE: data.rowItem.DATA_TYPE,
                    MUST_YN: data.rowItem.MUST_YN,
                    USE_YN: data.rowItem.USE_YN,
                    EDIT_DT: data.rowItem.EDIT_DT,
                    EDIT_ID: data.rowItem.EDIT_ID
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA060P_04',
                    name: res.LBL03115,
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
                    name: res.LBL10784,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["USE_YN"] == "N")
            return true;
        return false;
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        // Check user authorization
        var self = this;

        var grid = self.contents.getGrid().grid;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var lsInspectItemCd = [];
        var searchParam = $.extend({}, self.searchFormParameter, self.header.serialize().result);


        $.each(grid.getCheckedObject(), function (i, item) {
            if (item['ITEM_CD'] != undefined) {
                var data = item['ITEM_CD'] + ecount.delimiter
                lsInspectItemCd += data;
            }
        });

        if (lsInspectItemCd.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            btnDelete.setAllowClick();
            return false;
        }

        if (!['W'].contains(this.userPermit)) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var formData = {
            lsInspectItemCd: lsInspectItemCd,
            TYPE: 'INSPECTION_ITEM'
        };
        ecount.confirm(ecount.resource.MSG02620, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/QcInspection/DeleteInspectionItem",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data.length > 0) {
                                var msgErr = self.ErrShow(result);
                                if (msgErr != '')
                                    ecount.alert(msgErr);
                            }
                            self.setReload();
                        }
                    },
                    complete: function () {
                        btnDelete.setAllowClick();
                    }
                });
            }
            btnDelete.setAllowClick();
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
        param.height = 235;
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
            url: "/Inventory/QcInspection/GetListSearchStqcInspectItemForExcel",
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
    //    //this.setReload();
    //},
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        //this.header.getControl("search").setFocus(0);
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // lable for data type 
    setDataType: function (value, rowItem) {
        var option = {};
        if (['C'].contains(rowItem.DATA_TYPE))
            option.data = ecount.resource.LBL10933; // 코드형
        if (['N'].contains(rowItem.DATA_TYPE))
            option.data = ecount.resource.LBL06956;  //숫자형
        if (['T'].contains(rowItem.DATA_TYPE))
            option.data = ecount.resource.LBL06955;  //문자형

        return option;
    },

    // set lable for use YN
    setUseYN: function (value, rowItem) {
        var option = {};
        if (['Y'].contains(rowItem.USE_YN))
            option.data = "Yes";
        if (['N'].contains(rowItem.USE_YN)) {
            color = 'color:#ff3366';
            option.data = "No";
            option.attrs = {
                'style': color
            }
        }
        return option;
    },

    ErrShow: function (result) {
        var msg = '';
        var res = ecount.resource;
        if (result.Data.length > 0) {
            for (var i = 0; i < result.Data.length; i++) {
                if (result.Data[i].IsShowErr == 1)// Exists error show message
                {
                    if (result.Data[i].ERRFLAG != null) {
                        if (result.Data[i].ERRFLAG == "1") // Error not delete
                            msg += "<br/>" + res.MSG10104;
                    }
                }
            }
        }
        return msg;
    },
    // Reload grid
    setReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnInspectItem(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnInspectItem(this.getSelectedListforActivate("N"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                USE_YN: cancelYN,
                ITEM_CD2: data.ITEM_CD2,
                ITEM_CD: data.ITEM_CD,
                ITEM_NM: data.ITEM_NM,
                TYPE: "UPDATE_USEYN_ITEM"
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnInspectItem: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00722);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/Inventory/QcInspection/UpdateListInspectionItem",
            data: Object.toJSON(updatedList),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },
});
