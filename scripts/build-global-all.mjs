import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const INPUT_ROOT = "data";
const OUT_DIR = "global";

const VOLUMES = "airblocks.geojson";
const VOLUMES_OUT = "airblocks.geojson";

const GEOJSON_NAME = "CDM Airspace Data";
const GEOJSON_CRS = {
  type: "name",
  properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
};

async function tryReadText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (e) {
    if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return null;
    throw e;
  }
}

const sectorDirs = (
  await fg(`${INPUT_ROOT}/*`, { onlyDirectories: true })
).sort();

if (sectorDirs.length === 0) {
  console.error(`No sector folders found under ${INPUT_ROOT}/`);
  process.exit(1);
}

await fs.mkdir(OUT_DIR, { recursive: true });

// Merge airblocks.geojson files
const features = [];
let copiedName = null;
let copiedCrs = null;

for (const sector of sectorDirs) {
  const raw = await tryReadText(path.join(sector, VOLUMES));
  if (raw == null) continue;

  let gj;

  try {
    gj = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${sector}/${VOLUMES}: ${e.message}`);
  }

  // Copy name and CRS from the first file that provides them
  if (copiedName == null && typeof gj?.name === "string") {
    copiedName = gj.name;
  }

  if (copiedCrs == null && gj?.crs) {
    copiedCrs = gj.crs;
  }

  if (gj?.type === "FeatureCollection" && Array.isArray(gj.features)) {
    for (const feat of gj.features) {
      if (feat?.type === "Feature") features.push(feat);
    }
    continue;
  }

  if (gj?.type === "Feature") {
    features.push(gj);
    continue;
  }

  throw new Error(
    `Unsupported GeoJSON in ${sector}/${VOLUMES}: expected FeatureCollection or Feature, got ${gj?.type}`
  );
}

const outObj = {
  type: "FeatureCollection",
  name: copiedName ?? GEOJSON_NAME,
  crs: copiedCrs ?? GEOJSON_CRS,
  features,
};

// Pretty-print top-level fields while keeping each feature on one line
const header =
  `{\n` +
  `"type": "FeatureCollection",\n` +
  `"name": ${JSON.stringify(outObj.name)},\n` +
  `"crs": ${JSON.stringify(outObj.crs, null, 1).replace(/\n */g, " ")},\n` +
  `"features": [\n`;

const body = features.map((f) => JSON.stringify(f)).join(",\n");

const footer = `\n]\n}\n`;

await fs.writeFile(
  path.join(OUT_DIR, VOLUMES_OUT),
  header + body + footer,
  "utf8"
);

console.log(
  `Wrote ${OUT_DIR}/${VOLUMES_OUT} with ${features.length} features`
);
