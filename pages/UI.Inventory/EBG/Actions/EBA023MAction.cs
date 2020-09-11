using ECount.Core.Framework;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Infra;
using ECount.ERP.Service.Account.Basic;
using System.Collections.Generic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="Remark list popup">
    /// 1. Create Date : 2020.06.23
    /// 2. Creator     : Ngo Thanh Lam
    /// 3. Description : Remark list popup
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : Acct. I > Setup > Chart of Account > Remarks popup
    /// 7. OldName     : 
    /// </summary>
    [ProgramInfo(NameResource = "LBL03649", ProgramId = "E010107", MultiManualId = "EBA_EBA023M")]
    public class EBA023MAction : ERPXHttpViewActionBase<EBA023MAction, ERPXRequest<GetListAcc008Request>>
    {
        #region [Public Property]
        IEnumerable<DynamicDictionary> _viewData;
        #endregion

        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);
            
            pipe.Register<IGetListAcc008Svc>()
                .Mapping(o => o.Command.Request = o.Owner.Request.Data)
                .OnExecuted(o => {
                    this._viewData = o.Command.Result.Data;
                    return true;
                });

            return CreatePipeResult(() => {
                return this.DefaultView("~/View.Account/EBA/Views/XEBA023M.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA023MAction>
        {
            /// <summary>
            /// Check Validator
            /// </summary>
            public Validator()
            {
                CheckFor(m => m.Request).Require();
                CheckFor(m => m.Request.Data.GYE_CODE).Require();

                InitFor(m => m.Request.Data.PAGE_SIZE).AssignValue(18);
            }
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ERPViewBagGenerator<EBA023MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                //Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission["E010107"]);
                });
                
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("LoadData", (mo, ctx) => mo._viewData);
                });
                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
					dest.Assign("GYE_CODE", (mo, ctx) => mo.Request.Data.GYE_CODE);
					dest.Assign("PAGE_SIZE", (mo, ctx) => mo.Request.Data.PAGE_SIZE);
					dest.Assign("PAGE_CURRENT", (mo, ctx) => mo.Request.Data.PAGE_CURRENT);
                });
                #endregion
            }
        }
        #endregion
    }
}