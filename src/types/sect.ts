/**
 * Tang Sect & Continental Sect Relations System Types
 * 唐门宗门系统、四大单属性堂口、万宗商队来访贸易与大陆宗门战帖决战
 */

export type SectHallType = 'main' | 'power' | 'defense' | 'agility' | 'alchemy' | 'martial';

export interface SectHall {
  id: SectHallType;
  name: string;
  chineseName: string;
  leaderName: string; // 堂主名 (泰坦、牛皋、白鹤、杨无敌、小舞/马红俊等)
  leaderTitle: string;
  level: number;
  maxLevel: number;
  description: string;
  specialty: string;
  effectSummary: string;
  statsBonus: {
    atk: number;
    def: number;
    hp: number;
    speed: number;
    critRate: number;
    forgeDiscountPct?: number; // 铸造消耗减少%
    shieldBonusPct?: number;   // 护盾免伤提升%
    tradeProfitBonusPct?: number; // 贸易利润提升%
    herbRefineBonusPct?: number;  // 炼丹产量提升%
  };
  upgradeCost: {
    gold: number;
    sectFunds: number;
    materials?: { [key: string]: number };
  };
}

export interface SectTradeOffer {
  id: string;
  sectName: string; // e.g. 七宝琉璃宗, 昊天宗, 传灵塔, 蓝电霸王龙宗, 天斗皇家商会
  sectLogoColor: string;
  repName: string; // 代表人 e.g. 宁风致, 唐啸, 尘心, 古榕, 雪清河, 千古迭廷
  repTitle: string;
  repAvatar?: string;
  favorability: number; // 0 ~ 100 宗门好感度
  dialogue: string;
  desiredItem: {
    type: 'hidden_weapon' | 'metal' | 'medicine' | 'gold' | 'herb';
    itemId: string;
    itemName: string;
    quantity: number;
    description: string;
  };
  offerRewards: {
    gold: number;
    sectFunds: number;
    prestige: number;
    items?: { id: string; name: string; quantity: number; icon?: string; desc?: string }[];
    metals?: { [name: string]: number };
    favorGain: number;
  };
  status: 'pending' | 'completed' | 'rejected';
}

export interface SectChallengeLetter {
  id: string;
  title: string;
  senderSect: string; // e.g. '武魂殿圣皇特使', '象甲宗·呼延家族', '圣灵教邪魂师', '风剑宗&火豹宗'
  senderLeader: string; // e.g. '菊斗罗月关 & 鬼斗罗鬼魅', '象甲宗主·呼延震', '副教主·万魂斗罗'
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare' | 'god';
  difficultyName: string;
  difficultyColor: string;
  letterText: string;
  enemyLeaderStats: {
    name: string;
    title: string;
    level: number;
    hp: number;
    maxHp: number;
    shield: number;
    maxShield: number;
    atk: number;
    def: number;
    speed: number;
    avatarUrl?: string;
    skills: { name: string; desc: string; dmg: number; isUltimate?: boolean }[];
  };
  rewards: {
    gold: number;
    sectFunds: number;
    sectPrestige: number;
    disciplesRecruited: number;
    tributePerDay: number;
    metals?: { [metalName: string]: number };
    rareItemDesc: string;
  };
  status: 'active' | 'defeated' | 'expired';
}

export interface TangSectState {
  isEstablished: boolean; // 是否已举行立宗大典
  sectName: string; // 宗门名称 (默认 '唐门')
  sectMotto: string; // 宗门门规誓词
  sectLevel: number; // 1 ~ 10
  sectRankTitle: string; // 初创微门 -> 声名鹊起 -> 威震一方 -> 斗罗第一大宗 -> 万古神级唐门
  prosperity: number; // 宗门繁荣度
  prestige: number; // 宗门全大陆声望
  sectFunds: number; // 宗门发展金 (唐门金库)
  totalDisciples: number; // 弟子总数
  eliteDisciples: number; // 精英真传弟子
  elderCount: number; // 长老席位
  halls: { [key in SectHallType]: SectHall };
  visitors: SectTradeOffer[]; // 来访的各大宗门商团
  challenges: SectChallengeLetter[]; // 收到的各大宗门战帖
  completedTradesCount: number;
  repelledChallengesCount: number;
  dailyTributeAccumulated: number; // 累计未领取的敌宗战败岁贡
  lastTributeClaimTime: number;
}
