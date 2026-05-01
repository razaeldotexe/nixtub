import { join } from "path";
import { readdirSync, readFileSync, existsSync } from "fs";
import type { Translation } from "./types";

export class I18nService {
  private translations: Record<string, Translation> = {};
  private langDir: string;

  constructor(langDir: string = join(process.cwd(), "languages")) {
    this.langDir = langDir;
    this.loadLanguages();
  }

  private loadLanguages() {
    if (!existsSync(this.langDir)) {
      return;
    }

    const files = readdirSync(this.langDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const code = file.split(".")[0];
        try {
          const content = readFileSync(join(this.langDir, file), "utf-8");
          this.translations[code] = JSON.parse(content);
        } catch (e) {
          console.error(`Failed to load language file: ${file}`, e);
        }
      }
    }
  }

  public getTranslation(langCode?: string): Translation {
    if (langCode && this.translations[langCode]) {
      return this.translations[langCode];
    }
    // Fallback to English or the first available language
    return this.translations["en"] || Object.values(this.translations)[0];
  }

  public detectLanguage(flags: string[]): string {
    for (const flag of flags) {
      if (flag.startsWith("--")) {
        const q = flag.slice(2).toLowerCase();
        if (this.translations[q]) {
          return q;
        }
        for (const [code, trans] of Object.entries(this.translations)) {
          if (trans.lang_name.toLowerCase() === q) {
            return code;
          }
        }
      }
    }

    const envVars = [
      process.env.LC_ALL,
      process.env.LC_MESSAGES,
      process.env.LANG,
      process.env.LANGUAGE,
    ];

    for (const envVar of envVars) {
      if (envVar) {
        const candidates = envVar.split(":");
        for (const candidate of candidates) {
          const normalized = this.normalizeCode(candidate);
          if (this.translations[normalized]) {
            return normalized;
          }
        }
      }
    }

    return "en";
  }

  private normalizeCode(code: string): string {
    return code.split(/[._-]/)[0].toLowerCase();
  }

  public getAllLanguages(): Record<string, Translation> {
    return this.translations;
  }
}
