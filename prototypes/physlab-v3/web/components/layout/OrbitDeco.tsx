export function OrbitDeco() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Большое кольцо */}
      <div className="
        absolute -top-16 -right-16 w-80 h-80 rounded-full
        border border-nova-cyan/5
        animate-[spin_70s_linear_infinite]
        before:content-[''] before:absolute before:top-1/2 before:-left-1
        before:w-2 before:h-2 before:rounded-full before:bg-nova-cyan
        before:shadow-cyan-glow
        before:-translate-y-1/2
      " />
      {/* Малое кольцо */}
      <div className="
        absolute -top-4 -right-4 w-48 h-48 rounded-full
        border border-nova-cyan/[0.04]
        animate-[spin_45s_linear_infinite_reverse]
      " />
    </div>
  )
}
