export type Project = {
  id: string;

  title: string;

  description?:
    | string
    | null;

  src: string;

  src2?: string | null;
  src3?: string | null;
  src4?: string | null;
  src5?: string | null;
  src6?: string | null;
  src7?: string | null;
  src8?: string | null;
  src9?: string | null;

  srcVideo?:
    | string
    | null;

  tags?:
    | string
    | string[]
    | null;

  type?:
    | string
    | null;

  tools?:
    | string
    | null;

  createdAt: Date;

  updatedAt: Date;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

export type ImageLayout = {
  row: string;
  offset: string;
  size: string;
};

export type ImageDimensionsMap =
  Record<
    number,
    ImageDimensions
  >;