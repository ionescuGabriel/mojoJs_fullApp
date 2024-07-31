export default class Users {
  constructor(pg)
  {
    this.pg = pg;
  }

  async add(user)
  {
    return (await this.pg.query`INSERT INTO users (username, pw) VALUES (${user.username}, ${user.pw}) RETURNING id`)
      .first.id;  
  }

  async all()
  {
    return await this.pg.query`SELECT * FROM users`;
  }

  async find(id)
  {
    return (await this.pg.query`SELECT * FROM users WHERE id = ${id}`)
      .first;
  }

  async check(user, pass)
  {
    const [username, id] = user.split('#');

    if (isNaN(id))
    {
      return false;
    }

    const userData = await this.find(id);

    if (!userData || userData.username !== username || userData.pw !== pass)
    {
      return false;
    }

    return true;
  }
}
