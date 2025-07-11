# management/commands/populate_events.py
# Save this file as: your_app/management/commands/populate_events.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
import random
from eventlist.models import Event, Category, Venue, EventPost 

class Command(BaseCommand):
    help = 'Populate the database with sample events'

    def handle(self, *args, **options):
        # Clear existing data
        Event.objects.all().delete()
        Category.objects.all().delete()
        Venue.objects.all().delete()
        EventPost.objects.all().delete()

        # Create Categories
        categories_data = [
            {
                'name': 'Music',
                'description': 'Live music performances, concerts, and musical events featuring local and touring artists across all genres.'
            },
            {
                'name': 'Food & Drink',
                'description': 'Food festivals, wine tastings, brewery events, and culinary experiences showcasing Pacific Northwest flavors.'
            },
            {
                'name': 'Outdoor',
                'description': 'Hiking, camping, outdoor adventures, and nature-based activities taking advantage of our beautiful landscape.'
            },
            {
                'name': 'Art & Culture',
                'description': 'Art exhibitions, cultural festivals, theater performances, and creative community gatherings.'
            },
            {
                'name': 'Sports',
                'description': 'Professional sports, recreational leagues, tournaments, and athletic events for all skill levels.'
            },
            {
                'name': 'Community',
                'description': 'Neighborhood gatherings, volunteer opportunities, and events that bring our community together.'
            }
        ]

        categories = {}
        for cat_data in categories_data:
            category = Category.objects.create(**cat_data)
            categories[cat_data['name']] = category
            self.stdout.write(f"Created category: {category.name}")

        # Create Venues
        venues_data = [
            {
                'name': 'The Crocodile',
                'address': '2200 2nd Ave, Seattle, WA 98121',
                'capacity': 400
            },
            {
                'name': 'Fremont Brewing',
                'address': '1050 N 34th St, Seattle, WA 98103',
                'capacity': 150
            },
            {
                'name': 'Woodland Park Zoo',
                'address': '5500 Phinney Ave N, Seattle, WA 98103',
                'capacity': 300
            },
            {
                'name': 'Gas Works Park',
                'address': '2101 N Northlake Way, Seattle, WA 98103',
                'capacity': 800
            },
            {
                'name': 'Belltown Community Center',
                'address': '415 Bell St, Seattle, WA 98121',
                'capacity': 100
            }
        ]

        venues = {}
        for venue_data in venues_data:
            venue = Venue.objects.create(**venue_data)
            venues[venue_data['name']] = venue
            self.stdout.write(f"Created venue: {venue.name}")

        # Create Events
        events_data = [
            # Music Events
            {
                'title': 'Jazz in the Park',
                'description': 'Monthly jazz series featuring both emerging and established musicians from the Seattle jazz scene. Bring a blanket and enjoy smooth sounds in a beautiful outdoor setting.',
                'category': 'Music',
                'venue': 'Gas Works Park',
                'days_from_now': 8,
                'duration_hours': 3
            },
            {
                'title': 'Electronic Music Showcase',
                'description': 'Late night electronic music event featuring DJs and live electronic artists. Dance the night away to beats and bass in an intimate venue setting.',
                'category': 'Music',
                'venue': 'The Crocodile',
                'days_from_now': 22,
                'duration_hours': 5
            },
            
            # Food & Drink Events
            {
                'title': 'Pacific Northwest Food Festival',
                'description': 'Taste the best of local cuisine featuring salmon, craft beer, artisanal cheeses, and farm-to-table restaurants. Learn about sustainable food practices and meet local producers.',
                'category': 'Food & Drink',
                'venue': 'Gas Works Park',
                'days_from_now': 12,
                'duration_hours': 8
            },
            {
                'title': 'Craft Beer Tasting',
                'description': 'Sample a wide variety of Pacific Northwest craft beers while learning about brewing techniques from local masters. Includes food pairings and brewery tours.',
                'category': 'Food & Drink',
                'venue': 'Fremont Brewing',
                'days_from_now': 5,
                'duration_hours': 4
            },
            {
                'title': 'Farm to Table Dinner',
                'description': 'Multi-course dinner featuring ingredients sourced from local farms and producers. Each dish paired with local wines and served in a community garden setting.',
                'category': 'Food & Drink',
                'venue': 'Woodland Park Zoo',
                'days_from_now': 18,
                'duration_hours': 3
            },

            # Outdoor Events
            {
                'title': 'Guided Nature Hike',
                'description': 'Explore local trails with an experienced naturalist guide. Learn about Pacific Northwest flora and fauna while enjoying moderate hiking through beautiful forest landscapes.',
                'category': 'Outdoor',
                'venue': 'Woodland Park Zoo',
                'days_from_now': 3,
                'duration_hours': 4
            },
            {
                'title': 'Outdoor Yoga Session',
                'description': 'Start your weekend with yoga in the park. All skill levels welcome. Bring your own mat and water. Sessions focus on connecting with nature and finding inner peace.',
                'category': 'Outdoor',
                'venue': 'Gas Works Park',
                'days_from_now': 2,
                'duration_hours': 2
            },
            {
                'title': 'Urban Foraging Workshop',
                'description': 'Learn to identify and safely harvest edible plants in urban environments. Includes a guided walk and cooking demonstration using foraged ingredients.',
                'category': 'Outdoor',
                'venue': 'Woodland Park Zoo',
                'days_from_now': 25,
                'duration_hours': 5
            },

            # Art & Culture Events
            {
                'title': 'Local Artists Gallery Opening',
                'description': 'Celebrate emerging Pacific Northwest artists with an evening of art, wine, and conversation. Features paintings, sculptures, and mixed media from 15 local creators.',
                'category': 'Art & Culture',
                'venue': 'Belltown Community Center',
                'days_from_now': 7,
                'duration_hours': 4
            },
            {
                'title': 'Community Theater Performance',
                'description': 'Original play written and performed by community members, exploring themes of family, nature, and belonging in the Pacific Northwest.',
                'category': 'Art & Culture',
                'venue': 'Belltown Community Center',
                'days_from_now': 14,
                'duration_hours': 3
            },
            {
                'title': 'Poetry and Coffee Evening',
                'description': 'Open mic poetry night featuring local poets and writers. Enjoy artisan coffee and pastries while listening to original works and slam poetry performances.',
                'category': 'Art & Culture',
                'venue': 'Fremont Brewing',
                'days_from_now': 6,
                'duration_hours': 3
            },

            # Sports Events
            {
                'title': 'Community Soccer Tournament',
                'description': 'Annual neighborhood soccer tournament open to all ages and skill levels. Teams compete in a friendly atmosphere with prizes for sportsmanship and community spirit.',
                'category': 'Sports',
                'venue': 'Gas Works Park',
                'days_from_now': 20,
                'duration_hours': 8
            },
            {
                'title': 'Charity Fun Run',
                'description': '5K and 10K runs through scenic park trails to benefit local environmental organizations. Registration includes t-shirt, post-race refreshments, and raffle entry.',
                'category': 'Sports',
                'venue': 'Gas Works Park',
                'days_from_now': 11,
                'duration_hours': 4
            },

            # Community Events
            {
                'title': 'Community Potluck and Game Night',
                'description': 'Monthly gathering bringing neighbors together for food, games, and conversation. Bring a dish to share and enjoy board games, card games, and community connection.',
                'category': 'Community',
                'venue': 'Belltown Community Center',
                'days_from_now': 9,
                'duration_hours': 4
            },
            {
                'title': 'Skill Share Workshop',
                'description': 'Community members teach each other practical skills like gardening, bike repair, cooking, and crafts. Free workshop with materials provided and lunch included.',
                'category': 'Community',
                'venue': 'Belltown Community Center',
                'days_from_now': 16,
                'duration_hours': 6
            },

            # Past Events (for testing filters)
            {
                'title': 'Summer Music Festival',
                'description': 'Three-day music festival featuring over 50 artists across multiple stages. Food vendors, art installations, and family-friendly activities.',
                'category': 'Music',
                'venue': 'Gas Works Park',
                'days_from_now': -30,
                'duration_hours': 12
            },
            {
                'title': 'Harvest Festival',
                'description': 'Celebration of fall harvest with local farmers, pumpkin carving, apple cider, and traditional Pacific Northwest foods.',
                'category': 'Food & Drink',
                'venue': 'Gas Works Park',
                'days_from_now': -60,
                'duration_hours': 8
            }
        ]

        events = []
        for event_data in events_data:
            start_date = timezone.now() + timedelta(days=event_data['days_from_now'])
            end_date = start_date + timedelta(hours=event_data['duration_hours'])
            
            event = Event.objects.create(
                title=event_data['title'],
                description=event_data['description'],
                start_date=start_date,
                end_date=end_date,
                category=categories[event_data['category']],
                venue=venues[event_data['venue']],
                location=f"{venues[event_data['venue']].name}, {venues[event_data['venue']].address}"
            )
            events.append(event)
            self.stdout.write(f"Created event: {event.title}")

        # Create some Event Posts
        post_templates = [
            "Don't miss this amazing event! Limited spots available.",
            "Early bird tickets now available with special pricing.",
            "This event has been updated with new performers and activities.",
            "Weather looks great for this outdoor event!",
            "Thanks to our community sponsors who make this event possible.",
            "Volunteers needed! Contact us if you'd like to help.",
            "Parking information and transit options now posted.",
            "Check out photos from last year's event on our website."
        ]

        for event in random.sample(events, 8):  # Create posts for 8 random events
            post_content = random.choice(post_templates)
            EventPost.objects.create(
                event=event,
                content=post_content
            )
            self.stdout.write(f"Created post for event: {event.title}")

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(categories)} categories, '
                f'{len(venues)} venues, {len(events)} events, and 8 event posts'
            )
        )
