package ru.platetycoon.core.domain.provider

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlin.random.Random

/**
 * Requirement 011 & 025: Injectable TimeProvider based on kotlinx-datetime.
 */
interface TimeProvider {
    fun now(): Instant
    fun currentTimeMillis(): Long = now().toEpochMilliseconds()
}

class SystemTimeProvider(private val clock: Clock = Clock.System) : TimeProvider {
    override fun now(): Instant = clock.now()
}

/**
 * Requirement 011: Injectable RandomProvider for deterministic tests & seed replay.
 */
interface RandomProvider {
    fun nextLong(): Long
    fun nextInt(until: Int): Int
    fun nextDouble(): Double
    fun createRandom(seed: Long): Random
}

class DefaultRandomProvider(private val seed: Long? = null) : RandomProvider {
    private val random = seed?.let { Random(it) } ?: Random.Default

    override fun nextLong(): Long = random.nextLong()
    override fun nextInt(until: Int): Int = random.nextInt(until)
    override fun nextDouble(): Double = random.nextDouble()
    override fun createRandom(seed: Long): Random = Random(seed)
}
