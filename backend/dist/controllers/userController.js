"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.validateUser = exports.logout = exports.login = exports.register = exports.deleteUser = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environment = process.env;
const secret = environment.JWT_SECRET;
const tokenExpiration = environment.NODE_ENV === 'development' ? '1d' : '7d';
const tokenName = environment.SESSION_TOKEN_NAME;
const cookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
};
/*
 * @route   GET /users
 * @desc    Get all users
 * @access  Public
*/
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
});
exports.getUsers = getUsers;
/*
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Public
*/
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userExists = yield User_1.default.findById(id);
        if (!userExists) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        yield User_1.default.deleteOne({ _id: id });
        const users = yield User_1.default.find();
        res.status(200).json({ users, message: 'User deleted successfully' });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
});
exports.deleteUser = deleteUser;
/*
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (user) {
            res.status(400).json({ message: 'User with username already exists' });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(12);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = yield User_1.default.create({
            name,
            username,
            password: hashedPassword,
        });
        const token = generateToken(newUser._id.toString());
        res.status(200)
            .cookie(tokenName, token, cookieOptions)
            .json({ user: newUser, token });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
});
exports.register = register;
/*
 * @route   POST /users/signin
 * @desc    Login a user
 * @access  Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'User does not exist' });
            return;
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        ;
        const token = generateToken(user._id.toString());
        res
            .status(200)
            .cookie(tokenName, token, cookieOptions)
            .json({ user, token });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
});
exports.login = login;
/*
 * @route   POST /users/signout
  * @desc    Logout a user
  * @access  Public
  */
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie(tokenName, cookieOptions).send({ message: 'Logged out successfully' });
});
exports.logout = logout;
/*
  * @route   POST /users/validate
  * @desc    Validate a user
  * @access  Public
*/
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.user);
    if (!user) {
        res.status(401).json({ message: 'Unauthorized, User does not exist' });
        return;
    }
    res.status(200).json({
        user
    });
});
exports.validateUser = validateUser;
/*
 * @route   PUT /users/:id
 * @desc    Update a user
 * @access  Public
  */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, username } = req.body;
    try {
        const userExists = yield User_1.default.findById(id);
        const userNameExists = yield User_1.default.findOne({ username });
        if (!userExists) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (userNameExists && userNameExists.username !== userExists.username) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }
        if (req.user !== userExists._id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (name)
            userExists.name = name;
        if (username)
            userExists.username = username;
        const updatedUser = yield userExists.save();
        res.status(200).json({ user: updatedUser });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Something went wrong... Please try again' });
    }
});
exports.updateUser = updateUser;
/*
 * @desc    Genrate a token based on user id
 */
const generateToken = (id) => {
    const user = { id };
    const token = jsonwebtoken_1.default.sign(user, secret, {
        expiresIn: tokenExpiration,
    });
    return token;
};
