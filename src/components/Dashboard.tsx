import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { s3Client, bucketName } from '../lib/s3';
import { LogOut, Upload } from 'lucide-react';
import { PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface ImageData {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  created_at: string;
  url?: string;
}

export default function Dashboard() {
  const { session, signOut } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        // Get signed URLs for each image
        const imagesWithUrls = await Promise.all(
          data.map(async (image) => {
            const command = new GetObjectCommand({
              Bucket: bucketName,
              Key: image.file_path,
            });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            return { ...image, url };
          })
        );
        setImages(imagesWithUrls);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${session?.user.id}/${Math.random()}.${fileExt}`;

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: file,
        ContentType: file.type,
      });

      await s3Client.send(command);

      // Save metadata to Supabase
      const { error: dbError } = await supabase.from('images').insert([
        {
          user_id: session?.user.id,
          file_path: filePath,
          file_name: file.name,
        },
      ]);

      if (dbError) throw dbError;
      
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Upload className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Image Upload App</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                  className="hidden"
                />
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-4">
                    <img
                      src={image.url}
                      alt={image.file_name}
                      className="w-full h-48 object-cover rounded"
                    />
                    <p className="mt-2 text-sm text-gray-500">{image.file_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}