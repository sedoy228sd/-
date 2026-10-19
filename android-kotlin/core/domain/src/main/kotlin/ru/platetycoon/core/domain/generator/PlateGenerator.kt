package ru.platetycoon.core.domain.generator

import kotlinx.collections.immutable.toImmutableList
import ru.platetycoon.core.domain.model.Plate
import ru.platetycoon.core.domain.model.PlateFormat
import ru.platetycoon.core.domain.model.PlateSpec
import ru.platetycoon.core.domain.model.RarityTier
import kotlin.random.Random

/**
 * Pure generator function: PlateGenerator.generate(spec, random) -> Plate.
 * Requirement 010: чистая функция без побочных эффектов.
 */
object PlateGenerator {

    fun generate(spec: PlateSpec, random: Random, seed: Long = 0L, timestamp: Long = 0L): Plate {
        val l1 = spec.allowedLetters[random.nextInt(spec.allowedLetters.size)]
        val l2 = spec.allowedLetters[random.nextInt(spec.allowedLetters.size)]
        val l3 = spec.allowedLetters[random.nextInt(spec.allowedLetters.size)]

        val d1 = random.nextInt(10)
        val d2 = random.nextInt(10)
        val d3 = random.nextInt(10)

        val letters = listOf(l1, l2, l3).toImmutableList()
        val digits = listOf(d1, d2, d3).toImmutableList()

        // Evaluate patterns & rarity
        val dStr = "$d1$d2$d3"
        val lStr = "$l1$l2$l3"
        val matched = mutableListOf<String>()
        var tier = RarityTier.COMMON
        var basePrice = 350L

        // Digital patterns
        if (d1 == d2 && d2 == d3) {
            matched.add("ТРИ ОДИНАКОВЫХ ($dStr)")
            tier = if (dStr == "777") RarityTier.LEGENDARY else RarityTier.EPIC
            basePrice += if (dStr == "777") 3500000L else 450000L
        } else if (d1 == 0 && d2 == 0 && d3 != 0) {
            matched.add("ПЕРВЫЙ ДЕСЯТОК (00$d3)")
            tier = maxOf(tier, RarityTier.EPIC)
            basePrice += 320000L
        } else if (d1 == d3) {
            matched.add("ЗЕРКАЛО ($dStr)")
            tier = maxOf(tier, RarityTier.RARE)
            basePrice += 35000L
        } else if (d3 == d2 + 1 && d2 == d1 + 1) {
            matched.add("СТРИТ ($dStr)")
            tier = maxOf(tier, RarityTier.RARE)
            basePrice += 28000L
        }

        // Letter patterns
        if (l1 == l2 && l2 == l3) {
            matched.add("ТРИ БУКВЫ ($lStr)")
            tier = maxOf(tier, RarityTier.LEGENDARY)
            basePrice += 1800000L
        } else if (l1 == l3) {
            matched.add("ЗЕРКАЛО БУКВ ($l1*$l1)")
            tier = maxOf(tier, RarityTier.UNCOMMON)
            basePrice += 4500L
        }

        // Special regional multipliers
        val regionMultiplier = when (spec.region) {
            "777" -> 4.0
            "77", "99", "177", "197", "799" -> 2.5
            "78", "178", "198" -> 2.2
            else -> 1.0
        }

        val formatMultiplier = spec.format.mult
        val finalPrice = (basePrice * regionMultiplier * formatMultiplier).toLong()

        val id = "plate_${timestamp}_${seed.toString(16)}"

        return Plate(
            id = id,
            letters = letters,
            digits = digits,
            region = spec.region,
            country = spec.country,
            format = spec.format,
            price = finalPrice,
            rarity = tier,
            matchedPatterns = matched.toImmutableList(),
            seed = seed,
            timestamp = timestamp
        )
    }
}
