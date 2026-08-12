import {
  Mecha,
  FighterJet,
  Starship,
  PlanetInfo,
  AlienInvasionFleet,
  InterstellarState,
  SpaceEvent,
  ExpeditionDestination
} from '../types/interstellar';

export const INITIAL_MECHAS: Mecha[] = [
  {
    id: 'mecha_white_storm',
    name: '白级·风暴守护者',
    grade: 'white',
    gradeName: '白级基础机甲',
    level: 1,
    type: 'assault',
    typeName: '突击强攻型',
    description: '斗罗联邦基础巡航制式机甲，装备高频魂力振动刃与轻型推进翼。',
    icon: 'Shield',
    powerRating: 850,
    hpBonus: 3500,
    atkBonus: 420,
    defBonus: 320,
    speedBonus: 25,
    critBonus: 5,
    specialSkill: {
      name: '脉冲突刺斩',
      desc: '激发超载魂力脉冲，对目标战舰/敌机造成320%魂爆伤害。',
      dmgMultiplier: 3.2,
      cooldownTurns: 2
    },
    isUnlocked: true,
    isEquipped: true,
    pilotName: '母星蓝星见习驾驶员',
    cost: {
      gold: 5000,
      spaceGold: 100,
      metals: { '百锻沉金': 10 }
    },
    upgradeCost: {
      gold: 3000,
      spaceGold: 80,
      metals: { '百锻沉金': 6 }
    },
    modules: {
      weapon: '标准高频魂力振动长刃',
      armor: '复合钛晶防震装甲',
      thruster: '初级离子喷射推进翼'
    }
  },
  {
    id: 'mecha_yellow_mountain',
    name: '黄级·撼岳重装机甲',
    grade: 'yellow',
    gradeName: '黄级重装机甲',
    level: 1,
    type: 'heavy',
    typeName: '重装防御型',
    description: '搭载沉银重力加固重盾与定装魂导炮底座，防御坚固，适合行星登陆作战。',
    icon: 'ShieldAlert',
    powerRating: 1800,
    hpBonus: 8800,
    atkBonus: 750,
    defBonus: 820,
    speedBonus: 15,
    critBonus: 8,
    specialSkill: {
      name: '撼岳力场壁障',
      desc: '展开重力斥力场，抵挡70%受到的伤害并反弹能量波冲击。',
      dmgMultiplier: 2.8,
      cooldownTurns: 3
    },
    isUnlocked: false,
    isEquipped: false,
    cost: {
      gold: 15000,
      spaceGold: 400,
      starCores: 2,
      metals: { '百锻沉金': 25, '灵锻秘银': 10 }
    },
    upgradeCost: {
      gold: 6000,
      spaceGold: 200,
      metals: { '百锻沉金': 12, '灵锻秘银': 5 }
    },
    modules: {
      weapon: '双联定制重型高爆迫击炮',
      armor: '300mm重型深银折射装甲板',
      thruster: '核心反重力平衡锚'
    }
  },
  {
    id: 'mecha_purple_phantom',
    name: '紫级·幻影极速刺客',
    grade: 'purple',
    gradeName: '紫级定制机甲',
    level: 1,
    type: 'stealth',
    typeName: '高机动隐形突击型',
    description: '由唐门暗堂与史莱克锻造院联手打造，具备光学隐形与超音速突防性能。',
    icon: 'Zap',
    powerRating: 3600,
    hpBonus: 14500,
    atkBonus: 1680,
    defBonus: 950,
    speedBonus: 75,
    critBonus: 22,
    specialSkill: {
      name: '暗影折跃绝杀',
      desc: '短距空间折跃突入敌方视野盲区，造成540%致命破甲打击！',
      dmgMultiplier: 5.4,
      cooldownTurns: 3
    },
    isUnlocked: false,
    isEquipped: false,
    cost: {
      gold: 35000,
      spaceGold: 1200,
      starCores: 8,
      metals: { '灵锻秘银': 25, '魂锻赤金': 10 }
    },
    upgradeCost: {
      gold: 12000,
      spaceGold: 500,
      metals: { '灵锻秘银': 12, '魂锻赤金': 5 }
    },
    modules: {
      weapon: '暗金恐爪高频双刃',
      armor: '光学迷彩拟态相位涂层',
      thruster: '超光速微矢量折跃引擎'
    }
  },
  {
    id: 'mecha_black_judgement',
    name: '黑级·天圣弑神裁决者',
    grade: 'black',
    gradeName: '黑级王牌机甲',
    level: 1,
    type: 'assault',
    typeName: '王牌全能战神型',
    description: '唯有封号斗罗或史莱克内院天骄方可驾驭的黑级机甲，搭载九级定制魂导重武。',
    icon: 'Crosshair',
    powerRating: 7500,
    hpBonus: 32000,
    atkBonus: 3800,
    defBonus: 2400,
    speedBonus: 110,
    critBonus: 35,
    specialSkill: {
      name: '天圣湮灭神光',
      desc: '汇聚全部能量释放正电子湮灭光柱，撕裂敌舰护盾，造成820%毁灭伤害！',
      dmgMultiplier: 8.2,
      cooldownTurns: 3
    },
    isUnlocked: false,
    isEquipped: false,
    cost: {
      gold: 80000,
      spaceGold: 3500,
      starCores: 25,
      metals: { '魂锻赤金': 30, '天锻神金': 5 }
    },
    upgradeCost: {
      gold: 25000,
      spaceGold: 1200,
      metals: { '魂锻赤金': 15, '天锻神金': 3 }
    },
    modules: {
      weapon: '九级湮灭粒子重炮',
      armor: '魂锻赤金自愈液态纳米甲',
      thruster: '星芒反物质折跃推进器'
    }
  },
  {
    id: 'mecha_red_dragon_god',
    name: '红级·神级龙皇降世神甲',
    grade: 'red',
    gradeName: '神级至尊神甲',
    level: 1,
    type: 'god',
    typeName: '超神级造物神甲',
    description: '斗罗星系的至高巅峰杰作！融合龙皇髓晶与天锻神金，傲视星河星系！',
    icon: 'Crown',
    powerRating: 18000,
    hpBonus: 78000,
    atkBonus: 9500,
    defBonus: 6800,
    speedBonus: 180,
    critBonus: 50,
    specialSkill: {
      name: '龙皇天谴破星斩',
      desc: '调动九彩龙神之力与行星重力，降下神罚天光造成1600%真实伤害！',
      dmgMultiplier: 16.0,
      cooldownTurns: 4
    },
    isUnlocked: false,
    isEquipped: false,
    cost: {
      gold: 200000,
      spaceGold: 10000,
      starCores: 80,
      metals: { '天锻神金': 25, '魂锻赤金': 50 }
    },
    upgradeCost: {
      gold: 50000,
      spaceGold: 3000,
      metals: { '天锻神金': 10, '魂锻赤金': 20 }
    },
    modules: {
      weapon: '超神器·龙皇开天破虚枪',
      armor: '天锻七彩神级生命神甲',
      thruster: '超维度神级微奇点引擎'
    }
  }
];

export const INITIAL_FIGHTERS: FighterJet[] = [
  {
    id: 'fighter_ghost_recon',
    name: '幽灵隐形战机',
    grade: 'standard',
    gradeName: '标准级战机',
    type: 'stealth',
    typeName: '隐形侦察机',
    description: '全频谱雷达隐身战机，执行深入敌后侦察与激光制导任务。',
    level: 1,
    atk: 380,
    speed: 120,
    shield: 800,
    specialWeapon: '光学隐身脉冲机炮',
    isUnlocked: true,
    isInHangar: true,
    cost: { gold: 3000, spaceGold: 80, metals: { '百锻沉金': 8 } }
  },
  {
    id: 'fighter_blazing_sun',
    name: '烈阳超音速拦截机',
    grade: 'elite',
    gradeName: '精英级战机',
    type: 'interceptor',
    typeName: '高速拦截机',
    description: '装备双等离子矢量推进引擎，擅长追猎突防机甲与反舰导弹群。',
    level: 1,
    atk: 850,
    speed: 210,
    shield: 2200,
    specialWeapon: '双联炽烈等离子航炮',
    isUnlocked: false,
    isInHangar: false,
    cost: { gold: 12000, spaceGold: 300, starCores: 2, metals: { '百锻沉金': 20, '灵锻秘银': 8 } }
  },
  {
    id: 'fighter_void_breaker',
    name: '破虚重型星际轰炸机',
    grade: 'ace',
    gradeName: '王牌级战机',
    type: 'bomber',
    typeName: '重型轰炸机',
    description: '机腹容纳高能反舰鱼雷舱，单次投弹足以摧毁巡洋舰的主推进器。',
    level: 1,
    atk: 2200,
    speed: 140,
    shield: 5500,
    specialWeapon: '反物质破虚鱼雷矩阵',
    isUnlocked: false,
    isInHangar: false,
    cost: { gold: 35000, spaceGold: 1000, starCores: 10, metals: { '灵锻秘银': 20, '魂锻赤金': 8 } }
  },
  {
    id: 'fighter_dragon_god_air',
    name: '龙王至尊神级战机',
    grade: 'god',
    gradeName: '神级战机',
    type: 'god',
    typeName: '神级至尊主宰',
    description: '史莱克星战分院至高杰作，单机战力堪比封号斗罗！',
    level: 1,
    atk: 5800,
    speed: 320,
    shield: 16000,
    specialWeapon: '龙神之怒·裂空空间重炮',
    isUnlocked: false,
    isInHangar: false,
    cost: { gold: 90000, spaceGold: 4500, starCores: 40, metals: { '天锻神金': 12, '魂锻赤金': 25 } }
  }
];

export const INITIAL_STARSHIPS: Starship[] = [
  {
    id: 'ship_meteor_corvette',
    name: '流星级巡逻护卫舰',
    shipClass: 'corvette',
    className: '护卫舰',
    level: 1,
    hullHp: 15000,
    maxHullHp: 15000,
    shield: 8000,
    maxShield: 8000,
    cannonAtk: 1200,
    fighterCapacity: 2,
    cargoCapacity: 50,
    mainWeaponName: '双联速射光子主炮',
    mainWeaponDesc: '高频能量射线，能快速削减敌方护盾能量。',
    isUnlocked: true,
    isFlagship: true,
    cost: { gold: 10000, spaceGold: 200, metals: { '百锻沉金': 15 } }
  },
  {
    id: 'ship_thunder_destroyer',
    name: '雷霆级突击驱逐舰',
    shipClass: 'destroyer',
    className: '驱逐舰',
    level: 1,
    hullHp: 38000,
    maxHullHp: 38000,
    shield: 22000,
    maxShield: 22000,
    cannonAtk: 3200,
    fighterCapacity: 4,
    cargoCapacity: 120,
    mainWeaponName: '雷暴脉冲高能主炮',
    mainWeaponDesc: '释放强烈电磁脉冲，令敌方通讯与武器系统发生过载。',
    isUnlocked: false,
    isFlagship: false,
    cost: { gold: 40000, spaceGold: 1200, starCores: 8, metals: { '百锻沉金': 40, '灵锻秘银': 20 } }
  },
  {
    id: 'ship_dawn_cruiser',
    name: '破晓级重型巡洋舰',
    shipClass: 'cruiser',
    className: '巡洋舰',
    level: 1,
    hullHp: 85000,
    maxHullHp: 85000,
    shield: 52000,
    maxShield: 52000,
    cannonAtk: 7500,
    fighterCapacity: 8,
    cargoCapacity: 300,
    mainWeaponName: '破晓超聚能湮灭正电子炮',
    mainWeaponDesc: '大口径正电子穿透炮，直穿巡洋舰重型装甲板。',
    isUnlocked: false,
    isFlagship: false,
    cost: { gold: 100000, spaceGold: 3500, starCores: 25, metals: { '灵锻秘银': 50, '魂锻赤金': 20 } }
  },
  {
    id: 'ship_wargod_battleship',
    name: '战神级主力战列舰',
    shipClass: 'battleship',
    className: '主力战列舰',
    level: 1,
    hullHp: 200000,
    maxHullHp: 200000,
    shield: 130000,
    maxShield: 130000,
    cannonAtk: 18000,
    fighterCapacity: 16,
    cargoCapacity: 800,
    mainWeaponName: '九级定装弑神重炮群',
    mainWeaponDesc: '六座三联装旋转重型炮塔，一轮齐射可全歼敌方舰队！',
    isUnlocked: false,
    isFlagship: false,
    cost: { gold: 250000, spaceGold: 8000, starCores: 60, metals: { '魂锻赤金': 60, '天锻神金': 15 } }
  },
  {
    id: 'ship_dragon_carrier',
    name: '龙王级空天母舰',
    shipClass: 'carrier',
    className: '空天母舰',
    level: 1,
    hullHp: 320000,
    maxHullHp: 320000,
    shield: 220000,
    maxShield: 220000,
    cannonAtk: 26000,
    fighterCapacity: 40,
    cargoCapacity: 2000,
    mainWeaponName: '龙王蜂群机甲弹射矩阵',
    mainWeaponDesc: '瞬间弹射满编机甲大队与超音速战机，封锁整片星区！',
    isUnlocked: false,
    isFlagship: false,
    cost: { gold: 500000, spaceGold: 18000, starCores: 150, metals: { '魂锻赤金': 100, '天锻神金': 35 } }
  },
  {
    id: 'ship_33wings_flagship',
    name: '三十三翼·行星歼星旗舰',
    shipClass: 'flagship',
    className: '行星级旗舰',
    level: 1,
    hullHp: 750000,
    maxHullHp: 750000,
    shield: 500000,
    maxShield: 500000,
    cannonAtk: 65000,
    fighterCapacity: 100,
    cargoCapacity: 5000,
    mainWeaponName: '超神技·天圣裂渊湮灭歼星主炮',
    mainWeaponDesc: '调取引力塌缩与虚空裂隙能量，一击摧毁整颗小行星！',
    isUnlocked: false,
    isFlagship: false,
    cost: { gold: 1200000, spaceGold: 45000, starCores: 350, metals: { '天锻神金': 80, '魂锻赤金': 200 } }
  }
];

export const PLANETS_DATA: PlanetInfo[] = [
  {
    id: 'bluestar',
    name: '母星·蓝星（斗罗星）',
    title: '文明摇篮 · 科技要塞',
    description: '斗罗联邦大本营、史莱克学院与唐门总部所在地。拥有最顶尖的机甲科研所与行星防御矩阵。',
    affiliation: '斗罗联邦 / 史莱克学院',
    distanceLightYears: 0,
    warpEnergyCost: 0,
    dangerLevel: 'safe',
    themeColor: 'from-blue-600 to-indigo-950',
    bgGradient: 'bg-gradient-to-b from-blue-950/80 via-slate-900 to-slate-950',
    tradeGoods: [
      {
        goodId: 'tg_soul_battery',
        name: '高能魂力储能奶瓶',
        category: 'energy',
        categoryName: '高能能源',
        basePrice: 150,
        currentPrice: 150,
        trend: 'stable',
        stock: 500,
        description: '蓝星特产魂导科技，为战机与机甲提供源源不断的魂力充能。',
        icon: 'Zap'
      },
      {
        goodId: 'tg_mecha_chip',
        name: '沉金智能机甲芯片',
        category: 'weapon',
        categoryName: '军工科技',
        basePrice: 400,
        currentPrice: 420,
        trend: 'rising',
        stock: 200,
        description: '高精密神经元控制芯片，在天马星与罪恶星球极度紧俏。',
        icon: 'Cpu'
      },
      {
        goodId: 'tg_tang_alloy',
        name: '唐门特制玄铁合金',
        category: 'ore',
        categoryName: '稀有金属',
        basePrice: 280,
        currentPrice: 260,
        trend: 'falling',
        stock: 350,
        description: '高硬度韧性合金，星际战舰防护外壳常用材料。',
        icon: 'Shield'
      }
    ],
    specialFeatures: [
      '蓝星司令部：建造战舰、改造机甲、构筑行星防御要塞',
      '星际预警雷达：实时追踪外星深红侵略舰队动向',
      '资源兑换所：使用星核兑换海量天锻神金与秘宝'
    ],
    exclusiveMissions: [
      {
        id: 'mission_bs_1',
        title: '运输天马圣泉水以增强母星科研',
        demandGoodId: 'tg_pegasus_water',
        demandCount: 15,
        rewardSpaceGold: 3000,
        rewardStarCores: 10,
        rewardMedals: 5,
        isCompleted: false
      }
    ]
  },
  {
    id: 'pegasus',
    name: '天马星',
    title: '天马圣湖 · 能量圣地',
    description: '龙马双子星之一，笼罩在浓郁的生命本源能量与天马斗气中，天马骑士团的故乡。',
    affiliation: '龙马联邦 · 天马族',
    distanceLightYears: 12.5,
    warpEnergyCost: 15,
    dangerLevel: 'moderate',
    themeColor: 'from-amber-500 to-yellow-950',
    bgGradient: 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-950',
    tradeGoods: [
      {
        goodId: 'tg_pegasus_water',
        name: '天马圣湖极品圣泉水',
        category: 'biotech',
        categoryName: '生命本源',
        basePrice: 500,
        currentPrice: 520,
        trend: 'surging',
        stock: 120,
        description: '富含纯净生命源能的核心泉水，在蓝星能卖出天价。',
        icon: 'Droplets'
      },
      {
        goodId: 'tg_pegasus_crystal',
        name: '天马至纯斗气晶石',
        category: 'energy',
        categoryName: '高能能源',
        basePrice: 850,
        currentPrice: 810,
        trend: 'stable',
        stock: 80,
        description: '天马骑士修炼核心，可大幅加速战舰与机甲护盾充能。',
        icon: 'Sparkles'
      }
    ],
    specialFeatures: [
      '天马圣山集市：高价收购蓝星机甲芯片与高能奶瓶',
      '天马源气淬体：在圣湖休整可提升机甲契合度'
    ],
    exclusiveMissions: [
      {
        id: 'mission_peg_1',
        title: '收购母星沉金智能机甲芯片',
        demandGoodId: 'tg_mecha_chip',
        demandCount: 20,
        rewardSpaceGold: 5000,
        rewardStarCores: 15,
        rewardMedals: 8,
        isCompleted: false
      }
    ]
  },
  {
    id: 'dragon',
    name: '天龙星',
    title: '龙力觉醒 · 龙骑士之乡',
    description: '龙马联邦首府星球，由十八位神级龙骑士共同统治，遍布龙脉与远古龙族遗骸。',
    affiliation: '龙马联邦 · 龙族',
    distanceLightYears: 18.0,
    warpEnergyCost: 25,
    dangerLevel: 'perilous',
    themeColor: 'from-rose-600 to-red-950',
    bgGradient: 'bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-950',
    tradeGoods: [
      {
        goodId: 'tg_dragon_marrow',
        name: '真龙髓晶原石',
        category: 'ore',
        categoryName: '神级矿藏',
        basePrice: 1200,
        currentPrice: 1350,
        trend: 'surging',
        stock: 60,
        description: '采自万米深渊龙穴的髓晶，神级机甲与歼星旗舰的核心原料！',
        icon: 'Flame'
      },
      {
        goodId: 'tg_dragon_scale_ore',
        name: '赤金龙鳞原矿',
        category: 'ore',
        categoryName: '稀有金属',
        basePrice: 650,
        currentPrice: 600,
        trend: 'falling',
        stock: 150,
        description: '附带真龙威压的坚韧矿石，可熔炼神金与战舰重装甲板。',
        icon: 'Shield'
      }
    ],
    specialFeatures: [
      '升龙台集市：与龙骑士兑换神级战舰图纸',
      '龙神遗迹探索：探寻失落的远古龙族星际科技'
    ]
  },
  {
    id: 'sin_planet',
    name: '罪恶星球（小行星黑市）',
    title: '法外之地 · 走私黑市',
    description: '星际海盗与亡命之徒聚集的法外小行星带，充斥着黑市改造与失落的古神图纸。',
    affiliation: '罪恶之城 / 自由海盗联盟',
    distanceLightYears: 28.5,
    warpEnergyCost: 35,
    dangerLevel: 'extreme',
    themeColor: 'from-purple-600 to-slate-950',
    bgGradient: 'bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950',
    tradeGoods: [
      {
        goodId: 'tg_black_market_relic',
        name: '失落星神古遗物残件',
        category: 'relic',
        categoryName: '古老遗物',
        basePrice: 2200,
        currentPrice: 2850,
        trend: 'surging',
        stock: 30,
        description: '上古神界大战遗落的神秘机械部件，可解锁超神级歼星炮。',
        icon: 'Cpu'
      },
      {
        goodId: 'tg_contraband_fuel',
        name: '违禁黑市反物质燃剂',
        category: 'energy',
        categoryName: '禁忌能源',
        basePrice: 950,
        currentPrice: 720,
        trend: 'crashing',
        stock: 90,
        description: '非法提纯的高危反物质燃料，短时间内可令战舰航速与主炮威力翻倍！',
        icon: 'Zap'
      }
    ],
    specialFeatures: [
      '地下黑市拍卖：使用星币竞拍稀有神甲与机甲蓝图',
      '赏金酒馆：招募流亡王牌驾驶员与护航战机编队'
    ]
  },
  {
    id: 'senluo',
    name: '森罗星',
    title: '魂兽圣地 · 世界之树',
    description: '斗罗魂兽的第二家园，拥有擎天耸立的生命世界之树，十万年魂兽在此繁衍生息。',
    affiliation: '魂兽圣地 / 森罗兽王殿',
    distanceLightYears: 15.0,
    warpEnergyCost: 20,
    dangerLevel: 'safe',
    themeColor: 'from-emerald-600 to-teal-950',
    bgGradient: 'bg-gradient-to-b from-emerald-950/80 via-slate-900 to-slate-950',
    tradeGoods: [
      {
        goodId: 'tg_world_tree_nectar',
        name: '世界之树生命灵液',
        category: 'biotech',
        categoryName: '生命本源',
        basePrice: 1100,
        currentPrice: 1050,
        trend: 'stable',
        stock: 75,
        description: '世界之树凝练的至纯生命玉露，可修复战舰舰体损耗并恢复全队魂力。',
        icon: 'Droplets'
      },
      {
        goodId: 'tg_beast_spirit_amber',
        name: '远古兽魂古珀',
        category: 'ore',
        categoryName: '神级矿藏',
        basePrice: 780,
        currentPrice: 820,
        trend: 'rising',
        stock: 110,
        description: '千万年形成的结晶兽魂珀石，用于光学雷达与机甲神经共鸣。',
        icon: 'Sparkles'
      }
    ],
    specialFeatures: [
      '世界树祭坛：沐浴古树神光全额恢复全部战舰耐久',
      '兽魂契约：获取高级兽魂助力星际外交与贸易'
    ]
  },
  {
    id: 'elven',
    name: '精灵星',
    title: '自然秘境 · 星海明珠',
    description: '精灵一族繁衍生息的绚丽森林母星，盛产自然月井泉水与星空圣果。',
    affiliation: '精灵王庭',
    distanceLightYears: 22.0,
    warpEnergyCost: 28,
    dangerLevel: 'moderate',
    themeColor: 'from-teal-500 to-cyan-950',
    bgGradient: 'bg-gradient-to-b from-teal-950/80 via-slate-900 to-slate-950',
    tradeGoods: [
      {
        goodId: 'tg_nature_dew',
        name: '精灵自然月华之露',
        category: 'biotech',
        categoryName: '生命本源',
        basePrice: 620,
        currentPrice: 660,
        trend: 'rising',
        stock: 140,
        description: '从精灵月亮井采撷的清冽甘露，在蓝星属于奢华珍品。',
        icon: 'Droplets'
      },
      {
        goodId: 'tg_starry_fruit',
        name: '七彩星空灵圣果',
        category: 'biotech',
        categoryName: '生命本源',
        basePrice: 1450,
        currentPrice: 1580,
        trend: 'surging',
        stock: 45,
        description: '百年方结一颗的星空灵果，洗涤神识，提供庞大精神能量。',
        icon: 'Sparkles'
      }
    ],
    specialFeatures: [
      '精灵王港：高价收购蓝星高能魂力奶瓶与防御魂导器',
      '月神祈福：下一次星际空间跳跃消耗能量减半'
    ]
  }
];

export const ALIEN_INVASION_FLEETS: AlienInvasionFleet[] = [
  {
    id: 'fleet_pirate_wolfpack',
    name: '罪恶星际掠夺者·黑狼群突击舰队',
    faction: '罪恶之城·狂鲨海盗团',
    commander: '独眼狂鲨·莫顿',
    description: '趁母星防御换防之际潜入近地轨道，企图掠夺科研卫星与货运飞船！',
    threatLevel: 'B',
    fleetHp: 65000,
    maxFleetHp: 65000,
    shieldHp: 35000,
    maxShieldHp: 35000,
    fleetAtk: 4200,
    specialSkills: [
      {
        name: '改装离子散弹重炮',
        desc: '近距爆发大面积散弹齐射，造成6,800点破盾伤害。',
        dmg: 6800,
        shieldPenetration: 15
      },
      {
        name: '自爆突击穿梭机',
        desc: '弹射3架满载烈性炸药的穿梭机撞击我方防线！',
        dmg: 9500
      }
    ],
    rewards: {
      spaceGold: 3000,
      starCores: 6,
      defenseMedals: 5,
      divineMetals: { '百锻沉金': 20, '灵锻秘银': 10 },
      droppedBlueprintName: '雷霆驱逐舰装甲加固蓝图'
    }
  },
  {
    id: 'fleet_longma_warhawks',
    name: '龙马极端主战派·赤龙战列编队',
    faction: '天龙星·狂暴龙裔军团',
    commander: '赤龙骑士随从·奥尔森',
    description: '主战派派出重型战列舰与龙鳞机甲，在母星外围拉起能量封锁网！',
    threatLevel: 'A',
    fleetHp: 160000,
    maxFleetHp: 160000,
    shieldHp: 95000,
    maxShieldHp: 95000,
    fleetAtk: 9800,
    specialSkills: [
      {
        name: '龙炎聚能主炮',
        desc: '龙头主炮喷射赤热龙息，造成18,000点高温热熔伤害并融毁装甲！',
        dmg: 18000,
        shieldPenetration: 30
      },
      {
        name: '龙鳞机甲冲锋狂潮',
        desc: '整编制赤龙机甲联队贴舰近战突刺我方阵线！',
        dmg: 22000
      }
    ],
    rewards: {
      spaceGold: 8000,
      starCores: 20,
      defenseMedals: 15,
      divineMetals: { '灵锻秘银': 30, '魂锻赤金': 15 },
      droppedBlueprintName: '破晓重巡洋舰主炮核心'
    }
  },
  {
    id: 'fleet_crimson_vanguard',
    name: '深红之域·吞噬魔影先锋军团',
    faction: '深红之域·深红之母麾下',
    commander: '深红噬魂尊者',
    description: '深红位面的恐怖先锋军，吞噬一切行星生命本源，将万物化为深红养分！',
    threatLevel: 'S',
    fleetHp: 380000,
    maxFleetHp: 380000,
    shieldHp: 220000,
    maxShieldHp: 220000,
    fleetAtk: 24000,
    specialSkills: [
      {
        name: '深红蚀能狂潮',
        desc: '释放大范围暗黑腐蚀波穿透护盾，造成42,000点生命吸取伤害！',
        dmg: 42000,
        shieldPenetration: 50
      },
      {
        name: '深红魔像战体冲撞',
        desc: '深红巨魔撕裂空间撞击旗舰，造成58,000点毁灭伤害！',
        dmg: 58000
      }
    ],
    rewards: {
      spaceGold: 25000,
      starCores: 60,
      defenseMedals: 40,
      divineMetals: { '魂锻赤金': 40, '天锻神金': 10 },
      droppedBlueprintName: '战神级战列舰弑神炮蓝图'
    }
  },
  {
    id: 'fleet_crimson_mother_avatar',
    name: '深红之母·灭世母巢旗舰舰队',
    faction: '深红之域至高主宰',
    commander: '深红之母·半神法相',
    description: '深红之母本尊率领深红之域庞大母巢亲临！誓死保卫母星蓝星安危！',
    threatLevel: 'SS',
    fleetHp: 900000,
    maxFleetHp: 900000,
    shieldHp: 550000,
    maxShieldHp: 550000,
    fleetAtk: 55000,
    specialSkills: [
      {
        name: '深红界域终焉吞噬',
        desc: '凝聚毁灭黑洞，全场释放110,000点行星级真实伤害！',
        dmg: 110000,
        shieldPenetration: 70
      },
      {
        name: '不死深红再生魔茧',
        desc: '张开不死领域，瞬间恢复120,000点护盾与生命，并提升30%攻击力！',
        dmg: 35000
      }
    ],
    rewards: {
      spaceGold: 80000,
      starCores: 180,
      defenseMedals: 120,
      divineMetals: { '天锻神金': 35, '魂锻赤金': 80 },
      droppedBlueprintName: '三十三翼·行星旗舰动力核心'
    }
  },
  {
    id: 'fleet_void_world_eater',
    name: '虚空裂隙·宇宙破灭者终极母舰',
    faction: '外维度破灭侵蚀舰队',
    commander: '虚空吞星魔皇',
    description: '来自未知域外的灭世级星际堡垒，企图将龙马与斗罗两大星系同化为虚空废墟！',
    threatLevel: 'SSS',
    fleetHp: 2000000,
    maxFleetHp: 2000000,
    shieldHp: 1200000,
    maxShieldHp: 1200000,
    fleetAtk: 120000,
    specialSkills: [
      {
        name: '超维度时空塌缩炮',
        desc: '发射零点射线瓦解维度，造成250,000点超神级爆发伤害！',
        dmg: 250000,
        shieldPenetration: 90
      },
      {
        name: '虚空引力湮灭风暴',
        desc: '引动引力透镜风暴撕裂战舰外壳，造成180,000点全屏伤害！',
        dmg: 180000
      }
    ],
    rewards: {
      spaceGold: 200000,
      starCores: 500,
      defenseMedals: 300,
      divineMetals: { '天锻神金': 100, '魂锻赤金': 200 },
      droppedBlueprintName: '超神器·红级神甲龙神之心'
    }
  }
];

export const SPACE_EVENTS: SpaceEvent[] = [
  {
    id: 'evt_asteroid_mine',
    title: '发现高密度陨石神金矿带',
    type: 'salvage',
    description: '在行星间的引力跃迁航线上发现一片未被开采的稀有神金陨石带！',
    options: [
      {
        text: '出动突击机甲与主炮开采神金',
        effectType: 'gain_reward',
        rewardDesc: '获得【百锻沉金 x15】、【灵锻秘银 x8】与 1,500 联邦星币！'
      },
      {
        text: '加速航行快速绕过',
        effectType: 'risk_gamble',
        rewardDesc: '安全平稳穿过陨石区。'
      }
    ]
  },
  {
    id: 'evt_distress_beacon',
    title: '截获友军货运商船求救信号',
    type: 'pirate',
    description: '一艘从天马星返航的母星商船遭遇星际海盗截击，正在紧急呼叫护航！',
    options: [
      {
        text: '全舰迎战击溃海盗',
        effectType: 'space_fight',
        rewardDesc: '护航成功！商船赠予 3,000 星币、天马圣泉水 x3 与 5 枚母星防御勋章！'
      },
      {
        text: '规避风险，保持无线电静默',
        effectType: 'risk_gamble',
        rewardDesc: '悄然驶离危险区域。'
      }
    ]
  },
  {
    id: 'evt_wormhole_anomaly',
    title: '偶遇微型虚空折跃虫洞',
    type: 'anomaly',
    description: '前方探测到异常空间扭曲，似乎通往未知星系的神秘远古遗迹！',
    options: [
      {
        text: '开启相位护盾穿越虫洞',
        effectType: 'gain_reward',
        rewardDesc: '探索成功！获得【星核 x5】与【失落星神古遗物残件 x2】！'
      },
      {
        text: '就地扫描收集引力数据',
        effectType: 'gain_reward',
        rewardDesc: '获得 1,200 联邦星币与【沉金智能机甲芯片 x2】。'
      }
    ]
  }
];

export const EXPEDITION_DESTINATIONS: ExpeditionDestination[] = [
  {
    id: 'exp_pegasus_spring',
    name: '天马圣湖·能量秘银航线',
    targetPlanetId: 'pegasus',
    targetPlanetName: '天马星',
    durationSeconds: 45,
    requiredFleetPower: 1000,
    riskLevel: 'safe',
    riskTitle: '安全航线',
    description: '派遣战舰前往天马圣湖建立定期采矿站，采运圣泉精华与灵锻秘银。',
    icon: 'Sparkles',
    badgeColor: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
    rewards: {
      spaceGold: 650,
      starCores: 2,
      defenseMedals: 2,
      divineMetals: { '百锻沉金': 15, '灵锻秘银': 6 },
      specialGoodName: '天马圣湖极品圣泉水'
    }
  },
  {
    id: 'exp_elven_starlight',
    name: '精灵星·月井星果运输队',
    targetPlanetId: 'elven',
    targetPlanetName: '精灵星',
    durationSeconds: 60,
    requiredFleetPower: 2200,
    riskLevel: 'low',
    riskTitle: '低危航线',
    description: '与精灵王庭展开定期贸易，以魂力奶瓶换取七彩星空灵圣果与百锻沉金。',
    icon: 'Droplets',
    badgeColor: 'border-teal-500/50 bg-teal-950/40 text-teal-300',
    rewards: {
      spaceGold: 1100,
      starCores: 4,
      defenseMedals: 3,
      divineMetals: { '百锻沉金': 20, '灵锻秘银': 8 },
      specialGoodName: '七彩星空灵圣果'
    }
  },
  {
    id: 'exp_dragon_marrow',
    name: '远古天龙星·赤金采掘舰队',
    targetPlanetId: 'dragon',
    targetPlanetName: '天龙星',
    durationSeconds: 90,
    requiredFleetPower: 4500,
    riskLevel: 'moderate',
    riskTitle: '中危探险',
    description: '顶住天龙星的高重力场开采真龙髓晶、赤金龙鳞与天锻神金。',
    icon: 'Flame',
    badgeColor: 'border-rose-500/50 bg-rose-950/40 text-rose-300',
    rewards: {
      spaceGold: 1800,
      starCores: 6,
      defenseMedals: 5,
      divineMetals: { '灵锻秘银': 12, '魂锻赤金': 8, '天锻神金': 2 },
      specialGoodName: '真龙髓晶原石'
    }
  },
  {
    id: 'exp_senluo_amber',
    name: '森罗星·远古兽珀勘探',
    targetPlanetId: 'senluo',
    targetPlanetName: '森罗星',
    durationSeconds: 120,
    requiredFleetPower: 6000,
    riskLevel: 'moderate',
    riskTitle: '中危探险',
    description: '深入森罗圣地世界树根系采集万年兽魂古珀与深海沉银。',
    icon: 'Compass',
    badgeColor: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300',
    rewards: {
      spaceGold: 2200,
      starCores: 8,
      defenseMedals: 6,
      divineMetals: { '深海沉银': 30, '百锻沉金': 25, '灵锻秘银': 12 },
      specialGoodName: '远古兽魂古珀'
    }
  },
  {
    id: 'exp_sin_smuggle',
    name: '罪恶星区·黑市淘金特遣队',
    targetPlanetId: 'sin_planet',
    targetPlanetName: '罪恶星球',
    durationSeconds: 150,
    requiredFleetPower: 9500,
    riskLevel: 'high',
    riskTitle: '高危海盗区',
    description: '派遣伪装战舰潜入黑市拍卖会，低价扫货失落遗物与高阶天锻神金。',
    icon: 'ShieldAlert',
    badgeColor: 'border-purple-500/50 bg-purple-950/40 text-purple-300',
    rewards: {
      spaceGold: 3600,
      starCores: 12,
      defenseMedals: 10,
      divineMetals: { '魂锻赤金': 16, '天锻神金': 5, '深海沉银': 35 },
      specialGoodName: '失落星神古遗物残件'
    }
  },
  {
    id: 'exp_crimson_ruins',
    name: '深红之域·奇点深空打捞',
    targetPlanetId: 'deep_space',
    targetPlanetName: '深红深空界域',
    durationSeconds: 210,
    requiredFleetPower: 18000,
    riskLevel: 'legendary',
    riskTitle: '超神绝境打捞',
    description: '穿过超维度虫洞直达远古深红古战场，用旗舰牵引光束打捞超神级本源之石！',
    icon: 'Rocket',
    badgeColor: 'border-cyan-400/60 bg-cyan-950/50 text-cyan-200',
    rewards: {
      spaceGold: 6800,
      starCores: 28,
      defenseMedals: 20,
      divineMetals: { '天锻神金': 10, '魂锻赤金': 30, '至高创世神石': 2 },
      specialGoodName: '超神级歼星核心碎片'
    }
  }
];

export function createDefaultInterstellarState(): InterstellarState {
  return {
    currentPlanetId: 'bluestar',
    spaceGold: 1500,
    starCores: 10,
    defenseMedals: 5,
    defenseGridLevel: 1,
    defenseShieldHp: 50000,
    maxDefenseShieldHp: 50000,
    planetaryPeaceRating: 100,
    mechas: JSON.parse(JSON.stringify(INITIAL_MECHAS)),
    fighters: JSON.parse(JSON.stringify(INITIAL_FIGHTERS)),
    starships: JSON.parse(JSON.stringify(INITIAL_STARSHIPS)),
    activeFlagshipId: 'ship_meteor_corvette',
    cargo: [
      { goodId: 'tg_soul_battery', name: '高能魂力储能奶瓶', quantity: 10, buyAvgPrice: 150 }
    ],
    cargoCapacity: 50,
    tradeHistoryCount: 0,
    totalTradeProfits: 0,
    repelledInvasionsCount: 0,
    lastDailyMarketRefresh: Date.now(),
    activeExpeditions: [],
    completedExpeditionsCount: 0
  };
}

