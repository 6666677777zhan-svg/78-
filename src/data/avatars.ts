/**
 * Anime Beauty Avatars for Douluo Dalu RPG
 */

import defaultAvatar from '../assets/images/anime_beauty_avatar_1786479251142.jpg';
import xiaowuAvatar from '../assets/images/anime_beauty_xiaowu_1786479268015.jpg';
import angelAvatar from '../assets/images/anime_beauty_angel_1786479277942.jpg';

export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  url: string;
  themeColor: string;
  description: string;
}

export const ANIME_AVATARS: AvatarOption[] = [
  {
    id: 'celestial_goddess',
    name: '银发海神女帝',
    title: '空灵天仙少女',
    url: defaultAvatar,
    themeColor: '#38bdf8',
    description: '银发如瀑，眼若秋水，身着星芒神袍的绝世空灵神女。'
  },
  {
    id: 'soft_bone_xiaowu',
    name: '柔骨魅兔 · 小舞',
    title: '俏皮十万年柔骨兔',
    url: xiaowuAvatar,
    themeColor: '#f472b6',
    description: '粉衣灵动，红润双眸，蝎尾长辫的俏皮绝美少女。'
  },
  {
    id: 'angel_empress',
    name: '六翼天使 · 千仞雪',
    title: '神圣尊贵天使女神',
    url: angelAvatar,
    themeColor: '#fbbf24',
    description: '璀璨金发，神圣光辉包裹，兼具帝王威严与优雅的天使女皇。'
  }
];

export const DEFAULT_AVATAR_URL = defaultAvatar;
