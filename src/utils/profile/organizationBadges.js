import { Trophy, Star, Target, Award, Building2, Crown } from "lucide-react";

/**
 * Utility functions untuk badge organization berdasarkan jumlah event yang dibuat
 * Menyediakan sistem gamifikasi untuk organization dengan berbagai level pencapaian
 */

/**
 * Mendapatkan informasi badge organization berdasarkan jumlah event yang dibuat
 *
 * @param {number} eventCount - Jumlah event yang telah dibuat organization
 * @returns {Object} Object berisi informasi badge (title, subtitle, icon, color, bgGradient)
 */
export const getOrganizationEventBadge = (eventCount) => {
	if (!eventCount || eventCount === 0) {
		return {
			title: "Organisasi Baru",
			subtitle: "Belum membuat event",
			icon: Target,
			color: "bg-gray-100 text-gray-600 border-gray-300",
			bgGradient: "from-gray-400 to-gray-500",
			level: 0,
			description: "Mulai membuat event pertama untuk komunitas Anda!",
		};
	} else if (eventCount >= 1 && eventCount <= 3) {
		return {
			title: "Organisasi Pemula",
			subtitle: `${eventCount} event dibuat`,
			icon: Star,
			color: "bg-blue-100 text-blue-600 border-blue-300",
			bgGradient: "from-blue-400 to-blue-500",
			level: 1,
			description: "Langkah awal yang baik dalam membangun komunitas!",
		};
	} else if (eventCount >= 4 && eventCount <= 10) {
		return {
			title: "Organisasi Aktif",
			subtitle: `${eventCount} event dibuat`,
			icon: Building2,
			color: "bg-emerald-100 text-emerald-600 border-emerald-300",
			bgGradient: "from-emerald-400 to-emerald-500",
			level: 2,
			description: "Organisasi yang konsisten dalam mengadakan kegiatan!",
		};
	} else if (eventCount >= 11 && eventCount <= 25) {
		return {
			title: "Organisasi Berpengalaman",
			subtitle: `${eventCount} event dibuat`,
			icon: Award,
			color: "bg-orange-100 text-orange-600 border-orange-300",
			bgGradient: "from-orange-400 to-orange-500",
			level: 3,
			description: "Pengalaman mengorganisir event yang sangat berharga!",
		};
	} else if (eventCount >= 26 && eventCount <= 50) {
		return {
			title: "Organisasi Expert",
			subtitle: `${eventCount} event dibuat`,
			icon: Trophy,
			color: "bg-purple-100 text-purple-600 border-purple-300",
			bgGradient: "from-purple-400 to-purple-500",
			level: 4,
			description: "Organisasi dengan rekam jejak yang luar biasa!",
		};
	} else {
		return {
			title: "Organisasi Master",
			subtitle: `${eventCount} event dibuat`,
			icon: Crown,
			color:
				"bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300",
			bgGradient: "from-yellow-400 to-orange-500",
			level: 5,
			description: "Organisasi inspirasi dan pemimpin komunitas!",
		};
	}
};

/**
 * Mendapatkan badge verifikasi organization
 *
 * @param {string} verificationStatus - Status verifikasi organization
 * @returns {Object} Object berisi informasi badge verifikasi
 */
export const getOrganizationVerificationBadge = (verificationStatus) => {
	switch (verificationStatus) {
		case "verified":
			return {
				title: "Terverifikasi",
				icon: Award,
				color: "bg-green-100 text-green-700 border-green-300",
				bgColor: "bg-green-500",
				description: "Organisasi telah diverifikasi oleh admin",
			};
		case "pending":
			return {
				title: "Menunggu Verifikasi",
				icon: Target,
				color: "bg-yellow-100 text-yellow-700 border-yellow-300",
				bgColor: "bg-yellow-500",
				description: "Proses verifikasi sedang berlangsung",
			};
		case "rejected":
			return {
				title: "Ditolak",
				icon: Target,
				color: "bg-red-100 text-red-700 border-red-300",
				bgColor: "bg-red-500",
				description: "Verifikasi ditolak, silakan ajukan ulang",
			};
		default:
			return {
				title: "Belum Diverifikasi",
				icon: Target,
				color: "bg-gray-100 text-gray-600 border-gray-300",
				bgColor: "bg-gray-500",
				description: "Organisasi belum mengajukan verifikasi",
			};
	}
};

/**
 * Mendapatkan semua level badge organization yang tersedia
 *
 * @returns {Array} Array berisi semua level badge dengan informasi lengkap
 */
export const getAllOrganizationBadgeLevels = () => {
	return [
		{
			level: 0,
			minEvents: 0,
			maxEvents: 0,
			...getOrganizationEventBadge(0),
		},
		{
			level: 1,
			minEvents: 1,
			maxEvents: 3,
			...getOrganizationEventBadge(2),
		},
		{
			level: 2,
			minEvents: 4,
			maxEvents: 10,
			...getOrganizationEventBadge(7),
		},
		{
			level: 3,
			minEvents: 11,
			maxEvents: 25,
			...getOrganizationEventBadge(18),
		},
		{
			level: 4,
			minEvents: 26,
			maxEvents: 50,
			...getOrganizationEventBadge(35),
		},
		{
			level: 5,
			minEvents: 51,
			maxEvents: Infinity,
			...getOrganizationEventBadge(75),
		},
	];
};

/**
 * Mendapatkan progress organization menuju level selanjutnya
 *
 * @param {number} eventCount - Jumlah event yang telah dibuat organization
 * @returns {Object} Object berisi informasi progress (currentLevel, nextLevel, eventsNeeded, progressPercentage)
 */
export const getOrganizationProgress = (eventCount) => {
	const levels = getAllOrganizationBadgeLevels();
	const currentBadge = getOrganizationEventBadge(eventCount);
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
 * Menentukan apakah organization baru saja naik level
 * Berguna untuk menampilkan notifikasi achievement
 *
 * @param {number} previousEventCount - Jumlah event sebelumnya
 * @param {number} currentEventCount - Jumlah event saat ini
 * @returns {Object} Object berisi informasi apakah naik level dan badge baru
 */
export const checkOrganizationLevelUp = (
	previousEventCount,
	currentEventCount
) => {
	const previousBadge = getOrganizationEventBadge(previousEventCount);
	const currentBadge = getOrganizationEventBadge(currentEventCount);

	const hasLeveledUp = currentBadge.level > previousBadge.level;

	return {
		hasLeveledUp,
		previousLevel: previousBadge.level,
		newLevel: currentBadge.level,
		newBadge: hasLeveledUp ? currentBadge : null,
	};
};
