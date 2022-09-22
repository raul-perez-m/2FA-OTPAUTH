const otp = require('otpauth');
const inquirer = require('inquirer');
const prompts = require("./prompts.json")

async function askTOTPInfo(answers){
    answers = await inquirer.prompt(prompts.issuer, answers);
    answers = await inquirer.prompt(prompts.label, answers);
    answers = await inquirer.prompt(prompts.algorithm, answers);
    answers = await inquirer.prompt(prompts.secret, answers);
    return answers;
}

function generateTOTP(answers){

    let secret = otp.Secret.fromBase32(answers.secret)
    return new otp.TOTP({
        issuer: answers.issuer,
        label: answers.label,
        algorithm: answers.algorithm,
        digits: 6,
        period: 30,
        secret: secret
    });
}

(async () => {
    let answers = {};
    answers = await askTOTPInfo(answers);
    const totp = generateTOTP(answers);
    answers = await inquirer.prompt(prompts.token, answers);
    const valid = totp.validate({
        algorithm: 'SHA1',
          token: answers.token,
      });
    console.log(`This token is ${valid >= 0 ? 'valid' : 'invalid'}`);

})();