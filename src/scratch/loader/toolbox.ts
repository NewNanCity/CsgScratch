interface ICategory {
  blocks: Record<string, null | string>;
  colour: string;
  name: string;
  secondaryColour: string;
}

export const genToolbox = (categories: Record<string, ICategory>) => {
  const toolbox = document.implementation.createDocument('', '', null);
  const root = toolbox.createElement('xml');
  root.setAttribute('id', 'toolbox-categories');
  toolbox.appendChild(root);
  for (const [categoryName, { blocks, ...categoryInfo }] of Object.entries(
    categories,
  )) {
    const c = toolbox.createElement('category');
    for (const [key, value] of Object.entries(categoryInfo)) {
      c.setAttribute(key, value);
    }
    c.setAttribute('id', categoryName);
    for (const [blockName, innerXml] of Object.entries(blocks)) {
      const b = toolbox.createElement('block');
      b.setAttribute('type', blockName);
      c.appendChild(b);
      if (typeof innerXml === 'string') {
        b.innerHTML = innerXml;
      }
    }
    root.appendChild(c);
  }
  return new XMLSerializer().serializeToString(toolbox);
};
