using System.Collections.Generic;
using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Data.Common.Form;
using ECount.ERP.Data.SelfCustomize.DataManagement;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Framework.Dto;
using System.Threading.Tasks;
using ECount.ERP.Framework;

namespace ECount.ERP.View.EBA
{
    /// <summary title="EBA070MAction">
    /// 1. Create Date	: 2020.03.09
    /// 2. Creator		: Lê Đặng Hoàng Linh
    /// 3. Description	: EBA070MAction
    /// 4. Precaution	: 
    /// 5. History		: 2020.03.09 (HoangLinh): Created
    /// 6. MenuPath		: 
    /// 7. OldName		: New
    /// </summary>
    [ProgramInfo(NameResource = "LBL13097", ProgramId = ERPProgramId.Account.RegisterAddFieldType, MultiManualId = "EBA_EBA070M")]
    public class EBA070MAction : ERPXViewOutputActionBase<EBA070MAction, ERPXViewOutputRequest, ViewListData>
    {
        public EBA070MAction() { }

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
                this.ProgramId = ERPProgramId.Account.RegisterAddFieldType;
                 //출력양식 설정
                this.AddFormOutputOption(new XFormQueryOption() { FormType = "AR762", IsCheckFilter = true, IsMain = true });
                //검색양식 설정
	        	this.AddFormSearchOption(new XFormQueryOption() { FormType = "AN762" });

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
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA070M.js"));
        }

        #endregion

        #region [07 Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorOutputBase<EBA070MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("setting", (mo, ctx) => ctx.Permission[ERPProgramId.Account.RegisterAddFieldType]);
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

                });
                #endregion

                #region DefaultOption

                MappingFor(m => m.DefaultOption, dest => {
                    
                });

                #endregion
            }
        }

        #endregion
    }
}
