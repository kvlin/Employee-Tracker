INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_name) VALUES ('Kevin', 'Lin', 4, NULL, 'Mike Chan');
INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_name) VALUES ('John', 'Doe', 5, 1, 'None');
INSERT INTO employees (first_name, last_name, role_id, manager_id, manager_name) VALUES ('Mike', 'Chan', 3, NULL, 'None');

INSERT INTO roles (title, salary, department_id) VALUES ('Sales Lead', 65000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Salesperson', 55000, 4);
INSERT INTO roles (title, salary, department_id) VALUES ('Lead Engineer', 120000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 100000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 80000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Legal Team Lead', 110000, 3);
INSERT INTO roles (title, salary, department_id) VALUES ('Lawyer', 90000, 3);

INSERT INTO department (dep_name) VALUES ('Engineering');
INSERT INTO department (dep_name) VALUES ('Finance');
INSERT INTO department (dep_name) VALUES ('Legal');
INSERT INTO department (dep_name) VALUES ('Sales');