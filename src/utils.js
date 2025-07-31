import { api } from "./consts";

export const isValidUUIDv4 = (uuid) => {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(uuid);
}


export const uploadToUguu = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Uploaded File Info:', response.data);
    return response.data;
  } catch (error) {
    console.log('Upload failed:', error);
    return null;
  }
};