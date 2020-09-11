window.__define_resource && __define_resource("BTN00863","BTN00113","BTN00007","LBL10029","MSG03033","LBL80071","LBL03017","MSG03384","LBL02997","LBL02475","LBL02025","LBL01387","LBL02538","LBL01250","LBL01523","LBL03289","LBL03290","LBL03291","LBL07243","LBL35244","LBL01448","BTN00204","LBL10548","LBL35526","BTN00330","LBL10271","LBL03311","LBL09022","LBL06431","BTN00043","BTN00542","BTN00026","BTN00028","BTN00050","BTN00959","BTN00033","BTN00203","BTN00410","LBL18003","LBL02985","LBL06434","LBL06436","LBL03755","LBL04294","LBL00243","LBL08030","LBL05292","MSG00722","MSG00299","LBL93296","LBL06441","LBL02339","LBL09999","LBL06444","MSG04752","LBL10272","MSG00141","LBL07436","MSG00524","LBL03176","MSG00213");
/****************************************************************************************************
1. Create Date : 2015.09.10
2. Creator     : 이일용
3. Description : 재고1 > 기초등록 > 특별단가 > 품목별
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) add function scroll top for page, modify click event grid, modify onMessageHandler function
                 2018.09.20(Chung Thanh Phuoc) Add link navigation Item Code/Item Name  of Price Level Registration
                 2018.10.16(PhiTa) Apply disable sort when data search > 1000
                 2018.11.01(PhiTa) Remove Apply disable sort > 1000
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.11 (NguyenDucThinh) A18_04171 Update resource
                 2019.07.16 (문요한) - SALE004 MariaDB동기화
                 2019.08.19 (Huu Tuan) - Dev 28156
                 2019.08.20 (Duyet) - Add more button Web Uploader Old
                 2019.08.30 (LuongAnhDuy) - A19_03126 - 기초등록 > 특별단가등록 > 웹자료올리기 old버튼 누르는 카운트 요청
                 2019.10.07 (LuongAnhDuy) - A19_03126  delete logic "insert data to table USECNT_HISTORY_TXT at onHeaderSearch"
                 2019.12.19 (김봉기) : 데이터백업 관련 파라미터 추가
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA070M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    currentTabId: null,
    userPermit: '',                 // Page permission    
    selectHearderControl: '',

    isShowSearchBtn: true,
    isShowOptionBtn: true,

    formSearchControlType: 'SN030', // 검색컨트롤폼타입
    formTypeCode: 'SR030',
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
    formListTypeCode: 'SR984',                                      // 리스트폼타입
    formListInfoData: null,                                         // 리스트 양식정보
    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.formListInfoData = this.viewBag.FormInfos[this.formListTypeCode];

        this.searchFormParameter = {
            QUICK_SEARCH: '',                   //퀵서치

            // 검색조건
            CODE_CLASS: '',             // 특별단가
            PROD_CD: '',                // 품목코드
            PROD_TYPE: '0',             // 품목타입
            CLASS_CD: '',               // 그룹코드1
            CLASS_CD2: '',              // 그룹코드2
            CLASS_CD3: '',              // 그룹코드3
            PROD_LEVEL_GROUP: '',       // 계층그룹 코드
            PROD_LEVEL_GROUP_CHK: '0',  // 하위그룹포함검색
            ALL_GROUP_PROD: '0',
            DEL_GUBUN: 'N',

            // SORT, PAGING
            //PAGE_SIZE: 100,
            PAGE_SIZE: this.formListInfoData.option.pageSize,
            PAGE_CURRENT: 1,
            SORT_COLUMN: 'PROD_CD',
            SORT_TYPE: 'ASC',
            CLASS_GUBUN: this.viewBag.InitDatas.classGubun[0].PRICE_GROUP_FLAG,
            FORM_TYPE: this.formListTypeCode,
            FORM_SER: '1',
            INI_COM_CODE: this.viewBag.InitDatas.IniComCode
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
            .add(ctrl.define("widget.multiCode.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL10029).maxSelectCount(100).end()) //.dataRules(["required"], ecount.resource.MSG03033).popover(ecount.resource.MSG03033)
            .add(ctrl.define("widget.multiCode.prod", "PROD_CD", "PROD_CD", ecount.resource.LBL80071, "prod_code").maxSelectCount(100).end()) //.dataRules(["required"], ecount.resource.LBL03017).popover(ecount.resource.MSG03384)
            .add(ctrl.define("widget.checkbox.prodType", "PROD_TYPE", "PROD_TYPE", ecount.resource.LBL02997, "prod_code").label([ecount.resource.LBL02475, ecount.resource.LBL02025, ecount.resource.LBL01387, ecount.resource.LBL02538, ecount.resource.LBL01250, ecount.resource.LBL01523]).value(['-1', '0', '4', '1', '2', '3']).select('-1').select('0').select('4').select('1').select('2').select('3').end())
            .add(ctrl.define("widget.multiCode.prodGroup", "CLASS_CD", "CLASS_CD", ecount.resource.LBL03289, "prod_code").maxSelectCount(100).setOptions({ groupId: "prod_code", defaultParam: { CLASS_GUBUN: "1", DEL_FLAG: "N", PROD_SEARCH: "5", PARAM: "", MENU_GUBUN: "", isApplyDisplayFlag: true } }).end()) //.addCode({ label: "", value: "" }).hasFn()
            .add(ctrl.define("widget.multiCode.prodGroup", "CLASS_CD2", "CLASS_CD2", ecount.resource.LBL03290, "prod_code").maxSelectCount(100).setOptions({ groupId: "prod_code", defaultParam: { CLASS_GUBUN: "1", DEL_FLAG: "N", PROD_SEARCH: "5", PARAM: "", MENU_GUBUN: "", isApplyDisplayFlag: true, prodGroupCodeClass: "2" } }).end()) // .hasFn()
            .add(ctrl.define("widget.multiCode.prodGroup", "CLASS_CD3", "CLASS_CD3", ecount.resource.LBL03291, "prod_code").maxSelectCount(100).setOptions({ groupId: "prod_code", defaultParam: { CLASS_GUBUN: "1", DEL_FLAG: "N", PROD_SEARCH: "5", PARAM: "", MENU_GUBUN: "", isApplyDisplayFlag: true, prodGroupCodeClass: "3" } }).end()) //.hasFn()
            .add(ctrl.define("widget.multiCode.prodLevelGroup", "PROD_LEVEL_GROUP", "PROD_LEVEL_GROUP", ecount.resource.LBL07243).setOptions({ groupId: "prod_code" }).end())
            .add(ctrl.define("widget.checkbox.prodType", "DEL_GUBUN", "DEL_GUBUN", ecount.resource.LBL35244).label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value(['N∬Y', 'N', 'Y']).select('N').end())
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
                .addContents(contents);
            // Dropdown buttons
            var dropdownButtons = [];
            dropdownButtons.push({ id: "ListSettings", label: ecount.resource.BTN00330 });
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
            .createTab("tabESA072M", ecount.resource.LBL10029, null, false, "left") // LBL10271
            .createActiveTab("tabESA070M", ecount.resource.LBL03311, null, true, "left")
            .createTab("tabESA071M", ecount.resource.LBL09022, null, false, "left")
            .createTab("tabESA073M", ecount.resource.LBL06431, null, false, "left")   // 적용단가
            .addGrid("dataGrid", grid);

        contents.add(tabContents);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button.group", "New").label(ecount.resource.BTN00043).addGroup([{ id: "RegisterBatch", label: ecount.resource.BTN00542 }])); //.clickOnce()
        toolbar.addLeft(ctrl.define("widget.button", "Change").label(ecount.resource.BTN00026));
        toolbar.addLeft(ctrl.define("widget.button", "Copy").label(ecount.resource.BTN00028));
        toolbar.addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00050));
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button", "ECWebUploader2").label(ecount.resource.BTN00410).end());
        toolbar.addLeft(ctrl.define("widget.button", "ECWebUploader").label(ecount.resource.LBL18003).end());
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function (e) {
        this._keyWord = "ESA070M" + this.COM_CODE + ecount.user.WID + new Date()._tick();
        this.currentTabId = this.contents.currentTabId;        
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch(true);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        this.selectHearderControl = control.id;

        if (control.id == "PROD_CD") {
            config.width = 600;
            config.height = 645;
            config.isIncludeInactive = true;
            config.isApplyDisplayFlag = true;
            config.isCheckBoxDisplayFlag = true;
            config.name = ecount.resource.LBL02985;
        } else if (control.id == "CODE_CLASS") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isApplyDisplayFlag = true;
            config.isCheckBoxDisplayFlag = true;
            config.isIncludeInactive = true;
        } else if (control.id == "CLASS_CD" || control.id == "CLASS_CD2" || control.id == "CLASS_CD3") {
            config.isIncludeInactive = true;
            config.isApplyDisplayFlag = true;
            config.isCheckBoxDisplayFlag = true;
        }

        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA014P_08') {
            // 등록, 수정
            this.dataSearch();
        } else if (page.pageID == 'ESA070P_01') {
            // 일괄등록
            this.dataSearch();
        } else if (page.pageID == 'ESA070P_02') {
            // 변경
            this.dataSearch();
        } else if (["ESA014P_02"].contains(page.pageID)) {
            //this.dataSearch();
            this._ON_REDRAW();
        } else if (page.pageID == 'CM100P_02' || (message && message.IsClosedWebUpload === true)) {
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
    // 다시작성 ReWrite
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
    onHeaderClose: function (forceHide) {
        this.header.toggle(forceHide);
    },
    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.BASE_DATE_CHK = "";
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    onBeforeChangeTab: function (event) {
        return true;
    },
    onChangeHeaderTab: function () {
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

        this.searchFormParameter.PAGE_CURRENT = 1;
        this.searchFormParameter.PAGE_SIZE = this.formListInfoData.option.pageSize;
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        this.searchFormParameter = searchParam;
        this.searchFormParameter.BASE_DATE_CHK = (this.searchFormParameter.BASE_DATE_CHK != null && this.searchFormParameter.BASE_DATE_CHK != undefined && this.searchFormParameter.BASE_DATE_CHK.length > 0) ? "1" : "0";

        // Initialize Grid
        settings
            .setRowDataUrl('/Inventory/Basic/GetListPriceLevelByItemForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formListTypeCode, FormSeq: 1 })
            .setKeyColumn(["PROD_CD", "CODE_CLASS"])

            .setColumnFixHeader(true)
            .setHeaderTopMargin(this.header.height())
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            //품명 및 규격
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formListInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // CheckBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(true)

            // Custom Cells
            .setCustomRowCell("PROD_CD", this.setItemCodeLink.bind(this))
            .setCustomRowCell("PROD_DES", this.setItemDesValue.bind(this))
            .setCustomRowCell("PRICE_VAT_YN", this.setTaxStatusValue.bind(this))
            .setCustomRowCell("DEL_GUBUN", this.setDelColumnValues.bind(this))
            .setCustomRowCell("PRICE", this.setItemPriceValue.bind(this))
            .setEventShadedColumnId(['PROD_CD', 'PROD_DES', 'GROUP_CLASS_DES', 'CLASS_DES', 'PRICE', 'PRICE_VAT_YN'], { useIntegration: true, isAllRememberShaded: true })
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
    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    // OnInitContents 후에 실행(맨처음 로딩 될때 한번만 실행됨)
    onGridRenderBefore: function (gridId, settings) {
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
    // Set [Item Code] column link
    setItemCodeLink: function (value, rowItem) {
        var option = {};
        var res = this.resource;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    //width: 800,
                    height: 280,
                    editFlag: 'M',
                    code_class: data.rowItem.CODE_CLASS,
                    prod_cd: data.rowItem.PROD_CD,
                    DEL_GUBUN: data.rowItem.DEL_GUBUN
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA014P_02',
                    name: String.format(res.LBL06434, res.LBL06436),
                    param: param,
                    popupType: false,
                    additional: false,
                    parentPageID: this.pageID,
                    responseID: this.callbackID,
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    // Set [Item Description] value
    setItemDesValue: function (value, rowItem) {
        var option = {};
        if (rowItem.SIZE_DES != undefined && rowItem.SIZE_DES != "")
            option.data = value + ' [' + rowItem.SIZE_DES + ']';
        else
            option.data = value;
        return option;
    },
    // Set [TaxStatus] value
    setTaxStatusValue: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(value) ? ecount.resource.LBL03755 : ecount.resource.LBL04294;
        return option;
    },
    //적용단가
    setItemPriceValue: function (value, rowItem) {

        var option = {};

        //if (!$.isEmpty(value)) {
        //    option.dataType = String.format('9{0}', ecount.config.inventory.DEC_P);
        //    option.data = ecount.grid.helper.getDecimalValueByConvertor(rowItem.PRICE, option);
        //}
        return option;

    },

    // Set Active column values
    setDelColumnValues: function (value, rowItem) {
        var option = {};
        if (['Y'].contains(rowItem.DEL_GUBUN)) {
            option.data = ecount.resource.LBL00243;
        } else {
            option.data = ecount.resource.LBL08030;
        }
        return option;
    },
    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["DEL_GUBUN"] == "Y")
            return true;
        return false;
    },
    reloadPage: function () {
        var self = this;

        this.onAllSubmitSelf({
            url: "/ECERP/ESA/ESA070M",
            PARAM: this.searchFormParameter.PARAM
        });
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Delete All button clicked event
    onButtonSelectedDelete: function () {
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.resource.LBL05292, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var arrPriceLevelBatch = [];
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);

        $.each(grid.getCheckedObject(), function (i, item) {
            if (item['PRICE'] != undefined) {
                var param = {
                    CUST: item['CODE_CLASS'],
                    CODE_CLASS: item['CODE_CLASS'],
                    PROD_CD: item['PROD_CD'],
                    PRICE: item['PRICE'],
                    PRICE_VAT_YN: item['PRICE_VAT_YN']
                };
                arrPriceLevelBatch.push(param);
            }
        });

        if (arrPriceLevelBatch.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            btnDelete.setAllowClick();
            return false;
        }

        var formData = Object.toJSON({
            Request: {
                Data: arrPriceLevelBatch
            }
        });

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeleteBatchPriceLevelForItem",
                    data: formData,
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
    onFooterCopy: function (cid) {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        // Define data transfer object
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 160 + 60,
            code_class: this.code_class,
            class_des: this.class_des,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };
        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA014P_08',
            name: ecount.resource.LBL06441,
            param: param,
            popupType: false,
            //additional: false,
            popupID: this.pageID
        });
    },
    // WebUploader button click event
    onFooterECWebUploader2: function (e) {
        if (!['W', 'U'].contains(this.userPermit)) {
            var authMessage = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(authMessage.fullErrorMsg);
            return false;
        }

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/BulkUploadForm',
            name: ecount.resource.LBL02339,
            additional: false,
            popupID: this.pageID,
            popupType: false,
            param: {
                width: 1000,
                height: 640,
                FormType: 'SI985',

                CurrentPageID: this.pageID
            }
        });
    },

    onFooterECWebUploader: function () {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        // Define data transfer object
        var param = {
            width: 770,
            height: 600,
            CurrentPageID: this.pageID
        };
        // Open popup
        this.openWindow({
            url: '/ECMain/EZS/EZS003M.aspx?DocCode=EZS009M&addrow=1&ForeignFlag=0&wonga_gubun=1&yymm_f=&yymm_t=',
            name: ecount.resource.LBL02339,
            param: param,
            popupType: true,
            additional: false,
            popupID: this.pageID
        });
    },

    // New button clicked event
    onFooterNew: function (cid) {
        var res = this.resource;
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        // Define data transfer object
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 260,
            editFlag: 'I',
            code_class: this.code_class,
            prod_cd: 0,
        };
        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA014P_02',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL06436),
            param: param,
            popupType: false,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
        });
    },
    // Register-Batch button clicked event
    onButtonRegisterBatch: function (cid) {
        this.onFooterRegisterBatch(cid);
    },
    onFooterRegisterBatch: function (cid) {
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        // Define data transfer object
        var param = {
            width: 800,
            height: 600,
        };
        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA070P_01',
            name: ecount.resource.LBL06444,
            param: param,
            popupType: false,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
        });
    },
    // Change button clicked event
    onFooterChange: function (cid) {
        // Check user authorization
        if (!['W'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var grid = this.contents.getGrid().grid;
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        var CHANGE_CODE_LIST = '';
        $.each(grid.getCheckedObject(), function (i, item) {
            CHANGE_CODE_LIST += item['CODE_CLASS'] + item['PROD_CD'] + ecount.delimiter;
        });
        if (CHANGE_CODE_LIST.length <= 0) {
            ecount.alert(ecount.resource.MSG04752);
            return false;
        }
        // Define data transfer object
        var param = {
            width: 995,
            height: 630,
            CHANGE_CODE_LIST: CHANGE_CODE_LIST,
            popupType: false,
            additional: false,
        };
        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA070P_02',
            name: ecount.resource.LBL10272,
            param: param
        });
    },
    // Set [Excel] link for Price Level
    onFooterExcel: function () {
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        var grid = this.contents.getGrid().grid;
        if (grid.getRowCount() > 0) {
            if (grid.getRowList()[0].MAXCNT > 30000) {
                ecount.alert(String.format(ecount.resource.MSG00524, "30000"));
                return false;
            }
        }

        var options = {
            type: "ExcelDic",
            keyword: this._keyWord,
            iMaxCnt: this.contents.getGrid().getSettings().getPagingTotalRowCount(),
            verisionCheck: false,
            hid_historyback: 'N'
        };

        searchParam.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        searchParam.EXCEL_FLAG = "Y";
        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListPriceLevelByItemForExcel",
            param: searchParam
        });
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
        this.updateActiveYnPriceByItem(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnPriceByItem(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CUST: data.CODE_CLASS,
                PROD_CD: data.PROD_CD,
                DEL_GUBUN: cancelYN,
                EDIT_MODE: ecenum.editMode.modify
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnPriceByItem: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL05292, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateListPriceLevelItemForActivation",
            data: Object.toJSON({
                Request: {
                    Data: updatedList.Data
                }
            }),
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