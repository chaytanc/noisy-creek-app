from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.EventListAPIView.as_view(), name='event-list'),
    path('events/<int:pk>/', views.EventDetailAPIView.as_view(), name='event-detail'),
]