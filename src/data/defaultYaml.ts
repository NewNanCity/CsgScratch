export default `# 队伍名
Display: 红队
# 该队伍是否是默认队伍(组)，一个游戏有且仅有一个默认队伍
DefaultGroup: false
# 当玩家在游戏中途(已经开始)后进入游戏时，是否会加入本队伍
MidJoinGroup: false
# 队伍最多包含几个玩家
MaxPlayer: 4
# 激活队伍至少需要几个玩家
MinPlayer: 1
# 是否允许自由加入。如果开启，任何加入的玩家将直接激活队伍(onGroupStart)。
FreeJoin: false

# 时间设置
Timer:
  # 队伍在人没有满的情况下，等待多少秒之后激活队伍(onGroupStart)(最小值是1)
  LobbyTime: 120
  # 队伍人满了的情况下，等待多少秒之后激活队伍(onGroupStart)(最小值是1)
  Full_LobbyTime: 60
  # 队伍(最长)激活秒数，到时间就结束踢人(onPlayerRest(0))并解散队伍
  ArenaTime: 18000

# 设置一些队伍的特定位置
Locations:
  # 玩家在哪里等待队伍激活(等待大厅)
  Waiting:
    - -102 64 64 fb
  # 队伍解散后把玩家传送到哪里
  Leaves:
    - -863 5 1334 world
  # 玩家死亡的重生地点
  Respawn:
    - -94 64 64 fb
  # 队伍激活时把玩家传送到哪里
  Arena:
    - -94 64 64 fb

# 加入队伍的需求
JoinPrice:
  # 是否自动检查这些需求，如果不自动检查就需要手动检查
  AutoCheck: true
  # 玩家只要有足够的就可以，但不会消耗
  Need:
    # 金钱(Vault插件)
    Money: 0
    # 点券(PlayerPoints插件)
    Points: 5
    # 等级
    Level: 50
    # 体力值(CustomGo-Tili)
    Tili: 0
    # 物品。格式："物品DisplayName_数量" 多个物品用逗号连接,数量必须小于最大叠加
    # 物品名包含关键词即可('之书'可以允许'智慧之书'和'速度之书'), 但是不同物品不能合起来算
    Items: 之书_1,梦境碎片_20

  # 需要消耗的物品
  # 如果要消耗的量大于 Need 中对应的，那么以 Need 的值为准
  Consume:
    # 金钱(Vault插件)
    Money: 0
    # 点券(PlayerPoints插件)
    Points: 5
    # 等级
    Level: 0
    # 体力值(CustomGo-Tili)
    Tili: 0
    # 同上
    Items: 梦境碎片_20

# 队伍设定
PlayerRule:
  # 队内玩家头顶上名字的前缀。该项设置不可超过16字符。支持颜色代码。
  Prefix: 大厅
  # 队伍内玩家头顶上名字显示状态。
  #   0: 任何人无法看到队伍内玩家的名字。
  #   1: 只有队伍内玩家可以互相看到名字。
  #   2: 游戏内都能看到队伍内玩家的名字。
  NameInvisible: 0
  # 是否允许攻击队友
  PvP: false
  # PvP 为 false 时，攻击队友时打人的一方收到的通知，none是不显示
  PvPMessage: none # 禁止攻击队友!
  # 队伍内是否允许溅射药水影响。
  Potionhit: true
  # Potionhit 为 false 时，药水溅射到队友时扔出药水的人收到的通知，none是不显示
  PotionHitMessage: none # 禁止用药水砸队友!
  # 队伍内是否允许弹射物伤害。
  Projectile: true
  # Projectile 为 false 时，弹射物打到队友时，射人的一方收到的通知，none是不显示
  ProjectileMessage: none # 禁止射击队友!
  # 是否强制队伍聊天。
  ChatInGroup: false
  # 是否允许携带物品进入队伍。如果关闭，背包或装备有东西的人禁止加入。
  CanBringItem: true
  # 是否删除游戏物品。如果开启，离开队伍的人将会被清空背包。
  DelGameItem: false
  # 自定义队伍内聊天格式。
  #   %player%为玩家名
  #   %message%为消息内容
  #   %group%为玩家所在队伍显示名
  #   %type%为消息类型(全游戏 或 队伍内)
  ChatInGroupFormat: '&e[%type%]< &7%group% &e%player% > &r%message%'
  # 这里设置玩家在队伍中允许使用的指令。除此之外一切指令在游戏内禁用。可以通配符
  WhiteListCommand:
    - say
    - tell
    - help
    - nnp help
    - nnp help *
  # 不知道干啥的
  HighPriority: false

# 任务控制与触发器部分
ControlTask:
  onGroupLoaded:
  # 队伍被加载时(服务器启动、新的脚本载入等) 一般来讲都会需要的初始化工作
    - enabletrigger{all} # 激活所有触发器，一般会这样做除非你希望自定义触发器的开启时机
    - midjoin{false} # 不允许中途加入游戏
Trigger:
  限定玩家区域:
  # 防止玩家跑出游戏区域，记得修改坐标！
    Type: WalkOutRegion
    Id:
      - 0 0 0 10 255 10 world
    Task:
      - teleport{0 0 0 world} @p
      - title{&c你不可以离开游戏区域!,你已被传送回来} @p

# CsgScratch 编辑器的相关信息，与 Csg 本身无关
CsgScratchMeta: '{"ScratchPositionOfControlTask":{"onGroupLoaded":["30","60"]},"ScratchPositionOfTrigger":{"限定玩家区域":["30","310"]}}'`;
