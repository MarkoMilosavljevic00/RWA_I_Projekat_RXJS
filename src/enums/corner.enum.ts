
export enum Corner {
  Red = "Red corner",
  Blue = "Blue corner",
}

export enum CornerKey{
  Red = "redCorner",
  Blue = "blueCorner",
}

export function mapCornerToKey(corner: Corner){
  if(corner === Corner.Red)
    return CornerKey.Red;
  else
    return CornerKey.Blue;
}