import fs from 'fs';
import path from 'path';

const SOURCE_DB_PATH = path.join(process.cwd(), 'data', 'db.json');
// In serverless/Netlify, we can only write to /tmp
const WRITABLE_DB_PATH = process.env.NODE_ENV === 'production'
    ? '/tmp/db.json'
    : path.join(process.cwd(), 'data', 'db.json');

function readDb() {
    // Check if writable exists
    if (fs.existsSync(WRITABLE_DB_PATH)) {
        try {
            return JSON.parse(fs.readFileSync(WRITABLE_DB_PATH, 'utf-8'));
        } catch (e) {
            // If corrupted, fallback
        }
    }

    // Fallback to source
    if (fs.existsSync(SOURCE_DB_PATH)) {
        const data = JSON.parse(fs.readFileSync(SOURCE_DB_PATH, 'utf-8'));
        // Initialize writable from source
        try {
            fs.writeFileSync(WRITABLE_DB_PATH, JSON.stringify(data, null, 2));
        } catch (e) {
            // Ignore write error if not writable (local dev maybe?)
        }
        return data;
    }

    // Initialize new
    const initialData = { users: [], tasks: [], attendance: [], submissions: [], announcements: [] };
    try {
        fs.writeFileSync(WRITABLE_DB_PATH, JSON.stringify(initialData, null, 2));
    } catch (e) { }
    return initialData;
}

function writeDb(data: any) {
    try {
        fs.writeFileSync(WRITABLE_DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to write DB:", e);
    }
}

class Query {
    results: any[];

    constructor(results: any[]) {
        this.results = results;
    }

    sort(sortQuery: any) {
        const key = Object.keys(sortQuery)[0];
        const dir = sortQuery[key];
        this.results.sort((a: any, b: any) => {
            // Handle Date strings
            let valA = a[key];
            let valB = b[key];

            if (key === 'createdAt' || key === 'updatedAt') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }

            if (valA < valB) return dir === 1 ? -1 : 1;
            if (valA > valB) return dir === 1 ? 1 : -1;
            return 0;
        });
        return this;
    }

    select(fields: string) {
        // Mock select
        return this;
    }

    // Make it thenable so await works
    then(resolve: any, reject: any) {
        return Promise.resolve(this.results).then(resolve, reject);
    }
}

export class JsonModel<T> {
    collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    find(query: any = {}) {
        const db = readDb();
        let results = db[this.collection] || [];

        results = results.filter((item: any) => {
            for (const key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });

        results.forEach((item: any) => {
            if (item.createdAt) item.createdAt = new Date(item.createdAt);
        });

        return new Query(results);
    }

    async findOne(query: any) {
        const db = readDb();
        const items = db[this.collection] || [];
        const item = items.find((item: any) => {
            for (const key in query) {
                if (item[key] !== query[key]) return false;
            }
            return true;
        });

        if (item && item.createdAt) item.createdAt = new Date(item.createdAt);
        return item || null;
    }

    async findById(id: string) {
        return this.findOne({ _id: id });
    }

    async create(data: any) {
        const db = readDb();
        const newItem = {
            _id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...data
        };
        if (!db[this.collection]) db[this.collection] = [];
        db[this.collection].push(newItem);
        writeDb(db);
        return newItem;
    }

    async findByIdAndUpdate(id: string, update: any, options: any = {}) {
        const db = readDb();
        const index = db[this.collection].findIndex((i: any) => i._id === id);
        if (index === -1) return null;

        const updatedItem = { ...db[this.collection][index], ...update, updatedAt: new Date().toISOString() };
        db[this.collection][index] = updatedItem;
        writeDb(db);
        return updatedItem;
    }

    async countDocuments(query: any = {}) {
        const q = this.find(query);
        return q.results.length;
    }
}
