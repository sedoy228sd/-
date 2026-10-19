package ru.platetycoon.core.data.repository

import kotlinx.collections.immutable.ImmutableList
import kotlinx.collections.immutable.toImmutableList
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import ru.platetycoon.core.data.db.LedgerDao
import ru.platetycoon.core.data.db.PlateDao
import ru.platetycoon.core.data.entity.LedgerEntry
import ru.platetycoon.core.data.entity.PlateEntity
import ru.platetycoon.core.domain.model.Plate
import ru.platetycoon.core.domain.model.PlateFormat
import ru.platetycoon.core.domain.model.RarityTier
import ru.platetycoon.core.domain.provider.TimeProvider
import ru.platetycoon.core.domain.repository.PlateRepository

class PlateRepositoryImpl(
    private val plateDao: PlateDao,
    private val ledgerDao: LedgerDao,
    private val timeProvider: TimeProvider,
    private val json: Json = Json { ignoreUnknownKeys = true }
) : PlateRepository {

    override fun observeLatestPlate(): Flow<Plate?> {
        return plateDao.observeLatestPlate()
            .map { entity -> entity?.toDomain() }
            .distinctUntilChanged()
    }

    override fun observeInventory(): Flow<ImmutableList<Plate>> {
        return plateDao.observeInventory()
            .map { list -> list.map { it.toDomain() }.toImmutableList() }
            .distinctUntilChanged()
    }

    override fun observeBalance(): Flow<Long> {
        return ledgerDao.observeLatestBalance()
            .map { it ?: 50900L }
            .distinctUntilChanged()
    }

    override fun observeSpinsCount(): Flow<Long> {
        return plateDao.observeTotalSpins().distinctUntilChanged()
    }

    override suspend fun savePreRollPlate(plate: Plate) {
        plateDao.insertPlate(plate.toEntity())
    }

    override suspend fun commitGeneratedPlate(plate: Plate, cost: Long) {
        plateDao.insertPlate(plate.toEntity())
    }

    override suspend fun sellPlate(plate: Plate, revenue: Long) {
        plateDao.markAsSold(plate.id)
    }

    override suspend fun updateBalance(amount: Long, reason: String) {
        val currentBalance = ledgerDao.observeLatestBalance().first() ?: 50900L
        val newBalance = (currentBalance + amount).coerceAtLeast(0L)
        val entry = LedgerEntry(
            reason = reason,
            amount = amount,
            balanceAfter = newBalance,
            timestamp = timeProvider.currentTimeMillis()
        )
        ledgerDao.insertEntry(entry)
    }

    private fun PlateEntity.toDomain(): Plate {
        val letters: List<String> = try { json.decodeFromString(lettersJson) } catch (_: Exception) { listOf("А", "А", "А") }
        val digits: List<Int> = try { json.decodeFromString(digitsJson) } catch (_: Exception) { listOf(7, 7, 7) }
        val patterns: List<String> = try { json.decodeFromString(patternsJson) } catch (_: Exception) { emptyList() }
        val format = try { PlateFormat.valueOf(formatName) } catch (_: Exception) { PlateFormat.CIVIL }
        val rarity = try { RarityTier.valueOf(rarityName) } catch (_: Exception) { RarityTier.COMMON }

        return Plate(
            id = id,
            letters = letters.toImmutableList(),
            digits = digits.toImmutableList(),
            region = region,
            country = country,
            format = format,
            price = price,
            rarity = rarity,
            matchedPatterns = patterns.toImmutableList(),
            seed = seed,
            timestamp = timestamp
        )
    }

    private fun Plate.toEntity(): PlateEntity {
        return PlateEntity(
            id = id,
            lettersJson = json.encodeToString(letters.toList()),
            digitsJson = json.encodeToString(digits.toList()),
            region = region,
            country = country,
            formatName = format.name,
            price = price,
            rarityName = rarity.name,
            patternsJson = json.encodeToString(matchedPatterns.toList()),
            seed = seed,
            timestamp = timestamp
        )
    }
}
