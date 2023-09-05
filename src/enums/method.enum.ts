export enum Method {
  Decision = "Decision",
  KO_TKO = "KO/TKO",
  Submission = "Submission",
}

export function mapStringToMethod(value: string): Method {
  switch (value) {
    case Method.Decision:
      return Method.Decision;
    case Method.KO_TKO:
      return Method.KO_TKO;
    case Method.Submission:
      return Method.Submission;
  }
}