/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║  THEME CONFIG                                         ║
 * ║  Change the export at the bottom to switch themes.    ║
 * ║  Every color on the site flows from here.             ║
 * ╚═══════════════════════════════════════════════════════╝
 */

export interface ThemeConfig {
  name: string;
  isDark: boolean;
  // Backgrounds (deep → light)
  void: string;
  midnight: string;
  surface: string;
  elevated: string;
  // Glass
  glassBg: string;
  glassBorder: string;
  glassHover: string;
  glassHoverBorder: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;
  // Accent
  accent: string;
  accentHover: string;
  accentDim: string;
  accentGlow: string;
  accentSubtle: string;
  accentContrast: string; // text color ON accent bg (buttons)
  // Status
  success: string;
  // Gradient text
  gradientText: string;
}

/* ────────────────────────────────────────── */

export const themes: Record<string, ThemeConfig> = {

  /* ── Current — MonkeyType / luxury watch ── */
  'midnight-gold': {
    name: 'Midnight Gold',
    isDark: true,
    void: '#09090B', midnight: '#111113', surface: '#18181B', elevated: '#1F1F23',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#FAFAFA', textSecondary: '#A1A1AA', textMuted: '#71717A', textDim: '#3F3F46',
    accent: '#C8A24E', accentHover: '#DDB955', accentDim: '#A68535',
    accentGlow: 'rgba(200,162,78,0.12)', accentSubtle: 'rgba(200,162,78,0.06)',
    accentContrast: '#09090B',
    success: '#10B981',
    gradientText: 'linear-gradient(135deg,#DDB955,#C8A24E,#E8D48B)',
  },

  /* ── Deep purple — Linear / Stripe ── */
  'void-violet': {
    name: 'Void Violet',
    isDark: true,
    void: '#0B0A10', midnight: '#12111A', surface: '#1A1825', elevated: '#22202F',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#F5F3FF', textSecondary: '#A5A0C8', textMuted: '#7C72AA', textDim: '#4A4270',
    accent: '#8B5CF6', accentHover: '#A78BFA', accentDim: '#7C3AED',
    accentGlow: 'rgba(139,92,246,0.12)', accentSubtle: 'rgba(139,92,246,0.06)',
    accentContrast: '#0B0A10',
    success: '#10B981',
    gradientText: 'linear-gradient(135deg,#A78BFA,#8B5CF6,#C4B5FD)',
  },

  /* ── Hacker green — terminal ── */
  'obsidian-emerald': {
    name: 'Obsidian Emerald',
    isDark: true,
    void: '#0A0F0D', midnight: '#0F1512', surface: '#151D19', elevated: '#1B251F',
    glassBg: 'rgba(255,255,255,0.025)', glassBorder: 'rgba(255,255,255,0.05)',
    glassHover: 'rgba(255,255,255,0.04)', glassHoverBorder: 'rgba(255,255,255,0.08)',
    textPrimary: '#E8F5E9', textSecondary: '#81C784', textMuted: '#4CAF50', textDim: '#2E7D32',
    accent: '#00E676', accentHover: '#69F0AE', accentDim: '#00C853',
    accentGlow: 'rgba(0,230,118,0.1)', accentSubtle: 'rgba(0,230,118,0.04)',
    accentContrast: '#0A0F0D',
    success: '#00E676',
    gradientText: 'linear-gradient(135deg,#69F0AE,#00E676,#B9F6CA)',
  },

  /* ── Pure monochrome — no accent ── */
  'noir': {
    name: 'Noir',
    isDark: true,
    void: '#000000', midnight: '#0A0A0A', surface: '#141414', elevated: '#1E1E1E',
    glassBg: 'rgba(255,255,255,0.04)', glassBorder: 'rgba(255,255,255,0.08)',
    glassHover: 'rgba(255,255,255,0.06)', glassHoverBorder: 'rgba(255,255,255,0.12)',
    textPrimary: '#FFFFFF', textSecondary: '#999999', textMuted: '#666666', textDim: '#333333',
    accent: '#FFFFFF', accentHover: '#E5E5E5', accentDim: '#CCCCCC',
    accentGlow: 'rgba(255,255,255,0.08)', accentSubtle: 'rgba(255,255,255,0.03)',
    accentContrast: '#000000',
    success: '#4ADE80',
    gradientText: 'linear-gradient(135deg,#FFFFFF,#CCCCCC,#FFFFFF)',
  },

  /* ── Light — white bg, black text, rose accent ── */
  'snow-rose': {
    name: 'Snow Rose',
    isDark: false,
    void: '#FAFAF9', midnight: '#F5F5F4', surface: '#E7E5E4', elevated: '#D6D3D1',
    glassBg: 'rgba(0,0,0,0.03)', glassBorder: 'rgba(0,0,0,0.06)',
    glassHover: 'rgba(0,0,0,0.05)', glassHoverBorder: 'rgba(0,0,0,0.1)',
    textPrimary: '#1C1917', textSecondary: '#57534E', textMuted: '#78716C', textDim: '#A8A29E',
    accent: '#E11D48', accentHover: '#F43F5E', accentDim: '#BE123C',
    accentGlow: 'rgba(225,29,72,0.1)', accentSubtle: 'rgba(225,29,72,0.04)',
    accentContrast: '#FFFFFF',
    success: '#059669',
    gradientText: 'linear-gradient(135deg,#F43F5E,#E11D48,#FB7185)',
  },

  /* ── Warm dark + amber ── */
  'charcoal-amber': {
    name: 'Charcoal Amber',
    isDark: true,
    void: '#0C0A09', midnight: '#1C1917', surface: '#292524', elevated: '#44403C',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#FAFAF9', textSecondary: '#A8A29E', textMuted: '#78716C', textDim: '#57534E',
    accent: '#F59E0B', accentHover: '#FBBF24', accentDim: '#D97706',
    accentGlow: 'rgba(245,158,11,0.12)', accentSubtle: 'rgba(245,158,11,0.06)',
    accentContrast: '#0C0A09',
    success: '#10B981',
    gradientText: 'linear-gradient(135deg,#FBBF24,#F59E0B,#FDE68A)',
  },
};

/* ╔═══════════════════════════════════════════════╗ */
/* ║                                               ║ */
/* ║   👇  CHANGE THIS TO SWITCH THEMES  👇       ║ */
/* ║                                               ║ */
/* ║   'midnight-gold'   — current, MonkeyType     ║ */
/* ║   'void-violet'     — purple, Linear vibes    ║ */
/* ║   'obsidian-emerald' — green, hacker          ║ */
/* ║   'noir'            — pure black & white      ║ */
/* ║   'snow-rose'       — light, editorial        ║ */
/* ║   'charcoal-amber'  — warm dark + amber       ║ */
/* ║                                               ║ */
/* ╚═══════════════════════════════════════════════╝ */

export const activeTheme: ThemeConfig = themes['noir'];