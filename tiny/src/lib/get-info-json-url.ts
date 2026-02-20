import type { ImageMetadata } from '@/types';
import { getOrigin } from './utils';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || getOrigin();
const IIIF_IMAGE_PATH = import.meta.env.PUBLIC_IIIF_IMAGE_PATH;

export const getInfoJsonURL = (image: ImageMetadata, origin: string = BACKEND_BASE) =>
  `${origin}${IIIF_IMAGE_PATH}${image.id}/info.json`;