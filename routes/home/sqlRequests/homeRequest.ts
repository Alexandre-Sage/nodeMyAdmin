export const allDbSqlRequest="SHOW DATABASES";
export const tableNumSqlRequest=(db:string)=>`SELECT COUNT(*) FROM information_schema.tables WHERE TABlE_SCHEMA="${db}";`;
export const dbSizeSqlRequest=(db:string)=>`SELECT table_schema "${db}", sum(data_length + index_length)/1024/1024 "size_mb" FROM information_schema.TABLES WHERE table_schema='${db}' GROUP BY table_schema;`;
//ORM sequelize mongodb
