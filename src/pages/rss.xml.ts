import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { getTalkPosts } from "@utils/talk-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();
	const talks = await getTalkPosts();

	const blogItems = blog.map((post) => {
		const content = typeof post.body === "string" ? post.body : String(post.body || "");
		const cleaned = stripInvalidXmlChars(content);
		return {
			title: post.data.title,
			pubDate: post.data.published,
			description: post.data.description || "",
			link: url(`/posts/${post.slug}/`),
			content: sanitizeHtml(parser.render(cleaned), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		};
	});

	const talkItems = talks.map((talk) => {
		const content = typeof talk.body === "string" ? talk.body : String(talk.body || "");
		const cleaned = stripInvalidXmlChars(content);
		return {
			title: `[\u8BF4\u8BF4] ${talk.data.title || "\u788E\u788E\u5FF5"}`,
			pubDate: talk.data.published,
			description: talk.data.description || talk.data.title || "",
			link: url(`/talk/${talk.slug.replace("talk/", "")}/`),
			content: sanitizeHtml(parser.render(cleaned), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		};
	});

	// Merge and sort by date
	const allItems = [...blogItems, ...talkItems].sort(
		(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
	);

	const response = await rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://fuwari.vercel.app",
		items: allItems,
		customData: `<language>${siteConfig.lang}</language>`,
	});
	response.headers.set("Access-Control-Allow-Origin", "*");
	return response;
}
