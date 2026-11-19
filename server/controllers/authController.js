import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";

// ==========================================
// SECURITY QUESTIONS
// ==========================================

export const SECURITY_QUESTIONS = [
  {
    id: "first_pet",
    question: "What was the name of your first pet?",
  },
  {
    id: "birth_city",
    question: "In what city were you born?",
  },
  {
    id: "childhood_nickname",
    question: "What nickname did you have as a child?",
  },
  {
    id: "first_school",
    question: "What was the name of your first school?",
  },
  {
    id: "first_concert",
    question: "What was the first concert you attended?",
  },
  {
    id: "childhood_friend",
    question: "What was the name of your childhood best friend?",
  },
  {
    id: "first_car",
    question: "What was the first car you owned?",
  },
];

// ==========================================
// RECOVERY HELPERS
// ==========================================

const normalizeAnswer = (answer) =>
  String(answer ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const RECOVERY_MAX_ATTEMPTS = 5;
const RECOVERY_LOCK_MINUTES = 15;
const RESET_TOKEN_MINUTES = 10;

// ==========================================
// GET RECOVERY QUESTIONS
// ==========================================

export const getRecoveryQuestions = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const fallbackQuestions = SECURITY_QUESTIONS.slice(0, 2).map(
      ({ id, question }) => ({ id, question }),
    );

    const user = email ? await User.findOne({ email }) : null;

    if (!user || !user.isActive || user.securityQuestions?.length !== 2) {
      return res.status(200).json({
        questions: fallbackQuestions,
      });
    }

    const questions = user.securityQuestions.map((savedQuestion) => {
      const question = SECURITY_QUESTIONS.find(
        (q) => q.id === savedQuestion.questionId,
      );

      return question
        ? {
            id: question.id,
            question: question.question,
          }
        : null;
    });

    if (questions.some((question) => !question)) {
      return res.status(200).json({
        questions: fallbackQuestions,
      });
    }

    return res.status(200).json({
      questions,
    });
  } catch (error) {
    console.error("Recovery question lookup error:", error);

    return res.status(200).json({
      questions: SECURITY_QUESTIONS.slice(0, 2).map(({ id, question }) => ({
        id,
        question,
      })),
    });
  }
};

// ==========================================
// VERIFY RECOVERY ANSWERS
// ==========================================

export const verifyRecoveryAnswers = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const answers = req.body.answers;

    if (
      !email ||
      !Array.isArray(answers) ||
      answers.length !== 2 ||
      answers.some(
        (item) =>
          !item ||
          typeof item.questionId !== "string" ||
          typeof item.answer !== "string" ||
          !item.answer.trim(),
      )
    ) {
      return res.status(400).json({
        message: "Unable to verify recovery information.",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isActive || user.securityQuestions?.length !== 2) {
      return res.status(400).json({
        message: "Unable to verify recovery information.",
      });
    }

    // Check whether recovery is currently locked
    if (user.recoveryLockedUntil && user.recoveryLockedUntil > new Date()) {
      return res.status(429).json({
        message: "Recovery is temporarily locked. Please try again later.",
      });
    }

    // Clear expired lockout
    if (user.recoveryLockedUntil && user.recoveryLockedUntil <= new Date()) {
      user.recoveryAttempts = 0;
      user.recoveryLockedUntil = null;
    }

    // Verify submitted question IDs match the saved questions
    const submittedQuestions = answers.map((answer) => answer.questionId);

    const savedQuestions = user.securityQuestions.map(
      (question) => question.questionId,
    );

    const questionsMatch =
      submittedQuestions.every((id) => savedQuestions.includes(id)) &&
      new Set(submittedQuestions).size === 2;

    let answersMatch = false;

    if (questionsMatch) {
      const checks = await Promise.all(
        answers.map(async (submittedAnswer) => {
          const savedQuestion = user.securityQuestions.find(
            (question) => question.questionId === submittedAnswer.questionId,
          );

          if (!savedQuestion) {
            return false;
          }

          return bcrypt.compare(
            normalizeAnswer(submittedAnswer.answer),
            savedQuestion.answerHash,
          );
        }),
      );

      answersMatch = checks.every(Boolean);
    }

    // Failed verification — atomically track attempts
    if (!answersMatch) {
      const now = new Date();
      const lockUntil = new Date(
        now.getTime() + RECOVERY_LOCK_MINUTES * 60 * 1000,
      );

      await User.findByIdAndUpdate(user._id, [
        {
          $set: {
            recoveryAttempts: {
              $add: [
                {
                  $cond: [
                    {
                      $gt: ["$recoveryLockedUntil", now],
                    },
                    "$recoveryAttempts",
                    0,
                  ],
                },
                1,
              ],
            },
          },
        },
        {
          $set: {
            recoveryLockedUntil: {
              $cond: [
                {
                  $gte: ["$recoveryAttempts", RECOVERY_MAX_ATTEMPTS],
                },
                lockUntil,
                null,
              ],
            },
          },
        },
      ]);

      return res.status(400).json({
        message: "Unable to verify recovery information.",
      });
    }

    // Successful verification clears failed attempts
    user.recoveryAttempts = 0;
    user.recoveryLockedUntil = null;

    // Generate a one-time recovery token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetTokenHash = hashToken(resetToken);

    user.resetTokenExpires = new Date(
      Date.now() + RESET_TOKEN_MINUTES * 60 * 1000,
    );

    await user.save();

    return res.status(200).json({
      message: "Recovery verified successfully.",
      resetToken,
      expiresIn: RESET_TOKEN_MINUTES * 60,
    });
  } catch (error) {
    console.error("Recovery verification error:", error);

    return res.status(500).json({
      message: "Unable to verify recovery information.",
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (
      typeof resetToken !== "string" ||
      !resetToken ||
      typeof newPassword !== "string"
    ) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    if (newPassword.length > 128) {
      return res.status(400).json({
        message: "Password is too long.",
      });
    }

    const tokenHash = hashToken(resetToken);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const now = new Date();

    // Atomically consume the reset token and update the password.
    const user = await User.findOneAndUpdate(
      {
        resetTokenHash: tokenHash,
        resetTokenExpires: { $gt: now },
        isActive: true,
      },
      {
        $set: {
          password: hashedPassword,
          resetTokenHash: null,
          resetTokenExpires: null,
          recoveryAttempts: 0,
          recoveryLockedUntil: null,
          passwordChangedAt: now,
        },
        $inc: {
          tokenVersion: 1,
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!user) {
      return res.status(400).json({
        message: "Recovery authorization is invalid or expired.",
      });
    }

    return res.status(200).json({
      message: "Password reset successfully. You may now log in.",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};

// ==========================================
// JWT TOKEN GENERATION
// ==========================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// ==========================================
// REGISTER
// ==========================================

export const register = async (req, res) => {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return res.status(403).json({
      message: "Registration is disabled. Please contact an administrator.",
    });
  }

  try {
    const { firstName, lastName, email, password, role } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const { password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    user.lastLogin = new Date();

    await user.save();

    return res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// MANAGER OVERRIDE
// ==========================================

export const managerOverride = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid manager credentials.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid manager credentials.",
      });
    }

    if (!["Admin", "Manager"].includes(user.role)) {
      return res.status(403).json({
        message: "User is not authorized to approve discounts.",
      });
    }

    return res.json({
      approved: true,
      approver: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// CHECK IF USERS EXIST
// ==========================================

export const hasUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();

    return res.json({
      hasUsers: count > 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
