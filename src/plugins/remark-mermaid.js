import { visit } from "unist-util-visit";

export function remarkMermaid() {
	return (tree) => {
		visit(tree, "code", (node, index, parent) => {
			if (node.lang === "mermaid") {
				const meta = node.meta || "";
				node.type = "html";
				node.value = `<div class="mermaid"${meta ? ` data-mermaid-meta="${meta}"` : ""}>${node.value}</div>`;
			}
		});
	};
}
