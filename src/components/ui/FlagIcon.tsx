import { Box } from '@mui/material';

interface FlagIconProps {
  country?: string | null;
  size?: number;
}

const flagEmoji: Record<string, string> = {
  MEXICO: '🇲🇽',
  ARGENTINA: '🇦🇷',
  BRASIL: '🇧🇷',
  URUGUAY: '🇺🇾',
  COLOMBIA: '🇨🇴',
  CHILE: '🇨🇱',
  PERU: '🇵🇪',
  ECUADOR: '🇪🇨',
  PARAGUAY: '🇵🇾',
  BOLIVIA: '🇧🇴',
  VENEZUELA: '🇻🇪',
  USA: '🇺🇸',
  CANADA: '🇨🇦',
  ESPANA: '🇪🇸',
  FRANCIA: '🇫🇷',
  ALEMANIA: '🇩🇪',
  ITALIA: '🇮🇹',
  INGLATERRA: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  PORTUGAL: '🇵🇹',
  HOLANDA: '🇳🇱',
  BELGICA: '🇧🇪',
  CROACIA: '🇭🇷',
  SUIZA: '🇨🇭',
  DINAMARCA: '🇩🇰',
  SUECIA: '🇸🇪',
  POLONIA: '🇵🇱',
  JAPON: '🇯🇵',
  COREA: '🇰🇷',
  ARABIA: '🇸🇦',
  IRAN: '🇮🇷',
  AUSTRALIA: '🇦🇺',
  NIGERIA: '🇳🇬',
  SENEGAL: '🇸🇳',
  GHANA: '🇬🇭',
  CAMERUN: '🇨🇲',
  MARRUECOS: '🇲🇦',
  TUNEZ: '🇹🇳',
  EGIPTO: '🇪🇬',
};

export default function FlagIcon({ country, size = 20 }: FlagIconProps) {
  if (!country) return null;

  const upper = country.toUpperCase();
  const emoji = flagEmoji[upper] || '⚽';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size,
        lineHeight: 1,
      }}
      role="img"
      aria-label={country}
    >
      {emoji}
    </Box>
  );
}
