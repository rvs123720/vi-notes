import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  keystrokes: number;
  pastes: number;
  createdAt: Date; 
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    keystrokes: { 
      type: Number, 
      default: 0 
    },
    pastes: { 
      type: Number, 
      default: 0 
    },
  },
  { 
    
    timestamps: true 
  }
);


export default mongoose.model<INote>("Note", NoteSchema);