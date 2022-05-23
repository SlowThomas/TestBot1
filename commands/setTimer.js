const { Timer } = require('../db.js')
//arg: time input(string[])   return: time in second(int)
function sort_time(unsorted) {
    const words = [["minute", "minutes"], ["second", "seconds"], ["hour", "hours"], ["day", "days"]];
    var result = 0;
    console.log(unsorted);
    if (unsorted.length % 2 != 0) {
        return message.channel.send(`incorrect arguments input, here's how you use the command: ${this.description}`);
    }
    for (index = unsorted.length - 1; index > 0; index -= 2) {
        if (words[0].includes(unsorted[index].toLowerCase())) {
            //unit = "minute";
            result += Number(unsorted[index - 1]) * 60;
        }
        else if (words[1].includes(unsorted[index].toLowerCase())) {
            result += Number(unsorted[index - 1]);
        }
        else if (words[2].includes(unsorted[index].toLowerCase())) {
            result += Number(unsorted[index - 1]) * 60 * 60;
        }
        else if (words[3].includes(unsorted[index].toLowerCase())) {
            result += Number(unsorted[index - 1]) * 60 * 60 * 24;
        }
    }
    return result;
}

module.exports = {
    name: 'remindme',
    description: '!remindme time(integer) message(string): displays your message after the set time e.g.: !remindme (1 minute 20 sEcoNdS) Tick!',
    argsRequired: true,

    async execute(message, args) {
        if (args.length < 2 /*|| Number(args[0]) != args[0]  This is how you check if (args[0]) is a number*/) {
            return message.channel.send(`incorrect arguments input, here's how you use the command: ${this.description}`)
        }
        else {
            //const users = await User.findAll();
            //https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
            //const time = args.shift();
            var unsortedTime = [];
            //removes time from the args
            while (!(args[0].match("(\\)|\\]|\\>|\\}).*"))) { //removes brackets if there are any
                if (args[0].match("(\\(|\\[|\\<|\\{).*")) {
                    unsortedTime.push(args[0].substring(1));
                }
                else {
                    unsortedTime.push(args[0]);
                }
                args.shift();
                if (args.length == 0) {
                    return message.channel.send(`incorrect arguments input, here's how you use the command: ${this.description}`);
                }
            }
            unsortedTime.push(args[0].slice(0, -1));
            args.shift();


            const time = sort_time(unsortedTime);
            console.log(time); //
            const times = await Timer.create({
                reminder: args.join(" "),
                time: Date.now() + Number(time) * 1000,
                channelID: message.channel.id
            });
            setTimeout(async () => {
                //console.log(`${args.join(" ")}`);
                message.channel.send(`${args.join(" ")}`)
                await Timer.destroy({
                    where: {
                        uuid: times.uuid
                    }
                });
            }, Number(time) * 1000)

        }
    }
};