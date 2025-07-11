from django.contrib import admin
from .models import Event, Venue, Category  # adjust to match your models

# Register your models here.
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'venue', 'start_date', 'end_date')
    list_filter = ('venue', 'category')
    search_fields = ('title', 'description')

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)