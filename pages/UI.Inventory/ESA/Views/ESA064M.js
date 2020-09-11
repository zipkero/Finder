window.__define_resource && __define_resource("BTN00113","LBL80071","LBL02997","LBL02475","LBL02025","LBL01387","LBL02538","LBL01250","LBL01523","LBL03289","LBL03290","LBL03291","LBL07243","LBL00329","LBL10731","LBL10732","LBL07244","LBL02716","LBL07309","LBL05621","LBL05627","LBL10762","LBL04657","LBL35521","LBL80195","LBL02884","LBL00870","LBL10548","LBL02396","MSG06140","MSG00538","MSG04209","MSG00631","MSG00095","MSG80006","LBL03017","LBL03004","LBL80099","LBL35184","LBL80217","LBL35191","MSG00205","MSG00141","LBL07436","BTN00148","BTN00153","BTN00017","BTN00079","LBL00253","MSG01778","LBL93466","MSG04824","MSG04828","MSG04825","LBL06434","LBL10030","LBL06436","MSG04826","MSG04827","LBL02390","LBL05427","LBL08985","LBL04171","LBL02920","LBL09022","LBL35004","LBL03311","LBL07275","LBL03407","LBL02882","LBL02880","LBL00781","LBL03552","LBL00381","LBL00130","MSG06342","LBL00730","LBL80087","LBL04991","LBL00359","LBL35106","LBL93606","LBL70108");
/****************************************************************************************************
1. Create Date : 2016.05.31
2. Creator     : Le Nguyen
3. Description : Price By Item
4. Precaution  : 
5. History     : ESA064M.aspx
                 2018.01.16(Thien.Nguyen) set scroll top for page. 
                 2018.01.29(Thien.Nguyen) Hot fix dev 6331
                 [2019.01.09] (Ngọc Hân) A19_00045_1_FE 리팩토링_페이지 일괄작업 3차 - Han  change use function  data.length => getComponentSize() at  dataSearch
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA064M", {

    /**********************************************************************
    * page user opion Variables(User variables and objects)
    * khai báo các biến người dùng
    **********************************************************************/
    currentTabId: '2', // Current TabId
    finalSearchParam: null,
    finalHeaderSearch: null,
    formSearchControlType: '',
    pdfHtml: null,
    printHtml: null,
    gridWidth: 720,                 // gridWidth 
    printPageSet: null,
    columns: null,
    SaveItemCode: '',
    SaveItemDes:'',
    SaveCustCode: '',
    SaveCustDes: '',
    SaveLocaCode: '',
    SaveLocaDes: '',
    searchConditionTitle: '',
    isDataSearching: false,     //데이터 조회중인지 여부 체크(재 조회 방지 구분자)
    /****************************************************************************************************
    * page initialize
    * Khởi tạo trang
    ****************************************************************************************************/
    initProperties: function (options) {
    
        this.finalSearchParam = {
            SEARCHVALUE: '',
            PAGE_CURRENT: 0,
            PAGESIZE: 100,
            CONDITION1: '0',
            CONDITION2: '0'
        }; // 검색 시 정보
        this.defaultSearchParameter = {
            SEARCHVALUE: '',
            EXCEL_FLAG: 'N',
            WH_CD: '',
            CUST: '',
            BASIC_PRICE: 'Y',
            CUST_RATE: 'Y',
            LAST_PRICE: 'Y',
            PRICE_ATOJ: '00'+ecount.delimiter+'01'+ecount.delimiter+'02'+ecount.delimiter+'03'+ecount.delimiter+'04'+ecount.delimiter+'05'+ecount.delimiter+'06'+ecount.delimiter+'07'+ecount.delimiter+'08'+ecount.delimiter+'09'+ecount.delimiter+'10',
            PROD_GROUP_CUST: 'Y',
            PROD_CUST: 'Y',
            PROD_GROUP_WH: 'Y',
            PROD_WH: 'Y',

            PROD_CD: '',
            PROD_CATEGORY: '',
            PROD_CLASS_CD1: '',
            PROD_CLASS_CD2: '',
            PROD_CLASS_CD3: '',
            PROD_LEVEL_GROUP: '',
            PROD_LEVEL_GROUP_CHK: ' ',

            SALE_DEFAULT_PRICE: 'Y',
            PURCHASE_DEFAULT_PRICE: 'Y',
            SALE_DEFAULT_CUST_RATE: ' ',
            PURCHASE_DEFAULT_CUST_RATE: ' ',
            SALE_DEFAULT_LAST_PRICE:' ',
            PURCHASE_DEFAULT_LAST_PRICE: ' ',
            SALE_LEVEL_PROD_GROUP_CUST: ' ',
            PURCHASE_LEVEL_PROD_GROUP_CUST: ' ',
            SALE_LEVEL_PROD_CUST: ' ',
            PURCHASE_LEVEL_PROD_CUST: ' ',
            SALE_LEVEL_PROD_GROUP_WH: ' ',
            PURCHASE_LEVEL_PROD_GROUP_WH: ' ',
            CONDITION1: '0',
            CONDITION2: '0',
            SORT_BY1: '0',
            SORT_BY2: '0',
            SALE_LEVEL_PROD_WH: ' ',
            PURCHASE_LEVEL_PROD_WH:' ',

            PAGE_CURRENT: 0,
            PAGESIZE: 100,
            OUT_VAT_RATE: null,
            IN_VAT_RATE: null,
            BASE_DATE_CHK : '0'
        };

        this.printPageSet = {
            B_MARGIN: 0,
            HEIGHT: 0,
            L_MARGIN: 0,
            PRINT_WAY: "P",
            REDUCE_YN: "N",
            R_MARGIN: 0,
            SIZE_TYPE: 0,
            T_MARGIN: 0,
            WIDTH: 210,
            PAPER_SIZE: "A4",
            PRINT_CSS: ""
        };
    },

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },

   /****************************************************************************************************
   * UI Layout setting
   * Thiết lập giao diện
   ****************************************************************************************************/
    onInitHeader: function (header) {
        var inventory = ecount.config.inventory;
        var self = this,
            g = widget.generator,
            contents = g.contents(),
            toolbar = g.toolbar(),
            ctrl = g.control(),
            form = g.form();


        toolbar
          .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
          .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113))

        var controls = new Array();


        form
        .add(ctrl.define("widget.multiCode.prod", "txtSProdCd", "PROD_CD", ecount.resource.LBL80071).setOptions({ groupId: "prod_code" }).maxSelectCount(100).end())
        .add(ctrl.define("widget.checkbox.prodType", "rbProdChk", "PROD_CATEGORY", ecount.resource.LBL02997).setOptions({ groupId: "prod_code" }).label([ecount.resource.LBL02475, ecount.resource.LBL02025, ecount.resource.LBL01387, ecount.resource.LBL02538, ecount.resource.LBL01250, ecount.resource.LBL01523]).value(['-1', '0', '4', '1', '2', '3']).select('-1').select('0').select('4').select('1').select('2').select('3').end())
        .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd1", "PROD_CLASS_CD1", ecount.resource.LBL03289).setOptions({ groupId: "prod_code" }).maxSelectCount(100).setOptions({ groupId: "prod_code" }).end())
        .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd2", "PROD_CLASS_CD2", ecount.resource.LBL03290).setOptions({ groupId: "prod_code" }).maxSelectCount(100).setOptions({ groupId: "prod_code" }).end())
        .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd3", "PROD_CLASS_CD3", ecount.resource.LBL03291).setOptions({ groupId: "prod_code" }).maxSelectCount(100).setOptions({ groupId: "prod_code" }).end())
        .add(ctrl.define("widget.multiCode.prodLevelGroup", "txtTreeGroupCd", "PROD_LEVEL_GROUP", ecount.resource.LBL07243).setOptions({ groupId: "prod_code" }).end())
        .add(ctrl.define("widget.multiCode.cust", "txtSCustCd", "CUST", ecount.resource.LBL00329).setOptions({ groupId: "cust" }).maxSelectCount(100).end())
        .add(ctrl.define("widget.multiCode.custGroup", "txtCustGroup1", "CUST_GROUP1", ecount.resource.LBL10731).setOptions({ groupId: "cust" }).maxSelectCount(100).end())
        .add(ctrl.define("widget.multiCode.custGroup", "txtCustGroup2", "CUST_GROUP2", ecount.resource.LBL10732).setOptions({ groupId: "cust" }).maxSelectCount(100).end())
        .add(ctrl.define("widget.multiCode.custLevelGroup", "txtCustLevelGroup", "CUST_LEVEL_GROUP", ecount.resource.LBL07244).setOptions({ groupId: "cust" }).end())
        .add(ctrl.define("widget.multiCode.wh", "txtSWhCd", "WH_CD", ecount.resource.LBL02716,"whCd").maxSelectCount(100).end())
        .add(ctrl.define("widget.multiCode.whLevelGroup", "txtTreeWhCd", "WH_LEVEL_GROUP", ecount.resource.LBL07309, "whCd").end())
        .add(ctrl.define("widget.custom", "ddlCondition1", "CONDITION_1", ecount.resource.LBL05621).end())
        .add(ctrl.define("widget.custom", "ddlCondition2", "CONDITION_2", ecount.resource.LBL05627).end())
        .add(ctrl.define("widget.custom", "cbSalePrice", "CUSTOM1", ecount.resource.LBL10762).end())
        .add(ctrl.define("widget.custom", "cbPurchasePrice", "CUSTOM1", ecount.resource.LBL04657).end())
        .add(ctrl.define("widget.checkbox.whole", "txtAToJ", "PRICE_ATOJ", ecount.resource.LBL35521).label([ecount.resource.LBL02475, inventory.PRICE_1.toString(), inventory.PRICE_2.toString(), inventory.PRICE_3.toString(), inventory.PRICE_4.toString(), inventory.PRICE_5.toString(), inventory.PRICE_6.toString(), inventory.PRICE_7.toString(), inventory.PRICE_8.toString(), inventory.PRICE_9.toString(), inventory.PRICE_10.toString()])
                   .value(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10']).select('00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10').end())
        .add(ctrl.define("widget.checkbox", "cbSetFlag", "SET_FLAG", ecount.resource.LBL80195).label([ecount.resource.LBL02884]).value([1]).select(1).end())
        .add(ctrl.define("widget.checkbox", "cbEtcVal", "BASE_DATE_CHK", ecount.resource.LBL00870).label([ecount.resource.LBL10548]).value([1]).end())
        
        contents.add(form).add(toolbar);
        header.useQuickSearch();
        header.setTitle(ecount.resource.LBL02396)
            .add("search", null, false)
            .addContents(contents);
    },

    // Envent Simple search
    // Sự kiện Tìm kiếm đơn giản
    onHeaderSimpleSearch: function (e) {
        this.onHeaderSearch();
    },

    onHeaderQuickSearch: function (e, value) {

        if (!this.getSearchParam()) {
            return false;
        }
        
        this.contents.getGrid("dataGrid").grid.removeShadedColumn();
        this.contents.getGrid("dataGrid").getSettings().setPagingCurrentPage(1);
        this.contents.getGrid("dataGrid").draw(this.finalSearchParam);
    },

    // Event click Search button at Search Form
    // Sự kiện nhấn nút Tìm kiếm tại Biểu mẫu tìm kiếm
    onHeaderSearch: function (forceHide) {
        if (!this.checkConditionDisplay()) {
            return false;
        }

        if (!this.getSearchParam()) {
            return false;
        }
       
        this.finalSearchParam.SEARCHVALUE = "";
        this.header.getQuickSearchControl().setValue(this.finalSearchParam.SEARCHVALUE);
        var grid = this.contents.getGrid();
        grid.grid.clearChecked();
        grid.grid.removeShadedColumn();
        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },

    checkConditionDisplay: function(){
        var ddlCondition1 = this.header.getControl("ddlCondition1");
        var ddlCondition2 = this.header.getControl("ddlCondition2");

     
        if (ddlCondition1.get(0).getValue() != "0" && ddlCondition2.get(0).getValue() != "1") {
            ecount.alert(ecount.resource.MSG06140);
            return false;
        }
        else if (ddlCondition1.get(0).getValue() == ddlCondition2.get(0).getValue() - 1) {
            ecount.alert(ecount.resource.MSG00538);
            return false;
        }
        else if ((ddlCondition2.get(0).getValue()=="2" ||ddlCondition2.get(0).getValue()=="3" ) && ddlCondition1.get(1).getValue() == "2") {
            ecount.alert(String.format(ecount.resource.MSG04209, "2"));
            return false;
        }

        if (ddlCondition1.get(0).getValue() == "0" || ddlCondition2.get(0).getValue() == "1") {
            if (ddlCondition2.get(0).getValue() != "0") {
                if (this.header.getControl("txtSProdCd").getSelectedItem().length == 0 && this.header.getControl("txtClassCd1").getSelectedItem().length == 0 && this.header.getControl("txtClassCd2").getSelectedItem().length == 0 && this.header.getControl("txtClassCd3").getSelectedItem().length == 0 && this.header.getControl("txtTreeGroupCd").getSelectedItem().length == 0) {
                    var control = this.header.getControl("txtSProdCd").showError(ecount.resource.MSG00631);
                    var control = this.header.getControl("txtSWhCd").hideError();
                    var control = this.header.getControl("txtSCustCd").hideError();
                    return false;
                }
            }
        }

        if (ddlCondition1.get(0).getValue() == "1" || ddlCondition2.get(0).getValue() == "2") {
            if (this.header.getControl("txtSCustCd").getSelectedItem().length == 0 && this.header.getControl("txtCustGroup1").getSelectedItem().length == 0 && this.header.getControl("txtCustGroup2").getSelectedItem().length == 0 && this.header.getControl("txtCustLevelGroup").getSelectedItem().length == 0) {
                var control = this.header.getControl("txtSCustCd").showError(ecount.resource.MSG00095);
                var control = this.header.getControl("txtSProdCd").hideError();
                var control = this.header.getControl("txtSWhCd").hideError();
                return false;
            }
        }
        if (ddlCondition1.get(0).getValue() == "2" || ddlCondition2.get(0).getValue() == "3") {
            if (this.header.getControl("txtSWhCd").getSelectedItem().length == 0 && this.header.getControl("txtTreeWhCd").getSelectedItem().length == 0) {
                var control = this.header.getControl("txtSWhCd").showError(ecount.resource.MSG80006);
                var control = this.header.getControl("txtSProdCd").hideError();
                var control = this.header.getControl("txtSCustCd").hideError();
                return false;
            }
        }
        var control = this.header.getControl("txtSProdCd").hideError();
        var control = this.header.getControl("txtSWhCd").hideError();
        var control = this.header.getControl("txtSCustCd").hideError();


        return true;
    },

    getSearchParam: function () {

        var isError = false;

        var conrtrol2 = this.header.getControl("txtAToJ");
        conrtrol2.setDataRules(null);

        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            var targetControl;

            var invalidControl = this.header.getControl(invalid.result[0][0].control.id);

            if (invalidControl) {   //현재 탭에 없을때 

                targetControl = invalidControl
            } else {
                this.header.changeTab(invalid.tabId, true);
                targetControl = invalid.result[0][0].control;
            }
            if (targetControl.id == "rbProdChk") {
                this.header.showGroupRow("txtSProdCd");
            }
            this.header.toggleContents(true, function () {
                targetControl.setFocus(0);
            });
            targetControl.setFocus(0);

            isError = true;
        }
        if (isError)
            return false;

        this.finalSearchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize().result);

        this.finalSearchParam.SEARCHVALUE = this.header.getQuickSearchControl().getValue();

        //Checkbox Sale 
        this.finalSearchParam.SALE_DEFAULT_CUST_RATE = this.finalSearchParam.SALE_DEFAULT_CUST_RATE.length > 0 ? "Y" : " ";
        this.finalSearchParam.SALE_DEFAULT_LAST_PRICE = this.finalSearchParam.SALE_DEFAULT_LAST_PRICE.length > 0 ? "Y" : " ";
        this.finalSearchParam.SALE_DEFAULT_PRICE = this.finalSearchParam.SALE_DEFAULT_PRICE.length > 0 ? "Y" : " ";
        this.finalSearchParam.SALE_LEVEL_PROD_CUST = this.finalSearchParam.SALE_LEVEL_PROD_CUST.length > 0 ? "Y" : " ";
        this.finalSearchParam.SALE_LEVEL_PROD_GROUP_CUST = this.finalSearchParam.SALE_LEVEL_PROD_GROUP_CUST.length > 0 ? "Y" : " ";
        this.finalSearchParam.SALE_LEVEL_PROD_GROUP_WH = this.finalSearchParam.SALE_LEVEL_PROD_GROUP_WH.length > 0 ? "Y" : " ";
        this.finalSearchParam.SALE_LEVEL_PROD_WH = this.finalSearchParam.SALE_LEVEL_PROD_WH.length > 0 ? "Y" : " ";
        //Checkbox Purchase
        this.finalSearchParam.PURCHASE_DEFAULT_CUST_RATE = this.finalSearchParam.PURCHASE_DEFAULT_CUST_RATE.length > 0 ? "Y" : " ";
        this.finalSearchParam.PURCHASE_DEFAULT_LAST_PRICE = this.finalSearchParam.PURCHASE_DEFAULT_LAST_PRICE.length > 0 ? "Y" : " ";
        this.finalSearchParam.PURCHASE_DEFAULT_PRICE = this.finalSearchParam.PURCHASE_DEFAULT_PRICE.length > 0 ? "Y" : " ";
        this.finalSearchParam.PURCHASE_LEVEL_PROD_CUST = this.finalSearchParam.PURCHASE_LEVEL_PROD_CUST.length > 0 ? "Y" : " ";
        this.finalSearchParam.PURCHASE_LEVEL_PROD_GROUP_CUST = this.finalSearchParam.PURCHASE_LEVEL_PROD_GROUP_CUST.length > 0 ? "Y" : " ";
        this.finalSearchParam.PURCHASE_LEVEL_PROD_GROUP_WH = this.finalSearchParam.PURCHASE_LEVEL_PROD_GROUP_WH.length > 0 ? "Y" : " ";
        this.finalSearchParam.PURCHASE_LEVEL_PROD_WH = this.finalSearchParam.PURCHASE_LEVEL_PROD_WH.length > 0 ? "Y" : " ";

        this.finalSearchParam.BASE_DATE_CHK = this.finalSearchParam.BASE_DATE_CHK[0];
        //searchParam.BASE_DATE_CHK = (searchParam.BASE_DATE_CHK != null && searchParam.BASE_DATE_CHK != undefined && searchParam.BASE_DATE_CHK.length > 0) ? '1' : '0';

        var ddlCondition1 = this.header.getControl("ddlCondition1");
        var ddlCondition2 = this.header.getControl("ddlCondition2");

        this.finalSearchParam.CONDITION1 = ddlCondition1.get(0).getValue();
        this.finalSearchParam.CONDITION2 = ddlCondition2.get(0).getValue();

        this.finalSearchParam.SORT_BY1 = ddlCondition1.get(1).getValue();
        this.finalSearchParam.SORT_BY2 = ddlCondition2.get(1).getValue();
        return true;
    },

    // Event click Reset button at Search Form
    // Sự kiện nhấn nút Reset tại Biểu mẫu tìm kiếm
    onHeaderRewrite: function (e) {
       this.header.lastReset(this.finalHeaderSearch);
    },

    // Contents Options settings
    // Thiết lập cho phần nội dung
    onInitContents: function (contents, resource) {
        var inventory = ecount.config.inventory;
        this.columns = [];
        this.columns = [
                        { propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '145', align: 'left' },
                        { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03004, width: '145', align: 'left' },
                        { propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL80099, width: '100', align: 'left' },
                        { propertyName: 'UNIT', id: 'UNIT', title: ecount.resource.LBL35184, width: '100', align: 'left' },
                        { propertyName: 'SALE_PRICE', id: 'SALE_PRICE', title: ecount.resource.LBL80217, width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'PURCHASE_PRICE', id: 'PURCHASE_PRICE', title: ecount.resource.LBL35191, width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        
                        { propertyName: 'OUT_PRICE1', id: 'OUT_PRICE1', title: inventory.PRICE_1.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE2', id: 'OUT_PRICE2', title: inventory.PRICE_2.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE3', id: 'OUT_PRICE3', title: inventory.PRICE_3.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE4', id: 'OUT_PRICE4', title: inventory.PRICE_4.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE5', id: 'OUT_PRICE5', title: inventory.PRICE_5.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE6', id: 'OUT_PRICE6', title: inventory.PRICE_6.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE7', id: 'OUT_PRICE7', title: inventory.PRICE_7.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE8', id: 'OUT_PRICE8', title: inventory.PRICE_8.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE9', id: 'OUT_PRICE9', title: inventory.PRICE_9.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false },
                        { propertyName: 'OUT_PRICE10', id: 'OUT_PRICE10', title: inventory.PRICE_10.toString(), width: '100', align: 'right', dataType: '96', isCheckZero: false }
        ]
       


        var g = widget.generator,
         grid = g.grid();
         grid
             .setRowData(this.viewBag.InitDatas.LoadData)
             .setRowDataParameter(this.defaultSearchParameter)
             .setRowDataUrl("/Account/Basic/GetListPriceByItemForSearch")
             .setColumns(this.columns)
             .setKeyColumn(['PROD_CD'])
             .setColumnFixHeader(true)
             .setEmptyGridMessage(ecount.resource.MSG00205)
             .setPagingUse(true)
             .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
             .setCustomRowCell('SALE_PRICE', this.setGridItemSalePrice.bind(this)) // 품목코드
             .setCustomRowCell('PURCHASE_PRICE', this.setGridItemPurchasePrice.bind(this))
             .setCustomRowCell('OUT_PRICE1', this.setGridOutPrice1.bind(this))
             .setCustomRowCell('OUT_PRICE2', this.setGridOutPrice2.bind(this))
             .setCustomRowCell('OUT_PRICE3', this.setGridOutPrice3.bind(this))
             .setCustomRowCell('OUT_PRICE4', this.setGridOutPrice4.bind(this))
             .setCustomRowCell('OUT_PRICE5', this.setGridOutPrice5.bind(this))
             .setCustomRowCell('OUT_PRICE6', this.setGridOutPrice6.bind(this))
             .setCustomRowCell('OUT_PRICE7', this.setGridOutPrice7.bind(this))
             .setCustomRowCell('OUT_PRICE8', this.setGridOutPrice8.bind(this))
             .setCustomRowCell('OUT_PRICE9', this.setGridOutPrice9.bind(this))
             .setCustomRowCell('OUT_PRICE10', this.setGridOutPrice10.bind(this))
             .setEventShadedColumnId(['SALE_PRICE', 'PURCHASE_PRICE', 'OUT_PRICE1', 'OUT_PRICE2', 'OUT_PRICE3', 'OUT_PRICE4', 'OUT_PRICE5', 'OUT_PRICE6', 'OUT_PRICE7', 'OUT_PRICE8', 'OUT_PRICE9', 'OUT_PRICE10'], { useIntegration: true,isAllRememberShaded: true })

         contents.addGrid("dataGrid", grid);
    },

    //Footer Options settings
    //Thiết lập cho phần cuối trang
    onInitFooter: function (footer, resource) {
       
        var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
        
        var g = widget.generator,
            ctrl = widget.generator.control();
        toolbar = g.toolbar();
        toolbar.addLeft(ctrl.define("widget.button.group", "print").label(ecount.resource.BTN00148)
           .addGroup([{ id: 'pdf', label: ecount.resource.BTN00153 }, { id: 'preview', label: ecount.resource.BTN00017 }]))
           .addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00079).permission([ecount.config.user.USE_EXCEL_CONVERT, message]));
        footer.add(toolbar);
    },

    setGridItemSalePrice: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = {};
            
            var self = this;

            if (rowItem["SALE_PRICE_VAT"] == "1") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {

                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }

            //if (this._userParam != undefined) {
            //    if (this._userParam.cSalePrice == (rowItem['SALE_PRICE']) && this.cProdCd == rowItem['PROD_CD']) {
            //        option.attrs = {
            //            'class': ['text-primary-inverse']
            //        };
            //        this.cSalePrice = this._userParam.cSalePrice;
            //    }
            //}
            //else {
            //    if (parseInt(this.cSalePrice) == (rowItem['SALE_PRICE']) && this.cProdCd == rowItem['PROD_CD']) {
            //        option.attrs = {
            //            'class': ['text-primary-inverse']
            //        }
            //    };
            //};

            return option;
        }
    },

    setGridItemPurchasePrice: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;


            if (rowItem["PURCHASE_PRICE_VAT"] == "1") {
                option.controlType= 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {

                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    if (data.rowItem.PROD_CD == data.rowItem.G_PROD_CD) {
                        if (ecount.config.inventory.PROC_FLAG != "Y") {
                            ecount.alert(ecount.resource.MSG01778);
                            return false;
                        }
                    }

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "IN_PRICE",
                        tabId: "PRICE"

                    }

                    this.openItemReg(param);

                    e.preventDefault();

                }.bind(this)
            }

            //if (this._userParam != undefined) {
            //    if (this._userParam.cPurchasePrice == (rowItem['PURCHASE_PRICE']) && this.cProdCd == rowItem['PROD_CD']) {
            //        option.attrs = {
            //            'class': ['text-primary-inverse']
            //        };
            //        this.cPurchasePrice = this._userParam.cPurchasePrice;
            //    }
            //}
            //else {
            //    if (parseInt(this.cPurchasePrice) == (rowItem['PURCHASE_PRICE']) && this.cProdCd == rowItem['PROD_CD']) {
            //        option.attrs = {
            //            'class': ['text-primary-inverse']
            //        }
            //    };
            //};

            return option;
        }
    },

    onMessageHandler: function (page, message) {
        this.finalSearchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize().result);
        switch (page.pageID) {
            case "ESA010M":
            case "ESA071P_02":
            case "ESA002M":
            case "ESA014P_02":
                if (["ESA010M"].contains(page.pageID))
                    this._ON_REDRAW();
                else
                    this.SetReload();
                break;
            case "PdfSetUp":
                var option = {
                    gridWidth: this.gridWidth,
                    htmlContent: this.pdfHtml,
                    author: 'ECOUNT',
                    keywords: 'ESA064M',
                    subject: 'ESA064M',
                    title: 'ESA064M',
                    templateName: 'PdfBasic'
                };
                message(option);
                break;
            case "PrintPage":
                var option = {
                    gridWidth: this.gridWidth,
                    htmlContent: this.printHtml,
                    printCss: this.printPageSet.PRINT_CSS
                }
                message(option);
                break;
            }
    },

    setGridSaleCustRate: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";
            if (rowItem.BUSINESS_NO == undefined || rowItem.BUSINESS_NO == null)
                option.data = value;
            else
                option.data = value;
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    param = {
                        BUSINESS_NO: data.rowItem.BUSINESS_NO,
                        controlId: "EXCH_DENO",
                        tabId: "PRICE"
                    }
                    this.OpenCustRegisterPopup(param);
                    e.preventDefault();
                }.bind(this)
            }
            
            return option;
        }
    },

    setGridPurchaseCustRate: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.BUSINESS_NO == undefined || rowItem.BUSINESS_NO == null)
                option.data = value;
            else
                option.data = value;
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    param = {
                        BUSINESS_NO: data.rowItem.BUSINESS_NO,
                        controlId: "OUT_PRICE6",
                        tabId: "PRICE"
                    }

                    this.OpenCustRegisterPopup(param);
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },


    OpenCustRegisterPopup: function (param) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 700,
            Cust: param.BUSINESS_NO ? param.BUSINESS_NO : '',
            controlId: param.controlId,
            tabId: param.tabId

        }
        this.openWindow({
            url: "/ECERP/ESA/ESA002M",
            name: ecount.resource.LBL93466,
            param: param
        });
    },

    setGridSaleSpecialPrice2: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE2_SALE == undefined || rowItem.SPECIALPRICE2_SALE == null)
                option.data = value;
            else
                option.data = value;
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CODE_CLASS_CUST_SALE == "" || data.rowItem.CODE_CLASS_CUST_SALE == undefined) {
                        ecount.alert(ecount.resource.MSG04824);
                        return;
                    }
                    else {

                        if (data.rowItem.CLASS_CD == "" || data.rowItem.CLASS_CD == undefined) {
                            ecount.alert(String.format(ecount.resource.MSG04828, $.isNull(this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG));
                            return;
                        }

                        else {
                            param = {
                                CLASS_CD: data.rowItem.CLASS_CD,
                                CLASS_GUBUN: data.rowItem.CLASS_GUBUN,
                                CODE_CLASS: data.rowItem.CODE_CLASS_CUST_SALE,
                                DES_CLASS: data.rowItem.CLASS_DES_CUST_SALE,
                                CLASS_DES: data.rowItem.CLASS_DES
                            }

                            this.OpenItemGroupPopup(param);
                        }
                    }
                    e.preventDefault();
                }.bind(this)
                    
            }

            return option;
        }
    },

    setGridPurchaseSpecialPrice2: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE2_PURCHASE == undefined || rowItem.SPECIALPRICE2_PURCHASE == null)
                option.data = value;
            else
                option.data = value;
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CODE_CLASS_CUST_PURCHASE == "" || data.rowItem.CODE_CLASS_CUST_PURCHASE == undefined) {
                        ecount.alert(ecount.resource.MSG04825);
                        return;
                    }
                    else {

                        if (data.rowItem.CLASS_CD == "" || data.rowItem.CLASS_CD == undefined) {
                            ecount.alert(String.format(ecount.resource.MSG04828, $.isNull(this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG));
                            return;
                        }
                        else {
                            param = {
                                CLASS_CD: data.rowItem.CLASS_CD,
                                CLASS_GUBUN: data.rowItem.CLASS_GUBUN,
                                CODE_CLASS: data.rowItem.CODE_CLASS_CUST_PURCHASE,
                                DES_CLASS: data.rowItem.CLASS_DES_CUST_PURCHASE,
                                CLASS_DES: data.rowItem.CLASS_DES
                            }

                            this.OpenItemGroupPopup(param);
                        }
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    OpenItemGroupPopup: function (param) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 300,
            Procd: param.PROD_CD ? param.PROD_CD : '',
            editFlag: "M",
            isOpenPopup: true,
            CLASS_CD: param.CLASS_CD,
            CLASS_GUBUN: param.CLASS_GUBUN,
            CODE_CLASS: param.CODE_CLASS,
            CLASS_DES: param.CLASS_DES,
            DES_CLASS : param.DES_CLASS,
            isPriceByItemCall : true
        }
        this.openWindow({
            url: "/ECERP/ESA/ESA071P_02",
            name: String.format(ecount.resource.LBL06434, ecount.resource.LBL10030),
            param: param
        });
    },


    setGridSaleSpecialPrice: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE_SALE == undefined || rowItem.SPECIALPRICE_SALE == null)
                option.data = value;
            else
                option.data = value;

            if (rowItem["S4_VAT_YN_SALE"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }


            //option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CLASS_DES_CUST_SALE == "" || data.rowItem.CLASS_DES_CUST_SALE == undefined) {
                        ecount.alert(ecount.resource.MSG04824);
                        return;
                    }
                    else {
                        param = {
                            PROD_CD: data.rowItem.PROD_CD,
                            PROD_DES: data.rowItem.PROD_DES,
                            CODE_CLASS: data.rowItem.CODE_CLASS_CUST_SALE,
                            DES_CLASS: data.rowItem.CLASS_DES_CUST_SALE,
                        }

                        this.OpenItemPopup(param);
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridPurchaseSpecialPrice: function (value, rowItem) {
        
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE_PURCHASE == undefined || rowItem.SPECIALPRICE_PURCHASE == null)
                option.data = value;
            else
                option.data = value;
            //option.controlType = "widget.link";
            if (rowItem["S4_VAT_YN_PURCHASE"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CLASS_DES_CUST_PURCHASE == "" || data.rowItem.CLASS_DES_CUST_PURCHASE == undefined) {
                        ecount.alert(ecount.resource.MSG04825);
                        return option;
                    }
                    else {
                        param = {
                            PROD_CD: data.rowItem.PROD_CD,
                            PROD_DES: data.rowItem.PROD_DES,
                            CODE_CLASS: data.rowItem.CODE_CLASS_CUST_PURCHASE,
                            DES_CLASS: data.rowItem.CLASS_DES_CUST_PURCHASE,
                        }

                        this.OpenItemPopup(param);
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    OpenItemPopup: function (param) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 270,
            editFlag: "M",
            isOpenPopup: true,
            code_class: param.CODE_CLASS,
            des_class: param.DES_CLASS,
            PROD_CD: param.PROD_CD,
            PROD_DES: param.PROD_DES,
            isPriceByItemCall: true
        }
        this.openWindow({
            url: "/ECERP/ESA/ESA014P_02",
            name: String.format(ecount.resource.LBL06434, ecount.resource.LBL06436),
            param: param
        });
    },

    setGridSaleSpecialPrice3: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE3_2_SALE == undefined || rowItem.SPECIALPRICE3_2_SALE == null)
                option.data = value;
            else
                option.data = value;
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CODE_CLASS_WH_SALE == "" || data.rowItem.CODE_CLASS_WH_SALE == undefined) {
                        ecount.alert(ecount.resource.MSG04826);
                        return;
                    }
                    else {
                        if (data.rowItem.CLASS_CD == "" || data.rowItem.CLASS_CD == undefined) {
                            ecount.alert(String.format(ecount.resource.MSG04828, $.isNull(this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG));
                            return;
                        }
                        else {
                            param = {
                                CLASS_CD: data.rowItem.CLASS_CD,
                                CLASS_GUBUN: data.rowItem.CLASS_GUBUN,
                                CODE_CLASS: data.rowItem.CODE_CLASS_WH_SALE,
                                DES_CLASS: data.rowItem.CLASS_DES_WH_SALE,
                                CLASS_DES: data.rowItem.CLASS_DES
                            }

                            this.OpenItemGroupPopup(param);
                        }
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridPurchaseSpecialPrice3: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE3_2_PURCHASE == undefined || rowItem.SPECIALPRICE3_2_PURCHASE == null)
                option.data = value;
            else
                option.data = value;
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CODE_CLASS_WH_PURCHASE == "" || data.rowItem.CODE_CLASS_WH_PURCHASE == undefined) {
                        ecount.alert(ecount.resource.MSG04827);
                        return;
                    }
                    else {
                        if (data.rowItem.CLASS_CD == "" || data.rowItem.CLASS_CD == undefined) {
                            ecount.alert(String.format(ecount.resource.MSG04828, $.isNull(this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG));
                            return;
                        }
                        else {
                            param = {
                                CLASS_CD: data.rowItem.CLASS_CD,
                                CLASS_GUBUN: data.rowItem.CLASS_GUBUN,
                                CODE_CLASS: data.rowItem.CODE_CLASS_WH_PURCHASE,
                                DES_CLASS: data.rowItem.CLASS_DES_WH_PURCHASE,
                                CLASS_DES: data.rowItem.CLASS_DES
                            }

                            this.OpenItemGroupPopup(param);
                        }
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridSaleSpecialPrice3_1: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE3_1_SALE == undefined || rowItem.SPECIALPRICE3_1_SALE == null)
                option.data = value;
            else
                option.data = value;

            if (rowItem["S4_VAT_YN3_1_SALE"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CLASS_DES_WH_SALE == "" || data.rowItem.CLASS_DES_WH_SALE == undefined) {
                        ecount.alert(ecount.resource.MSG04826);
                        return;
                    }
                    else {
                        param = {
                            PROD_CD: data.rowItem.PROD_CD,
                            PROD_DES: data.rowItem.PROD_DES,
                            CODE_CLASS: data.rowItem.CODE_CLASS_WH_SALE,
                            DES_CLASS: data.rowItem.CLASS_DES_WH_SALE,
                        }

                        this.OpenItemPopup(param);
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridPurchaseSpecialPrice3_1: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var self = this;
            var option = [];
            var param = "";

            if (rowItem.SPECIALPRICE3_1_PURCHASE == undefined || rowItem.SPECIALPRICE3_1_PURCHASE == null)
                option.data = value;
            else
                option.data = value;
            if (rowItem["S4_VAT_YN3_1_PURCHASE"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    if (data.rowItem.CLASS_DES_WH_PURCHASE == "" || data.rowItem.CLASS_DES_WH_PURCHASE == undefined) {
                        ecount.alert(ecount.resource.MSG04827);
                        return;
                    }
                    else {
                        param = {
                            PROD_CD: data.rowItem.PROD_CD,
                            PROD_DES: data.rowItem.PROD_DES,
                            CODE_CLASS: data.rowItem.CODE_CLASS_WH_PURCHASE,
                            DES_CLASS: data.rowItem.CLASS_DES_WH_PURCHASE,
                        }

                        this.OpenItemPopup(param);
                    }
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridOutPrice1: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;            
            if (rowItem["OUT_PRICE1_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            //option.controlType = "widget.link";
            //option.data = value;

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE1",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridOutPrice2: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE2_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE2",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }
            return option;
        }
    },

    setGridOutPrice3: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE3_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {

                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE3",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridOutPrice4: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE4_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE4",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }
            
            return option;
        }
    },

    setGridOutPrice5: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE5_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE5",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }

            return option;
        }
    },

    setGridOutPrice6: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE6_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {

                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE6",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }
            
            return option;
        }
    },

    setGridOutPrice7: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE7_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE7",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }
            
            return option;
        }
    },

    setGridOutPrice8: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE8_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE8",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }            

            return option;
        }
    },

    setGridOutPrice9: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE9_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                    
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE9",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }
            
            return option;
        }
    },

    setGridOutPrice10: function (value, rowItem) {
        if (this.viewBag.Permission.Permit.Value == "W") {
            var option = [];
            var self = this;
            if (rowItem["OUT_PRICE10_VAT_YN"] == "Y") {
                option.controlType = 'widget.faCheckWithLink'
                option.faCheckColorCss = 'text-warning';
                option.faCheckTooltip = {
                    'data-placement': 'top',
                    'data-html': 'true',
                    'data-original-title': ecount.resource.LBL00253
                };
            } else {
                option.controlType = "widget.link";
                option.data = value;
            }

            option.event = {
                'click': function (e, data) {
                   
                    var param = "";
                    var hidData = "";
                    var url = "";
                    var ProdCd = data.rowItem.PROD_CD;
                    var GProdCd = data.rowItem.G_PROD_CD;
                    var Cancel = data.rowItem.DEL_GUBUN;
                    var ProdFlag = data.rowItem.PROD_TYPE;

                    param = {
                        isMultiProcess: (ProdCd == GProdCd) ? true : false,
                        EditFlag: "M",
                        isSaveContentsFlag: false,   // 저장유지버튼 사용여부
                        PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
                        PROD_CD: ProdCd,
                        controlId: "OUT_PRICE10",
                        tabId: "PRICE"

                    }
                    this.openItemReg(param);
                    e.preventDefault();
                }.bind(this)
            }
            
            return option;
        }
    },

    SetReload: function () {
        if (!this.getSearchParam()) {
            return false;
        }
        this.contents.getGrid("dataGrid").draw(this.finalSearchParam);
    },
     
    openItemReg: function (inValue) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 700,
            isMultiProcess: inValue.isMultiProcess,
            EditFlag: inValue.EditFlag,
            isSaveContentsFlag: inValue.isSaveContentsFlag,   // 저장유지버튼 사용여부
            isCloseFlag: true,  // 닫기버튼 사용여부
            PROD_FLAG: inValue.PROD_FLAG,
            PROD_CD: inValue.PROD_CD,
            isChangeTab: true,
            controlId: inValue.controlId,
            tabId: inValue.tabId

        }
        this.openWindow({
            url: "/ECERP/ESA/ESA010M",
            name: ecount.resource.LBL02390,
            param: param
        });
    },

    // Init control
    // Khởi tạo control
    onInitControl: function (cid, control) {
        var defaultParam = [];
        var inventory = ecount.config.inventory;
        var g = widget.generator,
        ctrl = g.control();
        var res = ecount.resource;
        switch (cid) { 
            //case "cbSalePrice":
            //    control
            //        .addControl(ctrl.define("widget.label", "txtSalePrice", "txtSalePrice").label('&nbsp;&nbsp;' + res.LBL05427).useHTML())
            //         .addControl(ctrl.define("widget.label", "inline", "inline").label().css("inline-divider").useHTML())
            //         .addControl(ctrl.define("widget.checkbox", "chkSaleDefaultPrice", "SALE_DEFAULT_PRICE").label(res.LBL80217).useHTML().value(1))
            //         .addControl(ctrl.define("widget.checkbox", "chkSaleDefaultCustRate", "SALE_DEFAULT_CUST_RATE").label(res.LBL08985).useHTML().value(1))
            //         .addControl(ctrl.define("widget.checkbox", "chkSaleDefaultLastPrice", "SALE_DEFAULT_LAST_PRICE").label(res.LBL04171).useHTML().value(1)).end();
            //    control
            //        .addControl(ctrl.define("widget.label", "txtSalePriceLevel", "txtSalePriceLevel").label('</br>' + '&nbsp;&nbsp;' + res.LBL02920).useHTML())
            //        .addControl(ctrl.define("widget.label", "inline1", "inline1").label().css("inline-divider").useHTML())
            //        .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdGroupCust", "SALE_LEVEL_PROD_GROUP_CUST").label(res.LBL09022 + '(' + res.LBL35004 + ')').useHTML().value(1))
            //        .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdCust", "SALE_LEVEL_PROD_CUST").label(res.LBL03311 + '(' + res.LBL35004 + ')').useHTML().value(1))
            //        .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdGroupWh", "SALE_LEVEL_PROD_GROUP_WH").label(res.LBL09022 + '(' + res.LBL07275 + ')').useHTML().value(1))
            //        .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdWh", "SALE_LEVEL_PROD_WH").label(res.LBL03311 + '(' + res.LBL07275 + ')').useHTML().value(1)).end();
            //    break;
            //case "cbPurchasePrice":
            //    control
            //       .addControl(ctrl.define("widget.label", "txtPurchasePrice", "txtPurchasePrice").label('&nbsp;&nbsp;' + res.LBL05427).useHTML())
            //       .addControl(ctrl.define("widget.label", "inline", "inline").label().css("inline-divider").useHTML())
            //       .addControl(ctrl.define("widget.checkbox", "chkPurchaseDefaultPrice", "PURCHASE_DEFAULT_PRICE").label(res.LBL35191).useHTML().value(1))
            //       .addControl(ctrl.define("widget.checkbox", "chkPurchaseDefaultCustRate", "PURCHASE_DEFAULT_CUST_RATE").label(res.LBL08985).useHTML().value(1))
            //       .addControl(ctrl.define("widget.checkbox", "chkPurchaseDefaultLastPrice", "PURCHASE_DEFAULT_LAST_PRICE").label(res.LBL04171).useHTML().value(1)).end();
            //    control
            //        .addControl(ctrl.define("widget.label", "txtPurchasePriceLevel", "txtPurchasePriceLevel").label('</br>' + '&nbsp;&nbsp;' + res.LBL02920).useHTML())
            //        .addControl(ctrl.define("widget.label", "inline1", "inline1").label().css("inline-divider").useHTML())
            //        .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdGroupCust", "PURCHASE_LEVEL_PROD_GROUP_CUST").label(res.LBL09022 + '(' + res.LBL35004 + ')').useHTML().value(1))
            //        .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdCust", "PURCHASE_LEVEL_PROD_CUST").label(res.LBL03311 + '(' + res.LBL35004 + ')').useHTML().value(1))
            //        .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdGroupWh", "PURCHASE_LEVEL_PROD_GROUP_WH").label(res.LBL09022 + '(' + res.LBL07275 + ')').useHTML().value(1))
            //        .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdWh", "PURCHASE_LEVEL_PROD_WH").label(res.LBL03311 + '(' + res.LBL07275 + ')').useHTML().value(1)).end();
            //    break;
            case "cbSalePrice":
                control
                    .addControl(ctrl.define("widget.label", "txtSalePrice", "txtSalePrice").label('&nbsp;&nbsp;' + res.LBL05427).useHTML().noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.label", "inline", "inline").label().css("inline-divider").noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleDefaultPrice", "SALE_DEFAULT_PRICE").label(res.LBL80217).value(1).noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleDefaultCustRate", "SALE_DEFAULT_CUST_RATE").label(res.LBL08985).value(1).noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleDefaultLastPrice", "SALE_DEFAULT_LAST_PRICE").label(res.LBL04171).value(1).setInlineIndex(0)).end();
                control
                    .addControl(ctrl.define("widget.label", "txtSalePriceLevel", "txtSalePriceLevel").label('&nbsp;&nbsp;' + res.LBL02920).useHTML().noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.label", "inline1", "inline1").label().css("inline-divider").noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdGroupCust", "SALE_LEVEL_PROD_GROUP_CUST").label(res.LBL09022 + '(' + res.LBL35004 + ')').value(1).noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdCust", "SALE_LEVEL_PROD_CUST").label(res.LBL03311 + '(' + res.LBL35004 + ')').value(1).noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdGroupWh", "SALE_LEVEL_PROD_GROUP_WH").label(res.LBL09022 + '(' + res.LBL07275 + ')').value(1).noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkSaleLevelProdWh", "SALE_LEVEL_PROD_WH").label(res.LBL03311 + '(' + res.LBL07275 + ')').value(1).setInlineIndex(1)).end();
                break;
            case "cbPurchasePrice":
                control
                    .addControl(ctrl.define("widget.label", "txtPurchasePrice", "txtPurchasePrice").label('&nbsp;&nbsp;' + res.LBL05427).useHTML().noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.label", "inline", "inline").label().css("inline-divider").noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseDefaultPrice", "PURCHASE_DEFAULT_PRICE").label(res.LBL35191).value(1).noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseDefaultCustRate", "PURCHASE_DEFAULT_CUST_RATE").label(res.LBL08985).value(1).noneFlex().setInlineIndex(0))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseDefaultLastPrice", "PURCHASE_DEFAULT_LAST_PRICE").label(res.LBL04171).value(1).setInlineIndex(0)).end();
                control
                    .addControl(ctrl.define("widget.label", "txtPurchasePriceLevel", "txtPurchasePriceLevel").label('&nbsp;&nbsp;' + res.LBL02920).useHTML().noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.label", "inline1", "inline1").label().css("inline-divider").noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdGroupCust", "PURCHASE_LEVEL_PROD_GROUP_CUST").label(res.LBL09022 + '(' + res.LBL35004 + ')').value(1).noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdCust", "PURCHASE_LEVEL_PROD_CUST").label(res.LBL03311 + '(' + res.LBL35004 + ')').value(1).noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdGroupWh", "PURCHASE_LEVEL_PROD_GROUP_WH").label(res.LBL09022 + '(' + res.LBL07275 + ')').value(1).noneFlex().setInlineIndex(1))
                    .addControl(ctrl.define("widget.checkbox", "chkPurchaseLevelProdWh", "PURCHASE_LEVEL_PROD_WH").label(res.LBL03311 + '(' + res.LBL07275 + ')').value(1).setInlineIndex(1)).end();
                break;
            case "ddlCondition1":
                control.columns(6, 6)
                .addControl(ctrl.define("widget.select", "ddlSelect_Condition11", "CONDITION_TYPE_11", ecount.resource.LBL05621)
                  .option([["0", ecount.resource.LBL80071], ["1", ecount.resource.LBL35004], ["2", ecount.resource.LBL03407]])
                  .select("0"))
                .addControl(ctrl.define("widget.select", "ddlSelect_Condition12", "CONDITION_TYPE_12", ecount.resource.LBL05621)
                  .option([["0", ecount.resource.LBL02882], ["1", ecount.resource.LBL02880] /*, ["2", ecount.resource.LBL00781]*/])
                  .select("0")
                  .end());
                break;
            case "ddlCondition2":
                control.columns(6, 6)
                .addControl(ctrl.define("widget.select", "ddlSelect_Condition21", "CONDITION_TYPE_21", ecount.resource.LBL05627)
                  .option([["0", ecount.resource.LBL03552], ["1", ecount.resource.LBL80071], ["2", ecount.resource.LBL35004], ["3", ecount.resource.LBL03407]])
                  .select("0").singleCell()
                  .end())
                .addControl(ctrl.define("widget.select", "ddlSelect_Condition22", "CONDITION_TYPE_22", ecount.resource.LBL05627)
                  .option([["0", ecount.resource.LBL02882], ["1", ecount.resource.LBL02880]/*, ["2", ecount.resource.LBL00781]*/])
                  .select("0").singleCell()
                  .end())
                break;
            default:
                break;
        }
    },

    onFocusOutHandler: function () {
        var ctrl = this.header.getControl("search");
        ctrl && ctrl.setFocus(0);
    },

    // Popup Handler
    // Phát sinh hộp thoại
    onPopupHandler: function (control, param, handler) {

        if (control.id == "txtSProdCd") {           // prodecut code
            param.isApplyDisplayFlag = true;
            param.isCheckBoxDisplayFlag = true;
            param.isIncludeInactive = true;         //
        }
        else if (control.id === "txtClassCd1" || control.id === "txtClassCd2" || control.id === "txtClassCd3") {  // product group
            param.isApplyDisplayFlag = true;       // apply 
            param.isCheckBoxDisplayFlag = true;    // checkbox
            param.isIncludeInactive = true;        // 
        }
        
        else if (control.id == "txtCustGroup1" || control.id == "txtCustGroup2") {
            param.isApplyDisplayFlag = true;       // apply 
            param.isIncludeInactive = true;
            param.isCheckBoxDisplayFlag = true;    // checkbox
        } else if (control.id == "txtSWhCd") {
            param.isApplyDisplayFlag = true;       // apply 
            param.isIncludeInactive = true;        // 
        } else if (control.id == "txtSCustCd") {
            param.isApplyDisplayFlag = true;       // apply 
            param.isCheckBoxDisplayFlag = true;    // checkbox
            param.isIncludeInactive = true;        // 
        }

        handler(param);
    },

    onGridAfterFormLoad: function (e, data) {
        var formOption = {};
        
       // this.printPageSet.printCss = { printCss: "" };
      

        // 타이틀바 추가
        this.gridObj = this.contents.getGrid("dataGrid");
        var columns = this.columns;
        var width = 0;
        if (data.columnForm != null) {
            for (var ii = 0, ilen = columns.length; ii < ilen; ii++) {
                width = parseInt(width) + parseInt(columns[ii].width);
            }
        }
        else {
            width = 750;
            this.printPageSet.WIDTH = 750;
        }
       // boxTitle = data.columnForm.option.formTitle;


        var titlebarOption = {
            serNo: 2, // 0:회계결재라인1, 1:회계결재라인2,  2:재고결재라인, 3:관리결재라인
            bSignBox: "0", // 결재방체크유무
            boxTitle: '',  // Box의 타이틀 
            boxWidth: width,           //테이블 width값
            bBrTag: true,       // br태그 유무
            bTitle: true,        // 타이틀 보이기 유무
            underline: false,
            isSignBoxLeftHeaderWidthFix: false
        };

        this.gridWidth = width;
        
        this.drawContentsTitlebar(titlebarOption);

        //var parent = $("#titleContents");
        //if (this.titlebar) {
        //    this.titlebar.destroy();
        //}

        //this.titlebar = new ecount.layout.titlebar(titlebarOption);
        //this.titlebar.render(parent);

    },

    onFooterPrint: function (e) {
        this.searial = 0;
        this.searialManu = 0;
        this.printHtml = this.contents.getGrid(this.gridId).grid.getHTML().replace(/text-primary-inverse/g, "bsy");
        var option = {
            gridWidth: this.gridWidth,
            printCss: this.printPageSet.PRINT_CSS
        }

        this.EXPORT_PRINT(option);
    },

    onButtonPdf: function (e) {

        this.searial = 0;
        this.searialManu = 0;
        this.saveProcd = '';
        var option = {
            keywords: "ESA064M",
            gridWidth: this.gridWidth,
            pageSetup: this.printPageSet
        };

        this.pdfHtml = this.titlebar.getHTML() + this.contents.getGrid(this.gridId).grid.getHTML().replace(/text-primary-inverse/g, "bsy");
        this.EXPORT_PDF(option);

    },

    onButtonPreview: function (e) {
        this.searial = 0;
        this.searialManu = 0;
        this.saveProcd = '';

        ecount.infra.preview(this.titlebar.getHTML() + this.contents.getGrid(this.gridId).grid.getHTML().replace(/text-primary-inverse/g, "bsy"), this.gridWidth);
    },

    onFooterExcel: function (e) {
        var res = ecount.resource;
        if (!this.getSearchParam()) {
            return false;
        }
        this.finalSearchParam.Columns = this.columns;

        if (this.header.getControl("cbSetFlag").getValue() == false) {
            var ddlCondition1 = this.header.getControl("ddlCondition1");
            var maxCol = this.columns.length;
            if (ddlCondition1.get(0).getValue() == "0") {
                this.columns.push({ index: maxCol, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '145', align: 'left', fontSize: 11, IsHideColumn: true });
            }
            else if (ddlCondition1.get(0).getValue() == "1") {
                this.columns.push({ index: i, propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL00381, width: '145', align: 'left', fontSize: 11, IsHideColumn: true });
            }
            else {
                this.columns.push({ index: i, propertyName: 'WH_CD', id: 'WH_CD', title: ecount.resource.LBL00130, width: '145', align: 'left', fontSize: 11, IsHideColumn:true });
            }
        }

        var param = {

            wh: this.header.getControl("txtSWhCd", "all").getSelectedLabel(),
            customer: this.header.getControl("txtSCustCd", "all").getSelectedLabel(),
            product: this.header.getControl("txtSProdCd", "all").getSelectedLabel(),
            dateFrom: new Date().format("yyyyMMdd"),
            dateTo: new Date().format("yyyyMMdd")
        };
        this.searchConditionTitle = ecount.document.getSearchConditionTitle("inventory", param);



        this.finalSearchParam.ExcelTitle = this.searchConditionTitle.leftTitle ;
        var excelParam = this.finalSearchParam;

        excelParam.EXCEL_FLAG = "Y";

        this.EXPORT_EXCEL({
            url: "/Account/Basic/GetListPriceByItemForSearchExcel",
            param: excelParam
        });

        excelParam.EXCEL_FLAG = "N";
    },

    // Event Load Complete
    // Sự kiện tải trang hoàn thành
    onLoadComplete: function (e, cid, control) {
        
     
      //  this.currentTabId = this.contents.currentTabId;
        //var control = e.__self;
        
        var ddlCondition1 = this.header.getControl("ddlCondition1");
        var ddlCondition2 = this.header.getControl("ddlCondition2");        
        var cbSalePrice = this.header.getControl("cbSalePrice", "all");
        var cbPurchasePrice = this.header.getControl("cbPurchasePrice", "all");
        
        //if (control.id === "ddlSelect_Condition11" || control.id === "ddlSelect_Condition21") {
            // Mặt Hàng + Không Có (Item + None)
            if (ddlCondition1.get(0).getValue() == "0" && ddlCondition2.get(0).getValue() == "0") {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(true);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(true);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(true);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(true);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(true);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(true);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(true);

                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(true);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(true);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(true);

                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(true);
                /// Level
                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(true);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(true);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(true);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(true);
            }
                // Mặt hàng + khách hàng,ncc / khách hàng,ncc + mặt hàng 
            else if ((ddlCondition1.get(0).getValue() == "0" && ddlCondition2.get(0).getValue() == "2") || (ddlCondition1.get(0).getValue() == "1" && ddlCondition2.get(0).getValue() == "1")) {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(true);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(false);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(false);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(false);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(false);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(true);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(true);
                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(true);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(false);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(false);
                /// Level
                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(false);

                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(false);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(true);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(true);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(true);
            }
                //Mặt hàng + kho-địa điểm / Kho-địa điểm + mặt hàng 
            else if ((ddlCondition1.get(0).getValue() == "0" && ddlCondition2.get(0).getValue() == "3" || ddlCondition1.get(0).getValue() == "2" && ddlCondition2.get(0).getValue() == "1")) {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(true);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(true);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(true);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(true);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(true);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(false);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(false);
                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(true);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(true);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(true);

                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(true);

                /// Level
                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(true);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(true);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(false);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(false);
            }
            else {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(false);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(false);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(false);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(false);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(false);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(false);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(false);
                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(false);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(false);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(false);

                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(false);

                /// Level
                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(false);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(false);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(false);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(false);
            }
        //}
           if (!e.unfocus) {
                this.header.getQuickSearchControl().setFocus(0);
            }
    },
    onChangeControl: function (e) {
        var control = e.__self;
        var ddlCondition1 = this.header.getControl("ddlCondition1");
        var ddlCondition2 = this.header.getControl("ddlCondition2");
        var cbSalePrice = this.header.getControl("cbSalePrice", "all");
        var cbPurchasePrice = this.header.getControl("cbPurchasePrice", "all");
     
        if (control.id === "ddlSelect_Condition11" || control.id === "ddlSelect_Condition21") {
            // Mặt Hàng + Không Có (Item + None)
            if (ddlCondition1.get(0).getValue() == "0" && ddlCondition2.get(0).getValue() == "0") {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(true);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(true);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(true);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(true);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(true);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(true);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(true);

                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(true);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(true);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(true);

                //cbPurchasePrice.get(5).setValue(false);  // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(true);

                /// Level
                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(true);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(true);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(true);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(true);
            }
            // Mặt hàng + khách hàng,ncc / khách hàng,ncc + mặt hàng 
            else if ((ddlCondition1.get(0).getValue() == "0" && ddlCondition2.get(0).getValue() == "2") || (ddlCondition1.get(0).getValue() == "1" && ddlCondition2.get(0).getValue() == "1")) {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(true);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(false);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(false);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(false);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(false);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(true);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(true);
                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(true);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(false);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(false);
                /// Level
                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(false);

                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(false);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(false);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(true);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(true);
            }
            //Mặt hàng + kho-địa điểm / Kho-địa điểm + mặt hàng 
            else if ((ddlCondition1.get(0).getValue() == "0" && ddlCondition2.get(0).getValue() == "3" || ddlCondition1.get(0).getValue() == "2" && ddlCondition2.get(0).getValue() == "1")) {
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(true);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(true);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(true);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(true);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(true);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(false);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(false);
                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(true);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(true);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(true);

                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(true);
                /// Level
                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(true);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(true);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(false);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(false);
            }
            else { 
                // Sale Price 
                /// Default
                cbSalePrice.get(2).setValue(false);
                cbSalePrice.get(2).readOnly(false);

                cbSalePrice.get(3).setValue(false);
                cbSalePrice.get(3).readOnly(false);

                cbSalePrice.get(4).setValue(false);
                cbSalePrice.get(4).readOnly(false);
                /// Level
                cbSalePrice.get(7).setValue(false);
                cbSalePrice.get(7).readOnly(false);

                cbSalePrice.get(8).setValue(false);
                cbSalePrice.get(8).readOnly(false);

                cbSalePrice.get(9).setValue(false);
                cbSalePrice.get(9).readOnly(false);

                cbSalePrice.get(10).setValue(false);
                cbSalePrice.get(10).readOnly(false);
                // Purchase Price
                /// Default
                cbPurchasePrice.get(2).setValue(false);
                cbPurchasePrice.get(2).readOnly(false);

                cbPurchasePrice.get(3).setValue(false);
                cbPurchasePrice.get(3).readOnly(false);

                cbPurchasePrice.get(4).setValue(false);
                cbPurchasePrice.get(4).readOnly(false);

                //cbPurchasePrice.get(5).setValue(false); // label 인데 왜 setValue(false), readOnly 하는가? 구버전은 setValue(false) 하면 아무일도 일어나지 않지만 리펙토링에선 라벨 텍스트가 사라진다.
                //cbPurchasePrice.get(5).readOnly(false);
                /// Level
                cbPurchasePrice.get(7).setValue(false);
                cbPurchasePrice.get(7).readOnly(false);

                cbPurchasePrice.get(8).setValue(false);
                cbPurchasePrice.get(8).readOnly(false);

                cbPurchasePrice.get(9).setValue(false);
                cbPurchasePrice.get(9).readOnly(false);

                cbPurchasePrice.get(10).setValue(false);
                cbPurchasePrice.get(10).readOnly(false);
            }
        }

        
        
    },




    /**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    // Grid Render Before
    // Sự kiện trước khi lưới được hoàn lại
    onGridRenderBefore: function (gridId, settings) {
        var self = this;
        
        //self.setGridParameter(settings);
        settings.setPagingIndexChanging(function (e, data) {
           
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
            self.contents.getGrid("dataGrid").grid.render();
        });
    },

    onGridRenderComplete: function (e, data) {
         this.SaveItemCode = '',
         this.SaveItemDes = '',
         this.SaveCustCode = '',
         this.SaveCustDes = '',
         this.SaveLocaCode = '',
         this.SaveLocaDes = '';
         this._super.onGridRenderComplete.apply(this, arguments);

         this.isDataSearching = false;//그리드 그린 후 다시 조회할수 있도록 구분값 변경

         if (!e.unfocus) {
             this.header.getQuickSearchControl().setFocus(0);
         }

         if (this.finalSearchParam.CONDITION2 != "0" && this.contents.getGrid().getSettings().getPagingTotalRowCount() >= 100000) {
             ecount.alert(ecount.resource.MSG06342);
         }
    },
    // Event button F2 click
    // Sự kiện F2 được nhấn
    //ON_KEY_F2: function () {
    //    this.onFooterNew();
    //},

    // Event button F3 click
    // Sự kiện F3 được nhấn
    ON_KEY_F3: function (e) {
        this.header.toggle();
        e.preventDefault();
    },

    // Event button F8 click
    // Sự kiện F8 được nhấn
    ON_KEY_F8: function () {
        //조회중에는 조회되지 않도록 조회중인지 체크
        if (!this.isDataSearching) { this.onHeaderSearch(); }
    },


   /**********************************************************************
   * define user function
   * các hàm tự định nghĩa 
   **********************************************************************/
   
    // Fucntion Seach Data
    // Hàm tìm kiếm dữ liệu
    dataSearch: function () {
        //조회중에는 조회되지 않도록 조회중인지 체크
        if (this.isDataSearching) { return false; }

        this.SaveItemCode = '',
        this.SaveItemDes = '',
        this.SaveCustCode = '',
        this.SaveCustDes = '',
        this.SaveLocaCode = '',
        this.SaveLocaDes = '';
        var inventory = ecount.config.inventory;
        
        var self = this;

        var settings = widget.generator.grid();
        this.gridObj = this.contents.getGrid("dataGrid");
        settings
            .setRowDataParameter(this.finalSearchParam)
            .setRowDataUrl("/Account/Basic/GetListPriceByItemForSearch")
            .setEmptyGridMessage(ecount.resource.MSG00205)
            .setPagingUse(true)
            .setColumnFixHeader(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setCustomRowCell('SALE_PRICE', this.setGridItemSalePrice.bind(this))
            .setCustomRowCell('PURCHASE_PRICE', this.setGridItemPurchasePrice.bind(this))
            .setCustomRowCell('CUST_RATE_SALE', this.setGridSaleCustRate.bind(this))
            .setCustomRowCell('CUST_RATE_PURCHASE', this.setGridPurchaseCustRate.bind(this))

            .setCustomRowCell('SPECIALPRICE2_SALE', this.setGridSaleSpecialPrice2.bind(this))
            .setCustomRowCell('SPECIALPRICE2_PURCHASE', this.setGridPurchaseSpecialPrice2.bind(this))
            .setCustomRowCell('SPECIALPRICE_SALE', this.setGridSaleSpecialPrice.bind(this))
            .setCustomRowCell('SPECIALPRICE_PURCHASE', this.setGridPurchaseSpecialPrice.bind(this))

            .setCustomRowCell('SPECIALPRICE3_2_SALE', this.setGridSaleSpecialPrice3.bind(this))
            .setCustomRowCell('SPECIALPRICE3_2_PURCHASE', this.setGridPurchaseSpecialPrice3.bind(this))
            .setCustomRowCell('SPECIALPRICE3_1_SALE', this.setGridSaleSpecialPrice3_1.bind(this))
            .setCustomRowCell('SPECIALPRICE3_1_PURCHASE', this.setGridPurchaseSpecialPrice3_1.bind(this))
            
            .setCustomRowCell('OUT_PRICE1', this.setGridOutPrice1.bind(this))
            .setCustomRowCell('OUT_PRICE2', this.setGridOutPrice2.bind(this))
            .setCustomRowCell('OUT_PRICE3', this.setGridOutPrice3.bind(this))
            .setCustomRowCell('OUT_PRICE4', this.setGridOutPrice4.bind(this))
            .setCustomRowCell('OUT_PRICE5', this.setGridOutPrice5.bind(this))
            .setCustomRowCell('OUT_PRICE6', this.setGridOutPrice6.bind(this))
            .setCustomRowCell('OUT_PRICE7', this.setGridOutPrice7.bind(this))
            .setCustomRowCell('OUT_PRICE8', this.setGridOutPrice8.bind(this))
            .setCustomRowCell('OUT_PRICE9', this.setGridOutPrice9.bind(this))
            .setCustomRowCell('OUT_PRICE10', this.setGridOutPrice10.bind(this))

            .setCustomRowCell('PROD_CD', this.setGridProdCd.bind(this))
            .setCustomRowCell('PROD_DES', this.setGridProdDes.bind(this))
            .setCustomRowCell('BUSINESS_NO', this.setGridCustNo.bind(this))
            .setCustomRowCell('CUST_NAME', this.setGridCustDes.bind(this))
            .setCustomRowCell('WH_CD', this.setGridLocationCd.bind(this))
            .setCustomRowCell('WH_DES', this.setGridLocationDes.bind(this))
            .setEventShadedColumnId(['SALE_PRICE', 'PURCHASE_PRICE', 'OUT_PRICE1', 'OUT_PRICE2', 'OUT_PRICE3', 'OUT_PRICE4', 'OUT_PRICE5', 'OUT_PRICE6', 'OUT_PRICE7', 'OUT_PRICE8', 'OUT_PRICE9', 'OUT_PRICE10'], { useIntegration: true, isAllRememberShaded: true })

        var i = 0;
        this.columns = [
        ]
        var ddlCondition1 = this.header.getControl("ddlCondition1");
        var ddlCondition2 = this.header.getControl("ddlCondition2");
        // Dieu kien 1
        if (ddlCondition1.get(0).getValue() == "0") {
            if (this.header.getControl("cbSetFlag").getValue() == false) {
                this.columns.push({ index: i, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL80071, width: '145', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL00730, width: '100', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'UNIT', id: 'UNIT', title: ecount.resource.LBL35184, width: '100', align: 'left', fontSize: 11 });
                i++;
            }
            else {
                this.columns.push({ index: i, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '145', align: 'left', fontSize: 11 }); // LBL03017:item code
                i++;
                this.columns.push({ index: i, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL80087, width: '145', align: 'left', fontSize: 11 });//LBL04991
                i++;
                this.columns.push({ index: i, propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL00730, width: '100', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'UNIT', id: 'UNIT', title: ecount.resource.LBL35184, width: '100', align: 'left', fontSize: 11 });
                i++;
            }
            
        }
        else if (ddlCondition1.get(0).getValue() == "1") {
            if (this.header.getControl("cbSetFlag").getValue() == false) {
                this.columns.push({ index: i, propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL35004, width: '145', align: 'left', fontSize: 11 });
                i++;
            }
            else {
                this.columns.push({ index: i, propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL00381, width: '145', align: 'left', fontSize: 11 }); //LBL00381
                i++;
                this.columns.push({ index: i, propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL00359, width: '145', align: 'left', fontSize: 11 });
                i++;
            }

        }
        else {
            if (this.header.getControl("cbSetFlag").getValue() == false) {
                this.columns.push({ index: i, propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL07275, width: '145', align: 'left', fontSize: 11 });
                i++;
            }
            else {
                this.columns.push({ index: i, propertyName: 'WH_CD', id: 'WH_CD', title: ecount.resource.LBL00130, width: '145', align: 'left', fontSize: 11 }); //LBL00130
                i++;
                this.columns.push({ index: i, propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL35106, width: '145', align: 'left', fontSize: 11 });
                i++;
            }

        }

        // Dieu kien 2
        if (ddlCondition2.get(0).getValue() == "1") {
            if (this.header.getControl("cbSetFlag").getValue() == false) {
                this.columns.push({ index: i, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL80071, width: '145', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL00730, width: '100', align: 'left', fontSize: 11 });
                i++;
            }
            else {
                this.columns.push({ index: i, propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL80071, width: '145', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL80087, width: '145', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL00730, width: '100', align: 'left', fontSize: 11 });
                i++;

            }
            
        }
            // Customer/Vendor 
        else if (ddlCondition2.get(0).getValue() == "2") {
            if (this.header.getControl("cbSetFlag").getValue() == false) {
                this.columns.push({ index: i, propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL35004, width: '145', align: 'left', fontSize: 11 });
                i++;
            }
            else {
                this.columns.push({ index: i, propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL35004, width: '145', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL00359, width: '145', align: 'left', fontSize: 11 });
                i++;
            }
        }
            // Location 
        else if (ddlCondition2.get(0).getValue() == "3") {
            if (this.header.getControl("cbSetFlag").getValue() == false) {
                this.columns.push({ index: i, propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL07275, width: '145', align: 'left', fontSize: 11 });
                i++;
            }
            else {
                this.columns.push({ index: i, propertyName: 'WH_CD', id: 'WH_CD', title: ecount.resource.LBL07275, width: '145', align: 'left', fontSize: 11 });
                i++;
                this.columns.push({ index: i, propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL35106, width: '145', align: 'left', fontSize: 11 });
                i++;
            }
        } else {

        }

        //if (this.header.getControl("cbSetFlag").getValue() == true ) {
        //    mergeData1 = {};
        //    mergeData1['_MERGE_USEOWN'] = true;
        //    mergeData1['_MERGE_START_INDEX'] = 0;
        //    mergeData1['_COLSPAN_COUNT'] = 2;
            
        //    mergeData2 = {};
        //    mergeData2['_MERGE_USEOWN'] = true;
        //    mergeData2['_MERGE_START_INDEX'] = 2;
        //    mergeData2['_COLSPAN_COUNT'] = 2;

        //    if (ddlCondition2.get(0).getValue() == "0") {
        //        settings.setColumnRowCustom([0, 1], [{
        //            '_MERGE_SET': new Array(
        //                mergeData1
        //            )
        //        }]);
        //    }
        //    else {
        //        settings.setColumnRowCustom([0, 1], [{
        //            '_MERGE_SET': new Array(
        //                mergeData1, mergeData2
        //            )
        //        }]);
        //    }
        //}
        
        // Sale Price
        if (this.finalSearchParam.SALE_DEFAULT_PRICE == 'Y') {
            this.columns.push({ index: i, propertyName: 'SALE_PRICE', id: 'SALE_PRICE', title: ecount.resource.LBL80217, width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Sale Markup/down 
        if (this.finalSearchParam.SALE_DEFAULT_CUST_RATE == 'Y') {
            this.columns.push({ index: i, propertyName: 'CUST_RATE_SALE', id: 'CUST_RATE_SALE', title: ecount.resource.LBL08985 + '(' + ecount.resource.LBL93606 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Sale Last Transaction Price
        if (this.finalSearchParam.SALE_DEFAULT_LAST_PRICE == 'Y') {
            this.columns.push({ index: i, propertyName: 'LAST_PRICE_SALE', id: 'LAST_PRICE_SALE', title: ecount.resource.LBL04171 + '(' + ecount.resource.LBL93606 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }

        // Sale by Item Group(Customer/Vendor)
        if (this.finalSearchParam.SALE_LEVEL_PROD_GROUP_CUST == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE2_SALE', id: 'SPECIALPRICE2_SALE', title: ecount.resource.LBL09022 + '(' + ecount.resource.LBL35004 + ')' + '(' + ecount.resource.LBL93606 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }

        // Sale by Item(Customer/Vendor)
        if (this.finalSearchParam.SALE_LEVEL_PROD_CUST == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE_SALE', id: 'SPECIALPRICE_SALE', title: ecount.resource.LBL03311 + '(' + ecount.resource.LBL35004 + ')' + '(' + ecount.resource.LBL93606 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Sale Sale by Item Group(Location)
        if (this.finalSearchParam.SALE_LEVEL_PROD_GROUP_WH == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE3_2_SALE', id: 'SPECIALPRICE3_2_SALE', title: ecount.resource.LBL09022 + '(' + ecount.resource.LBL07275 + ')' + '(' + ecount.resource.LBL93606 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Sale by Item(Location)
        if (this.finalSearchParam.SALE_LEVEL_PROD_WH == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE3_1_SALE', id: 'SPECIALPRICE3_1_SALE', title: ecount.resource.LBL03311 + '(' + ecount.resource.LBL07275 + ')' + '(' + ecount.resource.LBL93606 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }



        // Purchase Price
        if (this.finalSearchParam.PURCHASE_DEFAULT_PRICE == 'Y') {
            this.columns.push({ index: i, propertyName: 'PURCHASE_PRICE', id: 'PURCHASE_PRICE', title: ecount.resource.LBL35191, width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Purchase Markup/down 
        if (this.finalSearchParam.PURCHASE_DEFAULT_CUST_RATE == 'Y') {
            this.columns.push({ index: i, propertyName: 'CUST_RATE_PURCHASE', id: 'CUST_RATE_PURCHASE', title: ecount.resource.LBL08985 + '(' + ecount.resource.LBL70108 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Purchase Last Transaction Price
        if (this.finalSearchParam.PURCHASE_DEFAULT_LAST_PRICE == 'Y') {
            this.columns.push({ index: i, propertyName: 'LAST_PRICE_PURCHASE', id: 'LAST_PRICE_PURCHASE', title: ecount.resource.LBL04171 + '(' + ecount.resource.LBL70108 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Purchase by Item Group(Customer/Vendor)
        if (this.finalSearchParam.PURCHASE_LEVEL_PROD_GROUP_CUST == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE2_PURCHASE', id: 'SPECIALPRICE2_PURCHASE', title: ecount.resource.LBL09022 + '(' + ecount.resource.LBL35004 + ')' + '(' + ecount.resource.LBL70108 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Purchase by Item(Customer/Vendor)
        if (this.finalSearchParam.PURCHASE_LEVEL_PROD_CUST == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE_PURCHASE', id: 'SPECIALPRICE_PURCHASE', title: ecount.resource.LBL03311 + '(' + ecount.resource.LBL35004 + ')' + '(' + ecount.resource.LBL70108 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Purchase Sale by Item Group(Location)
        if (this.finalSearchParam.PURCHASE_LEVEL_PROD_GROUP_WH == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE3_2_PURCHASE', id: 'SPECIALPRICE3_2_PURCHASE', title: ecount.resource.LBL09022 + '(' + ecount.resource.LBL07275 + ')' + '(' + ecount.resource.LBL70108 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        // Purchase by Item(Location)
        if (this.finalSearchParam.PURCHASE_LEVEL_PROD_WH == 'Y') {
            this.columns.push({ index: i, propertyName: 'SPECIALPRICE3_1_PURCHASE', id: 'SPECIALPRICE3_1_PURCHASE', title: ecount.resource.LBL03311 + '(' + ecount.resource.LBL07275 + ')' + '(' + ecount.resource.LBL70108 + ')', width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }

        //  OUT_PRICE1
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('01') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE1', id: 'OUT_PRICE1', title: inventory.PRICE_1.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE2
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('02') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE2', id: 'OUT_PRICE2', title: inventory.PRICE_2.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE3
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('03') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE3', id: 'OUT_PRICE3', title: inventory.PRICE_3.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE4
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('04') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE4', id: 'OUT_PRICE4', title: inventory.PRICE_4.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE5
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('05') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE5', id: 'OUT_PRICE5', title: inventory.PRICE_5.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE6
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('06') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE6', id: 'OUT_PRICE6', title: inventory.PRICE_6.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE7
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('07') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE7', id: 'OUT_PRICE7', title: inventory.PRICE_7.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE8
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('08') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE8', id: 'OUT_PRICE8', title: inventory.PRICE_8.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE9
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('09') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE9', id: 'OUT_PRICE9', title: inventory.PRICE_9.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }
        //  OUT_PRICE10
        if (this.finalSearchParam.PRICE_ATOJ != '' && (ecount.delimiter + this.finalSearchParam.PRICE_ATOJ + ecount.delimiter).indexOf('10') > 0) {
            this.columns.push({ index: i, propertyName: 'OUT_PRICE10', id: 'OUT_PRICE10', title: inventory.PRICE_10.toString(), width: '100', align: 'right', fontSize: 11, dataType: '96', isCheckZero: false });
            i++;
        }

        if (this.finalSearchParam.PROD_CATEGORY.split(ecount.delimiter).length >= this.header.getControl("rbProdChk", "all").getComponentSize() - 1) this.finalSearchParam.PROD_CATEGORY = "";  // 전체로 변경

        settings.setColumns(this.columns);
        this.gridObj.setSettings(settings);
        settings.setPagingIndexChanging(function (e, data) {
          
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
            self.contents.getGrid("dataGrid").grid.render();
        });
        
        this.isDataSearching = true; //그리드를 그리기 전에 조회 구분자 바꿈

        this.gridObj.draw(this.finalSearchParam);

        this.header.toggle(true);
    },

    setGridProdCd: function (value, rowItem) {
        var self = this;
        var option = [];

        if (rowItem.PROD_CD == this.SaveItemCode)
            option.data = '';
        else {
            option.data = value;
            this.SaveItemCode = value;
        }
        return option;
    },
    setGridProdDes: function (value, rowItem) {
        var self = this;
        var option = [];

        if (rowItem.PROD_CD == this.SaveItemDes)
            option.data = '';
        else {
            option.data = value;
            this.SaveItemDes = rowItem.PROD_CD;
        }
        return option;
    },

    setGridCustNo: function (value, rowItem) {
        var self = this;
        var option = [];

        if (rowItem.BUSINESS_NO == this.SaveCustCode)
            option.data = '';
        else {
            option.data = value;
            this.SaveCustCode = value;
        }
        return option;
    },

    setGridCustDes: function (value, rowItem) {
        var self = this;
        var option = [];
        var param = "";

        if (rowItem.BUSINESS_NO == this.SaveCustDes)
            option.data = '';
        else {
            option.data = value;
            this.SaveCustDes = rowItem.BUSINESS_NO;
        }
        return option;
    },

    setGridLocationCd: function (value, rowItem) {
        var self = this;
        var option = [];

        if (rowItem.WH_CD == this.SaveCustCode)
            option.data = '';
        else {
            option.data = value;
            this.SaveCustCode = value;
        }
        return option;
    },

    setGridLocationDes: function (value, rowItem) {
        var self = this;
        var option = [];
        var param = "";

        if (rowItem.WH_CD == this.SaveCustDes)
            option.data = '';
        else {
            option.data = value;
            this.SaveCustDes = rowItem.WH_CD;
        }
        return option;
    },
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.SetReload();
    },
});

