import { Box } from '@mui/material';

const COUNTRY_TO_CODE: Record<string, string> = {
  'Argentina': 'arg',
  'Australia': 'aus',
  'Austria': 'aut',
  'Belgium': 'bel',
  'Bosnia and Herzegovina': 'bih',
  'Bosnia': 'bih',
  'Brazil': 'bra',
  'Brasil': 'bra',
  'Canada': 'can',
  'Chile': 'chl',
  'Colombia': 'col',
  'Costa Rica': 'crc',
  'Croatia': 'cro',
  'Curaçao': 'cuw',
  'Curacao': 'cuw',
  'Czech Republic': 'cze',
  'Czechia': 'cze',
  'Denmark': 'den',
  'Ecuador': 'ecu',
  'Egypt': 'egy',
  'England': 'eng',
  'France': 'fra',
  'Germany': 'ger',
  'Alemania': 'ger',
  'Ghana': 'gha',
  'Haiti': 'hai',
  'Iran': 'irn',
  'Iraq': 'irq',
  'Italy': 'ita',
  'Japan': 'jpn',
  'Japón': 'jpn',
  'Jordan': 'jor',
  'Korea Republic': 'kor',
  'South Korea': 'kor',
  'Kosovo': 'ksv',
  'Kuwait': 'kuw',
  'Morocco': 'mar',
  'Marruecos': 'mar',
  'Mexico': 'mex',
  'México': 'mex',
  'Netherlands': 'ned',
  'Países Bajos': 'ned',
  'Nigeria': 'nga',
  'Norway': 'nor',
  'Noruega': 'nor',
  'New Zealand': 'nzl',
  'Nueva Zelanda': 'nzl',
  'Panama': 'pan',
  'Panamá': 'pan',
  'Paraguay': 'par',
  'Peru': 'per',
  'Perú': 'per',
  'Poland': 'pol',
  'Polonia': 'pol',
  'Portugal': 'por',
  'Qatar': 'qat',
  'Romania': 'rou',
  'Rumania': 'rou',
  'Russia': 'rus',
  'Rusia': 'rus',
  'Saudi Arabia': 'ksa',
  'Arabia Saudita': 'ksa',
  'Scotland': 'sco',
  'Escocia': 'sco',
  'Senegal': 'sen',
  'Serbia': 'srb',
  'Slovakia': 'svk',
  'Eslovaquia': 'svk',
  'Slovenia': 'svn',
  'Eslovenia': 'svn',
  'South Africa': 'rsa',
  'Sudáfrica': 'rsa',
  'Spain': 'esp',
  'España': 'esp',
  'Sweden': 'swe',
  'Suecia': 'swe',
  'Switzerland': 'sui',
  'Suiza': 'sui',
  'Tunisia': 'tun',
  'Túnez': 'tun',
  'Turkey': 'tur',
  'Turquía': 'tur',
  'Ukraine': 'ukr',
  'Ucrania': 'ukr',
  'United States': 'usa',
  'USA': 'usa',
  'Uruguay': 'uru',
  'Uzbekistan': 'uzb',
  'Uzbekistán': 'uzb',
  'Venezuela': 'ven',
  'Wales': 'wal',
  'Gales': 'wal',
};

function getFlagUrl(country: string): string | null {
  const code = COUNTRY_TO_CODE[country];
  if (!code) return null;
  return `/flags/${code}.png`;
}

export default function FlagIcon({ country, size = 16 }: { country: string; size?: number }) {
  const src = getFlagUrl(country);

  if (src) {
    return (
      <Box
        component="img"
        src={src}
        alt={country}
        sx={{
          width: size,
          height: size * 0.75,
          borderRadius: '2px',
          objectFit: 'cover',
          display: 'inline-block',
          flexShrink: 0,
          bgcolor: 'rgba(255,255,255,0.05)',
        }}
      />
    );
  }

  const emoji = countryToEmoji(country);
  return (
    <Box
      component="span"
      sx={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-block',
        flexShrink: 0,
      }}
    >
      {emoji}
    </Box>
  );
}

function countryToEmoji(country: string): string {
  const map: Record<string, string> = {
    'Argentina': '🇦🇷',
    'Australia': '🇦🇺',
    'Brazil': '🇧🇷', 'Brasil': '🇧🇷',
    'Canada': '🇨🇦',
    'Chile': '🇨🇱',
    'Colombia': '🇨🇴',
    'Croatia': '🇭🇷',
    'Ecuador': '🇪🇨',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'France': '🇫🇷',
    'Germany': '🇩🇪', 'Alemania': '🇩🇪',
    'Ghana': '🇬🇭',
    'Iran': '🇮🇷',
    'Japan': '🇯🇵', 'Japón': '🇯🇵',
    'Mexico': '🇲🇽', 'México': '🇲🇽',
    'Morocco': '🇲🇦', 'Marruecos': '🇲🇦',
    'Netherlands': '🇳🇱', 'Países Bajos': '🇳🇱',
    'Nigeria': '🇳🇬',
    'Norway': '🇳🇴', 'Noruega': '🇳🇴',
    'Paraguay': '🇵🇾',
    'Peru': '🇵🇪', 'Perú': '🇵🇪',
    'Poland': '🇵🇱', 'Polonia': '🇵🇱',
    'Portugal': '🇵🇹',
    'Qatar': '🇶🇦',
    'Russia': '🇷🇺', 'Rusia': '🇷🇺',
    'Saudi Arabia': '🇸🇦', 'Arabia Saudita': '🇸🇦',
    'Senegal': '🇸🇳',
    'Serbia': '🇷🇸',
    'South Korea': '🇰🇷', 'Korea Republic': '🇰🇷',
    'Spain': '🇪🇸', 'España': '🇪🇸',
    'Sweden': '🇸🇪', 'Suecia': '🇸🇪',
    'Switzerland': '🇨🇭', 'Suiza': '🇨🇭',
    'Tunisia': '🇹🇳', 'Túnez': '🇹🇳',
    'Turkey': '🇹🇷', 'Turquía': '🇹🇷',
    'Ukraine': '🇺🇦', 'Ucrania': '🇺🇦',
    'United States': '🇺🇸', 'USA': '🇺🇸',
    'Uruguay': '🇺🇾',
    'Venezuela': '🇻🇪',
    'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Gales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  };
  return map[country] || '⚽';
}
