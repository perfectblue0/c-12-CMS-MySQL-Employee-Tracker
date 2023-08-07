INSERT INTO department (name_department)
VALUES ("Management"),
        ("Marketing"), 
        ("IT Department"), 
        ("Human Resources"), 
        ("Research");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 150000, 1),
        ("Marketing Analyst", 100000, 2),
        ("Systems Analyst", 135000, 3),
        ("HR Generalist", 140000, 4),
        ("Research Assistant", 90000, 5),
        ("Research Specialist", 130000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Luciana", "Reyes", 1, 1),
       ("Emilia", "Azul", 1, 1),
       ("Lucas", "Gallego", 5, 2),
       ("Ru", "Carmona", 4, 2),
       ("Soo-Jin", "Castellano", 5, 2),
       ("Cande", "Escarcega", 2, 2),
       ("Hui", "Ngo", 3, 2),
       ("Nhung", "Nguyen", 6, 2);