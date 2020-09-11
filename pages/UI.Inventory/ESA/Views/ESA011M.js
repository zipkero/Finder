window.__define_resource && __define_resource("LBL00619","LBL00616","LBL35244","LBL02475","LBL07879","BTN00204","LBL00865","LBL10548","BTN00863","BTN00113","BTN00007","LBL00064","LBL00612","BTN00427","BTN00330","LBL01457","MSG02158","BTN00043","BTN00959","BTN00033","BTN00203","BTN00050","BTN00410","MSG00141","LBL09653","LBL03176","LBL93295","LBL02484","LBL02339","LBL09999","MSG00213","MSG00299","LBL08030","LBL00243","LBL06434","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Mgmt.Field 
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) Add option set shaded for grid, set scroll top for page, modify click event grid, modify onMessageHandler function
                 2018.01.25(Hoang.Linh) Add search form
                 2018.09.20(Chung Thanh Phuoc) Add link navigation  Expiration date code/Expiration date name of Mgmt. Field
                 2018.10.16 (PhiTa) Apply disable sort when data search > 1000
                 2018.12.27 (HoangLinh): Remove $el
                 2019.03.06 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.19 [LuongAnhDuy] A19_02068 - 특수문자 제한 및 치환 로직변경 (관리항목등록)
                 2019.07.29 (HuuTuan) : A18_03722 - 수입비용 비용항목 기초등록으로
                 2019.12.19 (김봉기) : 데이터백업 관련 파라미터 추가
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA011M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    permission: null,

    // 사용방법설정 팝업창 높이					
    selfCustomizingHeight: 0,
    canCheckCount: 100,                                         // 체크 가능 수 기본 100   

    formTypeCode: 'SR970',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보

    errDataAllKey: null,

    finalHeaderSearch: null,                                    // 검색 시 검색 컨트롤 정보 (퀵서치)
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);

        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];

        this.searchFormParameter = {
            PARAM: this.PARAM,
            PAGE_SIZE: this.formInfoData.option.pageSize,
            PAGE_CURRENT: 1,
            SORT_COLUMN: 'CODE_NO',
            SORT_TYPE: "ASC",
            FORM_TYPE: this.formTypeCode,
            FORM_SER: '1',
            INI_COM_CODE: this.viewBag.InitDatas.IniComCode,
            USE_GUBUN: this.USE_GUBUN,
            CODE_NO: this.CODE_NO,
            BASE_DATE_CHK: this.BASE_DATE_CHK
        };

        this.permission = this.viewBag.Permission.permitESA011M;

        this.errDataAllKey = new Array();

        if (this.isShowSearchForm == null) {   // 데이터관리에서 넘어 온경우 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "2";
        }
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    render: function () {
        this._super.render.apply(this);
    },


    /********************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator;
        var toolbar = g.toolbar(),
            contents = g.contents(),
            form = g.form();

        var ctrl = g.control();
        var res = ecount.resource;

        //Header search content
        form
            .add(ctrl.define('widget.input.search', 'CODE_NO', 'CODE_NO', res.LBL00619, null).value('').end())
            .add(ctrl.define('widget.input.search', 'CODE_DES', 'CODE_DES', res.LBL00616, null).value('').end())
            .add(ctrl.define('widget.radio', 'USE_GUBUN', 'USE_GUBUN', res.LBL35244, null)
                .label([res.LBL02475, res.LBL07879, res.BTN00204])
                .value(['', "Y", "N"])
                .select("Y")
                .end())
            .add(ctrl.define('widget.checkbox', 'EtcChk', 'EtcChk', res.LBL00865, null)
                .label(res.LBL10548)
                .value([1])
                .select([0]).end())
            .setOptions({ showFormLayer: (["1", "4"].contains(this.isShowSearchForm || "")) ? true : false  /* 검색 창 접기*/ }); // 데이터 백업관련 추가

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
                .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(res.BTN00113))
                .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));
        }

        // 데이터관리에서 넘어 온경우 퀵서치 숨기기
        if (!this.viewBag.DefaultOption.ManagementType) {
            header.useQuickSearch((["4"].contains(this.isShowSearchForm || "")) ? false : true)
        }

        contents
            .add(form)
            .add(toolbar);
        /***************************************************************************************/
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 

            header.setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
            .notUsedBookmark()
            .useQuickSearch(false)
            .addContents(contents);
        }
        else {
            header.setTitle(String.format(res.LBL00064, res.LBL00612))
                .useQuickSearch()
                .add('search', null, false) //중요 null, false 확인
                .add("option", [
                    { id: "deleteall", label: res.BTN00427 },
                    { id: "ListSettings", label: ecount.resource.BTN00330 },      // 리스트설정
                    { id: "SelfCustomizing", label: res.LBL01457 }
                ])
                .addContents(contents);
        }
    },

    onInitContents: function (contents) {
        var self = this;
        var defaultTitle = ecount.config.inventory.ITEM_TIT,
            g = widget.generator,
            ctrl = g.control(),
            toolbar = g.toolbar(),
            grid = g.grid(),
            decq = '9' + ecount.config.inventory.DEC_Q,
            res = ecount.resource;

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            grid.setRowData(this.viewBag.InitDatas.Sale009);
        }

        grid.setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setRowDataUrl("/Inventory/Basic/GetListMgmtFieldBySearch")
            .setKeyColumn(['CODE_NO'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })
            .setColumnFixHeader(true)
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setColumnSortable(true)
            .setColumnSortDisableList(['CANCEL'])
            .setEventShadedColumnId(['CODE_NO'], { isAllRememberShaded: true })
            .setColumnSortExecuting(this.fnColumnSortClick.bind(this))
            .setCustomRowCell('CODE_NO', this.setGridDataLink.bind(this))
            .setCustomRowCell('CODE_DES', this.setGridDataLink.bind(this))
            .setCustomRowCell('CANCEL', this.setGridToolTip.bind(this))
        contents.addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            res = ecount.resource;

        toolbar.addLeft(ctrl.define("widget.button", "new").label(res.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());
        //toolbar.addLeft(ctrl.define("widget.button", "WebUploader").label(ecount.resource.BTN00410 + " (OLD)").hide());
        toolbar.addLeft(ctrl.define("widget.button", "WebUploader2").label(ecount.resource.BTN00410).end());

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }

    },

    onFooterExcel: function () {
        var res = ecount.resource,
            defaultTitle = ecount.config.inventory.ITEM_TIT

        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }

        var excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);

        var excelSearch = this.searchFormParameter;
        excelSearch.EXCEL_FLAG = "Y";

        excelSearch.defaultTitle = defaultTitle;

        excelSearch.ExcelTitle = excelTitle;

        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListMgmtFieldByExcel",
            param: excelSearch
        });
        excelSearch.EXCEL_FLAG = "N";
    },

    onDropdownDeleteall: function () {
        var authMessage = {},
            res = ecount.resource;

        if (this.permission.Value != "W") {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: "U" }]);
            ecount.alert(authMessage.fullErrorMsg);
            return false;
        }

        var param = {
            width: 480,
            height: 280,
            isSendMsgAfterDelete: true,
            TABLES: 'SALE009',
            DEL_TYPE: 'Y',
            DELFLAG: 'Y',
            SAVENAME: '/ECERP/ESA/ESA011M',
            PARAM: this.searchFormParameter.PARAM
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: res.LBL02484,
            param: param,
            popupType: false,
            additional: true,
        })
    },

    // 사용방법설정 Dropdown Self-Customizing click event
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
    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    onHeaderQuickSearch: function (e, value) {
        this.header.lastReset(this.finalHeaderSearch);
        //this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    fnColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        // Put logic to draw a grid search terms
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // After the document is opening.
    onLoadComplete: function (e) {
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 관리에서 넘어온 경우가 아닐때만 포커스
            this.header.getQuickSearchControl().setFocus(0);
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 1060
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == "CM100P_02") {
            this.reloadPage();
        } else {
            if (["ESA012M"].contains(page.pageID))
                this._ON_REDRAW();
            else if (!["BulkUploadForm"].contains(page.pageID) || (message && message.IsClosedWebUpload === true))
                this.reloadPage();
        }

    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        //this.header.reset();
        //this.header.lastReset(this.searchFormParameter);
        this.header.lastReset(this.finalHeaderSearch);
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    onGridRenderComplete: function (e, data) {
        var self = this;

        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 관리에서 넘어온 경우가 아닐때만 포커스
            var control = this.header.getQuickSearchControl();
            control.setValue(self.searchFormParameter.PARAM);
            control.setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    // WebUploader button click event
    /*onFooterWebUploader: function (e) {
        var param = { width: 800, height: 600 },
            authMessage = {},
            res = ecount.resource;

        if (this.permission.Value == "R") {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: "W" }]);
            ecount.alert(authMessage.fullErrorMsg);
            return false;
        }

        this.openWindow({
            url: '/ECMain/EZS/EZS003M.aspx?DocCode=EZS023M&addrow=1&ForeignFlag=0&wonga_gubun=1&yymm_f=&yymm_t=',
            name: res.LBL02339,
            param: param,
            popupType: true,
            additional: true,
            fpopupID: this.ecPageID // 추가
        })
    },
    */
    // WebUploader button click event
    onFooterWebUploader2: function (e) {

        if (this.permission.Value == "R") {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: "W" }]);
            ecount.alert(authMessage.fullErrorMsg);
            return false;
        }

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/BulkUploadForm',
            name: ecount.resource.LBL02339,
            additional: true,
            popupType: false,
            param: {
                width: 1000,
                height: 640,
                FormType: 'SI973'
            }
        });
    },

    onFooterNew: function (cid) {
        var param = {},
            authMessage = {},
            res = ecount.resource;

        if (this.permission.Value == "R") {
            authMessage = ecount.common.getAuthMessage("", [{ MenuResource: res.LBL93295, PermissionMode: "W" }]);
            ecount.alert(authMessage.fullErrorMsg);
            return false;
        }

        param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 190,
            editFlag: "I",
            popupType: true,
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA012M',
            name: String.format(res.LBL09999, res.LBL00612),
            param: param,
            popupType: false,
            additional: false
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        this.CodeNoList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (!this.viewBag.Permission.permitESA011M.Value.equals("W")) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93295, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.CodeNoList += data.CODE_NO + ecount.delimiter;
            });

            if (self.CodeNoList.lastIndexOf(ecount.delimiter) == (self.CodeNoList.length - 1))
                self.CodeNoList = self.CodeNoList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }
            //self.showProgressbar();

            //삭제함수
            self.callDeleteListApi(self.CodeNoList, selectItem);

            //self.showProgressbar(false);
        });
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

    //Header Search button click event
    onHeaderSearch: function () {
        var self = this;
        self.searchFormParameter = $.extend({}, self.searchFormParameter, self.header.serialize().result);
        self.searchFormParameter.PARAM = "";
        self.searchFormParameter.BASE_DATE_CHK = self.searchFormParameter.EtcChk.length > 0 ? '1' : '';

        this.contents.getGrid().grid.clearChecked();

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

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
    setGridToolTip: function (value, rowItem) {
        var options = {},
            res = ecount.resource;

        options.data = ['Y'].contains(rowItem.CANCEL) ? res.LBL08030 : res.LBL00243;
        options.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
        };

        return options;
    },

    setReload: function () {
        var _gridObject = this.contents.getGrid();
        if (_gridObject) {
            _gridObject.grid.clearChecked();
            _gridObject.draw(this.searchFormParameter);
        }
        this.header.getQuickSearchControl().hideError();
    },

    reloadPage: function () {
        if (this.searchFormParameter.USE_GUBUN == "") {
            this.searchFormParameter.USE_GUBUN = "A";
        }
        this.onAllSubmit({
            url: "/ECERP/ESA/ESA011M",
            param: this.searchFormParameter
        });
    },

    setGridDataLink: function (value, rowItem) {
        var options = {},
            param = {},
            res = ecount.resource;

        options.data = value;
        options.controlType = "widget.link";
        options.event = {
            'click': function (e, data) {
                param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 190,
                    editFlag: "M",
                    useYn: data.rowItem['CANCEL'],
                    codeNo: data.rowItem['CODE_NO'],
                    codeName: data.rowItem['CODE_DES'],
                    modify_dt: data.rowItem['MODIFY_DT'],
                    MODIFY_ID: data.rowItem['MODIFY_ID'],
                };

                this.openWindow({
                    url: '/ECERP/ESA/ESA012M',
                    name: String.format(res.LBL06434, res.LBL00612),
                    param: param,
                    popupType: false,
                    additional: false
                });
                e.preventDefault();
            }.bind(this)
        };

        return options;
    },

    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "N")
            return true;
    },

    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("SelectedDelete");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {
            DeleteCodes: {
                MENU_CODE: "MgmtFieldCode",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                CHECK_TYPE: "S",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
            }
        };

        ecount.common.api({
            url: "/Inventory/Basic/DeleteSelectedListMgmtField",
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
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
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
            MENU_CODE: "MgmtFieldCode"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnMgmt(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnMgmt(this.getSelectedListforActivate("N"));
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();

        // 페이징 파라미터 세팅gridObj.draw(this.searchFormParameter);
        _self.searchFormParameter.PAGE_SIZE = 10000;
        _self.searchFormParameter.PAGE_CURRENT = 1;
        _self.searchFormParameter.LIMIT_COUNT = 100000;
        _self.searchFormParameter.EXCEL_FLAG = "N";
        _self.searchFormParameter.IS_FROM_BACKUP = true;

        _self.searchFormParameter = $.extend({}, _self.searchFormParameter, _self.header.serialize().result);
        _self.searchFormParameter.PARAM = "";
        _self.searchFormParameter.BASE_DATE_CHK = _self.searchFormParameter.EtcChk.length > 0 ? '1' : '';

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

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CODE_NO: data.CODE_NO,
                useYn: cancelYN,
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnMgmt: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.permitESA011M.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93295, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/Inventory/Basic/UpdateListState",
            data: Object.toJSON(updatedList),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.setReload();
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },

    dataSearch: function () {
        var gridObj = this.contents.getGrid("dataGrid");

        var tabId = this.header.currentTabId;
        var invalid = this.header.validate(tabId);
        if (invalid.result.length > 0) {
            return;
        }

        // 조회 당시 컨트롤 정보
        this.finalHeaderSearch = this.header.extract(true).merge();

        this.contents.getGrid().grid.removeShadedColumn();
        if (!this.viewBag.DefaultOption.ManagementType) {
            gridObj.draw(this.searchFormParameter);
        }        

        this.header.toggle(true);
    },

    getTargetTabId: function (allTabId) {
        var tabId = this.header.currentTabId;
        tabId = this.isCustomTab(tabId) ? tabId : (allTabId || "all");

        return tabId;
    },
});
