
const pythagoreanMap: Record<string, number> = {
  a:1, j:1, s:1, b:2, k:2, t:2, c:3, l:3, u:3, d:4, m:4, v:4, e:5, n:5, w:5, f:6, o:6, x:6, g:7, p:7, y:7, h:8, q:8, z:8, i:9, r:9
};

const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

export const ARCHETYPES: Record<number, { title: string, concrete: string }> = {
  1: { title: "L'Architecte", concrete: "Capacité à initier des projets à partir de rien. Force de frappe individuelle." },
  2: { title: "Le Médiateur", concrete: "Précision dans les alliances. Sensibilité aux courants invisibles des autres." },
  3: { title: "Le Catalyseur", concrete: "Explosion de communication. Capacité à rendre les idées contagieuses." },
  4: { title: "Le Bâtisseur", concrete: "Rigueur implacable. Transformation de l'abstrait en structures solides." },
  5: { title: "L'Explorateur", concrete: "Adaptabilité radicale. Talent pour pivoter rapidement face au chaos." },
  6: { title: "L'Harmoniste", concrete: "Gestion de l'équilibre. Capacité à créer des environnements fertiles." },
  7: { title: "L'Analyste", concrete: "Percevoir la vérité derrière les apparences. Stratégie de profondeur." },
  8: { title: "Le Stratège", concrete: "Maîtrise de l'énergie et de l'argent. Pouvoir de manifestation matérielle." },
  9: { title: "L'Humaniste", concrete: "Vision globale. Capacité à conclure des cycles pour passer au niveau supérieur." },
  11: { title: "Le Visionnaire", concrete: "Intuition foudroyante. Accès à des informations avant tout le monde." },
  22: { title: "Le Maître Bâtisseur", concrete: "Réalisation de projets d'envergure mondiale. Puissance de travail hors norme." },
  33: { title: "Le Guide", concrete: "Influence spirituelle majeure. Capacité à élever la conscience d'un groupe." }
};

export const reduceToRoot = (num: number, master: boolean = true): number => {
  if (master && [11, 22, 33].includes(num)) return num;
  let sum = String(num).split('').reduce((acc, d) => acc + parseInt(d), 0);
  return sum > 9 ? reduceToRoot(sum, master) : sum;
};

const getNameValue = (name: string, filter?: (char: string) => boolean): number => {
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = clean.split('').reduce((acc, char) => {
    if (filter && !filter(char)) return acc;
    return acc + (pythagoreanMap[char] || 0);
  }, 0);
  return sum;
};

export const calculateFullProfile = (firstName: string, dob: string) => {
  const full = firstName;
  const [y, m, d] = dob.split('-').map(Number);
  
  const lifePath = reduceToRoot(reduceToRoot(y) + reduceToRoot(m) + reduceToRoot(d));
  const expression = reduceToRoot(getNameValue(full));
  const soulUrge = reduceToRoot(getNameValue(full, c => vowels.includes(c)));
  const personality = reduceToRoot(getNameValue(full, c => !vowels.includes(c)));
  const realization = reduceToRoot(lifePath + expression);
  const hiddenForce = reduceToRoot(expression + soulUrge);
  
  const currentYear = new Date().getFullYear();
  const personalYear = reduceToRoot(reduceToRoot(currentYear) + reduceToRoot(m) + reduceToRoot(d));

  return { lifePath, expression, soulUrge, personality, realization, hiddenForce, personalYear, birthMonth: m, birthDay: d };
};

export const calculateMomentVibrations = (birthProfile: any, actionDate: string, actionTime: string) => {
  const [ay, am, ad] = actionDate.split('-').map(Number);
  const [ah, amin] = actionTime.split(':').map(Number);

  // Cycles personnels pour la date cible
  const targetPersonalYear = reduceToRoot(reduceToRoot(ay) + reduceToRoot(birthProfile.birthMonth) + reduceToRoot(birthProfile.birthDay));
  const targetPersonalMonth = reduceToRoot(targetPersonalYear + am);
  const targetPersonalDay = reduceToRoot(targetPersonalMonth + ad);

  // Vibrations intrinsèques du moment
  const actionDayNumber = reduceToRoot(ay + am + ad);
  const actionHourNumber = reduceToRoot(ah + (amin || 0));

  return {
    personalYear: targetPersonalYear,
    personalMonth: targetPersonalMonth,
    personalDay: targetPersonalDay,
    actionDayNumber,
    actionHourNumber
  };
};
