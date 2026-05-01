function Logo({ className = '', lettersRef }) {
  return (
    <div className="flex select-none leading-none">
      {'ALTRA'.split('').map((letter, i) => (
        <div key={i} style={{ overflow: 'hidden' }}>
          <span
            ref={el => { if (lettersRef) lettersRef.current[i] = el }}
            className={`font-medium uppercase inline-block ${className}`}
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', letterSpacing: '0.02em' }}
          >
            {letter}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Logo
