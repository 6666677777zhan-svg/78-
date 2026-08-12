import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';
import {
  Mecha,
  FighterJet,
  Starship,
  PlanetInfo,
  AlienInvasionFleet,
  PlanetId,
  CargoItem,
  SpaceBattleLog,
  ActiveTradeExpedition,
  ExpeditionDestination
} from '../types/interstellar';
import {
  PLANETS_DATA,
  ALIEN_INVASION_FLEETS,
  SPACE_EVENTS,
  INITIAL_MECHAS,
  INITIAL_FIGHTERS,
  INITIAL_STARSHIPS,
  EXPEDITION_DESTINATIONS,
  createDefaultInterstellarState
} from '../data/interstellarData';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Rocket,
  Shield,
  ShieldAlert,
  Zap,
  Sparkles,
  Flame,
  Plane,
  Navigation,
  Globe,
  Radio,
  Crosshair,
  Cpu,
  Box,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  Skull,
  Trophy,
  Crown,
  Layers,
  Play,
  CheckCircle2,
  XCircle,
  Hammer,
  Coins,
  Award,
  BatteryCharging,
  Send,
  HelpCircle,
  Check,
  Clock,
  Compass,
  FastForward,
  Gift,
  CheckCheck,
  Wrench,
  ChevronRight,
  Timer
} from 'lucide-react';

interface InterstellarHangarViewProps {
  player: Player;
  onUpdatePlayer: (updater: (prev: Player) => Player) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  onNavigateToView?: (view: string) => void;
}

export const InterstellarHangarView: React.FC<InterstellarHangarViewProps> = ({
  player,
  onUpdatePlayer,
  showToast,
  onNavigateToView
}) => {
  // Navigation tabs
  const [mainTab, setMainTab] = useState<'hangar' | 'trade' | 'defense' | 'expedition'>('hangar');
  const [hangarSubTab, setHangarSubTab] = useState<'mechas' | 'fighters' | 'starships'>('mechas');

  // Real-time ticking for expeditions and missions
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Expedition UI state
  const [selectedExpeditionDest, setSelectedExpeditionDest] = useState<ExpeditionDestination | null>(null);
  const [selectedDispatchShipId, setSelectedDispatchShipId] = useState<string>('');
  const [expeditionRiskFilter, setExpeditionRiskFilter] = useState<'all' | 'safe' | 'high_yield'>('all');

  // Interstellar State Safe Extraction
  const interstellar = player.interstellar || {
    currentPlanetId: 'bluestar' as PlanetId,
    spaceGold: 1500,
    starCores: 10,
    defenseMedals: 5,
    defenseGridLevel: 1,
    defenseShieldHp: 50000,
    maxDefenseShieldHp: 50000,
    planetaryPeaceRating: 100,
    mechas: INITIAL_MECHAS,
    fighters: INITIAL_FIGHTERS,
    starships: INITIAL_STARSHIPS,
    activeFlagshipId: 'ship_meteor_corvette',
    cargo: [{ goodId: 'tg_soul_battery', name: '高能魂力压缩奶瓶', quantity: 10, buyAvgPrice: 150 }],
    cargoCapacity: 50,
    tradeHistoryCount: 0,
    totalTradeProfits: 0,
    repelledInvasionsCount: 0,
    activeExpeditions: [],
    completedExpeditionsCount: 0
  };

  // Selected details
  const [selectedMechaId, setSelectedMechaId] = useState<string>(
    interstellar.mechas?.[0]?.id || 'mecha_white_storm'
  );
  const [selectedShipId, setSelectedShipId] = useState<string>(
    interstellar.starships?.[0]?.id || 'ship_meteor_corvette'
  );
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId>(
    interstellar.currentPlanetId || 'bluestar'
  );

  // Trade quantity inputs
  const [tradeAmount, setTradeAmount] = useState<number>(1);
  const [isWarping, setIsWarping] = useState(false);

  // Deep Space Exploration Event Modal
  const [activeSpaceEvent, setActiveSpaceEvent] = useState<typeof SPACE_EVENTS[0] | null>(null);

  // Space Battle State (Combat with Alien Invasions)
  const [activeInvasionEnemy, setActiveInvasionEnemy] = useState<AlienInvasionFleet | null>(null);
  const [inSpaceBattle, setInSpaceBattle] = useState(false);
  const [battleTurn, setBattleTurn] = useState(1);
  const [battleLogs, setBattleLogs] = useState<SpaceBattleLog[]>([]);
  const [playerShipCombatState, setPlayerShipCombatState] = useState<{
    hp: number;
    maxHp: number;
    shield: number;
    maxShield: number;
    energy: number;
    isShieldOverloaded: boolean;
  }>({
    hp: 15000,
    maxHp: 15000,
    shield: 8000,
    maxShield: 8000,
    energy: 50,
    isShieldOverloaded: false
  });
  const [enemyCombatHp, setEnemyCombatHp] = useState(65000);
  const [enemyCombatShield, setEnemyCombatShield] = useState(35000);
  const [battleResult, setBattleResult] = useState<'ongoing' | 'victory' | 'defeat'>('ongoing');

  const currentPlanet = PLANETS_DATA.find(p => p.id === interstellar.currentPlanetId) || PLANETS_DATA[0];
  const inspectingPlanet = PLANETS_DATA.find(p => p.id === selectedPlanetId) || PLANETS_DATA[0];

  // Active flagship info
  const activeFlagship = interstellar.starships?.find(s => s.id === interstellar.activeFlagshipId) || interstellar.starships?.[0];
  const activeMecha = interstellar.mechas?.find(m => m.id === selectedMechaId) || interstellar.mechas?.[0];

  // Total Fleet Power Score
  const fleetPowerScore = (interstellar.mechas || []).reduce((acc, m) => acc + (m.isUnlocked ? m.powerRating * m.level : 0), 0)
    + (interstellar.fighters || []).reduce((acc, f) => acc + (f.isUnlocked ? f.atk * f.level : 0), 0)
    + (interstellar.starships || []).reduce((acc, s) => acc + (s.isUnlocked ? Math.floor((s.hullHp + s.shield) / 10 + s.cannonAtk) : 0), 0);

  // Current Cargo Count
  const currentCargoCount = (interstellar.cargo || []).reduce((acc, c) => acc + c.quantity, 0);

  // ===================== MECHA LOGIC =====================
  const handleCraftMecha = (mecha: Mecha) => {
    if (mecha.isUnlocked) return;

    // Check costs
    if (player.gold < mecha.cost.gold) {
      showToast(`金币不足！需要 ${mecha.cost.gold} 金币`, 'error');
      return;
    }
    if ((mecha.cost.spaceGold || 0) > interstellar.spaceGold) {
      showToast(`联邦星币不足！需要 ${mecha.cost.spaceGold} 星币`, 'error');
      return;
    }
    if ((mecha.cost.starCores || 0) > interstellar.starCores) {
      showToast(`星海源晶不足！需要 ${mecha.cost.starCores} 颗星海源晶`, 'error');
      return;
    }
    for (const [metalName, count] of Object.entries(mecha.cost.metals || {})) {
      if ((player.divineMetals?.[metalName] || 0) < count) {
        showToast(`神金【${metalName}】不足！需要 ${count} 个`, 'error');
        return;
      }
    }

    // Deduct and unlock
    SoundEngine.playForge();
    confetti({ particleCount: 40, spread: 60 });
    onUpdatePlayer(prev => {
      const metals = { ...(prev.divineMetals || {}) };
      for (const [metalName, count] of Object.entries(mecha.cost.metals || {})) {
        metals[metalName] = (metals[metalName] || 0) - count;
      }
      const updatedMechas = (prev.interstellar?.mechas || []).map(m => {
        if (m.id === mecha.id) {
          return { ...m, isUnlocked: true, isEquipped: true };
        }
        return m;
      });

      return {
        ...prev,
        gold: prev.gold - mecha.cost.gold,
        divineMetals: metals,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold - (mecha.cost.spaceGold || 0),
          starCores: prev.interstellar!.starCores - (mecha.cost.starCores || 0),
          mechas: updatedMechas
        }
      };
    });

    showToast(`🎉 成功研造并激活【${mecha.name}】！战力激增！`, 'success');
  };

  const handleUpgradeMecha = (mecha: Mecha) => {
    if (mecha.level >= 10) {
      showToast('该机甲已达最高强化10级！', 'info');
      return;
    }

    const costGold = mecha.upgradeCost.gold * mecha.level;
    const costSpaceGold = (mecha.upgradeCost.spaceGold || 50) * mecha.level;

    if (player.gold < costGold) {
      showToast(`金币不足！需要 ${costGold} 金币`, 'error');
      return;
    }
    if (interstellar.spaceGold < costSpaceGold) {
      showToast(`星币不足！需要 ${costSpaceGold} 星币`, 'error');
      return;
    }

    SoundEngine.playEnhanceSuccess();
    onUpdatePlayer(prev => {
      const updatedMechas = (prev.interstellar?.mechas || []).map(m => {
        if (m.id === mecha.id) {
          return { ...m, level: m.level + 1, powerRating: Math.floor(m.powerRating * 1.25) };
        }
        return m;
      });

      return {
        ...prev,
        gold: prev.gold - costGold,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold - costSpaceGold,
          mechas: updatedMechas
        }
      };
    });

    showToast(`⚡【${mecha.name}】强化至 Lv.${mecha.level + 1}！`, 'success');
  };

  const handleToggleEquipMecha = (mecha: Mecha) => {
    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const updatedMechas = (prev.interstellar?.mechas || []).map(m => {
        if (m.id === mecha.id) {
          return { ...m, isEquipped: !m.isEquipped };
        }
        return m;
      });
      return {
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          mechas: updatedMechas
        }
      };
    });
    showToast(mecha.isEquipped ? `机甲【${mecha.name}】已卸下出击槽` : `机甲【${mecha.name}】已登临主战机位！`, 'info');
  };

  const handleAssignPilot = (mechaId: string, companionId: string, companionName: string) => {
    SoundEngine.playClick();
    onUpdatePlayer(prev => {
      const updatedMechas = (prev.interstellar?.mechas || []).map(m => {
        if (m.id === mechaId) {
          return { ...m, pilotCompanionId: companionId, pilotName: companionName };
        }
        return m;
      });
      return {
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          mechas: updatedMechas
        }
      };
    });
    showToast(`机师【${companionName}】已就位！机甲同步率达100%！`, 'success');
  };

  // ===================== FIGHTERS & STARSHIPS =====================
  const handleCraftFighter = (fighter: FighterJet) => {
    if (fighter.isUnlocked) return;
    if (player.gold < fighter.cost.gold || interstellar.spaceGold < (fighter.cost.spaceGold || 0)) {
      showToast('金币或星币不足！', 'error');
      return;
    }

    SoundEngine.playForge();
    onUpdatePlayer(prev => {
      const updated = (prev.interstellar?.fighters || []).map(f => {
        if (f.id === fighter.id) return { ...f, isUnlocked: true, isInHangar: true };
        return f;
      });
      return {
        ...prev,
        gold: prev.gold - fighter.cost.gold,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold - (fighter.cost.spaceGold || 0),
          fighters: updated
        }
      };
    });
    showToast(`🚀 成功建造战机【${fighter.name}】并入列机库！`, 'success');
  };

  const handleCraftStarship = (ship: Starship) => {
    if (ship.isUnlocked) return;
    if (player.gold < ship.cost.gold || interstellar.spaceGold < (ship.cost.spaceGold || 0) || interstellar.starCores < (ship.cost.starCores || 0)) {
      showToast('造舰神材、金币或星海源晶不足！', 'error');
      return;
    }

    SoundEngine.playForge();
    confetti({ particleCount: 50, spread: 70 });
    onUpdatePlayer(prev => {
      const updated = (prev.interstellar?.starships || []).map(s => {
        if (s.id === ship.id) return { ...s, isUnlocked: true };
        return s;
      });
      return {
        ...prev,
        gold: prev.gold - ship.cost.gold,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold - (ship.cost.spaceGold || 0),
          starCores: prev.interstellar!.starCores - (ship.cost.starCores || 0),
          starships: updated
        }
      };
    });
    showToast(`🌟 巨舰启航！【${ship.name}】已建造完成入列母港！`, 'success');
  };

  const handleSetFlagship = (shipId: string) => {
    SoundEngine.playThrusterJet();
    onUpdatePlayer(prev => ({
      ...prev,
      interstellar: {
        ...prev.interstellar!,
        activeFlagshipId: shipId,
        starships: (prev.interstellar?.starships || []).map(s => ({
          ...s,
          isFlagship: s.id === shipId
        }))
      }
    }));
    showToast('旗舰指挥权已转移！全舰队以该舰为核心！', 'info');
  };

  // ===================== INTERSTELLAR TRADE & WARP =====================
  const handleWarpTravel = (targetPlanet: PlanetInfo) => {
    if (targetPlanet.id === interstellar.currentPlanetId) {
      showToast('舰队已在该星球轨道母港中！', 'info');
      return;
    }

    setIsWarping(true);
    SoundEngine.playWarpJump();

    setTimeout(() => {
      setIsWarping(false);
      onUpdatePlayer(prev => ({
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          currentPlanetId: targetPlanet.id
        }
      }));
      setSelectedPlanetId(targetPlanet.id);
      showToast(`🌌 跃迁完成！舰队已安全抵达【${targetPlanet.name}】外层空间！`, 'success');

      // Random trigger deep space exploration event (35% chance)
      if (Math.random() < 0.45) {
        const randomEvt = SPACE_EVENTS[Math.floor(Math.random() * SPACE_EVENTS.length)];
        setActiveSpaceEvent(randomEvt);
      }
    }, 1200);
  };

  const handleBuyCommodity = (goodId: string, price: number, name: string) => {
    const buyQty = Math.max(1, tradeAmount);
    const totalCost = price * buyQty;

    if (interstellar.spaceGold < totalCost) {
      showToast(`联邦星币不足！购买 ${buyQty} 份需要 ${totalCost} 星币`, 'error');
      return;
    }

    const availableSpace = interstellar.cargoCapacity - currentCargoCount;
    if (availableSpace < buyQty) {
      showToast(`货舱容积不足！剩余空间仅剩 ${availableSpace} 单位`, 'error');
      return;
    }

    SoundEngine.playTradeSuccess();
    onUpdatePlayer(prev => {
      const currentCargo = [...(prev.interstellar?.cargo || [])];
      const existingIdx = currentCargo.findIndex(c => c.goodId === goodId);

      if (existingIdx >= 0) {
        const prevItem = currentCargo[existingIdx];
        const newTotalQty = prevItem.quantity + buyQty;
        const newAvgPrice = Math.floor(
          (prevItem.buyAvgPrice * prevItem.quantity + totalCost) / newTotalQty
        );
        currentCargo[existingIdx] = {
          ...prevItem,
          quantity: newTotalQty,
          buyAvgPrice: newAvgPrice
        };
      } else {
        currentCargo.push({
          goodId,
          name,
          quantity: buyQty,
          buyAvgPrice: price
        });
      }

      return {
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold - totalCost,
          cargo: currentCargo
        }
      };
    });

    showToast(`📦 采购成功：购入【${name} x${buyQty}】，存入战舰货舱！`, 'success');
  };

  const handleSellCommodity = (goodId: string, currentMarketPrice: number, sellQtyAll: boolean = false) => {
    const item = interstellar.cargo?.find(c => c.goodId === goodId);
    if (!item || item.quantity <= 0) {
      showToast('货舱中暂无该货物！', 'warning');
      return;
    }

    const sellQty = sellQtyAll ? item.quantity : Math.min(item.quantity, Math.max(1, tradeAmount));
    const totalRevenue = currentMarketPrice * sellQty;
    const profit = totalRevenue - (item.buyAvgPrice * sellQty);

    SoundEngine.playTradeSuccess();
    onUpdatePlayer(prev => {
      let currentCargo = [...(prev.interstellar?.cargo || [])];
      if (sellQty >= item.quantity) {
        currentCargo = currentCargo.filter(c => c.goodId !== goodId);
      } else {
        currentCargo = currentCargo.map(c => {
          if (c.goodId === goodId) {
            return { ...c, quantity: c.quantity - sellQty };
          }
          return c;
        });
      }

      return {
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold + totalRevenue,
          totalTradeProfits: prev.interstellar!.totalTradeProfits + Math.max(0, profit),
          tradeHistoryCount: prev.interstellar!.tradeHistoryCount + 1,
          cargo: currentCargo
        }
      };
    });

    const profitMsg = profit >= 0 ? `盈利 +${profit} 星币` : `亏损 ${profit} 星币`;
    showToast(`💰 售出【${item.name} x${sellQty}】，获得 ${totalRevenue} 星币 (${profitMsg})！`, profit >= 0 ? 'success' : 'warning');
  };

  // Complete Planetary Mission
  const handleCompleteMission = (missionId: string, demandGoodId: string, demandCount: number, rewardGold: number, rewardCores: number, rewardMedals: number) => {
    const item = interstellar.cargo?.find(c => c.goodId === demandGoodId);
    if (!item || item.quantity < demandCount) {
      showToast(`货舱中所需货物不足！需要 ${demandCount} 份`, 'warning');
      return;
    }

    SoundEngine.playEnhanceSuccess();
    confetti({ particleCount: 35, spread: 50 });
    onUpdatePlayer(prev => {
      let currentCargo = [...(prev.interstellar?.cargo || [])];
      if (item.quantity === demandCount) {
        currentCargo = currentCargo.filter(c => c.goodId !== demandGoodId);
      } else {
        currentCargo = currentCargo.map(c => {
          if (c.goodId === demandGoodId) {
            return { ...c, quantity: c.quantity - demandCount };
          }
          return c;
        });
      }

      return {
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold + rewardGold,
          starCores: prev.interstellar!.starCores + rewardCores,
          defenseMedals: prev.interstellar!.defenseMedals + rewardMedals,
          cargo: currentCargo
        }
      };
    });

    showToast(`📜 贸易订单完成！斩获 ${rewardGold} 星币、${rewardCores} 颗星海源晶及 ${rewardMedals} 枚防卫勋章！`, 'success');
  };

  // Space event resolution
  const handleResolveSpaceEvent = (optionIdx: number) => {
    if (!activeSpaceEvent) return;
    const option = activeSpaceEvent.options[optionIdx];

    SoundEngine.playEnhanceSuccess();
    if (activeSpaceEvent.id === 'evt_asteroid_mine' && optionIdx === 0) {
      onUpdatePlayer(prev => ({
        ...prev,
        divineMetals: {
          ...(prev.divineMetals || {}),
          '百炼精金': (prev.divineMetals?.['百炼精金'] || 0) + 15,
          '灵锻秘银': (prev.divineMetals?.['灵锻秘银'] || 0) + 8
        },
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold + 1500
        }
      }));
    } else if (activeSpaceEvent.id === 'evt_distress_beacon' && optionIdx === 0) {
      onUpdatePlayer(prev => ({
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          spaceGold: prev.interstellar!.spaceGold + 3000,
          defenseMedals: prev.interstellar!.defenseMedals + 5
        }
      }));
    } else if (activeSpaceEvent.id === 'evt_wormhole_anomaly') {
      onUpdatePlayer(prev => ({
        ...prev,
        interstellar: {
          ...prev.interstellar!,
          starCores: prev.interstellar!.starCores + (optionIdx === 0 ? 5 : 2),
          spaceGold: prev.interstellar!.spaceGold + (optionIdx === 0 ? 1000 : 1200)
        }
      }));
    }

    showToast(option.rewardDesc, 'success');
    setActiveSpaceEvent(null);
  };

  // ===================== BLUE STAR DEFENSE & SPACE COMBAT =====================
  const handleUpgradeDefenseGrid = () => {
    const costGold = interstellar.defenseGridLevel * 20000;
    const costMedals = interstellar.defenseGridLevel * 5;

    if (player.gold < costGold || interstellar.defenseMedals < costMedals) {
      showToast(`强化所需金币 (${costGold}) 或星域防卫勋章 (${costMedals}) 不足！`, 'error');
      return;
    }

    SoundEngine.playEnhanceSuccess();
    onUpdatePlayer(prev => ({
      ...prev,
      gold: prev.gold - costGold,
      interstellar: {
        ...prev.interstellar!,
        defenseGridLevel: prev.interstellar!.defenseGridLevel + 1,
        defenseMedals: prev.interstellar!.defenseMedals - costMedals,
        maxDefenseShieldHp: prev.interstellar!.maxDefenseShieldHp + 30000,
        defenseShieldHp: prev.interstellar!.maxDefenseShieldHp + 30000
      }
    }));
    showToast(`🛡️ 蓝星轨道防空网络升至 Lv.${interstellar.defenseGridLevel + 1}！护盾上限大幅提升！`, 'success');
  };

  const handleStartSpaceBattle = (fleet: AlienInvasionFleet) => {
    SoundEngine.playInvasionAlert();
    setActiveInvasionEnemy(fleet);
    setInSpaceBattle(true);
    setBattleTurn(1);
    setBattleResult('ongoing');

    // Calculate player battle stats based on flagship and active mechas
    const flagshipHp = activeFlagship ? activeFlagship.hullHp * (1 + (activeFlagship.level - 1) * 0.2) : 20000;
    const flagshipShield = activeFlagship ? activeFlagship.shield * (1 + (activeFlagship.level - 1) * 0.2) : 10000;

    setPlayerShipCombatState({
      hp: Math.floor(flagshipHp),
      maxHp: Math.floor(flagshipHp),
      shield: Math.floor(flagshipShield),
      maxShield: Math.floor(flagshipShield),
      energy: 50,
      isShieldOverloaded: false
    });
    setEnemyCombatHp(fleet.fleetHp);
    setEnemyCombatShield(fleet.shieldHp);

    setBattleLogs([
      {
        id: 'log_0',
        text: `🚨 战报：【${fleet.name}】进入蓝星外层轨道！敌方指挥官【${fleet.commander}】下达歼灭指令！全舰进入特级战斗状态！`,
        type: 'critical',
        timestamp: Date.now()
      }
    ]);
  };

  // Space Battle Actions
  const handleSpaceCombatAction = (
    actionType: 'main_cannon' | 'mecha_swarm' | 'shield_overload' | 'warp_flank' | 'planet_buster'
  ) => {
    if (battleResult !== 'ongoing' || !activeInvasionEnemy) return;

    let pState = { ...playerShipCombatState };
    let eHp = enemyCombatHp;
    let eShield = enemyCombatShield;
    let newLogs: SpaceBattleLog[] = [];

    // 1. Player Action
    if (actionType === 'main_cannon') {
      SoundEngine.playLaserCannon();
      const baseDmg = (activeFlagship?.cannonAtk || 3000) * 1.8 + Math.floor(Math.random() * 2000);
      
      // Damage shield first
      if (eShield > 0) {
        if (eShield >= baseDmg) {
          eShield -= Math.floor(baseDmg);
        } else {
          const remain = baseDmg - eShield;
          eShield = 0;
          eHp -= Math.floor(remain);
        }
      } else {
        eHp -= Math.floor(baseDmg);
      }

      pState.energy = Math.min(100, pState.energy + 20);
      newLogs.push({
        id: `log_${Date.now()}_1`,
        text: `💥 旗舰主炮【${activeFlagship?.mainWeaponName || '阳电子光束'}】全功率齐射！贯穿敌舰，造成 ${Math.floor(baseDmg)} 点重度能量爆轰伤害！`,
        type: 'player',
        timestamp: Date.now()
      });
    } else if (actionType === 'mecha_swarm') {
      SoundEngine.playThrusterJet();
      // Mecha bypasses 50% shield
      const mechaDmg = (activeMecha?.atkBonus || 2000) * 3.5 + (interstellar.fighters?.[0]?.atk || 800) * 2;
      const shieldDmg = mechaDmg * 0.4;
      const hullDmg = mechaDmg * 0.6;

      eShield = Math.max(0, eShield - Math.floor(shieldDmg));
      eHp = Math.max(0, eHp - Math.floor(hullDmg));
      pState.energy = Math.min(100, pState.energy + 25);

      newLogs.push({
        id: `log_${Date.now()}_1`,
        text: `🤖 机甲突袭！【${activeMecha?.name || '暴风守护者'}】率领星际战机群进行超音速贴舰突防，绕开护盾直袭反应堆！造成 ${Math.floor(mechaDmg)} 点穿甲撕裂伤害！`,
        type: 'player',
        timestamp: Date.now()
      });
    } else if (actionType === 'shield_overload') {
      SoundEngine.playShieldPulse();
      pState.isShieldOverloaded = true;
      pState.shield = Math.min(pState.maxShield, pState.shield + Math.floor(pState.maxShield * 0.45));
      pState.energy = Math.max(0, pState.energy - 15);

      newLogs.push({
        id: `log_${Date.now()}_1`,
        text: `🛡️ 相位能量护盾超载启动！全舰展开光子偏转力场，充能恢复 ${Math.floor(pState.maxShield * 0.45)} 点护盾值！`,
        type: 'heal',
        timestamp: Date.now()
      });
    } else if (actionType === 'warp_flank') {
      SoundEngine.playWarpJump();
      const flankDmg = (activeFlagship?.cannonAtk || 3000) * 2.8;
      eHp = Math.max(0, eHp - Math.floor(flankDmg));
      pState.energy = Math.min(100, pState.energy + 15);

      newLogs.push({
        id: `log_${Date.now()}_1`,
        text: `⚡ 战术微距空间跳跃！我方战舰瞬移至敌方旗舰盲区进行贴脸轰炸！重创敌舰核心，造成 ${Math.floor(flankDmg)} 点致命背刺！`,
        type: 'critical',
        timestamp: Date.now()
      });
    } else if (actionType === 'planet_buster') {
      if (pState.energy < 100) {
        showToast('歼星主炮能量未充满 (需要100能量)！', 'warning');
        return;
      }
      SoundEngine.playLaserCannon();
      const busterDmg = (activeFlagship?.cannonAtk || 5000) * 8.5 + (activeMecha?.powerRating || 1000) * 6;
      eShield = 0;
      eHp = Math.max(0, eHp - Math.floor(busterDmg));
      pState.energy = 0;

      newLogs.push({
        id: `log_${Date.now()}_1`,
        text: `🌌 终极弑神·歼星主炮全功率开火！！！九彩湮灭光束贯穿星海，瞬间蒸发敌舰护盾并撕裂舰体！造成 ${Math.floor(busterDmg)} 点行星级毁灭打击！`,
        type: 'critical',
        timestamp: Date.now()
      });
    }

    // Check Victory
    if (eHp <= 0) {
      eHp = 0;
      setEnemyCombatHp(0);
      setEnemyCombatShield(0);
      setBattleResult('victory');
      SoundEngine.playEnhanceSuccess();
      confetti({ particleCount: 80, spread: 90 });

      newLogs.push({
        id: `log_${Date.now()}_vic`,
        text: `🏆 决战大捷！敌方【${activeInvasionEnemy.name}】被我方舰队全歼于蓝星轨道之外！蓝星防线安然无恙！`,
        type: 'critical',
        timestamp: Date.now()
      });

      // Grant victory rewards
      const rewards = activeInvasionEnemy.rewards;
      onUpdatePlayer(prev => {
        const metals = { ...(prev.divineMetals || {}) };
        for (const [mName, cnt] of Object.entries(rewards.divineMetals || {})) {
          metals[mName] = (metals[mName] || 0) + cnt;
        }

        return {
          ...prev,
          divineMetals: metals,
          interstellar: {
            ...prev.interstellar!,
            spaceGold: prev.interstellar!.spaceGold + rewards.spaceGold,
            starCores: prev.interstellar!.starCores + rewards.starCores,
            defenseMedals: prev.interstellar!.defenseMedals + rewards.defenseMedals,
            repelledInvasionsCount: prev.interstellar!.repelledInvasionsCount + 1,
            planetaryPeaceRating: Math.min(100, prev.interstellar!.planetaryPeaceRating + 10)
          }
        };
      });

      setBattleLogs(prev => [...newLogs, ...prev]);
      return;
    }

    // 2. Enemy Counter Attack
    const enemySkill = activeInvasionEnemy.specialSkills[
      Math.floor(Math.random() * activeInvasionEnemy.specialSkills.length)
    ];
    let incomingDmg = enemySkill ? enemySkill.dmg : activeInvasionEnemy.fleetAtk;

    if (pState.isShieldOverloaded) {
      incomingDmg = Math.floor(incomingDmg * 0.35); // 65% reduction
      pState.isShieldOverloaded = false;
    }

    if (pState.shield > 0) {
      if (pState.shield >= incomingDmg) {
        pState.shield -= incomingDmg;
      } else {
        const leak = incomingDmg - pState.shield;
        pState.shield = 0;
        pState.hp = Math.max(0, pState.hp - leak);
      }
    } else {
      pState.hp = Math.max(0, pState.hp - incomingDmg);
    }

    newLogs.push({
      id: `log_${Date.now()}_enemy`,
      text: `⚠️ 敌舰反击！【${activeInvasionEnemy.commander}】发动【${enemySkill?.name || '主炮齐射'}】，对我方舰队造成 ${incomingDmg} 点穿透伤害！`,
      type: 'enemy',
      timestamp: Date.now()
    });

    // Check Defeat
    if (pState.hp <= 0) {
      pState.hp = 0;
      setBattleResult('defeat');
      newLogs.push({
        id: `log_${Date.now()}_loss`,
        text: `💥 我方旗舰装甲破裂过载！紧急启动应急逃生折跃舱脱离战场...`,
        type: 'critical',
        timestamp: Date.now()
      });
    }

    setPlayerShipCombatState(pState);
    setEnemyCombatHp(eHp);
    setEnemyCombatShield(eShield);
    setBattleTurn(prev => prev + 1);
    setBattleLogs(prev => [...newLogs, ...prev]);
  };

  // ================= EXPEDITION HANDLERS & HELPERS =================
  const activeExpeditions: ActiveTradeExpedition[] = interstellar.activeExpeditions || [];
  const readyExpeditionsCount = activeExpeditions.filter(e => !e.isClaimed && now >= e.endTime).length;
  const inFlightExpeditionsCount = activeExpeditions.filter(e => !e.isClaimed && now < e.endTime).length;
  const dispatchedShipIdSet = new Set(activeExpeditions.filter(e => !e.isClaimed).map(e => e.assignedShipId));

  const unlockedShips = (interstellar.starships || []).filter(s => s.isUnlocked);
  const availableShipsForExpedition = unlockedShips.filter(s => !dispatchedShipIdSet.has(s.id));

  const handleOpenDispatch = (dest: ExpeditionDestination) => {
    setSelectedExpeditionDest(dest);
    if (availableShipsForExpedition.length > 0) {
      setSelectedDispatchShipId(availableShipsForExpedition[0].id);
    } else {
      setSelectedDispatchShipId('');
    }
  };

  const handleDispatchExpedition = (dest: ExpeditionDestination, shipId: string) => {
    if (!shipId) {
      showToast('请选择委派执行该远征任务的可用战舰！', 'warning');
      return;
    }
    const ship = unlockedShips.find(s => s.id === shipId);
    if (!ship) {
      showToast('所选战舰未解锁或不存在！', 'error');
      return;
    }
    if (dispatchedShipIdSet.has(ship.id)) {
      showToast(`战舰【${ship.name}】正在执行其他远征任务中，无法重复派遣！`, 'warning');
      return;
    }

    const shipPower = Math.floor(ship.hullHp / 10 + ship.cannonAtk * 1.2);
    if (fleetPowerScore < dest.requiredFleetPower) {
      showToast(`总舰队战力不足！该远征路线要求综合战力达到 ${dest.requiredFleetPower.toLocaleString()}`, 'warning');
      return;
    }

    let actualDuration = dest.durationSeconds;
    if (ship.className === '巡洋舰' || ship.className === '护卫舰') {
      actualDuration = Math.max(15, Math.floor(actualDuration * 0.85));
    }

    const newExp: ActiveTradeExpedition = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      destinationId: dest.id,
      destinationName: dest.name,
      targetPlanetName: dest.targetPlanetName,
      assignedShipId: ship.id,
      assignedShipName: ship.name,
      assignedShipClass: ship.className,
      powerScore: shipPower,
      startTime: Date.now(),
      durationSeconds: actualDuration,
      endTime: Date.now() + actualDuration * 1000,
      isClaimed: false,
      rewards: {
        spaceGold: dest.rewards.spaceGold,
        starCores: dest.rewards.starCores,
        defenseMedals: dest.rewards.defenseMedals,
        divineMetals: { ...dest.rewards.divineMetals },
        specialGoodName: dest.rewards.specialGoodName
      }
    };

    onUpdatePlayer(prev => {
      const currentInterstellar = prev.interstellar || createDefaultInterstellarState();
      return {
        ...prev,
        interstellar: {
          ...currentInterstellar,
          activeExpeditions: [...(currentInterstellar.activeExpeditions || []), newExp]
        }
      };
    });

    SoundEngine.playBreakthrough();
    showToast(`🚀 战舰【${ship.name}】已成功启航前往【${dest.name}】执行自动贸易远征！`, 'success');
    setSelectedExpeditionDest(null);
  };

  const handleClaimExpedition = (expId: string) => {
    const targetExp = activeExpeditions.find(e => e.id === expId);
    if (!targetExp) return;

    if (now < targetExp.endTime) {
      showToast('该远征舰队仍在航行中，尚未抵达目标星系！', 'warning');
      return;
    }

    const mineralSummary = Object.entries(targetExp.rewards.divineMetals)
      .map(([metal, count]) => `${metal} x${count}`)
      .join('、');

    onUpdatePlayer(prev => {
      const currentInterstellar = prev.interstellar || createDefaultInterstellarState();
      const nextDivineMetals = { ...(prev.divineMetals || {}) };

      Object.entries(targetExp.rewards.divineMetals).forEach(([metal, count]) => {
        nextDivineMetals[metal] = (nextDivineMetals[metal] || 0) + count;
      });

      return {
        ...prev,
        divineMetals: nextDivineMetals,
        interstellar: {
          ...currentInterstellar,
          spaceGold: (currentInterstellar.spaceGold || 0) + targetExp.rewards.spaceGold,
          starCores: (currentInterstellar.starCores || 0) + targetExp.rewards.starCores,
          defenseMedals: (currentInterstellar.defenseMedals || 0) + targetExp.rewards.defenseMedals,
          completedExpeditionsCount: (currentInterstellar.completedExpeditionsCount || 0) + 1,
          activeExpeditions: (currentInterstellar.activeExpeditions || []).filter(e => e.id !== expId)
        }
      };
    });

    SoundEngine.playVictory();
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    showToast(
      `🎉 战舰【${targetExp.assignedShipName}】远征凯旋！获得 ${targetExp.rewards.spaceGold} 星币、${targetExp.rewards.starCores} 星核及稀有矿产：${mineralSummary}！`,
      'success'
    );
  };

  const handleSpeedUpExpedition = (expId: string) => {
    const targetExp = activeExpeditions.find(e => e.id === expId);
    if (!targetExp || now >= targetExp.endTime) return;

    const speedUpCost = 60;
    if ((interstellar.spaceGold || 0) < speedUpCost) {
      showToast(`空间跃迁充能需要消耗 ${speedUpCost} 星币，当前星币不足！`, 'warning');
      return;
    }

    onUpdatePlayer(prev => {
      const currentInterstellar = prev.interstellar || createDefaultInterstellarState();
      return {
        ...prev,
        interstellar: {
          ...currentInterstellar,
          spaceGold: Math.max(0, (currentInterstellar.spaceGold || 0) - speedUpCost),
          activeExpeditions: (currentInterstellar.activeExpeditions || []).map(e => {
            if (e.id === expId) {
              return { ...e, endTime: Date.now() - 1000 };
            }
            return e;
          })
        }
      };
    });

    SoundEngine.playThunder();
    showToast(`⚡ 虫洞跃迁加速成功！战舰【${targetExp.assignedShipName}】已瞬间抵达目标星系完成开采！`, 'success');
  };

  const handleCancelExpedition = (expId: string) => {
    const targetExp = activeExpeditions.find(e => e.id === expId);
    if (!targetExp) return;

    onUpdatePlayer(prev => {
      const currentInterstellar = prev.interstellar || createDefaultInterstellarState();
      return {
        ...prev,
        interstellar: {
          ...currentInterstellar,
          activeExpeditions: (currentInterstellar.activeExpeditions || []).filter(e => e.id !== expId)
        }
      };
    });

    SoundEngine.playClick();
    showToast(`已召回战舰【${targetExp.assignedShipName}】，本次远征任务已终止。`, 'info');
  };

  const handleBatchClaimAll = () => {
    const claimableExpeditions = activeExpeditions.filter(e => !e.isClaimed && now >= e.endTime);
    if (claimableExpeditions.length === 0) {
      showToast('当前暂无可领取的远征收益！', 'info');
      return;
    }

    let totalGold = 0;
    let totalCores = 0;
    let totalMedals = 0;
    const totalMetals: Record<string, number> = {};

    claimableExpeditions.forEach(exp => {
      totalGold += exp.rewards.spaceGold;
      totalCores += exp.rewards.starCores;
      totalMedals += exp.rewards.defenseMedals;
      Object.entries(exp.rewards.divineMetals).forEach(([metal, count]) => {
        totalMetals[metal] = (totalMetals[metal] || 0) + count;
      });
    });

    const mineralSummary = Object.entries(totalMetals)
      .map(([metal, count]) => `${metal} x${count}`)
      .join('、');

    onUpdatePlayer(prev => {
      const currentInterstellar = prev.interstellar || createDefaultInterstellarState();
      const nextDivineMetals = { ...(prev.divineMetals || {}) };

      Object.entries(totalMetals).forEach(([metal, count]) => {
        nextDivineMetals[metal] = (nextDivineMetals[metal] || 0) + count;
      });

      const claimableIds = new Set(claimableExpeditions.map(e => e.id));

      return {
        ...prev,
        divineMetals: nextDivineMetals,
        interstellar: {
          ...currentInterstellar,
          spaceGold: (currentInterstellar.spaceGold || 0) + totalGold,
          starCores: (currentInterstellar.starCores || 0) + totalCores,
          defenseMedals: (currentInterstellar.defenseMedals || 0) + totalMedals,
          completedExpeditionsCount: (currentInterstellar.completedExpeditionsCount || 0) + claimableExpeditions.length,
          activeExpeditions: (currentInterstellar.activeExpeditions || []).filter(e => !claimableIds.has(e.id))
        }
      };
    });

    SoundEngine.playVictory();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    showToast(
      `🎉 一键领取成功！总计获得 ${totalGold} 星币、${totalCores} 星核、${totalMedals} 勋章及稀有神金：${mineralSummary}！`,
      'success'
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-5 space-y-5 animate-in fade-in duration-300">
      
      {/* ================= HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/80 to-blue-950/90 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Rocket className="w-72 h-72 text-cyan-400" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tracking-wide uppercase flex items-center gap-1">
                <Rocket className="w-3 h-3 text-cyan-400 animate-pulse" />
                星海纪元 · 宇宙舰队母港
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                当前停泊：{currentPlanet.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-200">
              星际机甲战舰与行星商贸要塞
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              研造白黄紫黑红五级机甲与歼星战舰，驾驶超音速战机穿梭星海，开辟龙马双子星与森罗精灵贸易航线；当深红之域与外星异魔威胁蓝星时，亲率舰队打响星际保卫决战！
            </p>
          </div>

          {/* Interstellar Currencies Dashboard */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/60 shadow-inner">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60">
              <Coins className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium leading-none">联邦星币</div>
                <div className="text-xs font-black text-cyan-300">{(interstellar.spaceGold || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/60">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium leading-none">星海源晶</div>
                <div className="text-xs font-black text-purple-300">{interstellar.starCores || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60">
              <Award className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium leading-none">防卫勋章</div>
                <div className="text-xs font-black text-amber-300">{interstellar.defenseMedals || 0}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium leading-none">舰队战力</div>
                <div className="text-xs font-black text-emerald-300">{fleetPowerScore.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 flex-wrap">
          <button
            onClick={() => { SoundEngine.playClick(); setMainTab('hangar'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              mainTab === 'hangar'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>机甲与战舰工坊</span>
          </button>

          <button
            onClick={() => { SoundEngine.playClick(); setMainTab('trade'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              mainTab === 'trade'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-purple-300" />
            <span>星际航行与行星商贸</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/30 text-purple-200">
              {currentCargoCount}/{interstellar.cargoCapacity} 货舱
            </span>
          </button>

          <button
            onClick={() => { SoundEngine.playClick(); setMainTab('defense'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              mainTab === 'defense'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>保卫蓝星 · 外星决战前线</span>
            {interstellar.planetaryPeaceRating < 100 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => { SoundEngine.playClick(); setMainTab('expedition'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
              mainTab === 'expedition'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/60 border border-amber-500/30'
            }`}
          >
            <Compass className={`w-4 h-4 ${mainTab === 'expedition' ? 'text-slate-950' : 'text-amber-400 animate-spin-slow'}`} />
            <span>星际贸易远征</span>
            {readyExpeditionsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-400 text-slate-950 font-black animate-bounce shadow-sm flex items-center gap-0.5">
                <Gift className="w-3 h-3" />
                {readyExpeditionsCount} 待领收益
              </span>
            ) : inFlightExpeditionsCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/30 text-amber-200 font-mono">
                {inFlightExpeditionsCount} 远征中
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300">
                稀有矿产
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= TAB 1: MECHA & STARSHIP HANGAR ================= */}
      {mainTab === 'hangar' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Sub Tab Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={() => { SoundEngine.playClick(); setHangarSubTab('mechas'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  hangarSubTab === 'mechas'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>机甲研造所 ({(interstellar.mechas || []).filter(m => m.isUnlocked).length}/{interstellar.mechas?.length || 5})</span>
              </button>

              <button
                onClick={() => { SoundEngine.playClick(); setHangarSubTab('fighters'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  hangarSubTab === 'fighters'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>空天战机编制</span>
              </button>

              <button
                onClick={() => { SoundEngine.playClick(); setHangarSubTab('starships'); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  hangarSubTab === 'starships'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>星际母舰与主力舰队</span>
              </button>
            </div>

            {/* Quick exchange resource tip */}
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>当前主舰：<strong className="text-cyan-300">{activeFlagship?.name}</strong></span>
              <span>主战机甲：<strong className="text-amber-300">{activeMecha?.name}</strong></span>
            </div>
          </div>

          {/* MECHAS SUB-TAB */}
          {hangarSubTab === 'mechas' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Mechas List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(interstellar.mechas || []).map((mecha) => {
                    const isSelected = mecha.id === selectedMechaId;
                    const gradeColors = {
                      white: 'border-slate-600 bg-slate-900/80 text-slate-200',
                      yellow: 'border-amber-600/70 bg-amber-950/20 text-amber-300',
                      purple: 'border-purple-600/70 bg-purple-950/20 text-purple-300',
                      black: 'border-slate-800 bg-black text-rose-400',
                      red: 'border-red-600/80 bg-red-950/30 text-red-300'
                    };

                    return (
                      <div
                        key={mecha.id}
                        onClick={() => { SoundEngine.playClick(); setSelectedMechaId(mecha.id); }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20 ' + gradeColors[mecha.grade]
                            : 'hover:border-slate-600 ' + gradeColors[mecha.grade]
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs px-2 py-0.5 rounded font-black ${
                                mecha.grade === 'red' ? 'bg-red-500/30 text-red-200 border border-red-500/50' :
                                mecha.grade === 'black' ? 'bg-slate-800 text-yellow-400 border border-yellow-500/30' :
                                mecha.grade === 'purple' ? 'bg-purple-500/30 text-purple-200' :
                                mecha.grade === 'yellow' ? 'bg-yellow-500/30 text-yellow-200' : 'bg-slate-700 text-slate-200'
                              }`}>
                                {mecha.gradeName}
                              </span>
                              <span className="text-xs font-bold text-slate-300">{mecha.typeName}</span>
                            </div>
                            <h3 className="font-black text-base text-white">{mecha.name}</h3>
                          </div>

                          <div className="text-right">
                            {mecha.isUnlocked ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> 已列装 Lv.{mecha.level}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                待研造
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{mecha.description}</p>

                        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-slate-800/80 text-[10px]">
                          <div>战力评分: <strong className="text-cyan-300">{mecha.powerRating * mecha.level}</strong></div>
                          <div>生命加成: <strong className="text-emerald-300">+{mecha.hpBonus * mecha.level}</strong></div>
                          <div>攻击加成: <strong className="text-rose-300">+{mecha.atkBonus * mecha.level}</strong></div>
                        </div>

                        {mecha.isEquipped && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-bl-lg">
                            主战机甲
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Mecha Detail Panel */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                {activeMecha && (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">机甲工程档案</span>
                        <h3 className="text-lg font-black text-white">{activeMecha.name}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {activeMecha.isUnlocked ? `等级 Lv.${activeMecha.level}/10` : '未激活'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">机体类型</span>
                        <span className="font-semibold text-slate-200">{activeMecha.typeName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">生命值增幅</span>
                        <span className="font-bold text-emerald-400">+{activeMecha.hpBonus * activeMecha.level}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">攻击力增幅</span>
                        <span className="font-bold text-rose-400">+{activeMecha.atkBonus * activeMecha.level}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">防御力增幅</span>
                        <span className="font-bold text-blue-400">+{activeMecha.defBonus * activeMecha.level}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">机动航速增幅</span>
                        <span className="font-bold text-cyan-400">+{activeMecha.speedBonus * activeMecha.level}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">暴击率加成</span>
                        <span className="font-bold text-amber-400">+{activeMecha.critBonus}%</span>
                      </div>
                    </div>

                    {/* Skill Info */}
                    <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>专属绝技：{activeMecha.specialSkill.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {activeMecha.specialSkill.desc}
                      </p>
                    </div>

                    {/* Modules installed */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400 font-semibold">机甲改装模块：</span>
                      <div className="grid grid-cols-1 gap-1 text-[11px]">
                        <div className="px-2 py-1 rounded bg-slate-950 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">武器模块</span>
                          <span className="text-cyan-300 font-medium">{activeMecha.modules.weapon}</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-slate-950 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">装甲模块</span>
                          <span className="text-indigo-300 font-medium">{activeMecha.modules.armor}</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-slate-950 border border-slate-800 flex justify-between">
                          <span className="text-slate-400">推进模块</span>
                          <span className="text-amber-300 font-medium">{activeMecha.modules.thruster}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pilot Assignment */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-semibold">协同驾驶员：</span>
                        <span className="text-xs font-bold text-cyan-300">{activeMecha.pilotName || '未指派'}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {(player.douluo4Companions || []).filter(c => c.isRecruited).map(comp => (
                          <button
                            key={comp.id}
                            onClick={() => handleAssignPilot(activeMecha.id, comp.id, comp.name)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              activeMecha.pilotCompanionId === comp.id
                                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {comp.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 space-y-2">
                      {!activeMecha.isUnlocked ? (
                        <div className="space-y-2">
                          <div className="text-[10px] text-slate-400 space-y-0.5 bg-slate-950 p-2 rounded border border-slate-800">
                            <div>所需金币: {activeMecha.cost.gold}</div>
                            {activeMecha.cost.spaceGold && <div>所需星币: {activeMecha.cost.spaceGold}</div>}
                            {activeMecha.cost.starCores && <div>所需源晶: {activeMecha.cost.starCores} 颗</div>}
                            {Object.entries(activeMecha.cost.metals || {}).map(([mName, cnt]) => (
                              <div key={mName}>所需神金: {mName} x{cnt} (拥有: {player.divineMetals?.[mName] || 0})</div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleCraftMecha(activeMecha)}
                            className="w-full py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Hammer className="w-3.5 h-3.5" />
                            <span>研造此机甲</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleUpgradeMecha(activeMecha)}
                            disabled={activeMecha.level >= 10}
                            className="py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50"
                          >
                            强化机甲 (Lv.{activeMecha.level})
                          </button>
                          <button
                            onClick={() => handleToggleEquipMecha(activeMecha)}
                            className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                              activeMecha.isEquipped
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                            }`}
                          >
                            {activeMecha.isEquipped ? '卸下出击槽' : '设为主战机甲'}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* FIGHTERS SUB-TAB */}
          {hangarSubTab === 'fighters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(interstellar.fighters || []).map(fighter => (
                <div
                  key={fighter.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                        {fighter.gradeName}
                      </span>
                      <h4 className="font-black text-base text-white mt-1">{fighter.name}</h4>
                      <span className="text-xs text-slate-400">{fighter.typeName}</span>
                    </div>
                    <Plane className="w-6 h-6 text-sky-400/60" />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{fighter.description}</p>

                  <div className="space-y-1 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">火力攻击</span>
                      <span className="font-bold text-rose-400">+{fighter.atk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">空速机动</span>
                      <span className="font-bold text-cyan-400">+{fighter.speed} 马赫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">护盾偏转</span>
                      <span className="font-bold text-blue-400">+{fighter.shield}</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800">
                      <span className="text-slate-400">搭载特装武器</span>
                      <span className="text-amber-300 font-medium">{fighter.specialWeapon}</span>
                    </div>
                  </div>

                  {fighter.isUnlocked ? (
                    <div className="py-2 text-center rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已列装航母机库
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCraftFighter(fighter)}
                      className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Hammer className="w-3 h-3" />
                      <span>研制战机 ({fighter.cost.gold}金币 / {fighter.cost.spaceGold}星币)</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STARSHIPS SUB-TAB */}
          {hangarSubTab === 'starships' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(interstellar.starships || []).map(ship => {
                const isCurrentFlagship = ship.id === interstellar.activeFlagshipId;
                return (
                  <div
                    key={ship.id}
                    className={`bg-slate-900/90 rounded-xl p-5 border transition-all space-y-3 relative overflow-hidden ${
                      isCurrentFlagship
                        ? 'border-indigo-400 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {ship.className}
                        </span>
                        <h4 className="font-black text-lg text-white mt-1">{ship.name}</h4>
                      </div>
                      <Rocket className={`w-7 h-7 ${isCurrentFlagship ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-slate-400 text-[10px]">舰体装甲 (HP)</div>
                        <div className="font-bold text-emerald-400">{ship.hullHp.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">相位护盾</div>
                        <div className="font-bold text-blue-400">{ship.shield.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">主炮齐射火力</div>
                        <div className="font-bold text-rose-400">{ship.cannonAtk.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px]">货舱容量</div>
                        <div className="font-bold text-purple-400">{ship.cargoCapacity} 单位</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-800/30">
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>旗舰主炮：{ship.mainWeaponName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{ship.mainWeaponDesc}</p>
                    </div>

                    {ship.isUnlocked ? (
                      <div className="flex gap-2 pt-1">
                        {isCurrentFlagship ? (
                          <div className="w-full py-2 rounded-lg text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-center flex items-center justify-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>当前舰队统帅总旗舰</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSetFlagship(ship.id)}
                            className="w-full py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 transition-all shadow-md"
                          >
                            设为舰队旗舰
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCraftStarship(ship)}
                        className="w-full py-2.5 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 hover:from-amber-400 hover:to-yellow-500 shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Hammer className="w-3.5 h-3.5" />
                        <span>建造此战舰 ({ship.cost.gold.toLocaleString()}金币 / {ship.cost.spaceGold}星币)</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: INTERSTELLAR TRADE & PLANETS ================= */}
      {mainTab === 'trade' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Galaxy Map Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-base text-white">星系星图 · 跃迁航线选择</h3>
              </div>
              <span className="text-xs text-slate-400">
                当前停靠：<strong className="text-cyan-300">{currentPlanet.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {PLANETS_DATA.map(planet => {
                const isCurrent = planet.id === interstellar.currentPlanetId;
                const isSelected = planet.id === selectedPlanetId;
                return (
                  <button
                    key={planet.id}
                    onClick={() => {
                      SoundEngine.playClick();
                      setSelectedPlanetId(planet.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-500/50'
                        : isSelected
                        ? 'border-indigo-400 bg-indigo-950/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">{planet.affiliation.split('/')[0]}</div>
                    <div className="font-black text-sm text-white truncate mt-0.5">{planet.name}</div>
                    <div className="text-[10px] text-indigo-300 mt-1">
                      {planet.id === 'bluestar' ? '母星基地' : `${planet.distanceLightYears} 光年`}
                    </div>

                    {isCurrent && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Planet Brief & Warp Jump Button */}
            {inspectingPlanet && inspectingPlanet.id !== interstellar.currentPlanetId && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 mt-2">
                <div className="space-y-0.5 text-left w-full sm:w-auto">
                  <div className="text-xs font-bold text-indigo-300">{inspectingPlanet.name} · {inspectingPlanet.title}</div>
                  <div className="text-[11px] text-slate-400">{inspectingPlanet.description}</div>
                </div>
                <button
                  onClick={() => handleWarpTravel(inspectingPlanet)}
                  disabled={isWarping}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5 animate-spin" />
                  <span>{isWarping ? '超空间折跃中...' : `曲率折跃前往此星球`}</span>
                </button>
              </div>
            )}
          </div>

          {/* Current Planet Trading Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Left 2 Cols: Commodity Market */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase">实时大宗行情</span>
                    <h3 className="text-lg font-black text-white">【{currentPlanet.name}】星际交易所</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">单次交易量：</span>
                    <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-0.5">
                      {[1, 5, 10, 20].map(qty => (
                        <button
                          key={qty}
                          onClick={() => setTradeAmount(qty)}
                          className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                            tradeAmount === qty ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          x{qty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentPlanet.tradeGoods.map(good => {
                    const cargoHolding = interstellar.cargo?.find(c => c.goodId === good.goodId);
                    const trendIcons = {
                      surging: <TrendingUp className="w-3.5 h-3.5 text-rose-400 animate-pulse" />,
                      rising: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
                      stable: <RefreshCw className="w-3.5 h-3.5 text-slate-400" />,
                      falling: <TrendingDown className="w-3.5 h-3.5 text-amber-400" />,
                      crashing: <TrendingDown className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                    };
                    const trendLabels = {
                      surging: '🔥 暴涨特需',
                      rising: '📈 走高',
                      stable: '⚖️ 行情平稳',
                      falling: '📉 走低',
                      crashing: '💥 跌停低价'
                    };

                    return (
                      <div
                        key={good.goodId}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                              {good.categoryName}
                            </span>
                            <h4 className="font-black text-sm text-white mt-1">{good.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-black text-cyan-300">{good.currentPrice} 星币</div>
                            <div className="text-[10px] flex items-center justify-end gap-1 text-slate-400">
                              {trendIcons[good.trend]}
                              <span>{trendLabels[good.trend]}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{good.description}</p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                          <span>持有: <strong className="text-purple-300">{cargoHolding?.quantity || 0}</strong></span>
                          <span>市场库存: <strong className="text-slate-200">{good.stock}</strong></span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleBuyCommodity(good.goodId, good.currentPrice, good.name)}
                            className="py-1.5 rounded-lg text-xs font-bold bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 hover:bg-cyan-500/40 transition-all"
                          >
                            采购 ({good.currentPrice * tradeAmount}星币)
                          </button>
                          <button
                            onClick={() => handleSellCommodity(good.goodId, good.currentPrice)}
                            disabled={!cargoHolding || cargoHolding.quantity <= 0}
                            className="py-1.5 rounded-lg text-xs font-bold bg-emerald-600/30 text-emerald-200 border border-emerald-500/50 hover:bg-emerald-500/40 transition-all disabled:opacity-40"
                          >
                            售出
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Planetary Missions */}
              {currentPlanet.exclusiveMissions && currentPlanet.exclusiveMissions.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <h3 className="font-black text-sm text-white">行星官方贸易悬赏订单</h3>
                  </div>
                  {currentPlanet.exclusiveMissions.map(m => {
                    const holding = interstellar.cargo?.find(c => c.goodId === m.demandGoodId);
                    const hasEnough = (holding?.quantity || 0) >= m.demandCount;
                    return (
                      <div
                        key={m.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-slate-200">{m.title}</h5>
                          <div className="text-[11px] text-slate-400">
                            交付目标：需提交 {m.demandCount} 份特产 (当前持有: {holding?.quantity || 0})
                          </div>
                          <div className="text-[10px] text-amber-300 flex items-center gap-2">
                            <span>奖励: +{m.rewardSpaceGold} 星币</span>
                            <span>+{m.rewardStarCores} 源晶</span>
                            <span>+{m.rewardMedals} 防卫勋章</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCompleteMission(m.id, m.demandGoodId, m.demandCount, m.rewardSpaceGold, m.rewardStarCores, m.rewardMedals)}
                          disabled={!hasEnough}
                          className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:opacity-90 disabled:opacity-40 transition-all shrink-0"
                        >
                          交付订单
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Col: Fleet Cargo Hold & Profit Statistics */}
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Box className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-black text-base text-white">战舰货舱清单</h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    <strong className="text-cyan-300">{currentCargoCount}</strong> / {interstellar.cargoCapacity}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (currentCargoCount / interstellar.cargoCapacity) * 100)}%` }}
                  />
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {(interstellar.cargo || []).length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      货舱空空如也，在交易所采购特产装载！
                    </div>
                  ) : (
                    (interstellar.cargo || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-200">{item.name}</div>
                          <div className="text-[10px] text-slate-400">
                            数量: {item.quantity} 份 · 买入均价: {item.buyAvgPrice} 星币
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Find current planet market price
                            const marketPrice = currentPlanet.tradeGoods.find(g => g.goodId === item.goodId)?.currentPrice || item.buyAvgPrice;
                            handleSellCommodity(item.goodId, marketPrice, true);
                          }}
                          className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold hover:bg-rose-500/30"
                        >
                          全部售出
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">累计星际贸易轮次</span>
                    <span className="font-bold text-slate-200">{interstellar.tradeHistoryCount || 0} 次</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">累计赚取贸易净利</span>
                    <span className="font-black text-emerald-400">+{(interstellar.totalTradeProfits || 0).toLocaleString()} 星币</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BLUE STAR DEFENSE & SPACE COMBAT ================= */}
      {mainTab === 'defense' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* Defense Header Status */}
          <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/30 text-rose-200 border border-rose-500/50 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />
                    蓝星防卫要塞防御司令部
                  </span>
                  <span className="text-xs text-slate-300">
                    防卫等级：Lv.{interstellar.defenseGridLevel}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">母星天基轨道防御系统</h3>
              </div>

              <button
                onClick={handleUpgradeDefenseGrid}
                className="px-5 py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg hover:from-rose-400 hover:to-red-500 transition-all flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                <span>升级轨道防御要塞 (需要 {interstellar.defenseGridLevel * 20000}金币 / {interstellar.defenseGridLevel * 5}勋章)</span>
              </button>
            </div>

            {/* Defense Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">行星轨道天基护盾</div>
                <div className="text-sm font-black text-cyan-300">{interstellar.defenseShieldHp?.toLocaleString()} / {interstellar.maxDefenseShieldHp?.toLocaleString()}</div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">蓝星和平安宁指数</div>
                <div className="text-sm font-black text-emerald-400">{interstellar.planetaryPeaceRating}% (和平繁荣)</div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${interstellar.planetaryPeaceRating}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400">成功击退外星入侵</div>
                <div className="text-sm font-black text-amber-300">{interstellar.repelledInvasionsCount || 0} 场大捷</div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Alien Threats Radar List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              <h3 className="font-black text-base text-white">深空预警雷达 · 外星侵略舰队列表</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALIEN_INVASION_FLEETS.map(fleet => {
                const threatColors = {
                  B: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                  A: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                  S: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                  SS: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                  SSS: 'bg-red-600 text-white border-red-400'
                };

                return (
                  <div
                    key={fleet.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-rose-500/50 transition-all shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${threatColors[fleet.threatLevel]}`}>
                            {fleet.threatLevel} 级威胁
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{fleet.faction}</span>
                        </div>
                        <h4 className="font-black text-base text-white mt-1">{fleet.name}</h4>
                      </div>
                      <Skull className="w-6 h-6 text-rose-400/80 shrink-0" />
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{fleet.description}</p>

                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">舰队耐久 (HP)</div>
                        <div className="font-bold text-emerald-400">{fleet.fleetHp.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">暗能量护盾</div>
                        <div className="font-bold text-blue-400">{fleet.shieldHp.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">侵略总火力</div>
                        <div className="font-bold text-rose-400">{fleet.fleetAtk.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-amber-300 space-y-0.5 bg-amber-950/20 p-2 rounded border border-amber-800/30">
                      <div>击退战利品: +{fleet.rewards.spaceGold} 星币 · +{fleet.rewards.starCores} 源晶 · +{fleet.rewards.defenseMedals} 勋章</div>
                      {fleet.rewards.droppedBlueprintName && (
                        <div className="text-cyan-300 font-bold">🎁 掉落图纸: 【{fleet.rewards.droppedBlueprintName}】</div>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartSpaceBattle(fleet)}
                      className="w-full py-2.5 rounded-xl font-black text-xs bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white shadow-lg hover:from-rose-500 hover:to-red-500 transition-all flex items-center justify-center gap-2"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>全舰队出击 · 迎战歼敌！</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= SPACE COMBAT TACTICAL BATTLE MODAL ================= */}
      {inSpaceBattle && activeInvasionEnemy && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-slate-950 border border-rose-500/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
                  第 {battleTurn} 战斗轮次
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  蓝星近地轨道战役 · 对决【{activeInvasionEnemy.name}】
                </h3>
              </div>
              <button
                onClick={() => setInSpaceBattle(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Health & Shield Gauges (Player vs Enemy) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Player Fleet Gauge */}
              <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-sm text-white">我方统帅舰队 ({activeFlagship?.name})</span>
                  </div>
                  <span className="text-xs text-cyan-300 font-bold">机甲：{activeMecha?.name}</span>
                </div>

                {/* HP */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>舰体装甲 (HP)</span>
                    <span className="font-bold text-emerald-400">{playerShipCombatState.hp} / {playerShipCombatState.maxHp}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${Math.max(0, (playerShipCombatState.hp / playerShipCombatState.maxHp) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Shield */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>相位能量护盾</span>
                    <span className="font-bold text-blue-400">{playerShipCombatState.shield} / {playerShipCombatState.maxShield}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${Math.max(0, (playerShipCombatState.shield / playerShipCombatState.maxShield) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Energy */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>歼星主炮充能</span>
                    <span className="font-bold text-amber-400">{playerShipCombatState.energy}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all"
                      style={{ width: `${playerShipCombatState.energy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Enemy Fleet Gauge */}
              <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skull className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-sm text-white">{activeInvasionEnemy.name}</span>
                  </div>
                  <span className="text-xs text-rose-400 font-bold">{activeInvasionEnemy.threatLevel} 级威胁</span>
                </div>

                {/* Enemy HP */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>敌舰核心装甲</span>
                    <span className="font-bold text-rose-400">{enemyCombatHp} / {activeInvasionEnemy.fleetHp}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-rose-500 h-full transition-all"
                      style={{ width: `${Math.max(0, (enemyCombatHp / activeInvasionEnemy.fleetHp) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Enemy Shield */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>敌方暗能量护盾</span>
                    <span className="font-bold text-purple-400">{enemyCombatShield} / {activeInvasionEnemy.shieldHp}</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all"
                      style={{ width: `${Math.max(0, (enemyCombatShield / (activeInvasionEnemy.shieldHp || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  敌方指挥官：<strong className="text-slate-200">{activeInvasionEnemy.commander}</strong>
                </div>
              </div>
            </div>

            {/* Tactical Command Actions */}
            {battleResult === 'ongoing' ? (
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-semibold">舰长战术指令面板：</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    onClick={() => handleSpaceCombatAction('main_cannon')}
                    className="p-3 rounded-xl bg-gradient-to-b from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs transition-all shadow-md flex flex-col items-center gap-1"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>主炮齐射</span>
                  </button>

                  <button
                    onClick={() => handleSpaceCombatAction('mecha_swarm')}
                    className="p-3 rounded-xl bg-gradient-to-b from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-xs transition-all shadow-md flex flex-col items-center gap-1"
                  >
                    <Cpu className="w-4 h-4 text-cyan-300" />
                    <span>机甲战机突防</span>
                  </button>

                  <button
                    onClick={() => handleSpaceCombatAction('shield_overload')}
                    className="p-3 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs transition-all shadow-md flex flex-col items-center gap-1"
                  >
                    <Shield className="w-4 h-4 text-emerald-300" />
                    <span>护盾超载修复</span>
                  </button>

                  <button
                    onClick={() => handleSpaceCombatAction('warp_flank')}
                    className="p-3 rounded-xl bg-gradient-to-b from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-black text-xs transition-all shadow-md flex flex-col items-center gap-1"
                  >
                    <Navigation className="w-4 h-4 text-purple-300" />
                    <span>跃迁突袭侧翼</span>
                  </button>

                  <button
                    onClick={() => handleSpaceCombatAction('planet_buster')}
                    disabled={playerShipCombatState.energy < 100}
                    className="p-3 rounded-xl bg-gradient-to-b from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs transition-all shadow-lg col-span-2 sm:col-span-1 disabled:opacity-40 flex flex-col items-center gap-1"
                  >
                    <Flame className="w-4 h-4 text-yellow-200 animate-bounce" />
                    <span>弑神歼星主炮</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 space-y-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className={`text-xl font-black ${battleResult === 'victory' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {battleResult === 'victory' ? '🎉 星际大捷！保卫蓝星成功！' : '💀 舰队战损严重撤离！'}
                </div>
                <button
                  onClick={() => setInSpaceBattle(false)}
                  className="px-6 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  返回母港
                </button>
              </div>
            )}

            {/* Combat Logs Output */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto font-mono text-xs">
              {battleLogs.map((log) => {
                const colorClasses = {
                  player: 'text-cyan-300',
                  enemy: 'text-rose-300',
                  system: 'text-slate-400',
                  critical: 'text-amber-300 font-bold',
                  heal: 'text-emerald-300'
                };
                return (
                  <div key={log.id} className={`${colorClasses[log.type]} leading-relaxed`}>
                    {log.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: INTERSTELLAR TRADE EXPEDITIONS ================= */}
      {mainTab === 'expedition' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl space-y-1 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>远征执行中</span>
                <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              </div>
              <div className="text-2xl font-black text-amber-300">
                {inFlightExpeditionsCount} <span className="text-xs font-normal text-slate-400">支舰队</span>
              </div>
              <div className="text-[11px] text-slate-400">自动采掘各星球矿产中</div>
            </div>

            <div className={`p-4 rounded-2xl space-y-1 shadow-lg relative overflow-hidden transition-all ${
              readyExpeditionsCount > 0
                ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/60 shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : 'bg-slate-900/90 border border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>待领远征收益</span>
                <Gift className={`w-4 h-4 ${readyExpeditionsCount > 0 ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`} />
              </div>
              <div className="text-2xl font-black text-emerald-300">
                {readyExpeditionsCount} <span className="text-xs font-normal text-slate-400">份矿产</span>
              </div>
              <div className="text-[11px] text-emerald-400/80">
                {readyExpeditionsCount > 0 ? '已抵达母港，可立即结算' : '暂无待领取收益'}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl space-y-1 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>累计远征凯旋</span>
                <Trophy className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-indigo-300">
                {interstellar.completedExpeditionsCount || 0} <span className="text-xs font-normal text-slate-400">次航行</span>
              </div>
              <div className="text-[11px] text-slate-400">跨星系自动贸易总计</div>
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-2xl space-y-1 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>可用调遣战舰</span>
                <Rocket className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-300">
                {availableShipsForExpedition.length} <span className="text-xs font-normal text-slate-400">/ {unlockedShips.length} 艘</span>
              </div>
              <div className="text-[11px] text-slate-400">巡洋舰加速15%航程</div>
            </div>
          </div>

          {/* Section 1: Active Expeditions in Progress */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-amber-400" />
                  <h2 className="text-base sm:text-lg font-black text-white">正在执行的星际贸易远征任务</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  战舰全自主巡航采矿中，航程结束即可带回大量星币、星核与天锻神金等神级稀有矿石！
                </p>
              </div>

              {readyExpeditionsCount > 0 && (
                <button
                  onClick={handleBatchClaimAll}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 animate-pulse"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>一键领取全部就绪收益 ({readyExpeditionsCount})</span>
                </button>
              )}
            </div>

            {activeExpeditions.length === 0 ? (
              <div className="py-10 text-center space-y-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                <Compass className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                <div className="text-sm font-bold text-slate-300">当前暂无正在执行的远征舰队</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  请在下方【星域贸易远征路线库】中选定目的地并委派战舰启航，战舰将全自动远航并在倒计时结束后带回异星稀有矿产！
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeExpeditions.map((exp) => {
                  const isReady = now >= exp.endTime;
                  const totalTime = Math.max(1, exp.endTime - exp.startTime);
                  const elapsedTime = Math.max(0, now - exp.startTime);
                  const progress = isReady ? 100 : Math.min(99.9, (elapsedTime / totalTime) * 100);
                  const remainingSeconds = Math.max(0, Math.ceil((exp.endTime - now) / 1000));
                  const minutes = Math.floor(remainingSeconds / 60);
                  const seconds = remainingSeconds % 60;
                  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                  return (
                    <div
                      key={exp.id}
                      className={`p-4 rounded-xl border transition-all space-y-3.5 ${
                        isReady
                          ? 'bg-slate-950/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      {/* Expedition Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-300">{exp.destinationName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                              {exp.targetPlanetName}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <span>委派战舰:</span>
                            <span className="font-bold text-cyan-300">【{exp.assignedShipName}】</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                              {exp.assignedShipClass} · 战力 {exp.powerScore}
                            </span>
                          </div>
                        </div>

                        {isReady ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-pulse flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5" />
                            已抵达 · 待领取
                          </span>
                        ) : (
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1 justify-end">
                              <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                              <span>{timeFormatted}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">跃迁采掘中</span>
                          </div>
                        )}
                      </div>

                      {/* Real-time Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>航程巡航进度</span>
                          <span className={isReady ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isReady
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Minerals & Currency Rewards Preview */}
                      <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-1.5">
                        <div className="text-[10px] text-slate-400 font-medium">预计采掘带回矿产与收益：</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-blue-950/80 border border-blue-800/60 text-cyan-300 font-mono">
                            星币 +{exp.rewards.spaceGold}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] bg-purple-950/80 border border-purple-800/60 text-purple-300 font-mono">
                            星核 +{exp.rewards.starCores}
                          </span>
                          {Object.entries(exp.rewards.divineMetals).map(([metal, count]) => (
                            <span
                              key={metal}
                              className="px-2 py-0.5 rounded text-[11px] bg-amber-950/80 border border-amber-800/60 text-amber-300 font-bold"
                            >
                              {metal} x{count}
                            </span>
                          ))}
                          {exp.rewards.specialGoodName && (
                            <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-mono">
                              {exp.rewards.specialGoodName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {isReady ? (
                          <button
                            onClick={() => handleClaimExpedition(exp.id)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5"
                          >
                            <Gift className="w-4 h-4" />
                            <span>领取稀有矿产与星际收益</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSpeedUpExpedition(exp.id)}
                              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md"
                            >
                              <FastForward className="w-3.5 h-3.5" />
                              <span>跃迁加速 (60星币)</span>
                            </button>
                            <button
                              onClick={() => handleCancelExpedition(exp.id)}
                              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 text-xs transition-all"
                            >
                              召回
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Expedition Routes Library */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base sm:text-lg font-black text-white">全星域稀有矿产贸易远征路线库</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  根据所需稀有神金（天锻神金、魂锻赤金、灵锻秘银等）挑选目标星系并委派空闲战舰
                </p>
              </div>

              {/* Risk Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setExpeditionRiskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    expeditionRiskFilter === 'all'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  全部路线
                </button>
                <button
                  onClick={() => setExpeditionRiskFilter('safe')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    expeditionRiskFilter === 'safe'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  安全 / 低风险
                </button>
                <button
                  onClick={() => setExpeditionRiskFilter('high_yield')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    expeditionRiskFilter === 'high_yield'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  高收益 / 神域打捞
                </button>
              </div>
            </div>

            {/* Destination Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXPEDITION_DESTINATIONS.filter((dest) => {
                if (expeditionRiskFilter === 'safe') return dest.riskLevel === 'safe' || dest.riskLevel === 'low';
                if (expeditionRiskFilter === 'high_yield')
                  return dest.riskLevel === 'moderate' || dest.riskLevel === 'high' || dest.riskLevel === 'legendary';
                return true;
              }).map((dest) => {
                const isDispatched = activeExpeditions.some((e) => e.destinationId === dest.id && !e.isClaimed);
                const hasEnoughPower = fleetPowerScore >= dest.requiredFleetPower;

                return (
                  <div
                    key={dest.id}
                    className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4.5 space-y-3.5 transition-all flex flex-col justify-between group shadow-md"
                  >
                    <div className="space-y-2.5">
                      {/* Destination Card Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${dest.badgeColor}`}>
                            {dest.riskTitle}
                          </span>
                          <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                            {dest.name}
                          </h3>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {dest.durationSeconds}秒
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 leading-relaxed">{dest.description}</p>

                      {/* Mineral Yields Box */}
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-1.5">
                        <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between">
                          <span>固定矿产与星际收益：</span>
                          <span className="text-amber-300 font-mono">+{dest.rewards.spaceGold} 星币</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {Object.entries(dest.rewards.divineMetals).map(([metal, count]) => (
                            <span
                              key={metal}
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                                metal === '至高超神源石'
                                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                                  : metal === '天锻神金'
                                  ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                                  : metal === '魂锻赤金'
                                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                                  : metal === '灵锻秘银'
                                  ? 'bg-blue-950/80 border-blue-500 text-blue-300'
                                  : 'bg-slate-900 border-slate-700 text-slate-300'
                              }`}
                            >
                              {metal} x{count}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 rounded text-[11px] bg-purple-950/70 border border-purple-800/60 text-purple-300 font-mono">
                            星核 x{dest.rewards.starCores}
                          </span>
                        </div>
                      </div>

                      {/* Fleet Power Requirement */}
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="text-slate-400 text-[11px]">要求综合战力:</span>
                        <span
                          className={`font-mono font-bold ${
                            hasEnoughPower ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {dest.requiredFleetPower.toLocaleString()} (当前: {fleetPowerScore.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {/* Dispatch Button */}
                    <div className="pt-2">
                      {isDispatched ? (
                        <div className="w-full py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                          <span>远征舰队采掘中...</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenDispatch(dest)}
                          className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
                            hasEnoughPower
                              ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 hover:from-indigo-400 hover:to-purple-500 text-white shadow-indigo-500/20'
                              : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-400'
                          }`}
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          <span>委派战舰执行远征</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Planetary Rare Metals Depot & Forging Linkage */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Hammer className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">稀有神金仓库与斗铠神兵联动</h2>
                  <p className="text-xs text-slate-400">
                    星际远征采集的稀有矿产可直接用于打造一字至五字至高斗铠部件与唐门神级暗器！
                  </p>
                </div>
              </div>
            </div>

            {/* Rare Metals Stockpile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: '天锻神金', count: player.divineMetals?.['天锻神金'] || 0, color: 'text-amber-300 border-amber-500/50 bg-amber-950/30' },
                { name: '魂锻赤金', count: player.divineMetals?.['魂锻赤金'] || 0, color: 'text-rose-300 border-rose-500/50 bg-rose-950/30' },
                { name: '灵锻秘银', count: player.divineMetals?.['灵锻秘银'] || 0, color: 'text-blue-300 border-blue-500/50 bg-blue-950/30' },
                { name: '百炼精金', count: player.divineMetals?.['百炼精金'] || 0, color: 'text-yellow-300 border-yellow-500/50 bg-yellow-950/30' },
                { name: '深海沉银', count: player.divineMetals?.['沉银'] || 0, color: 'text-slate-300 border-slate-600/50 bg-slate-950/50' },
                { name: '至高超神源石', count: player.divineMetals?.['至高超神源石'] || 0, color: 'text-cyan-300 border-cyan-500/50 bg-cyan-950/30' }
              ].map((metal) => (
                <div
                  key={metal.name}
                  className={`p-3 rounded-xl border ${metal.color} flex flex-col items-center justify-center text-center space-y-1 shadow-sm`}
                >
                  <span className="text-[11px] text-slate-400 font-medium">{metal.name}</span>
                  <span className="text-lg font-black font-mono">{metal.count.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500">份</span>
                </div>
              ))}
            </div>

            {/* Quick Navigation Shortcuts to Forges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => onNavigateToView?.('battle_armor_forge')}
                className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 to-slate-900 hover:from-amber-900/60 hover:to-slate-800 border border-amber-500/40 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>前往【斗铠神铠锻造院】</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">消耗天锻神金打造五字斗铠</div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToView?.('tang_sect_forge')}
                className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 hover:from-indigo-900/60 hover:to-slate-800 border border-indigo-500/40 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-indigo-300 group-hover:text-indigo-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>前往【唐门神铸堂】</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">冶炼佛怒唐莲与神机暗器</div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateToView?.('material_gathering')}
                className="p-3.5 rounded-xl bg-gradient-to-r from-teal-950/60 to-slate-900 hover:from-teal-900/60 hover:to-slate-800 border border-teal-500/40 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-teal-300 group-hover:text-teal-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>前往【神材宝地矿脉】</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">采集灵草仙蕊与基础稀土</div>
                </div>
                <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DISPATCH FLEET EXPEDITION MODAL ================= */}
      {selectedExpeditionDest && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-indigo-500/60 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${selectedExpeditionDest.badgeColor}`}>
                  {selectedExpeditionDest.riskTitle}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{selectedExpeditionDest.name}</h3>
                <div className="text-xs text-slate-400">
                  航程预计耗时：<strong className="text-amber-300">{selectedExpeditionDest.durationSeconds} 秒</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedExpeditionDest(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Mineral Rewards Preview in Modal */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>任务完成后带回稀有矿产与物资：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-lg text-xs bg-blue-950 border border-blue-800 text-cyan-300 font-mono">
                  星币 +{selectedExpeditionDest.rewards.spaceGold}
                </span>
                <span className="px-2 py-1 rounded-lg text-xs bg-purple-950 border border-purple-800 text-purple-300 font-mono">
                  星核 +{selectedExpeditionDest.rewards.starCores}
                </span>
                {Object.entries(selectedExpeditionDest.rewards.divineMetals).map(([metal, count]) => (
                  <span
                    key={metal}
                    className="px-2 py-1 rounded-lg text-xs bg-amber-950 border border-amber-700 text-amber-300 font-bold"
                  >
                    {metal} x{count}
                  </span>
                ))}
              </div>
            </div>

            {/* Select Starship for Dispatch */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>选择委派执行该任务的战舰：</span>
                <span className="text-slate-400 text-[11px]">
                  可用战舰: {availableShipsForExpedition.length} / {unlockedShips.length}
                </span>
              </div>

              {availableShipsForExpedition.length === 0 ? (
                <div className="p-4 bg-rose-950/30 border border-rose-800/60 rounded-xl text-center space-y-1">
                  <div className="text-xs font-bold text-rose-300">暂无空闲可用战舰！</div>
                  <div className="text-[11px] text-slate-400">
                    所有解锁战舰均在执行远征中，请等待远征归港或前往【机甲战舰工坊】解锁新战舰！
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {availableShipsForExpedition.map((ship) => {
                    const isSelected = selectedDispatchShipId === ship.id;
                    const shipPower = Math.floor(ship.hullHp / 10 + ship.cannonAtk * 1.2);
                    const isFastClass = ship.className === '巡洋舰' || ship.className === '护卫舰';

                    return (
                      <div
                        key={ship.id}
                        onClick={() => setSelectedDispatchShipId(ship.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-400 ring-1 ring-indigo-400 shadow-md'
                            : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{ship.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                            {ship.className}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                          <span>战力: {shipPower}</span>
                          {isFastClass && (
                            <span className="text-teal-400 text-[10px] font-bold">航速+15%</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedExpeditionDest(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDispatchExpedition(selectedExpeditionDest, selectedDispatchShipId)}
                disabled={availableShipsForExpedition.length === 0 || !selectedDispatchShipId}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5"
              >
                <Rocket className="w-4 h-4 text-slate-950" />
                <span>立即启航远征</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RANDOM SPACE EVENT MODAL ================= */}
      {activeSpaceEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-black text-lg text-white">{activeSpaceEvent.title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeSpaceEvent.description}
            </p>

            <div className="space-y-2 pt-2">
              {activeSpaceEvent.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResolveSpaceEvent(idx)}
                  className="w-full p-3 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/60 text-left transition-all space-y-1 group"
                >
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">{opt.text}</div>
                  <div className="text-[11px] text-slate-400">{opt.rewardDesc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
