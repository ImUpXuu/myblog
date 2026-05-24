import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const TARGET_QUALITY = 75;

async function processImage(srcPath, destPath) {
	const stats = fs.statSync(srcPath);
	const currentSizeKB = stats.size / 1024;

	try {
		const buffer = await sharp(srcPath)
			.webp({ quality: TARGET_QUALITY, effort: 6 })
			.toBuffer();

		const newSizeKB = buffer.length / 1024;
		fs.writeFileSync(destPath, buffer);

		const ratio = ((1 - newSizeKB / currentSizeKB) * 100).toFixed(1);
		if (newSizeKB < currentSizeKB) {
			console.log(`  ✓ ${path.basename(srcPath)} ${currentSizeKB.toFixed(0)}KB → ${newSizeKB.toFixed(0)}KB (${ratio}%)`);
		} else {
			fs.copyFileSync(srcPath, destPath.replace(".webp", path.extname(srcPath)));
			fs.unlinkSync(destPath);
			console.log(`  – ${path.basename(srcPath)} ${currentSizeKB.toFixed(0)}KB (no gain, skipped)`);
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
			const webpName = file.replace(/\.(jpe?g|png)$/i, ".webp");
			const dest = path.join(thumbPath, webpName);
			tasks.push(processImage(src, dest));
			total++;
		}
	}

	await Promise.all(tasks);
	console.log(`\nDone! ${total} images processed.`);
}

main().catch(console.error);
