window.__define_resource && __define_resource("LBL08409","LBL05100","BTN00553","LBL02736","LBL02722","LBL08288","BTN00065","BTN00008","LBL02987");
/****************************************************************************************************
1. Create Date : 2015.04.10
2. Creator     : 노지혜
3. Description : 재고>기초등록>품목등록 > 안전재고수량> 창고별지정> 창고별안전재고등록
4. Precaution  :
5. History     : 2015.10.25 전영준, 저장 로직, 일괄적용 추가 개발
                 2019.05.02 (이현택) : 창고별안전재고등록 저장 3.0 호출
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_12", { 

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {

        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PROD_CD: this.PROD_CD
        }
        this.permitProd = this.viewBag.Permission.prod;
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
        header.setTitle(resource.LBL08409)
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

 
        var generator = widget.generator,
            toolbar1 = generator.toolbar(),
            toolbar2 = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
            titleData = (function () {
                var title = { prodCd: "", prodDes: "" }
                 if (this.viewBag.InitDatas.SafetyStockbyLocationLoad1.length) {
                     title.prodCd = this.searchFormParameter.PROD_CD;
                     title.prodDes = this.viewBag.InitDatas.SafetyStockbyLocationLoad1[0].PROD_DES;
                 }
                 return title;
            }.bind(this))();
        //툴바
        toolbar1
             .addLeft(ctrl.define("widget.label").label(resource.LBL05100 + ": " + titleData.prodDes + "[" + titleData.prodCd + "]"))
      
        toolbar2
             .addRight(ctrl.define("widget.input", "Applied").numericOnly(8,0))
             .addRight(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00553))

        settings
            .setEditable(true, 0, 0)
            .setRowData(this.viewBag.InitDatas.SafetyStockbyLocationLoad2[0])
            .setRowDataParameter(this.searchFormParameter)
            .setRowDataUrl('/Inventory/Basic/GetListSafetyStockbyLocation')
                
            .setColumns([
                { propertyName: 'WH_CD', id: 'WH_CD', title: resource.LBL02736, width: 120, editable: false },
                { propertyName: 'WH_DES', id: 'WH_DES', title: resource.LBL02722, width: 120, editable: false },
                { propertyName: 'SAFE_QTY', id: 'SAFE_QTY', title: resource.LBL08288, width: 120, controlType: 'widget.input.number', align: 'right', dataType: '90', controlOption: { maxLength: 8 } }  //정수만입력되도록!
            ])
        contents
            .add(toolbar1)
            .add(toolbar2)
            .addGrid("dataGrid", settings);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************


    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl("Applied").setFocus(0);
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {      
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    onContentsApply: function(){
    
        var applied = this.contents.getControl('Applied').getValue(),
            grid = this.contents.getGrid().grid;
            rowList = grid.getRowList();
        for (var i = 0, limit = rowList.length ; i < limit; i++) {
            var row = rowList[i];
            this.contents.getGrid().grid.setCell("SAFE_QTY", row[ecount.grid.constValue.keyColumnPropertyName], applied);
        }
    },
    //저장버튼
    onFooterSave: function (e) {

        // 권한체크
        if (this.EditFlag == "M") {  // 수정 저장은 모든 권한이 있을때만 가능
            if (this.viewBag.Permission.prod.Value != "W") {
                var msgdto = ecount.common.getAuthMessage("", [{
                    MenuResource: ecount.resource.LBL02987, PermissionMode: "U"
                }]);
                ecount.alert(msgdto.fullErrorMsg);              
                return;
            }
        }

        if (!this.viewBag.Permission.prod.CW) {
            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: ecount.resource.LBL02987, PermissionMode: "W"
            }]);
            ecount.alert(msgdto.fullErrorMsg);          
            return;
        }

        var datas = this.contents.getGrid().grid.getRowList();
        datas.forEach(function (item) {
            item.SAFE_QTY = item.SAFE_QTY || "0";
        })

        var formData = Object.toJSON({
            safeDetail: Object.values(datas),
            PROD_CD: this.PROD_CD
        });

        //var formData = Object.toJSON({
        //    safeDetail: Object.values(this.contents.getGrid().grid.getRowList()),
        //    PROD_CD: this.PROD_CD
        //});
        
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateSafetyStockbyLocation",
            async: false,
            data: formData,
            success: function (result) {

                    var message = {   //부모전달시 확인
                        name: "",
                        code: "",
                        data: formData,
                        isAdded: "",
                        addPosition: "next",
                        callback: this.close.bind(this)
                    };
                this.sendMessage(this, message);
                //this.contents.getGrid().draw(this.searchFormParameter);
                //window.setTimeout(function () {
                //    this.close();
                //}.bind(this), 0);
            }.bind(this)
        });
    },
    //닫기버튼
    onFooterClose: function () {
  
        this.close();
        return false;
    },
    /**********************************************************************
    *  event listener  ==>  [grid]
    **********************************************************************/

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        this.onContentsApply();
    },
  
});
