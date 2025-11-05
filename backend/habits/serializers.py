from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Habit, Progress


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class HabitSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    streak_count = serializers.SerializerMethodField()

    class Meta:
        model = Habit
        fields = ['id', 'title', 'description', 'category', 'category_name', 
                 'category_color', 'category_icon', 'frequency', 'target_count', 'is_active', 
                 'created_at', 'streak_count']
        read_only_fields = ['created_at', 'streak_count']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def get_streak_count(self, obj):
        """Calculate current streak for the habit"""
        from django.db.models import Q
        from datetime import date, timedelta
        
        today = date.today()
        streak = 0
        
        # Get progress records ordered by date descending
        progress_records = obj.progress.filter(
            Q(date__lte=today) & Q(completed=True)
        ).order_by('-date')
        
        if not progress_records.exists():
            return 0
            
        # Calculate streak
        current_date = today
        for progress in progress_records:
            if progress.date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
                
        return streak


class ProgressSerializer(serializers.ModelSerializer):
    habit_title = serializers.CharField(source='habit.title', read_only=True)

    class Meta:
        model = Progress
        fields = ['id', 'habit', 'habit_title', 'date', 'completed', 'notes', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        # Ensure the habit belongs to the current user
        habit = validated_data['habit']
        if habit.user != self.context['request'].user:
            raise serializers.ValidationError("You can only track progress for your own habits.")
        return super().create(validated_data)
