package ru.platetycoon.game.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import ru.platetycoon.game.engine.PlateEngine
import ru.platetycoon.game.engine.PlateRecord

data class GameUiState(
    val balanceRub: Long = 50_900L,
    val spinCost: Long = 345L,
    val currentPlate: PlateRecord = PlateEngine.generate("777"),
    val inventory: List<PlateRecord> = emptyList(),
    val garageCarIds: List<Int> = listOf(1)
)

class GameViewModel : ViewModel() {

    private val _gameState = MutableStateFlow(GameUiState())
    val gameState: StateFlow<GameUiState> = _gameState.asStateFlow()

    fun deductSpinCost() {
        _gameState.update {
            it.copy(balanceRub = it.balanceRub - it.spinCost)
        }
    }

    fun rollTemporaryPlate() {
        _gameState.update {
            it.copy(currentPlate = PlateEngine.generate(it.currentPlate.region))
        }
    }

    fun generateFinalPlate(): PlateRecord {
        val finalPlate = PlateEngine.generate(
            region = _gameState.value.currentPlate.region,
            luckMultiplier = 1.2
        )
        _gameState.update {
            it.copy(
                currentPlate = finalPlate,
                inventory = listOf(finalPlate) + it.inventory
            )
        }
        return finalPlate
    }
}
