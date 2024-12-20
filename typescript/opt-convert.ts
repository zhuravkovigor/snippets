type ConvertOptions<T> = {
  labelKey: keyof T;
  valueKey: keyof T;
};

function convertArrayToLabelValue<T>(
  array: T[],
  options: ConvertOptions<T>
): { label: string; value: string }[] {
  return array.map((item) => ({
    label: String(item[options.labelKey]),
    value: String(item[options.valueKey]),
  }));
}

// Example usage:
interface ExampleObject {
  id: number;
  name: string;
  description: string;
}

const exampleArray: ExampleObject[] = [
  { id: 1, name: "Item 1", description: "Description 1" },
  { id: 2, name: "Item 2", description: "Description 2" },
  { id: 3, name: "Item 3", description: "Description 3" },
];

const result = convertArrayToLabelValue(exampleArray, {
  labelKey: "name",
  valueKey: "id",
});
