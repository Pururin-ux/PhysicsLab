from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"C:/Users/lalad/OneDrive/Desktop/PhysicsChannelOutput/production-sprints/2026-06-08")
SRC = ROOT / "minus-acceleration-visual-layer-v0.png"
OUT = ROOT / "minus-acceleration-composite-v0.png"

W, H = 1080, 1350

FONT_DIR = Path(r"C:/Windows/Fonts")
FONT_BOLD = FONT_DIR / "arialbd.ttf"
FONT_REG = FONT_DIR / "arial.ttf"
FONT_HAND = FONT_DIR / "segoepr.ttf"
FONT_HAND_BOLD = FONT_DIR / "segoeprb.ttf"

INK = (31, 31, 29)
BLUE = (44, 78, 158)
RED = (184, 54, 49)
PAPER = (248, 244, 235, 226)
SOFT_BLUE = (221, 228, 244, 215)
SOFT_RED = (244, 223, 219, 215)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def fit_cover(img: Image.Image, width: int, height: int) -> Image.Image:
    src_ratio = img.width / img.height
    dst_ratio = width / height
    if src_ratio > dst_ratio:
        new_h = height
        new_w = round(height * src_ratio)
    else:
        new_w = width
        new_h = round(width / src_ratio)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - width) // 2
    top = (new_h - height) // 2
    return resized.crop((left, top, left + width, top + height))


def text(draw: ImageDraw.ImageDraw, xy, body: str, fnt, fill=INK, anchor=None):
    draw.text(xy, body, font=fnt, fill=fill, anchor=anchor)


def line(draw: ImageDraw.ImageDraw, xy, fill=INK, width=4):
    draw.line(xy, fill=fill, width=width)


def arrow(draw: ImageDraw.ImageDraw, start, end, fill=INK, width=5):
    import math

    draw.line([start, end], fill=fill, width=width)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    size = 18
    left = (
        end[0] - size * math.cos(angle - math.pi / 6),
        end[1] - size * math.sin(angle - math.pi / 6),
    )
    right = (
        end[0] - size * math.cos(angle + math.pi / 6),
        end[1] - size * math.sin(angle + math.pi / 6),
    )
    draw.polygon([end, left, right], fill=fill)


def panel(draw: ImageDraw.ImageDraw, box, fill=PAPER):
    draw.rounded_rectangle(box, radius=12, fill=fill, outline=(37, 34, 31), width=3)


def bullet(draw: ImageDraw.ImageDraw, x, y, color=BLUE):
    draw.ellipse((x, y, x + 14, y + 14), fill=color)


def render():
    bg = fit_cover(Image.open(SRC).convert("RGB"), W, H).convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    title_f = font(FONT_BOLD, 72)
    subtitle_f = font(FONT_HAND_BOLD, 36)
    h_f = font(FONT_BOLD, 40)
    body_f = font(FONT_REG, 31)
    body_bold_f = font(FONT_BOLD, 31)
    hand_f = font(FONT_HAND, 32)
    formula_f = font(FONT_BOLD, 42)
    small_f = font(FONT_REG, 25)

    # Title patch
    draw.rounded_rectangle((78, 82, 720, 226), radius=18, fill=(248, 244, 235, 235))
    text(draw, (108, 102), "Минус не виноват", title_f, INK)
    line(draw, (112, 181, 650, 181), BLUE, 7)
    text(draw, (112, 188), "сначала подпиши ось", subtitle_f, BLUE)

    # Panel 1 content
    panel(draw, (74, 304, 640, 602), fill=(250, 247, 240, 218))
    draw.rounded_rectangle((98, 328, 520, 379), radius=12, fill=SOFT_BLUE)
    text(draw, (114, 331), "1. Знак = направление", h_f, INK)
    bullet(draw, 112, 418, BLUE)
    text(draw, (140, 407), "ось вправо → вправо плюс", body_f, INK)
    bullet(draw, 112, 470, RED)
    text(draw, (140, 459), "aₓ < 0 → ускорение влево", body_bold_f, INK)
    arrow(draw, (222, 540), (510, 540), fill=INK, width=4)
    text(draw, (520, 525), "x", small_f, INK)
    arrow(draw, (245, 510), (435, 510), fill=BLUE, width=6)
    text(draw, (448, 491), "+", body_bold_f, BLUE)
    arrow(draw, (430, 568), (260, 568), fill=RED, width=6)
    text(draw, (235, 547), "aₓ < 0", small_f, RED)

    # Panel 2 content
    panel(draw, (74, 646, 640, 958), fill=(250, 247, 240, 218))
    draw.rounded_rectangle((98, 670, 410, 721), radius=12, fill=SOFT_RED)
    text(draw, (114, 673), "2. Смотри v и a", h_f, INK)
    bullet(draw, 112, 766, BLUE)
    text(draw, (140, 750), "в одну сторону", body_bold_f, INK)
    text(draw, (140, 792), "скорость растёт", body_f, INK)
    arrow(draw, (420, 770), (560, 770), fill=BLUE, width=6)
    arrow(draw, (420, 802), (550, 802), fill=RED, width=6)
    text(draw, (572, 748), "v", small_f, BLUE)
    text(draw, (562, 785), "a", small_f, RED)
    bullet(draw, 112, 872, RED)
    text(draw, (140, 856), "в разные стороны", body_bold_f, INK)
    text(draw, (140, 898), "скорость падает", body_f, INK)
    arrow(draw, (420, 882), (560, 882), fill=BLUE, width=6)
    arrow(draw, (560, 914), (425, 914), fill=RED, width=6)

    # Bottom note/formula
    draw.rounded_rectangle((100, 1072, 702, 1258), radius=14, fill=(248, 244, 235, 232))
    text(draw, (128, 1092), "Запомни:", hand_f, BLUE)
    text(draw, (128, 1144), "по оси: v = v0 + a·t", formula_f, INK)
    line(draw, (128, 1200, 438, 1200), RED, 5)
    text(draw, (128, 1212), "минус ≠ всегда торможение", body_f, INK)

    # Small caption patch near character
    draw.rounded_rectangle((748, 1110, 1034, 1236), radius=14, fill=(248, 244, 235, 225))
    text(draw, (772, 1132), "проверка:", hand_f, BLUE)
    text(draw, (772, 1182), "сначала ось,", small_f, INK)
    text(draw, (772, 1210), "потом формула", small_f, INK)

    final = Image.alpha_composite(bg, overlay).convert("RGB")
    final.save(OUT, quality=96)
    print(OUT)


if __name__ == "__main__":
    render()
