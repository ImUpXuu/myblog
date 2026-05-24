export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

export function formatDateTime(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	const h = date.getHours();
	const min = date.getMinutes();
	if (h === 0 && min === 0) {
		return `${y}-${m}-${d}`;
	}
	return `${y}-${m}-${d} ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}
