import { SoulBeast } from '../types/game';

export const SOUL_BEASTS_DB: SoulBeast[] = [
  // =========================================================================
  // 1. 星斗大森林 · 外围区 (100 ~ 2,500 年)
  // =========================================================================
  {
    id: 'wind_baboon',
    name: '风狒狒',
    chineseName: '风狒狒',
    minYears: 100,
    maxYears: 400,
    years: 280,
    color: 'yellow',
    habitat: 'outer',
    description: '敏捷性灵长类魂兽，擅长在树冠间飞速跳跃，口中能喷吐凌厉的风刃远程袭敌！',
    element: 'physical',
    level: 8,
    hp: 360,
    maxHp: 360,
    atk: 32,
    def: 15,
    speed: 35,
    skills: [
      { name: '风刃撕咬', description: '口吐锋锐风刃并配合敏捷扑击', damageMultiplier: 1.2 },
      { name: '灵猿跃步', description: '在树干间疾速借力转向，提高闪避并突袭', damageMultiplier: 1.4 }
    ],
    dropRing: {
      skillNameTemplate: '风刃天翔斩',
      skillDescTemplate: '凝聚风刃疾速切击目标，造成 {dmg}% 伤害并提升自身速度 20%，持续2回合。',
      multiplier: 1.3
    },
    dropItems: [
      { itemId: 'baboon_fur', name: '风狒狒坚韧皮毛', dropRate: 0.85, count: 2 },
      { itemId: 'low_spirit_ore', name: '初级寒铁矿', dropRate: 0.5, count: 2 }
    ]
  },
  {
    id: 'nether_wolf',
    name: '幽冥狼',
    chineseName: '幽冥狼',
    minYears: 120,
    maxYears: 450,
    years: 380,
    color: 'yellow',
    habitat: 'outer',
    description: '残忍狡诈的群体猎杀者，利齿带有阴暗毒素，在黑夜中战斗力倍增。',
    element: 'dark',
    level: 10,
    hp: 450,
    maxHp: 450,
    atk: 38,
    def: 18,
    speed: 30,
    skills: [
      { name: '幽冥撕咬', description: '附带暗影毒素的獠牙撕咬伤口', damageMultiplier: 1.2, effect: 'bleed' },
      { name: '暗影突袭', description: '化作黑影扑击敌人破绽', damageMultiplier: 1.5 }
    ],
    dropRing: {
      skillNameTemplate: '幽冥撕天爪',
      skillDescTemplate: '引动幽冥暗劲快速撕裂敌方，造成 {dmg}% 伤害并附加流血效果。',
      multiplier: 1.4
    },
    dropItems: [
      { itemId: 'wolf_fang', name: '幽冥狼锐齿', dropRate: 0.8, count: 2 },
      { itemId: 'low_spirit_ore', name: '初级寒铁矿', dropRate: 0.5, count: 3 }
    ]
  },
  {
    id: 'mandala_snake',
    name: '曼陀罗蛇',
    chineseName: '曼陀罗蛇',
    minYears: 400,
    maxYears: 900,
    years: 423,
    color: 'yellow',
    habitat: 'outer',
    description: '唐三第一魂环来源！蛇鳞坚硬如铁，剧毒无比，具备极强的神经麻痹毒素！',
    element: 'poison',
    level: 15,
    hp: 850,
    maxHp: 850,
    atk: 55,
    def: 35,
    speed: 38,
    skills: [
      { name: '剧毒喷射', description: '喷射曼陀罗神经麻痹剧毒', damageMultiplier: 1.3, effect: 'poison' },
      { name: '巨蟒绞杀', description: '坚韧蛇身发动致命紧缩绞杀', damageMultiplier: 1.6, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '缠绕 · 曼陀罗蛇毒附体',
      skillDescTemplate: '召唤坚韧带毒的蓝银草死死缠绕敌人，造成 {dmg}% 伤害并附带麻痹眩晕1回合。',
      multiplier: 1.6
    },
    dropItems: [
      { itemId: 'snake_gall', name: '曼陀罗蛇胆', dropRate: 0.9, count: 1 },
      { itemId: 'poison_sac', name: '魔蛛毒腺', dropRate: 0.7, count: 2 }
    ]
  },
  {
    id: 'lone_bamboo',
    name: '孤竹',
    chineseName: '孤竹',
    minYears: 300,
    maxYears: 800,
    years: 520,
    color: 'yellow',
    habitat: 'outer',
    description: '极为坚韧的植物类魂兽，不主动攻击，但能反弹一切物理碰撞伤害。',
    element: 'plant',
    level: 14,
    hp: 1100,
    maxHp: 1100,
    atk: 30,
    def: 60,
    speed: 15,
    skills: [
      { name: '竹节反震', description: '将受到的物理冲击反弹给攻击者', damageMultiplier: 1.1 },
      { name: '青竹磐石', description: '坚固躯干大幅提升自身防御', damageMultiplier: 1.0 }
    ],
    dropRing: {
      skillNameTemplate: '坚韧 · 青竹反震护壁',
      skillDescTemplate: '引动植物本源，提升防御 35% 并获得相当于自身伤害 {dmg}% 的反伤护盾。',
      multiplier: 1.4
    },
    dropItems: [
      { itemId: 'bamboo_core', name: '百年孤竹心', dropRate: 0.8, count: 1 },
      { itemId: 'spirit_herb_leaf', name: '青灵草叶', dropRate: 0.6, count: 3 }
    ]
  },
  {
    id: 'ghost_vine',
    name: '鬼藤',
    chineseName: '鬼藤',
    minYears: 500,
    maxYears: 1000,
    years: 600,
    color: 'yellow',
    habitat: 'outer',
    description: '唐三第二魂环来源！捕食性植物魂兽，能释放无数带倒钩的毒刺进行寄生与神经破坏。',
    element: 'plant',
    level: 18,
    hp: 1200,
    maxHp: 1200,
    atk: 62,
    def: 40,
    speed: 25,
    skills: [
      { name: '鬼藤寄生', description: '刺入毒刺造成持续神经毒素', damageMultiplier: 1.4, effect: 'poison' },
      { name: '尖刺乱舞', description: '舞动带刺鬼藤疯狂抽打', damageMultiplier: 1.6 }
    ],
    dropRing: {
      skillNameTemplate: '寄生 · 鬼藤毒刺爆裂',
      skillDescTemplate: '在目标身上播撒微不可见的寄生种子，引爆造成 {dmg}% 伤害并附带持续剧毒伤害。',
      multiplier: 1.7
    },
    dropItems: [
      { itemId: 'ghost_vine_root', name: '鬼藤主根', dropRate: 0.9, count: 1 },
      { itemId: 'paralyze_spikes', name: '麻痹倒钩刺', dropRate: 0.75, count: 3 }
    ]
  },
  {
    id: 'diamond_baboon',
    name: '金刚狒狒',
    chineseName: '金刚狒狒',
    minYears: 600,
    maxYears: 1200,
    years: 850,
    color: 'yellow',
    habitat: 'outer',
    description: '力大无穷的狂暴巨兽，筋骨如钢，双拳砸地能引发剧烈碎石震波！',
    element: 'physical',
    level: 20,
    hp: 1400,
    maxHp: 1400,
    atk: 82,
    def: 50,
    speed: 32,
    skills: [
      { name: '金刚重锤', description: '双臂暴涨重击地面', damageMultiplier: 1.6, effect: 'stun' },
      { name: '狂暴怒吼', description: '怒吼激发潜能提升攻击力', damageMultiplier: 1.2 }
    ],
    dropRing: {
      skillNameTemplate: '金刚破岳击',
      skillDescTemplate: '汇聚全身蛮力轰击目标，造成 {dmg}% 物理伤害，并有几率击晕对手1回合。',
      multiplier: 1.75
    },
    dropItems: [
      { itemId: 'baboon_bone', name: '金刚骨核', dropRate: 0.8, count: 1 },
      { itemId: 'spirit_iron_ore', name: '沉银原矿', dropRate: 0.6, count: 2 }
    ]
  },
  {
    id: 'thunder_spider',
    name: '雷蛛',
    chineseName: '雷蛛',
    minYears: 1000,
    maxYears: 2000,
    years: 1500,
    color: 'purple',
    habitat: 'outer',
    description: '千年雷电蛛魔，喷射带有高压雷电的导电蛛网，将猎物电击至麻痹！',
    element: 'thunder',
    level: 22,
    hp: 1550,
    maxHp: 1550,
    atk: 88,
    def: 42,
    speed: 48,
    skills: [
      { name: '雷电缠丝', description: '吐出带有电弧的蛛丝限制敌方行动', damageMultiplier: 1.4, effect: 'paralyze' },
      { name: '雷霆穿刺', description: '蛛足尖端放电突刺', damageMultiplier: 1.7 }
    ],
    dropRing: {
      skillNameTemplate: '雷网天牢 · 麻痹轰雷',
      skillDescTemplate: '引落雷霆电网笼罩战场，造成 {dmg}% 雷系伤害并有 60% 概率麻痹对手。',
      multiplier: 1.8
    },
    dropItems: [
      { itemId: 'thunder_silk', name: '带电蛛丝', dropRate: 0.85, count: 2 },
      { itemId: 'thunder_core_low', name: '初级雷晶', dropRate: 0.5, count: 1 }
    ]
  },
  {
    id: 'cockscomb_snake',
    name: '凤尾鸡冠蛇',
    chineseName: '凤尾鸡冠蛇',
    minYears: 1300,
    maxYears: 2500,
    years: 1800,
    color: 'purple',
    habitat: 'outer',
    description: '奥斯卡第三魂环来源！以无与伦比的飞行极速著称，鸡冠蕴含纯净的大补精元。',
    element: 'plant',
    level: 25,
    hp: 1600,
    maxHp: 1600,
    atk: 85,
    def: 45,
    speed: 65,
    skills: [
      { name: '七彩雾影', description: '释放炫目红光干扰敌人视线', damageMultiplier: 1.1 },
      { name: '超音速冲刺', description: '借助冠肉双翼以极速撞击对手', damageMultiplier: 1.8 }
    ],
    dropRing: {
      skillNameTemplate: '凤尾神翔 · 极速飞翔蘑菇肠',
      skillDescTemplate: '借助凤尾鸡冠蛇之翼提升速度与闪避 40%，且下次攻击必定暴击！',
      multiplier: 1.85
    },
    dropItems: [
      { itemId: 'phoenix_crest', name: '凤尾鸡冠蛇肉冠', dropRate: 0.9, count: 1 },
      { itemId: 'swift_feather', name: '风灵羽', dropRate: 0.6, count: 4 }
    ]
  },

  // =========================================================================
  // 2. 星斗大森林 · 混合区 (3,000 ~ 25,000 年)
  // =========================================================================
  {
    id: 'man_faced_spider',
    name: '人面魔蛛',
    chineseName: '人面魔蛛',
    minYears: 2000,
    maxYears: 8000,
    years: 3200,
    color: 'purple',
    habitat: 'middle',
    description: '唐三第三魂环与八蛛矛来源！一切魂兽的噩梦，拥有八根如钢铁长矛般的蛛腿与腐蚀一切的剧毒。',
    element: 'poison',
    level: 35,
    hp: 3500,
    maxHp: 3500,
    atk: 160,
    def: 95,
    speed: 55,
    skills: [
      { name: '腐蚀蛛网吐息', description: '喷吐粘稠腐蚀剧毒蛛网', damageMultiplier: 1.5, effect: 'poison' },
      { name: '蛛矛穿心刺', description: '八根钢矛蛛腿齐出洞穿要害', damageMultiplier: 2.2, effect: 'bleed' }
    ],
    dropRing: {
      skillNameTemplate: '蛛网束缚 · 噬魂毒芒',
      skillDescTemplate: '喷射大范围剧毒蛛网封锁全场，造成 {dmg}% 群体伤害，减速 30% 并持续中毒。',
      multiplier: 2.1
    },
    possibleBone: {
      slot: 'external',
      name: '外附魂骨 · 八蛛矛',
      dropRate: 0.35
    },
    dropItems: [
      { itemId: 'spider_leg', name: '魔蛛金刚矛', dropRate: 0.8, count: 2 },
      { itemId: 'corrosive_poison', name: '曼陀罗蛇毒', dropRate: 0.9, count: 3 }
    ]
  },
  {
    id: 'pink_queen',
    name: '粉红娘娘',
    chineseName: '粉红娘娘',
    minYears: 3000,
    maxYears: 5000,
    years: 3800,
    color: 'purple',
    habitat: 'middle',
    description: '奥斯卡第四魂环来源！粉红女郎的变异族长，释放粉红迷雾，能让人亢奋狂化暴走！',
    element: 'poison',
    level: 38,
    hp: 4200,
    maxHp: 4200,
    atk: 135,
    def: 110,
    speed: 48,
    skills: [
      { name: '狂化粉红瘴气', description: '大范围粉红毒雾，混乱敌人并增幅全队', damageMultiplier: 1.3, effect: 'weaken' },
      { name: '毒钩刺穿', description: '尾部粉红毒钩突刺', damageMultiplier: 1.8, effect: 'poison' }
    ],
    dropRing: {
      skillNameTemplate: '亢奋粉红肠 / 狂热真身',
      skillDescTemplate: '激发粉红迷雾精元，提升全属性 30%，持续3回合且免疫控制减益！',
      multiplier: 1.95
    },
    dropItems: [
      { itemId: 'pink_poison_sac', name: '粉红娘娘毒囊', dropRate: 0.9, count: 1 },
      { itemId: 'spirit_powder', name: '亢奋精魄粉', dropRate: 0.7, count: 3 }
    ]
  },
  {
    id: 'king_of_earth',
    name: '大地之王',
    chineseName: '大地之王',
    minYears: 4000,
    maxYears: 6000,
    years: 4800,
    color: 'purple',
    habitat: 'middle',
    description: '马红俊第四魂环来源！火红巨蝎外壳坚硬如钢，潜伏地底爆发熔岩火柱！',
    element: 'fire',
    level: 40,
    hp: 4800,
    maxHp: 4800,
    atk: 175,
    def: 140,
    speed: 42,
    skills: [
      { name: '熔岩裂地击', description: '蝎尾轰击地面喷涌地火熔岩柱！', damageMultiplier: 2.3, effect: 'burn' },
      { name: '赤焰双钳撕扯', description: '赤红巨钳猛力夹击', damageMultiplier: 1.8 }
    ],
    dropRing: {
      skillNameTemplate: '岩浆淘涌 · 凤凰啸天击',
      skillDescTemplate: '重击地面引出滚滚地浆，造成 {dmg}% 范围火系暴击伤害并附加持续灼烧。',
      multiplier: 2.2
    },
    possibleBone: {
      slot: 'rightArm',
      name: '大地赤火右臂骨 (熔岩之拳)',
      dropRate: 0.25
    },
    dropItems: [
      { itemId: 'earth_king_tail', name: '大地之王赤炎蝎尾', dropRate: 0.9, count: 1 },
      { itemId: 'fire_core', name: '纯净火灵晶', dropRate: 0.75, count: 2 }
    ]
  },
  {
    id: 'scale_armor_beast',
    name: '鳞甲兽',
    chineseName: '鳞甲兽',
    minYears: 4000,
    maxYears: 9500,
    years: 6500,
    color: 'purple',
    habitat: 'middle',
    description: '全身覆盖重叠金刚厚鳞，防御极强，擅长冲击波与泰山压顶式的肉身冲撞。',
    element: 'physical',
    level: 42,
    hp: 5500,
    maxHp: 5500,
    atk: 140,
    def: 180,
    speed: 35,
    skills: [
      { name: '金刚厚鳞重盾', description: '凝实全身鳞片反弹物理冲击', damageMultiplier: 1.0 },
      { name: '裂地撼岳冲', description: '厚重肉身发动地动山摇冲撞', damageMultiplier: 2.0, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '坚不可摧 · 重装鳞甲壁垒',
      skillDescTemplate: '召唤金刚鳞甲生成相当于最大生命值 35% 的厚重护盾，降低所受物理伤害 40%。',
      multiplier: 1.7
    },
    possibleBone: {
      slot: 'torso',
      name: '金刚厚鳞躯干骨',
      dropRate: 0.2
    },
    dropItems: [
      { itemId: 'heavy_scale', name: '金刚厚鳞片', dropRate: 0.9, count: 4 },
      { itemId: 'spirit_iron_ore', name: '沉银原矿', dropRate: 0.7, count: 3 }
    ]
  },
  {
    id: 'ghost_tiger',
    name: '鬼虎',
    chineseName: '鬼虎',
    minYears: 5000,
    maxYears: 9000,
    years: 7500,
    color: 'purple',
    habitat: 'middle',
    description: '朱竹清第四魂环来源！移动速度极快，能分化出3个具有真实攻击力的幽冥分身！',
    element: 'dark',
    level: 45,
    hp: 5800,
    maxHp: 5800,
    atk: 220,
    def: 110,
    speed: 78,
    skills: [
      { name: '幽冥分身斩', description: '分化幽暗分身从三路包抄突刺', damageMultiplier: 2.4, effect: 'bleed' },
      { name: '暗夜瞬闪', description: '潜入阴影瞬间刺击对手后心', damageMultiplier: 2.0 }
    ],
    dropRing: {
      skillNameTemplate: '幽冥影分身 · 狂暴影刺',
      skillDescTemplate: '分化出两个幽冥分身协同作战，造成 {dmg}% 连击爆发伤害并提升自身闪避 50%。',
      multiplier: 2.3
    },
    possibleBone: {
      slot: 'leftLeg',
      name: '鬼虎幽冥迅捷左腿骨',
      dropRate: 0.25
    },
    dropItems: [
      { itemId: 'tiger_pelt', name: '鬼虎暗纹皮', dropRate: 0.9, count: 1 },
      { itemId: 'dark_shadow_stone', name: '幽冥影晶', dropRate: 0.7, count: 2 }
    ]
  },
  {
    id: 'shadow_panther',
    name: '暗夜黑豹',
    chineseName: '暗夜黑豹',
    minYears: 10000,
    maxYears: 18000,
    years: 12000,
    color: 'black',
    habitat: 'middle',
    description: '万年敏攻系黑豹，皮毛能吸收光线，在黑暗中犹如死神悄无声息地割喉！',
    element: 'dark',
    level: 48,
    hp: 7500,
    maxHp: 7500,
    atk: 260,
    def: 130,
    speed: 85,
    skills: [
      { name: '暗夜封喉杀', description: '在漆黑中发动必暴击的一击致命锁喉', damageMultiplier: 2.6, effect: 'bleed' },
      { name: '黑夜披风', description: '化入夜色降低仇恨并提升暴击伤害', damageMultiplier: 1.5 }
    ],
    dropRing: {
      skillNameTemplate: '暗夜撕裂 · 幽影绝杀',
      skillDescTemplate: '化作暗影流光强袭要害，造成 {dmg}% 暗属性暴击伤害，无视目标 30% 防御。',
      multiplier: 2.45
    },
    possibleBone: {
      slot: 'rightLeg',
      name: '暗夜黑豹破风右腿骨',
      dropRate: 0.2
    },
    dropItems: [
      { itemId: 'panther_claw', name: '万年黑豹利爪', dropRate: 0.9, count: 2 },
      { itemId: 'dark_core_mid', name: '中级暗黑精魄', dropRate: 0.6, count: 1 }
    ]
  },
  {
    id: 'flame_lion_king',
    name: '烈火狂狮王',
    chineseName: '烈火狂狮王',
    minYears: 12000,
    maxYears: 20000,
    years: 15000,
    color: 'black',
    habitat: 'middle',
    description: '万年火焰霸主，狮鬃如熔岩瀑布般熊熊燃烧，狮吼声能震碎弱小魂兽心胆！',
    element: 'fire',
    level: 50,
    hp: 8800,
    maxHp: 8800,
    atk: 285,
    def: 165,
    speed: 55,
    skills: [
      { name: '烈焰狮吼炮', description: '口喷如陨石般的炽烈火球', damageMultiplier: 2.5, effect: 'burn' },
      { name: '金炎附体甲', description: '引燃周身金焰，降低自身受到的所有伤害 30%', damageMultiplier: 1.2 }
    ],
    dropRing: {
      skillNameTemplate: '狂狮烈火咆 / 炽焰崩山斩',
      skillDescTemplate: '引动狂狮烈焰轰爆全场，造成 {dmg}% 巨量火系伤害并威慑敌军。',
      multiplier: 2.5
    },
    possibleBone: {
      slot: 'head',
      name: '狂狮炽烈头骨',
      dropRate: 0.25
    },
    dropItems: [
      { itemId: 'lion_mane', name: '万年烈火狮鬃', dropRate: 0.9, count: 1 },
      { itemId: 'fire_god_stone', name: '曜火灵晶', dropRate: 0.7, count: 2 }
    ]
  },
  {
    id: 'pit_demon_spider',
    name: '地穴魔蛛',
    chineseName: '地穴魔蛛',
    minYears: 12000,
    maxYears: 28000,
    years: 18000,
    color: 'black',
    habitat: 'middle',
    description: '唐三第四魂环来源！潜伏在地底的暗杀蛛魔，能喷吐黄色地穴蛛网制造绝对囚笼！',
    element: 'dark',
    level: 52,
    hp: 9200,
    maxHp: 9200,
    atk: 290,
    def: 160,
    speed: 60,
    skills: [
      { name: '地穴囚笼', description: '从地下拔起坚固蛛网囚笼锁死目标', damageMultiplier: 1.8, effect: 'stun' },
      { name: '嗜血暗刺', description: '万年蛛刺瞬发破空突刺', damageMultiplier: 2.6 }
    ],
    dropRing: {
      skillNameTemplate: '蓝银 / 万化囚笼 · 地穴突刺',
      skillDescTemplate: '虚空拔出万年囚笼困死目标2回合，造成 {dmg}% 伤害并令其无法动弹。',
      multiplier: 2.55
    },
    possibleBone: {
      slot: 'leftLeg',
      name: '地穴魔蛛左腿骨',
      dropRate: 0.3
    },
    dropItems: [
      { itemId: 'spider_silk_gold', name: '万年地穴蛛丝', dropRate: 0.95, count: 2 },
      { itemId: 'dark_core', name: '万年黑暗魔核', dropRate: 0.6, count: 1 }
    ]
  },
  {
    id: 'gale_magic_wolf',
    name: '疾风双头魔狼',
    chineseName: '疾风双头魔狼',
    minYears: 18000,
    maxYears: 30000,
    years: 22000,
    color: 'black',
    habitat: 'middle',
    description: '变异的双头狼王，掌控狂风暴雨与雷刃，能使出疾风魔狼三十六连斩！',
    element: 'physical',
    level: 55,
    hp: 11000,
    maxHp: 11000,
    atk: 320,
    def: 175,
    speed: 92,
    skills: [
      { name: '风雷双头爆', description: '双头同时喷射风雷融合爆裂涡流', damageMultiplier: 2.6, effect: 'paralyze' },
      { name: '三十六连斩', description: '借助风力借力打力，连环斩击层层叠力', damageMultiplier: 3.2 }
    ],
    dropRing: {
      skillNameTemplate: '疾风魔狼连斩 · 风神破虚',
      skillDescTemplate: '以极速斩出36道残影风刃，造成 {dmg}% 狂暴伤害并提升自身攻击速度一倍！',
      multiplier: 2.7
    },
    possibleBone: {
      slot: 'rightLeg',
      name: '疾风双头魔狼迅疾右腿骨',
      dropRate: 0.3
    },
    dropItems: [
      { itemId: 'twin_wolf_skull', name: '双头魔狼魔晶', dropRate: 0.9, count: 1 },
      { itemId: 'wind_crystal', name: '纯净风暴之核', dropRate: 0.8, count: 2 }
    ]
  },

  // =========================================================================
  // 3. 星斗大森林 · 核心区 (50,000 ~ 90,000 年)
  // =========================================================================
  {
    id: 'three_eyed_golden_ni',
    name: '三眼金猊 (帝皇瑞兽)',
    chineseName: '三眼金猊',
    minYears: 50000,
    maxYears: 50000,
    years: 50000,
    color: 'black',
    habitat: 'core',
    description: '星斗大森林帝皇瑞兽！第三只眼执掌命运与精神法则，身负极致之光与极致之火！',
    element: 'light',
    level: 68,
    hp: 19500,
    maxHp: 19500,
    atk: 580,
    def: 330,
    speed: 85,
    skills: [
      { name: '命运接引金光', description: '第三目释放神圣金光，扭转战局', damageMultiplier: 2.8, effect: 'stun' },
      { name: '双极致烈焰', description: '极致之火与光明洗礼大地', damageMultiplier: 3.5, effect: 'burn' }
    ],
    dropRing: {
      skillNameTemplate: '命运裁决 · 双极致光炎',
      skillDescTemplate: '引动命运与光火之威，造成 {dmg}% 神圣真实伤害并永久提升暴击率 15%。',
      multiplier: 3.4
    },
    possibleBone: {
      slot: 'head',
      name: '三眼金猊 · 命运之眼头骨',
      dropRate: 0.5
    },
    dropItems: [
      { itemId: 'destiny_core', name: '瑞兽命运神晶', dropRate: 1.0, count: 1 },
      { itemId: 'ultimate_fire_crystal', name: '极致火灵晶', dropRate: 0.9, count: 3 }
    ]
  },
  {
    id: 'spider_emperor',
    name: '噬魂魔蛛皇',
    chineseName: '噬魂魔蛛皇',
    minYears: 50000,
    maxYears: 70000,
    years: 65000,
    color: 'black',
    habitat: 'core',
    description: '万蛛之皇！黑金魔甲护体，拥有蛛皇附体与吞噬一切生灵武魂之力的恐怖凶威！',
    element: 'poison',
    level: 72,
    hp: 21500,
    maxHp: 21500,
    atk: 650,
    def: 360,
    speed: 82,
    skills: [
      { name: '魔蛛附体', description: '全属性暴增80%，外壳坚硬如神铁', damageMultiplier: 2.0 },
      { name: '噬魂千重矛', description: '八根百米黑金蛛矛从虚空穿刺而下', damageMultiplier: 3.6, effect: 'poison' }
    ],
    dropRing: {
      skillNameTemplate: '蛛皇附体 · 噬魂深渊刺',
      skillDescTemplate: '开启蛛皇形态，造成 {dmg}% 极致剧毒与穿刺伤害，并将所造成伤害的 50% 转化为自身生命。',
      multiplier: 3.5
    },
    possibleBone: {
      slot: 'torso',
      name: '噬魂魔蛛皇重铠躯干骨',
      dropRate: 0.4
    },
    dropItems: [
      { itemId: 'spider_emperor_chitin', name: '蛛皇黑金甲壳', dropRate: 1.0, count: 2 },
      { itemId: 'corrosive_poison_high', name: '顶级噬魂剧毒精萃', dropRate: 0.9, count: 3 }
    ]
  },
  {
    id: 'dark_devilgod_tiger',
    name: '暗魔邪神虎',
    chineseName: '暗魔邪神虎',
    minYears: 65000,
    maxYears: 98000,
    years: 75000,
    color: 'black',
    habitat: 'core',
    description: '邪神降临吞噬白虎而生的至高暗黑凶兽，具备邪恶、黑暗、雷电、风、时间、空间六大极致属性！',
    element: 'dark',
    level: 75,
    hp: 24000,
    maxHp: 24000,
    atk: 720,
    def: 380,
    speed: 95,
    skills: [
      { name: '生死竞技场', description: '拉入时间倒流竞技场，将对手打回幼年状态', damageMultiplier: 3.2, effect: 'weaken' },
      { name: '邪神风雷破', description: '风雷暗三重毁灭风暴撕裂一切', damageMultiplier: 3.8 }
    ],
    dropRing: {
      skillNameTemplate: '邪神破灭雷 · 生死领域',
      skillDescTemplate: '释放邪神暗雷，造成 {dmg}% 毁灭暴击伤害并剥夺敌方 50% 防御。',
      multiplier: 3.6
    },
    possibleBone: {
      slot: 'rightArm',
      name: '暗魔邪神右臂骨 (生死神刺)',
      dropRate: 0.45
    },
    dropItems: [
      { itemId: 'evil_tiger_bead', name: '暗魔邪神天珠', dropRate: 1.0, count: 1 },
      { itemId: 'god_iron', name: '深海沉银神铁', dropRate: 0.8, count: 5 }
    ]
  },
  {
    id: 'hell_demon_hound',
    name: '三头赤魔獒',
    chineseName: '三头赤魔獒',
    minYears: 70000,
    maxYears: 90000,
    years: 82000,
    color: 'black',
    habitat: 'core',
    description: '星斗大森林十大凶兽之一！三颗狰狞恶犬头颅分别执掌地狱之火、黑暗腐蚀与死寂雷暴！',
    element: 'fire',
    level: 78,
    hp: 26500,
    maxHp: 26500,
    atk: 780,
    def: 420,
    speed: 80,
    skills: [
      { name: '地狱三元吐息', description: '三首齐聚喷吐火、暗、雷三系魔爆', damageMultiplier: 3.6, effect: 'burn' },
      { name: '狂暴撕裂爪', description: '疯狂撕裂目标，造成无法愈合的深渊创口', damageMultiplier: 3.2, effect: 'bleed' }
    ],
    dropRing: {
      skillNameTemplate: '地狱业火 · 三首裂魂斩',
      skillDescTemplate: '召唤赤魔獒虚影撕碎虚空，造成 {dmg}% 火暗暴击伤害，并封禁敌方治疗3回合。',
      multiplier: 3.7
    },
    possibleBone: {
      slot: 'leftArm',
      name: '三头赤魔獒烈火左臂骨',
      dropRate: 0.4
    },
    dropItems: [
      { itemId: 'hell_hound_fang', name: '三头赤魔獒獠牙', dropRate: 1.0, count: 2 },
      { itemId: 'hell_fire_essence', name: '地狱魔火精元', dropRate: 0.85, count: 3 }
    ]
  },
  {
    id: 'darkgold_terrorclaw_bear',
    name: '暗金恐爪熊',
    chineseName: '暗金恐爪熊',
    minYears: 75000,
    maxYears: 95000,
    years: 85000,
    color: 'black',
    habitat: 'core',
    description: '魂兽界破坏力的极致峰顶！一双无坚不摧的暗金利爪撕天裂地，能轻易手撕真龙！',
    element: 'physical',
    level: 80,
    hp: 31000,
    maxHp: 31000,
    atk: 880,
    def: 520,
    speed: 68,
    skills: [
      { name: '撕天恐爪裂空斩', description: '挥出暗金爪芒割裂空间，撕碎一切防御与魂力护盾', damageMultiplier: 4.2 },
      { name: '暗金不灭体', description: '骨骼化作暗金，受到的法术伤害降低70%', damageMultiplier: 1.5 }
    ],
    dropRing: {
      skillNameTemplate: '暗金恐爪裂天破 · 不灭金身',
      skillDescTemplate: '凝聚恐爪精义撕裂虚空，造成 {dmg}% 物理伤害，并 100% 无视敌方护甲！',
      multiplier: 3.9
    },
    possibleBone: {
      slot: 'external',
      name: '外附魂骨 · 暗金恐爪掌骨',
      dropRate: 0.5
    },
    dropItems: [
      { itemId: 'terrorclaw_metal', name: '暗金恐爪刃片', dropRate: 1.0, count: 2 },
      { itemId: 'bear_gall_divine', name: '万年恐爪熊胆', dropRate: 0.9, count: 1 }
    ]
  },
  {
    id: 'thousand_ant_emperor',
    name: '千钧蚁皇',
    chineseName: '千钧蚁皇',
    minYears: 85000,
    maxYears: 99000,
    years: 90000,
    color: 'black',
    habitat: 'core',
    description: '昊天锤至高魂环来源！通体覆盖黑金鳞甲的千钧巨蚁，拥有撼动山岳的纯粹重力与恐怖力量！',
    element: 'physical',
    level: 82,
    hp: 34000,
    maxHp: 34000,
    atk: 920,
    def: 560,
    speed: 60,
    skills: [
      { name: '泰山千钧压顶', description: '以千钧之势压塌战场', damageMultiplier: 3.8, effect: 'stun' },
      { name: '万钧金刚撞', description: '最纯粹的蛮力冲锋撞碎防御屏障', damageMultiplier: 4.0 }
    ],
    dropRing: {
      skillNameTemplate: '千钧壁垒 · 撼岳绝杀锤',
      skillDescTemplate: '引动九万年千钧之力，造成 {dmg}% 霸道物理伤害并击碎敌方全部护盾！',
      multiplier: 4.0
    },
    possibleBone: {
      slot: 'torso',
      name: '千钧蚁皇重力金刚躯干骨',
      dropRate: 0.6
    },
    dropItems: [
      { itemId: 'ant_chitin_plate', name: '黑金蚁皇甲壳板', dropRate: 1.0, count: 3 },
      { itemId: 'titan_iron', name: '万年泰坦神铁', dropRate: 0.9, count: 4 }
    ]
  },

  // =========================================================================
  // 4. 星斗大森林 · 生命之湖 (100,000 ~ 890,000 年)
  // =========================================================================
  {
    id: 'titan_giant_ape',
    name: '泰坦巨猿 (二明)',
    chineseName: '泰坦巨猿',
    minYears: 100000,
    maxYears: 100000,
    years: 100000,
    color: 'red',
    habitat: 'lake',
    description: '星斗森林森林之王！如山岳般的庞大体魄，执掌【重力泥沼领域】，一拳碎山裂岳！',
    element: 'physical',
    level: 92,
    hp: 68000,
    maxHp: 68000,
    atk: 1450,
    def: 980,
    speed: 75,
    skills: [
      { name: '重力泥沼领域', description: '展开十倍重力泥沼，大幅压制敌方移速与攻击', damageMultiplier: 2.5, effect: 'weaken' },
      { name: '泰坦破天拳', description: '汇聚天地重力挥出毁天灭地的一击重拳！', damageMultiplier: 4.8, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '泰坦之握 · 重力破天震',
      skillDescTemplate: '十万年红色神环：引动泰坦重力神威，造成 {dmg}% 物理伤害并必定击晕、撕裂护甲！',
      multiplier: 4.6
    },
    possibleBone: {
      slot: 'leftArm',
      name: '十万年泰坦巨猿左臂骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'titan_blood', name: '十万年泰坦神猿精血', dropRate: 1.0, count: 1 },
      { itemId: 'red_core', name: '十万年力量神核', dropRate: 1.0, count: 1 }
    ]
  },
  {
    id: 'sky_azure_bull_python',
    name: '天青牛蟒 (大明)',
    chineseName: '天青牛蟒',
    minYears: 100000,
    maxYears: 100000,
    years: 100000,
    color: 'red',
    habitat: 'lake',
    description: '星斗森林真正的帝王！牛首蛇身长达数百米，执掌水天雷霆与【天青迟钝领域】！',
    element: 'thunder',
    level: 95,
    hp: 85000,
    maxHp: 85000,
    atk: 1600,
    def: 1100,
    speed: 88,
    skills: [
      { name: '天青迟钝神爪领域', description: '将敌方全身行动与思维速度迟缓十倍！', damageMultiplier: 2.8, effect: 'stun' },
      { name: '天青寂灭雷', description: '引九天神雷化为天青寂灭雷弧毁灭万物', damageMultiplier: 5.2 }
    ],
    dropRing: {
      skillNameTemplate: '天青迟钝神爪 · 寂灭雷霆',
      skillDescTemplate: '十万年红色神环：神雷锁死目标，造成 {dmg}% 神雷暴击伤害并封印对手技能2回合！',
      multiplier: 5.0
    },
    possibleBone: {
      slot: 'rightArm',
      name: '十万年天青牛蟒右臂骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'dragon_horn', name: '十万年天青神角', dropRate: 1.0, count: 1 },
      { itemId: 'red_core_thunder', name: '十万年雷霆神核', dropRate: 1.0, count: 1 }
    ]
  },
  {
    id: 'soft_bone_rabbit_emperor',
    name: '柔骨兔皇 (小舞)',
    chineseName: '柔骨兔皇',
    minYears: 100000,
    maxYears: 100000,
    years: 100000,
    color: 'red',
    habitat: 'lake',
    description: '十万年化形化神至高魂兽！掌控【无敌金身】、【瞬移】与【暴杀八段摔】！',
    element: 'physical',
    level: 93,
    hp: 62000,
    maxHp: 62000,
    atk: 1550,
    def: 920,
    speed: 105,
    skills: [
      { name: '无敌金身', description: '开启神圣金身，抵御一切伤害与负面状态', damageMultiplier: 1.0 },
      { name: '暴杀八段摔', description: '极速近身发动八段连环霸道爆摔！', damageMultiplier: 5.4, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '虚无 · 无敌金身 / 暴杀八段摔',
      skillDescTemplate: '十万年红色神环：免疫物理伤害3回合，造成 {dmg}% 贴身近战暴摔暴击伤害！',
      multiplier: 4.8
    },
    possibleBone: {
      slot: 'rightArm',
      name: '十万年柔骨兔右臂骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'rabbit_jade_pendant', name: '相思断肠红仙露', dropRate: 1.0, count: 1 },
      { itemId: 'divine_agility_core', name: '十万年瞬影神核', dropRate: 1.0, count: 1 }
    ]
  },
  {
    id: 'emerald_swan_biji',
    name: '翡翠天鹅 (碧姬)',
    chineseName: '翡翠天鹅',
    minYears: 500000,
    maxYears: 500000,
    years: 500000,
    color: 'red',
    habitat: 'lake',
    description: '十大凶兽排名第四！掌控最纯净的生命本源，翡翠双翼庇佑整个星斗森林，治愈之神！',
    element: 'light',
    level: 96,
    hp: 120000,
    maxHp: 120000,
    atk: 1200,
    def: 1400,
    speed: 95,
    skills: [
      { name: '翡翠守护光环', description: '汇聚生命之光赋予巨额护盾并驱散一切负面减益', damageMultiplier: 1.5 },
      { name: '生命之潮泯灭', description: '引动方圆万里生灵之气化为毁灭光波', damageMultiplier: 4.6 }
    ],
    dropRing: {
      skillNameTemplate: '翡翠生命守护 · 碧波洗礼',
      skillDescTemplate: '五十万年神环：瞬间恢复自身 100% 生命，并在接下来5回合获得巨额持续回血！',
      multiplier: 4.8
    },
    possibleBone: {
      slot: 'head',
      name: '五十万年翡翠天鹅治愈神性头骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'emerald_feather', name: '五十万年翡翠神羽', dropRate: 1.0, count: 3 },
      { itemId: 'life_essence_crystal', name: '生命之湖神露', dropRate: 1.0, count: 2 }
    ]
  },
  {
    id: 'myriad_demon_king',
    name: '万妖王',
    chineseName: '万妖王',
    minYears: 530000,
    maxYears: 530000,
    years: 530000,
    color: 'red',
    habitat: 'lake',
    description: '十大凶兽排名第五！统御全大陆所有植物系魂兽的无上帝王，魔眼凝视，妖树蔽日！',
    element: 'plant',
    level: 97,
    hp: 145000,
    maxHp: 145000,
    atk: 1850,
    def: 1550,
    speed: 70,
    skills: [
      { name: '万妖界领域', description: '展开万妖魔眼领域，妖瞳凝视剥夺敌方魂力与精神', damageMultiplier: 3.5, effect: 'weaken' },
      { name: '妖树戮魂刺', description: '千万道黑血魔根从四面八方穿刺核心', damageMultiplier: 5.5, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '万妖领域 · 腐木噬魂咒',
      skillDescTemplate: '五十三万年神环：展开万妖领域，造成 {dmg}% 植物暗属性伤害并汲取敌方 50% 魂力。',
      multiplier: 5.2
    },
    possibleBone: {
      slot: 'torso',
      name: '五十三万年万妖王躯干骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'demon_tree_core', name: '万妖王妖心树核', dropRate: 1.0, count: 1 },
      { itemId: 'abyssal_wood', name: '深渊魔木炭', dropRate: 1.0, count: 5 }
    ]
  },
  {
    id: 'beast_god_ditian',
    name: '金眼黑龙王 (帝天)',
    chineseName: '金眼黑龙王',
    minYears: 890000,
    maxYears: 890000,
    years: 890000,
    color: 'red',
    habitat: 'lake',
    description: '十大凶兽之首，万兽共尊之兽神！纯血真龙王族，执掌极致黑暗与【龙神爪】神技！',
    element: 'dark',
    level: 99,
    hp: 220000,
    maxHp: 220000,
    atk: 2900,
    def: 2000,
    speed: 108,
    skills: [
      { name: '至高神技 · 龙神爪', description: '借九彩龙神无上神威，撕裂时空法则破碎虚空！', damageMultiplier: 6.2, effect: 'stun' },
      { name: '黑龙灭世风暴', description: '真龙咆哮引动无边黑暗龙卷湮灭万物', damageMultiplier: 5.8 }
    ],
    dropRing: {
      skillNameTemplate: '兽神降临 · 龙神爪之威',
      skillDescTemplate: '八十九万年半神绝巅红环：化身黑龙至尊，造成 {dmg}% 真实伤害并无视一切护甲！',
      multiplier: 6.0
    },
    possibleBone: {
      slot: 'torso',
      name: '八十九万年金眼黑龙王逆鳞躯干骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'dragon_king_scale', name: '兽神帝天逆鳞', dropRate: 1.0, count: 1 },
      { itemId: 'divine_dragon_blood', name: '真龙神血', dropRate: 1.0, count: 3 }
    ]
  },

  // =========================================================================
  // 5. 极北之地 · 冰封雪原 (400 ~ 1,000,000 年)
  // =========================================================================
  {
    id: 'ice_silkworm',
    name: '冰蚕',
    chineseName: '冰蚕',
    minYears: 400,
    maxYears: 990,
    years: 900,
    color: 'yellow',
    habitat: 'north',
    description: '极北寒冰中孕育的通透幼蚕，吐出带有绝对冰冻效果的寒冰冰丝封锁敌人！',
    element: 'ice',
    level: 16,
    hp: 950,
    maxHp: 950,
    atk: 45,
    def: 35,
    speed: 28,
    skills: [
      { name: '玄冰吐丝', description: '吐出极寒冰蚕丝减速并冻结对手', damageMultiplier: 1.3, effect: 'paralyze' },
      { name: '精神微芒', description: '释放微弱精神波动干扰视听', damageMultiplier: 1.1 }
    ],
    dropRing: {
      skillNameTemplate: '冰蚕玄丝缠绕',
      skillDescTemplate: '极寒冰丝束缚目标，造成 {dmg}% 冰冻伤害并冻结对手行动1回合。',
      multiplier: 1.5
    },
    dropItems: [
      { itemId: 'ice_silk', name: '极北冰蚕丝', dropRate: 0.9, count: 3 },
      { itemId: 'ice_crystal_low', name: '初级玄冰晶', dropRate: 0.6, count: 2 }
    ]
  },
  {
    id: 'snow_wolf_king',
    name: '极北雪狼王',
    chineseName: '极北雪狼王',
    minYears: 12000,
    maxYears: 25000,
    years: 16000,
    color: 'black',
    habitat: 'north',
    description: '冰原群狼领袖！浑身银白如雪，眼眸猩红，在暴风雪中隐匿并发动连环狂暴撕咬。',
    element: 'ice',
    level: 49,
    hp: 8200,
    maxHp: 8200,
    atk: 270,
    def: 145,
    speed: 88,
    skills: [
      { name: '风雪撕裂爪', description: '借暴风雪掩护进行连续迅猛撕咬', damageMultiplier: 2.3, effect: 'bleed' },
      { name: '寒月冰嚎', description: '狂嚎引动极寒狂风，降低敌方全员速度', damageMultiplier: 1.8, effect: 'weaken' }
    ],
    dropRing: {
      skillNameTemplate: '雪狼暴风连斩 · 冰魄裂地',
      skillDescTemplate: '在暴风雪中发动5段快速连斩，造成 {dmg}% 冰属性伤害并附加深度冻伤。',
      multiplier: 2.45
    },
    possibleBone: {
      slot: 'leftLeg',
      name: '雪狼王风雪疾行左腿骨',
      dropRate: 0.25
    },
    dropItems: [
      { itemId: 'snow_wolf_fur', name: '雪狼王银皮毛', dropRate: 0.9, count: 1 },
      { itemId: 'frost_core', name: '万年冰魄精核', dropRate: 0.7, count: 2 }
    ]
  },
  {
    id: 'titan_snow_demon',
    name: '泰坦雪魔王',
    chineseName: '泰坦雪魔王',
    minYears: 200000,
    maxYears: 200000,
    years: 200000,
    color: 'red',
    habitat: 'north',
    description: '极北三大天王之三！远古泰坦神猿与雪魔巨兽的后代，身高百米，力拔山河！',
    element: 'ice',
    level: 94,
    hp: 76000,
    maxHp: 76000,
    atk: 1550,
    def: 1150,
    speed: 70,
    skills: [
      { name: '泰坦冰川重击', description: '百米冰霜巨拳狠狠砸向地面引发大雪崩！', damageMultiplier: 4.6, effect: 'stun' },
      { name: '雪魔金刚躯', description: '躯体化作万年玄冰，反弹物理攻击 50%', damageMultiplier: 1.8 }
    ],
    dropRing: {
      skillNameTemplate: '泰坦冰川破岳击',
      skillDescTemplate: '二十万年红色神环：引动极北泰坦巨力，造成 {dmg}% 物理冰霜震波伤害！',
      multiplier: 4.9
    },
    possibleBone: {
      slot: 'leftLeg',
      name: '二十万年泰坦雪魔撼地左腿骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'snow_demon_heart', name: '泰坦雪魔不灭冰心', dropRate: 1.0, count: 1 },
      { itemId: 'ice_god_ore', name: '万年万载玄冰髓', dropRate: 1.0, count: 3 }
    ]
  },
  {
    id: 'ice_empress_scorpion',
    name: '冰碧帝皇蝎 (冰帝)',
    chineseName: '冰碧帝皇蝎',
    minYears: 399900,
    maxYears: 399900,
    years: 399900,
    color: 'red',
    habitat: 'north',
    description: '极北三大天王之二！极致之冰的至高化身，如翡翠钻石般晶莹剔透，掌控【永冻之域】与【冰皇之怒】！',
    element: 'ice',
    level: 96,
    hp: 110000,
    maxHp: 110000,
    atk: 2100,
    def: 1450,
    speed: 98,
    skills: [
      { name: '永冻之域', description: '展开绝对零度冰封领域，瞬间冰封全场！', damageMultiplier: 3.5, effect: 'stun' },
      { name: '冰皇之螯', description: '翡翠钻石巨螯发动粉碎神兵的极致之冰重击！', damageMultiplier: 5.6 }
    ],
    dropRing: {
      skillNameTemplate: '永冻之域 · 冰皇之怒',
      skillDescTemplate: '四十万年神环：释放极致之冰神威，造成 {dmg}% 绝对零度真实伤害并 100% 冰封目标！',
      multiplier: 5.4
    },
    possibleBone: {
      slot: 'torso',
      name: '四十万年冰碧帝皇蝎躯干骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'ice_empress_chitin', name: '冰帝翡翠魔甲', dropRate: 1.0, count: 1 },
      { itemId: 'ultimate_ice_marrow', name: '极致冰髓精华', dropRate: 1.0, count: 2 }
    ]
  },
  {
    id: 'snow_empress',
    name: '冰天雪女 (雪帝)',
    chineseName: '冰天雪女',
    minYears: 700000,
    maxYears: 700000,
    years: 700000,
    color: 'red',
    habitat: 'north',
    description: '极北三大天王之首，极北之地绝对主宰！天地纯净之气孕育，自创绝学【帝剑·无双极冰】、【帝掌·大寒无雪】、【帝剑·雪舞耀阳】！',
    element: 'ice',
    level: 98,
    hp: 180000,
    maxHp: 180000,
    atk: 2650,
    def: 1800,
    speed: 105,
    skills: [
      { name: '帝剑 · 无双极冰', description: '拔出极冰神剑，斩断因果冰封万物！', damageMultiplier: 5.8 },
      { name: '帝掌 · 大寒无雪', description: '轻飘飘一掌拍出，瞬间将目标化为极寒冰晶寸寸崩碎！', damageMultiplier: 6.2, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '雪帝三绝 · 帝剑帝掌雪舞耀阳',
      skillDescTemplate: '七十万年准神级红环：挥洒雪帝无上神技，造成 {dmg}% 神圣极冰伤害！',
      multiplier: 5.8
    },
    possibleBone: {
      slot: 'rightArm',
      name: '七十万年雪帝极冰神剑右臂骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'snow_empress_lotus', name: '雪帝极冰雪莲', dropRate: 1.0, count: 1 },
      { itemId: 'ice_god_core_pure', name: '极北本源神核', dropRate: 1.0, count: 2 }
    ]
  },
  {
    id: 'skydream_iceworm',
    name: '天梦冰蚕 (百万年)',
    chineseName: '天梦冰蚕',
    minYears: 1000000,
    maxYears: 1000000,
    years: 1000000,
    color: 'gold',
    habitat: 'north',
    description: '斗罗大陆历史上第一只百万年魂兽！吞噬万载玄冰髓沉睡百万年，蜕变为精神属性智慧魂环！',
    element: 'light',
    level: 99,
    hp: 190000,
    maxHp: 190000,
    atk: 2400,
    def: 2200,
    speed: 110,
    skills: [
      { name: '精神探测共享', description: '展开全知精神雷达，洞悉方圆千里一切破绽！', damageMultiplier: 2.0 },
      { name: '灵魂风暴震波', description: '百万年精神念力狠狠轰击敌方精神之海！', damageMultiplier: 6.5, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '百万年 · 精神探测共享与灵魂冲击',
      skillDescTemplate: '百万年白金神环：神识蜕变，造成 {dmg}% 精神真实伤害并将暴击与命中锁定为 100%！',
      multiplier: 6.2
    },
    possibleBone: {
      slot: 'head',
      name: '百万年天梦智慧精神头骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'million_year_ice_marrow', name: '百万年万载玄冰髓膏', dropRate: 1.0, count: 1 },
      { itemId: 'spiritual_god_orb', name: '智慧神珠', dropRate: 1.0, count: 1 }
    ]
  },

  // =========================================================================
  // 6. 落日森林 · 毒瘴幽谷 (1,800 ~ 80,000 年)
  // =========================================================================
  {
    id: 'ghost_shadow_cat',
    name: '幽冥灵猫',
    chineseName: '幽冥灵猫',
    minYears: 1800,
    maxYears: 3500,
    years: 2400,
    color: 'purple',
    habitat: 'sunset',
    description: '落日森林敏捷灵动的猫科魂兽，双眸异色，利爪带有轻微麻痹暗毒。',
    element: 'dark',
    level: 30,
    hp: 2200,
    maxHp: 2200,
    atk: 120,
    def: 65,
    speed: 70,
    skills: [
      { name: '幽冥突刺', description: '瞬间发动眼花缭乱的利爪连击', damageMultiplier: 1.8, effect: 'bleed' },
      { name: '暗影伪装', description: '潜行于夜色中规避敌方攻击', damageMultiplier: 1.2 }
    ],
    dropRing: {
      skillNameTemplate: '幽冥百爪 · 极速连击',
      skillDescTemplate: '连续挥出百道幽冥爪影，造成 {dmg}% 伤害并提升攻击速度 30%。',
      multiplier: 2.0
    },
    dropItems: [
      { itemId: 'cat_fur', name: '幽冥灵猫皮毛', dropRate: 0.85, count: 1 },
      { itemId: 'shadow_gem', name: '暗影微晶', dropRate: 0.6, count: 2 }
    ]
  },
  {
    id: 'nine_segment_emerald',
    name: '九节翡翠',
    chineseName: '九节翡翠',
    minYears: 25000,
    maxYears: 45000,
    years: 35000,
    color: 'black',
    habitat: 'sunset',
    description: '体长不过半尺的微型竹叶青异种！快如闪电，剧毒见血封喉，身坚如刚竹神兵！',
    element: 'poison',
    level: 60,
    hp: 13500,
    maxHp: 13500,
    atk: 460,
    def: 280,
    speed: 95,
    skills: [
      { name: '翡翠绝命牙', description: '化作一道绿光暴射而出，咬穿护体罡气', damageMultiplier: 3.2, effect: 'poison' },
      { name: '金刚神竹体', description: '身体坚硬如神器，免疫大部分物理伤害', damageMultiplier: 1.5 }
    ],
    dropRing: {
      skillNameTemplate: '九节翡翠 · 见血封喉毒神刺',
      skillDescTemplate: '射出翡翠毒针，造成 {dmg}% 穿甲真实伤害并在每回合附加剧烈毒素。',
      multiplier: 3.1
    },
    possibleBone: {
      slot: 'rightArm',
      name: '九节翡翠迅影毒刃右臂骨',
      dropRate: 0.35
    },
    dropItems: [
      { itemId: 'emerald_snake_venom', name: '九节翡翠蛇毒原液', dropRate: 1.0, count: 1 },
      { itemId: 'emerald_scale', name: '翡翠竹节蜕皮', dropRate: 0.8, count: 2 }
    ]
  },
  {
    id: 'flame_demon_lizard',
    name: '赤炎地龙蜥',
    chineseName: '赤炎地龙蜥',
    minYears: 20000,
    maxYears: 35000,
    years: 25000,
    color: 'black',
    habitat: 'sunset',
    description: '落日森林地热裂隙中的巨型炎蜥，全身生有火鳞骨刺，喷吐滚烫的岩浆波。',
    element: 'fire',
    level: 56,
    hp: 12500,
    maxHp: 12500,
    atk: 360,
    def: 230,
    speed: 50,
    skills: [
      { name: '地炎柱喷涌', description: '从地下引爆熔岩火柱', damageMultiplier: 2.7, effect: 'burn' },
      { name: '炽鳞重甲', description: '引燃体表鳞片，近战反弹火焰伤害', damageMultiplier: 1.3 }
    ],
    dropRing: {
      skillNameTemplate: '地炎爆裂 · 火龙咆哮击',
      skillDescTemplate: '引爆地下岩浆，造成 {dmg}% 巨量火系范围伤害并点燃全场。',
      multiplier: 2.8
    },
    possibleBone: {
      slot: 'torso',
      name: '赤炎地龙灼烧躯干骨',
      dropRate: 0.25
    },
    dropItems: [
      { itemId: 'lizard_scale_fire', name: '赤炎蜥蜴熔岩鳞', dropRate: 0.9, count: 3 },
      { itemId: 'fire_essence_ore', name: '地火精晶', dropRate: 0.7, count: 2 }
    ]
  },
  {
    id: 'holy_light_pegasus',
    name: '圣光天马',
    chineseName: '圣光天马',
    minYears: 35000,
    maxYears: 55000,
    years: 45000,
    color: 'black',
    habitat: 'sunset',
    description: '生有洁白双翼的神圣光明异兽，通体沐浴日光，血液具备极强的解毒与疗伤神效。',
    element: 'light',
    level: 65,
    hp: 17000,
    maxHp: 17000,
    atk: 480,
    def: 310,
    speed: 90,
    skills: [
      { name: '神圣破邪辉光', description: '羽翼射出万道金光净化黑暗与毒雾', damageMultiplier: 3.0 },
      { name: '天马圣光愈', description: '引圣光洗礼自身恢复 40% 生命值', damageMultiplier: 1.5 }
    ],
    dropRing: {
      skillNameTemplate: '圣光天降 · 破邪神辉',
      skillDescTemplate: '召唤圣光净化战场，造成 {dmg}% 神圣伤害并驱散自身全部负面状态。',
      multiplier: 3.2
    },
    possibleBone: {
      slot: 'rightArm',
      name: '圣光天马御风右臂骨',
      dropRate: 0.35
    },
    dropItems: [
      { itemId: 'pegasus_feather', name: '圣光天马纯白羽', dropRate: 0.95, count: 2 },
      { itemId: 'holy_light_core', name: '圣辉之核', dropRate: 0.8, count: 2 }
    ]
  },
  {
    id: 'biphosphor_serpent_king',
    name: '碧磷蛇皇',
    chineseName: '碧磷蛇皇',
    minYears: 60000,
    maxYears: 80000,
    years: 68000,
    color: 'black',
    habitat: 'sunset',
    description: '毒斗罗独孤博武魂本源！碧绿通透的至毒皇者，毒瘴弥漫十里，触之即化为脓水！',
    element: 'poison',
    level: 74,
    hp: 23000,
    maxHp: 23000,
    atk: 690,
    def: 370,
    speed: 78,
    skills: [
      { name: '碧磷迷魂毒阵', description: '倾泻如云海般的碧绿毒云腐蚀罡气与肉身', damageMultiplier: 3.4, effect: 'poison' },
      { name: '蛇皇噬魂波', description: '喷吐毒波直接吞噬灵魂', damageMultiplier: 3.8, effect: 'weaken' }
    ],
    dropRing: {
      skillNameTemplate: '碧磷蛇皇毒 · 灭世毒云',
      skillDescTemplate: '倾泻至高碧磷蛇皇毒，造成 {dmg}% 剧毒范围伤害，并在每回合削减敌方 20% 攻防。',
      multiplier: 3.6
    },
    possibleBone: {
      slot: 'head',
      name: '碧磷蛇皇毒晶头骨',
      dropRate: 0.45
    },
    dropItems: [
      { itemId: 'biphosphor_crown', name: '碧磷蛇皇毒冠角', dropRate: 1.0, count: 1 },
      { itemId: 'poison_god_crystal', name: '碧磷万毒精魄', dropRate: 0.9, count: 2 }
    ]
  },

  // =========================================================================
  // 7. 无尽海域 (30,000 ~ 990,000 年)
  // =========================================================================
  {
    id: 'deep_sea_squid',
    name: '深海巨章魔',
    chineseName: '深海巨章魔',
    minYears: 30000,
    maxYears: 50000,
    years: 38000,
    color: 'black',
    habitat: 'sea',
    description: '万米深海渊薮中的巨妖，数十条百米吸盘触手能将万吨战船瞬间撕碎卷入腹中！',
    element: 'dark',
    level: 62,
    hp: 15500,
    maxHp: 15500,
    atk: 450,
    def: 290,
    speed: 62,
    skills: [
      { name: '万触绞杀', description: '无数粗壮触手缠绕勒紧并撕裂目标', damageMultiplier: 2.8, effect: 'stun' },
      { name: '深海毒墨喷射', description: '喷吐致盲剧毒墨汁遮蔽视线', damageMultiplier: 2.2, effect: 'weaken' }
    ],
    dropRing: {
      skillNameTemplate: '深海魔触 · 狂潮绞杀',
      skillDescTemplate: '召唤深海巨触，造成 {dmg}% 水暗混合伤害并禁锢目标行动1回合。',
      multiplier: 3.0
    },
    possibleBone: {
      slot: 'torso',
      name: '深海章魔柔韧软甲躯干骨',
      dropRate: 0.3
    },
    dropItems: [
      { itemId: 'kraken_tentacle', name: '万年巨章触手', dropRate: 0.95, count: 2 },
      { itemId: 'abyssal_ink', name: '深渊致盲魔墨', dropRate: 0.8, count: 2 }
    ]
  },
  {
    id: 'demon_white_shark',
    name: '魔魂大白鲨之王 (小白)',
    chineseName: '魔魂大白鲨之王',
    minYears: 100000,
    maxYears: 100000,
    years: 100000,
    color: 'red',
    habitat: 'sea',
    description: '海神岛守护神兽！晶莹剔透的身躯与锋利无匹的神齿，在大海中拥有极致速度与海神威能！',
    element: 'divine',
    level: 93,
    hp: 72000,
    maxHp: 72000,
    atk: 1580,
    def: 960,
    speed: 112,
    skills: [
      { name: '魔鲨狂牙刃', description: '以超光速穿梭海浪，斩出百道破邪水刃', damageMultiplier: 4.8 },
      { name: '海神波涛领域', description: '掀起滔天海啸巨浪，极大压制敌方行动力', damageMultiplier: 3.2, effect: 'weaken' }
    ],
    dropRing: {
      skillNameTemplate: '狂涛瀚海 · 魔鲨齿刃斩',
      skillDescTemplate: '十万年红色神环：引动海神之怒撕裂敌方防御，造成 {dmg}% 海神真实伤害并提速 50%！',
      multiplier: 4.8
    },
    possibleBone: {
      slot: 'leftLeg',
      name: '十万年魔魂大白鲨极速左腿骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'shark_god_tooth', name: '十万年魔鲨神齿', dropRate: 1.0, count: 2 },
      { itemId: 'sea_god_drop', name: '海神庇佑甘霖', dropRate: 1.0, count: 1 }
    ]
  },
  {
    id: 'evil_orca_king',
    name: '邪魔邪魔虎鲸王',
    chineseName: '邪魔虎鲸王',
    minYears: 100000,
    maxYears: 100000,
    years: 100000,
    color: 'red',
    habitat: 'sea',
    description: '大海上最凶残暴虐的嗜血霸主！体表暗红魔纹，掌控【邪魔镜之灭】与【虎鲸牙碎】！',
    element: 'dark',
    level: 95,
    hp: 88000,
    maxHp: 88000,
    atk: 1720,
    def: 1050,
    speed: 98,
    skills: [
      { name: '邪魔镜之灭', description: '将空间化作镜面并瞬间轰然粉碎！', damageMultiplier: 5.2, effect: 'stun' },
      { name: '虎鲸嗜血水刃', description: '发射暗红色的嗜血水箭撕裂生灵', damageMultiplier: 4.6, effect: 'bleed' }
    ],
    dropRing: {
      skillNameTemplate: '邪魔镜之灭 · 虎鲸嗜血斩',
      skillDescTemplate: '十万年红色神环：引发镜面空间碎裂风暴，造成 {dmg}% 暗黑暴击伤害并吸血 50%！',
      multiplier: 5.1
    },
    possibleBone: {
      slot: 'rightLeg',
      name: '十万年邪魔虎鲸王嗜血右腿骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'orca_evil_spine', name: '十万年虎鲸脊椎骨', dropRate: 1.0, count: 1 },
      { itemId: 'blood_sea_pearl', name: '嗜血海魔珠', dropRate: 1.0, count: 1 }
    ]
  },
  {
    id: 'deep_sea_whale_king',
    name: '深海魔鲸王',
    chineseName: '深海魔鲸王',
    minYears: 990000,
    maxYears: 990000,
    years: 990000,
    color: 'gold',
    habitat: 'sea',
    description: '大海真正的无上至尊！九十九万年修为，仅差半步化龙成神，拥有神级魂力与魔域湮灭神光！',
    element: 'divine',
    level: 99,
    hp: 240000,
    maxHp: 240000,
    atk: 3400,
    def: 2200,
    speed: 110,
    skills: [
      { name: '魔鲸吞噬天地', description: '吞噬海域内的一切生灵与魂力', damageMultiplier: 4.2 },
      { name: '神级紫晶狂雷', description: '撕碎世界法则的神级狂雷重创神体！', damageMultiplier: 6.8, effect: 'stun' }
    ],
    dropRing: {
      skillNameTemplate: '百万年 · 紫晶湮灭神光',
      skillDescTemplate: '百万年金色神环：融合海神与魔鲸王双重神威，造成 {dmg}% 无视护甲的神圣真伤！',
      multiplier: 6.6
    },
    possibleBone: {
      slot: 'torso',
      name: '九十九万年深海魔鲸王化神躯干骨',
      dropRate: 1.0
    },
    dropItems: [
      { itemId: 'whale_pearl', name: '深海魔鲸化龙龙珠', dropRate: 1.0, count: 1 },
      { itemId: 'sea_god_iron', name: '瀚海玄晶神铁', dropRate: 1.0, count: 10 }
    ]
  }
];
