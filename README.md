# cirrus

Un cirrus est un type de **nuage** ayant hérité son nom latin de la forme qu'il rappelle, celle d'une boucle de cheveux. Au-delà de l'aspect poétique, cirrus est l'acronyme idéal du projet de **Cloud Intègre, Responsable et Résilient pour Utilisateurs Sagaces** porté par [Awebsome](https://awebsome.fr).

## Pourquoi ?

La démocratisation du cloud soulève certaines interrogations :

* Qui accède aux données que je mets en ligne ?
* Comment surveille-t-on mon utilisation de ces données ?
* Avec quel impact sur l'environnement ?

Il existe des alternatives où le respect de votre vie privée est pris en considération. Leurs applications ont un défaut que cirrus ne partage pas : leur manque de **sobriété numérique**.

## Pour qui ?

L'utilisation d'un cloud est dans tous les cas polluant, donc **si vous pouvez vous en passer, faites-le**. Dans le cas contraire, cirrus est destiné aux **U**tilisateurs **S**agaces souhaitant :
* Disposer d'une solution de **C**loud en adéquation avec leurs convictions. 
* Être seuls concernés par les données qu'ils hébergent et l'utilisation qui en est faite (**I**ntègre).
* Maîtriser la consommation en données et en énergie du service en lui-même (**R**esponsable).
* Rester autonomes et (auto) héberger eux-même un service facilement maintenable, car sans dépendances ni base de données (**R**ésilient).

## Exigences techniques

### Installation

- REQUIS : un hébergement web (ou local) reposant sur un serveur Apache. **Important** : La plupart des fournisseurs d'hébergements mutualisés plafonnent la taille et le nombre de fichiers qu'il est possible de mettre en ligne simultanément. Orientez vos recherches du côté des valeurs de configuration PHP *upload_max_filesize* et *post_max_size* associées à votre prestataire si vous rencontrez des problèmes pour mettre en ligne vos documents alors qu'aucun message d'erreur n'apparaît à l'écran.
- REQUIS : PHP version 7 ou plus.

### Utilisation

- REQUIS : un navigateur web moderne tel que Mozilla Firefox, Google Chrome où l'un de ses dérivés.
- REQUIS : JavaScript (activé par défaut sur la plupart des navigateurs web modernes).
- RECOMMANDE : L'API LocalStorage (disponible et activée par défaut sur la plupart des navigateurs web modernes), dans l'intérêt du confort utilisateur (mémorisation du dernier dossier visité, des préférences de thème...).

## Fonctionnalités

Note: cette liste tient également lieu de feuille de route partielle ; la fonctionnalité décrite est alors précédée de la mention (TODO).

### Interface

* Confirmation des actions dites "dangereuses" avec méthode novatrice.
* Suivi de la progression des téléchargements de fichiers.
* Thème clair, thème sombre.
* Traduction française / anglaise.

### Explorateur

* (TODO) Afficher plus d'informations sur les fichiers et dossiers (taille, type, nb d'enfants...).
* Accès rapide aux dossiers parents, depuis le dossier courant jusqu'à la racine.
* Navigation dans l'arborescence des dossiers.
* Purge de la corbeille.
* Restitution de l'arborescence des dossiers conforme à la réalité.
* Sélection du dossier parent (utilisateur, corbeille).

### Opérations sur les dossiers

* (TODO) Mise en ligne d'un ou plusieurs dossiers à la fois.
* (TODO) Renommer un dossier.
* (TODO) Restorer un dossier depuis la corbeille.
* Création d'un dossier vide.
* Création de plusieurs dossiers en une seule action.
* Déplacement d'un dossier vers la corbeille.
* Suppression définitive d'un dossier.
* Téléchargement d'un dossier et de son contenu au format compressé Zip.

### Opérations sur les fichiers

* (TODO) Gérer les erreurs de transferts (ZIP ?).
* (TODO) Prévenir l'écrasement de fichier pendant l'envoi.
* (TODO) Renommer un fichier.
* (TODO) Restorer un fichier depuis la corbeille.
* Aperçu d'un fichier depuis le navigateur (suivant support).
* Déplacement d'un fichier vers la corbeille.
* Mise en ligne d'un ou plusieurs fichiers à la fois.
* Suppression définitive d'un fichier.
* Téléchargement d'un fichier.

### Opérations utilisateurs

* (TODO) Création de comptes utilisateurs supplémentaires.
* Assistant de création d'un compte "Propriétaire" à l'installation. 

### Sécurité

* Accès utilisateur restreint aux seuls dossiers "datas" et "recycle". 
* Accès à l'arborescence des contenus soumis à authentification.
* Journalisation des erreurs dans un fichier dédié.
* Verrouillage de l'accès via URL au dossier "datas" et son contenu (.htaccess).
* Verrouillage de l'accès via URL au dossier "recycle" et son contenu (.htaccess).
* Verrouillage de l'accès via URL au dossier "users" et son contenu (.htaccess).

### Divers

* (TODO) Intégrer une gestion de license ? (limitation des fonctionnalité ? Message toutes les X actions ?)
* (TODO) Mettre en place une purge automatique du journal d'erreur.
* (TODO) Mise en cache à voir / Service worker ?
* (TODO) Revoir le timing de la purge automatique des dossiers temporaires (idéalement, suppression à la déconnexion).
* Installation automatique au démarrage.
* Purge automatique des dossiers temporaires à chaque authentification réussie.