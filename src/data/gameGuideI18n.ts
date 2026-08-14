import React from 'react';
import { GameView } from '../components/Navbar';

export type GuideLanguage = 'zh' | 'en' | 'bilingual';

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface LocalizedStringArray {
  zh: string[];
  en: string[];
}

export interface LocalizedSystemGuide {
  id: GameView;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: 'core' | 'battle' | 'sect_tech' | 'interstellar' | 'godhood';
  badge: LocalizedText;
  douluoSeries: LocalizedText;
  summary: LocalizedText;
  coreFunctions: LocalizedStringArray;
  keyRewards: LocalizedStringArray;
  proTips: LocalizedText;
}

export interface LocalizedProgressionStage {
  stage: LocalizedText;
  levelRange: LocalizedText;
  icon: string;
  tasks: LocalizedStringArray;
  targetTitle: LocalizedText;
}

export interface LocalizedCombatGuideItem {
  id: string;
  num: string;
  title: LocalizedText;
  desc: LocalizedText;
  themeColor: string;
  borderColor: string;
  iconName: string;
}

export interface LocalizedFAQItem {
  q: LocalizedText;
  a: LocalizedText;
}

export const GUIDE_SYSTEMS_I18N: LocalizedSystemGuide[] = [
  {
    id: 'character',
    title: {
      zh: '魂师面板',
      en: 'Soul Master Profile'
    },
    subtitle: {
      zh: '武魂掌控 · 属性加点 · 魂环配置 · 战力总评',
      en: 'Martial Souls · Stat Allocation · Soul Rings · Power Rating'
    },
    category: 'core',
    badge: {
      zh: '基础核心',
      en: 'Core System'
    },
    douluoSeries: {
      zh: '全系列通用',
      en: 'All Douluo Series'
    },
    summary: {
      zh: '魂师修行的立身之本。在此查看并切换当前主战武魂（支持双生武魂自由切换），配置一至十魂环年份与主动/被动魂技，消耗属性点自由加点六大维度，实时评测当前修罗/海神战力。',
      en: 'The foundation of a Soul Master. View and switch your active Martial Soul (full Twin Martial Souls support), configure 1st to 10th Soul Rings with active/passive skills, allocate free stat points across six core dimensions, and calculate real-time combat power rating.'
    },
    coreFunctions: {
      zh: [
        '主副双生武魂实时切换，两套独立魂环与技能树',
        '觉醒第二神级武魂（如昊天锤、六翼天使、九宝琉璃塔等）',
        '魂环配置与神级魂环年限展示（十年至百万年神级）',
        '魂骨装备槽位全景与外附魂骨状态查看',
        '升级自由分配天道属性点（攻击、防御、生命、暴击、速度）'
      ],
      en: [
        'Seamless Twin Martial Soul switching with two independent soul ring & skill trees',
        'Awaken secondary God-tier Martial Souls (Clear Sky Hammer, Seraphim, Nine Treasure Pagoda, etc.)',
        'Soul Ring configuration & cultivation age display (10 Years to 1,000,000 Years God-tier)',
        'Full panoramic 6-piece Soul Bones and External Soul Bone status review',
        'Level-up free stat point allocation (Attack, Defense, HP, Crit Rate, Speed)'
      ]
    },
    keyRewards: {
      zh: ['自由切换战斗流派', '全维度战力属性自定义加成', '封号斗罗至高称号'],
      en: ['Flexible Combat Archetypes', 'Full-Dimensional Custom Stat Boosts', 'Titled Douluo Supreme Honor']
    },
    proTips: {
      zh: '每次等级提升都会获得自由属性点，敏攻系推荐主堆敏捷与暴击，强攻系推荐主攻击与生命！',
      en: 'Each level up awards free stat points. Agility Attack masters should prioritize Agility and Crit Rate, while Power Attack masters should focus on Attack and Max HP!'
    }
  },
  {
    id: 'multiplayer',
    title: {
      zh: '跨服实时PVP与弑神共斗',
      en: 'Cross-Server PVP & God-Slaying Co-op'
    },
    subtitle: {
      zh: '真人天梯对决 · 跨服传音 · 组队围猎凶兽 · 封号神榜',
      en: 'Real-time Ranked Ladder · Global Broadcasting · Beast Hunting Co-op · Godhood Pantheon'
    },
    category: 'battle',
    badge: {
      zh: '实时联机',
      en: 'Real-Time Multiplayer'
    },
    douluoSeries: {
      zh: '全服跨服互联',
      en: 'Cross-Server Network'
    },
    summary: {
      zh: '全大陆跨服多人联机中心！支持在线魂师大厅即时传音、检视全服玩家武魂斗铠配置、一键天梯排位匹配1v1真合格斗、15秒倒计时回合决策、以及2~4人组队围猎深海魔鲸王等百万年神兽。',
      en: 'The cross-server multiplayer nexus of the Douluo Continent! Features online lobby chat broadcasting, full gear & battle armor inspection of other masters, instant 1v1 ladder ranked matchmaking with 15s turn decisions, and 2-4 player co-op raids against million-year god beasts.'
    },
    coreFunctions: {
      zh: [
        '一键全大陆跨服天梯排位匹配，天梯积分与斗魂勋章结算',
        '在线魂师广场：检视全服玩家配置，发送约战请帖',
        '全服跨服传音阁（世界/约战/组队多频道实时广播）',
        '跨服弑神共斗：2~4人组队讨伐深海魔鲸王、邪眼暴君与深红之母',
        '全服天梯封号至尊榜与综合战力神榜'
      ],
      en: [
        'Instant cross-server ranked ladder matchmaking with LP and Spirit Duelist badges',
        'Soul Master Plaza: Inspect player builds and send direct duel invitations',
        'Global Sound Transmission Pavilion (World / Duel / Party real-time channels)',
        'Co-op God-Slaying Raids: 2-4 players hunt Deep Sea Demon Whale King, Evil Eye Tyrant, and Crimson Mother',
        'Continental Supreme Godhood Pantheon and Top Power Leaderboards'
      ]
    },
    keyRewards: {
      zh: ['天梯排位积分', '斗魂冠军勋章', '天锻神金', '十万年魂骨精华', '超神源石'],
      en: ['Ranked Ladder LP', 'Spirit Duelist Champion Medals', 'Heavenly Forged Divine Metal', '100k-Yr Soul Bone Essence', 'Super-God Source Stones']
    },
    proTips: {
      zh: '在实时PVP中，合理分配魂力，优先展开领域压制对手防御，并在关键回合释放武魂真身爆发最高伤害！',
      en: 'In real-time PVP, manage your Soul Power wisely. Deploy your Domain early to suppress enemy defenses, then unleash Martial Soul True Avatar for burst lethal damage!'
    }
  },
  {
    id: 'spiritpagoda',
    title: {
      zh: '传灵塔 · 魂灵机甲',
      en: 'Spirit Pagoda · Spirit Souls & Mecha'
    },
    subtitle: {
      zh: '魂灵契约 · 并肩作战 · 机甲研制 · 万兽庇护 · 升灵台',
      en: 'Spirit Soul Contracts · Joint Combat · Mecha R&D · Sanctuary · Spirit Ascension'
    },
    category: 'sect_tech',
    badge: {
      zh: '斗罗2核心',
      en: 'Douluo II Core'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅱ绝世唐门',
      en: 'Douluo Dalu II: The Unrivaled Tang Sect'
    },
    summary: {
      zh: '霍雨浩开创的万古宗门！在此与百万年天梦冰蚕、雪帝、冰帝等神兽签订平等契约，指派2尊主力魂灵在战斗中并肩释放神技；研造紫级/黑级/红级/天火造神机甲；捐赠建设万兽庇护所，并挑战升灵台突破魂灵年限。',
      en: 'The immortal organization founded by Huo Yuhao! Form equal contracts with 1,000,000-year god beasts like Skydream Iceworm, Snow Empress, and Ice Empress. Deploy 2 active Spirit Souls to cast divine skills in battle, manufacture Purple/Black/Red/God-tier Mechas, and challenge the Spirit Ascension Platform.'
    },
    coreFunctions: {
      zh: [
        '每日领取传灵塔主俸禄与魂灵精魄',
        '与天梦冰蚕、雪帝等7尊神级魂灵签约并派遣出战',
        '研制造神机甲（紫级至神级·天火圣裁），装备机载歼星重炮',
        '建设极北/星斗万兽庇护所，提升和平指数获得全属性反哺',
        '升灵台四阶试炼（初级/中级/高级/传神），斩获万年魂灵升灵粹'
      ],
      en: [
        'Collect daily Spirit Pagoda Master salary and Spirit Soul Essences',
        'Contract with 7 God-tier Spirit Souls (Skydream Iceworm, Snow Empress, etc.) and deploy to battle',
        'Manufacture God-tier Mechas (Purple to Divine Skyfire Judgement) equipped with Star-Destroyer heavy cannons',
        'Build Far North & Great Star Dou Beast Sanctuaries for global defensive & HP auras',
        '4-Tier Spirit Ascension Platform Trials (Novice / Intermediate / Advanced / Divine) to boost soul age'
      ]
    },
    keyRewards: {
      zh: ['出战魂灵专属战斗奥义', '机甲歼星炮超能轰炸', '魂兽生态全队防御/生命光环'],
      en: ['Deployed Spirit Soul Battle Ultimates', 'Mecha Star-Destroyer Cannon Super Bombardment', 'Beast Sanctuary Team Defense/HP Auras']
    },
    proTips: {
      zh: '出战的魂灵技能在战斗面板中会独立生成释放按键，与机甲重炮配合可打出成吨爆发伤害！',
      en: 'Active Spirit Soul skills generate independent trigger buttons in battle. Combining them with Mecha Cannons produces immense burst damage!'
    }
  },
  {
    id: 'interstellar',
    title: {
      zh: '星际机甲战舰',
      en: 'Interstellar Mecha & Starships'
    },
    subtitle: {
      zh: '空天战机 · 恒星歼星舰 · 跨行星贸易 · 母星天基防御',
      en: 'Aerospace Fighters · Star Cruisers · Interplanetary Trade · Planetary Defense'
    },
    category: 'interstellar',
    badge: {
      zh: '斗罗4核心',
      en: 'Douluo IV Core'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅳ终极斗罗',
      en: 'Douluo Dalu IV: Ultimate Douluo'
    },
    summary: {
      zh: '迈向浩瀚星辰大海！建立星际科研船坞，研发制造三代空天战机与恒星级歼星巡洋战舰；驾驶飞船曲率跃迁至天马座、天龙星、罪恶星球进行大宗物资星际贸易；在轨道指挥天基防御矩阵决战深红外星母舰！',
      en: 'Venture into the cosmic sea of stars! Establish orbital shipyards, engineer Gen-3 aerospace fighters and Stellar Star-Destroyer Cruisers, warp across planets (Pegasus, Dragon Planet, Sin Planet) for lucrative trade arbitrage, and defend the mother planet against the Crimson Alien Armada!'
    },
    coreFunctions: {
      zh: [
        '制造一代超音速战机至三代天火巡航战机',
        '组装万米恒星级歼星巡洋战舰与神级反物质护盾',
        '星际星图折跃探索，5大行星大宗特产差价倒买倒卖赚取巨额金魂币与神金',
        '母星天基防御决战深红外星舰队，守卫斗罗母星和平',
        '派遣战舰全自动星际巡航与深空矿脉勘探'
      ],
      en: [
        'Construct Gen-1 Supersonic Fighters to Gen-3 Skyfire Cruise Fighters',
        'Assemble 10,000m Stellar Star-Destroyer Cruisers with Antimatter Energy Shields',
        'Star Map warp navigation across 5 planets with trade goods arbitrage for hundreds of millions of Gold & Divine Metals',
        'Command orbital Space Defense Matrix to annihilate the Crimson Mother Ship',
        'Dispatch starships on automated deep space patrol and asteroid mining expeditions'
      ]
    },
    keyRewards: {
      zh: ['数以亿计的海量金魂币与天锻神金', '歼星级超维战斗火力支援', '星际元帅神圣统帅特权'],
      en: ['Hundreds of Millions of Gold Coins & Divine Metals', 'Star-Destroyer Super Orbital Fire Support', 'Interstellar Grand Marshal Supreme Command Privileges']
    },
    proTips: {
      zh: '不同行星特产价格浮动极大，低买高卖是后期获取数千万金魂币和天锻神金的最快途径！',
      en: 'Commodity prices fluctuate wildly between planets. Buying low on Douluo and selling high on Pegasus/Sin Planet is the fastest way to amass tens of millions of Gold and Divine Metal!'
    }
  },
  {
    id: 'battlearmor',
    title: {
      zh: '斗铠魂导',
      en: 'Battle Armor & Soul Tools'
    },
    subtitle: {
      zh: '一字至五字斗铠 · 天锻神金 · 九级定装魂导炮 · 弑神魂导',
      en: 'One to Five-Word Battle Armor · Heavenly Forging · Rank-9 Stationary Soul Cannons · God-Slaying Tools'
    },
    category: 'sect_tech',
    badge: {
      zh: '斗罗3核心',
      en: 'Douluo III Core'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅲ龙王传说',
      en: 'Douluo Dalu III: Legend of the Dragon King'
    },
    summary: {
      zh: '将锻造术与魂力科技融合至巅峰！收集沉银、精金、秘银、天锻神金，从单件斗铠铸造逐步融合进阶至一字、二字、三字、四字乃至五字至尊真灵斗铠；同时研造九级定装魂导炮与十级弑神魂导器，战力翻倍暴涨。',
      en: 'The pinnacle fusion of divine blacksmithing and soul technology! Gather Heavy Silver, Refined Gold, Mithril, and Heavenly Forged Metal to forge, refine, and advance your Battle Armor from 1-Word to 5-Word True Spirit Battle Armor, while researching Rank-9/10 God-Slaying Soul Cannons.'
    },
    coreFunctions: {
      zh: [
        '6件基础斗铠（胸铠、头盔、臂铠、腿甲、羽翼等）锻造装配',
        '斗铠位阶进阶：一字斗铠 → 二字斗铠 → 三字天锻 → 四字神级 → 五字真灵',
        '研发九级定装爆裂魂导炮与十级弑神毁灭魂导武器',
        '战斗中自由开启斗铠全覆模式与魂导武器超能轰炸',
        '神金消耗与属性大幅百分比增幅'
      ],
      en: [
        'Forge & equip 6 core Battle Armor pieces (Cuirass, Helm, Gauntlets, Greaves, Wings, Pauldrons)',
        'Armor Tier Evolution: 1-Word → 2-Word → 3-Word Heavenly Forged → 4-Word God-tier → 5-Word True Spirit',
        'Develop Rank-9 Burst Soul Cannons and Rank-10 God-Slaying Annihilation Weapons',
        'Toggle full Battle Armor mode and fire super soul cannons during live battles',
        'Massive percentage-based stat multipliers across all attributes'
      ]
    },
    keyRewards: {
      zh: ['全属性暴涨50%~300%', '战斗中专属斗铠护盾与减伤', '十级魂导炮毁灭级主动技'],
      en: ['Global Stats Boosted by +50% to +300%', 'Exclusive Battle Armor Shield & Damage Reduction in Combat', 'Rank-10 Soul Cannon Annihilation Active Skill']
    },
    proTips: {
      zh: '斗铠所需的神材可在【神材宝地】或【星际行星贸易】中批量获取，优先将胸铠与羽翼进阶！',
      en: 'Divine metals needed for armor advancement can be gathered in the [Divine Ore Sanctuary] or bought via [Interplanetary Trade]. Prioritize upgrading the Cuirass and Wings first!'
    }
  },
  {
    id: 'gathering',
    title: {
      zh: '神材宝地',
      en: 'Divine Ore Sanctuary'
    },
    subtitle: {
      zh: '稀有金属 · 天锻神金 · 矿脉开采 · 挂机产出 · 快捷跳转',
      en: 'Rare Metals · Heavenly Forged Metal · Vein Mining · Idle Production · Fast Shortcuts'
    },
    category: 'sect_tech',
    badge: {
      zh: '资源枢纽',
      en: 'Resource Hub'
    },
    douluoSeries: {
      zh: '全系列通用',
      en: 'All Douluo Series'
    },
    summary: {
      zh: '斗罗大陆稀世金属宝藏圣地。沉银矿洞、精金地脉、秘银裂谷、神金天池四大矿脉每日自动产出锻造神料，支持手动高速开采与矿脉勘探升级，并提供一键跳转至斗铠、唐门、机甲等消耗系统的快捷通道。',
      en: 'The sanctuary of legendary metals on Douluo Continent. Four mineral veins (Heavy Silver Cave, Refined Gold Vein, Mithril Rift, Divine Metal Spring) continuously yield forging materials, with idle auto-accumulation and direct shortcuts to Battle Armor, Tang Sect, and Mecha systems.'
    },
    coreFunctions: {
      zh: [
        '沉银、百炼精金、灵锻秘银、天锻神金、龙纹黑金持续产出',
        '挂机自动累积神金资源，离线也可持续收获',
        '矿脉等级升级，大幅提升每小时产出效率与暴击率',
        '一键直达【斗铠魂导】【唐门绝技】【传灵塔】【星际战舰】'
      ],
      en: [
        'Continuous yield of Heavy Silver, Refined Gold, Spirit Mithril, Heavenly Forged Metal, Dragon Black Gold',
        'Idle automated resource accumulation that continues working while offline',
        'Upgrade mine levels to significantly boost hourly production rates and critical harvest chances',
        '1-click direct shortcuts to [Battle Armor], [Tang Sect Arts], [Spirit Pagoda], and [Starships]'
      ]
    },
    keyRewards: {
      zh: ['锻造高阶斗铠与机甲不可或缺的核心神料', '大量金魂币与锻造经验'],
      en: ['Core Divine Metals essential for High-Tier Battle Armor and Mechas', 'Abundant Gold Coins and Blacksmith EXP']
    },
    proTips: {
      zh: '优先升级矿脉开采等级，矿脉产出的天锻神金是打造四字/五字斗铠与神级歼星舰的核心物资！',
      en: 'Upgrade your mining levels as soon as possible. The Heavenly Forged Metal produced is the indispensable material for 4-Word/5-Word Battle Armor and Star-Destroyer Warships!'
    }
  },
  {
    id: 'companions',
    title: {
      zh: '斗罗4伙伴',
      en: 'Legendary Companions'
    },
    subtitle: {
      zh: '传奇结识 · 羁绊共鸣 · 升阶突破 · 超级武魂融合技',
      en: 'Legendary Bonds · Resonance Synergies · Star Breakthrough · Super Fusion Skills'
    },
    category: 'core',
    badge: {
      zh: '战队羁绊',
      en: 'Team Bonds'
    },
    douluoSeries: {
      zh: '终极斗罗 & 龙王传说',
      en: 'Ultimate Douluo & Dragon King'
    },
    summary: {
      zh: '跨越万年时空并肩作战！结识蓝轩宇、白秀秀、唐舞麟、古月娜、唐三、小舞等传奇伙伴。伙伴提供被动光环增益，升级升星解锁强力羁绊，并可在战斗中引爆「龙神降临」「深渊冰龙」等毁天灭地的武魂融合技！',
      en: 'Fight side by side across ten thousand years of history! Recruit legendary heroes like Lan Xuanyu, Bai Xiuxiu, Tang Wulin, Gu Yuena, Tang San, and Xiao Wu. Companions grant passive team auras, star rank synergies, and unleash world-shattering Martial Soul Fusion Skills in battle.'
    },
    coreFunctions: {
      zh: [
        '结识唐三、小舞、唐舞麟、古月娜、蓝轩宇、白秀秀等核心伙伴',
        '提升伙伴等级与星级，解锁专属战斗技能与属性光环',
        '激活伙伴羁绊共鸣（如神龙眷侣、万古龙王、初代七怪等）',
        '在所有战斗中一键释放毁天灭地的「武魂融合技」'
      ],
      en: [
        'Recruit core companions: Tang San, Xiao Wu, Tang Wulin, Gu Yuena, Lan Xuanyu, Bai Xiuxiu',
        'Level up and star up companions to unlock personal battle skills and stat auras',
        'Activate synergy bonds (Dragon God Couple, Immortal Dragon King, Generation 1 Shrek Seven, etc.)',
        'Trigger devastating Martial Soul Fusion Skills in any live combat encounter'
      ]
    },
    keyRewards: {
      zh: ['全队高额暴击/攻击/减伤被动加成', '逆转战局的武魂融合技'],
      en: ['Massive Team Crit/Attack/Damage Reduction Passives', 'Game-Changing Martial Soul Fusion Skills']
    },
    proTips: {
      zh: '凑齐特定伙伴组合（如蓝轩宇+白秀秀，或唐舞麟+古月娜）可解锁最强融合技，战斗中能瞬间造成数百万伤害！',
      en: 'Assembling specific companion pairs (e.g. Lan Xuanyu + Bai Xiuxiu, or Tang Wulin + Gu Yuena) unlocks top-tier Fusion Skills that deal millions of burst damage in combat!'
    }
  },
  {
    id: 'tournament',
    title: {
      zh: '斗魂大赛',
      en: 'Soul Master Tournament'
    },
    subtitle: {
      zh: '全大陆高级魂师精英大赛 · 车轮对决 · 冠军勋章 · 神赐封号',
      en: 'Continental Advanced Elite Academy Tournament · Gauntlet Matches · Champion Medals'
    },
    category: 'battle',
    badge: {
      zh: '巅峰PVE/PVP',
      en: 'Peak Tournament'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅰ',
      en: 'Douluo Dalu I'
    },
    summary: {
      zh: '全大陆最高规格的魂师荣耀战场！挑战天水学院、炽火学院、神风学院、象甲宗、雷霆学院、皇斗战队、武魂殿黄金一代以及史莱克七怪，车轮战登顶大陆之巅，赢取冠军勋章、极品魂骨与神级声望。',
      en: 'The grandest championship battlefield across the entire continent! Challenge Tianshui, Blazing, Kamikaze, Elephant Armored, Thunder, Imperial Royal, Spirit Hall Golden Generation, and Shrek Seven to win Champion Medals, rare Soul Bones, and continental prestige.'
    },
    coreFunctions: {
      zh: [
        '挑战大陆10大学院精英主力战队',
        '层层递进的车轮淘汰赛制与专属战队技能博弈',
        '赚取冠军勋章与神赐丰厚金魂币',
        '解锁大陆第一魂师战队荣誉称号'
      ],
      en: [
        'Challenge elite squads from 10 top Continental Academy Teams',
        'Progressive gauntlet elimination stages with unique team tactics and skill counters',
        'Earn Champion Medals and massive Gold Coin prize bounties',
        'Unlock Continental #1 Soul Master Squad Supreme Title'
      ]
    },
    keyRewards: {
      zh: ['斗魂大赛冠军勋章', '高年份极品魂骨', '海量声望与修炼经验'],
      en: ['Tournament Champion Medals', 'High-Age Premium Soul Bones', 'Massive Prestige and Cultivation EXP']
    },
    proTips: {
      zh: '对手拥有强力控制与群体爆发，合理利用玄天宝录的解控暗器与伙伴武魂融合技可轻松通关！',
      en: 'Opponent academy teams possess strong crowd control and AoE burst. Using Tang Sect dispelling hidden weapons and Companion Fusion Skills makes clearing stages much easier!'
    }
  },
  {
    id: 'soulbones',
    title: {
      zh: '魂骨秘境',
      en: 'Soul Bone Realm & Black Market'
    },
    subtitle: {
      zh: '六大部位 · 万古神骨黑市 · 八蛛矛进化 · 年份突破',
      en: '6 Core Slots · Ancient Black Market · Eight Spider Lances · Age Breakthrough'
    },
    category: 'core',
    badge: {
      zh: '至尊骨骼',
      en: 'Supreme Bones'
    },
    douluoSeries: {
      zh: '全系列核心',
      en: 'All Douluo Series'
    },
    summary: {
      zh: '魂师至宝！配置头部、躯干、左臂、右臂、左腿、右腿六大基础魂骨及外附魂骨八蛛矛。在万古黑市中鉴宝淘宝，消耗魂骨精华突破魂骨年限（万年至百万年神骨），吞噬进化八蛛矛为吞噬神铠。',
      en: 'Treasures of Soul Masters! Equip 6 core body slots (Head, Torso, Left Arm, Right Arm, Left Leg, Right Leg) plus the External Eight Spider Lances. Appraise divine bones in the Black Market and spend Soul Bone Essence to elevate bone cultivation age up to 1,000,000 years.'
    },
    coreFunctions: {
      zh: [
        '装配与替换6大身体部位魂骨及外附魂骨',
        '万古黑市神秘鉴宝，淘得天梦头骨、泰坦躯干骨等极品神骨',
        '消耗魂骨精华强化魂骨年限，解锁额外词条与神级被动',
        '八蛛矛吞噬进化，提升吸血与撕裂穿透效果'
      ],
      en: [
        'Equip and replace 6 core body soul bones plus external bone slots',
        'Ancient Black Market appraisal: acquire Skydream Skull, Titan Torso, etc.',
        'Spend Soul Bone Essence to breakthrough bone age and unlock divine passive affixes',
        'Evolve Eight Spider Lances through battle devour for lifesteal and true armor penetration'
      ]
    },
    keyRewards: {
      zh: ['巨额永久基础属性加成', '独门魂骨主动附带技能', '生命吸取与真实伤害穿透'],
      en: ['Permanent Massive Base Attribute Multipliers', 'Unique Soul Bone Attached Active Skills', 'Lifesteal & True Armor Penetration']
    },
    proTips: {
      zh: '外附魂骨八蛛矛拥有随着战斗吞噬进化的特性，越早满破越能在持久战中凭借吸血立于不败之地！',
      en: 'The External Soul Bone Eight Spider Lances evolves by devouring foes. Maxing its evolution early provides invincible sustain and lifesteal in protracted boss battles!'
    }
  },
  {
    id: 'forest',
    title: {
      zh: '星斗猎魂',
      en: 'Great Star Dou Forest Hunting'
    },
    subtitle: {
      zh: '五大禁区 · 百万年神兽 · 吸收极品魂环 · 凶兽禁地',
      en: '5 Forbidden Zones · Million-Year Beasts · Soul Ring Absorption · Beast Sanctuary'
    },
    category: 'battle',
    badge: {
      zh: '魂环源泉',
      en: 'Soul Ring Origin'
    },
    douluoSeries: {
      zh: '全系列核心',
      en: 'All Douluo Series'
    },
    summary: {
      zh: '魂师晋升获取魂环的必经之地。探索星斗大森林外围/核心圈、落日森林、极北冰原、深海魔鲸海域、万妖王凶兽禁地，击杀泰坦巨猿、天青牛蟒、雪女、深海魔鲸王等，吸收从十年白环至百万年神级金环！',
      en: 'The essential sanctuary for acquiring Soul Rings and breaking through cultivation bottlenecks. Explore the Outer/Core Star Dou Forest, Sunset Forest, Far North Tundra, Deep Sea Whale Trench, and Ferocious Beast Domain to hunt Titan Giant Ape, Sky Azure Bull Python, and Deep Sea Demon Whale King.'
    },
    coreFunctions: {
      zh: [
        '五大生态禁区探索，遭遇不同属性与年限魂兽',
        '即时回合微操战斗，破除魂兽防御与狂暴状态',
        '击败魂兽掉落对应年份魂环、魂骨与天材地宝',
        '吸收魂环解锁对应武魂的一至十魂技'
      ],
      en: [
        'Explore 5 distinct wildlife biomes with diverse beast elements and age tiers',
        'Tactical real-time combat to shatter beast shields and berserk states',
        'Defeated beasts drop corresponding age Soul Rings, Soul Bones, and celestial herbs',
        'Absorb rings to unlock your Martial Soul’s 1st to 10th ultimate Soul Skills'
      ]
    },
    keyRewards: {
      zh: ['极品魂环（百年黄环、千年紫环、万年黑环、十万年红环、百万年金环）', '高阶魂兽爆落魂骨'],
      en: ['Premium Soul Rings (100y Yellow, 1k-y Purple, 10k-y Black, 100k-y Red, 1M-y Gold)', 'High-tier Soul Bones drops']
    },
    proTips: {
      zh: '每达到10级整倍数（如10、20、30...90级）必须前往猎魂吸收魂环才能突破瓶颈！',
      en: 'Whenever you hit level multiples of 10 (10, 20, 30... 90), you must hunt a beast and absorb its Soul Ring to break through the bottleneck and continue gaining EXP!'
    }
  },
  {
    id: 'arena',
    title: {
      zh: '索托斗魂',
      en: 'Suotuo Spirit Arena'
    },
    subtitle: {
      zh: '索托大斗魂场 · 铁斗魂至金斗魂 · 即时微操对决 · 积分晋级',
      en: 'Suotuo Great Arena · Iron to Gold Spirit Master · Micro Tactical Duels · Rank Promotion'
    },
    category: 'battle',
    badge: {
      zh: '单人博弈',
      en: 'Solo Duels'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅰ',
      en: 'Douluo Dalu I'
    },
    summary: {
      zh: '检验个人微操与战术的经典博弈场！从铁斗魂、铜斗魂一步步晋阶至银斗魂、金斗魂、紫金斗魂直至钻石斗魂勋章。对决各路名宿魂师，积攒斗魂积分，兑换丰厚金魂币与修行秘药。',
      en: 'The classic proving ground for individual micro-tactics and reaction speed! Climb from Iron Spirit Master to Bronze, Silver, Gold, Purple Gold, and Diamond tiers. Duel renowned soul masters across the land and redeem rare elixirs and gold coins.'
    },
    coreFunctions: {
      zh: [
        '单人 1v1 即时微操博弈战斗',
        '铁斗魂至钻石斗魂六大段位晋级体系',
        '斗魂积分榜与连胜机制奖励',
        '演练技能释放顺序与暗器连招的最佳场地'
      ],
      en: [
        'Solo 1v1 tactical real-time combat',
        '6-tier rank progression system from Iron to Diamond Spirit Master',
        'Arena Point leaderboards and win-streak bonus bounties',
        'The ideal testing arena to master skill priority sequences and hidden weapon combos'
      ]
    },
    keyRewards: {
      zh: ['高阶斗魂勋章', '海量金魂币与斗魂积分', '战力实战检验'],
      en: ['High-Tier Spirit Master Medals', 'Abundant Gold Coins & Arena Points', 'Live Combat Testing Data']
    },
    proTips: {
      zh: '合理掌握【玄天绝技】定身与【顶级暗器】爆发的释放节奏，可以越级击败更高战力的对手！',
      en: 'Mastering the timing between Tang Sect stun techniques and Hidden Weapon burst allows you to defeat opponents with significantly higher power ratings!'
    }
  },
  {
    id: 'tangsect',
    title: {
      zh: '唐门绝技',
      en: 'Tang Sect Secret Arts & Weapons'
    },
    subtitle: {
      zh: '开宗立派 · 万宗降伏岁贡 · 四大堂口 · 玄天宝录 · 顶级暗器',
      en: 'Found Your Sect · Vassal Tributes · 4 Great Halls · Mysterious Heaven Record · Hidden Weapons'
    },
    category: 'sect_tech',
    badge: {
      zh: '宗门传承',
      en: 'Sect Heritage'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅰ & Ⅱ',
      en: 'Douluo Dalu I & II'
    },
    summary: {
      zh: '重铸唐门无上荣光！建立唐门宗门，降伏下属宗门收取每日丰厚岁贡；升级力堂（锻造）、御堂（防御）、敏堂（情报）、药堂（炼药）；修炼玄天功、紫极魔瞳、鬼影迷踪等六大心法；锻造诸葛神弩、暴雨梨花针、佛怒唐莲等顶级暗器。',
      en: 'Restore the supreme glory of the Tang Sect! Found the sect, conquer vassal clans for daily tribute, upgrade the 4 Great Halls (Strength, Defense, Agility, Medicine), cultivate the 6 arts of Mysterious Heaven Record, and forge devastating hidden weapons like Buddha’s Fury Tang Lotus.'
    },
    coreFunctions: {
      zh: [
        '建立唐门，提升宗门声望，降伏万宗每日坐收海量金魂币与神金岁贡',
        '建设四大堂口（力堂、御堂、敏堂、药堂），解锁全方位宗门特权',
        '修炼《玄天宝录》六绝技：玄天功、玄玉手、紫极魔瞳、鬼影迷踪、控鹤擒龙、暗器百解',
        '锻造诸葛神弩、子母追魂夺命胆、暴雨梨花针、佛怒唐莲等机括类暗器并在战斗中投掷'
      ],
      en: [
        'Found the Tang Sect, increase sect renown, and collect daily tributes of gold and divine metals',
        'Build 4 Great Halls (Strength, Defense, Agility, Medicine) to unlock all-around sect perks',
        'Cultivate Mysterious Heaven Record 6 arts: Mysterious Heaven Skill, Jade Hands, Purple Demon Eyes, Ghost Shadow Steps, Crane Dragon Claw, Hundred Weapon Lore',
        'Forge mechanical hidden weapons: Zhuge God Crossbow, Soul Chasing Balls, Pear Blossom Needles, Buddha’s Fury Tang Lotus to throw in combat'
      ]
    },
    keyRewards: {
      zh: ['每日稳定巨额金魂币岁贡', '全技能伤害与暴击倍率提升', '战斗中无限投掷的毁天灭地暗器'],
      en: ['Massive daily Gold Coin & Divine Metal tribute', 'Global Skill Damage & Crit Multiplier Boosts', 'Devastating mechanical hidden weapons usable in all battles']
    },
    proTips: {
      zh: '优先将玄天宝录修炼至高重，紫极魔瞳能提供超强破防与精神威压，佛怒唐莲可造成群体秒杀伤害！',
      en: 'Prioritize leveling the Mysterious Heaven Record. Purple Demon Eyes provides immense defense pierce and mental pressure, while Buddha’s Fury Tang Lotus deals catastrophic AoE execute damage!'
    }
  },
  {
    id: 'icefire',
    title: {
      zh: '冰火仙草',
      en: 'Ice & Fire Yin-Yang Well'
    },
    subtitle: {
      zh: '冰火两仪眼 · 独孤博药园 · 极品仙草炼化 · 脱胎换骨',
      en: 'Yin-Yang Well · Dugu Bo Herb Garden · Immortal Herb Refinement · Body Transformation'
    },
    category: 'core',
    badge: {
      zh: '洗髓神地',
      en: 'Sacred Rebirth'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅰ',
      en: 'Douluo Dalu I'
    },
    summary: {
      zh: '得天独厚的造化神泉！进入冰火两仪眼深处，采摘并炼化八角玄冰草、烈火杏娇疏、奇茸通天菊、绮罗郁金香、相思断肠红等传世仙品。彻底洗髓伐骨，消除魂力瓶颈，获得冰火不侵与属性飙升。',
      en: 'The blessed spring of heaven and earth! Plunge into the depths of the Ice & Fire Yin-Yang Well to harvest and refine peerless immortal herbs: Octagonal Mysterious Ice Grass, Infernal Scorching Apricot, Velvet Sky Chrysanthemum, and Yearning Heartbroken Red for total body rebirth and permanent stat surges.'
    },
    coreFunctions: {
      zh: [
        '探索极热与极寒交汇的冰火两仪眼药园',
        '采集十大极品仙草与天地灵物',
        '炼化仙品药草获得永久全属性大幅飞跃与等级直升',
        '获得「冰火金身」与毒素完全免疫特权'
      ],
      en: [
        'Explore the convergent botanical spring of extreme heat and extreme frost',
        'Harvest the 10 supreme immortal herbs and celestial flora',
        'Refine immortal herbs for permanent multi-attribute leaps and instant level boosts',
        'Gain the Ice & Fire Golden Body with absolute immunity to all continental poisons'
      ]
    },
    keyRewards: {
      zh: ['永久暴增攻击、防御、生命上限与暴击率', '直接提升魂力等级', '百毒不侵被动'],
      en: ['Permanent Surges in Attack, Defense, Max HP, and Crit Rate', 'Instant Soul Power Level Up', 'Immunity to 100 Poisons Passive']
    },
    proTips: {
      zh: '仙草炼化没有任何负面副作用，达到对应等级后尽早炼化相思断肠红与烈火杏娇疏，战力瞬间起飞！',
      en: 'Immortal herb refinement has zero negative side-effects. Refine Yearning Heartbroken Red and Infernal Apricot as soon as you reach the level requirement to instantly skyrocket your combat rating!'
    }
  },
  {
    id: 'slaughter',
    title: {
      zh: '杀戮之都',
      en: 'City of Slaughter'
    },
    subtitle: {
      zh: '地狱杀戮场 · 封禁魂技 · 地狱路试炼 · 觉醒杀神领域',
      en: 'Hell Arena · Sealed Soul Skills · Road to Hell Trial · Deathgod Domain Awakening'
    },
    category: 'battle',
    badge: {
      zh: '至高领域',
      en: 'Supreme Domain'
    },
    douluoSeries: {
      zh: '斗罗大陆Ⅰ',
      en: 'Douluo Dalu I'
    },
    summary: {
      zh: '罪恶与杀戮的试炼之地。在无法动用武魂魂技的极端限制下，依靠纯粹肉体力量、玄天绝技与机括暗器完成地狱杀戮场百战百胜；勇闯地狱路斩杀暗金三头蝙蝠王与十首烈阳蛇，觉醒杀伐至尊「杀神领域」！',
      en: 'The crucible of sin and bloodshed. Under strict seals preventing all Martial Soul Skills, rely solely on raw physical might, Tang Sect martial arts, and mechanical hidden weapons to achieve 100 consecutive arena victories, brave the Road to Hell, and awaken the Supreme Deathgod Domain!'
    },
    coreFunctions: {
      zh: [
        '无魂技限制下的纯体魄与暗器极限战斗',
        '地狱杀戮场百场连胜挑战',
        '闯荡地狱路，决战两大远古凶兽Boss',
        '通关后永久觉醒「杀神领域」并在全战斗中开启'
      ],
      en: [
        'Extreme combat relying purely on physical attributes and hidden weapons with soul skills sealed',
        '100-win streak challenge in the Hell Arena',
        'Traverse the fiery Road to Hell and defeat the Dark Gold Three-Headed Bat King & Ten-Headed Sun Serpent',
        'Permanently awaken the Deathgod Domain to deploy in all future battles'
      ]
    },
    keyRewards: {
      zh: ['获得【杀神领域】（战斗中敌方全属性削弱30%，自身攻击暴增50%）', '杀气护体称号'],
      en: ['Deathgod Domain (reduces all enemy attributes by 30% and boosts self Attack by +50% in battle)', 'Killing Intent Aura Title']
    },
    proTips: {
      zh: '在此处唐门暗器与玄天功是制胜关键，备足诸葛神弩和暴雨梨花针可轻松碾压地狱路凶兽！',
      en: 'Tang Sect hidden weapons and Mysterious Heaven Skill are the ultimate keys here. Stock up on Zhuge Crossbows and Pear Blossom Needles to crush the Road to Hell beasts effortlessly!'
    }
  },
  {
    id: 'seagod',
    title: {
      zh: '四大神考',
      en: 'Four Divine Trials & Godhood'
    },
    subtitle: {
      zh: '海神九考 · 修罗神考 · 天使神考 · 罗刹神考 · 百级成神',
      en: 'Sea God Nine Trials · Asura God Trials · Angel Trials · Rakshasa Trials · Level 100 Godhood'
    },
    category: 'godhood',
    badge: {
      zh: '百级飞升',
      en: 'God Ascension'
    },
    douluoSeries: {
      zh: '全系列巅峰',
      en: 'Peak of All Series'
    },
    summary: {
      zh: '打破凡人之躯，成就至高神祗！选择继承海神、修罗神、天使神或罗刹神神位。经历九大重磅神之考核（穿越海神之光、拔出海神三叉戟、猎杀深海魔鲸王等），斩获神级神器与神装，突破百级神王！',
      en: 'Transcend mortal flesh and ascend to supreme godhood! Choose to inherit the Sea God, Asura God, Angel God, or Rakshasa God divinity. Undertake nine momentous divine trials (Ascend Sea God Light, Pull the Trident, Slay the Demon Whale), claim divine armaments, and reach Level 100 God King!'
    },
    coreFunctions: {
      zh: [
        '四大至高神位（海神、修罗神、天使神、罗刹神）自由开启神考',
        '九重神考层层递进挑战（登海神之光、拔出神器、潮汐炼体、战胜七圣柱）',
        '解锁神级神器（海神三叉戟、修罗神剑等）',
        '百级大圆满登临神界，获得专属神祗金环与至尊神位'
      ],
      en: [
        'Freely initiate divine trials for 4 supreme divinities: Sea God, Asura God, Angel God, Rakshasa God',
        '9-Stage progressive trials (Ascend Sea God Light, Unseat Divine Artifact, Tidal Body Refinement, Defeat 7 Sacred Pillars)',
        'Unlock God-tier Divine Artifacts (Sea God Trident, Asura Sword, etc.)',
        'Reach Level 100 Great Perfection, ascend to the Divine Realm, and receive divine golden rings and throne'
      ]
    },
    keyRewards: {
      zh: ['百级神祗神位加冕', '神技「一去不返」「修罗审判」', '神界至尊属性'],
      en: ['Level 100 Godhead Coronation', 'Divine Skills "No Return", "Asura Judgement"', 'Supreme Divine Realm Stat Scaling']
    },
    proTips: {
      zh: '神考考核对战力要求极高，建议在装备四字斗铠、集齐六大魂骨并将魂力提升至90级以上后再冲刺九考！',
      en: 'Divine trials require immense combat power. It is highly recommended to equip 4-Word Battle Armor, collect all 6 Soul Bones, and reach Level 90+ before challenging the 9th trial!'
    }
  },
  {
    id: 'academy',
    title: {
      zh: '修练圣地',
      en: 'Sacred Cultivation Grounds'
    },
    subtitle: {
      zh: '大师指点 · 史莱克学院 · 海神阁深度冥想 · 自动挂机策略',
      en: 'Grandmaster Guidance · Shrek Academy · Sea God Pavilion Golden Tree · Auto-Idle Tactics'
    },
    category: 'core',
    badge: {
      zh: '挂机修行',
      en: 'Idle Cultivation'
    },
    douluoSeries: {
      zh: '全系列核心',
      en: 'All Douluo Series'
    },
    summary: {
      zh: '魂师日常冥想与战术参悟中心。大师玉小刚亲自指点武魂修行之道；在史莱克学院与海神阁进行深度冥想高速获取魂力经验；配置全自动战斗挂机策略（技能优先级、暗器自动投掷、血线自动恢复）。',
      en: 'The center for daily meditation and tactical enlightenment. Grandmaster Yu Xiaogang guides your core martial soul theory. Meditate under the Golden Tree at Shrek Academy & Sea God Pavilion for rapid offline EXP, and customize smart auto-battle strategies.'
    },
    coreFunctions: {
      zh: [
        '聆听大师玉小刚十大核心武魂竞争力指点',
        '史莱克学院与海神阁黄金古树冥想，离线也能暴涨海量魂力与金币',
        '配置智能自动战斗策略（自定义技能释放序列与保命阈值）',
        '查看个人修行历练大事件记录'
      ],
      en: [
        'Receive insights on Grandmaster Yu Xiaogang’s 10 Core Martial Soul Competencies',
        'Meditate beneath the Shrek Academy & Sea God Pavilion Golden Tree to gain massive EXP and Gold offline',
        'Configure smart auto-battle tactics (custom skill priorities and emergency healing thresholds)',
        'Review comprehensive chronicles of your soul cultivation milestones'
      ]
    },
    keyRewards: {
      zh: ['源源不断的挂机魂力与经验', '大师专属修行心得秘籍', '智能省心的全自动战斗挂机'],
      en: ['Endless streams of idle Soul Power & EXP', 'Grandmaster Exclusive Cultivation Grimoires', 'Effortless smart auto-battle setup']
    },
    proTips: {
      zh: '记得在挂机策略中将【控鹤擒龙】或【控制系第一魂技】设为首发，可大幅提升自动挂机的胜率与效率！',
      en: 'Remember to set [Crane Dragon Claw] or your 1st Control-type Soul Skill as your opening move in the auto-battle sequence to dramatically boost clear efficiency!'
    }
  }
];

export const PROGRESSION_STAGES_I18N: LocalizedProgressionStage[] = [
  {
    stage: {
      zh: '第一阶段：魂师觉醒与初入江湖',
      en: 'Stage 1: Soul Awakening & First Steps'
    },
    levelRange: {
      zh: 'Lv.1 ~ Lv.30 (魂士 → 魂尊)',
      en: 'Lv.1 ~ Lv.30 (Spirit Scholar → Spirit Elder)'
    },
    icon: '🌱',
    tasks: {
      zh: [
        '觉醒先天满魂力神级武魂（昊天锤/六翼天使/蓝银皇等）',
        '前往【星斗猎魂】击杀百年/千年魂兽，吸收前3个魂环',
        '在【索托斗魂】与【修练圣地】中磨练战斗技巧并挂机积累魂力',
        '在【魂师面板】合理分配初始自由属性点'
      ],
      en: [
        'Awaken Innate Full Soul Power God-tier Martial Soul (Clear Sky Hammer / Seraphim / Blue Silver Emperor)',
        'Hunt in [Star Dou Forest] for 100y/1,000y beasts and absorb your first 3 Soul Rings',
        'Hone battle tactics in [Suotuo Arena] and idle cultivate in [Sacred Cultivation Grounds]',
        'Allocate initial free stat points in the [Soul Master Profile]'
      ]
    },
    targetTitle: {
      zh: '三环魂尊 · 崭露头角',
      en: '3-Ring Spirit Elder · Rising Star'
    }
  },
  {
    stage: {
      zh: '第二阶段：仙草洗髓与大赛扬名',
      en: 'Stage 2: Immortal Herbs & Tournament Fame'
    },
    levelRange: {
      zh: 'Lv.30 ~ Lv.60 (魂尊 → 魂帝)',
      en: 'Lv.30 ~ Lv.60 (Spirit Elder → Spirit Emperor)'
    },
    icon: '🌸',
    tasks: {
      zh: [
        '前往【冰火仙草】炼化八角玄冰草与烈火杏娇疏，脱胎换骨',
        '征战【斗魂大赛】，击败天水、神风、象甲宗赢取冠军勋章',
        '在【魂骨秘境】黑市中搜集头部与躯干魂骨并强化年限',
        '前往【传灵塔】与第一尊万年魂灵签订契约，开启魂灵并肩作战'
      ],
      en: [
        'Visit [Ice & Fire Well] to refine Octagonal Ice Grass and Infernal Apricot for rebirth',
        'Compete in [Tournament] to defeat Tianshui, Kamikaze, and Elephant squads for Champion Medals',
        'Collect Head and Torso Soul Bones in the [Soul Bone Realm] and enhance their age',
        'Contract your first 10,000-year Spirit Soul in [Spirit Pagoda] for joint combat'
      ]
    },
    targetTitle: {
      zh: '六环魂帝 · 大陆天骄',
      en: '6-Ring Spirit Emperor · Continental Prodigy'
    }
  },
  {
    stage: {
      zh: '第三阶段：开宗立派与斗铠研造',
      en: 'Stage 3: Sect Founding & Battle Armor'
    },
    levelRange: {
      zh: 'Lv.60 ~ Lv.80 (魂圣 → 魂斗罗)',
      en: 'Lv.60 ~ Lv.80 (Spirit Saint → Spirit Douluo)'
    },
    icon: '🏛️',
    tasks: {
      zh: [
        '在【唐门绝技】中开宗立派，降伏下属各宗每日收取海量岁贡',
        '修炼《玄天宝录》六大绝技，锻造顶级机括暗器【佛怒唐莲】',
        '在【神材宝地】开采沉银与秘银，在【斗铠魂导】中打造一字/二字斗铠',
        '进入【杀戮之都】闯荡地狱路，成功觉醒至尊【杀神领域】'
      ],
      en: [
        'Found the sect in [Tang Sect Arts], conquer vassal clans, and collect daily tributes',
        'Cultivate Mysterious Heaven Record 6 arts and forge [Buddha’s Fury Tang Lotus]',
        'Mine Heavy Silver in [Divine Ore Sanctuary] and forge 1-Word/2-Word [Battle Armor]',
        'Brave the Road to Hell in [City of Slaughter] and awaken the supreme [Deathgod Domain]'
      ]
    },
    targetTitle: {
      zh: '八环魂斗罗 · 宗门霸主',
      en: '8-Ring Spirit Douluo · Sect Hegemon'
    }
  },
  {
    stage: {
      zh: '第四阶段：战舰巡航与伙伴共鸣',
      en: 'Stage 4: Starship Cruising & Companions'
    },
    levelRange: {
      zh: 'Lv.80 ~ Lv.90 (魂斗罗 → 封号斗罗)',
      en: 'Lv.80 ~ Lv.90 (Spirit Douluo → Titled Douluo)'
    },
    icon: '🚀',
    tasks: {
      zh: [
        '在【星际机甲战舰】中研造恒星级巡洋战舰，开启行星跃迁跨星贸易',
        '在【斗罗4伙伴】中结识蓝轩宇、唐舞麟、古月娜，激活终极武魂融合技',
        '天锻进阶三字/四字神级斗铠，并在【传灵塔】研制造神级红级神机',
        '在【星斗猎魂】凶兽禁地击杀十万年/百万年魂兽，吸收九大魂环满配'
      ],
      en: [
        'Engineer Stellar Star-Destroyer Cruisers in [Starships] and engage in intergalactic trade',
        'Recruit Lan Xuanyu, Tang Wulin, and Gu Yuena in [Companions] for ultimate Fusion Skills',
        'Heavenly Forge 3-Word/4-Word God-tier Battle Armor and build Red God Mechas in [Spirit Pagoda]',
        'Hunt 100k/1M-year beasts in [Star Dou Forest] to complete all 9 Soul Ring slots'
      ]
    },
    targetTitle: {
      zh: '九环封号斗罗 · 威震寰宇',
      en: '9-Ring Titled Douluo · Universe Dominator'
    }
  },
  {
    stage: {
      zh: '第五阶段：四大神考与百级成神',
      en: 'Stage 5: Divine Trials & Level 100 Godhood'
    },
    levelRange: {
      zh: 'Lv.90 ~ Lv.100 (封号斗罗 → 至高神王)',
      en: 'Lv.90 ~ Lv.100 (Titled Douluo → Supreme God King)'
    },
    icon: '👑',
    tasks: {
      zh: [
        '开启【四大神考】（海神九考/修罗神考），拔出至高神器',
        '在【星际战舰】中率领天基防御舰队彻底击溃深红外星母舰',
        '在【传灵塔】契约百万年天梦冰蚕与雪帝，升灵台登峰造极',
        '突破百级大圆满，神祗金环加身，登临神界至尊王座！'
      ],
      en: [
        'Initiate [Four Divine Trials] (Sea God Nine Trials / Asura Trials) and claim supreme artifacts',
        'Lead the planetary defense fleet in [Starships] to obliterate the Crimson Alien Mothership',
        'Contract 1,000,000-year Skydream Iceworm and Snow Empress in [Spirit Pagoda]',
        'Break through to Level 100 Great Perfection, receive Divine Golden Rings, and ascend the Divine Realm Throne!'
      ]
    },
    targetTitle: {
      zh: '百级至高神王 · 永恒不朽',
      en: 'Level 100 Supreme God King · Everlasting Immortal'
    }
  }
];

export const COMBAT_GUIDES_I18N: LocalizedCombatGuideItem[] = [
  {
    id: 'soul_skills',
    num: '1',
    title: {
      zh: '武魂魂技连携 (Soul Skills)',
      en: 'Soul Skill Combos & Synergies'
    },
    desc: {
      zh: '消耗魂力（MP）释放一至九魂技。控制系技能（如蓝银缠绕）可打断敌方蓄力；爆发系技能（如昊天九绝、天使降临）可造成暴击巨额伤害；第九魂技更是扭转乾坤的灭世必杀！',
      en: 'Spend Soul Power (MP) to cast 1st to 9th Soul Skills. Control skills (e.g. Blue Silver Bind) interrupt enemy skill channeling; burst skills (e.g. Clear Sky Nine Secrets, Angel Descent) inflict colossal critical strikes; the 9th skill is a match-turning apocalypse strike!'
    },
    themeColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    iconName: 'Zap'
  },
  {
    id: 'spirit_souls',
    num: '2',
    title: {
      zh: '传灵塔·出战魂灵神技 (Spirit Soul)',
      en: 'Spirit Pagoda: Deployed Spirit Souls'
    },
    desc: {
      zh: '在【传灵塔】配置出战的2尊魂灵会在战斗面板中生成快捷按键。天梦冰蚕施展【精神干扰领域】削弱敌方命中与防御，雪帝释放【帝剑·大寒无极】爆发真伤并冰封敌方！',
      en: 'The 2 Spirit Souls assigned in [Spirit Pagoda] generate dedicated instant-cast buttons in live combat. Skydream Iceworm casts [Mental Interference Domain] to debuff enemy accuracy and defense, while Snow Empress unleashes [Empress Sword: Extreme Cold] for true damage and freeze!'
    },
    themeColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    iconName: 'Sparkles'
  },
  {
    id: 'mecha_cannons',
    num: '3',
    title: {
      zh: '驾驶机甲·歼星重炮 (Mecha Heavy Cannon)',
      en: 'Pilot Mecha: Star-Destroyer Cannon'
    },
    desc: {
      zh: '装备紫级/黑级/红级机甲后，战斗中可发射机载重炮（如湮灭聚能光束、创世神灭歼星炮）。造成巨量贯穿直伤的同时，为魂师生成高额机甲护盾吸收一切反击伤害！',
      en: 'Equipping Purple/Black/Red/God-tier Mechas enables firing on-board heavy cannons in battle (e.g. Annihilation Focus Beam, Genesis God-Slaying Star Cannon), dealing massive piercing direct damage while deploying a durable kinetic barrier to absorb counterattacks!'
    },
    themeColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    iconName: 'Cpu'
  },
  {
    id: 'hidden_weapons',
    num: '4',
    title: {
      zh: '唐门顶级暗器瞬发 (Hidden Weapons)',
      en: 'Tang Sect Supreme Hidden Weapons'
    },
    desc: {
      zh: '在【唐门绝技】锻造诸葛神弩、暴雨梨花针、佛怒唐莲后，在战斗中可不耗费魂力瞬间投掷！无视敌方护甲造成真实破甲杀伤，是斩杀残血与绝境翻盘的神技。',
      en: 'After forging Zhuge God Crossbows, Pear Blossom Needles, and Buddha’s Fury Tang Lotus in [Tang Sect Arts], you can instantly throw them without consuming Soul Power! They bypass enemy armor to deal pure armor-piercing damage, perfect for executing low-HP targets and reversing losing fights.'
    },
    themeColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    iconName: 'Hammer'
  },
  {
    id: 'fusion_skills',
    num: '5',
    title: {
      zh: '斗罗4伙伴·武魂融合技 (Fusion Skills)',
      en: 'Companion Martial Soul Fusion Skills'
    },
    desc: {
      zh: '结识特定伙伴（如蓝轩宇与白秀秀、唐舞麟与古月娜）后激活。释放【龙神降临】或【深渊冰龙】，天地变色，直接造成超过300%~600%的超位阶毁天灭地合体神威！',
      en: 'Activated after recruiting complementary companion duos (e.g. Lan Xuanyu & Bai Xiuxiu, Tang Wulin & Gu Yuena). Casting [Dragon God Descent] or [Abyssal Frost Dragon] shakes heaven and earth, dealing an overwhelming 300% to 600% damage multiplier!'
    },
    themeColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    iconName: 'Flame'
  },
  {
    id: 'domains',
    num: '6',
    title: {
      zh: '杀神领域与海神领域 (Domains)',
      en: 'Deathgod & Sea God Domains'
    },
    desc: {
      zh: '通过【杀戮之都】或【海神九考】觉醒领域后，战斗中点击【开启领域】即可展开血红杀戮结界，永久压制敌方30%攻击防御，并将自身暴击与伤害倍率推至巅峰！',
      en: 'Awakened via [City of Slaughter] or [Sea God Nine Trials]. Triggering [Activate Domain] in combat deploys an immense field that perpetually suppresses enemy attack & defense by 30% while maximizing your critical chance and damage output!'
    },
    themeColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    iconName: 'Skull'
  }
];

export const FAQ_I18N: LocalizedFAQItem[] = [
  {
    q: {
      zh: '💰 如何最快速度赚取上千万金魂币？',
      en: '💰 How can I earn tens of millions of Gold Coins the fastest?'
    },
    a: {
      zh: '1. 前往【星际机甲战舰】进行跨行星大宗贸易，在母星低价采购特产，跃迁至天马座/罪恶星球高价抛售，单趟可获利数百万金魂币！2. 建立【唐门】并降伏下属宗门，每日坐收巨额岁贡。3. 征战【斗魂大赛】夺冠获得海量金币赏赐。',
      en: '1. Trade commodities across planets in [Interstellar Starships]: buy cheap specialties on Douluo and warp to Pegasus/Sin Planet to sell high for millions of profit per run! 2. Found the [Tang Sect] and subjugate vassal clans to collect huge daily tribute. 3. Win the [Tournament] for championship gold bounties.'
    }
  },
  {
    q: {
      zh: '🔨 锻造斗铠与机甲所需的「天锻神金」怎么获取？',
      en: '🔨 How do I get "Heavenly Forged Divine Metal" for Battle Armor and Mechas?'
    },
    a: {
      zh: '在【神材宝地】升级神金天池开采矿脉，挂机即可稳定产出天锻神金；此外在【星际战舰】探索天龙星等高维矿脉也能批量勘探带回。',
      en: 'Upgrade the Divine Metal Spring in the [Divine Ore Sanctuary] to steadily produce Heavenly Forged Metal via idle mining. You can also explore high-tier planetary veins on Dragon Planet via [Interstellar Starships] to bring back bulk shipments.'
    }
  },
  {
    q: {
      zh: '🎴 双生武魂如何切换？魂环是共用的吗？',
      en: '🎴 How do I switch Twin Martial Souls? Are Soul Rings shared?'
    },
    a: {
      zh: '在【魂师面板】顶部点击武魂卡片即可无缝切换主修武魂。第一武魂与第二武魂拥有各自完全独立的十个魂环槽位与技能树，您可以将一套配置为纯强攻爆发，另一套配置为神圣控制辅助！',
      en: 'Click the Martial Soul card at the top of the [Soul Master Profile] to switch seamlessly. The 1st and 2nd Martial Souls possess completely independent 10-ring slots and skill trees, allowing one build for burst DPS and another for holy control/support!'
    }
  },
  {
    q: {
      zh: '❄️ 传灵塔出战魂灵怎样发挥最大威力？',
      en: '❄️ How do I maximize the combat power of deployed Spirit Souls?'
    },
    a: {
      zh: '在【传灵塔】页面勾选两尊契约魂灵（推荐天梦冰蚕+雪帝组合），进入战斗后，首回合先使用天梦冰蚕削弱敌方命中与防御，次回合使用雪帝大寒无极打出冰冻爆发，能最大化压制高阶Boss！',
      en: 'Select two contracted Spirit Souls in [Spirit Pagoda] (the Skydream Iceworm + Snow Empress duo is optimal). In battle, use Skydream on Turn 1 to debuff enemy accuracy & defense, then cast Snow Empress Extreme Cold on Turn 2 for freeze & burst true damage!'
    }
  },
  {
    q: {
      zh: '🔱 四大神考可以直接成神吗？',
      en: '🔱 Do the Four Divine Trials allow direct ascension to Godhood?'
    },
    a: {
      zh: '四大神考共分为九重考核。只要您的魂力达到对应境界并逐一击败神之考官或完成神圣历练，完成第九考即可直接加冕神祗，解锁至尊神技并成就百级神王！',
      en: 'The Divine Trials consist of 9 progressive trials. As long as your Soul Power meets the requirement and you pass each divine test, completing Trial 9 will directly bestow Godhood coronation, unlocking divine skills and ascending to a Level 100 God King!'
    }
  }
];

export const UI_LABELS_I18N = {
  headerBadge: {
    zh: '斗罗大陆 · 全景世界观与系统大典',
    en: 'Douluo Continent · Complete Worldview & Systems Compendium'
  },
  heroTitle: {
    zh: '《斗罗大陆：魂师觉醒与万代修神录》全书大成',
    en: 'Douluo Dalu: Soul Master Awakening & Immortal Godhood Encyclopedia'
  },
  heroDesc: {
    zh: '本游戏融合了《斗罗大陆》Ⅰ、Ⅱ、Ⅲ、Ⅳ全系列宏大世界观体系：从最初的武魂觉醒、星斗猎魂、唐门绝技，到传灵塔百万年魂灵并肩作战、一至五字斗铠天锻，再到星际战舰行星贸易与百级四大神考成神！',
    en: 'Spanning the complete worldviews of Douluo Dalu I, II, III, and IV: from initial Martial Soul Awakening, Star Dou Forest Hunting, and Tang Sect arts, to Spirit Pagoda million-year Spirit Souls, 1-to-5 Word Battle Armor, Interstellar Starships, and Level 100 Divine Trials!'
  },
  tabSystems: {
    zh: '十五大功能殿堂详解',
    en: '15 Great System Halls'
  },
  tabRoadmap: {
    zh: '修神升级路线图 (1~100级)',
    en: 'Cultivation Roadmap (Lv.1~100)'
  },
  tabCombat: {
    zh: '即时微操与融合技秘籍',
    en: 'Real-Time Combat & Fusion Guide'
  },
  tabFAQ: {
    zh: '高玩技巧与疑难问答',
    en: 'Pro Tips & FAQs'
  },
  searchPlaceholder: {
    zh: '搜索殿堂、技能、神材、功能...',
    en: 'Search halls, skills, divine ores, features...'
  },
  coreFeaturesLabel: {
    zh: '核心功能与玩法：',
    en: 'Core Features & Gameplay:'
  },
  keyRewardsLabel: {
    zh: '关键产出与收益：',
    en: 'Key Rewards & Drops:'
  },
  proTipPrefix: {
    zh: '💡 秘诀:',
    en: '💡 Pro Tip:'
  },
  jumpToPrefix: {
    zh: '立即前往',
    en: 'Go to'
  },
  catAll: {
    zh: '全部殿堂',
    en: 'All Halls'
  },
  catCore: {
    zh: '🎴 核心养成',
    en: '🎴 Core Progression'
  },
  catBattle: {
    zh: '⚔️ 副本竞技',
    en: '⚔️ Battle & PVP'
  },
  catSectTech: {
    zh: '🏛️ 宗门与科技',
    en: '🏛️ Sect & Tech'
  },
  catInterstellar: {
    zh: '🚀 星际战舰',
    en: '🚀 Interstellar'
  },
  catGodhood: {
    zh: '👑 百级神考',
    en: '👑 God Trials'
  },
  roadmapHeader: {
    zh: '魂师修神五大阶段成长路线指引',
    en: '5-Stage Soul Master to God King Growth Progression Guide'
  },
  roadmapDesc: {
    zh: '根据您的当前等级选择最适宜的核心目标，合理规划猎魂、暗器锻造、斗铠打造与星际贸易的先后次序，百级封神事半功倍！',
    en: 'Select the optimal objectives for your current level. Systematically plan beast hunting, hidden weapon crafting, battle armor forging, and interstellar trade to ascend to Godhood efficiently!'
  },
  combatHeader: {
    zh: '即时微操、终极奥义与技能连携大赏',
    en: 'Real-Time Tactics, Ultimate Arts & Skill Synergies'
  },
  combatDesc: {
    zh: '掌握战斗中的各种主动指令与联动时机，越级挑战十万年凶兽与全大陆精英魂师无往不利！',
    en: 'Master every active command and synergy trigger in combat to conquer 100k-year ferocious beasts and elite academy masters!'
  },
  faqHeader: {
    zh: '常见疑难解答与终极致富秘诀',
    en: 'Frequently Asked Questions & Pro Wealth Secrets'
  },
  footerTitle: {
    zh: '准备好踏上万古修神之旅了吗？',
    en: 'Ready to Embark on the Eternal Godhood Journey?'
  },
  footerDesc: {
    zh: '立刻前往魂师面板查看当前属性，或直奔星斗猎魂吸收极品魂环！',
    en: 'Head to your Soul Master Profile to review attributes, or hunt in Great Star Dou Forest to absorb divine soul rings!'
  },
  btnCharacter: {
    zh: '进入魂师面板',
    en: 'Soul Master Profile'
  },
  btnSpiritPagoda: {
    zh: '探索传灵塔',
    en: 'Explore Spirit Pagoda'
  },
  emptySearch: {
    zh: '未找到匹配的功能介绍，请尝试输入其他关键词',
    en: 'No matching guide found. Please try another search keyword.'
  }
};
