from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.accounts.urls import urlpatterns as accounts_urls
from apps.catalog.urls import urlpatterns as catalog_urls
from apps.company.urls import urlpatterns as company_urls
from apps.contacts.urls import urlpatterns as contacts_urls
from apps.procurement.urls import urlpatterns as procurement_urls
from apps.projects.urls import urlpatterns as projects_urls
from apps.quotes.urls import urlpatterns as quotes_urls
from apps.software.urls import urlpatterns as software_urls

api_v1_patterns = (
    company_urls
    + catalog_urls
    + software_urls
    + procurement_urls
    + projects_urls
    + quotes_urls
    + contacts_urls
    + accounts_urls
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
