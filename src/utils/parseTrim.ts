const parseTrim = (string: string, max: number) =>
  string.length > max ? `${string.slice(0, max - 3)}...` : string;

export default parseTrim;
