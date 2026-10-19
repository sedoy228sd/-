package ru.platetycoon.game.engine

import java.util.UUID
import kotlin.random.Random

enum class RarityTier(val title: String, val colorHex: Long, val baseMultiplier: Double) {
    COMMON("ОБЫЧНЫЙ", 0xFF94A3B8, 1.0),
    UNCOMMON("НЕОБЫЧНЫЙ", 0xFF38BDF8, 3.5),
    RARE("РЕДКИЙ", 0xFFA855F7, 10.0),
    EPIC("ЭПИЧЕСКИЙ", 0xFFEC4899, 35.0),
    LEGENDARY("ЛЕГЕНДАРНЫЙ", 0xFFF59E0B, 120.0),
    MYTHIC("МИФИЧЕСКИЙ", 0xFFEF4444, 450.0),
    GODLIKE("GODLIKE", 0xFF10B981, 1500.0)
}

data class PlateRecord(
    val id: String = UUID.randomUUID().toString(),
    val letters: String,
    val digits: List<Int>,
    val region: String,
    val plateType: String = "civil",
    var price: Long = 0,
    var rarity: RarityTier = RarityTier.COMMON,
    val criteria: MutableList<String> = mutableListOf(),
    val timestamp: Long = System.currentTimeMillis()
) {
    val fullFormatted: String
        get() = "${letters[0]}${digits.joinToString("")}${letters.substring(1)} $region"
}

object PlateEngine {
    private val RUSSIAN_LETTERS = listOf('А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х')
    
    private val BLAT_SERIES = mapOf(
        "ЕКХ" to 50.0,
        "АМР" to 65.0,
        "ВОР" to 30.0,
        "ХАМ" to 22.0,
        "ССС" to 28.0,
        "ООО" to 35.0,
        "ААА" to 40.0
    )

    fun generate(
        region: String = "777",
        plateType: String = "civil",
        luckMultiplier: Double = 1.0
    ): PlateRecord {
        val rnd = Random.Default
        var l: List<Char>
        var d: List<Int>

        val luckyRoll = rnd.nextDouble() < (0.05 * luckMultiplier)

        if (luckyRoll) {
            when (rnd.nextInt(6)) {
                0 -> {
                    val dig = if (rnd.nextDouble() < 0.35) 7 else rnd.nextInt(1, 10)
                    d = listOf(dig, dig, dig)
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                1 -> {
                    val let = RUSSIAN_LETTERS.random()
                    l = listOf(let, let, let)
                    d = List(3) { rnd.nextInt(10) }
                }
                2 -> {
                    val dig = rnd.nextInt(1, 10)
                    d = listOf(dig, rnd.nextInt(10), dig)
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                3 -> {
                    d = listOf(0, 0, rnd.nextInt(1, 10))
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                4 -> {
                    d = listOf(rnd.nextInt(1, 10), 0, 0)
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                else -> {
                    val blat = BLAT_SERIES.keys.random()
                    l = blat.toList()
                    d = List(3) { rnd.nextInt(10) }
                }
            }
        } else {
            l = List(3) { RUSSIAN_LETTERS.random() }
            d = List(3) { rnd.nextInt(10) }
        }

        if (d[0] == 0 && d[1] == 0 && d[2] == 0) {
            d = listOf(0, 0, 1)
        }

        val lettersStr = l.joinToString("")
        val plate = PlateRecord(
            letters = lettersStr,
            digits = d,
            region = region,
            plateType = plateType
        )

        evaluate(plate)
        return plate
    }

    private fun evaluate(plate: PlateRecord) {
        var mult = 1.0
        val d = plate.digits
        val ls = plate.letters
        val ds = "${d[0]}${d[1]}${d[2]}"

        val sameDigits = d[0] == d[1] && d[1] == d[2]
        val sameLetters = ls[0] == ls[1] && ls[1] == ls[2]
        val isPalindrome = d[0] == d[2] && d[0] != d[1]
        val isFirstTen = d[0] == 0 && d[1] == 0 && d[2] > 0
        val isRoundHundred = d[0] > 0 && d[1] == 0 && d[2] == 0
        val matchRegion = ds == plate.region || (ds == "777" && plate.region.contains("77"))

        if (sameDigits) {
            mult *= if (ds == "777") 120.0 else 45.0
            plate.criteria.add(if (ds == "777") "Золотые топоры 777" else "Три одинаковые цифры ($ds)")
        } else if (d[0] == d[1] || d[1] == d[2] || d[0] == d[2]) {
            mult *= 2.2
            plate.criteria.add("Пара одинаковых цифр")
        }

        if (sameLetters) {
            mult *= 35.0
            plate.criteria.add("Три одинаковые буквы ($ls)")
        } else if (ls[0] == ls[1] || ls[1] == ls[2] || ls[0] == ls[2]) {
            mult *= 1.8
            plate.criteria.add("Пара букв")
        }

        if (isFirstTen) {
            mult *= 50.0
            plate.criteria.add("Первый десяток ($ds)")
        } else if (isRoundHundred) {
            mult *= 15.0
            plate.criteria.add("Круглая сотня ($ds)")
        } else if (isPalindrome) {
            mult *= 8.0
            plate.criteria.add("Зеркальные цифры ($ds)")
        }

        BLAT_SERIES[ls]?.let { blatBonus ->
            mult *= blatBonus
            plate.criteria.add("Правительственная серия $ls")
        }

        if (matchRegion) {
            mult *= 20.0
            plate.criteria.add("Совпадение номера с регионом")
        }

        val basePrice = 450.0
        val calculatedPrice = (basePrice * mult).toLong()
        plate.price = calculatedPrice

        plate.rarity = when {
            calculatedPrice >= 1_500_000L -> RarityTier.GODLIKE
            calculatedPrice >= 450_000L -> RarityTier.MYTHIC
            calculatedPrice >= 120_000L -> RarityTier.LEGENDARY
            calculatedPrice >= 35_000L -> RarityTier.EPIC
            calculatedPrice >= 10_000L -> RarityTier.RARE
            calculatedPrice >= 2_500L -> RarityTier.UNCOMMON
            else -> RarityTier.COMMON
        }
    }
}
