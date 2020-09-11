
using ECount.Core.Framework;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Entity.ACCT_AC;
using ECount.ERP.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Service.Account.Basic;

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
    [ProgramInfo(NameResource = "LBL03649", ProgramId = "E010107", MultiManualId = "EBA_EBA024M")]
    public class EBA024MAction : ERPXViewInputActionBase<EBA024MAction, ERPXViewInputRequest<Acc008ViewInputRequestDto>, Acc008ViewInputDto>
    {
        #region [Public Property]
        #endregion

        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {

            return CreatePipeResult(() => {
                return this.DefaultView("~/View.Account/EBA/Views/XEBA024M.js");
            });
        }

        protected override PipeResult InitViewData(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            //===========================================================
            // Base class
            //===========================================================
            pipe.RegisterCode(o => base.InitViewData(context));

            pipe.RegisterCode(o => {
                o.Owner.ViewData = o.Owner.Request.Data.vMappingTo<Acc008ViewInputDto>();
            })
            .AddFilter(o => o.Owner.Request.EditMode == ENUM_EDIT_MODE.Modify);

            pipe.Register<IGetAcc008NewCodeSvc>()
            .AddFilter(o => o.Owner.Request.EditMode == ENUM_EDIT_MODE.New)
            .AddFilter(o => o.Owner.Request.Data.Key.GYE_CODE.vIsNotNull())
            .Mapping(o => o.Command.Request = o.Owner.Request.Data.vMappingTo<GetAcc008NewCodeRequest>())
            .OnExecuted(o => {
                o.Owner.ViewData = new Acc008ViewInputDto();
                o.Owner.ViewData.Key = new ACC008_PK() {
                    REMARKS_CD = o.Command.Result,
                    GYE_CODE = o.Owner.Request.Data.Key.GYE_CODE
                };
                return true;
            });

            return this.PipeCompleted();
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA024MAction>
        {
            /// <summary>
            /// Check Validator
            /// </summary>
            public Validator()
            {
                CheckFor(m => m.Request).Require();
                //CheckFor(m => m.Request.Data.Key.GYE_CODE).Require();
            }
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorInputBase<EBA024MAction>
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
                });
                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("IsOthersDataFlag", (mo, ctx) => mo.Request.Data.IsOthersDataFlag.vSafe(ENUM_USE_YN.None));
                });
                #endregion
            }
        }
        #endregion
    }

    #region [View Dto]

    public class Acc008ViewInputRequestDto: ACC008
    {
        public ENUM_USE_YN IsOthersDataFlag { get; set; }
    }

    public class Acc008ViewInputDto : ACC008, IViewInputData
    {
        #region [override]

        public ENUM_DELETE_YN DeleteYn { get; set; }

        public string WriterID { get; set; }

        public string WriterInPart { get; set; }

        public string EditorID { get; set; }

        public string EditorInPart { get; set; }

        #endregion
    }

    #endregion
}