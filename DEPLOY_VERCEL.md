# 🚀 Guide de Déploiement Vercel

## ✅ Checklist Avant Déploiement

### 1. Vérifier les fichiers nécessaires

- [x] `api/analyze.js` existe
- [x] `vercel.json` existe
- [x] `.env.local` contient `OPENROUTER_API_KEY` (pour test local)

### 2. Tester en local avec Vercel Dev

```bash
# Installer Vercel CLI si pas déjà fait
npm install -g vercel

# Lancer avec Vercel Dev (simule l'environnement de production)
vercel dev
```

L'app devrait se lancer sur `http://localhost:3000`

### 3. Tester l'API route

Ouvre la console (F12) et teste:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test"}'
```

Si ça marche → Passe à l'étape suivante
Si erreur → Vérifie que `OPENROUTER_API_KEY` est bien dans `.env.local`

---

## 🌐 Déploiement sur Vercel

### Étape 1: Push sur GitHub

```bash
git add .
git commit -m "feat: Add Vercel API route for secure OpenRouter calls"
git push
```

### Étape 2: Connecter le projet sur Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Clique sur "Add New Project"
3. Importe ton repo GitHub `life-decoder`
4. **NE PAS** cliquer sur Deploy tout de suite!

### Étape 3: Configurer les variables d'environnement

**CRITIQUE** : Avant de déployer, ajoute la variable d'environnement:

1. Dans l'interface de configuration du projet Vercel
2. Section **Environment Variables**
3. Ajoute:
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: `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`
   - **Environments**: Cocher **Production**, **Preview**, **Development**

4. Clique sur "Add"
5. **Maintenant** tu peux cliquer sur "Deploy"

### Étape 4: Attendre le déploiement

Vercel va:
1. Build ton projet
2. Déployer les fichiers statiques
3. Créer la Serverless Function `/api/analyze`

Durée: ~2-3 minutes

### Étape 5: Vérifier que ça marche

Une fois déployé, tu auras une URL comme `https://life-decoder-xyz.vercel.app`

#### Test 1: Interface
- Ouvre l'URL → Tu dois voir "LIFE DECODER"
- Clique sur "Commencer une décision"
- Remplis le formulaire

#### Test 2: Sécurité (IMPORTANT!)
1. Ouvre DevTools (F12)
2. Onglet "Sources"
3. Cherche "sk-or-v1" dans les fichiers
4. **Si trouvé = DANGER** → Clé exposée
5. **Si non trouvé = ✅ Sécurisé**

#### Test 3: API Route
1. Ouvre DevTools (F12)
2. Onglet "Network"
3. Complète une décision jusqu'au bout
4. Cherche la requête vers `/api/analyze`
5. Vérifie qu'elle retourne un 200 OK

---

## 🐛 En cas de problème

### Erreur: "API key not configured"

**Cause**: La variable d'environnement n'est pas configurée

**Solution**:
1. Va dans Vercel Dashboard → Ton projet → Settings → Environment Variables
2. Ajoute `OPENROUTER_API_KEY` avec ta clé
3. Redéploie: Settings → Deployments → Dernier déploiement → ⋯ → Redeploy

### Erreur: "API Error: 404" sur /api/analyze

**Cause**: La route API n'est pas reconnue

**Solution**:
1. Vérifie que `api/analyze.js` existe bien
2. Vérifie que `vercel.json` existe
3. Redéploie le projet

### Erreur: Clé API visible dans le navigateur

**URGENT**: Si tu trouves ta clé dans les DevTools:

1. **Révoquer immédiatement** la clé sur OpenRouter
2. Créer une nouvelle clé
3. Vérifier qu'il n'y a AUCUNE variable `VITE_OPENROUTER_API_KEY` dans le code
4. Mettre à jour `OPENROUTER_API_KEY` sur Vercel
5. Redéployer

---

## 📊 Après le déploiement

### Vérifier les logs

1. Vercel Dashboard → Ton projet → Deployments
2. Clique sur le dernier déploiement
3. Onglet "Functions" → Voir les logs de `/api/analyze`
4. Tu devrais voir les appels à l'API

### Surveiller les coûts

1. Va sur [OpenRouter Dashboard](https://openrouter.ai/credits)
2. Vérifie ta consommation
3. Configure des alertes si possible

### Tester avec de vrais utilisateurs

1. Envoie le lien à 3-5 personnes
2. Demande-leur de tester le flow complet
3. Note leurs retours

---

## ✅ Déploiement réussi si:

- [ ] L'app est accessible sur l'URL Vercel
- [ ] Le formulaire fonctionne
- [ ] L'analyse IA retourne des résultats
- [ ] La clé API n'est PAS visible dans le navigateur (DevTools → Sources)
- [ ] Les logs Vercel montrent les appels à `/api/analyze`

---

**Tu es prêt à déployer!** 🚀
