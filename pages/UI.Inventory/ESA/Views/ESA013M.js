window.__define_resource && __define_resource("LBL00064","LBL10029","BTN00050","BTN00427","LBL06426","LBL06425","LBL35244","BTN00043","BTN00037","LBL04021","MSG00456","MSG00141","MSG00342","LBL06423","LBL02484","LBL09999","LBL06434","MSG02158");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA013M", {

    header: null,

    contents: null,

    footer: null,

    permission: null,

    SearchValue: null,
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/



    /********************************************************************** 
    * page init   Class inheritance , init, render etc
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { PARAM: "", SORT_COLUMN: "", SORT_TYPE: "A" }; // Variable declaration in order to receive your query

        this.permission = this.viewBag.Permission.permitESA013M;
    },

    render: function () {
        this._super.render.apply(this);
    },


    /********************************************************************************************************
    * UI Layout setting
     ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        var g = widget.generator,
            toolbar = g.toolbar();
        var ctrl = widget.generator.control();


        header.setTitle(String.format(this.resource.LBL00064, this.resource.LBL10029))
               .add(ctrl.define("widget.search", "Search").hideButton().handler({
                   "click": this.onContentsSearch.bind(this),
                   "keydown": this.onContentsSearch.bind(this)
               }))
              .add("option", [
                            { id: "excel", label: this.resource.BTN00050 },
                            { id: "deleteall", label: this.resource.BTN00427 }], false);
    },


    onInitContents: function (contents, resource) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid(),
        decq = '9' + ecount.config.inventory.DEC_Q;
        var ctrl = widget.generator.control();

        // Defined grid portion
        grid
            //.setRowDataUrl("/Inventory/Basic/GetListBySearchPriceLevel")
            .setRowData(this.viewBag.InitDatas.Sale004G)
            .setKeyColumn(['CODE_CLASS'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                    { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: this.resource.LBL06426, width: '195' },
                    { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: this.resource.LBL06425, width: '469' },
                    { propertyName: 'CANCEL', id: 'CANCEL', title: this.resource.LBL35244, width: '79', align: 'center' }

            ])

            //.setCheckBoxUse(true)
            //.setCheckBoxMaxCount(100)
            //.setCheckBoxMaxCountExceeded(this.onItemCountMessage.bind(this))
            .setColumnSortable(true)
            .setColumnSortDisableList(['CANCEL'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))
            .setColumnFixHeader(true)
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCheckBoxRememberChecked(false)

            .setCustomRowCell('CODE_CLASS', this.setGridDataLink.bind(this))
            .setCustomRowCell('CANCEL', this.setGridToolTip.bind(this));
            //.setCheckBoxActiveRowStyle(true)

        contents.add(toolbar)
                .addGrid("dataGrid", grid);
    },


    //setting Footer option
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "new").label(this.resource.BTN00043));
        //toolbar.addLeft(ctrl.define("widget.button", "deleteSelected").label(this.resource.BTN00037));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
   * define common event listener
   ****************************************************************************************************/

    // A function that is called when clicking the search button
    onContentsSearch: function (e, value) {
        this.searchFormParameter.PARAM = value;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
        this.header.getControl("Search").setFocus(0);
        this.SearchValue = value;
    },

    //sort : callback function to perform the sort.
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // After the document is opening.
    onLoadComplete: function () {
        this._keyWord = "ESA_ESA013M" + this.viewBag.ComCode_L + ecount.user.WID + new Date()._tick();

        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        //grid.draw(this.searchFormParameter);
        // this control should to focus from ui screen load
        //this.header.getControl("Search").setFocus(0);

        //if ($.cookie('ESA013MNotice') == null) this.openNotice();

    },


    //openNotice: function () {

    //    var option = {};
    //    var self = this;
    //    ecount.popup.openWindow('/ECErp/Popup.Common/Notice', this.resource.LBL04021, {
    //        width: 600,
    //        height: 150,
    //        cookPath: "ESA013MNotice"
    //    }, false)
    //},


    // Message Handler for popup
    onMessageHandler: function (page, message) {
        this.setReload(this);
    },


    onDropdownDeleteall: function () {

        //if (this.permission.Value == "R") {
        //    //ecount.alert(viewBag.Resource.MSG00456)
        //    ecount.alert(viewBag.Resource.MSG00141)

        //    return false;
        //}
        //else if (this.permission.Value == "U") {
        //    //ecount.alert(viewBag.Resource.MSG00342)
        //    ecount.alert(viewBag.Resource.MSG00141)
        //    return false;
        //}

        if (this.permission.Value == "R" || this.permission.Value == "U") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06423, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: 480,
            height: 250,
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            isSendMsgAfterDelete: true,
            TABLES: 'SALE004_G',
            DEL_TYPE: 'Y',
            DELFLAG: 'Y',
            SAVENAME: '/ECERP/ESA/ESA013M',
            PARAM: this.searchFormParameter.PARAM
        };

       // ecount.popup.openWindow('/ECERP/Popup.Search/CM021P?TABLES=SALE004_G&DEL_TYPE=Y&DELFLAG=Y&SAVENAME=/ECERP/ESA/ESA013M&PARAM=' + this.searchFormParameter.PARAM, "DeleteAll", param, true);

        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: this.viewBag.Resource.LBL02484,
            param: param,
            popupType: false,
            additional: false,
        })
    },

    onDropdownExcel: function (e, data) {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            ecount.alert(this.viewBag.Resource.MSG00141)
            return false;
        }

        var iMaxCnt;
        iMaxCnt = this.contents.getGrid().getSettings().getPagingTotalRowCount();
        var param = {
            strSort: this.searchFormParameter.SORT_COLUMN,
            strSortAd: this.searchFormParameter.SORT_TYPE,
            strParam: this.searchFormParameter.PARAM,
            hidSessionKey: this._keyWord,
            fpopupID: this.ecPageID // 추가
        };

        var options = {
            type: "ExcelDic",
            keyword: this._keyWord,
            iMaxCnt: this.contents.getGrid().getSettings().getPagingTotalRowCount(),
            verisionCheck: true
        };
        //ecount.infra.convertExcel("/ECMAIN/ESA/ESA013E.aspx", "ExcelDic", this._keyWord, param, iMaxCnt);


        ecount.infra.convertExcel("/ECMAIN/ESA/ESA013E.aspx", param, options);
    },


    /****************************************************************************************************
     * define grid event listener
     ****************************************************************************************************/
    onGridInit: function (e, data) {
        // this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data) {
        //  this._super.onGridInit.apply(this, arguments);
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListBySearchPriceLevel");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
        if (!e.unfocus) {
            this.header.getControl("Search").onFocus(0);
        }
    },


    /**************************************************************************************************** 
        * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
        * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
        ****************************************************************************************************/
    onFooterNew: function (cid) {
        //if (this.permission.Value == "R") {
        //    //ecount.alert(viewBag.Resource.MSG00456);
        //    ecount.alert(viewBag.Resource.MSG00141);

        //    return false;
        //}

        if (this.permission.Value == "R") {
            //ecount.alert(viewBag.Resource.MSG00141);
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06423, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 165,
            editFlag: "I",
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID
        };
        //ecount.popup.openWindow('/ECERP/ESA/ESA014M', String.format(this.resource.LBL09999, this.resource.LBL06423), param, false);

        this.openWindow({
            url: '/ECERP/ESA/ESA014M',
            name: String.format(this.resource.LBL09999, this.resource.LBL10029),
            param: param,
            popupType: false,
            additional: false
        })
    },

    /**************************************************************************************************** 
     *  define hotkey event listener
     ****************************************************************************************************/
    ON_KEY_ENTER: function (e, target) {

    },

    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },

    /**************************************************************************************************** 
      * define user function 
     ****************************************************************************************************/

    setGridToolTip: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.CANCEL) ? 'No' : 'Yes';  // Logic to change the value
        //  option.dataType = '1';
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
        }
        return option;
    },

    setReload: function (e) {

        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //Grid row of one particular date
    setGridDataLink: function (value, rowItem) {

        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {

                console.log(data.rowItem);
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 165,
                    editFlag: "M",
                    cancel: data.rowItem['CANCEL'],
                    codeClass: data.rowItem['CODE_CLASS'],
                    classDes: data.rowItem['CLASS_DES'],
                    modify_dt: data.rowItem['WDATE'],
                    modify_id: data.rowItem['WID'],
                    parentPageID: this.pageID,
                    popupType: true,
                    responseID: this.callbackID
                };
                //ecount.popup.openWindow('/ECERP/ESA/ESA014M', String.format(this.resource.LBL06434, this.resource.LBL06423), param, false);

                this.openWindow({
                    url: '/ECERP/ESA/ESA014M',
                    name: String.format(this.resource.LBL06434, this.resource.LBL10029),
                    param: param,
                    popupType: false,
                    additional: false
                })

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    //Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },

    //Limited number of check checkbox
    onItemCountMessage: function (count) {
        ecount.alert(String.format(this.resource.MSG02158, count));
    }

})