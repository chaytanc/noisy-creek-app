from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .models import Event
from .serializers import EventSerializer

class EventPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class EventListAPIView(generics.ListAPIView):
    serializer_class = EventSerializer
    pagination_class = EventPagination

    def get_queryset(self):
        queryset = Event.objects.select_related('category', 'venue').order_by("-start_date")
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(start_date__lte=end_date)
        
        # Filter for upcoming events only
        upcoming = self.request.query_params.get('upcoming')
        if upcoming and upcoming.lower() == 'true':
            queryset = queryset.filter(start_date__gte=timezone.now())

        return queryset

class EventDetailAPIView(generics.RetrieveAPIView):
    queryset = Event.objects.select_related('category', 'venue')
    serializer_class = EventSerializer
