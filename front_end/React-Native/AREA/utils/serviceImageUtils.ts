import { ImageSourcePropType } from "react-native";
import { imageMap } from "@/types/image";
import { Service } from "@/types/type";

/**
 * Get the image source for a service, prioritizing icon_url from backend
 * and falling back to local images mapped by slug
 */
export const getServiceImageSource = (service: Service): ImageSourcePropType => {
  // If the service has an icon_url, use it
  if (service.icon_url && service.icon_url.trim() !== '') {
    return { uri: service.icon_url };
  }
  
  // Fall back to local images using the service slug
  return imageMap[service.slug] ?? imageMap["default"];
};

/**
 * Get image source by slug for backward compatibility
 */
export const getImageBySlug = (slug: string): ImageSourcePropType => {
  return imageMap[slug] ?? imageMap["default"];
};
