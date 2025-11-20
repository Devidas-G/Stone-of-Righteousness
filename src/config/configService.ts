type EnvValue = string | undefined;

class ConfigService {
  get(key: string, defaultValue?: string): EnvValue {
    const val = process.env[key];
    if (val === undefined || val === "") return defaultValue;
    return val;
  }

  getString(key: string, defaultValue?: string): string | undefined {
    return this.get(key, defaultValue);
  }

  getNumber(key: string, defaultValue?: number): number | undefined {
    const val = this.get(key);
    if (val === undefined) return defaultValue;
    const num = Number(val);
    if (Number.isNaN(num)) return defaultValue;
    return num;
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const val = this.get(key);
    if (val === undefined) return defaultValue ?? false;
    return ["1", "true", "yes", "on"].includes(val.toLowerCase());
  }

  getPort(): number {
    return this.getNumber("PORT", 3000) as number;
  }

  getMongoUri(): string {
    const uri = this.getString("MONGO_URI");
    if (!uri) throw new Error("MONGO_URI is not defined in environment");
    return uri;
  }

  getSigningSecret(): string {
    const secret = this.getString("SIGNING_SECRET");
    if (!secret) throw new Error("SIGNING_SECRET is not defined in environment");
    return secret;
  }

  isProduction(): boolean {
    return this.getString("NODE_ENV", "development") === "production";
  }
}

const config = new ConfigService();
export default config;
