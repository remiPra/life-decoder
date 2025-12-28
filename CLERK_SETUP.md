# Setup Clerk Authentication

## Étapes à faire de ton côté:

1. **Créer un compte Clerk:**
   - Va sur https://clerk.com
   - Clique sur "Start building for free"
   - Inscris-toi avec ton email

2. **Créer une application:**
   - Une fois connecté, clique sur "Create application"
   - Nom: "Life Decoder"
   - Active les providers:
     - ✅ Email (Password)
     - ✅ Google
     - ✅ Email (Code) - pour magic link

3. **Récupérer tes clés:**
   - Dans le dashboard Clerk, va dans "API Keys"
   - Copie la "Publishable Key" (commence par `pk_test_...`)

4. **Ajouter la clé dans .env.local:**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXX
   ```

5. **Redémarre le serveur:**
   ```
   vercel dev
   ```

## C'est tout!

L'app sera automatiquement configurée pour demander l'authentification avant d'accéder aux résultats.

Les utilisateurs pourront se connecter avec:
- Email + mot de passe
- Google OAuth
- Magic link par email
