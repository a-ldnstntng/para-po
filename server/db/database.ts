import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'para-po.db');

let db: SqlJsDatabase;

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Run schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.run(schema);

  // Save initial state
  saveToFile();
}

function saveToFile(): void {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function insertRoute(id: string, origin: string, destination: string, rawText: string): void {
  db.run(
    'INSERT INTO routes (id, origin, destination, raw_text) VALUES (?, ?, ?, ?)',
    [id, origin, destination, rawText]
  );
  saveToFile();
}

export function insertStep(
  id: string,
  routeId: string,
  stepOrder: number,
  mode: string,
  lineLabel: string | null,
  landmark: string,
  instruction: string,
  fareEstimatePhp: number | null,
  notes: string | null
): void {
  db.run(
    'INSERT INTO route_steps (id, route_id, step_order, mode, line_label, landmark, instruction, fare_estimate_php, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, routeId, stepOrder, mode, lineLabel, landmark, instruction, fareEstimatePhp, notes]
  );
  saveToFile();
}

export function getAllRoutes(): any[] {
  const routes = db.exec('SELECT * FROM routes ORDER BY created_at DESC');
  if (routes.length === 0) return [];

  const routeColumns = routes[0].columns;
  const routeRows = routes[0].values.map((row) => {
    const obj: any = {};
    routeColumns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });

  return routeRows.map((route) => {
    const stepsResult = db.exec(
      'SELECT * FROM route_steps WHERE route_id = ? ORDER BY step_order ASC',
      [route.id]
    );
    let steps: any[] = [];
    if (stepsResult.length > 0) {
      const stepColumns = stepsResult[0].columns;
      steps = stepsResult[0].values.map((row) => {
        const obj: any = {};
        stepColumns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      });
    }
    return { ...route, steps };
  });
}

export function getRouteById(id: string): any | null {
  const routeResult = db.exec('SELECT * FROM routes WHERE id = ?', [id]);
  if (routeResult.length === 0 || routeResult[0].values.length === 0) return null;

  const routeColumns = routeResult[0].columns;
  const route: any = {};
  routeColumns.forEach((col, i) => {
    route[col] = routeResult[0].values[0][i];
  });

  const stepsResult = db.exec(
    'SELECT * FROM route_steps WHERE route_id = ? ORDER BY step_order ASC',
    [id]
  );
  let steps: any[] = [];
  if (stepsResult.length > 0) {
    const stepColumns = stepsResult[0].columns;
    steps = stepsResult[0].values.map((row) => {
      const obj: any = {};
      stepColumns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  }

  return { ...route, steps };
}

export function confirmRoute(id: string): void {
  db.run('UPDATE routes SET confirms = confirms + 1 WHERE id = ?', [id]);
  saveToFile();
}

export function deleteRoute(id: string): void {
  db.run('DELETE FROM route_steps WHERE route_id = ?', [id]);
  db.run('DELETE FROM routes WHERE id = ?', [id]);
  saveToFile();
}
