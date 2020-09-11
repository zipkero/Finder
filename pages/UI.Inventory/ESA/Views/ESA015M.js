window.__define_resource && __define_resource("LBL01486","LBL01485","LBL03213","LBL01845","LBL02489","LBL03146","LBL02389","LBL00640","LBL02935","LBL00865","LBL04893","LBL04306","LBL35244","LBL02475","LBL01448","BTN00204","LBL00870","LBL10548","BTN00863","BTN00033","BTN00113","BTN00007","LBL00064","LBL00078","BTN00330","MSG02158","BTN00043","BTN00959","BTN00203","BTN00050","BTN00410","LBL06434","BTN00644","LBL12145","LBL00243","LBL08030","LBL01490","LBL02339","LBL09999","MSG00141","LBL09653","LBL03176","MSG00213","MSG00299","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.04.22
2. Creator     : Phan Phuoc Tho
3. Description : Inv. I > Setup > PIC/Employee / 재고1 > 기초등록 > 사원(담당등록) 리스트
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) Add option set shaded for grid, set scroll top for page, modify onMessageHandler function.
                 2018.05.29 Huu Lan Apply Dev 9670
                 2018.09.20(Chung Thanh Phuoc) Add link navigation PIC Code/ PIC Name of Menu PIC/Employee
                 2018.10.05 (PhiTa) Apply disable sort when data search > 1000
                 2018.11.01 (PhiTa) Remove Apply disable sort > 1000
                 2019.03.06 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019-03-08 (문요한) : 저장로직 3.0 변경
                 2019.04.18 (PhiVo): A19_01005-사원(담당자) 사용메뉴 적용방식 통일
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.01.20 (Ngoc Han) [A19_04292] change logic for get, save
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA015M", {

    pageID: null,
    header: null,
    contents: null,
    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    pagePermit: '',     // Page permission
    pageSize: 100,
    canCheckCount: 100,                                         // 체크 가능 수 기본 100   
    formTypeCode: 'AR770',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보
    searchFormParameter: null, // 검색 시 정보
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
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

    initProperties: function () {       
        
        this.searchFormParameter = {
            Request: {
                Data: {                    
                    PARAM: this.PARAM, PAGE_SIZE: 100, PAGE_CURRENT: 0, SORT_COLUMN: 'C.BUSINESS_NO', SORT_TYPE: 'ASC',
                    GUBUN: '90',
                    BUSINESS_NO: this.BUSINESS_NO,      //PIC Code
                    CUST_NAME: this.CUST_NAME,          //PIC Name
                    REMARKS_WIN: this.REMARKS_WIN,      //Keyword
                    MENU: this.MENU,                    //Menu
                    REMARKS: this.REMARKS,              //Remarks
                    CANCEL: this.CANCEL,                //Active
                    BASE_DATE_CHK: this.BASE_DATE_CHK,  //Sort by Modified Date
                    CONT: this.CONT                     //Add. Field
                }
            }
        };

        this.pagePermit = this.viewBag.Permission.Permit.Value;
        this.pageSize = this.viewBag.FormInfos[this.formTypeCode].option.pageSize;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {

        var g = widget.generator;
        var contents = g.contents();         //widget Content
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var form = g.form();                 //widget Form
        var res = ecount.resource;
        var control = g.control();           //widget Control

        var activeFlag = ["N", "Y"].join(ecount.delimiter);

        // Search Form
        form.add(control.define('widget.input.search', 'txtBusinessNo', 'BUSINESS_NO', res.LBL01486, null).end());

        form.add(control.define('widget.input.search', 'txtCustName', 'CUST_NAME', res.LBL01485, null).end());

        form.add(control.define('widget.input.search', 'txtRemarksWin', 'REMARKS_WIN', res.LBL03213, null).end());

        form.add(control.define("widget.checkbox.whole", "cbMENU", "MENU", res.LBL01845)
            .label([res.LBL02489,                                        // 전체
            res.LBL03146,                                       // 회계1
            res.LBL02389 + ' - ' + res.LBL00640,    // 재고 - 구매
            res.LBL02389 + ' - ' + res.LBL02935,    // 재고 - 판매
            res.LBL02389 + ' - ' + res.LBL00865])    // 재고 - 기타
            .value(["99", "01", "02", "03", "04"]) // 99: 1, 01: 0
            .select("99", "01", "02", "03", "04")
            .end());

        form.add(control.define('widget.input.search', 'txtRemarks', 'REMARKS', res.LBL04893, null).end());

        form.add(control.define('widget.input.search', 'txtCont', 'CONT', res.LBL04306, null).end());

        form.add(control.define('widget.radio', 'rdActive', 'CANCEL', res.LBL35244, null)
            .label([res.LBL02475, res.LBL01448, res.BTN00204])
            .value([activeFlag, "N", "Y"]) // All / Use / Temp Delete
            .select("N")
            .end());

        form.add(control.define("widget.checkbox", "cbEtcVal", "BASE_DATE_CHK", res.LBL00870)
            .label([res.LBL10548])
            .end()); // Other

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
                .addLeft(control.define('widget.button', 'search').css('btn btn-sm btn-primary').label(res.BTN00113))
                .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007)); //다시작성
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
                .setTitle(String.format(ecount.resource.LBL00064, ecount.resource.LBL00078))
                .useQuickSearch()
                .add('search', null, false) //중요 null, false 확인
                .add("option", [
                    { id: "ListSettings", label: ecount.resource.BTN00330 },
                ], false)
                .addContents(contents);
        }
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var self = this;
        var g = widget.generator;
        var toolbar = g.toolbar();
        var grid = g.grid();

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            grid.setRowData(this.viewBag.InitDatas.GridFirstLoad);
        }

        // Initialize Grid
        grid.setRowDataUrl("/SVC/Account/Basic/GetListByBasicConditions")
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(["BUSINESS_NO"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })
            .setColumnFixHeader(true)

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(self.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['BANK_ACCOUNT', 'MENU'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Shaded    
            .setEventShadedColumnId(['C.BUSINESS_NO'], { isAllRememberShaded: true })

            // Custom cells
            .setCustomRowCell("C.BUSINESS_NO", this.setPICModificationLink.bind(this))
            .setCustomRowCell("CUST_NAME", this.setPICModificationLink.bind(this))
            .setCustomRowCell("MENU", this.setMenuColumnValues.bind(this))
            .setCustomRowCell("CANCEL", this.setActiveColumnValues.bind(this))
            .setCustomRowCell("BANK_ACCOUNT", this.setBankAccountPopupLink.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());
        toolbar.addLeft(ctrl.define("widget.button", "ecountWebUploader").label(ecount.resource.BTN00410).end());

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.finalHeaderSearch);
        this.searchFormParameter.Request.Data.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid("dataGrid");
        this.contents.getGrid().grid.removeShadedColumn();
        this.contents.getGrid().grid.clearChecked();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // After the document loaded
    onLoadComplete: function (e) {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.header.toggle(true);
        this.searchFormParameter.Request.Data.SORT_COLUMN = data.columnId;
        this.searchFormParameter.Request.Data.SORT_TYPE = data.sortOrder;
        if (this.searchFormParameter.Request.Data.BASE_DATE_CHK)
            this.searchFormParameter.Request.Data.BASE_DATE_CHK = false;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (["ESA016M"].contains(page.pageID)) {
            this._ON_REDRAW();
        } else if (["CM100P_02"].contains(page.pageID)) {
            this.reloadPage();
        }
        else { }
        message.callback && message.callback();
    },

    onDropdownListSettings: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formTypeCode,
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
        ecount.page.list.prototype.onGridInit.apply(this, arguments);
    },

    // After grid rendered
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 백업에서 넘어 온경우 적용하지 않음
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.Request.Data.PARAM);
            control.setFocus(0);
        }
    },    

    // Set PIC Code link
    setPICModificationLink: function (value, rowItem) {
        var option = {};
        var self = this;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {

                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 550,

                    editFlag: 'M',
                    custNo: data.rowItem['BUSINESS_NO'],
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA016M',
                    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL00078),
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    // Set bank account link
    setBankAccountPopupLink: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.link";
        option.data = ecount.resource.BTN00644;
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 760,
                    height: 500,

                    custNo: data.rowItem['BUSINESS_NO'],
                    custName: data.rowItem['CUST_NAME'],
                    pageName: "ESA015M"
                };

                // Open popup                
                this.openWindow({
                    url: '/ECERP/ESA/ESA001P_05',
                    name: ecount.resource.LBL12145,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };

        // If PIC has a bank account then set other color for [Bank Account] link
        if (rowItem.T_COUNT > 0) { 
            option.attrs = {
                'class': 'text-warning-inverse'
            };
        }

        return option;
    },

    // Set value for [Menu] column
    setMenuColumnValues: function (value, rowItem) {
        var option = {};
        var values = new Array();
        var res = ecount.resource;

        if (rowItem.ACCT_CHK == 1)
            values.push(res.LBL03146);
        if (rowItem.SALE_CHK1 == 1)
            values.push(res.LBL00640);
        if (rowItem.SALE_CHK2 == 1)
            values.push(res.LBL02935);
        if (rowItem.SALE_CHK3 == 1)
            values.push(res.LBL00865);

        option.data = values.join('/');

        return option;
    },

    // Set Active column values
    setActiveColumnValues: function (value, rowItem) {
        var option = {};

        if (['Y'].contains(rowItem.CANCEL)) {
            option.data = ecount.resource.LBL00243;
        } else {
            option.data = ecount.resource.LBL08030;
        }

        return option;
    },

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["CANCEL"] == "Y")
            return true;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // WebUploader button click event
    onFooterWebUploader: function (e) {
        // Check user authorization
        if (!['U', 'W'].contains(this.pagePermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        // Define data transfer object
        var param = {
            width: 770,
            height: 595,
            CurrentPageID: this.pageID,
        };
        // Open popup
        this.openWindow({
            url: '/ECMAIN/EZB/EZB005M.aspx',
            name: ecount.resource.LBL02339,
            param: param,
            popupType: true,
            additional: false
        });
    },

    // WebUploader button click event
    onFooterEcountWebUploader: function (e) {
        if (!['U', 'W'].contains(this.pagePermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        this.openWindow({
            url: '/ECERP/Popup.Common/BulkUploadForm',
            name: ecount.resource.BTN00410,
            additional: true,
            popupType: false,
            param: {
                width: 1000,
                height: 640,
                FormType: 'SI950',
                IsGetBasicTab: true
            }
        });
    },

    // New button clicked event
    onFooterNew: function () {
        // Check user authorization    
        if (!['U', 'W'].contains(this.pagePermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        // Define data transfer object
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 550,
            editFlag: 'I',
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA016M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL00078),
            param: param,
            popupType: false,
            additional: false
        });
    },

    onFooterExcel: function () {
        var self = this;
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }
        self.searchFormParameter.Request.Data.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/SVC/Account/Basic/GetListByBasicConditionsForExcel",
            param: self.searchFormParameter
        });
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "N";
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        this.BusinessNoList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (!this.pagePermit.equals("W")) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.BusinessNoList += data.BUSINESS_NO + ecount.delimiter;
            });

            if (self.BusinessNoList.lastIndexOf(ecount.delimiter) == (self.BusinessNoList.length - 1))
                self.BusinessNoList = self.BusinessNoList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }
            //삭제함수
            self.callDeleteListApi(self.BusinessNoList, selectItem);
        });
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();
        _self.dataSearch();

        // 페이징 파라미터 세팅
        _self.searchFormParameter.Request.Data.PAGE_SIZE = 10000;
        _self.searchFormParameter.Request.Data.PAGE_CURRENT = 1;
        _self.searchFormParameter.Request.Data.LIMIT_COUNT = 100000;
        _self.searchFormParameter.Request.Data.EXCEL_FLAG = "Y";
        _self.searchFormParameter.Request.Data.IS_FROM_BACKUP = true;

        var invalid = _self.header.validate();

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
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onFooterNew();
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Reload grid
    setReload: function (e) {
        var _gridObj = this.contents.getGrid();
        if (_gridObj) {
            _gridObj.grid.clearChecked();
            _gridObj.draw(this.searchFormParameter);
        }
        this.header.getQuickSearchControl().hideError();
    },

    reloadPage: function () {
        if (this.searchFormParameter.Request.Data.CANCEL == "") {
            this.searchFormParameter.Request.Data.CANCEL = "A";
        }

        this.onAllSubmit({
            url: "/ECERP/ESA/ESA015M",
            param: this.searchFormParameter
        });
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
            Data: {
                MENU_CODE: "EmployeePic",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                CHECK_TYPE: "A",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드               
            }
        };

        ecount.common.api({
            url: "/SVC/Account/Basic/DeleteCusEmp",
            data: Object.toJSON(formdata),
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
            MENU_CODE: "EmployeePic"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnPic(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnPic(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                BUSINESS_NO: data.BUSINESS_NO,
                CANCEL: cancelYN,
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnPic: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/SVC/Account/Basic/UpdateListCancelCusEmp",
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

    // header Search button click event
    onHeaderSearch: function (forceHide) {
        this.searchFormParameter.Request.Data.PARAM = "";

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setValue(this.searchFormParameter.Request.Data.PARAM);
        }

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }

        this.contents.getGrid().grid.clearChecked();
    },

    // reset Search Form
    onHeaderReset: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },

    dataSearch: function (e) {
        // 검색조건 validate 
        var self = this,
            invalid = self.header.validate();

        if (invalid.result.length > 0) {
            this.header.toggleContents(true, function () {
                invalid.result[0][0].control.setFocus(0);
            });
            return;
        }

        var gridObj = self.contents.getGrid("dataGrid"),
            settings = gridObj.settings;

        // search parameter setting
        self.setGridParameter(settings);
        gridObj.grid.removeShadedColumn();
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            gridObj.draw(self.searchFormParameter);
        }

        this.header.toggle(true);
    },

    // grid parameter setting 
    setGridParameter: function (settings) {       

        // Grid Setting & Search        
        settings.setPagingCurrentPage(1);

        var searchParam = $.extend({}, this.searchFormParameter.Request.Data, this.header.serialize().result);
        searchParam.PARAM = this.searchFormParameter.Request.Data.PARAM;
        searchParam.BASE_DATE_CHK = (searchParam.BASE_DATE_CHK != null && searchParam.BASE_DATE_CHK != undefined && searchParam.BASE_DATE_CHK.length > 0) ? true : false;
        // Set param CANCEL
        if (searchParam.CANCEL.indexOf(ecount.delimiter) > -1) {
            searchParam.CANCEL = "";
        }

        //그리드 상단 오른쪽  right of top 
        settings
            .setHeaderTopMargin(this.header.height())
            .setRowDataParameter(searchParam);
        // 조회 당시 컨트롤 정보
        this.finalHeaderSearch = this.header.extract(true).merge();       
        this.searchFormParameter.Request.Data = searchParam;
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
            this.onHeaderSearch();
        }
    },

    // F8 click
    ON_KEY_F8: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onHeaderSearch();
        }
    },

});