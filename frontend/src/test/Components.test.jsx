import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import StatsCards from '../components/StatsCards';

describe('Frontend Components', () => {
  it('should render EmptyState correctly with custom properties', () => {
    render(
      <BrowserRouter>
        <EmptyState title="Custom Empty Title" message="Custom message goes here for testing." />
      </BrowserRouter>
    );

    expect(screen.getByText('Custom Empty Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message goes here for testing.')).toBeInTheDocument();
  });

  it('should render StatsCards with exact task counts', () => {
    const testStats = {
      total: 42,
      pending: 12,
      inProgress: 20,
      completed: 10,
    };

    render(<StatsCards stats={testStats} />);

    // Check titles
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('In Progress Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();

    // Check count values
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
