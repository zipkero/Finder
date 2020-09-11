window.__define_resource && __define_resource("LBL02395","LBL93710","LBL03105","LBL10749","LBL00445","LBL03640","MSG01140","LBL05347","LBL05365","MSG03022","BTN00380","LBL07157","MSG00676","MSG00675");
/****************************************************************************************************
1. Create Date : 2015.08.03
2. Creator     : Nguyen Tran Quoc Bao
3. Description : INV.1 > SETUP > APRROVAL LINE / 재고1 > 기초등록 > 재고결재라인등록
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 [2019.10.18] 한재국 : 결재라인2 추가
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA017M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    fDataEdit: null,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);

        var infoData = this.viewBag.InitDatas.WhLoad[0];
        if (infoData != null) {
            this.fDataEdit.txtSIGNTITLE = infoData.SIGN_TITLE;
            this.fDataEdit.txtSIGNTITLE_WIDTH = infoData.TITLE_WIDTH;
            this.fDataEdit.SBSIGNTITLE_FONTSIZE = infoData.TITLE_FONT_SIZE;

            this.fDataEdit.txtLevel1 = infoData.LEVEL1 == null || infoData.LEVEL1 == undefined ? '' : infoData.LEVEL1;
            this.fDataEdit.txtLevel1_Width = infoData.LINE1_WIDTH == null || infoData.LINE1_WIDTH == undefined ? '' : infoData.LINE1_WIDTH;
            this.fDataEdit.sbLevel1_FontSize = infoData.LINE1_FONT_SIZE == null || infoData.LINE1_FONT_SIZE == undefined ? '12' : infoData.LINE1_FONT_SIZE;
            this.fDataEdit.chkUse1 = infoData.USE1 != null && infoData.USE1 != undefined && infoData.USE1.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel2 = infoData.LEVEL2 == null || infoData.LEVEL2 == undefined ? '' : infoData.LEVEL2;
            this.fDataEdit.txtLevel2_Width = infoData.LINE2_WIDTH == null || infoData.LINE2_WIDTH == undefined ? '' : infoData.LINE2_WIDTH;
            this.fDataEdit.sbLevel2_FontSize = infoData.LINE2_FONT_SIZE == null || infoData.LINE2_FONT_SIZE == undefined ? '12' : infoData.LINE2_FONT_SIZE;
            this.fDataEdit.chkUse2 = infoData.USE2 != null && infoData.USE2 != undefined && infoData.USE2.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel3 = infoData.LEVEL3 == null || infoData.LEVEL3 == undefined ? '' : infoData.LEVEL3;
            this.fDataEdit.txtLevel3_Width = infoData.LINE3_WIDTH == null || infoData.LINE3_WIDTH == undefined ? '' : infoData.LINE3_WIDTH;
            this.fDataEdit.sbLevel3_FontSize = infoData.LINE3_FONT_SIZE == null || infoData.LINE3_FONT_SIZE == undefined ? '12' : infoData.LINE3_FONT_SIZE;
            this.fDataEdit.chkUse3 = infoData.USE3 != null && infoData.USE3 != undefined && infoData.USE3.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel4 = infoData.LEVEL4 == null || infoData.LEVEL4 == undefined ? '' : infoData.LEVEL4;
            this.fDataEdit.txtLevel4_Width = infoData.LINE4_WIDTH == null || infoData.LINE4_WIDTH == undefined ? '' : infoData.LINE4_WIDTH;
            this.fDataEdit.sbLevel4_FontSize = infoData.LINE4_FONT_SIZE == null || infoData.LINE4_FONT_SIZE == undefined ? '12' : infoData.LINE4_FONT_SIZE;
            this.fDataEdit.chkUse4 = infoData.USE4 != null && infoData.USE4 != undefined && infoData.USE4.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel5 = infoData.LEVEL5 == null || infoData.LEVEL5 == undefined ? '' : infoData.LEVEL5;
            this.fDataEdit.txtLevel5_Width = infoData.LINE5_WIDTH == null || infoData.LINE5_WIDTH == undefined ? '' : infoData.LINE5_WIDTH;
            this.fDataEdit.sbLevel5_FontSize = infoData.LINE5_FONT_SIZE == null || infoData.LINE5_FONT_SIZE == undefined ? '12' : infoData.LINE5_FONT_SIZE;
            this.fDataEdit.chkUse5 = infoData.USE5 != null && infoData.USE5 != undefined && infoData.USE5.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel6 = infoData.LEVEL6 == null || infoData.LEVEL6 == undefined ? '' : infoData.LEVEL6;
            this.fDataEdit.txtLevel6_Width = infoData.LINE6_WIDTH == null || infoData.LINE6_WIDTH == undefined ? '' : infoData.LINE6_WIDTH;
            this.fDataEdit.sbLevel6_FontSize = infoData.LINE6_FONT_SIZE == null || infoData.LINE6_FONT_SIZE == undefined ? '12' : infoData.LINE6_FONT_SIZE;
            this.fDataEdit.chkUse6 = infoData.USE6 != null && infoData.USE6 != undefined && infoData.USE6.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel7 = infoData.LEVEL7 == null || infoData.LEVEL7 == undefined ? '' : infoData.LEVEL7;
            this.fDataEdit.txtLevel7_Width = infoData.LINE7_WIDTH == null || infoData.LINE7_WIDTH == undefined ? '' : infoData.LINE7_WIDTH;
            this.fDataEdit.sbLevel7_FontSize = infoData.LINE7_FONT_SIZE == null || infoData.LINE7_FONT_SIZE == undefined ? '12' : infoData.LINE7_FONT_SIZE;
            this.fDataEdit.chkUse7 = infoData.USE7 != null && infoData.USE7 != undefined && infoData.USE7.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel8 = infoData.LEVEL8 == null || infoData.LEVEL8 == undefined ? '' : infoData.LEVEL8;
            this.fDataEdit.txtLevel8_Width = infoData.LINE8_WIDTH == null || infoData.LINE8_WIDTH == undefined ? '' : infoData.LINE8_WIDTH;
            this.fDataEdit.sbLevel8_FontSize = infoData.LINE8_FONT_SIZE == null || infoData.LINE8_FONT_SIZE == undefined ? '12' : infoData.LINE8_FONT_SIZE;
            this.fDataEdit.chkUse8 = infoData.USE8 != null && infoData.USE8 != undefined && infoData.USE8.trim() != '0' ? '1' : '0';

            this.fDataEdit.txtLevel9 = infoData.LEVEL9 == null || infoData.LEVEL9 == undefined ? '' : infoData.LEVEL9;
            this.fDataEdit.txtLevel9_Width = infoData.LINE9_WIDTH == null || infoData.LINE9_WIDTH == undefined ? '0' : infoData.LINE9_WIDTH;
            this.fDataEdit.sbLevel9_FontSize = infoData.LINE9_FONT_SIZE == null || infoData.LINE9_FONT_SIZE == undefined ? '12' : infoData.LINE9_FONT_SIZE;
            this.fDataEdit.chkUse9 = infoData.USE9 != null && infoData.USE9 != undefined && infoData.USE9.trim() != '0' ? '1' : '0';

            this.fDataEdit.WID = infoData.WID;
            this.fDataEdit.WDATE = infoData.WDATE;
        };

        var infoData1 = this.viewBag.InitDatas.WhLoad1[0];
        if (infoData1 != null) {
            this.fDataEdit1.txtSIGNTITLE = infoData1.SIGN_TITLE;
            this.fDataEdit1.txtSIGNTITLE_WIDTH = infoData1.TITLE_WIDTH;
            this.fDataEdit1.SBSIGNTITLE_FONTSIZE = infoData1.TITLE_FONT_SIZE;

            this.fDataEdit1.txtLevel1 = infoData1.LEVEL1 == null || infoData1.LEVEL1 == undefined ? '' : infoData1.LEVEL1;
            this.fDataEdit1.txtLevel1_Width = infoData.LINE1_WIDTH == null || infoData1.LINE1_WIDTH == undefined ? '' : infoData1.LINE1_WIDTH;
            this.fDataEdit1.sbLevel1_FontSize = infoData1.LINE1_FONT_SIZE == null || infoData1.LINE1_FONT_SIZE == undefined ? '12' : infoData1.LINE1_FONT_SIZE;
            this.fDataEdit1.chkUse1 = infoData1.USE1 != null && infoData1.USE1 != undefined && infoData1.USE1.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel2 = infoData1.LEVEL2 == null || infoData1.LEVEL2 == undefined ? '' : infoData1.LEVEL2;
            this.fDataEdit1.txtLevel2_Width = infoData1.LINE2_WIDTH == null || infoData1.LINE2_WIDTH == undefined ? '' : infoData1.LINE2_WIDTH;
            this.fDataEdit1.sbLevel2_FontSize = infoData1.LINE2_FONT_SIZE == null || infoData1.LINE2_FONT_SIZE == undefined ? '12' : infoData1.LINE2_FONT_SIZE;
            this.fDataEdit1.chkUse2 = infoData1.USE2 != null && infoData1.USE2 != undefined && infoData1.USE2.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel3 = infoData1.LEVEL3 == null || infoData1.LEVEL3 == undefined ? '' : infoData1.LEVEL3;
            this.fDataEdit1.txtLevel3_Width = infoData1.LINE3_WIDTH == null || infoData1.LINE3_WIDTH == undefined ? '' : infoData1.LINE3_WIDTH;
            this.fDataEdit1.sbLevel3_FontSize = infoData1.LINE3_FONT_SIZE == null || infoData1.LINE3_FONT_SIZE == undefined ? '12' : infoData1.LINE3_FONT_SIZE;
            this.fDataEdit1.chkUse3 = infoData1.USE3 != null && infoData1.USE3 != undefined && infoData1.USE3.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel4 = infoData1.LEVEL4 == null || infoData1.LEVEL4 == undefined ? '' : infoData1.LEVEL4;
            this.fDataEdit1.txtLevel4_Width = infoData1.LINE4_WIDTH == null || infoData1.LINE4_WIDTH == undefined ? '' : infoData1.LINE4_WIDTH;
            this.fDataEdit1.sbLevel4_FontSize = infoData1.LINE4_FONT_SIZE == null || infoData1.LINE4_FONT_SIZE == undefined ? '12' : infoData1.LINE4_FONT_SIZE;
            this.fDataEdit1.chkUse4 = infoData1.USE4 != null && infoData1.USE4 != undefined && infoData1.USE4.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel5 = infoData1.LEVEL5 == null || infoData1.LEVEL5 == undefined ? '' : infoData1.LEVEL5;
            this.fDataEdit1.txtLevel5_Width = infoData1.LINE5_WIDTH == null || infoData1.LINE5_WIDTH == undefined ? '' : infoData1.LINE5_WIDTH;
            this.fDataEdit1.sbLevel5_FontSize = infoData1.LINE5_FONT_SIZE == null || infoData1.LINE5_FONT_SIZE == undefined ? '12' : infoData1.LINE5_FONT_SIZE;
            this.fDataEdit1.chkUse5 = infoData1.USE5 != null && infoData1.USE5 != undefined && infoData1.USE5.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel6 = infoData1.LEVEL6 == null || infoData1.LEVEL6 == undefined ? '' : infoData1.LEVEL6;
            this.fDataEdit1.txtLevel6_Width = infoData1.LINE6_WIDTH == null || infoData1.LINE6_WIDTH == undefined ? '' : infoData1.LINE6_WIDTH;
            this.fDataEdit1.sbLevel6_FontSize = infoData1.LINE6_FONT_SIZE == null || infoData1.LINE6_FONT_SIZE == undefined ? '12' : infoData1.LINE6_FONT_SIZE;
            this.fDataEdit1.chkUse6 = infoData1.USE6 != null && infoData1.USE6 != undefined && infoData1.USE6.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel7 = infoData1.LEVEL7 == null || infoData1.LEVEL7 == undefined ? '' : infoData1.LEVEL7;
            this.fDataEdit1.txtLevel7_Width = infoData1.LINE7_WIDTH == null || infoData1.LINE7_WIDTH == undefined ? '' : infoData1.LINE7_WIDTH;
            this.fDataEdit1.sbLevel7_FontSize = infoData1.LINE7_FONT_SIZE == null || infoData1.LINE7_FONT_SIZE == undefined ? '12' : infoData1.LINE7_FONT_SIZE;
            this.fDataEdit1.chkUse7 = infoData1.USE7 != null && infoData1.USE7 != undefined && infoData1.USE7.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel8 = infoData1.LEVEL8 == null || infoData1.LEVEL8 == undefined ? '' : infoData1.LEVEL8;
            this.fDataEdit1.txtLevel8_Width = infoData1.LINE8_WIDTH == null || infoData1.LINE8_WIDTH == undefined ? '' : infoData1.LINE8_WIDTH;
            this.fDataEdit1.sbLevel8_FontSize = infoData1.LINE8_FONT_SIZE == null || infoData1.LINE8_FONT_SIZE == undefined ? '12' : infoData1.LINE8_FONT_SIZE;
            this.fDataEdit1.chkUse8 = infoData1.USE8 != null && infoData1.USE8 != undefined && infoData1.USE8.trim() != '0' ? '1' : '0';

            this.fDataEdit1.txtLevel9 = infoData1.LEVEL9 == null || infoData1.LEVEL9 == undefined ? '' : infoData1.LEVEL9;
            this.fDataEdit1.txtLevel9_Width = infoData1.LINE9_WIDTH == null || infoData1.LINE9_WIDTH == undefined ? '0' : infoData1.LINE9_WIDTH;
            this.fDataEdit1.sbLevel9_FontSize = infoData1.LINE9_FONT_SIZE == null || infoData1.LINE9_FONT_SIZE == undefined ? '12' : infoData1.LINE9_FONT_SIZE;
            this.fDataEdit1.chkUse9 = infoData1.USE9 != null && infoData1.USE9 != undefined && infoData1.USE9.trim() != '0' ? '1' : '0';

            this.fDataEdit1.WID = infoData1.WID;
            this.fDataEdit1.WDATE = infoData1.WDATE;
        }
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    // Set default properties
    initProperties: function () {
        this.fDataEdit = {
            txtSIGNTITLE: '', txtSIGNTITLE_WIDTH: '', SBSIGNTITLE_FONTSIZE: '',
            chkUse1: '', txtLevel1: '', txtLevel1_Width: '', sbLevel1_FontSize: '12',
            chkUse2: '', txtLevel2: '', txtLevel2_Width: '', sbLevel2_FontSize: '12',
            chkUse3: '', txtLevel3: '', txtLevel3_Width: '', sbLevel3_FontSize: '12',
            chkUse4: '', txtLevel4: '', txtLevel4_Width: '', sbLevel4_FontSize: '12',
            chkUse5: '', txtLevel5: '', txtLevel5_Width: '', sbLevel5_FontSize: '12',
            chkUse6: '', txtLevel6: '', txtLevel6_Width: '', sbLevel6_FontSize: '12',
            chkUse7: '', txtLevel7: '', txtLevel7_Width: '', sbLevel7_FontSize: '12',
            chkUse8: '', txtLevel8: '', txtLevel8_Width: '', sbLevel8_FontSize: '12',
            chkUse9: '', txtLevel9: '', txtLevel9_Width: '', sbLevel9_FontSize: '12',
            WID: '', WDATE: ''
        };

        this.fDataEdit1 = {
            txtSIGNTITLE: '', txtSIGNTITLE_WIDTH: '', SBSIGNTITLE_FONTSIZE: '',
            chkUse1: '', txtLevel1: '', txtLevel1_Width: '', sbLevel1_FontSize: '12',
            chkUse2: '', txtLevel2: '', txtLevel2_Width: '', sbLevel2_FontSize: '12',
            chkUse3: '', txtLevel3: '', txtLevel3_Width: '', sbLevel3_FontSize: '12',
            chkUse4: '', txtLevel4: '', txtLevel4_Width: '', sbLevel4_FontSize: '12',
            chkUse5: '', txtLevel5: '', txtLevel5_Width: '', sbLevel5_FontSize: '12',
            chkUse6: '', txtLevel6: '', txtLevel6_Width: '', sbLevel6_FontSize: '12',
            chkUse7: '', txtLevel7: '', txtLevel7_Width: '', sbLevel7_FontSize: '12',
            chkUse8: '', txtLevel8: '', txtLevel8_Width: '', sbLevel8_FontSize: '12',
            chkUse9: '', txtLevel9: '', txtLevel9_Width: '', sbLevel9_FontSize: '12',
            WID: '', WDATE: ''
        };
    },

    onInitHeader: function (header, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        header.setTitle(this.hidSerNo == '2' ? ecount.resource.LBL02395 : ecount.resource.LBL93710);

        if (this.hidSerNo == '4') {
            header.add("option", [{ id: "AcctCopy", label: ecount.resource.LBL03105 }], false);
        }
    },

    onInitContents: function (contents, resource) {
        var grid = widget.generator.grid(),
            grid1 = widget.generator.grid(),
            g = widget.generator,
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();


        var selectOption = new Array();
        var selectedValue = "9";
        for (var i = 9, len = 21; i < len; i++) {
            selectOption.push([i.toString(), i.toString() + 'px']);
        }

        grid.setEditable(true, 0, 0);
        grid.setRowData([
                { 'column1': ecount.resource.LBL10749, 'SIGNTITLE': this.fDataEdit.txtSIGNTITLE, 'SIGNTITLE_WIDTH': this.fDataEdit.txtSIGNTITLE_WIDTH + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.SBSIGNTITLE_FONTSIZE },
                { 'column1': ecount.resource.LBL00445 + ' 1', 'SIGNTITLE': this.fDataEdit.txtLevel1, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel1_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel1_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 2', 'SIGNTITLE': this.fDataEdit.txtLevel2, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel2_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel2_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 3', 'SIGNTITLE': this.fDataEdit.txtLevel3, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel3_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel3_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 4', 'SIGNTITLE': this.fDataEdit.txtLevel4, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel4_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel4_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 5', 'SIGNTITLE': this.fDataEdit.txtLevel5, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel5_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel5_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 6', 'SIGNTITLE': this.fDataEdit.txtLevel6, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel6_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel6_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 7', 'SIGNTITLE': this.fDataEdit.txtLevel7, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel7_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel7_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 8', 'SIGNTITLE': this.fDataEdit.txtLevel8, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel8_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel8_FontSize },
                { 'column1': ecount.resource.LBL00445 + ' 9', 'SIGNTITLE': this.fDataEdit.txtLevel9, 'SIGNTITLE_WIDTH': this.fDataEdit.txtLevel9_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit.sbLevel9_FontSize },
        ]);
        grid.setColumnPropertyColumnName('id');
        grid.setColumnPropertyNormalize(true);
        grid.setColumns([
                { propertyName: 'column1', id: 'column1', title: '', width: 130, align: 'left', controlType: 'widget.userHelpMark' },
            { propertyName: 'SIGNTITLE', id: 'SIGNTITLE', title: ecount.resource.LBL03640, width: 230, controlType: 'widget.input.codeName', controlOption: { maxLength: { message: String.format(ecount.resource.MSG01140, "30"), max: 30 }, maxLengthOnFilter: true } },
                { propertyName: 'SIGNTITLE_WIDTH', id: 'SIGNTITLE_WIDTH', title: ecount.resource.LBL05347 + '(px)', align: 'right', width: 190, controlType: 'widget.input.number', dataType: '80', controlOption: { decimalUnit: [3, 0] } },
                { propertyName: 'SBSIGNTITLE_FONTSIZE', id: 'SBSIGNTITLE_FONTSIZE', title: ecount.resource.LBL05365 + '(px)', width: 200, controlType: 'widget.select' }
        ]);
        grid.setCustomRowCell('column1', function (value, rowItem) {
            var option = {};

            option.attrs = {
                'data-toggle': 'popover',
                'data-placement': 'right',
                'data-html': 'true',
                'data-content': ecount.resource.MSG03022
            }

            return option;
        });
        var thisObj = this;

        grid.setCustomRowCell('SBSIGNTITLE_FONTSIZE', function (value, rowItem) {
            var option = {};
            option.optionData = selectOption;
            option.event = {
                'setNextFocus': function (e, data) {
                    if (data.rowKey == 9) {
                        thisObj.footer.get(0).getControl("Save").setFocus(0);
                        return false;
                    }
                    return true;
                }
            };
            return option;
        });

        grid1.setEditable(true, 0, 0);
        grid1.setRowData([
            { 'column1': ecount.resource.LBL10749, 'SIGNTITLE': this.fDataEdit1.txtSIGNTITLE, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtSIGNTITLE_WIDTH + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.SBSIGNTITLE_FONTSIZE },
            { 'column1': ecount.resource.LBL00445 + ' 1', 'SIGNTITLE': this.fDataEdit1.txtLevel1, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel1_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel1_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 2', 'SIGNTITLE': this.fDataEdit1.txtLevel2, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel2_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel2_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 3', 'SIGNTITLE': this.fDataEdit1.txtLevel3, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel3_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel3_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 4', 'SIGNTITLE': this.fDataEdit1.txtLevel4, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel4_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel4_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 5', 'SIGNTITLE': this.fDataEdit1.txtLevel5, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel5_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel5_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 6', 'SIGNTITLE': this.fDataEdit1.txtLevel6, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel6_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel6_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 7', 'SIGNTITLE': this.fDataEdit1.txtLevel7, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel7_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel7_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 8', 'SIGNTITLE': this.fDataEdit1.txtLevel8, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel8_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel8_FontSize },
            { 'column1': ecount.resource.LBL00445 + ' 9', 'SIGNTITLE': this.fDataEdit1.txtLevel9, 'SIGNTITLE_WIDTH': this.fDataEdit1.txtLevel9_Width + '', 'SBSIGNTITLE_FONTSIZE': this.fDataEdit1.sbLevel9_FontSize },
        ]);
        grid1.setColumnPropertyColumnName('id');
        grid1.setColumnPropertyNormalize(true);
        grid1.setColumns([
            { propertyName: 'column1', id: 'column1', title: '', width: 130, align: 'left', controlType: 'widget.userHelpMark' },
            { propertyName: 'SIGNTITLE', id: 'SIGNTITLE', title: ecount.resource.LBL03640, width: 230, controlType: 'widget.input.codeType', controlOption: { maxLength: { message: String.format(ecount.resource.MSG01140, "30"), max: 30 }, maxLengthOnFilter: true } },
            {
                propertyName: 'SIGNTITLE_WIDTH', id: 'SIGNTITLE_WIDTH', title: ecount.resource.LBL05347 + '(px)', align: 'right', width: 190, controlType: 'widget.input.number', dataType: '80', controlOption: { decimalUnit: [3, 0] }
            },
            { propertyName: 'SBSIGNTITLE_FONTSIZE', id: 'SBSIGNTITLE_FONTSIZE', title: ecount.resource.LBL05365 + '(px)', width: 200, controlType: 'widget.select' }
        ]);
        grid1.setCustomRowCell('column1', function (value, rowItem) {
            var option = {};

            option.attrs = {
                'data-toggle': 'popover',
                'data-placement': 'right',
                'data-html': 'true',
                'data-content': ecount.resource.MSG03022
            }

            return option;
        });

        grid1.setCustomRowCell('SBSIGNTITLE_FONTSIZE', function (value, rowItem) {
            var option = {};
            option.optionData = selectOption;
            option.event = {
                'setNextFocus': function (e, data) {
                    if (data.rowKey == 9) {
                        thisObj.footer.get(0).getControl("Save").setFocus(0);
                        return false;
                    }
                    return true;
                }
            };
            return option;
        });

        contents.add(g.subTitle().title(ecount.resource.LBL10749 + " 1 "));
        contents.addGrid("dataGrid", grid);
        contents.add(g.subTitle().title(ecount.resource.LBL10749 + " 2 "));
        contents.addGrid("dataGrid1", grid1);
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00380).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));

        footer.add(toolbar);
    },

    onDropdownAcctCopy: function () {
        var thisObj = this;
        var dataObj = JSON.stringify({
            SER_NO: '0'
        });
        ecount.common.api({
            url: "/Common/Infra/GetAprovalLineData",
            data: dataObj,
            success: function (result) {
                if (result != null && result != undefined) {
                    if (result.Data.length > 0) {
                        var rowList;
                        var myGrid = thisObj.contents.getGrid('dataGrid').grid;
                        myGrid.editDone();
                        rowList = myGrid.getRowList();
                        $.each(rowList, function (key, value) {
                            switch (key) {
                                case 0:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].SIGN_TITLE);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].TITLE_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].TITLE_FONT_SIZE);
                                    break;
                                case 1:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL1);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE1_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE1_FONT_SIZE);
                                    break;
                                case 2:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL2);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE2_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE2_FONT_SIZE);
                                    break;
                                case 3:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL3);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE3_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE3_FONT_SIZE);
                                    break;
                                case 4:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL4);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE4_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE4_FONT_SIZE);
                                    break;
                                case 5:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL5);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE5_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE5_FONT_SIZE);
                                    break;
                                case 6:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL6);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE6_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE6_FONT_SIZE);
                                    break;
                                case 7:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL7);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE7_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE7_FONT_SIZE);
                                    break;
                                case 8:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL8);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE8_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE8_FONT_SIZE);
                                    break;
                                case 9:
                                    myGrid.setCell('SIGNTITLE', key, result.Data[0].LEVEL9);
                                    myGrid.setCell('SIGNTITLE_WIDTH', key, result.Data[0].LINE9_WIDTH);
                                    myGrid.setCell('SBSIGNTITLE_FONTSIZE', key, result.Data[0].LINE9_FONT_SIZE);
                                    break;
                            }
                        });
                        myGrid.editDone();
                    }
                }
            }
        });
    },

    onLoadComplete: function () {
    },

    onMessageHandler: function (page, message) {
        if (page.pageID == "ESA017M") {
            message.callback && message.callback();
        }
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus)
            gridObj.grid.setCellFocus('SIGNTITLE', '0');
    },

    onFooterSave: function (e) {
        var self = this;
        var permit = self.viewBag.Permission.permit;
        if (!['W'].contains(permit.Value)) {
            var sMessage = '';
            if (this.sPermission == 'E040111') sMessage = ecount.resource.LBL02395;
            else sMessage = ecount.resource.LBL93710;

            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: sMessage, PermissionMode: 'U' }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }

        var thisObj = this;
        this.fnSaveGrid(thisObj);
    },

    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.fDataEdit.WDATE,
            lastEditId: this.fDataEdit.WID,
            parentPageID: this.pageID,
            responseID: this.callbackID
        }
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        })
    },

    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },

    ON_KEY_ENTER: function (e, target) {
        if (!e.unfocus && e.target.attributes.id.value == 'btn-footer-Save')
            this.ON_KEY_F8();
    },

    fnSaveGrid: function (thisObj) {
        if (this.fnCheckGrid(this) == false) return false;
        if (this.fnCheckGrid1(this) == false) return false;

        var rowList;
        var myGrid = this.contents.getGrid('dataGrid').grid;
        myGrid.editDone();
        rowList = myGrid.getRowList();

        $.each(rowList, function (key, value) {
            var iSIGNTITLE_WIDTH = 0;
            var iSIGNTITLE_fontsize = 0;
            iSIGNTITLE_WIDTH = value.SIGNTITLE_WIDTH.trim() == '' ? 0 : parseInt(value.SIGNTITLE_WIDTH.trim());
            iSIGNTITLE_fontsize = value.SBSIGNTITLE_FONTSIZE.toString().trim() == '' ? 0 : parseInt(value.SBSIGNTITLE_FONTSIZE.toString().trim());
            if ($.isNull(value.SIGNTITLE))
                value.SIGNTITLE = ""

            switch (key) {
                case 0:
                    thisObj.fDataEdit.txtSIGNTITLE = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtSIGNTITLE_WIDTH = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.SBSIGNTITLE_FONTSIZE = iSIGNTITLE_fontsize;
                    break;
                case 1:
                    thisObj.fDataEdit.txtLevel1 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel1_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel1_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse1 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 2:
                    thisObj.fDataEdit.txtLevel2 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel2_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel2_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse2 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 3:
                    thisObj.fDataEdit.txtLevel3 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel3_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel3_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse3 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 4:
                    thisObj.fDataEdit.txtLevel4 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel4_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel4_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse4 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 5:
                    thisObj.fDataEdit.txtLevel5 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel5_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel5_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse5 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 6:
                    thisObj.fDataEdit.txtLevel6 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel6_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel6_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse6 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 7:
                    thisObj.fDataEdit.txtLevel7 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel7_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel7_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse7 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 8:
                    thisObj.fDataEdit.txtLevel8 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel8_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel8_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse8 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 9:
                    thisObj.fDataEdit.txtLevel9 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit.txtLevel9_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit.sbLevel9_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit.chkUse9 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
            }
        });

        var dataObj = JSON.stringify({
            editFlag: "M",
            SER_NO: 2,
            sPermisison: thisObj.sPermission,
            SIGN_TITLE: thisObj.fDataEdit.txtSIGNTITLE,
            TITLE_WIDTH: thisObj.fDataEdit.txtSIGNTITLE_WIDTH,
            TITLE_FONT_SIZE: thisObj.fDataEdit.SBSIGNTITLE_FONTSIZE,
            LEVEL1: thisObj.fDataEdit.txtLevel1,
            LINE1_WIDTH: thisObj.fDataEdit.txtLevel1_Width,
            LINE1_FONT_SIZE: thisObj.fDataEdit.sbLevel1_FontSize,
            USE1: thisObj.fDataEdit.chkUse1,
            LEVEL2: thisObj.fDataEdit.txtLevel2,
            LINE2_WIDTH: thisObj.fDataEdit.txtLevel2_Width,
            LINE2_FONT_SIZE: thisObj.fDataEdit.sbLevel2_FontSize,
            USE2: thisObj.fDataEdit.chkUse2,
            LEVEL3: thisObj.fDataEdit.txtLevel3,
            LINE3_WIDTH: thisObj.fDataEdit.txtLevel3_Width,
            LINE3_FONT_SIZE: thisObj.fDataEdit.sbLevel3_FontSize,
            USE3: thisObj.fDataEdit.chkUse3,
            LEVEL4: thisObj.fDataEdit.txtLevel4,
            LINE4_WIDTH: thisObj.fDataEdit.txtLevel4_Width,
            LINE4_FONT_SIZE: thisObj.fDataEdit.sbLevel4_FontSize,
            USE4: thisObj.fDataEdit.chkUse4,
            LEVEL5: thisObj.fDataEdit.txtLevel5,
            LINE5_WIDTH: thisObj.fDataEdit.txtLevel5_Width,
            LINE5_FONT_SIZE: thisObj.fDataEdit.sbLevel5_FontSize,
            USE5: thisObj.fDataEdit.chkUse5,
            LEVEL6: thisObj.fDataEdit.txtLevel6,
            LINE6_WIDTH: thisObj.fDataEdit.txtLevel6_Width,
            LINE6_FONT_SIZE: thisObj.fDataEdit.sbLevel6_FontSize,
            USE6: thisObj.fDataEdit.chkUse6,
            LEVEL7: thisObj.fDataEdit.txtLevel7,
            LINE7_WIDTH: thisObj.fDataEdit.txtLevel7_Width,
            LINE7_FONT_SIZE: thisObj.fDataEdit.sbLevel7_FontSize,
            USE7: thisObj.fDataEdit.chkUse7,
            LEVEL8: thisObj.fDataEdit.txtLevel8,
            LINE8_WIDTH: thisObj.fDataEdit.txtLevel8_Width,
            LINE8_FONT_SIZE: thisObj.fDataEdit.sbLevel8_FontSize,
            USE8: thisObj.fDataEdit.chkUse8,
            LEVEL9: thisObj.fDataEdit.txtLevel9,
            LINE9_WIDTH: thisObj.fDataEdit.txtLevel9_Width,
            LINE9_FONT_SIZE: thisObj.fDataEdit.sbLevel9_FontSize,
            USE9: thisObj.fDataEdit.chkUse9
        });

        ecount.common.api({
            url: "/Common/Infra/UpdateSignLevel",
            data: dataObj,
            success: function (result) {
                if (result.Data == 1) {
                    myGrid.setCellFocus('SIGNTITLE', '0');
                    ecount.alert(ecount.resource.MSG00676);
                    thisObj.footer.get(0).getControl("Save").setAllowClick();
                    return false;
                }
                else if (result.Data == 2) {
                    myGrid.setCellFocus('SIGNTITLE', '0');
                    ecount.alert(ecount.resource.MSG00675);
                    thisObj.footer.get(0).getControl("Save").setAllowClick();
                    return false;
                }
                else {
                    thisObj.fnSaveGrid1(thisObj);
                }
            },
            complete: function () {
                thisObj.footer.get(0).getControl("Save").setAllowClick();
            }
        });
    },

    fnCheckGrid: function (thisObj) {
        var rowList;
        var myGrid = this.contents.getGrid('dataGrid').grid;
        myGrid.editDone();
        rowList = myGrid.getRowList();
        var isValid = true;
        $.each(rowList, function (key, value) {
            //Check special character
            if ($.isNull(value.SIGNTITLE))
                value.SIGNTITLE = ""

            var checkCharacters = value.SIGNTITLE.trim().isContainsLimitedSpecial("name");
            if (checkCharacters.result) {
                isValid = false;
                myGrid.setCellFocus('SIGNTITLE', key);
                return false;
            }
        });

        if (isValid == false) {
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }
    },

    fnSaveGrid1: function (thisObj) {
        //Second grid
        var rowList1;
        var myGrid1 = thisObj.contents.getGrid('dataGrid1').grid;
        myGrid1.editDone();
        rowList1 = myGrid1.getRowList();

        $.each(rowList1, function (key, value) {
            var iSIGNTITLE_WIDTH = 0;
            var iSIGNTITLE_fontsize = 0;
            iSIGNTITLE_WIDTH = value.SIGNTITLE_WIDTH.trim() == '' ? 0 : parseInt(value.SIGNTITLE_WIDTH.trim());
            iSIGNTITLE_fontsize = value.SBSIGNTITLE_FONTSIZE.toString().trim() == '' ? 0 : parseInt(value.SBSIGNTITLE_FONTSIZE.toString().trim());
            if ($.isNull(value.SIGNTITLE))
                value.SIGNTITLE = ""

            switch (key) {
                case 0:
                    thisObj.fDataEdit1.txtSIGNTITLE = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtSIGNTITLE_WIDTH = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.SBSIGNTITLE_FONTSIZE = iSIGNTITLE_fontsize;
                    break;
                case 1:
                    thisObj.fDataEdit1.txtLevel1 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel1_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel1_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse1 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 2:
                    thisObj.fDataEdit1.txtLevel2 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel2_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel2_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse2 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 3:
                    thisObj.fDataEdit1.txtLevel3 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel3_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel3_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse3 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 4:
                    thisObj.fDataEdit1.txtLevel4 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel4_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel4_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse4 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 5:
                    thisObj.fDataEdit1.txtLevel5 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel5_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel5_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse5 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 6:
                    thisObj.fDataEdit1.txtLevel6 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel6_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel6_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse6 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 7:
                    thisObj.fDataEdit1.txtLevel7 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel7_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel7_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse7 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 8:
                    thisObj.fDataEdit1.txtLevel8 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel8_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel8_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse8 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
                case 9:
                    thisObj.fDataEdit1.txtLevel9 = value.SIGNTITLE.trim();
                    thisObj.fDataEdit1.txtLevel9_Width = iSIGNTITLE_WIDTH;
                    thisObj.fDataEdit1.sbLevel9_FontSize = iSIGNTITLE_fontsize;
                    thisObj.fDataEdit1.chkUse9 = iSIGNTITLE_WIDTH > 0 ? '1' : '0';
                    break;
            }
        });

        var dataObj1 = JSON.stringify({
            editFlag: "M",
            SER_NO: 3,
            sPermisison: thisObj.sPermission,
            SIGN_TITLE: thisObj.fDataEdit1.txtSIGNTITLE,
            TITLE_WIDTH: thisObj.fDataEdit1.txtSIGNTITLE_WIDTH,
            TITLE_FONT_SIZE: thisObj.fDataEdit1.SBSIGNTITLE_FONTSIZE,
            LEVEL1: thisObj.fDataEdit1.txtLevel1,
            LINE1_WIDTH: thisObj.fDataEdit1.txtLevel1_Width,
            LINE1_FONT_SIZE: thisObj.fDataEdit1.sbLevel1_FontSize,
            USE1: thisObj.fDataEdit1.chkUse1,
            LEVEL2: thisObj.fDataEdit1.txtLevel2,
            LINE2_WIDTH: thisObj.fDataEdit1.txtLevel2_Width,
            LINE2_FONT_SIZE: thisObj.fDataEdit1.sbLevel2_FontSize,
            USE2: thisObj.fDataEdit1.chkUse2,
            LEVEL3: thisObj.fDataEdit1.txtLevel3,
            LINE3_WIDTH: thisObj.fDataEdit1.txtLevel3_Width,
            LINE3_FONT_SIZE: thisObj.fDataEdit1.sbLevel3_FontSize,
            USE3: thisObj.fDataEdit1.chkUse3,
            LEVEL4: thisObj.fDataEdit1.txtLevel4,
            LINE4_WIDTH: thisObj.fDataEdit1.txtLevel4_Width,
            LINE4_FONT_SIZE: thisObj.fDataEdit1.sbLevel4_FontSize,
            USE4: thisObj.fDataEdit1.chkUse4,
            LEVEL5: thisObj.fDataEdit1.txtLevel5,
            LINE5_WIDTH: thisObj.fDataEdit1.txtLevel5_Width,
            LINE5_FONT_SIZE: thisObj.fDataEdit1.sbLevel5_FontSize,
            USE5: thisObj.fDataEdit1.chkUse5,
            LEVEL6: thisObj.fDataEdit1.txtLevel6,
            LINE6_WIDTH: thisObj.fDataEdit1.txtLevel6_Width,
            LINE6_FONT_SIZE: thisObj.fDataEdit1.sbLevel6_FontSize,
            USE6: thisObj.fDataEdit1.chkUse6,
            LEVEL7: thisObj.fDataEdit1.txtLevel7,
            LINE7_WIDTH: thisObj.fDataEdit1.txtLevel7_Width,
            LINE7_FONT_SIZE: thisObj.fDataEdit1.sbLevel7_FontSize,
            USE7: thisObj.fDataEdit1.chkUse7,
            LEVEL8: thisObj.fDataEdit1.txtLevel8,
            LINE8_WIDTH: thisObj.fDataEdit1.txtLevel8_Width,
            LINE8_FONT_SIZE: thisObj.fDataEdit1.sbLevel8_FontSize,
            USE8: thisObj.fDataEdit1.chkUse8,
            LEVEL9: thisObj.fDataEdit1.txtLevel9,
            LINE9_WIDTH: thisObj.fDataEdit1.txtLevel9_Width,
            LINE9_FONT_SIZE: thisObj.fDataEdit1.sbLevel9_FontSize,
            USE9: thisObj.fDataEdit1.chkUse9
        });

        ecount.common.api({
            url: "/Common/Infra/UpdateSignLevel",
            data: dataObj1,
            success: function (result) {
                if (result.Data == 1) {
                    myGrid1.setCellFocus('SIGNTITLE', '0');
                    ecount.alert(ecount.resource.MSG00676);
                    thisObj.footer.get(0).getControl("Save").setAllowClick();
                    return false;
                }
                else if (result.Data == 2) {
                    myGrid1.setCellFocus('SIGNTITLE', '0');
                    ecount.alert(ecount.resource.MSG00675);
                    thisObj.footer.get(0).getControl("Save").setAllowClick();
                    return false;
                }
                else {
                    //this.location.reload();
                    thisObj.onAllSubmitSelf("/ECERP/ESA/ESA017M");
                }
            },
            complete: function () {
                thisObj.footer.get(0).getControl("Save").setAllowClick();
            }
        });
    },

    fnCheckGrid1: function (thisObj) {
        //Second grid
        var rowList1;
        var myGrid1 = thisObj.contents.getGrid('dataGrid1').grid;
        myGrid1.editDone();
        rowList1 = myGrid1.getRowList();
        var isValid = true;
        $.each(rowList1, function (key, value) {
            //Check special character
            if ($.isNull(value.SIGNTITLE))
                value.SIGNTITLE = ""

            var checkCharacters = value.SIGNTITLE.trim().isContainsLimitedSpecial("name");
            if (checkCharacters.result) {
                isValid = false;
                myGrid1.setCellFocus('SIGNTITLE', key);
                return false;
            }
        });

        if (isValid == false) {
            this.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }
    },
});
