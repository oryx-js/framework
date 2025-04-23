
# Oryx

Oryx is a lightweight, opinionated, and modular TypeScript-based backend framework built on top of Express.js. It aims to provide a clean architecture, fast setup, and extendability—ideal for both rapid development and large-scale applications.

## 📦 Features

| Feature         | Description (EN)                                        | Keterangan (ID)                                      |
|-----------------|---------------------------------------------------------|-------------------------------------------------------|
| **Express**     | View engine, routing, controllers, middlewares          | View engine, routing, controller, middleware          |
| **Socket.io**   | Real-time communication protocol                        | Protokol komunikasi real-time                         |
| **TypeORM**     | ORM, Query builder, Seeder, BaseRepo, Pagination        | ORM + Query + Seeder + BaseRepo + Pagination          |
| **class-validator** | DTO validation                                  | Validasi DTO                                           |
| **Helper**      | Utilities like Date, Object, Common functions           | Fungsi utilitas umum (Date, Object, Common, dll.)     |

## 🏁 Getting Started

```bash
git clone https://github.com/oryx-js/framework.git ./
cd oryx-app
npm install
npm run dev
```

## 📂 Project Structure

```
src/
├── app/
│   ├── config/
│   ├── database/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── seeders/
│   ├── http/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── validators/
│   ├── routes/
│   └── services/
├── core/           # Core engine of the framework
└── types/          # Type declarations
```

## 🚀 Commands

- `npm run dev` – Start the server in development mode
- `npm run build` – Build TypeScript project
- `npm run start` – Run the compiled project

## 🧩 Planned Features

- Dependency Injection container
- Lifecycle hooks (`beforeSystem`, `afterSystem`, `shutdownSystem`)
- CLI generator (`oryx make:*`)
- E2EE-ready Chat system
- Adapter layer for alternative drivers (Fastify, Hapi, etc.)

## 📖 License

MIT

---

Made with ☕ + ❤️ by Refkinscallv