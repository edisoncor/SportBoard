from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from .health import health_check, simple_health_check, readiness_check, liveness_check

urlpatterns = [
    # Health check endpoints
    path('health/', health_check, name='health-check'),
    path('health/simple/', simple_health_check, name='simple-health-check'),
    path('health/ready/', readiness_check, name='readiness-check'),
    path('health/live/', liveness_check, name='liveness-check'),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/doc/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/v1/auth/', include('user.urls.auth')),
    path('api/v1/user/', include('user.urls.user')),
    path('api/v1/roles/', include('user.urls.roles')), 
    path('api/v1/permissions/', include('user.urls.permissions')), 
    path('api/v1/transactions/', include('transaction.urls')), 
    path('api/v1/institutions/', include('institution.urls')),
    path('api/v1/administrations/', include('administration.urls')),
    path('api/v1/departments/', include('department.urls')),
    path('api/v1/measuring-heald/', include('measuring_heald.urls')),
    path('api/v1/performance/', include('performance.urls')),
    path('api/v1/sport-profile/', include('sport_profile.urls')),
    path('api/v1/catalog/', include('catalog.urls')),
]
