import semver from "semver";


export interface Request<T> {
  url: string,
  adapter: (source: any) => T
}

interface User {

}

interface Post {

}

export interface RequestRegistry {
  users: Request<User>;
  posts: Request<Post>;
}

export function convert<T>(source: any): T {
  return source
}

export interface Registry {
  [key: string]: RequestRegistry;
}

export function withCustomAdapter<T extends RequestRegistry>(target: T, source: Partial<T>): T {
  return Object.assign({}, target, source);
}

export function findConfigByName(name: string, registry: Registry): RequestRegistry {
  const url = registry[name];
  if (!url) {
    throw new Error(`Unsupported version or name: ${name}`);
  }

  return url;
}

export function findConfigByVersion(version: string, registry: Registry): RequestRegistry {
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
