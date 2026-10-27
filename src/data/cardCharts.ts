// The two chart tiles each project card plays: one with the numbers behind the problem, one with the result.
// Every value is copied from that project's scroll story (src/components/stories/), which cites its sources.
import type { Lang } from '../i18n/content';
import silverstone from './stories/silverstone.json';

type Tone = 'hl' | 'bad' | undefined;
export type Row = { l: string; v: number; d: string; tone?: Tone };
export type Chart =
  | { kind: 'bars'; h: string; note: string; rows: Row[]; min?: number; max: number }
  | { kind: 'cols'; h: string; note: string; rows: Row[]; max: number }
  | { kind: 'range'; h: string; note: string; lo: string; hi: string; mid: string; at: number }
  | { kind: 'stack'; h: string; note: string; parts: Row[]; marks: Row[] }
  | { kind: 'stats'; h: string; note: string; rows: { v: string; l: string }[] }
  | { kind: 'groups'; h: string; note: string; groups: { l: string; items: string[]; tone?: Tone }[] }
  | { kind: 'waffle'; h: string; note: string; n: number; k: number; cols: number }
  | { kind: 'scatter'; h: string; note: string; x: string; y: string; pts: [number, number][]; zero: number };

export function cardCharts(lang: Lang): Record<string, [Chart, Chart]> {
  const de = lang === 'de';
  const n = (en: string, d: string) => (de ? d : en);
  // the stints on the story's own scale (212 to 250 km/h, ±1.5 s), mapped to 0..1
  const pts = silverstone.stints
    .filter((s) => s.v >= 212 && s.v <= 250 && Math.abs(s.g) <= 1.5)
    .map((s) => [(s.v - 212) / 38, (s.g + 1.5) / 3] as [number, number]);
  return {
    'jumo-laser-trimming': [
      { kind: 'bars', h: n('47,115 substrates. 2,737 graded orders.', '47.115 Substrate. 2.737 bewertete Aufträge.'), note: n('Rows per file', 'Zeilen je Datei'), max: 47115, rows: [
        { l: 'Substrate', v: 47115, d: n('47,115', '47.115') },
        { l: 'Sputter', v: 46828, d: n('46,828', '46.828') },
        { l: 'Laser', v: 37118, d: n('37,118', '37.118') },
        { l: n('Screen print', 'Siebdruck'), v: 3121, d: n('3,121', '3.121') },
        { l: n('Selection', 'Selektion'), v: 2737, d: n('2,737', '2.737'), tone: 'hl' },
      ] },
      { kind: 'bars', h: n('5× lower error.', '5× weniger Fehler.'), note: n('RMSE, lower is better · 99.63% inside ±0.1', 'RMSE, weniger ist besser · 99,63 % innerhalb ±0,1'), max: 0.1044, rows: [
        { l: n('Linear baseline', 'Lineare Baseline'), v: 0.1044, d: n('0.1044', '0,1044') },
        { l: 'XGBoost (NCTr)', v: 0.0202, d: n('0.0202', '0,0202'), tone: 'hl' },
      ] },
    ],
    'windmill-pitch-prediction': [
      { kind: 'bars', h: n('33.95% → 1.11%.', '33,95 % → 1,11 %.'), note: n('Error on the blade angle (MAPE)', 'Fehler beim Blattwinkel (MAPE)'), max: 33.95, rows: [
        { l: n('Linear regression', 'Lineare Regression'), v: 33.95, d: n('33.95%', '33,95 %'), tone: 'bad' },
        { l: 'XGBoost', v: 1.38, d: n('1.38%', '1,38 %') },
        { l: n('XGBoost + correction', 'XGBoost + Korrektur'), v: 1.11, d: n('1.11%', '1,11 %'), tone: 'hl' },
      ] },
      { kind: 'cols', h: n('+21% energy.', '+21 % Energie.'), note: n('kWh, sample day (paper)', 'kWh, Beispieltag (Paper)'), max: 1019.41, rows: [
        { l: n('Before', 'Vorher'), v: 841.54, d: n('841.54', '841,54') },
        { l: n('After', 'Nachher'), v: 1019.41, d: n('1,019.41', '1.019,41'), tone: 'hl' },
      ] },
    ],
    'supply-chain-intelligence': [
      { kind: 'range', h: n('How many orders next week?', 'Wie viele Bestellungen nächste Woche?'), note: n('Orders a week · 86 weeks · Jan 2017 to Aug 2018', 'Bestellungen pro Woche · 86 Wochen · Jan. 2017 bis Aug. 2018'),
        lo: '46', hi: n('2,979', '2.979'), mid: n('1,142 on average', 'im Schnitt 1.142'), at: (1142 - 46) / (2979 - 46) },
      { kind: 'bars', h: n('Simple structure won.', 'Einfache Struktur gewann.'), note: n('Forecast error (MAPE), lower is better', 'Prognosefehler (MAPE), weniger ist besser'), max: 31, rows: [
        { l: 'SARIMA', v: 18.5, d: n('18.5%', '18,5 %'), tone: 'hl' },
        { l: n('Same as last week', 'Wie letzte Woche'), v: 25.82, d: n('25.82%', '25,82 %') },
        { l: n('4 week average', '4 Wochen Schnitt'), v: 25.85, d: n('25.85%', '25,85 %') },
        { l: 'XGBoost', v: 26.93, d: n('26.93%', '26,93 %'), tone: 'bad' },
        { l: 'Holt-Winters', v: 30.55, d: n('30.55%', '30,55 %') },
      ] },
    ],
    'luxury-concierge': [
      { kind: 'cols', h: n('The model ignored the budget.', 'Das Modell ignorierte das Budget.'), note: n('A 95,000 commission stayed in with 65,000 left', 'Eine Sonderanfertigung für 95.000 blieb drin, bei 65.000 Budget'), max: 95000, rows: [
        { l: n('Budget left', 'Budget übrig'), v: 65000, d: n('65,000', '65.000'), tone: 'hl' },
        { l: n('Commission kept', 'Sonderanfertigung'), v: 95000, d: n('95,000', '95.000'), tone: 'bad' },
      ] },
      { kind: 'stats', h: n('Every rule is checked offline.', 'Jede Regel wird offline geprüft.'), note: n('Prices, dates and budgets are enforced in Python', 'Preise, Termine und Budgets setzt Python durch'), rows: [
        { v: '20', l: n('tests', 'Tests') }, { v: n('1.5 s', '1,5 s'), l: n('to run', 'Laufzeit') }, { v: '0', l: n('tokens', 'Tokens') },
      ] },
    ],
    'finguard-payops': [
      { kind: 'stack', h: n('This one scores 85.', 'Diese hier: 85 Punkte.'), note: n('Risk points · 70 review · 90 block', 'Risikopunkte · 70 Prüfung · 90 Sperre'),
        parts: [
          { l: n('unverified', 'unverifiziert'), v: 35, d: '35' },
          { l: n('over €5,000', 'über 5.000 €'), v: 30, d: '30' },
          { l: n('new payee', 'neu'), v: 20, d: '20' },
        ],
        marks: [{ l: n('review', 'Prüfung'), v: 70, d: '70' }, { l: n('block', 'Sperre'), v: 90, d: '90', tone: 'bad' }] },
      { kind: 'groups', h: n('A whole platform around it.', 'Eine ganze Plattform drumherum.'), note: n('An audit log of every step', 'Ein Audit Log jedes Schritts'), groups: [
        { l: n('Payments', 'Zahlungen'), items: ['Java', 'Spring Boot', 'PostgreSQL'] },
        { l: n('Risk', 'Risiko'), items: [n('Python scoring', 'Python Scoring'), n('7 rules', '7 Regeln')], tone: 'hl' },
        { l: n('Operations', 'Betrieb'), items: [n('React dashboard', 'React Dashboard'), 'Audit Log'] },
      ] },
    ],
    'defi-farmer-platform': [
      { kind: 'groups', h: n('Only what must not change goes on chain.', 'Nur Unveränderliches kommt auf die Blockchain.'), note: n('Linked by the on-chain ID', 'Verknüpft über die ID auf der Blockchain'), groups: [
        { l: n('Database', 'Datenbank'), items: [n('Accounts', 'Konten'), n('Listings', 'Angebote'), n('Orders', 'Bestellungen')] },
        { l: 'Ethereum', items: [n('Product batch', 'Produktcharge'), n('Sale status', 'Verkaufsstatus')], tone: 'hl' },
      ] },
      { kind: 'cols', h: n('From under 50% to about 80%.', 'Von unter 50 % auf etwa 80 %.'), note: n('Use of digital records, published model · IEEE 2024', 'Nutzung digitaler Nachweise, Modell · IEEE 2024'), max: 0.8, rows: [
        { l: n('Before', 'Vorher'), v: 0.5, d: n('<50%', '<50 %') },
        { l: n('With the platform', 'Mit Plattform'), v: 0.8, d: n('≈80%', '≈80 %'), tone: 'hl' },
      ] },
    ],
    'aviation-delay-ontology': [
      { kind: 'bars', h: n('Almost one in three.', 'Fast jeder dritte Flug.'), note: n('Share of flights delayed · June 2018', 'Anteil verspäteter Flüge · Juni 2018'), max: 40, rows: [
        { l: 'Atlanta', v: 24, d: n('24%', '24 %') },
        { l: "O'Hare", v: 32, d: n('32%', '32 %'), tone: 'bad' },
      ] },
      { kind: 'cols', h: n("O'Hare: 21.1 minutes late.", "O'Hare: 21,1 Minuten zu spät."), note: n('Average arrival delay, minutes · 63,029 flights', 'Durchschnittliche Ankunftsverspätung, Minuten · 63.029 Flüge'), max: 21.1, rows: [
        { l: 'Atlanta', v: 13.6, d: n('13.6', '13,6') },
        { l: "O'Hare", v: 21.1, d: n('21.1', '21,1'), tone: 'bad' },
      ] },
    ],
    'silverstone-telemetry': [
      { kind: 'bars', h: n('Who got the most from the battery?', 'Wer holte am meisten aus der Batterie?'), note: n('Gain over teammate (km/h)', 'Vorsprung gegenüber dem Teamkollegen (km/h)'), max: 7.89,
        rows: silverstone.teammates.slice(0, 4).map((t, i) => ({ l: `${t.lead} · ${t.team}`, v: t.gap, d: '+' + t.gap.toLocaleString(de ? 'de-DE' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), tone: i === 0 ? 'hl' as const : undefined })) },
      { kind: 'scatter', h: n('r = −0.04. No link.', 'r = −0,04. Kein Zusammenhang.'), note: n('Each dot is one stint', 'Jeder Punkt ist ein Stint'),
        x: n('Speed before braking', 'Tempo vor dem Bremspunkt'), y: n('Tyre wear', 'Reifenabbau'), pts, zero: 0.5 },
    ],
    'employee-attrition': [
      { kind: 'waffle', h: n('237 of 1,470 people left.', '237 von 1.470 Menschen gingen.'), note: n('IBM HR data · 16.1% left', 'IBM Personaldaten · 16,1 % gingen'), n: 1470, k: 237, cols: 70 },
      { kind: 'bars', h: n('The simplest model won.', 'Das einfachste Modell gewann.'), note: n('AUC, higher is better · 0.5 is a coin flip', 'AUC, höher ist besser · 0,5 ist ein Münzwurf'), min: 0.5, max: 0.85, rows: [
        { l: n('Logistic regression', 'Logistische Regression'), v: 0.7983, d: n('0.80', '0,80'), tone: 'hl' },
        { l: 'Gradient boosting', v: 0.7847, d: n('0.78', '0,78') },
        { l: 'Random Forest', v: 0.7721, d: n('0.77', '0,77') },
        { l: n('Decision tree', 'Entscheidungsbaum'), v: 0.6629, d: n('0.66', '0,66') },
      ] },
    ],
  };
}
