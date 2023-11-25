import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
test('renders learn react link', () => {
  // Fournissez une valeur pour la prop updateFirstRender ici
  render(<App updateFirstRender={(value: boolean) => { /* Mettez votre logique ici */ }} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
