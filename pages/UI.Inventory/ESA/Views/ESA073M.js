window.__define_resource && __define_resource("BTN00113","BTN00007","LBL35004","LBL80071","LBL02997","LBL02475","LBL02025","LBL01387","LBL02538","LBL01250","LBL01523","LBL03289","LBL03290","LBL03291","LBL07243","LBL10029","LBL35213","LBL01448","BTN00204","LBL00870","LBL10548","LBL35526","BTN00460","BTN00330","LBL03311","LBL09022","LBL06431","BTN00026","BTN00050","BTN00959","BTN00033","BTN00203","BTN00008","LBL93296","LBL10291","MSG00141","LBL07436","LBL03176","LBL03017","LBL03334","LBL10270","LBL00703","LBL06425","LBL10292","LBL30177","LBL02985","LBL06445","MSG00299","MSG05754","MSG01488","MSG04752","LBL06434","LBL06436","LBL01899","LBL00640","LBL03755","LBL04294","LBL02238","LBL02813","LBL01249","LBL02513","LBL02512","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL02396","MSG00213");

/****************************************************************************************************
1. Create Date : 2015.09.16
2. Creator     : 조영상
3. Description : 특별단가등록 개선 > 적용단가
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                2018.09.20(Chung Thanh Phuoc) Add link navigation Item Code/Item Name  of Price Level Registration
                2018.10.16(PhiTa) Apply disable sort when data search > 1000
                2018.11.01 (PhiTa) Remove Apply disable sort > 1000
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2019.06.11 (NguyenDucThinh) A18_04171 Update resource
                2019.07.16 (문요한) - SALE004 MariaDB동기화
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA073M", {

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
    isViewFlag: true,
    isCustViewFlag: false,

    formTypeCode: 'SR987',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보

    init: function (options) {

        this._super.init.apply(this, arguments);
        this.permit = this.viewBag.Permission.Permit;
        this.Price2 = this.viewBag.InitDatas.GetSale007EGA028Sub;
        this.strGroupCode = $.isNull(this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG;

        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];

        this.searchFormParameter = {

            CLASS_GUBUN: this.strGroupCode,    // 그룹코드구분(품목그룹구분, 필수값)  
            PROD_CD: '',   //품목
            CODE_CLASS: this.code_class, // 특별단가그룹코드

            PROD_TYPE: '',             // 품목타입
            CLASS_CD1: '',   // 품목그룹1
            CLASS_CD2: '',   // 품목그룹2
            CLASS_CD3: '',   // 품목그룹3

            ALL_GROUP_PROD: '', // 품목그룹
            PROD_LEVEL_GROUP: "",
            PROD_LEVEL_GROUP_CHK: "",

            PAGE_SIZE: this.formInfoData.option.pageSize,
            PAGE_CURRENT: 0,
            SORT_COLUMN: 'CODE_CLASS',
            SORT_TYPE: 'A',
            QUICK_SEARCH: '',   //퀵서치
            IN_VAT_RATE: this.viewBag.InitDatas.DefaultIn_Vat_Rate,  // 매입단가비율
            CUST: this.cust,    // 거래처
            USE_YN: 'Y',
            FORM_TYPE: this.formTypeCode,
            FORM_SER: '1',
            INI_COM_CODE: this.viewBag.InitDatas.IniComCode
        };
    },

    render: function () {

        this._super.render.apply(this);
    },

    onInitHeader: function (header, resource) {

        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (this.viewBag.InitDatas.custyn == "N") {

            // 검색창 하단
            toolbar
                .setOptions({ css: "btn btn-default btn-sm" })
                .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))    // 검색
                .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));    // 다시작성

            // 검색창 내용
            form
                .add(ctrl.define("widget.multiCode.cust", "CUST", "CUST", ecount.resource.LBL35004).setOptions({ checkMaxCount: 1 }).end())   // 거래처
                .add(ctrl.define("widget.multiCode.prod", "PROD_CD", "PROD_CD", ecount.resource.LBL80071).maxSelectCount(100).setOptions({ groupId: "prod" }).end())    // 품목그룹
                .add(ctrl.define("widget.checkbox.prodType", "PROD_TYPE", "PROD_TYPE", ecount.resource.LBL02997, "prod").label([ecount.resource.LBL02475, ecount.resource.LBL02025, ecount.resource.LBL01387, ecount.resource.LBL02538, ecount.resource.LBL01250, ecount.resource.LBL01523]).value(['-1', '0', '4', '1', '2', '3']).select('-1').select('0').select('4').select('1').select('2').select('3').end())
                .add(ctrl.define("widget.multiCode.prodGroup", "CLASS_CD1", "CLASS_CD1", ecount.resource.LBL03289).maxSelectCount(100).setOptions({ groupId: "prod", defaultParam: { CLASS_GUBUN: "1", DEL_FLAG: "N", PROD_SEARCH: "5", PARAM: "", MENU_GUBUN: "", isApplyDisplayFlag: true } }).end())
                .add(ctrl.define("widget.multiCode.prodGroup", "CLASS_CD2", "CLASS_CD2", ecount.resource.LBL03290).maxSelectCount(100).setOptions({ groupId: "prod", defaultParam: { CLASS_GUBUN: "2", DEL_FLAG: "N", PROD_SEARCH: "5", PARAM: "", MENU_GUBUN: "", isApplyDisplayFlag: true, prodGroupCodeClass: "2" } }).end())
                .add(ctrl.define("widget.multiCode.prodGroup", "CLASS_CD3", "CLASS_CD3", ecount.resource.LBL03291).maxSelectCount(100).setOptions({ groupId: "prod", defaultParam: { CLASS_GUBUN: "3", DEL_FLAG: "N", PROD_SEARCH: "5", PARAM: "", MENU_GUBUN: "", isApplyDisplayFlag: true, prodGroupCodeClass: "3" } }).end())
                .add(ctrl.define("widget.multiCode.prodLevelGroup", "txtTreeGroupCd", "PROD_LEVEL_GROUP", ecount.resource.LBL07243).setOptions({ groupId: "prod" }).end())
                .add(ctrl.define("widget.multiCode.priceGroup", "txtPriceLevel", "CODE_CLASS", ecount.resource.LBL10029).maxSelectCount(100).end())   // 특별단가
                .add(ctrl.define("widget.checkbox.prodType", "USE_YN", "USE_YN", ecount.resource.LBL35213).label([ecount.resource.LBL02475, ecount.resource.LBL01448, ecount.resource.BTN00204]).value(['', 'Y', 'N']).select('Y').end())
                .add(ctrl.define("widget.checkbox", "BASE_DATE_CHK", "BASE_DATE_CHK", ecount.resource.LBL00870).label([ecount.resource.LBL10548]).end())
            contents
                .add(form)
                .add(toolbar);

            header.setTitle(ecount.resource.LBL35526)
                .useQuickSearch(true)
                .add("search")  //type, button list
                .add("option", [
                    { id: "SetGroupItem", label: ecount.resource.BTN00460 },
                    { id: "ListSettings", label: ecount.resource.BTN00330 }], false)
                .addContents(contents);
        }
        else {
            header.setTitle(this.name)
                .useQuickSearch(true)
                .notUsedBookmark();
        }
    },

    onInitContents: function (contents, resource) {

        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var tabContents = g.tabContents();
        var grid = g.grid();
        var thisObj = this;

        // 거래처 검색 유무
        if (thisObj.viewBag.InitDatas.custyn == "Y") {
            this.isCustViewFlag = true;
        }
        
        grid.setRowData(thisObj.viewBag.InitDatas.GridFirstLoad)
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(["COME_CDE"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCheckBoxUse(true)
            .setColumnFixHeader(true)
            .setCheckBoxRememberChecked(true)

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell("PROD_CD", this.setItemCodeLink.bind(this))
            .setCustomRowCell("PROD_DES", this.setItemDesValue.bind(this))
            .setCustomRowCell("PRICE_GUBUN", this.setGridAdjustmentContent.bind(this))
            .setCustomRowCell("PRICE_VAT_YN", this.setVatColumnValues.bind(this))
            .setCustomRowCell("PRICE_GROUP", this.setItemGroupValue.bind(this))
            .setCustomRowCell("PRICE", this.setItemPriceValue.bind(this))

        if (thisObj.viewBag.InitDatas.custyn == "N") {
            tabContents
                .onSingleMode()
                .createTab("tabESA072M", ecount.resource.LBL10029, null, false, "left") // 특별단가그룹별
                .createTab("tabESA070M", ecount.resource.LBL03311, null, true, "left") // 품목별
                .createTab("tabESA071M", ecount.resource.LBL09022, null, false, "left")  // 품목그룹별
                .createActiveTab("tabESA073M", ecount.resource.LBL06431, null, false, "left")   // 적용단가
            //.addGrid("dataGrid", grid);
            contents.add(tabContents);
        }
        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer, resource) {
        var thisObj = this;
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "change").label(ecount.resource.BTN00026).css("btn btn-default"));
        toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050)) // 엑셀
        if (thisObj.viewBag.InitDatas.custyn == "N") {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .addGroup([
                    { id: "Deactivate", label: ecount.resource.BTN00204 },
                    { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                    { id: "Activate", label: ecount.resource.BTN00203 }
                ]).css("btn btn-default")
                .noActionBtn().setButtonArrowDirection("up"));

        }
        else {
            toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        }

        footer.add(toolbar);
    },

    onFooterClose: function () {

        this.close();
    },
    onHeaderClose: function () {

        this.header.toggle();
    },

    onFooterChange: function () {
        var thisObj = this;
        var isOk = this.setCheckProd('change'); // 체크 확인

        if (isOk) {

            if (this.permit.Value != "W") {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }

            var code_class = "";
            var prod_cd = "";
            var kind = "";
            var param = {};
            var cust = "";
            var IsCustView = "N";
            var width = 0;
            var selectItem = this.contents.getGrid().grid.getChecked();
            self.selectedCnt = selectItem.length;

            $.each(this.contents.getGrid().grid.getChecked(), function (i, item) {
                code_class += item.CODE_CLASS + ecount.delimiter,
                    prod_cd += item.PROD_CD + ecount.delimiter,
                    kind += item.KIND + ecount.delimiter
            });

            // 거래처특별단가그룹리스트 접근 여부로 인한 파라미터값 재설정
            if (thisObj.viewBag.InitDatas.custyn == "N") {
                cust = this.header.getControl("CUST").getSelectedCode().toString();
                IsCustView = "N";
                width = 1350;
            }
            else {
                cust = this.cust;
                IsCustView = "Y";
                width = 950;
            }

            param = {
                width: width,
                height: 600,
                code_class: code_class,
                prod_cd: prod_cd,
                kind: kind,
                class_gubun: this.strGroupCode,
                cust: cust,
                IsCustView: IsCustView,
                popupType: false,
                additional: false
            };

            this.openWindow({
                url: '/ECERP/ESA/ESA073P_01',
                name: ecount.resource.LBL10291,
                param: param
            });
        }
    },
    // 엑셀버튼
    onFooterExcel: function () {

        var SearchResult = this.searchFormParameter;
        var USE_YN = "";

        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return false;
        }

        SearchResult.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        //SearchResult.Columns = [
        //       { propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '140' },  // 품목코드
        //        { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03334, width: '140' },    // 품목명
        //        { propertyName: 'PROD_CLASS_DES', id: 'PROD_CLASS_DES', title: ecount.resource.LBL10270, width: '120' },    // 그룹명
        //        { propertyName: 'PRICE_GROUP', id: 'PRICE_GROUP', title: ecount.resource.LBL00703, width: '100', align: 'left', isHideColumn: this.isViewFlag },
        //        { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL06425, width: '120', isHideColumn: this.isCustViewFlag },  // 특별단가그룹명
        //        { propertyName: 'PRICE_GUBUN', id: 'PRICE_GUBUN', title: ecount.resource.LBL10292, width: '230', align: 'center' },    // 품목그룹별조정내역
        //        { propertyName: 'PRICE', id: 'PRICE', title: ecount.resource.LBL06431, width: '150', align: 'right', dataType: "9" + ecount.config.inventory.DEC_P },  // 적용단가
        //        { propertyName: 'PRICE_VAT_YN', id: 'PRICE_VAT_YN', title: ecount.resource.LBL30177, width: '100', align: 'center' },    // VAT포함여부
        //];
        //SearchResult.isViewFlag = this.isViewFlag;
        //SearchResult.isCustViewFlag = this.isCustViewFlag;
        SearchResult.SheetNm = this.viewBag.InitDatas.custyn == "N" ? ecount.resource.LBL35526 : this.name;
        SearchResult.EXCEL_FLAG = "Y";
        this.EXPORT_EXCEL({
            url: "/Inventory/Basic/GetListPriceApplyByItemSale004GForExcel",
            param: SearchResult
        });

        SearchResult.EXCEL_FLAG = "N";
    },
    onContentsSearch: function (e, value) {

        this.header.getQuickSearchControl().setValue("");
        this.searchFormParameter.QUICK_SEARCH = '';
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    onLoadComplete: function () {

        this.viewBag.InitDatas.custyn == "N";
        this.header.getQuickSearchControl().setFocus(0);
    },

    onHeaderSearch: function (e, value) {

        this.header.getQuickSearchControl().setValue("");
        this.searchFormParameter.QUICK_SEARCH = '';

        this.setReload(this);
    },

    // Change Tab
    onChangeContentsTab: function (event) {

        var urlParam = "";
        this.currentTabId = event.tabId;

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

    onHeaderQuickSearch: function (e, value) {

        this.searchFormParameter.QUICK_SEARCH = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.QUICK_SEARCH);
            control.setFocus(0);
        }
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListPriceApplyByItem");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
    },

    onPopupHandler: function (control, config, handler) {

        config.popupType = false;
        config.additional = false;

        // 품목 그룹 코드
        if (control.id === "CLASS_CD1" || control.id === "CLASS_CD2" || control.id === "CLASS_CD3") {  // product group
            config.isApplyDisplayFlag = true;       // apply 
            config.isCheckBoxDisplayFlag = true;    // checkbox
            config.isIncludeInactive = true;        // 
            config.titlename = control.subTitle;

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
        else if (control.id == "PROD_CD") {
            config.width = 600;
            config.height = 645;
            config.isApplyDisplayFlag = true;
            config.isCheckBoxDisplayFlag = true;
            config.isIncludeInactive = true;
            config.name = ecount.resource.LBL02985;
        }
        else if (control.id == "CUST") {
            config.isApplyDisplayFlag = false;
            config.isCheckBoxDisplayFlag = false;
            config.isIncludeInactive = true;
            config.checkMaxCount = 1;
        }

        handler(config);
    },

    onHeaderReset: function () {

        this.header.reset();
        this.header.getControl("CUST").setFocus(0);
    },

    onMessageHandler: function (page, message) {

        var thisobj = this;
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
            // 적용단가 변경
            case "ESA073P_01":
                this.contents.getGrid().draw(this.searchFormParameter);
                message.callback && message.callback();
                break;
            case "ESA014P_02":
            case "ESA071P_02":
                this.setReload(this);
                break;
            case "CM100P_02":
                this.reloadPage(this);
                break;


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

    onColumnSortClick: function (e, data) {

        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.searchFormParameter.BASE_DATE_CHK = "";
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onDropdownSetGroupItem: function () {

        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 220,
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




    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {

        var selectItem = this.contents.getGrid().grid.getChecked();
        var objthis = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var isOk = this.setCheckProd('del');
        var msg = ecount.resource.MSG00299;

        if (isOk) {

            if (this.permit.Value != "W") {
                btnDelete.setAllowClick();
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93296, PermissionMode: "D" }]);
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }

            $.each(selectItem, function (i, data) {

                if (data.KIND == "1") {
                    msg = ecount.resource.MSG05754;
                }
            });

            var contentLists = [];

            $.each(selectItem, function (i, data) {

                contentLists.push({
                    CUST: data.CODE_CLASS,
                    PROD_CD: data.PROD_CD,
                    CLASS_GUBUN: objthis.strGroupCode,
                    CODE_CLASS: data.CODE_CLASS,
                    CLASS_CD: data.CLASS_CD,
                    KIND: data.KIND
                })
            })

            ecount.confirm(msg, function (status) {
                if (status === true) {

                    ecount.common.api({
                        url: "/SVC/Inventory/Basic/DeleteProdGroup",
                        data: Object.toJSON({
                                Request: {
                                    Data: contentLists
                                }
                            }),
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
                } else {
                    btnDelete.setAllowClick();
                }
            });
        }
    },




    setCheckProd: function (kind) {

        var isOk = true,
            _self = this;

        var selectItem = this.contents.getGrid().grid.getChecked(); // 체크 확인
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

    // Set [Item Code] column link
    setItemCodeLink: function (value, rowItem) {
        var option = {};
        var res = this.resource;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {};

                if (data.rowItem.KIND == "1") {
                    param = {
                        width: ecount.infra.getPageWidthFromConfig(true),
                        height: 530,
                        editFlag: 'M',
                        CODE_CLASS: data.rowItem.CODE_CLASS,
                        CLASS_CD: data.rowItem.CLASS_CD,
                        CLASS_GUBUN: this.strGroupCode,
                        url: '/ECERP/ESA/ESA071P_02'
                    };
                } else {
                    // Define data transfer object
                    param = {
                        width: ecount.infra.getPageWidthFromConfig(true),
                        height: 280,
                        editFlag: 'M',
                        code_class: data.rowItem.CODE_CLASS,
                        prod_cd: data.rowItem.PROD_CD,
                        DEL_GUBUN: data.rowItem.DEL_GUBUN,
                        url: '/ECERP/ESA/ESA014P_02',
                    };
                }
                // Open popup
                this.openWindow({
                    url: param.url,
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

    setItemDesValue: function (value, rowItem) {

        var option = {};
        if (rowItem.SIZE_DES != undefined && rowItem.SIZE_DES != "")
            option.data = value + ' [' + rowItem.SIZE_DES + ']';
        else
            option.data = value;
        return option;
    },

    setItemGroupValue: function (value, rowItem) {

        var option = {};
        var priceGroup1 = rowItem.PRICE_GROUP;
        var priceGroup2 = rowItem.PRICE_GROUP2;

        if (!$.isEmpty(priceGroup1) && !$.isEmpty(priceGroup2)) {
            option.data = (String.format(ecount.resource.LBL01899 + '/' + ecount.resource.LBL00640));
        }
        else if (!$.isEmpty(priceGroup1) && $.isEmpty(priceGroup2)) {
            option.data = ecount.resource.LBL01899;
        }
        else if ($.isEmpty(priceGroup1) && !$.isEmpty(priceGroup2)) {
            option.data = ecount.resource.LBL00640;
        }
        else {
            option.data = "";
        }
        return option;
    },

    setItemPriceValue: function (value, rowItem) {

        var option = {};

        //if (!$.isEmpty(value)) {
        //    option.dataType = String.format('9{0}', ecount.config.inventory.DEC_P);
        //    option.data = ecount.grid.helper.getDecimalValueByConvertor(rowItem.PRICE, option);
        //}
        return option;

    },

    setVatColumnValues: function (value, rowItem) {

        var option = {};
        if (['Y'].contains(rowItem.PRICE_VAT_YN)) {
            option.data = ecount.resource.LBL03755;
        } else {
            option.data = ecount.resource.LBL04294;
        }
        return option;
    },

    setRowBackgroundColor: function (data) {
        if (data["USE_YN"] == "N")
            return true;
    },


    setGridAdjustmentContent: function (value, rowItem) {

        var option = {};

        if (rowItem.KIND == "1") {
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
            //this.iPriceRate = Math.floor(Number(rowItem.PRICE_RATE));

            var sPriceRate = String.fastFormat(this.iPriceRate, {
                fractionLimit: ecount.config.inventory.DEC_RATE,
                removeFractionIfZero: true
            });

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
        }
        else {
            option.data = ecount.resource.LBL02396;
        }
        return option;
    },

    // Reload
    setReload: function (e) {

        var form = this.header.serialize();
        var invalid = this.header.validate();

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            return false;
        }


        $.extend(this.searchFormParameter, this.searchFormParameter, form.result);
        this.searchFormParameter.BASE_DATE_CHK = (this.searchFormParameter.BASE_DATE_CHK != null && this.searchFormParameter.BASE_DATE_CHK != undefined && this.searchFormParameter.BASE_DATE_CHK.length > 0) ? "1" : "0";

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.toggle(true);
    },

    reloadPage: function () {
        var self = this;

        this.onAllSubmitSelf({
            url: "/ECERP/ESA/ESA073M",
            PARAM: this.searchFormParameter.PARAM
        });
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onHeaderSearch();
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnApplyPrice(this.getSelectedListforActivate("Y"), "Y");
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnApplyPrice(this.getSelectedListforActivate("N"), "N");
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var self = this;
        var updatedList = {
            Data: []
        };

        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CUST: data.CODE_CLASS,
                PROD_CD: data.PROD_CD,
                CLASS_GUBUN: self.strGroupCode,
                CODE_CLASS: data.CODE_CLASS,
                CLASS_CD: data.CLASS_CD,
                KIND: data.KIND,
                PRICE_GUBUN: data.PRICE_GUBUN,
                PRICE_RATE: data.PRICE_RATE,
                PRICE_LESS: data.PRICE_LESS,
                PRICE_RISE: data.PRICE_RISE,
                USE_YN: cancelYN,
                OLD_CODE_CLASS: data.CODE_CLASS,
                DEL_GUBUN: cancelYN == "Y" ? "N" : "Y",
                EDIT_MODE: ecenum.editMode.modify
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnApplyPrice: function (updatedList, cancelYN) {
        var self = this;
        var btn = this.footer.get(0).getControl("deleteRestore");
        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        var msg = ecount.resource.MSG00299;
        $.each(updatedList.Data, function (i, data) {

            if (data.KIND == "1") {
                msg = ecount.resource.MSG05754;
            }
        });

        if (cancelYN == "N") {
            ecount.confirm(msg, function (status) {
                if (status === false) {
                    btn.setAllowClick();
                } else {
                    ecount.common.api({
                        url: "/SVC/Inventory/Basic/UpdateListStatusApplyPriceLevel",
                        data: Object.toJSON({
                            Request: {
                                Data:updatedList.Data
                            }
                        }),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg + result.Data);
                            }
                            else {
                                self.setReload(self);
                            }
                        }.bind(this),
                        complete: function (e) {
                            btn.setAllowClick();
                        }
                    });
                }
            });
        } else {
            ecount.common.api({
                url: "/SVC/Inventory/Basic/UpdateListStatusApplyPriceLevel",
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
                        self.setReload(self);
                    }
                }.bind(this),
                complete: function (e) {
                    btn.setAllowClick();
                }
            });

        }

    },
});

