import { Card } from "../ui/Card";

interface ForceModelProps {
  variant: "resultant" | "lift";
  title: string;
  caption: string;
}

export function ForceModel({ variant, title, caption }: ForceModelProps) {
  const markerId = `force-arrow-${variant}`;

  return (
    <Card className="overflow-hidden p-0">
      <figure className="flex flex-col gap-3 p-4 md:p-5">
        <figcaption className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            Модель сил
          </span>
          <span className="text-xl font-bold text-white">{title}</span>
          <span className="text-[13px] font-normal leading-[1.6] text-white/60">
            {caption}
          </span>
        </figcaption>

        <div className="rounded-option border border-white/[.07] bg-space-950/60 p-2">
          <svg
            viewBox="0 0 420 230"
            role="img"
            aria-label={`${title}. ${caption}`}
            className="h-auto w-full"
          >
            <defs>
              <marker
                id={`${markerId}-cyan`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#00E0FF" />
              </marker>
              <marker
                id={`${markerId}-gold`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFC857" />
              </marker>
            </defs>

            {variant === "resultant" ? (
              <>
                <line x1="40" x2="380" y1="184" y2="184" className="stroke-white/20" />
                <line x1="55" x2="365" y1="197" y2="197" className="stroke-white/[.06]" />

                <rect
                  x="139"
                  y="102"
                  width="142"
                  height="80"
                  rx="6"
                  className="fill-space-800 stroke-white/20"
                  strokeWidth="2"
                />
                <circle cx="174" cy="184" r="9" className="fill-space-950 stroke-white/30" />
                <circle cx="246" cy="184" r="9" className="fill-space-950 stroke-white/30" />
                <text x="210" y="147" textAnchor="middle" className="fill-white text-[18px] font-bold">
                  m
                </text>

                <g className="text-nova-gold">
                  <line
                    x1="139"
                    x2="58"
                    y1="132"
                    y2="132"
                    className="stroke-current"
                    strokeWidth="4"
                    markerEnd={`url(#${markerId}-gold)`}
                  />
                  <text x="82" y="118" textAnchor="middle" className="fill-current text-[14px] font-bold">
                    F₁
                  </text>
                </g>

                <g className="text-nova-cyan">
                  <line
                    x1="281"
                    x2="366"
                    y1="132"
                    y2="132"
                    className="stroke-current"
                    strokeWidth="4"
                    markerEnd={`url(#${markerId}-cyan)`}
                  />
                  <text x="340" y="118" textAnchor="middle" className="fill-current text-[14px] font-bold">
                    F₂
                  </text>
                </g>

                <g className="text-nova-cyan">
                  <line
                    x1="177"
                    x2="286"
                    y1="67"
                    y2="67"
                    className="stroke-current"
                    strokeWidth="2.5"
                    strokeDasharray="7 6"
                    markerEnd={`url(#${markerId}-cyan)`}
                  />
                  <text x="230" y="49" textAnchor="middle" className="fill-current text-[13px] font-bold">
                    a
                  </text>
                </g>
              </>
            ) : (
              <>
                <rect
                  x="94"
                  y="23"
                  width="232"
                  height="184"
                  rx="8"
                  className="fill-space-950/30 stroke-white/15"
                  strokeWidth="2"
                />
                <line x1="116" x2="116" y1="23" y2="207" className="stroke-white/10" />
                <line x1="304" x2="304" y1="23" y2="207" className="stroke-white/10" />
                <rect
                  x="133"
                  y="65"
                  width="154"
                  height="124"
                  rx="6"
                  className="fill-space-800 stroke-white/20"
                  strokeWidth="2"
                />
                <line x1="133" x2="287" y1="165" y2="165" className="stroke-white/25" />
                <rect
                  x="184"
                  y="123"
                  width="52"
                  height="41"
                  rx="5"
                  className="fill-space-900 stroke-white/25"
                  strokeWidth="2"
                />
                <text x="210" y="149" textAnchor="middle" className="fill-white text-[15px] font-bold">
                  m
                </text>

                <g className="text-nova-cyan">
                  <line
                    x1="210"
                    x2="210"
                    y1="123"
                    y2="74"
                    className="stroke-current"
                    strokeWidth="4"
                    markerEnd={`url(#${markerId}-cyan)`}
                  />
                  <text x="229" y="91" className="fill-current text-[14px] font-bold">
                    N
                  </text>
                </g>

                <g className="text-nova-gold">
                  <line
                    x1="210"
                    x2="210"
                    y1="164"
                    y2="211"
                    className="stroke-current"
                    strokeWidth="4"
                    markerEnd={`url(#${markerId}-gold)`}
                  />
                  <text x="229" y="202" className="fill-current text-[14px] font-bold">
                    mg
                  </text>
                </g>

                <g className="text-nova-cyan">
                  <line
                    x1="350"
                    x2="350"
                    y1="160"
                    y2="61"
                    className="stroke-current"
                    strokeWidth="2.5"
                    strokeDasharray="7 6"
                    markerEnd={`url(#${markerId}-cyan)`}
                  />
                  <text x="367" y="115" className="fill-current text-[13px] font-bold">
                    a
                  </text>
                </g>
              </>
            )}
          </svg>
        </div>
      </figure>
    </Card>
  );
}
