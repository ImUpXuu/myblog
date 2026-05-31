import { type CollectionEntry, getCollection } from "astro:content";

export async function getTalkPosts() {
	const allPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const talks = allPosts
		.filter((p) => p.slug.startsWith("talk/"))
		.sort((a, b) => {
			const dateA = new Date(a.data.published);
			const dateB = new Date(b.data.published);
			return dateA > dateB ? -1 : 1;
		});
	return talks;
}

export type TalkForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
	body: string;
};

export async function getTalkPostsList(): Promise<TalkForList[]> {
	const talks = await getTalkPosts();
	return talks.map((talk) => ({
		slug: talk.slug,
		data: talk.data,
		body: talk.body || "",
	}));
}
