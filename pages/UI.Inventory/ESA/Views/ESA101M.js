window.__define_resource && __define_resource("BTN00113","BTN00007","LBL02920","MSG03033","MSG02140","LBL02999","MSG03384","MSG00631","LBL00865","LBL02475","LBL04299","LBL01472","LBL09022","BTN00460","LBL02484","LBL03495","LBL00754","LBL06425","LBL06449","BTN00043","BTN00026","BTN00028","BTN00050","LBL06423","LBL35862","LBL01587","LBL01047","LBL06446","LBL06445","MSG01488","LBL02238","LBL02813","LBL01249","LBL02513","LBL02512","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL05426");

/****************************************************************************************************
1. Create Date : 2015.09.14
2. Creator     : 조영상
3. Description : 특별단가등록 개선 > 품목그룹별
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA101M", {

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

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.permit = this.viewBag.Permission.Permit;
        this.Price2 = this.viewBag.InitDatas.GetSale007EGA028Sub;
        this.strGroupCode = $.isNull(this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG) ? "1": this.viewBag.InitDatas.DefaultGroupCd[0].PRICE_GROUP_FLAG;

        this.searchFormParameter = {
            CODE_CLASS: '', // 특별단가그룹코드
            CLASS_CD: '',   // 품목그룹
            USE_YN: '',
            CLASS_GUBUN: this.strGroupCode,    // 그룹코드구분(품목그룹구분, 필수값)  
            PAGE_SIZE: this.viewBag.InitDatas.DefaultPageSize,
            PAGE_CURRENT: 0,
            SORT_COLUMN: 'CODE_CLASS',
            SORT_TYPE: 'A',
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

        // 검색창 하단
        toolbar
            .setOptions({ css: "btn btn-default btn-sm" })
            .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))    // 검색
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));    // 다시작성

        // 검색창 내용
        form
            .add(ctrl.define("widget.multiCode.priceGroup", "txtPriceLevel", "CODE_CLASS", ecount.resource.LBL02920).popover(ecount.resource.MSG03033).dataRules(["required"], ecount.resource.MSG02140).maxSelectCount(1).end())   // 특별단가
            .add(ctrl.define("widget.multiCode.prodGroup", this.strGroupCode== "1"? "txtClassCd1" : this.strGroupCode== "2" ? "txtClassCd2" : "txtClassCd3", "CLASS_CD", ecount.resource.LBL02999).popover(ecount.resource.MSG03384).dataRules(["required"], ecount.resource.MSG00631).maxSelectCount(1).end())  // 품목코드
            .add(ctrl.define("widget.select", "USE_YN", "USE_YN", ecount.resource.LBL00865).option([["", ecount.resource.LBL02475], ["Y", ecount.resource.LBL04299], ["N", ecount.resource.LBL01472]]).select(0).end());   // 기타

        contents
            .add(form)
            .add(toolbar);

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL09022)
            .add("search")  //type, button list
            .add("option", [
                { id: "SetGroupItem", label: ecount.resource.BTN00460 },
                { id: "listSetting", label: ecount.resource.LBL02484}],false)
            .addContents(contents);
    },

    onInitContents: function (contents, resource) {

        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var grid = g.grid();
        var thisObj = this;

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.GridFirstLoad)

            .setKeyColumn(["COME_CDE"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCheckBoxUse(true)
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'CLASS_CD', id: 'CLASS_CD', title: ecount.resource.LBL03495, width: '120'},
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL00754, width: '150' },
                { propertyName: 'CODE_CLASS_DES', id: 'CODE_CLASS_DES', title: ecount.resource.LBL06425, width: '150' },
                { propertyName: 'PRICE_GUBUN', id: 'PRICE_GUBUN', title: ecount.resource.LBL09022 + ' ' +ecount.resource.LBL06449, width: '', align: 'center' },
            ])

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.DefaultPageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['PRICE_GUBUN'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Custom cells
            .setCustomRowCell('PRICE_GUBUN', this.setGridAdjustmentContent.bind(this))
            .setCustomRowCell("CLASS_CD", this.setCodeLink.bind(this))

        contents.add(toolbar).addGrid("dataGrid", grid);
    },


    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043))
               .addLeft(ctrl.define("widget.button", "change").label(ecount.resource.BTN00026))
               .addLeft(ctrl.define("widget.button", "copy").label(ecount.resource.BTN00028))
               .addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050));

        footer.add(toolbar);
    },

    onLoadComplete: function () {
    },

    onHeaderSearch: function (e, value) {
        this.setReload(this);
    },

    // 리스트 랜더링 후 API 호출(파라미터 전달)
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListPriceLevelByItem");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
    },

    // When the popup is opening
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
        }

        handler(config);
    },

    // 신규 저장
    onFooterNew: function () {

        if (this.permit.Value == "R") {
        
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.Resource.LBL06423, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            editFlag: "I",
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            CLASS_GUBUN : this.strGroupCode
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA101P_02',
            name: ecount.resource.LBL09022 + ecount.resource.LBL35862,
            param: param,
            popupType: false,
            additional: false
        })

    },

    // 다시작성 버튼
    onFooterReset: function () {
        this.contents.reset();
        this.contents.getControl("ForeignCode").setFocus(0);
    },

    // 변경
    onFooterChange: function () {

        var isOk = this.setCheckProd();

        if (isOk) {

            // 체크 확인
            var selectItem = this.contents.getGrid().grid.getChecked();
            self.selectedCnt = selectItem.length;

            var code_class = "";
            var class_cd = "";

            $.each(this.contents.getGrid().grid.getChecked(), function (i, item) {
                code_class += item.CODE_CLASS + ecount.delimiter,
                class_cd += item.CLASS_CD + ecount.delimiter
            });

            this.openWindow({
                
                url: '/ECERP/ESA/ESA101P_01',
                name: ecount.resource.LBL09022 + ecount.resource.LBL01587 + ecount.resource.LBL01047, // (품목별선택변경)
                additional: true,
                param: {
                    width: 1100,
                    height: 600,
                    code_class: code_class,
                    class_cd: class_cd,
                    class_gubun : this.strGroupCode
                }
            });
        }
    },

    onDropdownSetGroupItem: function () {
        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06446, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 150,
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

    // Message Handler for popup
    onMessageHandler: function (page, message) {

        var thisobj = this;

        switch(page.pageID)
        {
            // 특별단가
            case "CM020P":
                this.searchFormParameter.CODE_CLASS = message.data.CODE_CLASS;
                message.callback && message.callback();

                break;
            // 품목그룹구분설정
            case "ESA027P_01":
                this.searchFormParameter.CLASS_GUBUN = message.data.GroupCode;
                this.setReload(this);
                break;
            // 품목그룹
            case "ES005P":
                this.searchFormParameter.CLASS_CD = message.data.CLASS_CD;
                message.callback && message.callback();
                break;
            default:
                this.contents.getGrid().draw(this.searchFormParameter);
                message.callback && message.callback();
                break;
        }
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

     // Reload
    setReload: function (e) {
        var form = this.header.serialize();
        $.extend(this.searchFormParameter, this.searchFormParameter, form.result);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.toggle(true);
    },

    setCheckProd: function () {
        var isOk = true,
            _self = this;
        // 체크 확인
        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        // 품목 선택 여부 체크
        if (self.selectedCnt == 0) {
            ecount.alert(ecount.resource.MSG01488);
            return false;
        }

        return isOk;
    },


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
        option.data = this.strPriceGubun + '/' + this.iPriceRate + '/' + this.strPriceLess + '/' + this.strPriceRise
        return option;
    },

    // Set row color
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
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 300,
                    editFlag: 'M',
                    CODE_CLASS: data.rowItem['CODE_CLASS'],
                    CLASS_CD: data.rowItem['CLASS_CD'],
                    parentPageID: this.pageID,
                    responseID: this.callbackID,
                    CLASS_GUBUN : this.strGroupCode
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA101P_02',
                    name: ecount.resource.LBL09022 + ecount.resource.LBL05426, // (품목그룹별단가변경)
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
        
    },

    //F8 적용
    ON_KEY_F8: function () {
        this.onHeaderSearch();
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
        target && this.onHeaderSearch(target.control.getValue());
    },

    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    }

});

