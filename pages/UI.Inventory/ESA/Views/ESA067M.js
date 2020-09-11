window.__define_resource && __define_resource("MSG10122","MSG10033");
/**************************************************************************************************** 
1. Create Date : xxxx.xx.xx
2. Creator     : unknown
3. Description : unknown
4. Precaution  : 
5. History     : 
6. Old file    : unknown
* ***************************************************************************************************/
var $tree;

var _self = ecount.common.createViewModel("esa.esa067m", {
    domready: function () {
        require("jquery-ui", "ecount-popup", "jstree", function () {
            this.init.setDefaultOption();
            this.render.getdata(null, function () {
                if (_self._default.YN_USE == "Y")
                    CloseAll();
                else
                    ExtendAll();

                if (this.viewBag.DefaultOption.selectedCodes != null) {
                    //this.viewBag.DefaultOption.selectedCodes = decodeURIComponent(this.viewBag.DefaultOption.selectedCodes);
                    var selectedcodes = this.viewBag.DefaultOption.selectedCodes.split(ecount.delimiter);

                    for (var i = 0 ; i < selectedcodes.length; i++) {
                        $("#deptLevelTree").jstree(true).check_node(selectedcodes[i]);
                    }
                    closeDetail();
                }
            });

        }.bind(this));
    },
    init: {
        //기본값
        setDefaultOption: function () {
            $.extend(_self._default, this.viewBag.DefaultOption || {});
            _self._default.TYPE = this.viewBag.DefaultOption.Type == null ? "SEARCH" : this.viewBag.DefaultOption.Type.toUpperCase();
            _self._default.SEARCHVALUE = this.viewBag.DefaultOption.selectedCodes == null ? "" : this.viewBag.DefaultOption.selectedCodes;
            _self._default.YN_USE = (_self._default.TYPE.toUpperCase() == "CREATE" || _self._default.TYPE.toUpperCase() == "AUTH") ? "Y" : "N";
            $("#SearchText").val(_self._default.keyword).focus();
        },
    },
    render: {
        getdata: function (param, callback) {
            var _data = {
                CD_PARENT: 'ROOT',
                YN_USE: 'N'/*_self._default.YN_USE*/,
                SEARCHVALUE: _self._default.keyword
            }

            $.extend(_data, param || {});
            ecount.common.api({
                url: "/Account/Basic/GetSearchDepartmentLevelInfo",
                data: Object.toJSON(_data),
                success: function (msg) {
                    _self.action.maketree(msg.Data);
                    callback && callback();
                }
            });
        },
    },
    action: {
        maketree: function (nodedata) {
            if ($tree === undefined) {
                $tree = $("#deptLevelTree").jstree({
                    'core': {
                        'data': nodedata,
                        "check_callback": true,
                        "themes": { "icons": false }
                    },
                    "ui": {
                        "select_limit": this.viewBag.DefaultOption.isContainLevelGroup ? 1 : 30,
                    },
                    "checkbox": {
                        "three_state": false
                    },
                    "contextmenu": {
                        items: esa.esa067m.action.ctxmenu()
                    },
                    "plugins": ["checkbox", "wholerow"]//"contextmenu",, "dnd"  //
                });

                $tree.on('select_node.jstree', function (event, data) {

                    var parent = ecount.page.popup.prototype.getParentInstance.call({
                        popupType: this.viewBag.DefaultOption.popupType,
                        parentPageID: this.viewBag.DefaultOption.parentPageID
                    });

                    var check = parent.header.getControl("txtTreeDeptCd") || parent.contents.getControl("txtTreeDeptCd")
                    //하위그룹포함검색 체크
                    if (check.getCheckLabelStatus()) {
                        $("#deptLevelTree").jstree().settings.ui.select_limit = 1;
                    }
                    else {
                        $("#deptLevelTree").jstree().settings.ui.select_limit = 30;
                    }

                    var selectcnt = $('#deptLevelTree').jstree(true).get_selected(true).length;
                    var select_limit = $("#deptLevelTree").jstree().settings.ui.select_limit;

                    if (selectcnt <= select_limit) {
                        if (data.checked === false) {
                            openDetail(data.node.id, data.node.li_attr.hidtext);
                        }
                    }
                    else {
                        if (check.getCheckLabelStatus())
                            ecount.alert(this.viewBag.Resource.MSG10122);
                        else
                            ecount.alert(String.format(this.viewBag.Resource.MSG10033, 30));
                    }

                });
                $tree.on('exceed_limit.jstree', function (e, data) {

                    var parent = ecount.page.popup.prototype.getParentInstance.call({
                        popupType: this.viewBag.DefaultOption.popupType,
                        parentPageID: this.viewBag.DefaultOption.parentPageID
                    });

                    var check = parent.header.getControl("txtTreeDeptCd") || parent.contents.getControl("txtTreeDeptCd")
                    //하위그룹포함검색 체크
                    if (check.getCheckLabelStatus()) {
                        $("#deptLevelTree").jstree().settings.ui.select_limit = 1;
                    }
                    else {
                        $("#deptLevelTree").jstree().settings.ui.select_limit = 30;
                    }

                    var selectcnt = $('#deptLevelTree').jstree(true).get_selected(true).length;
                    var select_limit = $("#deptLevelTree").jstree().settings.ui.select_limit;

                    if (selectcnt < select_limit) {
                        $tree.jstree(true).select_nodespace(data.node, false, false, data);
                        //$tree.jstree(true).select_node(e, data);
                    }
                    else {
                        if (check.getCheckLabelStatus())
                            ecount.alert(this.viewBag.Resource.MSG10122);
                        else
                            ecount.alert(String.format(this.viewBag.Resource.MSG10033, 30));
                    }
                });
            }
            else
                $tree.jstree(true).settings.core.data = nodedata;

            $tree.jstree(true).deselect_all();
            $tree.jstree(true).refresh();


            if (nodedata.length == 1) {
                SendData(nodedata);
            }
        },
        ctxmenu: function (node) {
            // The default set of all items
            var items = {
                renameItem: { // The "rename" menu item
                    label: "Rename",
                    action: function () { alert('aa') }
                },
                deleteItem: { // The "delete" menu item
                    label: "Delete",
                    action: function () { alert('bb') }
                }
            };

            if ($(node).hasClass("folder")) {
                // Delete the "delete" menu item
                delete items.deleteItem;
            }

            return items;
        }
    },
    _default: {
        TYPE: null,
        SEARCHVALUE: null,
        YN_USE: null
    }
});


function openDetail(val, text) {
    $('.col-xs-12').removeClass('col-xs-12').addClass('col-xs-5')
    $('.col-xs-7').removeClass('hidden')

    var f = $("<form>"), obj1, obj2, obj3, obj4;
    var iframediv = $("<div>");
    var dialogIframe = $(".level-group-iframe");

    obj1 = $("<input type='hidden'>");
    obj2 = $("<input type='hidden'>");
    obj3 = $("<input type='hidden'>");
    obj4 = $("<input type='hidden'>");

    f.append(obj1.attr("name", "PCODE").val(val));
    f.append(obj2.attr("name", "Type").val(esa.esa067m._default.TYPE));
    f.append(obj3.attr("name", "PText").val(text));
    f.append(obj4.attr("name", "parentPageID").val("ESA067M"));
    f.attr("target", "ecframe1");
    f.attr("method", "post");
    f.attr("action", ecount.common.buildSessionUrl('ESA057M'));
    dialogIframe.append(f);
    f.submit();

    if (this.viewBag.DefaultOption.popupType === "window") {
        window.resizeTo(820, 600);
    }
    else {
        try {
            var dialog = ecount.parentFrame.$(".dialog");
            dialog.dialog("option", "width", 820);
            dialog.dialog("option", "height", 600);

        }
        catch (ex) {
        }
    }

}

function closeDetail() {
    $('.col-xs-5').removeClass('col-xs-5').addClass('col-xs-12');
    $('.col-xs-7').addClass('hidden');

    //window.resizeTo(450, 450);


    if (this.viewBag.DefaultOption.popupType === "window") {
        window.resizeTo(450, 450);
    }
    else {
        try {
            var dialog = ecount.parentFrame.$(".dialog");
            dialog.dialog("option", "width", 450);
            dialog.dialog("option", "height", 450);
            //dialog.dialog("open");
        }
        catch (ex) {

        }
    }

}

function SendData(data) {

    //강성훈 시작
    var parentTree = ecount.page.popup.prototype.getParentInstance.call({
        popupType: this.viewBag.DefaultOption.popupType,
        parentPageID: this.viewBag.DefaultOption.parentPageID
    });
    var check = parentTree.header.getControl("txtTreeDeptCd") || parentTree.contents.getControl("txtTreeDeptCd")

    if (check.getCheckLabelStatus()) {
        if ($('#deptLevelTree').jstree(true).get_selected(true).length > 1) {
            ecount.alert(this.viewBag.Resource.MSG10122);
            return;
        }
    }

    if (!check.getCheckLabelStatus()) {
        if ($('#deptLevelTree').jstree(true).get_selected(true).length > 30) {
            ecount.alert(String.format(this.viewBag.Resource.MSG10033, 30));
            return;
        }
    }
    //강성훈 종료

    var selectedNode = $('#deptLevelTree').jstree(true).get_selected(true);
    var nodes = new Array();

    if (selectedNode.length == 0) {
        var node = { CODE: null, CODE_DES: null };
        node.CODE = data[0].id;
        node.CODE_DES = data[0].li_attr.hidtext;
        nodes.push(node);
    }
    else {
        for (var i = 0, j = selectedNode.length; i < j ; i++) {
            var node = { CODE: null, CODE_DES: null };
            node.CODE = selectedNode[i].li_attr.id;
            node.CODE_DES = selectedNode[i].li_attr.hidtext;
            nodes.push(node);
        }
    }

    var param = this.viewBag.DefaultOption;
    if (param.popupType === "window") {
        var callback = opener.__ecOriginWindow[this.viewBag.DefaultOption.parentPageID].ecount.callback.repository[param.responseID] || opener.ecount.callback.repository[param.responseID];
    }
    else {
        var callback = ecount.parentFrame.__ecOriginWindow[this.viewBag.DefaultOption.parentPageID].ecount.callback.repository[param.responseID] || ecount.parentFrame.ecount.callback.repository[param.responseID];
    }
    var message = {
        name: "CODE_DES",
        code: "CODE",
        data: nodes,
        isAdded: false,
        addPosition: "current",
        callback: windowClose
    };

    callback && callback(this, message);
    //}
}

function ExtendAll() {
    $("#deptLevelTree").jstree(true).open_all();
}

function CloseAll() {
    $("#deptLevelTree").jstree(true).close_all();
}

function windowClose() {
    if (this.viewBag.DefaultOption.popupType === "window") {
        this.close()
    }
    else {
        parent.$(".dialog").dialog("close");
    }

}

function FnTreeSearch() {
    if (event.keyCode == 13)
        FnTreeClick();
}

function FnTreeClick() {
    var param = {
        SEARCHVALUE: $("#SearchText").val()
    }

    esa.esa067m.render.getdata(param);
}