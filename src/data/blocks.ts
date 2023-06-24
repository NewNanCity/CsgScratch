/* eslint-disable max-lines */
import * as BlockDefine from '@/scratch/define';

const taskTemplate: BlockDefine.IBlockRegisterProps = {
  category: BlockDefine.ScratchBlockCategory.Motion,
  extensions: ['colours_motion', 'shape_statement'],
};

const eventTemplate: BlockDefine.IBlockRegisterProps = {
  category: BlockDefine.ScratchBlockCategory.Event,
  extensions: ['colours_event', 'shape_hat'],
};

type MyBlockRegisterProps = BlockDefine.IBlockRegisterProps & {
  jsonfy: (
    args: string[],
    params: Record<string, string>,
  ) => string | Record<string, any>;
  parser?: [
    RegExp,
    (args: string[]) => ([string, string] | [string, string, 'condition'])[],
  ];
  triggerParser?: (ids: string[]) => [string, string][];
};

const commandStringify = (s: string) =>
  s.replace(/{/g, '|[').replace(/}/g, ']|');
const commandParse = (s: string) =>
  s.replace(/\|\[/g, '{').replace(/\]\|/g, '}');

export const blocks: Record<string, MyBlockRegisterProps> = {
  // 任务
  'Task::command': {
    tooltip: '令目标无视权限执行指令(无需/前缀)',
    message0: '令 %1 无视权限执行 %2',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'command' },
    ],
    ...taskTemplate,
    jsonfy: ([t, c]) => `command{${commandStringify(c)}} ${t}`,
    parser: [
      /^\s*command{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t ?? '@p'],
        ['command', commandParse(c)],
      ],
    ],
  },
  'Task::consolecommand': {
    tooltip: '在控制台执行指令',
    message0: '针对目标 %1 ，在控制台执行 %2',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'command' },
    ],
    ...taskTemplate,
    jsonfy: ([t, c]) => `consolecommand{${commandStringify(c)}} ${t}`,
    parser: [
      /^\s*consolecommand{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t ?? '@p'],
        ['command', commandParse(c)],
      ],
    ],
  },
  'Task::setblock': {
    tooltip: '放置方块',
    message0:
      '在 %1 世界的 (%2,%3,%4) 坐标放置类型为 %5 的方块，如果世界不存在则放在 %6 所在的世界',
    args0: [
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x' },
      { type: 'field_number', value: 0, precision: 1, name: 'y' },
      { type: 'field_number', value: 0, precision: 1, name: 'z' },
      { type: 'field_input', text: '', name: 'block' },
      { type: 'field_input', text: '@p', name: 'target' },
    ],
    ...taskTemplate,
    jsonfy: ([w, x, y, z, b, t]) => `setblock{${b},${x} ${y} ${z} ${w}} ${t}`,
    parser: [
      /^\s*setblock{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => {
        const [block, cord] = c.split(',', 2);
        const [x, y, z, w] = cord.trim().split(/(?:,\s*)|(?:\s+)/, 4);
        return [
          ['world', w],
          ['x', x],
          ['y', y],
          ['z', z],
          ['block', block],
          ['target', t],
        ];
      },
    ],
  },
  'Task::damage': {
    tooltip: '对目标造成一定量伤害',
    message0: '对目标 %1 造成 %2 伤害',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_number', value: 0, min: 0, name: 'amount' },
    ],
    ...taskTemplate,
    jsonfy: ([t, a]) => `damage{${a}} ${t}`,
    parser: [
      /^\s*damage{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['amount', c],
      ],
    ],
  },
  'Task::food': {
    tooltip: '对目标回复一定饱值',
    message0: '对目标 %1 回复 %2 饱值',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_number', value: 0, min: 0, name: 'amount' },
    ],
    ...taskTemplate,
    jsonfy: ([t, a]) => `food{${a}} ${t}`,
    parser: [
      /^\s*food{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['amount', c],
      ],
    ],
  },
  'Task::heal': {
    tooltip: '对目标回复一定生命值',
    message0: '对目标 %1 回复 %2 生命值',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_number', value: 0, min: 0, name: 'amount' },
    ],
    ...taskTemplate,
    jsonfy: ([t, a]) => `heal{${a}} ${t}`,
    parser: [
      /^\s*heal{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['amount', c],
      ],
    ],
  },
  'Task::sethp': {
    tooltip: '设置目标生命值',
    message0: '设置目标 %1 生命值为 %2',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_number', value: 0, min: 0, precision: 1, name: 'value' },
    ],
    ...taskTemplate,
    jsonfy: ([t, v]) => `sethp{${v}} ${t}`,
    parser: [
      /^\s*sethp{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['value', c],
      ],
    ],
  },
  'Task::maxhp': {
    tooltip: '设置目标最大生命值',
    message0: '设置目标 %1 最大生命值为 %2',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_number', value: 0, min: 0, precision: 1, name: 'value' },
    ],
    ...taskTemplate,
    jsonfy: ([t, v]) => `maxhp{${v}} ${t}`,
    parser: [
      /^\s*maxhp{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['value', c],
      ],
    ],
  },
  // https://minecraft.fandom.com/zh/wiki/%E5%91%BD%E4%BB%A4/effect
  'Task::potion': {
    tooltip: '给目标添加药水效果',
    message0: '给目标 %1 添加 %2 效果，持续 %3 秒，等级 %4',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'effect' },
      {
        type: 'field_number',
        value: 1,
        min: 0,
        precision: 1,
        name: 'duration',
      },
      {
        type: 'field_number',
        value: 1,
        min: 0,
        precision: 1,
        name: 'amplifier',
      },
    ],
    ...taskTemplate,
    jsonfy: ([t, e, d, a]) => `potion{${e},${d},${a}} ${t}`,
    parser: [
      /^\s*potion{([^,]+),([^,]+),([^}]+)}\s*(\S+.+)?/,
      ([e, d, a, t]) => [
        ['target', t],
        ['effect', e],
        ['duration', d],
        ['amplifier', a],
      ],
    ],
  },
  'Task::teleport': {
    tooltip: '将目标传送到指定地点',
    message0: '将目标 %1 传送到 %2 世界的 (%3,%4,%5) 坐标',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x' },
      { type: 'field_number', value: 0, precision: 1, name: 'y' },
      { type: 'field_number', value: 0, precision: 1, name: 'z' },
    ],
    ...taskTemplate,
    jsonfy: ([t, w, x, y, z]) => `teleport{${x} ${y} ${z} ${w}} ${t}`,
    parser: [
      /^\s*teleport{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => {
        const [x, y, z, w] = c.trim().split(/(?:,\s*)|(?:\s+)/, 4);
        return [
          ['target', t],
          ['world', w],
          ['x', x],
          ['y', y],
          ['z', z],
        ];
      },
    ],
  },
  'Task::spawnmob': {
    tooltip: '在指定地点生成 MythicMobs 的生物',
    message0: '在 %1 世界的 (%2,%3,%4) 坐标生成 %5 个 %6 (MythicMobs)',
    args0: [
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x' },
      { type: 'field_number', value: 0, precision: 1, name: 'y' },
      { type: 'field_number', value: 0, precision: 1, name: 'z' },
      { type: 'field_number', value: 1, precision: 1, name: 'a', min: 0 },
      { type: 'field_input', text: '', name: 'mob' },
    ],
    ...taskTemplate,
    jsonfy: ([w, x, y, z, a, m]) => `spawnmob{${m},${a},${x} ${y} ${z} ${w}}`,
    parser: [
      /^\s*spawnmob{([^}]+)}/,
      ([t]) => {
        const [m, a, c] = t.split(',', 3);
        const [x, y, z, w] = c.trim().split(/(?:,\s*)|(?:\s+)/, 4);
        return [
          ['world', w],
          ['x', x],
          ['y', y],
          ['z', z],
          ['a', a],
          ['mob', m],
        ];
      },
    ],
  },
  'Task::removemobs': {
    tooltip: '移除指定范围内的生物(除了玩家与村民)',
    message0:
      '移除 %1 世界的 (%2,%3,%4)-(%5,%6,%7) 区域内的生物(除了玩家与村民)',
    args0: [
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x1' },
      { type: 'field_number', value: 0, precision: 1, name: 'y1' },
      { type: 'field_number', value: 0, precision: 1, name: 'z1' },
      { type: 'field_number', value: 0, precision: 1, name: 'x2' },
      { type: 'field_number', value: 0, precision: 1, name: 'y2' },
      { type: 'field_number', value: 0, precision: 1, name: 'z2' },
    ],
    ...taskTemplate,
    jsonfy: ([w, x1, y1, z1, x2, y2, z2]) =>
      `removemobs{${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${w}}`,
    parser: [
      /^\s*removemobs{([^}]+)}/,
      ([c]) => {
        const [x1, y1, z1, x2, y2, z2, w] = c
          .trim()
          .split(/(?:,\s*)|(?:\s+)/, 7);
        return [
          ['world', w],
          ['x1', x1],
          ['y1', y1],
          ['z1', z1],
          ['x2', x2],
          ['y2', y2],
          ['z2', z2],
        ];
      },
    ],
  },
  'Task::checkprice': {
    tooltip: '检查玩家是否有进入队伍所要求的的物品',
    message0: '检查玩家 %1 是否有进入队伍所要求的的物品，没有就退出游戏，%2',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      {
        type: 'field_dropdown',
        options: [
          ['消耗物品', 'true'],
          ['不消耗物品', 'false'],
        ],
        name: 'consume',
      },
    ],
    ...taskTemplate,
    jsonfy: ([t, c]) => `checkprice{${c}} ${t}`,
    parser: [
      /^\s*checkprice{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['consume', c],
      ],
    ],
  },
  'Task::title': {
    tooltip: '在玩家屏幕上显示标题',
    message0:
      '在玩家 %1 屏幕上显示标题 %2，副标题 %3，持续 %4 秒，淡入 %5 秒，淡出 %6 秒',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'title' },
      { type: 'field_input', text: '', name: 'subtitle' },
      { type: 'field_number', value: 3, min: 0, name: 'duration' },
      { type: 'field_number', value: 0.5, min: 0, name: 'fadeIn' },
      { type: 'field_number', value: 0.5, min: 0, name: 'fadeOut' },
    ],
    ...taskTemplate,
    jsonfy: ([t, ti, st, d, fi, fo]) =>
      `title{${ti},${st},${d},${fi},${fo}} ${t}`,
    parser: [
      /^\s*title{([^}]*)}\s*(\S+.+)?/,
      ([p, t]) => {
        const [ti, st, d, fi, fo] = p.split(',', 5);
        return [
          ['target', t],
          ['title', ti],
          ['subtitle', st],
          ['duration', d],
          ['fadeIn', fi],
          ['fadeOut', fo],
        ];
      },
    ],
  },
  'Task::notice': {
    tooltip: '给本队伍内的所有玩家发送一个消息，出现在聊天栏',
    message0: '给本队伍内的所有玩家发消息: %1',
    args0: [{ type: 'field_input', text: '', name: 'message' }],
    ...taskTemplate,
    jsonfy: ([m]) => `notice{${m}}`,
    parser: [/^\s*notice{([^}]+)}/, ([m]) => [['message', m]]],
  },
  'Task::globalnotice': {
    tooltip: '给本游戏所有玩家发送一个消息，出现在聊天栏',
    message0: '给本游戏所有玩家发消息: %1',
    args0: [{ type: 'field_input', text: '', name: 'message' }],
    ...taskTemplate,
    jsonfy: ([m]) => `globalnotice{${m}}`,
    parser: [/^\s*globalnotice{([^}]+)}/, ([m]) => [['message', m]]],
  },
  'Task::tell': {
    tooltip: '给指定目标发送一个消息，出现在聊天栏',
    message0: '给目标 %1 发消息: %2 (@e相当于全局发送)',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'message' },
    ],
    ...taskTemplate,
    jsonfy: ([t, m]) => `tell{${m}} ${t}`,
    parser: [
      /^\s*tell{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['message', c],
      ],
    ],
  },
  'Task::say': {
    tooltip: '让目标以自己的身份发一消息',
    message0: '让目标 %1 以自己的身份发消息: %2',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'message' },
    ],
    ...taskTemplate,
    jsonfy: ([t, m]) => `say{${m}} ${t}`,
    parser: [
      /^\s*say{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['message', c],
      ],
    ],
  },
  'Task::addhologram': {
    tooltip: '在指定地点添加一个全息字',
    message0:
      '在 %1 世界的 (%2,%3,%4) 坐标添加全息字 %5, id 为 %6 (会替换同id的全息字)',
    args0: [
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x' },
      { type: 'field_number', value: 0, precision: 1, name: 'y' },
      { type: 'field_number', value: 0, precision: 1, name: 'z' },
      { type: 'field_input', text: '', name: 'text' },
      { type: 'field_input', text: '', name: 'id' },
    ],
    ...taskTemplate,
    jsonfy: ([w, x, y, z, t, i]) =>
      `addhologram{${x} ${y} ${z} ${w},${i},${t}}`,
    parser: [
      /^\s*addhologram{([^}]+)}/,
      ([tt]) => {
        const ttt = tt.split(',');
        const t = ttt.pop() ?? '';
        const i = ttt.pop() ?? '';
        const [x, y, z, w] = (ttt.join(' ').trim() ?? '0 0 0').split(
          /(?:,\s*)|(?:\s+)/,
          4,
        );
        return [
          ['world', w],
          ['x', x],
          ['y', y],
          ['z', z],
          ['text', t],
          ['id', i],
        ];
      },
    ],
  },
  'Task::edithologram': {
    tooltip: '编辑指定id的全息字',
    message0: '编辑id 为 %1 的全息字，内容为 %2',
    args0: [
      { type: 'field_input', text: '', name: 'id' },
      { type: 'field_input', text: '', name: 'text' },
    ],
    ...taskTemplate,
    jsonfy: ([i, t]) => `edithologram{${i},${t}}`,
    parser: [
      /^\s*edithologram{([^,]+),([^}]+)}/,
      ([i, t]) => [
        ['id', i],
        ['text', t],
      ],
    ],
  },
  'Task::delhologram': {
    tooltip: '删除指定id的全息字',
    message0: '删除id 为 %1 的全息字',
    args0: [{ type: 'field_input', text: '', name: 'id' }],
    ...taskTemplate,
    jsonfy: ([i]) => `delhologram{${i}}`,
    parser: [/^\s*delhologram{([^}]+)}/, ([i]) => [['id', i]]],
  },
  'Task::clearhologram': {
    tooltip: '删除该队伍的所有全息字',
    message0: '删除该队伍的所有全息字',
    ...taskTemplate,
    jsonfy: () => 'clearhologram{}',
    parser: [/^\s*clearhologram{[^}]*}/, () => []],
  },
  'Task::respond': {
    tooltip: '调用队伍/游戏内的函数',
    message0: '以 %1 的身份调用 %2 内的函数 %3',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      {
        type: 'field_dropdown',
        options: [
          ['队伍内', 'respond'],
          ['游戏内', 'globalrespond'],
        ],
        name: 'type',
      },
      { type: 'field_input', text: '', name: 'password' },
    ],
    ...taskTemplate,
    jsonfy: ([t, ty, p]) => `${ty}{${p}} ${t}`,
    parser: [
      /^\s*(respond|globalrespond){([^}]+)}\s*(\S+.+)?/,
      ([ty, p, t]) => [
        ['target', t],
        ['type', ty],
        ['password', p],
      ],
    ],
  },
  'Task::respond::condition': {
    tooltip: '调用队伍内/游戏内的函数(有条件)',
    message0: '在 %1 时，以 %2 的身份调用 %3 内的函数 %4',
    args0: [
      { type: 'input_value', name: 'condition', check: 'Boolean' },
      { type: 'field_input', text: '@p', name: 'target' },
      {
        type: 'field_dropdown',
        options: [
          ['队伍内', 'respond'],
          ['游戏内', 'globalrespond'],
        ],
        name: 'type',
      },
      { type: 'field_input', text: '', name: 'password' },
    ],
    ...taskTemplate,
    jsonfy: ([c, t, ty, p]) => `${ty}{${p},${c}} ${t}`,
    parser: [
      /^\s*(respond|globalrespond){([^,]+),([^}]+)}\s*(\S+.+)?/,
      ([ty, c, p, t]) => [
        ['condition', c, 'condition'],
        ['target', t],
        ['type', ty],
        ['password', p],
      ],
    ],
  },
  'Task::divide': {
    tooltip: '把当前队伍内所有玩家平均分配到每一个填写的队伍',
    message0:
      '把当前队伍内所有玩家平均分配到 %1 队伍中(逗号分隔,可以重复以调整概率)',
    args0: [{ type: 'field_input', text: '', name: 'teams' }],
    ...taskTemplate,
    jsonfy: ([t]) => `divide{${t}}`,
    parser: [/^\s*divide{([^}]+)}/, ([t]) => [['teams', t]]],
  },
  'Task::enabletrigger': {
    tooltip: '启用指定的触发器',
    message0: '启用触发器 %1 (all为全部)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...taskTemplate,
    jsonfy: ([t]) => `enabletrigger{${t}}`,
    parser: [/^\s*enabletrigger{([^}]+)}/, ([t]) => [['trigger', t]]],
  },
  'Task::disabletrigger': {
    tooltip: '禁用指定的触发器',
    message0: '禁用触发器 %1 (all为全部)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...taskTemplate,
    jsonfy: ([t]) => `disabletrigger{${t}}`,
    parser: [/^\s*disabletrigger{([^}]+)}/, ([t]) => [['trigger', t]]],
  },
  'Task::midjoin': {
    tooltip: '设置游戏的中途加入机制',
    message0: '%1 玩家中途加入游戏',
    args0: [
      {
        type: 'field_dropdown',
        options: [
          ['允许', 'true'],
          ['禁止', 'false'],
        ],
        name: 'type',
      },
    ],
    ...taskTemplate,
    jsonfy: ([t]) => `midjoin{${t}}`,
    parser: [/^\s*midjoin{([^}]+)}/, ([t]) => [['type', t]]],
  },
  'Task::join': {
    tooltip: '令一个玩家从当前队伍跳转到本游戏的其他的队伍',
    message0: '令玩家 %1 从当前队伍跳转到 %2 队伍',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'team' },
    ],
    ...taskTemplate,
    jsonfy: ([t, tm]) => `join{${tm}} ${t}`,
    parser: [
      /^\s*join{([^}]+)}\s*(\S+.+)?/,
      ([tm, t]) => [
        ['team', tm],
        ['target', t],
      ],
    ],
  },
  'Task::leave': {
    tooltip: '令一个玩家离开当前队伍',
    message0: '令玩家 %1 离开当前队伍',
    args0: [{ type: 'field_input', text: '@p', name: 'target' }],
    ...taskTemplate,
    jsonfy: ([t]) => `leave{} ${t}`,
    parser: [/^\s*leave{[^}]*}\s*(\S+.+)?/, ([t]) => [['target', t]]],
  },
  'Task::taskitem': {
    tooltip: '给予目标一个物品执行器',
    message0:
      '给予目标 %1 一个物品执行器 %2，放入背包的空闲位置(空间不足则不给予)',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'item' },
    ],
    ...taskTemplate,
    jsonfy: ([t, i]) => `taskitem{${i}} ${t}`,
    parser: [
      /^\s*taskitem{([^}]+)}\s*(\S+.+)?/,
      ([i, t]) => [
        ['item', i],
        ['target', t],
      ],
    ],
  },
  'Task::taskitem::at': {
    tooltip: '在背包指定位置给予目标一个物品执行器',
    message0:
      '给予目标 %1 一个物品执行器 %2，放入背包的 %3 (0-35)位置(空间不足则强行覆盖)',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'item' },
      {
        type: 'field_number',
        value: 0,
        min: 0,
        max: 35,
        precision: 1,
        name: 'slot',
      },
    ],
    ...taskTemplate,
    jsonfy: ([t, i, s]) => `taskitem{${i},${s}} ${t}`,
    parser: [
      /^\s*taskitem{([^,]+),([^}]+)}\s*(\S+.+)?/,
      ([i, s, t]) => [
        ['target', t],
        ['item', i],
        ['slot', s],
      ],
    ],
  },
  // 控制
  'Control::delay': {
    tooltip: '延迟一定时间后执行下一个任务',
    message0: '延迟 %1 秒',
    args0: [
      {
        type: 'field_number',
        value: 1,
        min: 0,
        precision: 1,
        name: 'duration',
      },
    ],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([d]) => `delay{${d}}`,
    parser: [/^\s*delay{([^}]+)}/, ([d]) => [['duration', d]]],
  },
  'Control::end': {
    tooltip: '结束后续任务的执行',
    message0: '结束执行',
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_end'],
    jsonfy: () => 'end{}',
    parser: [/^\s*end{\s*}/, () => []],
  },
  'Control::end::condition': {
    tooltip: '如果条件为真则结束后续任务的执行',
    message0: '对于目标 %1 如果 %2 则结束执行',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'input_value', name: 'condition', check: 'Boolean' },
    ],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([t, c]) => `end{${c}} ${t}`,
    parser: [
      /^\s*end{([^}]+)}\s*(\S+.+)?/,
      ([c, t]) => [
        ['target', t],
        ['condition', c, 'condition'],
      ],
    ],
  },
  'Control::stopgame': {
    tooltip: '停止游戏，清空玩家',
    message0: '停止游戏，清空玩家',
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_end'],
    jsonfy: () => 'stopgame{}',
    parser: [/^\s*stopgame{\s*}/, () => []],
  },
  'Control::endwhenclear': {
    tooltip: '当队伍中没有玩家时, 结束后续任务的执行',
    message0: '当队伍中没有玩家时, 结束执行',
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: () => 'endwhenclear{}',
    parser: [/^\s*endwhenclear{\s*}/, () => []],
  },
  'Control::check_or_consume_item': {
    tooltip: '检查玩家是否有要求的的物品, 不满足就不继续执行后续任务',
    message0:
      '%1 玩家 %2 的物品 %3("关键词_数量"多个逗号分隔)，不满足就停止执行',
    args0: [
      {
        type: 'field_dropdown',
        options: [
          ['检查', 'check'],
          ['消耗', 'consume'],
        ],
        name: 'type',
      },
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '@p', name: 'item' },
    ],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([tp, t, c]) => `${tp}{${c}} ${t}`,
    parser: [
      /^\s*(check|consume){([^}]+)}\s*(\S+.+)?/,
      ([tp, i, t]) => [
        ['type', tp],
        ['target', t],
        ['item', i],
      ],
    ],
  },
  'Control::nametask': {
    tooltip: '为任务队列命名',
    message0: '命名任务队列: %1',
    args0: [{ type: 'field_input', text: '', name: 'name' }],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([n]) => `nametask{${n}}`,
    parser: [/^\s*nametask{([^}]+)}/, ([n]) => [['name', n]]],
  },
  'Control::stoptask': {
    tooltip: '停止指定的任务队列',
    message0: '停止任务队列: %1',
    args0: [{ type: 'field_input', text: '', name: 'name' }],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([n]) => `stoptask{${n}}`,
    parser: [/^\s*stoptask{([^}]+)}/, ([n]) => [['name', n]]],
  },
  'Control::mark': {
    tooltip: '为某个任务添加标记，用于 goto 跳转',
    message0: '设置标记 %1',
    args0: [{ type: 'field_input', text: '', name: 'name' }],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([n]) => `mark{${n}}`,
    parser: [/^\s*mark{([^}]+)}/, ([n]) => [['name', n]]],
  },
  'Control::goto': {
    tooltip: '跳转到某个标记',
    message0: '跳转到标记 %1',
    args0: [{ type: 'field_input', text: '', name: 'name' }],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([m]) => `goto{${m}}`,
    parser: [/^\s*goto{([^}]+)}/, ([m]) => [['name', m]]],
  },
  'Control::goto::condition': {
    tooltip: '如果条件为真则跳转到某个标记',
    message0: '对于目标 %1 如果 %2 则跳转到标记 %3',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'input_value', name: 'condition', check: 'Boolean' },
      { type: 'field_input', text: '', name: 'name' },
    ],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([t, c, m]) => `goto{${m},${c}} ${t}`,
    parser: [
      /^\s*goto{([^},]+),([^}]+)}\s*(\S+.+)?/,
      ([m, c, t]) => [
        ['target', t],
        ['condition', c, 'condition'],
        ['name', m],
      ],
    ],
  },
  'Control::skip': {
    tooltip: '当条件满足，跳过若干行执行任务，即if',
    message0: '对于目标 %1 如果 %2 则跳过 %3 行',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'input_value', name: 'condition', check: 'Boolean' },
      { type: 'field_number', value: 1, min: 0, precision: 1, name: 'count' },
    ],
    category: BlockDefine.ScratchBlockCategory.Control,
    extensions: ['colours_control', 'shape_statement'],
    jsonfy: ([t, c, n]) => `skip{${n},${c}} ${t}`,
    parser: [
      /^\s*skip{([^},]+),([^}]+)}\s*(\S+.+)?/,
      ([n, c, t]) => [
        ['target', t],
        ['condition', c, 'condition'],
        ['count', n],
      ],
    ],
  },
  // Operator
  'Operator::and': {
    tooltip: '判断两个条件是否同时为真',
    message0: '%1 并且 %2',
    args0: [
      { type: 'input_value', name: 'left', check: 'Boolean' },
      { type: 'input_value', name: 'right', check: 'Boolean' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([l, r]) => `${l}&${r}`,
  },
  'Operator::or': {
    tooltip: '判断两个条件是否有一个为真',
    message0: '%1 或者 %2',
    args0: [
      { type: 'input_value', name: 'left', check: 'Boolean' },
      { type: 'input_value', name: 'right', check: 'Boolean' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([l, r]) => `${l}|${r}`,
  },
  'Operators::equal': {
    tooltip: '判断两个值是否相等',
    message0: '%1 = %2',
    args0: [
      { type: 'field_input', text: '', name: 'left' },
      { type: 'field_input', text: '', name: 'right' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([l, r]) => `${l}=${r}`,
  },
  'Operators::not_equal': {
    tooltip: '判断两个值是否不相等',
    message0: '%1 ≠ %2',
    args0: [
      { type: 'field_input', text: '', name: 'left' },
      { type: 'field_input', text: '', name: 'right' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([l, r]) => `${l}!=${r}`,
  },
  'Operators::greater_than': {
    tooltip: '判断左边的值是否大于右边的值',
    message0: '%1 > %2',
    args0: [
      { type: 'field_input', text: '', name: 'left' },
      { type: 'field_input', text: '', name: 'right' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([l, r]) => `${l}BIG${r}`,
  },
  'Operators::leaser_than': {
    tooltip: '判断左边的值是否小于右边的值',
    message0: '%1 < %2',
    args0: [
      { type: 'field_input', text: '', name: 'left' },
      { type: 'field_input', text: '', name: 'right' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([l, r]) => `${l}SMALL${r}`,
  },
  'Operators::check_permission': {
    tooltip: '检查触发者是否有/没有权限',
    message0: '触发者 %1 权限 %2?',
    args0: [
      {
        type: 'field_dropdown',
        options: [
          ['有', '='],
          ['没有', '!='],
        ],
        name: 'type',
      },
      { type: 'field_input', text: '', name: 'permission' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([t, p]) => `Permission${t}${p}`,
  },
  'Operators::check_group': {
    tooltip: '检查触发者是否在/不在队伍中',
    message0: '触发者 %1 队伍 %2 中?',
    args0: [
      {
        type: 'field_dropdown',
        options: [
          ['在', '='],
          ['不在', '!='],
        ],
        name: 'type',
      },
      { type: 'field_input', text: '', name: 'group' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([t, g]) => `InGroup${t}${g}`,
  },
  'Operators::check_hplevel': {
    tooltip: '检查触发者的最大/最小生命值/经验值',
    message0: '触发者 %1 为 %2?',
    args0: [
      {
        type: 'field_dropdown',
        options: [
          ['最小等级', 'minLevel'],
          ['最大等级', 'maxLevel'],
          ['最小生命', 'minLife'],
          ['最大生命', 'maxLife'],
        ],
        name: 'type',
      },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Operators,
    extensions: ['colours_operators', 'output_boolean'],
    jsonfy: ([t, v]) => `${t}=${v}`,
  },
  // Data
  'Data::data': {
    tooltip: '设置一个全局可用的变量',
    message0: '设置全局变量 data.%1 为 %2',
    args0: [
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([k, v]) => `data{${k},${v}}`,
    parser: [
      /^\s*data{([^,]+),([^}]+)}/,
      ([k, v]) => [
        ['key', k],
        ['value', v],
      ],
    ],
  },
  'Data::tag': {
    tooltip: '设置一个局部变量',
    message0: '设置局部变量 tag.%1 为 %2 (本队伍内可用)',
    args0: [
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([k, v]) => `tag{${k},${v}}`,
    parser: [
      /^\s*tag{([^,]+),([^}]+)}/,
      ([k, v]) => [
        ['key', k],
        ['value', v],
      ],
    ],
  },
  'Data::placeholder': {
    tooltip: '设置一个PlaceholderAPI占位符',
    message0: '设置PAPI占位符 %%fw<游戏名>_%1%% 为 %2',
    args0: [
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([k, v]) => `placeholder{${k},${v}}`,
    parser: [
      /^\s*placeholder{([^,]+),([^}]+)}/,
      ([k, v]) => [
        ['key', k],
        ['value', v],
      ],
    ],
  },
  'Data::timer': {
    tooltip: '设置一个计时器',
    message0: '设置一个 id 为 %1 的计时器，倒计时 %2 秒',
    args0: [
      { type: 'field_input', text: '', name: 'id' },
      {
        type: 'field_number',
        value: 1,
        min: 0,
        precision: 1,
        name: 'duration',
      },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([i, d]) => `timer{${i},${d}}`,
    parser: [
      /^\s*timer{([^,]+),([^}]+)}/,
      ([i, d]) => [
        ['id', i],
        ['duration', d],
      ],
    ],
  },
  'Data::playervalue': {
    tooltip: '设置玩家在队伍内的变量',
    message0: '设置玩家 %1 在队伍内的变量 %2 为 %3 (其他人/队伍/游戏不可见)',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([t, k, v]) => `playervalue{${k},${v}} ${t}`,
    parser: [
      /^\s*playervalue{([^,]+),([^}]+)}\s*(\S+.+)?/,
      ([k, v, t]) => [
        ['target', t],
        ['key', k],
        ['value', v],
      ],
    ],
  },
  'Data:globalplayervalue': {
    tooltip: '设置玩家在游戏内的变量',
    message0:
      '设置玩家 %1 在游戏内的变量 %2 为 %3 (其他人/队伍不可见,同游戏可见)',
    args0: [
      { type: 'field_input', text: '@p', name: 'target' },
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([t, k, v]) => `globalplayervalue{${k},${v}} ${t}`,
    parser: [
      /^\s*globalplayervalue{([^,]+),([^}]+)}\s*(\S+.+)?/,
      ([k, v, t]) => [
        ['target', t],
        ['key', k],
        ['value', v],
      ],
    ],
  },
  'Data::value': {
    tooltip: '设置一个队伍内的变量',
    message0: '设置队伍内的变量 %1 为 %2 (其他世界/队伍不可见,同队伍可见)',
    args0: [
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([k, v]) => `value{${k},${v}}`,
    parser: [
      /^\s*value{([^,]+),([^}]+)}/,
      ([k, v]) => [
        ['key', k],
        ['value', v],
      ],
    ],
  },
  'Data::globalvalue': {
    tooltip: '设置一个游戏内的变量',
    message0: '设置游戏内的变量 %1 为 %2 (同游戏可见)',
    args0: [
      { type: 'field_input', text: '', name: 'key' },
      { type: 'field_input', text: '', name: 'value' },
    ],
    category: BlockDefine.ScratchBlockCategory.Data,
    extensions: ['colours_data', 'shape_statement'],
    jsonfy: ([k, v]) => `globalvalue{${k},${v}}`,
    parser: [
      /^\s*globalvalue{([^,]+),([^}]+)}/,
      ([k, v]) => [
        ['key', k],
        ['value', v],
      ],
    ],
  },
  // Event
  'Event::onGroupStart': {
    tooltip: '在队伍开始运作(即等待结束)时执行',
    message0: '在队伍开始运作(即等待结束) [限非自由加入]',
    ...eventTemplate,
    jsonfy: () => 'onGroupStart',
  },
  'Event::onPlayerJoin': {
    tooltip: '在一名玩家加入队伍时执行',
    message0: '当玩家加入队伍 (@p等可用)',
    ...eventTemplate,
    jsonfy: () => 'onPlayerJoin',
  },
  'Event::onPlayerMidJoin': {
    tooltip: '在一名玩家中途加入队伍时执行',
    message0: '当玩家中途加入队伍 (@p等可用)',
    ...eventTemplate,
    jsonfy: () => 'onPlayerJoin',
  },
  'Event::onPlayerLeave': {
    tooltip: '在一名玩家离开队伍时执行',
    message0: '当玩家离开队伍 (@p等可用)',
    ...eventTemplate,
    jsonfy: () => 'onPlayerLeave',
  },
  'Event::onPlayerRest': {
    tooltip: '在队伍中仅剩余一定玩家时执行',
    message0: '当队伍中仅剩 %1 名玩家时 (0 等于队伍解散)',
    args0: [
      { type: 'field_number', value: 1, min: 0, precision: 1, name: 'count' },
    ],
    ...eventTemplate,
    jsonfy: ([c]) => `onPlayerRest(${c})`,
  },
  'Event::onEverySecond': {
    tooltip: '每秒执行一次',
    message0: '每秒执行 (对于非自由加入队伍,仅在游戏开始时间执行)',
    ...eventTemplate,
    jsonfy: () => 'onEverySecond',
  },
  'Event::onTimePast': {
    tooltip: '在队伍离最长激活时间还剩一定秒数时执行',
    message0: '当队伍离最长激活时间剩余 %1 秒时 [限非自由加入]',
    args0: [
      { type: 'field_number', value: 60, min: 0, precision: 1, name: 'second' },
    ],
    ...eventTemplate,
    jsonfy: ([s]) => `onTimePast(${s})`,
  },
  'Event::onLobbyTimePast': {
    tooltip: '在队伍等待开始时间剩余一定秒数时执行',
    message0: '当队伍等待开始时间剩余 %1 秒时 [限非自由加入]',
    args0: [
      { type: 'field_number', value: 60, min: 0, precision: 1, name: 'second' },
    ],
    ...eventTemplate,
    jsonfy: ([s]) => `onLobbyTimePast(${s})`,
  },
  'Event::onPlayerJoinFailed': {
    tooltip: '在玩家加入队伍失败时执行',
    message0: '当玩家加入队伍失败时 (@p不可用,用@t代替)',
    ...eventTemplate,
    jsonfy: () => 'onPlayerJoinFailed',
  },
  'Event::onPlayerEnough': {
    tooltip: '在队伍等待时，玩家达到最小人数(可开始倒计时)时触发',
    message0: '当玩家达到最小人数(可开始倒计时)时 [限非自由加入]',
    ...eventTemplate,
    jsonfy: () => 'onPlayerEnough',
  },
  'Event::onPlayerFull': {
    tooltip: '在队伍等待时，玩家达到最大人数时触发',
    message0: '当玩家达到最大人数时触发 [限非自由加入]',
    ...eventTemplate,
    jsonfy: () => 'onPlayerFull',
  },
  'Event::onPlayerLeaveInWaiting': {
    tooltip: '当一名玩家在游戏正在等待开始时离开队伍，则会执行',
    message0:
      '当玩家在离开自由加入的队伍/游戏正等待开始时离开队伍时 (@p等可用) (在onPlayerLeave之前触发)',
    ...eventTemplate,
    jsonfy: () => 'onPlayerLeaveInWaiting',
  },
  'Event::onGroupLoaded': {
    tooltip: '当一个队伍加载时执行',
    message0: '当一个队伍加载时(服务器启动、插件重载)执行',
    ...eventTemplate,
    jsonfy: () => 'onGroupLoaded',
  },
  // Sensing
  'Sensing::BreakBlock': {
    tooltip: '当玩家破坏方块时执行(无论是否破坏成功)',
    message0:
      '[触发器名 %1] 当玩家破坏类型为 %2 的方块时(无论是否破坏成功) (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'block' },
    ],
    ...eventTemplate,
    jsonfy: ([t, b]) => ({ [t]: { Type: 'BreakBlock', Id: [b] } }),
    triggerParser: ([b]) => [['block', b]],
  },
  'Sensing::Death': {
    tooltip: '当玩家死亡时执行',
    message0: '[触发器名 %1] \n 当玩家死亡时 (@p等可用)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'Death' } }),
  },
  'Sensing::DamagePlayer': {
    tooltip: '在伤害一名玩家时触发',
    message0:
      '[触发器名 %1] \n 当玩家受到伤害时 (@p等可用) (提供value.damage变量)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'DamagePlayer' } }),
  },
  'Sensing::Damaged': {
    tooltip: '在玩家被伤害时触发',
    message0:
      '[触发器名 %1] \n 当玩家被伤害时 (@p等可用) (提供value.damage变量)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'Damaged' } }),
  },
  'Sensing::DamageEntity': {
    tooltip: '在伤害指定名字怪物时触发',
    message0:
      '[触发器名 %1] \n 当伤害名字包含 %2 的怪物时 (@p等可用) (提供value.damage变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'entity' },
    ],
    ...eventTemplate,
    jsonfy: ([t, e]) => ({ [t]: { Type: 'DamageEntity', Id: [e] } }),
    triggerParser: ([e]) => [['entity', e]],
  },
  'Sensing::Diss': {
    tooltip: '在队列因外部原因被迫解散时触发',
    message0: '[触发器名 %1] \n 当队列因外部原因被迫解散时',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'Diss' } }),
  },
  'Sensing::Interact': {
    tooltip: '在一名队列内玩家与另一名玩家 (或NPC) 交互时触发',
    message0:
      '[触发器名 %1] \n 当玩家与id为 %2 的玩家/NPC 交互时 (@p等可用) (提供value.Interacted变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'id' },
    ],
    ...eventTemplate,
    jsonfy: ([t, i]) => ({ [t]: { Type: 'Interact', Id: [i] } }),
    triggerParser: ([i]) => [['id', i]],
  },
  'Sensing::InteractBlock::id': {
    tooltip: '在一名队伍内玩家交互(右键)特定方块时触发',
    message0:
      '[触发器名 %1] \n 当玩家与id为 %2 的方块交互时 (@p等可用) (提供value.BlockName变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'id' },
    ],
    ...eventTemplate,
    jsonfy: ([t, i]) => ({ [t]: { Type: 'InteractBlock', Id: [i] } }),
    triggerParser: ([i]) => [['id', i]],
  },
  'Sensing::InteractBlock::cord': {
    tooltip: '在一名队伍内玩家交互(右键)特定方块时触发',
    message0:
      '[触发器名 %1] \n 当玩家与 %2 世界中坐标为 (%3,%4,%5) 的方块交互时 (@p等可用) (提供value.BlockName变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x' },
      { type: 'field_number', value: 0, precision: 1, name: 'y' },
      { type: 'field_number', value: 0, precision: 1, name: 'z' },
    ],
    ...eventTemplate,
    jsonfy: ([t, w, x, y, z]) => ({
      [t]: { Type: 'InteractBlock', Id: [`${x} ${y} ${z} ${w}`] },
    }),
    triggerParser: ([c]) => {
      const [x, y, z, w] = (c ?? '0 0 0').trim().split(/(?:,\s*)|(?:\s+)/, 4);
      return [
        ['world', w ?? ''],
        ['x', x],
        ['y', y],
        ['z', z],
      ];
    },
  },
  'Sensing::KillEntity': {
    tooltip: '在一名玩家击杀指定名字的怪物时触发',
    message0: '[触发器名 %1] \n 当玩家击杀名字包含 %2 的怪物时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'entity' },
    ],
    ...eventTemplate,
    jsonfy: ([t, e]) => ({ [t]: { Type: 'KillEntity', Id: [e] } }),
    triggerParser: ([e]) => [['entity', e]],
  },
  'Sensing::KillAllEntity': {
    tooltip: '在击杀场内所有指定名字的怪物时触发',
    message0: '[触发器名 %1] \n 当击杀场内任何名字包含 %2 的怪物时',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'entity' },
    ],
    ...eventTemplate,
    jsonfy: ([t, e]) => ({ [t]: { Type: 'KillAllEntity', Id: [e] } }),
    triggerParser: ([e]) => [['entity', e]],
  },
  'Sensing::KillPlayer': {
    tooltip: '在一名玩家击杀另一名玩家时触发',
    message0: '[触发器名 %1] \n 当玩家击杀另一名玩家时 (@p等可用)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'KillPlayer' } }),
  },
  'Sensing::Offline': {
    tooltip: '在玩家断开连接时触发',
    message0: '[触发器名 %1] \n 当玩家断开连接时 (@p等可用)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'Offline' } }),
  },
  'Sensing::PickupItem': {
    tooltip: '在一名玩家捡起指定物品ID的物品时触发',
    message0:
      '[触发器名 %1] \n 当玩家捡起类型为 %2 的物品时 (@p等可用) (提供value.ItemID/ItemAmount变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'item' },
    ],
    ...eventTemplate,
    jsonfy: ([t, i]) => ({ [t]: { Type: 'PickupItem', Id: [i] } }),
    triggerParser: ([i]) => [['item', i]],
  },
  'Sensing::Respond': {
    tooltip: '调用对应函数时触发',
    message0: '[触发器名 %1] \n 当调用 %2 函数时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'function' },
    ],
    ...eventTemplate,
    jsonfy: ([t, f]) => ({ [t]: { Type: 'Respond', Id: [f] } }),
    triggerParser: ([f]) => [['function', f]],
  },
  'Sensing::Sneak': {
    tooltip: '在一名玩家下蹲/起立时执行',
    message0: '[触发器名 %1] \n 当玩家下蹲/起立时 (@p等可用)',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'Sneak' } }),
  },
  'Sensing::SendCommand': {
    tooltip: '在一名玩家发送指令时触发',
    message0:
      '[触发器名 %1] \n 当玩家发送包含 %2 的根指令(多根指令可空格分开写)时 (@p可用) (提供value.<根指令>_<序数>(从0开始)>变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'rootCommand' },
    ],
    ...eventTemplate,
    jsonfy: ([t, r]) => ({
      [t]: { Type: 'SendCommand', Id: r.split(/\s+/).filter(s => s) },
    }),
    triggerParser: roots => [['rootCommand', roots.join(' ').trim()]],
  },
  'Sensing::TimeUp': {
    tooltip: '在指定计时器（可以使用timer{}自定义计时器）计时结束时触发',
    message0: '[触发器名 %1] \n 当计时器 %2 计时结束时',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'timer' },
    ],
    ...eventTemplate,
    jsonfy: ([t, r]) => ({ [t]: { Type: 'TimeUp', Id: [r] } }),
    triggerParser: ([t]) => [['timer', t]],
  },
  'Sensing::TimeUp::GroupTimer': {
    tooltip: '在队伍游戏时长(GroupTimer)结束而强制解散时触发',
    message0: '[触发器名 %1] \n 当队伍达到最长激活时间而强制解散时',
    args0: [{ type: 'field_input', text: '', name: 'trigger' }],
    ...eventTemplate,
    jsonfy: ([t]) => ({ [t]: { Type: 'TimeUp' } }),
  },
  'Sensing::WalkOnBlock': {
    tooltip: '在一名玩家踩到指定ID的方块时触发。若一直踩着，触发间隔为1秒',
    message0:
      '[触发器名 %1] \n 当玩家踩到id为 %2 的方块时 (@p等可用) (提供value.BlockID变量)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'block' },
    ],
    ...eventTemplate,
    jsonfy: ([t, b]) => ({ [t]: { Type: 'WalkOnBlock', Id: [b] } }),
    triggerParser: ([b]) => [['block', b]],
  },
  'Sensing::WalkInRegion': {
    tooltip: '在一名玩家进入指定的区域时触发。若一直在区域内，触发间隔为1秒',
    message0:
      '[触发器名 %1] \n 当玩家进入 %2 世界的 (%3,%4,%5)-(%6,%7,%8) 区域时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x1' },
      { type: 'field_number', value: 0, precision: 1, name: 'y1' },
      { type: 'field_number', value: 0, precision: 1, name: 'z1' },
      { type: 'field_number', value: 0, precision: 1, name: 'x2' },
      { type: 'field_number', value: 0, precision: 1, name: 'y2' },
      { type: 'field_number', value: 0, precision: 1, name: 'z2' },
    ],
    ...eventTemplate,
    jsonfy: ([t, w, x1, y1, z1, x2, y2, z2]) => ({
      [t]: {
        Type: 'WalkInRegion',
        Id: [`${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${w}`],
      },
    }),
    triggerParser: ([c]) => {
      const [x1, y1, z1, x2, y2, z2, w] = (c ?? '')
        .trim()
        .split(/(?:,\s*)|(?:\s+)/, 7);
      return [
        ['world', w ?? ''],
        ['x1', x1],
        ['y1', y1],
        ['z1', z1],
        ['x2', x2],
        ['y2', y2],
        ['z2', z2],
      ];
    },
  },
  'Sensing::WalkInRegion::Complex': {
    tooltip:
      '在一名玩家进入多个指定的区域时触发。若一直在区域内，触发间隔为1秒',
    message0:
      '[触发器名 %1] \n 当玩家进入 %2 (x1 y1 z1 x2 y2 z2 world格式，逗号分隔)多个区域时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'cords' },
    ],
    ...eventTemplate,
    jsonfy: ([t, c]) => ({
      [t]: {
        Type: 'WalkInRegion',
        Id: c
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
      },
    }),
    triggerParser: cords => [
      [
        'cords',
        cords
          .map(s => s.trim())
          .filter(s => s)
          .join(','),
      ],
    ],
  },
  'Sensing::WalkOutRegion': {
    tooltip: '在一名玩家进入指定ID的区域时触发。若一直在区域内，触发间隔为1秒',
    message0:
      '[触发器名 %1] \n 当玩家离开 %2 世界的 (%3,%4,%5)-(%6,%7,%8) 区域时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'world' },
      { type: 'field_number', value: 0, precision: 1, name: 'x1' },
      { type: 'field_number', value: 0, precision: 1, name: 'y1' },
      { type: 'field_number', value: 0, precision: 1, name: 'z1' },
      { type: 'field_number', value: 0, precision: 1, name: 'x2' },
      { type: 'field_number', value: 0, precision: 1, name: 'y2' },
      { type: 'field_number', value: 0, precision: 1, name: 'z2' },
    ],
    ...eventTemplate,
    jsonfy: ([t, w, x1, y1, z1, x2, y2, z2]) => ({
      [t]: {
        Type: 'WalkOutRegion',
        Id: [`${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${w}`],
      },
    }),
    triggerParser: ([c]) => {
      const [x1, y1, z1, x2, y2, z2, w] = (c ?? '')
        .trim()
        .split(/(?:,\s*)|(?:\s+)/, 7);
      return [
        ['world', w ?? ''],
        ['x1', x1],
        ['y1', y1],
        ['z1', z1],
        ['x2', x2],
        ['y2', y2],
        ['z2', z2],
      ];
    },
  },
  'Sensing::WalkOutRegion::Complex': {
    tooltip: '在一名玩家进入指定ID的区域时触发。若一直在区域内，触发间隔为1秒',
    message0:
      '[触发器名 %1] \n 当玩家离开 %2 (x1 y1 z1 x2 y2 z2 world格式，逗号分隔)多个区域时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'cords' },
    ],
    ...eventTemplate,
    jsonfy: ([t, c]) => ({
      [t]: {
        Type: 'WalkOutRegion',
        Id: c
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
      },
    }),
    triggerParser: cords => [
      [
        'cords',
        cords
          .map(s => s.trim())
          .filter(s => s)
          .join(','),
      ],
    ],
  },
  'Sensing::VexClickButton': {
    tooltip:
      '在一名队伍内玩家单击VexView中的一个按钮时触发(可以通过输入/fw vexview后点击按钮，来查看您点击的按钮ID)',
    message0:
      '[触发器名 %1] \n 当队伍中玩家单击VexView中的 %2 按钮时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'button' },
    ],
    ...eventTemplate,
    jsonfy: ([t, b]) => ({ [t]: { Type: 'VexClickButton', Id: [b] } }),
    triggerParser: ([b]) => [['button', b]],
  },
  'Sensing::VexKeyPressed': {
    tooltip: '在一名队伍内玩家点击一个键盘按键时触发(基于VexView)',
    message0: '[触发器名 %1] \n 当队伍中玩家点击键盘按键 %2 时 (@p等可用)',
    args0: [
      { type: 'field_input', text: '', name: 'trigger' },
      { type: 'field_input', text: '', name: 'key' },
    ],
    ...eventTemplate,
    jsonfy: ([t, k]) => ({ [t]: { Type: 'VexKeyPressed', Id: [k] } }),
    triggerParser: ([k]) => [['key', k]],
  },
};

export const defineBlocks = (ScratchBlocks: any) => {
  for (const [blockType, blockProps] of Object.entries(blocks)) {
    BlockDefine.defineBlock(ScratchBlocks, blockType, blockProps);
  }
};
/* eslint-enable max-lines */
