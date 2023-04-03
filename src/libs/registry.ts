import semver from "semver";

interface Registry {
    [key: string]: string;
  }
  
  const registry: Registry = {
    v1: "https://example.com/api/v1/endpoint",
    v2: "https://example.com/api/v2/endpoint",
    v3: "https://example.com/api/v3/endpoint",
    alpha: "https://example.com/api/alpha/endpoint",
    beta: "https://example.com/api/beta/endpoint",
    production: "https://example.com/api/production/endpoint",
  };
  
export function findConfigByName(name: string): string {
    const base = "https://example.com/api/";
  
    const url = registry[name];
    if (!url) {
      throw new Error(`Unsupported version or name: ${name}`);
    }
  
    return url;
  }

export function findConfigByVersion(version: string, registry: Registry): string {
    let closestVersion: string | null = null;
  
    for (const key in registry) {
      if (semver.satisfies(key, version)) {
        if (!closestVersion || semver.gt(key, closestVersion)) {
          closestVersion = key;
        }
      }
    }
  
    if (!closestVersion) {
      throw new Error(`Unsupported version: ${version}`);
    }
  
    console.log(`Closest version to ${version}: ${closestVersion}`);
  
    return registry[closestVersion];
  }
  