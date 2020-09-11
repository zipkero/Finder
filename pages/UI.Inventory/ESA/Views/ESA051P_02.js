﻿window.__define_resource && __define_resource("BTN00226","LBL08017","LBL00754","BTN00065","BTN00008","LBL07309");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator     : Nguyen Anh Tuong
3. Description : Move location level group to another tree node on tree.
                 재고1 > 기초등록 > 창고등록 > 계층그룹 > 왼쪽 페이지 > Fn > 계층그룹 이동
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                                    - Modify sendMessage function
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA051P_02", {
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
        header.setTitle(ecount.resource.BTN00226);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var self = this;
        var generator = widget.generator,
            ctrl = generator.control(),
            form = generator.form();
        this.codeClass = this.custGroupCodeClass;

        var opts = [];
        opts.push(["ROOT", "root"]);

        var lst = self.viewBag.InitDatas.locations;
        if (lst != null && lst != undefined) {
            lst.forEach(function (o) {
                opts.push([o.CD_GROUP, "[" + o.CD_GROUP + "] " + o.NM_GROUP]);
            });
        }

        form.template("register")
            .add(ctrl.define("widget.select", "PARENT", "PARENT", ecount.resource.LBL08017).option(opts).end())
            .add(ctrl.define("widget.label", "Code", "Code", ecount.resource.LBL00754).label("[" + this.PCode + "] " + this.PText).end());
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
            CD_GROUP: this.PCode,
            CD_PARENT: this.contents.getControl('PARENT').getValue()
        }
            
        ecount.common.api({
            url: "/Inventory/Basic/UpdateMoveLocationLevelGroup",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {                   
                    thisObj.sendMessage(thisObj, { keyword: '' });
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
