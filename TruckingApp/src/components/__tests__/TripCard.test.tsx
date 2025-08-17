import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TripCard from '../TripCard';

describe('TripCard', () => {
  const trip = {
    id: 1,
    destination: 'New York',
    cargo: 'Furniture',
    start_time: '2024-01-01T10:00:00Z',
    end_time: null,
  };

  it('renders correctly for an ongoing trip', () => {
    const { getByText } = render(<TripCard trip={trip} />);
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('Furniture')).toBeTruthy();
    expect(getByText('End Trip')).toBeTruthy();
  });

  it('renders correctly for a completed trip', () => {
    const completedTrip = { ...trip, end_time: '2024-01-01T20:00:00Z' };
    const { getByText, queryByText } = render(<TripCard trip={completedTrip} />);
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('Furniture')).toBeTruthy();
    expect(queryByText('End Trip')).toBeNull();
  });

  it('calls onEndTrip when the "End Trip" button is pressed', () => {
    const onEndTripMock = jest.fn();
    const { getByText } = render(<TripCard trip={trip} onEndTrip={onEndTripMock} />);
    fireEvent.press(getByText('End Trip'));
    expect(onEndTripMock).toHaveBeenCalled();
  });
});
