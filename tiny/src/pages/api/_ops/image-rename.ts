import fs from 'fs/promises';
import path from 'path';
import { META_DIR, MANIFESTS_DIR } from './_paths';
import type { ExtendedImageMetadata } from '@/types';
import { buildDirectoryTree } from './build-tree';

export const renameImage = async (imageId: string, name: string) => {
	const metaPath = path.join(META_DIR, `${imageId}.json`);

	// Update metadata filename
	const raw = await fs.readFile(metaPath, 'utf8');
	const meta: ExtendedImageMetadata = JSON.parse(raw);
	meta.filename = name;
	await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');

	// Update manifest, if necessary
	const tree = await buildDirectoryTree();
	const m = tree.findManifestForImage(imageId);

	if (m) {
		const manifestPath = path.join(MANIFESTS_DIR, `${m.id}.json`);
		const raw = await fs.readFile(manifestPath, 'utf8');
		const manifest = JSON.parse(raw);

		if (Array.isArray(manifest.items)) {
			for (const item of manifest.items) {
				const parts = (item.id || '').split('/');
				const id = parts[parts.length - 1];

				if (id === imageId) {
					if (item.label && item.label.en && item.label.en[0] !== name) {
						item.label.en[0] = name;
					}
				}
			}
		}

		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
	}

	return meta;
}