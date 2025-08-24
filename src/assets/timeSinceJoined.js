export default function timeSinceJoined(joinDateStr, lang = 0) {
	const joinDate = new Date(joinDateStr);
	const now = new Date();

	let diff = Math.floor((now - joinDate) / 1000);

	const units = [
		{ key: "year", seconds: 31536000 },
		{ key: "month", seconds: 2592000 },
		{ key: "day", seconds: 86400 },
		{ key: "hour", seconds: 3600 },
		{ key: "minute", seconds: 60 },
		{ key: "second", seconds: 1 }
	];

	const translations = {
		0: {
			justNow: "just now",
			ago: "ago",
			units: {
				year: ["year", "years"],
				month: ["month", "months"],
				day: ["day", "days"],
				hour: ["hour", "hours"],
				minute: ["minute", "minutes"],
				second: ["second", "seconds"]
			}
		},
		1: {
			justNow: "только что",
			ago: "назад",
			units: {
				year: ["год", "года", "лет"],
				month: ["месяц", "месяца", "месяцев"],
				day: ["день", "дня", "дней"],
				hour: ["час", "часа", "часов"],
				minute: ["минута", "минуты", "минут"],
				second: ["секунда", "секунды", "секунд"]
			}
		}
	};

	const t = translations[lang] || translations[0];

	function getWordForm(num, forms) {
		if (lang === 0) {
			return num === 1 ? forms[0] : forms[1];
		} else if (lang === 1) {
			const mod10 = num % 10;
			const mod100 = num % 100;
			if (mod10 === 1 && mod100 !== 11) return forms[0];
			if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return forms[1];
			return forms[2];
		}
	}

	for (const unit of units) {
		const amount = Math.floor(diff / unit.seconds);
		if (amount >= 1) {
			return `${amount} ${getWordForm(amount, t.units[unit.key])} ${t.ago}`;
		}
	}

	return t.justNow;
}