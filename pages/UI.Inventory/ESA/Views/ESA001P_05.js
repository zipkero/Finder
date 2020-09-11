window.__define_resource && __define_resource("LBL00064","LBL02895","LBL12145","LBL02097","LBL02092","LBL00501","LBL06161","LBL35154","LBL35155","LBL05342","BTN00033","BTN00070","BTN00043","BTN00008","LBL04057","LBL01490","MSG00299","LBL06434","LBL12144","LBL12143");
/****************************************************************************************************
1. Create Date : 2015.05.04
2. Creator     : Bao
3. Description : Inv. I > Setup > PIC/Employee > Bank Account link 재고1 > 기초등록 > 거래처등록 > 통장등록 링크
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA001P_05", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CUST: this.custNo,
            PARAM: ''
            //PAGE_SIZE: 100,
            //PAGE_CURRENT: 0,
            //SORT_COLUMN: ' CUST_DES ',
            //SORT_TYPE: 'ASC'            
        };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        //header.setTitle(String.format(ecount.resource.LBL00064, ecount.resource.LBL02895))
        header.setTitle(ecount.resource.LBL12145)   //이체정보리스트
                .useQuickSearch()
                .notUsedBookmark();
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var grid = g.grid();
        
        // Initialize Grid
        grid
            .setRowData(this.viewBag.InitDatas.WhLoad)
            .setRowDataUrl("/Account/Basic/GetListByCUST")
            //.setKeyColumn(["CUST_DES", "TONGJANG_NUM"])
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardEnterForExecute(true)
            .setKeyboardPageMove(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'BANK_CD', id: 'BANK_CD', title: ecount.resource.LBL02097, width: '', isHideColumn: this.MENU_USEYN == 'Y' ? false : true },
                { propertyName: 'CUST_DES', id: 'CUST_DES', title: ecount.resource.LBL02092, width: '120' },
                { propertyName: 'TONGJANG_NUM', id: 'TONGJANG_NUM', title: ecount.resource.LBL00501, width: '' },
                { propertyName: 'ACCT_NAME', id: 'ACCT_NAME', title: ecount.resource.LBL06161, width: '' },
                { propertyName: 'ETC', id: 'ETC', title: ecount.resource.LBL35154, width: '' },
                { propertyName: 'CMSCODE', id: 'CMSCODE', title: ecount.resource.LBL35155, width: '' },
                { propertyName: 'IS_DEFAULT', id: 'IS_DEFAULT', title: ecount.resource.LBL05342, width: '', align: 'center' },
                { propertyName: 'DELETE', id: 'DELETE', title: ecount.resource.BTN00033, isHideColumn: this.pageName == 'EBQ003P_02' ? true : false, width: '100', align: 'center' },
                { propertyName: 'APPLY', id: 'APPLY', title: ecount.resource.BTN00070, isHideColumn: this.pageName == 'EBQ003P_02' ? false : true, width: '100', align: 'center' }
            ])
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setCustomRowCell('DELETE', this.setDeleteBankAccountLink.bind(this))
            .setCustomRowCell('APPLY', this.setApplyAccountLink.bind(this))
            .setCustomRowCell('CUST_DES', this.setSer_NoLink.bind(this))
            .setCustomRowCell('TONGJANG_NUM', this.setSer_NoLink.bind(this))
            .setCustomRowCell('IS_DEFAULT', this.setDefaultCheck.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // onHeaderQuickSearch
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // After the document loaded
    onLoadComplete: function () {
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        message.callback && message.callback();
        if (page.pageID == "ESA001P_06") {            
            this.setReload(this);
        }
    },


    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    setDeleteBankAccountLink: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource.BTN00033;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var permit = this.viewBag.Permission.Permit;

                var sMessage = '';
                if (this.pageName == 'EBA011M') {
                    sMessage = ecount.resource.LBL04057;
                }
                else if (this.pageName == 'ESA015M') {
                    sMessage = ecount.resource.LBL01490;
                }

                if (permit.Value == "R" || permit.Value == "U") {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: sMessage, PermissionMode: 'U' }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    return false;
                }

                var objthis = this;
                var data = {
                    CUST: data.rowItem['CUST'],
                    SER_NO: data.rowItem['SER_NO'],
                    pageName: this.pageName
                };

                ecount.confirm(ecount.resource.MSG00299, function (status) {
                    if (status === true) {
                        ecount.common.api({
                            url: "/Account/Basic/DeleteTongJang",
                            data: Object.toJSON(data),
                            success: function (result) {
                                if (result.Status != "200") {
                                    ecount.alert(result.fullErrorMsg);
                                }
                                else {
                                    objthis.setReload(objthis);
                                }
                            }
                        });
                    }
                });
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // setApplyAccountLink
    setApplyAccountLink: function (value, rowItem) {
        var self = this;

        var option = {};
        option.controlType = "widget.link";
        option.data = ecount.resource.BTN00070;

        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                //var param = {
                //    width: ecount.infra.getPageWidthFromConfig(true),
                //    height: 320,
                //    editFlag: 'M',
                //    custNo: this.custNo,
                //    pageName: this.pageName,
                //    ser_no: data.rowItem['SER_NO'],
                //    tongjang_num: data.rowItem['TONGJANG_NUM'],
                //    cust_des: data.rowItem['CUST_DES'],
                //    etc: data.rowItem['ETC'],
                //    cmscode: data.rowItem['CMSCODE'],
                //    write_id: data.rowItem['WRITE_ID'],
                //    wdate: data.rowItem['WDATE'],
                //    BANK_CD: data.rowItem['BANK_CD'],
                //    ACCT_NAME: data.rowItem['ACCT_NAME'],
                //    ACCT_NAME_TYPE: data.rowItem['ACCT_NAME_TYPE'],
                //    IS_DEFAULT: data.rowItem['IS_DEFAULT'],
                //};

                //// Open popup                
                //this.openWindow({
                //    url: '/ECERP/ESA/ESA001P_06',
                //    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL02895),
                //    popupType: false,
                //    additional: false,
                //    param: param
                //});
                
                var message = {
                    callback: self.close.bind(self)
                };
                
                if (self.pageName == 'EBQ003P_02') {
                    message.data = data.rowItem;
                    message.data.rowKey = self.INDEX;
                }
                self.sendMessage(self, message);

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    setSer_NoLink: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 320,
                    editFlag: 'M',
                    custNo: this.custNo,
                    pageName: this.pageName,
                    ser_no: data.rowItem['SER_NO'],
                    tongjang_num: data.rowItem['TONGJANG_NUM'],
                    cust_des: data.rowItem['CUST_DES'],
                    etc: data.rowItem['ETC'],
                    cmscode: data.rowItem['CMSCODE'],
                    write_id: data.rowItem['WRITE_ID'],
                    wdate: data.rowItem['WDATE'],
                    BANK_CD: data.rowItem['BANK_CD'],
                    ACCT_NAME: data.rowItem['ACCT_NAME'],
                    ACCT_NAME_TYPE: data.rowItem['ACCT_NAME_TYPE'],
                    IS_DEFAULT: data.rowItem['IS_DEFAULT'],
                };

                // Open popup                
                this.openWindow({
                    url: '/ECERP/ESA/ESA001P_06',
                    name: ecount.resource.LBL12144,
                    popupType: false,
                    additional: false,
                    param: param
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // setDefaultCheck
    setDefaultCheck: function (value, rowItem) {        
        var option = {};
        option.data = '';
        //value = 'Y';
        if (value == true) {
            option.controlType = "widget.faCheck";

            option.attrs = {
                'class': ['text-warning']
            };
        }
        return option;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // New button click event
    onFooterNew: function (e) {
        var permit = this.viewBag.Permission.Permit;
        if (permit.Value == "R") {
            var sMessage = '';
            if (this.pageName == 'EBA011M') {
                sMessage = ecount.resource.LBL04057;
            }
            else if (this.pageName == 'ESA015M') {
                sMessage = ecount.resource.LBL01490;
            }
            else {
                sMessage = '';
            }

            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: sMessage, PermissionMode: 'W' }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 320,
            editFlag: 'I',
            pageName: this.pageName,
            custNo: this.custNo,
            ser_no: 0
        };
        this.openWindow({
            url: '/ECERP/ESA/ESA001P_06',
            name: ecount.resource.LBL12143,
            popupType: false,
            additional: false,
            param: param
        });
    },

    onFooterClose: function (e) {
        var self = this;
        
        // 계좌이체요청일 경우
        if (this.pageName == 'EBQ003P_02') {
            var item = self.contents.getGrid().grid.getRowList();
            var data = {};
            //var dataFlag = false;

            item.forEach(function (o) {
                if (o.IS_DEFAULT) {
                    data = o;
                    dataFlag = true;
                }                
            });
            //if (!dataFlag) {
            //    data.BANK_CD = ''
            //    data.CUST_DES = '';
            //    data.ACCT_NAME = '';
            //    data.ACCT_NAME_TYPE = '';
            //    data.TONGJANG_NUM = '';
            //    data.IS_DEFAULT = '';
            //}
            var message = {
                callback: self.close.bind(self)
            };            
            message.data = data;
            message.data.rowKey = self.INDEX;
            
            self.sendMessage(self, message);
        }
        else 
            self.sendMessage(this, "CUST");
        self.close();
    },

    /********************************************************************** 
    *  hotkey [f1~12, Rudder etc.. ] 
    **********************************************************************/

    ON_KEY_ENTER: function (e, target) {

    },

    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },

    /**********************************************************************
    *  custom function 
    **********************************************************************/

    // Reload grid
    setReload: function (e) {        
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});