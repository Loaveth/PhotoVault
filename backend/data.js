import fs from 'fs'
import Database from 'better-sqlite3'

const db = new Database(process.env.DB || 'sqlite3.db')

export function applySchema() {
  db.exec(fs.readFileSync('schema.sql').toString())
}

export function getUser(name) {
  return db
    .prepare('SELECT * FROM users WHERE name = ?')
    .get(name)
}

export function getUsers() {
  return db
    .prepare('SELECT name, level FROM users').all()
}

export function insertUser(name, bcryptPassword, level) {
    const result = db.prepare('insert or ignore into users(name,bcryptPassword,level) values(?,?,?)').run(name, bcryptPassword, level);
    return result.changes;
}

export function getPhoto(id) {
    return db
    .prepare('SELECT * FROM photos WHERE id = ?')
    .get(id)
}

export function getPhotos(order, filters) {
    const sqlOrder = (order === 'popularity')
        ? 'popularity DESC'
        : 'uploadedAt DESC'
        
    let sql = `
        SELECT *,
        (
            SELECT count(*)
            FROM likes l
            WHERE l.photoId = photos.id
        ) popularity
        FROM photos
    `
    let args = []
    if (filters) {
        if (filters.uploadedBy) {
            sql += ' WHERE uploadedBy = ?'
            args.push(filters.uploadedBy)
        }
    }
    sql += ` ORDER BY ${sqlOrder}`
    return db.prepare(sql).all(...args)
}

export function insertPhoto(filename, caption, uploadedBy) {
  const result = db
    .prepare(`
      INSERT INTO photos (filename, caption, uploadedBy)
      VALUES (?, ?, ?)
    `)
    .run(filename, caption, uploadedBy);

  return result.lastInsertRowid;
}

export function deletePhoto(id) {
    const result = db.prepare('DELETE FROM photos WHERE id = ?').run(id)
    return result.changes;
}

export function getLikedPhotos(userName) {
    return db
    .prepare('select p.* from photos p, likes l where l.photoId=p.id and l.userName=?').all(userName)
}

export function insertLike(photoId, userName) {
    const result = db.prepare('insert or ignore into likes (photoId, userName) VALUES (?, ?)').run(photoId, userName);
    return result.changes;
}

export function deleteLike(photoId, userName) {
    const result = db.prepare('DELETE FROM likes WHERE photoId = ? AND userName = ?').run(photoId, userName);
    return result.changes;
}

export function dropAllTables() {
  db.exec(`
    DROP TABLE IF EXISTS likes;
    DROP TABLE IF EXISTS photos;
    DROP TABLE IF EXISTS users;
  `)
}

