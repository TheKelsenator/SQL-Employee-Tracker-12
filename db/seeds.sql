INSERT INTO department (department_name)
VALUES
  ('Office'),
  ('Warehouse'),
  ('River'),
  ('Shuttle');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Outfitter', 80000, 1),
  ('Warehouse Worker', 12000, 2),
  ('Lead Guide', 20000, 3),
  ('Guide', 16000, 3),
  ('Shuttle Driver', 4000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
  ('Tony', 'Herold', 1),
  ('Ben', 'Frey', 3),
  ('Hardy', 'Bender', 4),
  ('Mike', 'Anderson', 4),
  ('Josh', 'Edmunson', 5);