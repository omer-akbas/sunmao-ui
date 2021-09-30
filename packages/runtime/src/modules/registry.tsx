import { RuntimeApplication, RuntimeComponent, RuntimeTrait } from '@meta-ui/core';
// components
/* --- plain --- */
import PlainButton from '../components/plain/Button';
import CoreText from '../components/core/Text';
import CoreGridLayout from '../components/core/GridLayout';
import CoreRouter from '../components/core/Router';
import CoreDummy from '../components/core/Dummy';
/* --- chakra-ui --- */
import ChakraUIRoot from '../components/chakra-ui/Root';
import ChakraUIButton from '../components/chakra-ui/Button';
import ChakraUITabs from '../components/chakra-ui/Tabs';
import ChakraUITable from '../components/chakra-ui/Table';
import ChakraUIInput from '../components/chakra-ui/Input';
import ChakraUIBox from '../components/chakra-ui/Box';
import ChakraUIFormControl from '../components/chakra-ui/Form/FormControl';
import ChakraUIForm from '../components/chakra-ui/Form/Form';
import ChakraUIKbd from '../components/chakra-ui/Kbd';
import ChakraUIList from '../components/chakra-ui/List';
import ChakraUINumberInput from '../components/chakra-ui/NumberInput';
import ChakraUICheckboxGroup from '../components/chakra-ui/CheckboxGroup';
import ChakraUICheckbox from '../components/chakra-ui/Checkbox';
import ChakraUIStack from '../components/chakra-ui/Stack';
import ChakraUITooltip from '../components/chakra-ui/Tooltip';
import ChakraUIHStack from '../components/chakra-ui/HStack';
import ChakraUIVStack from '../components/chakra-ui/VStack';
import ChakraUIImage from '../components/chakra-ui/Image';
import ChakraUIDialog from '../components/chakra-ui/Dialog';
import ChakraUISelect from '../components/chakra-ui/Select';
import ChakraUIRadioGroup from '../components/chakra-ui/RadioGroup';
import ChakraUIRadio from '../components/chakra-ui/Radio';
// traits
import CoreArrayState from '../traits/core/arrayState';
import CoreState from '../traits/core/state';
import CoreEvent from '../traits/core/event';
import CoreSlot from '../traits/core/slot';
import CoreStyle from '../traits/core/style';
import CoreHidden from '../traits/core/hidden';
import CoreFetch from '../traits/core/fetch';
import CoreValidation from '../traits/core/validation';
import { ApplicationComponent, MetaUIModules, SlotsMap } from 'src/types/RuntimeSchema';

type ImplementedRuntimeComponent = RuntimeComponent & {
  impl: ComponentImplementation;
};

type ImplementedRuntimeTrait = RuntimeTrait & {
  impl: TraitImplementation;
};

type SubscribeMethods = <U>(map: {
  [K in keyof U]: (parameters: U[K]) => void;
}) => void;
type MergeState = (partialState: any) => void;

export type CallbackMap = Record<string, () => void>;

export type ComponentMergedProps = {
  component: ApplicationComponent;
  mergeState: MergeState;
  subscribeMethods: SubscribeMethods;
  slotsMap: SlotsMap | undefined;
  style?: Record<string, any>;
  data?: Record<string, unknown>;
  callbackMap?: CallbackMap;
  effects?: Array<() => void>;
  app?: RuntimeApplication;
  mModules: MetaUIModules;
};

export type ComponentImplementation<T = any> = React.FC<T & ComponentMergedProps>;

export type TraitResult = {
  props: {
    data?: unknown;
    style?: Record<string, any>;
    callbackMap?: CallbackMap;
    effects?: Array<() => void>;
  } | null;
};

export type TraitImplementation<T = any> = (
  props: T & {
    componentId: string;
    mergeState: MergeState;
    subscribeMethods: SubscribeMethods;
    mModules: MetaUIModules;
  }
) => TraitResult;

export class Registry {
  components: Map<string, Map<string, ImplementedRuntimeComponent>> = new Map();
  traits: Map<string, Map<string, ImplementedRuntimeTrait>> = new Map();

  registerComponent(c: ImplementedRuntimeComponent) {
    if (this.components.get(c.version)?.has(c.metadata.name)) {
      throw new Error(
        `Already has component ${c.version}/${c.metadata.name} in this registry.`
      );
    }
    if (!this.components.has(c.version)) {
      this.components.set(c.version, new Map());
    }
    this.components.get(c.version)?.set(c.metadata.name, c);
  }

  getComponent(version: string, name: string): ImplementedRuntimeComponent {
    const c = this.components.get(version)?.get(name);
    if (!c) {
      throw new Error(`Component ${version}/${name} has not registered yet.`);
    }
    return c;
  }

  registerTrait(t: ImplementedRuntimeTrait) {
    if (this.traits.get(t.version)?.has(t.metadata.name)) {
      throw new Error(
        `Already has trait ${t.version}/${t.metadata.name} in this registry.`
      );
    }
    if (!this.traits.has(t.version)) {
      this.traits.set(t.version, new Map());
    }
    this.traits.get(t.version)?.set(t.metadata.name, t);
  }

  getTrait(version: string, name: string): ImplementedRuntimeTrait {
    const t = this.traits.get(version)?.get(name);
    if (!t) {
      throw new Error(`Trait ${version}/${name} has not registered yet.`);
    }
    return t;
  }
}

export function initRegistry(): Registry {
  const registry = new Registry();
  registry.registerComponent(PlainButton);
  registry.registerComponent(CoreText);
  registry.registerComponent(CoreGridLayout);
  registry.registerComponent(ChakraUIRoot);
  registry.registerComponent(ChakraUIButton);
  registry.registerComponent(ChakraUITabs);
  registry.registerComponent(ChakraUITable);
  registry.registerComponent(ChakraUIInput);
  registry.registerComponent(ChakraUIBox);
  registry.registerComponent(ChakraUIFormControl);
  registry.registerComponent(ChakraUIForm);
  registry.registerComponent(ChakraUIKbd);
  registry.registerComponent(ChakraUIList);
  registry.registerComponent(ChakraUINumberInput);
  registry.registerComponent(ChakraUICheckbox);
  registry.registerComponent(ChakraUICheckboxGroup);
  registry.registerComponent(ChakraUIStack);
  registry.registerComponent(ChakraUITooltip);
  registry.registerComponent(ChakraUIHStack);
  registry.registerComponent(ChakraUIVStack);
  registry.registerComponent(ChakraUIImage);
  registry.registerComponent(ChakraUIDialog);
  registry.registerComponent(ChakraUISelect);
  registry.registerComponent(ChakraUIRadioGroup);
  registry.registerComponent(ChakraUIRadio);
  registry.registerComponent(CoreRouter);
  registry.registerComponent(CoreDummy);

  registry.registerTrait(CoreState);
  registry.registerTrait(CoreArrayState);
  registry.registerTrait(CoreEvent);
  registry.registerTrait(CoreSlot);
  registry.registerTrait(CoreStyle);
  registry.registerTrait(CoreHidden);
  registry.registerTrait(CoreFetch);
  registry.registerTrait(CoreValidation);
  return registry;
}
