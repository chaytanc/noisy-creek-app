from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from eventlist.models import Event, Category, Venue, EventPost


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

    def test_category_name_unique(self):
        """Test that category names must be unique"""
        Category.objects.create(name="Music", description="Live music events")
        with self.assertRaises(ValidationError):
            Category.objects.create(name="Music", description="Different description")

    def test_category_html_sanitization(self):
        """Test that HTML is sanitized in category fields"""
        category = Category.objects.create(
            name="<script>alert('test')</script>Music",
            description="<p>Live music events</p><script>alert('bad')</script>"
        )
        self.assertEqual(category.name, "Music")
        self.assertEqual(category.description, "<p>Live music events</p>")


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

    def test_venue_html_sanitization(self):
        """Test that HTML is sanitized in venue fields"""
        venue = Venue.objects.create(
            name="<script>alert('test')</script>Test Venue",
            address="<b>123 Test St</b><script>bad()</script>",
            capacity=100
        )
        self.assertEqual(venue.name, "Test Venue")
        # nh3 removes all HTML from address since we pass tags=set()
        self.assertEqual(venue.address, "123 Test St")

    def test_venue_positive_capacity(self):
        """Test that capacity must be positive"""
        venue = Venue(name="Test Venue", capacity=-10)
        with self.assertRaises(ValidationError):
            venue.full_clean()


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

    def test_event_end_date_validation(self):
        """Test that end_date must be after start_date"""
        start_date = timezone.now() + timedelta(days=7)
        end_date = start_date - timedelta(hours=1)  # End before start
        
        event = Event(
            title="Invalid Event",
            start_date=start_date,
            end_date=end_date,
            category=self.category
        )
        with self.assertRaises(ValidationError):
            event.full_clean()

    def test_event_past_date_validation(self):
        """Test that events cannot be created too far in the past"""
        past_date = timezone.now() - timedelta(days=32)
        
        event = Event(
            title="Past Event",
            start_date=past_date,
            end_date=past_date + timedelta(hours=2),
            category=self.category
        )
        with self.assertRaises(ValidationError):
            event.full_clean()

    def test_event_title_validation(self):
        """Test event title validation"""
        start_date = timezone.now() + timedelta(days=7)
        end_date = start_date + timedelta(hours=3)
        
        # Test empty title
        event = Event(
            title="",
            start_date=start_date,
            end_date=end_date
        )
        with self.assertRaises(ValidationError):
            event.full_clean()

    def test_event_html_sanitization(self):
        """Test that HTML is sanitized in event fields"""
        start_date = timezone.now() + timedelta(days=7)
        end_date = start_date + timedelta(hours=3)
        
        event = Event.objects.create(
            title="<script>alert('test')</script>Test Event",
            description="<p>Great event</p><script>alert('bad')</script><strong>Bold text</strong>",
            start_date=start_date,
            end_date=end_date,
            location="<b>Downtown</b><script>bad()</script>",
            category=self.category
        )
        
        self.assertEqual(event.title, "Test Event")
        self.assertIn("<p>Great event</p>", event.description)
        self.assertIn("<strong>Bold text</strong>", event.description)
        self.assertNotIn("<script>", event.description)
        # nh3 removes all HTML from location since we pass tags=set()
        self.assertEqual(event.location, "Downtown")
