// Mock for Obsidian API
export class Plugin {
  constructor(app: any, manifest: any) {}

  async onload(): Promise<void> {}
  
  onunload(): void {}

  registerMarkdownCodeBlockProcessor(language: string, processor: (source: string, el: HTMLElement) => void): void {}
}