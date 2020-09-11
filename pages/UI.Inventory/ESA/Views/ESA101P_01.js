window.__define_resource && __define_resource("LBL09022","LBL01587","LBL01047","LBL03495","LBL00754","LBL06425","LBL06451","LBL05125","BTN00204","BTN00063","LBL02813","LBL02238","LBL00960","BTN00070","BTN00008","BTN00035","MSG01521","MSG01957","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL01249","LBL02513","LBL02512","BTN00346","LBL06453");
/****************************************************************************************************
1. Create Date : 2015.09.21
2. Creator     : 조영상
3. Description : 제고1 > 기초등록 > 품목그룹별 변경 팝업창
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA101P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            CODE_CLASS: this.CODE_CLASS,
            CLASS_CD: this.CLASS_CD,
            CLASS_GUBUN: this.CLASS_GUBUN    // 그룹코드구분(품목그룹구분, 필수값)  
        };

    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header, resource) {

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL09022 + ecount.resource.LBL01587 + ecount.resource.LBL01047) // (품목별선택변경));

    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
       
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var grid = g.grid();
        var thisObj = this;

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.GridFirstLoad)

            .setKeyColumn(["COME_CDE"])
            .setCheckBoxUse(true)
            .setColumnFixHeader(true)
            .setEditable(true,2)

            .setColumns([
                { propertyName: 'CLASS_CD', id: 'CLASS_CD', title: ecount.resource.LBL03495, width: '120' },
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL00754, width: '150' },
                { propertyName: 'CODE_CLASS_DES', id: 'CODE_CLASS_DES', title: ecount.resource.LBL06425, width: '150' },
                { propertyName: 'PRICE_GUBUN', id: 'PRICE_GUBUN', title: ecount.resource.LBL06451, controlType: 'widget.select', width: '100', align: 'left'},
                { propertyName: 'PRICE_RATE', id: 'PRICE_RATE', title: ecount.resource.LBL05125, controlType: 'widget.input', width: '90', align: 'right', dataType: '96', isCheckZero: false, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                { propertyName: 'PRICE_LESS', id: 'PRICE_LESS', title: "단위처리", controlType: 'widget.select', width: '150', align: 'left' },
                { propertyName: 'PRICE_RISE', id: 'PRICE_RISE', title: "반올림구분", controlType: 'widget.select', width: '100', align: 'left' },
                { propertyName: 'USE_YN', id: 'USE_YN', title: ecount.resource.BTN00204, controlType: 'widget.select', width: '90', align: 'center' },
                { propertyName: 'SAVE', id: 'SAVE', title: ecount.resource.BTN00063, controlType: 'widget.link', width: '90', align: 'center' },
            ])

            .setCustomRowCell('PRICE_GUBUN', this.setGridDateCustomPriceGubun.bind(this))
            .setCustomRowCell('PRICE_LESS', this.setGridDateCustomPriceLess.bind(this))
            .setCustomRowCell('PRICE_RISE', this.setGridDateCustomPriceRise.bind(this))
            .setCustomRowCell('USE_YN', this.setGridDateCustomUseYn.bind(this))
            .setCustomRowCell('SAVE', this.setGridDateCustomSave.bind(this))

        toolbar.addRight(ctrl.define("widget.select", "category", "category").option([
            ["0", ecount.resource.LBL06451],
            ["1", ecount.resource.LBL05125],
            ["2", "단위처리"],
            ["3", "반올림구분"],
            ["4", ecount.resource.BTN00204], ])
            .select("0"))

        toolbar.addRight(ctrl.define("widget.select", "allKind", "allKind").option([
            ["O", ecount.resource.LBL02813],
            ["I", ecount.resource.LBL02238],
            ["A", 'A' + ecount.resource.LBL00960],
            ["B", 'B' + ecount.resource.LBL00960],
            ["C", 'C' + ecount.resource.LBL00960],
            ["D", 'D' + ecount.resource.LBL00960],
            ["E", 'E' + ecount.resource.LBL00960],
            ["F", 'F' + ecount.resource.LBL00960],
            ["G", 'G' + ecount.resource.LBL00960],
            ["H", 'H' + ecount.resource.LBL00960],
            ["9", '9' + ecount.resource.LBL00960],
            ["G", 'G' + ecount.resource.LBL00960] ])
            .select("O"))

        toolbar.addRight(ctrl.define("widget.input", "rate").hide());

        toolbar.addRight(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00070))

        
        contents.add(toolbar).addGrid("dataGrid", grid);

    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00063))
               .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
               .addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00035))

        footer.add(toolbar);
    },
     

    // 하단 저장
    onFooterSave : function(){

        var selectItem = this.contents.getGrid().grid.getChecked();
        
        ecount.confirm(ecount.resource.MSG01521, function (status) {
            if (status === true) {
                $.each(selectItem, function (i, data) {
                    var objthis = this;
                    var param = {
                        CLASS_CD: data.CLASS_CD,
                        CODE_CLASS: data.CODE_CLASS,
                        PRICE_GUBUN: data.PRICE_GUBUN,
                        PRICE_RATE: data.PRICE_RATE,
                        PRICE_LESS: data.PRICE_LESS,
                        PRICE_RISE: data.PRICE_RISE,
                        USE_YN: data.USE_YN
                    };

                    ecount.common.api({
                        url: "/Inventory/Basic/UpdateStatusPriceLevel",
                        data: Object.toJSON(param),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            }
                            else {
                                objthis.setReload(objthis);
                            }
                        }
                    });
                })
            }}
        );
    },

    // 선택 삭제
    onFooterDelete: function(){

        var selectItem = this.contents.getGrid().grid.getChecked();
        var objthis = this;

        ecount.confirm(ecount.resource.MSG01521, function (status) {
            if (status === true) {
                $.each(selectItem, function (i, data) {

                    if (data.USE_YN == "Y") {
                        ecount.alert(ecount.resource.MSG01957);
                        return;
                    }
                    else {
                      
                        var param = {
                            CLASS_CD: data.CLASS_CD,
                            CODE_CLASS: data.CODE_CLASS
                        };

                        ecount.common.api({
                            url: "/Inventory/Basic/DeletePriceLevelGroup",
                            data: Object.toJSON(param),
                            success: function (result) {
                                if (result.Status != "200") {
                                    ecount.alert(result.fullErrorMsg);
                                }
                                else {
                                    objthis.setReload(objthis);
                                }
                            }
                        });
                    }
                })
            }
        }
        );

    },

    
     
    //Close button click event
    onFooterClose: function () {
     
    },
    


    setGridDateCustomPriceGubun: function (value, rowItem) {

        var option = {};

        if (rowItem.PRICE_GUBUN != "")
        {
            var selectOption = new Array();
            selectOption.push(['O', ecount.resource.LBL02813, '']);
            selectOption.push(['I', ecount.resource.LBL02238, '']);
            selectOption.push(['A', 'A' + ecount.resource.LBL00960, '']);       
            selectOption.push(['B', 'B' + ecount.resource.LBL00960, '']);
            selectOption.push(['C', 'C' + ecount.resource.LBL00960, '']);
            selectOption.push(['D', 'D' + ecount.resource.LBL00960, '']);
            selectOption.push(['E', 'E' + ecount.resource.LBL00960, '']);
            selectOption.push(['F', 'F' + ecount.resource.LBL00960, '']);
            selectOption.push(['G', 'G' + ecount.resource.LBL00960, '']);
            selectOption.push(['H', 'H' + ecount.resource.LBL00960, '']);
            selectOption.push(['9', '9' + ecount.resource.LBL00960, '']);
            selectOption.push(['J', 'J' + ecount.resource.LBL00960, '']);

            option.optionData = selectOption;
        }
        return option;
    },

    setGridDateCustomPriceLess: function (value, rowItem) {

        var option = {};

        if (rowItem.PRICE_LESS != "") {
            var selectOption = new Array();
            selectOption.push(['1000000.0000000000', ecount.resource.LBL00097, '']);
            selectOption.push(['100000.0000000000', ecount.resource.LBL00096, '']);
            selectOption.push(['10000.0000000000', ecount.resource.LBL00095, '']);
            selectOption.push(['1000.0000000000', ecount.resource.LBL00094, '']);
            selectOption.push(['100.0000000000', ecount.resource.LBL00093, '']);
            selectOption.push(['10.0000000000', ecount.resource.LBL00084, '']);
            selectOption.push(['1.0000000000', ecount.resource.LBL00085, '']);
            selectOption.push(['0.1000000000', ecount.resource.LBL00086, '']);
            selectOption.push(['0.0100000000', ecount.resource.LBL00087, '']);
            selectOption.push(['0.0010000000', ecount.resource.LBL00088, '']);

            option.optionData = selectOption;
        }
        return option;
    },

    setGridDateCustomPriceRise: function (value, rowItem) {

        var option = {};

        if (rowItem.PRICE_RISE != "") {
            var selectOption = new Array();
            selectOption.push(['R', ecount.resource.LBL01249, '']);
            selectOption.push(['C', ecount.resource.LBL02513, '']);
            selectOption.push(['F', ecount.resource.LBL02512, '']);

            option.optionData = selectOption;
        }
        return option;
    },

    setGridDateCustomUseYn: function (value, rowItem) {

        var option = {};

        if (rowItem.PRICE_RISE != "") {
            var selectOption = new Array();
            selectOption.push(['Y', ecount.resource.BTN00346, '']);
            selectOption.push(['N', ecount.resource.LBL06453, '']);

            option.optionData = selectOption;
        }
        return option;
    },

    setGridDateCustomSave: function (value, rowItem) {

        var option = {};

        option.data = ecount.resource.BTN00063;

        option.event = {
            'click': function (value, rowItem) {
                
                var objthis = this;
                var data = {
                    CLASS_CD: rowItem.rowItem.CLASS_CD,
                    CODE_CLASS: rowItem.rowItem.CODE_CLASS,
                    PRICE_GUBUN : rowItem.rowItem.PRICE_GUBUN,
                    PRICE_RATE : rowItem.rowItem.PRICE_RATE,
                    PRICE_LESS: rowItem.rowItem.PRICE_LESS,
                    PRICE_RISE: rowItem.rowItem.PRICE_RISE,
                    USE_YN: rowItem.rowItem.USE_YN
                };

                ecount.confirm(ecount.resource.MSG01521, function (status) {
                    if (status === true) {
                        ecount.common.api({
                            url: "/Inventory/Basic/UpdateStatusPriceLevel",
                            data: Object.toJSON(data),
                            success: function (result) {
                                if (result.Status != "200") {
                                    ecount.alert(result.fullErrorMsg);
                                }
                                else {
                                    objthis.setReload(objthis);
                                }
                            }
                        });
                    }
                })


            }.bind(this)
        }

      
        return option;
    },

    // 일괄변경
    onContentsApply : function(){

        var _grid = this.contents.getGrid().grid;
        var rowItem = _grid.getRowList();

        var target = "";
        var target_value = this.contents.getControl("allKind").getValue();

        switch (this.contents.getControl("category").getValue())
        {
            case "0":
                target = "PRICE_GUBUN";
                break;
            case "1":
                target = "PRICE_RATE";
                target_value = this.contents.getControl("rate").getValue();
                break;
            case "2":
                target = "PRICE_LESS";
                break;
            case "3":
                target = "PRICE_RISE";
                break;
            case "4":
                target = "USE_YN";
                break;
        }

        for (var i = 0; i < rowItem.length; i++) {

            if (rowItem[i]["CLASS_CD"] != "") {
                if (_grid.isChecked(i)) {
                    _grid.setCell(target, i, target_value);
                }

            }
        }
    },


    onChangeControl: function (control) {
        if(control.cid == "category")
        {
            this.contents.getControl("allKind").removeOption();

            this.contents.getControl("rate").hide();
            this.contents.getControl("allKind").hide();

            switch(control.value)
            {
                case "0":
                    this.contents.getControl("allKind").show();
                    this.contents.getControl("allKind").addOption([
                        ["O", ecount.resource.LBL02813],
                        ["I", ecount.resource.LBL02238],
                        ["A", 'A' + ecount.resource.LBL00960],
                        ["B", 'B' + ecount.resource.LBL00960],
                        ["C", 'C' + ecount.resource.LBL00960],
                        ["D", 'D' + ecount.resource.LBL00960],
                        ["E", 'E' + ecount.resource.LBL00960],
                        ["F", 'F' + ecount.resource.LBL00960],
                        ["G", 'G' + ecount.resource.LBL00960],
                        ["H", 'H' + ecount.resource.LBL00960],
                        ["9", '9' + ecount.resource.LBL00960],
                        ["G", 'G' + ecount.resource.LBL00960]
                    ]);
                    break;
                case "1":
                    this.contents.getControl("rate").show();
                    break;
                case "2":
                    this.contents.getControl("allKind").show();
                    this.contents.getControl("allKind").addOption([
                        ['1000000.0000000000', ecount.resource.LBL00097],
                        ['100000.0000000000', ecount.resource.LBL00096],
                        ['10000.0000000000', ecount.resource.LBL00095],
                        ['1000.0000000000', ecount.resource.LBL00094],
                        ['100.0000000000', ecount.resource.LBL00093],
                        ['10.0000000000', ecount.resource.LBL00084],
                        ['1.0000000000', ecount.resource.LBL00085],
                        ['0.1000000000', ecount.resource.LBL00086],
                        ['0.0100000000', ecount.resource.LBL00087],
                        ['0.0010000000', ecount.resource.LBL00088]
                    ]);
                    break;
                case "3":
                    this.contents.getControl("allKind").show();
                    this.contents.getControl("allKind").addOption([
                        ['R', ecount.resource.LBL01249],
                        ['C', ecount.resource.LBL02513],
                        ['F', ecount.resource.LBL02512]
                    ]);
                    break;
                case "4":
                    this.contents.getControl("allKind").show();
                    this.contents.getControl("allKind").addOption([
                        ['Y', ecount.resource.BTN00346],
                        ['N', ecount.resource.LBL06453]
                    ]);
                    break;
            }
        }
    },
     
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
       
    }

    /**********************************************************************
    * define user function
    **********************************************************************/
});