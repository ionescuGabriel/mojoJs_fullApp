export default class LoginController {

  async index(ctx) {                      //fixeit
    const params = await ctx.params();
    const user = params.get('user');
    const pass = params.get('pass');

    if (ctx.models.users.check(user, pass) === false) return await ctx.render();

    const session = await ctx.session();
    session.user = user;

    const flash = await ctx.flash();
    flash.message = 'Thanks for logging in.';
    await ctx.redirectTo('protected');
  }

  async loggedIn(ctx) {                      //check for session
    const session = await ctx.session();
    if (session.user !== undefined) return;
    await ctx.redirectTo('index');
    return false;
  }

  async protected(ctx) {
    await ctx.render({view: 'protected'});
  }

  async logout(ctx) {
    const session = await ctx.session();
    session.expires = 1;
    await ctx.redirectTo('index');
  }
}