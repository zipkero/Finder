window.__define_resource && __define_resource("LBL00703","LBL02736","LBL02722","LBL07276","LBL07277","LBL02332","MSG10098","MSG10121","MSG00205","LBL07278","BTN00780","BTN00779","BTN00390","BTN00540","LBL00562","LBL01970","LBL02716","MSG10096","LBL07741","LBL07309","MSG10064","MSG03547","MSG10119","LBL07255");
/****************************************************************************************************
1. Create Date : 2015.06.09
2. Creator     : Nguyen Anh Tuong
3. Description : Acct. I > Setup > Location> Location Level Group
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                                    - Modify sendMessage function
                [2016-02-17] Nguyen Anh Tuong : 창고계층그룹 공통화 Location Level Group Standardization
                [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
6. Old File    : ESA052M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA052M"/** page ID */, {

    init: function () {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CD_GROUP: this.PCODE,
            GB_TYPE: this.PType == null ? "IN" : this.PType,
            SEARCH_TEXT: '',
            SORT_COLUMN: "CHK_GUBUN",
            SORT_TYPE: 'A',
            PAGE_SIZE: 30,
            DEL_GUBUN: ""
        };
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    onInitHeader: function (header) {
        header.notUsedBookmark().useQuickSearch();
    },

    onInitContents: function (contents) {
        var self = this;
        var toolbar = widget.generator.toolbar(),
            tabContents = widget.generator.tabContents(),
            grid = widget.generator.grid();

        if (this.PCODE != 'ROOT') {
            grid.setRowData(self.viewBag.InitDatas.WhGroup)
                .setRowDataUrl("/Inventory/Basic/GetSearchLocationByLevelInfo")
                .setRowDataParameter(this.searchFormParameter);
        }

        grid
            .setKeyColumn(['WH_CD', 'WH_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))
            .setColumnFixHeader(true)
            .setPagingUse(true)
            .setCheckBoxUse(this.Type != "SEARCH")
            //.setCheckBoxRememberChecked(false)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumns([
                    { propertyName: "CHK_GUBUN", id: 'CHK_GUBUN', title: ecount.resource.LBL00703, width: 150, align: 'center' },
                    { propertyName: "WH_CD", id: 'WH_CD', title: ecount.resource.LBL02736, width: 150 },
                    { propertyName: "WH_DES", id: 'WH_DES', title: ecount.resource.LBL02722, width: '' }
            ])
            .setCustomRowCell('CHK_GUBUN', this.setGridDataLabel);

        if (this.Type != "SEARCH") {
            tabContents
                    .onSingleMode()
                    .createActiveTab("IN", ecount.resource.LBL07276)
                    .add(toolbar)
                    .addGrid("dataGrid", grid)
                    .createTab("OUT", ecount.resource.LBL07277)
                    .createRightTab("NO", ecount.resource.LBL02332);
            contents.add(tabContents);
        } else {
            contents.add(toolbar).addGrid("dataGrid", grid);
        }
    },

    onLoadComplete: function () {
        var parentFrame = ecount.getParentFrame(window); 

        if (this.header.buttons[1] != undefined)
            this.header.buttons[1].hide();
        if (this.PCODE == 'ROOT')
            this.contents.getGrid().settings.setEmptyGridMessage(ecount.resource.MSG10098);
        else if (this.viewPermit == 'N')
            this.contents.getGrid().settings.setEmptyGridMessage(ecount.resource.MSG10121);
        else
            this.contents.getGrid().settings.setEmptyGridMessage(ecount.resource.MSG00205);
        if (["CREATE", "AUTH"].contains(this.Type))
            this.footer.getControl("ItemAdd").hide();

        this.contents.getGrid().draw(this.searchFormParameter);
        this.changeTitle(this.PCODE == 'ROOT' ? ecount.resource.LBL07278 : this.PText);

        if (this.PCODE == 'ROOT' && parentFrame.$('[data-cid=searchTree]')[0] != undefined) {
            parentFrame.$('[data-cid=searchTree]')[0].focus();
        }
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.Type != "SEARCH") {
            toolbar
                .addLeft(ctrl.define("widget.button", "ItemAdd").label(ecount.resource.BTN00780))
                .addLeft(ctrl.define("widget.button", "Remove").css("btn btn-primary").label(ecount.resource.BTN00779))
                .addLeft(ctrl.define("widget.button", "Move").label(ecount.resource.BTN00390))
                .addLeft(ctrl.define("widget.button", "GroupList").label(ecount.resource.BTN00540)); //type, button list
        }
        footer.add(toolbar);
    },
    // 그리드 로드 완료 이벤트(Completion event Grid load)
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (this.PCODE != 'ROOT') {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.SEARCH_TEXT);
            control.onFocus(0);
        }
    },

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter.SEARCH_TEXT);
        this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },


    onChangeContentsTab: function (event) {
        this.searchFormParameter.GB_TYPE = event.tabId;
        switch (event.tabId) {
            case "OUT":
                this.footer.getControl("GroupList").show();
                this.footer.getControl("ItemAdd").show();
                this.footer.getControl("Remove").hide();
                this.footer.getControl("Move").hide();
                break;
            case "NO":
                this.footer.getControl("GroupList").hide();
                this.footer.getControl("ItemAdd").show();
                this.footer.getControl("Remove").hide();
                this.footer.getControl("Move").hide();
                break;
            default:
                this.footer.getControl("GroupList").show();
                this.footer.getControl("ItemAdd").hide();
                this.footer.getControl("Remove").show();
                this.footer.getControl("Move").show();
                break;
        }

        if (this.PCODE != 'ROOT')
            this.contents.getGrid().draw(this.searchFormParameter);

        this.contents.getGrid().grid.clearChecked();
    },

    setGridDataLabel: function (value, rowItem) {
        var option = {};
        option.data = rowItem.CHK_GUBUN == "1" ? ecount.resource.LBL00562 : value == "2" ? ecount.resource.LBL01970 : ecount.resource.LBL02716;
        option.controlType = "widget.label";
        return option;
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/
    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA057P_02' || page.pageID == 'ESA057P_01')
            this.setReload(this);
    },
    // View Group button click event
    onFooterGroupList: function (e) {
        var cdList = '';
        var splitChar = ecount.delimiter;
        var selectedItem = this.contents.getGrid().grid.getChecked();
        // Message processing when the choice is not
        if (selectedItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            return false;
        }
        $.each(selectedItem, function (i, data) {
            cdList += data.WH_CD + splitChar;
        });
        cdList = cdList.substring(0, cdList.length - 1);
        // Define data transfer object
        var param = {
            width: 480,
            height: 300,
            PCodes: cdList,
            LevelGroupType: 'WH'
        };
        //Open popup
        this.openWindow({
            //url: '/ECERP/ESA/ESA052P_02',
            url: '/ECERP/Popup.Common/ESA057P_02',
            name: ecount.resource.LBL07741, param: param, popupType: false, additional: false, popupID: this.pageID
        });
    },

    // Add Item button click event
    onFooterItemAdd: function (e) {
        var self = this;
        if (self.viewBag.Permission.PermitTree.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var objthis = this;
        var cd_parent = this.PCODE;
        var selectItem = objthis.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            return false;
        }

        ecount.confirm(ecount.resource.MSG10064, function (status) {
            if (status === true) {
                var cdList = '';
                var splitChar = ecount.delimiter;
                $.each(selectItem, function (i, data) {
                    cdList += data.WH_CD + splitChar;
                });
                if (selectItem.count() == 0) {
                    ecount.alert(ecount.resource.MSG10096);
                    return false;
                }
                if (selectItem.count() > 1000) {
                    ecount.alert(ecount.resource.MSG03547);
                    return false;
                }
                cdList = cdList.substring(0, cdList.length - 1);
                var data = {
                    CD_PARENT: cd_parent,
                    CD_GROUP: cdList,
                }
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/AddItemsToLocationLevelGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else {
                            objthis.setReload(objthis);
                        }
                    }
                });
            }
        });
    },

    //Remove button click event
    onFooterRemove: function (e) {
        var self = this;
        if (self.viewBag.Permission.PermitTree.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var objthis = this;
        var cd_parent = this.PCODE;
        var selectItem = objthis.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            return false;
        }
        if (selectItem.count() > 1000) {
            ecount.alert(ecount.resource.MSG03547);
            return false;
        }
        ecount.confirm(ecount.resource.MSG10119, function (status) {
            if (status === true) {
                var cdList = '';
                var splitChar = ecount.delimiter;
                $.each(selectItem, function (i, data) {
                    cdList += data.WH_CD + splitChar;
                });

                cdList = cdList.substring(0, cdList.length - 1);

                var data = {
                    CD_PARENT: cd_parent,
                    CD_GROUP: cdList
                }

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeleteItemsToLocationLevelGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else {
                            objthis.setReload(objthis);
                        }
                    }
                });
            }
        });
    },

    //Move button click event
    onFooterMove: function (e) {
        var self = this;
        if (self.viewBag.Permission.PermitTree.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var cdList = '';
        var splitChar = ecount.delimiter;
        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            return false;
        }

        $.each(selectItem, function (i, data) {
            cdList += data.WH_CD + splitChar;
        });

        cdList = cdList.substring(0, cdList.length - 1);

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 160,
            CD_Group: this.PCODE,
            NM_Group: this.PText,
            PCodes: cdList,
            LevelGroupType: 'WH'
        };

        this.openWindow({ url: '/ECERP/Popup.Common/ESA057P_01', name: ecount.resource.LBL07255, param: param, popupType: false, additional: false, popupID: this.pageID });
    },

    ON_KEY_ENTER: function (e, target) {
        if (e.target.name == "keyword" && target != null) {
            this.onContentsSearch(e);
        }
    },

    // Reload Grid
    setReload: function (e) {
        this.contents.getGrid().grid.clearChecked();
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    }
});