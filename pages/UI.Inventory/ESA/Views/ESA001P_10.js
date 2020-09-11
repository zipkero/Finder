window.__define_resource && __define_resource("LBL12003","LBL00703","LBL01440","LBL00359","LBL01035","LBL02577","BTN00008","LBL02178","LBL00622");
/****************************************************************************************************
1. Create Date : 2015.05.04
2. Creator     : Bao
3. Description : Inv. I > Setup > PIC/Employee > Bank Account link 
                 Acct. I > Payment Agency List > Option > Invalid Code List / 회계 I > 기초등록 > 결제대행사등록 > 옵션 > 번호오류리스트
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA001P_10", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    editData: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { PARAM: "", FLAG: this.strFlag, COM_WHERE: "", YY: "", PHASE: "", SITE_CD: "", VAT_SITE: "" };
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    // Set default properties
    initProperties: function () {
        this.editData = {};
        this.editData.invalidCode = this.viewBag.InitDatas.GetListInvalidCode;
    },

    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator,
            ctrl = g.control();

        header.setTitle(ecount.resource.LBL12003)
                .add(ctrl.define("widget.search", "Search").hideButton().handler({
                    "click": this.onContentsSearch.bind(this),
                    "keydown": this.onContentsSearch.bind(this)
                }))
                .notUsedBookmark();
    },

    //setting Contents option
    onInitContents: function (contents) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid();

        grid.setRowData(this.editData.invalidCode)
            .setRowDataParameter(this.searchFormParameter)
            .setRowDataUrl("/Account/Basic/GetListInvalidCode")
            .setKeyColumn(['BUSINESS_NO'])
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardEnterForExecute(true)
            .setKeyboardPageMove(true)
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setColumns([
                    { propertyName: 'des', id: 'des', title: ecount.resource.LBL00703, width: '62', align: 'center' },
                    { propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL01440, width: '178', align: 'center' },
                    { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL00359, width: '' },
                    { propertyName: 'BOSS_NAME', id: 'BOSS_NAME', title: ecount.resource.LBL01035, width: '', align: 'center' },
                    { propertyName: 'JONGMOK', id: 'JONGMOK', title: ecount.resource.LBL02577, width: '112' }
            ])

            .setCustomRowCell('des', this.setGridDesType.bind(this))
            .setColumnFixHeader(true);

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    //setting Footer option
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },
    /**************************************************************************************************** 
   * define common event listener
   ****************************************************************************************************/

    onLoadComplete: function () {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },

    onMessageHandler: function (item) {
        this.setReload(this);
    },

    onContentsSearch: function (e, value) {
        this.searchFormParameter.PARAM = value;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            this.header.getControl("Search").onFocus(0);
        }
    },

    /**************************************************************************************************** 
     * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
     * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
     ****************************************************************************************************/

    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *define hotkey event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
     * define user function 
     ****************************************************************************************************/
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    setGridDesType: function (value, rowItem) {
        var option = {};
        var strPrintFlag = "Y";
        var strDes = "";

        if (strPrintFlag == "Y") {
            if (this.strFlag == "cust" || this.strFlag == "cust1") {
                switch (rowItem.GUBUN) {
                    case "11":
                        strDes = ecount.resource.LBL02178;
                        break;
                    case "12":
                        strDes = "여행사";
                        break;
                    case "13":
                        strDes = ecount.resource.LBL00622;
                        break;
                    default:
                        strDes = "*****";
                        break;
                }

                option.data = strDes;
            }
            return option;
        }
    }
});