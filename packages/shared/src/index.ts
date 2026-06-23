type Cloneable = Record<string | symbol, any> | Array<any> | Map<any, any> | Set<any>;

/**
 * Deep clone any value.
 *
 * Supports objects, arrays, Map, Set and circular references.
 *
 * @param target - Value to clone
 * @param map - WeakMap to track circular references
 */
export function deepClone<T extends Cloneable>(target: T, map: WeakMap<object, any> = new WeakMap()): T {
  if (typeof target !== "object" || target === null) {
    return target;
  }

  if (map.has(target)) {
    return map.get(target);
  }

  let result: any;

  if (target instanceof Map) {
    result = new Map();
    map.set(target, result);

    target.forEach((value, key) => {
      result.set(deepClone(key, map), deepClone(value, map));
    });
  } else if (target instanceof Set) {
    result = new Set();
    map.set(target, result);

    target.forEach((value) => {
      result.add(deepClone(value, map));
    });
  } else if (Array.isArray(target)) {
    result = [];
    map.set(target, result);

    target.forEach((item) => {
      result.push(deepClone(item, map));
    });
  } else {
    result = Object.create(Object.getPrototypeOf(target));
    map.set(target, result);

    Reflect.ownKeys(target).forEach((key) => {
      result[key] = deepClone((target as any)[key], map);
    });
  }

  return result;
}

/**
 * Applies default values to a target object without mutation.
 *
 * Only assigns default values where the target property is undefined.
 *
 * Performs deep cloning to ensure immutability.
 *
 * @template T - Object type extending Record<string, any>
 * @param target - Source object
 * @param defaults - Default values to apply
 * @returns A new object with defaults deeply applied
 *
 * @example
 * const dto = { latitude: 52.54, current: ["temp"] };
 * const defaults = { timezone: "GMT", forecast_days: 7 };
 * const result = applyDefaultsDeep(dto, defaults);
 * // result: { latitude: 52.54, current: ["temp"], timezone: "GMT", forecast_days: 7 }
 */
export function applyDefaults<T extends Record<string, any>>(target: T, defaults: Partial<T>): T {
  // Deep clone the target to ensure immutability
  const result = deepClone(target);

  for (const key in defaults) {
    // Only apply default if the property is undefined in target and the default value itself is defined
    if (defaults[key] !== undefined && result[key] === undefined) {
      // Deep clone the default value before assigning
      result[key] = deepClone(defaults[key]!);
    }
  }

  return result;
}

/**
 * Get a random integer between min and max (inclusive)
 * @param min The minimum value
 * @param max The maximum value
 * @returns A random integer between min and max
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
