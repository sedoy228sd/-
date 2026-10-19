package ru.platetycoon.core.domain.model

import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.persistentListOf
import kotlinx.serialization.Serializable

/**
 * Rarity tier definition with multiplier and reward tokens.
 */
@Serializable
enum class RarityTier(
    val title: String,
    val colorHex: Long,
    val minPrice: Long,
    val bonusTokens: Int
) {
    COMMON("ОБЫЧНЫЙ", 0xFF94A3B8, 0L, 0),
    UNCOMMON("НЕОБЫЧНЫЙ", 0xFF22C55E, 1200L, 0),
    RARE("РЕДКИЙ", 0xFF38BDF8, 18000L, 1),
    EPIC("ЭПИЧЕСКИЙ", 0xFFA855F7, 200000L, 2),
    LEGENDARY("ЛЕГЕНДАРНЫЙ", 0xFFF59E0B, 2500000L, 5),
    MYTHIC("МИФИЧЕСКИЙ", 0xFFF97316, 45000000L, 15),
    GODLIKE("GODLIKE", 0xFFEC4899, 300000000L, 60);

    companion object {
        fun fromIndex(index: Int): RarityTier {
            val values = entries
            return values.getOrElse(index.coerceIn(0, values.size - 1)) { COMMON }
        }
    }
}

/**
 * Standard license plate formats.
 */
@Serializable
enum class PlateFormat(val title: String, val mult: Double) {
    CIVIL("Гражданский ГОСТ", 1.0),
    POLICE("Полиция МВД", 2.5),
    TAXI("Такси & Автобус", 1.6),
    MILITARY("Военные (МО РФ)", 3.0),
    DIPLO("Дипломатические", 4.5),
    RETRO("Ретро СССР", 2.8)
}

/**
 * Pure domain model for a vehicle license plate.
 */
@Serializable
data class Plate(
    val id: String,
    val letters: ImmutableList<String>,
    val digits: ImmutableList<Int>,
    val region: String,
    val country: String = "ru",
    val format: PlateFormat = PlateFormat.CIVIL,
    val price: Long = 500L,
    val rarity: RarityTier = RarityTier.COMMON,
    val matchedPatterns: ImmutableList<String> = persistentListOf(),
    val seed: Long = 0L,
    val timestamp: Long = 0L
) {
    val fullFormattedString: String
        get() = "${letters.getOrElse(0) { "" }} ${digits.joinToString("")} ${letters.drop(1).joinToString("")} $region"
}

/**
 * Specification for plate generation rules.
 */
data class PlateSpec(
    val country: String = "ru",
    val region: String = "777",
    val format: PlateFormat = PlateFormat.CIVIL,
    val allowedLetters: ImmutableList<String> = persistentListOf(
        "А", "В", "Е", "К", "М", "Н", "О", "Р", "С", "Т", "У", "Х"
    )
)
