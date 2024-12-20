function isArray<T>(obj: T): obj is T & any[] {
  return Array.isArray(obj);
}
