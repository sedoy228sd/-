package ru.platetycoon.core.domain.common

/**
 * Requirement 020: Sealed interface for domain errors. Flow control without exceptions.
 */
sealed interface AppError {
    data class InsufficientFunds(val required: Long, val current: Long) : AppError
    data class PlateNotFound(val plateId: String) : AppError
    data class InvalidPlateFormat(val reason: String) : AppError
    data class StorageError(val message: String) : AppError
    data object NetworkUnavailable : AppError
}

/**
 * Functional result type for domain operations.
 */
sealed interface DomainResult<out T> {
    data class Success<out T>(val data: T) : DomainResult<T>
    data class Failure(val error: AppError) : DomainResult<Nothing>

    val isSuccess: Boolean get() = this is Success
    fun getOrNull(): T? = (this as? Success)?.data
}

/**
 * Requirement 021: Logger interface. Release builds only log errors.
 */
interface Logger {
    fun d(tag: String, message: String)
    fun i(tag: String, message: String)
    fun w(tag: String, message: String)
    fun e(tag: String, message: String, throwable: Throwable? = null)
}

/**
 * Requirement 024: Feature flags interface with safe local defaults.
 */
interface FeatureFlags {
    fun isFeatureEnabled(key: String, default: Boolean = false): Boolean
    fun getDouble(key: String, default: Double): Double
    fun getLong(key: String, default: Long): Long

    val isUltra4KEnabled: Boolean get() = isFeatureEnabled("ultra_4k_textures", true)
    val isPitySystemEnabled: Boolean get() = isFeatureEnabled("pity_system_active", true)
    val is3DSceneViewEnabled: Boolean get() = isFeatureEnabled("sceneview_3d_enabled", true)
}
