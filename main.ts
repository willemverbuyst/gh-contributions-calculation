type LevelData = { min: number; max: number };
type YearData = Map<number, LevelData>;

const parseData = async (filePath: string) => {
  const content = await Deno.readTextFile(filePath);
  const yearSections = content.split("\n\n");
  const result: Map<number, YearData> = new Map();

  for (const section of yearSections) {
    const lines = section.split("\n").map((line) => line.trim());
    const year = lines.shift();

    if (!year || isNaN(Number(year))) {
      console.warn(`Invalid year detected in section: ${section}`);
      continue;
    }

    const levels: YearData = new Map();

    for (const line of lines) {
      const match = line.match(/Level (\d+): Min = (\d+), Max = (\d+)/);
      if (match) {
        const [, level, min, max] = match;
        levels.set(Number(level), { min: Number(min), max: Number(max) });
      }
    }

    result.set(Number(year), levels);
  }

  return result;
};

const filePath = "./ranges.txt";
parseData(filePath)
  .then((data) => console.log(data))
  .catch((err) => console.error("Error reading or parsing file:", err));
