import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const TARGET_QUALITY = 80;

async function processImage(srcPath, destPath) {
	const ext = path.extname(srcPath).toLowerCase();

	try {
		let pipeline = sharp(srcPath);

		if (ext === ".png") {
			pipeline = pipeline.png({ quality: TARGET_QUALITY, compressionLevel: 9, palette: true });
		} else if (ext === ".webp") {
			pipeline = pipeline.webp({ quality: TARGET_QUALITY });
		} else {
			pipeline = pipeline.jpeg({ quality: TARGET_QUALITY, mozjpeg: true });
		}

		const stats = fs.statSync(srcPath);
		const currentSizeKB = stats.size / 1024;
		const compressed = await pipeline.toBuffer();
		const newSizeKB = compressed.length / 1024;
		fs.writeFileSync(destPath, compressed);

		if (newSizeKB < currentSizeKB) {
			console.log(`  Compressed: ${path.basename(srcPath)} (${currentSizeKB.toFixed(0)}KB → ${newSizeKB.toFixed(0)}KB)`);
		} else {
			fs.copyFileSync(srcPath, destPath);
			console.log(`  Skipped: ${path.basename(srcPath)} (${currentSizeKB.toFixed(0)}KB, no benefit)`);
		}
	} catch (err) {
		console.error(`  Error: ${srcPath} - ${err.message}`);
	}
}

async function main() {
	if (!fs.existsSync(GALLERY_DIR)) {
		console.log("No gallery directory, skipping.");
		return;
	}

	const albums = fs.readdirSync(GALLERY_DIR, { withFileTypes: true });
	let total = 0;

	for (const album of albums) {
		if (!album.isDirectory()) continue;

		const albumPath = path.join(GALLERY_DIR, album.name);
		const thumbPath = path.join(albumPath, "thumb");

		const files = fs.readdirSync(albumPath);
		const imageFiles = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

		if (imageFiles.length === 0) continue;

		if (!fs.existsSync(thumbPath)) {
			fs.mkdirSync(thumbPath, { recursive: true });
		}

		console.log(`\nAlbum: ${album.name} (${imageFiles.length} images)`);

		for (const file of imageFiles) {
			const src = path.join(albumPath, file);
			const dest = path.join(thumbPath, file);
			await processImage(src, dest);
			total++;
		}
	}

	console.log(`\nDone! ${total} images compressed to /thumb/.`);
}

main().catch(console.error);
