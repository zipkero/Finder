using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework.Dto;
using System.Threading.Tasks;
using ECount.ERP.Framework;
using System.Collections.Generic;
using ECount.ERP.Data.Common.XForm;

namespace ECount.ERP.View.EBA
{
    /// <summary title="EBA070P_06Action">
    /// 1. Create Date	: 2020.03.09
    /// 2. Creator		: Lê Đặng Hoàng Linh
    /// 3. Description	: EBA070P_06Action
    /// 4. Precaution	: 
    /// 5. History		: 2020.03.09 (HoangLinh): Created
    ///                   2020.04.15 (ThanhSang): Fake Form XFormSetManuallyDetailOptionDto > XFormSetManuallyDetailListOptionDto
    /// 6. MenuPath		: 
    /// 7. OldName		: New
    /// </summary>
    [ProgramInfo(NameResource = "LBL13097")]
    public class EBA070P_06Action : ERPXHttpViewActionBase<EBA070P_06Action, Data.RequestBase.ERPXViewListAccountRequest<EBA070P_06Request>>
    {
        public EBA070P_06Action() { }

        #region [Utilities]
        private XFormDefListView.UIData GetXFormInfo(IERPSessionContext context)
        {
            XFormDefListView.UIData xFormInfo = new XFormDefListView.UIData();

            List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto> detailOptions = new List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto>();

            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "GYE_CODE",
                ColNm = context.GetResource("LBL00342"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "GYE_DES",
                ColNm = context.GetResource("LBL00461"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "ITEM_TYPE_NM",
                ColNm = context.GetResource("LBL13143"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
            });

            xFormInfo = context.GetXFormXListManually(new XFormQueryOption() {
                FormType = "MR763",
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

            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA070P_06.js"));
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// Generator
        /// </summary>
        public class ViewBagGenerator : ERPViewBagGenerator<EBA070P_06Action>
        {
            public ViewBagGenerator()
            {
                #region [XFormInfos]

                MappingFor(m => m.XFormInfos, dest => {
                    dest.Assign("MR763", (mo, ctx) => {
                        return mo.GetXFormInfo(ctx).ViewModel[0];
                    });
                });

                MappingFor(m => m.CacheInfo, dest => {
                    dest.Assign("defaultForm", (mo, ctx) => {
                        List<string> defaultForm = new List<string>();
                        defaultForm.Add(ECUtil.JoinString("_", "C", "MR763", 1));
                        return defaultForm;
                    });
                });
                #endregion

                #region [Permission]
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission[ERPProgramId.Account.RegisterAddFieldType]);
                });
                #endregion

                #region [DefaultOption]

                MappingFor(m => m.DefaultOption, dest => {
                    // sample template
                    dest.Assign("IsXFormVersion", (mo, ctx) => false);
                    dest.Assign("companyType", (mo, ctx) => "C");
                    dest.Assign("formSeq", (mo, ctx) => 1);

                    dest.Assign("ITEM_TYPE_CD", (mo, ctx) => mo.Request.Data.ItemTypeCd);
                });

                #endregion

                #region [InitDatas]              
                
                #endregion
            }
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// validator
        /// </summary>
        public class Validator : Validator<EBA070P_06Action, IERPSessionContext>
        {
            public Validator()
            {
            }
        }

        #endregion

    }

    public class EBA070P_06Request
    {
        public string ItemTypeCd { get; set; }
    }
}
