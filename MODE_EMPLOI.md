# Les Volets Bleus — Site web

Site officiel du restaurant **Les Volets Bleus** à Fougères.

---

## 📁 Structure du site

```
voletsbleus/
├── index.html              ← Page d'accueil
├── carte.html              ← La Carte d'été
├── vins.html               ← Les Vins
├── evenements.html         ← Évènements
├── reserver.html           ← Réserver
├── contact.html            ← Contact
│
├── css/style.css           ← Mise en forme (couleurs, typos...)
├── js/script.js            ← Logique du site
│
├── data/                   ← LE CONTENU DU SITE (à modifier ici)
│   ├── carte.json          ← La carte (plats, accords vins)
│   ├── vins.json           ← Les vins
│   ├── evenements.json     ← Les évènements
│   └── infos.json          ← Infos générales (adresse, horaires, textes accueil)
│
└── admin/                  ← Interface d'administration
    ├── index.html
    └── config.yml
```

**À retenir** : le contenu (textes, plats, vins, évènements) est dans le dossier `data/`. La mise en forme est dans `css/`. Pas besoin de toucher au reste pour gérer le site au quotidien.

---

## 🚀 Mise en ligne — Première fois

### 1. Compte GitHub

1. Aller sur https://github.com et créer un compte (gratuit)
2. Une fois connecté, cliquer **« New repository »** (en haut à droite)
3. Nom : `lesvoletsbleus`
4. Choisir **« Public »** (obligatoire pour Decap CMS gratuit)
5. Cocher **« Add a README file »**
6. Cliquer **« Create repository »**

### 2. Téléverser les fichiers du site

1. Sur la page de votre nouveau dépôt GitHub
2. Cliquer **« Add file » → « Upload files »**
3. Glisser tous les fichiers et dossiers du site (sauf `README.md` qui existe déjà)
4. En bas, cliquer **« Commit changes »**

### 3. Connecter Cloudflare Pages au dépôt

1. Sur Cloudflare → **Workers et Pages** → **Créer une application**
2. Choisir **« Pages »** puis **« Connect to Git »**
3. Autoriser Cloudflare à accéder à votre GitHub
4. Sélectionner le dépôt `lesvoletsbleus`
5. **Build settings** :
   - Framework preset : `None`
   - Build command : (vide)
   - Build output directory : `/`
6. **Save and Deploy**

→ Le site est en ligne sur `lesvoletsbleus.pages.dev` ✅

### 4. Activer l'admin (Decap CMS)

#### a) Modifier le fichier `admin/config.yml`

Sur GitHub, ouvrir le fichier `admin/config.yml` :
- Trouver la ligne `repo: VOTRE_LOGIN/lesvoletsbleus`
- Remplacer `VOTRE_LOGIN` par votre vrai login GitHub
- Sauvegarder (« Commit changes »)

#### b) Créer une OAuth App pour l'authentification

Decap CMS a besoin d'un service d'authentification. **Solution la plus simple : Netlify Identity (gratuit)**.

Alternativement, on peut utiliser **GitHub OAuth direct** via un service tiers gratuit comme **oauth.cloudgeek.app** ou **decap-proxy** sur Cloudflare Workers.

**📝 Pour cette étape, demandez à un développeur de vous accompagner — c'est une configuration technique qui se fait en 15 minutes mais nécessite quelques manipulations.**

#### c) Tester l'accès admin

Une fois configuré, l'admin sera accessible à :
**https://lesvoletsbleus.pages.dev/admin/**

---

## ✏️ Modifier le contenu du site (au quotidien)

### Option 1 : via l'interface d'admin (recommandée)

1. Aller sur **https://lesvoletsbleus.pages.dev/admin/**
2. Se connecter avec son compte GitHub
3. Choisir la section :
   - **🍽️ La Carte** : modifier les plats, ajouter une nouvelle entrée, etc.
   - **🍷 Les Vins** : ajouter un nouveau vin, modifier un prix, etc.
   - **📅 Évènements** : ajouter un nouvel évènement
   - **ℹ️ Infos pratiques** : changer les horaires, les textes d'accueil, etc.
4. Faire les modifications
5. Cliquer **« Publier »**
6. Le site se met à jour automatiquement dans les 30-60 secondes ✨

### Option 2 : éditer directement les fichiers JSON

Pour les modifs simples si on n'a pas accès à l'admin, on peut :

1. Aller sur GitHub → ouvrir le dossier `data/`
2. Cliquer sur le fichier à modifier (ex: `carte.json`)
3. Cliquer sur l'icône crayon ✏️ en haut à droite
4. Modifier le texte directement
5. En bas, cliquer **« Commit changes »**

---

## 🎄 Cas d'usage : créer une carte de Noël

**Méthode 1 (la plus simple) : remplacer la carte d'été**

Dans l'admin, section **🍽️ La Carte**, modifier :
- Saison : « Carte de Noël 2026 »
- Validité : « décembre 2026 »
- Mettre à jour les entrées, plats, desserts

**Méthode 2 (pour garder l'historique) : un nouveau fichier**

Si on veut garder la carte d'été pour la réutiliser l'année suivante :
1. Dupliquer le fichier `data/carte.json` en `data/carte-noel.json`
2. Demander à un développeur de créer une page `carte-noel.html` qui charge ce nouveau fichier
3. Ajouter un lien depuis le menu

---

## 🎨 Modifier les couleurs ou tailles du site

Tout est centralisé dans `css/style.css` en haut du fichier.

Ouvrir `css/style.css` avec Notepad++ ou MobaTextEditor, chercher la section **« COULEURS »** :

```css
--bleu: #203d63;
--orange: #e96c4a;
--beige: #efe1c7;
--creme: #fdf9ef;
```

Changer une de ces valeurs → la couleur change partout sur le site.

Idem pour les tailles dans la section **« TAILLES DE TEXTE »**.

⚠️ **Ne pas toucher au reste du fichier**, ça pourrait casser la mise en page.

---

## 🆘 En cas de problème

### Le site ne se met pas à jour après une modification

- Patienter 1-2 minutes (Cloudflare met du temps à redéployer)
- Vider le cache du navigateur (Ctrl + Shift + R)
- Vérifier que la modif a bien été commitée sur GitHub

### Une erreur s'affiche dans l'admin

- Vérifier la connexion internet
- Se déconnecter et reconnecter
- Si rien ne marche : éditer directement le fichier JSON sur GitHub (Option 2 ci-dessus)

### J'ai cassé quelque chose, comment revenir en arrière ?

- Sur GitHub : aller dans l'onglet **« Commits »**
- Cliquer sur le dernier commit qui marchait
- Bouton **« Revert »** ou **« Restore »**

---

## 📞 Coordonnées techniques

- Hébergement : **Cloudflare Pages** (gratuit)
- Stockage du code : **GitHub** (compte de [VOTRE_NOM])
- Admin : **Decap CMS** (gratuit)
- Authentification : à configurer

URL en ligne : **https://lesvoletsbleus.pages.dev**
URL admin : **https://lesvoletsbleus.pages.dev/admin/**

---

*Site créé en avril 2026 — Les Maisons du Château*
