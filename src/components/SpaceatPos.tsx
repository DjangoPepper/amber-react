// import React from "react";



function trouverPosition1ereLettre(chaine: any): number {
  let result: number = -1;                                    // Initialise le résultat à -1 aucune lettre trouvée
  // const chaineEnMajuscules: string = chaine.toUpperCase();    // transforme la chaine en majuscules
  const chaineEnMajuscules: string = chaine.toString().toUpperCase();

  for (let i: number = 2; i < (chaineEnMajuscules.length-2); i++) {   //Initialise I, boucle de 2 à longeur chaine
    const code: number = chaineEnMajuscules.charCodeAt(i);        //Transforme le caractere en code
    if (code >= 65 && code <= 90) {                               //Si code represente une lettre majuscule
      result = i;                                                 //Récupère la position de la lettre trouvée   
      break; // Sort de la boucle dès qu'une lettre est trouvée   //break
    }
  }
  return result;                                                  // Retourne result
}

function insertSpaceAtPosition(numberastext: string, position: number): string {
  if (position < 0 || position > numberastext.length) {
    throw new Error('Invalid position');
  }
  return numberastext.slice(0, position) + ' ' + numberastext.slice(position);
}

function isolelalettre(numberastext: string, position: number): string {
  if (position < 0 || position > numberastext.length) {
    throw new Error('Invalid position');
  }
  return numberastext.slice(0, position) + ' ' + numberastext.slice(position, position + 1) + ' ' + numberastext.slice(position +1);
}

// function bobineachaud(numberastext: string, position: number): string {
//   return
// }

function definehowmanyspace(originalNumber: string): string {
  let newnumber: string;
 originalNumber = originalNumber.toString(); 
  if (originalNumber.length < 0) {
    throw new Error('Invalid originalNumber');
  }
  if (originalNumber.length > 10) {
    originalNumber = insertSpaceAtPosition(originalNumber, 4);
    originalNumber = insertSpaceAtPosition(originalNumber, 8);
    newnumber = originalNumber;
} else if (originalNumber.length === 10) {
    originalNumber = insertSpaceAtPosition(originalNumber, 4);
    originalNumber = insertSpaceAtPosition(originalNumber, 7);
    originalNumber = insertSpaceAtPosition(originalNumber, 10);
    newnumber = originalNumber;
  } else if (originalNumber.length === 9) {
    originalNumber = insertSpaceAtPosition(originalNumber, 3);
    originalNumber = insertSpaceAtPosition(originalNumber, 6);
    newnumber = originalNumber;
  } else if (originalNumber.length === 8) {
    originalNumber = insertSpaceAtPosition(originalNumber, 3);
    originalNumber = insertSpaceAtPosition(originalNumber, 6);
    newnumber = originalNumber;
  } else if (originalNumber.length === 7) {
    originalNumber = insertSpaceAtPosition(originalNumber, 3);
    originalNumber = insertSpaceAtPosition(originalNumber, 6);
    newnumber = originalNumber;
  } else if (originalNumber.length === 6) {
    originalNumber = insertSpaceAtPosition(originalNumber, 3);
    originalNumber = insertSpaceAtPosition(originalNumber, 3);
    newnumber = originalNumber;
  } else {
    newnumber = originalNumber;
  }

  return newnumber;
}

const SpacedString = (_ref:string) => {
  let newpos:number = trouverPosition1ereLettre(_ref);
  if (newpos === -1) {                                 // pas de lettre trouvée dans la chaine
    let HumanspacedText = definehowmanyspace(_ref);
    return HumanspacedText;
  }
  else {                                              // lettre trouvée dans la chaine
    let Humanpre:string = insertSpaceAtPosition(_ref, newpos)
    let HumanspacedText:string = insertSpaceAtPosition(Humanpre, (newpos+2))
    return HumanspacedText;
  }
  // else {
  //   let HumanspacedText:string = isolelalettre(_ref, newpos);
  //   return HumanspacedText;
  // }
  // const HumanspacedText = definehowmanyspace(_ref);
  // return HumanspacedText;
    
}
export default SpacedString;
