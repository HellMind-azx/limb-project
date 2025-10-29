from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from datetime import date, timedelta
from .models import Category, Habit, Progress
from .serializers import CategorySerializer, HabitSerializer, ProgressSerializer


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class HabitListCreateView(generics.ListCreateAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user, is_active=True)


class HabitDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        # Soft delete - just mark as inactive
        instance.is_active = False
        instance.save()


class ProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get progress for user's habits
        user_habits = Habit.objects.filter(user=self.request.user)
        return Progress.objects.filter(habit__in=user_habits)

    def perform_create(self, serializer):
        # Ensure the habit belongs to the current user
        habit = serializer.validated_data['habit']
        if habit.user != self.request.user:
            raise serializers.ValidationError("You can only track progress for your own habits.")
        serializer.save()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_view(request):
    """Get user statistics"""
    user = request.user
    
    # Get user's habits
    habits = Habit.objects.filter(user=user, is_active=True)
    
    # Calculate stats
    total_habits = habits.count()
    
    # Today's completion rate
    today = date.today()
    today_progress = Progress.objects.filter(
        habit__in=habits,
        date=today,
        completed=True
    ).count()
    today_completion_rate = (today_progress / total_habits * 100) if total_habits > 0 else 0
    
    # Weekly completion rate
    week_start = today - timedelta(days=today.weekday())
    week_progress = Progress.objects.filter(
        habit__in=habits,
        date__gte=week_start,
        date__lte=today,
        completed=True
    ).count()
    week_completion_rate = (week_progress / (total_habits * 7) * 100) if total_habits > 0 else 0
    
    # Longest streak
    longest_streak = 0
    for habit in habits:
        streak = calculate_streak(habit)
        longest_streak = max(longest_streak, streak)
    
    # Category breakdown
    category_stats = []
    for category in Category.objects.filter(user=user):
        category_habits = habits.filter(category=category)
        category_progress = Progress.objects.filter(
            habit__in=category_habits,
            date=today,
            completed=True
        ).count()
        category_completion = (category_progress / category_habits.count() * 100) if category_habits.count() > 0 else 0
        
        category_stats.append({
            'id': category.id,
            'name': category.name,
            'icon': category.icon,
            'color': category.color,
            'habits_count': category_habits.count(),
            'completion_rate': category_completion
        })
    
    return Response({
        'total_habits': total_habits,
        'today_completion_rate': round(today_completion_rate, 1),
        'week_completion_rate': round(week_completion_rate, 1),
        'longest_streak': longest_streak,
        'category_stats': category_stats
    })


def calculate_streak(habit):
    """Calculate current streak for a habit"""
    today = date.today()
    streak = 0
    
    # Get progress records ordered by date descending
    progress_records = Progress.objects.filter(
        habit=habit,
        date__lte=today,
        completed=True
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_progress(request):
    """Toggle progress for a habit on a specific date"""
    habit_id = request.data.get('habit_id')
    progress_date = request.data.get('date', date.today())
    
    if not habit_id:
        return Response({'error': 'habit_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        habit = Habit.objects.get(id=habit_id, user=request.user)
    except Habit.DoesNotExist:
        return Response({'error': 'Habit not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get or create progress record
    progress, created = Progress.objects.get_or_create(
        habit=habit,
        date=progress_date,
        defaults={'completed': True}
    )
    
    if not created:
        progress.completed = not progress.completed
        progress.save()
    
    serializer = ProgressSerializer(progress)
    return Response(serializer.data)