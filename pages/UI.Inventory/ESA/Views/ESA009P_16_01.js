window.__define_resource && __define_resource("LBL10774","LBL10775","LBL03017","LBL03004","LBL06392","BTN00008","LBL10704");
/****************************************************************************************************
1. Create Date : 2016.06.03
2. Creator     : 김동수
3. Description : 재고1 > 기초등록 > 품목등록 리스트 > 선택삭제 결과화면> BOM등록자료
4. Precaution  :
5. History     : 
    
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA009P_16_01", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("inventorylib.common");
    },


    initProperties: function () {
        this.searchFormParameter = { BOM_CD: this.BOM_CD };
    },

    render: function () {       
      this._super.render.apply(this);
           
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var self = this;

        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        header
            .notUsedBookmark()
            .setTitle(ecount.resource.LBL10774)
            .addContents(contents)
        ;
    },
    // Contents Initialization
    onInitContents: function (contents, resource ) {
        var self = this;

        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.label", "topInfo").label(ecount.resource.LBL10775));

        //Defined grid portion
        grid
        .setRowData(self.viewBag.InitDatas.LoadData)
        .setRowDataParameter(this.searchFormParameter)
        .setRowDataUrl("/Inventory/Bom/GetListSale005ByBomUsageByBomCd")
        .setKeyColumn(['BOM_CD','PROD_CD','BOM_NO'])

            .setColumns([
                    { propertyName: 'BOM_CD', id: 'BOM_CD', title: ecount.resource.LBL03017, width: '' },
                    { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03004, width: '' },
                    { propertyName: 'PROD_BOM_NM', id: 'PROD_BOM_NM', title: ecount.resource.LBL06392, width: '', align: 'left' }
            ])

            //Set fixed header
            .setColumnFixHeader(true)

            //Paging
            .setPagingUse(true) //Set whether to use the paging function, Less than one page when the entire page is 'paging UI' does not appear
            .setPagingRowCountPerPage(100, true) //set row count per page
            .setPagingUseDefaultPageIndexChanging(true) //Change a user clicks on one page, to render the page.

            //Sort
            .setColumnSortable(false) // Sort whether from the grid

            //Checkbox Use
            .setCheckBoxUse(false) //Set whether to use checkboxes

            .setCustomRowCell('BOM_CD', this.setGridItemBomCd.bind(this)) //Click the screen to jump popup
            
            .setCheckBoxCallback({
                'click': function (e, data) {
                    // ecount.alert("Clicked");
                }
            });

        // to chain patterns into the grid toolbar on the contents and parts
        contents.add(toolbar)
                .addGrid("dataGrid", grid); // Because there are multiple grids must be put in an arbitrary id, grid have to use the  addGrid()

    },
    // 
    onInitFooter: function (footer, resource) {
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
        //this.dataSearch(true);
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        handler(config);
    },
    // Message Handler for popup
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed   
    },
    /**********************************************************************
    * define Link event listener
    **********************************************************************/



    /********************************************************************** 
    * define grid event listener
    **********************************************************************/
    onGridRenderComplete: function (e, data) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
    },
    // BOM_CD click
    setGridItemBomCd: function (value, rowItem) {
        var option = [];
        //option.data = ecount.resource.LBL10704;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 800,
                    height: 700,
                    BOM_CD: data.rowItem.BOM_CD,
                    BOM_NO: data.rowItem.BOM_NO
                };
                debugger;
                this.openWindow({
                    url: "/ECERP/ESJ/ESJ001P_04?PROD_CD=" + encodeURIComponent(data.rowItem.PROD_CD) + "&ProdEditType=ALL_IN_ONE_SEARCH",
                    name: 'ESJ001P_04',
                    param: param,
                    popupType: false
                });
            }.bind(this)
        }
        return option;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    **********************************************************************/

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/
    // F8 click
    ON_KEY_F8: function (e) {
    },
    /**********************************************************************
    * define user function
    **********************************************************************/
    // Close button click event
    onFooterClose: function () {
        this.close();
    }
});