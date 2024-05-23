const config ={
    user: 'srad',
    password: '123',
    server: 'DARZEN',
    database: 'application',
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port: 1433
}
module.exports = config;
