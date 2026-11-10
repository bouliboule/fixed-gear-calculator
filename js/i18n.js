const ORIGINAL = 'https://www.surplace.fr/ffgc/';
const ARCHIVE = 'https://web.archive.org/web/20260414030900/https://www.surplace.fr/ffgc/';
const a = (href, text) => `<a href="${href}" rel="noopener">${text}</a>`;
const EMAIL = 'bouliworks@gmail.com';
const mail = subject => `<a href="mailto:${EMAIL}?subject=${encodeURIComponent(subject)}">${EMAIL}</a>`;

export const STRINGS = {
  en: {
    tributeTitle: 'This is a preservation copy, not an original work.',
    tributeBody: `Everything here is the work of the <strong>SURPLACE team</strong> and their
      <em>Fantastic Fixed Gear Calculator</em> (${a(ORIGINAL, 'surplace.fr/ffgc')}).
      It is rebuilt only to keep their calculator available to the fixed gear community in case
      the original goes down. All credit goes to them. If the original is online, please use it.
      ${a(ARCHIVE, 'Archived original')}.`,
    title: 'Fixed Gear Calculator',
    subtitle: 'After SURPLACE\'s Fantastic Fixed Gear Calculator',
    language: 'Language', units: 'Units', metric: 'Metric', imperial: 'Imperial', about: 'About',
    gear: 'Gear', ring: 'Chainring', sprocket: 'Sprocket', tire: 'Tire',
    custom: 'Custom: circumference or ETRTO…', customLabel: 'Circumference (mm) or ETRTO',
    ambi: 'Ambidextrous skid', fewer: 'Fewer teeth', more: 'More teeth', teeth: 't',
    analysis: 'Analysis', ratio: 'Ratio', patches: 'Skid patches',
    single: 'single', ambidextrous: 'ambidextrous', noGain: 'no ambidextrous gain',
    development: 'Development', gearInches: 'Gear inches', devShort: 'development',
    speed: 'Cadence / Speed', at: '@', rpm: 'rpm',
    equivalents: 'Equivalent gears ±2 %',
    eqLegend: 'Second number = skid patches. Gears in pink spread tire wear better than yours. Tap one to load it.',
    drawing: (p, amb) => amb ? `Wheel with ${p} skid patches, ${amb} with ambidextrous skidding` : `Wheel with ${p} skid patches`,
    footer: `All credit: ${a(ORIGINAL, 'SURPLACE')} (the calculator) ·
      ${a('https://www.sheldonbrown.com/', 'Sheldon Brown')} (tire data, gear theory) ·
      lajalousie (ambidextrous method) · ${a('https://github.com/bouliboule/fixed-gear-calculator', 'Source')} · Public domain<br>
      Takedown or correction request: ${mail('Fixed Gear Calculator: takedown / correction')}`,
    close: 'Close',
    help: {
      ratio: ['Ratio', `<p>Chainring teeth divided by sprocket teeth: how many times the rear wheel turns for each turn of the pedals.</p>
        <p>As a rough guide:</p><ul><li>below 1.9: bike polo</li><li>1.9 – 2.3: lots of steep hills</li>
        <li>2.3 – 2.7: all-round</li><li>above 2.7: fast on the flat (mind your knees)</li></ul>`],
      patches: ['Skid patches', `<p>When you skid, your feet — and the cranks — always stop in the same positions,
        so the tire wears at a fixed number of spots: the skid patches. More patches means more even wear.</p>
        <p>Ambidextrous skidders (either foot forward) double the count when the reduced chainring number is odd.</p>`],
      development: ['Development', '<p>The distance the bike travels for each full turn of the pedals.</p>'],
      gearInches: ['Gear inches', `<p>Sheldon Brown's convention: the ratio multiplied by the wheel diameter in inches,
        as if it were a direct-drive high wheeler.</p>`],
    },
    aboutTitle: 'About',
    aboutBody: `<p><strong>This is not an original work.</strong> It preserves the <em>Fantastic Fixed Gear Calculator</em>,
      made by the ${a('https://www.surplace.fr/', 'SURPLACE')} team. It exists only so their calculator stays
      available if ${a(ORIGINAL, 'the original')} goes down. All credit belongs to them.</p>
      <p>Tire circumferences come from ${a('https://www.sheldonbrown.com/', 'Sheldon Brown')}'s website.
      The ambidextrous skid patch method was corrected by lajalousie.</p>
      <p>The code is a clean rewrite released into the public domain.</p>
      <p><strong>Want this page changed or taken down?</strong> If you are part of the SURPLACE team,
      or have any other concern, email ${mail('Fixed Gear Calculator: takedown / correction')}.
      It will be done promptly, no questions asked.</p>`,
  },
  fr: {
    tributeTitle: 'Ceci est une copie de sauvegarde, pas une œuvre originale.',
    tributeBody: `Tout le mérite revient à l'<strong>équipe SURPLACE</strong> et à leur
      <em>Fantastic Fixed Gear Calculator</em> (${a(ORIGINAL, 'surplace.fr/ffgc')}).
      Il est reconstruit uniquement pour que la communauté pignon fixe garde accès à leur calculateur
      si l'original disparaît. Si l'original est en ligne, utilisez-le.
      ${a(ARCHIVE, 'Original archivé')}.`,
    title: 'Calculateur Pignon Fixe',
    subtitle: 'D\'après le Fantastic Fixed Gear Calculator de SURPLACE',
    language: 'Langue', units: 'Unités', metric: 'Métrique', imperial: 'Impérial', about: 'À propos',
    gear: 'Braquet', ring: 'Plateau', sprocket: 'Pignon', tire: 'Pneu',
    custom: 'Personnalisé : circonférence ou ETRTO…', customLabel: 'Circonférence (mm) ou ETRTO',
    ambi: 'Skid ambidextre', fewer: 'Moins de dents', more: 'Plus de dents', teeth: 'd',
    analysis: 'Analyse', ratio: 'Ratio', patches: 'Skid patchs',
    single: 'simple', ambidextrous: 'ambidextre', noGain: 'pas de gain en ambidextre',
    development: 'Développement', gearInches: 'Gear inches', devShort: 'développement',
    speed: 'Cadence / Vitesse', at: 'à', rpm: 'tr/min',
    equivalents: 'Braquets équivalents ±2 %',
    eqLegend: 'Second chiffre = skid patchs. Les braquets en rose répartissent mieux l’usure que le vôtre. Touchez-en un pour le charger.',
    drawing: (p, amb) => amb ? `Roue avec ${p} skid patchs, ${amb} en ambidextre` : `Roue avec ${p} skid patchs`,
    footer: `Tout le mérite : ${a(ORIGINAL, 'SURPLACE')} (le calculateur) ·
      ${a('https://www.sheldonbrown.com/', 'Sheldon Brown')} (données pneus, théorie) ·
      lajalousie (méthode ambidextre) · ${a('https://github.com/bouliboule/fixed-gear-calculator', 'Code source')} · Domaine public<br>
      Demande de retrait ou de correction : ${mail('Calculateur Pignon Fixe : retrait / correction')}`,
    close: 'Fermer',
    help: {
      ratio: ['Ratio', `<p>Le rapport entre le nombre de dents du plateau et du pignon, c'est-à-dire le nombre de tours de roue pour un tour de pédalier.</p>
        <p>À titre d'exemple :</p><ul><li>moins de 1,9 : bike polo</li><li>1,9 – 2,3 : nombreux dénivelés</li>
        <li>2,3 – 2,7 : ratio polyvalent</li><li>plus de 2,7 : pour envoyer sur le plat (attention aux genoux)</li></ul>`],
      patches: ['Skid patchs', `<p>Le nombre de points d'usure créés sur le pneu par les freinages en skid
        (dérapage de la roue arrière par blocage des jambes). Plus il est élevé, plus l'usure est répartie.</p>
        <p>En skid ambidextre (l'un ou l'autre pied devant), le nombre double quand le plateau réduit est impair.</p>`],
      development: ['Développement', '<p>La distance parcourue par le vélo à chaque tour complet de pédalier.</p>'],
      gearInches: ['Gear inches', `<p>La convention de Sheldon Brown : le ratio multiplié par le diamètre de la roue en pouces,
        comme sur un grand bi à entraînement direct.</p>`],
    },
    aboutTitle: 'À propos',
    aboutBody: `<p><strong>Ceci n'est pas une œuvre originale.</strong> C'est une sauvegarde du <em>Fantastic Fixed Gear Calculator</em>,
      créé par l'équipe ${a('https://www.surplace.fr/', 'SURPLACE')}. Elle existe seulement pour que leur calculateur
      reste disponible si ${a(ORIGINAL, "l'original")} disparaît. Tout le mérite leur revient.</p>
      <p>Les circonférences de pneu proviennent du site de ${a('https://www.sheldonbrown.com/', 'Sheldon Brown')}.
      La méthode de calcul des skid patchs ambidextres a été corrigée par lajalousie.</p>
      <p>Le code est une réécriture placée dans le domaine public.</p>
      <p><strong>Vous souhaitez que cette page soit modifiée ou retirée ?</strong> Si vous faites partie de
      l'équipe SURPLACE, ou pour toute autre demande, écrivez à ${mail('Calculateur Pignon Fixe : retrait / correction')}.
      Ce sera fait rapidement, sans discussion.</p>`,
  },
};

export function fmt(n, lang, digits = 2) {
  return new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
}
