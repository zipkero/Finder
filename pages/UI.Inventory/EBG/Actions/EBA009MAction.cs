using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework.Dto;
using System.Threading.Tasks;
using ECount.ERP.Framework;

namespace ECount.ERP.View.EBA
{
    /// <summary title="Title">
    /// 1. Create Date	: 2020.03.09
    /// 2. Creator		: Lê Đặng Hoàng Linh
    /// 3. Description	: Unknow
    /// 4. Precaution	: 
    /// 5. History		: 2020.03.09 (HoangLinh): Created
	///					  2020.03.31 (HaeIn KIM) - A20_00695 조회-현황 공통 UI 리팩토링 - 카드사등록
	/// 6. MenuPath		: 
	/// 7. OldName		: New
	/// </summary>
	[ProgramInfo(NameResource = "LBL02870", ProgramId = ERPProgramId.Account.MerchantAccount, MultiManualId = "EBA_EBA009M")]
    public class EBA009MAction : ERPXViewOutputActionBase<EBA009MAction, Data.RequestBase.ERPXViewOutputRequest, ViewListData>
    {
        public EBA009MAction()
        {

        }

        #region [Properties]
        /// <summary>
        /// 검색창 Display Mode // [1: Yes, 0:No]
        /// </summary>
        public bool isShowSearchForm { get; set; }
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
                this.ProgramId = ERPProgramId.Account.MerchantAccount;
				this.AddFormOutputOption(new XFormQueryOption() { FormType = "AR772", IsCheckFilter = true});
				this.AddFormSearchOption(new XFormQueryOption() { FormType = "AN772" });
                this.FormViewType = ENUM_XFORM_VIEW_TYPE.List;
                this.IsChangeDateFormat = false;
                this.IsSimpleSearchUse = false;
                this.UseDefaultSearchParam = true;
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
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA009M.js"));
        }

        #endregion

        #region [03 Validator]

        /// <summary>
        /// Validator
        /// </summary>
        public class Validator : ValidatorOutputBase<EBA009MAction>
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
        public class ViewBagGenerator : ViewBagGeneratorOutputBase<EBA009MAction>
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
                        SORT_COLUMN = "CUST.CUST_NAME",
                        SORT_TYPE = "ASC",
                        BUSINESS_NO = "",
                        CUST_NAME = "",
                        BANK_ACC_IN = "",
                        GYE_CODE = "",
                        GROUP_CD1 = "",
                        GROUP_CD2 = "",
                        COST_RATE = "", //Fee Rate
                        REMARKS_WIN = "", // KEYWORD
                        REMARKS = "",
                        CANCEL = "N", // ACTIVE
                        ETC_VAL = ""
                    });
				});
                #endregion

                #region DefaultOption

                MappingFor(m => m.DefaultOption, dest => {
                    //Các default option được sử dụng khi request page từ menu backup
                    dest.Assign("isShowSearchForm", (mo, ctx) => mo.isShowSearchForm);
                    dest.Assign("SessionKey", (mo, ctx) => ctx.SessionId.SessionGuid);
                });

                #endregion
            }
        }

        #endregion
    }
}
