window.__define_resource && __define_resource("BTN00863","BTN00113","BTN00007","LBL10029","LBL02999","LBL35213","LBL02475","LBL01448","BTN00204","LBL10548","LBL35526","BTN00460","BTN00330","LBL03311","LBL09022","LBL06431","BTN00043","BTN00026","BTN00028","BTN00050","BTN00959","BTN00033","BTN00203","LBL93296","LBL09999","LBL10030","MSG00299","LBL06441","LBL10290","MSG00141","LBL07436","LBL03176","LBL03495","LBL10270","LBL06425","LBL06449","LBL06446","LBL06445","MSG01488","MSG04752","LBL02238","LBL02813","LBL01249","LBL02513","LBL02512","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL06434","LBL93292","MSG00213");

/****************************************************************************************************
1. Create Date : 2015.09.14
2. Creator     : 조영상
3. Description : 특별단가등록 개선 > 품목그룹별
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16 (Thien.Nguyen) add function scroll top for page, modify onMessageHandler function
                 2018.09.20 (Chung Thanh Phuoc) Add link navigation Item Code/Item Name  of Price Level Registration
                 2018.10.16 (PhiTa) Apply disable sort when data search > 1000
                 2019.02.16 (Nguyen Thi Ngoc Han) [A18_03373] Fix Error [55689] : Apply rows number on page after template setup : 1. Add function reloadPage(),
                                                                                                                                   2. Add more conditon if for pageId is [CM100P_02] at function onMessageHandler()
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.12.20 (김봉기) : 데이터백업 관련 파라미터 추가
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA071M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    strGroupCode: null,
    permit: null,
    strPriceGubun: null,
    strPriceRise: null,
    strPriceLess: null,
    iPriceRate: null,
    Price2: null,

    formTypeCode: 'SR986',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.permit = this.viewBag.Permission.Permit;
        this.Price2 = this.viewBag.InitDatas.GetSale007EGA028Sub;
        this.strGroupCode = $.isNull(this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG;

        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];

        this.searchFormParameter = {
            QUICK_SEARCH: '',                   //퀵서치
            CODE_CLASS: '', // 특별단가그룹코드
            CLASS_CD: '',   // 품목그룹
            USE_YN: 'Y',
            CLASS_GUBUN: this.strGroupCode,    // 그룹코드구분(품목그룹구분, 필수값)  
            PAGE_SIZE: this.formInfoData.option.pageSize,
            PAGE_CURRENT: 0,
            SORT_COLUMN: 'CODE_CLASS',
            SORT_TYPE: 'A',
            FORM_TYPE: this.formTypeCode,
            FORM_SER: '1',
            INI_COM_CODE: this.viewBag.InitDatas.IniComCode
        };

        if (this.isShowSearchForm == null) {   // 데이터관리에서 넘어 온경우 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "2";
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    // [헤더] 검색창, 버튼 셋팅
    onInitHeader: function (header, resource) {

        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

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
            // 검색창 하단
            toolbar
                .setOptions({ css: "btn btn-default btn-sm" })
                .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))    // 검색
                .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));    // 다시작성
        }
        // 검색창 내용
        form
            .add(ctrl.define("widget.multiCode.priceGroup", "txtPriceLevel", "CODE_CLASS", ecount.resource.LBL10029).end())   // 특별단가
            .add(ctrl.define("widget.multiCode.prodGroup", this.strGroupCode == "1" ? "txtClassCd1" : this.strGroupCode == "2" ? "txtClassCd2" : "txtClassCd3", "CLASS_CD", ecount.resource.LBL02999).end())  // 품목코드
            .add(ctrl.define("widget.checkbox.prodType", "USE_YN", "USE_YN", ecount.resource.LBL35213).label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value(['', 'Y', 'N']).select('Y').end())
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
            header.setTitle(ecount.resource.LBL35526)
                .useQuickSearch(true)
                .add("search")  //type, button list
                .add("option", [
                    { id: "SetGroupItem", label: ecount.resource.BTN00460 },
                    { id: "ListSettings", label: ecount.resource.BTN00330 }], false)   // 품목 그룹설정
                .addContents(contents);
        }
    },

    onLoadComplete: function () {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    // [컨텐츠] 리스트 셋팅
    onInitContents: function (contents, resource) {

        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var tabContents = g.tabContents();
        var grid = g.grid();
        var thisObj = this;

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            grid.setRowData(this.viewBag.InitDatas.GridFirstLoad);
        }

        // 데이터 연동
        grid.setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(["CLASS_CD", "CODE_CLASS"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCheckBoxUse(true)
            .setCheckBoxRememberChecked(true)
            .setColumnFixHeader(true)

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['PRICE_GUBUN'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell('PRICE_GUBUN', this.setGridAdjustmentContent.bind(this))
            .setCustomRowCell("CLASS_CD", this.setCodeLink.bind(this))
            .setCustomRowCell("CLASS_DES", this.setCodeLink.bind(this))
            .setCustomRowCell("CODE_CLASS_DES", this.setCodeLink.bind(this))
            .setEventShadedColumnId(['CLASS_CD'], { useIntegration: true, isAllRememberShaded: true })

        // 탭 설정
        tabContents
            .onSingleMode()
            .createTab("tabESA072M", ecount.resource.LBL10029, null, false, "left") // 특별단가그룹별
            .createTab("tabESA070M", ecount.resource.LBL03311, null, true, "left") // 품목별
            .createActiveTab("tabESA071M", ecount.resource.LBL09022, null, false, "left")  // 품목그룹별
            .createTab("tabESA073M", ecount.resource.LBL06431, null, false, "left")   // 적용단가
            .addGrid("dataGrid", grid);

        contents.add(tabContents);
        contents.add(toolbar);
    },

    // Search button click event
    onContentsSearch: function (e, value) {
        this.header.getQuickSearchControl().setValue("");
        this.searchFormParameter.QUICK_SEARCH = '';
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // [하단] 버튼 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043))    // 신규(F2)
            .addLeft(ctrl.define("widget.button", "change").label(ecount.resource.BTN00026)) // 변경
            .addLeft(ctrl.define("widget.button", "copy").label(ecount.resource.BTN00028))   // 복사
            .addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050)) // 엑셀
            .addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
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

    // 검색 버튼
    onHeaderSearch: function (e, value) {
        this.header.getQuickSearchControl().setValue("");
        this.searchFormParameter.QUICK_SEARCH = '';
        this.setReload(this);
    },

    onHeaderClose: function () {
        this.header.toggle();
    },

    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.searchFormParameter.QUICK_SEARCH = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().grid.removeShadedColumn();
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 리스트 랜더링 후 API 호출(파라미터 전달)
    onGridRenderComplete: function (e, data, gridObj) {        
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);

        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.QUICK_SEARCH);
            control.setFocus(0);
        }

        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListPriceLevelByItem");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
    },

    // 탭 변경 이벤트
    onChangeContentsTab: function (event) {

        this.currentTabId = event.tabId;
        console.log(this.currentTabId);

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

    // 팝업 오픈 이벤트
    onPopupHandler: function (control, config, handler) {

        config.popupType = false;
        config.additional = false;

        // 품목 그룹 코드
        if (control.id === "txtClassCd1" || control.id === "txtClassCd2" || control.id === "txtClassCd3") {  // product group
            config.isApplyDisplayFlag = true;       // apply 
            config.isCheckBoxDisplayFlag = true;    // checkbox
            config.isIncludeInactive = true;        // 
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

    // 신규 저장 이벤트
    onFooterNew: function () {

        if (this.permit.Value == "R") {

            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 530,
            editFlag: "I",
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            CLASS_GUBUN: this.strGroupCode
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA071P_02',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL10030),
            param: param,
            popupType: false,
            additional: false
        })
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    onButtonSelectedDelete: function () {

        var selectItem = this.contents.getGrid().grid.getChecked();
        var objthis = this;
        var isOk = this.setCheckProd('del');
        var btnDelete = this.footer.get(0).getControl("deleteRestore");

        if (isOk) {


            if (this.permit.Value != "W") {
                btnDelete.setAllowClick();
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "D" }]);
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }

            var arrPriceItemBatch = [];
            ecount.confirm(ecount.resource.MSG00299, function (status) {
                if (status === true) {
                    $.each(selectItem, function (i, data) {
                        var param = {
                            CLASS_CD: data.CLASS_CD,
                            CODE_CLASS: data.CODE_CLASS
                        };
                        arrPriceItemBatch.push(param);
                    });

                    ecount.common.api({
                        url: "/SVC/Inventory/Basic/DeleteBathPriceItemGroup",
                        data: Object.toJSON({ Request: { Data : arrPriceItemBatch }}),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            }
                            else {
                                objthis.setReload(this);
                            }
                        },
                        complete: function () {
                            btnDelete.setAllowClick();
                        }
                    });
                }
                btnDelete.setAllowClick();
                
            });
        } else {
            btnDelete.setAllowClick();
        }
    },

    // 다시작성 버튼
    onHeaderReset: function () {
        this.header.reset();
        this.header.getControl("txtPriceLevel").setFocus(0);
    },

    // 복사 이벤트
    onFooterCopy: function () {

        if (this.permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 210,
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            CLASS_GUBUN: this.strGroupCode
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA071P_03',
            name: ecount.resource.LBL06441,
            param: param,
            popupType: false,
            additional: false
        })
    },

    // 변경
    onFooterChange: function () {

        // 체크 여부 확인
        var isOk = this.setCheckProd('change');

        if (isOk) {


            if (this.permit.Value == "R") {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }

            var code_class = "";
            var class_cd = "";
            var selectItem = this.contents.getGrid().grid.getChecked();

            self.selectedCnt = selectItem.length;

            $.each(this.contents.getGrid().grid.getChecked(), function (i, item) {
                code_class += item.CODE_CLASS + ecount.delimiter,
                    class_cd += item.CLASS_CD + ecount.delimiter
            });

            this.openWindow({
                url: '/ECERP/ESA/ESA071P_01',
                name: ecount.resource.LBL10290, // (품목별선택변경)
                param: {
                    width: 1100,
                    height: 600,
                    code_class: code_class,
                    class_cd: class_cd,
                    class_gubun: this.strGroupCode,
                    popupType: false,
                    additional: false
                }
            });
        }
    },

    // 엑셀버튼
    onFooterExcel: function () {

        var SearchResult = this.searchFormParameter;
        var USE_YN = "";

        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            //ecount.alert(ecount.resource.MSG00141)
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        SearchResult.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        //SearchResult.Columns = [
        //        { propertyName: 'CLASS_CD', id: 'CLASS_CD', title: ecount.resource.LBL03495, width: '120' },
        //        { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL10270, width: '150' },
        //        { propertyName: 'CODE_CLASS_DES', id: 'CODE_CLASS_DES', title: ecount.resource.LBL06425, width: '150' },
        //        { propertyName: 'PRICE_GUBUN', id: 'PRICE_GUBUN', title: ecount.resource.LBL09022 + ' ' + ecount.resource.LBL06449, width: '', align: 'center' }
        //];
        SearchResult.EXCEL_FLAG = "Y";
        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListPriceLevelByItemSale007ForExcel",
            param: SearchResult
        });
    },

    // 품목그룹 팝업 변경 이벤트
    onDropdownSetGroupItem: function () {
        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06446, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 300,
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            strGroupCode: this.strGroupCode
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA027P_01',
            name: ecount.resource.LBL06445,
            param: param,
            popupType: false,
            additional: false
        })
    },

    // 메시지 내려주기
    onMessageHandler: function (page, message) {
        var thisobj = this;
        if (page.pageID == 'CM100P_02') {
            this.reloadPage();
        }

        else if (page.pageID == "ESA016M") {
            this.setReload(this);
        } else {
            if (message == "RESET") {
                this.contents.getGrid().draw(this.searchFormParameter);
                message.callback && message.callback();
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 530,
                    editFlag: "I",
                    parentPageID: this.pageID,
                    popupType: true,
                    responseID: this.callbackID,
                    CLASS_GUBUN: this.strGroupCode
                };

                this.openWindow({
                    url: '/ECERP/ESA/ESA071P_02',
                    naem: String.format(ecount.resource.LBL09999, ecount.resource.LBL10030),
                    param: param,
                    popupType: false,
                    additional: false
                })
            }
            else {

                switch (page.pageID) {
                    // 특별단가
                    case "CM020P":
                        this.searchFormParameter.CODE_CLASS = message.data.CODE_CLASS;
                        message.callback && message.callback();

                        break;
                    // 품목그룹구분설정
                    case "ESA027P_01":
                        this.strGroupCode = message.data.GroupCode;
                        this.searchFormParameter.CLASS_GUBUN = message.data.GroupCode;
                        this.setReload(this);
                        break;
                    // 품목그룹
                    case "ES005P":
                        this.searchFormParameter.CLASS_CD = message.data.CLASS_CD;
                        message.callback && message.callback();
                        break;

                    default:
                        if (["ESA071P_02"].contains(page.pageID))
                            this._ON_REDRAW();
                        else
                            this.contents.getGrid().draw(this.searchFormParameter);
                        message.callback && message.callback();
                        break;
                }
            }
        }
    },

    //리스트설정
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

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.BASE_DATE_CHK = "";
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
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
        
        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            _self.hideProgressbar();
            return false;
        }

        var form = _self.header.serialize();
        $.extend(_self.searchFormParameter, _self.searchFormParameter, form.result);
        this.searchFormParameter.BASE_DATE_CHK = (_self.searchFormParameter.BASE_DATE_CHK != null && _self.searchFormParameter.BASE_DATE_CHK != undefined && _self.searchFormParameter.BASE_DATE_CHK.length > 0) ? "1" : "0";

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
    // 내용 재설정
    setReload: function (e) {      
        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            return false;
        }

        var form = this.header.serialize();
        $.extend(this.searchFormParameter, this.searchFormParameter, form.result);
        this.searchFormParameter.BASE_DATE_CHK = (this.searchFormParameter.BASE_DATE_CHK != null && this.searchFormParameter.BASE_DATE_CHK != undefined && this.searchFormParameter.BASE_DATE_CHK.length > 0) ? "1" : "0";
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.draw(this.searchFormParameter);
        this.header.toggle(true);
    },
    /// Sử dụng sau khi Template Setup 
    reloadPage: function () {        
        var self = this;

        this.onAllSubmitSelf({
            url: "/ECERP/ESA/ESA071M",
            PARAM: this.searchFormParameter.PARAM
        });
    },
    // 리스트 체크 선택 여부
    setCheckProd: function (kind) {

        var isOk = true,
            _self = this;

        // 체크 확인
        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        // 품목 선택 여부 체크
        if (self.selectedCnt == 0) {
            if (kind == 'del') {
                ecount.alert(ecount.resource.MSG01488);
            }
            else {
                ecount.alert(ecount.resource.MSG04752);
            }

            return false;
        }

        return isOk;
    },

    // 리스트 품목그룹별 조정내역 내용 바인딩
    setGridAdjustmentContent: function (value, rowItem) {

        var option = {};

        //set strPriceGubun Value
        if (rowItem.PRICE_GUBUN == "I") { this.strPriceGubun = ecount.resource.LBL02238 }
        else if (rowItem.PRICE_GUBUN == "O") { this.strPriceGubun = ecount.resource.LBL02813 }
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
        if (rowItem.PRICE_RISE == "R") { this.strPriceRise = ecount.resource.LBL01249 }
        else if (rowItem.PRICE_RISE == "C") { this.strPriceRise = ecount.resource.LBL02513 }
        else if (rowItem.PRICE_RISE == "F") { this.strPriceRise = ecount.resource.LBL02512 }

        this.iPriceRate = Math.floor(Number(rowItem.PRICE_RATE) * Number(Math.pow(10, 4))) / Number(Math.pow(10, 4));
        var sPriceRate = String.fastFormat(this.iPriceRate, {
            fractionLimit: ecount.config.inventory.DEC_RATE,
            removeFractionIfZero: true
        });

        //this.iPriceRate = Math.floor(Number(rowItem.PRICE_RATE));

        if (rowItem.PRICE_LESS == "1000000.0000000000") this.strPriceLess = ecount.resource.LBL00097;
        if (rowItem.PRICE_LESS == "100000.0000000000") this.strPriceLess = ecount.resource.LBL00096;
        if (rowItem.PRICE_LESS == "10000.0000000000") this.strPriceLess = ecount.resource.LBL00095;
        if (rowItem.PRICE_LESS == "1000.0000000000") this.strPriceLess = ecount.resource.LBL00094;
        if (rowItem.PRICE_LESS == "100.0000000000") this.strPriceLess = ecount.resource.LBL00093;
        if (rowItem.PRICE_LESS == "10.0000000000") this.strPriceLess = ecount.resource.LBL00084;
        if (rowItem.PRICE_LESS == "1.0000000000") this.strPriceLess = ecount.resource.LBL00085;
        if (rowItem.PRICE_LESS == "0.1000000000") this.strPriceLess = ecount.resource.LBL00086;
        if (rowItem.PRICE_LESS == "0.0100000000") this.strPriceLess = ecount.resource.LBL00087;
        if (rowItem.PRICE_LESS == "0.0010000000") this.strPriceLess = ecount.resource.LBL00088;
        //option.data = this.strPriceGubun + '/' + this.iPriceRate + '/' + this.strPriceLess + '/' + this.strPriceRise;
        option.data = this.strPriceGubun + '/' + sPriceRate + '/' + this.strPriceLess + '/' + this.strPriceRise;
        return option;
    },

    setRowBackgroundColor: function (data) {
        if (data["USE_YN"] == "N")
            return true;
    },

    // 품목그룹링크 클릭(상세보기)
    setCodeLink: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 530,
                    editFlag: 'M',
                    CODE_CLASS: data.rowItem['CODE_CLASS'],
                    CLASS_CD: data.rowItem['CLASS_CD'],
                    parentPageID: this.pageID,
                    responseID: this.callbackID,
                    CLASS_GUBUN: this.strGroupCode
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA071P_02',
                    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL10030), // (품목그룹별단가변경)
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },


    /********************************************************************** 
  *  hotkey [f1~12, 방향키등.. ] 
  **********************************************************************/
    //F2 신규
    ON_KEY_F2: function () {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onFooterNew();
        }
    },

    //F8 적용
    ON_KEY_F8: function () {
        if (!this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch();
        }
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
        if (e.target != null && e.target.name == "USE_YN" && !this.viewBag.DefaultOption.ManagementType) {
            this.header.getControl("search").setFocus(0);
        }
    },

    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
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
        this.updateActiveYnPriceByItemGrp(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnPriceByItemGrp(this.getSelectedListforActivate("N"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            debugger
            updatedList.Data.push({
                CLASS_CD: data.CLASS_CD,
                CODE_CLASS: data.CODE_CLASS,
                PRICE_GUBUN: data.PRICE_GUBUN,
                PRICE_RATE: data.PRICE_RATE,
                PRICE_LESS: data.PRICE_LESS,
                PRICE_RISE: data.PRICE_RISE,
                USE_YN: cancelYN,
                OLD_CODE_CLASS: data.CODE_CLASS

            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnPriceByItemGrp: function (updatedList) {

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
            url: "/SVC/Inventory/Basic/UpdateListStatusPriceLevel",
            data: Object.toJSON({ Request:  updatedList }),
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
