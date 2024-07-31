export default class Posts {
    constructor(pg)
    {
      this.pg = pg;
    }

    async add(post)
    {
        return (await this.pg.query`INSERT INTO users_posts (sender_id, receiver_id, post_text) VALUES (${post.sender_id}, ${post.receiver_id}, ${post.post_text}) RETURNING id`)
            .first.id;
    }

    async find(id)
    {
        return (await this.pg.query`SELECT * FROM users_posts WHERE receiver_id = ${id}`).first;
    }
}