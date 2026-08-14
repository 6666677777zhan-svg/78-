import { Player } from '../types/game';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  loginTime: number;
}

export interface GoogleCloudSaveSlot {
  slotId: string;
  email: string;
  playerName: string;
  level: number;
  soulRankTitle: string;
  martialSoulNames: string[];
  gold: number;
  savedAt: number;
  playerData: Player;
}

const GOOGLE_USER_KEY = 'douluo_google_current_user';
const GOOGLE_CLOUD_SAVELIST_KEY = 'douluo_google_cloud_slots_';
const GOOGLE_AUTO_SAVE_ENABLED_KEY = 'douluo_google_autosave_enabled';

export function getActiveGoogleUser(): GoogleUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GOOGLE_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load Google user session', e);
    return null;
  }
}

export function saveActiveGoogleUser(user: GoogleUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(GOOGLE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(GOOGLE_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to persist Google user session', e);
  }
}

export function isGoogleAutoSaveEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(GOOGLE_AUTO_SAVE_ENABLED_KEY);
  return val !== 'false';
}

export function setGoogleAutoSaveEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GOOGLE_AUTO_SAVE_ENABLED_KEY, enabled ? 'true' : 'false');
}

/**
 * Get all Google cloud save slots for an email
 */
export function getGoogleCloudSlots(email: string): GoogleCloudSaveSlot[] {
  if (typeof window === 'undefined' || !email) return [];
  try {
    const key = `${GOOGLE_CLOUD_SAVELIST_KEY}${email.trim().toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get Google cloud save slots', e);
    return [];
  }
}

/**
 * Save current player state to Google Cloud for a specific Gmail account
 */
export function savePlayerToGoogleCloud(
  user: GoogleUser,
  player: Player,
  slotLabel = '主存档'
): { success: boolean; slot: GoogleCloudSaveSlot } {
  const email = user.email.trim().toLowerCase();
  const key = `${GOOGLE_CLOUD_SAVELIST_KEY}${email}`;
  
  const martialSoulNames = (player.martialSouls || []).map(s => s.name);
  
  const newSlot: GoogleCloudSaveSlot = {
    slotId: `slot_${Date.now()}`,
    email,
    playerName: player.name,
    level: player.level,
    soulRankTitle: slotLabel,
    martialSoulNames,
    gold: player.gold,
    savedAt: Date.now(),
    playerData: JSON.parse(JSON.stringify(player))
  };

  try {
    const existing = getGoogleCloudSlots(email);
    // Keep up to 5 historical cloud saves per Google Account
    const updated = [newSlot, ...existing.filter(s => s.slotId !== newSlot.slotId)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
    return { success: true, slot: newSlot };
  } catch (e) {
    console.error('Failed to write to Google Cloud Storage', e);
    return { success: false, slot: newSlot };
  }
}

/**
 * Load the latest Google Cloud save for a user
 */
export function loadLatestGoogleCloudSave(email: string): Player | null {
  const slots = getGoogleCloudSlots(email);
  if (slots.length === 0) return null;
  return slots[0].playerData || null;
}

/**
 * Delete a Google Cloud save slot
 */
export function deleteGoogleCloudSlot(email: string, slotId: string): void {
  try {
    const key = `${GOOGLE_CLOUD_SAVELIST_KEY}${email.trim().toLowerCase()}`;
    const existing = getGoogleCloudSlots(email);
    const updated = existing.filter(s => s.slotId !== slotId);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete Google save slot', e);
  }
}

/**
 * Generate exportable JSON backup
 */
export function exportGoogleBackupJSON(player: Player, user?: GoogleUser | null): string {
  const exportPayload = {
    game: '斗罗大陆·武魂觉醒',
    version: '1.0.0',
    exportTime: new Date().toISOString(),
    googleAccount: user ? { email: user.email, name: user.name } : null,
    player
  };
  return JSON.stringify(exportPayload, null, 2);
}
