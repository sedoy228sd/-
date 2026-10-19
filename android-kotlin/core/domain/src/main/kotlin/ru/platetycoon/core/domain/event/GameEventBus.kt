package ru.platetycoon.core.domain.event

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import ru.platetycoon.core.domain.model.Plate
import ru.platetycoon.core.domain.model.RarityTier

/**
 * Common events emitted across the game lifecycle.
 */
sealed interface GameEvent {
    data class PlateGenerated(val plate: Plate, val spinCost: Long) : GameEvent
    data class PlateSold(val plate: Plate, val revenue: Long) : GameEvent
    data class BalanceChanged(val oldBalance: Long, val newBalance: Long, val delta: Long) : GameEvent
    data class RarePlateDiscovered(val plate: Plate, val rarity: RarityTier) : GameEvent
    data class CaseOpened(val caseId: String, val rewardPlate: Plate) : GameEvent
    data class AchievementUnlocked(val achievementId: String, val title: String) : GameEvent
}

/**
 * Requirement 019: SharedFlow-based event bus for achievements, tasks, and analytics.
 */
interface GameEventBus {
    val events: SharedFlow<GameEvent>
    suspend fun emit(event: GameEvent)
}

class DefaultGameEventBus : GameEventBus {
    private val _events = MutableSharedFlow<GameEvent>(extraBufferCapacity = 64)
    override val events: SharedFlow<GameEvent> = _events.asSharedFlow()

    override suspend fun emit(event: GameEvent) {
        _events.emit(event)
    }
}
