using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework;
using System.Collections.Generic;
using System;
using ECount.ERP.Service.Account.Basic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="EBA070P_02Action">
    /// 1. Create Date	: 2020.03.09
    /// 2. Creator		: Lê Đặng Hoàng Linh
    /// 3. Description	: EBA070P_02Action
    /// 4. Precaution	: 
    /// 5. History		: 2020.03.09 (HoangLinh): Created
    ///                   2020.04.15 (ThanhSang): Fake Form XFormSetManuallyDetailOptionDto > XFormSetManuallyDetailListOptionDto
    /// 6. MenuPath		: 
    /// 7. OldName		: New
    /// </summary>
    [ProgramInfo(NameResource = "LBL13097")]
    public class EBA070P_02Action : ERPXHttpViewActionBase<EBA070P_02Action, Data.RequestBase.ERPXViewListAccountRequest<EBA070P_02Request>>
    {
        public EBA070P_02Action() { }

        #region [Variable-private]

        /// <summary>
        /// 추가항목설정
        /// </summary>
        private IEnumerable<Data.Account.Common.DefaultAdditionalInfoDto> _addInfo { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public IEnumerable<Data.Account.Common.AdditionalInfoSettingDto> _addInfoSetting { get; set; }

        /// <summary>
        /// 수정자
        /// </summary>
        private string _editorId { get; set; }

        /// <summary>
        /// 수정일시
        /// </summary>
        private DateTime? _editDt { get; set; }

        #endregion

        #region [Utilities]
        private XFormDefListView.UIData GetXFormInfo(IERPSessionContext context)
        {
            XFormDefListView.UIData xFormInfo = new XFormDefListView.UIData();

            List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto> detailOptions = new List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto>();

            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "TITLE",
                ColNm = context.GetResource("LBL04414"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 250
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "USE_YN",
                ColNm = context.GetResource("LBL01458"),
                //ControlType = "widget.checkbox",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 100,
                Align = ENUM_ALIGN.Center
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "MUST_YN",
                ColNm = context.GetResource("LBL03043"),
                //ControlType = "widget.checkbox",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 100,
                Align = ENUM_ALIGN.Center
            });
            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "DEFAULT_VALUE",
                ColNm = context.GetResource("LBL00355"),
                ControlType = "widget.label",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 330,
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
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.Register<IGetCmcdItemSetViewSvc>()
                .Mapping(o => {
                    o.Command.Request = this.Request.Data.vMappingTo<GetCmcdItemSetViewRequest>();
                })
                .OnExecuted(o => {
                    this._addInfo = o.Command.Result;

                    if (this._addInfo.vIsNotEmpty()) {
                        this._editorId = this._addInfo.vSelect(x => x.EDITOR_ID).vWhere(x => x.vIsNotEmpty()).vFirst();
                        this._editDt = this._addInfo.vSelect(x => x.EDIT_DT).vWhere(x => x.vIsNotNull()).vFirst();
                    }
                    return true;
                });

            pipe.Register<IGetCmcdItemSvc>()
                .Mapping(o => {
                    o.Command.Request = this.Request.Data.vMappingTo<GetCmcdItemRequest>();
                })
                .OnExecuted(o => {
                    this._addInfoSetting = o.Command.Result;
                    return true;
                });
            
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA070P_02.js"));
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// Generator
        /// </summary>
        public class ViewBagGenerator : ERPViewBagGenerator<EBA070P_02Action>
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

                    dest.Assign("EditorId", (mo, ctx) => mo._editorId);
                    dest.Assign("EditDt", (mo, ctx) => mo._editDt);
                    dest.Assign("ItemTypeCd", (mo, ctx) => mo.Request.Data.ITEM_TYPE_CD);
                    dest.Assign("MenuType", (mo, ctx) => mo.Request.Data.MENU_TYPE);
                });

                #endregion

                #region [InitDatas]              
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("AddInfo", (mo, ctx) => mo._addInfo);
                    dest.Assign("AdditionalInfoSetting", (mo, ctx) => mo._addInfoSetting); 
                    //dest.Assign("AdditionalInfoSetting", (mo, ctx) => {
                    //    using (var dac = new Data.Account.GetCmcdItemDac()) {
                    //        dac.MENU_TYPE = mo.MENU_TYPE;

                    //        return dac.Execute(ctx).Data;
                    //    }
                    //});
                });
                #endregion
            }
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// validator
        /// </summary>
        public class Validator : Validator<EBA070P_02Action, IERPSessionContext>
        {
            public Validator()
            {
            }
        }

        #endregion

    }

    public class EBA070P_02Request
    {
        /// <summary>
        /// 추가항목유형코드
        /// </summary>
        public string ITEM_TYPE_CD { get; set; }

        /// <summary>
        /// 메뉴타입
        /// </summary>
        public string MENU_TYPE { get; set; }
    }
}
