import { Trophy, Star, Target, Award } from "lucide-react";

/**
 * Utility functions untuk badge volunteer berdasarkan jumlah event yang diikuti
 * Menyediakan sistem gamifikasi untuk volunteer dengan berbagai level pencapaian
 */

/**
 * Mendapatkan informasi badge volunteer berdasarkan jumlah event yang diikuti
 *
 * @param {number} eventCount - Jumlah event yang telah diikuti volunteer
 * @returns {Object} Object berisi informasi badge (title, subtitle, icon, color, bgGradient)
 */
export const getVolunteerEventBadge = (eventCount) => {
	if (!eventCount || eventCount === 0) {
		return {
			title: "Pemula",
			subtitle: "Belum mengikuti event",
			icon: Target,
			color: "bg-gray-100 text-gray-600 border-gray-300",
			bgGradient: "from-gray-400 to-gray-500",
			level: 0,
			description:
				"Mulai perjalanan volunteer Anda dengan mengikuti event pertama!",
		};
	} else if (eventCount >= 1 && eventCount <= 5) {
		return {
			title: "Volunteer Baru",
			subtitle: `${eventCount} event selesai`,
			icon: Star,
			color: "bg-blue-100 text-blue-600 border-blue-300",
			bgGradient: "from-blue-400 to-blue-500",
			level: 1,
			description: "Anda telah memulai perjalanan volunteer dengan baik!",
		};
	} else if (eventCount >= 6 && eventCount <= 15) {
		return {
			title: "Volunteer Aktif",
			subtitle: `${eventCount} event selesai`,
			icon: Award,
			color: "bg-emerald-100 text-emerald-600 border-emerald-300",
			bgGradient: "from-emerald-400 to-emerald-500",
			level: 2,
			description:
				"Anda menunjukkan komitmen yang konsisten dalam kegiatan volunteer!",
		};
	} else if (eventCount >= 16 && eventCount <= 30) {
		return {
			title: "Volunteer Berpengalaman",
			subtitle: `${eventCount} event selesai`,
			icon: Trophy,
			color: "bg-orange-100 text-orange-600 border-orange-300",
			bgGradient: "from-orange-400 to-orange-500",
			level: 3,
			description: "Pengalaman Anda sangat berharga bagi komunitas volunteer!",
		};
	} else {
		return {
			title: "Volunteer Master",
			subtitle: `${eventCount} event selesai`,
			icon: Trophy,
			color: "bg-purple-100 text-purple-600 border-purple-300",
			bgGradient: "from-purple-400 to-purple-500",
			level: 4,
			description: "Anda adalah inspirasi bagi volunteer lainnya!",
		};
	}
};

/**
 * Mendapatkan semua level badge yang tersedia
 *
 * @returns {Array} Array berisi semua level badge dengan informasi lengkap
 */
export const getAllVolunteerBadgeLevels = () => {
	return [
		{
			level: 0,
			minEvents: 0,
			maxEvents: 0,
			...getVolunteerEventBadge(0),
		},
		{
			level: 1,
			minEvents: 1,
			maxEvents: 5,
			...getVolunteerEventBadge(3),
		},
		{
			level: 2,
			minEvents: 6,
			maxEvents: 15,
			...getVolunteerEventBadge(10),
		},
		{
			level: 3,
			minEvents: 16,
			maxEvents: 30,
			...getVolunteerEventBadge(20),
		},
		{
			level: 4,
			minEvents: 31,
			maxEvents: Infinity,
			...getVolunteerEventBadge(50),
		},
	];
};

/**
 * Mendapatkan progress menuju level selanjutnya
 *
 * @param {number} eventCount - Jumlah event yang telah diikuti volunteer
 * @returns {Object} Object berisi informasi progress (currentLevel, nextLevel, eventsNeeded, progressPercentage)
 */
export const getVolunteerProgress = (eventCount) => {
	const levels = getAllVolunteerBadgeLevels();
	const currentBadge = getVolunteerEventBadge(eventCount);
	const currentLevel = currentBadge.level;

	if (currentLevel >= levels.length - 1) {
		return {
			currentLevel,
			nextLevel: null,
			eventsNeeded: 0,
			progressPercentage: 100,
			isMaxLevel: true,
		};
	}

	const nextLevel = levels[currentLevel + 1];
	const eventsNeeded = nextLevel.minEvents - eventCount;
	const currentLevelMax = levels[currentLevel].maxEvents;
	const currentLevelMin = levels[currentLevel].minEvents;
	const progressInCurrentLevel = eventCount - currentLevelMin;
	const totalEventsInCurrentLevel = currentLevelMax - currentLevelMin + 1;
	const progressPercentage = Math.min(
		100,
		(progressInCurrentLevel / totalEventsInCurrentLevel) * 100
	);

	return {
		currentLevel,
		nextLevel: nextLevel.level,
		eventsNeeded: Math.max(0, eventsNeeded),
		progressPercentage: Math.max(0, progressPercentage),
		isMaxLevel: false,
		nextBadgeTitle: nextLevel.title,
	};
};

/**
 * Menentukan apakah volunteer baru saja naik level
 * Berguna untuk menampilkan notifikasi achievement
 *
 * @param {number} previousEventCount - Jumlah event sebelumnya
 * @param {number} currentEventCount - Jumlah event saat ini
 * @returns {Object} Object berisi informasi apakah naik level dan badge baru
 */
export const checkLevelUp = (previousEventCount, currentEventCount) => {
	const previousBadge = getVolunteerEventBadge(previousEventCount);
	const currentBadge = getVolunteerEventBadge(currentEventCount);

	const hasLeveledUp = currentBadge.level > previousBadge.level;

	return {
		hasLeveledUp,
		previousLevel: previousBadge.level,
		newLevel: currentBadge.level,
		newBadge: hasLeveledUp ? currentBadge : null,
	};
};
