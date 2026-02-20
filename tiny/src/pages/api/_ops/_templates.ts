import type { ImageMetadata } from '@/types';

const IIIF_IMAGE_PATH = import.meta.env.PUBLIC_IIIF_IMAGE_PATH;

export const MANIFEST_TEMPLATE = (manifestId: string, name: string, origin: string) => ({
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `${origin}/manifests/${manifestId}.json`,
  type: 'Manifest',
  label: {
    en: [
      name
    ]
  },
  items: []
});

export const IMAGE_ITEM_TEMPLATE = (manifestId: string, image: ImageMetadata, origin: string) => ({
  id: `${origin}/manifests/${manifestId}/canvas/${image.id}`,
  type: 'Canvas',
  label: {
    en: [
      image.filename
    ]
  },
  height: image.height,
  width: image.width,
  items: [{
    id: `${origin}/manifests/${manifestId}/canvas/${image.id}/page/1`,
    type: 'AnnotationPage',
    items: [{
      id: `${origin}/manifests/${manifestId}/canvas/${image.id}/annotation/1`,
      type: 'Annotation',
      motivation: 'painting',
      body: {
        id: `${origin}${IIIF_IMAGE_PATH}${image.id}/full/max/0/default.jpg`,
        type: 'Image',
        height: image.height,
        width: image.width,
        service: [{
          id: `${origin}${IIIF_IMAGE_PATH}${image.id}`,
          profile: 'level1',
          type: 'ImageService3'
        }]
      },
      target: `${origin}/manifests/${manifestId}/canvas/${image.id}`
    }]
  }]
});