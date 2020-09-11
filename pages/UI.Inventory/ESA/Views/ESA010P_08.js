window.__define_resource && __define_resource("LBL00731","BTN00113","BTN00351","BTN00007","LBL02874","LBL02878","MSG03839","BTN00004","BTN00603","BTN00043","BTN00008","BTN80047","BTN00069","LBL35185","LBL70203","MSG02158","MSG00962","LBL35181","LBL11726","MSG00141","LBL07436","MSG00303","MSG00299");
/****************************************************************************************************
1. Create Date : 2015.10.30
2. Creator     : 전영준
3. Description : 재고>기초등록>품목등록 > 규격그룹 등록> 코드등록 
4. Precaution  :
5. History     : 2016.05.04 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.11.20 (김용석) A19_03839 - 타이틀(코드,코드명) 클릭으로 정렬시 반응없는 문제 수정
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_08", {

    /**********************************************************************
    *  page init
    **********************************************************************/
    PageTitle: null,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: this.PARAM?this.PARAM:"",
            PARAM2: (!$.isNull(this.PARAM2)) ? this.PARAM2 : ' ',
            PARAM3: (!$.isNull(this.PARAM3)) ? this.PARAM3 : ' ',
            CODE_CLASS: this.CODE_CLASS,
            TITLE: this.TITLE,
            SORT_COLUMN: 'CODE_NO',                         // 정렬할 기준컬럼
            ListFlag: this.ListFlag == "List" ? true : false,
            DEL_FLAG: this.ListFlag == "List" ? "" : "N"
        };
        ;
        this.isUseExcelConvert = ecount.config.user.USE_EXCEL_CONVERT;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(this.ListFlag == "List" ? this.searchFormParameter.TITLE : ecount.resource.LBL00731).useQuickSearch();

        if (this.isIncludeInactive) {
            //퀵서치 추가
            var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
            var ctrl = widget.generator.control();

            //검색하단 버튼
            //toolbar
            //    .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

            //if (this.isIncludeInactive) {
            //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
            //}
            toolbar.addLeft(ctrl.define("widget.button.group", "search")
                .label(ecount.resource.BTN00113)
            );

            //검색하단 버튼
            toolbar
                .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

            //코드, 코드명 검색어
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL02874).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL02878).end())

            contents.add(form1);    //검색어
            contents.add(toolbar);  //버튼

            header.add("search")
                .addContents(contents);
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        var columns = [
                { propertyName: 'CODE_NO', id: 'CODE_NO', title: ecount.resource.LBL02874, width: '' }, //코드
                { propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL02878, width: '' }, // 코드명
        ]
  
        settings
            .setRowDataUrl('/Inventory/Common/GetListSpecForCodeSearch')
            .setRowData(this.viewBag.InitDatas.ListLoad)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CODE_NO', 'SIZE_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnSortable(true)
            .setCheckBoxUse(true)            
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCustomRowCell('CODE_NO', this.setGridDateLink.bind(this))
            .setCustomRowCell('SIZE_DES', this.setGridDateLink.bind(this))
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardEnterForExecute(true)
            .setEventFocusOnInit(true);
        if (this.ListFlag != "List") {            
            settings.setCheckBoxMaxCount(100)    // [A18_02078] 다규격 품목등록 시, 규격코드를 5개 이상  위젯 전체에서 선택할수 있는 수는 1000개지만 한번에 선택할수 있는건 100개여서 따로 처리
            settings.setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            });
        }

        settings.setColumns(columns);

        this.searchFormParameter.columns = columns;

        //툴바
        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004,  //검색
        //        status:  this.isIncludeInactive ? [{ value: 'Y', label: ecount.resource.BTN00351 }, { value: 'N', label: ecount.resource.BTN00603 }] : null
        //    }));

        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
               ctrl = widget.generator.control();
        if (this.ListFlag == "List") {
            toolbar
                .addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).end())
                .addLeft(ctrl.define("widget.button", "Excel").label("Excel").end())
                .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).end())
                .addLeft(ctrl.define("widget.button", "DeleteMulti").label(ecount.resource.BTN80047).end())
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([10, 11]));
        } else {
            if (this.isApplyDisplayFlag) {
                toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
            }
            if (this.isNewDisplayFlag) {
                toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).end()) //신규(F2)
            }
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }
        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        debugger
        switch (cid) {
            case "search":
                if (this.isIncludeInactive) {
                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
                }
                break;
            default:
                break;
        }
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                ;
                if (this.ListFlag == "List") {
                    var param = {
                        width: 600,
                        height: 200,
                        EDIT_FLAG: true,
                        CODE_CLASS: this.CODE_CLASS,// CODE_CLASS 
                        CODE_NO: data.rowItem.CODE_NO
                    };
                    // Open popup                
                    this.openWindow({
                        url: '/ECERP/ESA/ESA010P_09',
                        //name: String.format("그룹코드명", "리스트"), 이런식으로 이름 변경 
                        name: ecount.resource.LBL35185 + ecount.resource.LBL70203, //"그룹코드수정",
                        param: param,
                        popupType: false,
                        additional: false
                    });
                } else {
                    var message = {
                        name: "SIZE_DES",
                        code: "CODE_NO",
                        data: data.rowItem,
                        isAdded: true,
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }
                e.preventDefault();

            }.bind(this)
        };
        return option;
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
    
        if (data['CANCEL'] == "Y")
            return true;
    },
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.ecount.alert(String.format(this.resource.MSG02158, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl() ? this.header.getQuickSearchControl().getValue() || '' : '';
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
       
        if (page.pageID == 'ESA010P_09') {
         
            this.fnReload();
        }
        message.callback && message.callback();  // The popup page is closed   
    },

    //재로드
    fnReload: function () {

        var grid = this.contents.getGrid();
        grid.draw(this.searchFormParameter);
    },


    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출   
    // 적용 버튼 이벤트(Apply buttons event)
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "SIZE_DES",
            code: "CODE_NO",
            data: selectedItem,
            isAdded: true,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //신규
    onFooterNew: function () {

        this.openWindow({
            url: "/ECERP/ESA/ESA010P_09",
            name: String.format(ecount.resource.LBL35181 + ecount.resource.LBL11726), //규격코드등록
            additional: false,
            param: {
                width: 600,
                height: 180,
                CODE_CLASS: this.CODE_CLASS
            },
        });
    },


    //리스트 버튼 (검색 페이지로 이동)
    onFooterPre: function () {
        var listFlag = "Search";
        this.onComeAndGoListToSearch(listFlag);

    },

    onFooterExcel: function () {

        if (this.isUseExcelConvert) {
            var excelSearch = this.searchFormParameter
            ecount.document.exportExcel("/Inventory/Basic/ExcelCodeForSpec", excelSearch);     // Please excelTitle check!
        } else {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return;
        }
    },

    //선택삭제
    onFooterDeleteMulti: function (cid) {

        var btnDeleteMulti = this.footer.get(0).getControl("DeleteMulti");
        var delItem = this.contents.getGrid().grid.getChecked();
        var uniqueItems = new Array();
        
        $.each($.makeArray(delItem), function (i, el) {
            uniqueItems.push(el.CODE_NO);
        });


        if (!uniqueItems.length) {
            ecount.ecount.alert(ecount.resource.MSG00303);
            return false;
        }
        var formData = Object.toJSON({
            CODE_NO_LIST: uniqueItems.join(ecount.delimiter),
            CODE_CLASS: this.CODE_CLASS
        });
        var strUrl = "/Inventory/Basic/DeleteCodeListForSpec";

        if (confirm(ecount.resource.MSG00299)) {
            ecount.common.api({
                url: strUrl,
                async: false,
                data: formData,
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.ecount.alert(result.fullErrorMsg);
                    } else {
                        this.contents.getGrid().draw(this.searchFormParameter);
                    }
                }.bind(this)
            });
            btnDeleteMulti.setAllowClick();
        }


    },

    onFooterModify: function () {
        var listFlag = "List";
        this.onComeAndGoListToSearch(listFlag);
    },

    onComeAndGoListToSearch: function (listFlag) {

        var param = {
            ListFlag: listFlag,
            height: 600,
            isOpenPopup: true,
            callPageName: "ES019P",
            __ecPage__: "",
            _ecParam__: "",
            isPopFlag: "Y",
        };
        this.onAllSubmitSelf("/ECERP/Popup.Search/ES019P", param, "details");
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        
        //if (this.isIncludeInactive) {
        //    if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        //    }
        //    else {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //    }
        //}
        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
            }
            else {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
            }
        }

        //this.searchFormParameter.DEL_FLAG = event.status;
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.getQuickSearchControl().setFocus(0);
        if (this.isIncludeInactive) {
            this.header.toggle(true);
        }
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F8
    ON_KEY_F8: function () {

        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
            return;
        }
        else if (this.isApplyDisplayFlag != true)
            return;

        var selectedItem = this.contents.getGrid().grid.getChecked();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "SIZE_DES",
            code: "CODE_NO",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },
    ON_KEY_F2: function () {
        this.onFooterNew();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        ;
        target && this.onContentsSearch(target.control.getValue());

    },
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }

        if (!$.isEmpty(this.searchFormParameter.PARAM) || !$.isEmpty(this.searchFormParameter.PARAM2) || !$.isEmpty(this.searchFormParameter.PARAM3)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    gridFocus: function () { }
});

