package ru.platetycoon.game.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.media.SoundPool
import kotlin.concurrent.thread
import kotlin.math.sin

object SoundManager {
    private var soundPool: SoundPool? = null
    private var sampleRate = 44100
    var isEnabled: Boolean = true

    fun init(context: Context) {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(8)
            .setAudioAttributes(audioAttributes)
            .build()
    }

    fun playReelTick() {
        if (!isEnabled) return
        generateTone(freq = 600f, durationMs = 25, type = "triangle", gain = 0.2f)
    }

    fun playClick() {
        if (!isEnabled) return
        generateTone(freq = 340f, durationMs = 35, type = "sine", gain = 0.25f)
    }

    fun playPlateClank() {
        if (!isEnabled) return
        generateTone(freq = 820f, durationMs = 120, type = "triangle", gain = 0.35f)
    }

    fun playHydraulicStamp() {
        if (!isEnabled) return
        thread {
            generateTone(freq = 85f, durationMs = 280, type = "sawtooth", gain = 0.45f)
        }
    }

    fun playRev() {
        if (!isEnabled) return
        thread {
            generateToneSweep(startFreq = 80f, endFreq = 420f, durationMs = 450, gain = 0.35f)
        }
    }

    fun playPoliceSiren() {
        if (!isEnabled) return
        thread {
            generateToneSweep(startFreq = 650f, endFreq = 950f, durationMs = 300, gain = 0.3f)
            generateToneSweep(startFreq = 950f, endFreq = 650f, durationMs = 300, gain = 0.3f)
        }
    }

    fun playJackpot() {
        if (!isEnabled) return
        thread {
            val chord = listOf(523.25f, 659.25f, 783.99f, 1046.50f)
            for (freq in chord) {
                generateTone(freq = freq, durationMs = 150, type = "triangle", gain = 0.25f)
                Thread.sleep(45)
            }
        }
    }

    private fun generateTone(freq: Float, durationMs: Int, type: String = "sine", gain: Float = 0.3f) {
        val numSamples = (durationMs * sampleRate) / 1000
        val buffer = ShortArray(numSamples)
        for (i in 0 until numSamples) {
            val angle = 2.0 * Math.PI * i / (sampleRate / freq)
            val sampleVal = when (type) {
                "sawtooth" -> ((i % (sampleRate / freq)) / (sampleRate / freq) * 2 - 1).toFloat()
                "triangle" -> (Math.asin(sin(angle)) * (2.0 / Math.PI)).toFloat()
                else -> sin(angle).toFloat()
            }
            val decay = 1f - (i.toFloat() / numSamples)
            buffer[i] = (sampleVal * decay * gain * Short.MAX_VALUE).toInt().toShort()
        }

        playBuffer(buffer)
    }

    private fun generateToneSweep(startFreq: Float, endFreq: Float, durationMs: Int, gain: Float = 0.3f) {
        val numSamples = (durationMs * sampleRate) / 1000
        val buffer = ShortArray(numSamples)
        for (i in 0 until numSamples) {
            val currentFreq = startFreq + (endFreq - startFreq) * (i.toFloat() / numSamples)
            val angle = 2.0 * Math.PI * i / (sampleRate / currentFreq)
            val sampleVal = sin(angle).toFloat()
            val decay = 1f - (i.toFloat() / numSamples)
            buffer[i] = (sampleVal * decay * gain * Short.MAX_VALUE).toInt().toShort()
        }

        playBuffer(buffer)
    }

    private fun playBuffer(buffer: ShortArray) {
        try {
            val audioTrack = AudioTrack(
                AudioManager.STREAM_MUSIC,
                sampleRate,
                AudioFormat.CHANNEL_OUT_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                buffer.size * 2,
                AudioTrack.MODE_STATIC
            )
            audioTrack.write(buffer, 0, buffer.size)
            audioTrack.play()
        } catch (_: Exception) {}
    }

    fun release() {
        soundPool?.release()
        soundPool = null
    }
}
