
import { console } from "inspector";
import {
  createUser, getUserByEmail,
  updateUser, getAllUsers,
  getUserById, deleteUser,
  updatePassword, searchUsers,
  createUserByAdmin,
} from "../services/userService";

const registerUser = async (req: any, res: any) => {
  try {
    let { name, role, accountState, username, email, password } = req.body;
    if (!name)
      return res.status(200).json({ errorCode: 400, errorMessage: "Name is required", data: null });
    // if (!username || username.trim() === "")
    //   return res.status(200).json({ errorCode: 400, errorMessage: "Username is required", data: null });
    if (!email || email.trim() === "")
      return res.status(200).json({ errorCode: 400, errorMessage: "Email is required", data: null });
    email = email.trim().toLowerCase();
    if (!password || password.length < 6)
      return res.status(200).json({ errorCode: 400, errorMessage: "Password must be at least 6 characters", data: null });
    const user = await createUser(name, role, accountState, username, email, password);
    return res.status(200).json({
      errorCode: 200,
      errorMessage: "User registered successfully",
      data: user
    });

  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    }
    else {
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
    }
  }
}
const getUserByIdHandler = async (req: any, res: any) => {
  try {
    console.log("userId", req.params.id);
    if (!req.params.id) return res.status(200).json({
      errorCode: 400,
      errorMessage: "User ID is required",
      data: null
    })
    const user = await getUserById(req.params.id);
    if (!user) return res.status(200).json({
      errorCode: 404,
      errorMessage: "User not found",
      data: null
    });
    res.status(200).json({
      errorCode: 200,
      errorMessage: "Get user successfully",
      data: user
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    }
    else {
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
    }
  }
}

const getAllUsersHandler = async (req: any, res: any) => {
  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) return res.status(200).json({
      errorCode: 404,
      errorMessage: "No users found",
      data: null
    });
    return res.status(200).json({
      errorCode: 200,
      errorMessage: "Get all users successfully",
      data: users
    });

  }
  catch (error: any) {
    res.status(200).json({ error: error.message });
  }
}
const getUserByEmailHandler = async (req: any, res: any) => {
  try {
    let { email } = req.body;
    email.trim() === "" ? email = req.query.email : email = req.body.email;
    email = email.trim().toLowerCase();
    console.log("email", email);
    if (!email || email.trim() === "") return res.status(200).json({
      errorCode: 400,
      errorMessage: "Email is required",
      data: null
    });
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return res.status(200).json({
      errorCode: 400,
      errorMessage: "Email is invalid",
      data: null
    });
    const user = await getUserByEmail(email);
    if (!user) return res.status(200).json({
      errorCode: 404,
      errorMessage: "User not found",
      data: null
    });
    res.status(200).json({
      errorCode: 200,
      errorMessage: "Get user by email successfully",
      data: user
    })
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
}
const searchUsersHandler = async (req: any, res: any) => {
  try {
    const { name, email, username, role, accountState } = req.body;
    console.log("name", name);
    console.log("email", email);
    console.log("username", username);
    console.log("role", role);
    console.log("accountState", accountState);
    if (!name && !email && !username && !role && !accountState) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "At least one filter is required",
        data: null
      });
    }
    let query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (username) query.username = { $regex: username, $options: "i" };
    if (role !== undefined && !isNaN(role)) query.role = Number(role);
    if (accountState) query.accountState = accountState;
    const users = await searchUsers(query);

    if (!users || users.length === 0) {
      return res.status(200).json({
        errorCode: 404,
        errorMessage: "No users found",
        data: null
      });
    }
    return res.status(200).json({
      errorCode: 200,
      errorMessage: "Search users successfully",
      data: users
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    }
    else {
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
    }

  }
}
const updateUserHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log("userId", id);
    if (!id) return res.status(200).json({
      errorCode: 400,
      errorMessage: "User ID is required",
      data: null
    });
    const {updateData} = req.body;
    console.log("updateData", updateData);
    const user = await updateUser(id, updateData);

    res.status(200).json({
      errorCode: 200,
      errorMessage: "User updated successfully",
      data: user
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    } else
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
  }
}
const deleteUserHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);

    if (!user) return res.status(200).json({
      errorCode: 404,
      errorMessage: "User not found",
      data: null
    });
    res.status(200).json({
      errorCode: 200,
      errorMessage: "User deleted successfully",
      data: user
    })

  }
  catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    } else {
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
    }
  }
}

const updatePasswordHandler = async (req: any, res: any) => {
  try {
    const id = req.user._id;
    const { newPassword, oldPassword } = req.body;
    if (!id) return res.status(200).json({
      errorCode: 400,
      errorMessage: "User ID is required",
      data: null
    });
    if (!oldPassword)
    return res.status(200).json({
      errorCode: 400,
      errorMessage: "Old password is required",
      data: null,
    });

    if (!newPassword)
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "New password is required",
        data: null
      });
    if (newPassword.length < 6)
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "New password must be at least 6 characters",
        data: null
      });
    
    if (oldPassword === newPassword)
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "New password must be different from old password",
        data: null
      });
   
    const user = await updatePassword(id, newPassword, oldPassword);
    res.status(200).json({
      errorCode: 200,
      errorMessage: "Password updated successfully",
      data: user
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    } else
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
  }
}

const createUserByAdminHandler = async (req: any, res: any) => {
  try {
    const userToken = req.user;
    console.log("userToken", userToken);
    if (!userToken) return res.status(200).json({
      errorCode: 400,
      errorMessage: "Admin token is required",
      data: null
    });
    if (userToken.role !== 1) return res.status(200).json({
      errorCode: 403,
      errorMessage: "You are not authorized to create user",
      data: null
    });

    const { name, role, accountState, username, email, password, title, bio, description } = req.body;
    if (!name)
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "Name is required",
        data: null
      });
    if (!username || username.trim() === "")
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "Username is required",
        data: null
      });
    if (!email || email.trim() === "")
      return res.status(200).json({
        errorCode: 400,
        errorMessage: "Email is required",
        data: null
      });
    const newPass = password ||'123456'; // măc định là 123456
    const user = await createUserByAdmin(name, role, accountState, username, email, newPass, title, bio, description);
    return res.status(200).json({
      errorCode: 200,
      errorMessage: "User created successfully",
      data: user
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(200).json({
        errorCode: 400,
        errorMessage: error.message,
        data: null
      });
    }
    else {
      return res.status(200).json({
        errorCode: 500,
        errorMessage: "Internal server error",
        data: null
      });
    }
  }
}



export {
  registerUser,
  getUserByIdHandler,
  getAllUsersHandler,
  getUserByEmailHandler,
  searchUsersHandler,
  updateUserHandler,
  deleteUserHandler,
  updatePasswordHandler,
  createUserByAdminHandler
};

