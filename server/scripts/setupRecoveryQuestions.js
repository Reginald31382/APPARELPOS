import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import User from "../models/User.js";

const QUESTIONS = [
  { id: "first_pet", text: "What was the name of your first pet?" },
  { id: "birth_city", text: "In what city were you born?" },
  { id: "childhood_nickname", text: "What was your childhood nickname?" },
  { id: "first_school", text: "What was the name of your first school?" },
  { id: "first_concert", text: "What was the first concert you attended?" },
  {
    id: "childhood_friend",
    text: "What was the name of your childhood best friend?",
  },
  { id: "first_car", text: "What was the make of your first car?" },
];

const SALT_ROUNDS = 12;

// ─────────────────────────────────────────────
// Terminal messages
// ─────────────────────────────────────────────

const info = (message) => console.log(chalk.cyan(`ℹ ${message}`));
const success = (message) => console.log(chalk.green(`✔ ${message}`));
const warning = (message) => console.log(chalk.yellow(`⚠ ${message}`));
const error = (message) => console.error(chalk.red(`✖ ${message}`));

const normalizeAnswer = (answer) =>
  answer.trim().toLowerCase().replace(/\s+/g, " ");

// ─────────────────────────────────────────────
// Prompt helpers
// ─────────────────────────────────────────────

async function askText(message) {
  const response = await prompts({
    type: "text",
    name: "value",
    message,
    validate: (value) => value.trim().length > 0 || "This field is required.",
  });

  if (response.value === undefined) {
    throw new Error("Setup cancelled.");
  }

  return response.value.trim();
}

async function askPassword(message) {
  const response = await prompts({
    type: "password",
    name: "value",
    message,
    validate: (value) =>
      value.trim().length >= 2 || "Answer must contain at least 2 characters.",
  });

  if (response.value === undefined) {
    throw new Error("Setup cancelled.");
  }

  return response.value.trim();
}

async function askConfirm(message, initial = false) {
  const response = await prompts({
    type: "confirm",
    name: "value",
    message,
    initial,
  });

  if (response.value === undefined) {
    throw new Error("Setup cancelled.");
  }

  return response.value;
}

async function askQuestionSelection(message, excludedIds = []) {
  const availableQuestions = QUESTIONS.filter(
    (question) => !excludedIds.includes(question.id),
  );

  const response = await prompts({
    type: "select",
    name: "value",
    message,
    choices: availableQuestions.map((question) => ({
      title: question.text,
      value: question.id,
    })),
  });

  if (response.value === undefined) {
    throw new Error("Setup cancelled.");
  }

  return response.value;
}

// ─────────────────────────────────────────────
// Main setup
// ─────────────────────────────────────────────

async function setupRecoveryQuestions() {
  let spinner;

  try {
    console.log();
    console.log(chalk.bold.magenta("  APPARELPOS ACCOUNT RECOVERY SETUP"));
    console.log(chalk.gray("  ─────────────────────────────────────"));
    console.log();

    info("This utility securely configures account recovery questions.");
    info("Answers will be hidden while you type.");
    console.log();

    const email = await askText("Enter the account email:");

    // Connect to MongoDB
    spinner = ora("Connecting to MongoDB...").start();

    await mongoose.connect(process.env.MONGO_URI);

    spinner.succeed("Connected to MongoDB");

    // Find account
    spinner = ora("Looking up account...").start();

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    spinner.stop();

    if (!user) {
      error("No account was found for that email.");
      return;
    }

    success(`Account found: ${user.email}`);
    console.log();

    // Existing recovery setup
    if (user.securityQuestions?.length > 0) {
      warning("Recovery questions are already configured.");

      const replace = await askConfirm(
        "Do you want to replace the existing recovery questions?",
        false,
      );

      if (!replace) {
        info("Existing recovery questions were left unchanged.");
        return;
      }
    }

    // Select two different questions
    const firstQuestionId = await askQuestionSelection(
      "Select your first security question:",
    );

    const firstQuestion = QUESTIONS.find(
      (question) => question.id === firstQuestionId,
    );

    const firstAnswer = await askPassword(`Answer for: ${firstQuestion.text}`);

    const secondQuestionId = await askQuestionSelection(
      "Select your second security question:",
      [firstQuestionId],
    );

    const secondQuestion = QUESTIONS.find(
      (question) => question.id === secondQuestionId,
    );

    const secondAnswer = await askPassword(
      `Answer for: ${secondQuestion.text}`,
    );

    console.log();
    warning("Your answers cannot be recovered once saved.");
    warning("Make sure you remember the exact answers you entered.");
    console.log();

    const confirm = await askConfirm("Save these recovery questions?", false);

    if (!confirm) {
      warning("Setup cancelled. Nothing was saved.");
      return;
    }

    // Hash answers
    spinner = ora("Securing recovery answers...").start();

    const firstAnswerHash = await bcrypt.hash(
      normalizeAnswer(firstAnswer),
      SALT_ROUNDS,
    );

    const secondAnswerHash = await bcrypt.hash(
      normalizeAnswer(secondAnswer),
      SALT_ROUNDS,
    );

    // Save
    user.securityQuestions = [
      {
        questionId: firstQuestionId,
        answerHash: firstAnswerHash,
      },
      {
        questionId: secondQuestionId,
        answerHash: secondAnswerHash,
      },
    ];

    user.recoveryAttempts = 0;
    user.recoveryLockedUntil = null;
    user.resetTokenHash = null;
    user.resetTokenExpires = null;

    await user.save();

    spinner.succeed("Recovery questions securely saved");

    console.log();
    success("ACCOUNT RECOVERY SETUP COMPLETE");
    info("Your two security questions have been configured.");
    info("You can now use them to recover your account.");
    console.log();
  } catch (err) {
    if (spinner?.isSpinning) {
      spinner.fail("Recovery setup failed");
    }

    if (err.message === "Setup cancelled.") {
      warning("Setup was cancelled by the user.");
    } else {
      error(err.message || "An unexpected error occurred.");
    }
  } finally {
    await mongoose.disconnect().catch(() => {});
    console.log(chalk.gray("MongoDB connection closed."));
  }
}

setupRecoveryQuestions();
