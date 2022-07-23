const allDbSqlRequest="SHOW DATABASES";

const tableNumSqlRequest=(db:string):string=>`SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${db}";`;

const dbSizeSqlRequest=(db:string):string=>`SELECT table_schema "${db}", sum(data_length + index_length)/1024/1024 "size_mb" FROM information_schema.TABLES WHERE table_schema='${db}' GROUP BY table_schema;`;

export {dbSizeSqlRequest,tableNumSqlRequest,allDbSqlRequest}
//ORM sequelize mongodb
