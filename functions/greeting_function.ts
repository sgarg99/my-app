import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GreetingFunctionDefinition = DefineFunction({
  callback_id: "greeting_function",
  title: "Generate a greeting",
  description: "Generate a greeting",
  source_file: "functions/greeting_function.ts",
  input_parameters: {
    properties: {
      recipient: {
        type: Schema.types.string,
        description: "Greeting recipient",
      },
      message: {
        type: Schema.types.string,
        description: "Message to the recipient",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.string,
        description: "Greeting for the recipient",
      },
    },
    required: ["greeting"],
  },
});

export default SlackFunction(
  GreetingFunctionDefinition,
  async ({ inputs }) => {
    try {
      const authToken =
        `00DRN000000BFQ5!AR8AQKvhjsQA3JWmiBAWBxoiivj_tgSXcMb7WsBm38gq9OMvYbu79upQe.zE20JR0yqJ0QMZr3gi0ieOGT14js_qcoO4DL7b`;
      const headers = {
        "Authorization": `OAuth ` + authToken,
        "Content-Type": "application/json",
      };
      const endpoint =
        "https://hack-dev-ed.test1.my.pc-rnd.salesforce.com/services/data/v56.0/connect/business-rules/expressionSet/ESHack";
      const { recipient, message } = inputs;
      const repos = await fetch(endpoint, {
        method: "POST",
        body: `{"inputs": [{"a":` + message + `}],"options": {}}`,
        headers: headers,
      });
      var data = await repos.json();
      // const { recipient, message } = inputs;
      // const greeting =`success call to google`;
      console.log(data);
      const greeting = JSON.stringify(data.outputs[0].results.b);

      return { outputs: { greeting } };
    } catch (err: any) {
      console.log("There was an issue", err);
      const { recipient, message } = inputs;
      const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];

      salutations[Math.floor(Math.random() * salutations.length)];
      const greeting =
        `${salutations}, <@${recipient}>! :wave: Someone sent the following greeting: \n\n>${err}`;
      return { outputs: { greeting } };
    }
  },
);
