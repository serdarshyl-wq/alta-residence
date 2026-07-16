function Logo({ className = '', lettersRef }) {
  return (
    <div className="flex select-none leading-none">
      {'ALTRA'.split('').map((letter, i) => (
        <div key={i} className="overflow-hidden">
          <span
            ref={el => { if (lettersRef) lettersRef.current[i] = el }}
            className={`font-medium uppercase inline-block font-(family-name:--font-heading) text-(--color-text) tracking-[0.02em] ${className}`}
          >
            {letter}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Logo
