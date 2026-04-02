import { Group, Match, Team } from './types';

export const GROUPS: Group[] = [
  { name: 'A', teams: [
    { name: 'México', flag: '🇲🇽', code: 'MEX' },
    { name: 'Sudáfrica', flag: '🇿🇦', code: 'RSA' },
    { name: 'Corea del Sur', flag: '🇰🇷', code: 'KOR' },
    { name: 'Rep. Checa', flag: '🇨🇿', code: 'CZE' },
  ]},
  { name: 'B', teams: [
    { name: 'Canadá', flag: '🇨🇦', code: 'CAN' },
    { name: 'Qatar', flag: '🇶🇦', code: 'QAT' },
    { name: 'Suiza', flag: '🇨🇭', code: 'SUI' },
    { name: 'Bosnia', flag: '🇧🇦', code: 'BIH' },
  ]},
  { name: 'C', teams: [
    { name: 'Brasil', flag: '🇧🇷', code: 'BRA' },
    { name: 'Marruecos', flag: '🇲🇦', code: 'MAR' },
    { name: 'Escocia', flag: '🏴\u200D☠️', code: 'SCO' },
    { name: 'Haití', flag: '🇭🇹', code: 'HAI' },
  ]},
  { name: 'D', teams: [
    { name: 'EE.UU.', flag: '🇺🇸', code: 'USA' },
    { name: 'Australia', flag: '🇦🇺', code: 'AUS' },
    { name: 'Paraguay', flag: '🇵🇾', code: 'PAR' },
    { name: 'Turquía', flag: '🇹🇷', code: 'TUR' },
  ]},
  { name: 'E', teams: [
    { name: 'Alemania', flag: '🇩🇪', code: 'GER' },
    { name: 'Ecuador', flag: '🇪🇨', code: 'ECU' },
    { name: 'Costa de Marfil', flag: '🇨🇮', code: 'CIV' },
    { name: 'Curazao', flag: '🇨🇼', code: 'CUW' },
  ]},
  { name: 'F', teams: [
    { name: 'Países Bajos', flag: '🇳🇱', code: 'NED' },
    { name: 'Japón', flag: '🇯🇵', code: 'JPN' },
    { name: 'Túnez', flag: '🇹🇳', code: 'TUN' },
    { name: 'Suecia', flag: '🇸🇪', code: 'SWE' },
  ]},
  { name: 'G', teams: [
    { name: 'Bélgica', flag: '🇧🇪', code: 'BEL' },
    { name: 'Irán', flag: '🇮🇷', code: 'IRN' },
    { name: 'Egipto', flag: '🇪🇬', code: 'EGY' },
    { name: 'Nueva Zelanda', flag: '🇳🇿', code: 'NZL' },
  ]},
  { name: 'H', teams: [
    { name: 'España', flag: '🇪🇸', code: 'ESP' },
    { name: 'Uruguay', flag: '🇺🇾', code: 'URU' },
    { name: 'Arabia Saudita', flag: '🇸🇦', code: 'KSA' },
    { name: 'Cabo Verde', flag: '🇨🇻', code: 'CPV' },
  ]},
  { name: 'I', teams: [
    { name: 'Francia', flag: '🇫🇷', code: 'FRA' },
    { name: 'Senegal', flag: '🇸🇳', code: 'SEN' },
    { name: 'Noruega', flag: '🇳🇴', code: 'NOR' },
    { name: 'Irak', flag: '🇮🇶', code: 'IRQ' },
  ]},
  { name: 'J', teams: [
    { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
    { name: 'Austria', flag: '🇦🇹', code: 'AUT' },
    { name: 'Argelia', flag: '🇩🇿', code: 'ALG' },
    { name: 'Jordania', flag: '🇯🇴', code: 'JOR' },
  ]},
  { name: 'K', teams: [
    { name: 'Portugal', flag: '🇵🇹', code: 'POR' },
    { name: 'Colombia', flag: '🇨🇴', code: 'COL' },
    { name: 'Uzbekistán', flag: '🇺🇿', code: 'UZB' },
    { name: 'RD Congo', flag: '🇨🇩', code: 'COD' },
  ]},
  { name: 'L', teams: [
    { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
    { name: 'Croacia', flag: '🇭🇷', code: 'CRO' },
    { name: 'Panamá', flag: '🇵🇦', code: 'PAN' },
    { name: 'Ghana', flag: '🇬🇭', code: 'GHA' },
  ]},
];

function generateGroupMatches(group: Group): Match[] {
  const t = group.teams;
  const pairs: [Team, Team, number][] = [
    [t[0], t[1], 1], [t[2], t[3], 1],
    [t[0], t[2], 2], [t[3], t[1], 2],
    [t[0], t[3], 3], [t[1], t[2], 3],
  ];
  return pairs.map(([home, away, md], i) => ({
    id: `${group.name}${i + 1}`,
    group: group.name,
    home,
    away,
    matchday: md,
  }));
}

export const ALL_MATCHES: Match[] = GROUPS.flatMap(generateGroupMatches);
