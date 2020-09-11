window.__define_resource && __define_resource("LBL00064","LBL10030","BTN00050","BTN00460","LBL06426","LBL06425","LBL35244","LBL06447","LBL07436","LBL00329","LBL02716","MSG00141","LBL06446","LBL06445","LBL00243","LBL08030","BTN00644","LBL02920","BTN00027","LBL00364","LBL07915");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level By Group
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA027M", {

    header: null,

    contents: null,

    footer: null,

    //ecConfig: ["config.inventory", "config.company", "config.user", "company", "user"],
    /**************************************************************************************************** 
     * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    strEFlag: null,
    strGroupCode: null,
    permit: null,
    iMaxCnt: 0,

    /********************************************************************** 
     * page init   Class inheritance , init, render etc
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { PARAM: this.Keyword, SORT_COLUMN: "", SORT_TYPE: "A" }; // Variable declaration in order to receive your query

        this.strGroupCode = $.isNull(this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG

        this.permit = this.viewBag.Permission.permitESA027M;

        console.log(ecount.config)

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
        header.setTitle(String.format(this.resource.LBL00064, this.resource.LBL10030))
        // Set options on the right
            .add(ctrl.define("widget.search", "Search").hideButton().handler({
                "click": this.onContentsSearch.bind(this),
                "keydown": this.onContentsSearch.bind(this)
            }))
              .add("option", [
                            { id: "excel", label: this.resource.BTN00050 },
                            { id: "SetGroupItem", label: this.resource.BTN00460 }], false)


    },


    onInitContents: function (contents, resource) {

        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid(),

        decq = '9' + ecount.config.inventory.DEC_Q;

        var ctrl = widget.generator.control();

        grid
            //.setRowDataUrl("/Inventory/Basic/GetListBySearchPriceLevel")   
            .setRowData(this.viewBag.InitDatas.ListPriceLevel)
            .setKeyColumn(['CODE_CLASS'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')

            .setColumns([
                    { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: this.resource.LBL06426, width: '' },
                    { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: this.resource.LBL06425, width: '' },
                    { propertyName: 'CANCEL', id: 'CANCEL', title: this.resource.LBL35244, width: '55', align: 'center' },
                    { propertyName: 'REG', id: 'REG', title: this.resource.LBL06447, width: '90', align: 'center' },
                    { propertyName: 'EXCEL', id: 'EXCEL', title: this.resource.LBL07436, width: '75', align: 'center' },
                    { propertyName: 'CUS_VEN', id: 'CUS_VEN', title: this.resource.LBL00329, width: '55', align: 'center' },
                    { propertyName: 'LOCATION', id: 'LOCATION', title: this.resource.LBL02716, width: '55', align: 'center' }

            ])
            .setColumnSortable(true) // Sort whether from the grid
            .setColumnSortDisableList(['CANCEL', 'REG', 'EXCEL', 'CUS_VEN', 'LOCATION'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))
            .setColumnFixHeader(true)
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setCustomRowCell('CANCEL', this.setGridToolTip.bind(this))
            .setCustomRowCell('REG', this.setGridReg.bind(this))
            .setCustomRowCell('EXCEL', this.setGridExcel.bind(this))
            .setCustomRowCell('CUS_VEN', this.setGridViewCusVen.bind(this))
            .setCustomRowCell('LOCATION', this.setGridViewLocation.bind(this))

        contents.add(toolbar)
                .addGrid("dataGrid", grid);
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


    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // After the document is opening.
    onLoadComplete: function () {

        this._keyWord = "ESA_ESA027M" + this.viewBag.ComCode_L + ecount.user.WID + new Date()._tick();
        
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        //grid.draw(this.searchFormParameter);
        // this control should to focus from ui screen load
        //this.header.getControl("Search").setFocus(0);
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
            this.strGroupCode = message;
            this.setReload(this);
    },

    onDropdownExcel: function (e, data) {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            ecount.alert(this.viewBag.Resource.MSG00141)
            return false;
        }

        var param = {
            strGroupCode: this.strGroupCode,
            strCodeClass: "",
            strEFlag: "",
            hidSessionKey: this._keyWord,
            fpopupID: this.ecPageID // 추가
        };

        ecount.common.api({
            url: "/Inventory/Basic/GetSale007EGA028ExcelCount",
            //async: false,
            data: JSON.stringify({ PARAM: "", ISCOUNT: "Y", COUNTLIMIT: null, CLASS_GUBUN: this.strGroupCode, CODE_CLASS: "", EXCEL_FLAG: 2 }),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    console.log(result)
                    if (result.Data.length>0) {
                    this.iMaxCnt = result.Data[0].MAXCNT;
                    }

                    console.log(this._keyWord)

                    var options = {
                        type: "ExcelDic",
                        keyword: this._keyWord,
                        iMaxCnt: this.iMaxCnt,
                        verisionCheck: true
                    };

                    ecount.infra.convertExcel("/ECMAIN/ESA/ESA027E.aspx", param, options);
                }
            }.bind(this)
        });

        //ecount.infra.convertExcel("/ECMAIN/ESA/ESA027E.aspx", param, options);
    },

    onDropdownSetGroupItem: function () {
        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 150,
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID
        };

      
            //ecount.popup.openWindow('/ECERP/ESA/ESA027P_01', this.resource.LBL06445, param, false);

            this.openWindow({
                url: '/ECERP/ESA/ESA027P_01',
                name: this.resource.LBL06445,
                param: param,
                popupType: false,
                additional: false
            })
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
    *  define hotkey event listener
    ****************************************************************************************************/

    //enter
    ON_KEY_ENTER: function (e, target) {

    },


    /**************************************************************************************************** 
       * define user function 
    ****************************************************************************************************/
    //setGridToolTip 
    setGridToolTip: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.CANCEL) ? this.viewBag.Resource.LBL00243 : this.viewBag.Resource.LBL08030;
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
        }
        return option;
    },


    // Reload
    setReload: function (e) {
        // Put logic to draw a grid search terms

        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //Reg Click
    setGridReg: function (value, rowItem) {
        var option = [];
        option.data = this.resource.BTN00644;
        option.controlType = "widget.link";
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            //'Class': 'text-Default text-uline',
            'data-html': true,
        }

        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                if (this.permit.Value == "R") {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "W" }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    return false;
                }
                var param = {
                    width: 800,
                    height: 500,
                    codeClass: data.rowItem['CODE_CLASS'],
                    classDes: data.rowItem['CLASS_DES'],
                    classGubun: this.strGroupCode,
                    parentPageID: this.pageID,
                    popupType: true,
                    responseID: this.callbackID
                };
               // ecount.popup.openWindow('/ECERP/ESA/ESA028M', this.resource.LBL02920, param, false);

                this.openWindow({
                    url: '/ECERP/ESA/ESA028M',
                    name: String.format(this.resource.LBL00064, this.resource.LBL10030),//this.resource.LBL02920,
                    param: param,
                    popupType: false,
                    additional: false
                })
            }.bind(this)
        }
        return option;
    },

    //Excel Click
    setGridExcel: function (value, rowItem) {
        var option = [];
        option.data = this.resource.BTN00050;
        option.controlType = "widget.link";
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            //'Class': 'text-success',
            'data-html': true,
        }

        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                if (!ecount.config.user.USE_EXCEL_CONVERT) {
                    ecount.alert(this.viewBag.Resource.MSG00141)
                    return false;
                }

                ecount.common.api({
                    url: "/Inventory/Basic/GetSale007EGA028ExcelCount",
                    //async: false,
                    data: JSON.stringify({ PARAM: "", ISCOUNT: "Y", COUNTLIMIT: null, CLASS_GUBUN: this.strGroupCode, CODE_CLASS: data.rowItem['CODE_CLASS'], EXCEL_FLAG: 1 }),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            this.iMaxCnt = result.Data[0].MAXCNT;

                            var param = {
                                strGroupCode: this.strGroupCode,
                                strCodeClass: data.rowItem['CODE_CLASS'],
                                strEFlag: "EC",
                                hidSessionKey: this._keyWord,
                                fpopupID: this.ecPageID // 추가
                            };

                            var options = {
                                type: "ExcelDic",
                                keyword: this._keyWord,
                                iMaxCnt: this.iMaxCnt,
                                verisionCheck: true
                            };

                            //console.log(options)
                            ecount.infra.convertExcel("/ECMAIN/ESA/ESA027E.aspx", param, options);
                        }
                    }.bind(this)
                });

                // ecount.infra.convertExcel("/ECMAIN/ESA/ESA027E.aspx", param, options);
            }.bind(this)
        }
        return option;
    },

    //View CustomerVendor Click
    setGridViewCusVen: function (value, rowItem) {
        var option = [];
        option.data = this.resource.BTN00027;
        option.controlType = "widget.link";
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            //'Class': 'text-muted',
            'data-html': true,
        }

        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var param = {
                    width: 400,
                    height: 550,
                    codeClass: data.rowItem['CODE_CLASS'],
                    parentPageID: this.pageID,
                    popupType: true,
                    responseID: this.callbackID
                };
                console.log(param)
                //ecount.popup.openWindow('/ECERP/ESA/ESA014P_04', this.resource.LBL00364, param, false);

                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_04',
                    name: this.resource.LBL00364,
                    param: param,
                    popupType: false,
                    additional: false
                })
            }.bind(this)
        }
        return option;
    },

    //View Location Click
    setGridViewLocation: function (value, rowItem) {
        var option = [];
        option.data = this.resource.BTN00027;

        option.controlType = "widget.link";
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            //'Class': 'text-muted',
            'data-html': true,
        }

        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var param = {
                    width: 400,
                    height: 550,
                    codeClass: data.rowItem['CODE_CLASS'],
                    parentPageID: this.pageID,
                    popupType: true,
                    responseID: this.callbackID
                };
                console.log(param)
                //ecount.popup.openWindow('/ECERP/ESA/ESA014P_09', this.resource.LBL07915, param, false);
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_09',
                    name: this.resource.LBL07915,
                    param: param,
                    popupType: false,
                    additional: false
                })
            }.bind(this)
        }
        return option;
    },


    //Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },
})