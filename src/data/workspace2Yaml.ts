import { blocks } from './blocks';

let errorLog: (message?: any, ...optionalParams: any[]) => void = console.error;

interface IElementObject {
  tagName: string;
  textContent: string;
  children: IElementObject[];
  [propertyName: string]: any;
}

export const dom2obj = (dom: HTMLElement) => {
  const obj: IElementObject = {
    tagName: dom.tagName.toLowerCase(),
    children: [],
    textContent: '',
  };
  // get all attributes
  for (const { name, value } of Array.from(dom.attributes)) {
    obj[name] = value;
  }
  if (dom.children.length) {
    for (const child of Array.from(dom.children)) {
      obj.children.push(dom2obj(child as HTMLElement));
    }
  } else if (dom.textContent) {
    obj.textContent = dom.textContent;
  }
  return obj;
};

export const workspace2Yaml = (
  ScratchBlocks: any,
  workspace: any,
  meta: Record<string, any> = {},
  errorLog_: (message?: any, ...optionalParams: any[]) => void = errorLog,
) => {
  errorLog = errorLog_;
  meta.ScratchPositionOfControlTask ??= {};
  meta.ScratchPositionOfTrigger ??= {};
  const commentMap = {
    ct: {} as Record<string, [string | undefined, (string | undefined)[]]>,
    t: {} as Record<string, [string | undefined, (string | undefined)[]]>,
  };
  const w = dom2obj(ScratchBlocks.Xml.workspaceToDom(workspace));
  const events: Record<string, any> = {};
  const sensings: Record<string, any> = {};
  const parseBlock = (obj: IElementObject) => {
    const args: string[] = [];
    const params: Record<string, string> = {};
    let next: IElementObject | undefined;
    let comment: string | undefined;
    for (const c of obj.children) {
      switch (c.tagName) {
        case 'field': {
          args.push(c.textContent);
          params[c.name] = c.textContent;
          break;
        }
        case 'next': {
          next = c.children[0];
          break;
        }
        case 'statement':
        case 'value': {
          const s = blockToString(c.children[0], [])[0];
          args.push(s);
          params[c.name] = s;
          break;
        }
        case 'comment': {
          comment = ` ${c.textContent.trim()}`;
          break;
        }
        default: {
          errorLog(`Unknown tag: ${c.tagName}`, c);
          break;
        }
      }
    }
    return { args, params, next, comment };
  };
  const blockToString = (
    obj: IElementObject,
    comments: (string | undefined)[],
  ) => {
    const l: string[] = [];
    const t = (
      obj: IElementObject,
    ): [string, IElementObject | undefined, string | undefined] => {
      const { args, params, next, comment } = parseBlock(obj);
      if (blocks[obj.type]) {
        return [blocks[obj.type].jsonfy(args, params) as string, next, comment];
      } else {
        errorLog(`Unknown type: ${obj.type}`);
        return ['', next, comment];
      }
    };
    let x: IElementObject | undefined = obj;
    while (x) {
      const [str, next, comment] = t(x);
      x = next;
      l.push(str.trim());
      comments.push(comment);
    }
    return l;
  };
  for (const obj of w.children) {
    // 无触发是不完整的
    if (obj.tagName !== 'block') {
      continue;
    }
    const category = obj.type.split('::')[0];
    if (['Event', 'Sensing'].indexOf(category) < 0) {
      continue;
    }
    if (!blocks[obj.type]) {
      errorLog(`Unknown type ${obj.type}`);
      continue;
    }
    const { args, params, next, comment } = parseBlock(obj);
    const comments: (string | undefined)[] = [];
    const children = next ? blockToString(next, comments) : [];
    switch (category) {
      case 'Event': {
        const t = blocks[obj.type].jsonfy(args, params) as string;
        meta.ScratchPositionOfControlTask[t] = [obj.x ?? '0', obj.y ?? '0'];
        events[t] = children;
        commentMap.ct[t] = [comment, comments];
        break;
      }
      case 'Sensing': {
        const t = blocks[obj.type].jsonfy(args, params) as Record<string, any>;
        const key = Object.keys(t)[0];
        t[key].Task = children;
        meta.ScratchPositionOfTrigger[key] = [obj.x ?? '0', obj.y ?? '0'];
        sensings[key] = t[key];
        commentMap.t[key] = [comment, comments];
        break;
      }
      default: {
        break;
      }
    }
  }
  return {
    ControlTask: events,
    Trigger: sensings,
    commentMap,
  };
};
