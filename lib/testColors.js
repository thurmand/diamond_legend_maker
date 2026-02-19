import dmcList from "./dcm2.json";

const TEST_SYMBOLS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:,.<>/?|~";

export function buildTestColors({ count, existingValues = [], startId = 1 }) {
  const maxCount = Math.max(0, Number(count) || 0);
  const usedDmc = new Set(existingValues.map((item) => item.dmc));
  const usedSymbols = new Set(
    existingValues
      .map((item) => item.symbol)
      .filter((symbol) => symbol !== " ")
  );

  const availableDmcs = Object.entries(dmcList).filter(
    ([dmc, value]) => !!value?.hex && !usedDmc.has(dmc)
  );
  const availableSymbols = TEST_SYMBOLS.split("").filter(
    (symbol) => !usedSymbols.has(symbol)
  );

  const limit = Math.min(maxCount, availableDmcs.length, availableSymbols.length);
  const generated = [];

  for (let i = 0; i < limit; i += 1) {
    const [dmc, color] = availableDmcs[i];
    generated.push({
      id: startId + i,
      symbol: availableSymbols[i],
      dmc,
      hex: `#${color.hex}`,
      text: color.hex.toUpperCase() === "000000" ? "white" : "black",
    });
  }

  return generated;
}
