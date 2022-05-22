export interface Resolution {
  suffix: string;
  size: string;
}

export interface File {
  name: string;
  bucket: string;
}

export interface SqsPayload {
  file: File;
  resolution: Resolution;
}
