import rss from "@astrojs/rss";
import { getTalkPosts } from "../../utils/talk-utils";
import { url } from "../../utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F﷐-﷯￾￿]/g,
		"",
	);
}

export async function GET(context: APIContext) {
	const talks = await getTalkPosts();

	const response = await rss({
		title: `${siteConfig.title} - 说说`,
		description: "UpXuu 的碎碎念",
		site: context.site ?? "https://upxuu.com",
		items: talks.map((talk) => {
			const content = typeof talk.body === "string" ? talk.body : String(talk.body || "");
			const cleaned = stripInvalidXmlChars(content);
			return {
				title: talk.data.title || "说说",
				pubDate: talk.data.published,
				description: talk.data.description || talk.data.title || "",
				link: url(`/talk/${talk.slug.replace("talk/", "")}/`),
				content: sanitizeHtml(parser.render(cleaned), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
	response.headers.set("Access-Control-Allow-Origin", "*");
	return response;
}
