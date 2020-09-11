window.__define_resource && __define_resource("LBL00364","LBL00703","LBL00381","LBL00359","BTN00008","LBL01899","LBL00640");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level By Group >> View Customer/vendor
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA014P_04", {

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
       * user opion Variables(사용자변수 및 객체) 
     ****************************************************************************************************/



    /********************************************************************** 
   * page init   Class inheritance , init, render etc
   **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = { PARAM: this.Keyword, CODE_CLASS: this.codeClass, SORT_COLUMN: "", SORT_TYPE: "" };
        //console.log(this.searchFormParameter)

    },

    render: function () {
        this._super.render.apply(this);
    },


    /********************************************************************************************************
         * UI Layout setting
     ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        header.setTitle(this.resource.LBL00364)
            .notUsedBookmark()
         .add(ctrl.define("widget.search", "Search").hideButton().handler({
             "click": this.onContentsSearch.bind(this),
             "keydown": this.onContentsSearch.bind(this)
         }));
    },


    onInitContents: function (contents, resource) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid(),
        decq = '9' + ecount.config.inventory.DEC_Q;
        var ctrl = widget.generator.control();

        grid
            //.setRowDataUrl("/Inventory/Basic/GetListCusVendByPriceLevel")   
            .setRowData(this.viewBag.InitDatas.GetListCusVendByPriceLevel)
            .setKeyColumn(['BUSINESS_NO'])
            .setColumns([
                    { propertyName: 'GROUP_GUGUN', id: 'GROUP_GUGUN', title: this.resource.LBL00703, width: '126', align: 'left' },
                    { propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: this.resource.LBL00381, width: '126' },
                    { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: this.resource.LBL00359, width: '' }

            ])
            .setColumnSortable(true)
            .setColumnFixHeader(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setCustomRowCell('GROUP_GUGUN', this.setGridGroupGubun.bind(this));

        contents.add(toolbar)
                .addGrid("dataGrid", grid);
    },


    //setting Footer option
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(this.resource.BTN00008));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
          * define common event listener
    ****************************************************************************************************/
    // A function that is called when clicking the search button
    onContentsSearch: function (e, value) {
        this.searchFormParameter.PARAM = value;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
        this.header.getControl("Search").setFocus(0);
    },

    //sort : callback function to perform the sort.
    onColumnSortClick: function (e, data) {

        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // After the document is opening.
    onLoadComplete: function () {

        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        //grid.draw(this.searchFormParameter);
        // this control should to focus from ui screen load
        //this.header.getControl("Search").setFocus(0);
    },


    //A value that has been passed on to parents in the pop-up window control flag
    onMessageHandler: function (page, message) {
        //this.searchFormParameter.PARAM = this.header.getControl('Search').getValue();
        this.setReload(this);
    },



    /**************************************************************************************************** 
      * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
      * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onFooterClose: function () {
        this.close();
    },



    /****************************************************************************************************
      * define grid event listener
    ****************************************************************************************************/
    onGridInit: function (e, data) {
        // this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data) {
        //  this._super.onGridInit.apply(this, arguments);
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().settings.setRowDataUrl("/Inventory/Basic/GetListCusVendByPriceLevel");
        this.contents.getGrid().settings.setRowDataParameter(this.searchFormParameter);
        if (!e.unfocus) {
            this.header.getControl("Search").onFocus(0);
        }
    },


    /**************************************************************************************************** 
     *  define hotkey event listener
    ****************************************************************************************************/

    //enter
    ON_KEY_ENTER: function (e, target) {

    },


    /**************************************************************************************************** 
     * define user function 
   ****************************************************************************************************/
    //setGridToolTip 
    setGridGroupGubun: function (value, rowItem) {
        var option = {};
        console.log(rowItem.GROUP_GUGUN)

        if (rowItem.GROUP_GUGUN == 1) {
            option.data = this.viewBag.Resource.LBL01899
        }
        else if (rowItem.GROUP_GUGUN == 2) {
            option.data = this.viewBag.Resource.LBL00640
        }
        else if (rowItem.GROUP_GUGUN == 3) {
            option.data = this.viewBag.Resource.LBL01899 + "/" + this.viewBag.Resource.LBL00640
        }

        return option;
    },
    // Reload
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
})