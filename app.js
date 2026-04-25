/* ==========================================
   ITUB UltraBalaton Tracker – App Logic
   ==========================================
   Data sources:
   - Historical XLSX data (2023, 2024, 2025) embedded below
   - Live 2026 data fetched from: 84095 (HTML file from ultrabalaton.hu)
   - 2025 reference from: 58720
*/

'use strict';

/* ---- EMBEDDED HISTORICAL DATA (from ITUB_RUN_APP.xlsx "Munka1") ----
   Each segment: {
     seg: segment number,
     dist: km,
     from: start checkpoint name,
     to: end checkpoint name,
     y2025_cum: cumulative seconds from start (null = N/A),
     y2025_split: section seconds (null = N/A),
     y2024_cum, y2024_split,
     y2023_cum, y2023_split
   }
*/
const HISTORICAL = [
  {
    seg: 1,
    "dist": 7.0,
    "from": "Rajt",
    "to": "Aszófő",
    "y2025_cum": 2399,
    "y2025_split": 2399,
    "y2024_cum": 1761,
    "y2024_split": 1761,
    "y2023_cum": 2142,
    "y2023_split": 2142
  },
  {
    seg: 2,
    "dist": 4.6,
    "from": "Aszófő",
    "to": "Fövenyes",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": 3139,
    "y2024_split": 1378,
    "y2023_cum": 3561,
    "y2023_split": 1419
  },
  {
    seg: 3,
    "dist": 4.5,
    "from": "Fövenyes",
    "to": "Balatonakali",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": null,
    "y2024_split": null,
    "y2023_cum": null,
    "y2023_split": null
  },
  {
    seg: 4,
    "dist": 3.3,
    "from": "Balatonakali",
    "to": "Zánka Erzsébet-tábor",
    "y2025_cum": 6605,
    "y2025_split": 4206,
    "y2024_cum": 5743,
    "y2024_split": 1229,
    "y2023_cum": 6074,
    "y2023_split": 1243
  },
  {
    seg: 5,
    "dist": 2.9,
    "from": "Zánka Erzsébet-tábor",
    "to": "Zánka",
    "y2025_cum": 7497,
    "y2025_split": 892,
    "y2024_cum": 6658,
    "y2024_split": 915,
    "y2023_cum": 6919,
    "y2023_split": 845
  },
  {
    seg: 6,
    "dist": 3.7,
    "from": "Zánka",
    "to": "Balatonszepezd",
    "y2025_cum": 8952,
    "y2025_split": 1455,
    "y2024_cum": 8143,
    "y2024_split": 1485,
    "y2023_cum": 8449,
    "y2023_split": 1530
  },
  {
    seg: 7,
    "dist": 3.2,
    "from": "Balatonszepezd",
    "to": "Révfülöp kelet",
    "y2025_cum": 10456,
    "y2025_split": 1504,
    "y2024_cum": null,
    "y2024_split": null,
    "y2023_cum": 9891,
    "y2023_split": 1442
  },
  {
    seg: 8,
    "dist": 1.9,
    "from": "Révfülöp kelet",
    "to": "Révfülöp nyugat",
    "y2025_cum": 11008,
    "y2025_split": 552,
    "y2024_cum": 9951,
    "y2024_split": 1559,
    "y2023_cum": 10391,
    "y2023_split": 500
  },
  {
    seg: 9,
    "dist": 5.2,
    "from": "Révfülöp nyugat",
    "to": "Ábrahámhegy",
    "y2025_cum": 12634,
    "y2025_split": 1626,
    "y2024_cum": 11598,
    "y2024_split": 1647,
    "y2023_cum": 12049,
    "y2023_split": 1658
  },
  {
    seg: 10,
    "dist": 3.2,
    "from": "Ábrahámhegy",
    "to": "Badacsonyörs Varga pincészet",
    "y2025_cum": 13583,
    "y2025_split": 949,
    "y2024_cum": 12454,
    "y2024_split": 856,
    "y2023_cum": 13018,
    "y2023_split": 969
  },
  {
    seg: 11,
    "dist": 5.1,
    "from": "Badacsonyörs Varga pincészet",
    "to": "Badacsony",
    "y2025_cum": 15093,
    "y2025_split": 1510,
    "y2024_cum": 13864,
    "y2024_split": 1410,
    "y2023_cum": 14598,
    "y2023_split": 1580
  },
  {
    seg: 12,
    "dist": 4.3,
    "from": "Badacsony",
    "to": "Badacsonytördemic",
    "y2025_cum": 16474,
    "y2025_split": 1381,
    "y2024_cum": 15143,
    "y2024_split": 1279,
    "y2023_cum": 16094,
    "y2023_split": 1496
  },
  {
    seg: 13,
    "dist": 2.9,
    "from": "Badacsonytördemic",
    "to": "Szigliget",
    "y2025_cum": 17188,
    "y2025_split": 714,
    "y2024_cum": 15719,
    "y2024_split": 576,
    "y2023_cum": 16799,
    "y2023_split": 705
  },
  {
    seg: 14,
    "dist": 5.0,
    "from": "Szigliget",
    "to": "Balatonederics",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": null,
    "y2024_split": null,
    "y2023_cum": null,
    "y2023_split": null
  },
  {
    seg: 15,
    "dist": 2.6,
    "from": "Balatonederics",
    "to": "Balatongyörök kelet",
    "y2025_cum": 19783,
    "y2025_split": 2595,
    "y2024_cum": 18052,
    "y2024_split": 2333,
    "y2023_cum": 19147,
    "y2023_split": 2348
  },
  {
    seg: 16,
    "dist": 2.8,
    "from": "Balatongyörök kelet",
    "to": "Balatongyörök nyugat",
    "y2025_cum": 20713,
    "y2025_split": 930,
    "y2024_cum": 18901,
    "y2024_split": 849,
    "y2023_cum": 19989,
    "y2023_split": 842
  },
  {
    seg: 17,
    "dist": 3.4,
    "from": "Balatongyörök nyugat",
    "to": "Vonyarcvashegy kelet",
    "y2025_cum": 21673,
    "y2025_split": 960,
    "y2024_cum": 19755,
    "y2024_split": 854,
    "y2023_cum": 20866,
    "y2023_split": 877
  },
  {
    seg: 18,
    "dist": 2.6,
    "from": "Vonyarcvashegy kelet",
    "to": "Gyenesdiás",
    "y2025_cum": 22532,
    "y2025_split": 859,
    "y2024_cum": 20437,
    "y2024_split": 682,
    "y2023_cum": 21770,
    "y2023_split": 904
  },
  {
    seg: 19,
    "dist": 1.7,
    "from": "Gyenesdiás",
    "to": "Keszthely kelet",
    "y2025_cum": 23184,
    "y2025_split": 652,
    "y2024_cum": 20887,
    "y2024_split": 450,
    "y2023_cum": 22440,
    "y2023_split": 670
  },
  {
    seg: 20,
    "dist": 3.1,
    "from": "Keszthely kelet",
    "to": "Keszthely nyugat",
    "y2025_cum": 24147,
    "y2025_split": 963,
    "y2024_cum": 21829,
    "y2024_split": 942,
    "y2023_cum": 23339,
    "y2023_split": 899
  },
  {
    seg: 21,
    "dist": 4.8,
    "from": "Keszthely nyugat",
    "to": "Fenékpuszta",
    "y2025_cum": 24441,
    "y2025_split": 1494,
    "y2024_cum": 24013,
    "y2024_split": 3244,
    "y2023_cum": 24429,
    "y2023_split": 1421
  },
  {
    seg: 22,
    "dist": 4.3,
    "from": "Fenékpuszta",
    "to": "Balatonberény nyugat",
    "y2025_cum": 25776,
    "y2025_split": 1335,
    "y2024_cum": 25389,
    "y2024_split": 1376,
    "y2023_cum": 25753,
    "y2023_split": 1324
  },
  {
    seg: 23,
    "dist": 2.9,
    "from": "Balatonberény nyugat",
    "to": "Balatonberény focipálya",
    "y2025_cum": 26717,
    "y2025_split": 941,
    "y2024_cum": 26217,
    "y2024_split": 828,
    "y2023_cum": null,
    "y2023_split": null
  },
  {
    seg: 24,
    "dist": 4.0,
    "from": "Balatonberény focipálya",
    "to": "Balatonmáriafürdő nyugat",
    "y2025_cum": 27976,
    "y2025_split": 1259,
    "y2024_cum": 27376,
    "y2024_split": 1159,
    "y2023_cum": 27832,
    "y2023_split": 2079
  },
  {
    seg: 25,
    "dist": 5.2,
    "from": "Balatonmáriafürdő nyugat",
    "to": "Balatonmáriafürdő kelet",
    "y2025_cum": 29669,
    "y2025_split": 1693,
    "y2024_cum": 29022,
    "y2024_split": 1646,
    "y2023_cum": 29509,
    "y2023_split": 1677
  },
  {
    seg: 26,
    "dist": 1.7,
    "from": "Balatonmáriafürdő kelet",
    "to": "Balatonfenyves nyugat",
    "y2025_cum": 30186,
    "y2025_split": 517,
    "y2024_cum": 29561,
    "y2024_split": 539,
    "y2023_cum": 30043,
    "y2023_split": 534
  },
  {
    seg: 27,
    "dist": 1.8,
    "from": "Balatonfenyves nyugat",
    "to": "Balatonfenyves kelet",
    "y2025_cum": 30785,
    "y2025_split": 599,
    "y2024_cum": 30109,
    "y2024_split": 548,
    "y2023_cum": 30634,
    "y2023_split": 591
  },
  {
    seg: 28,
    "dist": 4.6,
    "from": "Balatonfenyves kelet",
    "to": "Alsóbélatelep",
    "y2025_cum": 32325,
    "y2025_split": 1540,
    "y2024_cum": 31799,
    "y2024_split": 1690,
    "y2023_cum": 32099,
    "y2023_split": 1465
  },
  {
    seg: 29,
    "dist": 3.3,
    "from": "Alsóbélatelep",
    "to": "Fonyód",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": 32929,
    "y2024_split": 1130,
    "y2023_cum": 33274,
    "y2023_split": 1175
  },
  {
    seg: 30,
    "dist": 3.2,
    "from": "Fonyód",
    "to": "Fonyódliget",
    "y2025_cum": 34421,
    "y2025_split": 2096,
    "y2024_cum": 33979,
    "y2024_split": 1050,
    "y2023_cum": 34396,
    "y2023_split": 1122
  },
  {
    seg: 31,
    "dist": 5.3,
    "from": "Fonyódliget",
    "to": "Balatonboglár nyugat",
    "y2025_cum": 35765,
    "y2025_split": 1344,
    "y2024_cum": 35788,
    "y2024_split": 1809,
    "y2023_cum": 35961,
    "y2023_split": 1565
  },
  {
    seg: 32,
    "dist": 0.9,
    "from": "Balatonboglár nyugat",
    "to": "Balatonboglár kelet",
    "y2025_cum": 35994,
    "y2025_split": 229,
    "y2024_cum": 36049,
    "y2024_split": 261,
    "y2023_cum": 36240,
    "y2023_split": 279
  },
  {
    seg: 33,
    "dist": 3.2,
    "from": "Balatonboglár kelet",
    "to": "Balatonlelle nyugat",
    "y2025_cum": 36896,
    "y2025_split": 902,
    "y2024_cum": 37088,
    "y2024_split": 1039,
    "y2023_cum": 37316,
    "y2023_split": 1076
  },
  {
    seg: 34,
    "dist": 2.0,
    "from": "Balatonlelle nyugat",
    "to": "Balatonlelle kelet",
    "y2025_cum": 37514,
    "y2025_split": 618,
    "y2024_cum": 37737,
    "y2024_split": 649,
    "y2023_cum": 37984,
    "y2023_split": 668
  },
  {
    seg: 35,
    "dist": 5.2,
    "from": "Balatonlelle kelet",
    "to": "Balatonszemes",
    "y2025_cum": 39155,
    "y2025_split": 1641,
    "y2024_cum": 39323,
    "y2024_split": 1586,
    "y2023_cum": 39653,
    "y2023_split": 1669
  },
  {
    seg: 36,
    "dist": 2.1,
    "from": "Balatonszemes",
    "to": "Balatonőszöd",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": null,
    "y2024_split": null,
    "y2023_cum": null,
    "y2023_split": null
  },
  {
    seg: 37,
    "dist": 2.9,
    "from": "Balatonőszöd",
    "to": "Balatonszárszó",
    "y2025_cum": 40895,
    "y2025_split": 1740,
    "y2024_cum": 40785,
    "y2024_split": 1462,
    "y2023_cum": 41363,
    "y2023_split": 1710
  },
  {
    seg: 38,
    "dist": 3.5,
    "from": "Balatonszárszó",
    "to": "Balatonföldvár nyugat",
    "y2025_cum": 42089,
    "y2025_split": 1194,
    "y2024_cum": 41950,
    "y2024_split": 1165,
    "y2023_cum": 42403,
    "y2023_split": 1040
  },
  {
    seg: 39,
    "dist": 2.1,
    "from": "Balatonföldvár nyugat",
    "to": "Balatonföldvár kelet",
    "y2025_cum": 42693,
    "y2025_split": 604,
    "y2024_cum": 42619,
    "y2024_split": 669,
    "y2023_cum": 42856,
    "y2023_split": 453
  },
  {
    seg: 40,
    "dist": 2.2,
    "from": "Balatonföldvár kelet",
    "to": "Szántód",
    "y2025_cum": 43356,
    "y2025_split": 663,
    "y2024_cum": 43157,
    "y2024_split": 538,
    "y2023_cum": 43558,
    "y2023_split": 702
  },
  {
    seg: 41,
    "dist": 2.9,
    "from": "Szántód",
    "to": "Zamárdi",
    "y2025_cum": 44303,
    "y2025_split": 947,
    "y2024_cum": 44521,
    "y2024_split": 1364,
    "y2023_cum": 44497,
    "y2023_split": 939
  },
  {
    seg: 42,
    "dist": 5.3,
    "from": "Zamárdi",
    "to": "Balatonszéplak",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": null,
    "y2024_split": null,
    "y2023_cum": 46484,
    "y2023_split": 1987
  },
  {
    seg: 43,
    "dist": 2.2,
    "from": "Balatonszéplak",
    "to": "Siófok nyugat",
    "y2025_cum": 46734,
    "y2025_split": 2431,
    "y2024_cum": 47078,
    "y2024_split": 2557,
    "y2023_cum": 47096,
    "y2023_split": 612
  },
  {
    seg: 44,
    "dist": 3.3,
    "from": "Siófok nyugat",
    "to": "Siófok kampusz",
    "y2025_cum": 47862,
    "y2025_split": 1128,
    "y2024_cum": null,
    "y2024_split": null,
    "y2023_cum": null,
    "y2023_split": null
  },
  {
    seg: 45,
    "dist": 2.8,
    "from": "Siófok kampusz",
    "to": "Siófok kelet",
    "y2025_cum": 48745,
    "y2025_split": 883,
    "y2024_cum": 48674,
    "y2024_split": 1596,
    "y2023_cum": 48817,
    "y2023_split": 1721
  },
  {
    seg: 46,
    "dist": 4.5,
    "from": "Siófok kelet",
    "to": "Siófok-Sóstó",
    "y2025_cum": 50221,
    "y2025_split": 1476,
    "y2024_cum": 49974,
    "y2024_split": 1300,
    "y2023_cum": 50228,
    "y2023_split": 1411
  },
  {
    seg: 47,
    "dist": 2.6,
    "from": "Siófok-Sóstó",
    "to": "Balatonvilágos nyugat",
    "y2025_cum": 51410,
    "y2025_split": 1189,
    "y2024_cum": 51020,
    "y2024_split": 1046,
    "y2023_cum": 51309,
    "y2023_split": 1081
  },
  {
    seg: 48,
    "dist": 2.9,
    "from": "Balatonvilágos nyugat",
    "to": "Balatonvilágos kelet",
    "y2025_cum": 52207,
    "y2025_split": 797,
    "y2024_cum": 51803,
    "y2024_split": 783,
    "y2023_cum": 52058,
    "y2023_split": 749
  },
  {
    seg: 49,
    "dist": 5.0,
    "from": "Balatonvilágos kelet",
    "to": "Balatonakarattya",
    "y2025_cum": 53897,
    "y2025_split": 1690,
    "y2024_cum": 53632,
    "y2024_split": 1829,
    "y2023_cum": 53709,
    "y2023_split": 1651
  },
  {
    seg: 50,
    "dist": 6.0,
    "from": "Balatonakarattya",
    "to": "Balatonkenese",
    "y2025_cum": 55913,
    "y2025_split": 2016,
    "y2024_cum": 55682,
    "y2024_split": 2050,
    "y2023_cum": 55517,
    "y2023_split": 1808
  },
  {
    seg: 51,
    "dist": 5.5,
    "from": "Balatonkenese",
    "to": "Balatonfűzfő",
    "y2025_cum": 57686,
    "y2025_split": 1773,
    "y2024_cum": 57530,
    "y2024_split": 1848,
    "y2023_cum": 57567,
    "y2023_split": 2050
  },
  {
    seg: 52,
    "dist": 3.4,
    "from": "Balatonfűzfő",
    "to": "Tobruk",
    "y2025_cum": null,
    "y2025_split": null,
    "y2024_cum": 58609,
    "y2024_split": 1079,
    "y2023_cum": 58601,
    "y2023_split": 1034
  },
  {
    seg: 53,
    "dist": 3.0,
    "from": "Tobruk",
    "to": "Balatonalmádi kelet",
    "y2025_cum": 59955,
    "y2025_split": 2269,
    "y2024_cum": 59673,
    "y2024_split": 1064,
    "y2023_cum": 59630,
    "y2023_split": 1029
  },
  {
    seg: 54,
    "dist": 3.0,
    "from": "Balatonalmádi kelet",
    "to": "Balatonalmádi nyugat",
    "y2025_cum": 60866,
    "y2025_split": 911,
    "y2024_cum": 60667,
    "y2024_split": 994,
    "y2023_cum": 60382,
    "y2023_split": 752
  },
  {
    seg: 55,
    "dist": 5.9,
    "from": "Balatonalmádi nyugat",
    "to": "Alsóörs",
    "y2025_cum": 62836,
    "y2025_split": 1970,
    "y2024_cum": 62281,
    "y2024_split": 1614,
    "y2023_cum": 62258,
    "y2023_split": 1876
  },
  {
    seg: 56,
    "dist": 4.8,
    "from": "Alsóörs",
    "to": "Csopak",
    "y2025_cum": 64390,
    "y2025_split": 1554,
    "y2024_cum": 63831,
    "y2024_split": 1550,
    "y2023_cum": 63689,
    "y2023_split": 1431
  },
  {
    seg: 57,
    "dist": 4.2,
    "from": "Csopak",
    "to": "Balatonfüred kelet",
    "y2025_cum": 65709,
    "y2025_split": 1319,
    "y2024_cum": 65150,
    "y2024_split": 1319,
    "y2023_cum": 64842,
    "y2023_split": 1153
  },
  {
    seg: 58,
    "dist": 3.5,
    "from": "Balatonfüred kelet",
    "to": "RB Cél",
    "y2025_cum": 67028,
    "y2025_split": 1319,
    "y2024_cum": 66266,
    "y2024_split": 1116,
    "y2023_cum": 65911,
    "y2023_split": 1069
  },
  {
    seg: 59,
    "dist": 0.0,
    "from": "RB Cél",
    "to": "Cél",
    "y2025_cum": 67028,
    "y2025_split": 0,
    "y2024_cum": 66266,
    "y2024_split": 1116,
    "y2023_cum": 65911,
    "y2023_split": 1069
  }
]


// Live 2026 race data – served via local proxy (server.py) to avoid CORS
// Upstream: https://runtiming.hu/verseny/ub2026/ub2026-csapat13/versenyzo/84095
const LIVE_DATA_URL = '/api/live';
// Refresh interval (ms)
const REFRESH_INTERVAL_MS = 30000;

/* ---- STATE ---- */
let state = {
  live2026: [],          // parsed checkpoint data from 84095
  filteredMode: 'all',
  cumViewMode: 'km',
  splitChart: null,
  cumChart: null,
  paceChart: null,
  refreshTimer: null,
  clockInterval: null,   // setInterval for live ticking clock
  lastCumAtFetch: null,  // 2026 cumulative seconds at last successful fetch
  lastFetchWall: null,   // Date.now() at last successful fetch
};

/* ---- UTILITY ---- */
function fmtTime(sec) {
  if (sec == null) return 'N/A';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function fmtPace(sec, km) {
  if (sec == null || km == null || km === 0) return 'N/A';
  const paceSecPerKm = sec / km;
  const pm = Math.floor(paceSecPerKm / 60);
  const ps = Math.round(paceSecPerKm % 60);
  return `${pm}:${String(ps).padStart(2,'0')}/km`;
}

function fmtDiff(diffSec) {
  if (diffSec == null) return { text: 'N/A', cls: 'diff-na' };
  const abs = Math.abs(diffSec);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.floor(abs % 60);
  let str = '';
  if (h > 0) str = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  else str = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  if (diffSec < 0) return { text: `−${str}`, cls: 'diff-ahead' }; // faster than best
  return { text: `+${str}`, cls: 'diff-behind' };
}

function timeElapsed(clockStr) {
  // Parse "HH:MM:SS.d" to seconds since midnight
  if (!clockStr || clockStr.trim() === '') return null;
  const m = clockStr.match(/^(\d+):(\d+):(\d+)/);
  if (!m) return null;
  return parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]);
}

/* ---- PARSE live HTML ---- */
async function fetchLiveData() {
  try {
    const res = await fetch(LIVE_DATA_URL + '?_=' + Date.now(), { cache: 'no-store' });
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table');
    if (!table) return [];

    const rows = table.querySelectorAll('tr');
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td, th');
      if (cells.length < 7) continue;
      const name = cells[1].textContent.trim();
      const cumStr = cells[2].textContent.trim();
      const splitStr = cells[5].textContent.trim();
      const arrivalStr = cells[6].textContent.trim();

      function parseHMS(s) {
        if (!s) return null;
        const p = s.split(':');
        if (p.length === 3) return parseInt(p[0])*3600 + parseInt(p[1])*60 + parseFloat(p[2]);
        if (p.length === 2) return parseInt(p[0])*3600 + parseInt(p[1])*60;
        return null;
      }

      data.push({
        name,
        cum_time: parseHMS(cumStr),
        split_time: parseHMS(splitStr),
        arrival_clock: arrivalStr,
        position: cells[3].textContent.trim() || null,
      });
    }
    return data;
  } catch (e) {
    console.warn('Live fetch error:', e);
    return state.live2026; // keep previous
  }
}

/* ---- MAP live data to historical segments ---- */
function mapLiveToSegments(live) {
  // Build lookup: name -> cumulative seconds
  const lookup = {};
  for (const cp of live) {
    if (cp.name) lookup[cp.name.toLowerCase()] = cp.cum_time;
  }

  // Match segments to live data
  return HISTORICAL.map(seg => {
    const toName = seg.to.toLowerCase();
    let found = null;
    // Try exact match
    if (lookup[toName] !== undefined) {
      found = lookup[toName];
    } else {
      // Try partial match
      for (const k of Object.keys(lookup)) {
        if (k.includes(toName) || toName.includes(k)) {
          found = lookup[k];
          break;
        }
      }
    }
    return { ...seg, y2026_cum: found !== undefined ? found : null };
  });
}

/* ---- Compute split times from cumulative ---- */
function computeSplits(segments) {
  return segments.map((seg, i) => {
    let split2026 = null;
    if (seg.y2026_cum != null) {
      if (i === 0) {
        split2026 = seg.y2026_cum;
      } else {
        // Find previous non-null 2026 cum
        let prevCum = null;
        for (let j = i - 1; j >= 0; j--) {
          if (segments[j].y2026_cum != null) {
            prevCum = segments[j].y2026_cum;
            break;
          }
        }
        split2026 = prevCum != null ? seg.y2026_cum - prevCum : null;
      }
    }
    return { ...seg, y2026_split: split2026 };
  });
}

/**
 * Fill in ESTIMATED section times for segments where the checkpoint scanner
 * was missing (cum == null). Uses constant pace inferred from the nearest
 * surrounding known checkpoints and distributes time proportionally by km.
 * Sets [estFlagKey]=true on every segment whose split was estimated.
 *
 * Note: the "absorbing" segment (the first checkpoint *after* the gap that
 * has a recorded cumulative time) gets its split replaced too, because its
 * original split in the xlsx is the multi-segment total, not just that leg.
 */
function fillEstimated(segments, cumKey, splitKey, estFlagKey) {
  const n = segments.length;
  for (const s of segments) s[estFlagKey] = false;

  let i = 0;
  while (i < n) {
    if (segments[i][cumKey] == null || segments[i][estFlagKey]) {
      // Start of a gap (or already estimated): find bounding known indices
      // -- find the last truly-recorded (non-null, non-estimated) cum before i
      let prevIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (segments[j][cumKey] != null && !segments[j][estFlagKey]) { prevIdx = j; break; }
      }
      // -- find the next truly-recorded cum at or after i
      let nextIdx = n;
      for (let j = i; j < n; j++) {
        if (segments[j][cumKey] != null && !segments[j][estFlagKey]) { nextIdx = j; break; }
      }

      if (prevIdx >= 0 && nextIdx < n) {
        const prevCum = segments[prevIdx][cumKey];
        const nextCum = segments[nextIdx][cumKey];
        const gapTime = nextCum - prevCum;                    // total time for the gap
        const groupLen = nextIdx - prevIdx;                   // number of segments in gap

        // Total km for all segments in [prevIdx+1 .. nextIdx]
        let gapKm = 0;
        for (let k = prevIdx + 1; k <= nextIdx; k++) gapKm += segments[k].dist || 0;

        if (gapKm > 0 && gapTime > 0) {
          // Distribute time proportionally; keep running sum so cumulative stays exact
          let runningCum = prevCum;
          let allocatedTime = 0;
          for (let k = prevIdx + 1; k <= nextIdx; k++) {
            const isLast = (k === nextIdx);
            // Last segment absorbs any rounding remainder
            const estSplit = isLast
              ? gapTime - allocatedTime
              : Math.round(gapTime * (segments[k].dist || 0) / gapKm);
            runningCum += estSplit;
            allocatedTime += estSplit;
            segments[k][splitKey] = estSplit;
            // Keep actual recorded cumulative for the closing checkpoint; estimate the rest
            segments[k][cumKey] = isLast ? nextCum : runningCum;
            segments[k][estFlagKey] = true;
          }
        }
        i = nextIdx + 1;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
}

/** Apply fillEstimated for all years then return the processed segments array. */
function buildSegments(rawLive) {
  const segsWithCum = mapLiveToSegments(rawLive);
  // Must work on mutable copies – mapLiveToSegments already spreads, computeSplits maps
  const segments = computeSplits(segsWithCum);
  fillEstimated(segments, 'y2025_cum', 'y2025_split', 'y2025_est');
  fillEstimated(segments, 'y2024_cum', 'y2024_split', 'y2024_est');
  fillEstimated(segments, 'y2023_cum', 'y2023_split', 'y2023_est');
  fillEstimated(segments, 'y2026_cum', 'y2026_split', 'y2026_est');
  return segments;
}

/* ---- Compute best section split per segment across all years ---- */
// Only use *recorded* (non-estimated) splits so estimated guesses don't
// inflate what counts as "the best".
function getBestSplit(seg) {
  const candidates = [
    seg.y2025_est ? null : seg.y2025_split,
    seg.y2024_est ? null : seg.y2024_split,
    seg.y2023_est ? null : seg.y2023_split,
    seg.y2026_est ? null : seg.y2026_split,
  ].filter(v => v != null && v > 0);
  if (candidates.length === 0) return null;
  return Math.min(...candidates);
}

function getBestCum(seg) {
  const candidates = [seg.y2026_cum, seg.y2025_cum, seg.y2024_cum, seg.y2023_cum]
    .filter(v => v != null && v > 0);
  if (candidates.length === 0) return null;
  return Math.min(...candidates);
}

/* ---- Update UI ---- */
function updateUI(segments) {
  updateSummaryCards(segments);
  updateRouteProgress(segments);
  updateSegmentsTable(segments);
  updateCharts(segments);
}

/* ---- Live ticking clock ---- */
function startLiveClock() {
  stopLiveClock();
  if (state.lastCumAtFetch == null || state.lastFetchWall == null) return;
  const el = document.getElementById('val2026');
  state.clockInterval = setInterval(() => {
    const elapsed = state.lastCumAtFetch + (Date.now() - state.lastFetchWall) / 1000;
    el.textContent = fmtTime(Math.floor(elapsed));
  }, 1000);
}
function stopLiveClock() {
  if (state.clockInterval) { clearInterval(state.clockInterval); state.clockInterval = null; }
}

function updateSummaryCards(segments) {
  // Find last REAL (non-estimated) 2026 checkpoint and its index
  let last2026 = null, last2026Idx = -1;
  segments.forEach((seg, i) => {
    if (seg.y2026_cum != null && !seg.y2026_est) { last2026 = seg; last2026Idx = i; }
  });

  // --- Card 1: 2026 live ticking elapsed time ---
  const el2026 = document.getElementById('val2026');
  const sub2026 = document.getElementById('sub2026');
  if (last2026) {
    // Seed clock state (refreshed on every data pull)
    state.lastCumAtFetch = last2026.y2026_cum;
    state.lastFetchWall  = Date.now();
    el2026.textContent = fmtTime(last2026.y2026_cum);
    sub2026.textContent = `📍 ${last2026.to}`;
    startLiveClock();
  } else {
    stopLiveClock();
    el2026.textContent = '–';
    sub2026.textContent = 'Vár az indulásra';
  }

  // --- Card 2 & 3: compare AT THE SAME CHECKPOINT currently reached ---
  if (last2026Idx >= 0) {
    const refSeg = segments[last2026Idx];
    const loc = last2026.to;

    // 2025 cumulative at this same point
    const cum25 = refSeg.y2025_est ? null : refSeg.y2025_cum;
    document.getElementById('val2025').textContent = cum25 ? fmtTime(cum25) : '–';
    document.getElementById('sub2025').textContent = cum25
      ? `@ ${loc}  •  ${fmtDiff(last2026.y2026_cum - cum25).text}`
      : `Nincs adat @ ${loc}`;

    // Best year cumulative at this same point (only real, non-estimated values)
    const bestCandidates = [
      { year: 2025, cum: refSeg.y2025_est ? null : refSeg.y2025_cum },
      { year: 2024, cum: refSeg.y2024_est ? null : refSeg.y2024_cum },
      { year: 2023, cum: refSeg.y2023_est ? null : refSeg.y2023_cum },
    ].filter(v => v.cum != null);
    if (bestCandidates.length) {
      const best = bestCandidates.reduce((a, b) => a.cum < b.cum ? a : b);
      document.getElementById('valBest').textContent = fmtTime(best.cum);
      document.getElementById('subBest').textContent =
        `${best.year} @ ${loc}  •  ${fmtDiff(last2026.y2026_cum - best.cum).text}`;
    } else {
      document.getElementById('valBest').textContent = '–';
      document.getElementById('subBest').textContent = `Nincs adat @ ${loc}`;
    }
  } else {
    // Race hasn't started yet — show nothing meaningful
    document.getElementById('val2025').textContent = '–';
    document.getElementById('sub2025').textContent = 'Vár az indulásra';
    document.getElementById('valBest').textContent = '–';
    document.getElementById('subBest').textContent = '–';
  }

  // --- Card 4: progress ---
  const completedSegs = segments.filter(s => s.y2026_cum != null && !s.y2026_est).length;
  const pct = Math.round(completedSegs / segments.length * 100);
  document.getElementById('valProgress').textContent = `${pct}%`;
  document.getElementById('subProgress').textContent = `${completedSegs}/${segments.length} pont`;
}

function getTotalDist(segments) {
  return segments.reduce((s, seg) => s + (seg.dist || 0), 0);
}

function getCumulativeDist(segments) {
  let cumDist = 0;
  return segments.map(seg => {
    cumDist += seg.dist || 0;
    return cumDist;
  });
}

function updateRouteProgress(segments) {
  const totalDist = getTotalDist(segments);
  const cumDists = getCumulativeDist(segments);
  let lastCompletedIdx = -1;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].y2026_cum != null) lastCompletedIdx = i;
  }

  let progressDist = lastCompletedIdx >= 0 ? cumDists[lastCompletedIdx] : 0;
  const pct = Math.min(100, (progressDist / totalDist) * 100);

  document.getElementById('routeFill').style.width = pct + '%';
  document.getElementById('routeMarker').style.left = pct + '%';

  // Checkpoint dots
  const dotsEl = document.getElementById('checkpointDots');
  dotsEl.innerHTML = '';
  segments.forEach((seg, i) => {
    const dot = document.createElement('div');
    dot.className = 'chk-dot';
    dot.title = `${seg.seg}. ${seg.to}`;
    if (seg.y2026_cum != null) dot.classList.add('completed');
    else if (seg.y2025_cum == null && seg.y2024_cum == null) dot.classList.add('no-data');
    dotsEl.appendChild(dot);
  });
}

// Helper: render a time cell, handling both recorded and estimated values
// extraClass: optional additional CSS class (e.g. 'col-2024' for mobile hiding)
function timeCell(split, isEst, baseClass, extraClass = '') {
  const extra = extraClass ? ` ${extraClass}` : '';
  if (split == null) return `<td class="col-time time-na${extra}">–</td>`;
  const cls = isEst ? `${baseClass}-est` : baseClass;
  const prefix = isEst ? '~' : '';
  const tooltip = isEst ? ' title="Becsült érték (hiányzó ellenőrzőpont)"' : '';
  return `<td class="col-time ${cls}${extra}"${tooltip}>${prefix}${fmtTime(split)}</td>`;
}

function updateSegmentsTable(segments) {
  const tbody = document.getElementById('segmentsBody');
  tbody.innerHTML = '';

  segments.forEach((seg, i) => {
    const bestSplit = getBestSplit(seg);  // only uses non-estimated splits
    // For diff: only compare if 2026 is real (non-estimated)
    const diff = seg.y2026_split != null && !seg.y2026_est && bestSplit != null
      ? seg.y2026_split - bestSplit
      : null;
    const diffFmt = fmtDiff(diff);

    const isActive = seg.y2026_cum != null && !seg.y2026_est &&
      (i === segments.length - 1 || segments[i + 1].y2026_cum == null || segments[i + 1].y2026_est);

    // Best split label: show which year is the reference
    const bestYearLabel = (() => {
      if (bestSplit == null) return '';
      const map = [
        { y: 2026, s: seg.y2026_split, est: seg.y2026_est },
        { y: 2025, s: seg.y2025_split, est: seg.y2025_est },
        { y: 2024, s: seg.y2024_split, est: seg.y2024_est },
        { y: 2023, s: seg.y2023_split, est: seg.y2023_est },
      ].filter(x => x.s === bestSplit && !x.est);
      return map.length ? `<span class="best-year-tag">${map[0].y}</span>` : '';
    })();

    // Pace: prefer real 2026, then real 2025
    const paceSec = seg.y2026_split != null && !seg.y2026_est ? seg.y2026_split
      : (seg.y2025_split != null && !seg.y2025_est ? seg.y2025_split : null);

    const row = document.createElement('tr');
    row.dataset.idx = i;
    if (isActive) row.classList.add('row-active-segment');
    if (seg.y2026_split != null && !seg.y2026_est) row.dataset.status = 'completed';
    if (diff != null && diff < 0) row.dataset.dir = 'ahead';
    else if (diff != null && diff >= 0) row.dataset.dir = 'behind';

    row.innerHTML = `
      <td class="seg-num">${seg.seg}</td>
      <td>
        <span class="seg-name">${seg.to}${isActive ? '<span class="active-badge">ÉLŐBEN</span>' : ''}</span>
        <span class="seg-from">${seg.from}</span>
      </td>
      <td class="col-dist">${seg.dist}</td>
      ${timeCell(seg.y2026_split, seg.y2026_est, 'time-2026')}
      ${timeCell(seg.y2025_split, seg.y2025_est, 'time-2025')}
      ${timeCell(seg.y2024_split, seg.y2024_est, 'time-2024', 'col-2024')}
      ${timeCell(seg.y2023_split, seg.y2023_est, 'time-2023', 'col-2023')}
      <td class="col-diff ${diffFmt.cls}">${diffFmt.text}${bestYearLabel}</td>
      <td class="col-pace">${fmtPace(paceSec, seg.dist)}</td>
    `;
    tbody.appendChild(row);
  });

  applyFilter(state.filteredMode);
  if (document.querySelector('.row-active-segment')) {
    document.querySelector('.row-active-segment').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function applyFilter(mode) {
  state.filteredMode = mode;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const btnMap = { all: 0, completed: 1, ahead: 2, behind: 3 };
  const btns = document.querySelectorAll('.filter-btn');
  if (btns[btnMap[mode]]) btns[btnMap[mode]].classList.add('active');

  document.querySelectorAll('#segmentsBody tr').forEach(tr => {
    if (mode === 'all') { tr.classList.remove('row-hidden'); return; }
    if (mode === 'completed') {
      tr.classList.toggle('row-hidden', tr.dataset.status !== 'completed');
    } else if (mode === 'ahead') {
      tr.classList.toggle('row-hidden', tr.dataset.dir !== 'ahead');
    } else if (mode === 'behind') {
      tr.classList.toggle('row-hidden', tr.dataset.dir !== 'behind');
    }
  });
}

function filterSegments(mode) { applyFilter(mode); }

/* ---- CHARTS ---- */
const CHART_OPTS_BASE = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,12,30,0.95)',
      borderColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      titleColor: '#f0f4ff',
      bodyColor: 'rgba(240,244,255,0.7)',
      padding: 12,
      cornerRadius: 10,
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: 'rgba(240,244,255,0.45)', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: {
        color: 'rgba(240,244,255,0.45)',
        font: { size: 11 },
        callback: v => fmtTime(v),
      }
    }
  }
};

function updateCharts(segments) {
  updateSplitChart(segments);
  updateCumChart(segments);
  updatePaceChart(segments);
}

function updateSplitChart(segments) {
  const labels = segments.map(s => s.to);
  const split2026 = segments.map(s => s.y2026_split);
  const split2025 = segments.map(s => s.y2025_split);
  const splitBest = segments.map(s => getBestSplit(s));

  const ctx = document.getElementById('splitChart').getContext('2d');
  if (state.splitChart) state.splitChart.destroy();

  state.splitChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '2025',
          data: split2025,
          backgroundColor: 'rgba(255,123,84,0.35)',
          borderColor: 'rgba(255,123,84,0.7)',
          borderWidth: 1,
          borderRadius: 3,
          order: 3,
        },
        {
          label: 'Legjobb',
          data: splitBest,
          type: 'line',
          borderColor: '#fbbf24',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 0,
          tension: 0.3,
          order: 1,
        },
        {
          label: '2026',
          data: split2026,
          backgroundColor: 'rgba(0,212,255,0.55)',
          borderColor: 'rgba(0,212,255,0.9)',
          borderWidth: 1,
          borderRadius: 4,
          order: 2,
        },
      ]
    },
    options: {
      ...CHART_OPTS_BASE,
      plugins: {
        ...CHART_OPTS_BASE.plugins,
        tooltip: {
          ...CHART_OPTS_BASE.plugins.tooltip,
          callbacks: {
            label: ctx => {
              const v = ctx.raw;
              return v != null ? `${ctx.dataset.label}: ${fmtTime(v)}` : `${ctx.dataset.label}: N/A`;
            }
          }
        }
      },
      scales: {
        ...CHART_OPTS_BASE.scales,
        x: { ...CHART_OPTS_BASE.scales.x, ticks: { display: false } },
      }
    }
  });
}

function updateCumChart(segments) {
  const cumDists = getCumulativeDist(segments);
  const useKm = state.cumViewMode === 'km';
  const labels = useKm
    ? cumDists.map(d => d.toFixed(1) + ' km')
    : segments.map(s => s.to);

  const ctx = document.getElementById('cumChart').getContext('2d');
  if (state.cumChart) state.cumChart.destroy();

  const datasets = [];
  const years = [
    { key: 'y2025_cum', label: '2025', color: 'rgba(255,123,84,0.8)', fill: 'rgba(255,123,84,0.08)' },
    { key: 'y2024_cum', label: '2024', color: 'rgba(167,139,250,0.8)', fill: 'rgba(167,139,250,0.06)' },
    { key: 'y2023_cum', label: '2023', color: 'rgba(74,222,128,0.7)', fill: 'rgba(74,222,128,0.06)' },
  ];

  for (const yr of years) {
    datasets.push({
      label: yr.label,
      data: segments.map(s => s[yr.key]),
      borderColor: yr.color,
      backgroundColor: yr.fill,
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.3,
      fill: false,
      spanGaps: true,
    });
  }

  // 2026 on top
  datasets.push({
    label: '2026 (Élő)',
    data: segments.map(s => s.y2026_cum),
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(0,212,255,0.12)',
    borderWidth: 3,
    pointRadius: 3,
    pointBackgroundColor: '#00d4ff',
    tension: 0.3,
    fill: false,
    spanGaps: true,
  });

  state.cumChart = new Chart(document.getElementById('cumChart').getContext('2d'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      ...CHART_OPTS_BASE,
      plugins: {
        ...CHART_OPTS_BASE.plugins,
        tooltip: {
          ...CHART_OPTS_BASE.plugins.tooltip,
          callbacks: {
            label: ctx => {
              const v = ctx.raw;
              return v != null ? `${ctx.dataset.label}: ${fmtTime(v)}` : null;
            }
          }
        }
      },
      scales: {
        ...CHART_OPTS_BASE.scales,
        x: { ...CHART_OPTS_BASE.scales.x, ticks: { display: false } },
      }
    }
  });
}

function updatePaceChart(segments) {
  const labels = segments.map(s => s.to);
  const pace2026 = segments.map(s => s.y2026_split != null && s.dist ? s.y2026_split / s.dist / 60 : null);
  const pace2025 = segments.map(s => s.y2025_split != null && s.dist ? s.y2025_split / s.dist / 60 : null);
  const pace2024 = segments.map(s => s.y2024_split != null && s.dist ? s.y2024_split / s.dist / 60 : null);

  const ctx = document.getElementById('paceChart').getContext('2d');
  if (state.paceChart) state.paceChart.destroy();

  state.paceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '2024', data: pace2024, borderColor: 'rgba(167,139,250,0.7)', backgroundColor: 'transparent', borderWidth: 1.5, pointRadius: 0, tension: 0.4, spanGaps: true },
        { label: '2025', data: pace2025, borderColor: 'rgba(255,123,84,0.8)', backgroundColor: 'transparent', borderWidth: 2, pointRadius: 0, tension: 0.4, spanGaps: true },
        { label: '2026', data: pace2026, borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.1)', borderWidth: 3, pointRadius: 3, pointBackgroundColor: '#00d4ff', tension: 0.4, spanGaps: true, fill: false },
      ]
    },
    options: {
      ...CHART_OPTS_BASE,
      plugins: {
        ...CHART_OPTS_BASE.plugins,
        tooltip: {
          ...CHART_OPTS_BASE.plugins.tooltip,
          callbacks: {
            label: ctx => {
              const v = ctx.raw;
              if (v == null) return null;
              const m = Math.floor(v);
              const s = Math.round((v - m) * 60);
              return `${ctx.dataset.label}: ${m}:${String(s).padStart(2,'0')}/km`;
            }
          }
        }
      },
      scales: {
        ...CHART_OPTS_BASE.scales,
        x: { ...CHART_OPTS_BASE.scales.x, ticks: { display: false } },
        y: {
          ...CHART_OPTS_BASE.scales.y,
          reverse: false,
          ticks: {
            color: 'rgba(240,244,255,0.45)',
            font: { size: 11 },
            callback: v => {
              const m = Math.floor(v);
              const s = Math.round((v - m) * 60);
              return `${m}:${String(s).padStart(2,'0')}`;
            }
          }
        }
      }
    }
  });
}

function toggleCumView(mode) {
  state.cumViewMode = mode;
  document.getElementById('btnCumKm').classList.toggle('active', mode === 'km');
  document.getElementById('btnCumSeg').classList.toggle('active', mode === 'seg');
  const allSegs = computeSplits(mapLiveToSegments(state.live2026));
  updateCumChart(allSegs);
}

/* ---- Refresh ---- */
async function refreshData() {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('spinning');

  try {
    const live = await fetchLiveData();
    state.live2026 = live;
    const segments = buildSegments(live);   // estimation happens inside
    updateUI(segments);

    const now = new Date();
    document.getElementById('lastRefresh').textContent =
      now.getHours().toString().padStart(2,'0') + ':' +
      now.getMinutes().toString().padStart(2,'0') + ':' +
      now.getSeconds().toString().padStart(2,'0');

    // Live indicator: only light up if there is real (non-estimated) 2026 data
    const hasRealData = segments.some(s => s.y2026_cum != null && !s.y2026_est);
    const liveEl = document.getElementById('liveIndicator');
    const labelEl = liveEl.querySelector('.live-label');
    if (hasRealData) {
      liveEl.classList.remove('waiting');
      labelEl.textContent = 'ÉLŐ';
    } else {
      liveEl.classList.add('waiting');
      labelEl.textContent = 'VÁR';
    }
  } finally {
    btn.classList.remove('spinning');
  }
}

/* ---- Bootstrap no-live mode (before first fetch) ---- */
function bootstrapNoLive() {
  // Just show historical data while waiting for live; no y2026 yet
  const segments = buildSegments([]);
  updateUI(segments);
}

/* ---- Init ---- */
async function init() {
  bootstrapNoLive();
  await refreshData();
  state.refreshTimer = setInterval(refreshData, REFRESH_INTERVAL_MS);
}

window.addEventListener('DOMContentLoaded', init);
