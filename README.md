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
- REQUIS : L'API LocalStorage (disponible et activée par défaut sur la plupart des navigateurs web modernes).

## Fonctionnalités

Note: cette liste tient également lieu de feuille de route partielle ; la fonctionnalité décrite est alors précédée de la mention (TODO).

### Interface

* Actions dites "dangereuses" gérées de façon novatrice (maintien du clic / de la pression).
* Thème clair.
* Thème sombre.

### Explorateur

* (TODO) Afficher plus d'informations sur les fichiers et dossiers (taille, type, nb d'enfants...).
* (TODO) Ordre de tri à préciser.
* Accéder rapidement aux dossiers parents grâce à un arbre d'arborescence.
* Naviguer dans une arborescence de dossiers conforme à la réalité.
* Purger la corbeille.
* Changer de dossier parent (utilisateur, corbeille).

### Opérations sur les dossiers

* (TODO) Copier un dossier.
* (TODO) Déplacer un dossier.
* (TODO) Mettre en ligne un ou plusieurs dossiers à la fois.
* Créer un ou plusieurs dossiers vides.
* Mettre un dossier à la corbeille.
* Renommer un dossier.
* Supprimer définitivement un dossier.
* Télécharger un dossier et son contenu au format compressé Zip.

### Opérations sur les fichiers

* (TODO) Copier un fichier.
* (TODO) Déplacer un fichier.
* (TODO) Prévenir l'écrasement de fichier pendant l'envoi ?
* Mettre un fichier à la corbeille.
* Mettre en ligne un ou plusieurs fichiers à la fois.
* Prévisualiser un fichier dans le navigateur (suivant support).
* Renommer un fichier.
* Suivi de la progression des téléchargements de fichiers.
* Supprimer définitivement un fichier.
* Télécharger un fichier.

### Opérations d'administration

* (TODO) Créer de liens d'inscription d'utilisateurs the type "publisher".
* (TODO) Supprimer des comptes (à préciser)
* Assistant de création d'un compte "Propriétaire" à l'installation. 
* Créer de liens d'inscription d'utilisateurs the type "viewer".

### Sécurité

* Accès utilisateur authentifié restreint aux seuls dossiers "content" et "recycle". 
* Accès à l'arborescence des contenus soumise à authentification préalable.
* Journalisation des erreurs dans un fichier dédié.
* Purge complète du dossier temporaire chaque fois que 10 dossiers temporaires ont été générés.
* Purge complète du dossier temporaire à chaque authentification réussie.
* Verrouillage de l'accès via URL au dossier "datas" et son contenu (.htaccess).

### Divers

* (TODO) Intégrer une gestion de license ? (limitation des fonctionnalité ? Message toutes les X actions ?)
* (TODO) Mettre en place une purge automatique du journal d'erreur.
* (TODO) Mise en cache à voir / Service worker ?
