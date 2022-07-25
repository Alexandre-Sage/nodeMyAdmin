"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDbSqlRequest = exports.tableNumSqlRequest = exports.dbSizeSqlRequest = void 0;
const allDbSqlRequest = "SHOW DATABASES";
exports.allDbSqlRequest = allDbSqlRequest;
const tableNumSqlRequest = (db) => `SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${db}";`;
exports.tableNumSqlRequest = tableNumSqlRequest;
const dbSizeSqlRequest = (db) => `SELECT table_schema "${db}", sum(data_length + index_length)/1024/1024 "size_mb" FROM information_schema.TABLES WHERE table_schema='${db}' GROUP BY table_schema;`;
exports.dbSizeSqlRequest = dbSizeSqlRequest;
//ORM sequelize mongodb
