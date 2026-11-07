// Jest setup: give jsdom the bits of the Obsidian and Canvas APIs the plugin uses.

type DomInfo = { cls?: string | string[]; text?: string; attr?: Record<string, string> };

// --- Obsidian's HTMLElement helpers -------------------------------------------------
const proto = HTMLElement.prototype as any;

proto.createEl = function (tag: string, info?: DomInfo | string) {
	const el = document.createElement(tag);
	if (typeof info === 'string') {
		el.className = info;
	} else if (info) {
		if (info.cls) el.className = Array.isArray(info.cls) ? info.cls.join(' ') : info.cls;
		if (info.text !== undefined) el.textContent = info.text;
		if (info.attr) for (const [k, v] of Object.entries(info.attr)) el.setAttribute(k, v);
	}
	this.appendChild(el);
	return el;
};
proto.createDiv = function (info?: DomInfo | string) {
	return this.createEl('div', info);
};
proto.setText = function (text: string) {
	this.textContent = text;
};
proto.addClass = function (...cls: string[]) {
	this.classList.add(...cls);
};
proto.setCssProps = function (props: Record<string, string>) {
	Object.assign(this.style, props);
};

// --- Canvas 2D context ---------------------------------------------------------------
// jsdom has no canvas. Every canvas gets a context whose drawing methods are jest.fn()s,
// so tests can assert on what was drawn (e.g. how many checkers via `arc`).
const CTX_METHODS = [
	'setTransform', 'clearRect', 'fillRect', 'strokeRect', 'beginPath', 'moveTo', 'lineTo',
	'closePath', 'stroke', 'fill', 'arc', 'fillText', 'roundRect', 'save', 'restore',
	'quadraticCurveTo',
];

export function createMockContext(): CanvasRenderingContext2D {
	const ctx: any = {
		fillStyle: '', strokeStyle: '', lineWidth: 1, font: '', textAlign: 'start',
		textBaseline: 'alphabetic', shadowColor: '', shadowBlur: 0, shadowOffsetX: 0,
		shadowOffsetY: 0, imageSmoothingEnabled: true,
		measureText: jest.fn((text: string) => ({ width: text.length * 7 })),
	};
	for (const m of CTX_METHODS) ctx[m] = jest.fn();
	return ctx;
}

const contexts = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();
HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
	let ctx = contexts.get(this);
	if (!ctx) {
		ctx = createMockContext();
		contexts.set(this, ctx);
	}
	return ctx;
} as any;
