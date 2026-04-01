export interface FastApiValidationItem {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface FastApiErrorShape {
  detail?: string | FastApiValidationItem[];
}