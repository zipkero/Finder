window.__define_resource && __define_resource("LBL03034","LBL03037","LBL01845","LBL02475","LBL03146","LBL02389","LBL00757","LBL00793","LBL10018","LBL10019","LBL01418","LBL35244","LBL01448","BTN00204","BTN00863","BTN00033","BTN00113","LBL00064","LBL10862","BTN00427","BTN00330","LBL01457","MSG02158","BTN00043","BTN00026","BTN00959","LBL13249","BTN00203","BTN00079","BTN00410","LBL06434","LBL93033","LBL00043","LBL09999","LBL93038","MSG04752","LBL13531","LBL03176","MSG00213","LBL03032","MSG00299","LBL02339","LBL00243","LBL08030","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.04.22
2. Creator     : Nguyen Anh Tuong
3. Description : Acct. I/ Inv. I > Setup > Project / 회계1 > 기초등록 > 프로젝트등록
4. Precaution  :
5. History     :
                 [2016.02.01] 이은규 : 헤더에 옵션 > 사용방법설정 추가
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 [2017.12.27] 이현택 : 프로젝트 일괄 사용중단/재사용, 미사용코드 조회 기능 추가
                 2018.01.18(Thien.Nguyen) Add option set shaded for grid, set scroll top for page. 
                 2018.09.20(Chung Thanh Phuoc) Add link navigation Project Code/Project Name of New Project
                 2018.10.02 Chung Thanh Phuoc Apply disable search when data search > 1000
                 2018.11.02 (PhiTa) Remove Apply disable sort > 1000
                 2018.12.27 (HoangLinh): Remove $el
                 2019.03.18 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                 2020.01.30 (Ngoc Han) [A19_04291] change to mySql (Project)
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA007M", {

    pageID: null,
    header: null,
    contents: null,
    footer: null,
    formTypeCode: 'SR980',  // 리스트폼타입
    finalSearchParam: null, // 검색 시 정보
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    pageSize: 100,
    canCheckCount: 100,                                         // 체크 가능 수 기본 100
    userPermit: null,

    /*선택삭제 관련*/
    selectedCnt: 0,                                             // 선택한 리스트 수
    CodeList: "",                                         // 선택한 코드 리스트
    errDataAllKey: null,
    /*선택삭제 관련*/

    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);        
        
        this.searchFormParameter = {
            Request: {
                Data: {
                    PARAM: this.PARAM,
                    SORT_COLUMN: "PJT_CD",
                    SORT_TYPE: "A",
                    IS_All_PAGE_SIZE: this.IS_All_PAGE_SIZE,
                    PJT_CD: this.PJT_CD,
                    PJT_DES: this.PJT_DES,
                    ACCT_CHK: this.ACCT_CHK,
                    SALE_CHK: this.SALE_CHK,
                    EGW_CHK: this.EGW_CHK,
                    PAY_CHK: this.PAY_CHK,
                    REMARKS: this.REMARKS,
                    CANCEL: this.CANCEL
                }
            }
        };
        this.finalSearchParam = this.searchFormParameter;
        this.initProperties();
        this.registerDependencies(["inventory.guides.api"]);

        if (this.isShowSearchForm == null) {   // 데이터관리에서 넘어 온경우 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "2";
        }
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    render: function () {
        this._super.render.apply(this);

    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    // Set default properties
    initProperties: function () {
        this.userPermit = this.viewBag.Permission.Permit.Value;
        this.pageSize = this.viewBag.FormInfos[this.formTypeCode].option.pageSize;
    },

    // Header Initialization
    onInitHeader: function (header) {

        var g = widget.generator;
        var contents = g.contents();         //widget Content
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var form = g.form();                 //widget Form
        var res = ecount.resource;
        var control = g.control();           //widget Control

        // Search Form
        form.add(control.define('widget.input.codeName', 'txtPjtCd', 'PJT_CD', res.LBL03034, null).value(this.PJT_CD).end());         //Project code
        form.add(control.define('widget.input.codeName', 'txtPjtDes', 'PJT_DES', res.LBL03037, null).value(this.PJT_DES).end());           //Project name
        form.add(control.define('widget.checkbox.whole', 'txtMenuChk', 'MENU_CHK', res.LBL01845, null)
            .label([res.LBL02475, res.LBL03146, res.LBL02389, res.LBL00757, res.LBL00793])
            .value(["", "acct", "inv", "gw", "payroll"])
            .select("", "acct", "inv", "gw", "payroll")
            .end());           //Menu
        form.add(control.define('widget.multiCode.processCode', 'txtPjtGroup1', 'PJT_CODE1', res.LBL10018, null).end());           //Project group 1
        form.add(control.define('widget.multiCode.processCode', 'txtPjtGroup2', 'PJT_CODE2', res.LBL10019, null).end());           //Project group 2
        form.add(control.define('widget.input.general', 'txtRemarks', 'REMARKS', res.LBL01418, null).value(this.REMARKS).end());           //Remarks
        form.add(control.define('widget.radio', 'txtCancel', 'CANCEL', res.LBL35244, null)
            .label([res.LBL02475, res.LBL01448, res.BTN00204])
            .value(["A∬N∬Y", "N", "Y"])
            .select("N")
            .end());           //Active

        // 데이터백업 관련 항상 열림 추가
        form.setOptions({ showFormLayer: (["1"].contains(this.isShowSearchForm || "")) ? true : false /* 검색 창 접기 */ });

        // Toolbar        
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 
            toolbar
                .setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true })
            switch (this.viewBag.DefaultOption.ManagementType) {
                case "BA": // BA:Excel, UF:자료올리기형태, ZI:백업, AT:첨부파일, SD:조건삭제
                    toolbar.addLeft(ctrl.define("widget.button", "excelDownload").css("btn btn-sm btn-primary").label(ecount.resource.BTN00863));
                    break;
                case "SD":
                    toolbar.addLeft(ctrl.define("widget.button", "searchDelete").css("btn btn-sm btn-primary").label(ecount.resource.BTN00033));
                    break;
            }
        }
        else {
            toolbar
                .setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true }) //중요 ignorePrimaryButton 확인
                .addLeft(control.define('widget.button', 'search').css('btn btn-sm btn-primary').label(res.BTN00113));
        }
        // Content
        contents
            .add(form)
            .add(toolbar);

        // Header        
        if (this.viewBag.DefaultOption.ManagementType) {        // 데이터 백업에서 온 경우 세팅
            header
            .setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
            .notUsedBookmark()
            .addContents(contents);
        }
        else {
            header
                .setTitle(String.format(ecount.resource.LBL00064, ecount.resource.LBL10862))
                .useQuickSearch()
                .add('search', null, false) //중요 null, false 확인
                .add("option", [
                    { id: "DeleteAll", label: ecount.resource.BTN00427 },
                    { id: "templateSetting", label: ecount.resource.BTN00330 },
                    { id: "SelfCustomizing", label: ecount.resource.LBL01457 }
                ], false
                )
                .addContents(contents);
        }
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var self = this;
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = widget.generator.control();

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            grid.setRowData(this.viewBag.InitDatas.ListProjectLoad);
        }

        // Initialize Grid
        grid.setRowDataParameter(this.finalSearchParam)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1, ExtendedCondition: {} })
            .setRowDataUrl("/SVC/Account/Basic/GetListSiteProjectForSearch")
            .setKeyColumn(['PJT_CD'])
            .setColumnFixHeader(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')

            //선택
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Sorting
            .setColumnSortable(true)
            .setColumnSortEnableList(['PJT_CD', 'PJT_DES', 'PJT_CODE1', 'PJT_G10.CODE_DES', 'PJT_CODE2', 'PJT_G10.CODE_DES', 'CANCEL'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))
            .setColumnSortDisableList(['ACCT_CHK', 'REMARKS'])

            // Shaded
            .setEventShadedColumnId(['PJT_CD'], { isAllRememberShaded: true })

            //Custom cells
            .setCustomRowCell('PJT_CD', this.setGridDataLink.bind(this))
            .setCustomRowCell('PJT_DES', this.setGridDataLink.bind(this))
            .setCustomRowCell('ACCT_CHK', this.setGridDataMenu.bind(this))
            .setCustomRowCell('CANCEL', this.setGridActive.bind(this))
            .setEventShadedColumnId([['PJT_CD']], false);

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Change").label(ecount.resource.BTN00026).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: "SelectedDelete", label: ecount.resource.BTN00033 },
                { id: "UnusedCodes", label: ecount.resource.LBL13249 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00079).permission([ecount.config.user.USE_EXCEL_CONVERT, (inventory.guides.api.getNoPermissionDownExcelFileMessage())]).end());
        toolbar.addLeft(ctrl.define("widget.button", "oldWebUploader").label(ecount.resource.BTN00410 + '(OLD)').hide());
        toolbar.addLeft(ctrl.define("widget.button", "webUploader").label(ecount.resource.BTN00410));

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    //Header Quick Search
    onHeaderQuickSearch: function (event) {

        this.header.lastReset(this.finalSearchParam);
        this.finalSearchParam.Request.Data.PARAM = this.header.getQuickSearchControl().getValue();
        var paramSearch = $.extend({}, this.finalSearchParam.Request.Data, this.header.serialize().result);
        // Set param MENU_CHK
        this.finalSearchParam.Request.Data = this.menuChk(paramSearch.MENU_CHK, paramSearch);

        // Set param CANCEL
        if (this.finalSearchParam.Request.Data.CANCEL.indexOf(ecount.delimiter) > -1) {
            this.finalSearchParam.Request.Data.CANCEL = "";
        }
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.finalSearchParam);
    },

    // header Search button click event
    onHeaderSearch: function (forceHide) {
        this.finalSearchParam.Request.Data.PARAM = "";

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setValue(this.finalSearchParam.Request.Data.PARAM);
        }

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },

    // After the document loaded
    onLoadComplete: function (e) {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setFocus(0);
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 894
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var control = this.header.getQuickSearchControl();

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 백업에서 넘어 온경우 적용하지 않음
            control.setValue(this.finalSearchParam.Request.Data.PARAM);
            control.setFocus(0);
        }
    },

    // Message Handler for popup
    onMessageHandler: function (page, data) {
        switch (page.pageID) {
            case "CM021P":
            case "ESC002M":
            case "CM100P_02":
                this.reloadPage();
                break;
            case "ESA008M":
                this._ON_REDRAW();
                break;
        }

        this.setTimeout(function () {
            data.callback && data.callback(false);
        }.bind(this), 0);
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.finalSearchParam.Request.Data.SORT_COLUMN = data.columnId;
        this.finalSearchParam.Request.Data.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.finalSearchParam);
        this.header.getQuickSearchControl().hideError();
    },

    // Set Code link for modify popup
    setGridDataLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var params = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 350,
                    PJT_CD: data.rowItem['PJT_CD']
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA008M',
                    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL10862),
                    param: params,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/
    //Popup initHandler
    onPopupHandler: function (control, config, handler) {
        switch (control.id) {
            case "txtPjtGroup1":
                config.isApplyDisplayFlag = true;
                config.isCheckBoxDisplayFlag = true;
                config.isIncludeInactive = true;
                config.custGroupCodeClass = "G10";
                config.CODE_CLASS = "G10";
                break;
            case "txtPjtGroup2":
                config.isApplyDisplayFlag = true;
                config.isCheckBoxDisplayFlag = true;
                config.isIncludeInactive = true;
                config.custGroupCodeClass = "G11";
                config.CODE_CLASS = "G11";
                break;
        }

        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        if (control.id == "txtPjtGroup1") {

            parameter.CODE_CLASS = "G10";
        }
        if (control.id == "txtPjtGroup2") {

            parameter.CODE_CLASS = "G11";
        }
        handler(parameter);
    },

    // Dropdown DeleteAll clicked event
    onDropdownDeleteAll: function () {
        var self = this;
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        // Define data transfer object
        var params = {
            width: 480,
            height: 250,
            isSendMsgAfterDelete: true,
            TABLES: 'SITE_PJT',
            DEL_TYPE: 'Y',
            DELFLAG: 'Y',
            PARAM: this.finalSearchParam.Request.Data.PARAM
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: ecount.resource.LBL00043,
            param: params,
            popupType: false,
            additional: true
        });
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

    // Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
    },

    // New button click event
    onFooterNew: function (cid) {
        var btnNew = this.footer.get(0).getControl("New");

        if (this.userPermit == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnNew.setAllowClick();
            return false;
        }

        // Define data transfer object
        var params = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 400,
            isAddGroup: true,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA008M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL10862),
            param: params,
            popupType: false,
            additional: false
        });

        btnNew.setAllowClick();
    },
    //변경
    onFooterChange: function (e) {
        var btnChange = this.footer.get(0).getControl("Change");
        var self = this;
        if (!this.userPermit.equals("W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnChange.setAllowClick();
            return;
        }
        var finishList = this.contents.getGrid().grid.getChecked();
        if (finishList.length == 0) {
            ecount.alert(ecount.resource.MSG04752);
            btnChange.setAllowClick();
            return false;
        };

        var listsOfPjtCD = [];
        $.each(finishList, function (i, data) {
            listsOfPjtCD.push({
                PJT_CD: data.PJT_CD
            })
        });

        var params = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 600,
            dataOfPjtCD: Object.toJSON(listsOfPjtCD)
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA007P_01',
            name: ecount.resource.LBL13531,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
        btnChange.setAllowClick();
    },
    /**********************************************************************
    *  검색 EXCEL 버튼
    **********************************************************************/
    onFooterExcel: function (e) {

        var self = this;

        self.finalSearchParam.Request.Data.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.finalSearchParam.Request.Data.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/SVC/Account/Basic/GetListSiteProjectForExcel",
            param: self.finalSearchParam
        });
        self.finalSearchParam.Request.Data.EXCEL_FLAG = "N";
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var self = this;

        self.CodeList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (self.selectedCnt == 0) {
            btn.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03032, PermissionMode: "U" }]);
            btn.setAllowClick();
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.CodeList += data.PJT_CD + ecount.delimiter;
            });

            if (self.CodeList.lastIndexOf(ecount.delimiter) == (self.CodeList.length - 1))
                self.CodeList = self.CodeList.slice(0, -1);

            if (status === false) {
                btn.setAllowClick();
                return;
            }            

            //삭제함수
            self.callDeleteListApi(self.CodeList, selectItem);
            
        });
    },

    // WebUploader button click event
    onFooterWebUploader: function (e) {
        if (this.userPermit == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var params = {
            width: 800,
            height: 600
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/BulkUploadForm',
            name: ecount.resource.LBL02339,
            additional: true,
            popupType: false,
            param: {
                width: 1000,
                height: 640,
                FormType: 'SI980'
            }
        });
    },

    onFooterOldWebUploader: function () {
        if (this.userPermit == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        this.openWindow({
            url: '/ECMain/EZB/EZB004M.aspx',
            name: ecount.resource.BTN00410,
            additional: true,
            popupType: true,
            param: {
                width: 800,
                height: 600
            },
            fpopupID: this.ecPageID
        });
    },

    // 사용중단 (Deactivate button click event)
    onButtonDeactivate: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.userPermit != "W") {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var updatedList = this.getSelectedListforActivate("Y");

        this.updateCancelProject(updatedList);
    },

    // 재사용 (Activate button click event)
    onButtonActivate: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.userPermit != "W") {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var updatedList = this.getSelectedListforActivate("N");

        this.updateCancelProject(updatedList);
    },

    // 미사용 코드 조회 (Inquiry Unused Codes)
    onButtonUnusedCodes: function (e) {
        var btn = this.footer.get(0).getControl("deleteRestore");

        // Define data transfer object
        var params = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 600,
            isAddGroup: true,
            parentPageID: this.pageID,
            responseID: this.callbackID,
            PARAM: this.searchFormParameter.Request.Data.PARAM
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA007P',
            name: ecount.resource.LBL13249,
            param: params,
            popupType: false,
            additional: false
        });

        btn.setAllowClick();
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();
        _self.dataSearch();

        // 페이징 파라미터 세팅
        _self.finalSearchParam.Request.Data.PAGE_SIZE = 10000;
        _self.finalSearchParam.Request.Data.PAGE_CURRENT = 1;
        _self.finalSearchParam.Request.Data.LIMIT_COUNT = 100000;
        _self.finalSearchParam.Request.Data.EXCEL_FLAG = "N";
        _self.finalSearchParam.Request.Data.IS_FROM_BACKUP = true;

        var invalid = this.checkHeaderValidate();
        if (invalid.result.length > 0) {
            this.header.toggleContents(true, function () {
                invalid.result[0][0].control.setFocus(0);
            });
            _self.hideProgressbar();
            return;
        }

        ecount.common.api({
            url: "/ECAPI/SVC/SelfCustomize/DataManagement/DataBackupRequest",

            data: Object.toJSON({
                BackupObj: _obj,
                KEY: _obj.KEY + "|" + _self.viewBag.DefaultOption.ManagementType,
                pageSessionKey: _self.viewBag.DefaultOption.SessionKey,
                ManagementType: _self.viewBag.DefaultOption.ManagementType,
                PARAM: _self.finalSearchParam
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
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F2 click
    ON_KEY_F2: function (e, target) {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onFooterNew();
        }
    },

    // F3 click - 서치클릭
    ON_KEY_F3: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onHeaderClose();
        }
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (target != null && target.cid == "search" && !this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch(false);
        }
    },

    // F8 click
    ON_KEY_F8: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onHeaderSearch(false);
        }
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    // 정렬 (Sort)
    setGridSort: function (e, data) {
        this.header.toggle(true);
        this.header.getQuickSearchControl().hideError();

        var searchParam = {};
        searchParam = $.extend({}, this.finalHeaderSearch.Request.Data, this.header.serialize().result);
        searchParam.PARAM = this.finalSearchParam.Request.Data.PARAM;
        // Set param MENU_CHK
        searchParam = this.menuChk(searchParam.MENU_CHK, searchParam);
        // Set param CANCEL
        if (searchParam.CANCEL.indexOf(ecount.delimiter) > -1) {
            searchParam.CANCEL = "";
        }
        searchParam.SORTCOL_INDEX = data.columnIndex + 1;
        searchParam.SORTCOL_ID = data.columnId;
        searchParam.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(searchParam);
    },

    // Set value for [Menu] column
    setGridDataMenu: function (value, rowItem) {
        var option = {};
        var menuvalue = "";
        if (rowItem.ACCT_CHK === "Y") {
            if (rowItem.SALE_CHK === "Y" || rowItem.EGW_CHK === "Y" || rowItem.PAY_CHK === "Y")
                menuvalue = ecount.resource.LBL03146 + "/";
            else
                menuvalue = ecount.resource.LBL03146;
        }
        if (rowItem.SALE_CHK === "Y") {
            if (rowItem.EGW_CHK === "Y" || rowItem.PAY_CHK === "Y")
                menuvalue += ecount.resource.LBL02389 + "/";
            else
                menuvalue += ecount.resource.LBL02389;
        }
        if (rowItem.EGW_CHK === "Y") {
            if (rowItem.PAY_CHK === "Y")
                menuvalue += ecount.resource.LBL00757 + "/";
            else
                menuvalue += ecount.resource.LBL00757;
        }
        if (rowItem.PAY_CHK === "Y")
            menuvalue += ecount.resource.LBL00793;
        option.data = menuvalue;
        return option;
    },

    // Set background color for [Active] column
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },

    // Set value for [Active] column
    setGridActive: function (value, rowItem) {
        var option = {};

        if (rowItem.CANCEL == 'Y') {
            option.data = ecount.resource.LBL00243;
        }
        else
            option.data = ecount.resource.LBL08030;

        return option;
    },

    setReload: function () {
        if (!this._WINDOW_SCROLL_TOP) {
            this._WINDOW_SCROLL_TOP = $(window).scrollTop();
        }
        this.contents.getGrid().draw(this.finalSearchParam);
    },

    reloadPage: function () {
        //탭 추가
        var _listOfcontrolID = [];
        for (var id in this.header.serializeById().result) {
            _listOfcontrolID.push({
                "id": id
            })
        }       
        
        var param = $.extend({}, this.finalSearchParam.Request.Data, this.header.serialize().result)
        // Set param MENU_CHK
        this.finalSearchParam.Request.Data = this.menuChk(param.MENU_CHK, param);

        // Set param CANCEL
        if (this.finalSearchParam.Request.Data.CANCEL.indexOf(ecount.delimiter) > -1) {
            this.finalSearchParam.Request.Data.CANCEL = "";
        }

        if (this.finalSearchParam.Request.Data.CANCEL == "") {
            this.finalSearchParam.Request.Data.CANCEL = "A";
        }

        this.onAllSubmitSelf({
            url: "/ECERP/ESA/ESA007M",
            param: this.finalSearchParam
        });
    },

    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btn = this.footer.get(0).getControl("deleteRestore");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {

            MENU_CODE: "Project",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
            CHECK_TYPE: "A",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
            DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
            PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드

        };

        ecount.common.api({
            url: "/SVC/Account/Basic/DeleteSitePJTList",
            data: Object.toJSON({
                Request: {
                    Data: formdata
                }
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
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
                btn.setAllowClick();
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
            MENU_CODE: "Project"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    // 선택된 리스트를 받아오는 함수 (the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();

        // 변경 할 아이템을 받을 변수
        var updatedList = {
            CancelProjectCodes: []
        };

        $.each(selectItem, function (i, data) {
            updatedList.CancelProjectCodes.push({ PJT_CD: data.PJT_CD, CANCEL: cancelYN });
        });

        return updatedList;
    },
    /**
    * reload the grid 
    **/
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload && this.setReload();
    },

    // 일괄 사용중단 or 재사용 (activate or deactivate the projects)
    updateCancelProject: function (updatedList) {
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (updatedList.CancelProjectCodes.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }

        ecount.common.api({
            url: "/SVC/Account/Basic/UpdateCancelSitePJTList",
            data: Object.toJSON({
                Request: {
                    Data: updatedList.CancelProjectCodes
                }
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);;
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },

    /**
    * 헤더 validate 체크 구분하여 리턴
    **/
    checkHeaderValidate: function () {
        return this.header.validate();
    },

    // draw grid
    dataSearch: function (e) {
        // 검색조건 validate 
        var invalid = this.checkHeaderValidate();
        if (invalid.result.length > 0) {
            this.header.toggleContents(true, function () {
                invalid.result[0][0].control.setFocus(0);
            });
            return;
        }

        var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;

        // search parameter setting
        this.setGridParameter(settings);
        gridObj.grid.removeShadedColumn();
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            gridObj.draw(this.finalSearchParam);
        }

        this.header.toggle(true);
    },

    // grid parameter setting 
    setGridParameter: function (settings) {

        var searchParam = { PARAM: '' };
        // Grid Setting & Search        
        settings.setPagingCurrentPage(1); //Paging Page 1
        searchParam = $.extend({}, this.finalHeaderSearch, this.header.serialize().result);
        searchParam.PARAM = this.finalSearchParam.Request.Data.PARAM;
        // Set param MENU_CHK
        searchParam = this.menuChk(searchParam.MENU_CHK, searchParam);
        // Set param CANCEL
        if (searchParam.CANCEL.indexOf(ecount.delimiter) > -1) {
            searchParam.CANCEL = "";
        }

        //그리드 상단 오른쪽  right of top 
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setValue(searchParam.PARAM);
        }

        settings
            .setHeaderTopMargin(this.header.height())
            .setRowDataParameter(searchParam);

        // 조회 당시 컨트롤 정보
        this.finalHeaderSearch = this.header.extract(true).merge();        
        this.finalSearchParam.Request.Data = searchParam;
        this.finalSearchParam.Request.Data.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
    },
    
    menuChk: function (MENU_CHK, searchParam) {
        searchParam.ACCT_CHK = "N";
        searchParam.SALE_CHK = "N";
        searchParam.EGW_CHK = "N";
        searchParam.PAY_CHK = "N";

        if (MENU_CHK.indexOf(ecount.delimiter) > -1) {
            var menuChk = MENU_CHK.split(ecount.delimiter)
            for (var i = 0; i < menuChk.length; i++) {
                switch (menuChk[i]) {
                    case "acct":
                        searchParam.ACCT_CHK = "Y";
                        break;
                    case "inv":
                        searchParam.SALE_CHK = "Y";
                        break;
                    case "gw":
                        searchParam.EGW_CHK = "Y";
                        break;
                    case "payroll":
                        searchParam.PAY_CHK = "Y";
                        break;
                }
            }
        } else {
            switch (MENU_CHK) {
                case "acct":
                    searchParam.ACCT_CHK = "Y";
                    break;
                case "inv":
                    searchParam.SALE_CHK = "Y";
                    break;
                case "gw":
                    searchParam.EGW_CHK = "Y";
                    break;
                case "payroll":
                    searchParam.PAY_CHK = "Y";
                    break;
            }
        }

        return searchParam;
    },

});