export default class Controller {
  // Render template "example/welcome.html.tmpl" with message
  async welcome (ctx) {
    ctx.stash.msg = 'Welcome to the mojo.js real-time web framework!';
    await ctx.render();
  }
}
