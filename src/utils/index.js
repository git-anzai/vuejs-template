export function setStorage(key, value) {
	return localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key) {
	const item = localStorage.getItem(key);
	try {
		return item ? JSON.parse(item) : '';
	} catch (e) {
		return item;
	}
}
