import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { AllEsFunctionDefinition } from "../functions/get_all_es_function.ts";
import { GreetingFunctionDefinition } from "../functions/greeting_function.ts";

/**
 * A Workflow is a set of steps that are executed in order.
 * Each step in a Workflow is a function.
 * https://api.slack.com/future/workflows
 */
const GreetingWorkflow = DefineWorkflow({
  callback_id: "greeting_workflow",
  title: "Send a greeting",
  description: "Send a greeting to channel",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */
//  const esList = GreetingWorkflow.addStep(
//   AllEsFunctionDefinition,
//   {
//     interactivity : GreetingWorkflow.inputs.interactivity,
//   },
// );

const inputForm = GreetingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "ExpressionSet",
    interactivity: GreetingWorkflow.inputs.interactivity,
    submit_label: "Execute",
    fields: {
      elements: [{
        name: "ExpressionSet",
        title: "ExpressionSet",
        type: Schema.types.string,
        enum: ["ES1", "ES2", "ES3", "ES4"],
        choices: [
          {
            value: "ES1",
            title: "ES1",
            description: "execute ES1",
          },
          {
            value: "ES2",
            title: "ES2",
            description: "execute ES2",
          },
          {
            value: "ES3",
            title: "ES3",
            description: "execute ES3",
          },
          {
            value: "ES4",
            title: "ES4",
            description: "execute ES4",
          },
        ],
      }, {
        name: "channel",
        title: "Channel to send message to",
        type: Schema.slack.types.channel_id,
        default: GreetingWorkflow.inputs.channel,
      }, {
        name: "InputForES",
        title: "Input provided by the user to the ES",
        type: Schema.types.string,
        long: true,
      }],
      required: ["ExpressionSet", "channel", "InputForES"],
    },
  },
);

const inputForm1 = GreetingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "ExpressionSet",
    interactivity: inputForm.outputs.interactivity,
    submit_label: "Execute",
    fields: {
      elements: [{
        name: "ExpressionSet",
        title: "ExpressionSet",
        type: Schema.types.string,
        enum: ["ES1", "ES2", "ES3", "ES4"],
        choices: [
          {
            value: "ES1",
            title: "ES1",
            description: "execute ES1",
          },
          {
            value: "ES2",
            title: "ES2",
            description: "execute ES2",
          },
          {
            value: "ES3",
            title: "ES3",
            description: "execute ES3",
          },
          {
            value: "ES4",
            title: "ES4",
            description: "execute ES4",
          },
        ],
      }, {
        name: "channel",
        title: "Channel to send message to",
        type: Schema.slack.types.channel_id,
        default: GreetingWorkflow.inputs.channel,
      }, {
        name: "InputForES",
        title: "Input provided by the user to the ES",
        type: Schema.types.string,
        long: true,
      }],
      required: ["ExpressionSet", "channel", "InputForES"],
    },
  },
);

const greetingFunctionStep = GreetingWorkflow.addStep(
  GreetingFunctionDefinition,
  {
    recipient: inputForm.outputs.fields.ExpressionSet,
    message: inputForm1.outputs.fields.InputForES,
  },
);

GreetingWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: greetingFunctionStep.outputs.greeting,
});

export default GreetingWorkflow;
