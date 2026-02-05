import type { ImageMetadata } from '@/types';

export const MANIFEST_TEMPLATE = (manifestId: string, name: string) => ({
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: `/manifests/${manifestId}.json`,
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
        id: `${origin}/iiif/2/${image.id}/full/max/0/default.jpg`,
        type: 'Image',
        height: image.height,
        width: image.width,
        service: [{
          id: `${origin}/iiif/2/${image.id}`,
          profile: 'level1',
          type: 'ImageService2'
        }]
      },
      target: `${origin}/manifests/${manifestId}/canvas/${image.id}`
    }]
  }]
});