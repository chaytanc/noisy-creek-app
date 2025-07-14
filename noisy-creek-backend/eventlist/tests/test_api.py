from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import timedelta
from eventlist.models import Event, Category, Venue


class EventAPITest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        
        # Create test categories
        self.music_category = Category.objects.create(
            name="Music",
            description="Live music events"
        )
        self.art_category = Category.objects.create(
            name="Art & Culture",
            description="Art and cultural events"
        )
        
        # Create test venue
        self.venue = Venue.objects.create(
            name="Test Venue",
            address="123 Test St",
            capacity=100
        )
        
        # Create test events
        now = timezone.now()
        
        self.past_event = Event.objects.create(
            title="Past Concert",
            description="A concert that already happened",
            start_date=now - timedelta(days=7),
            end_date=now - timedelta(days=7, hours=-3),
            category=self.music_category,
            venue=self.venue
        )
        
        self.upcoming_event = Event.objects.create(
            title="Upcoming Concert",
            description="A concert happening soon",
            start_date=now + timedelta(days=7),
            end_date=now + timedelta(days=7, hours=3),
            category=self.music_category,
            venue=self.venue
        )
        
        # Create a venue for art event
        self.art_venue = Venue.objects.create(
            name="Art Gallery",
            address="456 Art St",
            capacity=50
        )
        
        self.art_event = Event.objects.create(
            title="Art Exhibition",
            description="A beautiful art show",
            start_date=now + timedelta(days=14),
            end_date=now + timedelta(days=14, hours=6),
            category=self.art_category,
            venue=self.art_venue
        )

    def test_get_all_events(self):
        """Test getting all events"""
        url = reverse('event-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)
        self.assertEqual(len(response.data['results']), 3)

    def test_filter_by_category(self):
        """Test filtering events by category"""
        url = reverse('event-list')
        response = self.client.get(url, {'category': 'Music'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        
        # Check that all returned events are Music category
        for event in response.data['results']:
            self.assertEqual(event['category']['name'], 'Music')

    def test_filter_by_category_case_insensitive(self):
        """Test that category filtering is case insensitive"""
        url = reverse('event-list')
        response = self.client.get(url, {'category': 'music'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_filter_by_art_culture_category(self):
        """Test filtering by 'Art & Culture' category with special characters"""
        url = reverse('event-list')
        response = self.client.get(url, {'category': 'Art & Culture'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Art Exhibition')

    def test_filter_upcoming_events(self):
        """Test filtering for upcoming events only"""
        url = reverse('event-list')
        response = self.client.get(url, {'upcoming': 'true'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        
        # Check that no past events are returned
        for event in response.data['results']:
            self.assertNotEqual(event['title'], 'Past Concert')

    def test_filter_by_date_range(self):
        """Test filtering events by date range"""
        url = reverse('event-list')
        start_date = (timezone.now() + timedelta(days=6)).date()
        end_date = (timezone.now() + timedelta(days=8)).date()
        
        response = self.client.get(url, {
            'start_date': start_date,
            'end_date': end_date
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Upcoming Concert')

    def test_pagination(self):
        """Test API pagination"""
        # Create more events to test pagination
        for i in range(12):
            Event.objects.create(
                title=f"Test Event {i}",
                start_date=timezone.now() + timedelta(days=i+1),
                end_date=timezone.now() + timedelta(days=i+1, hours=2),
                category=self.music_category,
                venue=self.venue
            )
        
        url = reverse('event-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 9)  # Default page size
        self.assertIsNotNone(response.data['next'])

    def test_get_event_detail(self):
        """Test getting a single event"""
        url = reverse('event-detail', kwargs={'pk': self.upcoming_event.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Upcoming Concert')
        self.assertEqual(response.data['category']['name'], 'Music')
        self.assertEqual(response.data['venue']['name'], 'Test Venue')

    def test_get_nonexistent_event(self):
        """Test getting a non-existent event returns 404"""
        url = reverse('event-detail', kwargs={'pk': 99999})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_events_ordered_by_start_date_desc(self):
        """Test that events are ordered by start_date descending"""
        url = reverse('event-list')
        response = self.client.get(url)
        
        events = response.data['results']
        self.assertEqual(events[0]['title'], 'Art Exhibition')  # Latest start date
        self.assertEqual(events[1]['title'], 'Upcoming Concert')
        self.assertEqual(events[2]['title'], 'Past Concert')  # Earliest start date

    def test_invalid_date_format_handling(self):
        """Test that invalid date formats are handled gracefully"""
        url = reverse('event-list')
        
        # Test invalid date formats
        invalid_dates = ['not-a-date', '2023-13-45', '2023/12/31', 'yesterday']
        
        for invalid_date in invalid_dates:
            response = self.client.get(url, {'start_date': invalid_date})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            # Should return all events since invalid filter is ignored
            self.assertEqual(response.data['count'], 3)

    def test_sql_injection_attempt_in_category(self):
        """Test that SQL injection attempts are handled safely"""
        url = reverse('event-list')
        sql_injection = "'; DROP TABLE eventlist_event; --"
        
        response = self.client.get(url, {'category': sql_injection})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify events still exist (table wasn't dropped)
        self.assertEqual(response.data['count'], 0)  # No matching category

    def test_extremely_long_category_input(self):
        """Test handling of extremely long category input"""
        url = reverse('event-list')
        long_category = "A" * 10000  # Very long string
        
        response = self.client.get(url, {'category': long_category})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_special_characters_in_category(self):
        """Test that special characters in category names work correctly"""
        url = reverse('event-list')
        
        # Test the actual "Art & Culture" category with special characters
        response = self.client.get(url, {'category': 'Art & Culture'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        
        # Test URL encoding
        response = self.client.get(url, {'category': 'Art%20%26%20Culture'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_multiple_malicious_parameters(self):
        """Test handling of multiple malicious parameters simultaneously"""
        url = reverse('event-list')
        
        # Verify events exist before the request
        initial_count = Event.objects.count()
        self.assertEqual(initial_count, 3)
        
        response = self.client.get(url, {
            'category': '<script>alert("xss")</script>',
            'start_date': 'DROP TABLE events',
            'end_date': '"; DELETE FROM events; --',
            'upcoming': '<img src=x onerror=alert(1)>'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Category filter is applied (no category with XSS name exists), 
        # invalid dates are ignored, invalid upcoming value is ignored
        self.assertEqual(response.data['count'], 0)
        
        # Verify that SQL injection attempts failed - events still exist
        final_count = Event.objects.count()
        self.assertEqual(final_count, 3)
        self.assertEqual(final_count, initial_count)

    def test_unicode_in_category_filter(self):
        """Test handling of unicode characters in category filter"""
        # Create a category with unicode characters
        unicode_category = Category.objects.create(
            name="Música & Dança",
            description="Music and dance events"
        )
        
        Event.objects.create(
            title="Unicode Event",
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1, hours=2),
            category=unicode_category,
            venue=self.venue
        )
        
        url = reverse('event-list')
        response = self.client.get(url, {'category': 'Música & Dança'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Unicode Event')

    def test_boundary_date_values(self):
        """Test boundary date values for filtering"""
        url = reverse('event-list')
        
        # Test very far future date
        future_date = '2099-12-31'
        response = self.client.get(url, {'start_date': future_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        
        # Test very old date
        old_date = '1900-01-01'
        response = self.client.get(url, {'start_date': old_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)  # All events are after 1900

    def test_pagination_with_filtering(self):
        """Test that pagination works correctly with filtering"""
        # Create many more events in the same category
        for i in range(15):
            Event.objects.create(
                title=f"Music Event {i}",
                start_date=timezone.now() + timedelta(days=i+20),
                end_date=timezone.now() + timedelta(days=i+20, hours=2),
                category=self.music_category,
                venue=self.venue
            )
        
        url = reverse('event-list')
        response = self.client.get(url, {'category': 'Music', 'page_size': 5})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)
        self.assertEqual(response.data['count'], 17)  # 2 original + 15 new
        self.assertIsNotNone(response.data['next'])

    def test_combined_filters_integration(self):
        """Test multiple filters working together"""
        url = reverse('event-list')
        
        # Filter by category and upcoming events
        response = self.client.get(url, {
            'category': 'Music',
            'upcoming': 'true'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)  # Only upcoming music event
        self.assertEqual(response.data['results'][0]['title'], 'Upcoming Concert')

    def test_date_range_and_category_filter(self):
        """Test date range filtering combined with category filtering"""
        url = reverse('event-list')
        
        # Get events in specific date range and category
        start_date = (timezone.now() + timedelta(days=6)).date()
        end_date = (timezone.now() + timedelta(days=15)).date()
        
        response = self.client.get(url, {
            'category': 'Music',
            'start_date': start_date,
            'end_date': end_date
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], 'Upcoming Concert')

    def test_pagination_edge_cases(self):
        """Test pagination edge cases"""
        url = reverse('event-list')
        
        # Test page_size = 0 (should use default)
        response = self.client.get(url, {'page_size': 0})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test very large page_size (should be capped)
        response = self.client.get(url, {'page_size': 1000})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data['results']), 100)  # Max page size
        
        # Test invalid page number
        response = self.client.get(url, {'page': 999})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_performance_with_large_dataset(self):
        """Test API performance with larger dataset"""
        # Create many events to test performance
        events_to_create = []
        for i in range(50):
            events_to_create.append(Event(
                title=f"Performance Test Event {i}",
                start_date=timezone.now() + timedelta(days=i+1),
                end_date=timezone.now() + timedelta(days=i+1, hours=2),
                category=self.music_category if i % 2 == 0 else self.art_category,
                venue=self.venue if i % 2 == 0 else self.art_venue
            ))
        
        Event.objects.bulk_create(events_to_create)
        
        url = reverse('event-list')
        
        # Test that the API still responds quickly
        import time
        start_time = time.time()
        response = self.client.get(url)
        end_time = time.time()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLess(end_time - start_time, 1.0)  # Should respond within 1 second
        
        # Test filtering performance
        start_time = time.time()
        response = self.client.get(url, {'category': 'Music'})
        end_time = time.time()
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLess(end_time - start_time, 1.0)  # Should respond within 1 second

    def test_api_response_structure_consistency(self):
        """Test that API responses maintain consistent structure"""
        url = reverse('event-list')
        
        # Test various filtering scenarios
        scenarios = [
            {},  # No filters
            {'category': 'Music'},
            {'upcoming': 'true'},
            {'category': 'NonExistent'},  # No results
        ]
        
        for params in scenarios:
            response = self.client.get(url, params)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            
            # Check response structure
            self.assertIn('count', response.data)
            self.assertIn('results', response.data)
            self.assertIsInstance(response.data['results'], list)
            
            # Check event structure if events exist
            if response.data['results']:
                event = response.data['results'][0]
                required_fields = [
                    'id', 'title', 'description', 'start_date', 
                    'end_date', 'category', 'venue'
                ]
                for field in required_fields:
                    self.assertIn(field, event)