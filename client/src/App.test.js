import { render, screen } from '@testing-library/react';
import App from './App';

it('renders leaflet map on loading', () => {
  render(<App />);
  const linkElement = screen.getByText(/leafletmap/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
