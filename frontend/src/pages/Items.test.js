import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Items from './Items';
import { DataProvider } from '../state/DataContext';

// Mock the DataContext
jest.mock('../state/DataContext', () => ({
  ...jest.requireActual('../state/DataContext'),
  useData: () => ({
    items: [
      { id: 1, name: 'Test Item 1' },
      { id: 2, name: 'Test Item 2' }
    ],
    fetchItems: jest.fn().mockResolvedValue({ total: 2, items: [] })
  })
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

describe('Items Component', () => {
  test('renders items list', async () => {
    render(
      <DataProvider>
        <Items />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('renders search input', () => {
    render(
      <DataProvider>
        <Items />
      </DataProvider>
    );

    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
  });

  test('renders pagination controls', () => {
    render(
      <DataProvider>
        <Items />
      </DataProvider>
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
