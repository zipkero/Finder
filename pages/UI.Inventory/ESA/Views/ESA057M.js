window.__define_resource && __define_resource("LBL01381","LBL01377","LBL01845","LBL07276","LBL07277","LBL02332","LBL07529","MSG10098","MSG10121","BTN00780","BTN00779","BTN00390","BTN00540","MSG10096","LBL07741","LBL07531","MSG10064","MSG03547","MSG10119","BTN00222","LBL03146","LBL04189","LBL00757");
/****************************************************************************************************
1. Create Date : 2015.05.14
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
4. Precaution  :
5. History     : [2016-02-17] Nguyen Anh Tuong : 창고계층그룹 공통화 Location Level Group Standardization
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
6. Old File    : ESA057M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA057M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: null,

    viewPermit: null,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            CD_GROUP: this.PCODE,
            GB_TYPE: this.PType == null ? "IN" : this.PType,
            SEARCH_TEXT: '',
            SORT_COLUMN: "CHK_GUBUN",
            SORT_TYPE: 'A',
            GB_GUBUN: ""
        };
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    initProperties: function () {
        this.userPermit = this.viewBag.Permission.PermitTree.Value;

        this.viewPermit = this.viewBag.InitDatas.viewPermit;
    },

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().useQuickSearch();
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var toolbar = widget.generator.toolbar(),
            tabContents = widget.generator.tabContents(),
            grid = widget.generator.grid();

        // Initialize Grid
        if (this.PCODE != 'ROOT' && this.viewPermit == 'Y') {
            grid.setRowData(this.viewBag.InitDatas.gridLoad)
                .setRowDataUrl("/Account/Basic/GetSearchDepartmentByLevelInfo")
                .setRowDataParameter(this.searchFormParameter);
        }

        grid.setKeyColumn(['SITE'])
            .setColumnFixHeader(true)
            .setCheckBoxUse(["CREATE", "AUTH"].contains(this.Type))
            //.setCheckBoxRememberChecked(false)
            .setColumns([
                    { propertyName: 'SITE', id: 'SITE', title: ecount.resource.LBL01381, width: 120 },
                    { propertyName: 'SITE_DES', id: 'SITE_DES', title: ecount.resource.LBL01377, width: this.Type != "SEARCH" ? 180 : '' },
                    { propertyName: '', id: 'MENU', title: ecount.resource.LBL01845, width: '', align: 'center', isHideColumn: this.Type != "SEARCH" ? false : true }
            ])

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Sorting
            .setColumnSortEnableList(['SITE', 'SITE_DES'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Custom cells
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCustomRowCell('MENU', this.setMenuColumn.bind(this));

        if (["CREATE", "AUTH"].contains(this.Type)) {
            tabContents
                .onSingleMode()
                .createActiveTab("IN", ecount.resource.LBL07276)
                .createTab("OUT", ecount.resource.LBL07277)
                .createRightTab("NO", ecount.resource.LBL02332)
                .add(toolbar)
                .addGrid("dataGrid", grid);

            contents.add(tabContents);
        }
        else {
            contents.add(toolbar).addGrid("dataGrid", grid);
        }
    },

    /**********************************************************************     
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.changeTitle(this.PCODE == 'ROOT' ? ecount.resource.LBL07529 : this.PText);

        if (["CREATE", "AUTH"].contains(this.Type))
            this.footer.getControl('Add').hide();

        var grid = this.contents.getGrid();
        grid.settings.setHeaderTopMargin(this.header.height());

        if (this.PCODE == 'ROOT') {
            grid.settings.setEmptyGridMessage(ecount.resource.MSG10098);
            grid.draw(this.searchFormParameter);
        }
        else if (this.viewPermit == 'N') {
            grid.settings.setEmptyGridMessage(ecount.resource.MSG10121);
            grid.draw(this.searchFormParameter);
        }

        if (this.PCODE == 'ROOT') {
            var parentFrame = ecount.getParentFrame(window);
            parentFrame.$('[data-cid=searchTree]')[0].focus();
            return;
        }
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.Type != "SEARCH" && this.Type != "SELECT") {
            toolbar
                .addLeft(ctrl.define("widget.button", "Add").label(ecount.resource.BTN00780))
                .addLeft(ctrl.define("widget.button", "Remove").css("btn btn-primary").label(ecount.resource.BTN00779))
                .addLeft(ctrl.define("widget.button", "Move").label(ecount.resource.BTN00390))
                .addLeft(ctrl.define("widget.button", "List").label(ecount.resource.BTN00540)); //type, button list
        }
        footer.add(toolbar);
    },
    // Completion event Grid load
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

    //// Search button click event
    //onContentsSearch: function (event, value) {
    //    var invalid = this.contents.getControl("Search").validate();
    //    if (invalid.length > 0) {
    //        this.contents.getControl("Search").setFocus(0);
    //        return false;
    //    }

    //    this.searchFormParameter.SEARCH_TEXT = this.contents.getControl('Search').getValue().keyword;
    //    this.contents.getGrid().draw(this.searchFormParameter);
    //},

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA057P_01')
            this.setReload(this);
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    // View Group button click event
    onFooterList: function (e) {
        var btnList = this.footer.getControl('List');
        var cdList = '';
        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnList.setAllowClick();
            return false;
        }

        $.each(selectItem, function (i, data) {
            cdList += data.SITE + ecount.delimiter;
        });

        // Define data transfer object
        var params = {
            width: 480,
            height: 500,
            PCodes: cdList
        };

        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA057P_02',
            name: ecount.resource.LBL07741,
            param: params,
            popupType: false,
            additional: false
        });

        btnList.setAllowClick();
    },

    // Add Item button click event
    onFooterAdd: function (e) {
        var btnAdd = this.footer.getControl('Add');

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnAdd.setAllowClick();
            return false;
        }

        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnAdd.setAllowClick();
            return false;
        }

        var thisObj = this;
        var cd_parent = this.PCODE;

        ecount.confirm(ecount.resource.MSG10064, function (status) {
            if (status === true) {
                var cdList = '';

                $.each(selectItem, function (i, data) {
                    cdList += data.SITE + ecount.delimiter;
                });

                var data = {
                    CD_PARENT: cd_parent,
                    CD_GROUP: cdList,
                    ACTION: "I"
                }

                ecount.common.api({
                    url: "/Account/Basic/RemoveInsertSiteToGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else if (result.Data == "1")
                            ecount.alert(ecount.resource.MSG03547);
                        else
                            thisObj.setReload(thisObj);
                    },
                    complete: function () {
                        btnAdd.setAllowClick();
                    }
                });
            } else {
                btnAdd.setAllowClick();
            }
        });
    },

    //Remove button click event
    onFooterRemove: function (e) {
        var btnRemove = this.footer.getControl('Remove');

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnRemove.setAllowClick();
            return false;
        }

        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnRemove.setAllowClick();
            return false;
        }

        var thisObj = this;
        var cd_parent = this.PCODE;

        ecount.confirm(ecount.resource.MSG10119, function (status) {
            if (status === true) {
                var cdList = '';

                $.each(selectItem, function (i, data) {
                    cdList += data.SITE + ecount.delimiter;
                });

                var data = {
                    CD_PARENT: cd_parent,
                    CD_GROUP: cdList,
                    ACTION: "D"
                }

                ecount.common.api({
                    url: "/Account/Basic/RemoveInsertSiteToGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else if (result.Data == "1")
                            ecount.alert(ecount.resource.MSG03547);
                        else
                            thisObj.setReload(thisObj);
                    },
                    complete: function () {
                        btnRemove.setAllowClick();
                    }
                });
            } else {
                btnRemove.setAllowClick();
            }
        });
    },

    //Move button click event
    onFooterMove: function (e) {
        var btnMove = this.footer.getControl('Move');

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnMove.setAllowClick();
            return false;
        }

        var cdList = '';
        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnMove.setAllowClick();
            return false;
        }

        $.each(selectItem, function (i, data) {
            cdList += data.SITE + 'ㆍ';
        });

        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 160,
            CD_Group: this.PCODE,
            NM_Group: this.PText,
            PCodes: cdList
        };

        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA057P_01',
            name: ecount.resource.BTN00222,
            param: params,
            popupType: false,
            additional: false
        });

        btnMove.setAllowClick();
    },

    // Tab index changed event
    onChangeContentsTab: function (event) {
        var btnList = this.footer.getControl('List');
        var btnAdd = this.footer.getControl('Add');
        var btnRemove = this.footer.getControl('Remove');
        var btnMove = this.footer.getControl('Move');

        switch (event.tabId) {
            case "OUT":
                btnList.show();
                btnAdd.show();
                btnRemove.hide();
                btnMove.hide();
                break;
            case "NO":
                btnList.hide();
                btnAdd.show();
                btnRemove.hide();
                btnMove.hide();
                break;
            default:
                btnList.show();
                btnAdd.hide();
                btnRemove.show();
                btnMove.show();
                break;
        }

        if (this.PCODE != 'ROOT') {
            this.searchFormParameter.GB_TYPE = event.tabId;
            this.contents.getGrid().draw(this.searchFormParameter);
        }

        this.contents.getGrid().grid.clearChecked();
        //this.contents.getControl("Search").onFocus(0);
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    /**********************************************************************
    * define user function
    **********************************************************************/

    //Press ENTER key event
    ON_KEY_ENTER: function (e, target) {
        if (e.target.name == "keyword" && target != null) {
            this.onContentsSearch(e);
        }
    },

    //Set value for [Menu] column
    setMenuColumn: function (value, rowItem) {
        var option = {};
        var menu = "";

        if (rowItem.ACCT_CHK == "Y")
            menu += ecount.resource.LBL03146 + " ";
        if (rowItem.PAY_CHK == "Y")
            menu += ecount.resource.LBL04189 + " ";
        if (rowItem.EGW_CHK == "Y")
            menu += ecount.resource.LBL00757 + " ";

        menu = menu.trim();
        option.data = menu;
        return option;
    },

    // Set background color for Deactivated rows
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});