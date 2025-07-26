import uuid
import secrets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Beam
from .serializers import BeamSerializer

# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class GenerateBeamView(APIView):
    authentication_classes = []
    permission_classes     = [AllowAny]
    
    def post(self, request):
        beam_id  = str(uuid.uuid4())
        beam_key = secrets.token_urlsafe(32)

        beam     = Beam.objects.create(beam_id=beam_id, beam_key=beam_key)

        serializer = BeamSerializer(beam)

        return Response(serializer.data)