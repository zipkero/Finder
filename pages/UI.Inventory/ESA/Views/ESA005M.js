window.__define_resource && __define_resource("BTN00863","BTN00113","BTN00007","LBL02721","BTN00427","BTN00330","BTN00493","BTN00176","LBL02475","LBL07968","LBL00562","LBL01970","LBL06247","LBL05716","MSG04553","LBL07879","BTN00204","LBL10548","MSG02158","BTN00043","BTN00265","BTN00959","BTN00033","BTN00203","BTN00079","LBL10109","LBL06434","LBL07275","LBL93292","LBL09999","MSG00141","LBL07309","MSG00213","MSG00299","LBL03176","LBL02718","LBL00043","LBL10991","LBL11065","LBL00243","LBL08030","LBL08396");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator     : Nguyen Anh Tuong
3. Description : Groupcode popup page with edit,list,modify data
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) Modify shaded grid option , set scroll top for page. 
                 2018.06.25(Hoang.Linh) Add tab general and tab all and search template
                 2018.09.20(Chung Thanh Phuoc) Add link navigation Location Name of menu Location
                 2018.10.16 (PhiTa) Apply disable sort when data search > 1000
                 2019.02.25 (PhiVo) A19_00625-FE 리팩토링_페이지 일괄작업 10차
                 2019.03.18 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.12.19 (김봉기) : 데이터백업 관련 파라미터 추가
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA005M", {
    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/

    LOCATION: null,
    pageSize: 100,
    canCheckCount: 100,                                         // 체크 가능 수 기본 100
    formTypeCode: 'SR982',  // 리스트폼타입
    formTypeSearch: 'SN982',
    /*선택삭제 관련*/
    selectedCnt: 0,                                             // 선택한 리스트 수
    CodeList: "",                                         // 선택한 코드 리스트
    errDataAllKey: null,
    /*선택삭제 관련*/
    userFlag: null,
    ALL_GROUP_WH: null,                                       // 허용창고그룹  - 0: 전체, 1: 특정그룹
    /**************************************************************************************************** 
     * page initialize
     ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        this.registerDependencies(["inventory.guides.api"]);

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
    initProperties: function () {
        this.LOCATION = {
            VAT_SITE: "",
            BUSINESS_NO: "",
            SUB_CODE_YN: ""
        };

        this.searchFormParameter = {
            Request: {
                Data: {
                }
            }
        };

        if (this._userParam) {
            this.searchFormParameter.Request.Data = this._userParam.C_param;
        }
        else {
            this.searchFormParameter = {
                Request: {
                    Data: {
                        FORM_TYPE: this.formTypeCode,
                        PARAM: this.PARAM, SORT_COLUMN: "SALE001.WH_CD", SORT_TYPE: "A",
                        WH_CD: this.WH_CD,
                        WH_DES: this.WH_DES,
                        OTHER_ESTABLISH: this.OTHER_ESTABLISH,
                        CHK_GUBUN: this.CHK_GUBUN,
                        PROCESS_CODE: this.PROCESS_CODE,
                        CUST_CD: this.CUST_CD,
                        PRICE_GROUP: this.PRICE_GROUP,
                        PRICE_GROUP2: this.PRICE_GROUP2,
                        WH_VAT_RATE: this.WH_VAT_RATE,
                        WH_VAT_RATE_YN: this.WH_VAT_RATE_YN,
                        WH_VAT_RATE_BY: this.WH_VAT_RATE_BY,
                        WH_VAT_RATE_BY_BASE_YN: this.WH_VAT_RATE_BY_BASE_YN,
                        WH_LEVEL_GROUP: this.WH_LEVEL_GROUP,
                        WH_LEVEL_GROUP_CHK: this.WH_LEVEL_GROUP_CHK,
                        DEL_GUBUN: this.DEL_GUBUN,
                        ALL_GROUP_WH: this.ALL_GROUP_WH,
                        BASE_DATE_CHK: this.BASE_DATE_CHK
                    }
                },
            };
        }
        this.pageSize = this.viewBag.FormInfos[this.formTypeCode].option.pageSize;
        this.userFlag = this.viewBag.InitDatas.USER_FLAG;                   // 사용자 구분
        this.ALL_GROUP_WH = this.viewBag.InitDatas.ALL_GROUP_WH;        // 허용창고그룹  - 0: 전체, 1: 특정그룹
    },
    /********************************************************************** 
    * render form form  layout setting [onInitHeader, onInitContents, onInitFooter ...](ui setting)  
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator;
        var toolbar = g.toolbar(),
            contents = g.contents(),
            tabContents = g.tabContents();
        var ctrl = g.control();

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

        tabContents
            .onSync(true)
            .setType(this.formTypeSearch)
            .setSeq(1)
            .setOptions({ showFormLayer: (["1", "4"].contains(this.isShowSearchForm || "")) ? true : false  /* 검색 창 접기*/ });

        contents
            .add(tabContents)
            .add(toolbar);

        // 데이터관리에서 넘어 온경우 퀵서치 숨기기
        if (!this.viewBag.DefaultOption.ManagementType) {
            header.useQuickSearch((["4"].contains(this.isShowSearchForm || "")) ? false : true)
        }
        /***************************************************************************************/
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 

            header.setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
                .notUsedBookmark()
                //.useQuickSearch(false)
                .addContents(contents);
        }
        else {
            header.setTitle(ecount.resource.LBL02721).useQuickSearch()
                .add("search", null, false)
                .add("option", [
                    { id: "deleteAll", label: ecount.resource.BTN00427 },
                    { id: "templateSetting", label: ecount.resource.BTN00330 },
                    { id: "searchTemplate", label: ecount.resource.BTN00493 },  // Search Items(검색항목설정)
                ], false)
                .addContents(contents);
        }
    },

    // Control Initialization
    onInitControl: function (cid, control) {

        var g = widget.generator,
            ctrl = g.control(),
            res = ecount.resource;

        var list = this.viewBag.InitDatas.custs;
        var optionData = [];
        var selectedValue = this.searchFormParameter.Request.Data.OTHER_ESTABLISH;

        optionData.push(['', res.BTN00176]);

        if (list) {
            for (var i = 0; i < list.length; i++) {
                var business_no = list[i].BUSINESS_NO;
                var set_bus_no = '';
                if (business_no.length == 10) {
                    set_bus_no = business_no.substr(0, 3) + '-' + business_no.substr(3, 2) + '-' + business_no.substr(5, 5);
                }
                optionData.push([list[i].BUSINESS_NO, list[i].COM_DES + "  " + set_bus_no]);
            }
        }

        switch (cid) {
            case "WH_CD": //Location Code
                break;
            case "WH_DES": //Location Name
                break;
            case "OTHER_ESTABLISH": //Other Establishments
                control.option(optionData).select(selectedValue)
                break;
            case "CHK_GUBUN": //Type
                control
                    .label([res.LBL02475, res.LBL07968, res.LBL00562, res.LBL01970])
                    .value([['0', '1', '2'].join(ecount.delimiter), '0', '1', '2'])
                    .select(['0', '1', '2'].join(ecount.delimiter), '0', '1', '2');
                break;
            case "txtGroupCode": //Process Code
                control.setOptions({ checkMaxCount: 100, label: false });
                break;
            case "txtSCustCd": //Outsourcing Company
                control.setOptions({
                    defaultParam: {
                        ACC002_FLAG: "N", CALL_TYPE: 102, DEL_FLAG: "N", EMP_FLAG: "N", GYE_CODE: "", IO_TYPE: "10", PARAM: "", PROD_SEARCH: "9",
                        SEARCH_GB: "2", SORT_COLUMN: "CUST_NAME", SORT_TYPE: "A", CallFlag: "O", PARENT: "", SeachType: "B", isApplyDisplayFlag: true
                    }
                });
                break;
            case "WH_VAT_RATE": //Tax Rate (Sales)
                control.columns(6, 6);
                control.addControl(ctrl.define("widget.checkbox.whole", "WH_VAT_RATE_YN", "WH_VAT_RATE_YN").label([ecount.resource.LBL02475, ecount.resource.LBL06247, ecount.resource.LBL05716 + "(%)"]).value(["", "N", "Y"]).select("", "N", "Y"));
                control.addControl(ctrl.define("widget.input", "WH_VAT_RATE", "WH_VAT_RATE").numericOnly(6, 3, ecount.resource.MSG04553)); //.hide()

                break;
            case "WH_VAT_RATE_BY": //Tax Rate (Purchases)
                control.columns(6, 6);
                control.addControl(ctrl.define("widget.checkbox.whole", "WH_VAT_RATE_BY_BASE_YN", "WH_VAT_RATE_BY_BASE_YN").label([ecount.resource.LBL02475, ecount.resource.LBL06247, ecount.resource.LBL05716 + "(%)"]).value(["", "N", "Y"]).select("", "N", "Y"));
                control.addControl(ctrl.define("widget.input", "WH_VAT_RATE_BY", "WH_VAT_RATE_BY").numericOnly(6, 3, ecount.resource.MSG04553)); //.hide()
                break;
            case "txtTreeWhCd": //Location Level Group
                break;
            case "DEL_GUBUN": //Active
                control
                    .label([res.LBL02475, res.LBL07879, res.BTN00204])
                    .value([['N', 'Y'].join(ecount.delimiter), 'N', 'Y'])
                    .select('N');
                break;
            case "EtcChk": //Others
                control
                    .label(res.LBL10548)
                    .value('1')
                    .select('');
                break;
        }

    },

    onInitControl_Submit: function (cid, control) {
        var ctrl = widget.generator.control();
        function numericOnly(obj, totLen, decimalLen, msg) {
            if (obj == null) return;
            obj.numericOnly = true;
            if (decimalLen == undefined) {
                decimalLen = decimalLen || ecount.common.number.maxpoint;
            }
            totLen = totLen || ecount.common.number.maxnumber;
            obj.numericRange = [totLen - decimalLen, decimalLen];
            obj.numericMsg = msg || "자리수 초과";
            obj.numericPattern = "";
        };

        switch (cid) {
            case "WH_VAT_RATE":
            case "WH_VAT_RATE_BY":
                var option1 = control.getControlOption(1);
                numericOnly(option1, 6, 3, ecount.resource.MSG04553);
                control.columns(6, 6);
                break;
            case "CHK_GUBUN":
            case "EtcChk":
                break;
        }
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid();

        this.LOCATION = this.viewBag.InitDatas.LocationConfig;
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            grid.setRowData(this.viewBag.InitDatas.AccCust);
        }
        // Initialize Grid
        grid
            .setRowDataUrl("/SVC/Inventory/Basic/GetListLocationForSearchSale001")
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1, ExtendedCondition: {} })
            .setKeyColumn(['SALE001.WH_CD'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['ACC001_COM.COM_DES'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))

            //선택
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)


            // Custom Cells
            .setCustomRowCell('SALE001.WH_CD', this.setGridDataLink.bind(this))
            .setCustomRowCell('SALE001.WH_DES', this.setGridDataLink.bind(this))
            .setCustomRowCell('SALE001.CHK_GUBUN', this.setGridDataMenuType.bind(this))
            .setCustomRowCell('ACC001_COM.COM_DES', this.setGridDataMenuEstablish.bind(this))
            .setCustomRowCell('SALE001.DEL_GUBUN', this.setGridToolTip.bind(this))
            .setCustomRowCell('SALE001.WH_VAT_RATE_YN', this.setGrid_res_RateYN.bind(this))     //부가세율 매출구분
            .setCustomRowCell('SALE001.WH_VAT_RATE_BY_BASE_YN', this.setGrid_res_RateYN.bind(this))     //부가세율 매입구분

            .setEventShadedColumnId(['SALE001.WH_CD', 'SALE001.WH_DES'], { isAllRememberShaded: true });
        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043))
            .addLeft(ctrl.define("widget.button", "locationLevelGroup").label(ecount.resource.BTN00265))
            .addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .addGroup([
                    { id: "Deactivate", label: ecount.resource.BTN00204 },
                    { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                    { id: "Activate", label: ecount.resource.BTN00203 }
                ]).css("btn btn-default")
                .noActionBtn().setButtonArrowDirection("up"))
            .addLeft(ctrl.define("widget.button", "Excel")
                .label(ecount.resource.BTN00079)
                .permission([ecount.config.user.USE_EXCEL_CONVERT, (inventory.guides.api.getNoPermissionDownExcelFileMessage())]).end()
            );

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },

    /**********************************************************************     
    * event form listener [tab, content, search, popup ..](Events occurring in form)
    =>Events occurring in class parents, tab,onload, popup, search etcf
    onChangeControl, onChangeContentsTab, onLoadTabPane, onLoadComplete, onMessageHandler...     
    **********************************************************************/
    onChangeControl: function (control, data, command) {
        var selControlName = control.__self.pcid;

        switch (control.cid) {
            case "CHK_GUBUN":
                this.changeHeaderControl();
                break;
            case "WH_VAT_RATE_BY_BASE_YN":
            case "WH_VAT_RATE_YN":
                this.changeSelectedControl(selControlName);
                break;
            default:
                break;
        }
    },

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.Request.Data.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.Request.Data.ALL_GROUP_WH = this.ALL_GROUP_WH;
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    //Header Search button click event
    onHeaderSearch: function () {
        var self = this;

        self.searchFormParameter.Request.Data = $.extend({}, self.searchFormParameter.Request.Data, self.header.serialize().result);
        self.searchFormParameter.Request.Data.PARAM = "";
        self.searchFormParameter.Request.Data.DEL_GUBUN = self.searchFormParameter.Request.Data.DEL_GUBUN == 'N∬Y' ? '' : self.searchFormParameter.Request.Data.DEL_GUBUN;
        self.searchFormParameter.Request.Data.PROCESS_CODE = self.searchFormParameter.Request.Data.CHK_GUBUN.indexOf('1') > -1
            || self.searchFormParameter.Request.Data.CHK_GUBUN.indexOf('2') > -1
            ? self.searchFormParameter.Request.Data.PROCESS_CODE : '';
        self.searchFormParameter.Request.Data.CHK_GUBUN = self.searchFormParameter.Request.Data.CHK_GUBUN == '0∬1∬2∬0∬1∬2' ? '' : self.searchFormParameter.Request.Data.CHK_GUBUN;

        self.searchFormParameter.Request.Data.WH_VAT_RATE_YN = self.searchFormParameter.Request.Data.WH_VAT_RATE_YN == '∬N∬Y' ? '' : self.searchFormParameter.Request.Data.WH_VAT_RATE_YN;
        self.searchFormParameter.Request.Data.WH_VAT_RATE_BY_BASE_YN = self.searchFormParameter.Request.Data.WH_VAT_RATE_BY_BASE_YN == '∬N∬Y' ? '' : self.searchFormParameter.Request.Data.WH_VAT_RATE_BY_BASE_YN

        self.searchFormParameter.Request.Data.BASE_DATE_CHK = self.searchFormParameter.Request.Data.ETC_CHK.length > 0 ? '1' : '';
        self.searchFormParameter.Request.Data.ALL_GROUP_WH = this.ALL_GROUP_WH;

        this.contents.getGrid().grid.clearChecked();

        if (this.dataSearch()) {
            if (!this._userParam) {
                this.header.toggle(forceHide);
            }
        }
    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        this.header.reset();
    },

    getDataSimpleSearch: function (e, value) {
        this.searchFormParameter.Request.Data.PARAM = value;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    onColumnSortClick: function (e, data) {
        this.searchFormParameter.Request.Data.SORT_COLUMN = data.columnId;
        this.searchFormParameter.Request.Data.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // After the document loaded
    onLoadComplete: function (e) {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 관리에서 넘어온 경우가 아닐때만 포커스
            this.header.getQuickSearchControl().setFocus(0);
        }

        if (this.keyword) {
            this.header.getQuickSearchControl().setValue(this.keyword);
            this.searchFormParameter.Request.Data.PARAM = this.keyword;
        }
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.Request.Data.PARAM);
            control.setFocus(0);
        }
    },

    onMessageHandler: function (page, message) {
        if (message == 'DeleteAll') {
            message.callback && message.callback();
            this.contents.getGrid().draw(this.searchFormParameter);
        }
        else {
            message.callback && message.callback();
            switch (page.pageID) {
                case "CM100P_24":
                case "CM100P_02":
                    this.reloadPage();
                    break;
                case "ESA006M":
                case "CM021P":
                    if (["ESA006M"].contains(page.pageID))
                        this._ON_REDRAW();
                    else
                        this.contents.getGrid().draw(this.searchFormParameter);
                    break;
                default:
                    break;
            }
        }
    },

    onPopupHandler: function (control, config, handler) {
        if (control.id == "txtCustGroup1") {
            config.popupType = true;
            config.custGroupCodeClass = "L03";
            config.CODE_CLASS = "L03";
        }

        if (control.id == "txtCustGroup2") {
            config.custGroupCodeClass = "G11";
            config.isIncludeInactive = true;
            config.CODE_CLASS = "G11";
            config.popupType = false;
        }

        switch (control.id) {
            case "txtSCustCd":
                config.isApplyDisplayFlag = true;
                config.isCheckBoxDisplayFlag = true;
                config.isIncludeInactive = true;
                break;
            case "PRICE_GROUP":
            case "PRICE_GROUP2":
                config.isApplyDisplayFlag = true;
                config.isCheckBoxDisplayFlag = true;
                config.isIncludeInactive = true;
                config.titlename = control.subTitle;
                config.popupType = false;
                config.checkMaxCount = 100;
                break;
            case "txtGroupCode":
                config.titlename = control.subTitle;
                config.name = String.format(ecount.resource.LBL10109, control.subTitle);
                config.custGroupCodeClass = "L03";
                config.CODE_CLASS = "L03";
                config.DEL_FLAG = "N";
                config.SID = "E040102";
                config.ResourceType = "PROD";
                config.isCheckBoxDisplayFlag = true;
                config.isApplyDisplayFlag = true;
                config.isIncludeInactive = true;
                break;
            default:
                this._super.onPopupHandler.apply(this, arguments);
        }

        handler(config);
    },

    //BeforeOpenPopup
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id) {
            case "txtSWhCd":  // 생산공정
                parameter.CODE_CLASS = 'L03';
                break;
        }

        handler(parameter);
    },

    /********************************************************************** 
    * event grid listener [click, change...] (Events occurring in grid) 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.Request.Data.SORT_COLUMN = data.columnId;
        this.searchFormParameter.Request.Data.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    //Grid row of one particular date
    setGridDataLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 500,
                    editFlag: "M",
                    WH_CD: data.rowItem['WH_CD'],
                    DEL_GUBUN: data.rowItem['DEL_GUBUN']
                };
                this.openWindow({ url: '/ECERP/ESA/ESA006M', name: String.format(ecount.resource.LBL06434, ecount.resource.LBL07275), param: param, popupType: false, additional: false });
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    setGridDataMenuType: function (value, rowItem) {
        var option = {};
        var menuvalue = "";

        if (value === "0")
            menuvalue = ecount.resource.LBL07968;
        else if (value === "1")
            menuvalue = ecount.resource.LBL00562;
        else if (value === "2")
            menuvalue = ecount.resource.LBL01970;
        else
            menuvalue = ecount.resource.LBL07968;

        option.data = menuvalue;
        return option;
    },

    setGridDataMenuEstablish: function (value, rowItem) {
        var option = {};
        var menuvalue = "";

        if (rowItem.COM_DES1 == "")
            menuvalue = rowItem.COM_DES2;
        else
            menuvalue = rowItem.COM_DES1;

        option.data = menuvalue;
        return option;
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    // New button click event
    onFooterNew: function (cid) {
        if (this.viewBag.Permission.Permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        else {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 500,
                editFlag: "I",
                isAddGroup: true,
                parentPageID: this.pageID,
                responseID: this.callbackID
            };

            this.openWindow({ url: '/ECERP/ESA/ESA006M', name: String.format(ecount.resource.LBL09999, ecount.resource.LBL07275), param: param, popupType: false, additional: false });
        }
    },

    // LocationLevelGroup button click event
    onFooterLocationLevelGroup: function () {

        if (this.userFlag != "M" && this.ALL_GROUP_WH == "1") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        if (this.viewBag.Permission.TreePermit.Value == "X") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "R" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        } else {
            var param = {
                width: 900,
                height: 600,
                editFlag: "I",
                Type: "CREATE",
                parentPageID: this.pageID,
                responseID: this.callbackID
            };
            this.openWindow({ url: '/ECERP/ESA/ESA051M', name: ecount.resource.LBL07309, param: param, popupType: false, additional: true });
        }
    },

    //Autho level group
    //Just for test on this context
    onFooterAuthoLevelGroup: function () {
        var param = {
            width: 550,
            height: 400,
            editFlag: "I",
            Type: "AUTH",
            UserId: "Tuong",
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID
        };
        this.openWindow({ url: '/ECERP/ESA/ESA051M', name: ecount.resource.LBL07309, param: param, popupType: false, additional: true });
    },


    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        self.CodeList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (this.viewBag.Permission.Permit.Value != "W") {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.CodeList += data.WH_CD + ecount.delimiter;
            });

            if (self.CodeList.lastIndexOf(ecount.delimiter) == (self.CodeList.length - 1))
                self.CodeList = self.CodeList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }

            //삭제함수
            self.callDeleteListApi(self.CodeList, selectItem);

        });
    },

    onFooterExcel: function () {

        var self = this;
        self.searchFormParameter.Request.Data.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Request.Data.ALL_GROUP_WH = this.ALL_GROUP_WH;
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "Y";
        this.EXPORT_EXCEL({
            url: "/SVC/Inventory/Basic/GetListLocationForSearchSale001Excel",
            param: self.searchFormParameter
        });
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "N";
    },

    // Excel button click event
    onDropdownExcel: function () {

    },

    // 전체삭제 : DeleteAll button click event
    onDropdownDeleteAll: function () {
        if (this.viewBag.Permission.Permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02718, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        else {
            var popupParam = {
                width: 480,
                height: 250,
                isSendMsgAfterDelete: true,
                TABLES: 'SALE001',
                DEL_TYPE: 'Y',
                DELFLAG: 'Y',
                DeleteCodesData: Object.toJSON({
                    MENU_CODE: "LocationCode",  //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                    DELETE_TYPE: "DELETEALL",   //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, DELETEALL:전체삭제, ALL:데이터관리 삭제)
                    DELETE_PARAM: this.searchFormParameter.Request.Data.PARAM
                }),
                parentPageID: this.pageID,
                responseID: this.callbackID
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/CM021P',
                name: ecount.resource.LBL00043,
                param: popupParam,
                popupType: false,
                additional: true
            });
        }
    },

    //양식 설정 팝업(Form Settings pop-up)
    onDropdownTemplateSetting: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formTypeCode,
            FORM_SEQ: 1,
            isSaveAfterClose: true
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    // Search Settings popup
    // 검색항목 설정 팝업
    onDropdownSearchTemplate: function () {

        if (this.userPermit == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10991, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: 400,
            height: 420,
            FORM_TYPE: this.formTypeSearch,
            FORM_SEQ: 1,
            NetFlag: "N",
            FIRST_FLAG: "Y"
        }
        this.openWindow({
            url: "/ECErp/Popup.Form/CM100P_24",
            name: 'CM100P_24',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();

        // 페이징 파라미터 세팅gridObj.draw(this.searchFormParameter);
        _self.searchFormParameter.Request.Data.PAGE_SIZE = 10000;
        _self.searchFormParameter.Request.Data.PAGE_CURRENT = 1;
        _self.searchFormParameter.Request.Data.LIMIT_COUNT = 100000;
        _self.searchFormParameter.Request.Data.EXCEL_FLAG = "Y";
        _self.searchFormParameter.Request.Data.IS_FROM_BACKUP = true;

        _self.searchFormParameter.Request.Data = $.extend({}, _self.searchFormParameter.Request.Data, _self.header.serialize().result);
        _self.searchFormParameter.Request.Data.PARAM = "";
        _self.searchFormParameter.Request.Data.DEL_GUBUN = _self.searchFormParameter.Request.Data.DEL_GUBUN == 'N∬Y' ? '' : _self.searchFormParameter.Request.Data.DEL_GUBUN;
        _self.searchFormParameter.Request.Data.PROCESS_CODE = _self.searchFormParameter.Request.Data.CHK_GUBUN.indexOf('1') > -1
            || _self.searchFormParameter.Request.Data.CHK_GUBUN.indexOf('2') > -1
            ? _self.searchFormParameter.Request.Data.PROCESS_CODE : '';
        _self.searchFormParameter.Request.Data.CHK_GUBUN = _self.searchFormParameter.Request.Data.CHK_GUBUN == '0∬1∬2∬0∬1∬2' ? '' : _self.searchFormParameter.Request.Data.CHK_GUBUN;

        _self.searchFormParameter.Request.Data.WH_VAT_RATE_YN = _self.searchFormParameter.Request.Data.WH_VAT_RATE_YN == '∬N∬Y' ? '' : _self.searchFormParameter.Request.Data.WH_VAT_RATE_YN;
        _self.searchFormParameter.Request.Data.WH_VAT_RATE_BY_BASE_YN = _self.searchFormParameter.Request.Data.WH_VAT_RATE_BY_BASE_YN == '∬N∬Y' ? '' : _self.searchFormParameter.Request.Data.WH_VAT_RATE_BY_BASE_YN

        _self.searchFormParameter.Request.Data.BASE_DATE_CHK = _self.searchFormParameter.Request.Data.ETC_CHK.length > 0 ? '1' : '';
        _self.searchFormParameter.Request.Data.ALL_GROUP_WH = this.ALL_GROUP_WH;

        _self.dataSearch();

        var tabId = this.header.currentTabId;
        var invalid = this.header.validate(tabId);
        if (invalid.result.length > 0) {
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

    reloadPage: function (param) {
        var url = "/ECERP/ESA/ESA005M";

        if (this.searchFormParameter.Request.Data.DEL_GUBUN == "") {
            this.searchFormParameter.Request.Data.DEL_GUBUN = "A";
        }

        var params = {
            url: url,
            param: this.searchFormParameter
        };

        this.onAllSubmit(params);
    },

    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {
            MENU_CODE: "LocationCode",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
            CHECK_TYPE: "S",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
            DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
            PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
        };

        ecount.common.api({
            url: "/SVC/Inventory/Basic/DeleteSale001Location",
            data: Object.toJSON(formdata),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (result.Data != null && result.Data.length == 1 && result.Data[0].CHECK_CODE == null) {
                    ecount.alert(result.Data[0].ERR_MSG);
                }
                else if (result.Data != null && result.Data != "") {

                    //삭제불가 코드리스트 팝업창 연결
                    self.ShowNoticeNonDeletable(result.Data);

                    //체크해제
                    for (var idx = 0, limit = selectItem.length; idx < limit; idx++) {
                        self.contents.getGrid().grid.removeChecked(selectItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                    }

                    //그리드 리로드
                    self.contents.getGrid().draw(self.searchFormParameter);
                }
                else {

                    //그리드 로우 삭제
                    self.contents.getGrid().grid.removeCheckedRow();

                    self.contents.getGrid().draw(self.searchFormParameter);

                }
            },
            complete: function (e) {
                //self.hideProgressbar();
                btnDelete.setAllowClick();
            }
        });
    },

    //삭제불가 메세지 팝업창
    ShowNoticeNonDeletable: function (data) {

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        //그리드 리로드후 삭제되지 않은 코드들 체크하기 위해 담아둠 (=> onGridRenderComplete에서 체크로직 진행)
        for (var i = 0; i < data.length; i++) {
            this.errDataAllKey.push(data[i].CHECK_CODE);
        }

        var param = {
            width: 520,
            height: 300,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "LocationCode"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
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

    ON_KEY_F8: function (e, target) {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch();
        }
    },

    /**************************************************************************************************** 
     * define user function 
     ****************************************************************************************************/
    //setGridToolTip 
    setGridToolTip: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.DEL_GUBUN) ? ecount.resource.LBL00243 : ecount.resource.LBL08030;  // Logic to change the value
        return option;
    },


    setGrid_res_RateYN: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(value) ? ecount.resource.LBL05716 : ecount.resource.LBL08396;  // Logic to change the value
        return option;
    },

    setGridToolTipDelete: function (value, rowItem) {
        var option = {};
        option.data = "Delete";
        return option;
    },
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
    },

    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['DEL_GUBUN'] == "Y")
            return true;
    },

    // Reload Grid
    setReload: function (e) {
        var _gridObject = this.contents.getGrid();
        this.searchFormParameter.Request.Data.ALL_GROUP_WH = this.ALL_GROUP_WH;

        if (_gridObject) {
            _gridObject.grid.clearChecked()
            _gridObject.draw(this.searchFormParameter);
        }
        this.header.getQuickSearchControl().hideError();
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnLocation(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnLocation(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                WH_CD: data.WH_CD,
                DEL_GUBUN: cancelYN,
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnLocation: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateListStateSale001Location",
            data: Object.toJSON(updatedList),
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

    // When you press the Search button
    // 검색버튼 눌렀을 때
    dataSearch: function () {
        var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;

        var tabId = this.header.currentTabId;
        var invalid = this.header.validate(tabId);
        if (invalid.result.length > 0) {
            return;
        }

        this.contents.getGrid().grid.removeShadedColumn();
        if (!this.viewBag.DefaultOption.ManagementType) {
            gridObj.draw(this.searchFormParameter);
        }        

        this.header.toggle(true);
    },

    changeHeaderControl: function () {
        var tabId = this.header.currentTabId;
        var CHK_GUBUN = this.header.getControl("CHK_GUBUN", tabId);
        var txtGroupCode = this.header.getControl("txtGroupCode");
        var type = CHK_GUBUN.getCheckedValue();

        if (type.indexOf('1') > -1 || type.indexOf('2') > -1)
            txtGroupCode.readOnly(false);
        else
            txtGroupCode.readOnly(true);
    },

    changeSelectedControl: function (selControlName) {
        controlName = this.header.getControl(selControlName);
        controlNameBasic = this.header.getControl(selControlName, "basic");
        controlNameTarget = this.header.getControl(selControlName, "all");

        if (controlNameBasic != undefined) {
            this.fnChangeControlShowHide(controlNameBasic, controlNameBasic.get(1), controlName.get(0).getValue(2))
        }

        if (controlNameTarget != undefined) {
            this.fnChangeControlShowHide(controlNameTarget, controlNameTarget.get(1), controlName.get(0).getValue(2))
        }

        if (this.currentTabId == "basic") {
            controlNameBasic.get(1).setFocus(0);
        } else if (this.currentTabId == "all") {
            controlNameTarget.get(1).setFocus(0);
        }
    },

    fnChangeControlShowHide: function (control, controlTarget, flag) {
        if (controlTarget.controlType.indexOf('widget.input') > -1) {
            if (control != undefined && controlTarget != undefined) {
                if (flag) {
                    controlTarget.disabled(false);//.show();
                } else {
                    controlTarget.disabled(true);//.hide();
                }
            }
        } else {
            if (control != undefined && controlTarget != undefined) {
                if (flag) {
                    controlTarget.show();
                } else {
                    controlTarget.hide();
                }
            }
        }
    },

    getTargetTabId: function (allTabId) {
        var tabId = this.header.currentTabId;
        tabId = this.isCustomTab(tabId) ? tabId : (allTabId || "all");

        return tabId;
    },
});
