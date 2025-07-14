from django.utils import timezone
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from dateutil import parser
from .models import Event
from .serializers import EventSerializer

class EventPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 100

class EventListAPIView(generics.ListAPIView):
    serializer_class = EventSerializer
    pagination_class = EventPagination

    def get_queryset(self):
        queryset = Event.objects.select_related('category', 'venue').order_by("-start_date")
        
        try:
            # Filter by category (sanitize input)
            category = self.request.query_params.get('category')
            if category:
                queryset = queryset.filter(category__name__iexact=category)
            
            # Filter by date range (validate dates)
            start_date = self.request.query_params.get('start_date')
            end_date = self.request.query_params.get('end_date')
            
            if start_date:
                try:
                    parsed_start_date = parser.parse(start_date).date()
                    queryset = queryset.filter(start_date__gte=parsed_start_date)
                except (ValueError, TypeError):
                    pass  # Invalid date format, ignore filter
            
            if end_date:
                try:
                    parsed_end_date = parser.parse(end_date).date()
                    queryset = queryset.filter(start_date__lte=parsed_end_date)
                except (ValueError, TypeError):
                    pass  # Invalid date format, ignore filter
            
            # Filter for upcoming events only
            upcoming = self.request.query_params.get('upcoming')
            if upcoming and upcoming.lower() == 'true':
                queryset = queryset.filter(start_date__gte=timezone.now())

        except Exception:
            # If any error occurs during filtering, return base queryset
            pass
        print(queryset)

        return queryset

class EventDetailAPIView(generics.RetrieveAPIView):
    queryset = Event.objects.select_related('category', 'venue')
    serializer_class = EventSerializer
