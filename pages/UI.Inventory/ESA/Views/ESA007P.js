window.__define_resource && __define_resource("BTN00113","LBL03034","LBL03037","LBL13251","LBL06054","LBL13249","LBL01845","LBL35244","MSG02158","BTN00204","BTN00008","LBL93033","LBL03146","LBL02389","LBL00757","LBL00793","LBL08030","MSG00213");
/****************************************************************************************************
1. Create Date : 2017.12.27
2. Creator     : 이현택
3. Description : Acct.I, Inv.I > Setup > Project > Inquiry Unused Codes / 회계1, 재고1 > 기초등록 > 프로젝트등록 > 미사용코드조회
4. Precaution  :
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA007P", {
    header: null, 

    contents: null,

    footer: null,

    canCheckCount: 100,     // 체크 가능 수 기본 100

    formTypeCode: 'SR980',  // 리스트폼타입

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
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
        this.initData = this.viewBag.InitDatas.ListUnusedProject;
        
        this.searchFormParameter = {
            PARAM: this.PARAM,
            PJT_CD: "",
            PJT_DES: "",
            SORT_COLUMN: "PJT_CD",
            SORT_TYPE: "A",
            PAGE_SIZE: this.PAGE_SIZE,
            BASE_DATE: this.BASE_DATE
        };
    },

    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator,
                contents = g.contents(),
                toolbar = g.toolbar(),
                form = g.form(),
                ctrl = g.control();

        toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
               .addLeft(ctrl.define("widget.button", "Search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113));

        form.add(ctrl.define("widget.input.codeType", "pjtCode", "pjtCode", ecount.resource.LBL03034).maxLength(100).end())
            .add(ctrl.define("widget.input.codeName", "pjtDes", "pjtDes", ecount.resource.LBL03037).maxLength(100).end())
            .add(ctrl.define("widget.date", "baseDate", "baseDate", ecount.resource.LBL13251).select(this.searchFormParameter.BASE_DATE).subLabel(ecount.resource.LBL06054).end());
        
        contents.add(form).add(toolbar);

      header.setTitle(ecount.resource.LBL13249)
              .useQuickSearch()
              .notUsedBookmark()
              .add("search", null, false)
              .addContents(contents);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            grid = g.grid();

        grid
            .setRowData(this.initData)
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1, ExtendedCondition: {} })
            .setRowDataUrl("/Account/Basic/GetListUnusedSitePJTbyDate")

            // 헤더정보
            //.setColumns([
            //    { id: "PJT_CD", propertyName: "PJT_CD", title: ecount.resource.LBL03034, width: "120", align: "left" },
            //    { id: "PJT_DES", propertyName: "PJT_DES", title: ecount.resource.LBL03037, width: "200", align: "left" },
            //    { id: "CODE_CHK", propertyName: "CODE_CHK", title: ecount.resource.LBL01845, width: "", align: "center", controlType: "widget.label" },
            //    { id: "CANCEL", propertyName: "CANCEL", title: ecount.resource.LBL35244, width: "70", align: "center", controlType: "widget.label" }
            //])

            .setKeyColumn(['PJT_CD'])
            .setColumnFixHeader(true)

            //선택
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })

            // 키보드 활용
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.searchFormParameter.PAGE_SIZE, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['ACCT_CHK', 'CANCEL', 'REMARKS'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Custom cells
            .setCustomRowCell('ACCT_CHK', this.setGridDataMenu.bind(this))
            .setCustomRowCell('CANCEL', this.setGridActive.bind(this))

            .setEventShadedColumnId([['PJT_CD']], true);

        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Deactivate").label(ecount.resource.BTN00204));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));

        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/
    onLoadComplete: function (e) {
        this.header.getQuickSearchControl().setValue(this.searchFormParameter.PARAM);
    },

    onGridRenderComplete: function (e) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.finalSearchParameter = this.header.extract().result;
    },
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/
    // Quick Search
    onHeaderQuickSearch: function () {
        this.header.lastReset(this.finalSearchParameter);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // header Search button click event
    onHeaderSearch: function () {
        // 선택된 날짜 추출하기
        this.searchFormParameter.BASE_DATE = this.header.getControl("baseDate").getDate()[0].format("yyyyMMdd");

        // 프로젝트 코드 및 코드명 추출하기
        this.searchFormParameter.PJT_CD = this.header.getControl("pjtCode").getValue();
        this.searchFormParameter.PJT_DES = this.header.getControl("pjtDes").getValue();

        // quick search 값 제외
        this.searchFormParameter.PARAM = "";
        this.header.getQuickSearchControl().setValue("");

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
 
        this.header.toggle(true);
    },

    // 사용중단 (Deactivate button click event)
    onFooterDeactivate: function (e) {
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var updatedList = this.getSelectedListforDeactivate();

        this.updateCancelProject(updatedList);
    },

    // CLOSE button click event
    onFooterClose: function () {
        this.close();
    },
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/
    // F8 click
    ON_KEY_F8: function (e) {
        this.onHeaderSearch();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    // 코드사용메뉴 값 세팅 (Set value for [Menu] column)
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

    // 사용구분 값 세팅 (Set value for [Active] column)
    setGridActive: function (value, rowItem) {
        var option = {};

        // 사용 중인 코드들만 가져왔기 때문에 분기 처리를 하지 않음
        option.data = ecount.resource.LBL08030;

        return option;
    },

    // 선택된 리스트를 받아오는 함수 (the function for get checked list)
    getSelectedListforDeactivate: function () {
        var selectItem = this.contents.getGrid().grid.getChecked();

        // 변경 할 아이템을 받을 변수
        var updatedList = {
            CancelProjectCodes: []
        };

        $.each(selectItem, function (i, data) {
            updatedList.CancelProjectCodes.push({ PJT_CD: data.PJT_CD , CANCEL: "Y"});
        });

        return updatedList;
    },

    // 일괄 사용중단 (deactivate the projects)
    updateCancelProject: function (updatedList) {
        var btn = this.footer.get(0).getControl("Deactivate");

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
           // data: updatedList,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);

                    // 부모창 리스트 새로고침을 위해 onMessageHandler를 호출
                    this.sendMessage(this);
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    }

});