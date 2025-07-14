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
    // We fall back on the event location only if the venue is unspecified
    expect(screen.getByText('Park Amphitheater')).toBeInTheDocument()
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

  it('renders category names with ampersands correctly', () => {
    const eventWithAmpersandCategory = {
      ...mockEvent,
      category: {
        id: 2,
        name: 'Food & Drink',
        description: 'Food and beverage events'
      }
    }
    
    const { container } = render(<EventCard event={eventWithAmpersandCategory} />)
    
    // Check the textContent (what users see) not innerHTML
    const categoryBadge = container.querySelector('span[class*="bg-yellow-300"]')
    const categoryText = categoryBadge?.textContent || ''
    
    // Should contain proper "&" not "&amp;" entities in displayed text
    expect(categoryText).toBe('Food & Drink')
    expect(categoryText).not.toContain('&amp;')
    expect(categoryText).not.toContain('&amp;amp;')
  })

  it('renders art and culture category correctly', () => {
    const eventWithArtCategory = {
      ...mockEvent,
      category: {
        id: 3,
        name: 'Art & Culture',
        description: 'Art and cultural events'
      }
    }
    
    const { container } = render(<EventCard event={eventWithArtCategory} />)
    
    // Check the textContent (what users see) not innerHTML
    const categoryBadge = container.querySelector('span[class*="bg-yellow-300"]')
    const categoryText = categoryBadge?.textContent || ''
    
    // Should contain proper "&" not "&amp;" entities in displayed text
    expect(categoryText).toBe('Art & Culture')
    expect(categoryText).not.toContain('&amp;')
    expect(categoryText).not.toContain('&amp;amp;')
  })

})