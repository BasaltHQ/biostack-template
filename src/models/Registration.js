import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    country: { type: String, default: "" },
};

const RegistrationSchema = new mongoose.Schema(
    {
        // Identity
        firstName: {
            type: String,
            required: [true, "First name is required"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
        },
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

        // Contact
        officePhone: { type: String, default: "" },
        website: { type: String, default: "" },

        // Addresses
        billingAddress: AddressSchema,
        shippingAddress: AddressSchema,

        // Business context
        industry: { type: String, default: "" },
        description: { type: String, default: "" },

        // Workflow
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },

        // CRM sync
        crmAccountId: { type: String, default: null },
        crmContactId: { type: String, default: null },

        // Audit
        reviewedAt: { type: Date, default: null },
        reviewedBy: { type: String, default: null },
    },
    {
        timestamps: true,
        collection: "registrations",
    }
);

// Hash password before saving
RegistrationSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Strip password from JSON output
RegistrationSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);
