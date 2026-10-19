package ru.platetycoon.game.ui

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
            // Верхний бар
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
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

            // Центральная зона
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
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

                GostPlateCompose(
                    plate = state.currentPlate,
                    isSpinning = isSpinning,
                    onPlateClick = {
                        SoundManager.playPlateClank()
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                    }
                )

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "ОЦЕНОЧНАЯ СТОИМОСТЬ",
                        color = Color(0xFF64748B),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "${String.format("%,d", displayedPrice)} ₽",
                        color = Color.White,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                }

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
                        text = if (isSpinning) "ШТАМПОВКА..." else "КРУТИТЬ • ${state.spinCost} ₽",
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            // Нижний док
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
