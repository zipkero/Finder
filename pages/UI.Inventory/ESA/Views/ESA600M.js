window.__define_resource && __define_resource("LBL10013","BTN00050","LBL14713","LBL14714","LBL01743","LBL01451","BTN00043","BTN00959","BTN00204","BTN00033","BTN00203","LBL08030","LBL00243","LBL06434","LBL02424","MSG00141","LBL03176","LBL93303","LBL09999","MSG00213","MSG00299");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : NGUYEN TRAN QUOC BAO
3. Description : INV.I > SETUP > AFTER SALES SERVICE CODE
4. Precaution  :
5. History     :2015.05.25: Edit template js
                2015.09.15(LE DAN): - Code refactoring
                [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                2018.01.16(Thien.Nguyen) add function scroll top for page,modify shaded grid option, modify onMessageHandler function
                2018.09.20(Chung Thanh Phuoc) Add link navigation Progress Status Code/ Progress Status Name of Menu After-Sales Service Code
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA600M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/

    /********************************************************************** 
    * page init   Class inheritance , init, render etc
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { CD_TYPE: "A", PAGE_SIZE: 100, PAGE_CURRENT: 0, PARAM: '' };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************** 
    * render form form  layout setting [onInitHeader, onInitContents, onInitFooter ...](ui setting)  
    **********************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        header.setTitle(ecount.resource.LBL10013).useQuickSearch();

        // Dropdown buttons
        var dropdownButtons = [];
        dropdownButtons.push({ id: "Excel", label: ecount.resource.BTN00050 });
        header.add("option", dropdownButtons);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            grid = g.grid(),
            form = g.form();

        grid.setRowData(this.viewBag.InitDatas.WhLoad)
            .setRowDataUrl("/Inventory/Basic/GetAfterSalesServiceCode")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CD_CODE'])
            .setColumnFixHeader(true)
            .setColumns([
                    { propertyName: 'CD_CODE', id: 'CD_CODE', title: ecount.resource.LBL14713, width: 180 },
                    { propertyName: 'NM_CODE', id: 'NM_CODE', title: ecount.resource.LBL14714, width: '' },
                    { propertyName: 'NO_CODE', id: 'NO_CODE', title: ecount.resource.LBL01743, width: 80, align: 'center' },
                    { propertyName: 'CD_USE', id: 'CD_USE', title: ecount.resource.LBL01451, width: 80, align: 'center' },
            ])
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setCheckBoxUse(true)
            .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, this.setGridCheckboxOption.bind(this))
            .setKeyboardCursorMove(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setEventShadedColumnId(['CD_CODE'], { isAllRememberShaded: true })
            .setCustomRowCell("CD_CODE", this.setModificationLink.bind(this))
            .setCustomRowCell("NM_CODE", this.setModificationLink.bind(this))
            .setCustomRowCell('CD_USE', this.setDataUsed.bind(this))
            .setCustomRowCell('NO_CODE', this.setDataNOCODE.bind(this));


        contents.add(form)
                .addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"))
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },


    // After the document loaded
    onLoadComplete: function (e) {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.PARAM);
            control.setFocus(0);
        }
    },


    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == "ESA601M") {
            this._ON_REDRAW();
            //this.setReload(this);
        }
    },
    

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    setRowBackgroundColor: function (data) {
        if (data['CD_USE'] == "N") return true;
    },

    setReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    setDataUsed: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.CD_USE) ? ecount.resource.LBL08030 : ecount.resource.LBL00243;
        return option;
    },

    setDataNOCODE: function (value, rowItem) {
        var option = {};

        if (['999', '000'].contains(rowItem.CD_CODE))
            option.data = "";
        else
            option.data = rowItem.NO_CODE;

        return option;
    },

    setModificationLink: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: data.rowItem['CD_COMMON'] == 'N' ? 185 : 165,
                    //height: rowItem['CD_COMMON'] == 'N' ? 185 : 165,
                    editFlag: 'M',
                    CD_CODE: data.rowItem['CD_CODE'],
                    NO_CODE: data.rowItem['NO_CODE']
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA601M',
                    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL02424),
                    popupType: false,
                    additional: false,
                    param: param
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Search button click eventesa601
    getDataSimpleSearch: function (e, value) {
        this.searchFormParameter.PARAM = value;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    // Dropdown Excel clicked event
    onDropdownExcel: function () {
        var self = this;
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
        self.searchFormParameter.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Columns = [
                { propertyName: 'CD_CODE', id: 'CD_CODE', title: ecount.resource.LBL14713, width: 180 },
                    { propertyName: 'NM_CODE', id: 'NM_CODE', title: ecount.resource.LBL14714, width: '' },
                    { propertyName: 'NO_CODE', id: 'NO_CODE', title: ecount.resource.LBL01743, width: 80, align: 'center' },
                    { propertyName: 'CD_USE', id: 'CD_USE', title: ecount.resource.LBL01451, width: 80, align: 'center' }
        ];

        self.searchFormParameter.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetAfterSalesServiceCodeForExcel",
            param: self.searchFormParameter
        });
    },

    onFooterNew: function (cid) {
        if (this.viewBag.Permission.permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93303, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 165,
            editFlag: "I"
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA601M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL02424),
            popupType: false,
            additional: false,
            param: param
        });
    },
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },
    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    //grid row CheckBox Option 설정
    setGridCheckboxOption: function (value, rowItem) {
        var option = {};

        if (rowItem.CD_CODE == "999" || rowItem.CD_CODE == "000") {
            option.attrs = {
                'disabled': true
            };
        }

        return option;
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonSelectedDelete: function (e) {
        var btn = this.footer.get(0).getControl("deleteRestore");
        var thisObj = this;
        if (this.viewBag.Permission.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93303, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };


        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CD_CODE: data.CD_CODE,
                CD_TYPE: "A"                
            });
        });

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeleteListAfterSalesService",
                    data: Object.toJSON(updatedList),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.setReload();
                        }
                    },
                    complete: function () {
                        btn.setAllowClick();
                    }
                });
            }
            else
                btn.setAllowClick();
        });
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnAfterSale(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnAfterSale(this.getSelectedListforActivate("N"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CD_CODE: data.CD_CODE,
                CD_TYPE: "A",
                CD_USE: cancelYN,
                NM_CODE: data.NM_CODE,
                NO_CODE: 0
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnAfterSale: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93303, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/Inventory/Basic/UpdateListAfterSalesService",
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
