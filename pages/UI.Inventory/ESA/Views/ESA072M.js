window.__define_resource && __define_resource("BTN00863","BTN00113","BTN00007","LBL10029","LBL35213","LBL02475","LBL01448","BTN00204","LBL10548","LBL35526","BTN00330","LBL10271","LBL03311","LBL09022","LBL06431","BTN00043","BTN00050","BTN00959","BTN00033","BTN00203","LBL02985","LBL06434","BTN00027","LBL00364","LBL07915","LBL93296","LBL09999","MSG00141","LBL07436","MSG00524","LBL03176","LBL05292","MSG00722","MSG00299","LBL06423","MSG00213");
/****************************************************************************************************
1. Create Date : 2015.09.25
2. Creator     : 이일용
3. Description : 제고1 > 기초등록 > 특별단가등록 
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) add function scroll top for page, modify onMessageHandler function
                 2018.09.20(Chung Thanh Phuoc) Add link navigation Item Code/Item Name  of Price Level Registration
                 2018.10.16 (PhiTa) Apply disable sort when data search > 1000
                 2018.11.01 (PhiTa) Remove Apply disable sort > 1000
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.12.20 (김봉기) : 데이터백업 관련 파라미터 추가
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA072M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    currentTabId: null,
    userPermit: '',     // Page permission    
    isShowSearchBtn: true,
    isShowOptionBtn: true,
    formSearchControlType: 'SN030', // 검색컨트롤폼타입
    formTypeCode: 'SR030',
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
    formListTypeCode: 'SR985',                                      // 리스트폼타입
    formListInfoData: null,                                         // 리스트 양식정보
    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.formListInfoData = this.viewBag.FormInfos[this.formListTypeCode];

        this.searchFormParameter = {
            QUICK_SEARCH: '',   //퀵서치

            // SORT, PAGING
            //PAGE_SIZE: 100, //viewBag.InitDatas.DefaultPageSize,
            PAGE_SIZE: this.formListInfoData.option.pageSize,
            PAGE_CURRENT: 1,
            SORT_COLUMN: 'CODE_CLASS',
            SORT_TYPE: 'A',

            // 검색조건
            CODE_CLASS: '',             // 특별단가
            USE_YN: 'N',              // 사용중, 사용중지 여부
            FORM_TYPE: this.formListTypeCode,
            FORM_SER: '1',
            INI_COM_CODE: this.viewBag.InitDatas.IniComCode,
            BASE_DATE_CHK: '',
            EXCEL_FLAG: 'N'
        };
        this.userPermit = this.viewBag.Permission.Permit.Value;

        if (this.isShowSearchForm == null) {   // 데이터관리에서 넘어 온경우 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "2";
        }
    },
    render: function () {
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/
    // Header Initialization
    onInitHeader: function (header, resource) {
        var self = this;
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            form = g.form(),
            grid = g.grid(),
            ctrl = g.control();

        //Header search content
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 
            toolbar
                .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            switch (this.viewBag.DefaultOption.ManagementType) {
                case "BA": // BA:Excel, UF:자료올리기형태, ZI:백업, AT:첨부파일, SD:조건삭제
                    toolbar.addLeft(ctrl.define("widget.button", "excelDownload").css("btn btn-sm btn-primary").label(ecount.resource.BTN00863));
                    break;
            }
        }
        else {
            toolbar
                .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113))
                .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));
        }

        form
            .add(ctrl.define("widget.multiCode.priceGroup", "txtPriceLevel", "CODE_CLASS", ecount.resource.LBL10029).maxSelectCount(100).end())   // 특별단가
            .add(ctrl.define("widget.checkbox.prodType", "USE_YN", "USE_YN", ecount.resource.LBL35213).label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value(['', 'N', 'Y']).select('N').end())
            .add(ctrl.define("widget.checkbox", "BASE_DATE_CHK", "BASE_DATE_CHK", ecount.resource.LBL10548).label([ecount.resource.LBL10548]).end())
            .setOptions({ showFormLayer: (["1", "4"].contains(this.isShowSearchForm || "")) ? true : false  /* 검색 창 접기*/ }); // 데이터 백업관련 추가
            
        contents
            .add(form)
            .add(toolbar);

        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 
            header.setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
                .notUsedBookmark()
                .useQuickSearch(false)
                .addContents(contents);
        }
        else {
            header
                .setTitle(ecount.resource.LBL35526)
                .useQuickSearch(true)
                .add("search", null, false)
                .addContents(contents)
            ;

            // Dropdown buttons
            var dropdownButtons = [];
            dropdownButtons.push({
                id: "ListSettings", label: ecount.resource.BTN00330
            });
            header.add("option", dropdownButtons);
        }        
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            tabContents = g.tabContents(),
            grid = g.grid();
        tabContents
            .onSingleMode()
            .createActiveTab("tabESA072M", ecount.resource.LBL10029, null, true, "left") //LBL10271
            .createTab("tabESA070M", ecount.resource.LBL03311, null, false, "left")
            .createTab("tabESA071M", ecount.resource.LBL09022, null, false, "left")
            .createTab("tabESA073M", ecount.resource.LBL06431, null, false, "left")   // 적용단가
            .addGrid("dataGrid", grid);
        contents.add(tabContents);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control()
            ;
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00050));
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }        
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function (e) {
        this._keyWord = "ESA072M" + this.COM_CODE + ecount.user.WID + new Date()._tick();
        this.currentTabId = this.contents.currentTabId;        

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch(true);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;

        if (control.id == "PROD_CD") {
            config.width = 430;
            config.height = 645;
            config.isCheckBoxDisplayFlag = false;
            config.name = ecount.resource.LBL02985;
        } else if (control.id == "CODE_CLASS") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isCheckBoxDisplayFlag = true;
            config.isApplyDisplayFlag = true;
        }
        // 특별 단가
        else if (control.id == "txtPriceLevel") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isApplyDisplayFlag = true;       // apply 
            config.isCheckBoxDisplayFlag = true;    // checkbox
            config.isIncludeInactive = true;
        }
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA014M') {
            //this.dataSearch();
            this._ON_REDRAW();
        }
        // 특별단가
        else if (page.pageID == 'CM020P') {
            this.searchFormParameter.CODE_CLASS = message.data.CODE_CLASS;
        } else if (page.pageID == 'CM100P_02') {
            this.reloadPage();
        }
        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.searchFormParameter.QUICK_SEARCH = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().grid.removeShadedColumn();
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    // Search button click event
    onContentsSearch: function (e, value) {
        this.header.getQuickSearchControl().setValue("");
        this.searchFormParameter.QUICK_SEARCH = '';

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    // 다시작성 
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },
    onHeaderSearch: function (forceHide) {
        var self = this;
        this.header.getQuickSearchControl().setValue("");
        this.searchFormParameter.QUICK_SEARCH = '';

        if (self.dataSearch(true)) {
            this.onHeaderClose(forceHide);
        }
    },
    onHeaderClose: function () {
        this.header.toggle(true);
    },
    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.searchFormParameter.BASE_DATE_CHK = "";
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    // Change Tab
    onChangeContentsTab: function (event) {
        this.currentTabId = event.tabId;
        var urlParam = "";
        switch (this.currentTabId) {
            case "tabESA070M":
                if (this.popupID && this.popupType == "layer")
                    this.onReload("/ECERP/ESA/ESA070M");
                else
                    this.onMovePage(ecount.common.buildSessionUrl("/ECERP/ESA/ESA070M") + urlParam);
                break;
            case "tabESA071M":
                if (this.popupID && this.popupType == "layer")
                    this.onReload("/ECERP/ESA/ESA071M");
                else
                    this.onMovePage(ecount.common.buildSessionUrl("/ECERP/ESA/ESA071M") + urlParam);
                break;
            case "tabESA072M":
                if (this.popupID && this.popupType == "layer")
                    this.onReload("/ECERP/ESA/ESA072M");
                else
                    this.onMovePage(ecount.common.buildSessionUrl("/ECERP/ESA/ESA072M") + urlParam);
                break;
            case "tabESA073M":
                if (this.popupID && this.popupType == "layer")
                    this.onReload("/ECERP/ESA/ESA073M");
                else
                    this.onMovePage(ecount.common.buildSessionUrl("/ECERP/ESA/ESA073M") + urlParam);
                break;
        }
        return true;
    },

    onDropdownListSettings: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formListTypeCode,
            isSaveAfterClose: true, // Save and close
            FORM_SEQ: 1
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    dataSearch: function (initFlag) {
        var thisObj = this;
        var decP = "9" + ecount.config.inventory.DEC_P;
        var settings = widget.generator.grid(),
            gridObj = this.contents.getGrid("dataGrid");

        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            return false;
        }

        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        searchParam.PAGE_CURRENT = 1;
        this.searchFormParameter.PAGE_SIZE = this.formListInfoData.option.pageSize;
        this.searchFormParameter = searchParam;
        this.searchFormParameter.BASE_DATE_CHK = (this.searchFormParameter.BASE_DATE_CHK != null && this.searchFormParameter.BASE_DATE_CHK != undefined && this.searchFormParameter.BASE_DATE_CHK.length > 0) ? "1" : "0";
        // Initialize Grid
        settings
            .setRowDataUrl('/Inventory/Basic/GetListPriceLevelGroupByItem')
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formListTypeCode, FormSeq: 1 })
            .setKeyColumn(["PROD_CD", "CODE_CLASS"])

            .setColumnFixHeader(true)
            .setHeaderTopMargin(this.header.height())
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formListInfoData.option.pageSize, true) //viewBag.InitDatas.DefaultPageSize
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['CUSTOMER_VENDOR', 'LOCATION']) //'CODE_CLASS', 'CLASS_DES',
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // CheckBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(true)

            // Custom cells
            .setCustomRowCell("CODE_CLASS", this.setItemCodeLink.bind(this))
            .setCustomRowCell("CLASS_DES", this.setItemCodeLink.bind(this))
            .setCustomRowCell("CUSTOMER_VENDOR", this.setCustomerVendorLink.bind(this))
            .setCustomRowCell("LOCATION", this.setLocationLink.bind(this))
            .setEventShadedColumnId(['CODE_CLASS'], { useIntegration: true, isAllRememberShaded: true })
            ;

        this.finalSearchParam = searchParam;
        this.finalHeaderSearch = this.header.extract("all").merge();  // 조회 당시 컨트롤 정보        
        this.gridSettings = settings;
        gridObj.grid.settings(settings);
        gridObj.grid.removeShadedColumn();
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            gridObj.draw(this.searchFormParameter);
        }        

        return true;
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    // OnInitContents 후에 실행(맨처음 로딩 될때 한번만 실행됨)
    onGridRenderBefore: function (gridId, settings) {
        var self = this;
        this.setGridParameter(settings);
        settings.setPagingIndexChanging(function (e, data) {
            self.header.getQuickSearchControl().setValue(self.finalSearchParam.PARAM);
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
            self.contents.getGrid("dataGrid").grid.render();
        });
    },
    // After grid rendered
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.QUICK_SEARCH);
            control.setFocus(0);
        }
    },
    //Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },
    // Set [Item Code] column link
    setItemCodeLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 230,
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
                this.openWindow({
                    url: '/ECERP/ESA/ESA014M',
                    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL10029),
                    param: param,
                    popupType: false,
                    additional: false
                })

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    // Set [Customer/Vendor] link for Price Level
    setCustomerVendorLink: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.data = ecount.resource.BTN00027;
        option.attrs = { 'class': ['text-Default'] };
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 400,
                    heigth: 500,
                    codeClass: data.rowItem['CODE_CLASS'],
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_04',
                    name: ecount.resource.LBL00364,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Set [Location] link for Price Level
    setLocationLink: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.link";
        option.data = ecount.resource.BTN00027;
        option.attrs = { 'class': ['text-Default'] };
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 400,
                    heigth: 500,
                    codeClass: data.rowItem['CODE_CLASS'],
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_09',
                    name: ecount.resource.LBL07915,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    reloadPage: function () {
        var self = this;

        this.onAllSubmitSelf({
            url: "/ECERP/ESA/ESA072M",
            PARAM: this.searchFormParameter.PARAM
        });
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // New button clicked event
    onFooterNew: function (cid) {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 230,
            editFlag: "I",
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA014M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL10029),
            param: param,
            popupType: false,
            additional: false
        })
    },
    onFooterExcel: function () {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        var iMaxCnt;
        iMaxCnt = this.contents.getGrid().getSettings().getPagingTotalRowCount();

        var grid = this.contents.getGrid().grid;
        if (grid.getRowCount() > 0) {
            if (grid.getRowList()[0].MAXCNT > 30000) {
                ecount.alert(String.format(ecount.resource.MSG00524, "30000"));
                return false;
            }
        }

        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        searchParam.hidSessionKey = this._keyWord;
        searchParam.PAGE_SIZE = 30000;
        searchParam.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        searchParam.EXCEL_FLAG = "Y";
        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListPriceLevelGroupByItemForExcel",
            param: searchParam
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Delete All button clicked event
    onButtonSelectedDelete: function () {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var Data = [];
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);

        $.each(grid.getCheckedObject(), function (i, item) {
            var param = {
                CODE_CLASS: item['CODE_CLASS']
            };
            Data.push(param);
        });

        if (Data.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            btnDelete.setAllowClick();
            return false;
        }
        var param = {
            Request: { Data }
        };

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeleteBatchPriceLevelForGroup",
                    data: Object.toJSON(param),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.dataSearch();
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
    onHeaderSimpleSearch: function (e) {
        this.onHeaderSearch(e);
    },
    // Close button clicked event
    onFooterClose: function () {
        this.close();
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        // 페이징 파라미터 세팅gridObj.draw(this.searchFormParameter);
        _self.searchFormParameter.PAGE_SIZE = 10000;
        _self.searchFormParameter.PAGE_CURRENT = 1;
        _self.searchFormParameter.LIMIT_COUNT = 100000;
        _self.searchFormParameter.EXCEL_FLAG = "N";
        _self.searchFormParameter.IS_FROM_BACKUP = true;

        _self.dataSearch(true);
        _self.showProgressbar();
        
        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            _self.hideProgressbar();
            return false;
        }

        ecount.common.api({
            url: "/ECAPI/SVC/SelfCustomize/DataManagement/DataBackupRequest",

            data: Object.toJSON({
                BackupObj: _obj,
                KEY: _obj.KEY + "|" + _self.viewBag.DefaultOption.ManagementType,
                pageSessionKey: _self.viewBag.DefaultOption.SessionKey,
                ManagementType: _self.viewBag.DefaultOption.ManagementType,
                PARAM: _self.searchFormParameter
            }),

            success: function (result) {
                _self.hideProgressbar();
                _self.close();
            },
            error: function (result) {
                _self.footer.getControl("excelDownload") && _self.footer.getControl("excelDownload").setAllowClick();
            }
            .bind(_self)
        });
    },
    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/
    // F2
    ON_KEY_F2: function (e, target) {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onFooterNew();
        }
    },
    // F8
    ON_KEY_F8: function (e, target) {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch(true);
        }
    },
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (e.target != null && e.target.name == "DEL_GUBUN" && !this.viewBag.DefaultOption.ManagementType) {
            this.header.getControl("search").setFocus(0);
        }
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        var _gridObj = this.contents.getGrid("dataGrid");
        if (_gridObj) {
            _gridObj.grid.clearChecked()
            _gridObj.draw(this.searchFormParameter);
        }
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnPriceLvGroup(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnPriceLvGroup(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var Data = [];

        $.each(selectItem, function (i, data) {
            Data.push({
                CODE_CLASS: data.CODE_CLASS,
                CANCEL: cancelYN,
            });
        });

        return Data;
    },

    // (activate or deactivate the customer)
    updateActiveYnPriceLvGroup: function (Data) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06423, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }

        var param = {
            Request: { Data }
        };
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateListStatePriceLevel",
            data: Object.toJSON(param),
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