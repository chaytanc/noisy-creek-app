from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from eventlist.models import Event, Category, Venue


class CategoryModelTest(TestCase):
    def test_create_category(self):
        """Test creating a category"""
        category = Category.objects.create(
            name="Music",
            description="Live music events"
        )
        self.assertEqual(str(category), "Music")
        self.assertEqual(category.name, "Music")

    def test_category_str_representation(self):
        """Test category string representation"""
        category = Category(name="Art & Culture")
        self.assertEqual(str(category), "Art & Culture")


class VenueModelTest(TestCase):
    def test_create_venue(self):
        """Test creating a venue"""
        venue = Venue.objects.create(
            name="Test Venue",
            address="123 Test St",
            capacity=100
        )
        self.assertEqual(str(venue), "Test Venue")
        self.assertEqual(venue.capacity, 100)

    def test_venue_without_capacity(self):
        """Test venue creation without capacity"""
        venue = Venue.objects.create(
            name="Test Venue",
            address="123 Test St"
        )
        self.assertIsNone(venue.capacity)


class EventModelTest(TestCase):
    def setUp(self):
        """Set up test data"""
        self.category = Category.objects.create(
            name="Music",
            description="Live music events"
        )
        self.venue = Venue.objects.create(
            name="Test Venue",
            address="123 Test St",
            capacity=100
        )

    def test_create_event(self):
        """Test creating an event"""
        start_date = timezone.now() + timedelta(days=7)
        end_date = start_date + timedelta(hours=3)
        
        event = Event.objects.create(
            title="Test Concert",
            description="A great concert",
            start_date=start_date,
            end_date=end_date,
            location="Downtown",
            category=self.category,
            venue=self.venue
        )
        
        self.assertEqual(str(event), "Test Concert")
        self.assertEqual(event.category, self.category)
        self.assertEqual(event.venue, self.venue)

    def test_event_ordering(self):
        """Test that events are ordered by start_date descending"""
        now = timezone.now()
        
        event1 = Event.objects.create(
            title="Earlier Event",
            start_date=now + timedelta(days=1),
            end_date=now + timedelta(days=1, hours=2),
            category=self.category
        )
        
        event2 = Event.objects.create(
            title="Later Event", 
            start_date=now + timedelta(days=7),
            end_date=now + timedelta(days=7, hours=2),
            category=self.category
        )
        
        events = Event.objects.all()
        self.assertEqual(events[0], event2)  # Later event first
        self.assertEqual(events[1], event1)

    def test_event_without_optional_fields(self):
        """Test creating event without optional fields"""
        start_date = timezone.now() + timedelta(days=7)
        end_date = start_date + timedelta(hours=3)
        
        event = Event.objects.create(
            title="Minimal Event",
            start_date=start_date,
            end_date=end_date
        )
        
        self.assertEqual(event.title, "Minimal Event")
        self.assertEqual(event.description, "")
        self.assertEqual(event.location, "")
        self.assertIsNone(event.category)
        self.assertIsNone(event.venue)