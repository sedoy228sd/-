export interface KotlinFile {
  name: string;
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'yaml' | 'markdown';
  description: string;
  content: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: 'PlateEngine.kt',
    path: 'app/src/main/java/ru/platetycoon/game/engine/PlateEngine.kt',
    language: 'kotlin',
    description: 'Математический генератор ГОСТ номеров, расчёт комбинаций и алгоритм оценки стоимости',
    content: `package ru.platetycoon.game.engine

import java.util.UUID
import kotlin.random.Random

enum class RarityTier(val title: String, val colorHex: Long, val baseMultiplier: Double) {
    COMMON("ОБЫЧНЫЙ", 0xFF94A3B8, 1.0),
    UNCOMMON("НЕОБЫЧНЫЙ", 0xFF38BDF8, 3.5),
    RARE("РЕДКИЙ", 0xFFA855F7, 10.0),
    EPIC("ЭПИЧЕСКИЙ", 0xFFEC4899, 35.0),
    LEGENDARY("ЛЕГЕНДАРНЫЙ", 0xFFF59E0B, 120.0),
    MYTHIC("МИФИЧЕСКИЙ", 0xFFEF4444, 450.0),
    GODLIKE("GODLIKE", 0xFF10B981, 1500.0)
}

data class PlateRecord(
    val id: String = UUID.randomUUID().toString(),
    val letters: String,
    val digits: List<Int>,
    val region: String,
    val plateType: String = "civil",
    var price: Long = 0,
    var rarity: RarityTier = RarityTier.COMMON,
    val criteria: MutableList<String> = mutableListOf(),
    val timestamp: Long = System.currentTimeMillis()
) {
    val fullFormatted: String
        get() = "\${letters[0]}\${digits.joinToString("")}\${letters.substring(1)} $region"
}

object PlateEngine {
    // 12 разрешённых букв ГОСТ РФ (имеющих аналоги в латинице)
    private val RUSSIAN_LETTERS = listOf('А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х')
    
    private val BLAT_SERIES = mapOf(
        "ЕКХ" to 50.0,  // ФСО «Еду Как Хочу»
        "АМР" to 65.0,  // Правительство РФ
        "ВОР" to 30.0,  // Авторитетная
        "ХАМ" to 22.0,  // Дерзкая
        "ССС" to 28.0,  // Спецсвязь
        "ООО" to 35.0,  // Три Ольги
        "ААА" to 40.0   // Первая серия столицы
    )

    fun generate(
        region: String = "777",
        plateType: String = "civil",
        luckMultiplier: Double = 1.0
    ): PlateRecord {
        val rnd = Random.Default
        var l: List<Char>
        var d: List<Int>

        val luckyRoll = rnd.nextDouble() < (0.05 * luckMultiplier)

        if (luckyRoll) {
            when (rnd.nextInt(6)) {
                0 -> { // 777 или 3 одинаковые цифры
                    val dig = if (rnd.nextDouble() < 0.35) 7 else rnd.nextInt(1, 10)
                    d = listOf(dig, dig, dig)
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                1 -> { // Одинаковые буквы ААА
                    val let = RUSSIAN_LETTERS.random()
                    l = listOf(let, let, let)
                    d = List(3) { rnd.nextInt(10) }
                }
                2 -> { // Палиндром 7*7
                    val dig = rnd.nextInt(1, 10)
                    d = listOf(dig, rnd.nextInt(10), dig)
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                3 -> { // Престиж 001-009
                    d = listOf(0, 0, rnd.nextInt(1, 10))
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                4 -> { // Круглая сотня (100, 200, 500)
                    d = listOf(rnd.nextInt(1, 10), 0, 0)
                    l = List(3) { RUSSIAN_LETTERS.random() }
                }
                else -> { // Блатная спецсерия
                    val blat = BLAT_SERIES.keys.random()
                    l = blat.toList()
                    d = List(3) { rnd.nextInt(10) }
                }
            }
        } else {
            l = List(3) { RUSSIAN_LETTERS.random() }
            d = List(3) { rnd.nextInt(10) }
        }

        // Защита от 000
        if (d[0] == 0 && d[1] == 0 && d[2] == 0) {
            d = listOf(0, 0, 1)
        }

        val lettersStr = l.joinToString("")
        val plate = PlateRecord(
            letters = lettersStr,
            digits = d,
            region = region,
            plateType = plateType
        )

        evaluate(plate)
        return plate
    }

    private fun evaluate(plate: PlateRecord) {
        var mult = 1.0
        val d = plate.digits
        val ls = plate.letters
        val ds = "\${d[0]}\${d[1]}\${d[2]}"

        val sameDigits = d[0] == d[1] && d[1] == d[2]
        val sameLetters = ls[0] == ls[1] && ls[1] == ls[2]
        val isPalindrome = d[0] == d[2] && d[0] != d[1]
        val isFirstTen = d[0] == 0 && d[1] == 0 && d[2] > 0
        val isRoundHundred = d[0] > 0 && d[1] == 0 && d[2] == 0
        val matchRegion = ds == plate.region || (ds == "777" && plate.region.contains("77"))

        if (sameDigits) {
            mult *= if (ds == "777") 120.0 else 45.0
            plate.criteria.add(if (ds == "777") "Золотые топоры 777" else "Три одинаковые цифры ($ds)")
        } else if (d[0] == d[1] || d[1] == d[2] || d[0] == d[2]) {
            mult *= 2.2
            plate.criteria.add("Пара одинаковых цифр")
        }

        if (sameLetters) {
            mult *= 35.0
            plate.criteria.add("Три одинаковые буквы ($ls)")
        } else if (ls[0] == ls[1] || ls[1] == ls[2] || ls[0] == ls[2]) {
            mult *= 1.8
            plate.criteria.add("Пара букв")
        }

        if (isFirstTen) {
            mult *= 50.0
            plate.criteria.add("Первый десяток ($ds)")
        } else if (isRoundHundred) {
            mult *= 15.0
            plate.criteria.add("Круглая сотня ($ds)")
        } else if (isPalindrome) {
            mult *= 8.0
            plate.criteria.add("Зеркальные цифры ($ds)")
        }

        BLAT_SERIES[ls]?.let { blatBonus ->
            mult *= blatBonus
            plate.criteria.add("Правительственная серия $ls")
        }

        if (matchRegion) {
            mult *= 20.0
            plate.criteria.add("Совпадение номера с регионом")
        }

        // Базовый расчёт стоимости
        val basePrice = 450.0
        val calculatedPrice = (basePrice * mult).toLong()
        plate.price = calculatedPrice

        // Определение категории редкости
        plate.rarity = when {
            calculatedPrice >= 1_500_000L -> RarityTier.GODLIKE
            calculatedPrice >= 450_000L -> RarityTier.MYTHIC
            calculatedPrice >= 120_000L -> RarityTier.LEGENDARY
            calculatedPrice >= 35_000L -> RarityTier.EPIC
            calculatedPrice >= 10_000L -> RarityTier.RARE
            calculatedPrice >= 2_500L -> RarityTier.UNCOMMON
            else -> RarityTier.COMMON
        }
    }
}
`
  },
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/ru/platetycoon/game/MainActivity.kt',
    language: 'kotlin',
    description: 'Главная Android Activity с поддержкой Jetpack Compose, edge-to-edge и звукового движка',
    content: `package ru.platetycoon.game

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.darkColorScheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import ru.platetycoon.game.audio.SoundManager
import ru.platetycoon.game.ui.MainGameScreen
import ru.platetycoon.game.viewmodel.GameViewModel

class MainActivity : ComponentActivity() {

    private val gameViewModel: GameViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Инициализация звукового движка SoundPool
        SoundManager.init(applicationContext)

        setContent {
            val darkColors = darkColorScheme(
                primary = Color(0xFFF59E0B),
                secondary = Color(0xFF38BDF8),
                background = Color(0xFF080A10),
                surface = Color(0xFF121524),
                onBackground = Color.White,
                onSurface = Color.White
            )

            MaterialTheme(colorScheme = darkColors) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainGameScreen(viewModel = gameViewModel)
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        SoundManager.release()
    }
}
`
  },
  {
    name: 'MainGameScreen.kt',
    path: 'app/src/main/java/ru/platetycoon/game/ui/MainGameScreen.kt',
    language: 'kotlin',
    description: 'Полнофункциональный Jetpack Compose экран игры с 3D анимацией, кнопкой крутки и навигацией',
    content: `package ru.platetycoon.game.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import ru.platetycoon.game.audio.SoundManager
import ru.platetycoon.game.viewmodel.GameViewModel

@Composable
fun MainGameScreen(viewModel: GameViewModel) {
    val state by viewModel.gameState.collectAsState()
    val scope = rememberCoroutineScope()
    val haptic = LocalHapticFeedback.current

    var isSpinning by remember { mutableStateOf(false) }
    var displayedPrice by remember { mutableStateOf(state.currentPlate.price) }
    var showDealership by remember { mutableStateOf(false) }

    LaunchedEffect(state.currentPlate) {
        displayedPrice = state.currentPlate.price
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF08090F))
            .padding(16.dp)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // ================= ВЕРХНИЙ БАР =================
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Кнопка меню
                IconButton(
                    onClick = {
                        SoundManager.playClick()
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    },
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF141622))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Menu,
                        contentDescription = "Меню",
                        tint = Color.White
                    )
                }

                // Индикатор 500 МБ HD Кэша
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF141622))
                        .border(1.dp, Color(0xFFA855F7).copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                        .clickable { SoundManager.playClick() }
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF10B981))
                    )
                    Column {
                        Text(
                            text = "512 МБ",
                            color = Color(0xFFD8B4FE),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black
                        )
                        Text(
                            text = "Ultra 4K",
                            color = Color(0xFF94A3B8),
                            fontSize = 9.sp
                        )
                    }
                }

                // Баланс игрока
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFF141622))
                        .border(1.dp, Color(0xFF334155), RoundedCornerShape(16.dp))
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = String.format("%,d", state.balanceRub),
                            color = Color(0xFFF59E0B),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = "₽",
                            color = Color(0xFF94A3B8),
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // ================= ЦЕНТРАЛЬНАЯ ЗОНА (НОМЕР ГОСТ И ЦЕНА) =================
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // Бейдж редкости
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .background(Color(state.currentPlate.rarity.colorHex).copy(alpha = 0.2f))
                        .border(
                            1.dp,
                            Color(state.currentPlate.rarity.colorHex),
                            RoundedCornerShape(50)
                        )
                        .padding(horizontal = 14.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = state.currentPlate.rarity.title,
                        color = Color(state.currentPlate.rarity.colorHex),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                }

                // ГОСТ Номер с 3D эффектом
                GostPlateCompose(
                    plate = state.currentPlate,
                    isSpinning = isSpinning,
                    onPlateClick = {
                        SoundManager.playPlateClank()
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    }
                )

                // Динамический счётчик стоимости
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "ОЦЕНОЧНАЯ СТОИМОСТЬ",
                        color = Color(0xFF64748B),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "\${String.format("%,d", displayedPrice)} ₽",
                        color = Color.White,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Кнопка крутки
                Button(
                    onClick = {
                        if (!isSpinning && state.balanceRub >= state.spinCost) {
                            scope.launch {
                                isSpinning = true
                                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                SoundManager.playReelTick()
                                
                                viewModel.deductSpinCost()

                                repeat(6) {
                                    delay(45)
                                    SoundManager.playReelTick()
                                    viewModel.rollTemporaryPlate()
                                }

                                val finalPlate = viewModel.generateFinalPlate()
                                isSpinning = false
                                SoundManager.playHydraulicStamp()
                                
                                if (finalPlate.rarity.ordinal >= 4) {
                                    SoundManager.playJackpot()
                                }
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .height(56.dp)
                        .shadow(16.dp, RoundedCornerShape(20.dp), spotColor = Color(0xFFF59E0B)),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFF59E0B)
                    ),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Text(
                        text = if (isSpinning) "ШТАМПОВКА..." else "КРУТИТЬ • \${state.spinCost} ₽",
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            // ================= НИЖНИЙ НАВИГАЦИОННЫЙ ДОК =================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color(0xFF121524))
                    .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(20.dp))
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                DockItem(icon = "🎰", label = "Номер", selected = true) {
                    SoundManager.playClick()
                }
                DockItem(icon = "🚘", label = "Авто 4K", selected = false) {
                    SoundManager.playClick()
                    showDealership = true
                }
                DockItem(icon = "📦", label = "Кейсы", selected = false) {
                    SoundManager.playClick()
                }
                DockItem(icon = "🚨", label = "ДПС", selected = false) {
                    SoundManager.playPoliceSiren()
                }
                DockItem(icon = "🏁", label = "Гонки", selected = false) {
                    SoundManager.playRev()
                }
            }
        }
    }

    if (showDealership) {
        DealershipDialog(onDismiss = { showDealership = false })
    }
}

@Composable
fun DockItem(icon: String, label: String, selected: Boolean, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .clickable(
                indication = null,
                interactionSource = remember { MutableInteractionSource() },
                onClick = onClick
            )
            .padding(horizontal = 8.dp, vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = icon, fontSize = 20.sp)
        Text(
            text = label,
            fontSize = 9.sp,
            fontWeight = if (selected) FontWeight.Black else FontWeight.Bold,
            color = if (selected) Color(0xFFF59E0B) else Color(0xFF94A3B8)
        )
    }
}
`
  },
  {
    name: 'GostPlateCompose.kt',
    path: 'app/src/main/java/ru/platetycoon/game/ui/GostPlateCompose.kt',
    language: 'kotlin',
    description: 'Нативный рендеринг номерного знака по ГОСТ Р 50577-2018 с триколором, флагом и 3D наклоном',
    content: `package ru.platetycoon.game.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ru.platetycoon.game.engine.PlateRecord

@Composable
fun GostPlateCompose(
    plate: PlateRecord,
    isSpinning: Boolean = false,
    onPlateClick: () -> Unit = {}
) {
    var rotationX by remember { mutableStateOf(0f) }
    var rotationY by remember { mutableStateOf(0f) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .graphicsLayer {
                this.rotationX = rotationX
                this.rotationY = rotationY
                cameraDistance = 12f * density
            }
            .pointerInput(Unit) {
                detectTapGestures(
                    onPress = { offset ->
                        val centerX = size.width / 2f
                        val centerY = size.height / 2f
                        rotationY = (offset.x - centerX) / centerX * 12f
                        rotationX = -(offset.y - centerY) / centerY * 12f
                        tryAwaitRelease()
                        rotationX = 0f
                        rotationY = 0f
                    },
                    onTap = { onPlateClick() }
                )
            }
            .shadow(24.dp, RoundedCornerShape(12.dp), spotColor = Color(0xFFF59E0B).copy(alpha = 0.35f))
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .border(3.dp, Color.Black, RoundedCornerShape(12.dp))
            .aspectRatio(4.7f / 1f)
            .padding(4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Левая часть: Серия и номер (А 777 АА)
            Row(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "\${plate.letters[0]} \${plate.digits.joinToString("")} \${plate.letters.substring(1)}",
                    color = Color.Black,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.SansSerif,
                    letterSpacing = 1.sp
                )
            }

            // Вертикальный разделитель ГОСТ
            Box(
                modifier = Modifier
                    .width(2.5.dp)
                    .fillMaxHeight(0.9f)
                    .background(Color.Black)
            )

            // Правая часть: Код региона и флаг РФ
            Column(
                modifier = Modifier
                    .width(72.dp)
                    .fillMaxHeight(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = plate.region,
                    color = Color.Black,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.SansSerif,
                    lineHeight = 24.sp
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(3.dp)
                ) {
                    Text(
                        text = "RUS",
                        color = Color.Black,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )

                    // Триколор России
                    Column(
                        modifier = Modifier
                            .width(14.dp)
                            .height(9.dp)
                            .border(0.5.dp, Color(0xFF64748B))
                    ) {
                        Box(modifier = Modifier.weight(1f).fillMaxWidth().background(Color.White))
                        Box(modifier = Modifier.weight(1f).fillMaxWidth().background(Color(0xFF0039A6)))
                        Box(modifier = Modifier.weight(1f).fillMaxWidth().background(Color(0xFFD52B1E)))
                    }
                }
            }
        }
    }
}
`
  },
  {
    name: 'SoundManager.kt',
    path: 'app/src/main/java/ru/platetycoon/game/audio/SoundManager.kt',
    language: 'kotlin',
    description: 'Нативный звуковой движок Android SoundPool с синтезом звуков выхлопа V8, крякалки ФСО и сирен',
    content: `package ru.platetycoon.game.audio

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

    // Быстрый щелчок барабана слота
    fun playReelTick() {
        if (!isEnabled) return
        generateTone(freq = 600f, durationMs = 25, type = "triangle", gain = 0.2f)
    }

    // Щелчок кнопки интерфейса
    fun playClick() {
        if (!isEnabled) return
        generateTone(freq = 340f, durationMs = 35, type = "sine", gain = 0.25f)
    }

    // Звонкий металлический стук пластины ГОСТ
    fun playPlateClank() {
        if (!isEnabled) return
        generateTone(freq = 820f, durationMs = 120, type = "triangle", gain = 0.35f)
    }

    // Мощный удар гидравлического пресса 50 тонн
    fun playHydraulicStamp() {
        if (!isEnabled) return
        thread {
            generateTone(freq = 85f, durationMs = 280, type = "sawtooth", gain = 0.45f)
        }
    }

    // Рёв двигателя с турбо-подхватом
    fun playRev() {
        if (!isEnabled) return
        thread {
            generateToneSweep(startFreq = 80f, endFreq = 420f, durationMs = 450, gain = 0.35f)
        }
    }

    // Двухтональная сирена ДПС
    fun playPoliceSiren() {
        if (!isEnabled) return
        thread {
            generateToneSweep(startFreq = 650f, endFreq = 950f, durationMs = 300, gain = 0.3f)
            generateToneSweep(startFreq = 950f, endFreq = 650f, durationMs = 300, gain = 0.3f)
        }
    }

    // Золотые фанфары джекпота 777
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
`
  },
  {
    name: 'GameViewModel.kt',
    path: 'app/src/main/java/ru/platetycoon/game/viewmodel/GameViewModel.kt',
    language: 'kotlin',
    description: 'AndroidX ViewModel и StateFlow для реактивного управления балансом и инвентарём',
    content: `package ru.platetycoon.game.viewmodel

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
`
  },
  {
    name: 'DealershipDialog.kt',
    path: 'app/src/main/java/ru/platetycoon/game/ui/DealershipDialog.kt',
    language: 'kotlin',
    description: 'Диалог 4K Автосалона с карточками реальных авто (Гелик G63, Supra A80, 2107)',
    content: `package ru.platetycoon.game.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import ru.platetycoon.game.audio.SoundManager

data class CarItem(
    val id: Int,
    val name: String,
    val price: Long,
    val power: Int,
    val zeroHundred: String,
    val engine: String,
    val category: String
)

val CARS_LIST = listOf(
    CarItem(1, "ВАЗ-2101 «Копейка»", 8_000L, 64, "20.0 с", "1.2L 4-цил", "Ретро"),
    CarItem(2, "ВАЗ-2107 «Семёрка»", 28_000L, 73, "16.0 с", "1.5L Классика", "Ретро"),
    CarItem(3, "Toyota Supra A80 Twin-Turbo", 1_850_000L, 330, "4.9 с", "3.0L 2JZ-GTE", "JDM"),
    CarItem(4, "Mercedes-AMG G63 Gelik", 6_400_000L, 585, "4.5 с", "4.0L V8 Biturbo", "Премиум"),
    CarItem(5, "Porsche 911 GT3 RS", 16_500_000L, 525, "3.2 с", "4.0L Boxer-6 9000RPM", "Суперкар")
)

@Composable
fun DealershipDialog(onDismiss: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(24.dp),
            color = Color(0xFF0F121D),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "АВТОСАЛОН 4K",
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black
                    )
                    TextButton(onClick = onDismiss) {
                        Text(text = "Закрыть", color = Color(0xFF94A3B8))
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(CARS_LIST) { car ->
                        CarCard(car = car)
                    }
                }
            }
        }
    }
}

@Composable
fun CarCard(car: CarItem) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFF141828))
            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
            .clickable {
                SoundManager.playRev()
            }
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = car.name,
                color = Color.White,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "\${car.power} л.с. • 0-100: \${car.zeroHundred} • \${car.engine}",
                color = Color(0xFF94A3B8),
                fontSize = 11.sp
            )
        }

        Text(
            text = "\${String.format("%,d", car.price)} ₽",
            color = Color(0xFFF59E0B),
            fontSize = 14.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.Monospace
        )
    }
}
`
  },
  {
    name: 'build.gradle.kts (Project)',
    path: 'build.gradle.kts',
    language: 'kotlin',
    description: 'Корневой Gradle файл проекта Kotlin с плагинами Android и Jetpack Compose',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  },
  {
    name: 'app/build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Конфигурация сборки Android модуля: Jetpack Compose, Material3, Coroutines и сборка APK',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "ru.platetycoon.game"
    compileSdk = 35

    defaultConfig {
        applicationId = "ru.platetycoon.game"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.kotlinx.coroutines.android)

    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Манифест Android приложения с правами вибро-отклика, интернета и альбомной ориентации',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Генератор Номеров"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    name: 'build-kotlin-apk.yml',
    path: '.github/workflows/build-kotlin-apk.yml',
    language: 'yaml',
    description: 'GitHub Action: Автоматическая сборка APK из Kotlin исходников в 1 клик',
    content: `name: Build Android APK (Kotlin & Jetpack Compose)

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Source Code
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v3

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew || true

    - name: Assemble Debug APK with Gradle
      run: ./gradlew assembleDebug --stacktrace

    - name: Upload APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: PlateTycoon-Kotlin-Debug-APK
        path: app/build/outputs/apk/debug/*.apk
        if-no-files-found: warn
`
  },
  {
    name: 'README_KOTLIN.md',
    path: 'README_KOTLIN.md',
    language: 'markdown',
    description: 'Пошаговое руководство по открытию в Android Studio и сборке APK на телефоне',
    content: `# 📱 Генератор Номеров — Android Native (Kotlin + Jetpack Compose)

Игра полностью переписана на **чистый нативный Kotlin** с использованием **Jetpack Compose**, **StateFlow**, **SoundPool** и **Material 3**.

---

## 🚀 3 Способа получить готовый .APK файл:

### Способ 1: Сборка через Android Studio (Рекомендуется)
1. Скачайте проект или откройте папку \`android-kotlin/\` в **Android Studio** (Hedgehog, Iguana, Ladybug или новее).
2. Подождите 1 минуту, пока Gradle синхронизирует зависимости Jetpack Compose.
3. В верхнем меню выберите **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Android Studio скомпилирует готовый файл:
   \`app/build/outputs/apk/debug/app-debug.apk\`
5. Нажмите всплывающее уведомление **«locate»** и установите APK на свой телефон через провод, Telegram или облачный диск!

---

### Способ 2: Сборка через командную строку (Gradle CLI)
Если у вас установлен Android SDK и JDK 17+:
\`\`\`bash
# Перейдите в папку с проектом
cd android-kotlin

# Соберите Debug APK
./gradlew assembleDebug

# Готовый APK появится в:
# app/build/outputs/apk/debug/app-debug.apk
\`\`\`

---

### Способ 3: Автоматическая сборка через GitHub Actions (Бесплатно)
1. Создайте репозиторий на [GitHub.com](https://github.com).
2. Загрузите файлы проекта.
3. Готовый workflow файл \`.github/workflows/build-kotlin-apk.yml\` уже настроен.
4. Откройте вкладку **Actions**, нажмите **Run workflow**.
5. Через 2-3 минуты скачайте скомпилированный APK прямо из артефактов GitHub!
`
  }
];
