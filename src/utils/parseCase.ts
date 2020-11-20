const parseCase = (string: string) =>
  string
    .split("_")
    .map((c) => c[0] + c.slice(1).toLowerCase())
    .join(" ");

export default parseCase;
