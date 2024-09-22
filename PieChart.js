import { calculateRadius, calculateAngle, calculateAngles } from './utils.js';

export class PieChart {
  constructor(container, chartItems) {
    this.container = container;
    this.chartItems = calculateAngles(chartItems);
    this.chartOptions = {};
    this.eventListeners = [];
    this.focusedItem = null;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    if (!!this.ctx) {
      container.append(this.canvas);
      this.#observeSize();
    } else {
      container.style.backgroundColor = "#f6f6f6";
      const comment = document.createComment("Canvas is not supported, you will need a modern browser to view it");
      container.append(comment);
    }
  }

  #observeSize() {
    if (typeof ResizeObserver === 'function') {
      new ResizeObserver(([entry]) => {
        const containingWidth = entry?.contentRect?.width;
        const containingHeight = entry?.contentRect?.height;

        if (containingWidth && containingHeight) {
          const size = Math.floor(Math.min(containingWidth, containingHeight));
          this.#setChartSize(size);
        }
      }).observe(this.container);
    } else {
      this.#setChartSize(300);
    }
  }

  #setChartSize(size) {
    this.canvas.width = size;
    this.canvas.height = size;
    this.#setChartOptions(size);
    this.#reDraw();
    this.#setEventListeners();
  }

  #setChartOptions(size) {
    this.chartOptions = {
      x: size / 2,
      y: size / 2,
      radius: size / 2,
      innerRadius: size * 2 / 6,
    }
  }

  #setEventListeners() {
    const { canvas, chartItems, chartOptions } = this;
    this.#removeEventListeners();

    const mouseMoveListener = ({ pageX, pageY }) => {
      const { left, top } = canvas.getBoundingClientRect();

      const xDiff = pageX - (window.scrollX + left + chartOptions.x);
      const yDiff = pageY - (window.scrollY + top + chartOptions.y);

      const radius = calculateRadius(xDiff, yDiff);
      const isWithinCircle = chartOptions.radius >= radius && chartOptions.innerRadius <= radius;

      if (!isWithinCircle) {
        this.#setFocusedItem(null);
        return;
      }

      const angle = calculateAngle(xDiff, yDiff);

      const focusedItem = chartItems.find((item) => angle >= item.startAngle && angle < item.endAngle);
      this.#setFocusedItem(focusedItem || null);
    }

    const mouseLeaveListener = () => {
      this.#setFocusedItem(null);
    }

    canvas.addEventListener('mousemove', mouseMoveListener);
    canvas.addEventListener('mouseleave', mouseLeaveListener);
    
    this.eventListeners = [
      { type: 'mousemove', listener: mouseMoveListener },
      { type: 'mouseleave', listener: mouseLeaveListener },
    ]
  }

  #removeEventListeners() {
    if (this.eventListeners.length > 0) {
      this.eventListeners.forEach(({ type, listener }) => {
        this.canvas.removeEventListener(type, listener);
      })
      this.eventListeners = [];
    }
  }

  setFocusedItemById(id) {
    const focusedItem = this.chartItems.find((item) => item.id === id) || null;
    this.#setFocusedItem(focusedItem);
  }

  #setFocusedItem(focusedItem) {
    if (focusedItem?.id === this.focusedItem?.id) return;

    this.#reDraw(focusedItem);
    this.#setTooltip(focusedItem);
    this.#setActiveClassOnFormItem(focusedItem);

    this.focusedItem = focusedItem;
  }

  #setTooltip(focusedItem) {
    if (focusedItem === null) {
      this.canvas.removeAttribute('title');
    } else {
      this.canvas.title = `${ Math.round(focusedItem.percent * 10000) / 100 }%`;
    }
  }

  #setActiveClassOnFormItem(focusedItem) {
    if (this.focusedItem !== null) {
      const previousFocusedItemInForm = document.getElementById(`${this.focusedItem.id}`);
      previousFocusedItemInForm?.classList.remove('active');
    }

    if (focusedItem !== null) {
      const focusedItemInForm = document.getElementById(`${focusedItem.id}`);
      focusedItemInForm?.classList.add('active');
    }
  }

  #reDraw(focusedItem = this.focusedItem) {
    this.ctx.reset();

    for (const item of this.chartItems) {
      this.#drawItem(item, item === focusedItem);
    }
  }

  #drawItem({ startAngle, endAngle, id }, isFocused = false) {
    const { ctx, chartOptions: { x, y, radius, innerRadius } } = this;

    ctx.globalAlpha = isFocused ? 0.4 : 1;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.arc(x, y, innerRadius, endAngle, startAngle, true);

    ctx.fillStyle = `#${id}`;
    ctx.fill();

    ctx.globalAlpha = 1;
  }
}
