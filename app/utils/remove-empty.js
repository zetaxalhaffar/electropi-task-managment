/**
 * Removes properties from an object that have empty values.
 * Empty values are considered to be: null, undefined, an empty string, an empty array, or an object with all empty properties.
 *
 * @param obj - The object to clean.
 * @param exclude - Optional. Array of property names (string[]) or single property name (string) to exclude from removal.
 * @returns A new object without the empty properties.
 */
export const removeEmptyValues = (obj, exclude = []) => {
  // Normalize exclude to array format
  const excludeList = exclude
    ? Array.isArray(exclude)
      ? exclude
      : [exclude]
    : [];

  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      // If key is in exclude list, always keep it regardless of value
      if (excludeList.includes(key)) {
        return true;
      }

      // Remove null, undefined, or empty strings
      if (value === null || value === undefined || value === "") {
        return false;
      }

      // Remove empty arrays
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      // Check if value is an object (but not null, arrays, or Date objects)
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        // Recursively clean the object
        const cleanedObject = removeEmptyValues(value, exclude);

        // If the cleaned object has no properties, remove the parent key
        if (Object.keys(cleanedObject).length === 0) {
          return false;
        }
      }

      return true;
    }),
  );
};
