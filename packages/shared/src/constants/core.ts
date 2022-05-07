export const CORE_VERSION = 'core/v1';
// core components
export enum CoreComponentName {
  Dummy = 'dummy',
  ModuleContainer = 'moduleContainer',
  GridLayout = 'grid_layout',
  Text = 'text',
}
// core traits
export enum CoreTraitName {
  Fetch = 'fetch',
  Event = 'event',
  Style = 'style',
  ArrayState = 'arrayState',
  Hidden = 'hidden',
  LocalStorage = 'localStorage',
  State = 'state',
  Slot = 'slot',
  Validation = 'validation',
}
// core widgets
export enum CoreWidgetName {
  Event = 'event',
  ArrayField = 'array',
  BooleanField = 'boolean',
  Category = 'category',
  Expression = 'expression',
  Module = 'module',
  MultiField = 'multi',
  NullField = 'null',
  NumberField = 'number',
  ObjectField = 'object',
  Popover = 'popover',
  RecordField = 'record',
  Spec = 'spec',
  StringField = 'string',
  UnsupportedField = 'unsupported',
}