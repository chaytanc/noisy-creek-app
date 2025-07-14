import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterBar from '../FilterBar'

// Mock the router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/events',
}))

describe('FilterBar', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders all filter inputs', () => {
    render(<FilterBar currentParams={{}} />)
    
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/upcoming events/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search events/i })).toBeInTheDocument()
  })

  it('displays current filter values', () => {
    const currentParams = {
      category: 'Music',
      start_date: '2024-07-01',
      upcoming: 'true'
    }
    
    render(<FilterBar currentParams={currentParams} />)
    
    expect(screen.getByDisplayValue('Music')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-07-01')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('updates form values when user types', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{}} />)
    
    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'Music')
    
    expect(categorySelect).toHaveValue('Music')
  })

  it('applies filters when search button is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{}} />)
    
    // Set some filters
    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'Music')
    await user.type(screen.getByLabelText(/start date/i), '2024-07-01')
    
    // Click search
    await user.click(screen.getByRole('button', { name: /search events/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/events?category=Music&start_date=2024-07-01&end_date=')
    })
  })

  it('shows clear filters button when filters are active', () => {
    render(<FilterBar currentParams={{ category: 'Music' }} />)
    
    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument()
  })

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{ category: 'Music' }} />)
    
    await user.click(screen.getByRole('button', { name: /clear all filters/i }))
    
    expect(mockPush).toHaveBeenCalledWith('/events')
  })

  it('handles category filtering with ampersands correctly', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{}} />)
    
    const categorySelect = screen.getByDisplayValue('All Categories').closest('select')!
    
    // Test Food & Drink category
    await user.selectOptions(categorySelect, 'Food & Drink')
    await user.click(screen.getByRole('button', { name: /search events/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/events?category=Food+%26+Drink&start_date=&end_date=')
    })
    
    mockPush.mockClear()
    
    // Test Art & Culture category
    await user.selectOptions(categorySelect, 'Art & Culture')
    await user.click(screen.getByRole('button', { name: /search events/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/events?category=Art+%26+Culture&start_date=&end_date=')
    })
  })

  it('displays category options with ampersands correctly', () => {
    render(<FilterBar currentParams={{}} />)
    
    // Get the select element and check its innerHTML for proper ampersand rendering
    const selectElement = screen.getByLabelText(/category/i)
    const selectHTML = selectElement.innerHTML
    
    // Should contain proper "&" in the option text, not "&amp;"
    expect(selectHTML).toContain('Food & Drink')
    expect(selectHTML).toContain('Art & Culture')
    // Should NOT contain double-encoded ampersands
    expect(selectHTML).not.toContain('Food &amp; Drink')
    expect(selectHTML).not.toContain('Art &amp; Culture')
    expect(selectHTML).not.toContain('&amp;amp;')
  })
})