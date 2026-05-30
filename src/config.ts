import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "UpXuu's blog",
	subtitle: "逐光而上",
	description: "UpXuu（逐光而上）的个人博客。分享网站建设、Astro 前端开发、服务器运维等技术心得，记录初中校园生活的成长故事与日常思考。",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 245, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "https://f.xxu6.top/2427/in.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// 使用自定义网站图标
		{
			src: 'https://www.upxuu.com/images/20260214145619.jpg',
			sizes: '32x32',
		},
		{
			src: 'https://www.upxuu.com/images/20260214145619.jpg',
			sizes: '128x128',
		},
		{
			src: 'https://www.upxuu.com/images/20260214145619.jpg',
			sizes: '180x180',
		},
		{
			src: 'https://www.upxuu.com/images/20260214145619.jpg',
			sizes: '192x192',
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Archive,
		{
			name: "更多",
			url: "#",
			external: false,
			children: [
				{
					name: "画廊",
					url: "/gallery",
					external: false,
				},
				{
					name: "状态",
					url: "https://up.upxuu.com/",
					external: true,
				},
				{
					name: "统计",
					url: "https://stats.upxuu.com/share/sFftlqBkgk2z9JM2",
					external: true,
				},
			],
		},
		{
			name: "Q群",
			url: "https://qun.qq.com/universal-share/share?ac=1&authKey=NZ9BP%2BPT44nu34JWAL4Jdz25Bq7ueQoOfOqA4iYPT1JvQKYktml43kgBTMfqTkNl&busi_data=eyJncm91cENvZGUiOiIxMTAzMjMyNDIyIiwidG9rZW4iOiJTZDh2RmhWbXFTL3ZHbVBXeXhJZndQTVcrOUlhNXRSNlczVG1GNUIzQnlQejFZSThWYStSSEVEWUtDcHdHSTM3IiwidWluIjoiMzY5Nzc3MzQxNiJ9&data=HZcezojmJTU_U4qRqv_3ODAb7vm86b6wP8YEp9Stz5b4EzngKNFllXJneyVO7qr4u-plsM84FyvpZl6kkuyZgg&svctype=4&tempid=h5_group_info",
			external: true,
		},
		{
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			external: true,
		},
		{
			name: "友链",
			url: "/friends",
			external: false,
		},
		{
			name: "打赏",
			url: "/donate",
			external: false,
		},
		LinkPreset.About,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/images/20260214145619.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "UpXuu",
	bio: "逐光而上",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/ImUpXuu",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "All Rights Reserved",
	url: "https://upxuu.com",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: {
		dark: "github-dark",
		light: "github-light",
	},
};
