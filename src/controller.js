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

        const allowedAttributes = ['nombre', 'autor', 'categoria', 'año-publicacion', 'ISBN'];

        // Validar que no haya atributos no permitidos
        const invalidAttributes = Object.keys(libro).filter(attr => !allowedAttributes.includes(attr));

        if (invalidAttributes.length > 0) {
            return res.status(400).json({ 
                message: 'Atributos no permitidos detectados', 
                invalidAttributes 
            });
        }

        // Validar atributos requeridos
        if (!libro.nombre || !libro.autor || !libro.categoria || !libro['año-publicacion'] || !libro.ISBN) {
            return res.status(400).json({ message: 'Faltan atributos requeridos' });
        }

        // Validar ISBN
        if (!/^\d{13}$/.test(libro.ISBN)) {
            return res.status(400).json({ message: 'El ISBN debe tener 13 dígitos numéricos' });
        }

        try {
            const [result] = await pool.query(
                `INSERT INTO libros(nombre, autor, categoria, \`año-publicacion\`, ISBN) VALUES(?,?,?,?,?)`,
                [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN]
            );
            res.json({ "Id insertado": result.insertId });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async delete(req, res) {
        const {ISBN} = req.body;

         if (!ISBN) {
            return res.status(400).json({ message: 'El ISBN es requerido' });
        }

        // Validar ISBN
        if (!/^\d{13}$/.test(ISBN)) {
            return res.status(400).json({ message: 'El ISBN debe tener 13 dígitos numéricos' });
        }

        try {
            const [result] = await pool.query('DELETE FROM libros WHERE ISBN = ?', [ISBN]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Libro no encontrado' });
            }

            res.json({ "Registros eliminados": result.affectedRows });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error });
        }
    }

    async update(req,res) {
        const libro = req.body;

        // Validar atributos
        if (!libro.id || !libro.nombre || !libro.autor || !libro.categoria || !libro['año-publicacion'] || !libro.ISBN) {
            return res.status(400).json({ message: 'Faltan atributos requeridos' });
        }

        try {
        const [result] = await pool.query(
            `UPDATE libros SET nombre=(?), autor=(?), categoria=(?), \`año-publicacion\`=(?), ISBN=(?) WHERE id=(?)`,
            [libro.nombre, libro.autor, libro.categoria, libro['año-publicacion'], libro.ISBN, libro.id]);

        if (result.changedRows === 0) {
                return res.status(404).json({ message: 'Libro no encontrado para actualizar' });
            }

        res.json({"Registros actualizados": result.changedRows});

        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error });
        }
    }
}

export const libro = new BiblioController();