window.__define_resource && __define_resource("LBL00064","LBL10030","LBL93299","BTN00028","BTN00427","LBL06448","LBL03209","LBL00754","LBL06449","LBL01451","LBL06431","BTN00043","BTN00042","BTN00008","LBL06446","LBL02484","LBL06445","LBL02920","BTN00373","LBL07157","LBL02238","LBL02813","LBL01249","LBL02513","LBL02512","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","BTN00027","LBL08030","LBL00243");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level By Group >> Reg
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA028M", {

    header: null,

    contents: null,

    footer: null,

    permit: null,

    off_key_esc: true,
    /**************************************************************************************************** 
     * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    Price2: null,
    strPriceGubun: null,
    strPriceRise: null,
    iPriceRate: null,
    strPriceLess: null,
    strWID: null,
    strWDATE: null,
    RowCount: null,
    editFlag: "I",


    /********************************************************************** 
    * page init   Class inheritance , init, render etc
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { PARAM: "", CODE_CLASS: this.codeClass, CLASS_GUBUN: this.classGubun, EXCEL_FLAG: 0 }; // Variable declaration in order to receive your query
        //console.log(this.searchFormParameter)

        this.permit = this.viewBag.Permission.permitESA028M;
        
        this.Price2 = this.viewBag.InitDatas.GetSale007EGA028Sub;

        //console.log(this.Price2);

        //console.log(this.permit)

    },


    render: function () {
        this._super.render.apply(this);
    },


    /********************************************************************************************************
        * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        header.setTitle(String.format(this.resource.LBL00064, this.resource.LBL10030))//this.resource.LBL93299
              .notUsedBookmark()
        // Set options on the right
             .add(ctrl.define("widget.search", "Search").hideButton().handler({
                 "click": this.onContentsSearch.bind(this),
                 "keydown": this.onContentsSearch.bind(this)
             }))
           .add("option", [
                            { id: "Copy", label: this.resource.BTN00028 },
                            { id: "DeleteAll", label: this.resource.BTN00427 }], false)
    },


    onInitContents: function (contents, resource) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid(),
        decq = '9' + ecount.config.inventory.DEC_Q;
        var ctrl = widget.generator.control();

        grid
            //.setRowDataUrl("/Inventory/Basic/GetSale007EGA028")  
            .setRowData(this.viewBag.InitDatas.GetListSale007)
            .setKeyColumn(['CLASS_CD'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                    { propertyName: 'GROUP_CD', id: 'GROUP_CD', title: this.resource.LBL06448, width: '104', align: 'center' },
                    { propertyName: 'CLASS_CD', id: 'CLASS_CD', title: this.resource.LBL03209, width: '104', align: 'left' },
                    { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: this.resource.LBL00754, width: '104', align: 'left' },
                    { propertyName: 'PRICE_GUBUN', id: 'PRICE_GUBUN', title: this.resource.LBL06449, width: '', align: 'center' },
                    { propertyName: 'USE_YN', id: 'USE_YN', title: this.resource.LBL01451, width: '74', align: 'center' },
                    { propertyName: 'APPLIED_PRICE', id: 'APPLIED_PRICE', title: this.resource.LBL06431, width: '74', align: 'center' },

            ])
            .setColumnSortable(false)

            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumnFixHeader(true)
            .setCustomRowCell('GROUP_CD', this.setGridItemGroupName.bind(this))
            .setCustomRowCell('APPLIED_PRICE', this.setGridViewAppliedPrice.bind(this))
            .setCustomRowCell('PRICE_GUBUN', this.setGridAdjustmentContent.bind(this))

            .setCustomRowCell('USE_YN', this.setGridActive.bind(this))

        contents.add(toolbar)
                .addGrid("dataGrid", grid);
    },


    //setting Footer option
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(this.resource.BTN00043));//new
        toolbar.addLeft(ctrl.define("widget.button", "Modify").label(this.resource.BTN00042).css("btn btn-primary"));//Modify
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(this.resource.BTN00008));
        toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
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
    },

    // After the document is opening.
    onLoadComplete: function () {
        var thisobj = this;

        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        //grid.draw(this.searchFormParameter);
        // this control should to focus from ui screen load
        //this.header.getControl("Search").setFocus(0);

    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        //this.searchFormParameter.PARAM = this.header.getControl('Search').getValue();
        this.setReload(this);
        //console.log(page.controlID);  //추가되었습니다.(코드 컨트롤에서 호출될 때만 추가)
    },



    onDropdownDeleteAll: function () {

        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: 480,
            height: 250,
            TABLES: 'SALE007',
            DEL_TYPE: 'Y',
            DELFLAG: 'Y',
            //SAVENAME: '',
            SEARCHXML: '',
            SEARCHTEXT: '',
            parentPageID: this.pageID,
            responseID: this.callbackID,
            isSendMsgAfterDelete: true,
            CODE_CLASS: this.codeClass,
            SAVENAME: '/ECERP/ESA/ESA028M'
        };

        //ecount.popup.openWindow('/ECERP/Popup.Search/CM021P?TABLES=SALE007&DEL_TYPE=Y&DELFLAG=Y&CODE_CLASS=' + this.codeClass + '&SAVENAME=/ECERP/ESA/ESA028M', "CM021P", param, true);

        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: this.viewBag.Resource.LBL02484,
            param: param,
            popupType: false,
            additional: false,
        })

    },

    setRowBackgroundColor: function (data) {
        if (data['USE_YN'] == "N")
            return true;
    },

    onDropdownCopy: function () {
        if (this.permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 165,
            codeClass: this.codeClass,
            classDes: this.classDes,
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID
        }
        //ecount.popup.openWindow('/ECERP/ESA/ESA028P_02', this.resource.LBL06445, param, true);

        this.openWindow({
            url: '/ECERP/ESA/ESA028P_02',
            name: this.resource.LBL06445,
            param: param,
            popupType: false,
            additional: false,
        })
    },


    /**************************************************************************************************** 
        * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
        * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onFooterNew: function () {
        if (this.permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: 800,
            height: 500,
            Class_Des: this.classDes,
            Code_Class: this.codeClass,
            hidGroupCode: this.classGubun,
            HidNewFramework: 'Y',
            parentPageID: this.parentPageID,
            popupType: true,
            responseID: this.callbackID,
            popupID: this.popupID,
            popupLevel: this.popupLevel,
            fpopupID: this.ecPageID // 추가
        }
        //ecount.popup.openWindow('/ECMain/ESA/ESA029M.aspx', this.resource.LBL02920, param, false);

        this.onAllSubmit("/ECMain/ESA/ESA029M.aspx", param, "all");

        //this.openWindow({
        //    url: '/ECMain/ESA/ESA029M.aspx',
        //    name: this.resource.LBL02920,
        //    param: param,
        //    popupType: false,
        //    additional: false
        //})
    },

    onFooterModify: function () {
        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: 800,
            height: 500,
            Class_Des: this.classDes,
            Code_Class: this.codeClass,
            hidGroupCode: this.classGubun,
            HidNewFramework: 'Y',
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            popupID: this.popupID,
            popupLevel: this.popupLevel,
            fpopupID: this.ecPageID // 추가
        }

        //ecount.popup.openWindow('/ECMain/ESA/ESA030M.aspx', this.resource.LBL02920, param, false);

        this.onAllSubmit("/ECMain/ESA/ESA030M.aspx", param, "all");

        //this.openWindow({
        //    url: '/ECMain/ESA/ESA030M.aspx',
        //    name: this.resource.LBL02920,
        //    param: param,
        //    popupType: false,
        //    additional: false
        //})
    },

    //Close
    onFooterClose: function () {
        this.popupType = "layer"
        parent.ecount.popup.destroy(this.popupID, "1");
    },

    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.strWDATE,
            lastEditId: this.strWID,
            parentPageID: this.pageID,  //(Pop-up when this must be declared part)
            popupType: true,             //(Pop-up when this must be declared part)
            responseID: this.callbackID  //(Pop-up when this must be declared part)
        }
        //ecount.popup.openWindow('/ECERP/Popup.Search/CM100P_31', this.resource.BTN00373, param, true);

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: this.resource.LBL07157,
            param: param,
            popupType: false
            
        })
    },

    /****************************************************************************************************
      * define grid event listener
    ****************************************************************************************************/
    onGridInit: function (e, data) {
        // this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data) {
        var thisobj = this
        this.RowCount = data.dataCount;

        if (this.RowCount == 0) {
            this.footer.getControl("Modify").hide();
            this.footer.getControl("history").hide();
        }
        else {
            this.editFlag = "M";
            this.footer.getControl("New").hide();
            this.strWID = data.dataRows[0].WID;
            this.strWDATE = data.dataRows[0].WDATE;
        }

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetSale007EGA028");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
        if (!e.unfocus) {
            this.header.getControl("Search").onFocus(0);
        }
    },


    /**************************************************************************************************** 
     *  define hotkey event listener
    ****************************************************************************************************/

    //enter
    ON_KEY_ENTER: function (e, target) {

    },

    ON_KEY_F2: function (e, target) {
        console.log(this.editFlag);
        if (this.editFlag == "I") {
            this.onFooterNew();
        }
    },



    /**************************************************************************************************** 
      * define user function 
    ****************************************************************************************************/
    //setGridToolTip 
    setGridItemGroupName: function (value, rowItem) {
        var option = {};
        if (rowItem.GROUP_CD == null) {
            option.data = this.viewBag.Resource.LBL03209
        }
        else {
            option.data = this.viewBag.Resource.LBL03209 + " " + rowItem.GROUP_CD
        }
        return option;
    },

    setGridAdjustmentContent: function (value, rowItem) {
        var option = {};

        //set strPriceGubun Value
        if (rowItem.PRICE_GUBUN == "I") { this.strPriceGubun = this.viewBag.Resource.LBL02238 }
        else if (rowItem.PRICE_GUBUN == "O") { this.strPriceGubun = this.viewBag.Resource.LBL02813 }
        else if (rowItem.PRICE_GUBUN == "A") { this.strPriceGubun = this.Price2[0].PRICE_1 }
        else if (rowItem.PRICE_GUBUN == "B") { this.strPriceGubun = this.Price2[0].PRICE_2 }
        else if (rowItem.PRICE_GUBUN == "C") { this.strPriceGubun = this.Price2[0].PRICE_3 }
        else if (rowItem.PRICE_GUBUN == "D") { this.strPriceGubun = this.Price2[0].PRICE_4 }
        else if (rowItem.PRICE_GUBUN == "E") { this.strPriceGubun = this.Price2[0].PRICE_5 }
        else if (rowItem.PRICE_GUBUN == "F") { this.strPriceGubun = this.Price2[0].PRICE_6 }
        else if (rowItem.PRICE_GUBUN == "G") { this.strPriceGubun = this.Price2[0].PRICE_7 }
        else if (rowItem.PRICE_GUBUN == "H") { this.strPriceGubun = this.Price2[0].PRICE_8 }
        else if (rowItem.PRICE_GUBUN == "9") { this.strPriceGubun = this.Price2[0].PRICE_9 }
        else if (rowItem.PRICE_GUBUN == "J") { this.strPriceGubun = this.Price2[0].PRICE_10 }

        //Set strPriceRise value
        if (rowItem.PRICE_RISE == "R") { this.strPriceRise = this.viewBag.Resource.LBL01249 }
        else if (rowItem.PRICE_RISE == "C") { this.strPriceRise = this.viewBag.Resource.LBL02513 }
        else if (rowItem.PRICE_RISE == "F") { this.strPriceRise = this.viewBag.Resource.LBL02512 }

        this.iPriceRate = Math.floor(Number(rowItem.PRICE_RATE) * Number(Math.pow(10, 4))) / Number(Math.pow(10, 4));
        //this.iPriceRate = Math.floor(Number(rowItem.PRICE_RATE));

        if (rowItem.PRICE_LESS == "1000000.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00097;
        if (rowItem.PRICE_LESS == "100000.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00096;
        if (rowItem.PRICE_LESS == "10000.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00095;
        if (rowItem.PRICE_LESS == "1000.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00094;
        if (rowItem.PRICE_LESS == "100.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00093;
        if (rowItem.PRICE_LESS == "10.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00084;
        if (rowItem.PRICE_LESS == "1.0000000000") this.strPriceLess = this.viewBag.Resource.LBL00085;
        if (rowItem.PRICE_LESS == "0.1000000000") this.strPriceLess = this.viewBag.Resource.LBL00086;
        if (rowItem.PRICE_LESS == "0.0100000000") this.strPriceLess = this.viewBag.Resource.LBL00087;
        if (rowItem.PRICE_LESS == "0.0010000000") this.strPriceLess = this.viewBag.Resource.LBL00088;
        option.data = this.strPriceGubun + '/' + this.iPriceRate + '/' + this.strPriceLess + '/' + this.strPriceRise
        return option;
    },

    setGridViewAppliedPrice: function (value, rowItem) {
        var option = [];
        option.data = this.resource.BTN00027;
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var param = {
                    width: 750,
                    height: 400,

                    class_cd: data.rowItem['CLASS_CD'],
                    code_class: this.codeClass,
                    group_cd: data.rowItem['GROUP_CD'] == null ? '' : data.rowItem['GROUP_CD'],
                };                      

                this.openWindow({
                    url: '/ECERP/ESA/ESA028P_01',
                    name: this.resource.LBL06431,
                    param: param,
                    parentPageID: this.pageID,
                    responseID: this.callbackID,
                    popupType: false,
                    additional: false
                });
            }.bind(this)
        }
        return option;
    },

    setGridActive: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.USE_YN) ? this.viewBag.Resource.LBL08030 : this.viewBag.Resource.LBL00243;  // Logic to change the value
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
        }
        return option;
    },
    // Reload
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },


})