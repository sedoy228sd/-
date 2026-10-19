package ru.platetycoon.core.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Requirement 013: PlateEntity for storing owned and pre-roll generated plates.
 */
@Entity(tableName = "plates")
data class PlateEntity(
    @PrimaryKey val id: String,
    val lettersJson: String,
    val digitsJson: String,
    val region: String,
    val country: String,
    val formatName: String,
    val price: Long,
    val rarityName: String,
    val patternsJson: String,
    val seed: Long,
    val timestamp: Long,
    val isSold: Boolean = false,
    val isLocked: Boolean = false
)

/**
 * Requirement 013 & 276: LedgerEntry for atomic balance ledger accounting.
 */
@Entity(tableName = "ledger_entries")
data class LedgerEntry(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val reason: String,
    val amount: Long,
    val balanceAfter: Long,
    val timestamp: Long
)

/**
 * Requirement 013: CaseEntity for inventory and case opening history.
 */
@Entity(tableName = "cases")
data class CaseEntity(
    @PrimaryKey val id: String,
    val title: String,
    val cost: Long,
    val openedCount: Int = 0
)

/**
 * Requirement 013: TaskEntity for daily objectives and achievements.
 */
@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey val id: String,
    val title: String,
    val maskPattern: String,
    val targetCount: Int,
    val currentCount: Int = 0,
    val isCompleted: Boolean = false,
    val rewardRub: Long = 10000L
)
