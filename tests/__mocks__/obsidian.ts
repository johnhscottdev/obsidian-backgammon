// Mock for Obsidian API

/** Minimal event bus standing in for app.workspace (on / trigger). */
export class FakeWorkspace {
  private handlers: Record<string, Array<(...args: any[]) => void>> = {};

  on(name: string, callback: (...args: any[]) => void): { name: string; callback: (...args: any[]) => void } {
    (this.handlers[name] ??= []).push(callback);
    return { name, callback };
  }

  trigger(name: string, ...args: any[]): void {
    for (const cb of this.handlers[name] ?? []) cb(...args);
  }
}

export class Plugin {
  app: any;

  constructor(app: any, _manifest: any) {
    // Tests often pass `{}` as the app; give it a workspace so plugins can register events.
    this.app = app?.workspace ? app : { ...app, workspace: new FakeWorkspace() };
  }

  async onload(): Promise<void> {}

  onunload(): void {}

  registerMarkdownCodeBlockProcessor(_language: string, _processor: (source: string, el: HTMLElement) => void): void {}

  registerEvent(_ref: unknown): void {}
}

export const Platform = {
  isMobile: false,
};
