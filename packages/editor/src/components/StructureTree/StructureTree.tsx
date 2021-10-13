import React, { DragEvent } from 'react';
import { Application } from '@meta-ui/core';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { eventBus } from '../../eventBus';
import {
  CreateComponentOperation,
  RemoveComponentOperation,
} from '../../operations/Operations';
import { css } from '@emotion/react';

type ChildrenMap = Map<string, SlotsMap>;
type SlotsMap = Map<string, Array<Application['spec']['components'][0]>>;
type Component = Application['spec']['components'][0];

type Props = {
  app: Application;
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
};

export const StructureTree: React.FC<Props> = props => {
  const { app, selectedComponentId, onSelectComponent } = props;
  const topLevelComponents: Component[] = [];
  const childrenMap: ChildrenMap = new Map();

  const components = app.spec.components.filter(c => c.type !== 'core/v1/dummy');
  const dataSources = app.spec.components.filter(c => c.type === 'core/v1/dummy');

  // parse components array to slotsMap
  components.forEach(c => {
    const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
    if (slotTrait) {
      const { id: parentId, slot } = slotTrait.properties.container as any;
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, new Map());
      }
      if (!childrenMap.get(parentId)?.has(slot)) {
        childrenMap.get(parentId)?.set(slot, []);
      }

      childrenMap.get(parentId)!.get(slot)!.push(c);
    } else {
      topLevelComponents.push(c);
    }
  });

  function genTreeItem(component: Component) {
    const slots = childrenMap.get(component.id);
    let slotsEle;
    if (slots) {
      slotsEle = Array.from(slots.keys()).map(slot => {
        const children = slots.get(slot)!.map(genTreeItem);
        const onDrop = (e: DragEvent) => {
          const creatingComponent = e.dataTransfer?.getData('component') || '';
          console.log('createComponent', component.id, slot, creatingComponent);
          eventBus.send(
            'operation',
            new CreateComponentOperation(component.id, slot, creatingComponent)
          );
        };
        return (
          <div key={slot}>
            <div onDrop={onDrop}>slot: {slot}</div>
            {children}
          </div>
        );
      });
    }

    const onClickRemove = () => {
      eventBus.send('operation', new RemoveComponentOperation(component.id));
    };

    return (
      <div key={component.id} style={{ paddingLeft: '16px' }}>
        <strong
          css={css`
            color: ${component.id === selectedComponentId ? 'red' : 'black'};
          `}
          onClick={() => {
            onSelectComponent(component.id);
          }}
        >
          {component.id}
        </strong>
        <IconButton aria-label="remove" icon={<DeleteIcon />} onClick={onClickRemove} />
        {slotsEle}
      </div>
    );
  }

  const topEles = topLevelComponents.map(genTreeItem);
  const dataSourcesEles = dataSources.map(genTreeItem);

  return (
    <div>
      <strong>Components</strong>
      {topEles}
      <strong>DataSources</strong>
      {dataSourcesEles}
    </div>
  );
};
