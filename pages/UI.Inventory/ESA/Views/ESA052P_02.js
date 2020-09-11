window.__define_resource && __define_resource("LBL07741","LBL02736","LBL02722","LBL00752","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.06.09
2. Creator     : Nguyen Anh Tuong
3. Description : Acct. I > Setup > Location> Location Level Group
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA052P_02"/** page ID */, {
    pageID: null,
    header: null,
    contents: null,
    footer: null,
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CD_LIST: this.PCodes,
            SORT_COLUMN: 'CD_GROUP',
            SORT_TYPE: 'A'
        };
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07741);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var self = this;
        var grid = widget.generator.grid();
        // Initialize Grid
        grid.setRowData(self.InitDatas.locations)
            .setRowDataUrl("/Inventory/Basic/GetListLevelGroupByLocationList")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CD_GROUP', 'CD_PARENT'])
            .setColumns([
                { propertyName: 'CD_GROUP', id: 'CD_GROUP', title: ecount.resource.LBL02736, width: 100 },
                { propertyName: 'CD_NAME', id: 'CD_NAME', title: ecount.resource.LBL02722, width: 150 },
                { propertyName: 'CD_PARENT', id: 'CD_PARENT', title: ecount.resource.LBL00752, width: '' }
            ])

            //Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(20, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('CD_PARENT', this.setParentColumn.bind(this));

        contents.addGrid("dataGrid", grid);
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
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

    //Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    setParentColumn: function (value, rowItem) {
        var option = {};
        option.data = '[' + rowItem.CD_PARENT + '] ' + rowItem.NM_GROUP;
        return option;
    }
});