export default class LoginController {

  async index(ctx)    //break this down and refactor for optimised template
  {
    const params = await ctx.params();
    const user = params.get('user');
    const pass = params.get('pass');
    const action = params.get('action');

    if (!user || !pass)
    {
      const flash = await ctx.flash();
      flash.message = 'Wrong or missing credentials.';
      return await ctx.render();
    }

    if (action === 'login')
    {
      const isValid = await ctx.models.users.check(user, pass);
      if (isValid === false)
      {
        const flash = await ctx.flash();
        flash.message = 'Wrong or missing credentials.';
        return await ctx.render();
      }

      const session = await ctx.session();
      session.user = user;

      const flash = await ctx.flash();
      flash.message = 'Thanks for logging in!';
      await ctx.redirectTo('protected');
    }
    else if (action === 'register')
    {
      const id = await ctx.models.users.add({ username: user, pw: pass });
      if (!id)
      {
        const flash = await ctx.flash();
        flash.message = 'Registration failed, (DB issue).';
        return await ctx.render();
      }

      const session = await ctx.session();
      session.user = user;

      const flash = await ctx.flash();
      flash.message = 'Thanks for registering!';
      await ctx.redirectTo('protected');
    }
    else
      return await ctx.render();
  }

  async loggedIn(ctx)       //check for session
  {
    const session = await ctx.session();
    if (session.user !== undefined)
      return;
    await ctx.redirectTo('index');
    return false;
  }

  async protected(ctx)
  {
    ctx.stash.users = await ctx.models.users.all();   // this is incredibly vague y no await ctx.render({users})
    await ctx.render();
  }

  async logout(ctx)
  {
    const session = await ctx.session();
    session.expires = 1;
    await ctx.redirectTo('index');
  }

  async account(ctx) 
  {
    ctx.stash.users = await ctx.models.users.find(ctx.stash.id);
    await ctx.render();
  }
  
}