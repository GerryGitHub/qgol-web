import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surfaces: { card: string; elevated: string; glass: string };
  }
  interface PaletteOptions {
    surfaces?: { card: string; elevated: string; glass: string };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0D5BFF',
      light: '#3B82F6',
      dark: '#0847CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00B86B',
      light: '#34D399',
      dark: '#059669',
    },
    success: { main: '#00B86B' },
    warning: { main: '#F59E0B' },
    error: { main: '#FF4D4D' },
    background: {
      default: '#0B1220',
      paper: 'rgba(11, 18, 32, 0.3)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#99FFFFFF',
    },
    divider: 'rgba(255, 255, 255, 0.2)',
    surfaces: {
      card: 'rgba(11, 18, 32, 0.3)',
      elevated: 'rgba(11, 18, 32, 0.45)',
      glass: 'rgba(11, 18, 32, 0.5)',
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: 'rgba(255,255,255,0.15) #0B1220',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#0B1220' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.15)', borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: '0.875rem',
          minHeight: 48,
          boxShadow: '0 4px 14px rgba(13, 91, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(13, 91, 255, 0.45)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: 'none',
          '&:hover': { borderColor: '#0D5BFF', bgcolor: 'rgba(13, 91, 255, 0.06)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(11, 18, 32, 0.3)',
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
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 16,
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
            '&.Mui-focused fieldset': { borderColor: '#0D5BFF' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#0D5BFF' },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 18, 32, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          height: 72,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.5)',
          '&.Mui-selected': { color: '#0D5BFF' },
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
          backgroundColor: '#0B1220',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: { padding: 0 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '2px 8px',
          padding: '10px 16px',
          '&:hover': { backgroundColor: 'rgba(13, 91, 255, 0.06)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(13, 91, 255, 0.1)',
            '&:hover': { backgroundColor: 'rgba(13, 91, 255, 0.14)' },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
          '& .MuiTabs-indicator': { bgcolor: '#0D5BFF', height: 3, borderRadius: 1.5 },
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
          color: 'rgba(255, 255, 255, 0.6)',
          '&.Mui-selected': { color: '#0D5BFF' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
        outlined: { borderColor: 'rgba(255, 255, 255, 0.2)' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(11, 18, 32, 0.95)',
          borderRadius: 20,
          backgroundImage: 'none',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
        root: { borderColor: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
        primary: {
          boxShadow: '0 8px 24px rgba(13, 91, 255, 0.4)',
          '&:hover': { boxShadow: '0 12px 32px rgba(13, 91, 255, 0.5)' },
        },
      },
    },
  },
});

export default theme;
