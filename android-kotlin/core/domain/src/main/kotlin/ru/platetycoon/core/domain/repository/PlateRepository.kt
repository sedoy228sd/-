package ru.platetycoon.core.domain.repository

import kotlinx.collections.immutable.ImmutableList
import kotlinx.coroutines.flow.Flow
import ru.platetycoon.core.domain.model.Plate

/**
 * Requirement 015: Repository pattern emitting distinct Flows, never LiveData.
 */
interface PlateRepository {
    fun observeLatestPlate(): Flow<Plate?>
    fun observeInventory(): Flow<ImmutableList<Plate>>
    fun observeBalance(): Flow<Long>
    fun observeSpinsCount(): Flow<Long>

    suspend fun savePreRollPlate(plate: Plate)
    suspend fun commitGeneratedPlate(plate: Plate, cost: Long)
    suspend fun sellPlate(plate: Plate, revenue: Long)
    suspend fun updateBalance(amount: Long, reason: String)
}
