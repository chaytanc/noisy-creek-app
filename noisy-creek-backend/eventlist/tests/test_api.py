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
            location="Past Location",
            category=self.music_category,
            venue=self.venue
        )
        
        self.upcoming_event = Event.objects.create(
            title="Upcoming Concert",
            description="A concert happening soon",
            start_date=now + timedelta(days=7),
            end_date=now + timedelta(days=7, hours=3),
            location="Future Location",
            category=self.music_category,
            venue=self.venue
        )
        
        self.art_event = Event.objects.create(
            title="Art Exhibition",
            description="A beautiful art show",
            start_date=now + timedelta(days=14),
            end_date=now + timedelta(days=14, hours=6),
            location="Gallery",
            category=self.art_category
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
                category=self.music_category
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