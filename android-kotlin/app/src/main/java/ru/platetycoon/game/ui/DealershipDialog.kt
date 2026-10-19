package ru.platetycoon.game.ui

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
                text = "${car.power} л.с. • 0-100: ${car.zeroHundred} • ${car.engine}",
                color = Color(0xFF94A3B8),
                fontSize = 11.sp
            )
        }

        Text(
            text = "${String.format("%,d", car.price)} ₽",
            color = Color(0xFFF59E0B),
            fontSize = 14.sp,
            fontWeight = FontWeight.Black,
            fontFamily = FontFamily.Monospace
        )
    }
}
