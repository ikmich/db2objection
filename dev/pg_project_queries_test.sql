-- CREATE DATABASE pg_project;


-- -- Get tables in db (from pg_catalog)
-- SELECT catalogTables.schemaname,
--        catalogTables.tablename,
--        catalogTables.hasindexes
-- FROM pg_project.pg_catalog.pg_tables catalogTables
-- WHERE catalogTables.schemaname NOT IN ('pg_catalog', 'information_schema');


-- >> Get tables in db
SELECT t.table_catalog,
       t.table_schema,
       t.table_name
FROM pg_project.information_schema.tables t
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema');


-- >> Get column info
SELECT col.column_name,
       col.ordinal_position,
       col.column_default,
       col.is_nullable,
       col.data_type
FROM pg_project.information_schema.columns col
WHERE col.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND col.table_name = 'users';


-- >> Get column constraints
SELECT kcu.column_name,
       kcu.constraint_name AS constraint_name
FROM pg_project.information_schema.key_column_usage kcu
WHERE kcu.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND kcu.table_name = 'users'
  AND kcu.column_name = 'id';

-- +++

SELECT *
FROM pg_project.information_schema.table_constraints tc
WHERE tc.table_schema NOT IN ('pg_catalog', 'information_schema');


SELECT *
FROM pg_project.information_schema.key_column_usage kcu
WHERE kcu.table_schema NOT IN ('pg_catalog', 'information_schema');


SELECT *
FROM pg_project.information_schema.check_constraints cc
WHERE cc.constraint_schema NOT IN ('pg_catalog', 'information_schema');


-- =====================================================================================================================


SELECT kcu.table_schema,
       kcu.table_name,
       tco.constraint_name,
       kcu.ordinal_position AS position,
       kcu.column_name      AS key_column
FROM information_schema.table_constraints tco
         JOIN information_schema.key_column_usage kcu
              ON kcu.constraint_name = tco.constraint_name
                  AND kcu.constraint_schema = tco.constraint_schema
                  AND kcu.constraint_name = tco.constraint_name
WHERE tco.constraint_type = 'PRIMARY KEY'
  AND kcu.table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY kcu.table_schema,
         kcu.table_name,
         position;


-- =====================================================================================================================


-- Get table info --
SELECT t.table_schema,
       t.table_name,
       tc.constraint_name,
       tc.constraint_type,
       kcu.constraint_name,
       kcu.column_name,
       cc.check_clause
FROM information_schema.tables t
         LEFT JOIN information_schema.table_constraints tc
                   ON (tc.table_schema = t.table_schema AND tc.table_name = t.table_name)
         LEFT JOIN information_schema.key_column_usage kcu
                   ON (kcu.table_schema = t.table_schema AND kcu.table_name = t.table_name)
         LEFT JOIN information_schema.check_constraints cc
                   ON (cc.constraint_schema = t.table_schema AND cc.constraint_name = tc.constraint_name)
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND t.table_name = 'users'
ORDER BY t.table_name;

-- +++++++

-- Get column constraints