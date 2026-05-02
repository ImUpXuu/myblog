import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const TARGET_QUALITY = 75;

async function processImage(srcPath, destPath) {
	const ext = path.extname(srcPath).toLowerCase();
	const stats = fs.statSync(srcPath);
	const currentSizeKB = stats.size / 1024;

	try {
		let buffer;

		if (ext === ".png") {
			buffer = await sharp(srcPath)
				.png({ quality: TARGET_QUALITY, compressionLevel: 9, palette: true })
				.toBuffer();
		} else if (ext === ".webp") {
			buffer = await sharp(srcPath)
				.webp({ quality: TARGET_QUALITY, effort: 6 })
				.toBuffer();
		} else {
			buffer = await sharp(srcPath)
				.jpeg({ quality: TARGET_QUALITY, mozjpeg: true })
				.toBuffer();
		}

		const newSizeKB = buffer.length / 1024;
		fs.writeFileSync(destPath, buffer);

		const ratio = ((1 - newSizeKB / currentSizeKB) * 100).toFixed(1);
		if (newSizeKB < currentSizeKB) {
			console.log(`  ✓ ${path.basename(srcPath)} ${currentSizeKB.toFixed(0)}KB → ${newSizeKB.toFixed(0)}KB (${ratio}%)`);
		} else {
			fs.copyFileSync(srcPath, destPath);
			console.log(`  – ${path.basename(srcPath)} ${currentSizeKB.toFixed(0)}KB (no gain)`);
		}
	} catch (err) {
		console.error(`  ✗ ${srcPath}: ${err.message}`);
	}
}

async function main() {
	if (!fs.existsSync(GALLERY_DIR)) {
		console.log("No gallery directory, skipping.");
		return;
	}

	const albums = fs.readdirSync(GALLERY_DIR, { withFileTypes: true });
	let total = 0;
	let tasks = [];

	for (const album of albums) {
		if (!album.isDirectory()) continue;

		const albumPath = path.join(GALLERY_DIR, album.name);
		const thumbPath = path.join(albumPath, "thumb");
		const files = fs.readdirSync(albumPath).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

		if (files.length === 0) continue;

		if (!fs.existsSync(thumbPath)) {
			fs.mkdirSync(thumbPath, { recursive: true });
		}

		console.log(`\nAlbum: ${album.name} (${files.length} images)`);

		for (const file of files) {
			const src = path.join(albumPath, file);
			const dest = path.join(thumbPath, file);
			tasks.push(processImage(src, dest));
			total++;
		}
	}

	await Promise.all(tasks);
	console.log(`\nDone! ${total} images processed.`);
}

main().catch(console.error);
