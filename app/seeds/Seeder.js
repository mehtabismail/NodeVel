module.exports = class Seeder {
  constructor() { }

  async seed(complete) {
    let user_seeder = resolve("app.seeds.UserSeeder");

    await user_seeder.up();
    complete();
  }
};
