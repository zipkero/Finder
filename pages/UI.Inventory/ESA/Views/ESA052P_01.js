window.__define_resource && __define_resource("LBL07255","LBL15034","LBL15035","BTN00065","BTN00008","LBL07309");
/****************************************************************************************************
1. Create Date : 2015.06.19
2. Creator     : Nguyen Anh Tuong
3. Description : Move location item to other node of trees
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                                    - Modify sendMessage function
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA052P_01", {
    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,

    codeClass: "",

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07255);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var self = this;
        var generator = widget.generator,
            ctrl = generator.control(),
            form = generator.form();

        this.codeClass = this.custGroupCodeClass;
        //load location level to move
        var list = self.viewBag.InitDatas.locations;
        var optionData = [];
        optionData.push(["", "-------------------"]);
        for (var i = 0; i < list.length; i++) {
            optionData.push([list[i].CD_GROUP, "[" + list[i].CD_GROUP + "] " + list[i].NM_GROUP]);
        }

        form.template("register")
            .add(ctrl.define("widget.label", "Code", "Code", ecount.resource.LBL15034).label(this.NM_GROUP).end())
            .add(ctrl.define("widget.select", "PARENT", "PARENT", ecount.resource.LBL15035).option(optionData).end());
        contents.add(form);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var t = widget.generator.toolbar(),
            c = widget.generator.control();

        t.addLeft(c.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        t.addLeft(c.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(t);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },

    // Save button click event
    onFooterSave: function () {
        var self = this;
        if (self.viewBag.Permission.PermitTree.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var thisObj = this;
        var invalid = this.contents.validate();
        if (invalid.result.length > 0)
            return;

        var data = {
            CD_FROM: this.CD_Group,
            CD_TO: this.contents.getControl('PARENT').getValue(),
            CD_LIST: this.PCodes
        }

        ecount.common.api({
            url: "/Inventory/Basic/UpdateMoveItemsLocationLevelGroup",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {
                    thisObj.sendMessage(thisObj, {});
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            }
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F8: function () {
        this.onFooterSave();
    }
});
