from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('habits/', views.HabitListCreateView.as_view(), name='habit-list-create'),
    path('habits/<int:pk>/', views.HabitDetailView.as_view(), name='habit-detail'),
    path('progress/', views.ProgressListCreateView.as_view(), name='progress-list-create'),
    path('progress/toggle/', views.toggle_progress, name='toggle-progress'),
    path('stats/', views.stats_view, name='stats'),
]
