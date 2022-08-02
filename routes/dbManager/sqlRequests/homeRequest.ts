const allDbSqlRequest = "SHOW DATABASES";

const tableNumSqlRequest = (db: string): string => `SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${db}";`;

const dbSizeSqlRequest = (db: string): string => `SELECT table_schema "${db}", sum(data_length + index_length)/1024/1024 "size_mb" FROM information_schema.TABLES WHERE table_schema='${db}' GROUP BY table_schema;`;

const tableInfoSqlRequest = `SELECT table_name AS "table", round(((data_length + index_length) / 1024 / 1024), 2) "table_size" FROM information_schema.TABLES WHERE table_schema= ?`;

const itExistSqlRequest = (dbName: string): string => `USE ${dbName};`;


export { dbSizeSqlRequest, tableNumSqlRequest, allDbSqlRequest, tableInfoSqlRequest, itExistSqlRequest }
//ORM sequelize mongodb
