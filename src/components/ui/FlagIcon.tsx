import { useState } from 'react';
import { Box } from '@mui/material';

const COUNTRY_TO_CODE: Record<string, string> = {
  'ARGELIA': 'alg', 'ALGERIA': 'alg',
  'ARGENTINA': 'arg',
  'AUSTRALIA': 'aus', 'AUSTRALIE': 'aus',
  'AUSTRIA': 'aut',
  'BELGICA': 'bel', 'BELGIUM': 'bel',
  'BOSNIA Y HERZEGOVINA': 'bih', 'BOSNIA': 'bih',
  'BRASIL': 'bra', 'BRAZIL': 'bra',
  'CANADA': 'can',
  'CABO VERDE': 'cpv', 'CAPE VERDE': 'cpv',
  'CATAR': 'qat', 'QATAR': 'qat',
  'COLOMBIA': 'col',
  'COSTA DE MARFIL': 'civ', 'IVORY COAST': 'civ',
  'CROACIA': 'cro', 'CROATIA': 'cro',
  'CURAZAO': 'cuw', 'CURACAO': 'cuw',
  'ECUADOR': 'ecu',
  'EGIPTO': 'egy', 'EGYPT': 'egy',
  'ESCOCIA': 'sco', 'SCOTLAND': 'sco',
  'ESPANA': 'esp', 'SPAIN': 'esp',
  'ESTADOS UNIDOS': 'usa', 'UNITED STATES': 'usa', 'USA': 'usa',
  'FRANCIA': 'fra', 'FRANCE': 'fra',
  'GHANA': 'gha',
  'HAITI': 'hai',
  'INGLATERRA': 'eng', 'ENGLAND': 'eng',
  'IRAK': 'irq', 'IRAQ': 'irq',
  'JAPON': 'jpn', 'JAPAN': 'jpn',
  'JORDANIA': 'jor', 'JORDAN': 'jor',
  'MARRUECOS': 'mar', 'MOROCCO': 'mar',
  'MEXICO': 'mex',
  'NORUEGA': 'nor', 'NORWAY': 'nor',
  'NUEVA ZELANDA': 'nzl', 'NEW ZEALAND': 'nzl',
  'ALEMANIA': 'ger', 'GERMANY': 'ger',
  'PAISES BAJOS': 'ned', 'NETHERLANDS': 'ned',
  'PANAMA': 'pan',
  'PARAGUAY': 'par',
  'PORTUGAL': 'por',
  'RD CONGO': 'cod', 'CONGO DR': 'cod',
  'REPUBLICA DE COREA': 'kor', 'KOREA REPUBLIC': 'kor', 'SOUTH KOREA': 'kor',
  'REPUBLICA CHECA': 'cze', 'CZECH REPUBLIC': 'cze',
  'RI DE IRAN': 'irn', 'IRAN': 'irn',
  'ARABIA SAUDI': 'ksa', 'ARABIA SAUDITA': 'ksa', 'SAUDI ARABIA': 'ksa',
  'SENEGAL': 'sen',
  'SUDAFRICA': 'rsa', 'SUDAFICA': 'rsa', 'SOUTH AFRICA': 'rsa',
  'SUECIA': 'swe', 'SWEDEN': 'swe',
  'SUIZA': 'sui', 'SWITZERLAND': 'sui',
  'TUNEZ': 'tun', 'TUNISIA': 'tun',
  'TURQUIA': 'tur', 'TURKEY': 'tur',
  'URUGUAY': 'uru',
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
