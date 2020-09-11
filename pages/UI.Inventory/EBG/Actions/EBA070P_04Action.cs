using ECount.Core.Framework;
using ECount.ERP.Infra;
using ECount.ERP.Framework;
using System.Collections.Generic;
using ECount.ERP.Data.Account.Basic;
using System;
using System.Linq;
using ECount.ERP.Service.Account.Basic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="EBA070P_04Action">
    /// 1. Create Date	: 2020.03.09
    /// 2. Creator		: Lê Đặng Hoàng Linh
    /// 3. Description	: EBA070P_04Action
    /// 4. Precaution	: 
    /// 5. History		: 2020.03.09 (HoangLinh): Created
    ///                   2020.04.15 (ThanhSang): Fake Form XFormSetManuallyDetailOptionDto > XFormSetManuallyDetailListOptionDto
    ///                   2020.07.29 (PhiVo): A20_03329 - fix error
    /// 6. MenuPath		: 
    /// 7. OldName		: New
    /// </summary>
    [ProgramInfo(NameResource = "LBL13097")]
    public class EBA070P_04Action : ERPXHttpViewActionBase<EBA070P_04Action, Data.RequestBase.ERPXViewListAccountRequest<EBA070P_04Request>>
    {
        public EBA070P_04Action() { }

        #region [Variable-private]

        /// <summary>
        /// 추가항목 정보
        /// </summary>
        private IEnumerable<CMCD_ITEM_SETTING> _addInfo { get; set; }

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
                ColCd = "SETTING",
                ColNm = context.GetResource("LBL01593"),
                ControlType = "widget.link",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 100
            });
            
            xFormInfo = context.GetXFormXListManually(new XFormQueryOption() {
                FormType = "MR764",
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

            pipe.Register<IGetCmcdItemListSvc>()
                .Mapping(o =>
                {
                    o.Command.Request = this.Request.Data.vMappingTo<GetCmcdItemListRequest>();
                })
                .OnExecuted(o =>
                {
                    IEnumerable<CMCD_ITEM_SETTING> result = o.Get<IGetCmcdItemListSvc>().Result;
                    var map = new HashDictionary<int, string>();
                    map.Add(1, context.GetResource("LBL02451"));
                    map.Add(2, context.GetResource("LBL02452"));
                    map.Add(3, context.GetResource("LBL02453"));
                    map.Add(4, context.GetResource("LBL02460"));
                    map.Add(5, context.GetResource("LBL02472"));
                    map.Add(6, context.GetResource("LBL02476"));
                    map.Add(7, context.GetResource("LBL02477"));
                    map.Add(8, context.GetResource("LBL02481"));

                    this._addInfo = from defaultSeq in map
                                    join saved in result
                                        on defaultSeq.Key equals saved.ITEM_SEQ into final
                                    from detail in final.DefaultIfEmpty()
                                    let defaultObj = new CMCD_ITEM_SETTING()
                                    {
                                        ITEM_SEQ = defaultSeq.Key,
                                        TITLE = string.Empty,
                                        PlaceHolderTxt = defaultSeq.Value
                                    }
                                    orderby defaultSeq.Key
                                    select detail.vIsNull() ? defaultObj : new CMCD_ITEM_SETTING()
                                    {
                                        ITEM_SEQ = detail.ITEM_SEQ,
                                        TITLE = detail.TITLE,
                                        PlaceHolderTxt = defaultSeq.Value,
                                        POINTDIGIT_SET_YN = detail.POINTDIGIT_SET_YN,
                                        POINTDIGIT = detail.POINTDIGIT,
                                        POINTZERO_SET_YN = detail.POINTZERO_SET_YN,
                                        POINTZERO_VIEW_YN = detail.POINTZERO_VIEW_YN,
                                        ZERO_SET_YN = detail.ZERO_SET_YN,
                                        ZERO_VIEW_YN = detail.ZERO_VIEW_YN,
                                        DELIMITER_SET_YN = detail.DELIMITER_SET_YN,
                                        UNIT_DELIMITER = detail.UNIT_DELIMITER,
                                        POINT_DELIMITER = detail.POINT_DELIMITER,
                                        WRITER_ID = detail.WRITER_ID,
                                        WRITE_DT = detail.WRITE_DT,
                                        EDITOR_ID = detail.EDITOR_ID,
                                        EDIT_DT = detail.EDIT_DT
                                    };

                    if (this._addInfo.vIsNotEmpty())
                    {
                        this._editorId = this._addInfo.vSelect(x => x.EDITOR_ID).vFirst();
                        this._editDt = this._addInfo.vSelect(x => x.EDIT_DT).vFirst();
                    }

                    return true;
                });

            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA070P_04.js"));
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// Generator
        /// </summary>
        public class ViewBagGenerator : ERPViewBagGenerator<EBA070P_04Action>
        {
            public ViewBagGenerator()
            {
                #region [XFormInfos]

                MappingFor(m => m.XFormInfos, dest => {
                    dest.Assign("MR764", (mo, ctx) => {
                        return mo.GetXFormInfo(ctx).ViewModel[0];
                    });
                });

                MappingFor(m => m.CacheInfo, dest => {
                    dest.Assign("defaultForm", (mo, ctx) => {
                        List<string> defaultForm = new List<string>();
                        defaultForm.Add(ECUtil.JoinString("_", "C", "MR764", 1));
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

                    dest.Assign("AddInfo", (mo, ctx) => mo._addInfo);
                    dest.Assign("EditorId", (mo, ctx) => mo._editorId);
                    dest.Assign("EditDt", (mo, ctx) => mo._editDt);
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
        public class Validator : Validator<EBA070P_04Action, IERPSessionContext>
        {
            public Validator()
            {
            }
        }

        #endregion

    }

    public class EBA070P_04Request
    {

        /// <summary>
        /// 메뉴타입
        /// </summary>
        public string MENU_TYPE { get; set; }
    }
}
