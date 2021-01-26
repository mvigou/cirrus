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

- REQUIS : un hébergement web (ou local) reposant sur un serveur Apache. **Important** : La plupart des fournisseurs d'hébergements mutualisés plafonnent la taille et le nombre de fichiers qu'il est possible de mettre en ligne simultanément. Orientez vos recherches du côté des valeurs de configuration PHP *upload_max_filesize* et *post_max_size* associées à votre prestataire si vous rencontrez des problèmes pour mettre en ligne vos documents alors qu'aucun message d'erreur n'apparaît à l'écran. Il y a toutefois peu de chance que vous puissiez redéfinir ces limitations.
- REQUIS : PHP version 7 ou plus.

### Utilisation

- REQUIS : un navigateur web moderne tel que Mozilla Firefox, Google Chrome où l'un de ses dérivés.
- REQUIS : JavaScript (activé par défaut sur la plupart des navigateurs web modernes).
- RECOMMANDE : L'API LocalStorage (disponible et activée par défaut sur la plupart des navigateurs web modernes), dans l'intérêt du confort utilisateur (mémorisation du dernier dossier visité, des préférences de thème...).

## Fonctionnalités

Note: cette liste tient également lieu de feuille de route partielle ; la fonctionnalité décrite est alors précédée de la mention (TODO).

### Interface

* Traduction française / anglaise.
* Boîte de dialogue personnalisée (en cours de suppression).
* Suivi des téléchargements.
* Thème clair, thème sombre.

### Explorateur

* Sélection du dossier parent (utilisateur, corbeille).
* Restitution de l'arborescence des dossiers conforme à la réalité.
* Navigation libre dans l'arborescence des dossiers.
* Accès rapide aux dossiers parents, depuis le dossier courant jusqu'à la racine.
* Vider la corbeille.
* (TODO) Afficher plus d'informations sur les fichiers et dossiers (taille, type, nb d'enfants...).

### Opérations sur les dossiers

* Créer un dossier vide.
* Créer plusieurs dossier en une seule action.
* (TODO) Mettre en ligne un ou plusieurs dossiers à la fois.
* (TODO) Renommer un dossier.
* Télécharger un dossier et son contenu au format compressé Zip.
* Déplacer un dossier vers la corbeille.
* (TODO) Restorer un dossier depuis la corbeille.
* Supprimer définitivement un dossier.

### Opérations sur les fichiers

* Mettre en ligne un ou plusieurs fichiers à la fois.
* (TODO) Gérer les erreurs de transferts (ZIP ?).
* (TODO) Prévenir l'écrasement de fichier pendant l'envoi.
* Consulter un fichier depuis le navigateur.
* (TODO) Renommer un fichier.
* Télécharger un fichier.
* Déplacer un fichier vers la corbeille.
* (TODO) Restorer un fichier depuis la corbeille.
* Supprimer définitivement un fichier.

### Sécurité

* (TODO) Créer un compte utilisateur.
* Accès au contenu soumis à authentification.
* Confirmation par clic long des actions dites "dangereuses" (support souris / appareil tactile).
* Blocage de l'accès direct aux contenus par leur URLs.
* Navigation utilisateur restreinte aux seuls dossiers "datas" et "recycle". 

### Divers

* Purge automatique des dossiers temporaires à chaque authentification réussie.
* (TODO) Revoir le timing de la purge automatique des dossiers temporaires (idéalement, suppression à la déconnexion).
* Journalisation des erreurs.
* (TODO) Mettre en place une purge automatique du journal d'erreur.
* (TODO) Mise en cache à voir / Service worker ?
* (TODO) Intégrer une gestion de license ? (limitation des fonctionnalité (switch theme, créer de multiple dossiers))