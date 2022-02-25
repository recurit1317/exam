import Dexie from "dexie"

export const historyDB = new Dexie("historyDB");
historyDB.version(1).stores({ histories: "keyword, date" });
