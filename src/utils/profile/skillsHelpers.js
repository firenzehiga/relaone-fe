/**
 * Skills/Keahlian Helper Functions
 * Utility functions untuk mengelola array keahlian yang bisa digunakan
 * di semua profile (admin, organization, volunteer)
 */

/**
 * Parse array dari berbagai format (JSON string, array, comma-separated string)
 * @param {any} value - Value yang akan di-parse menjadi array
 * @returns {Array} - Array yang sudah di-filter dari nilai kosong
 */
export const parseSkillsArray = (value) => {
	if (!value) return [];

	try {
		// Jika sudah array, return setelah filter
		if (Array.isArray(value)) {
			return value.filter((skill) => skill && skill.trim());
		}

		// Jika string, coba parse sebagai JSON dulu
		if (typeof value === "string") {
			try {
				const parsed = JSON.parse(value);
				if (Array.isArray(parsed)) {
					return parsed.filter((skill) => skill && skill.trim());
				}
			} catch (e) {
				// Bukan JSON, split by comma
				return value
					.split(",")
					.map((skill) => skill.trim())
					.filter(Boolean);
			}
			// String biasa, wrap dalam array
			return [value.trim()].filter(Boolean);
		}

		// Type lain, convert ke string dan wrap dalam array
		return [String(value)];
	} catch (error) {
		console.error("Error parsing skills:", error);
		return [];
	}
};

/**
 * Add skill baru ke array keahlian
 * @param {Array} currentSkills - Array keahlian saat ini
 * @param {string} newSkill - Keahlian baru yang akan ditambahkan
 * @returns {Array} - Array keahlian yang sudah diupdate
 */
export const addSkill = (currentSkills, newSkill) => {
	if (!newSkill || !newSkill.trim()) {
		return currentSkills;
	}

	const trimmedSkill = newSkill.trim();

	// Cek duplikasi (case insensitive)
	const isDuplicate = currentSkills.some(
		(skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
	);

	if (isDuplicate) {
		return currentSkills;
	}

	return [...currentSkills, trimmedSkill];
};

/**
 * Update skill pada index tertentu
 * @param {Array} currentSkills - Array keahlian saat ini
 * @param {number} index - Index skill yang akan diupdate
 * @param {string} newValue - Nilai baru untuk skill
 * @returns {Array} - Array keahlian yang sudah diupdate
 */
export const updateSkill = (currentSkills, index, newValue) => {
	if (index < 0 || index >= currentSkills.length) {
		return currentSkills;
	}

	const trimmedValue = newValue.trim();

	return currentSkills.map((skill, idx) =>
		idx === index ? trimmedValue : skill
	);
};

/**
 * Remove skill pada index tertentu
 * @param {Array} currentSkills - Array keahlian saat ini
 * @param {number} index - Index skill yang akan dihapus
 * @returns {Array} - Array keahlian yang sudah diupdate
 */
export const removeSkill = (currentSkills, index) => {
	if (index < 0 || index >= currentSkills.length) {
		return currentSkills;
	}

	return currentSkills.filter((_, idx) => idx !== index);
};

/**
 * Validate skill input
 * @param {string} skill - Skill yang akan divalidate
 * @param {Array} currentSkills - Array keahlian saat ini untuk cek duplikasi
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateSkill = (skill, currentSkills = []) => {
	if (!skill || !skill.trim()) {
		return {
			isValid: false,
			error: "Keahlian tidak boleh kosong",
		};
	}

	const trimmedSkill = skill.trim();

	if (trimmedSkill.length < 2) {
		return {
			isValid: false,
			error: "Keahlian minimal 2 karakter",
		};
	}

	if (trimmedSkill.length > 100) {
		return {
			isValid: false,
			error: "Keahlian maksimal 100 karakter",
		};
	}

	// Cek duplikasi
	const isDuplicate = currentSkills.some(
		(existingSkill) =>
			existingSkill.toLowerCase() === trimmedSkill.toLowerCase()
	);

	if (isDuplicate) {
		return {
			isValid: false,
			error: "Keahlian sudah ada",
		};
	}

	return {
		isValid: true,
		error: null,
	};
};

/**
 * Format skills untuk ditampilkan dalam UI
 * @param {any} skills - Skills dalam format apapun
 * @returns {Array} - Array skills yang sudah diformat
 */
export const formatSkillsForDisplay = (skills) => {
	const parsedSkills = parseSkillsArray(skills);

	return parsedSkills.map((skill) => ({
		text: skill,
		id: skill.toLowerCase().replace(/\s+/g, "-"), // untuk React key
	}));
};

/**
 * Format skills untuk dikirim ke backend
 * @param {Array} skills - Array skills
 * @returns {string} - JSON string untuk disimpan ke database
 */
export const formatSkillsForBackend = (skills) => {
	const cleanSkills = parseSkillsArray(skills);
	return JSON.stringify(cleanSkills);
};

/**
 * Get skills statistics
 * @param {any} skills - Skills dalam format apapun
 * @returns {Object} - { count: number, isEmpty: boolean }
 */
export const getSkillsStats = (skills) => {
	const parsedSkills = parseSkillsArray(skills);

	return {
		count: parsedSkills.length,
		isEmpty: parsedSkills.length === 0,
		hasSkills: parsedSkills.length > 0,
	};
};

// Export default object untuk backward compatibility
export default {
	parseSkillsArray,
	addSkill,
	updateSkill,
	removeSkill,
	validateSkill,
	formatSkillsForDisplay,
	formatSkillsForBackend,
	getSkillsStats,
};
