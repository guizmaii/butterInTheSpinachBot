const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('best7d', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let bestCurrencies = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(b.percent_change_7d) - parseFloat(a.percent_change_7d); })
      .slice(0, 5);

    try {
      let message = (await Promise.all(
        bestCurrencies.map(
          async (bestCurrencie) => {
            const result = await fetchTicker(bestCurrencie.id);
            return `/${bestCurrencie.symbol} - ${bestCurrencie.name}\n\t*${result.changeOver7d}*%\n`;
          }
        )
      )).join('\n');
      message += '\n/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
