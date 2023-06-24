export interface IBlockArgumentItemBase {
  type: string;
  name: string;
}

export interface IFieldInputValue extends IBlockArgumentItemBase {
  type: 'input_value';
  check?: null | ScratchValueType | string | (ScratchValueType | string)[];
}

export interface IFieldInputStatement extends IBlockArgumentItemBase {
  type: 'input_statement';
}

export interface IFieldNumberDropdown extends IBlockArgumentItemBase {
  type: 'field_numberdropdown';
  value?: number;
  min?: number;
  max?: number;
  precision?: number;
  option?: [string, string][] | (() => [string, string][]);
}

export interface IFieldLabel extends IBlockArgumentItemBase {
  type: 'field_label';
  text: string;
  class?: string;
}

export interface IFieldCheckbox extends IBlockArgumentItemBase {
  type: 'field_checkbox';
  checked: boolean;
}

export interface ImagePart extends IBlockArgumentItemBase {
  src: string;
  width?: string | number;
  height?: string | number;
  alt?: string | number;
  flip_rtl?: boolean;
  flipRtl?: boolean;
}

export interface IFieldImage extends IBlockArgumentItemBase, ImagePart {
  type: 'field_image';
}

export interface IFieldInputRemovable extends IBlockArgumentItemBase {
  type: 'field_input_removable';
  text: string;
  class?: string;
  spellcheck?: boolean;
}

export interface IFieldColor extends IBlockArgumentItemBase {
  type: 'field_colour';
  colour: string;
}

export interface IFieldDate extends IBlockArgumentItemBase {
  type: 'field_date';
  date: string;
}

export interface IFieldTextDropdown extends IBlockArgumentItemBase {
  type: 'field_textdropdown';
  value: string;
  option?: [string, string][] | (() => [string, string][]);
  spellcheck?: boolean;
}

export interface IFieldAngle extends IBlockArgumentItemBase {
  type: 'field_angle';
  angle: number;
}

export interface IFieldNumber extends IBlockArgumentItemBase {
  type: 'field_number';
  value?: number;
  max?: number;
  min?: number;
  precision?: number;
}

export interface IFieldIconMenu extends IBlockArgumentItemBase {
  type: 'field_iconmenu';
  options: (ImagePart & { value: string })[];
}

export interface IFieldMatrix extends IBlockArgumentItemBase {
  type: 'field_matrix';
  matrix: number;
}

export interface IFieldNote extends IBlockArgumentItemBase {
  type: 'field_note';
  note?: string | number;
}

export interface IFieldDropdown extends IBlockArgumentItemBase {
  type: 'field_dropdown';
  options: [string, string][] | (() => [string, string][]); // [display, value]
}

export interface IFieldColourSlider extends IBlockArgumentItemBase {
  type: 'field_colour_slider';
  colour: string; // #aabbcc
}

export interface IFieldVariable extends IBlockArgumentItemBase {
  type: 'field_variable';
  variable: string | null; // name
  variableTypes: ScratchValueType[];
}

export interface IFieldVariableGetter extends IBlockArgumentItemBase {
  type: 'field_variable_getter';
  text: string; // 初始内容
  class?: string;
  variableType: ScratchValueType[];
}

export interface IFieldInput extends IBlockArgumentItemBase {
  type: 'field_input';
  text: string;
  class?: string;
  spellcheck?: boolean;
}

export interface IFieldLabelSerializable extends IBlockArgumentItemBase {
  type: 'field_label_serializable';
  text: string;
  class?: string;
}

export interface IFieldVerticalSeperator extends IBlockArgumentItemBase {
  type: 'field_vertical_separator';
}

export type IBlockArgumentItem =
  | IFieldInputValue
  | IFieldInputStatement
  | IFieldLabel
  | IFieldCheckbox
  | IFieldImage
  | IFieldInputRemovable
  | IFieldColor
  | IFieldDate
  | IFieldTextDropdown
  | IFieldAngle
  | IFieldNumber
  | IFieldIconMenu
  | IFieldMatrix
  | IFieldNote
  | IFieldDropdown
  | IFieldColourSlider
  | IFieldVariableGetter
  | IFieldInput
  | IFieldLabelSerializable
  | IFieldVerticalSeperator
  | IFieldNumberDropdown
  | IFieldVariable;

export enum ScratchBlockCategory {
  Motion = 'motion',
  Looks = 'looks',
  Sound = 'sound',
  Pen = 'pen',
  Data = 'data',
  DataLists = 'dataLists',
  Event = 'event',
  Control = 'control',
  Sensing = 'sensing',
  Operators = 'operators',
  More = 'more',
}

export enum ScratchOutputShape {
  Hexagonal = 1,
  Round = 2,
  Square = 3,
}

export enum ScratchValueType {
  Boolean = 'Boolean',
  String = 'String',
  Number = 'Number',
  Array = 'Array',
}

export type ScratchExtensionColour =
  | 'colours_motion'
  | 'colours_looks'
  | 'colours_sound'
  | 'colours_pen'
  | 'colours_data'
  | 'colours_dataLists'
  | 'colours_event'
  | 'colours_control'
  | 'colours_sensing'
  | 'colours_operators'
  | 'colours_more'
  | 'colours_textfield';
export type ScratchExtensionShape =
  | 'shape_statement'
  | 'shape_hat'
  | 'shape_end';
export type ScratchExtensionOutput =
  | 'output_number'
  | 'output_string'
  | 'output_boolean';
export type ScratchExtension =
  | ScratchExtensionColour
  | ScratchExtensionShape
  | ScratchExtensionOutput
  | 'procedure_def_contextmenu'
  | 'rocedure_call_contextmenu'
  | 'scratch_extension';

export interface IBlockRegisterProps {
  /** 是否有返回值且其类型，null 为不检查，数组为多种 */
  output?: null | ScratchValueType | string | (ScratchValueType | string)[];
  /** 如果有返回值，block 的形状 */
  outputShape?: ScratchOutputShape;
  /** 是否上面可以接 block，以及类型 */
  previousStatement?:
    | null
    | ScratchValueType
    | string
    | (ScratchValueType | string)[];
  /** 是否下面可以接 block，以及类型 */
  nextStatement?:
    | null
    | ScratchValueType
    | string
    | (ScratchValueType | string)[];

  /** 类别 */
  category?: ScratchBlockCategory;
  /** 悬浮显示的文字 占位符%{XXX}是i18n */
  tooltip?: string;
  /** 文档链接 占位符%{XXX}是i18n */
  helpUrl?: string;
  /** 右键菜单 */
  enableContextMenu?: boolean;
  /** 菜单中左侧是否有复选框 */
  checkboxInFlyout?: boolean;

  /** 颜色 */
  colour?: string;
  /** 后备颜色 */
  colourSecondary?: string;
  /** 后备颜色 */
  colourTertiary?: string;
  /** 后备颜色 */
  colourQuaternary?: string;

  /** message\d+  格式化字符串 %\d+ (从1开始)代表了这里是放arg0的对应参数  %{XXX}是i18n */
  message0?: string;
  message1?: string;
  message2?: string;
  /** 不一定是给用户输入的参数，可以理解为一种"组件"，有输入、文字、图片等等 */
  args0?: IBlockArgumentItem[];
  args1?: IBlockArgumentItem[];
  args2?: IBlockArgumentItem[];
  lastDummyAlign0?: boolean;
  lastDummyAlign1?: boolean;
  lastDummyAlign2?: boolean;
  /** 输入是嵌在里面还是放在后面 */
  inputsInline?: boolean;

  extensions?: ScratchExtension | ScratchExtension[];
  mutator?: ScratchExtension;
}
