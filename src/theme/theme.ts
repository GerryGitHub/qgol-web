import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surfaces: { card: string; elevated: string };
  }
  interface PaletteOptions {
    surfaces?: { card: string; elevated: string };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22C55E',
      light: '#4ADE80',
      dark: '#16A34A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    success: { main: '#22C55E' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',
    },
    divider: '#334155',
    surfaces: {
      card: '#334155',
      elevated: '#3B4A63',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.25 },
    h3: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.35 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)' },
        },
        outlined: {
          borderColor: '#334155',
          '&:hover': { borderColor: '#22C55E', bgcolor: 'rgba(34, 197, 94, 0.06)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#334155',
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1E293B',
            borderRadius: 16,
            '& fieldset': { borderColor: '#334155' },
            '&:hover fieldset': { borderColor: '#475569' },
            '&.Mui-focused fieldset': { borderColor: '#22C55E' },
          },
          '& .MuiInputLabel-root': { color: '#64748B' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#22C55E' },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E293B',
          borderTop: '1px solid #334155',
          height: 72,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#64748B',
          '&.Mui-selected': { color: '#22C55E' },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            fontWeight: 600,
            '&.Mui-selected': { fontSize: '0.65rem' },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          borderRight: '1px solid #334155',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 8px',
          padding: '10px 16px',
          '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.08)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.16)' },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
          '& .MuiTabs-indicator': { bgcolor: '#22C55E', height: 3, borderRadius: 1.5 },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          py: 1,
          px: 2,
          fontWeight: 700,
          fontSize: '0.8rem',
          textTransform: 'none',
          color: '#94A3B8',
          '&.Mui-selected': { color: '#22C55E' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        outlined: { borderColor: '#334155' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E293B',
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#334155' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#334155 #0F172A',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#0F172A' },
          '&::-webkit-scrollbar-thumb': { background: '#334155', borderRadius: 3 },
        },
      },
    },
  },
});

export default theme;
