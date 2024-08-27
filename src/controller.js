import { pool } from './database.js';

class BiblioController {

    async getAll(req, res) {

            const [result] = await pool.query('SELECT * FROM libros');
            res.json(result);
        } 

    async getOne(req, res) {
        const id = parseInt(req.params.id, 10);
        
        try {
            const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);
            
            if (result.length === 0) {
                return res.status(404).json({ message: 'Libro no encontrado' });
            }
            
            res.json(result[0]);
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async add(req, res) {
        const libro = req.body;
        const [result] = await pool.query(
            `INSERT INTO libros(nombre, autor, categoria, \`año-publicacion\`, ISBN) VALUES(?,?,?,?,?)`, 
            [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN]);
        res.json({"Id insertado": result.insertId}); 
    }

    async delete(req, res) {
        const libro = req.body;
        const [result] = await pool.query(
            `DELETE FROM libros WHERE id=(?)`, [libro.id]);
        res.json({"Registros eliminados": result.affectedRows}); 
    }

    async update(req,res) {
        const libro = req.body;
        const [result] = await pool.query(
            `UPDATE libros SET nombre=(?), autor=(?), categoria=(?), \`año-publicacion\`=(?), ISBN=(?) WHERE id=(?)`,
            [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN, libro.id]);
        res.json({"Registros actualizados": result.changedRows})
    }
}

export const libro = new BiblioController();