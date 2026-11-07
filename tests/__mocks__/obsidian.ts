// Mock for Obsidian API
export class Plugin {
  constructor(_app: any, _manifest: any) {}

  async onload(): Promise<void> {}

  onunload(): void {}

  registerMarkdownCodeBlockProcessor(_language: string, _processor: (source: string, el: HTMLElement) => void): void {}
}

export const Platform = {
  isMobile: false,
};
