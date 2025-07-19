const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

// Chart-specific colors
export const chartColors = {
  priceTarget: '#3478F6',
  lastClose: '#555555',
  line: '#E0E0E0',
  background: '#FFFFFF',
  primaryText: '#1A1A1A',
  secondaryText: '#666666',
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
