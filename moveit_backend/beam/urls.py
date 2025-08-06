from django.urls import path
from .views import (
    GenerateBeamView,
    ZeroXZeroUploadView,
    share_beam_view,
    get_shared_beams_view,
    get_my_shared_beams_view,
    unshare_beam_view,
    update_share_permissions_view
)

urlpatterns = [
    path('create/', GenerateBeamView.as_view(), name='create_beam'),
    path('upload/', ZeroXZeroUploadView.as_view(), name='upload_file'),
    path('share/', share_beam_view, name='share_beam'),
    path('shared-with-me/', get_shared_beams_view, name='get_shared_beams'),
    path('my-shares/', get_my_shared_beams_view, name='get_my_shared_beams'),
    path('unshare/<int:share_id>/', unshare_beam_view, name='unshare_beam'),
    path('update-share/<int:share_id>/', update_share_permissions_view, name='update_share_permissions'),
]