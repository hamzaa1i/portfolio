/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║  THEME CONFIG — 12 Premium Themes                     ║
 * ║  Change the export at the bottom to switch default.   ║
 * ║  ThemeSwitcher + Terminal read this automatically.    ║
 * ╚═══════════════════════════════════════════════════════╝
 */

export interface ThemeConfig {
  name: string;
  isDark: boolean;
  void: string; midnight: string; surface: string; elevated: string;
  glassBg: string; glassBorder: string; glassHover: string; glassHoverBorder: string;
  textPrimary: string; textSecondary: string; textMuted: string; textDim: string;
  accent: string; accentHover: string; accentDim: string;
  accentGlow: string; accentSubtle: string; accentContrast: string;
  success: string;
  gradientText: string;
}

export const themes: Record<string, ThemeConfig> = {

  /* ═══════════════════════════════════════
     DARK THEMES
     ═══════════════════════════════════════ */

  'midnight-gold': {
    name: 'Midnight Gold', isDark: true,
    void: '#09090B', midnight: '#111113', surface: '#18181B', elevated: '#1F1F23',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#FAFAFA', textSecondary: '#A1A1AA', textMuted: '#71717A', textDim: '#3F3F46',
    accent: '#C8A24E', accentHover: '#DDB955', accentDim: '#A68535',
    accentGlow: 'rgba(200,162,78,0.12)', accentSubtle: 'rgba(200,162,78,0.06)',
    accentContrast: '#09090B', success: '#10B981',
    gradientText: 'linear-gradient(135deg,#DDB955,#C8A24E,#E8D48B)',
  },

  'void-violet': {
    name: 'Void Violet', isDark: true,
    void: '#0B0A10', midnight: '#12111A', surface: '#1A1825', elevated: '#22202F',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#F5F3FF', textSecondary: '#A5A0C8', textMuted: '#7C72AA', textDim: '#4A4270',
    accent: '#8B5CF6', accentHover: '#A78BFA', accentDim: '#7C3AED',
    accentGlow: 'rgba(139,92,246,0.12)', accentSubtle: 'rgba(139,92,246,0.06)',
    accentContrast: '#0B0A10', success: '#10B981',
    gradientText: 'linear-gradient(135deg,#A78BFA,#8B5CF6,#C4B5FD)',
  },

  'obsidian-emerald': {
    name: 'Obsidian Emerald', isDark: true,
    void: '#0A0F0D', midnight: '#0F1512', surface: '#151D19', elevated: '#1B251F',
    glassBg: 'rgba(255,255,255,0.025)', glassBorder: 'rgba(255,255,255,0.05)',
    glassHover: 'rgba(255,255,255,0.04)', glassHoverBorder: 'rgba(255,255,255,0.08)',
    textPrimary: '#E8F5E9', textSecondary: '#81C784', textMuted: '#4CAF50', textDim: '#2E7D32',
    accent: '#00E676', accentHover: '#69F0AE', accentDim: '#00C853',
    accentGlow: 'rgba(0,230,118,0.1)', accentSubtle: 'rgba(0,230,118,0.04)',
    accentContrast: '#0A0F0D', success: '#00E676',
    gradientText: 'linear-gradient(135deg,#69F0AE,#00E676,#B9F6CA)',
  },

  'noir': {
    name: 'Noir', isDark: true,
    void: '#000000', midnight: '#0A0A0A', surface: '#141414', elevated: '#1E1E1E',
    glassBg: 'rgba(255,255,255,0.04)', glassBorder: 'rgba(255,255,255,0.08)',
    glassHover: 'rgba(255,255,255,0.06)', glassHoverBorder: 'rgba(255,255,255,0.12)',
    textPrimary: '#FFFFFF', textSecondary: '#999999', textMuted: '#666666', textDim: '#333333',
    accent: '#FFFFFF', accentHover: '#E5E5E5', accentDim: '#CCCCCC',
    accentGlow: 'rgba(255,255,255,0.08)', accentSubtle: 'rgba(255,255,255,0.03)',
    accentContrast: '#000000', success: '#4ADE80',
    gradientText: 'linear-gradient(135deg,#FFFFFF,#CCCCCC,#FFFFFF)',
  },

  'charcoal-amber': {
    name: 'Charcoal Amber', isDark: true,
    void: '#0C0A09', midnight: '#1C1917', surface: '#292524', elevated: '#44403C',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#FAFAF9', textSecondary: '#A8A29E', textMuted: '#78716C', textDim: '#57534E',
    accent: '#F59E0B', accentHover: '#FBBF24', accentDim: '#D97706',
    accentGlow: 'rgba(245,158,11,0.12)', accentSubtle: 'rgba(245,158,11,0.06)',
    accentContrast: '#0C0A09', success: '#10B981',
    gradientText: 'linear-gradient(135deg,#FBBF24,#F59E0B,#FDE68A)',
  },

  'carbon-crimson': {
    name: 'Carbon Crimson', isDark: true,
    void: '#0C0C0C', midnight: '#141414', surface: '#1C1C1C', elevated: '#262626',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#FAFAFA', textSecondary: '#A3A3A3', textMuted: '#737373', textDim: '#404040',
    accent: '#DC2626', accentHover: '#EF4444', accentDim: '#B91C1C',
    accentGlow: 'rgba(220,38,38,0.12)', accentSubtle: 'rgba(220,38,38,0.06)',
    accentContrast: '#FFFFFF', success: '#10B981',
    gradientText: 'linear-gradient(135deg,#EF4444,#DC2626,#FCA5A5)',
  },

  'deep-ocean': {
    name: 'Deep Ocean', isDark: true,
    void: '#0A1628', midnight: '#0F1D32', surface: '#15253E', elevated: '#1B2D4A',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#E2E8F0', textSecondary: '#94A3B8', textMuted: '#64748B', textDim: '#334155',
    accent: '#14B8A6', accentHover: '#2DD4BF', accentDim: '#0D9488',
    accentGlow: 'rgba(20,184,166,0.12)', accentSubtle: 'rgba(20,184,166,0.06)',
    accentContrast: '#0A1628', success: '#14B8A6',
    gradientText: 'linear-gradient(135deg,#2DD4BF,#14B8A6,#99F6E4)',
  },

  'tokyo-night': {
    name: 'Tokyo Night', isDark: true,
    void: '#1A1B2E', midnight: '#1E1F36', surface: '#24253E', elevated: '#2A2B48',
    glassBg: 'rgba(255,255,255,0.03)', glassBorder: 'rgba(255,255,255,0.06)',
    glassHover: 'rgba(255,255,255,0.05)', glassHoverBorder: 'rgba(255,255,255,0.1)',
    textPrimary: '#E2E0F0', textSecondary: '#A09DC0', textMuted: '#7A78A0', textDim: '#4A4870',
    accent: '#F472B6', accentHover: '#F9A8D4', accentDim: '#EC4899',
    accentGlow: 'rgba(244,114,182,0.12)', accentSubtle: 'rgba(244,114,182,0.06)',
    accentContrast: '#1A1B2E', success: '#34D399',
    gradientText: 'linear-gradient(135deg,#F9A8D4,#F472B6,#FBCFE8)',
  },

  /* ═══════════════════════════════════════
     LIGHT THEMES
     ═══════════════════════════════════════ */

  'paper-ink': {
    name: 'Paper & Ink', isDark: false,
    void: '#FFFFFF', midnight: '#FAFAFA', surface: '#F4F4F5', elevated: '#E4E4E7',
    glassBg: 'rgba(0,0,0,0.02)', glassBorder: 'rgba(0,0,0,0.06)',
    glassHover: 'rgba(0,0,0,0.04)', glassHoverBorder: 'rgba(0,0,0,0.1)',
    textPrimary: '#09090B', textSecondary: '#3F3F46', textMuted: '#71717A', textDim: '#A1A1AA',
    accent: '#4F46E5', accentHover: '#6366F1', accentDim: '#4338CA',
    accentGlow: 'rgba(79,70,229,0.1)', accentSubtle: 'rgba(79,70,229,0.04)',
    accentContrast: '#FFFFFF', success: '#059669',
    gradientText: 'linear-gradient(135deg,#6366F1,#4F46E5,#818CF8)',
  },

  'cloud-copper': {
    name: 'Cloud & Copper', isDark: false,
    void: '#FFFBF5', midnight: '#FFF8F0', surface: '#F5EDE4', elevated: '#E8DDD2',
    glassBg: 'rgba(0,0,0,0.02)', glassBorder: 'rgba(0,0,0,0.06)',
    glassHover: 'rgba(0,0,0,0.04)', glassHoverBorder: 'rgba(0,0,0,0.1)',
    textPrimary: '#1C1210', textSecondary: '#5C4B42', textMuted: '#8B7B72', textDim: '#B8ACA5',
    accent: '#B87333', accentHover: '#D4894A', accentDim: '#9A5F28',
    accentGlow: 'rgba(184,115,51,0.1)', accentSubtle: 'rgba(184,115,51,0.04)',
    accentContrast: '#FFFFFF', success: '#059669',
    gradientText: 'linear-gradient(135deg,#D4894A,#B87333,#E8B88A)',
  },

  'snow-rose': {
    name: 'Snow Rose', isDark: false,
    void: '#FAFAF9', midnight: '#F5F5F4', surface: '#E7E5E4', elevated: '#D6D3D1',
    glassBg: 'rgba(0,0,0,0.03)', glassBorder: 'rgba(0,0,0,0.06)',
    glassHover: 'rgba(0,0,0,0.05)', glassHoverBorder: 'rgba(0,0,0,0.1)',
    textPrimary: '#1C1917', textSecondary: '#57534E', textMuted: '#78716C', textDim: '#A8A29E',
    accent: '#E11D48', accentHover: '#F43F5E', accentDim: '#BE123C',
    accentGlow: 'rgba(225,29,72,0.1)', accentSubtle: 'rgba(225,29,72,0.04)',
    accentContrast: '#FFFFFF', success: '#059669',
    gradientText: 'linear-gradient(135deg,#F43F5E,#E11D48,#FB7185)',
  },

  'frost-azure': {
    name: 'Frost Azure', isDark: false,
    void: '#F8FAFC', midnight: '#F1F5F9', surface: '#E2E8F0', elevated: '#CBD5E1',
    glassBg: 'rgba(0,0,0,0.02)', glassBorder: 'rgba(0,0,0,0.06)',
    glassHover: 'rgba(0,0,0,0.04)', glassHoverBorder: 'rgba(0,0,0,0.1)',
    textPrimary: '#0F172A', textSecondary: '#334155', textMuted: '#64748B', textDim: '#94A3B8',
    accent: '#0EA5E9', accentHover: '#38BDF8', accentDim: '#0284C7',
    accentGlow: 'rgba(14,165,233,0.1)', accentSubtle: 'rgba(14,165,233,0.04)',
    accentContrast: '#FFFFFF', success: '#059669',
    gradientText: 'linear-gradient(135deg,#38BDF8,#0EA5E9,#7DD3FC)',
  },
};

/* ╔═══════════════════════════════════════════════╗
   ║   👇  CHANGE THIS TO SWITCH DEFAULT  👇       ║
   ╚═══════════════════════════════════════════════╝ */
export const activeTheme: ThemeConfig = themes['midnight-gold'];