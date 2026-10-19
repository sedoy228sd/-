package ru.platetycoon.core.domain.usecase

import kotlinx.coroutines.flow.first
import ru.platetycoon.core.domain.common.AppError
import ru.platetycoon.core.domain.common.DomainResult
import ru.platetycoon.core.domain.event.GameEvent
import ru.platetycoon.core.domain.event.GameEventBus
import ru.platetycoon.core.domain.generator.PlateGenerator
import ru.platetycoon.core.domain.model.Plate
import ru.platetycoon.core.domain.model.PlateSpec
import ru.platetycoon.core.domain.provider.RandomProvider
import ru.platetycoon.core.domain.provider.TimeProvider
import ru.platetycoon.core.domain.repository.PlateRepository

/**
 * Requirement 009, 011, 012:
 * GeneratePlateUseCase generates plate using injected Random & Clock,
 * saves pre-roll result to DB before animation start to ensure process death safety.
 */
class GeneratePlateUseCase(
    private val repository: PlateRepository,
    private val randomProvider: RandomProvider,
    private val timeProvider: TimeProvider,
    private val eventBus: GameEventBus
) {
    suspend operator fun invoke(spec: PlateSpec, cost: Long): DomainResult<Plate> {
        val currentBalance = repository.observeBalance().first()
        if (currentBalance < cost) {
            return DomainResult.Failure(AppError.InsufficientFunds(required = cost, current = currentBalance))
        }

        val seed = randomProvider.nextLong()
        val timestamp = timeProvider.currentTimeMillis()
        val random = randomProvider.createRandom(seed)

        // Generate plate via pure function
        val plate = PlateGenerator.generate(spec, random, seed = seed, timestamp = timestamp)

        // Requirement 012: Pre-record outcome in DB before starting animation
        repository.savePreRollPlate(plate)
        repository.updateBalance(-cost, "SPIN_COST")

        eventBus.emit(GameEvent.PlateGenerated(plate, cost))
        if (plate.rarity.ordinal >= 2) {
            eventBus.emit(GameEvent.RarePlateDiscovered(plate, plate.rarity))
        }

        return DomainResult.Success(plate)
    }
}

/**
 * Requirement 009: EvaluateRarityUseCase for checking match rules and price multiplier breakdown.
 */
class EvaluateRarityUseCase {
    operator fun invoke(plate: Plate): Map<String, Any> {
        return mapOf(
            "tier" to plate.rarity.title,
            "patterns" to plate.matchedPatterns,
            "price" to plate.price,
            "regionBonus" to (plate.region == "777")
        )
    }
}

/**
 * Requirement 009: SellPlateUseCase.
 */
class SellPlateUseCase(
    private val repository: PlateRepository,
    private val eventBus: GameEventBus
) {
    suspend operator fun invoke(plate: Plate): DomainResult<Long> {
        val revenue = plate.price
        repository.sellPlate(plate, revenue)
        repository.updateBalance(revenue, "PLATE_SOLD_${plate.fullFormattedString}")
        eventBus.emit(GameEvent.PlateSold(plate, revenue))
        return DomainResult.Success(revenue)
    }
}
