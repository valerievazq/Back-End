exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments();
    table.text("username").notNull().unique();
    table.text("password").notNull();
  });
  await knex.schema.createTable("stories", (table) => {
    table.increments(),
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .notNull()
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    table.text("storyTitle").notNull();
    // table.text("storyDescription").notNull();
    table.text("storyDate").notNull();
    table.text("story"), table.text("img");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("stories");
  await knex.schema.dropTableIfExists("users");
};
