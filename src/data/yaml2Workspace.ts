/* eslint-disable max-lines */
import { blocks } from './blocks';
import { IBlockArgumentItem } from '@/scratch/define/type';

let errorLog: (message?: any, ...optionalParams: any[]) => void = console.error;

export interface IElementObject {
  tagName: string;
  textContent: string;
  children: IElementObject[];
  [propertyName: string]: any;
}

export const obj2dom = ({
  tagName,
  textContent,
  children,
  ...attrs
}: IElementObject) => {
  const dom = document.createElement(tagName);
  if (textContent) {
    dom.textContent = textContent;
  }
  for (const child of children) {
    dom.appendChild(obj2dom(child));
  }
  for (const [key, value] of Object.entries(attrs)) {
    dom.setAttribute(key, value);
  }
  return dom;
};

type BlockParser = (
  args: string[],
) => ([string, string] | [string, string, 'condition'])[];
type TriggerParser = (ids: string[]) => [string, string][];

const blockMap: Record<string, boolean> = {};
const taskmap: Record<
  string,
  [RegExp, BlockParser, string, Record<string, IBlockArgumentItem>][]
> = {};
const triggerMap: Record<
  string,
  [TriggerParser, Record<string, IBlockArgumentItem>]
> = {};
for (const [key, value] of Object.entries(blocks)) {
  blockMap[key] = true;
  if (value.parser) {
    const t = key.split('::', 3)[1];
    const fieldInfo: Record<string, IBlockArgumentItem> = {};
    for (const arg of value.args0 ?? []) {
      fieldInfo[arg.name] = arg;
    }
    taskmap[t] ??= [];
    taskmap[t].push([...value.parser, key, fieldInfo]);
  }
  if (value.triggerParser) {
    const fieldInfo: Record<string, IBlockArgumentItem> = {};
    for (const arg of value.args0 ?? []) {
      fieldInfo[arg.name] = arg;
    }
    triggerMap[key] = [value.triggerParser, fieldInfo];
  }
}

const fieldOptionSymbol = Symbol('fieldOptionSymbol');
const fieldBlock = (
  key: string,
  value: string,
  info: IBlockArgumentItem,
): IElementObject => {
  let value_ = value;
  // 类型检查
  switch (info?.type) {
    case 'field_number': {
      let v = Number(value);
      if (!Number.isFinite(v)) {
        v = Number.isFinite(info.value) ? info.value! : 0;
      }
      if (Number.isFinite(info.min)) {
        v = Math.max(info.min!, v);
      }
      if (Number.isFinite(info.max)) {
        v = Math.min(info.max!, v);
      }
      value_ = String(v);
      break;
    }
    case 'field_dropdown': {
      (info as any)[fieldOptionSymbol] ??= Array.isArray(info.options)
        ? info.options
        : info.options();
      const options = (info as any)[fieldOptionSymbol] as [string, string][];
      if (!options.some(([, v]) => v === value)) {
        value_ = options[0][1];
      }
      break;
    }
    default: {
      break;
    }
  }
  return {
    tagName: 'field',
    name: key,
    textContent: value_ ?? '',
    children: [],
  };
};

const commentBlock = (comment: string, minimize = true): IElementObject => ({
  tagName: 'comment',
  pinned: 'true',
  textContent: comment,
  minimized: minimize ? 'true' : 'false',
  children: [],
});

const valueBlock = (name: string, obj: IElementObject): IElementObject => ({
  tagName: 'value',
  name: 'condition',
  textContent: '',
  children: [obj],
});

const nextBlock = (obj: IElementObject): IElementObject => ({
  tagName: 'next',
  textContent: '',
  children: [obj],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const markBlock = (mark: string): IElementObject => ({
  tagName: 'block',
  type: 'Control::mark',
  textContent: '',
  children: [
    fieldBlock('name', mark, { type: 'field_input', text: '', name: '' }),
    {
      tagName: 'statement',
      name: 'statements',
      textContent: '',
      children: [],
    },
  ],
});

const blockEvent = (event: string, param?: string): IElementObject => {
  const type = `Event::${event}`;
  const key =
    param && blocks[type].args0?.length ? blocks[type].args0![0].name : '';
  return {
    tagName: 'block',
    textContent: '',
    type,
    children: key ? [fieldBlock(key, param!, blocks[type].args0![0])] : [],
  };
};

const blockTrigger = (
  triggerName: string,
  triggerBlockType: string,
  params?: [string, string][],
): IElementObject => {
  const fieldInfo = triggerMap[triggerBlockType]?.[1] ?? {};
  const children: IElementObject[] = [
    fieldBlock('trigger', triggerName, fieldInfo.trigger),
  ];
  if (params) {
    for (const [key, value] of params) {
      children.push(fieldBlock(key, value, fieldInfo[key]));
    }
  }
  return {
    tagName: 'block',
    textContent: '',
    type: triggerBlockType,
    children,
  };
};

const blockNormal = (type: string): IElementObject => ({
  tagName: 'block',
  type,
  textContent: '',
  children: [],
});

export const yaml2workspaceDom = (
  ControlTask: Record<string, any> = {},
  Trigger: Record<string, any>,
  meta: Record<string, any> = {},
  ctComment: (ct: string) => string | undefined,
  tComment: (t: string) => string | undefined,
  ctTaskComment: (ct: string, index: number) => string | undefined,
  tTaskComment: (t: string, index: number) => string | undefined,
  errorLog_: (message?: any, ...optionalParams: any[]) => void = console.error,
) => {
  errorLog = errorLog_;
  const blocks: IElementObject[] = [];
  meta.ScratchPositionOfControlTask ??= {};
  meta.ScratchPositionOfTrigger ??= {};
  const buildBlocks = (
    tasks: string[],
    children_: IElementObject[],
    isTrigger: boolean,
    parentNodeName: string,
  ) => {
    let children = children_;
    // 遇到 mark 时 children 要暂时改变方向，所以需要暂存
    let tChildren: IElementObject[] | undefined;
    let index = -1;
    for (const task of tasks) {
      index++;
      if (tChildren !== undefined) {
        children = tChildren;
        tChildren = undefined;
      }

      if (typeof task !== 'string') {
        errorLog('task is not string', task);
        continue;
      }

      // 单独检查mark
      let t1 = task;
      // 先前对 mark{} 语法理解有误，不需要嵌套
      //   // 可能有多个 mark
      //   while (true) {
      //     const result = /((?:^\s*mark{[^}]*}\s*)|(?:\s+mark{[^}]*}\s*))/.exec(
      //       t1,
      //     );
      //     if (!result) {
      //       break;
      //     }
      //     const mark = /mark{([^}]*)}/.exec(result[1])![1];
      //     children.push(markBlock(mark));
      //     // 暂存最外一个mark
      //     if (tChildren === undefined) {
      //       // 仅接下来的 task 会放在里面，后续还是会放在外面的
      //       tChildren = children[children.length - 1].children;
      //     }
      //     // eslint-disable-next-line prefer-destructuring
      //     children = children[children.length - 1].children[1].children;
      //     t1 = t1.replace(result[1], ' ');
      //   }
      t1 = t1.trim();

      const parsers = taskmap[t1.split('{', 2)[0]];
      if (!parsers) {
        errorLog('no parser for', task);
        continue;
      }
      let matchCount = -1;
      let type = '';
      let func: BlockParser | undefined;
      let result: RegExpExecArray | null = null;
      let fieldInfo: Record<string, IBlockArgumentItem> = {};
      for (const [regex, func_, type_, fieldInfo_] of parsers) {
        const result_ = regex.exec(task);
        if (result_ && result_.length > matchCount) {
          matchCount = result_.length;
          type = type_;
          result = result_;
          func = func_;
          fieldInfo = fieldInfo_;
        }
      }
      if (!result || !func) {
        errorLog('no match for', task);
        continue;
      }
      const [, ...matches] = result;
      const fields = func(matches.map(s => (s ? s.trim() : '')));

      const block = blockNormal(type);
      const comment = isTrigger
        ? tTaskComment(parentNodeName, index)
        : ctTaskComment(parentNodeName, index);
      if (comment !== undefined) {
        block.children.push(commentBlock(comment, true));
      }
      // 看现在是在 mark 中还是普通的块连接
      if (tChildren === undefined) {
        children.push(nextBlock(block));
        // eslint-disable-next-line prefer-destructuring
        children = children[children.length - 1].children[0].children;
      } else {
        children.push(block);
        // eslint-disable-next-line prefer-destructuring
        children = children[children.length - 1].children;
      }

      for (const f of fields) {
        if (f[2] === 'condition') {
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          const parseCondition = (
            str: string,
            field: string,
            children: IElementObject[],
          ) => {
            // // xxx&yyy
            // if (str.indexOf('&') >= 0) {
            //   const b = blockNormal('Operators::and');
            //   const [left, right] = str.split('&', 2);
            //   parseCondition(left.trim(), 'left', b.children);
            //   parseCondition(right.trim(), 'right', b.children);
            //   children.push(valueBlock(field, b));
            //   return;
            // }
            // // xxx|yyy
            // if (str.indexOf('|') >= 0) {
            //   const b = blockNormal('Operators::or');
            //   const [left, right] = str.split('|', 2);
            //   parseCondition(left.trim(), 'left', b.children);
            //   parseCondition(right.trim(), 'right', b.children);
            //   children.push(valueBlock(field, b));
            //   return;
            // }

            // xxx=/!=yyy
            const result1 =
              /\s*(Permission|InGroup|minLevel|maxLevel|minLife|maxLife)\s*([!]?=)\s*(\S.*)/.exec(
                str,
              );
            if (result1) {
              const [, type, op, value] = result1;
              switch (type) {
                case 'Permission': {
                  const b = blockNormal('Operators::check_permission');
                  b.children.push(
                    fieldBlock('type', op.trim(), fieldInfo.type),
                  );
                  b.children.push(
                    fieldBlock(
                      'permission',
                      value.trim(),
                      fieldInfo.permission,
                    ),
                  );
                  children.push(valueBlock(field, b));
                  break;
                }
                case 'InGroup': {
                  const b = blockNormal('Operators::check_group');
                  b.children.push(
                    fieldBlock('type', op.trim(), fieldInfo.type),
                  );
                  b.children.push(
                    fieldBlock('group', value.trim(), fieldInfo.group),
                  );
                  children.push(valueBlock(field, b));
                  break;
                }
                default: {
                  if (op === '=') {
                    const b = blockNormal('Operators::check_hplevel');
                    b.children.push(
                      fieldBlock('type', type.trim(), fieldInfo.type),
                    );
                    b.children.push(
                      fieldBlock('value', value.trim(), fieldInfo.value),
                    );
                    children.push(valueBlock(field, b));
                  }
                  break;
                }
              }
              return;
            }
            // xxx=/!=/BIG/SMALLyyy
            const result2 =
              /(<[^>]+>|-?\d+(?:\.\d+)?|\|\[\s*d?cal\s*=[^\]]+\]\|)\s*(!=|=|BIG|SMALL)\s*(<[^>]+>|-?\d+(?:\.\d+)?|\|\[\s*d?cal\s*=[^\]]+\]\|)/.exec(
                str,
              );
            if (result2) {
              const [, left, op, right] = result2;
              const type = {
                '=': 'Operators::equal',
                '!=': 'Operators::not_equal',
                BIG: 'Operators::greater_than',
                SMALL: 'Operators::less_than',
              }[op]!;
              const b = blockNormal(type.trim());
              b.children.push(fieldBlock('left', left.trim(), fieldInfo.left));
              b.children.push(
                fieldBlock('right', right.trim(), fieldInfo.right),
              );
              children.push(valueBlock(field, b));
              return;
            }
            errorLog('Cannot parse', str, 'of', task);
          };
          parseCondition(f[1], f[0], children);
        } else {
          children.push(fieldBlock(f[0], f[1], fieldInfo[f[0]]));
        }
      }
    }
  };

  // ControlTask
  for (const [ctName, ct] of Object.entries(ControlTask)) {
    if (typeof ctName !== 'string' || (ct && !Array.isArray(ct))) {
      errorLog(`Invalid ControlTask: ${ctName}`);
      continue;
    }
    const result = /^\s*([^(]+)(?:\(([^)]+)\))?\s*/.exec(ctName);
    if (!result) {
      errorLog(`Invalid ControlTask: ${ctName}`);
      continue;
    }
    const [, event, param] = result;
    if (!blockMap[`Event::${event}`]) {
      errorLog(`Invalid control task block type: ${event}`);
      continue;
    }
    const block = blockEvent(event, param);
    const [x, y] = meta.ScratchPositionOfControlTask[event] ?? ['0', '0'];
    block.x = x;
    block.y = y;
    const comment = ctComment(ctName);
    if (comment !== undefined) {
      block.children.push(commentBlock(comment.trim(), false));
    }
    blocks.push(block);
    if (ct) {
      buildBlocks(ct, block.children, false, ctName);
    }
  }

  // Trigger
  for (const [tName, trigger] of Object.entries(Trigger)) {
    if (
      typeof tName !== 'string' ||
      !trigger ||
      typeof trigger !== 'object' ||
      typeof trigger.Type !== 'string' ||
      (trigger.Id && !Array.isArray(trigger.Id)) ||
      (trigger.Task && !Array.isArray(trigger.Task))
    ) {
      errorLog(`Invalid Trigger: ${tName}`);
      continue;
    }
    const triggerType: string = trigger.Type;
    const triggerIds: string[] = trigger.Id;
    let triggerBlockType = `Sensing::${triggerType}`;
    if (
      trigger.Id?.length > 1 &&
      ['WalkOutRegion', 'WalkInRegion'].indexOf(triggerType) >= 0
    ) {
      triggerBlockType = `${triggerBlockType}::Complex`;
    }

    if (!blockMap[triggerBlockType]) {
      errorLog(`Invalid trigger block type: ${triggerType} of ${tName}`);
      continue;
    }

    const triggerParams = triggerIds
      ? triggerMap[triggerBlockType]?.[0]?.(triggerIds) ?? []
      : [];
    const block = blockTrigger(
      tName,
      triggerBlockType,
      triggerParams.map(s => [s[0], s[1].trim()]),
    );
    const [x, y] = meta.ScratchPositionOfTrigger[tName] ?? ['0', '0'];
    block.x = x;
    block.y = y;
    const comment = tComment(tName);
    if (comment !== undefined) {
      block.children.push(commentBlock(comment.trim(), false));
    }
    blocks.push(block);
    if (trigger.Task) {
      buildBlocks(trigger.Task, block.children, true, tName);
    }
  }

  return obj2dom({
    tagName: 'xml',
    textContent: '',
    children: [
      { tagName: 'variables', textContent: '', children: [] },
      ...blocks,
    ],
  });
};
/* eslint-enable max-lines */
