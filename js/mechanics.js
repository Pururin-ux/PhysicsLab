/**
 * PHYSICS.LAB — Глава 02: Равномерное прямолинейное движение
 * Визуализация на p5.js: анимация точки + графики x(t) и v(t)
 * 
 * Совместим с mechanics.html (встроенный квиз-движок в HTML).
 * Этот файл отвечает ТОЛЬКО за визуализацию.
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // СОСТОЯНИЕ
    // ═══════════════════════════════════════════════════════════
    let currentVelocity = 5;
    let startX = 0;
    let isResetting = false;
    let isPaused = false;

    // ═══════════════════════════════════════════════════════════
    // ПУБЛИЧНЫЙ API (вызывается из HTML)
    // ═══════════════════════════════════════════════════════════
    window.setScenario = function (mode) {
        isResetting = true;
        startX = 0;

        switch (mode) {
            case 'forward':  currentVelocity = 5;  break;
            case 'still':    currentVelocity = 0;  break;
            case 'backward': currentVelocity = -5; break;
            default:         currentVelocity = 5;
        }
    };

    window.togglePause = function () {
        isPaused = !isPaused;
        const btn = document.getElementById('btn-pause');
        if (btn) {
            btn.textContent = isPaused ? '▶ ПРОДОЛЖИТЬ' : '⏸ ПАУЗА';
        }
    };

    // ═══════════════════════════════════════════════════════════
    // P5.JS SKETCH
    // ═══════════════════════════════════════════════════════════
    const sketch = function (p) {
        let t = 0;
        let pathX = [];   // точки графика x(t)
        let w, h;
        let motionH, graphH;

        // Масштабы
        const TIME_SCALE = 30;    // пикселей на секунду
        const POS_SCALE = 4;     // пикселей на метр (анимация)
        const GRAPH_POS_SCALE = 2; // пикселей на метр (график)
        const MAX_TIME = 16;     // секунд до сброса
        const DT = 0.03;         // шаг времени

        // Цвета (согласованы с CSS)
        const COL_BG        = '#111';
        const COL_ACCENT    = '#ffee00';
        const COL_VEL       = '#38bdf8';
        const COL_GRID      = 40;
        const COL_AXIS      = 100;
        const COL_LABEL     = 80;
        const COL_AREA      = [56, 189, 248, 25]; // голубая заливка под v(t)

        // DOM-элементы (безопасный доступ)
        function safeText(id, value) {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        }

        p.setup = function () {
            const container = document.getElementById('canvas-wrapper');
            if (!container) return;

            w = container.offsetWidth;
            h = container.offsetHeight;
            recalcLayout();

            const canvas = p.createCanvas(w, h);
            canvas.parent('canvas-wrapper');
            p.textFont('JetBrains Mono');
        };

        p.windowResized = function () {
            const container = document.getElementById('canvas-wrapper');
            if (!container) return;

            w = container.offsetWidth;
            h = container.offsetHeight;
            recalcLayout();
            p.resizeCanvas(w, h);
        };

        function recalcLayout() {
            motionH = h * 0.15;
            graphH = h * 0.85;
        }

        p.draw = function () {
            p.background(COL_BG);

            // Сброс при переключении сценария или превышении времени
            if (isResetting || t > MAX_TIME) {
                t = 0;
                pathX = [];
                isResetting = false;
            }

            // Вычисление текущей координаты
            const currentX = startX + currentVelocity * t;

            // Обновляем live-данные
            safeText('live-x', currentX.toFixed(1));
            safeText('live-t', t.toFixed(1));
            safeText('live-v', currentVelocity.toFixed(1));

            drawMotionStrip(currentX);
            drawGraphs(currentX);

            // Приращение времени
            if (!isPaused) {
                // Записываем точку каждые 2 кадра
                if (p.frameCount % 2 === 0) {
                    pathX.push({ t: t, x: currentX });
                }
                t += DT;
            }
        };

        // ─── Анимация движения точки ───
        function drawMotionStrip(currentX) {
            const centerX = w / 2;
            const stripY = motionH / 2 + 10;

            p.push();

            // Ось
            p.stroke(60);
            p.strokeWeight(1);
            p.line(0, stripY, w, stripY);

            // Деления
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(10);
            p.noStroke();

            for (let i = 0; i < w / 2; i += 40) {
                const val = Math.round(i / POS_SCALE);

                if (val % 10 === 0 && val > 0) {
                    // Правая сторона
                    p.fill(80);
                    p.rect(centerX + i, stripY - 5, 1, 10);
                    p.fill(COL_LABEL);
                    p.text(val, centerX + i, stripY + 8);
                    // Левая сторона
                    p.fill(80);
                    p.rect(centerX - i, stripY - 5, 1, 10);
                    p.fill(COL_LABEL);
                    p.text(-val, centerX - i, stripY + 8);
                } else if (val % 5 === 0) {
                    p.fill(50);
                    p.rect(centerX + i, stripY - 2, 1, 4);
                    if (i > 0) p.rect(centerX - i, stripY - 2, 1, 4);
                }
            }

            // Нулевая метка
            p.fill(COL_LABEL);
            p.text('0', centerX, stripY + 8);

            // Подпись оси
            p.textAlign(p.LEFT, p.CENTER);
            p.fill(60);
            p.textSize(9);
            p.text('x (м)', 8, stripY);

            // Точка
            const pixelPos = centerX + currentX * POS_SCALE;
            if (pixelPos >= -20 && pixelPos <= w + 20) {
                // Тень под точкой
                p.fill(255, 238, 0, 30);
                p.noStroke();
                p.circle(pixelPos, stripY, 28);

                // Точка
                p.fill(COL_ACCENT);
                p.circle(pixelPos, stripY, 14);

                // Вектор скорости
                if (Math.abs(currentVelocity) > 0.1) {
                    const arrowLen = currentVelocity * 6;
                    const arrowY = stripY - 18;

                    p.stroke(COL_VEL);
                    p.strokeWeight(2);
                    p.line(pixelPos, arrowY, pixelPos + arrowLen, arrowY);
                    p.noStroke();
                    p.fill(COL_VEL);

                    const tipDir = currentVelocity > 0 ? 1 : -1;
                    p.triangle(
                        pixelPos + arrowLen, arrowY - 4,
                        pixelPos + arrowLen, arrowY + 4,
                        pixelPos + arrowLen + tipDir * 6, arrowY
                    );

                    // Подпись v
                    p.textAlign(p.CENTER, p.BOTTOM);
                    p.textSize(9);
                    p.fill(COL_VEL);
                    p.text('v⃗', pixelPos + arrowLen / 2, arrowY - 5);
                }
            }

            p.pop();
        }

        // ─── Графики x(t) и v(t) ───
        function drawGraphs(currentX) {
            const marginL = 50;
            const marginR = 20;
            const marginTop = 15;
            const graphW = w - marginL - marginR;
            const halfGraphH = (graphH - 40) / 2; // Пространство для двух графиков
            const graph1CenterY = motionH + marginTop + halfGraphH / 2;
            const graph2CenterY = motionH + marginTop + halfGraphH + 20 + halfGraphH / 2;

            // ── График x(t) ──
            drawSingleGraph({
                originX: marginL,
                originY: graph1CenterY,
                graphW: graphW,
                halfH: halfGraphH / 2,
                labelY: 'x (м)',
                labelX: '',
                color: COL_ACCENT,
                data: pathX,
                getValue: (pt) => pt.x,
                scale: GRAPH_POS_SCALE,
                currentT: t,
                currentVal: currentX,
                showArea: false,
                showCurveArea: true,
                title: 'x(t)'
            });

            // ── Разделитель ──
            p.stroke(40);
            p.strokeWeight(1);
            const sepY = motionH + marginTop + halfGraphH + 10;
            p.line(marginL, sepY, marginL + graphW, sepY);

            // ── График v(t) ──
            drawSingleGraph({
                originX: marginL,
                originY: graph2CenterY,
                graphW: graphW,
                halfH: halfGraphH / 2,
                labelY: 'v (м/с)',
                labelX: 't (с)',
                color: COL_VEL,
                data: pathX,
                getValue: () => currentVelocity, // v = const для РПД
                scale: GRAPH_POS_SCALE * 2,
                currentT: t,
                currentVal: currentVelocity,
                showArea: true,
                title: 'v(t)'
            });
        }

        function drawSingleGraph(cfg) {
            p.push();
            p.translate(cfg.originX, cfg.originY);

            // Сетка
            p.stroke(COL_GRID);
            p.strokeWeight(1);
            p.textSize(9);

            // Горизонтальные линии
            for (let j = 0; j <= cfg.halfH; j += 40) {
                if (j > 0) {
                    p.stroke(COL_GRID);
                    p.line(0, -j, cfg.graphW, -j);
                    p.line(0, j, cfg.graphW, j);
                    p.noStroke();
                    p.fill(COL_LABEL);
                    p.textAlign(p.RIGHT, p.CENTER);
                    const val = Math.round(j / cfg.scale);
                    p.text(val, -5, -j);
                    p.text(-val, -5, j);
                }
            }

            // Вертикальные линии (время)
            for (let i = TIME_SCALE; i < cfg.graphW; i += TIME_SCALE) {
                p.stroke(COL_GRID);
                p.line(i, -cfg.halfH, i, cfg.halfH);
                if (cfg.labelX) {
                    p.noStroke();
                    p.fill(COL_LABEL);
                    p.textAlign(p.CENTER, p.TOP);
                    p.text(Math.round(i / TIME_SCALE), i, cfg.halfH + 4);
                }
            }

            // Оси
            p.stroke(COL_AXIS);
            p.strokeWeight(2);
            p.line(0, -cfg.halfH, 0, cfg.halfH); // Y
            p.line(0, 0, cfg.graphW, 0);          // X

            // Подписи осей
            p.noStroke();
            p.fill(200);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(10);
            p.text(cfg.labelY, 4, -cfg.halfH + 8);
            if (cfg.labelX) {
                p.textAlign(p.RIGHT, p.CENTER);
                p.text(cfg.labelX, cfg.graphW, 14);
            }

            // Название графика
            p.textAlign(p.RIGHT, p.TOP);
            p.fill(cfg.color);
            p.textSize(11);
            p.text(cfg.title, cfg.graphW - 4, -cfg.halfH + 4);

            // Ноль
            p.fill(COL_LABEL);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(9);
            p.text('0', -5, 0);

            // Заливка площади под x(t) (полигон по кривой)
            if (cfg.showCurveArea && cfg.data.length > 1) {
                p.fill(255, 238, 0, 18);
                p.noStroke();
                p.beginShape();
                p.vertex(0, 0);
                for (const pt of cfg.data) {
                    const px = pt.t * TIME_SCALE;
                    const py = -cfg.getValue(pt) * cfg.scale;
                    if (px < cfg.graphW && Math.abs(py) < cfg.halfH) {
                        p.vertex(px, py);
                    }
                }
                const lastPt = cfg.data[cfg.data.length - 1];
                const lastPx = Math.min(lastPt.t * TIME_SCALE, cfg.graphW);
                p.vertex(lastPx, 0);
                p.endShape(p.CLOSE);
            }

            // Заливка площади под v(t) (перемещение)
            if (cfg.showArea && cfg.data.length > 1 && Math.abs(currentVelocity) > 0.01) {
                const valPx = -currentVelocity * cfg.scale;
                const endTPx = Math.min(t * TIME_SCALE, cfg.graphW);

                if (Math.abs(valPx) < cfg.halfH && endTPx > 0) {
                    p.fill(COL_AREA);
                    p.noStroke();
                    p.rect(0, 0, endTPx, valPx);

                    // Подпись площади
                    if (endTPx > 60 && Math.abs(valPx) > 20) {
                        p.fill(255, 255, 255, 60);
                        p.textAlign(p.CENTER, p.CENTER);
                        p.textSize(9);
                        p.text(
                            'S = ' + Math.abs(currentVelocity * t).toFixed(1) + ' м',
                            endTPx / 2,
                            valPx / 2
                        );
                    }
                }
            }

            // Линия графика
            p.noFill();
            p.stroke(cfg.color);
            p.strokeWeight(2);

            if (cfg.showArea) {
                // v(t) — горизонтальная линия
                const valPx = -currentVelocity * cfg.scale;
                const endTPx = Math.min(t * TIME_SCALE, cfg.graphW);
                if (Math.abs(valPx) < cfg.halfH) {
                    p.line(0, valPx, endTPx, valPx);
                }
            } else {
                // x(t) — кривая по точкам
                p.beginShape();
                for (const pt of cfg.data) {
                    const px = pt.t * TIME_SCALE;
                    const py = -cfg.getValue(pt) * cfg.scale;
                    if (px < cfg.graphW && Math.abs(py) < cfg.halfH) {
                        p.vertex(px, py);
                    }
                }
                p.endShape();
            }

            // Текущая точка
            const curTPx = t * TIME_SCALE;
            const curValPx = -cfg.currentVal * cfg.scale;

            if (curTPx < cfg.graphW && Math.abs(curValPx) < cfg.halfH) {
                // Пунктирные проекции
                p.stroke(60);
                p.strokeWeight(1);
                p.drawingContext.setLineDash([4, 4]);
                p.line(curTPx, 0, curTPx, curValPx);
                p.line(0, curValPx, curTPx, curValPx);
                p.drawingContext.setLineDash([]);

                // Точка
                p.fill(cfg.color);
                p.noStroke();
                p.circle(curTPx, curValPx, 7);

                // Подпись значения
                p.textAlign(p.LEFT, p.BOTTOM);
                p.textSize(9);
                p.fill(cfg.color);
                const valLabel = cfg.showArea
                    ? `${currentVelocity.toFixed(1)} м/с`
                    : `${cfg.currentVal.toFixed(1)} м`;
                p.text(valLabel, curTPx + 8, curValPx - 4);
            }

            p.pop();
        }
    };

    // ═══════════════════════════════════════════════════════════
    // ЗАПУСК
    // ═══════════════════════════════════════════════════════════
    const container = document.getElementById('canvas-wrapper');
    if (container) {
        new p5(sketch);
    } else {
        console.warn('PHYSICS.LAB: canvas-wrapper не найден, визуализация отключена.');
    }

})();