<template>
	<view class="coin-chart">
		<canvas
			id="coinChart"
			canvas-id="coinChart"
			class="coin-chart__canvas"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
		/>
		<view
			v-if="dotVisible"
			class="coin-chart__dot"
			:style="{ left: dotLeft + 'px', top: dotTop + 'px' }"
		>
			<view class="coin-chart__halo" />
			<view class="coin-chart__core" />
			<view class="coin-chart__hole" />
		</view>
	</view>
</template>

<script>
const PAD_LEFT = 44
const PAD_RIGHT = 24
const PAD_TOP = 10
const PAD_BOTTOM = 26
const GRID_EXTRA = 15

function niceStep(raw) {
	const value = Math.max(raw, 0.0001)
	const power = Math.pow(10, Math.floor(Math.log10(value)))
	const unit = value / power
	const nice = [1, 2, 2.5, 3, 4, 5, 6, 8, 10].find((item) => item >= unit) || 10
	return nice * power
}

export default {
	name: 'coin-chart',
	props: {
		points: {
			type: Array,
			default: () => []
		},
		xLabels: {
			type: Array,
			default: () => []
		},
		height: {
			type: Number,
			default: 500
		}
	},
	data() {
		return {
			canvasWidth: 0,
			canvasHeight: 0,
			dotLeft: 0,
			dotTop: 0,
			dotVisible: false
		}
	},
	watch: {
		points() {
			this.redraw()
		},
		xLabels() {
			this.redraw()
		}
	},
	mounted() {
		const system = uni.getSystemInfoSync()
		this.canvasWidth = Math.round(system.windowWidth - (system.windowWidth * 64) / 750)
		this.canvasHeight = Math.round((this.height / 750) * system.windowWidth)
		this.$nextTick(() => {
			uni.createSelectorQuery()
				.in(this)
				.select('.coin-chart')
				.boundingClientRect((rect) => {
					if (rect && rect.width) this.canvasWidth = Math.round(rect.width)
					this.redraw()
				})
				.exec()
		})
	},
	beforeDestroy() {
		clearTimeout(this._timer)
	},
	methods: {
		redraw() {
			clearTimeout(this._timer)
			this._timer = setTimeout(() => this.draw(), 60)
		},
		draw() {
			const width = this.canvasWidth
			const height = this.canvasHeight
			if (!width || !height) return
			const ctx = uni.createCanvasContext('coinChart', this)
			ctx.clearRect(0, 0, width, height)
			const points = this.points || []
			if (points.length < 2) {
				ctx.draw()
				return
			}
			const plotWidth = width - PAD_LEFT - PAD_RIGHT
			const plotHeight = height - PAD_TOP - PAD_BOTTOM
			const dataMin = Math.min.apply(null, points)
			const dataMax = Math.max.apply(null, points)
			const range = dataMax - dataMin < 0.01 ? 1 : dataMax - dataMin
			let step = niceStep(range / 4)
			let bottom = Math.floor(dataMin / step) * step
			let guard = 0
			while (bottom + step * 4 < dataMax && guard < 20) {
				step = niceStep(step * 1.01)
				bottom = Math.floor(dataMin / step) * step
				guard += 1
			}
			const top = bottom + step * 4
			const ticks = [0, 1, 2, 3, 4].map((index) => bottom + step * index)
			const decimals = Number.isInteger(step) ? 0 : 1
			const xOf = (index) => PAD_LEFT + (index / (points.length - 1)) * plotWidth
			const yOf = (value) => PAD_TOP + ((top - value) / (top - bottom)) * plotHeight
			const tickText = (value) => value.toFixed(decimals)

			ctx.setLineWidth(1)
			ctx.setStrokeStyle('#F5EFE5')
			ctx.setLineDash([4, 3], 0)
			ticks.forEach((value) => {
				const y = yOf(value)
				ctx.beginPath()
				ctx.moveTo(PAD_LEFT, y)
				ctx.lineTo(PAD_LEFT + plotWidth + GRID_EXTRA, y)
				ctx.stroke()
			})
			ctx.setLineDash([0, 0], 0)

			ctx.setFontSize(12)
			ctx.setFillStyle('#111111')
			ctx.setTextAlign('right')
			ticks.forEach((value) => {
				ctx.fillText(tickText(value), PAD_LEFT - 8, yOf(value) + 4)
			})

			const area = ctx.createLinearGradient(0, PAD_TOP, 0, PAD_TOP + plotHeight)
			area.addColorStop(0, 'rgba(255, 64, 86, 0.18)')
			area.addColorStop(1, 'rgba(255, 64, 86, 0.02)')
			ctx.beginPath()
			ctx.moveTo(xOf(0), yOf(points[0]))
			for (let index = 1; index < points.length; index++) {
				ctx.lineTo(xOf(index), yOf(points[index]))
			}
			ctx.lineTo(xOf(points.length - 1), PAD_TOP + plotHeight)
			ctx.lineTo(xOf(0), PAD_TOP + plotHeight)
			ctx.closePath()
			ctx.setFillStyle(area)
			ctx.fill()

			const endY = yOf(points[points.length - 1])
			ctx.beginPath()
			ctx.moveTo(PAD_LEFT, endY)
			ctx.lineTo(PAD_LEFT + plotWidth + GRID_EXTRA, endY)
			ctx.setStrokeStyle('#FFB9C2')
			ctx.setLineWidth(1)
			ctx.setLineDash([5, 3.5], 0)
			ctx.stroke()
			ctx.setLineDash([0, 0], 0)

			ctx.beginPath()
			ctx.moveTo(xOf(0), yOf(points[0]))
			for (let index = 1; index < points.length; index++) {
				ctx.lineTo(xOf(index), yOf(points[index]))
			}
			ctx.setStrokeStyle('#FF4056')
			ctx.setLineWidth(2)
			ctx.setLineJoin('round')
			ctx.setLineCap('round')
			ctx.stroke()

			const endX = xOf(points.length - 1)
			this.dotLeft = endX
			this.dotTop = endY
			this.dotVisible = true

			const labels = this.xLabels || []
			ctx.setFontSize(12)
			ctx.setFillStyle('#111111')
			labels.forEach((label, index) => {
				const ratio = labels.length > 1 ? index / (labels.length - 1) : 0
				const isLast = index === labels.length - 1
				const x = PAD_LEFT + ratio * plotWidth + (isLast ? GRID_EXTRA : 0)
				let align = 'center'
				if (index === 0) align = 'left'
				if (isLast) align = 'right'
				ctx.setTextAlign(align)
				ctx.fillText(label, x, height - 6)
			})

			ctx.draw()
		}
	}
}
</script>

<style lang="scss" scoped>
.coin-chart {
	position: relative;
	width: 100%;

	&__canvas {
		display: block;
	}

	&__dot {
		position: absolute;
		width: 8px;
		height: 8px;
		margin-left: -4px;
		margin-top: -4px;
		pointer-events: none;
	}

	&__halo {
		position: absolute;
		left: 0;
		top: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #FF4056;
		opacity: 0;
		transform: scale(0.06);
		animation: coin-dot-halo 1.1s ease-in-out infinite;
	}

	&__core {
		position: absolute;
		left: 0;
		top: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #FF4056;
	}

	&__hole {
		position: absolute;
		left: 2px;
		top: 2px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #FEC4CB;
		opacity: 0;
		transform: scale(0);
		animation: coin-dot-hole 1.1s ease-in-out infinite;
	}
}

@keyframes coin-dot-halo {
	0% {
		transform: scale(0.06);
		opacity: 0;
	}

	50% {
		transform: scale(1.7);
		opacity: 0.36;
	}

	100% {
		transform: scale(0.06);
		opacity: 0;
	}
}

@keyframes coin-dot-hole {
	0% {
		transform: scale(0);
		opacity: 0;
	}

	50% {
		transform: scale(1);
		opacity: 1;
	}

	100% {
		transform: scale(0);
		opacity: 0;
	}
}
</style>
