const driver = process.env.DB_DRIVER || "json";

module.exports = driver === "prisma" ? require("./prismaStore") : require("./jsonStore");
