using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using System.Threading.Tasks;
using ECount.ERP.Data.SelfCustomize.DataManagement;
using ECount.ERP.Service.Account.Basic;
using System.Collections.Generic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="Department">
    /// 1. Create Date  : 2020.03.15
    /// 2. Creator      : ThanhSang
    /// 3. Decription   : Department
    /// 4. Precaution   : 
    /// 5. History      : 2020.06.29 (Nguyen Duc Thinh) A20_02867 - 재고/회계/관리 > 부서등록 > 옵션 > 검색항목설정 추가
    /// 6. MenuPath     : Department
    /// 7. OldName      : 
    /// </summary>
    [ProgramInfo(NameResource = "LBL07530", ProgramId = "E010105", MultiManualId = "EBA_EBA003M")]
    
    public class EBA003MAction : ERPXViewListActionAccountBase<EBA003MAction, Data.RequestBase.ERPXViewListAccountRequest<GetListSiteRequest>, ViewListData>
    {
        #region [Property-pubic]

        public string isShowSearchForm { get; set; }

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
                this.FormViewType = ENUM_XFORM_VIEW_TYPE.List;
                this.FormQueryOptionOutput = new XFormQueryOption() { FormType = "AR771", IsCheckFilter = true };
                this.FormQueryOptionSearch = new XFormQueryOption() { FormType = "AN771" };
                this.UseDefaultSearchParam = true;
                this.IsLimitSearchUse = true;
                this.IsSimpleSearchUse = false;
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


        #region [Util]

        private IEnumerable<dynamic> GetOtherEstablishment(IERPSessionContext ctx)
        {
            IEnumerable<dynamic> result = null; 
            if (ctx.Company.VAT_SITE == ENUM_USE_YN.Yes) {
                using (var SvcAcct = SvcManager.Create<ECount.ERP.Service.Account.Basic.IInsertSiteForOtherEstablishmentSvc>()) {
                    SvcAcct.Request = new Entity.MYSQL_ACCT.SITE_PK {
                        COM_CODE = ctx.COM_CODE,
                        SITE = this.Request.Data?.SITE_CD_DEPT
                    };
                    SvcAcct.Execute(ctx);
                }

                using (var Svc = SvcManager.Create<ECount.ERP.Service.Account.Basic.IGetOtherEstablishmentsToListSiteSvc>()) {
                    Svc.Request = new Entity.ACCT.SITE_PK {
                        COM_CODE = ctx.COM_CODE,
                        SITE = this.Request.Data?.SITE_CD_DEPT
                    };
                    Svc.Execute(ctx);
                    result = Svc.Result;
                }
            }
            return result;
        }

        #endregion


        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {            
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA003M.js"));
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : ValidatorListBase<EBA003MAction>
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
        public class ViewBagGenerator : ViewBagGeneratorListBase<EBA003MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region [config]
                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.COM_DES);
                });
                // Configs
                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.VAT_SITE);
                });

                MappingFor(m => m.Config.User, ctx => ctx.Config.User, dest => {
                    dest.Assign(src => src.USE_EXCEL_CONVERT);
                });
                #endregion

                #region [Permissions]				
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission[ERPProgramId.Account.Department]);
                    dest.Assign("PermitTree", (mo, ctx) => ctx.Permission["E010120"]);
                    dest.Assign("setting", (mo, ctx) => ctx.Permission[ERPProgramId.Account.Department]);
                });
                #endregion

                #region [Forms]

                #endregion

                #region [InitDatas]

                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("SearchParam", (mo, ctx) => new {
                        PARAM = "",
                        BASE_DATE_CHK = "0",
                        SORTCOL_ID = "",
                        SORT_TYPE = "A",
                        INI_COM_CODE = ctx.Company.INNER_GYESET_CD.vSafe(),
                        SITE_CD_DEPT = "",
                        SITE_DES_DEPT = "",
                        MENU = "99∬1∬2∬3",
                        BUSINESS_NO = "",
                        SITE_CD_TREE = "",
                        CANCEL = "N"
                    });


                });

                #endregion

                #region [Widgets]				
                MappingFor(m => m.Widgets, dest => {

                });
                #endregion

                #region [DefaultOption]
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("__ecOpenPopup", (mo, ctx) => mo.__ecOpenPopup);
                    dest.Assign("PRG_ID", (mo, ctx) => ERPProgramId.Account.Department);
                    dest.Assign("OtherEstablishment", (mo, ctx) => mo.GetOtherEstablishment(ctx));
                    // 데이터백업관련 파라미터 추가
                    dest.Assign("isShowSearchForm", (mo, ctx) => mo.isShowSearchForm);
                    dest.Assign("USER_FLAG", (mo, ctx) => ctx.Permission.USER_FLAG);
                });
                #endregion
            }
        }

        #endregion
    }
}
