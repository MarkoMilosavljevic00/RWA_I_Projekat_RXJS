
export enum Corner {
  RedCorner = "Red corner",
  BlueCorner = "Blue corner",
}

export enum CornerKey{
  RedCorner = "redCorner",
  BlueCorner = "blueCorner",
}

export function mapCornerToKey(corner: Corner){
  if(corner === Corner.RedCorner)
    return CornerKey.RedCorner;
  else
    return CornerKey.BlueCorner;
}