window.__define_resource && __define_resource("LBL10911","LBL10910","LBL00344","LBL10784","LBL10921","LBL10920","MSG03839","BTN00043","BTN00959","BTN00204","BTN00033","BTN00203","BTN00008","LBL03116","BTN00107","LBL06434","LBL06436","MSG00722","LBL10901","MSG02620","LBL10922","MSG10104","MSG00213");
/****************************************************************************************************
1. Create Date : 2015.05.25
2. Creator     : Pham Van Phu
3. Description : Sub Insp. Item Code (Danh sách hạng mục chi tiết)
4. Precaution  :
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6. Old file: ESA062M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA062M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    userPermit: '',                 // Page permission    
    selectHearderControl: '',
    isShowSearchBtn: true,
    isShowOptionBtn: true,
    finalHeaderSearch: null,
    inspectionType: "itemdetail",

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: '',
            ITEM_CD: '',
            ITEMDETAIL_CD: '',
            ITEMDETAIL_CD2: '',
            ITEMDETAIL_NM: '',
            // SORT, PAGING
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1,
            columns: [
               { index: 0, propertyName: 'ITEMDETAIL_CD2', id: 'ITEMDETAIL_CD2', title: ecount.resource.LBL10911, width: '' },
               { index: 1, propertyName: 'ITEMDETAIL_NM', id: 'ITEMDETAIL_NM', title: ecount.resource.LBL10910, width: '' },
               { index: 2, propertyName: 'USE_YN', id: 'USE_YN', title: ecount.resource.LBL00344, width: '80', align: 'center' },
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
        header.notUsedBookmark();
        var self = this;

        header.setTitle(ecount.resource.LBL10784)
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
            .setRowDataUrl('/Inventory/QcInspection/GetListSearchStqcItemDetail')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["ITEMDETAIL_CD2", "ITEMDETAIL_NM"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns([
                { index: 0, propertyName: 'ITEMDETAIL_CD2', id: 'ITEMDETAIL_CD2', title: ecount.resource.LBL10921, width: '' },
                { index: 1, propertyName: 'ITEMDETAIL_NM', id: 'ITEMDETAIL_NM', title: ecount.resource.LBL10920, width: '' },
                { index: 2, propertyName: 'USE_YN', id: 'USE_YN', title: ecount.resource.LBL00344, width: '80', align: 'center' }
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            //.setColumnSortable(false)
            //.setColumnSortDisableList(['DATA_TYPE', 'MUST_YN', 'USE_YN', 'SUB_INSP_ITEM'])
            //.setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // CheckBox
            //Setting checkBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e))
            })

            // Custom Cells
            .setCustomRowCell("ITEMDETAIL_CD2", this.setItemCodeLink.bind(this))
            .setCustomRowCell("USE_YN", this.setUseYN.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        //if (this.userPermit == "W" || this.userPermit == "U")
            toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043)); //New button

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
        this._keyWord = "ESA062M" + this.COM_CODE + ecount.user.WID + new Date()._tick();

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
        if (page.pageID == 'ESA062P_01')
            this.setReload();
        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.ITEMDETAIL_CD = this.ITEMDETAIL_CD;
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
                    height: 165,
                    editFlag: 'M',
                    ITEM_CD: data.rowItem.ITEM_CD,
                    ITEMDETAIL_NM: data.rowItem.ITEMDETAIL_NM,
                    ITEMDETAIL_CD: data.rowItem.ITEMDETAIL_CD,
                    ITEMDETAIL_CD2: data.rowItem.ITEMDETAIL_CD2,
                    USE_YN: data.rowItem.USE_YN
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA062P_01',
                    name: res.LBL03116,
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
                    width: ecount.infra.getPageWidthFromConfig(),
                    //width: 800,
                    height: 210 + 60,
                    editFlag: 'M',
                    code_class: data.rowItem.CODE_CLASS,
                    prod_cd: data.rowItem.PROD_CD,
                    DEL_GUBUN: data.rowItem.DEL_GUBUN
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_02',
                    name: String.format(res.LBL06434, res.LBL06436),
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
        var lsInspectItemDetailCd = [];
        var searchParam = $.extend({}, self.searchFormParameter, self.header.serialize().result);


        $.each(grid.getCheckedObject(), function (i, item) {
            if (item['ITEMDETAIL_CD'] != undefined && item['ITEM_CD'] != undefined) {
                var data = item['ITEM_CD'] + "-" + item['ITEMDETAIL_CD'] + ecount.delimiter
                lsInspectItemDetailCd += data;
            }
        });

        if (lsInspectItemDetailCd.length <= 0) {
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
            lsInspectItemDetailCd: lsInspectItemDetailCd,
            TYPE: 'INSPECTION_ITEM_DETAIL'
        };
        ecount.confirm(ecount.resource.MSG02620, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/QcInspection/DeleteInspectionItemDetail",
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
                    complete: function() {
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
        param.width = ecount.infra.getPageWidthFromConfig();
        param.height = 165;
        param.editFlag = 'I';
        param.ITEM_CD = this.ITEM_CD;

        this.openWindow({
            url: '/ECERP/ESA/ESA062P_01',
            name: ecount.resource.LBL10922,
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
        //this.setReload();
    },
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        //this.header.getControl("search").setFocus(0);
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
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
        if (this.ITEM_CD != '') {
            this.searchFormParameter.ITEM_CD = this.ITEM_CD;
            this.searchFormParameter.ITEMDETAIL_CD = this.ITEM_CD;
        }

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnSubInspItem(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnSubInspItem(this.getSelectedListforActivate("N"));
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
                ITEM_CD: data.ITEM_CD,
                ITEMDETAIL_CD2: data.ITEMDETAIL_CD2,
                ITEMDETAIL_CD: data.ITEMDETAIL_CD,
                ITEMDETAIL_NM: data.ITEMDETAIL_NM,
                TYPE: "UPDATE_USEYN_SUB_ITEM"
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnSubInspItem: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U"}]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
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
                    this.setReload();
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },
});
