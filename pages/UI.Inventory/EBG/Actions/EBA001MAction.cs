using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using ECount.Core.Framework;
using ECount.ERP.Data.Account.ClosingJournal;
using ECount.ERP.Data.Account.Common;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Data.SelfCustomize;
using ECount.ERP.Entity.ACCT_AC;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using ECount.ERP.Infra;
using ECount.ERP.Service.Account.Basic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="계정등록(재무제표)">
    /// 1. Create Date : 2019.07.19
    /// 2. Creator     : 이철원
    /// 3. Description : 계정등록(재무제표)
    /// 4. Precaution  : 
    /// 5. History     : 2019.12.27(Hao) A19_04462 - 회계1>기초등록>계정등록 리스트의 표시명2 항목이 공란으로 표기됩니다.
    ///                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록
    /// 7. OldName     : 
    /// </summary>
    /// <example>
    /// sample codes here
    /// </example>
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA001M")]
    public class EBA001MAction : ERPXViewListActionBase<EBA001MAction, ERPXViewListRequest, ViewListData>
    {
        #region [Property-public]
        /// <summary>
        /// Show Button Close On Header Search (Hien Button Close tren header search)
        /// </summary>
        public bool isShowSearchClose { get; set; }

        /// <summary>
        /// Show Search Form (Hien Form search ngay khi load)
        /// </summary>
        public string isShowSearchForm { get; set; }

        /// <summary>
        ///  자료올리기에서 사용하는 컬럼여부
        /// </summary>
        public List<string> BulkUploadColumns { get; set; }

        /// <summary>
        /// Call From Bulk Upload (Goi tu Web Upload)
        /// </summary>
        public bool IsFromBulkUpload { get; set; }

        /// <summary>
        /// 탭 타입 (1: 재무제표 / 2: 수입지출명세서)
        /// </summary>
        public string TabType { get; set; }

        public string FormType { get; set; }

        public string SearchFormType { get; set; }

        /// <summary>
        /// 기본값복원 > 미리보기에서 띄웠는 지 체크
        /// </summary>
        public bool IsFromPreview { get; set; }

        /// <summary>
        /// ZT코드
        /// </summary>
        public string ZTCode { get; set; }

        #endregion

        #region [Property-private]

        private ENUM_USE_YN _incomeFlag { get; set; }

        #endregion

        #region [Utility]

        #endregion

        #region [OnInitiate]

        /// <summary>
        /// OnInitiate
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult OnInitiate(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            //===========================================================
            // Custom
            //===========================================================

            pipe.RegisterCode(o => {
                if(o.Owner.TabType != "2" ) {
                    o.Owner.FormType = "AR250";
                    o.Owner.SearchFormType = "AN260";
                } else {
                    o.Owner.FormType = "AR270";
                    o.Owner.SearchFormType = "AN270";
                }

                o.Owner.FormViewType = ENUM_XFORM_VIEW_TYPE.List;
                o.Owner.FormQueryOptionOutput = new XFormQueryOption() { FormType = o.Owner.FormType, isCheckSimpleCondition = true };
                o.Owner.FormQueryOptionSearch = new XFormQueryOption() { FormType = o.Owner.SearchFormType };
                o.Owner.DataViewType = ENUM_DATA_VIEW_TYPE.DataFirst;
                //o.Owner.IsLimitSearchUse = true;
                //o.Owner.Request.IsFromLink = this.MenuTypes.vIsNotEmpty();
            });

            //===========================================================
            // Base class
            //===========================================================          
            pipe.RegisterCode(o => base.OnInitiate(context));

            return this.PipeCompleted();
        }

        #endregion

        #region [CanExecute]

        /// <summary>
        /// CanExecute
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult<bool> CanExecute(IERPSessionContext context)
        {
            return CreatePipeResult(() => true);
        }

        #endregion

        #region [InitViewData]
        /// <summary>
        /// InitViewData
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult InitViewData(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);
            string parentsColumnId = string.Empty;
            //===========================================================
            // Base class
            //===========================================================
            pipe.RegisterCode(o => base.InitViewData(context));


            pipe.RegisterCode(o => {
                if ( o.Owner.TabType.vIsEmpty() || o.Owner.TabType == "1" )
                    parentsColumnId = "GROUP_CODE";
                else
                    parentsColumnId = "PRTS_INEX_GYE_CODE";
            });

            //===========================================================
            // Custom
            //===========================================================
            pipe.Register<IGetListAcc002Svc<IEnumerable<dynamic>>>()
                .AddFilter(o => o.Owner.IsFromBulkUpload.vSafe(false) == false)
                .Mapping(o => {
                    //string selectColCd = Regex.Replace(o.Owner.SelectInfo.SELECT_COL_CD.vSafe(), @"\[.*?\]", "");
                    string _addSelectColCd = "ACC.GYE_TYPE AS GYE_TYPE|";

                    if ( o.Owner.SelectInfo.ADD_SELECT_COL_CD.vIsNotEmpty() ) {
                        o.Owner.SelectInfo.ADD_SELECT_COL_CD.Split('|').vForEach(context, (i, x) => {
                            if (x.Contains("AS GROUP_YN")) {
                                if ( o.Owner.SelectInfo.SELECT_COL_CD.Contains("[GROUP_YN]") ) {
                                    return;
                                } 
                            }

                            _addSelectColCd += x + '|';
                        });

                        _addSelectColCd = _addSelectColCd.vSubstring(0, _addSelectColCd.Length - 1);
                    }

                    o.Command.Request = new ReqGetListAcc002<IEnumerable<dynamic>>() {
                        COM_CODE = o.Owner.ZTCode.vIsNotEmpty()? o.Owner.ZTCode : context.COM_CODE,
                        TAB = o.Owner.TabType != "2" ? ENUM_SLIP_INPUT_TYPE.ParentAccount : ENUM_SLIP_INPUT_TYPE.PurchaseExpenseAccount,
                        WITH_PARENT_YN = ENUM_VALUE_YN.Yes,
                        MENU_SEQ = 62,
                        SELECT_COL_CD = o.Owner.SelectInfo.SELECT_COL_CD,
                        //SELECT_COL_CD = o.Owner.SelectInfo.SELECT_COL_CD,
                        ADD_SELECT_COL_CD = _addSelectColCd,
                        //ADD_SELECT_COL_CD = o.Owner.SelectInfo.ADD_SELECT_COL_CD,
                        COL_CD = o.Owner.SelectInfo.COL_CD,
                        SORT_CD = o.Owner.SelectInfo.SORT_CD,
                        CANCEL = "N",
                        DataSetHandler = (reader) => {
                            return XFormXDataManager.BuildList(reader, new XFormXDataBuildOption {
                                XFormInfo = o.Owner.FormIODataBase,
                                SessionContext = context,
                                RowBuilder = new XFormXDataRowBuilder {
                                    PostDataRowFilter = (option, rowSequence, data, isSummaryDataRow) => {
                                        data["_TREE_SET"] = new { _PARENT_GROUP_ID = data[parentsColumnId].vSafe("0000") };
                                        if (data["GYE_CODE"].ToString() == "0000" ) {
                                            data["GYE_CODE"] = "";
                                        }
                                        return true;
                                    }
                                }
                            });
                        }
                    };
                })
                .OnExecuted(o => {
                    this.ViewData = new ViewListData();

                    this.ViewData.Data = o.Command.Result.Data;
                    this.ViewData.TotalCount = o.Command.Result.Data.vCount();
                    return true;
                });

            pipe.RegisterDacWithName<DB_ACCT>("IncomeFlag")
                .AddFilter(o => o.Owner.ZTCode.vIsNotEmpty())
                .Mapping(o => o.CmdExecutor = o.Db.Select<Entity.ACCT.MyPageCompany>()
                .Where(x => x.Key.COM_CODE == o.Owner.ZTCode))
                .OnExecute(o => o.Db.Fetch<Entity.ACCT.MyPageCompany>(o.CmdExecutor));

            pipe.RegisterCode(o => {
                o.Owner._incomeFlag = o.Owner.ZTCode.vIsEmpty() ? context.Config.Company.INCOME_FLAG : o.GetValue<Entity.ACCT.MyPageCompany>("IncomeFlag").INCOME_FLAG;
            });

            return this.PipeCompleted();
        }
        #endregion

        #region [OnExecuting]
        protected override PipeResult OnExecuting(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            return base.OnExecuting(context);
        }

        #endregion

        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => {
                RegisterViewClassName("mainPage", "page-fluid header-fixed");
                RegisterScriptPath(map => {
                    map.Add(Optimizer.Url("~/View.Account/EBA/Views/XEBA001M.js"));
                });
                return View("DefaultViewPage", this);
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001MAction>
        {
            /// <summary>
            /// Check Validator
            /// </summary>
            public Validator()
            {
            }
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorListBase<EBA001MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.COM_DES);
                });

                MappingFor(m => m.Config.User, ctx => ctx.Config.User, dest => {
                    dest.Assign(src => src.USE_EXCEL_CONVERT);
                });

                // Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission["E010107"]);
                });

                #region [계정종류]

                MappingFor(m => m.Widgets, dest => {
                    dest.Assign("widget.combine.accountGyeType", (mo, ctx) => {
                        return new WidgetGyeType.WidgetParameter() { };
                    });
                });

                #endregion

                #region [DefaultOption]
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("IsFromBulkUpload", (mo, ctx) => mo.IsFromBulkUpload.vSafe(false));
                    dest.Assign("BulkUploadColumns", (mo, ctx) => mo.BulkUploadColumns);
                    dest.Assign("isShowSearchForm", (mo, ctx) => mo.isShowSearchForm);
                    dest.Assign("isShowSearchClose", (mo, ctx) => mo.isShowSearchClose);
                    dest.Assign("TabType", (mo, ctx) => mo.TabType.vSafe("1"));
                    dest.Assign("ListFormType", (mo, ctx) => mo.FormType);
                    dest.Assign("SearchFormType", (mo, ctx) => mo.SearchFormType);
                    dest.Assign("IsFromPreview", (mo, ctx) => mo.IsFromPreview);
                    dest.Assign("INCOME_FLAG", (mo, ctx) => mo._incomeFlag);
                    dest.Assign("ZTCode", (mo, ctx) => mo.ZTCode);
                });
                
                #endregion
            }
        }

        #endregion
    }
}