# Configuration Firestore

## Déployer les règles de sécurité

### Option 1: Via la Console Firebase (Recommandé)

1. Va sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionne ton projet: **simply-notify-68b52**
3. Dans le menu latéral, clique sur **Firestore Database**
4. Va dans l'onglet **Règles** (Rules)
5. Copie-colle le contenu du fichier `firestore.rules`
6. Clique sur **Publier** (Publish)

### Option 2: Via Firebase CLI

```bash
# Installe Firebase CLI si ce n'est pas déjà fait
npm install -g firebase-tools

# Connecte-toi à Firebase
firebase login

# Initialise Firebase dans ton projet (si pas déjà fait)
firebase init firestore

# Déploie les règles
firebase deploy --only firestore:rules
```

## Structure de la base de données

### Collection: `analyses`

Chaque document représente une analyse sauvegardée:

```typescript
{
  id: string,              // ID auto-généré par Firestore
  userId: string,          // ID utilisateur de Clerk
  type: 'mystique' | 'rational' | 'zeri',
  prenom: string,
  dateNaissance?: string,  // Format: YYYY-MM-DD
  input: any,              // Données d'entrée de l'analyse
  output: any,             // Résultats de l'analyse
  createdAt: Timestamp     // Date de création auto
}
```

## Sécurité

- L'authentification est gérée par **Clerk** côté client
- Les règles Firestore vérifient que les données sont bien formées
- Chaque utilisateur ne peut voir que ses propres analyses (filtré côté client via `userId`)

## Prochaines étapes

Pour une sécurité renforcée, tu peux:
1. Intégrer Clerk avec Firebase Custom Authentication
2. Utiliser des Cloud Functions pour valider les requêtes
3. Ajouter un rate limiting

Pour l'instant, la sécurité est assurée par:
- Clerk qui gère l'authentification
- Les règles qui valident la structure des données
- Les requêtes côté client qui filtrent par `userId`
