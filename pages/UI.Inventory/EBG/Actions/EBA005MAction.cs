using System.Collections.Generic;
using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework;
using ECount.ERP.Data.Common.Form;
using ECount.ERP.Data.SelfCustomize.DataManagement;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Framework.Dto;
using System.Threading.Tasks;

namespace ECount.ERP.View.EBA
{
    /// <summary title="EBA005MAction">
    /// 1. Create Date  : 2020.02.25
    /// 2. Creator      : nguyen Duc Thinh
    /// 3. Description  : Reg. Bank Account
    /// 4. Precaution   : 
    /// 5. History      : (2020.03.30) Kim Su A refactoring
    /// 6. MenuPath     : Acct.I > Setup > Reg. Bank Account
    /// 7. OldName      : new
    /// </summary>
    [ProgramInfo(NameResource = "LBL17423", ProgramId = ERPProgramId.Account.BankAccount, MultiManualId = "EBA_EBA005M")]//"E010104"
    public class EBA005MAction : ERPXViewOutputActionBase<EBA005MAction, ERPXViewOutputRequest, ViewListData>
    {
        #region [Property-public]

        ///// <summary>
        ///// 검색창 Display Mode // [1: 열림, 2:닫힘, 3:없음]
        ///// </summary>
        public string isShowSearchForm { get; set; }

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
                this.ProgramId = ERPProgramId.Account.BankAccount;
                //출력양식 설정
                this.AddFormOutputOption(new XFormQueryOption() { FormType = "AR750", IsCheckFilter = true, IsMain = true });
                //검색양식 설정
	        	this.AddFormSearchOption(new XFormQueryOption() { FormType = "AN750" });
                this.FormViewType = ENUM_XFORM_VIEW_TYPE.List;
                this.IsChangeDateFormat = true;
                this.UseDefaultSearchParam = true;
                this.IsLimitSearchUse = true;
            });

            //===========================================================
            // Base class
            //===========================================================          
            pipe.RegisterCode(o => base.OnInitiate(context));

            return this.PipeCompleted();
        }

        #endregion

        #region [Execute]
        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA005M.js"));
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorOutputBase<EBA005MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region [config]

                MappingFor(m => m.ExtendDatas, dest => {
                    dest.Assign("ComCode", (mo, ctx) => ctx.COM_CODE);
                });

                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.COM_DES);
                });

                MappingFor(m => m.Config.User, ctx => ctx.Config.User, dest => {
                    dest.Assign(src => src.USE_EXCEL_CONVERT);
                });

                MappingFor(m => m.User, ctx => ctx.User, dest => {
                    dest.Assign(src => src.WID);
                });

                #endregion

                #region [Permissions]		

                MappingFor(m => m.Permission, dest => {
                    dest.Assign("setting", (mo, ctx) => ctx.Permission[ERPProgramId.Account.BankAccount]);
                });

                #endregion

                #region [DefaultOption]

                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("__ecOpenPopup", (mo, ctx) => mo.__ecOpenPopup);
                    dest.Assign("PRG_ID", (mo, ctx) => ERPProgramId.Account.BankAccount);
                    // Properties from data backup
                    dest.Assign("isShowSearchForm", (mo, ctx) => mo.isShowSearchForm);
                });

                #endregion
            }
        }

        #endregion

        #region [Validator]

        public class Validator : ValidatorOutputBase<EBA005MAction>
        {
            public Validator()
            {
            }
        }

        #endregion


    }
}
