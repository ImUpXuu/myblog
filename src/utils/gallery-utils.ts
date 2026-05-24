import fs from "node:fs";
import path from "node:path";
import type { GalleryAlbum } from "../types/config";

function getThumbName(fileName: string): string {
	return fileName.replace(/\.(jpe?g|png)$/i, ".webp");
}

export function scanAlbumPhotos(albumId: string): { thumb: string; full: string; isThumb: boolean }[] {
	const dir = path.join(process.cwd(), "public", "gallery", albumId);
	const thumbDir = path.join(dir, "thumb");

	if (!fs.existsSync(dir)) return [];
	const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

	const coverIdx = files.findIndex((f) => /^cover\./i.test(f));
	if (coverIdx > 0) {
		const [coverFile] = files.splice(coverIdx, 1);
		files.unshift(coverFile);
	}

	return files.map((f) => {
		const thumbPath = path.join(thumbDir, getThumbName(f));
		const hasThumb = fs.existsSync(thumbPath);
		const thumbFile = `/gallery/${albumId}/thumb/${getThumbName(f)}`;
		const fullFile = `/gallery/${albumId}/${f}`;
		return { thumb: thumbFile, full: fullFile, isThumb: hasThumb };
	});
}

export function getAlbumCover(
	album: GalleryAlbum,
	photos: ReturnType<typeof scanAlbumPhotos>,
): { thumb: string; full: string } {
	const coverPhoto = photos.find((p) => p.thumb.includes("/cover."));
	if (coverPhoto) {
		if (coverPhoto.isThumb) return { thumb: coverPhoto.thumb, full: coverPhoto.full };
		return { thumb: coverPhoto.full, full: coverPhoto.full };
	}
	if (album.cover) {
		const ext = path.extname(album.cover);
		if (ext && fs.existsSync(path.join(process.cwd(), "public", album.cover))) {
			return { thumb: album.cover, full: album.cover };
		}
	}
	const first = photos[0] || { thumb: "", full: "", isThumb: false };
	if (!first.isThumb && first.full) {
		return { thumb: first.full, full: first.full };
	}
	return { thumb: first.thumb, full: first.full };
}
