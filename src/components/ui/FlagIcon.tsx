import { useState } from 'react';
import { Box } from '@mui/material';

const COUNTRY_TO_CODE: Record<string, string> = {
  'ARGELIA': 'alg',
  'ARGENTINA': 'arg',
  'AUSTRALIA': 'aus',
  'AUSTRIA': 'aut',
  'BÉLGICA': 'bel',
  'BELGIUM': 'bel',
  'BOSNIA Y HERZEGOVINA': 'bih',
  'BOSNIA': 'bih',
  'BRASIL': 'bra',
  'BRAZIL': 'bra',
  'CANADÁ': 'can',
  'CANADA': 'can',
  'CABO VERDE': 'cpv',
  'CATAR': 'qat',
  'COLOMBIA': 'col',
  'COSTA DE MARFIL': 'civ',
  'CROACIA': 'cro',
  'CROATIA': 'cro',
  'CURAZAO': 'cuw',
  'CURAÇAO': 'cuw',
  'ECUADOR': 'ecu',
  'EGIPTO': 'egy',
  'EGYPT': 'egy',
  'ESCOCIA': 'sco',
  'SCOTLAND': 'sco',
  'ESPAÑA': 'esp',
  'SPAIN': 'esp',
  'ESTADOS UNIDOS': 'usa',
  'UNITED STATES': 'usa',
  'USA': 'usa',
  'FRANCIA': 'fra',
  'FRANCE': 'fra',
  'GHANA': 'gha',
  'HAITÍ': 'hai',
  'HAITI': 'hai',
  'INGLATERRA': 'eng',
  'ENGLAND': 'eng',
  'IRAK': 'irq',
  'IRAQ': 'irq',
  'JAPÓN': 'jpn',
  'JAPAN': 'jpn',
  'JORDANIA': 'jor',
  'JORDAN': 'jor',
  'MARRUECOS': 'mar',
  'MOROCCO': 'mar',
  'MÉXICO': 'mex',
  'MEXICO': 'mex',
  'NORUEGA': 'nor',
  'NORWAY': 'nor',
  'NUEVA ZELANDA': 'nzl',
  'NEW ZEALAND': 'nzl',
  'ALEMANIA': 'ger',
  'GERMANY': 'ger',
  'PAÍSES BAJOS': 'ned',
  'NETHERLANDS': 'ned',
  'PANAMÁ': 'pan',
  'PANAMA': 'pan',
  'PARAGUAY': 'par',
  'PORTUGAL': 'por',
  'RD CONGO': 'cod',
  'REPÚBLICA DE COREA': 'kor',
  'KOREA REPUBLIC': 'kor',
  'SOUTH KOREA': 'kor',
  'REPÚBLICA CHECA': 'cze',
  'CZECH REPUBLIC': 'cze',
  'CZECHIA': 'cze',
  'RI DE IRÁN': 'irn',
  'IRAN': 'irn',
  'SENEGAL': 'sen',
  'SUDÁFICA': 'rsa',
  'SOUTH AFRICA': 'rsa',
  'SUECIA': 'swe',
  'SWEDEN': 'swe',
  'SUIZA': 'sui',
  'SWITZERLAND': 'sui',
  'TÚNEZ': 'tun',
  'TUNISIA': 'tun',
  'TURQUÍA': 'tur',
  'TURKEY': 'tur',
  'URUGUAY': 'uru',
  'UZBEKISTÁN': 'uzb',
  'UZBEKISTAN': 'uzb',
};

function normalize(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
}

function getFlagCode(country: string): string | null {
  const key = normalize(country);
  return COUNTRY_TO_CODE[key] || null;
}

export default function FlagIcon({ country, size = 16 }: { country: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const code = getFlagCode(country);
  const src = code ? `/flags/${code}.png` : null;

  if (src && !failed) {
    return (
      <Box
        component="img"
        src={src}
        alt={country}
        onError={() => setFailed(true)}
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
      ⚽
    </Box>
  );
}
