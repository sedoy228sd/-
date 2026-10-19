package ru.platetycoon.game.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
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
            Row(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "${plate.letters[0]} ${plate.digits.joinToString("")} ${plate.letters.substring(1)}",
                    color = Color.Black,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black,
                    fontFamily = FontFamily.SansSerif,
                    letterSpacing = 1.sp
                )
            }

            Box(
                modifier = Modifier
                    .width(2.5.dp)
                    .fillMaxHeight(0.9f)
                    .background(Color.Black)
            )

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
