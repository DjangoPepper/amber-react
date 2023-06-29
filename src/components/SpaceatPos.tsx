import React from "react";

interface SpacedAtPositionStringProps {
  numberastext: string;

}
// function useColumns(): any[] {
function insertSpaceAtPosition(numberastext: string, position: number): string {
  if (position < 0 || position > numberastext.length) {
    throw new Error('Invalid position');
  }
  return numberastext.slice(0, position) + ' ' + numberastext.slice(position);
}

function definehowmanyspace(originalNumber: string): string {
  let newnumber: string;

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
    originalNumber = insertSpaceAtPosition(originalNumber, 7);
    newnumber = originalNumber;
  } else if (originalNumber.length === 8) {
    originalNumber = insertSpaceAtPosition(originalNumber, 4);
    originalNumber = insertSpaceAtPosition(originalNumber, 6);
    newnumber = originalNumber;
  } else if (originalNumber.length === 7) {
    originalNumber = insertSpaceAtPosition(originalNumber, 3);
    originalNumber = insertSpaceAtPosition(originalNumber, 5);
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

const SpacedString: React.FC<SpacedAtPositionStringProps> = ({
  numberastext,
}) => {
  const HumanspacedText = definehowmanyspace(numberastext);
  return <div>{HumanspacedText}</div>;
};

export default SpacedString;
