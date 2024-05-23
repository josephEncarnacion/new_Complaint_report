const config = require('./dbConfig');
const sql = require('mssql');

const insertComplaint = async (name, address, complaintType, complaintText) => {
    try {
        let pool = await sql.connect(config);
        const query = `
            INSERT INTO Complaint_tbl (Name, Address, ComplaintType, ComplaintText)
            VALUES (@name, @address, @complaintType, @complaintText)
        `;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('address', sql.VarChar, address)
            .input('complaintType', sql.VarChar, complaintType)
            .input('complaintText', sql.VarChar, complaintText)
            .query(query);
        console.log('Complaint inserted successfully.');
    } catch (error) {
        console.error('Error inserting complaint:', error);
        throw error;
    }
};
const insertEmergencyReport = async (name, address, emergencyType, emergencyText) => {
    try {
        let pool = await sql.connect(config);
        const query = `
            INSERT INTO Emergencyy_tbl (Name, Address, EmergencyType, EmergencyText)
            VALUES (@name, @address, @emergencyType, @emergencyText)
        `;
        await pool.request()
            .input('name', sql.VarChar, name)
            .input('address', sql.VarChar, address)
            .input('emergencyType', sql.VarChar, emergencyType)
            .input('emergencyText', sql.VarChar, emergencyText)
            .query(query);
        console.log('Emergency report inserted successfully.');
    } catch (error) {
        console.error('Error inserting emergency report:', error);
        throw error;
    }
};
async function getUserByUsername(username) {
    try {
        let pool = await sql.connect(config);
        const query = 'SELECT * FROM users WHERE username = @username';
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(query);
        return result.recordset[0]; // Assuming you expect only one user
    } catch (error) {
        console.error('Error retrieving user by username:', error);
        throw error;
    }
}

async function insertUser(user) {
    try {
        let pool = await sql.connect(config);
        const query = 'INSERT INTO users (username, email, password) VALUES (@username, @email, @password)';
        await pool.request()
            .input('username', sql.VarChar, user.username)
            .input('email', sql.VarChar, user.email)
            .input('password', sql.VarChar, user.password)
            .query(query);
        console.log('User inserted successfully.');
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
module.exports = {
    insertEmergencyReport,
    insertComplaint,
    getUserByUsername,
    insertUser,
};