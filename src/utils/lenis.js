import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis = null
let ticker = null

export function initLenis() {
  if (lenis) return lenis

  lenis = new Lenis({
    duration: 1.6,
    easing: (t) => 1 - Math.pow(1 - t, 4), // quart-out — long, smooth deceleration
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: false, // native touch feel on mobile, smoothing is a desktop-wheel thing
  })

  lenis.on('scroll', ScrollTrigger.update)

  ticker = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(ticker)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis() {
  return lenis
}

export function destroyLenis() {
  if (ticker) gsap.ticker.remove(ticker)
  lenis?.destroy()
  lenis = null
  ticker = null
}
