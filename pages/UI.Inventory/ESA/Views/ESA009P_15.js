window.__define_resource && __define_resource("BTN00004","BTN00426","BTN80002","BTN00008","BTN00065","BTN00037","LBL06065","LBL00749","LBL00745","LBL00739","LBL00976","LBL02997","LBL08979","LBL08977","LBL08980","LBL08978","LBL01234","LBL01541","LBL03213","LBL04145","LBL01647","LBL02072","LBL00764","LBL04893","LBL10949","LBL10912","LBL02493","LBL01289","LBL01294","LBL06838","LBL07903","LBL01812","LBL09551","LBL09552","LBL09553","LBL09554","LBL09555","LBL09556","LBL12805","LBL09859","LBL09860","LBL09861","LBL02555","LBL02785","LBL00697","LBL02238","LBL02239","LBL02813","LBL02814","MSG03839","LBL06434","LBL03702","BTN00534","LBL07157","MSG00299","MSG05665","MSG02902","MSG01939","LBL70053","LBL02263","MSG00528");
/****************************************************************************************************
1. Create Date : 2015.11.11
2. Creator     : 전영준
3. Description : 항목검색 팝업
4. Precaution  : 
5. History     : [2016-06-01] 노지혜: SEND_SER_LIST: uniqueItems.join('∬')  -> join 제거
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA009P_15", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    gridObject: null, //getGrid

    columns: null,

    isApplyDisplayFlag: null,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            SEND_SER: this.SEND_SER,
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
        header.setTitle("항목검색")
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        var data = this.getListData();

        ;

        settings
         //.setRowData(viewBag.InitDatas.ListLoad1)
         .setRowData(data)
         .setRowDataParameter(this.searchFormParameter)
         .setRowDataUrl('/Common/Infra/GetListForSearchEmail')
         .setColumns([
                { propertyName: 'TYPE', id: 'TYPE', title: "구분", width: 175, align: "center" },
                { propertyName: 'ITEM', id: 'ITEM', title: "항목명", width: 175, align: 'center' },
         ])
            //Paging
            // Sorting
            .setColumnSortable(true)
            .setCheckBoxUse(true)
            //.setColumnSortDisableList(['SEND_NAME', 'SEND_TEL'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            // Custom cells
            .setCustomRowCell('SEND_NAME', this.setGridDateLink.bind(this))
            .setCustomRowCell('SEND_TEL', this.setGridDateLink.bind(this))


        //툴바
        toolbar.setId("search")
            .attach(ctrl.define("widget.searchGroup", "search").setOptions({
                label: ecount.resource.BTN00004,  //검색
                status: this.isQtyDisplayFlag ? [{ value: 'Y', label: ecount.resource.BTN00426 }, { value: 'Y', label: ecount.resource.BTN00426 }] : null //Y:전체보기
            }));

        contents
                .add(toolbar)
                .addGrid("dataGrid", settings)
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control();

        if (!this.searchFormParameter.Edit) {
            toolbar.addLeft(ctrl.define("widget.button", "Edit").label(ecount.resource.BTN80002))
              .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
              .addRight(ctrl.define("widget.keyHelper", "keyHelper"))
        } else {
            toolbar
                 .addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce())
                 .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
                 .addLeft(ctrl.define("widget.button", "DeleteMulti").label(ecount.resource.BTN00037))
                 .addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);

    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function () {

        if (!$.isNull(this.keyword)) {
            this.contents.getControl('search').setValue(this.keyword);
        }
        //this.gridObject.getSettings().setHeaderTopMargin(this.header.height());

        if (!this.searchFormParameter.Edit) {
            this.contents.getControl("search").setFocus(0);
        }
        if (this.searchFormParameter.Edit) {
            for (var i = 4, len = this.columns.length; i < len; i++) {
                if (this.searchFormParameter.DOC_GUBUN !== this.columns[i].id) {
                    this.gridObject.setColumnVisibility(this.columns[i].id, false);
                }
            }
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/


    //위치 옯기기
    getListData: function () {


        //private void GetItemDataRow(DataTable dt, string strType, string strItem, string strCode, int intLength, string strResource, string strRefItem)
        //{
        //    DataRow dr = dt.NewRow();
        //    dr["Type"] = strType.Trim();
        //    dr["Item"] = strItem.Trim();
        //    dr["Code"] = strCode.Trim();
        //    dr["Length"] = intLength;
        //    dr["Resource"] = strResource.Trim();
        //    dr["RefItem"] = strRefItem.Trim();

        //    dt.Rows.Add(dr);
        //}

        //;
        var viewBagData = this.viewBag.InitDatas.ListLoad,
            dataSet = [];

        dataSet.push({ "TYPE": "품목정보", "ITEM": "품목명", "CODE": "prod_des", "LENGTH": 100, "RESOURCE": ecount.resource.LBL06065, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "규격명", "CODE": "size_des", "LENGTH": 50, "RESOURCE": ecount.resource.LBL00749, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "규격코드", "CODE": "size_cd", "LENGTH": 30, "RESOURCE": ecount.resource.LBL00745, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "규격계산", "CODE": "size_flag", "LENGTH": 1, "RESOURCE": ecount.resource.LBL00739, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "단위", "CODE": "unit", "LENGTH": 6, "RESOURCE": ecount.resource.LBL00976, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "품목구분", "CODE": "prod_type", "LENGTH": 1, "RESOURCE": ecount.resource.LBL02997, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "부가세율(매출)구분", "CODE": "vat_yn", "LENGTH": 1, "RESOURCE": ecount.resource.LBL08979, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "부가세율(매출)", "CODE": "tax", "LENGTH": 3, "RESOURCE": ecount.resource.LBL08977, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "부가세율(매입)구분", "CODE": "vat_rate_by_base_yn", "LENGTH": 1, "RESOURCE": ecount.resource.LBL08980, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "부가세율(매입)", "CODE": "vat_rate_by", "LENGTH": 3, "RESOURCE": ecount.resource.LBL08978, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "바코드", "CODE": "bar_code", "LENGTH": 30, "RESOURCE": ecount.resource.LBL01234, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "생산공정", "CODE": "wh_cd", "LENGTH": 5, "RESOURCE": ecount.resource.LBL01541, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "검색창내용", "CODE": "remarks_win", "LENGTH": 50, "RESOURCE": ecount.resource.LBL03213, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "품목공유여부", "CODE": "cs_flag", "LENGTH": 1, "RESOURCE": ecount.resource.LBL04145, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "세트여부", "CODE": "set_flag", "LENGTH": 1, "RESOURCE": ecount.resource.LBL01647, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "품목이미지", "CODE": "prod_img", "LENGTH": 150, "RESOURCE": ecount.resource.LBL02072, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "그룹코드1", "CODE": "class_cd", "LENGTH": 5, "RESOURCE": String.format(ecount.resource.LBL00764, "1"), "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "그룹코드2", "CODE": "class_cd2", "LENGTH": 5, "RESOURCE": String.format(ecount.resource.LBL00764, "2"), "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "그룹코드3", "CODE": "class_cd3", "LENGTH": 5, "RESOURCE": String.format(ecount.resource.LBL00764, "3"), "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "적요", "CODE": "remarks", "LENGTH": 50, "RESOURCE": ecount.resource.LBL04893, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "품질검사유형", "CODE": "inspect_type_cd", "LENGTH": 3, "RESOURCE": ecount.resource.LBL10949, "REFITEM": "" });
        dataSet.push({ "TYPE": "품목정보", "ITEM": "품질검사방법", "CODE": "inspect_status", "LENGTH": 1, "RESOURCE": ecount.resource.LBL10912, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "계층그룹", "CODE": "level_group", "LENGTH": 30, "RESOURCE": ecount.resource.LBL02493, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "주품목", "CODE": "main_prod_cd", "LENGTH": 20, "RESOURCE": ecount.resource.LBL01289, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "주품목 환산수량", "CODE": "main_prod_convert_qty", "LENGTH": 9, "RESOURCE": String.format(ecount.resource.LBL01294, "1"), "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "추가수량당수량 ", "CODE": "exch_rate", "LENGTH": 9, "RESOURCE": String.format(ecount.resource.LBL06838, "2"), "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "재고수량관리", "CODE": "bal_flag", "LENGTH": 1, "RESOURCE": String.format(ecount.resource.LBL07903, "3"), "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고수량", "CODE": "safe_qty", "LENGTH": 9, "RESOURCE": ecount.resource.LBL01812, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-주문서", "CODE": "a0001", "LENGTH": 1, "RESOURCE": ecount.resource.LBL09551, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-판매", "CODE": "a0002", "LENGTH": 1, "RESOURCE": ecount.resource.LBL09552, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-생산불출 ", "CODE": "a0003", "LENGTH": 1, "RESOURCE": ecount.resource.LBL09553, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-생산입고", "CODE": "a0004", "LENGTH": 1, "RESOURCE": ecount.resource.LBL09554, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-창고이동", "CODE": "a0005", "LENGTH": 1, "RESOURCE": ecount.resource.LBL09555, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-자가사용", "CODE": "a0006", "LENGTH": 1, "RESOURCE": ecount.resource.LBL09556, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "안전재고관리-불량처리", "CODE": "a0007", "LENGTH": 1, "RESOURCE": ecount.resource.LBL12805, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "CS최소주문수량", "CODE": "c0001", "LENGTH": 1, "RESOURCE": String.format(ecount.resource.LBL09859, "1"), "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "CS최소주문수량", "CODE": "c0002", "LENGTH": 12, "RESOURCE": String.format(ecount.resource.LBL09860, "2"), "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "CS최소주문단위", "CODE": "c0003", "LENGTH": 1, "RESOURCE": String.format(ecount.resource.LBL09861, "3"), "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "조달기간", "CODE": "in_term", "LENGTH": 5, "RESOURCE": ecount.resource.LBL02555, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "최소구매단위", "CODE": "min_qty", "LENGTH": 9, "RESOURCE": ecount.resource.LBL02785, "REFITEM": "" });
        dataSet.push({ "TYPE": "수량", "ITEM": "구매처", "CODE": "cust", "LENGTH": 30, "RESOURCE": ecount.resource.LBL00697, "REFITEM": "" });
        dataSet.push({ "TYPE": "단가", "ITEM": "입고단가", "CODE": "in_price", "LENGTH": 12, "RESOURCE": String.format(ecount.resource.LBL02238, "3"), "REFITEM": "" });
        dataSet.push({ "TYPE": "단가", "ITEM": "입고단가Vat포함여부", "CODE": "in_price_vat", "LENGTH": 1, "RESOURCE": ecount.resource.LBL02239, "REFITEM": "" });
        dataSet.push({ "TYPE": "단가", "ITEM": "출고단가", "CODE": "out_price", "LENGTH": 12, "RESOURCE": ecount.resource.LBL02813, "REFITEM": "" });
        dataSet.push({ "TYPE": "단가", "ITEM": "출고단가Vat포함여부", "CODE": "out_price_vat", "LENGTH": 1, "RESOURCE": ecount.resource.LBL02814, "REFITEM": "" });




        ;


        //검색 기능
        //[].filter(function (data) {

        //    data.indexOf("솔로")===0
        //})


        return dataSet;
    },



    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    type: 'infomation',
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
                this.close();
            }.bind(this)
        };
        return option;
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        this.gridObject = this.contents.getGrid().grid;
        var cnt = this.isOthersDataFlag != "N" ? 2 : 1;
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                type: 'infomation',
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
            this.close();
        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    // 편집
    onFooterEdit: function () {
        this.onContentsPopup();
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;

        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed   
    },

    // 팝업
    onContentsPopup: function () {

        //오리지날
        // var isOk = this.setCheckProd();
        //this.searchFormParameter.Edit = true;

        //this.openWindow({
        //    url: '/ECERP/Popup.Search/EGA001P_06',
        //    name: String.format(ecount.resource.LBL06434, ' ' + ecount.resource.LBL03702),
        //    additional: true,
        //    param: {
        //        width: 605,
        //        height: 500,
        //        SEND_SER: this.searchFormParameter.SEND_SER,
        //        DOC_GUBUN: this.searchFormParameter.DOC_GUBUN,
        //        SEARCH: this.searchFormParameter.DOC_GUBUN,
        //        Edit: this.searchFormParameter.Edit
        //    }
        //});
        //****************************************************************************************************************************************************************************
        // (규격 팝업)
        //this.openWindow({

        //     url: "http://test.ecounterp.com/ECERP/ESA/ESA001P_09?ec_req_sid=00IkHwCFU9S3&CUST_CODE=1268608986&BUSINESS_NO=90050&DOC_GUBUN=66", //편집 팝업 테스트

        //    개발  by jay
        //    url: "/ECERP/Popup.Common/ESA010P_05",                                              //품목 계정추가(품목구분)  팝업 테스트 // 1 번
        //    url: "http://test.ecounterp.com/ECERP/Popup.Common/ESA010P_11?ec_req_sid=00IlPRdeESAC",                                              //단가 A to J 팝업 테스트// 3번
        //     url: "http://test.ecounterp.com/ECERP/Popup.Common/ESA060P_02?ec_req_sid=00IlPRdeESAC&Type=TYPE&KeyWord=", // 품질검사 유형  팝업 테스트 4번
        //    url: "/ECERP/Popup.Search/ES019P", // 규격 팝업  5번
        //    //url: " http://test.ecounterp.com/ECERP/Popup.Common/ESA010P_13", // 회계 계정 직접입력
        //    url: "/ECERP/ESA/ESA010P_12",  // 창고별 안전 재고  6번
        //    name:"품목등록",
        //    additional: false,
        //    param: {
        //        width: 650,
        //        height: 500,
        //        SEND_SER: this.searchFormParameter.SEND_SER,
        //        DOC_GUBUN: this.searchFormParameter.DOC_GUBUN,
        //        SEARCH: this.searchFormParameter.DOC_GUBUN,
        //        Edit: this.searchFormParameter.Edit,
        //    }
        //});

        //전체 테스트 
        this.openWindow({
            url: "/ECERP/ESA/ESA009P_14", //픔목선택 ESA009P_14
            name: "품목선택변경",
            additional: false,
            param: {
                width: 650,
                height: 500,
                PROD_CD_LIST: "00023" + ecount.delimiter + "00024" + ecount.delimiter + "00025" + ecount.delimiter
                //COLUMN1: '',
                //COLUMN2: '',
                //COLUMN3: '',
                //COLUMN4: '',
                //COLUMN5: '',
                //COLUMN6: '',
                //COLUMN7: '',
                //COLUMN8: '',
                //COLUMN9: '',
                //COLUMN10: ''
            }
        });


        //****************************************************************************************************************************************************************************
        ////추가항목등록 2번

        ////as-is 기준 테스트 재고
        //// to-be 의 사원담당 관리 기준 = menu_Gubun: 'S21', code_Class: 'S21',

        //var param = {
        //    width: ecount.infra.getPageWidthFromConfig(),
        //    height: 270,
        //    menu_Gubun: 'S',
        //    CHECK_FLAG: 'ESA016M',
        //    code_Class: 'S01',
        //    class_Des: '품목코드 추가리 항목',

        //};
        //this.openWindow({
        //    url: '/ECERP/Popup.Common/ESA002P_01',
        //    name: ecount.resource.BTN00534,
        //    popupType: false,
        //    additional: false,
        //    param: param
        //})

        //****************************************************************************************************************************************************************************
        //창고별 안전 재고  6번 예제
        //this.openWindow({

        //    url: "/ECERP/ESA/ESA010P_12",  // 창고별 안전 재고  6번

        //    name: String.format("창고별안전재고등록"),
        //    additional: false,
        //    param: {
        //                width: 390,
        //                height: 500,
        //                PROD_CD: "0000000000"
        //    },
        //    popupID: this.pageID

        //});
        ////////////////////////

        //this.openWindow({
        //    url: "/ECERP/Popup.Common/ESA010P_13", // 회계 계정 직접입력
        //    name: "회계계정 직접 입력",
        //    additional: false,
        //    param: {
        //        width: 800,
        //        height: 200,
        //        IN_GYE_DES:"상품",
        //        OUT_GYE_DES: "상품매출",
        //        COST: "상품매출원가",
        //        PRODUCT_GYE_DES: "",
        //    }
        //    , popupID: this.pageID
        //});

    },

    onContentsAddColumns: function (event) {
        for (var i = 1, len = this.columns.length; i < len; i++) {
            this.gridObject.setColumnVisibility(this.columns[i].id, true);
        }
    },

    // 저장
    onFooterSave: function () {
        this.dataValidation(function () {
            var gridFilteringData = this.gridObject.getRowList().where(function (entity, i) {
                return entity.ISCHANGE == 'Y' &&
                    (!$.isEmpty(entity.SEND_SER) ||  //수정인경우
                        ($.isEmpty(entity.SEND_SER) && !$.isEmpty(entity.SEND_NAME) || !$.isEmpty(entity.SEND_TEL) || !$.isEmpty(entity.SEND_EMAIL) || !$.isEmpty(entity.SEND_HP)) //신규인경우
                    );
            });

            arraySaveData = [];

            $.each(gridFilteringData, function (i, item) {

                arraySaveData.push({
                    SEND_GUBUN: this.SEND_SER,
                    SEND_SER: item.SEND_SER,
                    SEND_NAME: item.SEND_NAME,
                    SEND_TEL: item.SEND_TEL,
                    SEND_EMAIL: item.SEND_EMAIL,
                    SEND_HP: item.SEND_HP,
                    SEND_COMMNET: item.SEND_COMMNET,
                    DOC_GUBUN_LIST: (function (_item) {
                        var docGubunList = '';

                        if (_item.PAYROLLSTATEMENT == '0' || _item.PAYROLLSTATEMENT == '1')
                            docGubunList += '11' + ecount.delimiter
                        if (_item.TWRECEIPT == '0' || _item.TWRECEIPT == '1')
                            docGubunList += '12' + ecount.delimiter
                        if (_item.RETIREMENTINCOME == '0' || _item.RETIREMENTINCOME == '1')
                            docGubunList += '13' + ecount.delimiter
                        if (_item.RECEIPTFORTAX == '0' || _item.RECEIPTFORTAX == '1')
                            docGubunList += '18' + ecount.delimiter
                        if (_item.QUOTATION == '0' || _item.QUOTATION == '1')
                            docGubunList += '22' + ecount.delimiter
                        if (_item.SALESORDER == '0' || _item.SALESORDER == '1')
                            docGubunList += '23' + ecount.delimiter
                        if (_item.RFQ == '0' || _item.RFQ == '1')
                            docGubunList += '24' + ecount.delimiter
                        if (_item.PURCHASEORDER == '0' || _item.PURCHASEORDER == '1')
                            docGubunList += '33' + ecount.delimiter
                        if (_item.TAXINVOICES == '0' || _item.TAXINVOICES == '1')
                            docGubunList += '44' + ecount.delimiter
                        if (_item.ELECTRONICTAXINVOICE == '0' || _item.ELECTRONICTAXINVOICE == '1')
                            docGubunList += '45' + ecount.delimiter
                        if (_item.INVOICEPACKINGLIST == '0' || _item.INVOICEPACKINGLIST == '1')
                            docGubunList += '46' + ecount.delimiter
                        if (_item.SALESSLIP == '0' || _item.SALESSLIP == '1')
                            docGubunList += '66' + ecount.delimiter
                        if (_item.SMS == '0' || _item.SMS == '1')
                            docGubunList += '77' + ecount.delimiter
                        if (_item.CUSTOMERVENDORBOOK1 == '0' || _item.CUSTOMERVENDORBOOK1 == '1')
                            docGubunList += '88' + ecount.delimiter
                        if (_item.CUSTOMERVENDORBOOK2 == '0' || _item.CUSTOMERVENDORBOOK2 == '1')
                            docGubunList += '89' + ecount.delimiter
                        if (_item.REPAIRORDER == '0' || _item.REPAIRORDER == '1')
                            docGubunList += '92' + ecount.delimiter

                        return docGubunList;

                    }.bind(this))(item),
                    HEAD_YN_LIST: (function (_item) {
                        var headYnList = '';

                        if (_item.PAYROLLSTATEMENT == '0')
                            headYnList += '11' + ecount.delimiter
                        if (_item.TWRECEIPT == '0')
                            headYnList += '12' + ecount.delimiter
                        if (_item.RETIREMENTINCOME == '0')
                            headYnList += '13' + ecount.delimiter
                        if (_item.RECEIPTFORTAX == '0')
                            headYnList += '18' + ecount.delimiter
                        if (_item.QUOTATION == '0')
                            headYnList += '22' + ecount.delimiter
                        if (_item.SALESORDER == '0')
                            headYnList += '23' + ecount.delimiter
                        if (_item.RFQ == '0')
                            headYnList += '24' + ecount.delimiter
                        if (_item.PURCHASEORDER == '0')
                            headYnList += '33' + ecount.delimiter
                        if (_item.TAXINVOICES == '0')
                            headYnList += '44' + ecount.delimiter
                        if (_item.ELECTRONICTAXINVOICE == '0')
                            headYnList += '45' + ecount.delimiter
                        if (_item.INVOICEPACKINGLIST == '0')
                            headYnList += '46' + ecount.delimiter
                        if (_item.SALESSLIP == '0')
                            headYnList += '66' + ecount.delimiter
                        if (_item.SMS == '0')
                            headYnList += '77' + ecount.delimiter
                        if (_item.CUSTOMERVENDORBOOK1 == '0')
                            headYnList += '88' + ecount.delimiter
                        if (_item.CUSTOMERVENDORBOOK2 == '0')
                            headYnList += '89' + ecount.delimiter
                        if (_item.REPAIRORDER == '0')
                            headYnList += '92' + ecount.delimiter

                        return headYnList;

                    }.bind(this))(item)
                });
            }.bind(this))

            ecount.common.api({
                url: '/Common/Infra/SaveMailInfo',
                data: Object.toJSON(arraySaveData),
                success: function (result) {
                    this.footer.getControl('Save').setAllowClick();
                    this.setTimeout(function () {
                        this.getParentInstance(this.parentPageID)._ON_REDRAW();
                        this.close();
                    }.bind(this), 0);
                }.bind(this)
            })
        }.bind(this));
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //하단 버튼 갱신 
    onRefreshFooter: function () {

    },

    // 히스토리
    onFooterHistory: function (e) {
        var param = {
            lastEditTime: this.viewBag.InitDatas.ListLoad.length != 0 ? this.viewBag.InitDatas.ListLoad[0].EDIT_DT : null, // datetime, // datetime
            lastEditId: this.viewBag.InitDatas.ListLoad.length != 0 ? this.viewBag.InitDatas.ListLoad[0].EDITOR_ID : null,      //id
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            width: 450,
            height: 150
        };

        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },

    // New button click event
    onFooterDeleteMulti: function (cid) {

        var btnDeleteMulti = this.footer.get(0).getControl("DeleteMulti");
        var delItem = this.contents.getGrid().grid.getChecked();
        var uniqueItems = new Array();

        $.each($.makeArray(delItem), function (i, el) {
            uniqueItems.push(el.SEND_SER);
        });

        var formData = Object.toJSON({
            SEND_SER_LIST: uniqueItems,
        });
        var strUrl = "/Common/Infra/DeleteMultiEmailSend";
        if (confirm(ecount.resource.MSG00299)) {
            ecount.common.api({
                url: strUrl,
                async: false,
                data: formData,
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                    } else {
                        this.contents.getGrid().draw(this.searchFormParameter);
                    }
                }.bind(this)
            });
            btnDeleteMulti.setAllowClick();
        }
    },

    //검색, 전체보기 
    onContentsSearch: function (event) {

        var invalid = this.contents.getControl("search").validate();
        if (invalid.length > 0) {
            this.contents.getControl("search").setFocus(0);
            return;
        }
        this.searchFormParameter.SEARCH = this.contents.getControl("search").getValue().keyword || '';
        this.contents.getGrid().draw(this.searchFormParameter);
        this.contents.getControl("search").setFocus(0);

    },


    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F2
    ON_KEY_F2: function () {
        //if (this.isNewDisplayFlag)
        //    this.onFooterNew();
    },

    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.searchFormParameter.Edit)
            this.onFooterSave();
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            this.gridObject.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        this.setTimeout(function () { this.gridObject.focus(); }, 0);
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    //
    setIsChangeProperty: function () {
        var option = {};
        option.event = {
            'keydown': function (e, data) {
                this.gridObject.setCell('ISCHANGE', data.rowKey, 'Y');
            }.bind(this)
        }

        return option;
    },
    //저장버튼 클릭 시 Validation
    dataValidation: function (saveFunction) {
        var _saveFlag = true;
        $.each(this.gridObject.getRowList(), function (i, item) {
            if (item.ISCHANGE == 'Y' &&
                (!$.isEmpty(item.SEND_SER) &&
                    ($.isEmpty(item.SEND_NAME) && $.isEmpty(item.SEND_TEL) && $.isEmpty(item.SEND_EMAIL) && $.isEmpty(item.SEND_HP)))) {
                var option = {};
                option.message = ecount.resource.MSG05665;
                this.gridObject.setCellShowError("SEND_NAME", item[ecount.grid.constValue.keyColumnPropertyName], option);
                _saveFlag = false;
                return false;
            }
            if (item.hasOwnProperty('COM_CODE') || !item.hasOwnProperty('COM_CODE') && (item.SEND_NAME !== "" || item.SEND_TEL !== "" || item.SEND_EMAIL !== "" || item.SEND_HP !== "")) {
                if (item.SEND_NAME === "") {
                    var option = {};
                    option.message = ecount.resource.MSG02902; // 이름을 입력합니다.
                    this.gridObject.setCellShowError("SEND_NAME", item[ecount.grid.constValue.keyColumnPropertyName], option);
                    _saveFlag = false;
                    return false;
                }
                if (item.SEND_EMAIL === "") {
                    var option = {};
                    //  option.message = ecount.resource.MSG01939; //Email 주소가 없는 곳에 확인 체크되어있습니다.....bla bla(As-is)
                    option.message = option.message = ecount.resource.LBL70053 + ' ' + ecount.resource.LBL02263
                    this.gridObject.setCellShowError("SEND_EMAIL", item[ecount.grid.constValue.keyColumnPropertyName], option);
                    _saveFlag = false;
                    return false;
                }
                var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,15}(?:\.[a-zA-Z]{2})?)$/;
                if (!regex.test(item.SEND_EMAIL)) {
                    var option = {};
                    option.message = ecount.resource.MSG00528; //정확한 Email을 입력 바랍니다.
                    this.gridObject.setCellShowError("SEND_EMAIL", item[ecount.grid.constValue.keyColumnPropertyName], option);
                    _saveFlag = false;
                    return false;
                }
            }

        }.bind(this));

        if (_saveFlag)
            saveFunction();
        else
            this.footer.getControl('Save').setAllowClick();
    }
});






