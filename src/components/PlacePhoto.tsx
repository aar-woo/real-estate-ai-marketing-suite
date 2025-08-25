import { useState, useEffect } from "react";

interface PlacePhotoProps {
  photoReference: string;
  alt: string;
}

export default function PlacePhoto({ photoReference, alt }: PlacePhotoProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/places/photo?reference=${photoReference}`
        );
        const data = await response.json();

        if (data.success && data.photo.base64) {
          const dataUrl = `data:${data.photo.contentType};base64,${data.photo.base64}`;
          setImageSrc(dataUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (photoReference) {
      fetchPhoto();
    }
  }, [photoReference]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  return (
    <img src={imageSrc} alt={alt} className="w-full h-full object-cover" />
  );
}
