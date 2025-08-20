from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'plans', views.PlanViewSet, basename='plan')
router.register(r'user-plans', views.UserPlanViewSet, basename='userplan')
router.register(r'features', views.PlanFeatureViewSet, basename='planfeature')

app_name = 'plans'

urlpatterns = [
    path('api/', include(router.urls)),
]
