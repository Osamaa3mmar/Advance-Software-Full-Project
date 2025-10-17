import { connection } from "../../Database/Connection.js";

export class WorkshopsRepository {
	static createWorkshop = async ({
		title,
		description,
		type = "OTHER",
		link = null,
		location = null,
	}) => {
		// current DB schema includes: title, description, type, link, location, created_at
		const [result] = await connection.execute(
			`INSERT INTO workshops (title, description, type, link, location)
	       VALUES (?, ?, ?, ?, ?)`,
			[title, description, type, link, location]
		);

		const insertId = result.insertId;
		const [rows] = await connection.execute(
			`SELECT * FROM workshops WHERE id = ?`,
			[insertId]
		);
		return rows[0];
	};

	static getAllWorkshops = async () => {
		const [rows] = await connection.execute(
			`SELECT * FROM workshops ORDER BY created_at DESC`
		);
		return rows;
	};

	static getWorkshopById = async (id) => {
		const [rows] = await connection.execute(
			`SELECT * FROM workshops WHERE id = ?`,
			[id]
		);
		return rows[0];
	};

	static editWorkshop = async (id, updates) => {
		// Build dynamic SET clause from allowed fields
		const allowed = ["title", "description", "type", "link", "location"];
		const fields = [];
		const values = [];

		Object.keys(updates || {}).forEach((key) => {
			if (allowed.includes(key)) {
				// only include fields that are explicitly provided (not undefined)
				if (typeof updates[key] !== "undefined") {
					fields.push(`${key} = ?`);
					values.push(updates[key]);
				}
			}
		});

		if (fields.length === 0) return null;

		values.push(id);
		const sql = `UPDATE workshops SET ${fields.join(", ")} WHERE id = ?`;
		const [result] = await connection.execute(sql, values);

		if (result.affectedRows === 0) return null;
		return await this.getWorkshopById(id);
	};

	static deleteWorkshop = async (id) => {
		const [result] = await connection.execute(
			`DELETE FROM workshops WHERE id = ?`,
			[id]
		);
		return result.affectedRows > 0;
	};
}

export default WorkshopsRepository;
