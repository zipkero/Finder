window.__define_resource && __define_resource("LBL09297","LBL09222","LBL09223","LBL09298","BTN00356","BTN00008","LBL07309","MSG04528","MSG00291","MSG04969","MSG04971","MSG05516","MSG04958");
/****************************************************************************************************
1. Create Date : 2015.07.09
2. Creator     : Nguyen Anh Tuong
3. Description : Location Add Node
                 재고1 > 기초등록 > 창고등록 > 계층그룹 > 왼쪽 페이지 > Fn > 계층그룹 생성
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                                    - Modify sendMessage function
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA051P_04", {

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
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL09297);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            form = generator.form(),
            ctrl = generator.control(),
            grid = generator.grid();

        // Initialize Grid
        grid.setKeyColumn(['CD_GROUP', 'NM_GROUP'])
            .setEditable(true, 3)
            .setColumns([
                { propertyName: 'CD_GROUP', id: 'CD_GROUP', title: ecount.resource.LBL09222, width: '150', controlType: 'widget.input', controlOption: { maxLength: 30 } },
                { propertyName: 'NM_GROUP', id: 'NM_GROUP', title: ecount.resource.LBL09223, width: '', controlType: 'widget.input', controlOption: { maxLength: 100 } }
            ])
            .setRowData([{ 'CD_GROUP': '', 'NM_GROUP': '' }])
            .setColumnFixHeader(true)
            .setEventAutoAddRowOnLastRow(true, 2, 2);
        //form
        form.template("register")
            .add(ctrl.define("widget.multiCode.whLevelGroup", "txtTreeWhCd", "txtTreeWhCd", ecount.resource.LBL09298)
                .setOptions({ label: null }).maxSelectCount(1).end());
        contents.add(form);
        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00356))
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },
    
    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height())
                                .setFooterBottomMargin(this.footer.height());
        this.contents.getControl("txtTreeWhCd").addCode({ label: this.PText, value: this.PCode });
        this.contents.getControl("txtTreeWhCd").checkMaxCount = 1;
        this.contents.getControl("txtTreeWhCd").defaultParam.YN_USE = 'Y';
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        gridObj.grid.setCellFocus('CD_GROUP', '0');
    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        if (control.id == "txtTreeWhCd") {
            params.url = "/ECERP/ESA/ESA051M";
            params.titlename = params.name;
            params.popupType = false;
            params.additional = true;
            params.TYPE = "SELECT";
        }
        handler(params);
    },
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    onFooterSave: function (e) {
        var self = this;
        var btnSave = this.footer.get(0).getControl("Save");

        if (self.viewBag.Permission.PermitTree.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var txtTree = this.contents.getControl('txtTreeWhCd');
        var cd_Parent = txtTree.serialize().value;

        if (cd_Parent == '') {
            txtTree.showError(ecount.resource.MSG04528);
            txtTree.onFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        var lst = [];
        var bFlag = true;
        var firstCD = '', firstKey = '';
        var sCD = '', sNM = '', sDuplicated = '', cd_List = '';
        var rowList;
        var myGrid = this.contents.getGrid('dataGrid').grid;

        myGrid.editDone();
        rowList = myGrid.getRowList();

        $.each(rowList, function (key, value) {
            sCD = value.CD_GROUP.trim();
            sNM = value.NM_GROUP.trim();

            if (sCD.toUpperCase() == 'ROOT') {
                bFlag = false;
                ecount.alert(ecount.resource.MSG00291);
                myGrid.setCellFocus('CD_GROUP', key);
                return false;
            }

            if (sCD == '' && sNM != '') {
                bFlag = false;
                ecount.alert(ecount.resource.MSG04969);
                myGrid.setCellFocus('CD_GROUP', key);
                return false;
            }

            if (sCD != '' && sNM == '') {
                bFlag = false;
                ecount.alert(ecount.resource.MSG04971);
                myGrid.setCellFocus('NM_GROUP', key);
                return false;
            }

            if (sCD != '' && sNM != '') {
                var bChk = sCD.isContainsLimitedSpecial('code');
                if (bChk.result) {
                    bFlag = false;
                    ecount.alert(bChk.message);
                    myGrid.setCellFocus('CD_GROUP', key);
                    return false;
                }

                if (sCD.indexOf('+') >= 0) {
                    bFlag = false;
                    ecount.alert(ecount.resource.MSG05516);
                    myGrid.setCellFocus('CD_GROUP', key);
                    return false;
                }

                bChk = sNM.isContainsLimitedSpecial('name');
                if (bChk.result) {
                    bFlag = false;
                    ecount.alert(bChk.message);
                    myGrid.setCellFocus('NM_GROUP', key);
                    return false;
                }

                $.each(rowList, function (key2, value2) {
                    if (key != key2) {
                        if (sCD === value2.CD_GROUP.trim()) {
                            if (sDuplicated.indexOf(sCD) < 0) {
                                sDuplicated += String.format('[{0}] : {1} \r\n', sCD, ecount.resource.MSG04958);

                                if (firstKey == '')
                                    firstKey = key;

                                return false;
                            }
                        }
                    }
                });

                lst.push({ CD_GROUP: sCD, NM_GROUP: sNM, KEY: key });
                cd_List += sCD + 'ㆍ';

                if (firstCD == '')
                    firstCD = sCD;
            }
        });

        if (!bFlag) {
            btnSave.setAllowClick();
            return false;
        }

        if (sDuplicated != '') {
            ecount.alert(sDuplicated);
            myGrid.setCellFocus('CD_GROUP', firstKey);
            btnSave.setAllowClick();
            return false;
        }

        if (lst.length == 0) {
            ecount.alert(ecount.resource.MSG04969);
            myGrid.setCellFocus('CD_GROUP', '0');
            btnSave.setAllowClick();
            return false;
        }

        var data = {
            CD_PARENT: cd_Parent,
            CD_GROUP_LIST: cd_List,
            listJSON: lst
        };

        var thisObj = this;

        ecount.common.api({
            url: "/Inventory/Basic/InsertSale001GroupGroup",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else if (result.Data.length > 0)
                    ecount.alert(result.Data);
                else {
                  
                    thisObj.sendMessage(thisObj, { keyword: firstCD });
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                btnSave.setAllowClick();
            }
        });
    },

    //Close button click event
    onFooterClose: function () {
        this.close();
    }

    /**********************************************************************
    * define user function
    **********************************************************************/
});