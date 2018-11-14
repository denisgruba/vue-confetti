import { generateWholeNumber } from './utils'

class Particle {
  /**
   * Setup the particle.
   * @param {options} opts
   *   The particle options
   */
  setup ({ ctx, W, H, colors, wind, windPosCoef, windSpeedMax, count, shape }) {
    this.ctx = ctx
    this.W = W
    this.H = H
    this.wind = wind
    this.shape = this.selectShape(shape)
    this.windPosCoef = windPosCoef
    this.windSpeedMax = windSpeedMax
    this.x = this.rand(-35, W + 35)
    this.y = this.rand(-30, -35)
    this.d = this.rand(150) + 10 // density
    this.r = this.rand(10, 30)
    this.color = colors.color // get the next color
    this.tilt = this.randI(10)
    this.tiltAngleIncremental = (
      (
        this.rand(0.08) + 0.04
      ) *
      (
        this.rand() < 0.5 ? -1 : 1
      )
    )
    this.tiltAngle = 0
    this.angle = this.rand(Math.PI * 2)
    this.count = count++
    return this
  }

  /**
   * Return a random number.
   * @param {Number} min
   *   The minimum number.
   * @param {Number} max
   *   The maximum number.
   */
  randI (min,
    max = min +
        (
          min = 0
        )) {
    return (
      Math.random() *
      (
        max - min
      ) +
      min
    ) | 0
  }

  /**
   * Return a random number with a minimum of one.
   * @param {Number} min
   *   The minimum number.
   * @param {Number} max
   *   The maximum number.
   */
  rand (min = 1,
    max = min +
       (
         min = 0
       )) {
    return Math.random() *
      (
        max - min
      ) +
      min
  }

  /**
   * Update the particle.
   */
  update () {
    this.tiltAngle += (
      this.tiltAngleIncremental * (
        Math.cos(this.wind +
                   (
                     this.d + this.x + this.y
                   ) *
                   this.windPosCoef) *
        0.2 + 1
      )
    )
    this.y += (
      Math.cos(this.angle + this.d) + 3 + this.r / 2
    ) / 2
    this.x += Math.sin(this.angle)
    this.x += Math.cos(
      this.wind +
      (
        this.d + this.x + this.y
      ) *
      this.windPosCoef
    ) * this.windSpeedMax
    this.y += Math.sin(
      this.wind +
      (
        this.d + this.x + this.y
      ) *
      this.windPosCoef
    ) * this.windSpeedMax
    this.tilt = (
      Math.sin(this.tiltAngle -
                 (
                   this.count / 3
                 ))
    ) * 15
    return this.y > this.H // returns true if particle is past bottom
  }

  /**
   * Draw a round particle.
   */
  drawCircle () {
    this.ctx.arc(0, 0, (
      this.r / 2
    ), 0, Math.PI * 2, false)
    this.ctx.fill()
  }

  /**
   * Draw a rectangular particle.
   */
  drawRect () {
    this.ctx.fillRect(0, 0, this.r, this.r / 2)
  }

  /**
   * Draw a heart-shaped particle.
   */
  drawHeart () {
    const curveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
      this.ctx.bezierCurveTo(
        cp1x / this.r * 2,
        cp1y / this.r * 2,
        cp2x / this.r * 2,
        cp2y / this.r * 2,
        x / this.r * 2,
        y / this.r * 2
      )
    }
    this.ctx.moveTo(37.5 / this.r, 20 / this.r)
    curveTo(75, 37, 70, 25, 50, 25)
    curveTo(20, 25, 20, 62.5, 20, 62.5)
    curveTo(20, 80, 40, 102, 75, 120)
    curveTo(110, 102, 130, 80, 130, 62.5)
    curveTo(130, 62.5, 130, 25, 100, 25)
    curveTo(85, 25, 75, 37, 75, 40)
    this.ctx.fill()
  }

  // M428.127,0
  // l-12.716,10.062
  // l12.718-10.06
  // c8.785,11.101,19.716,24.917,19.716,51.051
  // s-10.932,39.951-19.716,51.053
  // c-7.382,9.331-12.716,16.072-12.716,30.927
  // c0,14.854,5.334,21.594,12.716,30.925
  // c8.784,11.101,19.716,24.917,19.716,51.05
  // c0,26.135-10.931,39.949-19.715,51.051
  // c-7.383,9.331-12.717,16.072-12.717,30.927
  // c0,14.855,5.332,21.593,12.711,30.919
  // l-25.435,20.124
  // c-8.781-11.097-19.708-24.909-19.708-51.042
  // c0-26.135,10.931-39.949,19.715-51.051
  // c7.383-9.331,12.717-16.072,12.717-30.927
  // c0-14.855-5.335-21.595-12.717-30.926
  // c-8.784-11.101-19.715-24.916-19.715-51.049
  // s10.931-39.95,19.715-51.051
  // c7.383-9.331,12.717-16.072,12.717-30.928
  // c0-14.855-5.335-21.596-12.718-30.927
  // L428.127,0z
  /**
   * Draw a squiggle-shaped particle.
   */
  drawSquiggle () {
    const curveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
      this.ctx.bezierCurveTo(
        cp1x / this.r,
        cp1y / this.r,
        cp2x / this.r,
        cp2y / this.r,
        x / this.r,
        y / this.r
      )
    }
    const lineTo = (x, y) => {
      this.ctx.lineTo(
        x / this.r,
        y / this.r
      )
    }
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = 8
    this.ctx.moveTo(50 / this.r, 0 / this.r)
    lineTo(37, 10)
    lineTo(50, 0)
    curveTo(58, 11, 69, 24, 69, 51)
    // curveTo(0, 32, 58, 91, 50, 102)
    curveTo(42, 111, 37, 118, 37, 133)
    curveTo(37, 147, 42, 154, 50, 163)
    curveTo(58, 175, 69, 188, 69, 215)
    curveTo(69, 241, 58, 254, 50, 266)
    curveTo(42, 275, 37, 282, 37, 296)
    curveTo(37, 311, 42, 318, 50, 327)
    lineTo(24, 348)
    curveTo(15, 336, 4, 323, 4, 296)
    curveTo(4, 270, 15, 257, 24, 245)
    curveTo(32, 236, 37, 229, 37, 215)
    curveTo(37, 200, 32, 193, 24, 184)
    curveTo(15, 172, 4, 159, 4, 133)
    // curveTo(0, -32, 15, 93, 24, 81)
    curveTo(32, 72, 37, 65, 37, 51)
    curveTo(37, 36, 32, 29, 24, 20)
    lineTo(50, 0)
    this.ctx.fill()
    // lineTo(-25.435, 20.124)
    // curveTo(-8.781, -11.097, -19.708, -24.909, -19.708, -51.042)
    // curveTo(0, -26.135, 10.931, -39.949, 19.715, -51.051)
    // curveTo(7.383, -9.331, 12.717, -16.072, 12.717, -30.927)
    // curveTo(0, -14.855, -5.335, -21.595, -12.717, -30.926)
    // curveTo(-8.784, -11.101, -19.715, -24.916, -19.715, -51.049)
    // curveTo(7.383, -9.331, 12.717, -16.072, 12.717, -30.928)
    // curveTo(0, -14.855, -5.335, -21.596, -12.718, -30.927)

    // M50,0
    // L37,10
    // L50,0
    // C58,11,69,24,69,51
    // S58,91,50,102
    // C42,111,37,118,37,133
    // C37,147,42,154,50,163
    // C58,175,69,188,69,215
    // C69,241,58,254,50,266
    // C42,275,37,282,37,296
    // C37,311,42,318,50,327
    // L24,348
    // C15,336,4,323,4,296
    // C4,270,15,257,24,245
    // C32,236,37,229,37,215
    // C37,200,32,193,24,184
    // C15,172,4,159,4,133
    // S15,93,24,81
    // C32,72,37,65,37,51
    // C37,36,32,29,24,20
    // L50,0Z

    // this.ctx.stroke()
  }

  /**
   * Draw a particle.
   */
  draw () {
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.setTransform(
      Math.cos(this.tiltAngle), // set the x axis to the tilt angle
      Math.sin(this.tiltAngle),
      0, 1,
      this.x, this.y // set the origin
    )
    switch (this.shape) {
      case 'circle':
        this.drawCircle()
        break
      case 'rect':
        this.drawRect()
        break
      case 'heart':
        this.drawHeart()
        break
      case 'squiggle':
        this.drawSquiggle()
        break
      default:
        break
    }
  }

  /**
   * Returns a shape based on config if array is provided.
   * @param shapes
   * @returns {*|string}
   */
  selectShape (shapes) {
    let shape = shapes || 'circle'
    if (Array.isArray(shapes)) {
      shape = shapes[generateWholeNumber(0, shapes.length)]
    }
    return shape
  }
}

export default Particle
