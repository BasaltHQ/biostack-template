import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
    },
    {
        timestamps: true,
        collection: "admins",
    }
);

// Hash password before saving
AdminSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Strip password from JSON output
AdminSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
