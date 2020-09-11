window.__define_resource && __define_resource("LBL01809","LBL01595","LBL08019","BTN00227","BTN00008","LBL07309","MSG00962","MSG10118");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator     : Nguyen Anh Tuong
3. Description : Show List of authentication with this tree node. If user have permission then show enable checkbox. User could delete some authentication if they don't want to using location level group
                 재고1 > 기초등록 > 창고등록 > 계층그룹 > 왼쪽 페이지 > Fn > 권한보기
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA051P_03", {
    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/

    /**************************************************************************************************** 
     * page initialize
     ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { CD_GROUP: this.PCode };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    /********************************************************************** 
    * render form form  layout setting [onInitHeader, onInitContents, onInitFooter ...](ui setting)  
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var self = this;
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid();
        var ctrl = widget.generator.control();
        // Initialize Grid
        grid.setRowData(self.viewBag.InitDatas.Authens)
            .setRowDataUrl("/Inventory/Basic/GetListAuthenByLocationLevelName")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['ID'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'success')
            .setColumns([
                    { propertyName: 'ID', id: 'ID', title: ecount.resource.LBL01809, width: '90' },
                    { propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01595, width: '' },
                    { propertyName: 'CS', id: 'CS', title: ecount.resource.LBL08019, width: '60', align: 'center' }

            ])
            // Sorting
            .setColumnSortable(false)
            .setCheckBoxUse(true)
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setCheckBoxRememberChecked(false)
            .setPagingUseDefaultPageIndexChanging(true)
            // Custom Cells
            .setCustomRowCell('ID', this.setGridCheckBox.bind(this))
            .setCustomRowCell('CS', this.setGridCS.bind(this))
            .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, function (value, rowItem, dataTypeConvertor) {
                var option = {};
                option.attrs = {};
                if (['0'].contains(rowItem.ALL_GROUP_WH))
                    option.attrs['disabled'] = 'true';
                return option;
            })
        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "exclude").label(ecount.resource.BTN00227));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************     
    * event form listener [tab, content, search, popup ..](Events occurring in form)
    =>Events occurring in class parents, tab,onload, popup, search etcf
    onChangeControl, onChangeContentsTab, onLoadTabPane, onLoadComplete, onMessageHandler...     
    **********************************************************************/
    onContentsSearch: function (e, value) {
        this.searchFormParameter.CD_GROUP = this.PCode;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    onLoadComplete: function () {
        this.searchFormParameter = { CD_GROUP: this.PCode };
        var grid = this.contents.getGrid();
        grid.getSettings().setCheckBoxMaxCount(100);

        this.contents.getGrid().draw(this.searchFormParameter);
        this.changeTitle(this.PText);
    },

    onMessageHandler: function (item) {
        this.setReload(this);
    },

    /********************************************************************** 
    * event grid listener [click, change...] (Events occurring in grid) 
    **********************************************************************/
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    // Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },
    // Exclude button click event
    onFooterExclude: function (e) {
        var self = this;
        if (self.viewBag.Permission.PermitTree.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        } else {
            var objthis = this;
            var selectedItem = (e && e.gridCheckedItem) || this.contents.getGrid().getCheckedItem() || [];
            // Message processing when the choice is not
            if (selectedItem.length == 0) {
                ecount.alert(ecount.resource.MSG00962);
                return false;
            }
            // Logic into the DeleteLists the selected sub-array
            var DeleteLists = [];
            selectedItem.forEach(function (val) {
                DeleteLists.push(val.ID);
            });
            var deleteItems = { CD_GROUP: this.PCode, ID_LIST: DeleteLists.toString() }

            ecount.confirm(ecount.resource.MSG10118, function (status) {
                if (status === true) {
                    ecount.common.api({
                        url: "/Inventory/Basic/DeleteAuthenticationLevelGroupNode",
                        data: Object.toJSON(deleteItems),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            } else {
                                //When successful reload
                                objthis.setReload(objthis);
                            }
                        }
                    });
                }
            });
            return false;
        }
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
     * define user function 
     ****************************************************************************************************/
    setGridCheckBox: function (value, rowItem) {
        var option = {};
        option.disable = ['0'].contains(rowItem.ALL_GROUP_WH) ? true : false;
        return option;
    },

    setGridCS: function (value, rowItem) {
        var option = {};
        option.data = ['0'].contains(rowItem.ALL_GROUP_WH) ? "Y" : "N";
        return option;
    },

    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CS'] == "Y")
            return true;
    },

    // Reload Grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});
