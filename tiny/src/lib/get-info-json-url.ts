import type { ImageMetadata } from '@/types';
import { getOrigin } from './utils';

const BACKEND_BASE = import.meta.env.PUBLIC_BACKEND_BASE || getOrigin();

export const getInfoJsonURL = (image: ImageMetadata, origin: string = BACKEND_BASE) =>
  `${origin}/iiif/2/${image.id}/info.json`;