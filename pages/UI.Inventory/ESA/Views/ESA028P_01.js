window.__define_resource && __define_resource("LBL06431","LBL03017","LBL03004","LBL30177","LBL01118","LBL01099","LBL06451","BTN00008","LBL03755","LBL04294");
/****************************************************************************************************
1. Create Date : 2015.07.30
2. Creator     : Phan Phuoc Tho
3. Description : Inv.1 > Setup > Price Level by Item Group > Register Price by Item Group > Applied Price
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_01", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: '',     // Page permission    

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.userPermit = this.viewBag.Permission.Permit.Value;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header, res) {
        var g = widget.generator;
        var ctrl = g.control();

        header.notUsedBookmark();
        header.setTitle(res.LBL06431);
    },

    // Contents Initialization
    onInitContents: function (contents, res) {
        var g = widget.generator;
        var ctrl = g.control();
        var toolbar = g.toolbar();
        var grid = g.grid();
        var decP = "96";

        // Merge column header variables
        var mergeColHeader0 = {}, mergeColHeader1 = {}, mergeColHeader2 = {}, mergeColHeader3 = {}, mergeColHeader4 = {};

        // Item Code column header
        mergeColHeader0['_MERGE_USEOWN'] = false;
        mergeColHeader0['_ROW_TYPE'] = 'TOTAL';
        mergeColHeader0['_ROW_TITLE'] = res.LBL03017;
        mergeColHeader0['_MERGE_START_INDEX'] = 0;
        mergeColHeader0['_COLSPAN_COUNT'] = 1;
        mergeColHeader0['_ROWSPAN_COUNT'] = 2;

        // Item Name column header
        mergeColHeader1['_MERGE_USEOWN'] = false;
        mergeColHeader1['_ROW_TYPE'] = 'TOTAL';
        mergeColHeader1['_ROW_TITLE'] = res.LBL03004;
        mergeColHeader1['_MERGE_START_INDEX'] = 1;
        mergeColHeader1['_COLSPAN_COUNT'] = 1;
        mergeColHeader1['_ROWSPAN_COUNT'] = 2;

        // Tax Status column header
        mergeColHeader2['_MERGE_USEOWN'] = false;
        mergeColHeader2['_ROW_TYPE'] = 'TOTAL';
        mergeColHeader2['_ROW_TITLE'] = res.LBL30177;
        mergeColHeader2['_MERGE_START_INDEX'] = 2;
        mergeColHeader2['_COLSPAN_COUNT'] = 1;
        mergeColHeader2['_ROWSPAN_COUNT'] = 2;

        // Sales column header
        mergeColHeader3['_MERGE_USEOWN'] = false;
        mergeColHeader3['_ROW_TYPE'] = 'TOTAL';
        mergeColHeader3['_ROW_TITLE'] = res.LBL01118;
        mergeColHeader3['_MERGE_START_INDEX'] = 3;
        mergeColHeader3['_COLSPAN_COUNT'] = 2;
        mergeColHeader3['_ROWSPAN_COUNT'] = 1;

        // Purchases column header
        mergeColHeader4['_MERGE_USEOWN'] = false;
        mergeColHeader4['_ROW_TYPE'] = 'TOTAL';
        mergeColHeader4['_ROW_TITLE'] = res.LBL01099;
        mergeColHeader4['_MERGE_START_INDEX'] = 5;
        mergeColHeader4['_COLSPAN_COUNT'] = 2;
        mergeColHeader4['_ROWSPAN_COUNT'] = 1;

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.GridFirstLoad)
            .setKeyColumn(["PROD_CD", "PROD_DES"])            
            .setColumnFixHeader(true)
            .setColumnRowCustom([0, 0], [{ '_MERGE_SET': new Array(mergeColHeader0, mergeColHeader1, mergeColHeader2, mergeColHeader3, mergeColHeader4) }])
            .setColumns([
                { propertyName: 'PROD_CD', id: 'PROD_CD', width: '' },
                { propertyName: 'PROD_DES', id: 'PROD_DES', width: '' },
                { propertyName: 'VAT_YN', id: 'VAT_YN', width: '75', align: 'center' },
                { propertyName: 'OUT_PRICE_GUBUN', id: 'OUT_PRICE_GUBUN', title: res.LBL06451, width: '100', align: 'right', dataType: decP, isCheckZero: false },
                { propertyName: 'OUT_SPECIALPRICE2', id: 'OUT_SPECIALPRICE2', title: res.LBL06431, width: '100', align: 'right', dataType: decP, isCheckZero: false },
                { propertyName: 'IN_PRICE_GUBUN', id: 'IN_PRICE_GUBUN', title: res.LBL06451, width: '100', align: 'right', dataType: decP, isCheckZero: false },
                { propertyName: 'IN_SPECIALPRICE2', id: 'IN_SPECIALPRICE2', title: res.LBL06431, width: '100', align: 'right', dataType: decP, isCheckZero: false },
            ])

            // Paging
            .setPagingUse(false)

            // Sorting
            .setColumnSortable(false)

            // Custom cells
            .setCustomRowCell("VAT_YN", this.setTaxStatusValue.bind(this))            
        ;

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document is loaded
    onLoadComplete: function () {
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/
   
    // Set [Tax Status] value
    setTaxStatusValue: function (value, rowItem) {
        var option = {};

        option.data = ['Y'].contains(value) ? this.resource.LBL03755 : this.resource.LBL04294;

        return option;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    // Close button clicked event
    onFooterClose: function () {
        this.close();
    },
});