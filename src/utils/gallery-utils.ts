import fs from "node:fs";
import path from "node:path";
import type { GalleryAlbum } from "../types/config";

function getThumbName(fileName: string): string {
	return fileName.replace(/\.(jpe?g|png)$/i, ".webp");
}

export function scanAlbumPhotos(albumId: string): string[] {
	const dir = path.join(process.cwd(), "public", "gallery", albumId);
	const thumbDir = path.join(dir, "thumb");
	const hasThumb = fs.existsSync(thumbDir);

	if (!fs.existsSync(dir)) return [];
	const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

	const coverIdx = files.findIndex((f) => /^cover\./i.test(f));
	if (coverIdx > 0) {
		const [coverFile] = files.splice(coverIdx, 1);
		files.unshift(coverFile);
	}

	return files.map((f) => {
		const thumbFile = `/gallery/${albumId}/thumb/${getThumbName(f)}`;
		const fullFile = `/gallery/${albumId}/${f}`;
		return { thumb: thumbFile, full: fullFile, isThumb: hasThumb };
	});
}

export function getAlbumCover(
	album: GalleryAlbum,
	photos: ReturnType<typeof scanAlbumPhotos>,
): { thumb: string; full: string } {
	const first = photos[0] || { thumb: "", full: "" };
	if (album.cover) return { thumb: album.cover, full: album.cover };
	const coverPhoto = photos.find((p) => p.thumb.includes("/cover."));
	return coverPhoto || first;
}
