window.__define_resource && __define_resource("LBL06445","LBL03289","LBL03290","LBL03291","BTN00070","BTN00008","MSG02142","LBL06423");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level By Group >> Setting Item Group
                 재고1 > 기초등록 > 특별단가등록 > 옵션 > 품목그룹구분설정
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA027P_01", {

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,
    /**************************************************************************************************** 
      * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    strGroupCode: null,
    icnt: 0,
    permit: null,

    /********************************************************************** 
      * page init   Class inheritance , init, render etc
      **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        //this.searchFormParameter = { PARAM: "", EXCEL_FLAG: 2 }; 

        this.strGroupCode = $.isNull(this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG) ? "1" : this.viewBag.InitDatas.GroupCode[0].PRICE_GROUP_FLAG;


        this.icnt = this.viewBag.InitDatas.CountSale007.length;

        this.permit = this.viewBag.Permission.permitESA027P_01;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************************************************
         * UI Layout setting
     ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle(this.resource.LBL06445)
        .notUsedBookmark()
    },


    onInitContents: function (contents, resource) {

        var g = widget.generator,
            form = g.form(),

        decq = '9' + ecount.config.inventory.DEC_Q;
        var ctrl = widget.generator.control();
        form.template("register")
        form.add(ctrl.define("widget.select", "GroupCode", "GroupCode", this.resource.LBL06445)
            .option([[1, this.resource.LBL03289], [2, this.resource.LBL03290], [3, this.resource.LBL03291]])
            .select(this.strGroupCode)
            .end())

        contents.add(form)
    },


    //setting Footer option
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(this.resource.BTN00070).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(this.resource.BTN00008));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
             * define common event listener
     ****************************************************************************************************/

    // After the document is opening.
    onLoadComplete: function () {
        // this.contents.getGrid().draw(this.searchFormParameter);
    },

    onChangeControl: function (e) {
        if (e.cid == "GroupCode") {
            if (this.icnt > 0) {
                ecount.alert(this.viewBag.Resource.MSG02142);
                this.contents.getControl("GroupCode").setValue(this.strGroupCode)
            }
            else {
                this.strGroupCode = this.contents.getControl("GroupCode").getValue()
            }
        }
    },


    //A value that has been passed on to parents in the pop-up window control flag
    onMessageHandler: function (page, message) {
        this.setReload(this);
    },


    /**************************************************************************************************** 
      * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
      * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    //Close
    onFooterClose: function () {
        this.close();
    },

    onFooterApply: function () {

        var btn = this.footer.get(0).getControl("Apply")

        if (this.permit.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06423, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var thisObj = this;
        ecount.common.api({
            url: "/Inventory/Sale/UpdatePageCompanySale",
            //async: false,
            data: JSON.stringify({ PRICE_GROUP_FLAG: thisObj.strGroupCode }),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {

                    var message = {
                        data: {
                            GroupCode: thisObj.strGroupCode
                        }
                    };

                    thisObj.sendMessage(thisObj, message);
                    //thisObj.close();

                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }

            },
            complete: function () {
                btn.setAllowClick();
            }
        });
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

    // Reload
    setReload: function (e) {
        // Put logic to draw a grid search terms
        //this.contents.getGrid().draw(this.searchFormParameter);
    },
})