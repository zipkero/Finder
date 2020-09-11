window.__define_resource && __define_resource("LBL93305","LBL00064","LBL01398","LBL09999","LBL06434","LBL03142","LBL93304","LBL02282","LBL03515","LBL01984","LBL08493","LBL00653","LBL03209","LBL06386","LBL06825","LBL00655","LBL00754","BTN00050","LBL35244","BTN00043","MSG00141","LBL03176","LBL08030","LBL00243","MSG02158");
/****************************************************************************************************
1. Create Date : 2015.05.25
2. Creator     : PHI lUONG
3. Description : Inv1 > Setup > Internal Use / 재고1 > 기초등록 > 자가사용유형등록
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA020M", {

    header: null,

    contents: null,

    footer: null,
/**************************************************************************************************** 
* user opion Variables
****************************************************************************************************/


/**************************************************************************************************** 
* page initialize
****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);  // Perform basic logic defined in the parent class init
        this.searchFormParameter = { PARAM: "", CODE_CLASS: this.CODE_CLASS, SORT_COLUMN: "CODE_NO", SORT_TYPE: "A" }; // Variable declaration in order to receive your query

        //Set uppercase for the Code Class value
        if (this.CODE_CLASS != null && this.CODE_CLASS != "") {
            this.CODE_CLASS = this.CODE_CLASS.toUpperCase();
        }
        // Show Title
        // Resource value declared in cshtml

        if (this.CODE_CLASS == "S09") {
            this.res = ecount.resource.LBL93305;
            this.HeaderTitle = String.format(ecount.resource.LBL00064, ecount.resource.LBL01398);
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL01398);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL01398);
        }
        else if (this.CODE_CLASS == "S10") { //Defect
            this.res = ecount.resource.LBL93305;
            this.HeaderTitle = String.format(ecount.resource.LBL00064, ecount.resource.LBL03142);
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL03142);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL03142);
        }
        else if (this.CODE_CLASS == "S20") { //Internal Use
            this.res = ecount.resource.LBL93304;
            this.HeaderTitle = String.format(ecount.resource.LBL00064, ecount.resource.LBL02282);
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL02282);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL02282);
        }
        else if (this.CODE_CLASS == "G01") {
            this.res = ecount.resource.LBL03515;
            this.HeaderTitle = String.format(ecount.resource.LBL00064, ecount.resource.LBL03515);
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL03515);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL03515);
        }
        else {
            this.res = this.CLASS_DES;
            this.HeaderTitle = String.format(ecount.resource.LBL00064, this.CLASS_DES);
            this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, this.CLASS_DES);
            this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, this.CLASS_DES);
        }


        // Code title
        if (this.strPopUpFlag == "Y")
            this.codeHeader = ecount.resource.LBL01984;
        else {
            if (this.CODE_CLASS == "S09")
                this.codeHeader = ecount.resource.LBL08493;
            else if (this.CODE_CLASS == "S20")
                this.codeHeader = ecount.resource.LBL00653;
            else
                this.codeHeader = ecount.resource.LBL03209;
        }
        // Code Des Title
        if (this.strPopUpFlag == "Y")
            this.codeDesHeader = ecount.resource.LBL06386;
        else {
            if (this.CODE_CLASS == "S09")
                this.codeDesHeader = ecount.resource.LBL06825;
            else if (this.CODE_CLASS == "S20")
                this.codeDesHeader = ecount.resource.LBL00655;
            else
                this.codeDesHeader = ecount.resource.LBL00754;
        }

        //Get Permission 
        this.permission = this.viewBag.Permission.permit;
    },
/****************************************************************************************************
* UI Layout setting
****************************************************************************************************/

    //setting Header option
    onInitHeader: function (header) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        header.setTitle(this.HeaderTitle).useQuickSearch();

        var dropdownButtons = [];
        dropdownButtons.push({ id: "Excel", label: ecount.resource.BTN00050 });
        header.add("option", dropdownButtons);
    },        

    //setting Contents option
    onInitContents: function (contents) {
        var self = this;
        var defaultTitle = ecount.config.inventory.ITEM_TIT + " ";
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid(),
        ctrl = widget.generator.control();

        //Defined grid portion
        grid
        
        .setRowData(self.viewBag.InitDatas.Acc009)
        .setRowDataParameter(this.searchFormParameter)
        .setRowDataUrl("/Account/Basic/GetListInternalUseBySearch")
        .setKeyColumn(['CODE_NO'])    

            .setColumns([
                    { propertyName: 'CODE_NO', id: 'CODE_NO', title: this.codeHeader, width: ''},
                    { propertyName: 'CODE_DES', id: 'CODE_DES', title: this.codeDesHeader, width: ''},
                    { propertyName: 'USE_GUBUN', id: 'USE_GUBUN', title: ecount.resource.LBL35244, width: '', align: 'center' }
            ])

            //Set fixed header
            .setColumnFixHeader(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')

            //Paging
            .setPagingUse(true) //Set whether to use the paging function, Less than one page when the entire page is 'paging UI' does not appear
            .setPagingRowCountPerPage(100, true) //set row count per page
            .setPagingUseDefaultPageIndexChanging(true) //Change a user clicks on one page, to render the page.

            //Sort
            .setColumnSortable(true) // Sort whether from the grid
            .setColumnSortDisableList(['USE_GUBUN']) // Sort using list settings except column
            .setColumnSortExecuting(this.onColumnSortClick.bind(this)) //Register a callback function to perform the sort.


            //Checkbox Use
            .setCheckBoxUse(false) //Set whether to use checkboxes
            .setCheckBoxMaxCount(100) //Check the maximum number of restrictions
            .setCheckBoxMaxCountExceeded(this.onItemCountMessage.bind(this))

            .setCustomRowCell('CODE_NO', this.setGridDataLink.bind(this)) //Click the screen to jump popup
            .setCustomRowCell('USE_GUBUN', this.setGridToolTip.bind(this)) //Create ToolTip

            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxCallback({
                'click': function (e, data) {
                    // ecount.alert("Clicked");
                }
            });

        // to chain patterns into the grid toolbar on the contents and parts
        contents.add(toolbar)
                .addGrid("dataGrid", grid); // Because there are multiple grids must be put in an arbitrary id, grid have to use the  addGrid()
    },

    //setting Footer option
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        footer.add(toolbar);
    },

/**************************************************************************************************** 
* define common event listener
****************************************************************************************************/
    // Dropdown Excel clicked event
    onDropdownExcel: function () {
        var self = this;
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
        self.searchFormParameter.SheeNM = self.HeaderTitle;
        self.searchFormParameter.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Columns = [
                  { propertyName: 'CODE_NO', id: 'CODE_NO', title: this.codeHeader, width: '' },
                    { propertyName: 'CODE_DES', id: 'CODE_DES', title: this.codeDesHeader, width: '' },
                    { propertyName: 'USE_GUBUN', id: 'USE_GUBUN', title: ecount.resource.LBL35244, width: '', align: 'center' }
        ];

        self.searchFormParameter.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/Account/Basic/GetListInternalUseBySearchForExcel",
            param: self.searchFormParameter
        });
    },

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // After the document is opening.
    onLoadComplete: function (e) {

        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == "ESA021M") {
            this.setReload(this);
        }
    },


/********************************************************************** 
* define grid event listener
**********************************************************************/
    onGridRenderComplete: function (e, data) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.PARAM);
            control.setFocus(0);
        }
    },

    //Grid row of one particular date
    setGridDataLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 175,
                    editFlag: "M",
                    USE_GUBUN: data.rowItem['USE_GUBUN'],
                    CODE_NO: data.rowItem['CODE_NO'],
                    CODE_DES: data.rowItem['CODE_DES'],
                    CODE_CLASS: this.CODE_CLASS,
                    CLASS_DES: this.CLASS_DES,
                    WDATE:data.rowItem['WDATE'],
                    WID: data.rowItem['WID'],
                    popupType: false,
                    additional: false
                };
                // false : Modal , true : pop-up
                this.openWindow(
                    {
                    url: '/ECERP/ESA/ESA021M',
                    name: this.HeaserTitlePopUpModify,
                    param: param
                    });
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    //Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['USE_GUBUN'] == "N")
            return true;
    },

/**************************************************************************************************** 
* define action event listener
****************************************************************************************************/
    //sort : callback function to perform the sort.
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // event new  
    onFooterNew: function (cid) {
        if (this.permission.Value == "U" || this.permission.Value == "W") {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 175,
                editFlag: "I",
                CODE_CLASS: this.CODE_CLASS,
                CLASS_DES: this.CLASS_DES,
                popupType: false
            };
            // false : Modal , true : pop-up

            this.openWindow({
                url: '/ECERP/ESA/ESA021M',
                name: this.HeaderTitlePopUp,
                additional: false,
                param: param
            });
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.res, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },


/**************************************************************************************************** 
*  define hotkey event listener
****************************************************************************************************/

    //enter
    ON_KEY_ENTER: function (e, target) {

    },

    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },

/**************************************************************************************************** 
* define user function 
****************************************************************************************************/
    setGridToolTip: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.USE_GUBUN) ? ecount.resource.LBL08030 : ecount.resource.LBL00243;
        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
        }
        return option;
    },

    // Reload
    setReload: function (e) {
        // Put logic to draw a grid search terms
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
   },

    //Limited number of check checkbox
    onItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count)); 
    }

});
