import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in Workflows.
 * https://api.slack.com/future/functions/custom
 */
export const AllEsFunctionDefinition = DefineFunction({
  callback_id: "all_es_function",
  title: "Get all the Es",
  description: "Get all the es",
  source_file: "functions/get_all_es_function.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
        description: "Interactivity of a form",
      },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.object,
        description: "List of all the ES",
      },
    },
    required: ["greeting"],
  },
});

export default SlackFunction(
  AllEsFunctionDefinition,
  async ({ inputs }) => {
    try {
      const authToken =
        `00DRN000000BFQ5!AR8AQKvhjsQA3JWmiBAWBxoiivj_tgSXcMb7WsBm38gq9OMvYbu79upQe.zE20JR0yqJ0QMZr3gi0ieOGT14js_qcoO4DL7b`;
      const headers = {
        "Authorization": `OAuth ` + authToken,
        "Content-Type": "application/json",
      };
      const endpoint =
        "https://hack-dev-ed.test1.my.pc-rnd.salesforce.com/services/data/v56.0/connect/omnistudio/evaluation-services?searchKey=ES";
      const { interactivity } = inputs;
      const repos = await fetch(endpoint, {
        method: "GET",
        headers: headers,
      });
      var data = await repos.json();
      // const { recipient, message } = inputs;
      // const greeting =`success call to google`;
      console.log(data);
      const greeting = JSON.stringify(data.calculationProcedures);

      return { outputs: { greeting } };
    } catch (err: any) {
      console.log("There was an issue", err);
      const { interactivity } = inputs;
      const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];

      salutations[Math.floor(Math.random() * salutations.length)];
      const greeting = ["No ES to Show"];
      return { outputs: { greeting } };
    }
  },
);
