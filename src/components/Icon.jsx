const paths = {
  arrow: 'M7 17 17 7M7 7h10v10',
  chevron: 'm9 5 7 7-7 7',
  download: 'M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4',
  reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
  shuffle: 'm3 4 18 16m-5 0h5v-5M3 20l6-7m6-4 6-5m-5 0h5v5',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  play: 'm8 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14',
  close: 'm6 6 12 12M6 18 18 6',
  info: 'M12 11v6M12 7h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  check: 'm5 12 4 4L19 6',
  sliders: 'M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6M7 14v6'
}

export default function Icon({ name, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  )
}

const curveMark = Array.from({ length: 121 }, (_, index) => {
  const t = (index / 120) * Math.PI * 2
  return `${index ? 'L' : 'M'}${(24 + Math.sin(3 * t + Math.PI / 2) * 19).toFixed(2)},${(24 + Math.sin(2 * t) * 19).toFixed(2)}`
}).join('')

export function CurveMark({ variant = 'lissajous', ...props }) {
  const d =
    variant === 'lsystem'
      ? 'M24 43V28m0 5L12 21m12 5 11-12M12 21V12m0 9H5m30-7V6m0 8h8M24 28V16m0 5-7-7m7 4 6-7'
      : variant === 'rd'
        ? 'M7 10c8-8 12 7 19 0s17-3 15 5-14 0-17 7 13 2 15 10-8 14-16 8 0-13-8-14S-1 20 7 10Zm3 28c-5-7 5-7 7-3s-3 8-7 3Z'
        : curveMark
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  )
}
