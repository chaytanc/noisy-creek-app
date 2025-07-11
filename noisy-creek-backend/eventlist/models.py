from django.db import models

# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, null=True, blank=True)
    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

    # TODO not sure what this does
    class Meta:
        ordering = ['-start_date']  # Order events by start date, newest first
        verbose_name_plural = "Events"


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    # TODO may want to add some kind of field for html for SEO purposes to add to event pages of this category?
    # seo_description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"  # To avoid pluralization issues in admin

# Optional: If you want to manage venues separately
# Useful if multiple events can occur at the same venue
class Venue(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300, blank=True)
    capacity = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name
    

# Not necessary for a very basic event list, but useful for more complex systems 
# where the post could be significantly different from an event itself
class EventPost(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post for {self.event.title} at {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
    
    class Meta:
        # Order posts by creation time, newest first
        ordering = ['-created_at']  