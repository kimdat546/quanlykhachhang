baseUrl: domain/api

```json
customer API:
GET     /customer/                      => get all customers
GET     /customer/:id                   => get a customer
POST    /customer/add                   => add a customer
PUT     /customer/edit/:id              => edit a customer
DELETE  /customer/delete/:id            => delete a customer

employee API:
GET     /employee/                      => get all employee
GET     /employee/:id                   => get a employee
POST    /employee/add                   => add a employee
PUT     /employee/edit/:id              => edit a employee
DELETE  /employee/delete/:id            => delete a employee
PUT     /employee/change_status/:id     => change status of a employee

login api
GET     /auth/token/                    => get access token

get file
GET		/upload/						=> get file
{
	"pathFile":"uploads\\2022\\1\\1644169225890_130bcb6d5517ae49f706.jpg"
}
```

migrate db

```
node_modules\.bin\sequelize-mig migration:make --name init
npx sequelize-cli db:migrate
```
