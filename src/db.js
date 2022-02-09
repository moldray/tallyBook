import Dexie from 'dexie';

export const db = new Dexie('tallyBook');

db.version(1).stores({
  bills: '++id, type, time, category, amount', // Primary key and indexed props
  categories: '&id, type',
});