window.__define_resource && __define_resource("LBL06838","LBL03638");
/****************************************************************************************************
1. Create Date : 2018.04.07
2. Creator     : 임명식
3. Description : 재고1>기초등록>품목등록>변경항목 선택
4. Precaution  :
5. History     : 2019.04.05 (PhiVo): A19_00126-거래유형별 부가세등록시 이력 잘 쌓이도록
                 2019.04.11 (PhiVo): fix dev #22190
****************************************************************************************************/
ecount.page.factory("ecount.page.selectedItem", "ESA010P_15", {
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        var _lengthFixedCheckColumns = this.viewBag.FormInfos.FixedCheckColumns ? this.viewBag.FormInfos.FixedCheckColumns.length : 0;
        this.maxCount = Math.min(50, this.viewBag.FormInfos.Columns.length - _lengthFixedCheckColumns);

        var tt = this.viewBag.FormInfos.Columns.find(function (column) { return column.id.toUpperCase() == "EXCH_DENO" });
        if (tt != null) {
            tt.title = String.format(ecount.resource.LBL06838, ecount.config.inventory.UQTY_DES);
        };

        this.initProperties(options);
    },

    render: function ($parent) {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        header
            .setTitle(ecount.resource.LBL03638)
            .notUsedBookmark();
    },

    onInitContents: function (contents) {
        var controls = this._super.onInitContents.apply(this); /*contents를 알수 없어서 공통 페이지에서 받아온다.*/
        
        contents.add(controls.toolbar)
                .addGrid("dataGrid", controls.grid); /*공통 내부에서 grid의 id는 "dataGrid"로 사용하기 때문에, 이름을 바꾸면 안됨.*/
    },

    onInitFooter: function (footer) {
        var controls = this._super.onInitFooter.apply(this); /*공통페이지를 호출한다. footer를 알수 없어서 받아온다.*/
        footer.add(controls.toolbar);
    }
});
