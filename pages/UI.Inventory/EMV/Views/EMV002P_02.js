window.__define_resource && __define_resource("BTN00113","LBL00381","LBL03017","LBL00359","LBL03004","LBL12489","LBL00926","LBL08629","MSG02158","BTN00204","BTN00008","MSG06899","LBL06464","LBL02495","LBL02402","MSG07295","MSG07296","MSG00213","LBL35334","BTN00081","MSG09786","LBL07553","BTN00315","BTN00644","LBL93736","MSG01778","LBL08396","LBL09077","LBL08831","LBL07880","LBL07879","LBL02072");
/****************************************************************************************************
1. Create Date : 2017.04.12
2. Creator     : 양미진
3. Description : 재고/회계 > 기초등록 > 거래처등록 > 리스트 > 연간미사용코드
						재고 > 기초등록 > 품목등록 > 리스트 > 연간미사용코드
4. Precaution  : 
5. History     :  2017.12.05 (Hao) Connect All-In-One II to NF
				  2018.03.21(양미진) - Dev. Progress 7820 품목 연간미사용코드 정렬수정
                  2018.08.13(VuThien): fix error with sort and search with update balance
                  2019.03.13 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                  2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "EMV002P_02", {
	/********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
	formTypeCode: '',                                      // 리스트폼타입
	canCheckCount: 100,                                         // 체크 가능 수 기본 100
	formInfoData: null,                                         // 리스트 양식정보
	finalSearchParam: null,
	finalHeaderSearch: null,                                    // 검색 시 검색 컨트롤 정보 (퀵서치)

	/**********************************************************************
    *  page init
    **********************************************************************/
	init: function (options) {
		this._super.init.apply(this, arguments);
		this.initProperties();

		if (this.isShowSearchForm == null) {    // [1: 열림(OPEN), 2:닫힘(CLOSE), 3:없음(NONE)]
			this.isShowSearchForm = "2";
		}

		if (this._userParam != undefined) {
			this.isShowSearchForm = this._userParam.isShowSearchForm;
		}

		//==================== 기초정보 설정 START====================
		this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];
		//==================== 기초정보 설정 END====================

		// 거래처 조회의 기본 Parameter Object
		this.defaultSearchParameter = {
			FORM_TYPE: this.formTypeCode,                      // 양식타입
			FORM_SER: 1,                                       // 양식번호
			PAGE_SIZE: this.formInfoData.option.pageSize,      // PasingSize
			PAGE_CURRENT: 1,                                   // 보여질 페이지번호
			PARAM: '',                                         // 추가 Parameter
			SORT_COLUMN: this.Type == "Customer" ? 'CUST.CUST_NAME' : 'PROD_CD',                          // 정렬할 기준컬럼
			SALE_DATE: ecount.config.inventory.SALE_DATE,
			ACCT_DATE: ecount.config.account.ACCT_DATE
		};
	},

	initProperties: function () {
		this.finalSearchParam = { PARAM: '' }                           // 검색 시 정보

		if (this.Type == "Customer") {
			this.formTypeCode = "SR910";
		} else {
			this.formTypeCode = "SR900";
		}
	},

	/**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
	//헤더 옵션 설정
	onInitHeader: function (header) {
		var g = widget.generator,
           contents = g.contents(),
           toolbar = g.toolbar(),
		   form = g.form(),
           ctrl = g.control();

		toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "Search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113));

		form.add(ctrl.define("widget.input.search", "CODE", "CODE", this.Type == "Customer" ? ecount.resource.LBL00381 : ecount.resource.LBL03017).end())
		form.add(ctrl.define("widget.input.search", "DES", "DES", this.Type == "Customer" ? ecount.resource.LBL00359 : ecount.resource.LBL03004).end())
		form.add(ctrl.define("widget.radio", "YEAR", "YEAR", ecount.resource.LBL12489).value(["1", "2", "3"]).label(["1" + ecount.resource.LBL00926, "2" + ecount.resource.LBL00926, "3" + ecount.resource.LBL00926]).select("1").end())
		
		contents.add(form).add(toolbar);
		
		header.useQuickSearch();

		header
			.notUsedBookmark()
			.setTitle(ecount.resource.LBL08629)
            .add("search", null, false)
            .addContents(contents);

	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var g = widget.generator,
            grid = g.grid();

		if (this.Type == "Customer") {
			grid
				.setRowData(this.viewBag.InitDatas.LoadData)
				.setRowDataUrl('/Account/Basic/GetListCustYearlyUnusedCodes')
				.setRowDataParameter(this.finalSearchParam)
				.setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
				.setKeyColumn(['BUSINESS_NO'])
				.setColumnFixHeader(true)
				.setCheckBoxUse(true)
				.setCheckBoxMaxCount(this.canCheckCount)
				.setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(self.ecount.resource.MSG02158, maxcount)) })
				.setPagingUse(true)
				.setColumnSortable(true)
				.setEventFocusOnInit(true)                  //Focus 이벤트 시작
				.setKeyboardCursorMove(true)                // 위, 아래 방향키
				.setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
				.setKeyboardEnterForExecute(true)
				.setColumnSortExecuting(this.setGridSort.bind(this))
				.setColumnSortDisableList(['cust.cancel', 'cust.com_code', 'cust.remarks', 'mem.remarks', 'cust.file', 'cust.detail'])
				.setCustomRowCell('cust.file', this.setGridFile.bind(this))                // 파일관리
				.setCustomRowCell('cust.remarks', this.setGridRemarks.bind(this))           // 적요
				.setCustomRowCell('cust.detail', this.setGridDetail.bind(this))             // 상세내역
				.setCustomRowCell('cust.com_code', this.setGridComCode.bind(this))          // 통장등록
				.setCustomRowCell('cust.business_no', this.setGridBusinessNo.bind(this))   // 거래처코드
				.setEventShadedColumnId(['cust.file', 'cust.detail', 'cust.com_code', 'cust.business_no'], false);
		} else {
			grid
				.setRowData(this.viewBag.InitDatas.LoadData)
				.setRowDataUrl('/Inventory/Basic/GetListSale003YearlyUnusedCodes')
				.setRowDataParameter(this.finalSearchParam)
				.setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
				.setKeyColumn(['PROD_CD'])
				.setColumnFixHeader(true)
				.setCheckBoxUse(true)
				.setCheckBoxMaxCount(this.canCheckCount)
				.setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(self.ecount.resource.MSG02158, maxcount)) })
				.setPagingUse(true)
				.setColumnSortable(true)
				.setEventFocusOnInit(true)                  //Focus 이벤트 시작
				.setKeyboardCursorMove(true)                // 위, 아래 방향키
				.setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
				.setKeyboardEnterForExecute(true)
				.setColumnSortExecuting(this.setGridSort.bind(this))
				.setColumnSortDisableList(['sale003.del_gubun', 'sale003.com_code', 'sale003_img.prod_img'])
				.setCustomRowCell('sale003.prod_cd', this.setGridItemProdCd.bind(this)) // 품목코드
				.setCustomRowCell('sale003.com_code', this.setGridItemFileMgr.bind(this)) // 파일관리
				.setCustomRowCell('sale003.detail', this.setGridItemDetail.bind(this)) // 상세내역
				.setCustomRowCell('sale003_img.prod_img', this.setGridImage.bind(this)) // 이미지
				.setCustomRowCell('SALE003.ITEM_TYPE', this.setGeridItemBMYN.bind(this)) // 관리항목
				.setCustomRowCell('SALE003.SERIAL_TYPE', this.setGeridItemBMYN.bind(this)) // 상세내역    
				.setCustomRowCell('SALE003.PROD_SELL_TYPE', this.setGeridItemBYN.bind(this))
				.setCustomRowCell('SALE003.PROD_WHMOVE_TYPE', this.setGeridItemBYN.bind(this))
				.setCustomRowCell('SALE003.QC_BUY_TYPE', this.setGeridItemBYN.bind(this))
				.setCustomRowCell('sale003.qc_yn', this.setGeridItemBYN.bind(this));
		}

		contents.addGrid("dataGrid", grid);
	},

	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

		toolbar.addLeft(ctrl.define("widget.button", "deactivate").label(ecount.resource.BTN00204).clickOnce().end());
		toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
		toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));

		footer.add(toolbar);
	},

	/**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
	onLoadComplete: function (e) {
		this._super.onLoadComplete.apply(this, arguments);

		if (this._userParam) {    // 다른 페이지 이동 후 돌아올때(When you come back after moving to another page)
			if (this._userParam.C_param.PARAM != "") {
				this.defaultSearchParameter.PARAM = this._userParam.C_param.PARAM;
			}
		}

		if (!e.unfocus) {
			this.header.getQuickSearchControl().setFocus(0);
		}
	},

	onGridRenderComplete: function (e, data) {
		this._super.onGridRenderComplete.apply(this, arguments);
		
		if (!e.unfocus) {
			this.header.getQuickSearchControl().setValue(this.finalSearchParam.PARAM);
			this.header.getQuickSearchControl().setFocus(0);
		}
	},

	// OnInitContents 후에 실행(맨처음 로딩 될때 한번만 실행됨)
	onGridRenderBefore: function (gridId, settings) {
		var self = this;

		this.setGridParameter(settings); //파라미터 세팅

		settings.setPagingIndexChanging(function (e, data) {
			//페이징변환시 퀵서치검색값 유지되어야함
			self.header.getQuickSearchControl().setValue(self.finalSearchParam.PARAM);
			self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
			self.contents.getGrid("dataGrid").grid.render();
		});
	},

	// Message Handler for popup
	onMessageHandler: function (page, message) {
		if (page.pageID == "SummaryChk" || page.pageID == "SummaryChkAcct") {
		    this.dataSearch();
		} 

		message.callback && message.callback();  // The popup page is closed   
	},

	//검색
	onHeaderSearch: function (forceHide) {
		var _self = this;
		var _chkSummary = {
			MenuType: this.Type == "Customer" ? "A" : "S" // 회계(A), 재고(S), 미청구(P)
		};
		var _configDate = this.Type == "Customer" ? ecount.config.account.ACCT_DATE.substring(0, 6).toString() : ecount.config.inventory.SALE_DATE.substring(0, 6).toString();
		var _nowDate = new Date();
		var _firstDayOfMonth = new Date(_nowDate.getFullYear(), _nowDate.getMonth(), 1);

		if (this._userParam) {
			if (this._userParam.C_param.PARAM != "") {
				this.header.getQuickSearchControl().setValue(this._userParam.C_param.PARAM);
				this.finalSearchParam = this._userParam.C_param;
			}
		} else {
			this.finalSearchParam.PARAM = "";
		}

		if (this.viewBag.InitDatas.PreDate.substring(0, 6).toString() > _configDate) {
			ecount.common.api({
				url: "/Common/Infra/CheckSummary",
				data: Object.toJSON(_chkSummary),
				success: function (result) {
					if (result.Data.RESULT_YN == "N") {
						ecount.customAlert(String.format(ecount.resource.MSG06899, result.Data.SUMMARY_MINUTE, result.Data.SUMMARY_DATE),
                            {
                            	list: [
								  {
								  	label: ecount.resource.LBL06464,
								  	callback: _self.clickSearch.bind(_self)
								  },
								  {
								  	label: ecount.resource.BTN00008,
								  	callback: function () {
								  	}.bind(_self)
								  }
                            	]
                            });
					} else {
						var options = {
							url: _self.Type == "Customer" ? "/ECERP/ECM/SummaryChkAcct" : "/ECERP/ECM/SummaryChk",
							name: _self.Type == "Customer" ? ecount.resource.LBL02495 : ecount.resource.LBL02402,
							param: {
								Base_Form_Date: _self.viewBag.InitDatas.PPreDate,
								Base_To_Date: _self.viewBag.InitDatas.PPreDate,
								FlagFormID: "",
								Summary_Flag: _self.Type == "Customer" ? "A" : "S",
								EnableCheckMonthsAgo: 0,
								Inventory_Flag: _self.Type == "Customer" ? "0" : "1",
								Account_Flag: _self.Type == "Customer" ? "1" : "0",
								width: 650,
								height: 350,
								modal: true
							}
						};
						_self.openWindow(options);
					}
				}
			});
		} else {
			if (_self.dataSearch()) {
				if (!_self._userParam) _self.header.toggle(forceHide);
			}

			_self.contents.getGrid().grid.clearChecked();
		}
	},

	clickSearch: function () {
		var _self = this;

		if (_self.dataSearch()) {
			if (!_self._userParam) _self.header.toggle(forceHide);
		}

		_self.contents.getGrid().grid.clearChecked();
	},

	// quick Search button click event
	onHeaderQuickSearch: function (e) {
		var grid = this.contents.getGrid("dataGrid");
		var _self = this;
		var _chkSummary = {
			MenuType: this.Type == "Customer" ? "A" : "S" // 회계(A), 재고(S), 미청구(P)
		};
		var _configDate = this.Type == "Customer" ? ecount.config.account.ACCT_DATE.substring(0, 6).toString() : ecount.config.inventory.SALE_DATE.substring(0, 6).toString();
		var _nowDate = new Date();
		var _firstDayOfMonth = new Date(_nowDate.getFullYear(), _nowDate.getMonth(), 1);

		if (this.viewBag.InitDatas.PreDate.substring(0, 6).toString() > _configDate) {
			ecount.common.api({
				url: "/Common/Infra/CheckSummary",
				data: Object.toJSON(_chkSummary),
				success: function (result) {
					if (result.Data.RESULT_YN == "N") {
						ecount.customAlert(String.format(ecount.resource.MSG06899, result.Data.SUMMARY_MINUTE, result.Data.SUMMARY_DATE),
                            {
                            	list: [
								  {
								  	label: ecount.resource.LBL06464,
								  	callback: _self.clickSearch.bind(_self)
								  },
								  {
								  	label: ecount.resource.BTN00008,
								  	callback: function () {
								  	}.bind(_self)
								  }
                            	]
                            });
					} else {
						var options = {
							url: _self.Type == "Customer" ? "/ECERP/ECM/SummaryChkAcct" : "/ECERP/ECM/SummaryChk",
							name: _self.Type == "Customer" ? ecount.resource.LBL02495 : ecount.resource.LBL02402,
							param: {
								Base_Form_Date: _self.viewBag.InitDatas.PPreDate,
								Base_To_Date: _self.viewBag.InitDatas.PPreDate,
								FlagFormID: "",
								Summary_Flag: _self.Type == "Customer" ? "A" : "S",
								EnableCheckMonthsAgo: 0,
								Inventory_Flag: _self.Type == "Customer" ? "0" : "1",
								Account_Flag: _self.Type == "Customer" ? "1" : "0",
								width: 650,
								height: 350,
								modal: true
							}
						};
						_self.openWindow(options);
					}
				}
			});
		} else {
			this.header.lastReset(this.finalHeaderSearch);
			this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
			this.contents.getGrid().grid.removeShadedColumn();
			this.contents.getGrid().grid.clearChecked();
			grid.getSettings().setPagingCurrentPage(1); //Paging Page 1
			grid.draw(this.finalSearchParam);
		}
	},

	/********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
	// grid parameter setting 
	setGridParameter: function (settings) {
		var searchParam = { PARAM: '' };

		// Grid Setting & Search        
		if (this._userParam != undefined) {
			settings.setPagingCurrentPage(this._userParam.C_CurrentPage);
			if (this._userParam.C_param != "") {
				searchParam = this._userParam.C_param;
			}
		} else {
			settings.setPagingCurrentPage(1); //Paging Page 1
			searchParam = $.extend({}, this.defaultSearchParameter, this.header.serialize().result);
			searchParam.PARAM = this.finalSearchParam.PARAM;
		}

		//그리드 상단 오른쪽  right of top 
		this.header.getQuickSearchControl().setValue(searchParam.PARAM);

		settings
            .setHeaderTopMargin(this.header.height())
            .setRowDataParameter(searchParam);

		// 조회 당시 컨트롤 정보
		this.finalHeaderSearch = this.header.extract(true).merge();

		this.finalSearchParam = searchParam;
	},

	/********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
	//Deactivate(사용중단)
	onFooterDeactivate: function (e) {
		var _self = this;
		var btnDeactivate = this.footer.get(0).getControl("deactivate");
		var confirmResource = this.Type == "Customer" ? String.format(ecount.resource.MSG07295, this.header.getControl("YEAR").getValue()) : String.format(ecount.resource.MSG07296, this.header.getControl("YEAR").getValue());
		var selectItem = this.contents.getGrid().grid.getChecked();
		self.selectedCnt = selectItem.length;

		if (self.selectedCnt == 0) {
			ecount.alert(ecount.resource.MSG00213);
			btnDeactivate.setAllowClick();
			return;
		}
		
		ecount.confirm(confirmResource, function (status) {
			if (status === false) {
				btnDeactivate.setAllowClick();
				return;
			}

			var selectdata = [];

			$.each(selectItem, function (i, val) {
				selectdata.push({
					BASIC_CODE: _self.Type == "Customer" ? val.BUSINESS_NO : val.PROD_CD,
					MENU_TYPE: _self.Type,
					CANCEL_YN: "Y",
					PROD_FLAG: ""
				});
			});

            var formdata = {
                Request: {
                    Data:  selectdata                
                }			
			};

			ecount.common.api({
				url: "/SVC/Common/Infra/UpdateYearlyUnusedCodesDeactivate",
                data: Object.toJSON(
                    {
                        Request: {
                            Data: { Data : selectdata }
                        }                    
                    }
                ),
				success: function (result)
				{
					if (result.Status != "200") {
						ecount.alert(result.fullErrorMsg + result.Data);
					} else {
						_self.sendMessage(_self, {});
						_self.contents.getGrid().draw(_self.finalSearchParam);
					}
				},
				complete: function (e) {
					btnDeactivate.setAllowClick();
				}
			});
		});
	},

	//Close(닫기)
	onFooterClose: function (e) {
		this.close();
	},

	/********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
	ON_KEY_F8: function () {
		this.onHeaderSearch();
	},

	// ENTER
	ON_KEY_ENTER: function (e, target) {
		// Set focus for Save button
		if (target != null && target.cid == "Search") {
			this.onHeaderSearch();
		}
	},

	/**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/
	//정렬 (Sort)
	setGridSort: function (e, data) {
		this.header.toggle(true);

		this.finalSearchParam.SORTCOL_INDEX = Number(data.propertyName.replace("A", "")) + 1;
	    // 컬럼 숫자만 리턴(Only returns the column number)
		if (this.Type == "Customer")
		    this.finalSearchParam.SORT_COLUMN = data.columnId;
	    else 
            this.finalSearchParam.SORT_COLUMN = "A" + (Number(data.propertyName.replace("A", ""))).toString();

		this.finalSearchParam.SORT_TYPE = data.sortOrder;

		this.contents.getGrid().draw(this.finalSearchParam);
	},

	setGridBusinessNo: function (e) {
		var option = [];

		option.data = e.BUSINESS_NO;
		option.controlType = "widget.link";

		option.event = {
			'click': function (e, data) {
				this.OpenCustRegisterPopup(data.rawRowItem.BUSINESS_NO);
			}.bind(this)
		}

		return option;
	},

	OpenCustRegisterPopup: function (_businessNo) {
		var param = {
			width: 850,
			height: 630,
			cust: _businessNo ? _businessNo : ''

		}
		this.openWindow({
			url: "/ECERP/ESQ/ESQ501M",
			name: ecount.resource.LBL35334,
			param: param
		});

	},

	//파일(file)
    setGridFile: function (value, rowItem) {
		var option = [];
		var self = this;
		option.data = ecount.resource.BTN00081;
		option.controlType = "widget.link";
		if (rowItem.FILE_CNT != "0") {
			option.attrs = {
				'class': ['text-warning-inverse']
			};
		}

        option.event = {
            'click': function (e, data) {
                //var locationAllow = ecount.infra.getGroupwarePermissionByAlert(self.viewBag.InitDatas.GroupwarePermission)
                //                                .Excute();

                //if (locationAllow) {
                if ($.isEmpty(data.rowItem["CUST_IDX"])) {
                    ecount.alert(ecount.resource.MSG09786);
                    return false;
                }
                var param = {
                    width: 780,
                    height: 600,
                    BOARD_CD: 7001,
                    custCdAllInOne: data.rowItem["CUST_IDX"],
                    custDesAllInOne: data.rowItem["CUST_DES"],
                    TITLE: "[" + data.rowItem["BUSINESS_NO"].replace("\"", "＂") + "] " + data.rowItem["CUST_NAME"],
                    isFileManage: true
                };

                this.openWindow({
                    //url: "/ECMAIN/ESA/ESA009P_04.aspx?b_type=A01&code=" + data.rowItem["BUSINESS_NO"].replace("\"", "＂") + "&code_des=" + encodeURIComponent(data.rowItem["CUST_NAME"]),
                    //name: 'ESA009P_04',
                    url: "/ECERP/EGM/EGM024M",
                    name: ecount.resource.LBL07553,
                    param: param,
                    popupType: false,
                    fpopupID: self.ecPageID
                });
                //}
            }.bind(this)
        }

		return option;
	},

	//적요
	setGridRemarks: function (rowItem) {
		rowItem.replace('\n', '<br>');
	},

	//상세내역
	setGridDetail: function (rowItem) {
		var option = [];
		var self = this;
		option.data = ecount.resource.BTN00315;
		option.controlType = "widget.link";

		option.event = {
			'click': function (e, data) {
				if (self.viewBag.Permission.cust_All.Value.equals("W")) {
					var param = {
						width: 800,
						height: 600
					};

					this.openWindow({
						url: "/ECMAIN/ESQ/ESQ501M.aspx?cust=" + data.rowItem["BUSINESS_NO"] + "&SDate=" + this.baseDateFrom + "&EDate=" + this.baseDateTo + "&CustEditType=ALL_IN_ONE_SEARCH",
						name: 'ESQ501M',
						param: param,
						popupType: true,
						fpopupID: self.ecPageID
					});
				} else {
					var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL35334, PermissionMode: "X" }]);
					ecount.alert(msgdto.fullErrorMsg);
					return;
				}
			}.bind(this)
		}

		return option;
	},

	//통장등록
	setGridComCode: function (rowItem) {
		var option = [];

		option.data = ecount.resource.BTN00644;
		option.controlType = "widget.link";

		if (rowItem == "btn_yellowS") {
			option.attrs = {
				'class': ['text-warning-inverse']
			};
		}

		option.event = {
			'click': function (e, data) {
				var param = {
					width: 800,
					height: 450,
					custNo: data.rowItem['BUSINESS_NO']
				};

				this.openWindow({
					url: '/ECERP/ESA/ESA001P_05',
					name: 'ESA001P_05',
					param: param,
					popupType: false,
					additional: true
				});
			}.bind(this)
		}

		return option;
	},

	dataSearch: function (e) {
		var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;

		// search parameter setting
		this.setGridParameter(settings);
		gridObj.draw(this.finalSearchParam);

		this.header.toggle(true);
	},

	// 품목등록창 오픈
	openItemReg: function (inValue) {
		var param = {
			width: 800,
			height: 600,
			PROD_CD: inValue.PROD_CD

		}

		this.openWindow({
			url: "/ECERP/ESQ/ESQ503M",
			name: ecount.resource.LBL93736,
			param: param
		});
	},

	// 품목코드 click
	setGridItemProdCd: function (value, rowItem) {
		var option = [];
		var self = this;
		option.controlType = "widget.link";
		option.event = {
			'click': function (e, data) {
				if (data.rowItem.PROD_CD == data.rowItem.G_PROD_CD) {
					if (ecount.config.inventory.PROC_FLAG != "Y") {
						ecount.alert(ecount.resource.MSG01778);
						return false;
					}
				}

				self.cProdCd = data.rowItem['PROD_CD'];

				var grid = self.contents.getGrid().grid;
				var prevClickedRowId = self.clickedRowId;
				self.clickedRowId = data.rowKey;

				// invers attr delete
				if (prevClickedRowId) {
					grid.refreshCell(data.columnId, prevClickedRowId);
				};
				// invers attr insert 
				grid.refreshCell(data.columnId, self.clickedRowId);

				var param = "";
				var ProdCd = data.rowItem.PROD_CD;
				var GProdCd = data.rowItem.G_PROD_CD;

				param = {
					isMultiProcess: (ProdCd == GProdCd) ? true : false,
					EditFlag: "M",
					isSaveContentsFlag: false,   // 저장유지버튼 사용여부
					PROD_FLAG: (ProdCd == GProdCd) ? "G" : "S",
					PROD_CD: ProdCd
				}

				this.openItemReg(param);

				e.preventDefault();

			}.bind(this)
		}

		if (this._userParam != undefined) {
			if (this._userParam.cProdCd == (rowItem['PROD_CD'])) {
				option.attrs = {
					'class': ['text-primary-inverse']
				};
				this.cProdCd = this._userParam.cProdCd;
			}
		}
		else {
			if (this.cProdCd == (rowItem['PROD_CD'])) {
				option.attrs = {
					'class': ['text-primary-inverse']
				}
			};
		};

		return option;
	},

	// 파일(file) click
    setGridItemFileMgr: function (value, rowItem) {
		var option = [];
		option.data = ecount.resource.BTN00081;
		option.controlType = "widget.link";
        if (rowItem.FILE_CNT != "0") {
			option.attrs = {
				'class': ['text-warning-inverse']
			};
		}
		option.event = {
			'click': function (e, data) {
				//var locationAllow = ecount.infra.getGroupwarePermissionByAlert(this.viewBag.InitDatas.GroupwarePermission).Excute();
				//if (locationAllow) {
					var param = {
						width: 780,
                        height: 600,
                        BOARD_CD: 7000,
                        isFileManage: true,
                        prodCdAllInOne: data.rowItem["PROD_CD"],
                        prodDesAllInOne: data.rowItem["PROD_DES"]
					};
					this.openWindow({
						//url: "/ECMain/ESA/ESA009P_04.aspx?b_type=S01&code=" + encodeURIComponent(data.rowItem.PROD_CD) + "&code_des=" + encodeURIComponent(data.rowItem.PROD_DES),
                        url: "/ECERP/EGM/EGM024M",
						name: 'ESA009P_04',
						param: param,
						popupType: false
					});
				//}
			}.bind(this)
		}
		return option;
	},

	// 기본설정, 필수입력, 선택입력, 사용안함
	setGeridItemBMYN: function (value, rowItem) {
		var option = [];
		if (value == "B") option.data = ecount.resource.LBL08396;
		else if (value == "M") option.data = ecount.resource.LBL09077;
		else if (value == "Y") option.data = ecount.resource.LBL08831;
		else if (value == "N") option.data = ecount.resource.LBL07880;
		return option;
	},

	// 기본설정, 사용, 사용안함
	setGeridItemBYN: function (value, rowItem) {
		var option = [];
		if (value == "B") option.data = ecount.resource.LBL08396;
		else if (value == "Y") option.data = ecount.resource.LBL07879;
		else if (value == "N") option.data = ecount.resource.LBL07880;
		return option;
	},

	// 상세보기 click
	setGridItemDetail: function (value, rowItem) {
		var option = [];
		option.data = ecount.resource.BTN00315;
		option.controlType = "widget.link";
		option.event = {
			'click': function (e, data) {
				var param = {
					width: 800,
					height: 700,
					PROD_CD: encodeURIComponent(data.rowItem.PROD_CD),
					ProdEditType: "ALL_IN_ONE_SEARCH"
				};
				this.openWindow({
					url: "/ECErp/ESQ/ESQ503M",
					name: 'ESA009P_04',
					param: param,
					popupType: false
				});
			}.bind(this)
		}
		return option;
	},

	// 이미지 링크 click
	setGridImage: function (value, rowItem) {
		var option = {};
		if (!$.isNull(rowItem.ATTACH_INFO) && !$.isNull(rowItem.FS_OWNER_KEY)) {
			option.data = rowItem.FILE_FULLPATH;
			option.controlType = "widget.thumbnailLink";
		}
		else {
			option.data = '';
			option.controlType = "widget.link";
		}
		option.dataType = "1";
		option.event = {
			'click': function (e, data) {
			    var param = {
			        width: 400,
			        height: 420,
			        PROD_CD: data.rowItem.PROD_CD,
			        isViewOnly: true
			    };

			    this.openWindow({
			        url: '/ECERP/EGG/EGG024M',
			        name: ecount.resource.LBL02072,
			        param: param,
			        popupType: false,
			        additional: true
			    });

				data.event.preventDefault();
			}.bind(this)
		};
		return option;
	}
});