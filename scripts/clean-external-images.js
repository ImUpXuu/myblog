import { rmSync, readdirSync } from "node:fs";
import { join } from "node:path";

const distPath = new URL("../dist", import.meta.url).pathname;

try {
	// 删除 dist/images 目录（如果存在）
	const imagesPath = join(distPath, "images");
	const imagesImagesPath = join(distPath, "images", "images");

	console.log("Cleaning up external image files from build...");

	// 递归删除目录
	try {
		rmSync(imagesImagesPath, { recursive: true, force: true });
		console.log(`✓ Deleted: ${imagesImagesPath}`);
	} catch (error) {
		console.log(`ℹ No nested images directory found`);
	}

	try {
		// 只删除 jpg, jpeg, png, gif, webp 等图片文件，保留其他文件
		const entries = readdirSync(imagesPath, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isFile()) {
				const ext = entry.name.toLowerCase().split(".").pop();
				if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) {
					const filePath = join(imagesPath, entry.name);
					rmSync(filePath, { force: true });
					console.log(`✓ Deleted: ${filePath}`);
				}
			}
		}
		console.log(`✓ Cleaned image files from: ${imagesPath}`);
	} catch (error) {
		console.log(`ℹ No images directory found at: ${imagesPath}`);
	}

	console.log("✓ External image cleanup completed!");
} catch (error) {
	console.error("Error during cleanup:", error.message);
	process.exit(1);
}
