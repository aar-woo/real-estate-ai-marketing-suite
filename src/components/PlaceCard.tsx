import PlacePhoto from "./PlacePhoto";
import { getPriceLevelText, getRatingStars } from "@/lib/placesInfoUtils";
import { ExtendedPlace } from "@/lib/placesTypes";

interface PlaceCardProps {
  place: ExtendedPlace;
  showPhoto?: boolean;
}

export default function PlaceCard({ place, showPhoto = true }: PlaceCardProps) {
  return (
    <div
      className="border border-gray-200 bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
      style={{ width: "calc(50% - 8px)" }}
    >
      {showPhoto && (
        <div className="mb-4 h-48 overflow-hidden rounded-lg">
          <PlacePhoto
            photoReference={place.photos?.[0]?.photo_reference || ""}
            alt={place.name || "Place"}
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800 text-lg">{place.name}</h4>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize">
          {place.primary_type}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-2">{place.vicinity}</p>

      {place.rating && (
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">
            {getRatingStars(place.rating)}
          </span>
          <span className="text-sm text-gray-600">
            {place.rating} ({place.user_ratings_total || 0} reviews)
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Price: {getPriceLevelText(place.price_level)}</span>
        {place.opening_hours?.open_now !== undefined && (
          <span
            className={
              place.opening_hours.open_now ? "text-green-600" : "text-red-600"
            }
          >
            {place.opening_hours.open_now ? "Open" : "Closed"}
          </span>
        )}
      </div>
    </div>
  );
}
