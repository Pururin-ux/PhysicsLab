// PhysicsLab — процедурный генератор фоновых текстур.
//
// Зачем C++: текстуры должны быть детерминированными, бесшовными и крошечными
// по размеру файла, а собираться без npm-зависимостей. Программа пишет PNG
// напрямую (свой deflate-stored энкодер), поэтому нужны только стандартная
// библиотека и компилятор.
//
// Сборка и запись ассетов:
//   g++ -std=c++17 -O2 -Wall -Wextra -o lab-textures lab_textures.cpp
//   ./lab-textures ../../../apps/web/public/art/textures
//
// Выходные файлы (tiles, повторяются через background-repeat):
//   lab-grid.png   — лабораторная сетка: тонкие линии + узел-точка
//   lab-noise.png  — мягкое бесшовное зерно для «бумажного» светá фона

#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

namespace {

// ---------- Минимальный PNG-писатель (deflate stored blocks) ----------

uint32_t Crc32(const uint8_t* data, size_t size) {
  static uint32_t table[256];
  static bool ready = false;
  if (!ready) {
    for (uint32_t n = 0; n < 256; ++n) {
      uint32_t c = n;
      for (int k = 0; k < 8; ++k) c = (c & 1) ? 0xEDB88320u ^ (c >> 1) : c >> 1;
      table[n] = c;
    }
    ready = true;
  }
  uint32_t c = 0xFFFFFFFFu;
  for (size_t i = 0; i < size; ++i) c = table[(c ^ data[i]) & 0xFF] ^ (c >> 8);
  return c ^ 0xFFFFFFFFu;
}

uint32_t Adler32(const uint8_t* data, size_t size) {
  uint32_t a = 1, b = 0;
  for (size_t i = 0; i < size; ++i) {
    a = (a + data[i]) % 65521;
    b = (b + a) % 65521;
  }
  return (b << 16) | a;
}

void AppendChunk(std::vector<uint8_t>& out, const char* type,
                 const std::vector<uint8_t>& payload) {
  const uint32_t size = static_cast<uint32_t>(payload.size());
  for (int shift = 24; shift >= 0; shift -= 8)
    out.push_back(static_cast<uint8_t>((size >> shift) & 0xFF));
  std::vector<uint8_t> body;
  for (int i = 0; i < 4; ++i) body.push_back(static_cast<uint8_t>(type[i]));
  body.insert(body.end(), payload.begin(), payload.end());
  const uint32_t crc = Crc32(body.data(), body.size());
  out.insert(out.end(), body.begin(), body.end());
  for (int shift = 24; shift >= 0; shift -= 8)
    out.push_back(static_cast<uint8_t>((crc >> shift) & 0xFF));
}

// Запись валидного PNG. Сжатие: deflate stored blocks (без сжатия, зато
// без зависимостей). Поддержаны два формата: RGBA (8/4/4/4) и gray+alpha
// (8/1) — второй вдвое меньше по размеру файла и используется для плиток.
bool WritePng(const std::string& path, int width, int height,
              const std::vector<uint8_t>& pixels, bool gray_alpha) {
  const int bytes_per_pixel = gray_alpha ? 2 : 4;
  const int color_type = gray_alpha ? 4 : 6;
  if (width <= 0 || height <= 0 ||
      pixels.size() != static_cast<size_t>(width) * height * bytes_per_pixel) {
    std::fprintf(stderr, "bad image params: %s\n", path.c_str());
    return false;
  }
  const std::vector<uint8_t>& rgba = pixels;

  // Raw-поток: каждый ряд начинается с filter byte 0 (None).
  std::vector<uint8_t> raw;
  raw.reserve(static_cast<size_t>(height) * (width * bytes_per_pixel + 1));
  for (int y = 0; y < height; ++y) {
    raw.push_back(0);
    raw.insert(raw.end(),
               rgba.begin() + static_cast<size_t>(y) * width * bytes_per_pixel,
               rgba.begin() + static_cast<size_t>(y + 1) * width * bytes_per_pixel);
  }

  // zlib wrapper + stored deflate blocks (максимум 65535 байт на блок).
  std::vector<uint8_t> compressed;
  compressed.push_back(0x78);
  compressed.push_back(0x01);
  size_t offset = 0;
  while (offset < raw.size()) {
    const size_t take = (raw.size() - offset > 65535) ? 65535 : raw.size() - offset;
    const bool final_block = (offset + take == raw.size());
    compressed.push_back(final_block ? 1 : 0);
    compressed.push_back(static_cast<uint8_t>(take & 0xFF));
    compressed.push_back(static_cast<uint8_t>((take >> 8) & 0xFF));
    const uint16_t nlen = static_cast<uint16_t>(~take);
    compressed.push_back(static_cast<uint8_t>(nlen & 0xFF));
    compressed.push_back(static_cast<uint8_t>((nlen >> 8) & 0xFF));
    compressed.insert(compressed.end(), raw.begin() + offset,
                      raw.begin() + offset + take);
    offset += take;
  }
  const uint32_t adler = Adler32(raw.data(), raw.size());
  for (int shift = 24; shift >= 0; shift -= 8)
    compressed.push_back(static_cast<uint8_t>((adler >> shift) & 0xFF));

  std::vector<uint8_t> png{0x89, 'P', 'N', 'G', '\r', '\n', 0x1A, '\n'};

  std::vector<uint8_t> ihdr;
  for (int shift = 24; shift >= 0; shift -= 8)
    ihdr.push_back(static_cast<uint8_t>((width >> shift) & 0xFF));
  for (int shift = 24; shift >= 0; shift -= 8)
    ihdr.push_back(static_cast<uint8_t>((height >> shift) & 0xFF));
  ihdr.push_back(8);  // bit depth
  ihdr.push_back(static_cast<uint8_t>(color_type));
  ihdr.push_back(0);  // compression
  ihdr.push_back(0);  // filter
  ihdr.push_back(0);  // interlace
  AppendChunk(png, "IHDR", ihdr);
  AppendChunk(png, "IDAT", compressed);
  AppendChunk(png, "IEND", {});

  FILE* file = std::fopen(path.c_str(), "wb");
  if (!file) {
    std::fprintf(stderr, "cannot write: %s\n", path.c_str());
    return false;
  }
  const bool ok = std::fwrite(png.data(), 1, png.size(), file) == png.size();
  std::fclose(file);
  if (!ok) std::fprintf(stderr, "short write: %s\n", path.c_str());
  return ok;
}

// ---------- Детерминированный шум ----------

uint32_t Hash2D(uint32_t x, uint32_t y, uint32_t seed) {
  uint32_t h = x * 374761393u + y * 668265263u + seed * 2246822519u;
  h = (h ^ (h >> 13)) * 1274126177u;
  return h ^ (h >> 16);
}

float NormalizedHash(uint32_t x, uint32_t y, uint32_t seed) {
  return static_cast<float>(Hash2D(x, y, seed) & 0xFFFFFF) / 16777215.0f;
}

// Целочисленный value-noise с билинейной интерполяцией; периодичность по
// обоим осям делает текстуру бесшовной при повторе.
float SeamlessValueNoise(float x, float y, int period, uint32_t seed) {
  const int xi = static_cast<int>(x);
  const int yi = static_cast<int>(y);
  const float xf = x - xi;
  const float yf = y - yi;
  const auto wrap = [period](int v) { return (v % period + period) % period; };
  const float smooth_x = xf * xf * (3 - 2 * xf);
  const float smooth_y = yf * yf * (3 - 2 * yf);
  const float top_left = NormalizedHash(wrap(xi), wrap(yi), seed);
  const float top_right = NormalizedHash(wrap(xi + 1), wrap(yi), seed);
  const float bottom_left = NormalizedHash(wrap(xi), wrap(yi + 1), seed);
  const float bottom_right = NormalizedHash(wrap(xi + 1), wrap(yi + 1), seed);
  const float top = top_left + (top_right - top_left) * smooth_x;
  const float bottom = bottom_left + (bottom_right - bottom_left) * smooth_x;
  return top + (bottom - top) * smooth_y;
}

uint8_t ClampByte(float value) {
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return static_cast<uint8_t>(value + 0.5f);
}

// ---------- Текстуры ----------

// Сетка лабораторного листа: крупная клетка с точкой-узлом и тонкой линией.
// Цвет фиксированный (тёплый светло-бежевый), непрозрачность низкая —
// web-слой дополнительно приглушает и перекрашивает через opacity/blend.
void EmitLabGrid(const std::string& out_dir) {
  constexpr int kSize = 56;  // одна клетка на тайл -> идеально бесшовно
  // Формат gray+alpha: [яркость, альфа] на пиксель.
  std::vector<uint8_t> rgba(static_cast<size_t>(kSize) * kSize * 2, 0);

  for (int y = 0; y < kSize; ++y) {
    for (int x = 0; x < kSize; ++x) {
      uint8_t* pixel = &rgba[(static_cast<size_t>(y) * kSize + x) * 2];
      const bool on_line = x == 0 || y == 0;
      // Узловая точка в центре клетки.
      const int dx = x - kSize / 2;
      const int dy = y - kSize / 2;
      const float node_distance = std::sqrt(static_cast<float>(dx * dx + dy * dy));

      if (node_distance <= 2.2f) {
        pixel[0] = 205;
        pixel[1] = 38;
      } else if (on_line) {
        pixel[0] = 190;
        pixel[1] = 20;
      } else {
        pixel[0] = 190;
        pixel[1] = 0;
      }
    }
  }
  WritePng(out_dir + "/lab-grid.png", kSize, kSize, rgba, true);
}

// Мягкое зерно: два октавы шума, тёплый белый на низкой альфе.
void EmitLabNoise(const std::string& out_dir) {
  constexpr int kSize = 64;
  constexpr int kPeriod = 8;  // клеток шума на тайл -> бесшовно
  std::vector<uint8_t> rgba(static_cast<size_t>(kSize) * kSize * 2, 0); // gray+alpha

  for (int y = 0; y < kSize; ++y) {
    for (int x = 0; x < kSize; ++x) {
      uint8_t* pixel = &rgba[(static_cast<size_t>(y) * kSize + x) * 2];
      const float fx = static_cast<float>(x) / (kSize / kPeriod);
      const float fy = static_cast<float>(y) / (kSize / kPeriod);
      const float coarse = SeamlessValueNoise(fx, fy, kPeriod, 11);
      const float fine = SeamlessValueNoise(fx * 3.0f, fy * 3.0f, kPeriod * 3, 23);
      float v = coarse * 0.65f + fine * 0.35f;      // 0..1
      v = (v - 0.5f) * 2.0f;                         // -1..1
      const float alpha = 8.0f + v * 7.0f;         // мягкий разброс
      pixel[0] = 238;                                // яркость
      pixel[1] = ClampByte(alpha);                   // альфа
    }
  }
  WritePng(out_dir + "/lab-noise.png", kSize, kSize, rgba, true);
}

}  // namespace

int main(int argc, char** argv) {
  if (argc != 2) {
    std::fprintf(stderr, "usage: %s <output-dir>\n", argv[0]);
    return 2;
  }
  const std::string out_dir = argv[1];
  EmitLabGrid(out_dir);
  EmitLabNoise(out_dir);
  std::printf("textures written to %s\n", out_dir.c_str());
  return 0;
}
