import { render, screen } from '@testing-library/react'
import EventCard from '../EventCard'
import { Event } from '@/types/event'

const mockEvent: Event = {
  id: 1,
  title: 'Test Concert',
  description: 'A great concert in the park',
  start_date: '2024-07-15T19:00:00Z',
  end_date: '2024-07-15T22:00:00Z',
  location: 'Central Park',
  category: {
    id: 1,
    name: 'Music',
    description: 'Music events'
  },
  venue: {
    id: 1,
    name: 'Park Amphitheater',
    address: '123 Park Ave',
    capacity: 500
  }
}

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />)
    
    expect(screen.getByText('Test Concert')).toBeInTheDocument()
    expect(screen.getByText('A great concert in the park')).toBeInTheDocument()
    expect(screen.getByText('Central Park')).toBeInTheDocument()
    expect(screen.getByText('Music')).toBeInTheDocument()
  })

  it('formats date correctly', () => {
    render(<EventCard event={mockEvent} />)
    
    // Check that some date formatting is present
    expect(screen.getByText(/Jul|July/)).toBeInTheDocument()
    expect(screen.getByText(/15/)).toBeInTheDocument()
  })

  it('displays venue information when available', () => {
    render(<EventCard event={mockEvent} />)
    
    expect(screen.getByText('Park Amphitheater')).toBeInTheDocument()
  })

  it('handles missing venue gracefully', () => {
    const eventWithoutVenue = { ...mockEvent, venue: null }
    render(<EventCard event={eventWithoutVenue} />)
    
    expect(screen.getByText('Test Concert')).toBeInTheDocument()
    expect(screen.queryByText('Park Amphitheater')).not.toBeInTheDocument()
  })
})