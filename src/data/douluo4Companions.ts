import { Douluo4Companion } from '../types/game';
import lanXuanyuAvatar from '../assets/images/partner_lan_xuanyu_1786479480628.jpg';
import baiXiuxiuAvatar from '../assets/images/partner_bai_xiuxiu_1786479495469.jpg';
import tangYugeAvatar from '../assets/images/partner_tang_yuge_1786479509697.jpg';
import lanMengqinAvatar from '../assets/images/partner_lan_mengqin_1786479524424.jpg';

export const INITIAL_DOULUO4_COMPANIONS: Douluo4Companion[] = [
  {
    id: 'lan_xuanyu',
    name: '蓝轩宇',
    title: '龙神血脉 · 金银双龙王之子',
    martialSoul: '金纹蓝银草 & 银纹蓝银草 & 龙神血脉',
    avatarUrl: lanXuanyuAvatar,
    themeColor: '#38bdf8',
    level: 30,
    affinity: 30,
    star: 3,
    isRecruited: true, // Default active companion
    isInSquad: true,
    description: '史莱克学院三十三班班长，新一代史莱克七怪队长！兼具金龙王与银龙王至高神级血脉。',
    background: '擅长金银双生蓝银草的超强团队辅助与肉身血脉爆发，能极大程度成倍放大队友的魂力与战力。',
    baseAtk: 420,
    baseDef: 350,
    baseHp: 3800,
    baseSpeed: 55,
    skills: [
      {
        name: '金龙升天 · 龙皇霸体',
        desc: '金龙王血脉爆发，造成300%物理轰击并获得40%伤害减免！',
        damageMultiplier: 3.0,
        cooldown: 2
      },
      {
        name: '九彩龙神变 · 神光普照',
        desc: '调动九彩龙神之力，为全队恢复30%最大气血并提供全属性+50%！',
        damageMultiplier: 2.0,
        cooldown: 4
      },
      {
        name: '武魂融合技 · 龙神霜魔极意',
        desc: '与白秀秀联手释放双龙冰封暴击，造成500%毁天灭地的极寒伤害！',
        damageMultiplier: 5.0,
        cooldown: 5,
        isFusion: true
      }
    ],
    passiveAura: {
      name: '龙神共鸣光环',
      desc: '主角全属性+15%，魂技魂力消耗-15%，暴击率+10%。',
      statsBoost: {
        atkPercent: 15,
        defPercent: 15,
        hpPercent: 15,
        speedPercent: 10,
        critRate: 10
      }
    }
  },
  {
    id: 'bai_xiuxiu',
    name: '白秀秀',
    title: '深渊冰魔龙 · 天魔舞者',
    martialSoul: '深渊冰魔龙 & 死亡天魔',
    avatarUrl: baiXiuxiuAvatar,
    themeColor: '#c084fc',
    level: 30,
    affinity: 35,
    star: 3,
    isRecruited: true,
    isInSquad: true,
    description: '深渊冰魔龙化身，手持深渊冰魔枪的高冷绝美战神。',
    background: '精通极致之冰与深渊天魔吞噬，能大幅削弱敌方的攻防与速度，并施加严重极寒霜冻。',
    baseAtk: 450,
    baseDef: 300,
    baseHp: 3400,
    baseSpeed: 60,
    skills: [
      {
        name: '深渊冰魔枪 · 瞬息破空',
        desc: '投掷深渊冰矛造成320%极寒伤害并附加【深渊冰噬】（降低40%速度）。',
        damageMultiplier: 3.2,
        cooldown: 2
      },
      {
        name: '天魔倒转 · 空间反弹',
        desc: '扭曲空间吞噬敌人攻势，将受到的伤害原路反弹给敌方！',
        damageMultiplier: 2.5,
        cooldown: 4
      },
      {
        name: '天魔之舞 · 绝对冰封',
        desc: '翩跹起舞引动暴风雪，冰冻敌人行动条1回合并造成380%群体极寒爆发。',
        damageMultiplier: 3.8,
        cooldown: 4
      }
    ],
    passiveAura: {
      name: '极寒天魔光环',
      desc: '攻击有25%几率冰冻/减速敌人；暴击伤害提升25%。',
      statsBoost: {
        atkPercent: 18,
        speedPercent: 12,
        critRate: 12
      }
    }
  },
  {
    id: 'tang_yuge',
    name: '唐雨格',
    title: '大五行神光 · 天干麒麟',
    martialSoul: '天干五行麒麟',
    avatarUrl: tangYugeAvatar,
    themeColor: '#f59e0b',
    level: 28,
    affinity: 20,
    star: 2,
    isRecruited: true,
    isInSquad: true,
    description: '史莱克内院天骄！掌驭金、木、水、火、土五行本源之力。',
    background: '五行相生相克，五行神光无物不破、无坚不摧，具备极强的防御与破甲驱散能力。',
    baseAtk: 400,
    baseDef: 420,
    baseHp: 4200,
    baseSpeed: 48,
    skills: [
      {
        name: '大五行神光 · 元素泯灭',
        desc: '横扫五色神光，驱散敌方所有护盾与增益状态，并造成300%五行伤害！',
        damageMultiplier: 3.0,
        cooldown: 3
      },
      {
        name: '五行麒麟真身 · 绝对守护',
        desc: '召唤五行麒麟虚影，为全队提供40%伤害减免并持续回血！',
        damageMultiplier: 1.5,
        cooldown: 4
      }
    ],
    passiveAura: {
      name: '五行流转光环',
      desc: '主角全属性防御+25%，免疫属性克制削弱。',
      statsBoost: {
        defPercent: 25,
        hpPercent: 20
      }
    }
  },
  {
    id: 'lan_mengqin',
    name: '蓝梦琴',
    title: '双生冰雪 · 翡翠凤鸣',
    martialSoul: '冰天雪女 & 玉凰琴',
    avatarUrl: lanMengqinAvatar,
    themeColor: '#67e8f9',
    level: 25,
    affinity: 15,
    star: 2,
    isRecruited: false,
    isInSquad: false,
    description: '一身白衣出尘绝世，身怀罕见的冰雪与乐器顶级双生武魂。',
    background: '琴音直击灵魂，雪女冰封千里，兼具极致的极寒爆发与神级全队治疗支援。',
    baseAtk: 380,
    baseDef: 280,
    baseHp: 3200,
    baseSpeed: 52,
    skills: [
      {
        name: '暴风雪莲 · 极寒凋零',
        desc: '召唤暴风雪莲花，造成280%魔法极寒伤害并深度冰冻敌人！',
        damageMultiplier: 2.8,
        cooldown: 3
      },
      {
        name: '玉凰天音 · 九重甘霖',
        desc: '拨动神琴，净化全队所有负面状态，并立即回复40%生命与50点魂力！',
        damageMultiplier: 0,
        cooldown: 4
      }
    ],
    passiveAura: {
      name: '玉凰雪莲光环',
      desc: '每回合开始时为全队恢复5%最大气血；减少受控几率。',
      statsBoost: {
        hpPercent: 20,
        defPercent: 10
      }
    }
  },
  {
    id: 'qian_lei',
    name: '钱磊',
    title: '黄金比蒙 · 召唤之王',
    martialSoul: '召唤金钱 & 黄金比蒙',
    avatarUrl: lanXuanyuAvatar,
    themeColor: '#eab308',
    level: 25,
    affinity: 10,
    star: 2,
    isRecruited: false,
    isInSquad: false,
    description: '性格幽默风趣，与远古黄金比蒙幼崽融合，变身为无可阻挡的狂暴近战绞肉机！',
    background: '比蒙以龙为食，双爪撕裂一切护甲，拥有嗜血狂暴的近战破坏力。',
    baseAtk: 480,
    baseDef: 380,
    baseHp: 4500,
    baseSpeed: 40,
    skills: [
      {
        name: '黄金比蒙 · 狂暴撕裂',
        desc: '金刚比蒙利爪撕裂护甲，造成360%无视防御的纯物理伤害！',
        damageMultiplier: 3.6,
        cooldown: 3
      },
      {
        name: '比蒙战吼 · 嗜血狂化',
        desc: '发出震天战吼，提升全队30%攻击力与30%吸血效果，持续2回合！',
        damageMultiplier: 1.8,
        cooldown: 4
      }
    ],
    passiveAura: {
      name: '比蒙蛮力光环',
      desc: '主角攻击力+20%，物理穿甲效果+30%。',
      statsBoost: {
        atkPercent: 20,
        critRate: 15
      }
    }
  },
  {
    id: 'yuan_en_huihui',
    name: '原恩辉辉',
    title: '精灵王血脉 · 幻灵神弓',
    martialSoul: '紫星灵弓 & 精灵王血脉',
    avatarUrl: tangYugeAvatar,
    themeColor: '#a855f7',
    level: 25,
    affinity: 10,
    star: 2,
    isRecruited: false,
    isInSquad: false,
    description: '精灵王族血脉后裔，手持紫星灵弓，百步穿杨的神射手。',
    background: '具备昼夜双形态切换，箭矢附带雷电、毒素与破甲神力，射程极远。',
    baseAtk: 460,
    baseDef: 260,
    baseHp: 3000,
    baseSpeed: 68,
    skills: [
      {
        name: '精灵神箭 · 千星破魔',
        desc: '发射倾盆般的紫星箭雨，对敌方全体造成340%暴击箭伤！',
        damageMultiplier: 3.4,
        cooldown: 3
      }
    ],
    passiveAura: {
      name: '灵弓鹰眼光环',
      desc: '主角暴击率+18%，开局行动速度+15%。',
      statsBoost: {
        critRate: 18,
        speedPercent: 15
      }
    }
  },
  {
    id: 'liu_feng',
    name: '刘锋',
    title: '荆棘白龙 · 超音速魅影',
    martialSoul: '白龙枪 & 荆棘白龙',
    avatarUrl: lanXuanyuAvatar,
    themeColor: '#e2e8f0',
    level: 25,
    affinity: 10,
    star: 2,
    isRecruited: false,
    isInSquad: false,
    description: '执着坚韧的枪术大师，血脉二次觉醒为荆棘白龙，拥有突破音障的超凡速度。',
    background: '如白龙出海，枪尖破空，以极致的攻速与多段突刺撕裂敌方阵型。',
    baseAtk: 440,
    baseDef: 290,
    baseHp: 3100,
    baseSpeed: 75,
    skills: [
      {
        name: '荆棘白龙枪 · 百影裂空刺',
        desc: '身形幻化百道残影冲刺，造成320%破甲伤害并附加深度流血。',
        damageMultiplier: 3.2,
        cooldown: 2
      }
    ],
    passiveAura: {
      name: '白龙极速光环',
      desc: '主角开局先手速度+25%，闪避率+15%。',
      statsBoost: {
        speedPercent: 25
      }
    }
  }
];

