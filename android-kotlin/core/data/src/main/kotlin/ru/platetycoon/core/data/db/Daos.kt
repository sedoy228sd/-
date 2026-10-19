package ru.platetycoon.core.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import ru.platetycoon.core.data.entity.CaseEntity
import ru.platetycoon.core.data.entity.LedgerEntry
import ru.platetycoon.core.data.entity.PlateEntity
import ru.platetycoon.core.data.entity.TaskEntity

@Dao
interface PlateDao {
    @Query("SELECT * FROM plates WHERE isSold = 0 ORDER BY timestamp DESC")
    fun observeInventory(): Flow<List<PlateEntity>>

    @Query("SELECT * FROM plates ORDER BY timestamp DESC LIMIT 1")
    fun observeLatestPlate(): Flow<PlateEntity?>

    @Query("SELECT COUNT(*) FROM plates")
    fun observeTotalSpins(): Flow<Long>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPlate(plate: PlateEntity)

    @Update
    suspend fun updatePlate(plate: PlateEntity)

    @Query("UPDATE plates SET isSold = 1 WHERE id = :plateId")
    suspend fun markAsSold(plateId: String)
}

@Dao
interface LedgerDao {
    @Query("SELECT * FROM ledger_entries ORDER BY id DESC")
    fun observeEntries(): Flow<List<LedgerEntry>>

    @Query("SELECT balanceAfter FROM ledger_entries ORDER BY id DESC LIMIT 1")
    fun observeLatestBalance(): Flow<Long?>

    @Insert
    suspend fun insertEntry(entry: LedgerEntry): Long

    @Query("SELECT COALESCE(SUM(amount), 0) FROM ledger_entries")
    suspend fun calculateTotalSum(): Long
}

@Dao
interface CaseDao {
    @Query("SELECT * FROM cases")
    fun observeCases(): Flow<List<CaseEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertCase(caseEntity: CaseEntity)
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks")
    fun observeTasks(): Flow<List<TaskEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertTask(taskEntity: TaskEntity)
}

@Database(
    entities = [PlateEntity::class, LedgerEntry::class, CaseEntity::class, TaskEntity::class],
    version = 1,
    exportSchema = false
)
abstract class PlateDatabase : RoomDatabase() {
    abstract fun plateDao(): PlateDao
    abstract fun ledgerDao(): LedgerDao
    abstract fun caseDao(): CaseDao
    abstract fun taskDao(): TaskDao
}
