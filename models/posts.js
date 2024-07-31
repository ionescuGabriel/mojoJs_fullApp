export default class Posts {
    constructor(pg)
    {
      this.pg = pg;
    }

    async add(post)
    {
        return (await this.pg.query`INSERT INTO users_post (sender_id, receiver_id, post_text) VALUES (${post.sender_id}, ${post.receiver_id}, ${post.post_text}) RETURNING id`)
            .first.id;
    }

    async find(id)
    {
        const submitedPosts = await this.pg.query`SELECT * FROM users_post WHERE receiver_id = ${id}`;
        return submitedPosts;
    }
}