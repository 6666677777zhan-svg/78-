import React, { useState, useMemo } from 'react';
import { Player } from '../types/game';
import { GameView } from './Navbar';
import { getSoulRankTitle } from '../data/martialSouls';
import { SoundEngine } from '../utils/audio';
import { 
  BookOpen, Compass, Sparkles, User, TreePine, Trophy, 
  Hammer, Droplets, Skull, Waves, Crown, Rocket, 
  Zap, Search, ArrowRight, CheckCircle2, Flame, Shield, 
  HelpCircle, ChevronRight, Swords, Star, ExternalLink,
  Target, Layers, Award, Radio, MapPin, Database, Cpu
} from 'lucide-react';

interface GameGuideViewProps {
  player: Player;
  onNavigateToView: (view: GameView) => void;
}

type GuideCategory = 'all' | 'core' | 'battle' | 'sect_tech' | 'interstellar' | 'godhood';

interface SystemGuideItem {
  id: GameView;
  title: string;
  subtitle: string;
  category: 'core' | 'battle' | 'sect_tech' | 'interstellar' | 'godhood';
  icon: React.ReactNode;
  themeColor: string;
  borderClass: string;
  bgGradient: string;
  badge: string;
  douluoSeries: string;
  summary: string;
  coreFunctions: string[];
  keyRewards: string[];
  proTips: string;
}

const SYSTEM_GUIDES: SystemGuideItem[] = [
  {
    id: 'character',
    title: '魂师面板',
    subtitle: '武魂掌控 · 属性加点 · 魂环配置 · 战力总评',
    category: 'core',
    icon: <User className="w-5 h-5 text-blue-400" />,
    themeColor: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    bgGradient: 'from-blue-950/40 to-slate-900/90',
    badge: '基础核心',
    douluoSeries: '全系列通用',
    summary: '魂师修行的立身之本。在此查看并切换当前主战武魂（支持双生武魂自由切换），配置一至十魂环年份与主动/被动魂技，消耗属性点自由加点六大维度，实时评测当前修罗/海神战力。',
    coreFunctions: [
      '主副双生武魂实时切换，两套独立魂环与技能树',
      '觉醒第二神级武魂（如昊天锤、六翼天使、九宝琉璃塔等）',
      '魂环配置与神级魂环年限展示（十年至百万年神级）',
      '魂骨装备槽位全景与外附魂骨状态查看',
      '升级自由分配天道属性点（攻击、防御、生命、暴击、速度）'
    ],
    keyRewards: ['自由切换战斗流派', '全维度战力属性自定义加成', '封号斗罗至高称号'],
    proTips: '每次等级提升都会获得自由属性点，敏攻系推荐主堆敏捷与暴击，强攻系推荐主攻击与生命！'
  },
  {
    id: 'multiplayer',
    title: '跨服实时PVP与弑神共斗',
    subtitle: '真人天梯对决 · 跨服传音 · 组队围猎凶兽 · 封号神榜',
    category: 'battle',
    icon: <Swords className="w-5 h-5 text-rose-400" />,
    themeColor: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    bgGradient: 'from-rose-950/40 to-slate-900/90',
    badge: '实时联机',
    douluoSeries: '全服跨服互联',
    summary: '全大陆跨服多人联机中心！支持在线魂师大厅即时传音、检视全服玩家武魂斗铠配置、一键天梯排位匹配1v1真合格斗、15秒倒计时回合决策、以及2~4人组队围猎深海魔鲸王等百万年神兽。',
    coreFunctions: [
      '一键全大陆跨服天梯排位匹配，天梯积分与斗魂勋章结算',
      '在线魂师广场：检视全服玩家配置，发送约战请帖',
      '全服跨服传音阁（世界/约战/组队多频道实时广播）',
      '跨服弑神共斗：2~4人组队讨伐深海魔鲸王、邪眼暴君与深红之母',
      '全服天梯封号至尊榜与综合战力神榜'
    ],
    keyRewards: ['天梯排位积分', '斗魂冠军勋章', '天锻神金', '十万年魂骨精华', '超神源石'],
    proTips: '在实时PVP中，合理分配魂力，优先展开领域压制对手防御，并在关键回合释放武魂真身爆发最高伤害！'
  },
  {
    id: 'spiritpagoda',
    title: '传灵塔 · 魂灵机甲',
    subtitle: '魂灵契约 · 并肩作战 · 机甲研制 · 万兽庇护 · 升灵台',
    category: 'sect_tech',
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    themeColor: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 to-slate-900/90',
    badge: '斗罗2核心',
    douluoSeries: '斗罗大陆Ⅱ绝世唐门',
    summary: '霍雨浩开创的万古宗门！在此与百万年天梦冰蚕、雪帝、冰帝等神兽签订平等契约，指派2尊主力魂灵在战斗中并肩释放神技；研造紫级/黑级/红级/天火造神机甲；捐赠建设万兽庇护所，并挑战升灵台突破魂灵年限。',
    coreFunctions: [
      '每日领取传灵塔主俸禄与魂灵精魄',
      '与天梦冰蚕、雪帝等7尊神级魂灵签约并派遣出战',
      '研制造神机甲（紫级至神级·天火圣裁），装备机载歼星重炮',
      '建设极北/星斗万兽庇护所，提升和平指数获得全属性反哺',
      '升灵台四阶试炼（初级/中级/高级/传神），斩获万年魂灵升灵粹'
    ],
    keyRewards: ['出战魂灵专属战斗奥义', '机甲歼星炮超能轰炸', '魂兽生态全队防御/生命光环'],
    proTips: '出战的魂灵技能在战斗面板中会独立生成释放按键，与机甲重炮配合可打出成吨爆发伤害！'
  },
  {
    id: 'interstellar',
    title: '星际机甲战舰',
    subtitle: '空天战机 · 恒星歼星舰 · 跨行星贸易 · 母星天基防御',
    category: 'interstellar',
    icon: <Rocket className="w-5 h-5 text-cyan-400" />,
    themeColor: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    bgGradient: 'from-cyan-950/40 to-slate-900/90',
    badge: '斗罗4核心',
    douluoSeries: '斗罗大陆Ⅳ终极斗罗',
    summary: '迈向浩瀚星辰大海！建立星际科研船坞，研发制造三代空天战机与恒星级歼星巡洋战舰；驾驶飞船曲率跃迁至天马座、天龙星、罪恶星球进行大宗物资星际贸易；在轨道指挥天基防御矩阵决战深红外星母舰！',
    coreFunctions: [
      '制造一代超音速战机至三代天火巡航战机',
      '组装万米恒星级歼星巡洋战舰与神级反物质护盾',
      '星际星图折跃探索，5大行星大宗特产差价倒买倒卖赚取巨额金魂币与神金',
      '母星天基防御决战深红外星舰队，守卫斗罗母星和平',
      '派遣战舰全自动星际巡航与深空矿脉勘探'
    ],
    keyRewards: ['数以亿计的海量金魂币与天锻神金', '歼星级超维战斗火力支援', '星际元帅神圣统帅特权'],
    proTips: '不同行星特产价格浮动极大，低买高卖是后期获取数千万金魂币和天锻神金的最快途径！'
  },
  {
    id: 'battlearmor',
    title: '斗铠魂导',
    subtitle: '一字至五字斗铠 · 天锻神金 · 九级定装魂导炮 · 弑神魂导',
    category: 'sect_tech',
    icon: <Crown className="w-5 h-5 text-amber-400" />,
    themeColor: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    badge: '斗罗3核心',
    douluoSeries: '斗罗大陆Ⅲ龙王传说',
    summary: '将锻造术与魂力科技融合至巅峰！收集沉银、精金、秘银、天锻神金，从单件斗铠铸造逐步融合进阶至一字、二字、三字、四字乃至五字至尊真灵斗铠；同时研造九级定装魂导炮与十级弑神魂导器，战力翻倍暴涨。',
    coreFunctions: [
      '6件基础斗铠（胸铠、头盔、臂铠、腿甲、羽翼等）锻造装配',
      '斗铠位阶进阶：一字斗铠 → 二字斗铠 → 三字天锻 → 四字神级 → 五字真灵',
      '研发九级定装爆裂魂导炮与十级弑神毁灭魂导武器',
      '战斗中自由开启斗铠全覆模式与魂导武器超能轰炸',
      '神金消耗与属性大幅百分比增幅'
    ],
    keyRewards: ['全属性暴涨50%~300%', '战斗中专属斗铠护盾与减伤', '十级魂导炮毁灭级主动技'],
    proTips: '斗铠所需的神材可在【神材宝地】或【星际行星贸易】中批量获取，优先将胸铠与羽翼进阶！'
  },
  {
    id: 'gathering',
    title: '神材宝地',
    subtitle: '稀有金属 · 天锻神金 · 矿脉开采 · 挂机产出 · 快捷跳转',
    category: 'sect_tech',
    icon: <Hammer className="w-5 h-5 text-amber-300" />,
    themeColor: 'text-amber-300',
    borderClass: 'border-amber-400/30',
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    badge: '资源枢纽',
    douluoSeries: '全系列通用',
    summary: '斗罗大陆稀世金属宝藏圣地。沉银矿洞、精金地脉、秘银裂谷、神金天池四大矿脉每日自动产出锻造神料，支持手动高速开采与矿脉勘探升级，并提供一键跳转至斗铠、唐门、机甲等消耗系统的快捷通道。',
    coreFunctions: [
      '沉银、百炼精金、灵锻秘银、天锻神金、龙纹黑金持续产出',
      '挂机自动累积神金资源，离线也可持续收获',
      '矿脉等级升级，大幅提升每小时产出效率与暴击率',
      '一键直达【斗铠魂导】【唐门绝技】【传灵塔】【星际战舰】'
    ],
    keyRewards: ['锻造高阶斗铠与机甲不可或缺的核心神料', '大量金魂币与锻造经验'],
    proTips: '优先升级矿脉开采等级，矿脉产出的天锻神金是打造四字/五字斗铠与神级歼星舰的核心物资！'
  },
  {
    id: 'companions',
    title: '斗罗4伙伴',
    subtitle: '传奇结识 · 羁绊共鸣 · 升阶突破 · 超级武魂融合技',
    category: 'core',
    icon: <Sparkles className="w-5 h-5 text-sky-400" />,
    themeColor: 'text-sky-400',
    borderClass: 'border-sky-500/30',
    bgGradient: 'from-sky-950/40 to-slate-900/90',
    badge: '战队羁绊',
    douluoSeries: '终极斗罗 & 龙王传说',
    summary: '跨越万年时空并肩作战！结识蓝轩宇、白秀秀、唐舞麟、古月娜、唐三、小舞等传奇伙伴。伙伴提供被动光环增益，升级升星解锁强力羁绊，并可在战斗中引爆「龙神降临」「深渊冰龙」等毁天灭地的武魂融合技！',
    coreFunctions: [
      '结识唐三、小舞、唐舞麟、古月娜、蓝轩宇、白秀秀等核心伙伴',
      '提升伙伴等级与星级，解锁专属战斗技能与属性光环',
      '激活伙伴羁绊共鸣（如神龙眷侣、万古龙王、初代七怪等）',
      '在所有战斗中一键释放毁天灭地的「武魂融合技」'
    ],
    keyRewards: ['全队高额暴击/攻击/减伤被动加成', '逆转战局的武魂融合技'],
    proTips: '凑齐特定伙伴组合（如蓝轩宇+白秀秀，或唐舞麟+古月娜）可解锁最强融合技，战斗中能瞬间造成数百万伤害！'
  },
  {
    id: 'tournament',
    title: '斗魂大赛',
    subtitle: '全大陆高级魂师精英大赛 · 车轮对决 · 冠军勋章 · 神赐封号',
    category: 'battle',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    themeColor: 'text-yellow-400',
    borderClass: 'border-yellow-500/30',
    bgGradient: 'from-yellow-950/40 to-slate-900/90',
    badge: '巅峰PVE/PVP',
    douluoSeries: '斗罗大陆Ⅰ',
    summary: '全大陆最高规格的魂师荣耀战场！挑战天水学院、炽火学院、神风学院、象甲宗、雷霆学院、皇斗战队、武魂殿黄金一代以及史莱克七怪，车轮战登顶大陆之巅，赢取冠军勋章、极品魂骨与神级声望。',
    coreFunctions: [
      '挑战大陆10大学院精英主力战队',
      '层层递进的车轮淘汰赛制与专属战队技能博弈',
      '赚取冠军勋章与神赐丰厚金魂币',
      '解锁大陆第一魂师战队荣誉称号'
    ],
    keyRewards: ['斗魂大赛冠军勋章', '高年份极品魂骨', '海量声望与修炼经验'],
    proTips: '对手拥有强力控制与群体爆发，合理利用玄天宝录的解控暗器与伙伴武魂融合技可轻松通关！'
  },
  {
    id: 'soulbones',
    title: '魂骨秘境',
    subtitle: '六大部位 · 万古神骨黑市 · 八蛛矛进化 · 年份突破',
    category: 'core',
    icon: <Skull className="w-5 h-5 text-rose-400" />,
    themeColor: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    bgGradient: 'from-rose-950/40 to-slate-900/90',
    badge: '至尊骨骼',
    douluoSeries: '全系列核心',
    summary: '魂师至宝！配置头部、躯干、左臂、右臂、左腿、右腿六大基础魂骨及外附魂骨八蛛矛。在万古黑市中鉴宝淘宝，消耗魂骨精华突破魂骨年限（万年至百万年神骨），吞噬进化八蛛矛为吞噬神铠。',
    coreFunctions: [
      '装配与替换6大身体部位魂骨及外附魂骨',
      '万古黑市神秘鉴宝，淘得天梦头骨、泰坦躯干骨等极品神骨',
      '消耗魂骨精华强化魂骨年限，解锁额外词条与神级被动',
      '八蛛矛吞噬进化，提升吸血与撕裂穿透效果'
    ],
    keyRewards: ['巨额永久基础属性加成', '独门魂骨主动附带技能', '生命吸取与真实伤害穿透'],
    proTips: '外附魂骨八蛛矛拥有随着战斗吞噬进化的特性，越早满破越能在持久战中凭借吸血立于不败之地！'
  },
  {
    id: 'forest',
    title: '星斗猎魂',
    subtitle: '五大禁区 · 百万年神兽 · 吸收极品魂环 · 凶兽禁地',
    category: 'battle',
    icon: <TreePine className="w-5 h-5 text-emerald-400" />,
    themeColor: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    bgGradient: 'from-emerald-950/40 to-slate-900/90',
    badge: '魂环源泉',
    douluoSeries: '全系列核心',
    summary: '魂师晋升获取魂环的必经之地。探索星斗大森林外围/核心圈、落日森林、极北冰原、深海魔鲸海域、万妖王凶兽禁地，击杀泰坦巨猿、天青牛蟒、雪女、深海魔鲸王等，吸收从十年白环至百万年神级金环！',
    coreFunctions: [
      '五大生态禁区探索，遭遇不同属性与年限魂兽',
      '即时回合微操战斗，破除魂兽防御与狂暴状态',
      '击败魂兽掉落对应年份魂环、魂骨与天材地宝',
      '吸收魂环解锁对应武魂的一至十魂技'
    ],
    keyRewards: ['极品魂环（百年黄环、千年紫环、万年黑环、十万年红环、百万年金环）', '高阶魂兽爆落魂骨'],
    proTips: '每达到10级整倍数（如10、20、30...90级）必须前往猎魂吸收魂环才能突破瓶颈！'
  },
  {
    id: 'arena',
    title: '索托斗魂',
    subtitle: '索托大斗魂场 · 铁斗魂至金斗魂 · 即时微操对决 · 积分晋级',
    category: 'battle',
    icon: <Trophy className="w-5 h-5 text-amber-400" />,
    themeColor: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    badge: '单人博弈',
    douluoSeries: '斗罗大陆Ⅰ',
    summary: '检验个人微操与战术的经典博弈场！从铁斗魂、铜斗魂一步步晋阶至银斗魂、金斗魂、紫金斗魂直至钻石斗魂勋章。对决各路名宿魂师，积攒斗魂积分，兑换丰厚金魂币与修行秘药。',
    coreFunctions: [
      '单人 1v1 即时微操博弈战斗',
      '铁斗魂至钻石斗魂六大段位晋级体系',
      '斗魂积分榜与连胜机制奖励',
      '演练技能释放顺序与暗器连招的最佳场地'
    ],
    keyRewards: ['高阶斗魂勋章', '海量金魂币与斗魂积分', '战力实战检验'],
    proTips: '合理掌握【玄天绝技】定身与【顶级暗器】爆发的释放节奏，可以越级击败更高战力的对手！'
  },
  {
    id: 'tangsect',
    title: '唐门绝技',
    subtitle: '开宗立派 · 万宗降伏岁贡 · 四大堂口 · 玄天宝录 · 顶级暗器',
    category: 'sect_tech',
    icon: <Hammer className="w-5 h-5 text-amber-500" />,
    themeColor: 'text-amber-500',
    borderClass: 'border-amber-600/30',
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    badge: '宗门传承',
    douluoSeries: '斗罗大陆Ⅰ & Ⅱ',
    summary: '重铸唐门无上荣光！建立唐门宗门，降伏下属宗门收取每日丰厚岁贡；升级力堂（锻造）、御堂（防御）、敏堂（情报）、药堂（炼药）；修炼玄天功、紫极魔瞳、鬼影迷踪等六大心法；锻造诸葛神弩、暴雨梨花针、佛怒唐莲等顶级暗器。',
    coreFunctions: [
      '建立唐门，提升宗门声望，降伏万宗每日坐收海量金魂币与神金岁贡',
      '建设四大堂口（力堂、御堂、敏堂、药堂），解锁全方位宗门特权',
      '修炼《玄天宝录》六绝技：玄天功、玄玉手、紫极魔瞳、鬼影迷踪、控鹤擒龙、暗器百解',
      '锻造诸葛神弩、子母追魂夺命胆、暴雨梨花针、佛怒唐莲等机括类暗器并在战斗中投掷'
    ],
    keyRewards: ['每日稳定巨额金魂币岁贡', '全技能伤害与暴击倍率提升', '战斗中无限投掷的毁天灭地暗器'],
    proTips: '优先将玄天宝录修炼至高重，紫极魔瞳能提供超强破防与精神威压，佛怒唐莲可造成群体秒杀伤害！'
  },
  {
    id: 'icefire',
    title: '冰火仙草',
    subtitle: '冰火两仪眼 · 独孤博药园 · 极品仙草炼化 · 脱胎换骨',
    category: 'core',
    icon: <Droplets className="w-5 h-5 text-cyan-400" />,
    themeColor: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    bgGradient: 'from-cyan-950/40 to-slate-900/90',
    badge: '洗髓神地',
    douluoSeries: '斗罗大陆Ⅰ',
    summary: '得天独厚的造化神泉！进入冰火两仪眼深处，采摘并炼化八角玄冰草、烈火杏娇疏、奇茸通天菊、绮罗郁金香、相思断肠红等传世仙品。彻底洗髓伐骨，消除魂力瓶颈，获得冰火不侵与属性飙升。',
    coreFunctions: [
      '探索极热与极寒交汇的冰火两仪眼药园',
      '采集十大极品仙草与天地灵物',
      '炼化仙品药草获得永久全属性大幅飞跃与等级直升',
      '获得「冰火金身」与毒素完全免疫特权'
    ],
    keyRewards: ['永久暴增攻击、防御、生命上限与暴击率', '直接提升魂力等级', '百毒不侵被动'],
    proTips: '仙草炼化没有任何负面副作用，达到对应等级后尽早炼化相思断肠红与烈火杏娇疏，战力瞬间起飞！'
  },
  {
    id: 'slaughter',
    title: '杀戮之都',
    subtitle: '地狱杀戮场 · 封禁魂技 · 地狱路试炼 · 觉醒杀神领域',
    category: 'battle',
    icon: <Skull className="w-5 h-5 text-rose-500" />,
    themeColor: 'text-rose-500',
    borderClass: 'border-rose-600/30',
    bgGradient: 'from-rose-950/40 to-slate-900/90',
    badge: '至高领域',
    douluoSeries: '斗罗大陆Ⅰ',
    summary: '罪恶与杀戮的试炼之地。在无法动用武魂魂技的极端限制下，依靠纯粹肉体力量、玄天绝技与机括暗器完成地狱杀戮场百战百胜；勇闯地狱路斩杀暗金三头蝙蝠王与十首烈阳蛇，觉醒杀伐至尊「杀神领域」！',
    coreFunctions: [
      '无魂技限制下的纯体魄与暗器极限战斗',
      '地狱杀戮场百场连胜挑战',
      '闯荡地狱路，决战两大远古凶兽Boss',
      '通关后永久觉醒「杀神领域」并在全战斗中开启'
    ],
    keyRewards: ['获得【杀神领域】（战斗中敌方全属性削弱30%，自身攻击暴增50%）', '杀气护体称号'],
    proTips: '在此处唐门暗器与玄天功是制胜关键，备足诸葛神弩和暴雨梨花针可轻松碾压地狱路凶兽！'
  },
  {
    id: 'seagod',
    title: '四大神考',
    subtitle: '海神九考 · 修罗神考 · 天使神考 · 罗刹神考 · 百级成神',
    category: 'godhood',
    icon: <Crown className="w-5 h-5 text-amber-300" />,
    themeColor: 'text-amber-300',
    borderClass: 'border-amber-500/30',
    bgGradient: 'from-amber-950/40 to-slate-900/90',
    badge: '百级飞升',
    douluoSeries: '全系列巅峰',
    summary: '打破凡人之躯，成就至高神祗！选择继承海神、修罗神、天使神或罗刹神神位。经历九大重磅神之考核（穿越海神之光、拔出海神三叉戟、猎杀深海魔鲸王等），斩获神级神器与神装，突破百级神王！',
    coreFunctions: [
      '四大至高神位（海神、修罗神、天使神、罗刹神）自由开启神考',
      '九重神考层层递进挑战（登海神之光、拔出神器、潮汐炼体、战胜七圣柱）',
      '解锁神级神器（海神三叉戟、修罗神剑等）',
      '百级大圆满登临神界，获得专属神祗金环与至尊神位'
    ],
    keyRewards: ['百级神祗神位加冕', '神技「一去不返」「修罗审判」', '神界至尊属性'],
    proTips: '神考考核对战力要求极高，建议在装备四字斗铠、集齐六大魂骨并将魂力提升至90级以上后再冲刺九考！'
  },
  {
    id: 'academy',
    title: '修练圣地',
    subtitle: '大师指点 · 史莱克学院 · 海神阁深度冥想 · 自动挂机策略',
    category: 'core',
    icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    themeColor: 'text-indigo-400',
    borderClass: 'border-indigo-500/30',
    bgGradient: 'from-indigo-950/40 to-slate-900/90',
    badge: '挂机修行',
    douluoSeries: '全系列核心',
    summary: '魂师日常冥想与战术参悟中心。大师玉小刚亲自指点武魂修行之道；在史莱克学院与海神阁进行深度冥想高速获取魂力经验；配置全自动战斗挂机策略（技能优先级、暗器自动投掷、血线自动恢复）。',
    coreFunctions: [
      '聆听大师玉小刚十大核心武魂竞争力指点',
      '史莱克学院与海神阁黄金古树冥想，离线也能暴涨海量魂力与金币',
      '配置智能自动战斗策略（自定义技能释放序列与保命阈值）',
      '查看个人修行历练大事件记录'
    ],
    keyRewards: ['源源不断的挂机魂力与经验', '大师专属修行心得秘籍', '智能省心的全自动战斗挂机'],
    proTips: '记得在挂机策略中将【控鹤擒龙】或【控制系第一魂技】设为首发，可大幅提升自动挂机的胜率与效率！'
  }
];

const PROGRESSION_STAGES = [
  {
    stage: '第一阶段：魂师觉醒与初入江湖',
    levelRange: 'Lv.1 ~ Lv.30 (魂士 → 魂尊)',
    icon: '🌱',
    tasks: [
      '觉醒先天满魂力神级武魂（昊天锤/六翼天使/蓝银皇等）',
      '前往【星斗猎魂】击杀百年/千年魂兽，吸收前3个魂环',
      '在【索托斗魂】与【修练圣地】中磨练战斗技巧并挂机积累魂力',
      '在【魂师面板】合理分配初始自由属性点'
    ],
    targetTitle: '三环魂尊 · 崭露头角'
  },
  {
    stage: '第二阶段：仙草洗髓与大赛扬名',
    levelRange: 'Lv.30 ~ Lv.60 (魂尊 → 魂帝)',
    icon: '🌸',
    tasks: [
      '前往【冰火仙草】炼化八角玄冰草与烈火杏娇疏，脱胎换骨',
      '征战【斗魂大赛】，击败天水、神风、象甲宗赢取冠军勋章',
      '在【魂骨秘境】黑市中搜集头部与躯干魂骨并强化年限',
      '前往【传灵塔】与第一尊万年魂灵签订契约，开启魂灵并肩作战'
    ],
    targetTitle: '六环魂帝 · 大陆天骄'
  },
  {
    stage: '第三阶段：开宗立派与斗铠研造',
    levelRange: 'Lv.60 ~ Lv.80 (魂圣 → 魂斗罗)',
    icon: '🏛️',
    tasks: [
      '在【唐门绝技】中开宗立派，降伏下属各宗每日收取海量岁贡',
      '修炼《玄天宝录》六大绝技，锻造顶级机括暗器【佛怒唐莲】',
      '在【神材宝地】开采沉银与秘银，在【斗铠魂导】中打造一字/二字斗铠',
      '进入【杀戮之都】闯荡地狱路，成功觉醒至尊【杀神领域】'
    ],
    targetTitle: '八环魂斗罗 · 宗门霸主'
  },
  {
    stage: '第四阶段：战舰巡航与伙伴共鸣',
    levelRange: 'Lv.80 ~ Lv.90 (魂斗罗 → 封号斗罗)',
    icon: '🚀',
    tasks: [
      '在【星际机甲战舰】中研造恒星级巡洋战舰，开启行星跃迁跨星贸易',
      '在【斗罗4伙伴】中结识蓝轩宇、唐舞麟、古月娜，激活终极武魂融合技',
      '天锻进阶三字/四字神级斗铠，并在【传灵塔】研制造神级红级神机',
      '在【星斗猎魂】凶兽禁地击杀十万年/百万年魂兽，吸收九大魂环满配'
    ],
    targetTitle: '九环封号斗罗 · 威震寰宇'
  },
  {
    stage: '第五阶段：四大神考与百级成神',
    levelRange: 'Lv.90 ~ Lv.100 (封号斗罗 → 至高神王)',
    icon: '👑',
    tasks: [
      '开启【四大神考】（海神九考/修罗神考），拔出至高神器',
      '在【星际战舰】中率领天基防御舰队彻底击溃深红外星母舰',
      '在【传灵塔】契约百万年天梦冰蚕与雪帝，升灵台登峰造极',
      '突破百级大圆满，神祗金环加身，登临神界至尊王座！'
    ],
    targetTitle: '百级至高神王 · 永恒不朽'
  }
];

export const GameGuideView: React.FC<GameGuideViewProps> = ({
  player,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<'systems' | 'roadmap' | 'combat' | 'faq'>('systems');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('all');
  const rankInfo = getSoulRankTitle(player.level);

  const filteredGuides = useMemo(() => {
    return SYSTEM_GUIDES.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.douluoSeries.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.coreFunctions.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleJump = (view: GameView) => {
    SoundEngine.playClick();
    onNavigateToView(view);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* HERO BANNER & LORE INTRODUCTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/40 rounded-full text-xs font-semibold text-indigo-300">
            <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
            <span>斗罗大陆 · 全景世界观与系统大典</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 tracking-wide">
                《斗罗大陆：魂师觉醒与万代修神录》全书大成
              </h2>
              <p className="text-slate-300 text-sm md:text-base mt-1 max-w-3xl leading-relaxed">
                本游戏融合了《斗罗大陆》Ⅰ、Ⅱ、Ⅲ、Ⅳ全系列宏大世界观体系：从最初的武魂觉醒、星斗猎魂、唐门绝技，到传灵塔百万年魂灵并肩作战、一至五字斗铠天锻，再到星际战舰行星贸易与百级四大神考成神！
              </p>
            </div>

            {/* Current Player Mini Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 shrink-0 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-md">
                <img 
                  src={player.avatarUrl} 
                  alt={player.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-100">{player.name}</span>
                  {player.godPosition && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className={`text-xs font-semibold block ${rankInfo.colorClass}`}>
                  {rankInfo.title} (Lv.{player.level})
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  💰 {player.gold.toLocaleString()} 金魂币
                </span>
              </div>
            </div>
          </div>

          {/* Core System Stats Overview Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">主修武魂</span>
                <strong className="text-xs text-slate-200 truncate block max-w-[120px]">
                  {player.martialSouls[player.activeSoulIndex]?.name || '未觉醒'}
                </strong>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">出战魂灵</span>
                <strong className="text-xs text-emerald-300">
                  {(player.spiritPagoda?.spiritSouls || []).filter(s => s.isContracted && (player.spiritPagoda?.activeBattlingSoulIds || []).includes(s.id)).length} / 2 尊
                </strong>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">斗铠阶位</span>
                <strong className="text-xs text-amber-300">
                  {player.battleArmor?.name || '未着斗铠'}
                </strong>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">主力战舰</span>
                <strong className="text-xs text-cyan-300">
                  {(player.interstellar?.starships || []).find(s => s.isUnlocked)?.name || '未研发'}
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('systems');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'systems'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>十五大功能殿堂详解 ({SYSTEM_GUIDES.length})</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('roadmap');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>修神升级路线图 (1~100级)</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('combat');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'combat'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>即时微操与融合技秘籍</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playClick();
              setActiveTab('faq');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>高玩技巧与疑难问答</span>
          </button>
        </div>

        {activeTab === 'systems' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="搜索殿堂、技能、神材、功能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* TAB 1: ALL SYSTEMS MANUAL */}
      {activeTab === 'systems' && (
        <div className="space-y-6">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: '全部殿堂' },
              { id: 'core', label: '🎴 核心养成' },
              { id: 'battle', label: '⚔️ 副本竞技' },
              { id: 'sect_tech', label: '🏛️ 宗门与科技' },
              { id: 'interstellar', label: '🚀 星际战舰' },
              { id: 'godhood', label: '👑 百级神考' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  SoundEngine.playClick();
                  setSelectedCategory(cat.id as GuideCategory);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* System Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(item => (
              <div 
                key={item.id}
                className={`bg-gradient-to-b ${item.bgGradient} border ${item.borderClass} rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition-all hover:scale-[1.01] group`}
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-100">{item.title}</h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {item.douluoSeries}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                    {item.summary}
                  </p>

                  {/* Core Features */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      核心功能与玩法：
                    </span>
                    <ul className="space-y-1 pl-1">
                      {item.coreFunctions.map((feat, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-snug">
                          <span className="text-slate-500 font-mono shrink-0">·</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rewards */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1 mb-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      关键产出与收益：
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.keyRewards.map((rew, idx) => (
                        <span key={idx} className="text-[10px] bg-amber-950/40 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md">
                          {rew}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400 flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">💡 秘诀:</span>
                    <span>{item.proTips}</span>
                  </div>
                </div>

                {/* Jump Button */}
                <div className="pt-4 border-t border-slate-800/80 mt-4">
                  <button
                    onClick={() => handleJump(item.id)}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 group-hover:shadow-md"
                  >
                    <span>立即前往【{item.title}】</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="py-16 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">未找到匹配的功能介绍，请尝试输入其他关键词</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROGRESSION ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-100 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>魂师修神五大阶段成长路线指引</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              根据您的当前等级选择最适宜的核心目标，合理规划猎魂、暗器锻造、斗铠打造与星际贸易的先后次序，百级封神事半功倍！
            </p>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
              {PROGRESSION_STAGES.map((stg, idx) => (
                <div key={idx} className="relative pl-12 space-y-3">
                  <div className="absolute left-2.5 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xs shadow-md">
                    <span className="text-[10px]">{stg.icon}</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <h4 className="font-bold text-sm text-amber-300">{stg.stage}</h4>
                        <span className="text-xs text-slate-400 font-mono">{stg.levelRange}</span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 border border-amber-400/30 text-amber-300 rounded-full w-fit">
                        目标：{stg.targetTitle}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-400">本阶段核心修炼任务：</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stg.tasks.map((task, tidx) => (
                          <div key={tidx} className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/60 text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMBAT MECHANICS GUIDE */}
      {activeTab === 'combat' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Swords className="w-5 h-5 text-rose-400" />
                <span>即时微操、终极奥义与技能连携大赏</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                掌握战斗中的各种主动指令与联动时机，越级挑战十万年凶兽与全大陆精英魂师无往不利！
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Feature 1: 武魂魂技 */}
              <div className="bg-slate-950/80 border border-blue-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <h4>1. 武魂魂技连携 (Soul Skills)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  消耗魂力（MP）释放一至九魂技。控制系技能（如蓝银缠绕）可打断敌方蓄力；爆发系技能（如昊天九绝、天使降临）可造成暴击巨额伤害；第九魂技更是扭转乾坤的灭世必杀！
                </p>
              </div>

              {/* Feature 2: 魂灵并肩作战 */}
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <h4>2. 传灵塔·出战魂灵神技 (Spirit Soul)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  在【传灵塔】配置出战的2尊魂灵会在战斗面板中生成快捷按键。天梦冰蚕施展【精神干扰领域】削弱敌方命中与防御，雪帝释放【帝剑·大寒无极】爆发真伤并冰封敌方！
                </p>
              </div>

              {/* Feature 3: 机甲重炮轰炸 */}
              <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  <h4>3. 驾驶机甲·歼星重炮 (Mecha Heavy Cannon)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  装备紫级/黑级/红级机甲后，战斗中可发射机载重炮（如湮灭聚能光束、创世神灭歼星炮）。造成巨量贯穿直伤的同时，为魂师生成高额机甲护盾吸收一切反击伤害！
                </p>
              </div>

              {/* Feature 4: 唐门机括暗器 */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Hammer className="w-4 h-4" />
                  <h4>4. 唐门顶级暗器瞬发 (Hidden Weapons)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  在【唐门绝技】锻造诸葛神弩、暴雨梨花针、佛怒唐莲后，在战斗中可不耗费魂力瞬间投掷！无视敌方护甲造成真实破甲杀伤，是斩杀残血与绝境翻盘的神技。
                </p>
              </div>

              {/* Feature 5: 伙伴武魂融合技 */}
              <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <h4>5. 斗罗4伙伴·武魂融合技 (Fusion Skills)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  结识特定伙伴（如蓝轩宇与白秀秀、唐舞麟与古月娜）后激活。释放【龙神降临】或【深渊冰龙】，天地变色，直接造成超过300%~600%的超位阶毁天灭地合体神威！
                </p>
              </div>

              {/* Feature 6: 杀神领域全开 */}
              <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Skull className="w-4 h-4" />
                  <h4>6. 杀神领域与海神领域 (Domains)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  通过【杀戮之都】或【海神九考】觉醒领域后，战斗中点击【开启领域】即可展开血红杀戮结界，永久压制敌方30%攻击防御，并将自身暴击与伤害倍率推至巅峰！
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRO TIPS & FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>常见疑难解答与终极致富秘诀</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: '💰 如何最快速度赚取上千万金魂币？',
                  a: '1. 前往【星际机甲战舰】进行跨行星大宗贸易，在母星低价采购特产，跃迁至天马座/罪恶星球高价抛售，单趟可获利数百万金魂币！2. 建立【唐门】并降伏下属宗门，每日坐收巨额岁贡。3. 征战【斗魂大赛】夺冠获得海量金币赏赐。'
                },
                {
                  q: '🔨 锻造斗铠与机甲所需的「天锻神金」怎么获取？',
                  a: '在【神材宝地】升级神金天池开采矿脉，挂机即可稳定产出天锻神金；此外在【星际战舰】探索天龙星等高维矿脉也能批量勘探带回。'
                },
                {
                  q: '🎴 双生武魂如何切换？魂环是共用的吗？',
                  a: '在【魂师面板】顶部点击武魂卡片即可无缝切换主修武魂。第一武魂与第二武魂拥有各自完全独立的十个魂环槽位与技能树，您可以将一套配置为纯强攻爆发，另一套配置为神圣控制辅助！'
                },
                {
                  q: '❄️ 传灵塔出战魂灵怎样发挥最大威力？',
                  a: '在【传灵塔】页面勾选两尊契约魂灵（推荐天梦冰蚕+雪帝组合），进入战斗后，首回合先使用天梦冰蚕削弱敌方命中与防御，次回合使用雪帝大寒无极打出冰冻爆发，能最大化压制高阶Boss！'
                },
                {
                  q: '🔱 四大神考可以直接成神吗？',
                  a: '四大神考共分为九重考核。只要您的魂力达到对应境界并逐一击败神之考官或完成神圣历练，完成第九考即可直接加冕神祗，解锁至尊神技并成就百级神王！'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1.5">
                  <strong className="text-sm text-amber-300 flex items-center gap-2">
                    {faq.q}
                  </strong>
                  <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-amber-500/30">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUICK FOOTER NAVIGATION */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h4 className="font-bold text-sm text-slate-200">准备好踏上万古修神之旅了吗？</h4>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          立刻前往魂师面板查看当前属性，或直奔星斗猎魂吸收极品魂环！
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => handleJump('character')}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>进入魂师面板</span>
          </button>
          <button
            onClick={() => handleJump('spiritpagoda')}
            className="px-5 py-2 bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>探索传灵塔</span>
          </button>
        </div>
      </div>

    </div>
  );
};
