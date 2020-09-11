window.__define_resource && __define_resource("LBL10911","LBL10902","LBL10910","LBL02088","BTN00004","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.04.03
2. Creator     : 노지혜
3. Description : 재고>기초등록>품목등록 - 검사항목 검색창 리스트 (Search Inspection Item)
                                        - 검사유형코드 검색창 리스트 (Search Inspection Type)
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA060P_06", {

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            PARAM: this.keyword,
            DATA_TYPE: this.inspectionItemType,
            inspectionType: this.inspectionType
        };
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
        if (this.inspectionType == "ITEM")
            header.setTitle(this.resource.LBL10911) //검사항목
        else
            header.setTitle(this.resource.LBL10902)
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            setUrl = "",
            codeTitle = "",
            nameTitle = "";

        if (this.inspectionType == "ITEM")
        {
            codeTitle = this.resource.LBL10911;
            nameTitle = this.resource.LBL10910;
        }
        else
        {
            codeTitle = this.resource.LBL10902;
            nameTitle = this.resource.LBL02088;
        }

        settings
            //.setRowDataUrl('/Inventory/QcInspection/GetListInspectionForSearch')
            .setRowData(this.viewBag.InitDatas.StqcItemLoad.Data)
            .setKeyColumn(['ITEM_CD2', 'ITEM_NM'])
            .setColumns([
                { propertyName: 'ITEM_CD2', id: 'ITEM_CD2', title: codeTitle, width: '' },
                { propertyName: 'ITEM_NM', id: 'ITEM_NM', title: nameTitle, width: '' }
            ])            
            .setCustomRowCell('ITEM_CD2', this.setGridDateLink.bind(this))
            .setCustomRowCell('ITEM_NM', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        //툴바
        toolbar
            .attach(ctrl.define("widget.searchGroup", "search").setOptions({
                label: this.resource.BTN00004  //검색                
            }));

        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([10,11]));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        if (!$.isNull(this.keyword)) {
            this.contents.getControl('search').setValue(this.keyword);
        }
        $("input[name=keyword]").focus();
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        grid.draw(this.searchFormParameter);
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
                var message = {
                    name: "ITEM_NM",
                    code: "ITEM_CD2",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },  

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        if (data.dataCount === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];
                        
            var message = {
                name: "ITEM_NM",
                code: "ITEM_CD2",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }

        this.contents.getGrid().settings.setRowDataUrl('/Inventory/QcInspection/GetListInspectionForSearch')

    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        this.searchFormParameter.PARAM = event.keyword;
        this.contents.getGrid().draw(this.searchFormParameter);
        $("input[name=keyword]").focus();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //엔터
    ON_KEY_ENTER: function (e, target) {
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
    gridFocus: function () { }
});
