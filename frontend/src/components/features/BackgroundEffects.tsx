export function BackgroundEffects() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 opacity-100"
        style={{
          background:
            'linear-gradient(115deg, transparent 0 10%, #e54b2b 10% 14%, transparent 14% 100%), linear-gradient(180deg, transparent 0 78%, #111111 78% 82%, transparent 82% 100%)',
        }}
      />

      <div
        className="pointer-events-none fixed left-0 top-0 h-full w-[18px] bg-black"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed right-[42px] top-[120px] hidden h-40 w-40 border-[6px] border-black bg-[#ffd84d] lg:block"
        style={{ transform: 'rotate(8deg)' }}
        aria-hidden="true"
      />
    </>
  )
}
