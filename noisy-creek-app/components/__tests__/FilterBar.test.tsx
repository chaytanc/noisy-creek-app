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
      category: 'music',
      start_date: '2024-07-01',
      upcoming: 'true'
    }
    
    render(<FilterBar currentParams={currentParams} />)
    
    expect(screen.getByDisplayValue('music')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2024-07-01')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('updates form values when user types', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{}} />)
    
    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'music')
    
    expect(categorySelect).toHaveValue('music')
  })

  it('applies filters when search button is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{}} />)
    
    // Set some filters
    await user.selectOptions(screen.getByLabelText(/category/i), 'music')
    await user.type(screen.getByLabelText(/start date/i), '2024-07-01')
    
    // Click search
    await user.click(screen.getByRole('button', { name: /search events/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/events?category=music&start_date=2024-07-01')
    })
  })

  it('shows clear filters button when filters are active', () => {
    render(<FilterBar currentParams={{ category: 'music' }} />)
    
    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument()
  })

  it('clears filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterBar currentParams={{ category: 'music' }} />)
    
    await user.click(screen.getByRole('button', { name: /clear all filters/i }))
    
    expect(mockPush).toHaveBeenCalledWith('/events')
  })
})