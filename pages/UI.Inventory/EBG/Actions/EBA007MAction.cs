using ECount.Core.Framework;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using ECount.ERP.Infra;
using System.Threading.Tasks;

namespace ECount.ERP.View.EBA
{
    /// <summary title="Reg Card 3.0">
    /// 1. Create Date	: 2020.03.25
    /// 2. Creator		: VuThien
    /// 3. Description	: Reg Card 3.0
    /// 4. Precaution	: 
    /// 5. History		: 2020.07.10 (LuuVinhThanh): A20_03161 - 기초등록 > My탭추가
    /// 6. MenuPath		: Acct1 > Setup > Reg Card
    /// 7. OldName		: UI.EBA007MAction.cs
    /// </summary>
    [ProgramInfo(NameResource = "LBL07295", ProgramId = ERPProgramId.Account.CreditCard, MultiManualId = "EBA_EBA007M")]
    public class EBA007MAction : ERPXViewListActionAccountBase<EBA007MAction, Data.RequestBase.ERPXViewListAccountRequest, ViewListData>
    {
        public EBA007MAction()
        {

        }

        #region [Properties]

        #endregion

        #region [Utility]

        #endregion

        #region [01 OnInitiate]
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
                o.Owner.FormQueryOptionOutput = new XFormQueryOption() { FormType = "AR740", IsCheckFilter = true };
                o.Owner.FormQueryOptionSearch = new XFormQueryOption() { FormType = "AN740" };
                o.Owner.DataViewType = ENUM_DATA_VIEW_TYPE.DataApi;
                o.Owner.IsChangeDateFormat = false;
                o.Owner.IsSimpleSearchUse = false;
                o.Owner.UseDefaultSearchParam = true;
                o.Owner.IsCustomTabUse = true;
            });

            //===========================================================
            // Base class
            //===========================================================          
            pipe.RegisterCode(o => base.OnInitiate(context));

            return this.PipeCompleted();
        }
        #endregion

        #region [06 Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA007M.js"));
        }

        #endregion

        #region [03 Validator]

        /// <summary>
        /// Validator
        /// </summary>
        public class Validator : ValidatorListBase<EBA007MAction>
        {
            /// <summary>
            /// Validator
            /// </summary>
            public Validator()
            {

            }
        }

        #endregion

        #region [07 Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorListBase<EBA007MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("setting", (mo, ctx) => ctx.Permission["E010109"]);
                });
                #endregion

                MappingFor(m => m.Config.User, ctx => ctx.Config.User, dest => {
                    dest.Assign(src => src.USE_EXCEL_CONVERT);
                });

                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.COM_DES);
                });

                #region InitDatas
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("SearchParam", (mo, ctx) => new {
                        FORM_TYPE = mo.FormQueryOptionOutput.FormType,
                        PARAM = string.Empty,
                        SORT_COLUMN = string.Empty,
                        SORT_TYPE = ENUM_SORT_TYPE.Asc,
                        BUSINESS_NO = string.Empty,
                        CUST_NAME = string.Empty,
                        TYPE_GUBUN = string.Empty, // CardClassfication
                        PAYMENT_ACC = string.Empty,
                        GYE_CODE = string.Empty,
                        CONT1 = string.Empty, //CardAdmin
                        REMARKS_WIN = string.Empty, // KEYWORD
                        REMARKS = string.Empty,
                        CANCEL = "N", // ACTIVE
                        ETC_VAL = string.Empty
                    });
                });
                #endregion

                #region DefaultOption

                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("SessionKey", (mo, ctx) => ctx.SessionId.SessionGuid);
                    dest.Assign("formTypeOuput", (mo, ctx) => mo.FormQueryOptionOutput.FormType);
                    dest.Assign("formTypeSearch", (mo, ctx) => mo.FormQueryOptionSearch.FormType);
                });

                #endregion
            }
        }

        #endregion
    }
}
