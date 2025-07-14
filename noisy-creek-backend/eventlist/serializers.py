from rest_framework import serializers
from .models import Event, Category, Venue, EventPost

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = ['id', 'name', 'address', 'capacity']

class EventSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    venue = VenueSerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date', 
            'location', 'category', 'venue'
        ]


class EventPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = ['id', 'event', 'content', 'created_at']
