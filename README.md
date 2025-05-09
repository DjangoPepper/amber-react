# Getting Started with amber-react (stepe.click)

Ce project nous aide à maninpuler des catalogues de marchandises (coils, hotcoils, brames, plaques) au format excel, entre une premiere zone non definie
(stock, train, bateau) vers une seconde Stock, C1, C2, C3, etc...


## Utilisation local depuis vscode
### `nvm install 18`

## Utilisation local depuis vscode
### `nvm use 18.20.8`

Dans une console dans le repertoire de principal
### `yarn start`

Lancer l'api  dans votre navigateur:
Open [http://localhost:3000](http://localhost:3000) 

## Mise en ligne sur AWS
arrete le serveur local puis
### `yarn build`

# Depuis votre browser sur AWS.amazon.com
AWS -> Amazon CloudFront -> Distributions -> Invalidations -> Creer une invalidation -> /*

puis 

AWS ->  Amazon S3 -> nom Compartiments -> steppe -> Charger

### UTILSATION USER
## Importation

Import -> Excel -> choisir votre fichier
ver 1.0.1 lancement beta public
ver 1.0.2 maj : couleurs, ref espacés, sauvegardes datés, bugs. 
ver 1.0.3 maj : indexation, importations multi, bugs.
ver 1.0.4 bec : calculs cumulés, bugs.
ver 1.0.5 gui.

le fichier excel importé doit respecter les contraintes suivantes : 

la premiere cellule de la premiere ligne de la premiere feuille doit contenir rang ou numero. 

la deuxieme cellule de la premiere ligne de la premiere feuille doit contenir reference, coils, brames ou numero.

la troisieme cellule de la premiere ligne de la premiere feuille doit contenir poids ou tons.


## Utilisation
Ordonnez votre catalogue en clicquant sur rang, ref, poids ou destination  jusqu'a obtenir un triangle bleu orienté vers le haut

Selectionnez votre destination, stok, cale X, null selon votre choix.

Cliquer sur le bouton bleu representant la reference que vous voulez deplacer.


 ## Exportation
 
 Cliquez sur export puis partager votre fichier excel.
