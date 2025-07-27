import time
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
from django.http import JsonResponse, HttpResponse, Http404
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import httpx

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

@method_decorator(csrf_exempt, name='dispatch')
class ZeroXZeroUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    # FS limit (200MB)
    MAX_FILE_SIZE = 200 * 1024 * 1024
    
    def post(self, request):        
        if 'file' not in request.FILES:
            return Response({
                'error': 'No file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        file_size = uploaded_file.size
        
        if file_size > self.MAX_FILE_SIZE:
            return Response({
                'error': 'File too large',
                'details': f'File size {self.human_readable_size(file_size)} exceeds maximum allowed size of {self.human_readable_size(self.MAX_FILE_SIZE)}',
                'max_size': self.human_readable_size(self.MAX_FILE_SIZE)
            }, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
        
        timeout_seconds = max(120, 120 + (file_size // (1024 * 1024)) * 30)
        
        max_retries = 2
        retry_count = 0
        
        client_timeout = httpx.Timeout(
            connect=30.0,
            read=timeout_seconds,
            write=timeout_seconds,
            pool=60.0
        )
        
        limits = httpx.Limits(max_connections=1, max_keepalive_connections=1)
        
        while retry_count <= max_retries:
            try:
                uploaded_file.seek(0)
                
                with httpx.Client(timeout=client_timeout, limits=limits) as client:
                    files = {
                        'file': (
                            uploaded_file.name,
                            uploaded_file,
                            uploaded_file.content_type
                        )
                    }
                    headers = {'User-Agent': 'FriendlyUploader'}
                    
                    response = client.post(
                        'https://0x0.st',
                        files=files,
                        headers=headers
                    )
                
                break
                
            except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadTimeout, httpx.WriteTimeout) as e:
                retry_count += 1
                if retry_count > max_retries:
                    raise e
                time.sleep(2 ** retry_count)
                continue

        try:
            return HttpResponse(
                response.content,
                status=response.status_code,
                content_type=response.headers.get('Content-Type', 'text/plain')
            )
            
        except (httpx.TimeoutException, httpx.ReadTimeout, httpx.WriteTimeout):
            return Response({
                'error': 'Upload timeout',
                'details': f'Upload to 0x0.st timed out after {max_retries + 1} attempts. File size: {self.human_readable_size(file_size)}',
                'suggestion': 'Try uploading a smaller file or try again later',
                'timeout_used': timeout_seconds
            }, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except (httpx.ConnectError, httpx.NetworkError):
            return Response({
                'error': 'Connection error',
                'details': f'Could not connect to 0x0.st after {max_retries + 1} attempts. The service might be temporarily unavailable.',
                'suggestion': 'Please try again in a few minutes'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except httpx.HTTPError as e:
            return Response({
                'error': 'Failed to upload to external service',
                'details': str(e),
                'file_size': self.human_readable_size(file_size)
            }, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({
                'error': 'Upload failed',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)