const parseList = (list: string[]) =>
  [list.slice(0, -1).join(", "), list.pop()]
    .filter((w) => w !== "")
    .join(" and ");

export default parseList;
