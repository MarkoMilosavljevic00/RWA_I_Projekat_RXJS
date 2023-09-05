export enum Corner {
  BlueCorner = "Blue corner",
  RedCorner = "Red corner",
}

export function mapStringToCorner(value: string): Corner {
  switch (value) {
    case Corner.BlueCorner:
      return Corner.BlueCorner;
    case Corner.RedCorner:
      return Corner.RedCorner;
  }
}
