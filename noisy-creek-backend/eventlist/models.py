from django.db import models
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

class Event(models.Model):
    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(1)],
        help_text="Event title (1-200 characters)"
    )
    description = models.TextField(
        blank=True,
        validators=[MaxLengthValidator(5000)],
        help_text="Event description (max 5000 characters)"
    )
    start_date = models.DateTimeField(help_text="Event start date and time")
    end_date = models.DateTimeField(help_text="Event end date and time")
    category = models.ForeignKey(
        'Category', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Event category"
    )
    venue = models.ForeignKey(
        'Venue', 
        on_delete=models.CASCADE, 
        null=False, 
        blank=False,
        help_text="Event venue (required)"
    )

    def clean(self):
        """Custom validation for the Event model
        
        Note: HTML content is protected by Django's built-in template auto-escaping.
        No additional sanitization needed for admin-only input.
        """
        super().clean()
        
        # Validate that end_date is after start_date
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValidationError({
                    'end_date': 'End date must be after start date.'
                })
        
        # Validate that events cannot be created too far in the past
        if self.start_date and self.start_date < timezone.now() - timezone.timedelta(days=30):
            raise ValidationError({
                'start_date': 'Events cannot be created more than 30 days in the past.'
            })

    def save(self, *args, **kwargs):
        """Override save to run full validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-start_date']  # Order events by start date, newest first
        verbose_name_plural = "Events"


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        validators=[MinLengthValidator(2), MaxLengthValidator(100)],
        help_text="Category name (2-100 characters, must be unique)"
    )
    description = models.TextField(
        blank=True,
        validators=[MaxLengthValidator(1000)],
        help_text="Category description (max 1000 characters)"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"  # To avoid pluralization issues in admin

class Venue(models.Model):
    name = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(2), MaxLengthValidator(200)],
        help_text="Venue name (2-200 characters)"
    )
    address = models.CharField(
        max_length=300, 
        blank=True,
        help_text="Venue address"
    )
    capacity = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Venue capacity (positive integer)"
    )

    def __str__(self):
        return self.name
    

class EventPost(models.Model):
    """ *Unused but useful for scaling* 
    Model for additional content related to events """
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE,
        help_text="Associated event"
    )
    content = models.TextField(
        help_text="Post content"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Post creation timestamp"
    )

    def clean(self):
        """Custom validation for EventPost model
        
        Note: HTML content is protected by Django's built-in template auto-escaping.
        No additional sanitization needed for admin-only input.
        """
        super().clean()

    def save(self, *args, **kwargs):
        """Override save to run full validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Post for {self.event.title} at {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
    
    class Meta:
        ordering = ['-created_at']  