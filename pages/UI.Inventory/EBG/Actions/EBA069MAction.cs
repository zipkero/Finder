using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework.Dto;
using System.Threading.Tasks;
using ECount.ERP.Framework;
using System.Collections.Generic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="EBA069MAction">
    /// 1. Create Date	: 2020.03.09
    /// 2. Creator		: Lê Đặng Hoàng Linh
    /// 3. Description	: EBA069MAction
    /// 4. Precaution	: 
    /// 5. History		: 2020.03.09 (HoangLinh): Created
    ///                   2020.04.15 (ThanhSang): Fake Form XFormSetManuallyDetailOptionDto > XFormSetManuallyDetailListOptionDto
    /// 6. MenuPath		: 
    /// 7. OldName		: New
    /// </summary>
    [ProgramInfo(NameResource = "LBL13097", ProgramId = ERPProgramId.Account.RegisterAddFieldType, MultiManualId = "EBA_EBA069M")]    
    public class EBA069MAction : ERPXHttpViewActionBase<EBA069MAction, Data.RequestBase.ERPXViewListAccountRequest<EBA069MRequest>>
    {
        public EBA069MAction() { }

        //#region [01 OnInitiate]
        ///// <summary>
        ///// OnInitiate
        ///// </summary>
        ///// <param name="context"></param>
        ///// <returns></returns>
        //protected override PipeResult OnInitiate(IERPSessionContext context)
        //{
        //    var pipe = this.CreatePipeline(TransactionOption.Suppress);

        //    //===========================================================
        //    // Custom
        //    //===========================================================
        //    pipe.RegisterCode(o => {
        //        this.ProgramId = ERPProgramId.Account.RegisterAddFieldType;
        //        this.FormQueryOptionOutput = new XFormQueryOption() { FormType = "AR760", IsCheckFilter = true };
        //        this.FormQueryOptionSearch = new XFormQueryOption() { };
        //        this.FormViewType = ENUM_XFORM_VIEW_TYPE.List;
        //        this.IsChangeDateFormat = false;
        //        this.IsSimpleSearchUse = false;
        //        this.UseDefaultSearchParam = true;
        //    });

        //    //===========================================================
        //    // Base class
        //    //===========================================================          
        //    pipe.RegisterCode(o => base.OnInitiate(context));

        //    return this.PipeCompleted();
        //}
        //#endregion

        //#region [06 Execute]

        ///// <summary>
        ///// Execute
        ///// </summary>
        ///// <param name="context"></param>
        ///// <returns></returns>
        //protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        //{
        //    var pipe = this.CreatePipeline(TransactionOption.Suppress);
        //    pipe.RegisterCode(o => {
        //        if (this.Request.Data.actTab.vIsEmpty())
        //            this.Request.Data.actTab = "1";
        //    });

        //    return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA069M.js"));
        //}

        //#endregion

        #region [Utilities]
        private XFormDefListView.UIData GetXFormInfo(IERPSessionContext context)
        {
            XFormDefListView.UIData xFormInfo = new XFormDefListView.UIData();

            List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto> detailOptions = new List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto>();

            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "NM_CD",
                ColNm = context.GetResource("LBL02341"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 100
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "CD_DES",
                ColNm = context.GetResource("LBL02342"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 170
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "KEYWORDS",
                ColNm = context.GetResource("LBL03213"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 155
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "REMARKS",
                ColNm = context.GetResource("LBL04893"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 240
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "USE_YN",
                ColNm = context.GetResource("LBL07879"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 60,
                Align = ENUM_ALIGN.Center
            });

            xFormInfo = context.GetXFormXListManually(new XFormQueryOption() {
                FormType = "MR760",
                FormSeq = 1,
                SetManuallyOption = new Data.Common.XForm.XFormSetManuallyMainOptionDto() {
                    ViewType = ENUM_XFORM_VIEW_TYPE.List,
                    DetailOption = detailOptions
                }

            });

            return xFormInfo;
        }
        #endregion

        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);


            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA069M.js"));
        }

        #endregion

        #region [07 Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ERPViewBagGenerator<EBA069MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region [XFormInfos]

                MappingFor(m => m.XFormInfos, dest => {
                    dest.Assign("MR760", (mo, ctx) => {
                        return mo.GetXFormInfo(ctx).ViewModel[0];
                    });
                });

                MappingFor(m => m.CacheInfo, dest => {
                    dest.Assign("defaultForm", (mo, ctx) => {
                        List<string> defaultForm = new List<string>();
                        defaultForm.Add(ECUtil.JoinString("_", "C", "MR760", 1));
                        return defaultForm;
                    });
                });
                #endregion

                #region Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission[ERPProgramId.Account.RegisterAddFieldType]);
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
                        PARAM = mo.Request.Data.PARAM
                    });
                });
                #endregion

                #region DefaultOption

                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("actTab", (mo, ctx) => mo.Request.Data.actTab);
                    dest.Assign("PARAM", (mo, ctx) => mo.Request.Data.PARAM);

                    // sample template
                    dest.Assign("IsXFormVersion", (mo, ctx) => false);
                    dest.Assign("companyType", (mo, ctx) => "C");
                    dest.Assign("formSeq", (mo, ctx) => 1);
                });

                #endregion
            }
        }

        #endregion
    }

    public class EBA069MRequest
    {
        #region [Property-public]

        /// <summary>
        /// Tab selected
        /// </summary>
        public string actTab { get; set; }

        /// <summary>
        /// Search param
        /// </summary>
        public string PARAM { get; set; }

        #endregion
    }
}
